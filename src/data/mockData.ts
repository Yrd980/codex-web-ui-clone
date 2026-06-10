import type {
  ActiveView,
  ChatMessage,
  DiffFile,
  EnvironmentItem,
  FileTab,
  FileTreeItem,
  NavAction,
  PaletteRow,
  ProgressItem,
  ProjectGroup,
  SettingRow,
  SubagentItem,
} from "../types";

export const primaryActions: NavAction[] = [
  { id: "new", label: "New chat", icon: "newChat", view: "chat" },
  { id: "search", label: "Search", icon: "search", opensPalette: true },
  { id: "plugins", label: "Plugins", icon: "app", view: "plugins" },
  { id: "automations", label: "Automations", icon: "automations", view: "automations" },
];

export const projectGroups: ProjectGroup[] = [
  {
    id: "aesthetics",
    name: "aesthetics",
    path: "C:\\Users\\Yrd98\\project\\aesthetics",
    threads: [{ id: "thread-1", title: "检查任务并打开网页", project: "aesthetics", time: "now", active: true }],
  },
  {
    id: "walnut",
    name: "WalnutPi",
    path: "C:\\Users\\Yrd98\\project\\WalnutPi",
    threads: [
      { id: "thread-2", title: "派遣子Agent执行对齐", project: "WalnutPi", time: "now", running: true },
      { id: "thread-3", title: "执行第三方项目对齐", project: "WalnutPi", time: "2h" },
      { id: "thread-4", title: "执行三方项目对齐", project: "WalnutPi", time: "4h" },
      { id: "thread-5", title: "对齐核桃派集成需求", project: "WalnutPi", time: "4h" },
      { id: "thread-6", title: "集成 third 下项目", project: "WalnutPi", time: "5h" },
    ],
  },
  {
    id: "lcsc",
    name: "LCSC_android...",
    path: "C:\\Users\\Yrd98\\project\\LCSC_android",
    threads: [
      { id: "thread-7", title: "收敛打印机NFC BO...", project: "LCSC_android", time: "now", running: true },
      { id: "thread-8", title: "实现 Box 第一条链路", project: "LCSC_android", time: "2m" },
      { id: "thread-9", title: "梳理项目发现", project: "LCSC_android", time: "2h" },
      { id: "thread-10", title: "对齐箱层材料标签设...", project: "LCSC_android", time: "3h" },
      { id: "thread-11", title: "查看BOM逻辑", project: "LCSC_android", time: "6h" },
    ],
  },
  { id: "other", name: "omniclaw", path: "C:\\Users\\Yrd98\\project\\omniclaw", threads: [] },
  { id: "life", name: "digital-life-ho...", path: "C:\\Users\\Yrd98\\project\\digital-life-house", threads: [] },
  { id: "fool", name: "The_FOOL", path: "C:\\Users\\Yrd98\\project\\The_FOOL", threads: [] },
  { id: "companion", name: "companion c...", path: "C:\\Users\\Yrd98\\project\\companion", threads: [] },
];

export const chatMessages: ChatMessage[] = [
  {
    id: "user-1",
    role: "user",
    body: ["参考 docs/superpowers/specs/2026-06-10-codex-web-ui-ux-clone-design.md 给我进行页面的设计"],
  },
  {
    id: "assistant-1",
    role: "assistant",
    body: [
      "我会先读项目结构和你给的设计文档，判断它是要落到现有页面还是新增页面。",
      "这份 spec 的目标很明确：复刻 Codex App 的工作台，而不是做一个通用 AI dashboard。",
    ],
    artifacts: [
      {
        icon: "file",
        title: "Read spec",
        meta: "docs/superpowers/specs/2026-06-10-codex-web-ui-ux-clone-design.md",
      },
      { icon: "folder", title: "Found screenshots", meta: "7 reference images under docs/references" },
    ],
  },
  {
    id: "tool-1",
    role: "tool",
    title: "Running checks",
    body: ["git status --short", "rg --files", "bun run build"],
    codeTokens: ["Vite", "React", "Tailwind CSS v4"],
  },
  {
    id: "assistant-2",
    role: "assistant",
    body: [
      "设计方向确认：Vite + React + TypeScript + Tailwind CSS v4。",
      "页面会直接打开到 app workbench。主聊天、工具切换、Review、Files、Settings、命令面板和 running 状态都会有可切换的静态原型。",
    ],
  },
];

export const environmentItems: EnvironmentItem[] = [
  { label: "Mode", value: "Local", icon: "terminal" },
  { label: "Worktree", value: "main", icon: "branch" },
  { label: "Changes", value: "+97 -7", icon: "diff", tone: "green" },
  { label: "Pull request", value: "Not created", icon: "cloud", tone: "muted" },
];

export const progressItems: ProgressItem[] = [
  { label: "Explore project context", state: "done" },
  { label: "Confirm Tailwind direction", state: "done" },
  { label: "Write implementation plan", state: "active" },
  { label: "Build runnable prototype", state: "pending" },
];

export const subagents: SubagentItem[] = [
  { name: "visual-audit", status: "waiting", tone: "accent" },
  { name: "layout-check", status: "queued", tone: "warning" },
  { name: "build-verify", status: "ready", tone: "green" },
];

export const diffFiles: DiffFile[] = [
  {
    path: "docs/superpowers/specs/2026-06-10-codex-web-ui-ux-clone-design.md",
    status: "modified",
    additions: 97,
    removals: 7,
    lines: [
      { kind: "meta", text: "@@ -1,7 +1,7 @@" },
      { kind: "context", oldLine: 1, newLine: 1, text: "# Codex App UI/UX Web Clone Spec" },
      { kind: "remove", oldLine: 4, text: "Status: Screenshot-backed draft, calibrated against local Codex configuration" },
      { kind: "add", newLine: 4, text: "Status: Approved design for first runnable prototype" },
      { kind: "meta", text: "@@ -33,6 +33,34 @@" },
      { kind: "add", newLine: 36, text: "## 1.1 Confirmed Prototype Direction" },
      { kind: "add", newLine: 44, text: "- Tailwind CSS v4." },
      { kind: "add", newLine: 45, text: "- Tailwind's Vite plugin: `tailwindcss` plus `@tailwindcss/vite`." },
    ],
  },
];

export const fileTabs: FileTab[] = [
  { id: "spec", title: "2026-06-10-codex-web-ui-ux-clone-design.md", path: "docs/superpowers/specs", active: true },
  { id: "gitignore", title: ".gitignore", path: "." },
];

export const fileTree: FileTreeItem[] = [
  { path: "docs", depth: 0 },
  { path: "superpowers", depth: 1 },
  { path: "specs", depth: 2 },
  { path: "2026-06-10-codex-web-ui-ux-clone-design.md", depth: 3, active: true, status: "modified" },
  { path: "references", depth: 1 },
  { path: "codex-app-screenshots", depth: 2 },
  { path: ".gitignore", depth: 0, status: "modified" },
];

export const settingsRows: SettingRow[] = [
  {
    label: "Work mode",
    description: "Choose how Codex applies changes in this workspace.",
    value: "Agent",
    control: "radio",
    enabled: true,
  },
  { label: "Appearance", description: "Use the local light Catppuccin chrome theme.", value: "Light", control: "select" },
  { label: "Animations", description: "Reduce nonessential transitions for calmer review.", value: "On", control: "toggle", enabled: true },
  { label: "Open destination", description: "Choose where opened files appear.", value: "In app", control: "select" },
  { label: "Cloud tasks", description: "Run long work in a cloud environment.", value: "Off", control: "toggle" },
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

export const slashCommands = [
  { command: "/plan", description: "Toggle plan mode for multi-step work" },
  { command: "/review", description: "Start code review mode" },
  { command: "/status", description: "Show thread ID, context, and rate limits" },
  { command: "/mcp", description: "Open MCP server status" },
  { command: "/goal", description: "Set a persistent goal" },
  { command: "/feedback", description: "Open feedback dialog" },
];

export const browserHistory = ["http://127.0.0.1:5173/", "file:///C:/Users/Yrd98/project/aesthetics/dist/index.html", "https://developers.openai.com/codex/app/browser"];
