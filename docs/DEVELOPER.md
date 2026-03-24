# Developer guide

For contributors and maintainers of **Immich Bliss** — a CSS override layer on top of [Immich](https://immich.app/) and [`@immich/ui`](https://ui.immich.app).

## Terminology

| Term | Use in this repo |
| --- | --- |
| **Immich** | The product; users install it and paste **Custom CSS** under **Administration → Settings → Custom Styling**. |
| **Immich web** | The Svelte app’s DOM and bundled styles. Bliss loads **after** those styles. |
| **`@immich/ui`** | The npm package behind components like **Button**, **Input**, **Modal**, **Select**, **AppShell**. Source lives in the Immich monorepo (`immich-app`); implementation references often cite `Input/Input.svelte` and shared styles. |
| **Bits UI primitives** | Headless building blocks (`data-slot`, `.ui-bits-*`) that `@immich/ui` composes. Bliss must respect shell vs inner field (e.g. **Input** shell vs `<input>`). |
| **Theme variables** | `--immich-ui-*` (current) and legacy `--immich-*` where still referenced. |

## Architecture at a glance

- Immich’s default CSS is the base.
- Immich Bliss applies after it.
- Source is modular under `src/styles/**`.
- The shipped artifact is `dist/immich-bliss.css`.

### Source layers

- `src/styles/tokens/` — design tokens and shared values
- `src/styles/foundations/` — root and dark variable mapping
- `src/styles/components/` — focused component overrides
- `src/styles/utilities/` — override policy rules
- `src/styles/fonts/` — font profile fragments
- `src/styles/profiles/` — profile adjustments (e.g. max-performance)
- `src/styles/entrypoints/theme.css` — canonical import order

## Build workflow

```bash
npm install
```

Default build:

```bash
npm run build
```

By font:

```bash
npm run build:system
npm run build:inter
npm run build:zalando
npm run build:gabarito
```

Max-performance profile:

```bash
npm run build:perf
```

Refresh every downloadable variant (four fonts × two profiles):

```bash
npm run build:downloads
```

Outputs:

- `dist/immich-bliss.css` (generated — do not edit by hand)
- `dist/build-meta.json`

## Release checklist

1. Change sources under `src/styles/**`.
2. Run `npm run build:downloads` (or individual `npm run build:*` as needed).
3. Verify `dist/immich-bliss.css`.
4. Confirm `DOWNLOADS/*.css` match the build.
5. Update docs if override strategy or user guidance changed.
6. Publish the release and attach the CSS files.

## Troubleshooting override drift

After an Immich upgrade, if something looks wrong:

1. Confirm override order in `src/styles/entrypoints/theme.css`.
2. Re-check selectors in component overrides — e.g. **Button** foregrounds (`buttons.css`), `.immich-form-label`, `.immich-form-input`, focus states, map popups.
3. Re-check variables: legacy `--immich-*` vs `--immich-ui-*`.

## Compatibility notes

Immich ships **`@immich/ui`** and theme variables. Bliss keeps both legacy Immich web variables and current UI token namespaces where possible.

Use `@immich/ui` and [ui.immich.app](https://ui.immich.app) when tracing component structure or upstream token changes.

## `@immich/ui` Input vs global `input` rules

The **`Input`** component keeps **surface** and **ring** on the **container** `div` and the inner **`input`** **`bg-transparent`**. Broad Bliss rules that set `background` on all `input` elements break that and show the inner radius inside a pill shell — the fix is in `src/styles/components/immich-ui-input.css` (loaded after `forms.css`).

The same applies to **`border`**: a wide `border: 1px solid …` on `input:not([type="button"]):not(…)` can out-spec `border: none` on the inner field (many `:not()` branches raise specificity), causing a **double edge**. **`forms.css`** keeps borders on named primitives (`.immich-form-input`, `.ui-bits-*`, `textarea`, combobox, **Select** triggers) and **`border: none`** on inner-style targets (`#main-search-bar`, `[data-slot="input"]`, generic text types).

Some **Immich web** screens (e.g. System Settings search) use a different shell (`flex items-center rounded-2xl … p-2 gap-2` without `w-full` on the wrapper). The `rounded-2xl` / `rounded-full` rules in `immich-ui-input.css` keep the inner `<input>` transparent so it does not duplicate the shell outline.

Chromium/WebKit render editable text in a **user-agent shadow** subtree (often shown as a `contenteditable` node in DevTools). Author CSS cannot style that node; use **`border-radius`** + **`overflow: hidden`** on the host `<input>` so the inner editing surface matches the shell curve (`forms.css`).

## Color accessibility baseline

- Check semantic fill/background pairs against WCAG AA for normal text (≥ 4.5:1).
- Filled actions in this theme are mode-aware: light mode uses dark foreground on primary and white on some semantic fills; dark mode uses dark foregrounds on brighter semantic ramps.

## Contribution guidance

- Prefer token-driven values over repeated literals.
- Keep selectors explicit and stable.
- Use `!important` only when Immich specificity requires it.
- Keep override intent clear in layer order.
