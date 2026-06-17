# Codex UI Design Contract

This project clones the Codex desktop app workbench. The reusable part is not a pixel sheet. It is a compact desktop-tool design language: dense chrome, quiet panels, small controls, restrained motion, and semantic layout ratios.

## Atmosphere

- Build a working surface first. No landing page, hero, or marketing composition.
- Density is high but not cramped: short labels, compact rows, visible structure, and no decorative filler.
- The interface should feel like a native developer tool: calm, matte, low-contrast, and fast.
- Use whitespace to separate work areas, not to create brochure-like drama.

## Token Layers

Use `src/styles/tokens.css` as the source of truth.

- Primitive tokens: color, text, radius, shadow, motion, icon size, control size, and z-index.
- Semantic tokens: chrome height, workspace header height, panel bar height, row heights, sidebar/panel ratios, menu widths, and skeleton widths.
- Component classes: `codex-icon-button`, `codex-command-button`, `codex-row-button`, `codex-tab-button`, `codex-muted-button`, `codex-field`, `codex-popover`, `codex-surface-panel`, `codex-composer-surface`.

Do not introduce a token just because a number exists once. Add a token when the value expresses a reusable UI decision.

## Color

- Canvas: `--codex-surface-root`, `--codex-window`, `--codex-main`.
- Raised surfaces: `--codex-surface-raised`, `--codex-surface-muted`.
- Text: `--codex-text`, `--codex-text-muted`, `--codex-text-faint`.
- Borders: `--codex-border`, `--codex-border-soft`.
- Accent: `--codex-accent` only for active state, focus, selected file/tree state, and important status.
- Status colors are reserved: `--codex-diff-added`, `--codex-diff-removed`, `--codex-permission`.

Avoid new accent colors, gradients, neon glows, and pure black. If a new state is needed, derive it with `color-mix()` from existing tokens.

## Typography

- Keep the app mono-forward: the current stack is a Codex-like monospace UI stack.
- Default body size is `--codex-type-base`; dense metadata uses `--codex-type-sm` or `--codex-type-xs`.
- Use weight and opacity for hierarchy before increasing size.
- Keep headings rare. Tool panels should use compact labels, not page-title typography.
- Code, paths, shortcuts, timestamps, and numeric metadata stay tabular/mono.

## Controls

- Icon-only actions use `codex-icon-button`.
- Icon plus label commands use `codex-command-button`.
- Menus, sidebars, palettes, file trees, and selectable lists use `codex-row-button` or `codex-sidebar-row`.
- Use row sizes by role:
  - `codex-row-sm`: menu rows.
  - `codex-row-md`: default compact action rows.
  - `codex-row-lg`: command palette rows.
  - `codex-row-xl`: tool switcher and settings shortcut rows.
- Do not hand-roll hover/active state for a new button unless the existing primitives cannot express the role.

## Panels

- Top app chrome uses `codex-chrome-bar`.
- Workspace headers use `codex-workspace-bar`.
- Tool and file panel headers use `codex-panel-bar`.
- Secondary toolbars use `codex-subbar`.
- Tiny embedded preview bars use `codex-compact-bar`.
- Popovers use `codex-popover`; do not restyle each popover independently.
- Floating/high-emphasis surfaces use `codex-surface-panel` or `codex-composer-surface`.

Panel content should be readable at a glance. Prefer dividers, row grouping, and muted surfaces over nested cards.

## Layout

- Preserve the Codex workbench shape: sidebar, main chat/work area, optional environment panel, optional tool surface.
- Ratios belong in geometry helpers or semantic CSS variables, not inline screenshot constants.
- Side panels should be responsive: docked on wide screens, overlay/floating on narrow screens.
- Use `dvh` for app-height shells. Do not use marketing-section viewport patterns.
- Local layout composition may use Tailwind utilities such as `gap-2`, `px-3`, or `flex` directly.

Use semantic variables for cross-component layout decisions:

- `--codex-review-rail-width`
- `--codex-settings-nav-width`
- `--codex-settings-content-width`
- `--codex-document-measure`
- `--codex-menu-width-sm`
- `--codex-menu-width-md`

## Layering

Use named layers, not raw `z-*` values:

- `codex-layer-ground`: background guides and passive structure.
- `codex-layer-panel`: reserved panels.
- `codex-layer-floating`: composer and floating tool surfaces.
- `codex-layer-resize`: resize handles.
- `codex-layer-drawer`: side drawers and composer menus.
- `codex-layer-popover`: menus and top chrome popovers.
- `codex-layer-overlay`: modal overlays and global previews.

If a new layer seems necessary, first check whether the element is really a popover, drawer, or overlay.

## Motion

- Motion is short and practical: `--codex-motion-fast`, `--codex-motion-base`, `--codex-motion-slow`.
- Animate color, opacity, and transform. Avoid animating layout dimensions.
- Pressed controls use a tiny downward translate.
- Respect `prefers-reduced-motion`.

## What Not To Abstract

Leave these local unless they repeat as a design decision:

- One-off `gap-*`, `px-*`, `py-*` used for local alignment.
- Icon optical sizes such as `size-4` or `size-[1.125rem]`.
- Skeleton line widths unless they form a reusable loading pattern.
- Content-specific max width inside a single mocked panel.
- Data, counters, array limits, resize math, and interaction thresholds.

The rule: semantic values describe the design language; Tailwind utilities compose local layout.

## Banned Patterns

- No new UI library.
- No broad redesign away from the reference screenshots.
- No marketing landing page as the first screen.
- No nested cards for normal workbench structure.
- No arbitrary `z-*` values in components.
- No hardcoded `px` sizing in source components.
- No new repeated screenshot constants without a semantic name.
- No CRLF in cross-platform source, config, CSS, or docs.
