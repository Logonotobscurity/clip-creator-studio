import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type {
  BrandPreset,
  Clip,
  EditorState,
  Transcript,
  VideoAsset,
} from "../types";
import { createLocalValue } from "../lib/storage";
import { analyticsService, brandPresetService, historyService } from "../services";

/**
 * Workspace state.
 *
 * Holds only IDs, metadata, transcripts and editor settings. Video binaries are
 * never placed in React state — the services own asset references.
 */
export interface WorkspaceState {
  video: VideoAsset | null;
  transcript: Transcript | null;
  clips: Clip[];
  selectedClipId: string | null;
  editors: Record<string, EditorState>;
  presets: BrandPreset[];
}

interface WorkspaceContextValue extends WorkspaceState {
  setSession(input: { video: VideoAsset; transcript: Transcript; clips: Clip[] }): void;
  selectClip(clipId: string | null): void;
  editorFor(clip: Clip): EditorState;
  updateEditor(clipId: string, patch: Partial<EditorState>): void;
  reloadPresets(): Promise<void>;
  clearSession(): void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

const sessionStore = createLocalValue<{
  video: VideoAsset;
  transcript: Transcript;
  clips: Clip[];
}>("session");
const editorStore = createLocalValue<Record<string, EditorState>>("editors");

export function defaultEditorState(clip: Clip): EditorState {
  return {
    clipId: clip.id,
    sourceMode: "whole",
    startTime: clip.startTime,
    endTime: clip.endTime,
    aspectRatio: "9:16",
    zoom: 1.15,
    offsetX: 0,
    offsetY: 0,
    faceTracking: true,
    subtitlesEnabled: true,
    subtitleStyle: "bold-pop",
    subtitlePosition: "bottom",
    subtitleSize: 32,
    quality: "1080p",
  };
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorkspaceState>({
    video: null,
    transcript: null,
    clips: [],
    selectedClipId: null,
    editors: {},
    presets: [],
  });

  useEffect(() => {
    const session = sessionStore.get();
    const editors = editorStore.get() ?? {};
    setState((prev) => ({
      ...prev,
      ...(session
        ? { video: session.video, transcript: session.transcript, clips: session.clips }
        : {}),
      editors,
    }));
    void brandPresetService.list().then((presets) => setState((prev) => ({ ...prev, presets })));
  }, []);

  const setSession = useCallback<WorkspaceContextValue["setSession"]>((input) => {
    sessionStore.set(input);
    setState((prev) => ({
      ...prev,
      video: input.video,
      transcript: input.transcript,
      clips: input.clips,
      selectedClipId: input.clips[0]?.id ?? null,
    }));
    analyticsService.trackClipLengths(input.clips.map((c) => Math.round(c.endTime - c.startTime)));
    void historyService.record({
      project: "Clip maker",
      video: input.video.title,
      action: "Generated",
    });
  }, []);

  const selectClip = useCallback((clipId: string | null) => {
    setState((prev) => ({ ...prev, selectedClipId: clipId }));
  }, []);

  const editorFor = useCallback<WorkspaceContextValue["editorFor"]>(
    (clip) => state.editors[clip.id] ?? defaultEditorState(clip),
    [state.editors],
  );

  const updateEditor = useCallback<WorkspaceContextValue["updateEditor"]>((clipId, patch) => {
    setState((prev) => {
      const clip = prev.clips.find((item) => item.id === clipId);
      const base = prev.editors[clipId] ?? (clip ? defaultEditorState(clip) : null);
      if (!base) return prev;
      const editors = { ...prev.editors, [clipId]: { ...base, ...patch } };
      editorStore.set(editors);
      return { ...prev, editors };
    });
  }, []);

  const reloadPresets = useCallback(async () => {
    const presets = await brandPresetService.list();
    setState((prev) => ({ ...prev, presets }));
  }, []);

  const clearSession = useCallback(() => {
    sessionStore.clear();
    setState((prev) => ({ ...prev, video: null, transcript: null, clips: [], selectedClipId: null }));
  }, []);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      ...state,
      setSession,
      selectClip,
      editorFor,
      updateEditor,
      reloadPresets,
      clearSession,
    }),
    [state, setSession, selectClip, editorFor, updateEditor, reloadPresets, clearSession],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error("useWorkspace must be used inside <WorkspaceProvider>");
  return context;
}
