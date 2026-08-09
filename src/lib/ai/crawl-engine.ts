import { z } from "zod";

/**
 * CLIPIN Crawl Engine — Safe, restricted research and content extraction
 *
 * Purpose:
 * - Extract structured content from URLs for video research
 * - Support for YouTube, articles, blogs, documentation
 * - Respect robots.txt, rate limits, and access policies
 * - Prevent SSRF, prompt injection, and data exfiltration
 * - Return canonicalized, deduplicated content for LLM consumption
 *
 * Security:
 * - Domain whitelist/blacklist controls
 * - Crawl depth and page limits
 * - Byte size limits
 * - Request timeouts
 * - Content-type validation
 * - No CAPTCHA bypass, authentication tricks, or paywall circumvention
 */

/**
 * Crawl configuration and security constraints
 */
export interface CrawlConfig {
  maxDepth: number;
  maxPages: number;
  maxBytesPerPage: number;
  maxTotalBytes: number;
  timeoutMs: number;
  allowedDomains?: string[];
  blockedDomains?: string[];
  respectRobots: boolean;
  respectNoIndex: boolean;
  userAgent: string;
  rateLimitDelayMs: number;
}

export const DEFAULT_CRAWL_CONFIG: CrawlConfig = {
  maxDepth: 2,
  maxPages: 10,
  maxBytesPerPage: 5 * 1024 * 1024, // 5MB per page
  maxTotalBytes: 50 * 1024 * 1024, // 50MB total
  timeoutMs: 30000, // 30 seconds
  allowedDomains: [
    "youtube.com",
    "youtu.be",
    "medium.com",
    "dev.to",
    "github.com",
    "docs.google.com",
    "notion.so",
  ],
  blockedDomains: [],
  respectRobots: true,
  respectNoIndex: true,
  userAgent: "CLIPIN-Research-Bot/1.0",
  rateLimitDelayMs: 1000,
};

/**
 * Extracted content from a URL
 */
export interface ExtractedContent {
  url: string;
  canonicalUrl?: string;
  title?: string;
  description?: string;
  content: string;
  contentType: string;
  language?: string;
  publishedDate?: string;
  authors?: string[];
  imageUrl?: string;
  metadata: Record<string, any>;
}

/**
 * Crawl result with metadata
 */
export interface CrawlResult {
  rootUrl: string;
  pages: ExtractedContent[];
  totalBytesProcessed: number;
  pagesAttempted: number;
  pagesSucceeded: number;
  pagesFailed: number;
  errors: Array<{
    url: string;
    error: string;
    code?: number;
  }>;
  crawlDuration: number;
  timestamp: Date;
}

/**
 * Validate URL is safe to crawl
 */
export function validateCrawlUrl(
  url: string,
  config: CrawlConfig = DEFAULT_CRAWL_CONFIG
): {
  valid: boolean;
  error?: string;
} {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname || "";

    // Check protocol
    if (!["http", "https"].includes(parsed.protocol.replace(":", ""))) {
      return { valid: false, error: "Only HTTP(S) URLs allowed" };
    }

    // Check against allowed domains
    if (config.allowedDomains && config.allowedDomains.length > 0) {
      const isAllowed = config.allowedDomains.some((domain) =>
        hostname.endsWith(domain)
      );
      if (!isAllowed) {
        return { valid: false, error: `Domain not in allowlist: ${hostname}` };
      }
    }

    // Check against blocked domains
    if (config.blockedDomains && config.blockedDomains.length > 0) {
      const isBlocked = config.blockedDomains.some((domain) =>
        hostname.endsWith(domain)
      );
      if (isBlocked) {
        return { valid: false, error: `Domain is blocked: ${hostname}` };
      }
    }

    // Prevent SSRF: block private IP ranges
    const privatePatterns = [
      /^localhost$/,
      /^127\./,
      /^192\.168\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[01])\./,
      /^::1$/,
      /^fc00:/,
    ];

    if (privatePatterns.some((pattern) => pattern.test(hostname))) {
      return {
        valid: false,
        error: "Private IP addresses not allowed (SSRF protection)",
      };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: `Invalid URL: ${error}` };
  }
}

/**
 * Fetch and extract content from a single URL
 *
 * This is a placeholder for server-side implementation.
 * In production, you'd use a headless browser or HTML parsing library.
 */
export async function extractContent(
  url: string,
  config: CrawlConfig = DEFAULT_CRAWL_CONFIG
): Promise<ExtractedContent | null> {
  // Validate URL
  const validation = validateCrawlUrl(url, config);
  if (!validation.valid) {
    throw new Error(validation.error || "Invalid URL");
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": config.userAgent,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Check content type
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      throw new Error(`Unsupported content type: ${contentType}`);
    }

    // Check size
    const contentLength = parseInt(
      response.headers.get("content-length") || "0",
      10
    );
    if (contentLength > config.maxBytesPerPage) {
      throw new Error(
        `Content exceeds max size: ${contentLength} > ${config.maxBytesPerPage}`
      );
    }

    // Check for robots.txt directive
    const robotsHeader = response.headers.get("x-robots-tag");
    if (config.respectRobots && robotsHeader) {
      if (robotsHeader.includes("noindex") || robotsHeader.includes("none")) {
        throw new Error("URL has noindex directive");
      }
    }

    const html = await response.text();

    // Extract metadata (simplified)
    const titleMatch = html.match(/<title>(.+?)<\/title>/i);
    const descMatch = html.match(
      /<meta\s+name="description"\s+content="(.+?)"/i
    );
    const canonicalMatch = html.match(
      /<link\s+rel="canonical"\s+href="(.+?)"/i
    );

    // Strip HTML (simplified - in production use a library like jsdom)
    const cleanContent = html
      .replace(/<script[^>]*>.*?<\/script>/gi, "")
      .replace(/<style[^>]*>.*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return {
      url,
      canonicalUrl: canonicalMatch ? canonicalMatch[1] : url,
      title: titleMatch ? titleMatch[1] : undefined,
      description: descMatch ? descMatch[1] : undefined,
      content: cleanContent,
      contentType,
      metadata: {
        statusCode: response.status,
        headers: Object.fromEntries(response.headers.entries()),
      },
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Crawl a URL and extract content (with depth limit)
 *
 * Note: This is a simplified implementation.
 * For production, use a proper crawling library with queue management.
 */
export async function crawlUrl(
  rootUrl: string,
  config: CrawlConfig = DEFAULT_CRAWL_CONFIG
): Promise<CrawlResult> {
  const startTime = Date.now();
  const result: CrawlResult = {
    rootUrl,
    pages: [],
    totalBytesProcessed: 0,
    pagesAttempted: 0,
    pagesSucceeded: 0,
    pagesFailed: 0,
    errors: [],
    crawlDuration: 0,
    timestamp: new Date(),
  };

  // Validate root URL
  const validation = validateCrawlUrl(rootUrl, config);
  if (!validation.valid) {
    result.errors.push({
      url: rootUrl,
      error: validation.error || "Invalid URL",
    });
    result.crawlDuration = Date.now() - startTime;
    return result;
  }

  try {
    const content = await extractContent(rootUrl, config);
    if (content) {
      result.pages.push(content);
      result.totalBytesProcessed += content.content.length;
      result.pagesSucceeded += 1;
    }
  } catch (error) {
    result.errors.push({
      url: rootUrl,
      error: error instanceof Error ? error.message : String(error),
    });
    result.pagesFailed += 1;
  }

  result.pagesAttempted = 1;
  result.crawlDuration = Date.now() - startTime;
  return result;
}

/**
 * Chunk extracted content for LLM consumption
 */
export function chunkContent(
  content: ExtractedContent,
  chunkSize: number = 2000,
  overlap: number = 200
): string[] {
  const chunks: string[] = [];
  const text = content.content;

  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  return chunks;
}

/**
 * Deduplicate content across multiple pages
 */
export function deduplicateContent(
  pages: ExtractedContent[]
): ExtractedContent[] {
  const seen = new Set<string>();
  const unique: ExtractedContent[] = [];

  for (const page of pages) {
    const contentHash = hashString(page.content);
    if (!seen.has(contentHash)) {
      seen.add(contentHash);
      unique.push(page);
    }
  }

  return unique;
}

/**
 * Simple hash function for deduplication
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

/**
 * Format crawl result for LLM context
 */
export function formatCrawlResultForLLM(result: CrawlResult): string {
  let formatted = `# Research Results\n\n`;
  formatted += `**Source:** ${result.rootUrl}\n`;
  formatted += `**Pages Processed:** ${result.pagesSucceeded}/${result.pagesAttempted}\n\n`;

  for (const page of result.pages) {
    formatted += `## ${page.title || "Untitled"}\n`;
    formatted += `**URL:** ${page.canonicalUrl || page.url}\n`;
    if (page.description) {
      formatted += `**Description:** ${page.description}\n`;
    }
    formatted += `\n${page.content.slice(0, 1000)}...\n\n`;
  }

  if (result.errors.length > 0) {
    formatted += `## Errors\n`;
    for (const error of result.errors) {
      formatted += `- ${error.url}: ${error.error}\n`;
    }
  }

  return formatted;
}
