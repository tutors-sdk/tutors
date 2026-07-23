# Connect Service

The connect service (`src/lib/services/connect/`) manages authentication, user profiles, course visit history, and sentiment tracking.

## TutorsConnectService Interface

```typescript { .api }
interface TutorsConnectService {
  profile: ProfileStore;
  intervalId: any;
  anonMode: boolean;

  connect(redirectStr: string): void;
  reconnect(user: TutorsId): void;
  disconnect(redirectStr: string): void;
  toggleShare(): void;
  updateSentiment(sentiment: string): Promise<void>;
  courseVisit(course: Course): void;
  deleteCourseVisit(courseId: string): void;
  getCourseVisits(): Promise<CourseVisit[]>;
  favouriteCourse(courseId: string): void;
  unfavouriteCourse(courseId: string): void;
  learningEvent(params: Record<string, string>): void;
  startTimer(): void;
  stopTimer(): void;
  checkWhiteList(): void;
}
```

## Authentication Flow

1. User clicks sign-in → `connect()` calls `signIn("github")` from `@auth/sveltekit/client`
2. GitHub OAuth via Auth.js, configured in `src/hooks.server.ts`:
   - JWT strategy with 1-year sessions
   - Profile callback exposes GitHub `login` username
   - Session callback injects `token.login` into `session.user.login`
3. On page load, `+layout.server.ts` calls `locals.auth()` → returns `{ loggedIn, user, locale }`
4. `+layout.svelte` calls `reconnect(user)` which:
   - Switches from `localStorageProfile` to `supabaseProfile`
   - Restores sentiment and share status from Supabase
   - Updates `tutorsId` global rune

### Anonymous Mode

When `PUBLIC_ANON_MODE=TRUE`:
- Authentication UI is hidden
- Analytics and presence tracking are disabled
- Supabase client is not initialized

## ProfileStore Interface

Two implementations: `localStorageProfile` (default) and `supabaseProfile` (authenticated).

```typescript { .api }
interface ProfileStore {
  courseVisits: CourseVisit[];

  reload(): void;
  save(): void;
  logCourseVisit(course: Course): void;
  favouriteCourse(courseId: string): void;
  unfavouriteCourse(courseId: string): void;
  deleteCourseVisit(courseId: string): void;
  getCourseVisits(): Promise<CourseVisit[]>;
}
```

## Key Types

### TutorsId

```typescript { .api }
type TutorsId = {
  name: string;
  login: string;
  email: string;
  image: string;
  share: string;
  sentiment: string;
};
```

### CourseVisit

```typescript { .api }
type CourseVisit = {
  id: string;
  title: string;
  img?: string;
  icon?: IconType;
  lastVisit: string;
  credits: string;
  visits?: number;
  private: boolean;
  favourite: boolean;
};
```

### CourseSentimentId

```typescript { .api }
const COURSE_SENTIMENT_IDS = [
  "neutral", "fine", "delighted", "confident",
  "overwhelmed", "confused", "drained"
] as const;

type CourseSentimentId = (typeof COURSE_SENTIMENT_IDS)[number];
```

## Analytics Timer

`startTimer()` sets a 30-second interval that:
1. Calls `updateLearningRecordsDuration()` — increments duration in `learning_records` via Supabase RPC
2. Calls `updateCalendarDuration()` — increments `timeactive` in `calendar` via Supabase RPC

The timer is started in the course-reader layout and stopped on disconnect.

## Whitelist

`checkWhiteList()` validates the current user against `course.enrollment.whitelist`. If the course has an enrollment whitelist and the user's GitHub login is not in it, they are redirected to the auth page.
