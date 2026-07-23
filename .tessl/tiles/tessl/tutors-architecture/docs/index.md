# Tutors Architecture

Tutors is an open-source learning experience platform built as a SvelteKit front-end that renders structured educational content fetched from external CDN-hosted JSON. The application is fully client-side rendered (SSR disabled on course routes) and follows a service-oriented architecture with clear separation between services, UI components, and routing.

## Package Information

- **Package Name**: tutors
- **Version**: 15.2.0
- **Framework**: SvelteKit 2.x with Svelte 5 (runes)
- **Language**: TypeScript 6.x
- **Styling**: Tailwind CSS 4.x with Skeleton UI 4.x

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | SvelteKit 2, Svelte 5 |
| Styling | Tailwind CSS 4, Skeleton UI 4 |
| State | Svelte 5 runes (`$state`) |
| Auth | Auth.js (GitHub OAuth) |
| Database | Supabase (PostgreSQL) |
| Real-time | PartyKit (WebSockets) |
| Content | CDN-hosted JSON (Netlify) |
| Markdown | markdown-it + Shiki + Mermaid |
| PDF | PDF.js, Adobe DC View, Marp |
| Model lib | @tutors/tutors-model-lib (via JSR) |

## Project Structure

```
src/
  lib/
    runes.svelte.ts          — Global reactive state
    services/
      course/                — Course loading, caching, lab/notebook navigation
      community/             — Analytics, presence, catalogue
      connect/               — Auth, profiles, sentiment
      markdown/              — Markdown-to-HTML pipeline
      themes/                — Visual themes, layouts, icons
      i18n/                  — Internationalization (5 locales)
      a11y/                  — Keyboard shortcuts, reduced motion
    ui/
      TutorsShell.svelte     — App shell (header/main/footer)
      components/            — Shared UI components
      learning-objects/      — Content renderers, layout, structure
      navigators/            — Navigation bars, buttons, titles
      time/                  — Analytics dashboard components
    types/                   — App-level type extensions
    utils/                   — Utilities (sanitize, etc.)
  routes/
    (auth)/                  — Login, course-specific auth
    (home)/                  — Landing page
    (course-reader)/         — All course content routes (SSR=false)
    (live)/                  — Real-time presence views, catalogue
```

## Architecture Principles

- **Service singletons**: Each service is a module-level `const` object implementing a typed interface, re-exported from `index.ts`
- **Map-based caching**: Courses, labs, notes, and notebooks cached in `Map<string, T>` instances within services
- **Svelte 5 runes**: All reactive state uses the `rune<T>()` wrapper pattern — no Svelte stores
- **CDN-first content**: Courses are static JSON hosted on Netlify, fetched and decorated at runtime
- **Lo-tree decoration**: Raw course JSON is transformed via `decorateCourseTree()` — injecting URLs, building indexes, converting markdown
- **Lazy content loading**: Labs, notes, and notebooks defer HTML conversion until first view

## Capabilities

- [Data Flow](data-flow.md) — Course loading pipeline from CDN fetch to rendered page
- [State Management](state-management.md) — The `rune()` pattern, global runes, service-level state
- [External Integrations](external-integrations.md) — Supabase, PartyKit, tutors-time-lib, environment variables
- [Authentication](authentication.md) — Auth.js GitHub OAuth, sessions, anonymous mode, whitelist
