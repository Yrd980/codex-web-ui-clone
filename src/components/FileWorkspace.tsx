import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useRef, useState } from "react";
import { fileTabs, fileTree } from "../data/scenarios/toolScenario";
import { CodexIcon } from "./CodexIcon";

interface FileWorkspaceProps {
  endControls?: ReactNode;
}

export function FileWorkspace({ endControls }: FileWorkspaceProps) {
  const [activeTabId, setActiveTabId] = useState(fileTabs[0]?.id ?? "");
  const [activePath, setActivePath] = useState(fileTree.find((item) => item.active)?.path ?? fileTree[0]?.path ?? "");
  const [filter, setFilter] = useState("");
  const [copied, setCopied] = useState(false);
  const [treeWidth, setTreeWidth] = useState(248);
  const [resizingTree, setResizingTree] = useState(false);
  const [treeHovered, setTreeHovered] = useState(false);
  const treeResizeRef = useRef(false);
  const activeTab = fileTabs.find((tab) => tab.id === activeTabId) ?? fileTabs[0];
  const visibleTree = fileTree.filter((item) => item.path.toLowerCase().includes(filter.toLowerCase()));
  const expandedFolders = new Set(["docs", "references", "superpowers", "plans", "visuals", "src", "actions"]);
  const treeRowHeight = 32;
  const treeRowGap = 2;
  const treeRowStep = treeRowHeight + treeRowGap;
  const treeIndent = 16;
  const treeRowInset = 7;
  const treeChevronCenter = treeRowInset + 8;
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
      const nextWidth = Math.min(340, Math.max(212, window.innerWidth - moveEvent.clientX));
      setTreeWidth(nextWidth);
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
    <div className="flex h-full min-w-0 flex-1 flex-col bg-[color-mix(in_oklab,var(--codex-surface)_78%,transparent)]">
      <header className="shrink-0 border-b border-[var(--codex-border-soft)]">
        <div className="flex h-14 items-center gap-2 px-3 text-[var(--codex-text-muted)]">
          <div className="flex min-w-0 flex-1 items-center gap-1">
            {fileTabs.map((tab) => (
              <button
                key={tab.id}
                className={["flex h-8 max-w-[32%] items-center gap-2 rounded-[9px] px-2.5 text-[13px]", tab.id === activeTabId ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "hover:bg-[var(--codex-hover)]"].join(" ")}
                type="button"
                onClick={() => {
                  setActiveTabId(tab.id);
                  setActivePath(tab.title);
                }}
              >
                <CodexIcon name="file" className="size-[15px]" />
                <span className="truncate">{tab.title}</span>
              </button>
            ))}
            <button className="grid size-8 shrink-0 place-items-center rounded-[9px] text-[var(--codex-text-faint)] hover:bg-[var(--codex-hover)]" type="button" aria-label="New file tab">
              <CodexIcon name="plus" className="size-[15px]" />
            </button>
          </div>
          {endControls}
        </div>
        <div className="flex h-12 items-center gap-2 px-5 text-[12px] text-[var(--codex-text-faint)]">
          <div className="min-w-0 flex-1 truncate">{activeTab?.path} / {activePath}</div>
          <button className="grid size-8 place-items-center rounded-[9px] hover:bg-[var(--codex-hover)]" type="button" aria-label="More file actions">
            <CodexIcon name="more" className="size-4" />
          </button>
          <button className="flex h-9 items-center gap-1.5 rounded-[11px] border border-[var(--codex-border-soft)] bg-[color-mix(in_oklab,var(--codex-surface-raised)_64%,transparent)] px-2.5 text-[var(--codex-text)] hover:bg-[var(--codex-hover)]" type="button">
            <CodexIcon name="terminal" className="size-[17px]" />
            <span>Open</span>
            <CodexIcon name="chevronDown" className="size-[14px] text-[var(--codex-text-faint)]" />
          </button>
          <button className="grid size-9 place-items-center rounded-[11px] bg-[color-mix(in_oklab,var(--codex-surface-raised)_64%,transparent)] hover:bg-[var(--codex-hover)]" type="button" aria-label="Open folder">
            <CodexIcon name="folder" className="size-[18px]" />
          </button>
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        <section className="flex min-w-0 flex-1 flex-col">
        <article className="min-h-0 flex-1 overflow-auto px-5 py-7 xl:px-8">
          <div className="max-w-[92%]">
            <h1 className="mb-5 text-[30px] font-medium leading-tight text-[var(--codex-text)]">{activePath}</h1>
            <p className="mb-4 text-[15px] leading-7 text-[var(--codex-text-muted)]">
              The first implementation should open directly into a Codex-style workbench and preserve the current thread while files are inspected.
            </p>
            <h2 className="mb-3 mt-8 text-[18px] font-medium">Confirmed prototype direction</h2>
            <ul className="mb-6 space-y-2 text-[14px] text-[var(--codex-text-muted)]">
              <li>Use Vite, React, TypeScript, and Tailwind CSS v4.</li>
              <li>Keep Codex theme values in editable CSS variables.</li>
              <li>Use static data first; visual and interaction fidelity matter more than backend behavior.</li>
            </ul>
            <div className="overflow-hidden rounded-[14px] bg-[var(--codex-surface-muted)] text-[12px] leading-6">
              <div className="flex h-10 items-center justify-between border-b border-[color-mix(in_oklab,var(--codex-border-soft)_72%,transparent)] px-4 text-[12px] text-[var(--codex-text-faint)]">
                <span className="shrink-0 pr-5 font-medium">html</span>
                <button
                  className="grid size-8 shrink-0 place-items-center rounded-[9px] transition-colors duration-[var(--codex-motion-fast)] ease-[var(--codex-motion-ease)] hover:bg-[var(--codex-hover)]"
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
              <div className="overflow-x-auto rounded-b-[14px] [scrollbar-gutter:stable]">
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
          className="hidden shrink-0 bg-[color-mix(in_oklab,var(--codex-surface)_86%,transparent)] px-2.5 py-3 text-[13px] text-[var(--codex-text-muted)] lg:block"
          style={{ width: treeWidth }}
        >
          <label className="mb-2 flex h-9 items-center gap-2 rounded-[10px] border border-[var(--codex-border-soft)] bg-[color-mix(in_oklab,var(--codex-surface-raised)_44%,transparent)] px-2.5 text-[var(--codex-text-faint)]">
            <CodexIcon name="search" className="size-[15px] shrink-0" />
            <input className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[var(--codex-text-faint)]" placeholder="Filter files..." value={filter} onChange={(event) => setFilter(event.currentTarget.value)} />
          </label>
          <div className="relative" onMouseEnter={() => setTreeHovered(true)} onMouseLeave={() => setTreeHovered(false)} onFocus={() => setTreeHovered(true)} onBlur={() => setTreeHovered(false)}>
            {treeGuides.map((guide) => (
              <span
                key={guide.key}
                className={[
                  "pointer-events-none absolute z-0 w-px bg-[var(--codex-border-soft)] transition-opacity duration-[var(--codex-motion-fast)] ease-[var(--codex-motion-ease)]",
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
                    "group/tree-row relative z-10 mb-0.5 flex h-8 w-full items-center gap-1.5 rounded-[7px] border border-transparent pr-2 text-left transition-colors duration-[var(--codex-motion-fast)] ease-[var(--codex-motion-ease)]",
                    active ? "bg-[color-mix(in_oklab,var(--codex-accent)_7%,transparent)] text-[var(--codex-text)] shadow-[inset_2px_0_0_var(--codex-accent)]" : "hover:bg-[var(--codex-hover)]",
                  ].join(" ")}
                  style={{ paddingLeft: treeRowInset + item.depth * treeIndent }}
                  type="button"
                  onClick={() => setActivePath(item.path)}
                >
                  <span className="grid size-4 shrink-0 place-items-center text-[var(--codex-text-faint)]">
                    {isFolder ? <CodexIcon name={expanded ? "chevronDown" : "chevronRight"} className="size-[14px]" /> : null}
                  </span>
                  <CodexIcon name={isFolder ? "folder" : "file"} className={["size-[15px] shrink-0", isFolder ? "text-[var(--codex-text-muted)]" : "text-[var(--codex-accent)]"].join(" ")} />
                  <span className="min-w-0 flex-1 truncate leading-none">{item.path}</span>
                  {item.status ? <span className="ml-1 shrink-0 text-[11px] leading-none text-[var(--codex-diff-added)]">M</span> : null}
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
