# Structure Components

Structure components define how learning objects are composed and presented. Located in `src/lib/ui/learning-objects/structure/`.

## Composite

`Composite.svelte` — renders any composite Lo (course, topic, unit).

**Props:** `{ composite: Composite }`

### Layout

```
SecondaryNavigator
┌─────────────────────────────┬──────────────┐
│ Main Column                 │ Side Column  │
│  Panels                     │  (Side Los)  │
│  Units                      │              │
│  Cards                      │              │
└─────────────────────────────┴──────────────┘
```

- Renders `SecondaryNavigator` with breadcrumbs and companion links
- Renders `Panels` (panel videos, talks, notes, podcasts) at the top
- Renders `Units` (each unit has its own Panels + Cards)
- Renders `Cards` for any remaining standard Los
- When `composite.units.sides` exist, uses a two-column layout with sticky sidebar

## Context

`Context.svelte` — wraps content pages (lab, talk, note, video, notebook).

**Props:** `{ children: Snippet, lo: Lo }`

### Layout

```
SecondaryNavigator
┌─────────────────────────────┬──────────────────┐
│ Content                     │ LoContextPanel   │
│  (children snippet)         │  (sticky sidebar) │
│                             │                   │
└─────────────────────────────┴──────────────────┘
```

- Walks up `lo.parentLo` chain to find the enclosing topic or course
- Renders `SecondaryNavigator` with that parent's context
- Renders the `children` snippet (the actual content component)
- Shows `LoContextPanel` sticky sidebar (hidden on smaller screens) listing sibling Los for navigation

## CourseContext

`CourseContext.svelte` — context wrapper specifically for course-level pages.

**Props:** `{ children: Snippet, course: Course }`

## LoContext

`LoContext.svelte` — context wrapper for individual Lo pages.

**Props:** `{ children: Snippet, lo: Lo }`

## LoContextTree

`LoContextTree.svelte` — renders a tree of sibling Los for sidebar navigation.

**Props:** `{ los: Lo[], parentLo?: Lo }`

Displays each sibling Lo as a clickable item, highlighting the current Lo.

## LoReference

`LoReference.svelte` — displays a reference/link to a Lo with its icon and title.

**Props:** `{ lo: Lo }`
