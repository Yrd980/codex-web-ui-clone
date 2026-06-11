import { useState } from "react";
import { diffFiles, fileTree } from "../data/scenarios/toolScenario";
import type { ActiveView, ReviewScope } from "../types";
import { CodexIcon } from "./CodexIcon";

interface ReviewWorkspaceProps {
  onSetView: (view: ActiveView) => void;
}

export function ReviewWorkspace({ onSetView }: ReviewWorkspaceProps) {
  const [scope, setScope] = useState<ReviewScope>("Last turn");
  const [stageFilter, setStageFilter] = useState<"Unstaged" | "Staged">("Unstaged");
  const [commentLine, setCommentLine] = useState<string | null>(null);
  const [staged, setStaged] = useState(false);
  const [commitState, setCommitState] = useState<"idle" | "committed">("idle");
  const [prState, setPrState] = useState<"idle" | "created">("idle");
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="flex h-full min-w-0 flex-1 bg-[color-mix(in_oklab,var(--codex-surface)_78%,transparent)]">
      <section className="flex min-w-0 flex-1 flex-col">
        <div className="relative flex h-11 items-center gap-1 border-b border-[var(--codex-border-soft)] px-3">
          {["Review", "Terminal", "Browser"].map((tab) => (
            <button
              key={tab}
              className={[
                "h-8 rounded-[9px] px-3 text-[12px]",
                tab === "Review" ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "text-[var(--codex-text-muted)] hover:bg-[var(--codex-hover)]",
              ].join(" ")}
              type="button"
              onClick={() => {
                if (tab === "Terminal") onSetView("terminal");
                if (tab === "Browser") onSetView("browser");
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex h-12 items-center gap-2 border-b border-[var(--codex-border-soft)] px-3 text-[12px] text-[var(--codex-text-muted)]">
          {(["Last turn", "Uncommitted", "All branch changes"] as ReviewScope[]).map((item) => (
            <button
              key={item}
              className={["h-8 rounded-[9px] px-3", scope === item ? "bg-[var(--codex-surface-muted)] text-[var(--codex-text)]" : "hover:bg-[var(--codex-hover)]"].join(" ")}
              type="button"
              onClick={() => setScope(item)}
            >
              {item}
            </button>
          ))}
          <span className="mx-1 h-5 w-px bg-[var(--codex-border-soft)]" />
          {(["Unstaged", "Staged"] as const).map((item) => (
            <button
              key={item}
              className={["h-8 rounded-[9px] px-2.5", stageFilter === item ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "hover:bg-[var(--codex-hover)]"].join(" ")}
              type="button"
              onClick={() => setStageFilter(item)}
            >
              {item}
            </button>
          ))}
          <span className="text-[var(--codex-diff-added)]">+{staged ? 97 : 119}</span>
          <span className="text-[var(--codex-diff-removed)]">-{staged ? 7 : 0}</span>
          <span className="flex-1" />
          <div className="relative">
            <button className="grid size-8 place-items-center rounded-[9px] hover:bg-[var(--codex-hover)]" type="button" aria-label="More" onClick={() => setMoreOpen((open) => !open)}>
              <CodexIcon name="more" className="size-4" />
            </button>
            {moreOpen ? (
              <div className="absolute right-0 top-full z-30 mt-1 w-[18vw] rounded-[12px] border border-[var(--codex-border-soft)] bg-[var(--codex-surface-raised)] p-1.5 shadow-[var(--codex-shadow-soft)]">
                {["Revert hunk", "Copy file path", "Open in files"].map((item) => (
                  <button
                    key={item}
                    className="flex h-8 w-full items-center rounded-[8px] px-2 text-left text-[12px] hover:bg-[var(--codex-hover)]"
                    type="button"
                    onClick={() => {
                      if (item === "Open in files") onSetView("files");
                      setMoreOpen(false);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <button
            className="h-8 rounded-[9px] bg-[var(--codex-surface-muted)] px-3"
            type="button"
            onClick={() => {
              setStaged((value) => !value);
              setStageFilter(staged ? "Unstaged" : "Staged");
            }}
          >
            {staged ? "Unstage all" : "Stage all"}
          </button>
          <button className="h-8 rounded-[9px] bg-[var(--codex-surface-muted)] px-3" type="button" onClick={() => setCommitState("committed")}>
            {commitState === "committed" ? "Committed" : "Commit"}
          </button>
          <button className="h-8 rounded-[9px] bg-[var(--codex-surface-muted)] px-3 text-[var(--codex-text-faint)]" type="button" onClick={() => setPrState("created")}>
            {prState === "created" ? "PR ready" : "Create PR"}
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto bg-[color-mix(in_oklab,var(--codex-surface-muted)_36%,transparent)] px-4 py-3">
          {diffFiles.map((file) => (
            <div key={file.path} className="overflow-hidden border-y border-[var(--codex-border-soft)] bg-[color-mix(in_oklab,var(--codex-surface-raised)_64%,transparent)]">
              <div className="flex h-10 items-center gap-2 border-b border-[var(--codex-border-soft)] px-3 text-[12px]">
                <CodexIcon name="file" className="size-4 text-[var(--codex-text-muted)]" />
                <span className="min-w-0 flex-1 truncate">{file.path}</span>
                <span className="text-[var(--codex-diff-added)]">+{file.additions}</span>
                <span className="text-[var(--codex-diff-removed)]">-{file.removals}</span>
              </div>
              <pre className="m-0 bg-transparent py-2 text-[12px] leading-6">
                {file.lines.map((line, index) => (
                  <div
                    key={`${line.text}-${index}`}
                    className={[
                      "grid grid-cols-[48px_48px_1fr] px-3",
                      line.kind === "add" ? "bg-[color-mix(in_oklab,var(--codex-diff-added)_13%,transparent)]" : "",
                      line.kind === "remove" ? "bg-[color-mix(in_oklab,var(--codex-diff-removed)_12%,transparent)]" : "",
                      line.kind === "meta" ? "text-[var(--codex-text-faint)]" : "",
                    ].join(" ")}
                    onClick={() => setCommentLine(commentLine === line.text ? null : line.text)}
                  >
                    <span className="text-right text-[var(--codex-text-faint)]">{line.oldLine ?? ""}</span>
                    <span className="text-right text-[var(--codex-text-faint)]">{line.newLine ?? ""}</span>
                    <code className="pl-4">{line.text}</code>
                    {commentLine === line.text ? <div className="col-span-3 ml-24 mt-1 rounded-[10px] border border-[var(--codex-border-soft)] bg-[var(--codex-surface-raised)] px-3 py-2 text-[12px]">Inline comment: keep this change minimal.</div> : null}
                  </div>
                ))}
              </pre>
            </div>
          ))}
        </div>
      </section>
      <aside className="hidden w-[24%] shrink-0 border-l border-[var(--codex-border-soft)] p-3 text-[12px] text-[var(--codex-text-muted)] lg:block">
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
