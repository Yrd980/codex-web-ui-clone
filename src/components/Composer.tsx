import { useState } from "react";
import { slashCommands } from "../data/mockData";
import type { PermissionMode, ReasoningMode } from "../types";
import { CodexIcon } from "./CodexIcon";

interface ComposerProps {
  running?: boolean;
  reservedRight?: number;
  onToggleRunning: () => void;
  onOpenTools: () => void;
}

const contextOptions = ["Attach file", "Add IDE context", "Open folder", "Use browser page"];
const permissionOptions: PermissionMode[] = ["Read only", "Workspace", "Full access", "Automatic review"];
const reasoningOptions: ReasoningMode[] = ["Fast", "Medium", "Extra High"];

export function Composer({ running = false, reservedRight = 0, onToggleRunning, onOpenTools }: ComposerProps) {
  const [permissionMode, setPermissionMode] = useState<PermissionMode>("Full access");
  const [reasoningMode, setReasoningMode] = useState<ReasoningMode>("Extra High");
  const [contextSource, setContextSource] = useState("Use browser page");
  const [composerText, setComposerText] = useState("");
  const [openMenu, setOpenMenu] = useState<"context" | "permissions" | "model" | "slash" | null>(null);

  return (
    <div
      className="pointer-events-none absolute bottom-0 z-20 flex justify-center bg-gradient-to-t from-[var(--codex-main)] via-[var(--codex-main)] to-transparent px-4 pb-5 pt-16 sm:pb-6"
      style={{ left: reservedRight ? 64 : 0, right: reservedRight }}
    >
      <div className="pointer-events-auto relative w-full max-w-[936px] min-w-0 rounded-[24px] border border-[var(--codex-border)] bg-[var(--codex-surface-raised)] px-4 py-3 shadow-[var(--codex-shadow)]">
        <textarea
          className="h-16 w-full resize-none bg-transparent text-[15px] leading-6 text-[var(--codex-text)] outline-none placeholder:text-[var(--codex-text-faint)]"
          placeholder="Ask Codex to build, explain, or review..."
          value={composerText}
          onChange={(event) => {
            const value = event.currentTarget.value;
            setComposerText(value);
            setOpenMenu(value.trim().startsWith("/") ? "slash" : openMenu === "slash" ? null : openMenu);
          }}
        />
        <div className="flex min-w-0 items-center justify-between gap-2 pt-2 text-[12px] text-[var(--codex-text-muted)]">
          <div className="flex min-w-0 items-center gap-1.5">
            <button
              className="grid size-8 place-items-center rounded-[10px] hover:bg-[var(--codex-hover)]"
              type="button"
              aria-label="Add context"
              onClick={() => setOpenMenu(openMenu === "context" ? null : "context")}
            >
              <CodexIcon name="plus" className="size-[18px]" />
            </button>
            <button
              className="flex h-8 min-w-0 items-center gap-1.5 rounded-[10px] px-2 text-[var(--codex-permission)] hover:bg-[var(--codex-hover)]"
              type="button"
              onClick={() => setOpenMenu(openMenu === "permissions" ? null : "permissions")}
            >
              <CodexIcon name="warning" className="size-4" />
              <span className="truncate">{permissionMode}</span>
              <CodexIcon name="chevronDown" className="size-3.5" />
            </button>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <button
              className="hidden h-8 items-center gap-1.5 rounded-[10px] px-2.5 text-[var(--codex-text-faint)] hover:bg-[var(--codex-hover)] sm:flex"
              type="button"
              onClick={() => setOpenMenu(openMenu === "model" ? null : "model")}
            >
              <CodexIcon name="spinner" className="size-4" />
              5.5
              <span className="max-sm:hidden">{reasoningMode}</span>
              <CodexIcon name="chevronDown" className="size-3.5" />
            </button>
            <button
              className="grid size-9 place-items-center rounded-full bg-[var(--codex-text)] text-[var(--codex-surface-raised)] shadow-[0_6px_18px_rgb(76_79_105_/_0.12)]"
              type="button"
              aria-label={running ? "Stop" : "Send"}
              onClick={onToggleRunning}
            >
              <CodexIcon name={running ? "stop" : "send"} className="size-[18px]" />
            </button>
          </div>
        </div>
        {openMenu ? (
          <div className="absolute bottom-[calc(100%+10px)] left-4 z-40 w-[min(360px,calc(100%-32px))] overflow-hidden rounded-[14px] border border-[var(--codex-border-soft)] bg-[var(--codex-surface-raised)] p-2 text-[12px] text-[var(--codex-text-muted)] shadow-[var(--codex-shadow-soft)]">
            {openMenu === "context"
              ? contextOptions.map((item) => (
                  <button
                    key={item}
                    className="flex h-9 w-full items-center justify-between rounded-[9px] px-2 text-left hover:bg-[var(--codex-hover)]"
                    type="button"
                    onClick={() => {
                      setContextSource(item);
                      setOpenMenu(null);
                    }}
                  >
                    <span>{item}</span>
                    {contextSource === item ? <CodexIcon name="check" className="size-4" /> : null}
                  </button>
                ))
              : null}
            {openMenu === "permissions"
              ? permissionOptions.map((item) => (
                  <button
                    key={item}
                    className="flex h-9 w-full items-center justify-between rounded-[9px] px-2 text-left hover:bg-[var(--codex-hover)]"
                    type="button"
                    onClick={() => {
                      setPermissionMode(item);
                      setOpenMenu(null);
                    }}
                  >
                    <span>{item}</span>
                    {permissionMode === item ? <CodexIcon name="check" className="size-4" /> : null}
                  </button>
                ))
              : null}
            {openMenu === "model"
              ? reasoningOptions.map((item) => (
                  <button
                    key={item}
                    className="flex h-9 w-full items-center justify-between rounded-[9px] px-2 text-left hover:bg-[var(--codex-hover)]"
                    type="button"
                    onClick={() => {
                      setReasoningMode(item);
                      setOpenMenu(null);
                    }}
                  >
                    <span>5.5 {item}</span>
                    {reasoningMode === item ? <CodexIcon name="check" className="size-4" /> : null}
                  </button>
                ))
              : null}
            {openMenu === "slash"
              ? slashCommands.map((item) => (
                  <button
                    key={item.command}
                    className="flex h-11 w-full items-center gap-3 rounded-[9px] px-2 text-left hover:bg-[var(--codex-hover)]"
                    type="button"
                    onClick={() => {
                      if (item.command === "/tools") {
                        onOpenTools();
                        setComposerText("");
                      } else {
                        setComposerText(`${item.command} `);
                      }
                      setOpenMenu(null);
                    }}
                  >
                    <code className="text-[var(--codex-text)]">{item.command}</code>
                    <span className="truncate">{item.description}</span>
                    {item.command === "/tools" ? <CodexIcon name="layout" className="ml-auto size-4 text-[var(--codex-text-faint)]" /> : null}
                  </button>
                ))
              : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
