# Data Loading

## The +page.ts Pattern

Every course-reader route follows this data loading pattern:

```typescript
// src/routes/(course-reader)/course/[courseid]/+page.ts
import type { PageLoad } from "./$types";
import { courseService } from "$lib/services/course";
import { currentCourse, currentLo } from "$lib/runes.svelte";

export const ssr = false;

export const load: PageLoad = async ({ params, fetch }) => {
  const course = await courseService.readCourse(params.courseid, fetch);
  currentCourse.value = course;
  currentLo.value = course;
  return { course, lo: course };
};
```

### Key Points

- **SSR disabled**: All course-reader routes set `export const ssr = false` — content is rendered client-side only
- **SvelteKit `fetch`**: The `fetch` function from the load context is passed to `courseService` so SvelteKit can track the request
- **Rune updates**: Load functions set `currentCourse.value` and `currentLo.value` before returning — this triggers reactive updates across the UI
- **Return data**: The returned object is available as `data` props in the `+page.svelte` component

## Rest Parameters

Routes like `/lab/[courseid]/[...loid]` use SvelteKit rest params. The `loid` captures the full nested path:

```
/lab/reference-course/topic-01-simple/unit-1/lab-01
                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                      params.loid = "topic-01-simple/unit-1/lab-01"
```

The `pathname` from `url.pathname` is used to look up the Lo in `course.loIndex`.

## Lab Step Navigation

Labs use URL-based step navigation:

```typescript
// Initial load — activate first step
const lab = await courseService.readLab(params.courseid, pathname, fetch);
lab.setFirstPageActive();

// URL with step — activate specific step
if (url.searchParams.has("step")) {
  lab.setActivePage(url.searchParams.get("step"));
}
```

The `currentLabStepIndex` rune tracks the active step for keyboard navigation.

## Caching Behavior

`courseService.readCourse()` internally calls `getOrLoadCourse()` which:
1. Checks `courses` Map — returns immediately on cache hit
2. On miss: fetches JSON, decorates tree, caches result
3. Subsequent calls for the same `courseId` never re-fetch

Labs, notes, and notebooks have their own caches:
- `courseService.labs: Map<string, LabService>` — caches `LiveLab` instances
- `courseService.notes: Map<string, Note>` — caches notes with HTML content
- `courseService.notebooks: Map<string, NotebookService>` — caches `LiveNotebook` instances

## Load Function Variants

| Route | courseService Method | Returns |
|---|---|---|
| course | `readCourse(courseid)` | `Course` |
| topic | `readTopic(courseid, pathname)` | `Lo` (Topic) |
| lab | `readLab(courseid, pathname)` | `LabService` (LiveLab) |
| notebook | `readNotebook(courseid, pathname)` | `NotebookService` (LiveNotebook) |
| wall | `readCourse() + readWall(courseid, type)` | `Lo[]` |
| talk/note/video/tutorial/paneltalk | `readLo(courseid, pathname)` | `Lo` |
| search/time | `readCourse(courseid)` | `Course` |
| llm | `readCourse(courseid)` + `generateLlms()` | `Course` + links |
