# Immich Bliss

**Immich Bliss** is a **Custom CSS** theme for [Immich](https://immich.app/): it layers on top of Immich’s default styles so you get a cohesive look without forking the app. Builds are plain CSS files you paste into **Administration → Settings → Custom Styling → Custom CSS**.

## Terminology (same words as Immich and `@immich/ui`)

| Term | Meaning |
| --- | --- |
| **Immich** | The self-hosted photos and videos product. |
| **Immich web** | The browser app (Svelte). Custom CSS applies *after* Immich’s bundled styles. |
| **`@immich/ui`** | The shared UI library [documented at ui.immich.app](https://ui.immich.app) — components like **Button**, **Input**, **Modal**, **Select**, **AppShell**, etc. In the DOM you often see `data-slot="…"` and `.ui-bits-*` classes from the underlying Bits UI primitives Bliss must style carefully. |
| **Theme variables** | CSS custom properties, e.g. `--immich-ui-*` (current) and legacy `--immich-*` where still used. |

## For Immich users (no build required)

### 1) Pick a CSS file

- `DOWNLOADS/immich-bliss-system.css` (recommended default)
- `DOWNLOADS/immich-bliss-inter.css`
- `DOWNLOADS/immich-bliss-zalando.css`
- `DOWNLOADS/immich-bliss-gabarito.css`

**Max-performance** profile (no `backdrop-filter` blur; same fonts): `DOWNLOADS/immich-bliss-system-perf.css`, `immich-bliss-inter-perf.css`, `immich-bliss-zalando-perf.css`, `immich-bliss-gabarito-perf.css`.

You can also use the same files from [GitHub Releases](https://github.com/adistianto/immich-bliss/releases).

### 2) Paste into Immich

1. Open your chosen CSS file and copy all content.
2. In Immich: **Administration** → **Settings** → **Custom Styling**.
3. Paste into **Custom CSS** and save.

### 3) Light customization

See `docs/USER-GUIDE.md` for small edits (accent color, corner radius, glass tiers) without learning the full source tree.

## Developer quick links

- `docs/DEVELOPER.md` — architecture, build, release checklist, troubleshooting
- `docs/MIGRATION.md` — maintenance and workflow notes
- `src/styles/entrypoints/theme.css` — override import order
- `scripts/build-css.mjs` — build script

## For contributors

Immich loads **Custom CSS** after its defaults, so this repo is organized as layered **overrides** (tokens → foundations → components → utilities).

### Source layout

- `src/styles/tokens/` — design tokens (colors, spacing, shape, motion, glass)
- `src/styles/foundations/` — base and dark variable wiring
- `src/styles/components/` — focused overrides (buttons, forms, dialogs, …)
- `src/styles/utilities/` — override policy and helper rules
- `src/styles/fonts/` — font profiles
- `src/styles/profiles/` — profile tuning (e.g. max-performance)
- `src/styles/entrypoints/theme.css` — final composition order

### Build Commands

```bash
npm run build
```

Optional font profiles:

```bash
npm run build:system
npm run build:inter
npm run build:zalando
npm run build:gabarito
```

Performance profile:

```bash
npm run build:perf
```

Performance + font:

```bash
npm run build:perf:inter
npm run build:perf:zalando
npm run build:perf:gabarito
```

Outputs:

- `dist/immich-bliss.css` (generated artifact — do not edit by hand)
- `dist/build-meta.json` (local build metadata)

### Release artifact folder

`DOWNLOADS/` holds user-facing CSS files. Refresh all variants with `npm run build:downloads` (four fonts × default and max-performance profiles).

### Known override conflicts

Keep these in mind when changing Immich or Bliss; details live in the source files and `docs/DEVELOPER.md`.

**Light mode and Tailwind**

- Scope light Tailwind v4 tokens to `:root:not(.dark), .light` so they do not leak into dark mode.

**Modals, `[role="dialog"]`, and floating surfaces**

- Avoid broad `[role="dialog"]` selectors without exclusions; they can hit fullscreen wrappers. For Tailwind `.bg-light` panels, use **shallow** selectors (e.g. `[role="dialog"] > .bg-light`). A **descendant** `.dark [role="dialog"] .bg-light` matches nested sections and repeats edges (lines across the UI).
- **Modal / dialog** shells (`.ui-bits-dialog-content`, `[data-slot="dialog-content"]`, shallow `.bg-light`): do **not** set **`backdrop-filter`** on those ancestors. In Chromium/WebKit that creates a containing block for **`position: fixed`** children, so **Select** / **Combobox** panels inside the modal get viewport coordinates from Floating UI but anchor to the dialog (**horizontal shift**). Use matte gradient + hairline only there — see `dialogs.css`.
- For **popover** / **dropdown** layers: avoid **`backdrop-filter`** on the positioned layer; use translucent `background-color` only. Do **not** style **`[data-radix-popper-content-wrapper] > div`** — that node is often not the one sized with **`--bits-select-anchor-width`**, which also causes misaligned panels.

**Color and backgrounds**

- Critical popup/input backgrounds should use explicit `rgba(...)`; treat `color-mix(...)` as optional enhancement.

**Inputs**

- Theme both legacy `.immich-form-input` and **`@immich/ui`** primitives (`.ui-bits-*`, `data-slot`).
- **`@immich/ui` Input** paints the **shell** (`div`) and keeps the inner `<input>` **`bg-transparent`** (`Input.svelte` in the Immich monorepo). Do not blanket-style every `input` without the reset in `src/styles/components/immich-ui-input.css`.
- Do not put **`--bliss-input-radius`** on bare `input` / every `[data-slot="input"]`; it overrides pill shells. Apply bliss radius only to `.immich-form-input`, `.ui-bits-*`, field-scoped inputs, `textarea`, and `#main-search-bar`.
- Do not put a **1px border** on bare `input`, `#main-search-bar`, or `[data-slot="input"]` next to primitives: it stacks with the shell/ring and high-specificity `input:not(...)` can beat `border: none` on inner fields. Keep explicit borders on `.immich-form-input`, `.ui-bits-*`, `textarea`, combobox, and **Select** triggers only.
- Dark text field fill is `--bliss-textbox-fill` (`#12191C`); do not re-apply `border-radius` to bare `input` / every `[data-slot="input"]` or search shells show nested curves.
- Search-shell selectors use `div.flex.w-full.items-center:not(.justify-between):has(input…)` so section headers like **Search options → People** (`justify-between` + filter input) are not styled as one pill.

**Buttons**

- Brand accents can fail WCAG with white text; enforce semantic `on-*` foregrounds for filled **Button** variants (`buttons.css`).

**Glass**

- Glass tiers (`src/styles/tokens/glass.css`, `src/styles/components/glass-surfaces.css`): `--bliss-glass-light`, `--bliss-glass-medium`, `--bliss-glass-heavy`, `--bliss-glass-dialog` drive `backdrop-filter` on scrims and overlays; **center modals** stay matte (no blur on dialog ancestors). Matte fill for center shells uses **`--bliss-dialog-matte-fill-alpha`** (and related tokens). The shallow **`[role="dialog"] > .bg-light`** path uses **`--bliss-dialog-fill-rgb`**, **`--bliss-dialog-fill-alpha`**, and **`--bliss-dialog-bglight-gradient-primary-alpha`** in `dialogs.css`. The **max-performance** profile sets blur tiers to `none`.
- Some selectors are **fragile** across Immich upgrades: sticky header (`[class*="grid-rows-"][class*="grid-cols-"] > [class*="border-b"]`), main search fallback (`input[class*="ps-14"][class*="py-4"]` with `#main-search-bar`), and `ul.fixed[class*="overflow-y-auto"]` for Svelte **Select** lists.
- Do **not** paint frosted `background` / `border` on `#main-search-bar` or inner inputs when they sit inside a shell that already has glass — shell-only paint, inner fields transparent (`glass-surfaces.css`, `immich-ui-input.css`).

## Previews

- Light: `Previews/Bliss Day.png`
- Dark: `Previews/Bliss Night.png`

## License

MIT. See `LICENSE`.
