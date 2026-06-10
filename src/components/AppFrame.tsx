import type { ReactNode } from "react";
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
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-[var(--codex-window)] text-[var(--codex-text)]">
      <TopMenu />
      <div className="flex min-h-0 flex-1">
        <Sidebar
          activeThreadId={activeThreadId}
          groups={groups}
          onOpenPalette={onOpenPalette}
          onSelectThread={onSelectThread}
          onSetView={onSetView}
        />
        <div className="min-w-0 flex-1 rounded-tl-[18px] border-l border-t border-[var(--codex-border-soft)] bg-[var(--codex-main)] shadow-[inset_1px_1px_0_rgb(255_255_255_/_0.32)]">
          {children}
        </div>
      </div>
    </div>
  );
}
