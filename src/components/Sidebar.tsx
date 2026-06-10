import { primaryActions } from "../data/mockData";
import type { ActiveView, ProjectGroup } from "../types";
import { CodexIcon } from "./CodexIcon";

interface SidebarProps {
  activeThreadId: string;
  groups: ProjectGroup[];
  onOpenPalette: () => void;
  onSelectThread: (threadId: string) => void;
  onSetView: (view: ActiveView) => void;
}

export function Sidebar({ activeThreadId, groups, onOpenPalette, onSelectThread, onSetView }: SidebarProps) {
  return (
    <aside className="hidden w-[298px] shrink-0 flex-col bg-[var(--codex-sidebar)] px-3 pb-3 pt-2 text-[13px] text-[var(--codex-text-muted)] md:flex xl:w-[298px]">
      <div className="space-y-1">
        {primaryActions.map((action) => (
          <button
            key={action.id}
            className="flex h-10 w-full items-center gap-2.5 rounded-[10px] px-2.5 text-left hover:bg-[var(--codex-hover)]"
            type="button"
            onClick={() => {
              if (action.opensPalette) onOpenPalette();
              if (action.view) onSetView(action.view);
            }}
          >
            <CodexIcon name={action.icon} className="size-5 text-[var(--codex-text-faint)]" />
            <span className="truncate">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 flex-1 overflow-hidden">
        <div className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.04em] text-[var(--codex-text-faint)]">Projects</div>
        <div className="space-y-4">
          {groups.map((group) => (
            <section key={group.id}>
              <div className="mb-1 flex h-8 items-center gap-2 px-2 text-[13px] font-medium text-[var(--codex-text)]">
                <CodexIcon name="folder" className="size-[18px] text-[var(--codex-text-faint)]" />
                <span className="truncate">{group.name}</span>
              </div>
              <div className="space-y-0.5">
                {group.threads.map((thread) => {
                  const active = thread.id === activeThreadId;
                  return (
                    <button
                      key={thread.id}
                      className={[
                        "flex h-9 w-full items-center gap-2 rounded-[10px] px-2 text-left transition-colors",
                        active ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "hover:bg-[var(--codex-hover)]",
                      ].join(" ")}
                      type="button"
                      onClick={() => {
                        onSelectThread(thread.id);
                        onSetView(thread.running ? "running" : "chat");
                      }}
                    >
                      <span className="min-w-0 flex-1 truncate">{thread.title}</span>
                      {thread.running ? (
                        <span className="size-2 rounded-full bg-[var(--codex-accent)]" />
                      ) : (
                        <span className="text-[11px] text-[var(--codex-text-faint)]">{thread.time}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      <button
        className="mt-3 flex h-10 w-full items-center gap-2.5 rounded-[10px] px-2.5 text-left hover:bg-[var(--codex-hover)]"
        type="button"
        onClick={() => onSetView("settings")}
      >
        <CodexIcon name="settings" className="size-5 text-[var(--codex-text-faint)]" />
        <span>Settings</span>
      </button>
    </aside>
  );
}
