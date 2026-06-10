import { CodexIcon } from "./CodexIcon";

interface TopMenuProps {
  onToggleSidebar: () => void;
}

export function TopMenu({ onToggleSidebar }: TopMenuProps) {
  return (
    <header className="flex h-10 shrink-0 items-center justify-between border-b border-[var(--codex-border-soft)] bg-[var(--codex-window)] px-1 text-[13px] text-[var(--codex-text-muted)]">
      <div className="flex h-full min-w-0 items-center gap-1">
        <button className="grid size-7 place-items-center rounded-[7px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Toggle sidebar" onClick={onToggleSidebar}>
          <CodexIcon name="sideChat" className="size-[18px]" />
        </button>
        <button
          className="hidden size-7 place-items-center rounded-[7px] text-[var(--codex-text-faint)] hover:bg-[var(--codex-hover)] sm:grid"
          type="button"
          aria-label="Back"
        >
          <CodexIcon name="back" className="size-[18px]" />
        </button>
        <button
          className="hidden size-7 place-items-center rounded-[7px] text-[var(--codex-text-faint)] hover:bg-[var(--codex-hover)] sm:grid"
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
      <div className="flex h-full items-center gap-1 text-[var(--codex-text-faint)]">
        <button className="grid h-7 w-9 place-items-center rounded-[7px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Minimize window">
          <CodexIcon name="minimize" className="size-[18px]" />
        </button>
        <button className="grid h-7 w-9 place-items-center rounded-[7px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Window layout">
          <CodexIcon name="panel" className="size-[18px]" />
        </button>
        <button className="grid h-7 w-9 place-items-center rounded-[7px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Close window">
          <CodexIcon name="x" className="size-[18px]" />
        </button>
      </div>
    </header>
  );
}
