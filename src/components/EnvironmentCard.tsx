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
    <aside className="pointer-events-none absolute right-3 top-4 z-10 hidden w-[min(374px,calc(100%-24px))] shrink-0 px-0 py-0 lg:block">
      <div className="pointer-events-auto rounded-[22px] border border-[var(--codex-border-soft)] bg-[color-mix(in_oklab,var(--codex-surface-raised)_78%,transparent)] shadow-[var(--codex-shadow-soft)] backdrop-blur-sm">
        <div className="flex h-[54px] items-center justify-between gap-3 px-5">
          <button className="flex items-center gap-1.5 text-[15px] text-[var(--codex-text-faint)] hover:text-[var(--codex-text-muted)]" type="button">
            Environment
            <CodexIcon name="chevronDown" className="size-4" />
          </button>
          <button
            className="grid size-8 shrink-0 place-items-center rounded-[9px] text-[var(--codex-text-muted)] hover:bg-[var(--codex-hover)]"
            type="button"
            aria-label="Environment settings"
          >
            <CodexIcon name="settings" className="size-4" />
          </button>
        </div>
        <div className="px-5 pb-4">
          <div className="space-y-4 text-[15px]">
            <div className="grid grid-cols-[22px_minmax(0,1fr)_auto_auto] items-center gap-2">
              <CodexIcon name="diff" className="mx-auto size-[18px] text-[var(--codex-text)]" />
              <span className="truncate leading-none">Changes</span>
              <span className="text-[var(--codex-diff-added)]">+119</span>
              <span className="text-[var(--codex-diff-removed)]">-0</span>
            </div>
            <div className="grid grid-cols-[22px_minmax(0,1fr)_16px] items-center gap-2">
              <CodexIcon name="terminal" className="mx-auto size-[18px] text-[var(--codex-text)]" />
              <span className="truncate leading-none">Local</span>
              <CodexIcon name="chevronDown" className="size-4 text-[var(--codex-text-faint)]" />
            </div>
            <div className="grid grid-cols-[22px_minmax(0,1fr)_16px] items-center gap-2">
              <CodexIcon name="branch" className="mx-auto size-[18px] text-[var(--codex-text)]" />
              <span className="min-w-0 truncate leading-none">codex/codex-web-ui-clone</span>
              <CodexIcon name="chevronDown" className="size-4 text-[var(--codex-text-faint)]" />
            </div>
            <div className="grid grid-cols-[22px_minmax(0,1fr)] items-center gap-2">
              <CodexIcon name="diff" className="mx-auto size-[18px] text-[var(--codex-text)]" />
              <span className="truncate leading-none">Commit or push</span>
            </div>
            <div className="grid grid-cols-[22px_minmax(0,1fr)] items-center gap-2 text-[var(--codex-text-faint)]">
              <CodexIcon name="cloud" className="mx-auto size-[18px]" />
              <span className="truncate leading-none">Pull request status unavailable</span>
            </div>
          </div>
        </div>
        <div className="mx-5 border-t border-[var(--codex-border-soft)] py-4">
          <div className="mb-4 text-[15px] text-[var(--codex-text-faint)]">Browser</div>
          <div className="flex items-center gap-3">
            <CodexIcon name="globe" className="size-[18px] text-[var(--codex-text)]" />
            <span className="min-w-0 flex-1 truncate text-[15px]">Codex App Web Clone</span>
            <span className="text-[13px] text-[var(--codex-text-faint)]">127.0.0.1:5173</span>
          </div>
        </div>
        {running ? (
          <div className="mx-5 border-t border-[var(--codex-border-soft)] py-4">
            <div className="mb-3 text-[13px] text-[var(--codex-text-muted)]">Progress</div>
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
            <div className="mt-4 space-y-2">
              {subagents.map((agent) => (
                <div key={agent.name} className="flex items-center gap-2 text-[12px]">
                  <span className={["size-2 rounded-full", toneClass[agent.tone]].join(" ")} style={{ background: "currentColor" }} />
                  <span className="flex-1">{agent.name}</span>
                  <span className="text-[var(--codex-text-faint)]">{agent.status}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mx-5 border-t border-[var(--codex-border-soft)] py-4">
          <div className="mb-4 text-[15px] text-[var(--codex-text-faint)]">Sources</div>
          <div className="text-[15px] text-[var(--codex-text-faint)]">
            {items.length ? "No sources yet" : "No sources yet"}
          </div>
        </div>
      </div>
    </aside>
  );
}
