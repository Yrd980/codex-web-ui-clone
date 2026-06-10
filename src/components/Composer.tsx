import { useState } from "react";
import type { CSSProperties } from "react";
import { slashCommands } from "../data/mockData";
import type { PermissionMode, ReasoningMode } from "../types";
import { CodexIcon } from "./CodexIcon";

interface ComposerProps {
  running?: boolean;
  inlineStartOffset?: number;
  inlineEndOffset?: number;
  trackWidth?: number;
  trackOffset?: number;
  bottomPadding?: number;
  topFade?: number;
  inlinePadding?: number;
  surfacePaddingY?: number;
  textareaHeight?: number;
  onToggleRunning: () => void;
  onOpenTools: () => void;
}

const contextOptions = ["Attach file", "Add IDE context", "Open folder", "Use browser page"];
const permissionOptions: PermissionMode[] = ["Read only", "Workspace", "Full access", "Automatic review"];
const reasoningOptions: ReasoningMode[] = ["Fast", "Medium", "Extra High"];
const POPOVER_LEFT_RATIO = 0.025;
const POPOVER_WIDTH_RATIO = 0.48;
const POPOVER_MIN_WIDTH_RATIO = 0.28;

export function Composer({
  running = false,
  inlineStartOffset = 0,
  inlineEndOffset = 0,
  trackWidth = 720,
  trackOffset = 0,
  bottomPadding = 24,
  topFade = 44,
  inlinePadding = 14,
  surfacePaddingY = 6,
  textareaHeight = 32,
  onToggleRunning,
  onOpenTools,
}: ComposerProps) {
  const [permissionMode, setPermissionMode] = useState<PermissionMode>("Full access");
  const [reasoningMode, setReasoningMode] = useState<ReasoningMode>("Extra High");
  const [contextSource, setContextSource] = useState("Use browser page");
  const [composerText, setComposerText] = useState("");
  const [openMenu, setOpenMenu] = useState<"context" | "permissions" | "model" | "slash" | null>(null);

  return (
    <div
      className="pointer-events-none absolute bottom-0 z-20 flex justify-center bg-gradient-to-t from-[var(--codex-main)] via-[var(--codex-main)] to-transparent pb-[var(--composer-bottom-padding)] pt-[var(--composer-top-fade)]"
      style={
        {
          "--chat-track-width": `${trackWidth}px`,
          "--chat-track-offset": `${trackOffset}px`,
          "--composer-bottom-padding": `${bottomPadding}px`,
          "--composer-top-fade": `${topFade}px`,
          "--composer-inline-padding": `${inlinePadding}px`,
          "--composer-surface-padding-y": `${surfacePaddingY}px`,
          "--composer-textarea-height": `${textareaHeight}px`,
          "--composer-popover-left": `${POPOVER_LEFT_RATIO * 100}%`,
          "--composer-popover-width": `${POPOVER_WIDTH_RATIO * 100}%`,
          "--composer-popover-min-width": `${POPOVER_MIN_WIDTH_RATIO * 100}%`,
          left: inlineStartOffset,
          right: inlineEndOffset,
        } as CSSProperties
      }
    >
      <div className="pointer-events-auto relative w-[min(var(--chat-track-width),calc(100%_-_var(--composer-inline-padding)_-_var(--composer-inline-padding)))] min-w-0 translate-x-[var(--chat-track-offset)] rounded-[22px] border border-[var(--codex-border)] bg-[var(--codex-surface-raised)] px-4 py-[var(--composer-surface-padding-y)] shadow-[var(--codex-shadow)]">
        <textarea
          className="h-[var(--composer-textarea-height)] w-full resize-none bg-transparent font-mono text-[15px] leading-6 text-[var(--codex-text)] outline-none placeholder:text-[var(--codex-text-faint)]"
          placeholder="Ask Codex to build, explain, or review..."
          value={composerText}
          onChange={(event) => {
            const value = event.currentTarget.value;
            setComposerText(value);
            setOpenMenu(value.trim().startsWith("/") ? "slash" : openMenu === "slash" ? null : openMenu);
          }}
        />
        <div className="flex min-w-0 items-center justify-between gap-2 pt-1 text-[12px] text-[var(--codex-text-muted)]">
          <div className="flex min-w-0 items-center gap-1.5">
            <button
              className="grid size-7 place-items-center rounded-[9px] hover:bg-[var(--codex-hover)]"
              type="button"
              aria-label="Add context"
              onClick={() => setOpenMenu(openMenu === "context" ? null : "context")}
            >
              <CodexIcon name="plus" className="size-[18px]" />
            </button>
            <button
              className="flex h-7 min-w-0 items-center gap-1.5 rounded-[9px] px-2 text-[var(--codex-permission)] hover:bg-[var(--codex-hover)]"
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
              className="hidden h-7 items-center gap-1.5 rounded-[9px] px-2.5 text-[var(--codex-text-faint)] hover:bg-[var(--codex-hover)] sm:flex"
              type="button"
              onClick={() => setOpenMenu(openMenu === "model" ? null : "model")}
            >
              <CodexIcon name="spinner" className="size-4" />
              5.5
              <span className="max-sm:hidden">{reasoningMode}</span>
              <CodexIcon name="chevronDown" className="size-3.5" />
            </button>
            <button
              className="grid size-8 place-items-center rounded-full bg-[var(--codex-text)] text-[var(--codex-surface-raised)] shadow-[0_6px_18px_rgb(76_79_105_/_0.12)]"
              type="button"
              aria-label={running ? "Stop" : "Send"}
              onClick={onToggleRunning}
            >
              <CodexIcon name={running ? "stop" : "send"} className="size-[18px]" />
            </button>
          </div>
        </div>
        {openMenu ? (
          <div
            className={[
              "absolute bottom-[calc(100%+10px)] z-40 overflow-hidden border border-[var(--codex-border-soft)] bg-[var(--codex-surface-raised)] text-[12px] text-[var(--codex-text-muted)] shadow-[var(--codex-shadow-soft)]",
              openMenu === "slash" ? "left-0 max-h-[min(52vh,24rem)] w-full overscroll-contain rounded-[24px] p-2 overflow-y-auto" : "left-[var(--composer-popover-left)] w-[var(--composer-popover-width)] min-w-[var(--composer-popover-min-width)] rounded-[14px] p-2",
            ].join(" ")}
          >
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
                    key={item.id}
                    className="flex h-9 w-full items-center gap-3 rounded-[9px] px-3 text-left text-[15px] hover:bg-[var(--codex-hover)] first:bg-[var(--codex-active)]"
                    type="button"
                    onClick={() => {
                      if (item.id === "review") {
                        setComposerText(`${item.insert} `);
                      } else if (item.insert === "/tools") {
                        onOpenTools();
                        setComposerText("");
                      } else {
                        setComposerText(`${item.insert} `);
                      }
                      setOpenMenu(null);
                    }}
                  >
                    <CodexIcon name={item.icon} className="size-[18px] shrink-0 text-[var(--codex-text-muted)]" />
                    <span className="shrink-0 text-[var(--codex-text)]">{item.label}</span>
                    <span className="min-w-0 truncate text-[var(--codex-text-faint)]">{item.description}</span>
                  </button>
                ))
              : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
