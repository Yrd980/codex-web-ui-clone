import { CodexIcon } from "./CodexIcon";

interface ComposerProps {
  running?: boolean;
  onToggleRunning: () => void;
  onOpenTools: () => void;
}

export function Composer({ running = false, onToggleRunning, onOpenTools }: ComposerProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center bg-gradient-to-t from-[var(--codex-main)] via-[var(--codex-main)] to-transparent px-4 pb-6 pt-16">
      <div className="pointer-events-auto w-full max-w-[920px] rounded-[24px] border border-[var(--codex-border)] bg-[var(--codex-surface-raised)] px-4 py-3 shadow-[var(--codex-shadow)]">
        <textarea
          className="h-16 w-full resize-none bg-transparent text-[15px] leading-6 text-[var(--codex-text)] outline-none placeholder:text-[var(--codex-text-faint)]"
          placeholder="Ask Codex to build, explain, or review..."
        />
        <div className="flex items-center justify-between pt-2 text-[12px] text-[var(--codex-text-muted)]">
          <div className="flex items-center gap-1.5">
            <button className="grid size-8 place-items-center rounded-[10px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Add context">
              <CodexIcon name="plus" className="size-[18px]" />
            </button>
            <button
              className="flex h-8 items-center gap-1.5 rounded-[10px] px-2 text-[var(--codex-permission)] hover:bg-[var(--codex-hover)]"
              type="button"
            >
              <CodexIcon name="warning" className="size-4" />
              Full access
              <CodexIcon name="chevronDown" className="size-3.5" />
            </button>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <button className="hidden h-8 items-center gap-1.5 rounded-[10px] px-2.5 text-[var(--codex-text-faint)] hover:bg-[var(--codex-hover)] sm:flex" type="button" onClick={onOpenTools}>
              <CodexIcon name="spinner" className="size-4" />
              5.5
              <span className="max-sm:hidden">Extra High</span>
              <CodexIcon name="chevronDown" className="size-3.5" />
            </button>
            <button
              className="grid size-9 place-items-center rounded-full bg-[var(--codex-text)] text-[var(--codex-surface-raised)] shadow-[0_6px_18px_rgb(76_79_105_/_0.12)]"
              type="button"
              aria-label={running ? "Stop" : "Send"}
              onClick={onToggleRunning}
            >
              <CodexIcon name={running ? "stop" : "send"} className="size-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
