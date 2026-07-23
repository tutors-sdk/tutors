# Shell and Navigation

## TutorsShell

`src/lib/ui/TutorsShell.svelte` — the app shell wrapping all course-reader routes.

### Structure

```svelte
<div class="flex h-screen flex-col">
  <a href="#main-content">Skip to content</a>   <!-- visible on focus -->
  <header>
    <MainNavigator />                            <!-- hidden when hideMainNavigator is true -->
  </header>
  <main id="main-content">
    {@render children()}                         <!-- route content -->
  </main>
  <footer>
    <Footer />                                   <!-- visible when viewport >= 800px height -->
  </footer>
  <button>Back to top</button>                   <!-- visible after 400px scroll -->
  <KeyboardShortcutsOverlay />                   <!-- toggled by ? key -->
</div>
```

### Global Keyboard Shortcuts

Handled in `TutorsShell`:
- `?` — toggle keyboard shortcuts overlay
- `f` — toggle focus mode (hide/show `MainNavigator`)
- `t` — scroll back to top

## MainNavigator

`src/lib/ui/navigators/MainNavigator.svelte` — the top application bar using Skeleton UI `AppBar`.

### Slots

| Position | Components |
|---|---|
| Lead | `InfoButton` (when course loaded) or `TutorsTitle` (landing) |
| Headline | `CourseTitle` |
| Trail | `CalendarButton`, `CourseSentimentButton`, `LlmsIndicator`, `TutorsTimeIndicator`, `SearchButton`, `LayoutMenu`, auth profile, `TocButton` |

## SecondaryNavigator

`src/lib/ui/navigators/SecondaryNavigator.svelte` — displayed within route pages below the main navigator.

**Props:** `{ lo: Lo, parentCourse?: Course }`

Contains:
- `Breadcrumbs` — path trail from course → topic → unit → current Lo
- `EditCoursButton` — link to course source (when available)
- Companion `IconBar` — external links (Slack, Zoom, GitHub, etc.)
- Wall `IconBar` — navigation to wall views (all labs, all talks, etc.)

## Navigator Buttons

All in `src/lib/ui/navigators/buttons/`:

| Component | Purpose |
|---|---|
| `Breadcrumbs` | Navigation path trail |
| `CalendarButton` | Link to course calendar (if course has calendar) |
| `CourseSentimentButton` | Sentiment selector dropdown (7 sentiments) |
| `EditCoursButton` | Link to edit course source |
| `InfoButton` | Course info tooltip/panel |
| `LlmsIndicator` | Link to LLM export page (if course has llm property) |
| `OnlineButton` | Online students indicator |
| `SearchButton` | Course content search |
| `TocButton` | Table of contents sidebar toggle |
| `TutorsTimeIndicator` | Link to time analytics page |

## Titles

| Component | Purpose |
|---|---|
| `CourseTitle` | Displays current course title in the app bar |
| `TutorsTitle` | Displays "Tutors" branding on the landing page |

## Footers

| Component | Purpose |
|---|---|
| `Footer` | Bottom bar with `TutorsMessage` and `TutorsVersion` |
| `TutorsMessage` | Customizable footer message from course properties |
| `TutorsVersion` | App version display |

## Auth Profile

| Component | Purpose |
|---|---|
| `AnonProfile` | Sign-in button for unauthenticated users |
| `ConnectedProfile` | User avatar, name, sign-out, share toggle for authenticated users |
