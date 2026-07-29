# Flow 12: User Dashboard

## Overview

The User Dashboard (`/dashboard`) shows an authenticated user's course access history. It reads the `accessed_courses` table from Supabase, which stores a JSONB list of courses the user has visited along with visit counts and timestamps. If the user is not authenticated, they are redirected to `/auth`.

## Trigger

- Authenticated user navigates to `/dashboard`.

## URL Paths

| Component | Path |
|---|---|
| Dashboard page | `/dashboard` |
| Auth redirect | `/auth` (if not authenticated) |

## Repositories Involved

| Repository | Role |
|---|---|
| `tutors` | Dashboard page, Supabase query |

## Flow Diagram

```mermaid
sequenceDiagram
    participant User as Browser
    participant Page as +page.ts<br/>(dashboard)
    participant Layout as Parent Layout
    participant Supabase as Supabase PostgreSQL

    User->>Page: Navigate to /dashboard
    Page->>Layout: await parent()
    Layout-->>Page: {session, supabase}

    alt No session
        Page-->>User: Redirect 303 to /auth
    end

    Page->>Supabase: SELECT course_list FROM accessed_courses WHERE id = session.user.id
    Supabase-->>Page: [{course_list: {courses: [...]}}]

    Page-->>User: Render dashboard with course history
    Note over User: Shows list of accessed courses<br/>with names, last accessed dates,<br/>and visit counts
```

## Database Schema

### `accessed_courses` Table

| Column | Type | Purpose |
|---|---|---|
| `id` | UUID | Supabase user ID (from session.user.id) |
| `course_list` | JSONB | Course access history |

### `course_list` JSONB Structure

```json
{
  "courses": [
    {
      "id": "my-course.netlify.app",
      "name": "My Course Title",
      "last_accessed": "2024-03-15T10:30:00.000Z",
      "visits": 5
    }
  ]
}
```

## Data Population

The `accessed_courses` table is populated by the Course Loading flow (Flow 02). When an authenticated user visits `/course/[courseid]`, the page loader inserts or updates the user's course list.

## Key Files

| File | Path | Purpose |
|---|---|---|
| Page loader | `src/routes/(auth)/dashboard/+page.ts` | Auth check + Supabase query |
| Page component | `src/routes/(auth)/dashboard/+page.svelte` | Dashboard UI |
| Layout | `src/routes/(auth)/dashboard/+layout.svelte` | Dashboard layout wrapper |
