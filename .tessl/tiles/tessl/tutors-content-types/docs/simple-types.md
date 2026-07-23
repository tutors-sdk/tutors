# Simple Types

Simple types are leaf learning objects — they contain content but no child Los (except `Lab` which contains `LabStep[]`).

## Lab

A step-by-step practical exercise. The primary hands-on content type.

```typescript { .api }
type Lab = Lo & {
  type: "lab";
  los: LabStep[];
  pdf: string;
  pdfFile: string;
};
```

- **`los`**: Ordered array of `LabStep` objects, each with its own markdown content.
- **`pdf`** / **`pdfFile`**: Optional PDF version of the lab content.
- Labs are loaded lazily — markdown-to-HTML conversion happens when a lab is first viewed via `markdownService.convertLabToHtml()`.
- Step navigation uses URL-based routing and keyboard arrow keys.

## Talk

A presentation or lecture, typically with a PDF slide deck.

```typescript { .api }
type Talk = Lo & {
  type: "talk";
  pdf: string;
  pdfFile: string;
};
```

- Rendered using one of four PDF viewers based on course configuration: `TalkClient` (default), `TalkMozilla` (PDF.js), `TalkAdobe` (Adobe DC), or `TalkMarp` (Marp slides).

## Tutorial

A text-based tutorial with optional PDF.

```typescript { .api }
type Tutorial = Lo & {
  type: "tutorial";
  pdf: string;
  pdfFile: string;
};
```

## Note

A standalone markdown document.

```typescript { .api }
type Note = Lo & {
  type: "note";
};
```

- Notes are loaded lazily — markdown conversion is deferred until first view.

## Notebook

A Jupyter notebook rendered as interactive content.

```typescript { .api }
type Notebook = Lo & {
  type: "notebook";
  cells: NotebookCell[];
  kernelLanguage: string;
  kernelName: string;
};
```

- **`cells`**: Array of notebook cells (markdown, code, raw) with their outputs.
- **`kernelLanguage`**: Programming language of code cells (e.g., `"python"`).
- Notebooks are loaded lazily and rendered with Shiki syntax highlighting for code cells.

### NotebookCell

```typescript { .api }
type NotebookCell = {
  cellType: "markdown" | "code" | "raw";
  source: string;
  sourceHtml?: string;
  outputs: NotebookOutput[];
  outputsHtml?: string;
  executionCount: number | null;
  metadata: Record<string, unknown>;
  id: string;
};
```

### NotebookOutput

```typescript { .api }
type NotebookOutput = {
  outputType: "stream" | "execute_result" | "display_data" | "error";
  text?: string;
  data?: Record<string, string>;
  traceback?: string[];
  name?: string;
  executionCount?: number | null;
};
```

## Archive

A downloadable file resource.

```typescript { .api }
type Archive = Lo & {
  type: "archive";
  archiveFile?: string;
};
```

## Web

An external web resource link.

```typescript { .api }
type Web = Lo & {
  type: "web";
};
```

## Github

A GitHub repository link.

```typescript { .api }
type Github = Lo & {
  type: "github";
};
```

## Podcast

A podcast episode.

```typescript { .api }
type Podcast = Lo & {
  type: "podcast";
  episode: PodcastEpisodeIdentifier;
};
```

### PodcastEpisodeIdentifier

```typescript { .api }
type PodcastEpisodeIdentifier = {
  service: string;
  id: string;
};
```

## PanelNote

A note displayed in the panels section at the top of a topic/unit page.

```typescript { .api }
type PanelNote = Lo & {
  type: "panelnote";
};
```

## PanelTalk

A talk displayed in the panels section. Extends `Talk` (not `Lo` directly), so it inherits `pdf` and `pdfFile`.

```typescript { .api }
type PanelTalk = Talk & {
  type: "paneltalk";
};
```

## PanelVideo

A video displayed in the panels section.

```typescript { .api }
type PanelVideo = Lo & {
  type: "panelvideo";
};
```
