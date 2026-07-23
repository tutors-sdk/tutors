# Tutors Services

The Tutors service layer lives in `src/lib/services/` and follows a consistent singleton pattern across seven service areas. Each service has three files: `types.ts` (interface definition), `services/*.svelte.ts` (implementation), and `index.ts` (re-export of the singleton instance).

## Service Architecture Pattern

```typescript
// types.ts — interface definition
export interface FooService {
  someMethod(arg: string): void;
}

// services/foo.svelte.ts — singleton implementation
export const fooService: FooService = { ... };

// index.ts — re-export
export { fooService } from "./services/foo.svelte";
```

Services use the `.svelte.ts` extension when they use Svelte 5 runes (`$state`, `$derived`, `$effect`). All services are imported via `$lib/services/<name>`.

## Core Imports

```typescript
import { courseService } from "$lib/services/course";
import { analyticsService, presenceService, liveService, catalogueService } from "$lib/services/community";
import { tutorsConnectService } from "$lib/services/connect";
import { markdownService } from "$lib/services/markdown";
import { themeService } from "$lib/services/themes";
import { t, setLocale, locale } from "$lib/services/i18n";
import { getActiveCategories } from "$lib/services/a11y/keyboard-shortcuts";
```

## Service Areas

| Service | Location | Purpose |
|---|---|---|
| Course | `src/lib/services/course/` | Course loading, caching, lab/notebook navigation |
| Community | `src/lib/services/community/` | Analytics, real-time presence, catalogue |
| Connect | `src/lib/services/connect/` | Authentication, profiles, sentiment |
| Markdown | `src/lib/services/markdown/` | Markdown-to-HTML conversion, syntax highlighting |
| Themes | `src/lib/services/themes/` | Visual themes, layouts, card styles, icons |
| i18n | `src/lib/services/i18n/` | Internationalization (5 locales) |
| a11y | `src/lib/services/a11y/` | Keyboard shortcuts, reduced motion |

## Capabilities

- [Course Service](course-service.md) — CourseService, LabService, NotebookService, lo-tree decoration, caching
- [Community Services](community-services.md) — AnalyticsService, PresenceService, LiveService, CatalogueService, LoRecord
- [Connect Service](connect-service.md) — Authentication flow, ProfileStore, TutorsId, sentiment, timer
- [Markdown Service](markdown-service.md) — Shiki highlighting, markdown-it plugins, Mermaid, Marp, notebook rendering
- [Theme Service](theme-service.md) — Themes, layouts, card styles, icon libraries
- [i18n and Accessibility](i18n-a11y.md) — Locales, translation, keyboard shortcuts, reduced motion
