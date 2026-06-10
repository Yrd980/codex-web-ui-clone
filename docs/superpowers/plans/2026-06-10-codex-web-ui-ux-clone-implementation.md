# Codex Web UI Clone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable Vite/React/Tailwind prototype that recreates the Codex App workbench using static data and switchable UI states.

**Architecture:** The app is a single-page React prototype with top-level state in `App.tsx`. It renders a native-like Codex shell, a dense sidebar, a prose-first chat workspace, and stateful right-side tool workspaces. Tailwind CSS v4 handles layout and component styling, while Codex-specific theme values stay in editable CSS variables.

**Tech Stack:** Vite, React, TypeScript, Tailwind CSS v4, `@tailwindcss/vite`, Bun.

---

## File Structure

- Create `package.json`: project metadata, Vite scripts, dependencies, and dev dependencies.
- Create `index.html`: Vite root document.
- Create `tsconfig.json`: browser app TypeScript configuration.
- Create `vite.config.ts`: Vite React plugin and Tailwind v4 Vite plugin.
- Create `src/main.tsx`: React entrypoint.
- Create `src/App.tsx`: top-level state, app composition, and workspace switching.
- Create `src/styles/tokens.css`: Codex theme variables, reset, global font rendering, and Tailwind import.
- Create `src/data/mockData.ts`: static projects, threads, messages, files, diffs, settings, progress, and palette rows.
- Create `src/types.ts`: shared state and data types.
- Create `src/components/CodexIcon.tsx`: local icon registry with consistent 20px `currentColor` glyphs.
- Create `src/components/TopMenu.tsx`: native-like top menu row.
- Create `src/components/Sidebar.tsx`: dense project/thread navigation and primary actions.
- Create `src/components/AppFrame.tsx`: shell layout, overlays, and main content frame.
- Create `src/components/ChatWorkspace.tsx`: chat header, chat stream, composer, environment card, and tool workspace composition.
- Create `src/components/ChatStream.tsx`: prose-first messages and inline tool/result rows.
- Create `src/components/Composer.tsx`: floating composer with send/stop state.
- Create `src/components/EnvironmentCard.tsx`: changes, mode, branch, PR, progress, subagents, and sources.
- Create `src/components/ToolSwitcher.tsx`: contextual right-workspace tool list.
- Create `src/components/ReviewWorkspace.tsx`: tabs, toolbar, diff view, and file tree drawer.
- Create `src/components/FileWorkspace.tsx`: file tabs, breadcrumb, document viewer, code blocks, and file tree drawer.
- Create `src/components/SettingsView.tsx`: settings nav and centered settings panels.
- Create `src/components/CommandPalette.tsx`: dimmed search overlay.

## Task 1: Scaffold Vite React Tailwind App

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles/tokens.css`

- [ ] **Step 1: Create project metadata and scripts**

Create `package.json`:

```json
{
  "name": "codex-web-ui-clone",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tailwindcss/vite": "latest",
    "@vitejs/plugin-react": "latest",
    "tailwindcss": "latest",
    "vite": "latest",
    "typescript": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "@types/react": "latest",
    "@types/react-dom": "latest"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run:

```bash
bun install
```

Expected: `bun.lock` is created and dependencies install successfully. If `bun` is unavailable, install it or use the project-approved fallback only after noting the fallback in the final report.

- [ ] **Step 3: Create Vite document root**

Create `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <title>Codex App Web Clone</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Create TypeScript config**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["vite/client"]
  },
  "include": ["src"],
  "references": []
}
```

- [ ] **Step 5: Configure Vite with React and Tailwind**

Create `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

- [ ] **Step 6: Create global token stylesheet**

Create `src/styles/tokens.css`:

```css
@import "tailwindcss";

:root {
  color-scheme: light;
  --codex-surface-root: #eff1f5;
  --codex-ink: #4c4f69;
  --codex-accent: #8839ef;
  --codex-skill: #8839ef;
  --codex-diff-added: #40a02b;
  --codex-diff-removed: #d20f39;
  --codex-window: #eef4f9;
  --codex-sidebar: #e4eaf0;
  --codex-main: #eff1f5;
  --codex-surface: #f1f3f6;
  --codex-surface-raised: #f8fafc;
  --codex-surface-muted: #e7e9ed;
  --codex-active: #eef4f9;
  --codex-hover: color-mix(in oklab, var(--codex-ink) 7%, transparent);
  --codex-border: color-mix(in oklab, var(--codex-ink) 12%, transparent);
  --codex-border-soft: color-mix(in oklab, var(--codex-ink) 6%, transparent);
  --codex-text: #4c4f69;
  --codex-text-muted: color-mix(in oklab, var(--codex-ink) 65%, transparent);
  --codex-text-faint: color-mix(in oklab, var(--codex-ink) 45%, transparent);
  --codex-permission: #e25507;
  --codex-overlay-dim: rgb(76 79 105 / 28%);
  --codex-shadow: 0 24px 80px rgb(76 79 105 / 14%);
  --codex-shadow-soft: 0 16px 48px rgb(76 79 105 / 10%);
  font-family: "JetBrainsMono Nerd Font Mono", ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
}

:root[data-theme="dark"] {
  color-scheme: dark;
  --codex-surface-root: #1e1e2e;
  --codex-ink: #cdd6f4;
  --codex-accent: #cba6f7;
  --codex-skill: #cba6f7;
  --codex-diff-added: #a6e3a1;
  --codex-diff-removed: #f38ba8;
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  min-height: 100%;
}

body {
  margin: 0;
  background: var(--codex-surface-root);
  color: var(--codex-text);
  font-size: 14px;
  text-rendering: geometricPrecision;
  -webkit-font-smoothing: antialiased;
}

button,
input,
textarea {
  font: inherit;
}

button {
  cursor: default;
}

::selection {
  background: color-mix(in oklab, var(--codex-accent) 22%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 7: Create minimal React entrypoint**

Create `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tokens.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Create `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="min-h-[100dvh] bg-[var(--codex-surface-root)] text-[var(--codex-text)]">
      Codex App Web Clone
    </main>
  );
}
```

- [ ] **Step 8: Verify scaffold builds**

Run:

```bash
bun run build
```

Expected: TypeScript finishes and Vite emits a production build under `dist/`.

- [ ] **Step 9: Commit scaffold**

Run:

```bash
git add package.json bun.lock index.html tsconfig.json vite.config.ts src/main.tsx src/App.tsx src/styles/tokens.css
git commit -m "Scaffold Vite Tailwind Codex clone app" -m "Create the React and TypeScript Vite app with Tailwind CSS v4 through the Tailwind Vite plugin. Add Codex theme tokens and a minimal entrypoint so the prototype can build before the UI shell is introduced."
```

## Task 2: Add Types And Static Data

**Files:**
- Create: `src/types.ts`
- Create: `src/data/mockData.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Define shared types**

Create `src/types.ts`:

```ts
export type ActiveView =
  | "chat"
  | "tool-switcher"
  | "review"
  | "files"
  | "settings"
  | "terminal"
  | "browser"
  | "running";

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
  | "file"
  | "files"
  | "folder"
  | "forward"
  | "history"
  | "menu"
  | "more"
  | "newChat"
  | "plus"
  | "review"
  | "search"
  | "send"
  | "settings"
  | "sideChat"
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
```

- [ ] **Step 2: Add static data**

Create `src/data/mockData.ts` with concrete Codex-like content:

```ts
import type {
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
  { id: "plugins", label: "Plugins", icon: "app" },
  { id: "automations", label: "Automations", icon: "automations" },
];

export const projectGroups: ProjectGroup[] = [
  {
    id: "aesthetics",
    name: "aesthetics",
    path: "C:\\Users\\Yrd98\\project\\aesthetics",
    threads: [
      { id: "thread-1", title: "页面的设计", project: "aesthetics", time: "now", active: true },
      { id: "thread-2", title: "Codex app截图采样", project: "aesthetics", time: "14:58" },
      { id: "thread-3", title: "review diff panel", project: "aesthetics", time: "Tue" },
      { id: "thread-4", title: "running subagents", project: "aesthetics", time: "Mon", running: true },
    ],
  },
  {
    id: "research",
    name: "codex-app-notes",
    path: "C:\\Users\\Yrd98\\project\\codex-app-notes",
    threads: [
      { id: "thread-5", title: "settings general page", project: "codex-app-notes", time: "Sun" },
      { id: "thread-6", title: "command palette", project: "codex-app-notes", time: "Jun 8" },
    ],
  },
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
      { icon: "file", title: "Read spec", meta: "docs/superpowers/specs/2026-06-10-codex-web-ui-ux-clone-design.md" },
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
  { label: "Work mode", description: "Choose how Codex applies changes in this workspace.", value: "Agent", control: "radio", enabled: true },
  { label: "Appearance", description: "Use the local light Catppuccin chrome theme.", value: "Light", control: "select" },
  { label: "Animations", description: "Reduce nonessential transitions for calmer review.", value: "On", control: "toggle", enabled: true },
  { label: "Open destination", description: "Choose where opened files appear.", value: "In app", control: "select" },
  { label: "Cloud tasks", description: "Run long work in a cloud environment.", value: "Off", control: "toggle" },
];

export const paletteRows: PaletteRow[] = [
  { title: "页面的设计", project: "aesthetics", shortcut: "Enter", active: true },
  { title: "Codex app截图采样", project: "aesthetics", shortcut: "⌘ 1" },
  { title: "review diff panel", project: "aesthetics", shortcut: "⌘ 2" },
  { title: "settings general page", project: "codex-app-notes", shortcut: "⌘ 3" },
];
```

- [ ] **Step 3: Wire static data into App**

Replace `src/App.tsx` with:

```tsx
import { useState } from "react";
import { projectGroups } from "./data/mockData";
import type { ActiveView } from "./types";

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>("chat");
  const [activeThreadId, setActiveThreadId] = useState("thread-1");

  const activeThread =
    projectGroups.flatMap((group) => group.threads).find((thread) => thread.id === activeThreadId) ??
    projectGroups[0].threads[0];

  return (
    <main className="min-h-[100dvh] bg-[var(--codex-surface-root)] p-6 text-[var(--codex-text)]">
      <div className="text-xs text-[var(--codex-text-muted)]">Active view</div>
      <div className="mt-1 text-lg font-medium">{activeView}</div>
      <button
        className="mt-4 rounded-[10px] border border-[var(--codex-border)] bg-[var(--codex-surface-raised)] px-3 py-2 text-sm"
        type="button"
        onClick={() => setActiveView(activeView === "chat" ? "review" : "chat")}
      >
        Toggle view for scaffold check
      </button>
      <button
        className="ml-3 mt-4 rounded-[10px] border border-[var(--codex-border)] bg-[var(--codex-surface-raised)] px-3 py-2 text-sm"
        type="button"
        onClick={() => setActiveThreadId(activeThread.id === "thread-1" ? "thread-2" : "thread-1")}
      >
        {activeThread.title}
      </button>
    </main>
  );
}
```

- [ ] **Step 4: Verify data types**

Run:

```bash
bun run build
```

Expected: TypeScript succeeds with no missing type or import errors.

- [ ] **Step 5: Commit data model**

Run:

```bash
git add src/types.ts src/data/mockData.ts src/App.tsx
git commit -m "Add static data model for Codex clone" -m "Define the prototype view state, navigation, chat, environment, diff, files, settings, and command palette data used by the static Codex App web clone."
```

## Task 3: Build App Frame, Top Menu, Sidebar, And Icons

**Files:**
- Create: `src/components/CodexIcon.tsx`
- Create: `src/components/TopMenu.tsx`
- Create: `src/components/Sidebar.tsx`
- Create: `src/components/AppFrame.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create local icon registry**

Create `src/components/CodexIcon.tsx`:

```tsx
import type { IconName } from "../types";

interface CodexIconProps {
  name: IconName;
  className?: string;
}

const paths: Record<IconName, string> = {
  app: "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z",
  automations: "M5 4h10l4 4v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V4Zm9 1.7V9h3.3L14 5.7ZM8 12h8v1.6H8V12Zm0 3h6v1.6H8V15Z",
  back: "M12.8 5.2 8 10l4.8 4.8-1.1 1.1L5 10l6.7-5.9 1.1 1.1ZM8 9.2h11v1.6H8V9.2Z",
  branch: "M7 4a3 3 0 0 1 1 5.83V12a4 4 0 0 0 4 4h1.17a3 3 0 1 1 0 2H12a6 6 0 0 1-6-6V9.83A3 3 0 0 1 7 4Zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm9 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z",
  browser: "M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-11Zm2.5-.7a.7.7 0 0 0-.7.7v2h12.4v-2a.7.7 0 0 0-.7-.7h-11Zm11.7 4.5H5.8v7.2c0 .39.31.7.7.7h11c.39 0 .7-.31.7-.7V9.3Z",
  check: "m9.3 15.2-4-4 1.4-1.4 2.6 2.6 6-6 1.4 1.4-7.4 7.4Z",
  chevronDown: "m6.7 8.7 5.3 5.3 5.3-5.3 1.1 1.1-6.4 6.4-6.4-6.4 1.1-1.1Z",
  cloud: "M8.4 18a5.4 5.4 0 0 1-.8-10.75A6.4 6.4 0 0 1 19.1 9.6 4.4 4.4 0 0 1 18.6 18H8.4Zm0-1.8h10.2a2.6 2.6 0 0 0 .02-5.2l-1.02-.02-.25-.98A4.6 4.6 0 0 0 8.6 8.8l-.2.9-.92.1a3.6 3.6 0 0 0 .92 6.4Z",
  copy: "M8 7h10v12H8V7Zm2 2v8h6V9h-6ZM5 4h10v2H7v10H5V4Z",
  diff: "M6 5h9v2H6V5Zm0 6h12v2H6v-2Zm0 6h9v2H6v-2Zm11-13h2v4h-2V4Zm-1 1h4v2h-4V5Zm2 11v4h-2v-4h2Zm-3 1h6v2h-6v-2Z",
  file: "M6 3h8l4 4v14H6V3Zm7 1.8H7.8v14.4h8.4V8H13V4.8Zm1.5 1.1v.6h.6l-.6-.6Z",
  files: "M7 3h8l4 4v10H7V3Zm2 2v10h8V8h-3V5H9Zm-4 4h2v10h10v2H5V9Z",
  folder: "M3 6.5A2.5 2.5 0 0 1 5.5 4h4.2l2 2H18.5A2.5 2.5 0 0 1 21 8.5v7A2.5 2.5 0 0 1 18.5 18h-13A2.5 2.5 0 0 1 3 15.5v-9Zm2.5-.7a.7.7 0 0 0-.7.7v9c0 .39.31.7.7.7h13c.39 0 .7-.31.7-.7v-7a.7.7 0 0 0-.7-.7h-7.55l-2-2H5.5Z",
  forward: "M11.2 5.2 16 10l-4.8 4.8 1.1 1.1L19 10l-6.7-5.9-1.1 1.1ZM16 9.2H5v1.6h11V9.2Z",
  history: "M12 5a7 7 0 1 1-6.33 4H3l3.5-3.5L10 9H7.78A5.2 5.2 0 1 0 12 6.8V5Zm-.8 3.5h1.6v4.1l3 1.8-.8 1.4-3.8-2.3v-5Z",
  menu: "M5 7h14v1.8H5V7Zm0 4.1h14v1.8H5v-1.8Zm0 4.1h14V17H5v-1.8Z",
  more: "M6 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm6 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm6 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z",
  newChat: "M5 4h14v11H8.5L5 18.5V4Zm2 2v8.2L7.8 13H17V6H7Zm5 1.5h1.6V10H16v1.6h-2.4V14H12v-2.4H9.5V10H12V7.5Z",
  plus: "M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z",
  review: "M5 4h14v16H5V4Zm2 2v12h10V6H7Zm2 2h6v1.6H9V8Zm0 3h6v1.6H9V11Zm0 3h4v1.6H9V14Z",
  search: "M10.5 4a6.5 6.5 0 0 1 5.15 10.46l4 4-1.19 1.19-4-4A6.5 6.5 0 1 1 10.5 4Zm0 1.8a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Z",
  send: "M4 12 20 4l-4.2 16-3.1-6.6L6 15.2 4 12Zm4.7.9 4.7-1.3 1.8 3.8 1.9-7.2-8.4 4.7Z",
  settings: "M10.9 3h2.2l.5 2.2c.5.18.97.38 1.4.64l2-.95 1.55 1.55-.95 2c.26.43.46.9.64 1.4l2.2.5v2.2l-2.2.5c-.18.5-.38.97-.64 1.4l.95 2L17 18l-2-.95c-.43.26-.9.46-1.4.64l-.5 2.2h-2.2l-.5-2.2a6.9 6.9 0 0 1-1.4-.64L7 18l-1.55-1.55.95-2a6.9 6.9 0 0 1-.64-1.4l-2.2-.5v-2.2l2.2-.5c.18-.5.38-.97.64-1.4l-.95-2L7 4.9l2 .95c.43-.26.9-.46 1.4-.64L10.9 3Zm1.1 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  sideChat: "M4 5h16v14H4V5Zm2 2v10h5V7H6Zm7 0v10h5V7h-5Z",
  spinner: "M12 4a8 8 0 0 1 8 8h-2a6 6 0 0 0-6-6V4Z",
  stop: "M7 7h10v10H7V7Z",
  terminal: "M4 5h16v14H4V5Zm2 2v10h12V7H6Zm2 2.2 3 2.8-3 2.8-1.1-1.2 1.7-1.6-1.7-1.6L8 9.2Zm4.2 5.2H16V16h-3.8v-1.6Z",
  warning: "M12 4 21 20H3L12 4Zm0 3.8L6.3 18h11.4L12 7.8Zm-.9 3.2h1.8v3.8h-1.8V11Zm0 5h1.8v1.8h-1.8V16Z",
  x: "m7 5.8 5 5 5-5L18.2 7l-5 5 5 5-1.2 1.2-5-5-5 5L5.8 17l5-5-5-5L7 5.8Z",
};

export function CodexIcon({ name, className = "size-5" }: CodexIconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d={paths[name]} />
    </svg>
  );
}
```

- [ ] **Step 2: Create top menu**

Create `src/components/TopMenu.tsx`:

```tsx
import { CodexIcon } from "./CodexIcon";

export function TopMenu() {
  return (
    <header className="flex h-11 shrink-0 items-center justify-between bg-[var(--codex-window)] px-3 text-[13px] text-[var(--codex-text-muted)]">
      <div className="flex items-center gap-1.5">
        <button className="grid size-8 place-items-center rounded-[9px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Toggle sidebar">
          <CodexIcon name="menu" className="size-[18px]" />
        </button>
        <button className="grid size-8 place-items-center rounded-[9px] text-[var(--codex-text-faint)] hover:bg-[var(--codex-hover)]" type="button" aria-label="Back">
          <CodexIcon name="back" className="size-[18px]" />
        </button>
        <button className="grid size-8 place-items-center rounded-[9px] text-[var(--codex-text-faint)] hover:bg-[var(--codex-hover)]" type="button" aria-label="Forward">
          <CodexIcon name="forward" className="size-[18px]" />
        </button>
        {["File", "Edit", "View", "Help"].map((item) => (
          <button key={item} className="rounded-[8px] px-2.5 py-1.5 hover:bg-[var(--codex-hover)]" type="button">
            {item}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1 text-[var(--codex-text-faint)]">
        <button className="grid size-8 place-items-center rounded-[8px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Minimize">
          _
        </button>
        <button className="grid size-8 place-items-center rounded-[8px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Maximize">
          □
        </button>
        <button className="grid size-8 place-items-center rounded-[8px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Close">
          ×
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create sidebar**

Create `src/components/Sidebar.tsx`:

```tsx
import type { ActiveView, ProjectGroup } from "../types";
import { primaryActions } from "../data/mockData";
import { CodexIcon } from "./CodexIcon";

interface SidebarProps {
  activeThreadId: string;
  groups: ProjectGroup[];
  onOpenPalette: () => void;
  onSelectThread: (threadId: string) => void;
  onSetView: (view: ActiveView) => void;
}

export function Sidebar({ activeThreadId, groups, onOpenPalette, onSelectThread, onSetView }: SidebarProps) {
  return (
    <aside className="hidden w-[298px] shrink-0 flex-col bg-[var(--codex-sidebar)] px-3 pb-3 pt-2 text-[13px] text-[var(--codex-text-muted)] md:flex xl:w-[298px]">
      <div className="space-y-1">
        {primaryActions.map((action) => (
          <button
            key={action.id}
            className="flex h-10 w-full items-center gap-2.5 rounded-[10px] px-2.5 text-left hover:bg-[var(--codex-hover)]"
            type="button"
            onClick={() => {
              if (action.opensPalette) onOpenPalette();
              if (action.view) onSetView(action.view);
            }}
          >
            <CodexIcon name={action.icon} className="size-5 text-[var(--codex-text-faint)]" />
            <span className="truncate">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 flex-1 overflow-hidden">
        <div className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.04em] text-[var(--codex-text-faint)]">Projects</div>
        <div className="space-y-4">
          {groups.map((group) => (
            <section key={group.id}>
              <div className="mb-1 flex h-8 items-center gap-2 px-2 text-[13px] font-medium text-[var(--codex-text)]">
                <CodexIcon name="folder" className="size-[18px] text-[var(--codex-text-faint)]" />
                <span className="truncate">{group.name}</span>
              </div>
              <div className="space-y-0.5">
                {group.threads.map((thread) => {
                  const active = thread.id === activeThreadId;
                  return (
                    <button
                      key={thread.id}
                      className={[
                        "flex h-9 w-full items-center gap-2 rounded-[10px] px-2 text-left transition-colors",
                        active ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "hover:bg-[var(--codex-hover)]",
                      ].join(" ")}
                      type="button"
                      onClick={() => {
                        onSelectThread(thread.id);
                        onSetView(thread.running ? "running" : "chat");
                      }}
                    >
                      <span className="min-w-0 flex-1 truncate">{thread.title}</span>
                      {thread.running ? (
                        <span className="size-2 rounded-full bg-[var(--codex-accent)]" />
                      ) : (
                        <span className="text-[11px] text-[var(--codex-text-faint)]">{thread.time}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      <button
        className="mt-3 flex h-10 w-full items-center gap-2.5 rounded-[10px] px-2.5 text-left hover:bg-[var(--codex-hover)]"
        type="button"
        onClick={() => onSetView("settings")}
      >
        <CodexIcon name="settings" className="size-5 text-[var(--codex-text-faint)]" />
        <span>Settings</span>
      </button>
    </aside>
  );
}
```

- [ ] **Step 4: Create app frame**

Create `src/components/AppFrame.tsx`:

```tsx
import type { ReactNode } from "react";
import type { ActiveView, ProjectGroup } from "../types";
import { Sidebar } from "./Sidebar";
import { TopMenu } from "./TopMenu";

interface AppFrameProps {
  activeThreadId: string;
  groups: ProjectGroup[];
  onOpenPalette: () => void;
  onSelectThread: (threadId: string) => void;
  onSetView: (view: ActiveView) => void;
  children: ReactNode;
}

export function AppFrame({ activeThreadId, groups, onOpenPalette, onSelectThread, onSetView, children }: AppFrameProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-[var(--codex-window)] text-[var(--codex-text)]">
      <TopMenu />
      <div className="flex min-h-0 flex-1">
        <Sidebar
          activeThreadId={activeThreadId}
          groups={groups}
          onOpenPalette={onOpenPalette}
          onSelectThread={onSelectThread}
          onSetView={onSetView}
        />
        <div className="min-w-0 flex-1 rounded-tl-[18px] border-l border-t border-[var(--codex-border-soft)] bg-[var(--codex-main)] shadow-[inset_1px_1px_0_rgb(255_255_255_/_0.32)]">
          {children}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Use frame in App**

Replace `src/App.tsx` with:

```tsx
import { useState } from "react";
import { AppFrame } from "./components/AppFrame";
import { projectGroups } from "./data/mockData";
import type { ActiveView } from "./types";

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>("chat");
  const [activeThreadId, setActiveThreadId] = useState("thread-1");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  return (
    <AppFrame
      activeThreadId={activeThreadId}
      groups={projectGroups}
      onOpenPalette={() => setIsCommandPaletteOpen(true)}
      onSelectThread={setActiveThreadId}
      onSetView={setActiveView}
    >
      <div className="flex h-full min-h-0 items-center justify-center">
        <div className="rounded-[14px] border border-[var(--codex-border)] bg-[var(--codex-surface-raised)] px-5 py-4 shadow-[var(--codex-shadow-soft)]">
          <div className="text-xs text-[var(--codex-text-muted)]">Active view</div>
          <div className="mt-1 text-lg font-medium">{activeView}</div>
          {isCommandPaletteOpen ? (
            <button className="mt-3 text-sm text-[var(--codex-accent)]" type="button" onClick={() => setIsCommandPaletteOpen(false)}>
              Command palette flag is open. Close flag.
            </button>
          ) : null}
        </div>
      </div>
    </AppFrame>
  );
}
```

- [ ] **Step 6: Verify frame builds**

Run:

```bash
bun run build
```

Expected: Build succeeds and no icon key is missing from `Record<IconName, string>`.

- [ ] **Step 7: Commit shell frame**

Run:

```bash
git add src/components/CodexIcon.tsx src/components/TopMenu.tsx src/components/Sidebar.tsx src/components/AppFrame.tsx src/App.tsx
git commit -m "Build Codex app shell frame" -m "Add the native-like top menu, dense sidebar, app frame, and local Codex icon registry for the web clone prototype."
```

## Task 4: Build Chat Workspace, Stream, Composer, And Environment Card

**Files:**
- Create: `src/components/ChatStream.tsx`
- Create: `src/components/Composer.tsx`
- Create: `src/components/EnvironmentCard.tsx`
- Create: `src/components/ChatWorkspace.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create chat stream**

Create `src/components/ChatStream.tsx`:

```tsx
import type { ChatMessage } from "../types";
import { CodexIcon } from "./CodexIcon";

interface ChatStreamProps {
  messages: ChatMessage[];
  running?: boolean;
}

export function ChatStream({ messages, running = false }: ChatStreamProps) {
  return (
    <div className="mx-auto flex w-full max-w-[920px] flex-col gap-8 px-5 pb-[180px] pt-10 text-[15px] leading-[1.65]">
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
      {running ? <p className="text-[14px] text-[var(--codex-text-faint)]">Thinking…</p> : null}
    </div>
  );
}
```

- [ ] **Step 2: Create composer**

Create `src/components/Composer.tsx`:

```tsx
import { CodexIcon } from "./CodexIcon";

interface ComposerProps {
  running?: boolean;
  onToggleRunning: () => void;
  onOpenTools: () => void;
}

export function Composer({ running = false, onToggleRunning, onOpenTools }: ComposerProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center bg-gradient-to-t from-[var(--codex-main)] via-[var(--codex-main)] to-transparent px-4 pb-6 pt-16">
      <div className="pointer-events-auto w-full max-w-[920px] rounded-[24px] border border-[var(--codex-border)] bg-[var(--codex-surface-raised)] px-4 py-3 shadow-[var(--codex-shadow)]">
        <textarea
          className="h-16 w-full resize-none bg-transparent text-[15px] leading-6 text-[var(--codex-text)] outline-none placeholder:text-[var(--codex-text-faint)]"
          placeholder="Ask Codex to build, explain, or review..."
        />
        <div className="flex items-center justify-between pt-2 text-[12px] text-[var(--codex-text-muted)]">
          <div className="flex items-center gap-1.5">
            <button className="grid size-8 place-items-center rounded-[10px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Add context">
              <CodexIcon name="plus" className="size-[18px]" />
            </button>
            <button
              className="flex h-8 items-center gap-1.5 rounded-[10px] px-2.5 text-[var(--codex-permission)] hover:bg-[var(--codex-hover)]"
              type="button"
            >
              <CodexIcon name="warning" className="size-4" />
              Workspace write
            </button>
            <button className="hidden h-8 items-center gap-1.5 rounded-[10px] px-2.5 hover:bg-[var(--codex-hover)] sm:flex" type="button">
              GPT-5
              <CodexIcon name="chevronDown" className="size-3.5" />
            </button>
            <button className="hidden h-8 items-center gap-1.5 rounded-[10px] px-2.5 hover:bg-[var(--codex-hover)] md:flex" type="button" onClick={onOpenTools}>
              Tools
              <CodexIcon name="chevronDown" className="size-3.5" />
            </button>
          </div>
          <button
            className="grid size-9 place-items-center rounded-full bg-[color-mix(in_oklab,var(--codex-accent)_22%,var(--codex-surface-muted))] text-[var(--codex-text)] shadow-[0_6px_18px_rgb(76_79_105_/_0.12)]"
            type="button"
            aria-label={running ? "Stop" : "Send"}
            onClick={onToggleRunning}
          >
            <CodexIcon name={running ? "stop" : "send"} className="size-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create environment card**

Create `src/components/EnvironmentCard.tsx`:

```tsx
import type { EnvironmentItem, ProgressItem, SubagentItem } from "../types";
import { CodexIcon } from "./CodexIcon";

interface EnvironmentCardProps {
  items: EnvironmentItem[];
  progress: ProgressItem[];
  subagents: SubagentItem[];
  running?: boolean;
}

const toneClass = {
  muted: "text-[var(--codex-text-muted)]",
  green: "text-[var(--codex-diff-added)]",
  red: "text-[var(--codex-diff-removed)]",
  accent: "text-[var(--codex-accent)]",
  warning: "text-[var(--codex-permission)]",
};

export function EnvironmentCard({ items, progress, subagents, running = false }: EnvironmentCardProps) {
  return (
    <aside className="hidden w-[374px] shrink-0 px-5 py-6 xl:block">
      <div className="rounded-[24px] border border-[var(--codex-border)] bg-[var(--codex-surface-raised)] shadow-[var(--codex-shadow-soft)]">
        <div className="flex h-14 items-center justify-between border-b border-[var(--codex-border-soft)] px-4">
          <div className="font-medium">Environment</div>
          <button className="grid size-8 place-items-center rounded-[10px] text-[var(--codex-text-muted)] hover:bg-[var(--codex-hover)]" type="button" aria-label="Environment settings">
            <CodexIcon name="settings" className="size-4" />
          </button>
        </div>
        <div className="divide-y divide-[var(--codex-border-soft)]">
          {items.map((item) => (
            <div key={item.label} className="flex h-11 items-center gap-3 px-4 text-[13px]">
              <CodexIcon name={item.icon} className="size-4 text-[var(--codex-text-faint)]" />
              <span className="flex-1 text-[var(--codex-text-muted)]">{item.label}</span>
              <span className={toneClass[item.tone ?? "muted"]}>{item.value}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--codex-border-soft)] px-4 py-4">
          <div className="mb-3 text-[12px] font-medium text-[var(--codex-text-muted)]">Progress</div>
          <div className="space-y-2.5">
            {progress.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-[12px]">
                <span
                  className={[
                    "grid size-4 place-items-center rounded-full border",
                    item.state === "done"
                      ? "border-[var(--codex-diff-added)] bg-[color-mix(in_oklab,var(--codex-diff-added)_15%,transparent)] text-[var(--codex-diff-added)]"
                      : item.state === "active"
                        ? "border-[var(--codex-accent)] text-[var(--codex-accent)]"
                        : "border-[var(--codex-border)] text-transparent",
                  ].join(" ")}
                >
                  {item.state === "done" ? <CodexIcon name="check" className="size-3" /> : null}
                </span>
                <span className={item.state === "pending" ? "text-[var(--codex-text-faint)]" : "text-[var(--codex-text-muted)]"}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-[var(--codex-border-soft)] px-4 py-4">
          <div className="mb-3 flex items-center justify-between text-[12px] font-medium text-[var(--codex-text-muted)]">
            <span>Subagents</span>
            {running ? <span className="text-[var(--codex-accent)]">active</span> : null}
          </div>
          <div className="space-y-2">
            {subagents.map((agent) => (
              <div key={agent.name} className="flex items-center gap-2 text-[12px]">
                <span className={["size-2 rounded-full", toneClass[agent.tone]].join(" ")} style={{ background: "currentColor" }} />
                <span className="flex-1">{agent.name}</span>
                <span className="text-[var(--codex-text-faint)]">{agent.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 4: Create chat workspace**

Create `src/components/ChatWorkspace.tsx`:

```tsx
import {
  chatMessages,
  environmentItems,
  progressItems,
  subagents,
} from "../data/mockData";
import type { ActiveView } from "../types";
import { ChatStream } from "./ChatStream";
import { Composer } from "./Composer";
import { EnvironmentCard } from "./EnvironmentCard";

interface ChatWorkspaceProps {
  activeView: ActiveView;
  onSetView: (view: ActiveView) => void;
}

export function ChatWorkspace({ activeView, onSetView }: ChatWorkspaceProps) {
  const running = activeView === "running";

  return (
    <section className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-[var(--codex-border-soft)] px-5">
        <div className="min-w-0">
          <div className="truncate text-[14px] font-medium">页面的设计</div>
          <div className="text-[12px] text-[var(--codex-text-faint)]">{"C:\\Users\\Yrd98\\project\\aesthetics"}</div>
        </div>
        <button
          className="h-8 rounded-[10px] border border-[var(--codex-border-soft)] bg-[var(--codex-surface)] px-3 text-[12px] text-[var(--codex-text-muted)] hover:bg-[var(--codex-hover)]"
          type="button"
          onClick={() => onSetView("tool-switcher")}
        >
          Open tools
        </button>
      </header>
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <div className="relative min-w-0 flex-1 overflow-y-auto">
          <ChatStream messages={chatMessages} running={running} />
          <Composer running={running} onToggleRunning={() => onSetView(running ? "chat" : "running")} onOpenTools={() => onSetView("tool-switcher")} />
        </div>
        <EnvironmentCard items={environmentItems} progress={progressItems} subagents={subagents} running={running} />
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Render chat workspace in App**

Replace the child content inside `AppFrame` in `src/App.tsx` with:

```tsx
<ChatWorkspace activeView={activeView} onSetView={setActiveView} />
```

and add:

```tsx
import { ChatWorkspace } from "./components/ChatWorkspace";
```

- [ ] **Step 6: Verify chat workspace**

Run:

```bash
bun run build
```

Expected: Build succeeds. The JSX path string renders as `C:\Users\Yrd98\project\aesthetics`.

- [ ] **Step 7: Commit chat workspace**

Run:

```bash
git add src/components/ChatStream.tsx src/components/Composer.tsx src/components/EnvironmentCard.tsx src/components/ChatWorkspace.tsx src/App.tsx
git commit -m "Add Codex chat workspace prototype" -m "Implement the prose-first chat stream, floating composer, running state affordance, and floating environment card for the Codex App web clone."
```

## Task 5: Add Tool Switcher, Review Workspace, And File Workspace

**Files:**
- Create: `src/components/ToolSwitcher.tsx`
- Create: `src/components/ReviewWorkspace.tsx`
- Create: `src/components/FileWorkspace.tsx`
- Modify: `src/components/ChatWorkspace.tsx`

- [ ] **Step 1: Create tool switcher**

Create `src/components/ToolSwitcher.tsx`:

```tsx
import type { ActiveView, IconName } from "../types";
import { CodexIcon } from "./CodexIcon";

interface ToolSwitcherProps {
  onSetView: (view: ActiveView) => void;
}

const tools: Array<{ label: string; view: ActiveView; icon: IconName; shortcut: string }> = [
  { label: "Review", view: "review", icon: "review", shortcut: "⌘ R" },
  { label: "Terminal", view: "terminal", icon: "terminal", shortcut: "⌘ T" },
  { label: "Browser", view: "browser", icon: "browser", shortcut: "⌘ B" },
  { label: "Files", view: "files", icon: "files", shortcut: "⌘ F" },
  { label: "Side chat", view: "chat", icon: "sideChat", shortcut: "Esc" },
];

export function ToolSwitcher({ onSetView }: ToolSwitcherProps) {
  return (
    <div className="flex h-full items-center justify-center px-8">
      <div className="w-full max-w-[600px] space-y-2">
        {tools.map((tool) => (
          <button
            key={tool.label}
            className="flex h-[52px] w-full items-center gap-3 rounded-[12px] px-4 text-left text-[14px] text-[var(--codex-text)] hover:bg-[var(--codex-hover)]"
            type="button"
            onClick={() => onSetView(tool.view)}
          >
            <CodexIcon name={tool.icon} className="size-5 text-[var(--codex-text-muted)]" />
            <span className="flex-1">{tool.label}</span>
            <span className="rounded-[7px] bg-[var(--codex-surface-muted)] px-2 py-1 text-[11px] text-[var(--codex-text-faint)]">{tool.shortcut}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create review workspace**

Create `src/components/ReviewWorkspace.tsx`:

```tsx
import { diffFiles, fileTree } from "../data/mockData";
import { CodexIcon } from "./CodexIcon";

export function ReviewWorkspace() {
  return (
    <div className="flex h-full min-w-0 flex-1 border-l border-[var(--codex-border-soft)] bg-[color-mix(in_oklab,var(--codex-surface)_78%,transparent)]">
      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-11 items-center gap-1 border-b border-[var(--codex-border-soft)] px-3">
          {["Review", "Terminal", "Browser"].map((tab) => (
            <button key={tab} className={["h-8 rounded-[9px] px-3 text-[12px]", tab === "Review" ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "text-[var(--codex-text-muted)] hover:bg-[var(--codex-hover)]"].join(" ")} type="button">
              {tab}
            </button>
          ))}
        </div>
        <div className="flex h-12 items-center gap-2 border-b border-[var(--codex-border-soft)] px-3 text-[12px] text-[var(--codex-text-muted)]">
          <button className="h-8 rounded-[9px] bg-[var(--codex-surface-muted)] px-3" type="button">Last turn</button>
          <span className="text-[var(--codex-diff-added)]">+97</span>
          <span className="text-[var(--codex-diff-removed)]">-7</span>
          <span className="flex-1" />
          <button className="grid size-8 place-items-center rounded-[9px] hover:bg-[var(--codex-hover)]" type="button" aria-label="More"><CodexIcon name="more" className="size-4" /></button>
          <button className="h-8 rounded-[9px] bg-[var(--codex-surface-muted)] px-3" type="button">Commit</button>
          <button className="h-8 rounded-[9px] bg-[var(--codex-surface-muted)] px-3 text-[var(--codex-text-faint)]" type="button">Create PR</button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-4">
          {diffFiles.map((file) => (
            <div key={file.path} className="overflow-hidden rounded-[12px] border border-[var(--codex-border-soft)] bg-[var(--codex-surface-raised)]">
              <div className="flex h-10 items-center gap-2 border-b border-[var(--codex-border-soft)] px-3 text-[12px]">
                <CodexIcon name="file" className="size-4 text-[var(--codex-text-muted)]" />
                <span className="min-w-0 flex-1 truncate">{file.path}</span>
                <span className="text-[var(--codex-diff-added)]">+{file.additions}</span>
                <span className="text-[var(--codex-diff-removed)]">-{file.removals}</span>
              </div>
              <pre className="m-0 bg-[color-mix(in_oklab,var(--codex-surface-muted)_50%,transparent)] py-2 text-[12px] leading-6">
                {file.lines.map((line, index) => (
                  <div
                    key={`${line.text}-${index}`}
                    className={[
                      "grid grid-cols-[48px_48px_1fr] px-3",
                      line.kind === "add" ? "bg-[color-mix(in_oklab,var(--codex-diff-added)_13%,transparent)]" : "",
                      line.kind === "remove" ? "bg-[color-mix(in_oklab,var(--codex-diff-removed)_12%,transparent)]" : "",
                      line.kind === "meta" ? "text-[var(--codex-text-faint)]" : "",
                    ].join(" ")}
                  >
                    <span className="text-right text-[var(--codex-text-faint)]">{line.oldLine ?? ""}</span>
                    <span className="text-right text-[var(--codex-text-faint)]">{line.newLine ?? ""}</span>
                    <code className="pl-4">{line.text}</code>
                  </div>
                ))}
              </pre>
            </div>
          ))}
        </div>
      </section>
      <aside className="hidden w-[248px] shrink-0 border-l border-[var(--codex-border-soft)] p-3 text-[12px] text-[var(--codex-text-muted)] lg:block">
        <div className="mb-3 rounded-[9px] bg-[var(--codex-surface-raised)] px-3 py-2 text-[var(--codex-text-faint)]">Search files</div>
        {fileTree.map((item) => (
          <div key={item.path} className={["flex h-7 items-center gap-2 rounded-[8px] px-2", item.active ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : ""].join(" ")} style={{ paddingLeft: 8 + item.depth * 12 }}>
            <span className="truncate">{item.path}</span>
            {item.status ? <span className="ml-auto text-[var(--codex-diff-added)]">M</span> : null}
          </div>
        ))}
      </aside>
    </div>
  );
}
```

- [ ] **Step 3: Create file workspace**

Create `src/components/FileWorkspace.tsx`:

```tsx
import { fileTabs, fileTree } from "../data/mockData";
import { CodexIcon } from "./CodexIcon";

export function FileWorkspace() {
  return (
    <div className="flex h-full min-w-0 flex-1 border-l border-[var(--codex-border-soft)] bg-[color-mix(in_oklab,var(--codex-surface)_78%,transparent)]">
      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-11 items-center gap-1 border-b border-[var(--codex-border-soft)] px-3">
          {fileTabs.map((tab) => (
            <button key={tab.id} className={["flex h-8 max-w-[280px] items-center gap-2 rounded-[9px] px-3 text-[12px]", tab.active ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "text-[var(--codex-text-muted)] hover:bg-[var(--codex-hover)]"].join(" ")} type="button">
              <CodexIcon name="file" className="size-4" />
              <span className="truncate">{tab.title}</span>
            </button>
          ))}
        </div>
        <div className="h-10 border-b border-[var(--codex-border-soft)] px-5 py-2 text-[12px] text-[var(--codex-text-faint)]">
          docs / superpowers / specs / 2026-06-10-codex-web-ui-ux-clone-design.md
        </div>
        <article className="min-h-0 flex-1 overflow-auto px-8 py-7">
          <div className="max-w-[860px]">
            <h1 className="mb-5 text-[30px] font-medium leading-tight text-[var(--codex-text)]">Codex App UI/UX Web Clone Spec</h1>
            <p className="mb-4 text-[15px] leading-7 text-[var(--codex-text-muted)]">
              The first implementation should be a runnable static-data prototype, not another design-only artifact.
            </p>
            <h2 className="mb-3 mt-8 text-[18px] font-medium">Confirmed stack</h2>
            <ul className="mb-6 space-y-2 text-[14px] text-[var(--codex-text-muted)]">
              <li>Vite, React, TypeScript.</li>
              <li>Tailwind CSS v4 with the Tailwind Vite plugin.</li>
              <li>No component library in the first pass.</li>
            </ul>
            <div className="relative rounded-[14px] bg-[var(--codex-surface-muted)] p-4 text-[12px] leading-6">
              <button className="absolute right-3 top-3 grid size-8 place-items-center rounded-[9px] hover:bg-[var(--codex-hover)]" type="button" aria-label="Copy code">
                <CodexIcon name="copy" className="size-4" />
              </button>
              <pre>{`export default defineConfig({
  plugins: [react(), tailwindcss()],
});`}</pre>
            </div>
          </div>
        </article>
      </section>
      <aside className="hidden w-[248px] shrink-0 border-l border-[var(--codex-border-soft)] p-3 text-[12px] text-[var(--codex-text-muted)] lg:block">
        <div className="mb-3 rounded-[9px] bg-[var(--codex-surface-raised)] px-3 py-2 text-[var(--codex-text-faint)]">Search files</div>
        {fileTree.map((item) => (
          <div key={item.path} className={["flex h-7 items-center gap-2 rounded-[8px] px-2", item.active ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : ""].join(" ")} style={{ paddingLeft: 8 + item.depth * 12 }}>
            <span className="truncate">{item.path}</span>
            {item.status ? <span className="ml-auto text-[var(--codex-diff-added)]">M</span> : null}
          </div>
        ))}
      </aside>
    </div>
  );
}
```

- [ ] **Step 4: Compose tool workspaces into chat workspace**

Modify `src/components/ChatWorkspace.tsx` to import new components:

```tsx
import { FileWorkspace } from "./FileWorkspace";
import { ReviewWorkspace } from "./ReviewWorkspace";
import { ToolSwitcher } from "./ToolSwitcher";
```

Inside the flex body, replace the environment-card-only right side with:

```tsx
{activeView === "tool-switcher" ? (
  <div className="min-w-0 flex-[0_1_620px] border-l border-[var(--codex-border-soft)]">
    <ToolSwitcher onSetView={onSetView} />
  </div>
) : activeView === "review" ? (
  <ReviewWorkspace />
) : activeView === "files" ? (
  <FileWorkspace />
) : activeView === "terminal" || activeView === "browser" ? (
  <div className="flex min-w-0 flex-[0_1_680px] items-center justify-center border-l border-[var(--codex-border-soft)] text-[var(--codex-text-muted)]">
    <div className="text-center">
      <div className="text-[15px] font-medium text-[var(--codex-text)]">{activeView === "terminal" ? "Terminal" : "Browser"}</div>
      <p className="mt-2 max-w-[360px] text-[13px]">This first prototype preserves the workspace shell and reserves this tool surface for the next interaction pass.</p>
    </div>
  </div>
) : (
  <EnvironmentCard items={environmentItems} progress={progressItems} subagents={subagents} running={running} />
)}
```

- [ ] **Step 5: Verify tool workspaces**

Run:

```bash
bun run build
```

Expected: Build succeeds and all `ActiveView` branches compile.

- [ ] **Step 6: Commit tool workspaces**

Run:

```bash
git add src/components/ToolSwitcher.tsx src/components/ReviewWorkspace.tsx src/components/FileWorkspace.tsx src/components/ChatWorkspace.tsx
git commit -m "Add Codex tool workspaces" -m "Implement the tool switcher, review diff workspace, and file viewer workspace while preserving the Codex chat context."
```

## Task 6: Add Settings And Command Palette

**Files:**
- Create: `src/components/SettingsView.tsx`
- Create: `src/components/CommandPalette.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create settings view**

Create `src/components/SettingsView.tsx`:

```tsx
import { settingsRows } from "../data/mockData";

export function SettingsView() {
  return (
    <section className="flex h-full min-h-0 bg-[var(--codex-main)]">
      <aside className="hidden w-[230px] shrink-0 border-r border-[var(--codex-border-soft)] px-3 py-5 text-[13px] text-[var(--codex-text-muted)] md:block">
        {["General", "Appearance", "Model", "Integrations", "Advanced"].map((item) => (
          <button key={item} className={["mb-1 flex h-9 w-full items-center rounded-[10px] px-3 text-left", item === "General" ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "hover:bg-[var(--codex-hover)]"].join(" ")} type="button">
            {item}
          </button>
        ))}
      </aside>
      <main className="min-w-0 flex-1 overflow-auto px-8 py-16">
        <div className="mx-auto max-w-[760px]">
          <h1 className="text-[28px] font-medium">Settings</h1>
          <p className="mt-2 text-[14px] text-[var(--codex-text-muted)]">General preferences for this local Codex workspace.</p>
          <div className="mt-8 overflow-hidden rounded-[16px] border border-[var(--codex-border-soft)] bg-[var(--codex-surface-raised)]">
            {settingsRows.map((row) => (
              <div key={row.label} className="flex min-h-[68px] items-center gap-5 border-b border-[var(--codex-border-soft)] px-4 py-3 last:border-b-0">
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-medium">{row.label}</div>
                  <div className="mt-1 text-[12px] text-[var(--codex-text-muted)]">{row.description}</div>
                </div>
                {row.control === "toggle" ? (
                  <span className={["relative h-6 w-11 rounded-full", row.enabled ? "bg-[var(--codex-accent)]" : "bg-[var(--codex-surface-muted)]"].join(" ")}>
                    <span className={["absolute top-1 size-4 rounded-full bg-white transition", row.enabled ? "left-6" : "left-1"].join(" ")} />
                  </span>
                ) : row.control === "radio" ? (
                  <span className="rounded-[9px] bg-[color-mix(in_oklab,var(--codex-accent)_14%,transparent)] px-3 py-1.5 text-[12px] text-[var(--codex-accent)]">{row.value}</span>
                ) : (
                  <button className="h-8 rounded-[9px] bg-[var(--codex-surface-muted)] px-3 text-[12px] text-[var(--codex-text-muted)]" type="button">{row.value}</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </section>
  );
}
```

- [ ] **Step 2: Create command palette**

Create `src/components/CommandPalette.tsx`:

```tsx
import { paletteRows } from "../data/mockData";
import { CodexIcon } from "./CodexIcon";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 grid place-items-start bg-[var(--codex-overlay-dim)] px-4 pt-[14vh] backdrop-blur-[2px]" onClick={onClose}>
      <div className="mx-auto w-full max-w-[650px] overflow-hidden rounded-[24px] border border-[var(--codex-border)] bg-[var(--codex-surface-raised)] shadow-[var(--codex-shadow)]" onClick={(event) => event.stopPropagation()}>
        <div className="flex h-14 items-center gap-3 border-b border-[var(--codex-border-soft)] px-4">
          <CodexIcon name="search" className="size-5 text-[var(--codex-text-faint)]" />
          <input className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[var(--codex-text-faint)]" placeholder="Search chats" autoFocus />
          <button className="grid size-8 place-items-center rounded-[9px] text-[var(--codex-text-muted)] hover:bg-[var(--codex-hover)]" type="button" onClick={onClose} aria-label="Close search">
            <CodexIcon name="x" className="size-4" />
          </button>
        </div>
        <div className="p-2">
          {paletteRows.map((row) => (
            <button key={row.title} className={["flex h-12 w-full items-center gap-3 rounded-[12px] px-3 text-left", row.active ? "bg-[var(--codex-active)]" : "hover:bg-[var(--codex-hover)]"].join(" ")} type="button">
              <span className={["size-1.5 rounded-full", row.active ? "bg-[var(--codex-accent)]" : "bg-transparent"].join(" ")} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium">{row.title}</span>
                <span className="block truncate text-[12px] text-[var(--codex-text-faint)]">{row.project}</span>
              </span>
              <span className="rounded-[7px] bg-[var(--codex-surface-muted)] px-2 py-1 text-[11px] text-[var(--codex-text-faint)]">{row.shortcut}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Wire settings and palette into App**

Modify `src/App.tsx` imports:

```tsx
import { CommandPalette } from "./components/CommandPalette";
import { SettingsView } from "./components/SettingsView";
```

Inside `AppFrame`, render:

```tsx
{activeView === "settings" ? <SettingsView /> : <ChatWorkspace activeView={activeView} onSetView={setActiveView} />}
<CommandPalette open={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
```

- [ ] **Step 4: Verify settings and palette**

Run:

```bash
bun run build
```

Expected: Build succeeds and settings/palette imports resolve.

- [ ] **Step 5: Commit settings and command palette**

Run:

```bash
git add src/components/SettingsView.tsx src/components/CommandPalette.tsx src/App.tsx
git commit -m "Add settings and command palette states" -m "Implement the centered settings surface and dimmed command palette overlay for the Codex App web clone."
```

## Task 7: Responsive Polish And Visual Verification

**Files:**
- Modify: `src/components/AppFrame.tsx`
- Modify: `src/components/ChatWorkspace.tsx`
- Modify: `src/components/Composer.tsx`
- Modify: `src/components/ReviewWorkspace.tsx`
- Modify: `src/components/FileWorkspace.tsx`
- Modify: `src/components/SettingsView.tsx`

- [ ] **Step 1: Add responsive shell behavior**

Update shell and workspace classes so:

- Sidebar is hidden below `md`.
- Main shell keeps `rounded-tl-[18px]` on desktop and removes visual dependence on the sidebar on mobile.
- Environment card stays hidden below `xl`.
- Review and Files hide the file tree below `lg`.
- Composer uses `max-w-[920px]` and `px-4` at all widths.

Concrete class edits:

```tsx
// AppFrame main shell
className="min-w-0 flex-1 rounded-tl-[18px] border-l border-t border-[var(--codex-border-soft)] bg-[var(--codex-main)] shadow-[inset_1px_1px_0_rgb(255_255_255_/_0.32)] max-md:rounded-tl-none max-md:border-l-0"

// ChatWorkspace body should allow horizontal tool collapse
className="relative flex min-h-0 flex-1 overflow-hidden max-lg:block"

// Tool workspace wrappers should include:
className="min-w-0 flex-[0_1_620px] border-l border-[var(--codex-border-soft)] max-lg:h-full max-lg:border-l-0"
```

- [ ] **Step 2: Add keyboard affordances**

In `src/App.tsx`, import `useEffect`:

```tsx
import { useEffect, useState } from "react";
```

Add this effect inside `App`:

```tsx
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      setIsCommandPaletteOpen(true);
    }
    if (event.key === "Escape") {
      setIsCommandPaletteOpen(false);
      if (activeView !== "settings") setActiveView("chat");
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [activeView]);
```

- [ ] **Step 3: Run production build**

Run:

```bash
bun run build
```

Expected: Build succeeds.

- [ ] **Step 4: Start dev server**

Run:

```bash
bun run dev -- --host 127.0.0.1
```

Expected: Vite prints a local URL, usually `http://127.0.0.1:5173/`.

- [ ] **Step 5: Verify seven states in browser**

Open the dev server URL and check:

- Main chat appears immediately as the first viewport.
- Left sidebar is pale blue-gray, dense, and text-heavy.
- Composer floats near the bottom and the send button switches to stop when running.
- Tool switcher opens as a right-workspace list, not a modal card grid.
- Review opens a split chat + diff workspace with pale green/red diff rows.
- Files opens a document viewer with tabs, breadcrumb, code block, and file tree.
- Settings replaces the workspace with centered settings panels.
- Command palette dims the app and centers a 650px search panel.

- [ ] **Step 6: Commit responsive polish**

Run:

```bash
git add src/App.tsx src/components/AppFrame.tsx src/components/ChatWorkspace.tsx src/components/Composer.tsx src/components/ReviewWorkspace.tsx src/components/FileWorkspace.tsx src/components/SettingsView.tsx
git commit -m "Polish responsive Codex clone states" -m "Tune responsive shell behavior, keyboard affordances, and browser-verified state transitions for the static Codex App web clone."
```

## Self-Review

Spec coverage:

- Source screenshots and local Catppuccin tokens are implemented through `tokens.css`, app shell dimensions, and component styling.
- Main chat, tool switcher, review, file viewer, settings, command palette, and running progress each have a task.
- Static data and no-backend behavior are explicit in Task 2.
- Tailwind v4 with `@tailwindcss/vite` is explicit in Task 1.
- No marketing page or dashboard-card system is introduced.

No placeholders:

- The plan avoids TBD/TODO/implement-later language.
- Code steps include concrete file contents or concrete edits.
- Verification commands and expected outcomes are included for each task.

Known risk:

- The local icon glyphs are approximations. This is acceptable for the first private-study prototype because the spec requires a consistent internal registry rather than a public Codex icon package.
