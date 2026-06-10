import { settingsRows } from "../data/mockData";

export function SettingsView() {
  return (
    <section className="flex h-full min-h-0 bg-[var(--codex-main)]">
      <aside className="hidden w-[230px] shrink-0 border-r border-[var(--codex-border-soft)] px-3 py-5 text-[13px] text-[var(--codex-text-muted)] md:block">
        {["General", "Appearance", "Model", "Integrations", "Advanced"].map((item) => (
          <button
            key={item}
            className={[
              "mb-1 flex h-9 w-full items-center rounded-[10px] px-3 text-left",
              item === "General" ? "bg-[var(--codex-active)] text-[var(--codex-text)]" : "hover:bg-[var(--codex-hover)]",
            ].join(" ")}
            type="button"
          >
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
                  <span className="rounded-[9px] bg-[color-mix(in_oklab,var(--codex-accent)_14%,transparent)] px-3 py-1.5 text-[12px] text-[var(--codex-accent)]">
                    {row.value}
                  </span>
                ) : (
                  <button className="h-8 rounded-[9px] bg-[var(--codex-surface-muted)] px-3 text-[12px] text-[var(--codex-text-muted)]" type="button">
                    {row.value}
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
