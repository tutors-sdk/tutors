# Flow 08: Time Analytics (Firebase-Based)

## Overview

The Time Analytics page (`/time/[courseid]`) provides instructors with a view of student engagement metrics. It reads user activity data from Firebase Realtime Database, including per-user metrics, lab usage patterns, and calendar heatmaps. It also fetches GitHub profile data for enrolled users.

## Trigger

- Authenticated instructor navigates to `/time/[courseid]`.

## URL Paths

| Component | Path |
|---|---|
| Time Analytics page | `/time/[courseid]` |
| Course data | `https://[courseid].netlify.app/tutors.json` |
| GitHub API | `https://api.github.com/users/[username]` |

## Repositories Involved

| Repository | Role |
|---|---|
| `tutors` | Time page, Firebase metrics utilities |

## Flow Diagram

```mermaid
sequenceDiagram
    participant User as Instructor<br/>(Browser)
    participant Page as +page.ts<br/>(time/[courseid])
    participant CS as courseService
    participant Netlify as Netlify CDN
    participant FBMetrics as firebase-metrics.ts
    participant FBUtils as firebase-utils.ts
    participant Firebase as Firebase RTDB
    participant GitHub as GitHub API

    User->>Page: Navigate to /time/[courseid]
    Page->>Page: Check session from parent layout
    
    alt Not authenticated
        Page-->>User: Return nothing (page shows login prompt)
    end

    Page->>FBUtils: initFirebase(keys)
    FBUtils->>Firebase: signInWithEmailAndPassword(tutorStoreId, tutorStoreSecret)
    
    Page->>CS: readCourse(params.courseid, fetch)
    CS->>Netlify: GET https://[courseId].netlify.app/tutors.json
    Netlify-->>CS: Course JSON
    CS-->>Page: Course with wallMap, enrollment, etc.

    Page->>Page: allLabs = course.wallMap.get("lab")

    par Fetch current user metrics
        Page->>FBMetrics: fetchUserById(courseid, session, allLabs)
        FBMetrics->>Firebase: GET [courseBase]/users/[sanitizedEmail]
        Firebase-->>FBMetrics: User metrics tree
        FBMetrics->>FBMetrics: expandGenericMetrics → UserMetric
        FBMetrics->>FBMetrics: populateCalendar(user)
        FBMetrics->>FBMetrics: populateLabUsage(user, allLabs)
        FBMetrics-->>Page: UserMetric for current user
    and Fetch all user metrics
        Page->>FBMetrics: fetchAllUsers(courseid, allLabs)
        FBMetrics->>Firebase: GET [courseBase] (entire course tree)
        Firebase-->>FBMetrics: Full course data with all users
        FBMetrics->>FBMetrics: Extract users from metrics[1].metrics
        loop For each user with nickname
            FBMetrics->>FBMetrics: populateCalendar(user)
            FBMetrics->>FBMetrics: populateLabUsage(user, allLabs)
        end
        FBMetrics-->>Page: Map<string, UserMetric>
    end

    alt Course has enrollment list
        loop For each enrolled user
            Page->>Page: Look up user in users Map
            alt User found but name missing
                Page->>GitHub: GET https://api.github.com/users/[nickname]
                GitHub-->>Page: {name, login, avatar_url}
                Page->>Page: Set user.name from GitHub profile
            end
            Page->>Page: Add to enrolledUsers Map
        end
    end

    Page-->>User: Render analytics dashboard
    Note over User: Shows: user metrics, all users table,<br/>lab usage charts, calendar heatmap
```

## Data Model

```typescript
interface UserMetric {
  userId: string;
  email: string;
  name: string;
  picture: string;
  nickname: string;
  onlineStatus: string;
  count: number;
  last: string;
  duration: number;
  metrics: Metric[];
  labActivity: Metric[];
  calendarActivity: DayMeasure[];
}

interface DayMeasure {
  date: string;              // "2024-03-15"
  dateObj: number;           // Date.parse() result
  metric: number;            // Activity count
}
```

## Firebase Data Read Paths

| Path | Purpose |
|---|---|
| `[courseBase]/users/[email]` | Individual user's metrics tree |
| `[courseBase]` | Entire course tree (to extract all users) |

## External API Calls

| Target | URL | Purpose |
|---|---|---|
| GitHub API | `GET https://api.github.com/users/[username]` | Fetch display name for enrolled users without name data |

## Key Files

| File | Path | Purpose |
|---|---|---|
| Page loader | `src/routes/(time)/time/[courseid]/+page.ts` | Load metrics from Firebase |
| Firebase metrics | `src/lib/services/utils/firebase-metrics.ts` | Parse Firebase user metrics |
| Firebase utils | `src/lib/services/utils/firebase-utils.ts` | Firebase RTDB operations |
| Environment | `src/lib/environment.ts` | Firebase config keys |

## Environment Variables

| Variable | Purpose |
|---|---|
| `PUBLIC_firebase_apiKey` | Firebase API key |
| `PUBLIC_firebase_projectId` | Firebase project ID |
| `PUBLIC_firebase_databaseUrl` | Firebase RTDB URL |
| `PUBLIC_tutors_store_id` | Firebase service account email |
| `PUBLIC_tutors_store_secret` | Firebase service account password |
