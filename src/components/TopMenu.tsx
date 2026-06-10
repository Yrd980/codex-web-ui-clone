import { CodexIcon } from "./CodexIcon";

export function TopMenu() {
  return (
    <header className="flex h-11 shrink-0 items-center justify-between bg-[var(--codex-window)] px-3 text-[13px] text-[var(--codex-text-muted)]">
      <div className="flex items-center gap-1.5">
        <button className="grid size-8 place-items-center rounded-[9px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Toggle sidebar">
          <CodexIcon name="menu" className="size-[18px]" />
        </button>
        <button
          className="grid size-8 place-items-center rounded-[9px] text-[var(--codex-text-faint)] hover:bg-[var(--codex-hover)]"
          type="button"
          aria-label="Back"
        >
          <CodexIcon name="back" className="size-[18px]" />
        </button>
        <button
          className="grid size-8 place-items-center rounded-[9px] text-[var(--codex-text-faint)] hover:bg-[var(--codex-hover)]"
          type="button"
          aria-label="Forward"
        >
          <CodexIcon name="forward" className="size-[18px]" />
        </button>
        {["File", "Edit", "View", "Help"].map((item) => (
          <button key={item} className="rounded-[8px] px-2.5 py-1.5 hover:bg-[var(--codex-hover)]" type="button">
            {item}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1 text-[var(--codex-text-faint)]">
        <button className="grid size-8 place-items-center rounded-[8px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Minimize">
          -
        </button>
        <button className="grid size-8 place-items-center rounded-[8px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Maximize">
          []
        </button>
        <button className="grid size-8 place-items-center rounded-[8px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Close">
          x
        </button>
      </div>
    </header>
  );
}
