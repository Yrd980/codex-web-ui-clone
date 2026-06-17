# AGENTS.md

## Project Context

This repository is a web prototype of the Codex desktop app UI. The goal is visual and interaction fidelity against the reference screenshots, not a production implementation of Codex features.

Primary references:

- `docs/references/codex-app-screenshots/`
- `docs/superpowers/specs/2026-06-10-codex-web-ui-ux-clone-design.md`
- `docs/superpowers/plans/2026-06-10-codex-web-ui-ux-clone-implementation.md`
- `DESIGN.md`

## Working Rules

- Keep changes small and aligned with the existing React component structure.
- Preserve mocked-data driven UI where possible; update `src/data/mockData.ts` instead of hardcoding new repeated content in components.
- Match the current Tailwind utility style and CSS token usage in `src/styles/tokens.css`.
- Do not introduce a new UI library unless the user explicitly asks for it.
- Do not add tests, fixtures, snapshots, or test-only helpers unless the user explicitly requests them.
- Do not remove reference screenshots or planning documents; they are part of the design trace.

## Design Notes

- The first screen should remain the usable Codex-style workbench, not a marketing landing page.
- Follow `DESIGN.md` for reusable design tokens, component semantics, z-index layers, and abstraction boundaries.
- Tool panels should remain responsive: docked on wide screens and overlay/floating on narrower screens.
- Keep text compact, especially in the sidebar and environment panel.
- Prefer the existing `CodexIcon` component for interface icons.
- Avoid broad redesigns that move the prototype away from the supplied screenshots.

## Commands

Install dependencies:

```bash
bun install
```

Run development server:

```bash
bun run dev
```

Verify before committing:

```bash
bun run build
git diff --check
```

## Git Notes

- Current working branch convention uses the `codex/` prefix.
- Commit only the files relevant to the requested change.
- If the user asks to push, use the configured `origin` remote.
