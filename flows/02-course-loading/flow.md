# Flow 02: Course Loading

## Overview

When a user navigates to a course page, the SvelteKit Reader fetches the course's `tutors.json` from Netlify, decorates the course tree with indices and routes, caches it in memory, and renders the course UI. If the user is authenticated, the course access is recorded in Supabase.

## Trigger

- User navigates to `/course/[courseid]` in the browser.

## URL Paths

| Component | Path |
|---|---|
| UI Page | `/course/[courseid]` |
| Netlify Course Data | `https://[courseid].netlify.app/tutors.json` |
| Supabase Table | `accessed_courses` |

## Repositories Involved

| Repository | Role |
|---|---|
| `tutors` | SvelteKit page, courseService, lo-tree decoration |

## Flow Diagram

```mermaid
sequenceDiagram
    participant User as Browser
    participant Page as +page.ts<br/>(course/[courseid])
    participant CS as courseService<br/>(course.ts)
    participant LoTree as decorateCourseTree<br/>(lo-tree.ts)
    participant Netlify as Netlify CDN<br/>([courseid].netlify.app)
    participant Stores as Svelte Stores
    participant PS as presenceService
    participant PartyKit as PartyKit Server
    participant Supabase as Supabase<br/>(accessed_courses)

    User->>Page: Navigate to /course/[courseid]
    Page->>CS: readCourse(params.courseid, fetch)
    CS->>CS: Check in-memory cache (this.courses Map)
    
    alt Course not cached
        CS->>CS: Resolve URL (append .netlify.app if needed)
        CS->>Netlify: GET https://[courseUrl]/tutors.json
        Netlify-->>CS: Course JSON data
        CS->>LoTree: decorateCourseTree(course, courseId, courseUrl)
        Note over LoTree: Build topicIndex, loIndex, wallMap<br/>Set breadcrumbs, routes, parent refs
        CS->>CS: Cache in this.courses Map
    end

    CS->>Stores: currentCourse.set(course)
    CS->>Stores: currentLo.set(course)
    CS->>Stores: courseUrl.set(course.courseUrl)
    
    alt PartyKit configured (not "XXX")
        CS->>PS: startPresenceService(course)
        PS->>PartyKit: new PartySocket(host, room: courseId)
        PS->>PartyKit: Subscribe to room messages
    end
    
    CS-->>Page: Return course

    alt User is authenticated
        Page->>Supabase: SELECT course_list FROM accessed_courses WHERE id = user.id
        alt No record exists
            Page->>Supabase: INSERT INTO accessed_courses (id, course_list)
        else Record exists, course not in list
            Page->>Supabase: UPDATE accessed_courses SET course_list (append course)
        else Record exists, course in list
            Page->>Supabase: UPDATE accessed_courses SET course_list (increment visits)
        end
    end
    
    Page->>Stores: currentLo.set(course)
    Page-->>User: Render course page with topics, units, content
```

## Course URL Resolution Logic

The `courseService.getOrLoadCourse()` resolves course IDs to URLs:

```
Input: "my-course"           → Fetches: https://my-course.netlify.app/tutors.json
Input: "my-course.netlify.app" → Fetches: https://my-course.netlify.app/tutors.json
Input: "custom-domain.com"   → Fetches: https://custom-domain.com/tutors.json
```

## Database Interactions

| Database | Table | Operation | Details |
|---|---|---|---|
| Supabase | `accessed_courses` | SELECT | Check if user has visited this course |
| Supabase | `accessed_courses` | INSERT | First visit - create record with course_list JSONB |
| Supabase | `accessed_courses` | UPDATE | Subsequent visits - update visits count and last_accessed |

## Key Files

| File | Path | Purpose |
|---|---|---|
| Page loader | `src/routes/(course-reader)/course/[courseid]/+page.ts` | SvelteKit load function |
| Course service | `src/lib/services/course.ts` | Fetch and cache course data |
| Tree decorator | `src/lib/services/models/lo-tree.ts` | Build indices and navigation |
| Page component | `src/routes/(course-reader)/course/[courseid]/+page.svelte` | Render course UI |
