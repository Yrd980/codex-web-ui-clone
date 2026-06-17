import type { EnvironmentItem, ProgressItem, SubagentItem } from "../types";
import { CodexIcon } from "./CodexIcon";
import type { CSSProperties } from "react";
import { useState } from "react";

interface EnvironmentCardProps {
  items: EnvironmentItem[];
  progress: ProgressItem[];
  subagents: SubagentItem[];
  running?: boolean;
  style: CSSProperties;
}

const toneClass = {
  muted: "text-[var(--codex-text-muted)]",
  green: "text-[var(--codex-diff-added)]",
  red: "text-[var(--codex-diff-removed)]",
  accent: "text-[var(--codex-accent)]",
  warning: "text-[var(--codex-permission)]",
};

export function EnvironmentCard({ items, progress, subagents, running = false, style }: EnvironmentCardProps) {
  const [environmentMode, setEnvironmentMode] = useState("Local");
  const [menuOpen, setMenuOpen] = useState(false);
  const [commitState, setCommitState] = useState<"ready" | "committed" | "pushed">("ready");
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pullRequestState, setPullRequestState] = useState("Pull request status unavailable");

  return (
    <aside
      className="codex-layer-panel pointer-events-none absolute right-[var(--environment-right-inset)] top-[var(--environment-top-inset)] hidden w-[min(var(--environment-panel-width),calc(100%_-_var(--environment-right-inset)_-_var(--environment-right-inset)))] shrink-0 lg:block"
      style={style}
    >
      <div className="codex-environment-panel pointer-events-auto">
        <div className="relative flex h-[var(--codex-environment-header-height)] items-center justify-between gap-3 px-5">
          <button className="flex items-center gap-1.5 text-[0.9375rem] text-[var(--codex-text-faint)] hover:text-[var(--codex-text-muted)]" type="button" onClick={() => setMenuOpen((open) => !open)}>
            Environment
            <CodexIcon name="chevronDown" className="size-4" />
          </button>
          {menuOpen ? (
            <div className="codex-popover absolute left-4 top-11 w-[clamp(11rem,58%,15rem)] p-1.5 text-[0.75rem]">
              {["Local", "Cloud", "Read only"].map((mode) => (
                <button
                  key={mode}
                  className="codex-row-button codex-row-sm justify-between"
                  type="button"
                  onClick={() => {
                    setEnvironmentMode(mode);
                    setMenuOpen(false);
                  }}
                >
                  <span>{mode}</span>
                  {environmentMode === mode ? <CodexIcon name="check" className="size-4" /> : null}
                </button>
              ))}
            </div>
          ) : null}
          <button
            className="codex-icon-button !size-[var(--codex-control-sm)] shrink-0"
            type="button"
            aria-label="Environment settings"
            onClick={() => setSettingsOpen((open) => !open)}
          >
            <CodexIcon name="settings" className="size-4" />
          </button>
          {settingsOpen ? (
            <div className="codex-popover absolute right-4 top-11 w-[clamp(12rem,64%,16rem)] p-1.5 text-[0.75rem]">
              {["Permission profile", "Worktree location", "Reset environment"].map((item) => (
                <button
                  key={item}
                  className="codex-row-button codex-row-sm"
                  type="button"
                  onClick={() => {
                    setEnvironmentMode(item === "Permission profile" ? "Read only" : environmentMode);
                    setSettingsOpen(false);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="px-5 pb-4">
          <div className="space-y-4 text-[0.9375rem]">
            <div className="grid grid-cols-[1.375rem_minmax(0,1fr)_auto_auto] items-center gap-2">
              <CodexIcon name="diff" className="mx-auto size-[1.125rem] text-[var(--codex-text)]" />
              <span className="truncate leading-none">Changes</span>
              <span className="text-[var(--codex-diff-added)]">+119</span>
              <span className="text-[var(--codex-diff-removed)]">-0</span>
            </div>
            <div className="grid grid-cols-[1.375rem_minmax(0,1fr)_1rem] items-center gap-2">
              <CodexIcon name="terminal" className="mx-auto size-[1.125rem] text-[var(--codex-text)]" />
              <span className="truncate leading-none">{environmentMode}</span>
              <CodexIcon name="chevronDown" className="size-4 text-[var(--codex-text-faint)]" />
            </div>
            <div className="grid grid-cols-[1.375rem_minmax(0,1fr)_1rem] items-center gap-2">
              <CodexIcon name="branch" className="mx-auto size-[1.125rem] text-[var(--codex-text)]" />
              <span className="min-w-0 truncate leading-none">codex/codex-web-ui-clone</span>
              <CodexIcon name="chevronDown" className="size-4 text-[var(--codex-text-faint)]" />
            </div>
            <button className="grid grid-cols-[1.375rem_minmax(0,1fr)] items-center gap-2 rounded-[0.5625rem] text-left hover:bg-[var(--codex-hover)]" type="button" onClick={() => setCommitState(commitState === "ready" ? "committed" : "pushed")}>
              <CodexIcon name="diff" className="mx-auto size-[1.125rem] text-[var(--codex-text)]" />
              <span className="truncate leading-none">{commitState === "ready" ? "Commit or push" : commitState === "committed" ? "Commit ready to push" : "Pushed to origin"}</span>
            </button>
            <button
              className="grid grid-cols-[1.375rem_minmax(0,1fr)] items-center gap-2 rounded-[0.5625rem] text-left text-[var(--codex-text-faint)] hover:bg-[var(--codex-hover)]"
              type="button"
              onClick={() => setPullRequestState((state) => (state === "Pull request status unavailable" ? "Ready to create pull request" : "Pull request status unavailable"))}
            >
              <CodexIcon name="cloud" className="mx-auto size-[1.125rem]" />
              <span className="truncate leading-none">{pullRequestState}</span>
            </button>
          </div>
        </div>
        <div className="mx-5 border-t border-[var(--codex-border-soft)] py-4">
          <div className="mb-4 text-[0.9375rem] text-[var(--codex-text-faint)]">Browser</div>
          <div className="flex items-center gap-3">
            <CodexIcon name="globe" className="size-[1.125rem] text-[var(--codex-text)]" />
            <span className="min-w-0 flex-1 truncate text-[0.9375rem]">Codex App Web Clone</span>
            <span className="text-[0.8125rem] text-[var(--codex-text-faint)]">127.0.0.1:5173</span>
          </div>
        </div>
        {running ? (
          <div className="mx-5 border-t border-[var(--codex-border-soft)] py-4">
            <div className="mb-3 text-[0.8125rem] text-[var(--codex-text-muted)]">Progress</div>
            <div className="space-y-2.5">
              {progress.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-[0.75rem]">
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
                <div key={agent.name} className="flex items-center gap-2 text-[0.75rem]">
                  <span className={["size-2 rounded-full", toneClass[agent.tone]].join(" ")} style={{ background: "currentColor" }} />
                  <span className="flex-1">{agent.name}</span>
                  <span className="text-[var(--codex-text-faint)]">{agent.status}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mx-5 border-t border-[var(--codex-border-soft)] py-4">
          <div className="mb-4 text-[0.9375rem] text-[var(--codex-text-faint)]">Sources</div>
          <button className="flex w-full items-center justify-between text-left text-[0.9375rem] text-[var(--codex-text-faint)]" type="button" onClick={() => setSourcesOpen((open) => !open)}>
            <span>{sourcesOpen ? `${items.length} local sources` : "No sources yet"}</span>
            <CodexIcon name="chevronDown" className={["size-4", sourcesOpen ? "rotate-180" : ""].join(" ")} />
          </button>
          {sourcesOpen ? (
            <div className="mt-3 space-y-2 text-[0.75rem] text-[var(--codex-text-muted)]">
              {items.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <CodexIcon name={item.icon} className="size-4" />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  <span className="truncate text-[var(--codex-text-faint)]">{item.value}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
