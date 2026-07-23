# Route Groups

SvelteKit route groups (parenthesized directories) organize routes without adding URL segments.

## (auth) — Authentication

`src/routes/(auth)/auth/`

| Route | Component | Purpose |
|---|---|---|
| `/auth` | `+page.svelte` | Login page with `SigninWithGithub` button and `TutorsTerms` |
| `/auth/[courseid]` | `+page.svelte` | Course-specific auth redirect (stores courseId, then redirects to login) |

## (home) — Landing Page

`src/routes/(home)/`

| Route | Component | Purpose |
|---|---|---|
| `/` | `+page.svelte` | Landing page showing `Welcome`, `CourseList` (recent visits), `Links`, `TutorsInfo` |

Components:
- `CourseList.svelte` — displays `CourseVisitCard` for each visited course
- `CourseVisitCard.svelte` — card with course image, title, last visit date, favourite toggle
- `Welcome.svelte` — greeting with user avatar (if authenticated)
- `Links.svelte` — external links
- `TutorsInfo.svelte` — platform information

## (course-reader) — Course Content

`src/routes/(course-reader)/`

The primary route group containing all course content display routes. See [Course Reader Routes](course-reader-routes.md) for the complete table.

### Layout

`(course-reader)/+layout.svelte` wraps all children in `TutorsShell` and:
- Starts the connect service timer (`startTimer()`)
- Fires `tutorsConnectService.learningEvent(page.params)` on every navigation via `$effect`
- On course change: runs `checkWhiteList()` and `courseVisit()`
- After navigation: scrolls `#content-panel` into view and focuses `#main-content`
- Sets `<title>` to `currentCourse.value.title`

## (live) — Real-Time Views

`src/routes/(live)/`

| Route | Component | Purpose |
|---|---|---|
| `/catalogue` | `Catalogue.svelte` | Course directory with student/course counts |
| `/live` | Live page | Platform-wide live activity (all courses, all students) |
| `/live/[courseid]` | Live page | Course-specific live view (students currently in that course) |

The live pages use `liveService.startGlobalPresenceService()` and `liveService.startCoursePresenceListener(courseId)` to display real-time student activity via PartyKit WebSockets.
