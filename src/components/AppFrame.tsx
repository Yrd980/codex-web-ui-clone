import type { ReactNode } from "react";
import { useCallback, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
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

const MIN_DOCKED_SIDEBAR_WIDTH = 232;
const MAX_SIDEBAR_WIDTH = 336;
const COLLAPSE_SIDEBAR_WIDTH = 112;

function clampSidebarWidth(width: number) {
  return Math.min(Math.max(width, MIN_DOCKED_SIDEBAR_WIDTH), MAX_SIDEBAR_WIDTH);
}

export function AppFrame({ activeThreadId, groups, onOpenPalette, onSelectThread, onSetView, children }: AppFrameProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarDocked, setSidebarDocked] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(284);
  const resizingSidebarRef = useRef(false);

  const sidebarStyle = { "--sidebar-width": `${sidebarWidth}px` } as CSSProperties;
  const sidebarFloating = !sidebarDocked || sidebarOpen;

  const handleSetView = (view: ActiveView) => {
    onSetView(view);
    setSidebarOpen(false);
  };

  const handleSelectThread = (threadId: string) => {
    onSelectThread(threadId);
    setSidebarOpen(false);
  };

  const handleToggleSidebar = () => {
    if (!sidebarDocked) {
      setSidebarOpen((open) => !open);
      return;
    }

    setSidebarDocked(false);
    setSidebarOpen(true);
  };

  const startSidebarResize = useCallback((event: ReactMouseEvent<HTMLButtonElement> | ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || resizingSidebarRef.current || !sidebarDocked) return;

    event.preventDefault();
    resizingSidebarRef.current = true;
    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handleMove = (moveEvent: MouseEvent | PointerEvent) => {
      if (moveEvent.clientX < COLLAPSE_SIDEBAR_WIDTH) {
        setSidebarDocked(false);
        setSidebarOpen(true);
        return;
      }
      setSidebarWidth(clampSidebarWidth(moveEvent.clientX));
    };

    const handleUp = () => {
      resizingSidebarRef.current = false;
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  }, [sidebarDocked]);

  return (
    <div className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[var(--codex-window)] text-[var(--codex-text)]">
      <TopMenu onToggleSidebar={handleToggleSidebar} />
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {sidebarFloating ? (
          <button
            className="absolute inset-0 z-30 bg-[rgb(76_79_105_/_0.18)]"
            type="button"
            aria-label="Close sidebar"
            onClick={() => {
              setSidebarOpen(false);
              setSidebarDocked(true);
            }}
          />
        ) : null}
        <Sidebar
          activeThreadId={activeThreadId}
          groups={groups}
          onOpenPalette={onOpenPalette}
          onSelectThread={handleSelectThread}
          onSetView={handleSetView}
          open={sidebarOpen}
          docked={sidebarDocked}
          style={sidebarStyle}
        />
        {sidebarDocked ? (
          <button
            className="absolute inset-y-0 z-30 hidden w-3 -translate-x-1/2 cursor-col-resize touch-none bg-transparent outline-none lg:block"
            style={{ left: `${sidebarWidth}px` }}
            type="button"
            aria-label="Resize sidebar"
            onPointerDown={startSidebarResize}
            onMouseDown={startSidebarResize}
          />
        ) : null}
        <div className="h-full min-h-0 min-w-0 flex-1 overflow-hidden rounded-tl-[16px] border-l border-t border-[var(--codex-border-soft)] bg-[var(--codex-main)] shadow-[inset_1px_1px_0_rgb(255_255_255_/_0.32)] max-lg:rounded-tl-none max-lg:border-l-0">
          {children}
        </div>
      </div>
    </div>
  );
}
