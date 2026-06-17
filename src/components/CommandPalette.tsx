import { commandRows, paletteRows } from "../data/scenarios/commandScenario";
import type { PaletteMode } from "../types";
import { CodexIcon } from "./CodexIcon";

interface CommandPaletteProps {
  open: boolean;
  mode: PaletteMode;
  onClose: () => void;
  onRunCommand: (row: (typeof commandRows)[number]) => void;
}

export function CommandPalette({ open, mode, onClose, onRunCommand }: CommandPaletteProps) {
  if (!open) return null;

  const commandMode = mode === "commands";

  const runCommand = (row: (typeof commandRows)[number]) => {
    onRunCommand(row);
  };

  return (
    <div className="codex-layer-overlay absolute inset-0 grid place-items-start bg-[var(--codex-overlay-dim)] px-4 pt-[14vh] backdrop-blur-[0.125rem]" onClick={onClose}>
      <div
        className="codex-composer-surface mx-auto w-[min(92%,46vw)] overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="codex-subbar flex items-center gap-3 border-b px-4">
          <CodexIcon name="search" className="size-5 text-[var(--codex-text-faint)]" />
          <input
            className="min-w-0 flex-1 bg-transparent text-[0.9375rem] outline-none placeholder:text-[var(--codex-text-faint)]"
            placeholder={commandMode ? "Search commands" : "Search threads"}
            autoFocus
          />
          <button className="codex-icon-button !size-[var(--codex-control-sm)]" type="button" onClick={onClose} aria-label="Close search">
            <CodexIcon name="x" className="size-4" />
          </button>
        </div>
        <div className="p-2">
          {commandMode
            ? commandRows.map((row, index) => (
                <button
                  key={row.title}
                  className="codex-row-button codex-row-lg gap-3 px-3"
                  data-active={index === 0}
                  type="button"
                  onClick={() => runCommand(row)}
                >
                  <CodexIcon name="layout" className="size-4 text-[var(--codex-text-faint)]" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[var(--codex-type-md)] font-medium">{row.title}</span>
                    <span className="block truncate text-[var(--codex-type-sm)] text-[var(--codex-text-faint)]">{row.description}</span>
                  </span>
                  <span className="codex-badge">{row.shortcut}</span>
                </button>
              ))
            : paletteRows.map((row) => (
            <button
              key={row.title}
              className="codex-row-button codex-row-lg gap-3 px-3"
              data-active={row.active}
              type="button"
              onClick={onClose}
            >
              <span className={["size-1.5 rounded-full", row.active ? "bg-[var(--codex-accent)]" : "bg-transparent"].join(" ")} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[var(--codex-type-md)] font-medium">{row.title}</span>
                <span className="block truncate text-[var(--codex-type-sm)] text-[var(--codex-text-faint)]">{row.project}</span>
              </span>
              <span className="codex-badge">{row.shortcut}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
