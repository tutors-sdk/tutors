# Utility Components

Shared utility components used across the application. Located in `src/lib/ui/components/`.

## Icon

`Icon.svelte` — renders Iconify icons.

Displays an icon from the Iconify icon set. Used throughout the application for Lo type icons, navigation icons, and UI indicators.

## IconBar

`IconBar.svelte` — horizontal bar of navigation icons.

**Props:** `{ iconNavBar: IconNavBar }`

Renders a row of clickable `IconNav` items, each with a link, icon type, tooltip, and target. Used for companion links and wall navigation in `SecondaryNavigator`.

## Image

`Image.svelte` — learning object image display.

Handles image loading, fallbacks, and responsive sizing for Lo thumbnails in cards and headers.

## Menu / MenuItem

`Menu.svelte` + `MenuItem.svelte` — dropdown menu components.

Used for theme selection, layout switching, and other multi-option controls in the navigator.

## Sidebar

`Sidebar.svelte` — collapsible sidebar navigation.

Used for table-of-contents navigation and lab step lists.

## LanguageSwitcher

`LanguageSwitcher.svelte` — locale selector dropdown.

Displays the 5 supported locales (en, fr, de, it, es) and calls `setLocale()` on selection. Shows the current locale flag/label.

## KeyboardShortcutsOverlay

`KeyboardShortcutsOverlay.svelte` — modal overlay showing available keyboard shortcuts.

- Toggled by pressing `?` (sets `shortcutsOverlayOpen` rune)
- Closed by pressing `Esc`
- Displays shortcuts from `getActiveCategories(currentLo.value?.type)` — shows general shortcuts plus context-specific shortcuts for the current Lo type (lab, talk, or notebook)

## Brand Icons

| Component | Purpose |
|---|---|
| `SetuIcon.svelte` | SETU (South East Technological University) logo |
| `TutorsIcon.svelte` | Tutors platform logo/icon |
