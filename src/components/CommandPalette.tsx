import { paletteRows } from "../data/mockData";
import { CodexIcon } from "./CodexIcon";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 grid place-items-start bg-[var(--codex-overlay-dim)] px-4 pt-[14vh] backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="mx-auto w-full max-w-[650px] overflow-hidden rounded-[24px] border border-[var(--codex-border)] bg-[var(--codex-surface-raised)] shadow-[var(--codex-shadow)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-14 items-center gap-3 border-b border-[var(--codex-border-soft)] px-4">
          <CodexIcon name="search" className="size-5 text-[var(--codex-text-faint)]" />
          <input className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[var(--codex-text-faint)]" placeholder="Search chats" autoFocus />
          <button className="grid size-8 place-items-center rounded-[9px] text-[var(--codex-text-muted)] hover:bg-[var(--codex-hover)]" type="button" onClick={onClose} aria-label="Close search">
            <CodexIcon name="x" className="size-4" />
          </button>
        </div>
        <div className="p-2">
          {paletteRows.map((row) => (
            <button
              key={row.title}
              className={["flex h-12 w-full items-center gap-3 rounded-[12px] px-3 text-left", row.active ? "bg-[var(--codex-active)]" : "hover:bg-[var(--codex-hover)]"].join(" ")}
              type="button"
            >
              <span className={["size-1.5 rounded-full", row.active ? "bg-[var(--codex-accent)]" : "bg-transparent"].join(" ")} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium">{row.title}</span>
                <span className="block truncate text-[12px] text-[var(--codex-text-faint)]">{row.project}</span>
              </span>
              <span className="rounded-[7px] bg-[var(--codex-surface-muted)] px-2 py-1 text-[11px] text-[var(--codex-text-faint)]">{row.shortcut}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
