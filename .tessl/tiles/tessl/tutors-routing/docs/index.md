# Tutors Routing

Tutors uses SvelteKit file-based routing with four route groups. All course content routes disable SSR (`export const ssr = false`) for client-side rendering. Data loading delegates to the `courseService` singleton.

## Route Groups

| Group | URL Prefix | Purpose |
|---|---|---|
| `(auth)` | `/auth` | GitHub OAuth login flow |
| `(home)` | `/` | Landing page, course visits |
| `(course-reader)` | `/course`, `/lab`, `/talk`, etc. | All course content display |
| `(live)` | `/live`, `/catalogue` | Real-time presence, course directory |

## Root Layout Chain

```
+layout.server.ts  →  Extracts auth session + locale from server
+layout.svelte     →  Reconnects user, initializes theme, sets locale
  (course-reader)/+layout.svelte  →  Wraps in TutorsShell, starts analytics
```

## Data Loading Pattern

Every course-reader route follows this pattern:

```typescript
// +page.ts
export const ssr = false;

export const load: PageLoad = async ({ params, fetch }) => {
  const course = await courseService.readCourse(params.courseid, fetch);
  // ... extract specific Lo from course
  return { course, lo };
};
```

The `courseService` handles caching — repeated loads for the same course return immediately from the Map cache.

## Capabilities

- [Route Groups](route-groups.md) — (auth), (home), (course-reader), (live) details
- [Course Reader Routes](course-reader-routes.md) — Complete route table with patterns, loaders, components
- [Data Loading](data-loading.md) — +page.ts loader pattern, rest params, rune updates
