# External Integrations

Tutors integrates with several external services for data persistence, real-time communication, and content delivery.

## Supabase

PostgreSQL database via Supabase client. Initialized in `src/lib/services/community/utils/supabase-client.ts`.

### Tables

| Table | Purpose | Key Columns |
|---|---|---|
| `learning_records` | Per-student per-Lo interaction tracking | `course_id`, `student_id`, `lo_id`, `duration`, `count`, `type`, `date_last_accessed` |
| `calendar` | Per-student per-course daily time tracking | `id` (YYYY-MM-DD), `studentid`, `courseid`, `timeactive`, `pageloads` |
| `tutors-connect-users` | Student profiles | `github_id` (PK), `full_name`, `avatar_url`, `email`, `sentiment`, `online_status` |
| `tutors-connect-profiles` | Course visit history per user | `github_id`, JSON blob of `CourseVisit[]` |
| `tutors-connect-courses` | Course catalogue entries | `course_id`, `visited_at`, `visit_count`, `course_record` |
| `tutors-connect-latest` | Latest Lo snapshot per student per course | `course_id`, `student_id`, `payload`, `received_at` |

### RPC Functions

- `get_count_learning_records(field_name, course_base, user_name, lo_key)` — returns increment count for learning records
- `increment_calendar(field_name, row_id, student_id_value, course_id_value)` — increments a calendar field atomically

### Key Operations

```typescript { .api }
// Supabase client (not initialized in anonymous mode)
const supabase: SupabaseClient;

function storeStudentCourseLearningObjectInSupabase(course, loid, lo, student): Promise<void>;
function updateLearningRecordsDuration(courseId, studentId, loId): Promise<void>;
function updateCalendarDuration(id, studentId, courseId): Promise<void>;
function addOrUpdateStudent(student: TutorsId): Promise<void>;
function getTutorsConnectUserSentiment(githubId): Promise<string | null>;
function updateTutorsConnectUserSentiment(githubId, sentiment): Promise<void>;
function upsertTutorsConnectLatestLo(loRecord): Promise<void>;
function getTutorsConnectLatestLosByCourseId(courseId): Promise<TutorsConnectLatestRow[]>;
```

## PartyKit

WebSocket-based real-time communication for student presence.

### Rooms

| Room ID | Purpose |
|---|---|
| `tutors-all-course-access` | Global room — receives events from all courses |
| `{courseId}` | Per-course room — receives events for a specific course |

### Message Format

JSON-serialized `LoRecord` containing course info, Lo route/title, and student identity.

### Connection Pattern

```typescript
// Global connection (for /live page)
presenceService.connectToAllCourseAccess();

// Course-specific connection
presenceService.startPresenceListener(courseId);
```

## Course Content CDN

Courses are hosted as static JSON on Netlify:

- **URL pattern**: `{courseId}.netlify.app/tutors.json`
- **Content**: Full course tree as JSON, including all Lo metadata and markdown content
- **Assets**: Images, PDFs, and archives served from the same origin

## tutors-time-lib

Separate analytics library (`@tutors/tutors-time-lib`). Initialized in `src/hooks.client.ts` with Supabase credentials. Provides the analytics dashboard UI for the `/time/[courseid]` route.

## Environment Variables

| Variable | Purpose |
|---|---|
| `PUBLIC_SUPABASE_URL` | Supabase project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `PUBLIC_ANON_MODE` | `"TRUE"` disables auth, analytics, presence |
| `PUBLIC_PARTY_KIT_COURSE_URL` | PartyKit server URL |
| `AUTH_SECRET` | Auth.js session encryption secret |
| `AUTH_GITHUB_ID` | GitHub OAuth app client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth app client secret |
