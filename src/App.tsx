import { useState } from "react";
import { projectGroups } from "./data/mockData";
import type { ActiveView } from "./types";

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>("chat");
  const [activeThreadId, setActiveThreadId] = useState("thread-1");

  const activeThread =
    projectGroups.flatMap((group) => group.threads).find((thread) => thread.id === activeThreadId) ??
    projectGroups[0].threads[0];

  return (
    <main className="min-h-[100dvh] bg-[var(--codex-surface-root)] p-6 text-[var(--codex-text)]">
      <div className="text-xs text-[var(--codex-text-muted)]">Active view</div>
      <div className="mt-1 text-lg font-medium">{activeView}</div>
      <button
        className="mt-4 rounded-[10px] border border-[var(--codex-border)] bg-[var(--codex-surface-raised)] px-3 py-2 text-sm"
        type="button"
        onClick={() => setActiveView(activeView === "chat" ? "review" : "chat")}
      >
        Toggle view for scaffold check
      </button>
      <button
        className="ml-3 mt-4 rounded-[10px] border border-[var(--codex-border)] bg-[var(--codex-surface-raised)] px-3 py-2 text-sm"
        type="button"
        onClick={() => setActiveThreadId(activeThread.id === "thread-1" ? "thread-2" : "thread-1")}
      >
        {activeThread.title}
      </button>
    </main>
  );
}
