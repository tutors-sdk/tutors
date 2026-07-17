# Flow 06: Lab Navigation

## Overview

Labs are multi-step learning objects. When a user opens a lab, the system loads the lab's content with its ordered steps, sets the active page based on the URL, and allows step-by-step navigation. Each step change triggers analytics events.

## Trigger

- User navigates to `/lab/[courseid]/[...loid]` (e.g., `/lab/my-course/topic-01/unit-01/lab-01/book-01`).

## URL Paths

| Component | Path | Example |
|---|---|---|
| Lab page | `/lab/[courseid]/[...loid]` | `/lab/my-course/topic-01/unit-01/lab-01/book-01` |
| Lab step | `/lab/[courseid]/[...loid]/[step]` | `/lab/my-course/topic-01/unit-01/lab-01/01` |
| Course data | `https://[courseid].netlify.app/tutors.json` | Fetched if not cached |

## Repositories Involved

| Repository | Role |
|---|---|
| `tutors` | Lab page, LiveLab model, courseService |

## Flow Diagram

```mermaid
sequenceDiagram
    participant User as Browser
    participant Page as +page.ts<br/>(lab/[courseid]/[...loid])
    participant CS as courseService
    participant Cache as Course Cache<br/>(in-memory Map)
    participant Netlify as Netlify CDN
    participant LL as LiveLab<br/>(live-lab.ts)
    participant Stores as Svelte Stores

    User->>Page: Navigate to /lab/[courseid]/[...loid]
    Page->>CS: readLab(params.courseid, url.pathname, fetch)
    CS->>CS: readCourse(courseId, fetch) — loads full course
    
    alt Course not cached
        CS->>Netlify: GET https://[courseId].netlify.app/tutors.json
        Netlify-->>CS: Course JSON
        CS->>CS: decorateCourseTree(course)
    end

    CS->>CS: Parse labId from URL pathname
    Note over CS: If last segment doesn't start with "book",<br/>trim to parent lab path

    CS->>CS: Check labs cache (this.labs Map)
    
    alt Lab not cached
        CS->>CS: course.loIndex.get(labId) → Lab object
        CS->>LL: new LiveLab(course, lab, labId)
        Note over LL: LiveLab wraps Lab with navigation state:<br/>- index (current step)<br/>- steps array<br/>- setActivePage / setFirstPageActive
        CS->>CS: Cache LiveLab in this.labs Map
    end

    CS->>Stores: currentLo.set(liveLab.lab)
    CS-->>Page: Return LiveLab

    Page->>Page: Parse last URL segment
    alt Segment starts with "book"
        Page->>LL: setFirstPageActive()
    else Segment is a step ID
        Page->>LL: setActivePage(lastSegment)
    end

    Page->>Stores: currentLabStepIndex.set(liveLab.index)
    Page-->>User: Render lab with active step content

    Note over User: User clicks next/previous step

    User->>LL: Navigate to next step
    LL->>LL: Update index, set active step
    LL->>Stores: currentLabStepIndex.set(newIndex)
    Note over User: URL updates, analytics fires (Flow 04)
```

## Lab Data Model

```typescript
interface Lab extends Lo {
  type: "lab";
  los: LabStep[];            // Ordered steps (01.md, 02.md, etc.)
}

class LiveLab {
  course: Course;
  lab: Lab;
  index: number;             // Current step index
  
  setFirstPageActive(): void;
  setActivePage(step: string): void;
}
```

## URL Structure

```
/lab/my-course/topic-01/unit-01/lab-01/book-01     → First page (overview)
/lab/my-course/topic-01/unit-01/lab-01/01           → Step 1
/lab/my-course/topic-01/unit-01/lab-01/02           → Step 2
```

## Key Files

| File | Path | Purpose |
|---|---|---|
| Page loader | `src/routes/(course-reader)/lab/[courseid]/[...loid]/+page.ts` | Load lab, set active page |
| LiveLab model | `src/lib/services/models/live-lab.ts` | Lab navigation state management |
| Course service | `src/lib/services/course.ts:71-88` | readLab(), lab caching |
