# Data Flow

## Course Loading Pipeline

The primary data flow: user navigates to a course URL → route loader fetches and decorates course JSON → Svelte renders the content.

### Step-by-Step

1. **Navigation**: User navigates to `/course/{courseId}` (or any course-reader route)
2. **Route loader**: `+page.ts` calls `courseService.readCourse(courseId, fetch)`
3. **Cache check**: `getOrLoadCourse()` checks the `courses` Map — returns immediately on hit
4. **URL resolution**: `determineCourseUrl()` normalizes the courseId:
   - Netlify domains → used as-is
   - `localhost` URLs → parsed directly
   - Plain IDs → `{courseId}.netlify.app`
5. **Fetch**: `fetch({protocol}{courseUrl}/tutors.json)` retrieves the full course JSON
6. **Tree decoration**: `decorateCourseTree(course, courseId, courseUrl)`:
   - Injects `courseUrl` into all Lo routes, images, PDFs (replaces `{{COURSEURL}}` placeholders)
   - Recursively decorates via `decorateLoTree()` — sets parent references, loads icons from frontMatter, builds breadcrumb chains
   - Converts `contentMd` → `contentHtml` via markdown-it (except labs/notes/notebooks which defer)
   - Extracts `panels` and `units` from composite Los via `getPanels()` and `getUnits()`
   - Builds `course.loIndex` (Map<route, Lo>) and `course.topicIndex` (Map<route, Topic>)
   - Runs `loadPropertyFlags()`, `createCompanions()`, `createWalls()`, `initCalendar()`
7. **Caching**: Course stored in `courseService.courses` Map
8. **Rune update**: `currentCourse.value` and `currentLo.value` set — triggers Svelte reactivity
9. **Rendering**: Page component receives decorated course/Lo data via `data` props

### Lab Loading

Labs add an extra step for markdown conversion:

1. `courseService.readLab(courseId, labId, fetch)` loads the course
2. Creates a `LiveLab` instance (implements `LabService`)
3. `markdownService.convertLabToHtml(course, lab)` processes each `LabStep`:
   - Converts `contentMd` → `contentHtml` with Shiki syntax highlighting
   - Runs URL `filter()` to rewrite relative paths to CDN URLs
4. LiveLab builds navbar HTML, caches step content in `chaptersHtml` Map
5. LiveLab cached in `courseService.labs` Map

### Note Loading

1. `courseService.readLo(courseId, noteId, fetch)` loads the course
2. If note not in `courseService.notes` cache:
   - `markdownService.convertNoteToHtml(course, note)` converts markdown
3. Note cached in `courseService.notes` Map

## Analytics Event Flow

On every navigation within the course-reader:

1. Course-reader layout's `$effect` detects page change
2. Calls `tutorsConnectService.learningEvent(page.params)`
3. `analyticsService.reportPageLoad(course, lo, student)` → Supabase `learning_records` upsert
4. `presenceService.sendLoEvent(course, lo, student)` → PartyKit broadcast + Supabase `tutors-connect-latest` upsert
5. Every 30 seconds, timer calls `updateLearningRecordsDuration()` and `updateCalendarDuration()`
