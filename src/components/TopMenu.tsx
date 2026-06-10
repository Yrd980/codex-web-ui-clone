import { useState } from "react";
import { CodexIcon } from "./CodexIcon";

interface TopMenuProps {
  onToggleSidebar: () => void;
}

export function TopMenu({ onToggleSidebar }: TopMenuProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [navStatus, setNavStatus] = useState("Current thread");
  const [windowStatus, setWindowStatus] = useState("Window active");
  const menuRows: Record<string, string[]> = {
    File: ["New thread", "Open folder", "Save appshot"],
    Edit: ["Find in thread", "Copy response", "Clear selection"],
    View: ["Command menu", "Toggle terminal", "Toggle sidebar"],
    Help: ["Keyboard shortcuts", "Codex manual", "Send feedback"],
  };

  return (
    <header className="relative flex h-10 shrink-0 items-center justify-between border-b border-[var(--codex-border-soft)] bg-[var(--codex-window)] px-1 text-[13px] text-[var(--codex-text-muted)]">
      <div className="flex h-full min-w-0 items-center gap-1">
        <button className="grid size-7 place-items-center rounded-[7px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Toggle sidebar" onClick={onToggleSidebar}>
          <CodexIcon name="sideChat" className="size-[18px]" />
        </button>
        <button
          className="hidden size-7 place-items-center rounded-[7px] text-[var(--codex-text-faint)] hover:bg-[var(--codex-hover)] sm:grid"
          type="button"
          aria-label="Back"
          onClick={() => setNavStatus("Back to previous thread")}
        >
          <CodexIcon name="back" className="size-[18px]" />
        </button>
        <button
          className="hidden size-7 place-items-center rounded-[7px] text-[var(--codex-text-faint)] hover:bg-[var(--codex-hover)] sm:grid"
          type="button"
          aria-label="Forward"
          onClick={() => setNavStatus("Forward to next thread")}
        >
          <CodexIcon name="forward" className="size-[18px]" />
        </button>
        <span className="hidden max-w-[220px] truncate px-2 text-[12px] text-[var(--codex-text-faint)] lg:block">{windowStatus === "Window active" ? navStatus : windowStatus}</span>
        {Object.keys(menuRows).map((item) => (
          <div key={item} className="relative hidden md:block">
            <button className={["rounded-[8px] px-2.5 py-1.5 hover:bg-[var(--codex-hover)]", openMenu === item ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : ""].join(" ")} type="button" onClick={() => setOpenMenu(openMenu === item ? null : item)}>
              {item}
            </button>
            {openMenu === item ? (
              <div className="absolute left-0 top-[34px] z-50 w-[190px] rounded-[12px] border border-[var(--codex-border-soft)] bg-[var(--codex-surface-raised)] p-1.5 shadow-[var(--codex-shadow-soft)]">
                {menuRows[item].map((row) => (
                  <button
                    key={row}
                    className="flex h-8 w-full items-center rounded-[8px] px-2 text-left text-[12px] hover:bg-[var(--codex-hover)]"
                    type="button"
                    onClick={() => {
                      setNavStatus(row);
                      setOpenMenu(null);
                    }}
                  >
                    {row}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div className="flex h-full items-center gap-1 text-[var(--codex-text-faint)]">
        <button className="grid h-7 w-9 place-items-center rounded-[7px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Minimize window" onClick={() => setWindowStatus("Window minimized preview")}>
          <CodexIcon name="minimize" className="size-[18px]" />
        </button>
        <button className="grid h-7 w-9 place-items-center rounded-[7px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Window layout" onClick={() => setWindowStatus("Window layout toggled")}>
          <CodexIcon name="panel" className="size-[18px]" />
        </button>
        <button className="grid h-7 w-9 place-items-center rounded-[7px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Close window" onClick={() => setWindowStatus("Close requested")}>
          <CodexIcon name="x" className="size-[18px]" />
        </button>
      </div>
    </header>
  );
}
