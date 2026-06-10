import { fileTabs, fileTree } from "../data/mockData";
import { CodexIcon } from "./CodexIcon";

export function FileWorkspace() {
  return (
    <div className="flex h-full min-w-0 flex-1 bg-[color-mix(in_oklab,var(--codex-surface)_78%,transparent)]">
      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-11 items-center gap-1 border-b border-[var(--codex-border-soft)] px-3">
          {fileTabs.map((tab) => (
            <button
              key={tab.id}
              className={[
                "flex h-8 max-w-[280px] items-center gap-2 rounded-[9px] px-3 text-[12px]",
                tab.active ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "text-[var(--codex-text-muted)] hover:bg-[var(--codex-hover)]",
              ].join(" ")}
              type="button"
            >
              <CodexIcon name="file" className="size-4" />
              <span className="truncate">{tab.title}</span>
            </button>
          ))}
        </div>
        <div className="h-10 truncate border-b border-[var(--codex-border-soft)] px-5 py-2 text-[12px] text-[var(--codex-text-faint)]">
          docs / superpowers / specs / 2026-06-10-codex-web-ui-ux-clone-design.md
        </div>
        <article className="min-h-0 flex-1 overflow-auto px-5 py-7 xl:px-8">
          <div className="max-w-[860px]">
            <h1 className="mb-5 text-[30px] font-medium leading-tight text-[var(--codex-text)]">Codex App UI/UX Web Clone Spec</h1>
            <p className="mb-4 text-[15px] leading-7 text-[var(--codex-text-muted)]">
              The first implementation should be a runnable static-data prototype, not another design-only artifact.
            </p>
            <h2 className="mb-3 mt-8 text-[18px] font-medium">Confirmed stack</h2>
            <ul className="mb-6 space-y-2 text-[14px] text-[var(--codex-text-muted)]">
              <li>Vite, React, TypeScript.</li>
              <li>Tailwind CSS v4 with the Tailwind Vite plugin.</li>
              <li>No component library in the first pass.</li>
            </ul>
            <div className="relative rounded-[14px] bg-[var(--codex-surface-muted)] p-4 text-[12px] leading-6">
              <button className="absolute right-3 top-3 grid size-8 place-items-center rounded-[9px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Copy code">
                <CodexIcon name="copy" className="size-4" />
              </button>
              <pre>{`export default defineConfig({
  plugins: [react(), tailwindcss()],
});`}</pre>
            </div>
          </div>
        </article>
      </section>
      <aside className="hidden w-[220px] shrink-0 border-l border-[var(--codex-border-soft)] p-3 text-[12px] text-[var(--codex-text-muted)] lg:block 2xl:w-[248px]">
        <div className="mb-3 flex h-9 items-center gap-2 rounded-[10px] border border-[var(--codex-border-soft)] bg-[color-mix(in_oklab,var(--codex-surface-raised)_55%,transparent)] px-3 text-[var(--codex-text-faint)]">
          <CodexIcon name="search" className="size-4" />
          <span>Filter files...</span>
        </div>
        {fileTree.map((item) => (
          <div
            key={item.path}
            className={["flex h-7 items-center gap-2 rounded-[8px] px-2", item.active ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : ""].join(" ")}
            style={{ paddingLeft: 8 + item.depth * 12 }}
          >
            <span className="truncate">{item.path}</span>
            {item.status ? <span className="ml-auto text-[var(--codex-diff-added)]">M</span> : null}
          </div>
        ))}
      </aside>
    </div>
  );
}
