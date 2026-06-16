import { useState } from "react";
import { sectionDescriptions, settingsSections, shortcutRows } from "../data/scenarios/settingsScenario";
import type { SettingsSection } from "../types";
import { CodexIcon } from "./CodexIcon";

interface SettingsViewProps {
  activeSection: SettingsSection;
  onSetSection: (section: SettingsSection) => void;
}

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
      <aside className="hidden w-[18%] shrink-0 border-r border-[var(--codex-border-soft)] px-3 py-5 text-[13px] text-[var(--codex-text-muted)] md:block">
        {settingsSections.map((item) => (
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
      <main className="min-w-0 flex-1 overflow-auto px-[clamp(1.25rem,4vw,3rem)] py-[clamp(2.5rem,7vh,5rem)]">
        <div className="mx-auto max-w-[74%]">
          <h1 className="text-[28px] font-medium">{activeSection}</h1>
          <p className="mt-2 text-[14px] text-[var(--codex-text-muted)]">{sectionDescriptions[activeSection]}</p>
          <div className="mt-8 overflow-hidden rounded-[14px] border border-[var(--codex-border-soft)] bg-[color-mix(in_oklab,var(--codex-surface-raised)_72%,transparent)]">
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
                    {label === "Animations" || label === "Browser Use" || label === "Computer Use" ? (
                      <button
                        className={["relative h-6 w-11 rounded-full transition-colors duration-[var(--codex-motion-base)] ease-[var(--codex-motion-ease)]", enabledRows.includes(label) ? "bg-[var(--codex-accent)]" : "bg-[var(--codex-surface-muted)]"].join(" ")}
                        type="button"
                        aria-label={`Toggle ${label}`}
                        onClick={() => toggleRow(label)}
                      >
                        <span className={["absolute top-1 size-4 rounded-full bg-white transition-transform duration-[var(--codex-motion-base)] ease-[var(--codex-motion-ease-out)]", enabledRows.includes(label) ? "translate-x-[22px]" : "translate-x-1"].join(" ")} />
                      </button>
                    ) : label === "Work mode" ? (
                      <div className="flex h-9 overflow-hidden rounded-[10px] bg-[var(--codex-surface-muted)] p-0.5 text-[12px]">
                        {["Agent", "Chat"].map((item) => (
                          <button
                            key={item}
                            className={["rounded-[8px] px-3", value === item ? "bg-[var(--codex-surface-raised)] text-[var(--codex-text)] shadow-[0_1px_3px_rgb(76_79_105_/_0.08)]" : "text-[var(--codex-text-faint)]"].join(" ")}
                            type="button"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    ) : label === "Active model" ? (
                      <button className="flex h-9 items-center gap-2 rounded-[10px] bg-[var(--codex-surface-muted)] px-3 text-[12px]" type="button" onClick={() => setModelProfile(modelProfile === "5.5 Extra High" ? "5.5 Medium" : "5.5 Extra High")}>
                        {value}
                        <CodexIcon name="chevronDown" className="size-4" />
                      </button>
                    ) : (
                      <button
                        className="flex h-9 min-w-[96px] items-center justify-center gap-1.5 rounded-[10px] bg-[var(--codex-surface-muted)] px-3 text-[12px]"
                        type="button"
                        onClick={() => toggleRow(label)}
                      >
                        {value}
                        <CodexIcon name="chevronDown" className="size-4 text-[var(--codex-text-faint)]" />
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
