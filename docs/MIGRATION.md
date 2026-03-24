# Migration and maintenance

For maintainers evolving workflow and repo structure. End-users applying CSS should use `README.md` and `docs/USER-GUIDE.md`.

## Goals

- Single source of truth under `src/styles/**`.
- Generated `dist/immich-bliss.css` (never hand-edited).
- Ready-to-paste files in `DOWNLOADS/*.css` for releases.

## Current workflow

| Piece | Role |
| --- | --- |
| `src/styles/**` | Source of truth |
| `scripts/build-css.mjs` | Build orchestrator |
| `dist/immich-bliss.css` | Generated bundle |
| `DOWNLOADS/*.css` | User-facing downloads |

Refresh downloads: `npm run build:downloads`.

**Download set:** `DOWNLOADS/immich-bliss-{system,inter,zalando,gabarito}.css` and matching `*-perf.css` for the max-performance profile.

## Source ownership

- `src/styles/tokens/*` — tokens
- `src/styles/foundations/*` — base and dark mapping
- `src/styles/components/*` — component overrides
- `src/styles/fonts/*` — font fragments
- `src/styles/profiles/*` — profiles
- `src/styles/entrypoints/theme.css` — composition and import order

## Build command matrix

```bash
npm run build
npm run build:system
npm run build:inter
npm run build:zalando
npm run build:gabarito
npm run build:perf
npm run build:perf:inter
npm run build:perf:zalando
npm run build:perf:gabarito
```

## Guardrails

- Preserve override ordering from `src/styles/entrypoints/theme.css`.
- Prefer token-driven values over repeated literals.
- Keep selectors explicit for post-upgrade debugging.
- Use `!important` only where Immich specificity requires it.

## Immich compatibility

- **`@immich/ui`** exposes `--immich-ui-*` theme variables.
- Older **`--immich-*`** variables may still appear on some Immich web surfaces.
- Scope light Tailwind v4 tokens to `:root:not(.dark), .light`.
- Prefer explicit `rgba(...)` on dialog/popover/input backgrounds; use `color-mix(...)` as progressive enhancement.
- Target **Modal** / dialog content with explicit `data-slot` / content selectors, not fullscreen dialog wrappers.

## Related docs

- `docs/USER-GUIDE.md`
- `docs/DEVELOPER.md`
