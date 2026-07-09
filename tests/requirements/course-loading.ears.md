# EARS Requirements: Course Loading

## Feature Overview
Course loading is responsible for fetching, parsing, caching, and decorating course content from external JSON sources.

## Requirements

### Event-Driven Requirements

**R1:** WHEN a user navigates to /course/{courseId} the Tutors Reader shall fetch tutors.json from the course URL

**R2:** WHEN a course is successfully loaded the Tutors Reader shall cache it in courseService.courses Map

**R3:** WHEN the same course is requested again the Tutors Reader shall return the cached version without fetching

**R4:** WHEN a courseId contains a Netlify domain the Tutors Reader shall extract the courseId from the URL

**R5:** WHEN a courseId is a custom domain the Tutors Reader shall use the full domain as the courseId

**R6:** WHEN a course is loaded the Tutors Reader shall decorate the course tree with URLs and routing information

**R7:** WHEN a topic is requested the Tutors Reader shall load the parent course first and then retrieve the topic from the index

**R8:** WHEN a lab is requested the Tutors Reader shall create or retrieve a LiveLab instance

### State-Driven Requirements

**R9:** WHILE a course is being loaded the Tutors Reader shall display a loading indicator (UI responsibility)

**R10:** WHILE a course is in the cache the Tutors Reader shall update currentCourse and currentLo runes

### Unwanted Behaviors (Error Cases)

**R11:** IF the course JSON fetch fails THEN the Tutors Reader shall log the error to console and throw an exception

**R12:** IF the course JSON fetch returns non-200 status THEN the Tutors Reader shall throw an error with the status code

**R13:** IF the course URL is invalid THEN the Tutors Reader shall handle the error gracefully

**R14:** IF the course JSON is malformed THEN the Tutors Reader shall throw a JSON parsing error

### Optional Features

**R15:** WHERE courseProtocol is configured the Tutors Reader shall use the specified protocol (http/https) for fetching

**R16:** WHERE a course has companions enabled the Tutors Reader shall include companion data in the course tree

## Acceptance Criteria

### Course Fetching
- ✅ Course JSON is fetched from correct URL based on courseId
- ✅ Netlify domains are parsed correctly (e.g., "test-course.netlify.app" → courseId "test-course")
- ✅ Custom domains are handled (e.g., "example.com" → courseId "example.com")
- ✅ HTTP errors result in thrown exceptions
- ✅ Network errors are logged and propagated

### Course Caching
- ✅ First load fetches from network
- ✅ Subsequent loads return cached version
- ✅ Cache is keyed by normalized courseId
- ✅ Cache persists across multiple reads

### Course Tree Decoration
- ✅ All learning objects have correct URLs
- ✅ Topic index is populated
- ✅ Lab index is populated
- ✅ Breadcrumbs are generated
- ✅ Parent references are set

### State Management
- ✅ currentCourse rune is updated on load
- ✅ currentLo rune is updated for topic/lab reads
- ✅ courseUrl rune contains the correct URL

## Related Files
- `/src/lib/services/course/services/course.svelte.ts` - Main course service
- `/src/lib/services/course/services/lo-tree.ts` - URL determination and tree decoration
- `/src/lib/services/course/services/live-lab.ts` - Lab instance management
- `/src/lib/runes.svelte.ts` - Global reactive state
