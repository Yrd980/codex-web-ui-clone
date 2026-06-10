import { diffFiles, fileTree } from "../data/mockData";
import { CodexIcon } from "./CodexIcon";

export function ReviewWorkspace() {
  return (
    <div className="flex h-full min-w-0 flex-1 border-l border-[var(--codex-border-soft)] bg-[color-mix(in_oklab,var(--codex-surface)_78%,transparent)]">
      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-11 items-center gap-1 border-b border-[var(--codex-border-soft)] px-3">
          {["Review", "Terminal", "Browser"].map((tab) => (
            <button
              key={tab}
              className={[
                "h-8 rounded-[9px] px-3 text-[12px]",
                tab === "Review" ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "text-[var(--codex-text-muted)] hover:bg-[var(--codex-hover)]",
              ].join(" ")}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex h-12 items-center gap-2 border-b border-[var(--codex-border-soft)] px-3 text-[12px] text-[var(--codex-text-muted)]">
          <button className="h-8 rounded-[9px] bg-[var(--codex-surface-muted)] px-3" type="button">
            Last turn
          </button>
          <span className="text-[var(--codex-diff-added)]">+97</span>
          <span className="text-[var(--codex-diff-removed)]">-7</span>
          <span className="flex-1" />
          <button className="grid size-8 place-items-center rounded-[9px] hover:bg-[var(--codex-hover)]" type="button" aria-label="More">
            <CodexIcon name="more" className="size-4" />
          </button>
          <button className="h-8 rounded-[9px] bg-[var(--codex-surface-muted)] px-3" type="button">
            Commit
          </button>
          <button className="h-8 rounded-[9px] bg-[var(--codex-surface-muted)] px-3 text-[var(--codex-text-faint)]" type="button">
            Create PR
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-4">
          {diffFiles.map((file) => (
            <div key={file.path} className="overflow-hidden rounded-[12px] border border-[var(--codex-border-soft)] bg-[var(--codex-surface-raised)]">
              <div className="flex h-10 items-center gap-2 border-b border-[var(--codex-border-soft)] px-3 text-[12px]">
                <CodexIcon name="file" className="size-4 text-[var(--codex-text-muted)]" />
                <span className="min-w-0 flex-1 truncate">{file.path}</span>
                <span className="text-[var(--codex-diff-added)]">+{file.additions}</span>
                <span className="text-[var(--codex-diff-removed)]">-{file.removals}</span>
              </div>
              <pre className="m-0 bg-[color-mix(in_oklab,var(--codex-surface-muted)_50%,transparent)] py-2 text-[12px] leading-6">
                {file.lines.map((line, index) => (
                  <div
                    key={`${line.text}-${index}`}
                    className={[
                      "grid grid-cols-[48px_48px_1fr] px-3",
                      line.kind === "add" ? "bg-[color-mix(in_oklab,var(--codex-diff-added)_13%,transparent)]" : "",
                      line.kind === "remove" ? "bg-[color-mix(in_oklab,var(--codex-diff-removed)_12%,transparent)]" : "",
                      line.kind === "meta" ? "text-[var(--codex-text-faint)]" : "",
                    ].join(" ")}
                  >
                    <span className="text-right text-[var(--codex-text-faint)]">{line.oldLine ?? ""}</span>
                    <span className="text-right text-[var(--codex-text-faint)]">{line.newLine ?? ""}</span>
                    <code className="pl-4">{line.text}</code>
                  </div>
                ))}
              </pre>
            </div>
          ))}
        </div>
      </section>
      <aside className="hidden w-[248px] shrink-0 border-l border-[var(--codex-border-soft)] p-3 text-[12px] text-[var(--codex-text-muted)] lg:block">
        <div className="mb-3 rounded-[9px] bg-[var(--codex-surface-raised)] px-3 py-2 text-[var(--codex-text-faint)]">Search files</div>
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
