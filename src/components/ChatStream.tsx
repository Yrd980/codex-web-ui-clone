import type { ChatMessage } from "../types";
import { CodexIcon } from "./CodexIcon";

interface ChatStreamProps {
  messages: ChatMessage[];
  running?: boolean;
}

export function ChatStream({ messages, running = false }: ChatStreamProps) {
  return (
    <div className="mx-auto flex w-full max-w-[920px] flex-col gap-8 px-4 pb-[180px] pt-10 text-[15px] leading-[1.65] sm:px-5">
      <div className="flex justify-end">
        <div className="max-w-[700px] rounded-[18px] bg-[color-mix(in_oklab,var(--codex-surface-muted)_58%,transparent)] px-4 py-3 text-[15px] text-[var(--codex-text)]">
          你现在只需告诉我文档里面的任务执行完没有，然后在内置的浏览器里面打开网页就好
        </div>
      </div>
      <div className="space-y-5 border-b border-[var(--codex-border-soft)] pb-5 text-[var(--codex-text-muted)]">
        <button className="flex items-center gap-2 text-[14px] text-[var(--codex-text-faint)] hover:text-[var(--codex-text-muted)]" type="button">
          Worked for 2m 44s
          <CodexIcon name="chevronDown" className="size-4 -rotate-90" />
        </button>
        <p>
          结论：严格按文档清单看，还没有完全执行完。主体页面实现已经在，
          <code className="rounded-[7px] bg-[var(--codex-surface-muted)] px-2 py-0.5 text-[13px] text-[var(--codex-text)]">bun run build</code>
          也通过了；但文档里的复选框没更新，计划中的提交步骤也没完成，工作区还有未提交改动。
        </p>
        <p className="flex flex-wrap items-center gap-2">
          内置浏览器已经打开网页：
          <span className="inline-flex items-center gap-1.5 rounded-[7px] bg-[color-mix(in_oklab,var(--codex-accent)_12%,transparent)] px-2 py-0.5 text-[var(--codex-accent)]">
            <CodexIcon name="globe" className="size-4" />
            http://127.0.0.1:5173/
          </span>
        </p>
        <div className="rounded-[13px] border border-[var(--codex-border-soft)] bg-[color-mix(in_oklab,var(--codex-surface-raised)_52%,transparent)] p-3">
          <div className="flex items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-[11px] bg-[var(--codex-surface-muted)] text-cyan-400">
              <CodexIcon name="globe" className="size-7" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-[var(--codex-text)]">Web preview</div>
              <div className="mt-0.5 text-[13px] text-[var(--codex-text-faint)]">Website</div>
            </div>
            <button className="flex h-9 shrink-0 items-center gap-1.5 rounded-[11px] border border-[var(--codex-border-soft)] px-3 text-[13px] text-[var(--codex-text)] hover:bg-[var(--codex-hover)]" type="button">
              Open in
              <CodexIcon name="chevronDown" className="size-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[var(--codex-text-faint)]">
          <button className="grid size-6 place-items-center rounded-[7px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Copy preview link">
            <CodexIcon name="copy" className="size-4" />
          </button>
          <button className="grid size-6 place-items-center rounded-[7px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Open preview externally">
            <CodexIcon name="external" className="size-4" />
          </button>
        </div>
      </div>
      {messages.map((message) => {
        if (message.role === "user") {
          return (
            <div key={message.id} className="flex justify-end">
              <div className="max-w-[660px] rounded-[18px] border border-[var(--codex-border-soft)] bg-[var(--codex-surface-raised)] px-4 py-3 shadow-[0_8px_30px_rgb(76_79_105_/_0.06)]">
                {message.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          );
        }

        if (message.role === "tool") {
          return (
            <div key={message.id} className="space-y-3 text-[var(--codex-text-muted)]">
              <div className="flex items-center gap-2 text-[13px]">
                <CodexIcon name="terminal" className="size-4" />
                <span>{message.title}</span>
              </div>
              <div className="rounded-[12px] border border-[var(--codex-border-soft)] bg-[color-mix(in_oklab,var(--codex-surface-muted)_58%,transparent)]">
                {message.body.map((line) => (
                  <div key={line} className="border-b border-[var(--codex-border-soft)] px-3 py-2 last:border-b-0">
                    <code>{line}</code>
                  </div>
                ))}
              </div>
              {message.codeTokens ? (
                <div className="flex flex-wrap gap-2">
                  {message.codeTokens.map((token) => (
                    <code key={token} className="rounded-[7px] bg-[var(--codex-surface-muted)] px-2 py-1 text-[13px] text-[var(--codex-text)]">
                      {token}
                    </code>
                  ))}
                </div>
              ) : null}
            </div>
          );
        }

        return (
          <article key={message.id} className="group relative space-y-4">
            <div className="space-y-3">
              {message.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {message.artifacts ? (
              <div className="overflow-hidden rounded-[14px] border border-[var(--codex-border-soft)] bg-[color-mix(in_oklab,var(--codex-surface-raised)_70%,transparent)]">
                {message.artifacts.map((artifact) => (
                  <div key={artifact.title} className="flex items-center gap-3 border-b border-[var(--codex-border-soft)] px-3 py-3 last:border-b-0">
                    <span className="grid size-8 place-items-center rounded-[9px] bg-[var(--codex-surface-muted)] text-[var(--codex-text-muted)]">
                      <CodexIcon name={artifact.icon} className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-[var(--codex-text)]">{artifact.title}</div>
                      <div className="truncate text-[12px] text-[var(--codex-text-faint)]">{artifact.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        );
      })}
      {running ? <p className="text-[14px] text-[var(--codex-text-faint)]">Thinking...</p> : null}
    </div>
  );
}
