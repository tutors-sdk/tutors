# Layout Components

Layout components handle the visual arrangement of learning objects. Located in `src/lib/ui/learning-objects/layout/`.

## Card

`Card.svelte` — renders a single learning object as a card.

**Props:** `{ cardDetails: CardDetails, cardLayout?: CardConfig }`

### CardDetails

```typescript { .api }
interface CardDetails {
  route: string;      // Navigation URL
  title?: string;
  type: string;       // Lo type (determines border color)
  summary?: string;
  summaryEx?: string;
  icon?: IconType;
  img?: string;
  student?: LoUser;   // For presence cards
  video?: string;
  metric?: string;    // Analytics metric display
}
```

### CardConfig

```typescript { .api }
type CardConfig = {
  style: "portrait" | "landscape" | "circular";
  layout: "expanded" | "compacted";
};
```

### Variants

- **Portrait** — vertical card, image on top, title and summary below
- **Landscape** — horizontal card, image on left, content on right
- **Circular** — compact card with circular image/icon

Border colors are derived from `themeService.getTypeColour(cardDetails.type)` — each Lo type has a distinct color.

## Cards

`Cards.svelte` — renders a grid of `Card` components.

**Props:** `{ los: Lo[], parentCourse?: Course }`

- Maps each Lo to `CardDetails`
- Applies the current layout (`expanded`/`compacted`) and card style (`portrait`/`landscape`/`circular`) from `themeService`
- Supports pin-unlock: Los with `hide: true` can be revealed via `ignorePin` course property

## Panels

`Panels.svelte` — renders panel-style Los prominently at the top of a composite.

**Props:** `{ panels: Panels }`

Renders four groups in order:
1. `panelVideos` — video cards (typically with embedded players)
2. `panelTalks` — presentation cards
3. `panelNotes` — note cards
4. `panelPodcasts` — podcast cards

Panel cards are typically displayed larger/more prominently than standard Cards.

## Units

`Units.svelte` — renders unit groupings within a composite.

**Props:** `{ units: Units }`

For each unit:
- Renders the unit title/header
- Renders its own `Panels` (if the unit has panel Los)
- Renders its own `Cards` (for the unit's child Los)

## Wall

`Wall.svelte` — gallery/grid view for all Los of a specific type.

**Props:** `{ los: Lo[], type: string }`

Used on `/wall/[type]/[courseid]` routes. Displays all Labs, all Talks, all Notes, etc. in a filterable grid.

## LoContextPanel

`LoContextPanel.svelte` — sticky sidebar panel shown on content pages.

Lists sibling Los within the same parent (topic/unit), allowing quick navigation between related content. Hidden on smaller screens.
