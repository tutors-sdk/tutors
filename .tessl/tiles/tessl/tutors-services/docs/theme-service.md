# Theme Service

The theme service (`src/lib/services/themes/`) manages visual appearance including themes, display modes, layouts, card styles, and icon libraries.

## ThemeService Interface

```typescript { .api }
interface ThemeService {
  themes: Theme[];
  currentTheme: any;
  layout: { value: LayoutType };
  lightMode: any;
  cardStyle: { value: CardStyleType };
  isSnowing: boolean;

  initDisplay(forceTheme?: string, forceMode?: string): void;
  setDisplayMode(mode: string): void;
  toggleDisplayMode(): void;
  setTheme(theme: string): void;
  setLayout(layout: string): void;
  toggleLayout(): void;
  setCardStyle(style: string): void;
  getIcon(type: string): IconType;
  addIcon(type: string, icon: IconType): void;
  getTypeColour(type: string): string;
  eventTrigger(): void;
}
```

## Themes

Seven built-in themes, each with its own icon library mapping Lo types to Iconify icons with colors:

| Theme | Description |
|---|---|
| `tutors` | Default theme |
| `classic` | Classic Tutors appearance |
| `dyslexia` | Accessibility-focused for dyslexic readers |
| `terminus` | Terminal/hacker aesthetic |
| `rose` | Rose-toned theme |
| `cerberus` | Dark theme |
| `easter` | Seasonal theme with Easter icons |

Themes use the Skeleton UI theming system and are applied via CSS classes.

## Icon Libraries

Each theme has an `IconLib` — a `Record<string, IconType>` mapping Lo type strings to icon definitions:

```typescript { .api }
type IconLib = Record<string, IconType>;
type Theme = { name: string; icons: IconLib };
type IconType = { type: string; color: string };
```

Icon libraries:
- **FluentIconLib** — Microsoft Fluent icons (default for most themes)
- **HeroIconLib** — Heroicons
- **EasterIcons** — Easter-themed icons
- **FestiveIcons** — Holiday/festive icons (triggers snow animation)

`getIcon(type)` looks up the icon for a Lo type string (e.g., `"lab"`, `"talk"`, `"topic"`).
`getTypeColour(type)` returns the color string for a Lo type.

## Layouts

```typescript { .api }
type LayoutType = "expanded" | "compacted";
```

- **expanded** — full card display with images and summaries
- **compacted** — condensed view, smaller cards

## Card Styles

```typescript { .api }
type CardStyleType = "portrait" | "landscape" | "circular";
```

- **portrait** — vertical card with image on top
- **landscape** — horizontal card with image on left
- **circular** — compact card with circular image/icon

## CardDetails

The data structure passed to `Card.svelte` for rendering.

```typescript { .api }
interface CardDetails {
  route: string;
  title?: string;
  type: string;
  summary?: string;
  summaryEx?: string;
  icon?: IconType;
  img?: string;
  student?: LoUser;
  video?: string;
  metric?: string;
}
```

## Display Mode

Light/dark mode toggle. Persisted in `localStorage`. Applied via Skeleton UI's mode system (`modeCurrent`).

## Festive Features

`eventTrigger()` checks for seasonal dates and activates festive icons and snow animation (`isSnowing` flag).
