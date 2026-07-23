# State Management

Tutors uses Svelte 5 runes for all reactive state. There are no Svelte stores — the entire codebase uses the `rune<T>()` wrapper pattern.

## The rune() Factory

Defined in `src/lib/runes.svelte.ts`:

```typescript { .api }
const rune = <T>(initialValue: T) => {
  let _rune = $state(initialValue);
  return {
    get value() { return _rune; },
    set value(v: T) { _rune = v; }
  };
};
```

This wraps `$state()` in a getter/setter object that can be exported from non-`.svelte` files and used reactively across the application.

### Usage Pattern

```typescript
// In a service or module
export const currentCourse = rune<Course | null>(null);

// Reading (in a component or $effect)
const title = currentCourse.value?.title;

// Writing (from a service or loader)
currentCourse.value = decoratedCourse;
```

## Global Runes

All exported from `src/lib/runes.svelte.ts`:

| Rune | Type | Default | Purpose |
|---|---|---|---|
| `currentCourse` | `Course \| null` | `null` | Active course object |
| `currentLo` | `Lo \| null` | `null` | Active learning object |
| `currentLabStepIndex` | `number` | `0` | Current step in lab view |
| `tutorsId` | `TutorsId \| null` | `null` | Authenticated user identity |
| `courseProtocol` | `string` | `"https://"` | Protocol for course URLs |
| `hideMainNavigator` | `boolean` | `false` | Focus mode — hides top nav bar |
| `shortcutsOverlayOpen` | `boolean` | `false` | Keyboard shortcuts overlay visibility |
| `animationDelay` | `number` | `200` | Animation timing in milliseconds |
| `adobeLoaded` | `boolean` | `false` | Adobe PDF embed SDK loaded state |

## Service-Level State

Each service maintains its own reactive state using the same `rune()` pattern or direct `$state()` in `.svelte.ts` files:

- **ThemeService**: `layout: { value: LayoutType }`, `cardStyle: { value: CardStyleType }`, `lightMode`, `isSnowing`
- **PresenceService**: `studentsOnline: { value: LoRecord[] }`
- **LiveService**: `coursesOnline: { value: LoRecord[] }`, `studentsOnline: { value: LoRecord[] }`
- **i18n**: `locale: { value: SupportedLocale }`
- **LoRecord**: Class with `$state` fields for reactive presence data

## Caching

Services use plain `Map` instances for caching — not reactive, just data storage:

| Service | Cache | Key | Value |
|---|---|---|---|
| CourseService | `courses` | courseId | Course |
| CourseService | `labs` | labId | LabService |
| CourseService | `notes` | noteId | Note |
| CourseService | `notebooks` | notebookId | NotebookService |

## Persistence

| What | Where | When |
|---|---|---|
| Theme, layout, card style, code theme | `localStorage` | On change |
| Locale | Cookie (`tutors-locale`) | On change |
| Course visits (anonymous) | `localStorage` | On navigation |
| Course visits (authenticated) | Supabase `tutors-connect-profiles` | On navigation |
| User preferences (sentiment, share) | Supabase `tutors-connect-users` | On change |
