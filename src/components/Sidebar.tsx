import type { CSSProperties, FocusEvent as ReactFocusEvent, MouseEvent as ReactMouseEvent } from "react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { primaryActions } from "../data/scenarios/commandScenario";
import type { ActiveView, ProjectGroup } from "../types";
import { CodexIcon } from "./CodexIcon";

interface SidebarProps {
  activeThreadId: string;
  groups: ProjectGroup[];
  onOpenPalette: () => void;
  onSelectThread: (threadId: string) => void;
  onSetView: (view: ActiveView) => void;
  open: boolean;
  docked: boolean;
  style: CSSProperties;
  onFloatingMouseLeave: () => void;
}

export function Sidebar({ activeThreadId, groups, onOpenPalette, onSelectThread, onSetView, open, docked, style, onFloatingMouseLeave }: SidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [activeProjectId, setActiveProjectId] = useState(groups[0]?.id ?? "");
  const [hoveredThreadPreview, setHoveredThreadPreview] = useState<{
    title: string;
    time: string;
    branch: string;
    left: number;
    top: number;
    width: number;
  } | null>(null);

  const showThreadPreview = (event: ReactMouseEvent<HTMLElement> | ReactFocusEvent<HTMLElement>, title: string, time: string, branch: string) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const viewportPadding = Math.round(window.innerWidth * 0.006);
    const previewGap = 2;
    const preferredWidth = Math.round(bounds.width * 0.94);
    const left = bounds.right + previewGap + preferredWidth + viewportPadding <= window.innerWidth ? Math.round(bounds.right + previewGap) : Math.round(Math.max(viewportPadding, bounds.left));
    setHoveredThreadPreview({
      title,
      time,
      branch,
      left,
      top: Math.round(bounds.top),
      width: Math.min(preferredWidth, window.innerWidth - left - viewportPadding),
    });
  };

  return (
    <aside
      style={style}
      onMouseLeave={() => {
        if (!docked) onFloatingMouseLeave();
      }}
      className={[
        "z-40 flex h-full w-[var(--sidebar-width)] shrink-0 flex-col overflow-visible bg-[var(--codex-sidebar)] px-2.5 pb-3 pt-2 text-[15px] text-[var(--codex-text-muted)] transition-[transform,box-shadow] duration-200 ease-out lg:text-[14px]",
        docked ? "lg:relative lg:translate-x-0" : "lg:absolute lg:inset-y-0 lg:left-0 lg:shadow-[var(--codex-shadow)]",
        "max-lg:absolute max-lg:inset-y-0 max-lg:left-0 max-lg:w-[min(var(--sidebar-width),calc(100vw_-_var(--sidebar-floating-edge)))] max-lg:shadow-[var(--codex-shadow)]",
        docked ? "max-lg:-translate-x-full" : "",
        !docked && open ? "max-lg:translate-x-0" : "",
        !docked && !open ? "max-lg:-translate-x-full" : "",
        !docked && open ? "lg:translate-x-0" : "",
        !docked && !open ? "lg:-translate-x-full" : "",
      ].join(" ")}
    >
      <div className="space-y-0.5">
        {primaryActions.map((action) => (
          <button
            key={action.id}
            className="grid h-10 w-full grid-cols-[24px_minmax(0,1fr)] items-center gap-2 rounded-[9px] px-1.5 text-left hover:bg-[var(--codex-hover)]"
            type="button"
            onClick={() => {
              if (action.opensPalette) onOpenPalette();
              if (action.view) onSetView(action.view);
            }}
          >
            <CodexIcon name={action.icon} className="mx-auto size-[18px] text-[var(--codex-text)]" />
            <span className="truncate leading-none">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex-1 overflow-y-auto pr-0.5">
        <div className="mb-4 px-1.5 text-[15px] leading-none text-[var(--codex-text-faint)] lg:text-[14px]">Projects</div>
        <div className="space-y-3.5">
          {groups.map((group) => (
            <section key={group.id}>
              <button
                className={["mb-0.5 grid h-8 w-full grid-cols-[24px_minmax(0,1fr)] items-center gap-2 rounded-[9px] px-1.5 text-left text-[15px] text-[var(--codex-text)] hover:bg-[var(--codex-hover)] lg:text-[14px]", activeProjectId === group.id ? "bg-[var(--codex-active)]" : ""].join(" ")}
                type="button"
                title={group.path}
                onClick={() => setActiveProjectId(group.id)}
              >
                <CodexIcon name="folder" className="mx-auto size-[17px] text-[var(--codex-text)]" />
                <span className="truncate leading-none">{group.name}</span>
              </button>
              <div className="space-y-0.5">
                {(expandedGroups.includes(group.id) ? group.threads : group.threads.slice(0, 3)).map((thread) => {
                  const active = thread.id === activeThreadId;
                  return (
                    <div
                      key={thread.id}
                      className="group/thread relative"
                      onMouseEnter={(event) => showThreadPreview(event, thread.title, thread.running ? "" : thread.time, group.id === "aesthetics" ? "codex/codex-web-ui-clone" : group.name)}
                      onMouseLeave={() => setHoveredThreadPreview(null)}
                    >
                      <button
                        className={[
                          "grid h-9 w-full grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-2 rounded-[9px] px-1.5 text-left transition-colors",
                          active ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "hover:bg-[var(--codex-hover)]",
                        ].join(" ")}
                        type="button"
                        onClick={() => {
                          onSelectThread(thread.id);
                          onSetView(thread.running ? "running" : "chat");
                        }}
                        onFocus={(event) => showThreadPreview(event, thread.title, thread.running ? "" : thread.time, group.id === "aesthetics" ? "codex/codex-web-ui-clone" : group.name)}
                        onBlur={() => setHoveredThreadPreview(null)}
                      >
                        <span />
                        <span className="min-w-0 flex-1 truncate leading-none">{thread.title}</span>
                        {thread.running ? (
                          <span className="size-2.5 shrink-0 rounded-full bg-[var(--codex-accent)] group-hover/thread:opacity-0" />
                        ) : (
                          <span className="shrink-0 text-[12px] leading-none text-[var(--codex-text-faint)] group-hover/thread:opacity-0">{thread.time}</span>
                        )}
                      </button>
                      <div className="pointer-events-none absolute right-1.5 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 text-[var(--codex-text-faint)] group-hover/thread:flex">
                        <span className="grid size-[22px] place-items-center rounded-[6px] bg-[color-mix(in_oklab,var(--codex-sidebar)_72%,transparent)]">
                          <CodexIcon name="pin" className="size-[15px]" />
                        </span>
                        <span className="grid size-[22px] place-items-center rounded-[6px] bg-[color-mix(in_oklab,var(--codex-sidebar)_72%,transparent)]">
                          <CodexIcon name="tray" className="size-[15px]" />
                        </span>
                      </div>
                    </div>
                  );
                })}
                {group.threads.length > 3 ? (
                  <button
                    className="grid h-8 w-full grid-cols-[24px_minmax(0,1fr)] items-center gap-2 rounded-[9px] px-1.5 text-left text-[13px] leading-none text-[var(--codex-text-faint)] hover:bg-[var(--codex-hover)]"
                    type="button"
                    onClick={() => setExpandedGroups((ids) => (ids.includes(group.id) ? ids.filter((id) => id !== group.id) : [...ids, group.id]))}
                  >
                    <span />
                    <span className="truncate">{expandedGroups.includes(group.id) ? "Show less" : "Show more"}</span>
                  </button>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </div>

      <button
        className="mt-3 grid h-10 w-full grid-cols-[24px_minmax(0,1fr)] items-center gap-2 rounded-[9px] px-1.5 text-left hover:bg-[var(--codex-hover)]"
        type="button"
        onClick={() => onSetView("settings")}
      >
        <CodexIcon name="settings" className="mx-auto size-[19px] text-[var(--codex-text)]" />
        <span className="truncate leading-none">Settings</span>
      </button>
      {hoveredThreadPreview
        ? createPortal(
            <div
              className="pointer-events-none fixed z-[70] overflow-hidden rounded-[13px] border border-[var(--codex-border-soft)] bg-[var(--codex-surface-raised)] px-3 py-2 text-[13px] text-[var(--codex-text)] shadow-[var(--codex-shadow-soft)]"
              style={{ left: hoveredThreadPreview.left, top: hoveredThreadPreview.top, width: hoveredThreadPreview.width }}
            >
              <div className="flex h-7 items-center gap-3">
                <div className="min-w-0 flex-1 truncate font-medium">{hoveredThreadPreview.title}</div>
                <div className="shrink-0 text-[12px] text-[var(--codex-text-faint)]">{hoveredThreadPreview.time}</div>
              </div>
              <div className="flex h-6 items-center gap-2 text-[12px] text-[var(--codex-text-muted)]">
                <CodexIcon name="branch" className="size-4 shrink-0" />
                <span className="truncate">{hoveredThreadPreview.branch}</span>
              </div>
            </div>,
            document.body,
          )
        : null}
    </aside>
  );
}
