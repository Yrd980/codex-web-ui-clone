import { useState } from "react";
import { fileTabs, fileTree } from "../data/mockData";
import { CodexIcon } from "./CodexIcon";

export function FileWorkspace() {
  const [activeTabId, setActiveTabId] = useState(fileTabs[0]?.id ?? "");
  const [activePath, setActivePath] = useState(fileTree.find((item) => item.active)?.path ?? fileTree[0]?.path ?? "");
  const [filter, setFilter] = useState("");
  const [copied, setCopied] = useState(false);
  const activeTab = fileTabs.find((tab) => tab.id === activeTabId) ?? fileTabs[0];
  const visibleTree = fileTree.filter((item) => item.path.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="flex h-full min-w-0 flex-1 bg-[color-mix(in_oklab,var(--codex-surface)_78%,transparent)]">
      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-11 items-center gap-1 border-b border-[var(--codex-border-soft)] px-3">
          {fileTabs.map((tab) => (
            <button
              key={tab.id}
              className={["flex h-8 max-w-[32%] items-center gap-2 rounded-[9px] px-3 text-[12px]", tab.id === activeTabId ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "text-[var(--codex-text-muted)] hover:bg-[var(--codex-hover)]"].join(" ")}
              type="button"
              onClick={() => {
                setActiveTabId(tab.id);
                setActivePath(tab.title);
              }}
            >
              <CodexIcon name="file" className="size-4" />
              <span className="truncate">{tab.title}</span>
            </button>
          ))}
        </div>
        <div className="h-10 truncate border-b border-[var(--codex-border-soft)] px-5 py-2 text-[12px] text-[var(--codex-text-faint)]">
          {activeTab?.path} / {activePath}
        </div>
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
            <div className="relative rounded-[14px] bg-[var(--codex-surface-muted)] p-4 text-[12px] leading-6">
              <button
                className="absolute right-3 top-3 grid size-8 place-items-center rounded-[9px] hover:bg-[var(--codex-hover)]"
                type="button"
                aria-label="Copy code"
                onClick={() => {
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1000);
                }}
              >
                <CodexIcon name={copied ? "check" : "copy"} className="size-4" />
              </button>
              <pre>{`export default defineConfig({
  plugins: [react(), tailwindcss()],
});`}</pre>
            </div>
          </div>
        </article>
      </section>
      <aside className="hidden w-[26%] shrink-0 border-l border-[var(--codex-border-soft)] p-3 text-[12px] text-[var(--codex-text-muted)] lg:block">
        <label className="mb-3 flex h-9 items-center gap-2 rounded-[10px] border border-[var(--codex-border-soft)] bg-[color-mix(in_oklab,var(--codex-surface-raised)_55%,transparent)] px-3 text-[var(--codex-text-faint)]">
          <CodexIcon name="search" className="size-4" />
          <input className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[var(--codex-text-faint)]" placeholder="Filter files..." value={filter} onChange={(event) => setFilter(event.currentTarget.value)} />
        </label>
        {visibleTree.map((item) => (
          <button
            key={item.path}
            className={["flex h-7 w-full items-center gap-2 rounded-[8px] px-2 text-left", item.path === activePath ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "hover:bg-[var(--codex-hover)]"].join(" ")}
            style={{ paddingLeft: 8 + item.depth * 12 }}
            type="button"
            onClick={() => setActivePath(item.path)}
          >
            <span className="truncate">{item.path}</span>
            {item.status ? <span className="ml-auto text-[var(--codex-diff-added)]">M</span> : null}
          </button>
        ))}
      </aside>
    </div>
  );
}
