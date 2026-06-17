import { useState } from "react";
import type { CSSProperties } from "react";
import { slashCommands } from "../data/scenarios/commandScenario";
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
      className="codex-layer-floating pointer-events-none absolute bottom-0 flex justify-center bg-gradient-to-t from-[var(--codex-main)] via-[var(--codex-main)] to-transparent pb-[var(--composer-bottom-padding)] pt-[var(--composer-top-fade)]"
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
      <div className="codex-composer-surface pointer-events-auto relative w-[min(var(--chat-track-width),calc(100%_-_var(--composer-inline-padding)_-_var(--composer-inline-padding)))] min-w-0 translate-x-[var(--chat-track-offset)] px-4 py-[var(--composer-surface-padding-y)]">
        <textarea
          className="h-[var(--composer-textarea-height)] w-full resize-none bg-transparent font-mono text-[0.9375rem] leading-6 text-[var(--codex-text)] outline-none placeholder:text-[var(--codex-text-faint)]"
          placeholder="Ask Codex to build, explain, or review..."
          value={composerText}
          onChange={(event) => {
            const value = event.currentTarget.value;
            setComposerText(value);
            setOpenMenu(value.trim().startsWith("/") ? "slash" : openMenu === "slash" ? null : openMenu);
          }}
        />
        <div className="flex min-w-0 items-center justify-between gap-2 pt-1 text-[0.75rem] text-[var(--codex-text-muted)]">
          <div className="flex min-w-0 items-center gap-1.5">
            <button
              className="codex-icon-button !size-[var(--codex-control-xs)]"
              type="button"
              aria-label="Add context"
              onClick={() => setOpenMenu(openMenu === "context" ? null : "context")}
            >
              <CodexIcon name="plus" className="codex-icon-md" />
            </button>
            <button
              className="codex-row-button !min-h-[var(--codex-control-xs)] min-w-0 gap-1.5 text-[var(--codex-permission)]"
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
              className="codex-row-button !min-h-[var(--codex-control-xs)] hidden w-auto gap-1.5 px-2.5 text-[var(--codex-text-faint)] sm:flex"
              type="button"
              onClick={() => setOpenMenu(openMenu === "model" ? null : "model")}
            >
              <CodexIcon name="spinner" className="size-4" />
              5.5
              <span className="max-sm:hidden">{reasoningMode}</span>
              <CodexIcon name="chevronDown" className="size-3.5" />
            </button>
            <button
              className="grid size-8 place-items-center rounded-full bg-[var(--codex-text)] text-[var(--codex-surface-raised)] shadow-[var(--codex-shadow-chrome)] transition-transform duration-[var(--codex-motion-fast)] ease-[var(--codex-motion-ease)] active:translate-y-px"
              type="button"
              aria-label={running ? "Stop" : "Send"}
              onClick={onToggleRunning}
            >
              <CodexIcon name={running ? "stop" : "send"} className="size-[1.125rem]" />
            </button>
          </div>
        </div>
        {openMenu ? (
          <div
            className={[
              "codex-popover codex-layer-drawer absolute bottom-[calc(100%+0.625rem)] text-[0.75rem] text-[var(--codex-text-muted)]",
              openMenu === "slash" ? "left-0 max-h-[min(52vh,24rem)] w-full overscroll-contain p-2 overflow-y-auto" : "left-[var(--composer-popover-left)] w-[var(--composer-popover-width)] min-w-[var(--composer-popover-min-width)] p-2",
            ].join(" ")}
          >
            {openMenu === "context"
              ? contextOptions.map((item) => (
                  <button
                    key={item}
                    className="codex-row-button codex-row-md justify-between"
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
                    className="codex-row-button codex-row-md justify-between"
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
                    className="codex-row-button codex-row-md justify-between"
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
                    className="codex-row-button codex-row-md gap-3 px-3 text-[0.9375rem] first:bg-[var(--codex-active)]"
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
                    <CodexIcon name={item.icon} className="codex-icon-md shrink-0 text-[var(--codex-text-muted)]" />
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
