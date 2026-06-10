import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
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

const SIDEBAR_MIN_RATIO = 0.13;
const SIDEBAR_MAX_RATIO = 0.2;
const SIDEBAR_DEFAULT_RATIO = 0.18;
const SIDEBAR_COLLAPSE_RATIO = 0.075;
const SIDEBAR_FLOATING_EDGE_RATIO = 0.031;

function getViewportWidth() {
  return typeof window === "undefined" ? 1440 : window.innerWidth;
}

function getSidebarBounds(containerWidth = getViewportWidth()) {
  const min = Math.round(containerWidth * SIDEBAR_MIN_RATIO);
  const max = Math.max(min, Math.round(containerWidth * SIDEBAR_MAX_RATIO));
  return { min, max };
}

function clampSidebarWidth(width: number, containerWidth = getViewportWidth()) {
  const { min, max } = getSidebarBounds(containerWidth);
  return Math.min(Math.max(width, min), max);
}

function getDefaultSidebarWidth() {
  return clampSidebarWidth(Math.round(getViewportWidth() * SIDEBAR_DEFAULT_RATIO));
}

function getCollapseSidebarWidth() {
  return Math.round(getViewportWidth() * SIDEBAR_COLLAPSE_RATIO);
}

export function AppFrame({ activeThreadId, groups, onOpenPalette, onSelectThread, onSetView, children }: AppFrameProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarDocked, setSidebarDocked] = useState(true);
  const [sidebarRatio, setSidebarRatio] = useState(SIDEBAR_DEFAULT_RATIO);
  const [viewportWidth, setViewportWidth] = useState(() => getViewportWidth());
  const resizingSidebarRef = useRef(false);

  const sidebarWidth = sidebarDocked ? clampSidebarWidth(Math.round(viewportWidth * sidebarRatio), viewportWidth) : getDefaultSidebarWidth();
  const sidebarStyle = {
    "--sidebar-width": `${sidebarWidth}px`,
    "--sidebar-floating-edge": `${Math.round(viewportWidth * SIDEBAR_FLOATING_EDGE_RATIO)}px`,
  } as CSSProperties;
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
      if (moveEvent.clientX < getCollapseSidebarWidth()) {
        setSidebarDocked(false);
        setSidebarOpen(true);
        return;
      }
      const nextWidth = clampSidebarWidth(moveEvent.clientX, window.innerWidth);
      setSidebarRatio(nextWidth / window.innerWidth);
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

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(getViewportWidth());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        <div className="h-full min-h-0 min-w-0 flex-1 overflow-hidden rounded-tl-[18px] border-l border-t border-[var(--codex-border-soft)] bg-[var(--codex-main)] shadow-[inset_1px_1px_0_rgb(255_255_255_/_0.32)] max-lg:rounded-tl-none max-lg:border-l-0">
          {children}
        </div>
      </div>
    </div>
  );
}
