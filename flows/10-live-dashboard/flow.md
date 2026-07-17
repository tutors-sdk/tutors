# Flow 10: Live Dashboard

## Overview

The Live Dashboard (`/live`) shows real-time student activity across all courses. It connects to the PartyKit global room and displays incoming presence events, showing which students are viewing which courses and learning objects. Users can toggle between "list by course" and "list by student" views.

## Trigger

- User navigates to `/live`.

## URL Paths

| Component | Path |
|---|---|
| Live page | `/live` |

## Repositories Involved

| Repository | Role |
|---|---|
| `tutors` | Live page, presenceService global listener |
| `tutors-apps` | PartyKit server (message broadcasting) |

## Flow Diagram

```mermaid
sequenceDiagram
    participant User as Browser
    participant Page as /live<br/>(+page.svelte)
    participant PS as presenceService<br/>(presence.ts)
    participant PartyKit as PartyKit Server<br/>(tutors-all-course-access room)
    participant Stores as Svelte Stores
    participant Students as Active Students<br/>(other browsers)

    User->>Page: Navigate to /live
    Page->>PS: startGlobalPresenceService()
    
    Note over PS: Already connected to partyKitAll<br/>(tutors-all-course-access room<br/>initialized on module load)

    PS->>PartyKit: addEventListener("message", handler)

    loop Continuous - for each incoming event
        Students->>PartyKit: sendLoEvent (from any course)
        PartyKit->>PS: WebSocket message event
        PS->>PS: Parse LoEvent JSON

        par Update Course Activity
            alt New course (not in courseEventMap)
                PS->>PS: Add to courseLos array
                PS->>PS: Add to courseEventMap
            else Known course
                PS->>PS: Update course event (route, title, type)
            end
            PS->>Stores: coursesOnlineList.set([...courseLos])
            PS->>Stores: coursesOnline.set(count)
        and Update Student Activity
            alt New student (not in allStudentEventMap)
                PS->>PS: Add to allStudentLos array
                PS->>PS: Add to allStudentEventMap
            else Known student
                PS->>PS: Update student event
            end
            PS->>Stores: allStudentsOnlineList.set([...allStudentLos])
            PS->>Stores: allStudentsOnline.set(count)
        end
    end

    User->>Page: Toggle "List By Course" / "List By Student"
    alt List by Course
        Page-->>User: Render AllCoursePresence component
    else List by Student
        Page-->>User: Render AllStudentPresence component
    end
```

## UI Components

```mermaid
graph TB
    LivePage["/live Page"]
    Shell[TutorsShell]
    Header[Header: Toggle + Metrics]
    Toggle[SlideToggle: Course/Student]
    MetricC[Metric: Active Modules]
    MetricS[Metric: Active Students]
    CourseView[AllCoursePresence]
    StudentView[AllStudentPresence]
    Card[StudentCard]

    LivePage --> Shell
    Shell --> Header
    Header --> Toggle
    Header --> MetricC
    Header --> MetricS
    Shell -->|listByCourse=true| CourseView
    Shell -->|listByCourse=false| StudentView
    CourseView --> Card
    StudentView --> Card
```

## Store Bindings

| Store | Type | Updated By |
|---|---|---|
| `coursesOnline` | `number` | presenceService (course count) |
| `coursesOnlineList` | `LoEvent[]` | presenceService (course events) |
| `allStudentsOnline` | `number` | presenceService (student count) |
| `allStudentsOnlineList` | `LoEvent[]` | presenceService (student events) |

## Key Files

| File | Path | Purpose |
|---|---|---|
| Live page | `src/routes/(time)/live/+page.svelte` | Live dashboard UI |
| Presence service | `src/lib/services/presence.ts:83-115` | startGlobalPresenceService() |
| AllCoursePresence | `src/lib/ui/time/AllCoursePresence.svelte` | Course activity view |
| AllStudentPresence | `src/lib/ui/time/AllStudentPresence.svelte` | Student activity view |
| StudentCard | `src/lib/ui/time/StudentCard.svelte` | Individual activity card |
