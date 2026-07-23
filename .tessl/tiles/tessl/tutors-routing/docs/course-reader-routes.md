# Course Reader Routes

All routes under `src/routes/(course-reader)/`. Every route has `export const ssr = false`.

## Route Table

| Route Pattern | Params | Load Function | Page Component |
|---|---|---|---|
| `/course/[courseid]` | `courseid` | `courseService.readCourse(courseid)` | `Composite` |
| `/topic/[courseid]/[...loid]` | `courseid`, `loid` (rest) | `courseService.readTopic(courseid, pathname)` | `Composite` |
| `/lab/[courseid]/[...loid]` | `courseid`, `loid` (rest) | `courseService.readLab(courseid, pathname)` | `Context > Lab` |
| `/talk/[courseid]/[...loid]` | `courseid`, `loid` (rest) | `courseService.readLo(courseid, pathname)` | `Context > TalkClient` |
| `/paneltalk/[courseid]/[...loid]` | `courseid`, `loid` (rest) | `courseService.readLo(courseid, pathname)` | `Context > TalkClient` |
| `/note/[courseid]/[...loid]` | `courseid`, `loid` (rest) | `courseService.readLo(courseid, pathname)` | `Context > Note` |
| `/video/[courseid]/[...loid]` | `courseid`, `loid` (rest) | `courseService.readLo(courseid, videoId)` | `Context > Video` |
| `/tutorial/[courseid]/[...loid]` | `courseid`, `loid` (rest) | `courseService.readLo(courseid, pathname)` | `Context > Note + TalkClient` |
| `/notebook/[courseid]/[...loid]` | `courseid`, `loid` (rest) | `courseService.readNotebook(courseid, pathname)` | `Context > Notebook` |
| `/wall/[type]/[courseid]` | `type`, `courseid` | `courseService.readWall(courseid, type)` | `Wall` |
| `/search/[courseid]` | `courseid` | `courseService.readCourse(courseid)` | Search UI |
| `/time/[courseid]` | `courseid` | `courseService.readCourse(courseid)` | HeatMaps + Tables |
| `/llm/[courseid]` | `courseid` | `courseService.readCourse(courseid)` + `generateLlms()` | LLM links |

## Component Wrapping Patterns

### Composite routes (course, topic)

```svelte
<Composite composite={data.course} />
```

Composite renders: `SecondaryNavigator` + `Panels` + `Units` + `Cards`. No `Context` wrapper needed.

### Content routes (lab, talk, note, video, notebook)

```svelte
<Context lo={data.lo}>
  <ContentComponent ... />
</Context>
```

`Context` wraps content pages — walks up `parentLo` to find the enclosing topic, then shows `SecondaryNavigator` + content + sticky `LoContextPanel` sidebar.

### Lab-specific

Lab routes hide the main navigator (`hideMainNavigator.value = true`) for a focused experience. Step navigation uses URL-based routing with arrow keys.

### Talk variants

The talk route renders different PDF viewers based on file type and course configuration:
- `.marp` files → `TalkMarp` (Marp presentation renderer)
- Default → `TalkClient` (client-side PDF viewer)
- Mozilla option → `TalkMozilla` (PDF.js)
- Adobe option → `TalkAdobe` (Adobe DC View)

### Tutorial route

Renders both a `Note` (markdown content) and optionally a `TalkClient` (if the tutorial has a PDF file).

### Video route

Handles query parameters for video start/end times. Resolves videoId from the URL path.

### Wall route

Aggregates all Los of a given type across the course. The `type` param matches Lo type strings (e.g., `lab`, `talk`, `note`).
