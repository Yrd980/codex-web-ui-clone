import type { SettingRow } from "../../types";

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

export const settingsSections = ["General", "Keyboard Shortcuts", "Browser Use", "Computer Use", "Connections", "Model"] as const;

export const shortcutRows = [
  ["Command menu", "Ctrl K"],
  ["Search threads", "Ctrl G"],
  ["Find in thread", "Ctrl F"],
  ["Toggle sidebar", "Ctrl B"],
  ["Toggle terminal", "Ctrl J"],
  ["Keyboard shortcuts", "Ctrl /"],
] as const;

export const sectionDescriptions: Record<(typeof settingsSections)[number], string> = {
  General: "General preferences for this local Codex workspace.",
  "Keyboard Shortcuts": "Find, inspect, and reset app commands.",
  "Browser Use": "Manage browser preview, annotations, and site permissions.",
  "Computer Use": "Configure desktop app control permissions.",
  Connections: "Manage GitHub, remote environments, and MCP-style connections.",
  Model: "Choose the active model and reasoning profile.",
};
