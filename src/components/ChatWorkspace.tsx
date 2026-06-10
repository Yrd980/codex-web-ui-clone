import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { chatMessages, environmentItems, progressItems, subagents } from "../data/mockData";
import type { ActiveView } from "../types";
import { ChatStream } from "./ChatStream";
import { Composer } from "./Composer";
import { CodexIcon } from "./CodexIcon";
import { EnvironmentCard } from "./EnvironmentCard";
import { FileWorkspace } from "./FileWorkspace";
import { ReviewWorkspace } from "./ReviewWorkspace";
import { ToolSwitcher } from "./ToolSwitcher";

interface ChatWorkspaceProps {
  activeView: ActiveView;
  onSetView: (view: ActiveView) => void;
}

const MIN_TOOL_PANEL_WIDTH = 420;
const MAX_TOOL_PANEL_WIDTH = 920;
const MIN_CHAT_WIDTH = 440;

function clampToolPanelWidth(width: number, containerWidth: number) {
  const maxWidth = Math.max(MIN_TOOL_PANEL_WIDTH, Math.min(MAX_TOOL_PANEL_WIDTH, containerWidth - MIN_CHAT_WIDTH));
  return Math.min(Math.max(width, MIN_TOOL_PANEL_WIDTH), maxWidth);
}

export function ChatWorkspace({ activeView, onSetView }: ChatWorkspaceProps) {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef(false);
  const [toolPanelWidth, setToolPanelWidth] = useState(680);
  const running = activeView === "running";
  const hasToolOverlay = ["tool-switcher", "review", "files", "terminal", "browser"].includes(activeView);

  const toolPanelStyle = { "--tool-panel-width": `${toolPanelWidth}px` } as CSSProperties;

  const startPanelResize = useCallback((event: ReactMouseEvent<HTMLButtonElement> | ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || resizingRef.current) return;
    if (!workspaceRef.current) return;

    event.preventDefault();
    resizingRef.current = true;
    const workspace = workspaceRef.current;
    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handleMove = (moveEvent: MouseEvent | PointerEvent) => {
      const bounds = workspace.getBoundingClientRect();
      setToolPanelWidth(clampToolPanelWidth(bounds.right - moveEvent.clientX, bounds.width));
    };

    const handleUp = () => {
      resizingRef.current = false;
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  }, []);

  useEffect(() => {
    const handleWindowResize = () => {
      const width = workspaceRef.current?.getBoundingClientRect().width;
      if (!width) return;
      setToolPanelWidth((current) => clampToolPanelWidth(current, width));
    };

    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const resizeHandle = (
    <button
      className="absolute inset-y-0 left-0 z-30 hidden w-4 -translate-x-2 cursor-col-resize touch-none rounded-full outline-none hover:bg-[color-mix(in_oklab,var(--codex-accent)_12%,transparent)] focus-visible:bg-[color-mix(in_oklab,var(--codex-accent)_16%,transparent)] xl:block"
      type="button"
      aria-label="Resize tool panel"
      onPointerDown={startPanelResize}
      onMouseDown={startPanelResize}
    />
  );

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
          <button className="grid size-7 place-items-center rounded-[8px] text-[var(--codex-text-muted)] hover:bg-[var(--codex-hover)]" type="button" aria-label="Thread options">
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
              activeView === "tool-switcher" ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "",
            ].join(" ")}
            type="button"
            aria-label="Choose tool"
            onClick={() => onSetView(activeView === "tool-switcher" ? "chat" : "tool-switcher")}
          >
            <CodexIcon name="layout" className="size-[19px]" />
          </button>
          <button className="grid size-9 place-items-center rounded-[11px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Minimize tool panel">
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
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <ChatStream messages={chatMessages} running={running} />
          </div>
          <Composer running={running} onToggleRunning={() => onSetView(running ? "chat" : "running")} onOpenTools={() => onSetView("tool-switcher")} />
        </div>
        {activeView === "tool-switcher" ? (
          <div
            className="absolute bottom-[118px] right-5 z-20 h-[min(520px,calc(100%-150px))] w-[min(var(--tool-panel-width),calc(100%-40px))] overflow-hidden rounded-[18px] border border-[var(--codex-border-soft)] bg-[color-mix(in_oklab,var(--codex-main)_94%,transparent)] shadow-[var(--codex-shadow-soft)] xl:relative xl:inset-auto xl:h-auto xl:w-[var(--tool-panel-width)] xl:min-w-0 xl:flex-none xl:rounded-none xl:border-y-0 xl:border-r-0 xl:shadow-none"
            style={toolPanelStyle}
          >
            {resizeHandle}
            <ToolSwitcher onSetView={onSetView} />
          </div>
        ) : activeView === "review" ? (
          <div
            className="absolute inset-y-0 right-0 z-20 w-[min(var(--tool-panel-width),calc(100%-28px))] overflow-hidden border-l border-[var(--codex-border-soft)] bg-[var(--codex-main)] shadow-[var(--codex-shadow-soft)] xl:relative xl:inset-auto xl:w-[var(--tool-panel-width)] xl:min-w-0 xl:flex-none xl:shadow-none"
            style={toolPanelStyle}
          >
            {resizeHandle}
            <ReviewWorkspace />
          </div>
        ) : activeView === "files" ? (
          <div
            className="absolute inset-y-0 right-0 z-20 w-[min(var(--tool-panel-width),calc(100%-28px))] overflow-hidden border-l border-[var(--codex-border-soft)] bg-[var(--codex-main)] shadow-[var(--codex-shadow-soft)] xl:relative xl:inset-auto xl:w-[var(--tool-panel-width)] xl:min-w-0 xl:flex-none xl:shadow-none"
            style={toolPanelStyle}
          >
            {resizeHandle}
            <FileWorkspace />
          </div>
        ) : activeView === "terminal" || activeView === "browser" ? (
          <div
            className="absolute inset-y-0 right-0 z-20 flex w-[min(var(--tool-panel-width),calc(100%-28px))] items-center justify-center overflow-hidden border-l border-[var(--codex-border-soft)] bg-[var(--codex-main)] text-[var(--codex-text-muted)] shadow-[var(--codex-shadow-soft)] xl:relative xl:inset-auto xl:w-[var(--tool-panel-width)] xl:min-w-0 xl:flex-none xl:shadow-none"
            style={toolPanelStyle}
          >
            {resizeHandle}
            <div className="text-center">
              <div className="text-[15px] font-medium text-[var(--codex-text)]">{activeView === "terminal" ? "Terminal" : "Browser"}</div>
              <p className="mt-2 max-w-[360px] text-[13px]">This first prototype preserves the workspace shell and reserves this tool surface for the next interaction pass.</p>
            </div>
          </div>
        ) : (
          <EnvironmentCard items={environmentItems} progress={progressItems} subagents={subagents} running={running} />
        )}
      </div>
    </section>
  );
}
