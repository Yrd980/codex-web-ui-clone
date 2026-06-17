import { useState } from "react";
import type { IconName } from "../types";
import { CodexIcon } from "./CodexIcon";

interface TopMenuProps {
  sidebarDocked: boolean;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function TopMenu({ sidebarDocked, sidebarOpen, onToggleSidebar }: TopMenuProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [navStatus, setNavStatus] = useState("Current thread");
  const [windowStatus, setWindowStatus] = useState("Window active");
  const sidebarVisible = sidebarDocked || sidebarOpen;
  const sidebarIcon: IconName = sidebarVisible ? "sideBarOpen" : "sideBarClosed";
  const menuRows: Record<string, string[]> = {
    File: ["New thread", "Open folder", "Save appshot"],
    Edit: ["Find in thread", "Copy response", "Clear selection"],
    View: ["Command menu", "Toggle terminal", "Toggle sidebar"],
    Help: ["Keyboard shortcuts", "Codex manual", "Send feedback"],
  };

  return (
    <header className="codex-chrome-bar relative flex shrink-0 items-center justify-between border-b px-1 text-[0.8125rem]">
      <div className="flex h-full min-w-0 items-center gap-1">
        <button className="codex-icon-button !size-[var(--codex-control-xs)]" type="button" aria-label="Toggle sidebar" onClick={onToggleSidebar}>
          <CodexIcon name={sidebarIcon} className="codex-icon-md" />
        </button>
        <button
          className="codex-icon-button !size-[var(--codex-control-xs)] hidden text-[var(--codex-text-faint)] sm:grid"
          type="button"
          aria-label="Back"
          onClick={() => setNavStatus("Back to previous thread")}
        >
          <CodexIcon name="back" className="codex-icon-md" />
        </button>
        <button
          className="codex-icon-button !size-[var(--codex-control-xs)] hidden text-[var(--codex-text-faint)] sm:grid"
          type="button"
          aria-label="Forward"
          onClick={() => setNavStatus("Forward to next thread")}
        >
          <CodexIcon name="forward" className="codex-icon-md" />
        </button>
        <span className="hidden max-w-[clamp(10rem,18vw,16rem)] truncate px-2 text-[0.75rem] text-[var(--codex-text-faint)] lg:block">{windowStatus === "Window active" ? navStatus : windowStatus}</span>
        {Object.keys(menuRows).map((item) => (
          <div key={item} className="relative hidden md:block">
            <button className="codex-menu-button" data-active={openMenu === item} type="button" onClick={() => setOpenMenu(openMenu === item ? null : item)}>
              {item}
            </button>
            {openMenu === item ? (
              <div className="codex-popover absolute left-0 top-full mt-1 w-[clamp(11rem,14vw,14rem)] p-1.5">
                {menuRows[item].map((row) => (
                  <button
                    key={row}
                    className="codex-row-button codex-row-sm text-[0.75rem]"
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
        <button className="codex-icon-button !h-[var(--codex-control-xs)] !w-9" type="button" aria-label="Minimize window" onClick={() => setWindowStatus("Window minimized preview")}>
          <CodexIcon name="minimize" className="codex-icon-md" />
        </button>
        <button className="codex-icon-button !h-[var(--codex-control-xs)] !w-9" type="button" aria-label="Window layout" onClick={() => setWindowStatus("Window layout toggled")}>
          <CodexIcon name="panel" className="codex-icon-md" />
        </button>
        <button className="codex-icon-button !h-[var(--codex-control-xs)] !w-9" type="button" aria-label="Close window" onClick={() => setWindowStatus("Close requested")}>
          <CodexIcon name="x" className="codex-icon-md" />
        </button>
      </div>
    </header>
  );
}
