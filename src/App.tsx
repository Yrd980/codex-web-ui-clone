import { useState } from "react";
import { AppFrame } from "./components/AppFrame";
import { projectGroups } from "./data/mockData";
import type { ActiveView } from "./types";

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>("chat");
  const [activeThreadId, setActiveThreadId] = useState("thread-1");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  return (
    <AppFrame
      activeThreadId={activeThreadId}
      groups={projectGroups}
      onOpenPalette={() => setIsCommandPaletteOpen(true)}
      onSelectThread={setActiveThreadId}
      onSetView={setActiveView}
    >
      <div className="flex h-full min-h-0 items-center justify-center">
        <div className="rounded-[14px] border border-[var(--codex-border)] bg-[var(--codex-surface-raised)] px-5 py-4 shadow-[var(--codex-shadow-soft)]">
          <div className="text-xs text-[var(--codex-text-muted)]">Active view</div>
          <div className="mt-1 text-lg font-medium">{activeView}</div>
          {isCommandPaletteOpen ? (
            <button className="mt-3 text-sm text-[var(--codex-accent)]" type="button" onClick={() => setIsCommandPaletteOpen(false)}>
              Command palette flag is open. Close flag.
            </button>
          ) : null}
        </div>
      </div>
    </AppFrame>
  );
}
