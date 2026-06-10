import type { ReactNode } from "react";
import { useState } from "react";
import type { ActiveView, ProjectGroup } from "../types";
import { Sidebar } from "./Sidebar";
import { TopMenu } from "./TopMenu";

interface AppFrameProps {
  activeThreadId: string;
  groups: ProjectGroup[];
  onOpenPalette: () => void;
  onSelectThread: (threadId: string) => void;
  onSetView: (view: ActiveView) => void;
  children: ReactNode;
}

export function AppFrame({ activeThreadId, groups, onOpenPalette, onSelectThread, onSetView, children }: AppFrameProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSetView = (view: ActiveView) => {
    onSetView(view);
    setSidebarOpen(false);
  };

  const handleSelectThread = (threadId: string) => {
    onSelectThread(threadId);
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-[var(--codex-window)] text-[var(--codex-text)]">
      <TopMenu onToggleSidebar={() => setSidebarOpen((open) => !open)} />
      <div className="relative flex min-h-0 flex-1">
        {sidebarOpen ? <button className="absolute inset-0 z-30 bg-[rgb(76_79_105_/_0.18)] md:hidden" type="button" aria-label="Close sidebar" onClick={() => setSidebarOpen(false)} /> : null}
        <Sidebar
          activeThreadId={activeThreadId}
          groups={groups}
          onOpenPalette={onOpenPalette}
          onSelectThread={handleSelectThread}
          onSetView={handleSetView}
          open={sidebarOpen}
        />
        <div className="min-w-0 flex-1 rounded-tl-[16px] border-l border-t border-[var(--codex-border-soft)] bg-[var(--codex-main)] shadow-[inset_1px_1px_0_rgb(255_255_255_/_0.32)] max-md:rounded-tl-none max-md:border-l-0">
          {children}
        </div>
      </div>
    </div>
  );
}
