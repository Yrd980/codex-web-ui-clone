import type { EnvironmentItem, ProgressItem, SubagentItem } from "../types";
import { CodexIcon } from "./CodexIcon";

interface EnvironmentCardProps {
  items: EnvironmentItem[];
  progress: ProgressItem[];
  subagents: SubagentItem[];
  running?: boolean;
}

const toneClass = {
  muted: "text-[var(--codex-text-muted)]",
  green: "text-[var(--codex-diff-added)]",
  red: "text-[var(--codex-diff-removed)]",
  accent: "text-[var(--codex-accent)]",
  warning: "text-[var(--codex-permission)]",
};

export function EnvironmentCard({ items, progress, subagents, running = false }: EnvironmentCardProps) {
  return (
    <aside className="hidden w-[374px] shrink-0 px-5 py-6 xl:block">
      <div className="rounded-[24px] border border-[var(--codex-border)] bg-[var(--codex-surface-raised)] shadow-[var(--codex-shadow-soft)]">
        <div className="flex h-14 items-center justify-between border-b border-[var(--codex-border-soft)] px-4">
          <div className="font-medium">Environment</div>
          <button
            className="grid size-8 place-items-center rounded-[10px] text-[var(--codex-text-muted)] hover:bg-[var(--codex-hover)]"
            type="button"
            aria-label="Environment settings"
          >
            <CodexIcon name="settings" className="size-4" />
          </button>
        </div>
        <div className="divide-y divide-[var(--codex-border-soft)]">
          {items.map((item) => (
            <div key={item.label} className="flex h-11 items-center gap-3 px-4 text-[13px]">
              <CodexIcon name={item.icon} className="size-4 text-[var(--codex-text-faint)]" />
              <span className="flex-1 text-[var(--codex-text-muted)]">{item.label}</span>
              <span className={toneClass[item.tone ?? "muted"]}>{item.value}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--codex-border-soft)] px-4 py-4">
          <div className="mb-3 text-[12px] font-medium text-[var(--codex-text-muted)]">Progress</div>
          <div className="space-y-2.5">
            {progress.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-[12px]">
                <span
                  className={[
                    "grid size-4 place-items-center rounded-full border",
                    item.state === "done"
                      ? "border-[var(--codex-diff-added)] bg-[color-mix(in_oklab,var(--codex-diff-added)_15%,transparent)] text-[var(--codex-diff-added)]"
                      : item.state === "active"
                        ? "border-[var(--codex-accent)] text-[var(--codex-accent)]"
                        : "border-[var(--codex-border)] text-transparent",
                  ].join(" ")}
                >
                  {item.state === "done" ? <CodexIcon name="check" className="size-3" /> : null}
                </span>
                <span className={item.state === "pending" ? "text-[var(--codex-text-faint)]" : "text-[var(--codex-text-muted)]"}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-[var(--codex-border-soft)] px-4 py-4">
          <div className="mb-3 flex items-center justify-between text-[12px] font-medium text-[var(--codex-text-muted)]">
            <span>Subagents</span>
            {running ? <span className="text-[var(--codex-accent)]">active</span> : null}
          </div>
          <div className="space-y-2">
            {subagents.map((agent) => (
              <div key={agent.name} className="flex items-center gap-2 text-[12px]">
                <span className={["size-2 rounded-full", toneClass[agent.tone]].join(" ")} style={{ background: "currentColor" }} />
                <span className="flex-1">{agent.name}</span>
                <span className="text-[var(--codex-text-faint)]">{agent.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
