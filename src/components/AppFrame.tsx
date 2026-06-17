import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from "react";
import { clampSidebarWidth, codexShellGeometryDefaults, getSidebarBounds, getSidebarFrame, getViewportWidth } from "../layout/codexShellGeometry";
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
  const [sidebarDocked, setSidebarDocked] = useState(true);
  const [sidebarRatio, setSidebarRatio] = useState(codexShellGeometryDefaults.sidebarRatio);
  const [viewportWidth, setViewportWidth] = useState(() => getViewportWidth());
  const [sidebarResizing, setSidebarResizing] = useState(false);
  const [sidebarOpenedByHover, setSidebarOpenedByHover] = useState(false);
  const resizingSidebarRef = useRef(false);
  const ignoreMouseResizeRef = useRef(false);

  const sidebarFrame = getSidebarFrame({ docked: sidebarDocked, ratio: sidebarRatio, viewportWidth });
  const sidebarFloating = !sidebarDocked;

  const handleSetView = (view: ActiveView) => {
    onSetView(view);
    if (sidebarFloating) {
      setSidebarOpen(false);
      setSidebarOpenedByHover(false);
    }
  };

  const handleSelectThread = (threadId: string) => {
    onSelectThread(threadId);
    if (sidebarFloating) {
      setSidebarOpen(false);
      setSidebarOpenedByHover(false);
    }
  };

  const handleToggleSidebar = () => {
    setSidebarOpenedByHover(false);

    if (sidebarDocked) {
      setSidebarOpen(false);
      setSidebarDocked(false);
      return;
    }

    setSidebarOpen(false);
    setSidebarDocked(true);
  };

  const startSidebarResize = useCallback((event: ReactMouseEvent<HTMLButtonElement> | ReactPointerEvent<HTMLButtonElement>) => {
    if (event.type === "mousedown" && ignoreMouseResizeRef.current) return;
    if (event.button !== 0 || resizingSidebarRef.current || !sidebarDocked) return;

    event.preventDefault();
    const resizeHandle = event.currentTarget;
    const pointerId = "pointerId" in event ? event.pointerId : null;
    if ("pointerId" in event && event.currentTarget.hasPointerCapture?.(event.pointerId) === false) {
      ignoreMouseResizeRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      window.setTimeout(() => {
        ignoreMouseResizeRef.current = false;
      }, 250);
    }
    resizingSidebarRef.current = true;
    setSidebarResizing(true);
    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const finishResize = () => {
      resizingSidebarRef.current = false;
      setSidebarResizing(false);
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      if (pointerId !== null && resizeHandle.hasPointerCapture?.(pointerId)) {
        resizeHandle.releasePointerCapture(pointerId);
      }
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    const floatSidebar = () => {
      finishResize();
      setSidebarOpen(false);
      setSidebarOpenedByHover(false);
      setSidebarDocked(false);
      requestAnimationFrame(() => {
        setSidebarOpen(true);
        setSidebarOpenedByHover(true);
      });
    };

    const handleMove = (moveEvent: MouseEvent | PointerEvent) => {
      moveEvent.preventDefault();
      const sidebarMinWidth = getSidebarBounds(window.innerWidth).min;
      if (moveEvent.clientX <= sidebarMinWidth) {
        floatSidebar();
        return;
      }
      const nextWidth = clampSidebarWidth(moveEvent.clientX, window.innerWidth);
      setSidebarRatio(nextWidth / window.innerWidth);
    };

    const handleUp = () => {
      finishResize();
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
      <TopMenu sidebarDocked={sidebarDocked} sidebarOpen={sidebarOpen} onToggleSidebar={handleToggleSidebar} />
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {sidebarFloating && !sidebarOpen ? (
          <div
            className="codex-layer-drawer absolute inset-y-0 left-0 w-3"
            aria-hidden="true"
            onMouseEnter={() => {
              setSidebarOpenedByHover(true);
              setSidebarOpen(true);
            }}
            onPointerEnter={() => {
              setSidebarOpenedByHover(true);
              setSidebarOpen(true);
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
          style={sidebarFrame.style}
          onFloatingMouseLeave={() => {
            if (!sidebarOpenedByHover) return;
            setSidebarOpen(false);
            setSidebarOpenedByHover(false);
          }}
        />
        {sidebarDocked ? (
          <button
            className={[
              "codex-layer-popover group absolute inset-y-0 hidden w-6 -translate-x-1/2 cursor-col-resize touch-none bg-transparent outline-none lg:block",
              sidebarResizing ? "bg-[color-mix(in_oklab,var(--codex-accent)_8%,transparent)]" : "",
            ].join(" ")}
            style={{ left: `${sidebarFrame.width}px` }}
            type="button"
            aria-label="Resize sidebar"
            onPointerDown={startSidebarResize}
            onMouseDown={startSidebarResize}
          >
            <span
              className={[
                "absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-transparent transition-colors duration-[var(--codex-motion-fast)] ease-[var(--codex-motion-ease)]",
                "group-hover:bg-[color-mix(in_oklab,var(--codex-accent)_42%,transparent)] group-focus-visible:bg-[var(--codex-accent)]",
                sidebarResizing ? "bg-[var(--codex-accent)]" : "",
              ].join(" ")}
            />
          </button>
        ) : null}
        <div className="h-full min-h-0 min-w-0 flex-1 overflow-hidden rounded-tl-[1.125rem] border-l border-t border-[var(--codex-border-soft)] bg-[var(--codex-main)] shadow-[inset_0.0625rem_0.0625rem_0_rgb(255_255_255_/_0.32)] max-lg:rounded-tl-none max-lg:border-l-0">
          {children}
        </div>
      </div>
    </div>
  );
}
