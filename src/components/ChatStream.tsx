import type { ChatMessage } from "../types";
import { CodexIcon } from "./CodexIcon";

interface ChatStreamProps {
  messages: ChatMessage[];
  running?: boolean;
}

export function ChatStream({ messages, running = false }: ChatStreamProps) {
  return (
    <div className="mx-auto flex w-[min(var(--chat-track-width),calc(100%_-_var(--chat-track-inline-guard)_-_var(--chat-track-inline-guard)))] translate-x-[var(--chat-track-offset)] flex-col gap-8 pb-[var(--chat-stream-bottom-pad)] pt-10 text-[15px] leading-[1.65]">
      {messages.map((message) => {
        if (message.role === "user") {
          return (
            <div key={message.id} className="flex justify-end">
              <div className="max-w-[min(72%,48rem)] rounded-[18px] border border-[var(--codex-border-soft)] bg-[var(--codex-surface-raised)] px-4 py-3 shadow-[0_8px_30px_rgb(76_79_105_/_0.06)]">
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
