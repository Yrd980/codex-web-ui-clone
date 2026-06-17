import type { ActiveView, IconName } from "../types";
import { CodexIcon } from "./CodexIcon";

interface ToolSwitcherProps {
  onSetView: (view: ActiveView) => void;
}

const tools: Array<{ label: string; view: ActiveView; icon: IconName; shortcut: string }> = [
  { label: "Review", view: "review", icon: "review", shortcut: "Ctrl R" },
  { label: "Terminal", view: "terminal", icon: "terminal", shortcut: "Ctrl T" },
  { label: "Browser", view: "browser", icon: "browser", shortcut: "Ctrl B" },
  { label: "Files", view: "files", icon: "files", shortcut: "Ctrl F" },
  { label: "Side chat", view: "chat", icon: "sideChat", shortcut: "Ctrl L" },
];

export function ToolSwitcher({ onSetView }: ToolSwitcherProps) {
  return (
    <div className="flex h-full items-center pl-9 pr-8">
      <div className="w-full space-y-1.5">
        {tools.map((tool, index) => (
          <button
            key={tool.label}
            className="codex-row-button codex-row-xl gap-3 px-3 text-[var(--codex-type-base)]"
            data-active={index === 0}
            type="button"
            onClick={() => onSetView(tool.view)}
          >
            <CodexIcon name={tool.icon} className="size-5 text-[var(--codex-text-muted)]" />
            <span className="flex-1">{tool.label}</span>
            <span className="codex-badge">{tool.shortcut}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
