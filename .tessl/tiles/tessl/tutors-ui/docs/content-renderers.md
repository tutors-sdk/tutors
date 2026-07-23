# Content Renderers

Content renderers display the actual learning content. Located in `src/lib/ui/learning-objects/content/`.

## Lab

`content/lab/Lab.svelte` — step-based lab viewer.

**Props:** `{ lab: LabService }`

### Features
- Displays lab objectives HTML at the top
- Step navigation via sidebar navbar (vertical) or horizontal navbar
- Arrow key navigation (left/up = previous, right/down = next)
- Current step content rendered as HTML (pre-converted by `markdownService`)
- Auto-numbering of steps when `course.areLabStepsAutoNumbered` is true
- Hides main navigator for focused experience

### Step Navigation
- `lab.navbarHtml` — vertical step list (sidebar)
- `lab.horizontalNavbarHtml` — horizontal step indicators
- `lab.nextStep()` / `lab.prevStep()` — programmatic navigation
- `currentLabStepIndex` rune tracks active step

## Talk Variants

Four PDF/presentation renderers, selected based on file type and course configuration:

### TalkClient

`content/talk/TalkClient.svelte` — default client-side PDF viewer.

**Props:** `{ lo: Lo }`

### TalkMozilla

`content/talk/TalkMozilla.svelte` — Mozilla PDF.js viewer.

**Props:** `{ lo: Lo }`

Uses `pdfjs-dist` for rendering. Provides page navigation and zoom controls.

### TalkAdobe

`content/talk/TalkAdobe.svelte` — Adobe DC View embedded viewer.

**Props:** `{ lo: Lo }`

Uses the Adobe PDF Embed API. Requires the Adobe SDK to be loaded (`adobeLoaded` rune).

### TalkMarp

`content/talk/TalkMarp.svelte` — Marp presentation renderer.

**Props:** `{ lo: Lo }`

Renders Marp-formatted markdown as slide presentations. Processes `---` delimiters as slide breaks and applies Marp themes. Supports left/right arrow key navigation between slides.

## Note

`content/Note.svelte` — rendered markdown document.

**Props:** `{ lo: Lo }`

Displays `lo.contentHtml` (pre-converted from `contentMd` by `markdownService`). Supports Mermaid diagrams, KaTeX math, syntax-highlighted code blocks, and all markdown-it plugins.

## Video

`content/Video.svelte` — video player.

**Props:** `{ lo: Lo }`

Resolves video configuration from `lo.videoids` and renders the appropriate embed (YouTube, Vimeo, etc.). Supports query parameters for start/end times.

## Notebook

`content/notebook/Notebook.svelte` — Jupyter notebook viewer.

**Props:** `{ notebook: NotebookService }`

### Features
- Cell navigation via sidebar navbar and arrow keys
- Cell type indicators (markdown, code, raw)
- Exercise/solution cell detection and labeling
- Syntax-highlighted code cells via Shiki

### Cell Components

Located in `content/notebook/cells/`:

| Component | Purpose |
|---|---|
| `NotebookCell.svelte` | Dispatcher — renders the appropriate cell type |
| `NotebookMarkdownCell.svelte` | Rendered markdown content |
| `NotebookCodeCell.svelte` | Syntax-highlighted code with outputs |
| `NotebookRawCell.svelte` | Raw text display |
| `NotebookExerciseCell.svelte` | Exercise prompt cell |
| `NotebookSolutionCell.svelte` | Collapsible solution cell |

### NotebookCodeEditor

`content/notebook/NotebookCodeEditor.svelte` — displays code cell source with Shiki syntax highlighting. Shows execution count badge and cell outputs below.

## Calendar

`content/Calendar.svelte` — course calendar view.

Displays the course schedule with week titles, dates, and current week highlighting.

## Podcast

`content/Podcast.svelte` — podcast episode player.

Renders an embedded podcast player based on `lo.episode` (service and episode ID).
