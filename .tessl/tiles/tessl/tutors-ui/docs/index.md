# Tutors UI Components

The Tutors UI layer lives in `src/lib/ui/` and is organized into four directories: shared components, learning object renderers/layouts/structures, navigators, and analytics views. All components use Svelte 5 with `$props()`, `$derived()`, `$state()`, and `$effect()`.

## Component Directory Structure

```
src/lib/ui/
  TutorsShell.svelte                 — App shell (header/main/footer)
  components/                        — Shared utility components
  learning-objects/
    content/                         — Content renderers (Lab, Talk, Note, etc.)
    layout/                          — Layout components (Card, Cards, Panels, etc.)
    structure/                       — Structural components (Composite, Context)
  navigators/
    MainNavigator.svelte             — Top app bar
    SecondaryNavigator.svelte        — Per-page breadcrumb/companion bar
    buttons/                         — Navigator button components
    footers/                         — Footer components
    titles/                          — Title components
    tutors-connect/                  — Auth profile components
  time/                              — Analytics dashboard components
```

## Core Layout

```
TutorsShell
  ├── header: MainNavigator (toggleable via F key)
  ├── main#main-content: route content
  │     └── Composite (for course/topic routes)
  │         ├── SecondaryNavigator
  │         ├── Panels (panel videos/talks/notes/podcasts)
  │         ├── Units (grouped content)
  │         └── Cards (ungrouped content)
  │     └── Context (for content routes: lab/talk/note/video/notebook)
  │         ├── SecondaryNavigator
  │         ├── Content renderer
  │         └── LoContextPanel (sidebar)
  ├── footer: Footer
  ├── Back-to-top button (after 400px scroll)
  └── KeyboardShortcutsOverlay (toggled by ?)
```

## Capabilities

- [Shell and Navigation](shell-navigation.md) — TutorsShell, MainNavigator, SecondaryNavigator, buttons
- [Structure Components](structure-components.md) — Composite, Context, LoContextTree, LoReference
- [Layout Components](layout-components.md) — Card, Cards, Panels, Units, Wall
- [Content Renderers](content-renderers.md) — Lab, Talk variants, Note, Video, Notebook, Calendar
- [Utility Components](utility-components.md) — Icon, Image, Menu, Sidebar, LanguageSwitcher, KeyboardShortcuts
