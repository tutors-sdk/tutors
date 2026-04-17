# Tutors Platform - Architecture Flows

This document indexes all identified flows in the Tutors platform, spanning the **tutors** (SvelteKit Reader), **tutors-apps** (Generators/CLI), and supporting services (PartyKit, Supabase, Firebase).

## System Overview

```mermaid
graph TB
    subgraph "Content Authoring"
        Author[Course Author]
        MD[Markdown + YAML Files]
    end

    subgraph "tutors-apps (Generators)"
        CLI_JSON[tutors CLI - JSON Generator]
        CLI_HTML[tutors-lite CLI - HTML Generator]
        ModelLib[@tutors/tutors-model-lib]
        GenLib[@tutors/tutors-gen-lib]
    end

    subgraph "Deployment"
        Netlify[Netlify CDN]
    end

    subgraph "tutors (SvelteKit Reader)"
        Reader[SvelteKit App - tutors.dev]
        CourseService[courseService]
        AnalyticsService[analyticsService]
        PresenceService[presenceService]
    end

    subgraph "External Services"
        Supabase[(Supabase PostgreSQL)]
        Firebase[(Firebase RTDB)]
        PartyKit[PartyKit WebSocket]
        GitHub[GitHub OAuth + API]
    end

    Author --> MD
    MD --> CLI_JSON
    MD --> CLI_HTML
    CLI_JSON --> GenLib
    CLI_HTML --> GenLib
    GenLib --> ModelLib
    CLI_JSON -->|tutors.json| Netlify
    CLI_HTML -->|Static HTML| Netlify

    Reader -->|Fetch tutors.json| Netlify
    Reader --> CourseService
    Reader --> AnalyticsService
    Reader --> PresenceService

    AnalyticsService --> Supabase
    AnalyticsService --> Firebase
    PresenceService --> PartyKit
    Reader --> GitHub
```

## Repositories

| Repository | Purpose | Location |
|---|---|---|
| [tutors](https://github.com/tutors-sdk/tutors) | SvelteKit web reader application | `D:/code/tutors` |
| [tutors-apps](https://github.com/tutors-sdk/tutors-apps) | Generators, model library, PartyKit service | `D:/code/tutors-apps` |
| [tutors-testing](https://github.com/tutors-sdk/tutors-testing) | Generators + test suite (legacy) | `D:/code/tutors-testing` |

## Flows

| # | Flow | Trigger | Description |
|---|---|---|---|
| 01 | [Course Publishing](./01-course-publishing/flow.md) | CLI execution by author | Markdown content transformed to JSON/HTML and deployed to Netlify |
| 02 | [Course Loading](./02-course-loading/flow.md) | User navigates to `/course/[courseid]` | Fetches course JSON from Netlify, decorates tree, renders UI |
| 03 | [Authentication](./03-authentication/flow.md) | User clicks "Login with GitHub" | GitHub OAuth via Supabase Auth |
| 04 | [Learning Event Tracking](./04-learning-event-tracking/flow.md) | User views any learning object | Dual-write analytics to Firebase RTDB and Supabase PostgreSQL |
| 05 | [Real-Time Presence](./05-realtime-presence/flow.md) | User navigates within a course | WebSocket events broadcast via PartyKit |
| 06 | [Lab Navigation](./06-lab-navigation/flow.md) | User opens a lab at `/lab/[courseid]/[...loid]` | Step-through lab content with page tracking |
| 07 | [Course Search](./07-course-search/flow.md) | User searches at `/search/[courseid]` | Client-side full-text search across course content |
| 08 | [Time Analytics](./08-time-analytics/flow.md) | Instructor visits `/time/[courseid]` | Firebase-based user metrics and lab usage analytics |
| 09 | [Next-Time Analytics](./09-next-time-analytics/flow.md) | Instructor visits `/next-time/[courseid]` | Supabase-based learning interactions and calendar heatmaps |
| 10 | [Live Dashboard](./10-live-dashboard/flow.md) | User visits `/live` | Global real-time student activity via PartyKit |
| 11 | [Course Catalogue](./11-course-catalogue/flow.md) | User visits `/catalogue` | Lists all courses from Firebase RTDB |
| 12 | [User Dashboard](./12-user-dashboard/flow.md) | Authenticated user visits `/dashboard` | Shows user's accessed courses from Supabase |
| 13 | [Simulator](./13-simulator/flow.md) | User visits `/simulate` | Simulates student presence events via PartyKit |

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend Framework | SvelteKit 2.5 + Svelte 4 |
| UI Components | Skeleton UI 2.10 + Tailwind CSS |
| Authentication | Supabase Auth (GitHub OAuth provider) |
| Relational Database | Supabase (PostgreSQL) |
| NoSQL Database | Firebase Realtime Database |
| Real-Time | PartyKit (WebSocket rooms) |
| Content Rendering | markdown-it + plugins, PDF.js, highlight.js |
| Charts | D3.js, ECharts, AG Grid |
| Deployment | Netlify (adapter-netlify) |
| Content Generation | Deno + TypeScript CLI tools |

## Database Schema (Supabase)

| Table | Purpose | Key Fields |
|---|---|---|
| `students` | User profiles | id, avatar, full_name, email, duration, count, online_status |
| `course` | Course metadata | course_id, title, duration, count, img, icon |
| `learning_records` | Per-user LO interactions | student_id, course_id, lo_id, duration, count, type |
| `learningobject` | LO metadata | id, type, name, parent, child, lo_img, icon |
| `calendar` | Daily activity tracking | id (date), studentid, timeactive, pageloads, courseid |
| `accessed_courses` | User course history | id (user_id), course_list (JSONB) |

### Supabase RPC Functions

| Function | Purpose |
|---|---|
| `get_count_learning_records` | Get increment count for learning records |
| `get_median_time_active_per_date` | Calculate median active time per date |
| `increment_field` | Generic field incrementer for any table |
| `increment_calendar` | Increment calendar fields (pageloads/timeactive) |
| `get_all_learner_records` | Fetch all learning records for a course |

## Firebase RTDB Structure

```
root/
├── [courseId]/
│   ├── usage/
│   │   └── [loRoute]/
│   │       ├── last: timestamp
│   │       ├── title: string
│   │       └── visits: number
│   ├── users/
│   │   └── [sanitized_email]/
│   │       ├── email, name, nickname, picture, id
│   │       ├── last, count, onlineStatus
│   │       ├── calendar/
│   │       │   └── [YYYY-MM-DD]: count
│   │       └── [loRoute]/
│   │           ├── last, title, visits, count
│   └── visits: number
├── all-course-access/
│   └── [courseId]/
│       ├── title, visits, count, last
│       └── learningEvent: {...}
```
