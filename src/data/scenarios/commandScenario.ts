import type { ActiveView, IconName, NavAction, PaletteRow } from "../../types";

export const primaryActions: NavAction[] = [
  { id: "new", label: "New chat", icon: "newChat", view: "chat" },
  { id: "search", label: "Search", icon: "search", opensPalette: true },
  { id: "plugins", label: "Plugins", icon: "app", view: "plugins" },
  { id: "automations", label: "Automations", icon: "automations", view: "automations" },
];

export const paletteRows: PaletteRow[] = [
  { title: "页面的设计", project: "aesthetics", shortcut: "Enter", active: true },
  { title: "Codex app截图采样", project: "aesthetics", shortcut: "Ctrl 1" },
  { title: "review diff panel", project: "aesthetics", shortcut: "Ctrl 2" },
  { title: "settings general page", project: "codex-app-notes", shortcut: "Ctrl 3" },
];

export const commandRows: Array<{
  id: string;
  title: string;
  description: string;
  shortcut: string;
  view: ActiveView;
}> = [
  { id: "new-thread", title: "New thread", description: "Start a new local thread", shortcut: "Ctrl N", view: "chat" },
  { id: "open-folder", title: "Open folder", description: "Choose a project directory", shortcut: "Ctrl O", view: "files" },
  { id: "toggle-diff", title: "Toggle diff panel", description: "Open the review workspace", shortcut: "Alt B", view: "review" },
  { id: "toggle-terminal", title: "Toggle terminal", description: "Open the thread terminal", shortcut: "Ctrl J", view: "terminal" },
  { id: "open-browser", title: "Open browser", description: "Preview the current local app", shortcut: "Ctrl Shift B", view: "browser" },
  { id: "plugins", title: "Plugins", description: "Inspect enabled plugin bundles", shortcut: "Ctrl Shift P", view: "plugins" },
  { id: "automations", title: "Automations", description: "Open scheduled monitors and reminders", shortcut: "Ctrl Shift A", view: "automations" },
  { id: "keyboard", title: "Keyboard shortcuts", description: "Show shortcut reference", shortcut: "Ctrl /", view: "settings" },
  { id: "settings", title: "Settings", description: "Open app settings", shortcut: "Ctrl ,", view: "settings" },
];

export const slashCommands: Array<{
  id: string;
  label: string;
  description: string;
  icon: IconName;
  insert: string;
}> = [
  { id: "review", label: "Code review", description: "Review unstaged changes or compare against a branch", icon: "review", insert: "/review" },
  { id: "compact", label: "Compact", description: "Compact this thread's context (22% full)", icon: "spinner", insert: "/compact" },
  { id: "feedback", label: "Feedback", description: "Send feedback about this chat", icon: "sideChat", insert: "/feedback" },
  { id: "fork", label: "Fork", description: "Fork this chat into local or a new worktree", icon: "external", insert: "/fork" },
  { id: "goal", label: "Goal", description: "Set a goal that Codex will keep working towards", icon: "history", insert: "/goal" },
  { id: "mcp", label: "MCP", description: "Show MCP server status", icon: "openFile", insert: "/mcp" },
  { id: "memories", label: "Memories", description: "Generate on", icon: "cloud", insert: "/memories" },
  { id: "model", label: "Model", description: "GPT-5.5", icon: "app", insert: "/model" },
  { id: "personality", label: "Personality", description: "Choose how Codex responds", icon: "history", insert: "/personality" },
  { id: "pet", label: "Pet", description: "Wake or tuck away the desktop pet", icon: "settings", insert: "/pet" },
  { id: "plan", label: "Plan mode", description: "Turn plan mode on", icon: "layout", insert: "/plan" },
];
