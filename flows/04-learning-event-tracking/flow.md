# Flow 04: Learning Event Tracking

## Overview

When an authenticated user views any learning object (topic, lab, note, talk, video), the analytics service dual-writes tracking data to both Firebase Realtime Database and Supabase PostgreSQL. This includes page load counts, visit timestamps, time-on-page duration, and calendar-based activity heatmaps.

## Trigger

- User navigates to any learning object page (topic, lab, note, talk, video, wall).
- Periodic timer fires to update page count / duration.

## URL Paths

| Component | Path |
|---|---|
| Course page | `/course/[courseid]` |
| Topic page | `/topic/[courseid]/[...loid]` |
| Lab page | `/lab/[courseid]/[...loid]` |
| Note page | `/note/[courseid]/[...loid]` |
| Talk page | `/talk/[courseid]/[...loid]` |
| Video page | `/video/[courseid]/[...loid]` |

## Repositories Involved

| Repository | Role |
|---|---|
| `tutors` | Analytics service, Firebase utils, Supabase utils |

## Flow Diagram

```mermaid
sequenceDiagram
    participant User as Browser
    participant Page as Page Component
    participant AS as analyticsService<br/>(analytics.ts)
    participant FA as firebaseAnalytics<br/>(firebaseAnalytics.ts)
    participant SA as supabaseAnalytics<br/>(supabaseAnalytics.ts)
    participant FBUtils as firebase-utils.ts
    participant SBUtils as supabase-utils.ts
    participant Firebase as Firebase RTDB
    participant Supabase as Supabase PostgreSQL
    participant PS as presenceService
    participant PartyKit as PartyKit Server

    User->>Page: Navigate to learning object
    Page->>AS: learningEvent(course, params, session, lo)

    par Firebase Analytics
        AS->>FA: learningEvent(course, params, session, lo)
        FA->>FA: sanitise(params.loid) → loRoute
        FA->>FA: reportPageLoad(course, session, lo)
        
        FA->>FBUtils: updateLastAccess(courseId/usage/loRoute, title)
        FBUtils->>Firebase: SET last, title
        FA->>FBUtils: updateVisits(courseUrl)
        FBUtils->>Firebase: INCREMENT visits
        
        FA->>FBUtils: updateLastAccess(all-course-access/courseId, title)
        FBUtils->>Firebase: SET last, title
        FA->>FBUtils: updateVisits(all-course-access/courseId)
        FBUtils->>Firebase: INCREMENT visits
        
        FA->>FBUtils: writeObj(all-course-access/courseId/learningEvent, lo)
        FBUtils->>Firebase: SET learningEvent object
        
        opt User is authenticated
            FA->>FBUtils: updateLastAccess(courseId/users/email/loRoute)
            FBUtils->>Firebase: SET last, title
            FA->>FBUtils: updateVisits(courseId/users/email/loRoute)
            FBUtils->>Firebase: INCREMENT visits
        end
    and Supabase Analytics
        AS->>SA: learningEvent(course, params, session, lo)
        SA->>SA: Build loRoute from lo.route + params.loid
        SA->>SA: reportPageLoad(course, session, lo)
        
        SA->>SBUtils: storeStudentCourseLearningObjectInSupabase(course, loRoute, lo, user)
        SBUtils->>SBUtils: handleInteractionData(courseId, studentId, loId, lo)
        SBUtils->>SBUtils: manageStudentCourseLo(courseId, studentId, loId, lo)
        SBUtils->>Supabase: RPC get_count_learning_records (duration + count)
        SBUtils->>Supabase: UPSERT learning_records
        SBUtils->>SBUtils: insertOrUpdateCalendar(studentId, courseId)
        SBUtils->>Supabase: UPSERT calendar (timeactive, pageloads)
    and Presence Event
        FA->>PS: sendLoEvent(course, lo, onlineStatus, session)
        PS->>PartyKit: Send LoEvent JSON to tutors-all-course-access room
        PS->>PartyKit: Send LoEvent JSON to courseId room
    end

    Note over User: Timer fires periodically while user is on page

    User->>AS: updatePageCount(course, session, lo)
    par Firebase Duration
        AS->>FA: updatePageCount(course, session, lo)
        FA->>FBUtils: updateCount(courseId)
        FBUtils->>Firebase: INCREMENT count
        opt User authenticated
            FA->>FBUtils: updateCount(courseId/users/email/loRoute)
            FBUtils->>Firebase: INCREMENT count
            FA->>FBUtils: updateCalendar(courseId/users/email)
            FBUtils->>Firebase: INCREMENT calendar/YYYY-MM-DD
        end
    and Supabase Duration
        AS->>SA: updatePageCount(course, session, lo)
        SA->>SBUtils: updateLearningRecordsDuration(courseId, studentId, loRoute)
        SBUtils->>Supabase: UPDATE learning_records SET duration = duration + 1
        SA->>SBUtils: updateCalendarDuration(date, studentId, courseId)
        SBUtils->>Supabase: RPC increment_calendar (timeactive)
    end
```

## Database Writes

### Firebase RTDB

| Path | Operation | When |
|---|---|---|
| `[courseId]/usage/[loRoute]/last` | SET timestamp | Every page load |
| `[courseId]/usage/[loRoute]/title` | SET title | Every page load |
| `[courseId]/usage/[loRoute]/visits` | INCREMENT | Every page load |
| `[courseId]/visits` | INCREMENT | Every page load |
| `[courseId]/users/[email]/[loRoute]/last` | SET timestamp | Auth'd page load |
| `[courseId]/users/[email]/[loRoute]/visits` | INCREMENT | Auth'd page load |
| `[courseId]/users/[email]/[loRoute]/count` | INCREMENT | Duration tick |
| `[courseId]/users/[email]/calendar/[date]` | INCREMENT | Duration tick |
| `[courseId]/count` | INCREMENT | Duration tick |
| `all-course-access/[courseId]/*` | SET/INCREMENT | Every page load |
| `all-course-access/[courseId]/learningEvent` | SET object | Every page load |

### Supabase PostgreSQL

| Table | Operation | When |
|---|---|---|
| `learning_records` | UPSERT (student_id, course_id, lo_id) | Every page load |
| `calendar` | UPSERT (id=date, studentid, courseid) | Every page load |
| `learning_records.duration` | UPDATE increment | Duration tick |
| `calendar.timeactive` | RPC increment_calendar | Duration tick |

## Login Tracking

```mermaid
sequenceDiagram
    participant AS as analyticsService
    participant FA as firebaseAnalytics
    participant SA as supabaseAnalytics
    participant Firebase as Firebase RTDB
    participant Supabase as Supabase PostgreSQL

    AS->>FA: updateLogin(courseId, session)
    FA->>Firebase: SET users/email/email, name, id, nickname, picture, last
    FA->>Firebase: INCREMENT users/email/count

    AS->>SA: updateLogin(courseId, session)
    SA->>Supabase: UPSERT students (id, avatar, full_name, email, duration, count)
```

## Key Files

| File | Path | Purpose |
|---|---|---|
| Analytics facade | `src/lib/services/analytics.ts` | Delegates to Firebase + Supabase |
| Firebase analytics | `src/lib/services/firebaseAnalytics.ts` | Firebase RTDB tracking |
| Supabase analytics | `src/lib/services/supabaseAnalytics.ts` | Supabase PostgreSQL tracking |
| Firebase utils | `src/lib/services/utils/firebase-utils.ts` | Firebase read/write operations |
| Supabase utils | `src/lib/services/utils/supabase-utils.ts` | Supabase read/write operations |
| Supabase client | `src/lib/services/utils/db/client.ts` | Supabase client initialization |
