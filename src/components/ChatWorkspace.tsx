import { chatMessages, environmentItems, progressItems, subagents } from "../data/mockData";
import type { ActiveView } from "../types";
import { ChatStream } from "./ChatStream";
import { Composer } from "./Composer";
import { EnvironmentCard } from "./EnvironmentCard";

interface ChatWorkspaceProps {
  activeView: ActiveView;
  onSetView: (view: ActiveView) => void;
}

export function ChatWorkspace({ activeView, onSetView }: ChatWorkspaceProps) {
  const running = activeView === "running";

  return (
    <section className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-[var(--codex-border-soft)] px-5">
        <div className="min-w-0">
          <div className="truncate text-[14px] font-medium">页面的设计</div>
          <div className="text-[12px] text-[var(--codex-text-faint)]">{"C:\\Users\\Yrd98\\project\\aesthetics"}</div>
        </div>
        <button
          className="h-8 rounded-[10px] border border-[var(--codex-border-soft)] bg-[var(--codex-surface)] px-3 text-[12px] text-[var(--codex-text-muted)] hover:bg-[var(--codex-hover)]"
          type="button"
          onClick={() => onSetView("tool-switcher")}
        >
          Open tools
        </button>
      </header>
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <div className="relative min-w-0 flex-1 overflow-y-auto">
          <ChatStream messages={chatMessages} running={running} />
          <Composer running={running} onToggleRunning={() => onSetView(running ? "chat" : "running")} onOpenTools={() => onSetView("tool-switcher")} />
        </div>
        <EnvironmentCard items={environmentItems} progress={progressItems} subagents={subagents} running={running} />
      </div>
    </section>
  );
}
