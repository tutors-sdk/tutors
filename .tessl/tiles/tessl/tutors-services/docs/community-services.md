# Community Services

The community service area (`src/lib/services/community/`) handles analytics tracking, real-time presence, and course catalogue management. It communicates with Supabase for persistence and PartyKit for WebSocket-based real-time events.

## AnalyticsService

Records learning events (page loads, time spent) to Supabase.

```typescript { .api }
interface AnalyticsService {
  loRoute: string;

  learningEvent(course: Course, params: Record<string, unknown>, lo: Lo, student: TutorsId): void;
  reportPageLoad(course: Course, lo: Lo, student: TutorsId): void;
  updatePageCount(course: Course, lo: Lo, student: TutorsId): void;
  updateLogin(courseId: string, session: any): void;
}
```

- `learningEvent()` — called on every navigation from the course-reader layout's `$effect`
- `reportPageLoad()` — upserts into Supabase `learning_records` table (course_id, student_id, lo_id, date, duration, count, type)
- Duration updates run every 30 seconds via the connect service timer, incrementing `timeactive` in the `calendar` table

### Supabase Tables Used

| Table | Purpose | Key Columns |
|---|---|---|
| `learning_records` | Per-student per-Lo interaction tracking | `course_id`, `student_id`, `lo_id`, `duration`, `count`, `type` |
| `calendar` | Per-student per-course daily time tracking | `id` (date), `studentid`, `courseid`, `timeactive`, `pageloads` |

## PresenceService

Real-time student tracking via PartyKit WebSockets.

```typescript { .api }
interface PresenceService {
  studentsOnline: { value: LoRecord[] };
  partyKitAll: PartySocket;
  partyKitCourse: PartySocket;
  studentEventMap: Map<string, LoRecord>;
  listeningTo: string;

  studentListener(event: MessageEvent): void;
  sendLoEvent(course: Course, lo: Lo, student: TutorsId): void;
  connectToAllCourseAccess(): void;
  startPresenceListener(courseId: string): void;
}
```

- **Global room**: `tutors-all-course-access` — receives events from all courses
- **Course room**: `{courseId}` — receives events for a specific course
- `sendLoEvent()` — serializes an `LoRecord` and sends to both PartyKit rooms + upserts to `tutors-connect-latest` in Supabase

## LiveService

Platform-wide activity monitoring for the `/live` pages.

```typescript { .api }
interface LiveService {
  listeningForCourse: { value: string };
  coursesOnline: { value: LoRecord[] };
  studentsOnline: { value: LoRecord[] };
  studentEventMap: Map<string, LoRecord>;
  courseEventMap: Map<string, LoRecord>;
  partyKitCourse: PartySocket;
  listeningAll: boolean;

  studentListener(event: MessageEvent): void;
  courseListener(event: MessageEvent): void;
  partyKitListener(event: MessageEvent): void;
  startGlobalPresenceService(): void;
  startCoursePresenceListener(courseId: string): void;
}
```

## CatalogueService

Manages the course directory.

```typescript { .api }
interface CatalogueService {
  getCatalogue(): Promise<CatalogueEntry[]>;
  getCatalogueCount(): Promise<number>;
  getStudentCount(): Promise<number>;
  pruneCatalogue(fetchFunction: typeof fetch): Promise<void>;
  deleteCourses(courseIds: string[]): Promise<void>;
}
```

- Queries `tutors-connect-courses` Supabase table for course entries
- `pruneCatalogue()` — validates courses still exist by attempting to fetch their JSON, removes invalid entries

## LoRecord

Reactive class representing a student's current activity. Uses `$state` for all properties.

```typescript { .api }
class LoRecord {
  courseId: string = $state("");
  courseUrl: string = $state("");
  courseTitle: string = $state("");
  loRoute: string = $state("");
  title: string = $state("");
  img?: string = $state("");
  icon?: IconType = $state(undefined);
  isPrivate: boolean = $state(false);
  user?: LoUser = $state(undefined);
  type: string = $state("");
}
```

### LoUser

```typescript { .api }
interface LoUser {
  fullName: string;
  avatar: string;
  id: string;
  sentiment: string;
}
```
