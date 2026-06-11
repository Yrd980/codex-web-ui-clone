import { useEffect, useRef, useState } from "react";
import { chatMessages } from "../data/scenarios/threadScenario";
import { environmentItems, progressItems, subagents } from "../data/scenarios/toolScenario";
import { getChatWorkspaceGeometry } from "../layout/codexShellGeometry";
import type { ActiveView } from "../types";
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
  const workspaceRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef(false);
  const [workspaceWidth, setWorkspaceWidth] = useState(0);
  const [workspaceHeight, setWorkspaceHeight] = useState(0);
  const [environmentOpen, setEnvironmentOpen] = useState(true);
  const running = activeView === "running";
  const hasToolOverlay = isToolSurfaceView(activeView);
  const geometry = getChatWorkspaceGeometry({
    width: workspaceWidth,
    height: workspaceHeight,
    environmentOpen,
    hasToolOverlay,
  });

  useEffect(() => {
    const updateWorkspaceSize = () => {
      const bounds = workspaceRef.current?.getBoundingClientRect();
      const width = bounds?.width;
      if (!width) return;
      setWorkspaceWidth(width);
      setWorkspaceHeight(bounds.height);
    };

    updateWorkspaceSize();
    const observer = new ResizeObserver(updateWorkspaceSize);
    if (workspaceRef.current) observer.observe(workspaceRef.current);
    window.addEventListener("resize", updateWorkspaceSize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWorkspaceSize);
    };
  }, []);

  return (
    <section className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <header className="flex h-[58px] shrink-0 items-center justify-between border-b border-[var(--codex-border-soft)] px-4">
        <div className="flex min-w-0 items-center gap-2">
          <button className="grid size-8 place-items-center rounded-[9px] text-[var(--codex-text-muted)] hover:bg-[var(--codex-hover)]" type="button" aria-label="New chat">
            <CodexIcon name="newChat" className="size-[17px]" />
          </button>
          <div className="min-w-0">
            <div className="truncate text-[14px] font-medium">页面的设计</div>
          </div>
          <button className="grid size-7 place-items-center rounded-[8px] text-[var(--codex-text-muted)] hover:bg-[var(--codex-hover)]" type="button" aria-label="Thread options" onClick={onOpenCommandMenu}>
            <CodexIcon name="more" className="size-[16px]" />
          </button>
        </div>
        <div className="flex items-center gap-1 text-[var(--codex-text-muted)]">
          <button
            className="flex h-9 items-center gap-1.5 rounded-[12px] border border-[var(--codex-border-soft)] bg-[color-mix(in_oklab,var(--codex-surface-raised)_65%,transparent)] px-2.5 shadow-[0_6px_18px_rgb(76_79_105_/_0.05)] hover:bg-[var(--codex-hover)]"
            type="button"
            aria-label="Open terminal"
            onClick={() => onSetView(activeView === "terminal" ? "chat" : "terminal")}
          >
            <CodexIcon name="terminal" className="size-[18px] text-[var(--codex-text)]" />
            <CodexIcon name="chevronDown" className="size-[14px]" />
          </button>
          <button
            className={[
              "grid size-9 place-items-center rounded-[11px] hover:bg-[var(--codex-hover)]",
              environmentOpen && !hasToolOverlay ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "",
            ].join(" ")}
            type="button"
            aria-label="Toggle environment panel"
            onClick={() => {
              if (hasToolOverlay) onSetView("chat");
              setEnvironmentOpen((open) => !open);
            }}
          >
            <CodexIcon name="layout" className="size-[19px]" />
          </button>
          <button
            className="grid size-9 place-items-center rounded-[11px] hover:bg-[var(--codex-hover)]"
            type="button"
            aria-label="Minimize tool panel"
            onClick={() => {
              onSetView("chat");
              setEnvironmentOpen(false);
            }}
          >
            <CodexIcon name="minimize" className="size-[18px]" />
          </button>
          <button
            className={[
              "grid size-9 place-items-center rounded-[11px] hover:bg-[var(--codex-hover)]",
              hasToolOverlay ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "",
            ].join(" ")}
            type="button"
            aria-label="Toggle side panel"
            onClick={() => onSetView(hasToolOverlay ? "chat" : "files")}
          >
            <CodexIcon name="panel" className="size-[18px]" />
          </button>
        </div>
      </header>
      <div ref={workspaceRef} className="relative flex min-h-0 flex-1 overflow-hidden">
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
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
        </div>
        <ToolSurface activeView={activeView} workspaceRef={workspaceRef} workspaceWidth={workspaceWidth} workspaceHeight={workspaceHeight} resizingRef={resizingRef} onSetView={onSetView} />
        {!hasToolOverlay && environmentOpen && geometry.canReserveEnvironment ? (
          <EnvironmentCard items={environmentItems} progress={progressItems} subagents={subagents} running={running} panelWidth={geometry.environmentPanelWidth} rightInset={geometry.environmentRightInset} topInset={geometry.environmentTopInset} />
        ) : null}
      </div>
    </section>
  );
}
