import { useEffect, useRef, useState } from "react";
import { chatMessages } from "../data/scenarios/threadScenario";
import { environmentItems, progressItems, subagents } from "../data/scenarios/toolScenario";
import { getChatWorkspaceGeometry } from "../layout/codexShellGeometry";
import type { ActiveView, IconName } from "../types";
import { ChatStream } from "./ChatStream";
import { Composer } from "./Composer";
import { CodexIcon } from "./CodexIcon";
import { EnvironmentCard } from "./EnvironmentCard";
import { isToolSurfaceView, ToolSurface } from "./ToolSurface";

interface ChatWorkspaceProps {
  activeView: ActiveView;
  onOpenCommandMenu: () => void;
  onSetView: (view: ActiveView) => void;
}

export function ChatWorkspace({ activeView, onOpenCommandMenu, onSetView }: ChatWorkspaceProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef(false);
  const [shellWidth, setShellWidth] = useState(0);
  const [shellHeight, setShellHeight] = useState(0);
  const [workspaceWidth, setWorkspaceWidth] = useState(0);
  const [workspaceHeight, setWorkspaceHeight] = useState(0);
  const [environmentOpen, setEnvironmentOpen] = useState(true);
  const [openWithMenuOpen, setOpenWithMenuOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const running = activeView === "running";
  const hasToolOverlay = isToolSurfaceView(activeView);
  const geometry = getChatWorkspaceGeometry({
    width: workspaceWidth,
    height: workspaceHeight,
    environmentOpen,
    hasToolOverlay,
  });

  useEffect(() => {
    const updateSizes = () => {
      const shellBounds = shellRef.current?.getBoundingClientRect();
      if (shellBounds?.width) {
        setShellWidth(shellBounds.width);
        setShellHeight(shellBounds.height);
      }

      const bounds = workspaceRef.current?.getBoundingClientRect();
      const width = bounds?.width;
      if (!width) return;
      setWorkspaceWidth(width);
      setWorkspaceHeight(bounds.height);
    };

    updateSizes();
    const observer = new ResizeObserver(updateSizes);
    if (shellRef.current) observer.observe(shellRef.current);
    if (workspaceRef.current) observer.observe(workspaceRef.current);
    window.addEventListener("resize", updateSizes);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSizes);
    };
  }, []);

  return (
    <section ref={shellRef} className="relative flex h-full min-h-0 overflow-hidden">
      <div ref={workspaceRef} className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="codex-workspace-bar flex shrink-0 items-center justify-between border-b px-4">
          <div className="flex min-w-0 items-center gap-2">
            <button className="codex-icon-button !size-[var(--codex-control-sm)]" type="button" aria-label="New chat">
              <CodexIcon name="newChat" className="size-[1.0625rem]" />
            </button>
            <div className="min-w-0">
              <div className="truncate text-[0.875rem] font-medium">页面的设计</div>
            </div>
            <button className="codex-icon-button !size-[var(--codex-control-xs)]" type="button" aria-label="Thread options" onClick={onOpenCommandMenu}>
              <CodexIcon name="more" className="size-[1rem]" />
            </button>
          </div>
          <div className="relative flex items-center gap-1 text-[var(--codex-text-muted)]">
            {hasToolOverlay ? (
              <>
                <button
                  className="codex-command-button"
                  type="button"
                  aria-label="Open with"
                  onClick={() => {
                    setOpenWithMenuOpen((open) => !open);
                    setSummaryOpen(false);
                  }}
                >
                  <CodexIcon name="openWith" className="codex-icon-md text-[var(--codex-text)]" />
                  <CodexIcon name="chevronDown" className="codex-icon-sm" />
                </button>
                <button
                  className="codex-icon-button"
                  data-active={summaryOpen}
                  type="button"
                  aria-label="Toggle summary"
                  onClick={() => {
                    setSummaryOpen((open) => !open);
                    setOpenWithMenuOpen(false);
                  }}
                >
                  <CodexIcon name="summary" className="codex-icon-lg" />
                </button>
                {openWithMenuOpen ? (
                  <div className="codex-popover absolute right-10 top-[calc(100%+0.5rem)] w-[var(--codex-menu-width-sm)] p-2 text-[0.875rem] text-[var(--codex-text)]">
                    {([
                      ["Visual Studio", "app"],
                      ["Zed", "openWith"],
                      ["File Explorer", "folder"],
                      ["Terminal", "terminal"],
                      ["Git Bash", "openWith"],
                      ["WSL", "browser"],
                      ["Android Studio", "app"],
                    ] as Array<[string, IconName]>).map(([label, icon]) => (
                      <button key={label} className="codex-row-button codex-row-md gap-2" type="button">
                        <CodexIcon name={icon} className="codex-icon-md text-[var(--codex-text-muted)]" />
                        <span className="truncate">{label}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
                {summaryOpen ? (
                  <div className="codex-popover absolute right-0 top-[calc(100%+0.6875rem)] w-[var(--codex-menu-width-md)] p-5 text-[0.875rem] text-[var(--codex-text)]">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-[var(--codex-text-faint)]">Environment</span>
                      <CodexIcon name="settings" className="size-[1.125rem] text-[var(--codex-text-faint)]" />
                    </div>
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-3">
                        <CodexIcon name="diff" className="size-[1.125rem]" />
                        <span className="flex-1">Changes</span>
                        <span className="text-[var(--codex-diff-added)]">+753</span>
                        <span className="text-[var(--codex-diff-removed)]">-170</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CodexIcon name="tray" className="size-[1.125rem]" />
                        <span>Local</span>
                        <CodexIcon name="chevronDown" className="size-[0.875rem]" />
                      </div>
                      <div className="flex items-center gap-3">
                        <CodexIcon name="branch" className="size-[1.125rem]" />
                        <span>main</span>
                        <CodexIcon name="chevronDown" className="size-[0.875rem]" />
                      </div>
                      <div className="flex items-center gap-3">
                        <CodexIcon name="history" className="size-[1.125rem]" />
                        <span>Commit or push</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CodexIcon name="browser" className="size-[1.125rem]" />
                        <span>Create pull request</span>
                      </div>
                    </div>
                    <div className="mt-5 border-t border-[var(--codex-border-soft)] pt-4">
                      <div className="mb-3 text-[var(--codex-text-faint)]">Sources</div>
                      <div className="text-[var(--codex-text-faint)]">No sources yet</div>
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <>
              <button
                className="codex-command-button"
                type="button"
                aria-label="Open terminal"
                onClick={() => onSetView("terminal")}
              >
                <CodexIcon name="terminal" className="codex-icon-md text-[var(--codex-text)]" />
                <CodexIcon name="chevronDown" className="codex-icon-sm" />
              </button>
              <button
                className="codex-icon-button"
                data-active={environmentOpen}
                type="button"
                aria-label="Toggle environment panel"
                onClick={() => setEnvironmentOpen((open) => !open)}
              >
                <CodexIcon name="layout" className="codex-icon-lg" />
              </button>
              <button
                className="codex-icon-button"
                type="button"
                aria-label="Minimize tool panel"
                onClick={() => {
                  onSetView("chat");
                  setEnvironmentOpen(false);
                }}
              >
                <CodexIcon name="minimize" className="codex-icon-md" />
              </button>
              <button className="codex-icon-button" type="button" aria-label="Toggle side panel" onClick={() => onSetView("files")}>
                <CodexIcon name="panel" className="codex-icon-md" />
              </button>
              </>
            )}
          </div>
        </header>
        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-gutter:stable_both-edges]" style={{ ...geometry.chatTrackStyle, marginRight: geometry.environmentReservedWidth }}>
            <ChatStream messages={chatMessages} running={running} />
          </div>
          <Composer
            running={running}
            inlineStartOffset={0}
            inlineEndOffset={geometry.environmentReservedWidth}
            trackWidth={geometry.composerTrackWidth}
            trackOffset={geometry.composerTrackOffset}
            bottomPadding={geometry.composerBottomPad}
            topFade={geometry.composerTopFade}
            inlinePadding={geometry.composerInlinePad}
            surfacePaddingY={geometry.composerSurfacePadY}
            textareaHeight={geometry.composerTextareaHeight}
            onToggleRunning={() => onSetView(running ? "chat" : "running")}
            onOpenTools={() => {
              setEnvironmentOpen(false);
              onSetView("tool-switcher");
            }}
          />
          {!hasToolOverlay && environmentOpen && geometry.canReserveEnvironment ? (
            <EnvironmentCard items={environmentItems} progress={progressItems} subagents={subagents} running={running} style={geometry.environmentStyle} />
          ) : null}
        </div>
      </div>
      <ToolSurface
        activeView={activeView}
        workspaceRef={shellRef}
        workspaceWidth={shellWidth}
        workspaceHeight={shellHeight}
        resizingRef={resizingRef}
        environmentOpen={environmentOpen}
        onSetView={onSetView}
        onToggleEnvironment={() => setEnvironmentOpen((open) => !open)}
        onMinimizeTools={() => {
          onSetView("chat");
          setEnvironmentOpen(false);
        }}
      />
    </section>
  );
}
