import type { CSSProperties } from "react";
import { useState } from "react";
import { primaryActions } from "../data/mockData";
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
}

export function Sidebar({ activeThreadId, groups, onOpenPalette, onSelectThread, onSetView, open, docked, style }: SidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [activeProjectId, setActiveProjectId] = useState(groups[0]?.id ?? "");

  return (
    <aside
      style={style}
      className={[
        "z-40 flex h-full w-[var(--sidebar-width)] shrink-0 flex-col overflow-hidden bg-[var(--codex-sidebar)] px-2.5 pb-3 pt-2 text-[15px] text-[var(--codex-text-muted)] transition-transform duration-200 lg:text-[14px]",
        docked ? "lg:relative lg:translate-x-0" : "lg:absolute lg:inset-y-0 lg:left-0 lg:shadow-[var(--codex-shadow)]",
        "max-lg:absolute max-lg:inset-y-0 max-lg:left-0 max-lg:w-[min(var(--sidebar-width),calc(100vw-28px))] max-lg:shadow-[var(--codex-shadow)]",
        open ? "max-lg:translate-x-0" : "max-lg:-translate-x-full",
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
                    <button
                      key={thread.id}
                      className={[
                        "grid h-9 w-full grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-2 rounded-[9px] px-1.5 text-left transition-colors",
                        active ? "bg-transparent text-[var(--codex-text)]" : "hover:bg-[var(--codex-hover)]",
                      ].join(" ")}
                      type="button"
                      onClick={() => {
                        onSelectThread(thread.id);
                        onSetView(thread.running ? "running" : "chat");
                      }}
                    >
                      <span />
                      <span className="min-w-0 flex-1 truncate leading-none">{thread.title}</span>
                      {thread.running ? (
                        <span className="size-2.5 shrink-0 rounded-full bg-[var(--codex-accent)]" />
                      ) : (
                        <span className="shrink-0 text-[12px] leading-none text-[var(--codex-text-faint)]">{thread.time}</span>
                      )}
                    </button>
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
    </aside>
  );
}
