import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useRef, useState } from "react";
import { fileTabs, fileTree } from "../data/scenarios/toolScenario";
import { CodexIcon } from "./CodexIcon";

interface FileWorkspaceProps {
  endControls?: ReactNode;
}

const TREE_DEFAULT_RATIO = 0.24;
const TREE_MIN_RATIO = 0.18;
const TREE_MAX_RATIO = 0.32;
const TREE_ROW_HEIGHT_REM = 2;
const TREE_ROW_GAP_REM = 0.125;
const TREE_INDENT_REM = 1;
const TREE_ROW_INSET_REM = 0.4375;
const REM_IN_PX = 16;

function rem(value: number) {
  return value * REM_IN_PX;
}

export function FileWorkspace({ endControls }: FileWorkspaceProps) {
  const [activeTabId, setActiveTabId] = useState(fileTabs[0]?.id ?? "");
  const [activePath, setActivePath] = useState(fileTree.find((item) => item.active)?.path ?? fileTree[0]?.path ?? "");
  const [filter, setFilter] = useState("");
  const [copied, setCopied] = useState(false);
  const [treeRatio, setTreeRatio] = useState(TREE_DEFAULT_RATIO);
  const [resizingTree, setResizingTree] = useState(false);
  const [treeHovered, setTreeHovered] = useState(false);
  const treeResizeRef = useRef(false);
  const activeTab = fileTabs.find((tab) => tab.id === activeTabId) ?? fileTabs[0];
  const visibleTree = fileTree.filter((item) => item.path.toLowerCase().includes(filter.toLowerCase()));
  const expandedFolders = new Set(["docs", "references", "superpowers", "plans", "visuals", "src", "actions"]);
  const treeRowHeight = rem(TREE_ROW_HEIGHT_REM);
  const treeRowGap = rem(TREE_ROW_GAP_REM);
  const treeRowStep = treeRowHeight + treeRowGap;
  const treeIndent = rem(TREE_INDENT_REM);
  const treeRowInset = rem(TREE_ROW_INSET_REM);
  const treeChevronCenter = treeRowInset + rem(0.5);
  const treeGuides = visibleTree.flatMap((item, index) => {
    const isFolder = !item.path.includes(".");
    if (!isFolder) return [];
    const nextIndex = visibleTree.findIndex((candidate, candidateIndex) => candidateIndex > index && candidate.depth <= item.depth);
    const endIndex = nextIndex === -1 ? visibleTree.length : nextIndex;
    if (endIndex <= index + 1) return [];
    return [
      {
        key: `${item.path}-${index}`,
        depth: item.depth,
        top: index * treeRowStep + treeRowHeight,
        height: (endIndex - index - 1) * treeRowStep,
      },
    ];
  });

  const startTreeResize = (event: ReactPointerEvent<HTMLButtonElement> | ReactMouseEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || treeResizeRef.current) return;
    event.preventDefault();
    treeResizeRef.current = true;
    setResizingTree(true);
    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handleMove = (moveEvent: MouseEvent | PointerEvent) => {
      moveEvent.preventDefault();
      const width = window.innerWidth;
      const nextRatio = (width - moveEvent.clientX) / width;
      setTreeRatio(Math.min(TREE_MAX_RATIO, Math.max(TREE_MIN_RATIO, nextRatio)));
    };

    const finishResize = () => {
      treeResizeRef.current = false;
      setResizingTree(false);
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", finishResize);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", finishResize);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", finishResize);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", finishResize);
  };

  return (
    <div className="codex-panel-root flex h-full min-w-0 flex-1 flex-col">
      <header className="shrink-0 border-b border-[var(--codex-border-soft)]">
        <div className="codex-panel-bar flex items-center gap-2 px-3">
          <div className="flex min-w-0 flex-1 items-center gap-1">
            {fileTabs.map((tab) => (
              <button
                key={tab.id}
                className="codex-tab-button"
                data-active={tab.id === activeTabId}
                type="button"
                onClick={() => {
                  setActiveTabId(tab.id);
                  setActivePath(tab.title);
                }}
              >
                <CodexIcon name="file" className="size-[0.9375rem]" />
                <span className="truncate">{tab.title}</span>
              </button>
            ))}
            <button className="codex-icon-button !size-[var(--codex-control-sm)] shrink-0 text-[var(--codex-text-faint)]" type="button" aria-label="New file tab">
              <CodexIcon name="plus" className="size-[0.9375rem]" />
            </button>
          </div>
          {endControls}
        </div>
        <div className="codex-subbar flex items-center gap-2 px-5">
          <div className="min-w-0 flex-1 truncate">{activeTab?.path} / {activePath}</div>
          <button className="codex-icon-button !size-[var(--codex-control-sm)]" type="button" aria-label="More file actions">
            <CodexIcon name="more" className="size-4" />
          </button>
          <button className="codex-command-button text-[var(--codex-text)]" type="button">
            <CodexIcon name="terminal" className="size-[1.0625rem]" />
            <span>Open</span>
            <CodexIcon name="chevronDown" className="size-[0.875rem] text-[var(--codex-text-faint)]" />
          </button>
          <button className="codex-icon-button bg-[color-mix(in_oklab,var(--codex-surface-raised)_64%,transparent)]" type="button" aria-label="Open folder">
            <CodexIcon name="folder" className="codex-icon-md" />
          </button>
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        <section className="flex min-w-0 flex-1 flex-col">
        <article className="min-h-0 flex-1 overflow-auto px-5 py-7 xl:px-8">
          <div className="max-w-[var(--codex-document-measure)]">
            <h1 className="mb-5 text-[1.875rem] font-medium leading-tight text-[var(--codex-text)]">{activePath}</h1>
            <p className="mb-4 text-[0.9375rem] leading-7 text-[var(--codex-text-muted)]">
              The first implementation should open directly into a Codex-style workbench and preserve the current thread while files are inspected.
            </p>
            <h2 className="mb-3 mt-8 text-[1.125rem] font-medium">Confirmed prototype direction</h2>
            <ul className="mb-6 space-y-2 text-[0.875rem] text-[var(--codex-text-muted)]">
              <li>Use Vite, React, TypeScript, and Tailwind CSS v4.</li>
              <li>Keep Codex theme values in editable CSS variables.</li>
              <li>Use static data first; visual and interaction fidelity matter more than backend behavior.</li>
            </ul>
            <div className="codex-code-card">
              <div className="codex-compact-bar flex items-center justify-between border-b border-[color-mix(in_oklab,var(--codex-border-soft)_72%,transparent)] px-4">
                <span className="shrink-0 pr-5 font-medium">html</span>
                <button
                  className="codex-icon-button !size-[var(--codex-control-sm)] shrink-0"
                  type="button"
                  aria-label="Copy code"
                  onClick={() => {
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1000);
                  }}
                >
                  <CodexIcon name={copied ? "check" : "copy"} className="size-4" />
                </button>
              </div>
              <div className="overflow-x-auto rounded-b-[var(--codex-radius-md)] [scrollbar-gutter:stable]">
                <pre className="min-w-[34rem] px-4 pb-4 pt-2">{`<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <title>Codex App Web Clone</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`}</pre>
              </div>
            </div>
          </div>
        </article>
        </section>
        <button
          className={[
            "group relative hidden w-2 shrink-0 cursor-col-resize touch-none outline-none lg:block",
            resizingTree ? "bg-[color-mix(in_oklab,var(--codex-accent)_7%,transparent)]" : "",
          ].join(" ")}
          type="button"
          aria-label="Resize file tree"
          onPointerDown={startTreeResize}
          onMouseDown={startTreeResize}
        >
          <span
            className={[
              "absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[var(--codex-border-soft)] transition-colors duration-[var(--codex-motion-fast)] ease-[var(--codex-motion-ease)]",
              "group-hover:bg-[color-mix(in_oklab,var(--codex-accent)_45%,transparent)]",
              resizingTree ? "bg-[var(--codex-accent)]" : "",
            ].join(" ")}
          />
        </button>
        <aside
          className="hidden shrink-0 bg-[color-mix(in_oklab,var(--codex-surface)_86%,transparent)] px-2.5 py-3 text-[0.8125rem] text-[var(--codex-text-muted)] lg:block"
          style={{ width: `${treeRatio * 100}vw` }}
        >
          <label className="codex-field mb-2">
            <CodexIcon name="search" className="size-[0.9375rem] shrink-0" />
            <input className="min-w-0 flex-1 bg-transparent text-[0.8125rem] outline-none placeholder:text-[var(--codex-text-faint)]" placeholder="Filter files..." value={filter} onChange={(event) => setFilter(event.currentTarget.value)} />
          </label>
          <div className="relative" onMouseEnter={() => setTreeHovered(true)} onMouseLeave={() => setTreeHovered(false)} onFocus={() => setTreeHovered(true)} onBlur={() => setTreeHovered(false)}>
            {treeGuides.map((guide) => (
              <span
                key={guide.key}
                className={[
                  "codex-layer-ground pointer-events-none absolute w-px bg-[var(--codex-border-soft)] transition-opacity duration-[var(--codex-motion-fast)] ease-[var(--codex-motion-ease)]",
                  treeHovered ? "opacity-100" : "opacity-0",
                ].join(" ")}
                style={{ left: treeChevronCenter + guide.depth * treeIndent, top: guide.top, height: guide.height }}
              />
            ))}
            {visibleTree.map((item, index) => {
              const isFolder = !item.path.includes(".");
              const expanded = expandedFolders.has(item.path);
              const active = item.path === activePath;
              return (
                <button
                  key={item.path}
                  className={[
                    "codex-layer-panel group/tree-row relative mb-0.5 flex h-8 w-full items-center gap-1.5 rounded-[0.4375rem] border border-transparent pr-2 text-left transition-colors duration-[var(--codex-motion-fast)] ease-[var(--codex-motion-ease)]",
                    active ? "bg-[color-mix(in_oklab,var(--codex-accent)_7%,transparent)] text-[var(--codex-text)] shadow-[inset_0.125rem_0_0_var(--codex-accent)]" : "hover:bg-[var(--codex-hover)]",
                  ].join(" ")}
                  style={{ paddingLeft: treeRowInset + item.depth * treeIndent }}
                  type="button"
                  onClick={() => setActivePath(item.path)}
                >
                  <span className="grid size-4 shrink-0 place-items-center text-[var(--codex-text-faint)]">
                    {isFolder ? <CodexIcon name={expanded ? "chevronDown" : "chevronRight"} className="size-[0.875rem]" /> : null}
                  </span>
                  <CodexIcon name={isFolder ? "folder" : "file"} className={["size-[0.9375rem] shrink-0", isFolder ? "text-[var(--codex-text-muted)]" : "text-[var(--codex-accent)]"].join(" ")} />
                  <span className="min-w-0 flex-1 truncate leading-none">{item.path}</span>
                  {item.status ? <span className="ml-1 shrink-0 text-[0.6875rem] leading-none text-[var(--codex-diff-added)]">M</span> : null}
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
