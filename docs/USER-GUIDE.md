# User guide (no coding required)

This guide is for people who only want to apply or lightly customize **Immich Bliss** via **Custom CSS** in Immich.

## Quick start

1. Choose one file from `DOWNLOADS/`:
   - `immich-bliss-system.css` (default)
   - `immich-bliss-inter.css`
   - `immich-bliss-zalando.css`
   - `immich-bliss-gabarito.css`
   - Optional **max-performance** (less GPU blur): `immich-bliss-system-perf.css` and matching `*-perf.css` for each font above.
2. Open the file and copy all content.
3. In Immich: **Administration** → **Settings** → **Custom Styling**.
4. Paste into **Custom CSS** and save.

## Which file should I choose?

- **System Font** — good default; fast and native-looking.
- **Inter** — clean modern sans-serif.
- **Zalando Sans** — stronger character.
- **Gabarito** — rounded geometric feel.

If unsure, start with **System Font**.

## Easy customization

You can edit the file before pasting into Immich.

### Main accent color

Immich uses **`@immich/ui`** theme variables. Set `--immich-ui-primary` (and related scale steps if you use them) to your preferred accent.

Example:

```css
:root {
  --immich-ui-primary: #5b8cff;
}
```

### Corner radius

Search for shape tokens (e.g. `--ib-radius-*` or `radius` in the file) and adjust values.

Example:

```css
:root {
  --ib-radius-md: 10px;
}
```

Token names can change between releases; searching for `radius` in your downloaded file is the safest approach.

### Dark mode text fields

Bliss uses **`#12191C`** for dark text field surfaces via `--bliss-textbox-fill` (space-separated RGB `18 25 28`). To change it, search for `--bliss-textbox-fill` in your file and edit **`--bliss-textbox-fill`** and **`--bliss-textbox-fill-rgb`** together.

### Glass (frosted) blur tiers

Bliss uses CSS **`backdrop-filter`** (not native “liquid glass” shaders). Tiers are defined once; many surfaces reuse them:

| Token | Typical use |
| --- | --- |
| `--bliss-glass-light` | Modal scrim, small widgets, map popups (via `--bliss-popup-backdrop-filter`) |
| `--bliss-glass-medium` | Headers, **Input** shells, search (via `--bliss-input-backdrop-filter`) |
| `--bliss-glass-heavy` | Large floating lists (e.g. Svelte **Select** menus) |
| `--bliss-glass-dialog` | Tunable tier; **center modals** use **matte** panels (no blur on the dialog shell) so **Select** dropdowns inside stay aligned |

To soften or strengthen glass globally, edit the `blur(...)` and `saturate(...)` values on these tokens (search for `--bliss-glass-light`). Scrims also use `--bliss-glass-scrim-dark` and `--bliss-glass-scrim-light`. For weaker GPUs, use a **max-performance** build (see `docs/DEVELOPER.md`) or set the `--bliss-glass-*` tokens to `none` in a small override block.

## Troubleshooting

- **Styles do not change** — hard-refresh or clear cache; ensure the full CSS was pasted.
- **Only some styles changed** — confirm the entire file contents are in **Custom CSS**.
- **Looks wrong after an Immich update** — download the latest Bliss CSS from this repo or Releases.

## Advanced help

To build from source or contribute, see `docs/DEVELOPER.md`.
