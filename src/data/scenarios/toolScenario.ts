import type { DiffFile, EnvironmentItem, FileTab, FileTreeItem, ProgressItem, SubagentItem } from "../../types";

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
  { path: "dist", depth: 0 },
  { path: "docs", depth: 0 },
  { path: "architecture", depth: 1 },
  { path: "superpowers", depth: 1 },
  { path: "plans", depth: 2 },
  { path: "2026-06-10-codex-web-ui-ux-clone-implementation.md", depth: 3, status: "modified" },
  { path: "specs", depth: 2 },
  { path: "2026-06-10-codex-web-ui-ux-clone-design.md", depth: 3, active: true, status: "modified" },
  { path: "references", depth: 1 },
  { path: "codex-app-screenshots", depth: 2 },
  { path: "visuals", depth: 2 },
  { path: "codex-web-ui-main.png", depth: 3 },
  { path: "codex-web-ui-files.png", depth: 3 },
  { path: "node_modules", depth: 0 },
  { path: "src", depth: 0 },
  { path: "actions", depth: 1 },
  { path: "appActions.ts", depth: 2, active: true },
  { path: "components", depth: 1 },
  { path: "data", depth: 1 },
  { path: "layout", depth: 1 },
  { path: "styles", depth: 1 },
  { path: "App.tsx", depth: 1 },
  { path: "main.tsx", depth: 1 },
  { path: "types.ts", depth: 1 },
  { path: "AGENTS.md", depth: 0, status: "modified" },
  { path: "bun.lock", depth: 0 },
  { path: ".gitignore", depth: 0, status: "modified" },
];

export const browserHistory = ["http://127.0.0.1:5173/", "file:///C:/Users/Yrd98/project/aesthetics/dist/index.html", "https://developers.openai.com/codex/app/browser"];
