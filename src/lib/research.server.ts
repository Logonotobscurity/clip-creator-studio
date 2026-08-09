/**
 * Server-only research/crawl layer.
 *
 * Pipeline: URL validation -> policy check -> safe fetch -> extraction ->
 * canonicalisation -> truncation. Output is treated as untrusted DATA by the
 * prompt registry (see the guard contract in ai-prompts.server.ts).
 *
 * It does not attempt to bypass authentication, paywalls, CAPTCHAs or robots
 * restrictions.
 */

const MAX_BYTES = 600_000;
const MAX_CHARS = 12_000;
const TIMEOUT_MS = 8_000;

const BLOCKED_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1", "metadata.google.internal"]);

const PRIVATE_HOST = /^(10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?$|fd|fe80:)/i;

export interface CrawlResult {
  url: string;
  title?: string;
  text: string;
  truncated: boolean;
}

/** SSRF-safe URL policy check. */
export function isCrawlable(raw: string): boolean {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return false;
  const host = url.hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(host)) return false;
  if (PRIVATE_HOST.test(host)) return false;
  if (!host.includes(".")) return false;
  return true;
}

function extractText(html: string): { title?: string; text: string } {
  const titleMatch = /<title[^>]*>([\s\S]{0,300}?)<\/title>/i.exec(html);
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<\/(p|div|section|article|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t\u00a0]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const title = titleMatch?.[1]?.replace(/\s+/g, " ").trim();
  return title ? { title, text: body } : { text: body };
}

/** Fetch and extract readable page context. Returns null on any failure. */
export async function crawlForContext(raw: string): Promise<CrawlResult | null> {
  if (!isCrawlable(raw)) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(raw, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "CLIPIN-ResearchBot/1.0 (+creator research; respects robots)",
        accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) return null;
    const type = response.headers.get("content-type") ?? "";
    if (!type.includes("text/html") && !type.includes("text/plain")) return null;

    const length = Number(response.headers.get("content-length") ?? "0");
    if (length && length > MAX_BYTES) return null;

    const raw_html = (await response.text()).slice(0, MAX_BYTES);
    const { title, text } = extractText(raw_html);
    if (text.length < 120) return null;

    return {
      url: response.url || raw,
      ...(title ? { title } : {}),
      text: text.slice(0, MAX_CHARS),
      truncated: text.length > MAX_CHARS,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function formatCrawlContext(result: CrawlResult): string {
  return [
    `Source: ${result.url}`,
    result.title ? `Page title: ${result.title}` : undefined,
    "",
    result.text,
    result.truncated ? "\n[context truncated]" : undefined,
  ]
    .filter(Boolean)
    .join("\n");
}
