# Codebase Architecture Review

Date: 2026-06-11
Repository: `codex-web-ui-clone`
Status: Recorded candidates from `improve-codebase-architecture`

## Context

This repository is a web prototype of the Codex desktop app UI. The project goal is visual and interaction fidelity against the reference screenshots, not production Codex behavior.

No `CONTEXT.md` or `docs/adr/` files were present when this review was recorded. The domain vocabulary here follows the project spec:

- Codex App shell
- chat workspace
- tool workspace
- environment card
- composer
- sidebar
- command palette
- prototype scenario

Architecture terms follow the `improve-codebase-architecture` vocabulary:

- Module
- Interface
- Implementation
- Depth
- Seam
- Adapter
- Leverage
- Locality

## Top Recommendation

Start with **Codex App shell geometry**.

The user keeps correcting proportions, and the current implementation spreads geometry invariants across multiple modules. One deep module would give immediate leverage and improve locality for future visual fidelity passes.

## Candidate 1: Deepen The Codex App Shell Geometry Module

Recommendation strength: **Strong**

Files:

- `src/components/AppFrame.tsx`
- `src/components/ChatWorkspace.tsx`
- `src/components/Composer.tsx`
- `src/components/EnvironmentCard.tsx`
- `src/components/ChatStream.tsx`

Problem:

Geometry knowledge leaks across modules. Sidebar ratios, chat track width, environment reservation, composer fade, and tool surface width are computed in separate implementations.

Solution:

Extract one deep module that owns Codex App shell geometry and emits CSS variables or frame values to the existing modules.

Benefits:

- Locality: resize and proportion bugs concentrate in one module.
- Leverage: one interface supports AppFrame, ChatWorkspace, Composer, EnvironmentCard, and ChatStream.
- Tests can hit geometry invariants without rendering every visual module.

Deletion test:

Deleting this module after extraction would spread ratio math back across the shell. That means the module would earn depth.

Notes:

- Keep stable hit targets such as buttons, icons, and 1px borders outside this module.
- The module should own structural geometry only: sidebar, chat track, environment reservation, composer frame, and tool surface frame.

## Candidate 2: Collapse Tool Workspaces Behind One Tool Surface Module

Recommendation strength: **Strong**

Files:

- `src/components/ChatWorkspace.tsx`
- `src/components/ToolSwitcher.tsx`
- `src/components/ReviewWorkspace.tsx`
- `src/components/FileWorkspace.tsx`

Problem:

The tool workspace seam is shallow. Callers must know every `ActiveView` branch, overlay frame, resize handle, and adapter module.

Solution:

Introduce a deep `ToolSurface` module whose interface is active tool state and panel actions. Keep concrete tool adapters behind it.

Benefits:

- Locality: overlay, docked panel, and resize rules live in one module.
- Leverage: adding a tool requires one adapter instead of editing ChatWorkspace branching.
- Tests can cover tool switching through one interface.

Deletion test:

Deleting `ToolSurface` would push conditional rendering, overlay widths, and resize handle behavior back into ChatWorkspace.

Notes:

- Candidate adapters: ToolSwitcher, Review, Files, Browser, Terminal, Plugins, Automations.
- The external interface should not expose panel frame CSS details to ChatWorkspace.

## Candidate 3: Split Prototype Fixtures Into Scenario Modules

Recommendation strength: **Worth exploring**

Files:

- `src/data/mockData.ts`
- `src/types.ts`
- `src/components/Sidebar.tsx`
- `src/components/CommandPalette.tsx`
- `src/components/ReviewWorkspace.tsx`
- `src/components/FileWorkspace.tsx`

Problem:

`mockData.ts` is a shallow module. One interface exports unrelated fixtures, so every caller imports the whole prototype world.

Solution:

Create scenario modules named after prototype concepts, then optionally compose them through one `prototypeScenario` adapter.

Possible scenario modules:

- `threadScenario`: project groups, threads, chat messages.
- `toolScenario`: diffs, files, browser history.
- `settingsScenario`: settings sections, rows, shortcuts.
- `commandScenario`: command rows and palette rows.
- `prototypeScenario`: optional composition point for App.

Benefits:

- Locality: fixture edits stay scoped to their scenario.
- Leverage: scenarios can be swapped for visual verification.
- Tests can target scenario interfaces.

Deletion test:

This is not yet as strong as the geometry and tool surface candidates. With only one main static prototype, multiple scenario modules may be partly hypothetical. It becomes stronger when more reference states or screenshot scenarios are added.

## Candidate 4: Give Commands And Settings A Shared Action Module

Recommendation strength: **Worth exploring**

Files:

- `src/App.tsx`
- `src/components/CommandPalette.tsx`
- `src/components/SettingsView.tsx`
- `src/data/mockData.ts`

Problem:

Keyboard shortcuts, command palette rows, and settings navigation encode the same actions through separate shallow interfaces.

Solution:

Introduce an `AppAction` module that maps shortcut, command row, and settings intent into one state transition interface.

Benefits:

- Locality: action bugs concentrate in one module.
- Leverage: one command registry can serve shortcuts and the command palette.
- Tests can cover transitions without mounting App, CommandPalette, and SettingsView together.

Depth condition:

The module is deep only if it absorbs ordering rules such as closing the palette before navigating, switching settings sections, and restoring chat state on Escape. If it only maps strings to views, it is shallow.

## Candidate 5: Extract A Thread Preview Positioning Module

Recommendation strength: **Speculative**

Files:

- `src/components/Sidebar.tsx`

Problem:

The hover preview positioning implementation is currently local, but it mixes DOM measurement, viewport collision, and preview state inside the sidebar rendering module.

Solution:

Extract only if the preview gains more states or if another overlay needs the same placement behavior.

Benefits:

- Locality: collision math can be isolated.
- Leverage: reusable overlay frame if another sidebar or row preview appears.
- Tests could cover edge placement.

Deletion test:

Weak today. Deleting the extracted module would move little complexity because only one adapter uses it. This seam should wait until a second adapter or more preview behavior appears.

## Suggested Order

1. Codex App shell geometry.
2. ToolSurface module.
3. AppAction module if command and shortcut behavior grows.
4. Scenario fixtures when more screenshot states are added.
5. Thread preview positioning only after another overlay shares the interface.

## Open Questions

- Should the shell geometry module expose pixel frame values, CSS variable maps, or both?
- Should tool workspaces remain simple React adapters, or should they register metadata with ToolSurface?
- Should prototype scenarios map directly to screenshots under `docs/references/codex-app-screenshots/`?
- Should an ADR record that this prototype favors visual fidelity over generic reusable UI modules?
