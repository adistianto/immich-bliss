# Immich - Custom "Day" & "Night" Theme

A custom CSS theme for [Immich](https://immich.app/) ([GitHub](https://github.com/immich-app/immich)) that provides a clean, modern, and cohesive feel for both light and dark modes.

This theme started as a personal tweak of the default Immich theme. The goal was to align it a bit closer with modern UI design principles while using a custom color palette that felt (IMHO) a bit more pleasing to the eye.

The color palette is _distantly_ inspired by the blue/green hues of nature photos (like the old "Bliss" wallpaper), but it doesn't strongly resemble it. It's simply a unique "Day" (light) and "Night" (dark) mode palette.

This repository provides three theme variants that I thought were a great fit for Immich.

## ✨ Features

- **Complete Light/Dark Modes**: A full "Day" (light) and "Night" (dark) mode palette.
- **Custom Typography**: Three font variations to choose from (see below).
- **Refined UI**: Adjusts the default UI with different border radii and animation timings for a new feel.
- **Customized Components**: Overrides default styles for form inputs, labels, and map popups to ensure a consistent look.
- **Clean & Shareable**: All styles are in a single, well-commented CSS file.

## 🎨 Variants

This repository provides three theme variants based on your font preference.

1.  **`Immich Bliss - System Font.css`**

    - **Font:** System UI
    - **Description:** Uses the native font of your operating system (e.g., San Francisco on macOS, Segoe UI on Windows). This can provides the fastest performance with zero external requests.

2.  **`Immich Bliss - Inter Font.css`**

    - **Font:** [Inter](https://fonts.google.com/specimen/Inter)
    - **Description:** Uses the popular "Inter" font, which is known for its excellent legibility on screens. Requires a Google Fonts import.

3.  **`Immich Bliss - Zalando Sans.css`**
    - **Font:** [Zalando Sans SemiExpanded](https://fonts.google.com/specimen/Zalando+Sans+SemiExpanded)
    - **Description:** Uses the stylish and modern "Zalando Sans" font. Requires a Google Fonts import.

## ⚙️ Installation

1.  Navigate to your Immich instance and log in as an administrator.
2.  Go to **Administration** > **Settings** > **Custom Styling**.
3.  Open the CSS file for the variant you want to use (e.g., `theme_system.css`).
4.  Copy the **entire contents** of the file.
5.  Paste the contents into the **Custom CSS** text box in Immich.
6.  Click **Save Changes**. The theme should apply immediately.

## 🖼️ Previews

### Light Mode (Day)

![Immich Bliss - Zalando Sans - Day](https://github.com/adistianto/immich-bliss/blob/main/Previews/Bliss%20Day.png)

### Dark Mode (Night)

![Immich Bliss - Zalando Sans - Night](https://github.com/adistianto/immich-bliss/blob/main/Previews/Bliss%20Night.png)

## 📜 License

This theme is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
