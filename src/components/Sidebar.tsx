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
}

export function Sidebar({ activeThreadId, groups, onOpenPalette, onSelectThread, onSetView, open }: SidebarProps) {
  return (
    <aside
      className={[
        "z-40 flex w-[284px] shrink-0 flex-col bg-[var(--codex-sidebar)] px-3 pb-3 pt-2 text-[16px] text-[var(--codex-text-muted)] transition-transform duration-200",
        "md:relative md:translate-x-0 md:text-[14px]",
        "max-md:absolute max-md:inset-y-0 max-md:left-0 max-md:shadow-[var(--codex-shadow)]",
        open ? "max-md:translate-x-0" : "max-md:-translate-x-full",
      ].join(" ")}
    >
      <div className="space-y-0.5">
        {primaryActions.map((action) => (
          <button
            key={action.id}
            className="flex h-10 w-full items-center gap-3 rounded-[9px] px-1.5 text-left hover:bg-[var(--codex-hover)]"
            type="button"
            onClick={() => {
              if (action.opensPalette) onOpenPalette();
              if (action.view) onSetView(action.view);
            }}
          >
            <CodexIcon name={action.icon} className="size-[18px] shrink-0 text-[var(--codex-text)]" />
            <span className="truncate">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex-1 overflow-y-auto pr-0.5">
        <div className="mb-4 px-1.5 text-[16px] text-[var(--codex-text-faint)] md:text-[14px]">Projects</div>
        <div className="space-y-3.5">
          {groups.map((group) => (
            <section key={group.id}>
              <div className="mb-0.5 flex h-8 items-center gap-2 px-1.5 text-[16px] text-[var(--codex-text)] md:text-[14px]">
                <CodexIcon name="folder" className="size-[17px] shrink-0 text-[var(--codex-text)]" />
                <span className="truncate">{group.name}</span>
              </div>
              <div className="space-y-0.5">
                {group.threads.map((thread) => {
                  const active = thread.id === activeThreadId;
                  return (
                    <button
                      key={thread.id}
                      className={[
                        "ml-7 flex h-9 w-[calc(100%-1.75rem)] items-center gap-2 rounded-[9px] px-2 text-left transition-colors",
                        active ? "bg-transparent text-[var(--codex-text)]" : "hover:bg-[var(--codex-hover)]",
                      ].join(" ")}
                      type="button"
                      onClick={() => {
                        onSelectThread(thread.id);
                        onSetView(thread.running ? "running" : "chat");
                      }}
                    >
                      <span className="min-w-0 flex-1 truncate">{thread.title}</span>
                      {thread.running ? (
                        <span className="size-2.5 shrink-0 rounded-full bg-[var(--codex-accent)]" />
                      ) : (
                        <span className="shrink-0 text-[13px] text-[var(--codex-text-faint)] md:text-[12px]">{thread.time}</span>
                      )}
                    </button>
                  );
                })}
                {group.threads.length > 3 ? (
                  <button className="ml-7 h-8 rounded-[9px] px-2 text-left text-[15px] text-[var(--codex-text-faint)] hover:bg-[var(--codex-hover)] md:text-[13px]" type="button">
                    Show more
                  </button>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </div>

      <button
        className="mt-3 flex h-10 w-full items-center gap-3 rounded-[9px] px-1.5 text-left hover:bg-[var(--codex-hover)]"
        type="button"
        onClick={() => onSetView("settings")}
      >
        <CodexIcon name="settings" className="size-[19px] text-[var(--codex-text)]" />
        <span>Settings</span>
      </button>
    </aside>
  );
}
