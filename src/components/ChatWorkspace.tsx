import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { browserHistory, chatMessages, environmentItems, progressItems, subagents } from "../data/mockData";
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
  onOpenCommandMenu: () => void;
  onSetView: (view: ActiveView) => void;
}

const MIN_TOOL_PANEL_WIDTH = 420;
const MAX_TOOL_PANEL_WIDTH = 920;
const MIN_CHAT_WIDTH = 440;
const RIGHT_RAIL_MIN_WORKSPACE_WIDTH = 1320;
const TOOL_SWITCHER_RAIL_WIDTH = 456;
const ENVIRONMENT_RESERVED_WIDTH = 406;
const WORKSPACE_GUTTER_WIDTH = 64;
const terminalSeedLines = [
  "PS C:\\Users\\Yrd98\\project\\aesthetics> bun run build",
  "tsc --noEmit && vite build",
  "vite build completed successfully",
];

function clampToolPanelWidth(width: number, containerWidth: number) {
  const maxWidth = Math.max(MIN_TOOL_PANEL_WIDTH, Math.min(MAX_TOOL_PANEL_WIDTH, containerWidth - MIN_CHAT_WIDTH));
  return Math.min(Math.max(width, MIN_TOOL_PANEL_WIDTH), maxWidth);
}

export function ChatWorkspace({ activeView, onOpenCommandMenu, onSetView }: ChatWorkspaceProps) {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef(false);
  const [toolPanelWidth, setToolPanelWidth] = useState(680);
  const [workspaceWidth, setWorkspaceWidth] = useState(0);
  const [browserIndex, setBrowserIndex] = useState(0);
  const [browserUseEnabled, setBrowserUseEnabled] = useState(true);
  const [annotationMode, setAnnotationMode] = useState(false);
  const [terminalLines, setTerminalLines] = useState(terminalSeedLines);
  const [enabledPlugins, setEnabledPlugins] = useState(["Browser", "GitHub", "OpenAI Developers"]);
  const [enabledAutomations, setEnabledAutomations] = useState(["Build monitor"]);
  const [environmentOpen, setEnvironmentOpen] = useState(true);
  const running = activeView === "running";
  const hasToolOverlay = ["tool-switcher", "review", "files", "terminal", "browser", "plugins", "automations"].includes(activeView);
  const showRightRail = workspaceWidth >= RIGHT_RAIL_MIN_WORKSPACE_WIDTH;
  const browserUrl = browserHistory[browserIndex] ?? browserHistory[0];
  const environmentReservedWidth = environmentOpen && !hasToolOverlay ? ENVIRONMENT_RESERVED_WIDTH + WORKSPACE_GUTTER_WIDTH : 0;

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
    const updateWorkspaceSize = () => {
      const width = workspaceRef.current?.getBoundingClientRect().width;
      if (!width) return;
      setWorkspaceWidth(width);
      setToolPanelWidth((current) => clampToolPanelWidth(current, width));
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

  const resizeHandle = (
    <button
      className="absolute inset-y-0 left-0 z-30 hidden w-4 -translate-x-2 cursor-col-resize touch-none rounded-full outline-none hover:bg-[color-mix(in_oklab,var(--codex-accent)_12%,transparent)] focus-visible:bg-[color-mix(in_oklab,var(--codex-accent)_16%,transparent)] xl:block"
      type="button"
      aria-label="Resize tool panel"
      onPointerDown={startPanelResize}
      onMouseDown={startPanelResize}
    />
  );

  const toolPlaceholder =
    activeView === "browser" ? (
      <div className="flex h-full min-w-0 flex-col bg-[var(--codex-main)]">
        <div className="flex h-11 items-center gap-2 border-b border-[var(--codex-border-soft)] px-3 text-[12px] text-[var(--codex-text-muted)]">
          <button
            className="grid size-8 place-items-center rounded-[9px] hover:bg-[var(--codex-hover)] disabled:text-[var(--codex-text-faint)]"
            type="button"
            aria-label="Back in browser"
            disabled={browserIndex === 0}
            onClick={() => setBrowserIndex((index) => Math.max(0, index - 1))}
          >
            <CodexIcon name="back" className="size-4" />
          </button>
          <button
            className="grid size-8 place-items-center rounded-[9px] hover:bg-[var(--codex-hover)] disabled:text-[var(--codex-text-faint)]"
            type="button"
            aria-label="Forward in browser"
            disabled={browserIndex === browserHistory.length - 1}
            onClick={() => setBrowserIndex((index) => Math.min(browserHistory.length - 1, index + 1))}
          >
            <CodexIcon name="forward" className="size-4" />
          </button>
          <div className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-[10px] border border-[var(--codex-border-soft)] bg-[var(--codex-surface-raised)] px-3">
            <CodexIcon name="globe" className="size-4" />
            <span className="truncate">{browserUrl}</span>
          </div>
          <button
            className={["h-8 rounded-[9px] px-3", annotationMode ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "bg-[var(--codex-surface-muted)]"].join(" ")}
            type="button"
            onClick={() => setAnnotationMode((enabled) => !enabled)}
          >
            Annotate
          </button>
          <button
            className={["h-8 rounded-[9px] px-3", browserUseEnabled ? "bg-[var(--codex-surface-muted)] text-[var(--codex-text)]" : "bg-transparent text-[var(--codex-text-faint)]"].join(" ")}
            type="button"
            onClick={() => setBrowserUseEnabled((enabled) => !enabled)}
          >
            {browserUseEnabled ? "Browser use on" : "Browser use off"}
          </button>
        </div>
        <div className="grid min-h-0 flex-1 place-items-center text-center text-[13px] text-[var(--codex-text-muted)]">
          <div className="relative w-[min(420px,calc(100%-40px))] rounded-[14px] border border-[var(--codex-border-soft)] bg-[var(--codex-surface-raised)] px-6 py-8 shadow-[0_10px_34px_rgb(76_79_105_/_0.08)]">
            <CodexIcon name="browser" className="mx-auto mb-3 size-8 text-[var(--codex-text-faint)]" />
            <div className="text-[15px] font-medium text-[var(--codex-text)]">In-app browser preview</div>
            <p className="mt-2">Previewing {browserUrl.replace(/^https?:\/\//, "")}</p>
            {annotationMode ? (
              <div className="absolute right-5 top-5 rounded-[10px] border border-[var(--codex-accent)] bg-[color-mix(in_oklab,var(--codex-accent)_10%,white)] px-3 py-2 text-left text-[12px] text-[var(--codex-accent)]">
                Comment pinned
              </div>
            ) : null}
          </div>
        </div>
      </div>
    ) : (
      <div className="flex h-full min-w-0 flex-col bg-[var(--codex-main)]">
        <div className="flex h-11 items-center justify-between border-b border-[var(--codex-border-soft)] px-3 text-[12px] text-[var(--codex-text-muted)]">
          <span>Terminal</span>
          <button className="h-8 rounded-[9px] bg-[var(--codex-surface-muted)] px-3" type="button" onClick={() => setTerminalLines([])}>
            Clear
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-4 text-[12px] leading-6">
          {terminalLines.length ? (
            terminalLines.map((line) => (
              <div key={line}>
                <code>{line}</code>
              </div>
            ))
          ) : (
            <span className="text-[var(--codex-text-faint)]">Terminal cleared</span>
          )}
        </div>
      </div>
    );

  const adminPanel =
    activeView === "plugins" || activeView === "automations" ? (
      <div className="flex h-full min-w-0 flex-col bg-[var(--codex-main)] text-[12px] text-[var(--codex-text-muted)]">
        <div className="flex h-11 items-center justify-between border-b border-[var(--codex-border-soft)] px-3">
          <span className="text-[var(--codex-text)]">{activeView === "plugins" ? "Plugins" : "Automations"}</span>
          <button className="grid size-8 place-items-center rounded-[9px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Panel settings">
            <CodexIcon name="settings" className="size-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-3">
          {(activeView === "plugins" ? ["Browser", "GitHub", "OpenAI Developers", "Slack", "Computer Use"] : ["Build monitor", "Thread follow-up", "Browser regression check"]).map((item) => {
            const active = activeView === "plugins" ? enabledPlugins.includes(item) : enabledAutomations.includes(item);
            return (
              <button
                key={item}
                className="mb-2 flex min-h-11 w-full items-center gap-3 rounded-[10px] border border-[var(--codex-border-soft)] bg-[var(--codex-surface-raised)] px-3 text-left hover:bg-[var(--codex-hover)]"
                type="button"
                onClick={() => {
                  if (activeView === "plugins") {
                    setEnabledPlugins((plugins) => (plugins.includes(item) ? plugins.filter((plugin) => plugin !== item) : [...plugins, item]));
                  } else {
                    setEnabledAutomations((automations) => (automations.includes(item) ? automations.filter((automation) => automation !== item) : [...automations, item]));
                  }
                }}
              >
                <CodexIcon name={activeView === "plugins" ? "app" : "automations"} className="size-4 text-[var(--codex-text)]" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] text-[var(--codex-text)]">{item}</span>
                  <span className="block truncate text-[11px] text-[var(--codex-text-faint)]">{active ? "Enabled in this shell" : "Optional"}</span>
                </span>
                {active ? <CodexIcon name="check" className="size-4 text-[var(--codex-accent)]" /> : null}
              </button>
            );
          })}
        </div>
      </div>
    ) : null;

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
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain" style={{ marginLeft: environmentReservedWidth ? WORKSPACE_GUTTER_WIDTH : undefined, marginRight: environmentReservedWidth }}>
            <ChatStream messages={chatMessages} running={running} />
          </div>
          <Composer
            running={running}
            reservedRight={environmentReservedWidth}
            onToggleRunning={() => onSetView(running ? "chat" : "running")}
            onOpenTools={() => {
              setEnvironmentOpen(false);
              onSetView("tool-switcher");
            }}
          />
        </div>
        {activeView === "tool-switcher" ? (
          <div
            className="absolute bottom-[118px] right-5 z-20 h-[min(520px,calc(100%-150px))] w-[min(456px,calc(100%-40px))] overflow-hidden rounded-[18px] border border-[var(--codex-border-soft)] bg-[var(--codex-main)] shadow-[var(--codex-shadow-soft)] xl:inset-y-0 xl:right-0 xl:bottom-auto xl:h-auto xl:w-[456px] xl:rounded-none xl:border-y-0 xl:border-r-0 xl:shadow-none"
            style={{ "--tool-switcher-width": `${TOOL_SWITCHER_RAIL_WIDTH}px` } as CSSProperties}
          >
            <ToolSwitcher onSetView={onSetView} />
          </div>
        ) : activeView === "review" ? (
          <div
            className="absolute inset-y-0 right-0 z-20 w-[min(var(--tool-panel-width),calc(100%-28px))] overflow-hidden border-l border-[var(--codex-border-soft)] bg-[var(--codex-main)] shadow-[var(--codex-shadow-soft)] xl:relative xl:inset-auto xl:w-[var(--tool-panel-width)] xl:min-w-0 xl:flex-none xl:shadow-none"
            style={toolPanelStyle}
          >
            {resizeHandle}
            <ReviewWorkspace onSetView={onSetView} />
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
            {toolPlaceholder}
          </div>
        ) : activeView === "plugins" || activeView === "automations" ? (
          <div
            className="absolute inset-y-0 right-0 z-20 flex w-[min(var(--tool-panel-width),calc(100%-28px))] items-center justify-center overflow-hidden border-l border-[var(--codex-border-soft)] bg-[var(--codex-main)] text-[var(--codex-text-muted)] shadow-[var(--codex-shadow-soft)] xl:relative xl:inset-auto xl:w-[var(--tool-panel-width)] xl:min-w-0 xl:flex-none xl:shadow-none"
            style={toolPanelStyle}
          >
            {resizeHandle}
            {adminPanel}
          </div>
        ) : environmentOpen ? (
          <EnvironmentCard items={environmentItems} progress={progressItems} subagents={subagents} running={running} />
        ) : null}
      </div>
    </section>
  );
}
