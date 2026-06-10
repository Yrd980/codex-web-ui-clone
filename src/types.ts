export type ActiveView =
  | "chat"
  | "tool-switcher"
  | "review"
  | "files"
  | "plugins"
  | "automations"
  | "settings"
  | "terminal"
  | "browser"
  | "running";

export type PaletteMode = "commands" | "threads";

export type SettingsSection = "General" | "Keyboard Shortcuts" | "Browser Use" | "Computer Use" | "Connections" | "Model";

export type ReviewScope = "Last turn" | "Uncommitted" | "All branch changes";

export type PermissionMode = "Read only" | "Workspace" | "Full access" | "Automatic review";

export type ReasoningMode = "Fast" | "Medium" | "Extra High";

export type IconName =
  | "app"
  | "automations"
  | "back"
  | "branch"
  | "browser"
  | "check"
  | "chevronDown"
  | "cloud"
  | "copy"
  | "diff"
  | "external"
  | "file"
  | "files"
  | "folder"
  | "forward"
  | "globe"
  | "history"
  | "layout"
  | "menu"
  | "minimize"
  | "more"
  | "newChat"
  | "openFile"
  | "panel"
  | "pin"
  | "plus"
  | "review"
  | "search"
  | "send"
  | "settings"
  | "sideChat"
  | "tray"
  | "spinner"
  | "stop"
  | "terminal"
  | "warning"
  | "x";

export interface NavAction {
  id: string;
  label: string;
  icon: IconName;
  view?: ActiveView;
  opensPalette?: boolean;
}

export interface Thread {
  id: string;
  title: string;
  project: string;
  time: string;
  active?: boolean;
  running?: boolean;
}

export interface ProjectGroup {
  id: string;
  name: string;
  path: string;
  threads: Thread[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "tool";
  title?: string;
  body: string[];
  codeTokens?: string[];
  artifacts?: Array<{
    icon: IconName;
    title: string;
    meta: string;
  }>;
}

export interface EnvironmentItem {
  label: string;
  value: string;
  icon: IconName;
  tone?: "muted" | "green" | "red" | "accent" | "warning";
}

export interface ProgressItem {
  label: string;
  state: "done" | "active" | "pending";
}

export interface SubagentItem {
  name: string;
  status: string;
  tone: "accent" | "green" | "warning";
}

export interface DiffLine {
  kind: "context" | "add" | "remove" | "meta";
  oldLine?: number;
  newLine?: number;
  text: string;
}

export interface DiffFile {
  path: string;
  status: string;
  additions: number;
  removals: number;
  lines: DiffLine[];
}

export interface FileTab {
  id: string;
  title: string;
  path: string;
  active?: boolean;
}

export interface FileTreeItem {
  path: string;
  depth: number;
  active?: boolean;
  status?: "modified" | "added";
}

export interface SettingRow {
  label: string;
  description: string;
  value: string;
  control: "toggle" | "select" | "button" | "radio";
  enabled?: boolean;
}

export interface PaletteRow {
  title: string;
  project: string;
  shortcut: string;
  active?: boolean;
}
