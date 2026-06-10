import { CodexIcon } from "./CodexIcon";

interface TopMenuProps {
  onToggleSidebar: () => void;
}

export function TopMenu({ onToggleSidebar }: TopMenuProps) {
  return (
    <header className="flex h-10 shrink-0 items-center justify-between border-b border-[var(--codex-border-soft)] bg-[var(--codex-window)] px-2 text-[13px] text-[var(--codex-text-muted)]">
      <div className="flex min-w-0 items-center gap-1">
        <button className="grid size-8 place-items-center rounded-[9px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Toggle sidebar" onClick={onToggleSidebar}>
          <CodexIcon name="menu" className="size-[18px]" />
        </button>
        <button
          className="hidden size-8 place-items-center rounded-[9px] text-[var(--codex-text-faint)] hover:bg-[var(--codex-hover)] sm:grid"
          type="button"
          aria-label="Back"
        >
          <CodexIcon name="back" className="size-[18px]" />
        </button>
        <button
          className="hidden size-8 place-items-center rounded-[9px] text-[var(--codex-text-faint)] hover:bg-[var(--codex-hover)] sm:grid"
          type="button"
          aria-label="Forward"
        >
          <CodexIcon name="forward" className="size-[18px]" />
        </button>
        {["File", "Edit", "View", "Help"].map((item) => (
          <button key={item} className="hidden rounded-[8px] px-2.5 py-1.5 hover:bg-[var(--codex-hover)] md:block" type="button">
            {item}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1 text-[var(--codex-text-faint)]">
        <button className="grid size-8 place-items-center rounded-[8px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Minimize window">
          <CodexIcon name="minimize" className="size-[18px]" />
        </button>
        <button className="grid size-8 place-items-center rounded-[8px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Window layout">
          <CodexIcon name="panel" className="size-[18px]" />
        </button>
        <button className="grid size-8 place-items-center rounded-[8px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Close window">
          <CodexIcon name="x" className="size-[18px]" />
        </button>
      </div>
    </header>
  );
}
