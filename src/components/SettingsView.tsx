import { useState } from "react";
import type { SettingsSection } from "../types";
import { CodexIcon } from "./CodexIcon";

interface SettingsViewProps {
  activeSection: SettingsSection;
  onSetSection: (section: SettingsSection) => void;
}

const sections: SettingsSection[] = ["General", "Keyboard Shortcuts", "Browser Use", "Computer Use", "Connections", "Model"];

const shortcutRows = [
  ["Command menu", "Ctrl K"],
  ["Search threads", "Ctrl G"],
  ["Find in thread", "Ctrl F"],
  ["Toggle sidebar", "Ctrl B"],
  ["Toggle terminal", "Ctrl J"],
  ["Keyboard shortcuts", "Ctrl /"],
];

const sectionDescriptions: Record<SettingsSection, string> = {
  General: "General preferences for this local Codex workspace.",
  "Keyboard Shortcuts": "Find, inspect, and reset app commands.",
  "Browser Use": "Manage browser preview, annotations, and site permissions.",
  "Computer Use": "Configure desktop app control permissions.",
  Connections: "Manage GitHub, remote environments, and MCP-style connections.",
  Model: "Choose the active model and reasoning profile.",
};

export function SettingsView({ activeSection, onSetSection }: SettingsViewProps) {
  const [enabledRows, setEnabledRows] = useState(["Animations", "Browser Use", "GitHub", "OpenAI Developers", "Computer Use"]);
  const [modelProfile, setModelProfile] = useState("5.5 Extra High");

  const toggleRow = (label: string) => {
    setEnabledRows((rows) => (rows.includes(label) ? rows.filter((row) => row !== label) : [...rows, label]));
  };

  const rows =
    activeSection === "General"
      ? [
          ["Work mode", "Agent", "Choose how Codex applies changes in this workspace."],
          ["Appearance", "Light", "Use the local light Codex chrome theme."],
          ["Animations", enabledRows.includes("Animations") ? "On" : "Off", "Reduce nonessential transitions for calmer review."],
          ["Open destination", "In app", "Choose where opened files appear."],
        ]
      : activeSection === "Browser Use"
        ? [
            ["Browser Use", enabledRows.includes("Browser Use") ? "On" : "Off", "Allow Codex to interact with the in-app browser."],
            ["Annotations", "On click", "Show comment pins on the current page preview."],
            ["Allowed site", "127.0.0.1:5173", "Current local preview origin."],
          ]
        : activeSection === "Computer Use"
          ? [
              ["Computer Use", enabledRows.includes("Computer Use") ? "On" : "Off", "Allow desktop app control in this shell."],
              ["Approval prompts", "Required", "Confirm before high-impact desktop actions."],
              ["Visible cursor", "On", "Show the automation pointer while controlling apps."],
            ]
          : activeSection === "Connections"
            ? [
                ["GitHub", enabledRows.includes("GitHub") ? "Connected" : "Disconnected", "Repository, PR, issue, and CI access."],
                ["OpenAI Developers", enabledRows.includes("OpenAI Developers") ? "Connected" : "Disconnected", "Official docs and platform helpers."],
                ["Slack", "Optional", "Workspace notifications and handoffs."],
              ]
            : [
                ["Active model", modelProfile, "Default reasoning profile for new turns."],
                ["Permissions", "Full access", "Workspace and network permission profile."],
                ["Auto review", "Manual", "Start review only when requested."],
              ];

  return (
    <section className="flex h-full min-h-0 bg-[var(--codex-main)]">
      <aside className="hidden w-[230px] shrink-0 border-r border-[var(--codex-border-soft)] px-3 py-5 text-[13px] text-[var(--codex-text-muted)] md:block">
        {sections.map((item) => (
          <button
            key={item}
            className={["mb-1 flex h-9 w-full items-center rounded-[10px] px-3 text-left", item === activeSection ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "hover:bg-[var(--codex-hover)]"].join(" ")}
            type="button"
            onClick={() => onSetSection(item)}
          >
            {item}
          </button>
        ))}
      </aside>
      <main className="min-w-0 flex-1 overflow-auto px-8 py-16">
        <div className="mx-auto max-w-[760px]">
          <h1 className="text-[28px] font-medium">{activeSection}</h1>
          <p className="mt-2 text-[14px] text-[var(--codex-text-muted)]">{sectionDescriptions[activeSection]}</p>
          <div className="mt-8 overflow-hidden rounded-[16px] border border-[var(--codex-border-soft)] bg-[var(--codex-surface-raised)]">
            {activeSection === "Keyboard Shortcuts"
              ? shortcutRows.map(([label, shortcut]) => (
                  <button key={label} className="flex h-[52px] w-full items-center border-b border-[var(--codex-border-soft)] px-4 text-left last:border-b-0 hover:bg-[var(--codex-hover)]" type="button">
                    <span className="flex-1 text-[14px]">{label}</span>
                    <span className="rounded-[7px] bg-[var(--codex-surface-muted)] px-2 py-1 text-[11px] text-[var(--codex-text-faint)]">{shortcut}</span>
                  </button>
                ))
              : rows.map(([label, value, description]) => (
                  <div key={label} className="flex min-h-[68px] items-center gap-5 border-b border-[var(--codex-border-soft)] px-4 py-3 last:border-b-0">
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-medium">{label}</div>
                      <div className="mt-1 text-[12px] text-[var(--codex-text-faint)]">{description}</div>
                    </div>
                    {label === "Active model" ? (
                      <button className="flex h-9 items-center gap-2 rounded-[10px] bg-[var(--codex-surface-muted)] px-3 text-[12px]" type="button" onClick={() => setModelProfile(modelProfile === "5.5 Extra High" ? "5.5 Medium" : "5.5 Extra High")}>
                        {value}
                        <CodexIcon name="chevronDown" className="size-4" />
                      </button>
                    ) : (
                      <button
                        className="flex h-9 min-w-[96px] items-center justify-center rounded-[10px] bg-[var(--codex-surface-muted)] px-3 text-[12px]"
                        type="button"
                        onClick={() => toggleRow(label)}
                      >
                        {value}
                      </button>
                    )}
                  </div>
                ))}
          </div>
        </div>
      </main>
    </section>
  );
}
