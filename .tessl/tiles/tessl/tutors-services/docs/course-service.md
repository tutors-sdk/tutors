# Course Service

The course service (`src/lib/services/course/`) is the central data layer. It fetches course JSON from CDN, decorates the Lo tree, and provides cached access to all learning objects.

## CourseService Interface

```typescript { .api }
interface CourseService {
  courses: Map<string, Course>;
  labs: Map<string, LabService>;
  notes: Map<string, Note>;
  notebooks: Map<string, NotebookService>;
  courseUrl: any;

  getOrLoadCourse(courseId: string, fetchFunction: typeof fetch): Promise<Course>;
  readCourse(courseId: string, fetchFunction: typeof fetch): Promise<Course>;
  readTopic(courseId: string, topicId: string, fetchFunction: typeof fetch): Promise<Lo>;
  readLab(courseId: string, labId: string, fetchFunction: typeof fetch): Promise<LabService>;
  readNotebook(courseId: string, notebookId: string, fetchFunction: typeof fetch): Promise<NotebookService>;
  readWall(courseId: string, type: string, fetchFunction: typeof fetch): Promise<Lo[]>;
  readLo(courseId: string, loId: string, fetchFunction: typeof fetch): Promise<Lo>;
  refreshAllLabs(codeTheme: string): void;
}
```

All methods call `getOrLoadCourse()` first, which checks the `courses` Map cache. On cache miss, it fetches `{protocol}{courseUrl}/tutors.json` and calls `decorateCourseTree()`.

## Course Loading Flow

1. Route `+page.ts` loader calls `courseService.readCourse(courseId, fetch)`
2. `getOrLoadCourse()` resolves the course URL via `determineCourseUrl()`:
   - Netlify domains: `{courseId}.netlify.app`
   - Localhost URLs: parsed directly
   - Plain IDs: `{courseId}.netlify.app` (default)
3. Fetches `{protocol}{courseUrl}/tutors.json`
4. `decorateCourseTree(course, courseId, courseUrl)`:
   - Injects `courseUrl` into all routes, images, PDFs (replaces `{{COURSEURL}}` placeholders)
   - Recursively calls `decorateLoTree()` — sets parent references, loads icons, builds breadcrumbs, converts markdown to HTML
   - Labs, notes, and notebooks defer HTML conversion until first view
   - Extracts panels and units from composite Los
   - Builds `course.loIndex` (Map<route, Lo>) and `course.topicIndex` (Map<route, Topic>)
   - Runs `loadPropertyFlags()`, `createCompanions()`, `createWalls()`, `initCalendar()`
5. Course cached in `courses` Map, `currentCourse` rune updated

## LabService Interface

Manages step-by-step navigation within a lab.

```typescript { .api }
interface LabService {
  course: Course;
  lab: Lab;
  url: string;
  objectivesHtml: string;
  currentChapterShortTitle: string;
  currentChapterTitle: string;
  navbarHtml: string;
  horizontalNavbarHtml: string;
  content: string;
  chaptersHtml: Map<string, string>;
  chaptersTitles: Map<string, string>;
  steps: string[];
  index: number;
  autoNumber: boolean;
  vertical: boolean;

  convertMdToHtml(): void;
  refreshStep(): void;
  refreshNav(): void;
  setCurrentChapter(step: string): void;
  setFirstPageActive(): void;
  setActivePage(step: string): void;
  nextStep(): string;
  prevStep(): string;
}
```

- `setFirstPageActive()` — activates the first step (used on initial lab load)
- `setActivePage(step)` — activates a specific step by URL segment
- `nextStep()` / `prevStep()` — navigate between steps, returns the new step ID
- `navbarHtml` / `horizontalNavbarHtml` — pre-rendered HTML for the step navigation bar

## NotebookService Interface

Manages cell navigation within a Jupyter notebook.

```typescript { .api }
interface NotebookService {
  course: Course;
  notebook: NotebookLo;
  url: string;
  cells: NotebookCell[];
  cellCount: number;
  activeCellIndex: number;
  navbarHtml: string;
  horizontalNavbarHtml: string;

  setActiveCell(index: number): void;
  nextCell(): number;
  prevCell(): number;
  isSolutionCell(cell: NotebookCell): boolean;
  isExerciseCell(cell: NotebookCell): boolean;
  getCellLabel(cell: NotebookCell, index: number): string;
  getCellTypeIcon(cellType: string): string;
  refreshNav(): void;
}
```

## Caching

Four in-memory Maps cache loaded content:
- `courses: Map<string, Course>` — full course trees
- `labs: Map<string, LabService>` — lab instances with converted HTML
- `notes: Map<string, Note>` — notes with converted HTML
- `notebooks: Map<string, NotebookService>` — notebook instances with converted cells
