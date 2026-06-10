import { chatMessages, environmentItems, progressItems, subagents } from "../data/mockData";
import type { ActiveView } from "../types";
import { ChatStream } from "./ChatStream";
import { Composer } from "./Composer";
import { CodexIcon } from "./CodexIcon";
import { EnvironmentCard } from "./EnvironmentCard";
import { FileWorkspace } from "./FileWorkspace";
import { ReviewWorkspace } from "./ReviewWorkspace";
import { ToolSwitcher } from "./ToolSwitcher";

interface ChatWorkspaceProps {
  activeView: ActiveView;
  onSetView: (view: ActiveView) => void;
}

export function ChatWorkspace({ activeView, onSetView }: ChatWorkspaceProps) {
  const running = activeView === "running";
  const hasToolOverlay = ["tool-switcher", "review", "files", "terminal", "browser"].includes(activeView);

  return (
    <section className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <header className="flex h-[58px] shrink-0 items-center justify-between border-b border-[var(--codex-border-soft)] px-4">
        <div className="flex min-w-0 items-center gap-2">
          <button className="grid size-8 place-items-center rounded-[9px] text-[var(--codex-text-muted)] hover:bg-[var(--codex-hover)]" type="button" aria-label="New chat">
            <CodexIcon name="newChat" className="size-[17px]" />
          </button>
          <div className="min-w-0">
            <div className="truncate text-[14px] font-medium">页面的设计</div>
          </div>
          <button className="grid size-7 place-items-center rounded-[8px] text-[var(--codex-text-muted)] hover:bg-[var(--codex-hover)]" type="button" aria-label="Thread options">
            <CodexIcon name="more" className="size-[16px]" />
          </button>
        </div>
        <div className="flex items-center gap-1 text-[var(--codex-text-muted)]">
          <button
            className="flex h-9 items-center gap-1.5 rounded-[12px] border border-[var(--codex-border-soft)] bg-[color-mix(in_oklab,var(--codex-surface-raised)_65%,transparent)] px-2.5 shadow-[0_6px_18px_rgb(76_79_105_/_0.05)] hover:bg-[var(--codex-hover)]"
            type="button"
            aria-label="Open terminal"
            onClick={() => onSetView(activeView === "terminal" ? "chat" : "terminal")}
          >
            <CodexIcon name="terminal" className="size-[18px] text-[var(--codex-text)]" />
            <CodexIcon name="chevronDown" className="size-[14px]" />
          </button>
          <button
            className={[
              "grid size-9 place-items-center rounded-[11px] hover:bg-[var(--codex-hover)]",
              activeView === "tool-switcher" ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "",
            ].join(" ")}
            type="button"
            aria-label="Choose tool"
            onClick={() => onSetView(activeView === "tool-switcher" ? "chat" : "tool-switcher")}
          >
            <CodexIcon name="layout" className="size-[19px]" />
          </button>
          <button className="grid size-9 place-items-center rounded-[11px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Minimize tool panel">
            <CodexIcon name="minimize" className="size-[18px]" />
          </button>
          <button
            className={[
              "grid size-9 place-items-center rounded-[11px] hover:bg-[var(--codex-hover)]",
              hasToolOverlay ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "",
            ].join(" ")}
            type="button"
            aria-label="Toggle side panel"
            onClick={() => onSetView(hasToolOverlay ? "chat" : "files")}
          >
            <CodexIcon name="panel" className="size-[18px]" />
          </button>
        </div>
      </header>
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <div className="relative min-w-0 flex-1 overflow-y-auto">
          <ChatStream messages={chatMessages} running={running} />
          <Composer running={running} onToggleRunning={() => onSetView(running ? "chat" : "running")} onOpenTools={() => onSetView("tool-switcher")} />
        </div>
        {activeView === "tool-switcher" ? (
          <div className="absolute bottom-[118px] right-5 z-20 h-[min(520px,calc(100%-150px))] w-[min(620px,calc(100%-40px))] rounded-[18px] border border-[var(--codex-border-soft)] bg-[color-mix(in_oklab,var(--codex-main)_94%,transparent)] shadow-[var(--codex-shadow-soft)] xl:static xl:h-auto xl:w-auto xl:min-w-0 xl:flex-[0_1_620px] xl:rounded-none xl:border-y-0 xl:border-r-0 xl:shadow-none">
            <ToolSwitcher onSetView={onSetView} />
          </div>
        ) : activeView === "review" ? (
          <div className="absolute inset-y-0 right-0 z-20 w-[min(860px,calc(100%-28px))] border-l border-[var(--codex-border-soft)] shadow-[var(--codex-shadow-soft)] xl:static xl:w-auto xl:min-w-0 xl:flex-[1.15] xl:shadow-none">
            <ReviewWorkspace />
          </div>
        ) : activeView === "files" ? (
          <div className="absolute inset-y-0 right-0 z-20 w-[min(860px,calc(100%-28px))] border-l border-[var(--codex-border-soft)] shadow-[var(--codex-shadow-soft)] xl:static xl:w-auto xl:min-w-0 xl:flex-[1.15] xl:shadow-none">
            <FileWorkspace />
          </div>
        ) : activeView === "terminal" || activeView === "browser" ? (
          <div className="absolute inset-y-0 right-0 z-20 flex w-[min(680px,calc(100%-28px))] items-center justify-center border-l border-[var(--codex-border-soft)] bg-[var(--codex-main)] text-[var(--codex-text-muted)] shadow-[var(--codex-shadow-soft)] xl:static xl:w-auto xl:min-w-0 xl:flex-[0_1_680px] xl:shadow-none">
            <div className="text-center">
              <div className="text-[15px] font-medium text-[var(--codex-text)]">{activeView === "terminal" ? "Terminal" : "Browser"}</div>
              <p className="mt-2 max-w-[360px] text-[13px]">This first prototype preserves the workspace shell and reserves this tool surface for the next interaction pass.</p>
            </div>
          </div>
        ) : (
          <EnvironmentCard items={environmentItems} progress={progressItems} subagents={subagents} running={running} />
        )}
      </div>
    </section>
  );
}
