# Flow 09: Next-Time Analytics (Supabase-Based)

## Overview

The Next-Time Analytics page (`/next-time/[courseid]`) provides an alternative analytics view using Supabase as the data source. It fetches learning interactions, calendar data, and aggregates time-active metrics per student per date. This page uses Supabase RPC functions and real-time subscriptions.

## Trigger

- Authenticated instructor navigates to `/next-time/[courseid]`.

## URL Paths

| Component | Path |
|---|---|
| Next-Time page | `/next-time/[courseid]` |
| Course data | `https://[courseid].netlify.app/tutors.json` |

## Repositories Involved

| Repository | Role |
|---|---|
| `tutors` | Next-Time page, Supabase metrics utilities |

## Flow Diagram

```mermaid
sequenceDiagram
    participant User as Instructor<br/>(Browser)
    participant Page as +page.ts<br/>(next-time/[courseid])
    participant CS as courseService
    participant Netlify as Netlify CDN
    participant SBMetrics as supabase-metrics.ts
    participant SBUtils as supabase-utils.ts
    participant DB as Supabase Client<br/>(db/client.ts)
    participant Supabase as Supabase PostgreSQL

    User->>Page: Navigate to /next-time/[courseid]
    Page->>Page: Check session from parent layout

    alt Not authenticated
        Page-->>User: Return nothing
    end

    Page->>CS: readCourse(params.courseid, fetch)
    CS->>Netlify: GET https://[courseId].netlify.app/tutors.json
    Netlify-->>CS: Course JSON
    CS-->>Page: Course object

    par Fetch learning interactions
        Page->>SBMetrics: fetchLearningInteractions(course)
        SBMetrics->>DB: RPC get_all_learner_records({course_base: courseId})
        DB->>Supabase: Execute stored procedure
        Supabase-->>SBMetrics: LearningInteraction[]
        SBMetrics-->>Page: metrics
    and Fetch calendar data
        Page->>SBUtils: getCalendarDataForAll(courseId)
        SBUtils->>DB: SELECT * FROM calendar WHERE courseid = courseId
        DB->>Supabase: Query calendar table
        Supabase-->>SBUtils: LearningInteraction[]
        SBUtils-->>Page: records
    and Fetch median time
        Page->>SBUtils: getMedianTimeActivePerDate(courseId)
        SBUtils->>DB: RPC get_median_time_active_per_date({course_base: courseId})
        DB->>Supabase: Execute stored procedure
        Supabase-->>SBUtils: median data
        SBUtils-->>Page: medianCalendarTime
    end

    Page->>Page: Extract unique userIds from metrics
    Page->>SBMetrics: aggregateTimeActiveByDate(records)
    Note over SBMetrics: Build Map<studentId, Map<date, timeActive>>
    SBMetrics-->>Page: timeActiveMap

    Page->>Page: Extract unique calendarIds from aggregatedData

    Page->>SBMetrics: decorateLearningRecords(course, metrics)
    Note over SBMetrics: Attach LearningRecord to each Lo<br/>in course.loIndex by matching routes
    SBMetrics-->>Page: course.loIndex updated with records

    Page-->>User: Render analytics with heatmaps and metrics
```

## Supabase Queries

| Query Type | Target | Parameters | Purpose |
|---|---|---|---|
| RPC | `get_all_learner_records` | `course_base` | All learning records for course |
| SELECT | `calendar` | `WHERE courseid = courseId` | All calendar entries for course |
| RPC | `get_median_time_active_per_date` | `course_base` | Median active time across all dates |

## Data Flow

```mermaid
graph LR
    subgraph "Supabase PostgreSQL"
        LR[learning_records table]
        CAL[calendar table]
        RPC1[get_all_learner_records RPC]
        RPC2[get_median_time_active_per_date RPC]
    end

    subgraph "Client Processing"
        AGG[aggregateTimeActiveByDate]
        DEC[decorateLearningRecords]
        UI[Analytics UI]
    end

    LR --> RPC1
    RPC1 --> DEC
    CAL --> AGG
    CAL --> RPC2
    AGG --> UI
    DEC --> UI
    RPC2 --> UI
```

## Real-Time Subscription

The system also sets up a Supabase real-time subscription for live calendar updates:

```mermaid
sequenceDiagram
    participant DB as Supabase Client
    participant Supabase as Supabase Realtime
    participant Callback as UI Callback

    DB->>Supabase: channel("schema-db-changes").on("postgres_changes", {table: "calendar"})
    Supabase->>DB: Subscribe to INSERT/UPDATE/DELETE on calendar
    
    Note over Supabase: When any student's calendar entry changes...
    
    Supabase->>DB: Broadcast change payload
    DB->>Callback: callback(payload.new)
    Note over Callback: UI updates with new activity data
```

## Key Files

| File | Path | Purpose |
|---|---|---|
| Page loader | `src/routes/(time)/next-time/[courseid]/+page.ts` | Orchestrate data fetching |
| Supabase metrics | `src/lib/services/utils/supabase-metrics.ts` | Fetch/aggregate learning records |
| Supabase utils | `src/lib/services/utils/supabase-utils.ts` | Calendar queries, real-time sub |
| DB client | `src/lib/services/utils/db/client.ts` | Supabase client instance |
