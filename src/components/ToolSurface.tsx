import type { CSSProperties, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, RefObject, ReactNode } from "react";
import { useCallback, useRef, useState } from "react";
import { browserHistory } from "../data/scenarios/toolScenario";
import { clampToolPanelWidth, codexShellGeometryDefaults, getToolSurfaceGeometry } from "../layout/codexShellGeometry";
import type { ActiveView } from "../types";
import { CodexIcon } from "./CodexIcon";
import { FileWorkspace } from "./FileWorkspace";
import { ReviewWorkspace } from "./ReviewWorkspace";
import { ToolSwitcher } from "./ToolSwitcher";

interface ToolSurfaceProps {
  activeView: ActiveView;
  workspaceRef: RefObject<HTMLDivElement | null>;
  workspaceWidth: number;
  workspaceHeight: number;
  resizingRef: RefObject<boolean>;
  environmentOpen: boolean;
  onSetView: (view: ActiveView) => void;
  onToggleEnvironment: () => void;
  onMinimizeTools: () => void;
}

const terminalSeedLines = [
  "PS C:\\Users\\Yrd98\\project\\aesthetics> bun run build",
  "tsc --noEmit && vite build",
  "vite build completed successfully",
];

export function isToolSurfaceView(view: ActiveView) {
  return ["tool-switcher", "review", "files", "terminal", "browser", "plugins", "automations"].includes(view);
}

export function ToolSurface({ activeView, workspaceRef, workspaceWidth, workspaceHeight, resizingRef, environmentOpen, onSetView, onToggleEnvironment, onMinimizeTools }: ToolSurfaceProps) {
  const [toolPanelRatio, setToolPanelRatio] = useState(codexShellGeometryDefaults.toolPanelRatio);
  const [browserIndex, setBrowserIndex] = useState(0);
  const [browserUseEnabled, setBrowserUseEnabled] = useState(true);
  const [annotationMode, setAnnotationMode] = useState(false);
  const [terminalLines, setTerminalLines] = useState(terminalSeedLines);
  const [enabledPlugins, setEnabledPlugins] = useState(["Browser", "GitHub", "OpenAI Developers"]);
  const [enabledAutomations, setEnabledAutomations] = useState(["Build monitor"]);
  const [panelResizing, setPanelResizing] = useState(false);
  const ignoreMouseResizeRef = useRef(false);
  const browserUrl = browserHistory[browserIndex] ?? browserHistory[0];
  const geometry = getToolSurfaceGeometry({ width: workspaceWidth, height: workspaceHeight, toolPanelRatio });

  const startPanelResize = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement> | ReactPointerEvent<HTMLButtonElement>) => {
      if (event.type === "mousedown" && ignoreMouseResizeRef.current) return;
      if (event.button !== 0 || resizingRef.current) return;
      if (!workspaceRef.current) return;

      event.preventDefault();
      const resizeHandle = event.currentTarget;
      const pointerId = "pointerId" in event ? event.pointerId : null;
      if ("pointerId" in event && event.currentTarget.hasPointerCapture?.(event.pointerId) === false) {
        ignoreMouseResizeRef.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        window.setTimeout(() => {
          ignoreMouseResizeRef.current = false;
        }, 250);
      }
      resizingRef.current = true;
      setPanelResizing(true);
      const workspace = workspaceRef.current;
      const previousCursor = document.body.style.cursor;
      const previousUserSelect = document.body.style.userSelect;

      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const handleMove = (moveEvent: MouseEvent | PointerEvent) => {
        moveEvent.preventDefault();
        const bounds = workspace.getBoundingClientRect();
        const nextWidth = clampToolPanelWidth(bounds.right - moveEvent.clientX, bounds.width);
        setToolPanelRatio(nextWidth / bounds.width);
      };

      const handleUp = () => {
        resizingRef.current = false;
        setPanelResizing(false);
        document.body.style.cursor = previousCursor;
        document.body.style.userSelect = previousUserSelect;
        if (pointerId !== null && resizeHandle.hasPointerCapture?.(pointerId)) {
          resizeHandle.releasePointerCapture(pointerId);
        }
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [resizingRef, workspaceRef],
  );

  const resizeHandle = (
    <button
      className={[
        "group absolute inset-y-0 left-0 z-30 hidden w-7 -translate-x-3.5 cursor-col-resize touch-none outline-none lg:block",
        panelResizing ? "bg-[color-mix(in_oklab,var(--codex-accent)_8%,transparent)]" : "",
      ].join(" ")}
      type="button"
      aria-label="Resize tool panel"
      onPointerDown={startPanelResize}
      onMouseDown={startPanelResize}
    >
      <span
        className={[
          "absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-transparent transition-colors duration-[var(--codex-motion-fast)] ease-[var(--codex-motion-ease)]",
          "group-hover:bg-[color-mix(in_oklab,var(--codex-accent)_42%,transparent)] group-focus-visible:bg-[var(--codex-accent)]",
          panelResizing ? "bg-[var(--codex-accent)]" : "",
        ].join(" ")}
      />
    </button>
  );

  if (activeView === "tool-switcher") {
    return (
      <div
        className="absolute right-[var(--tool-switcher-edge-gap)] top-1/2 z-20 h-[min(var(--tool-switcher-height),calc(100%_-_var(--tool-switcher-vertical-clearance)))] w-[min(var(--tool-switcher-width),calc(100%_-_var(--tool-switcher-edge-gap)_-_var(--tool-switcher-edge-gap)))] -translate-y-1/2 overflow-hidden rounded-[18px] border border-[var(--codex-border-soft)] bg-[color-mix(in_oklab,var(--codex-main)_92%,transparent)] shadow-[var(--codex-shadow-soft)]"
        style={geometry.toolSwitcherStyle}
      >
        <ToolSwitcher onSetView={onSetView} />
      </div>
    );
  }

  if (!isToolSurfaceView(activeView)) return null;

  return (
    <ToolPanelFrame style={geometry.toolPanelStyle}>
      {resizeHandle}
      {activeView === "review" ? <ReviewWorkspace onSetView={onSetView} /> : null}
      {activeView === "files" ? (
        <FileWorkspace
          endControls={<ToolPanelEndControls activeView={activeView} onSetView={onSetView} onMinimizeTools={onMinimizeTools} />}
        />
      ) : null}
      {activeView !== "files" && activeView !== "review" ? <ToolPanelControls activeView={activeView} environmentOpen={environmentOpen} onSetView={onSetView} onToggleEnvironment={onToggleEnvironment} onMinimizeTools={onMinimizeTools} /> : null}
      {activeView === "terminal" ? <TerminalPanel terminalLines={terminalLines} onClear={() => setTerminalLines([])} /> : null}
      {activeView === "browser" ? (
        <BrowserPanel
          browserIndex={browserIndex}
          browserUrl={browserUrl}
          browserUseEnabled={browserUseEnabled}
          annotationMode={annotationMode}
          previewInsetX={geometry.browserPreviewInsetX}
          previewInsetY={geometry.browserPreviewInsetY}
          onBack={() => setBrowserIndex((index) => Math.max(0, index - 1))}
          onForward={() => setBrowserIndex((index) => Math.min(browserHistory.length - 1, index + 1))}
          onToggleAnnotationMode={() => setAnnotationMode((enabled) => !enabled)}
          onToggleBrowserUse={() => setBrowserUseEnabled((enabled) => !enabled)}
        />
      ) : null}
      {activeView === "plugins" || activeView === "automations" ? (
        <AdminPanel
          activeView={activeView}
          enabledPlugins={enabledPlugins}
          enabledAutomations={enabledAutomations}
          onTogglePlugin={(item) => setEnabledPlugins((plugins) => (plugins.includes(item) ? plugins.filter((plugin) => plugin !== item) : [...plugins, item]))}
          onToggleAutomation={(item) => setEnabledAutomations((automations) => (automations.includes(item) ? automations.filter((automation) => automation !== item) : [...automations, item]))}
        />
      ) : null}
    </ToolPanelFrame>
  );
}

function ToolPanelControls({
  activeView,
  environmentOpen,
  onSetView,
  onToggleEnvironment,
  onMinimizeTools,
}: {
  activeView: ActiveView;
  environmentOpen: boolean;
  onSetView: (view: ActiveView) => void;
  onToggleEnvironment: () => void;
  onMinimizeTools: () => void;
}) {
  return (
    <div className="flex items-center gap-1 text-[var(--codex-text-muted)]">
      <button
        className="flex h-9 items-center gap-1.5 rounded-[12px] border border-[var(--codex-border-soft)] bg-[color-mix(in_oklab,var(--codex-surface-raised)_65%,transparent)] px-2.5 shadow-[0_6px_18px_rgb(76_79_105_/_0.05)] hover:bg-[var(--codex-hover)]"
        type="button"
        aria-label="Open terminal"
        onClick={() => onSetView(activeView === "terminal" ? "files" : "terminal")}
      >
        <CodexIcon name="terminal" className="size-[18px] text-[var(--codex-text)]" />
        <CodexIcon name="chevronDown" className="size-[14px]" />
      </button>
      <button
        className={["grid size-9 place-items-center rounded-[11px] hover:bg-[var(--codex-hover)]", environmentOpen ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : ""].join(" ")}
        type="button"
        aria-label="Toggle environment panel"
        onClick={onToggleEnvironment}
      >
        <CodexIcon name="layout" className="size-[19px]" />
      </button>
      <button className="grid size-9 place-items-center rounded-[11px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Minimize tool panel" onClick={onMinimizeTools}>
        <CodexIcon name="minimize" className="size-[18px]" />
      </button>
      <button
        className={["grid size-9 place-items-center rounded-[11px] hover:bg-[var(--codex-hover)]", activeView !== "chat" ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : ""].join(" ")}
        type="button"
        aria-label="Toggle side panel"
        onClick={() => onSetView("chat")}
      >
        <CodexIcon name="panel" className="size-[18px]" />
      </button>
    </div>
  );
}

function ToolPanelEndControls({
  activeView,
  onSetView,
  onMinimizeTools,
}: {
  activeView: ActiveView;
  onSetView: (view: ActiveView) => void;
  onMinimizeTools: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1 text-[var(--codex-text-muted)]">
      <button className="grid size-9 place-items-center rounded-[11px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Minimize tool panel" onClick={onMinimizeTools}>
        <CodexIcon name="minimize" className="size-[18px]" />
      </button>
      <button
        className={["grid size-9 place-items-center rounded-[11px] hover:bg-[var(--codex-hover)]", activeView !== "chat" ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : ""].join(" ")}
        type="button"
        aria-label="Toggle side panel"
        onClick={() => onSetView("chat")}
      >
        <CodexIcon name="panel" className="size-[18px]" />
      </button>
    </div>
  );
}

function ToolPanelFrame({ style, children }: { style: CSSProperties; children: ReactNode }) {
  return (
    <div
      className="absolute inset-y-0 right-0 z-20 flex w-[min(var(--tool-panel-width),calc(100%_-_var(--panel-overlay-edge)))] overflow-hidden border-l border-[var(--codex-border-soft)] bg-[var(--codex-main)] text-[var(--codex-text-muted)] shadow-[var(--codex-shadow-soft)] lg:relative lg:inset-auto lg:w-[var(--tool-panel-width)] lg:min-w-0 lg:flex-none lg:shadow-none"
      style={style}
    >
      {children}
    </div>
  );
}

function TerminalPanel({ terminalLines, onClear }: { terminalLines: string[]; onClear: () => void }) {
  return (
    <div className="flex h-full min-w-0 flex-col bg-[var(--codex-main)]">
      <div className="flex h-11 items-center justify-between border-b border-[var(--codex-border-soft)] px-3 text-[12px] text-[var(--codex-text-muted)]">
        <span>Terminal</span>
        <button className="h-8 rounded-[9px] bg-[var(--codex-surface-muted)] px-3" type="button" onClick={onClear}>
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
}

interface BrowserPanelProps {
  browserIndex: number;
  browserUrl: string;
  browserUseEnabled: boolean;
  annotationMode: boolean;
  previewInsetX: number;
  previewInsetY: number;
  onBack: () => void;
  onForward: () => void;
  onToggleAnnotationMode: () => void;
  onToggleBrowserUse: () => void;
}

function BrowserPanel({
  browserIndex,
  browserUrl,
  browserUseEnabled,
  annotationMode,
  previewInsetX,
  previewInsetY,
  onBack,
  onForward,
  onToggleAnnotationMode,
  onToggleBrowserUse,
}: BrowserPanelProps) {
  return (
    <div className="flex h-full min-w-0 flex-col bg-[var(--codex-main)]">
      <div className="flex h-11 items-center gap-2 border-b border-[var(--codex-border-soft)] px-3 text-[12px] text-[var(--codex-text-muted)]">
        <button className="grid size-8 place-items-center rounded-[9px] hover:bg-[var(--codex-hover)] disabled:text-[var(--codex-text-faint)]" type="button" aria-label="Back in browser" disabled={browserIndex === 0} onClick={onBack}>
          <CodexIcon name="back" className="size-4" />
        </button>
        <button className="grid size-8 place-items-center rounded-[9px] hover:bg-[var(--codex-hover)] disabled:text-[var(--codex-text-faint)]" type="button" aria-label="Forward in browser" disabled={browserIndex === browserHistory.length - 1} onClick={onForward}>
          <CodexIcon name="forward" className="size-4" />
        </button>
        <div className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-[10px] border border-[var(--codex-border-soft)] bg-[var(--codex-surface-raised)] px-3">
          <CodexIcon name="globe" className="size-4" />
          <span className="truncate">{browserUrl}</span>
        </div>
        <button className={["h-8 rounded-[9px] px-3", annotationMode ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "bg-[var(--codex-surface-muted)]"].join(" ")} type="button" onClick={onToggleAnnotationMode}>
          Annotate
        </button>
        <button className={["h-8 rounded-[9px] px-3", browserUseEnabled ? "bg-[var(--codex-surface-muted)] text-[var(--codex-text)]" : "bg-transparent text-[var(--codex-text-faint)]"].join(" ")} type="button" onClick={onToggleBrowserUse}>
          {browserUseEnabled ? "Browser use on" : "Browser use off"}
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden bg-[color-mix(in_oklab,var(--codex-surface-raised)_45%,var(--codex-main))]">
        <div
          className="mx-auto h-[calc(100%_-_var(--browser-preview-inset-y)_-_var(--browser-preview-inset-y))] w-[calc(100%_-_var(--browser-preview-inset-x)_-_var(--browser-preview-inset-x))] overflow-hidden rounded-[12px] border border-[var(--codex-border-soft)] bg-[var(--codex-surface-raised)]"
          style={
            {
              "--browser-preview-inset-x": `${previewInsetX}px`,
              "--browser-preview-inset-y": `${previewInsetY}px`,
              marginTop: previewInsetY,
            } as CSSProperties
          }
        >
          <div className="flex h-10 items-center gap-2 border-b border-[var(--codex-border-soft)] px-3 text-[12px] text-[var(--codex-text-faint)]">
            <span className="size-2 rounded-full bg-[var(--codex-border)]" />
            <span className="size-2 rounded-full bg-[var(--codex-border)]" />
            <span className="size-2 rounded-full bg-[var(--codex-border)]" />
            <span className="ml-2 truncate">{browserUrl.replace(/^https?:\/\//, "")}</span>
          </div>
          <div className="px-6 py-5 text-[13px] leading-6 text-[var(--codex-text-muted)]">
            <div className="mb-4 h-4 w-40 rounded-[6px] bg-[var(--codex-surface-muted)]" />
            <div className="space-y-2">
              <div className="h-3 w-full max-w-[72%] rounded-[4px] bg-[var(--codex-surface-muted)]" />
              <div className="h-3 w-full max-w-[64%] rounded-[4px] bg-[var(--codex-surface-muted)]" />
              <div className="h-3 w-full max-w-[54%] rounded-[4px] bg-[var(--codex-surface-muted)]" />
            </div>
            {annotationMode ? <div className="mt-6 inline-flex rounded-[10px] border border-[var(--codex-accent)] bg-[color-mix(in_oklab,var(--codex-accent)_9%,transparent)] px-3 py-2 text-[12px] text-[var(--codex-accent)]">Comment pinned</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

interface AdminPanelProps {
  activeView: "plugins" | "automations";
  enabledPlugins: string[];
  enabledAutomations: string[];
  onTogglePlugin: (item: string) => void;
  onToggleAutomation: (item: string) => void;
}

function AdminPanel({ activeView, enabledPlugins, enabledAutomations, onTogglePlugin, onToggleAutomation }: AdminPanelProps) {
  const items = activeView === "plugins" ? ["Browser", "GitHub", "OpenAI Developers", "Slack", "Computer Use"] : ["Build monitor", "Thread follow-up", "Browser regression check"];

  return (
    <div className="flex h-full min-w-0 flex-col bg-[var(--codex-main)] text-[12px] text-[var(--codex-text-muted)]">
      <div className="flex h-11 items-center justify-between border-b border-[var(--codex-border-soft)] px-3">
        <span className="text-[var(--codex-text)]">{activeView === "plugins" ? "Plugins" : "Automations"}</span>
        <button className="grid size-8 place-items-center rounded-[9px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Panel settings">
          <CodexIcon name="settings" className="size-4" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-3">
        {items.map((item) => {
          const active = activeView === "plugins" ? enabledPlugins.includes(item) : enabledAutomations.includes(item);
          return (
            <button
              key={item}
              className="flex min-h-10 w-full items-center gap-3 rounded-[9px] px-3 text-left hover:bg-[var(--codex-hover)]"
              type="button"
              onClick={() => {
                if (activeView === "plugins") {
                  onTogglePlugin(item);
                } else {
                  onToggleAutomation(item);
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
  );
}
