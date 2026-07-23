# Markdown Service

The markdown service (`src/lib/services/markdown/`) converts markdown content to HTML with syntax highlighting, diagram rendering, and presentation support.

## MarkdownService Interface

```typescript { .api }
interface MarkdownService {
  codeThemes: any;

  setCodeTheme(theme: string): void;
  convertLabToHtml(course: Course, lab: Lab, refreshOnly?: boolean): void;
  convertNoteToHtml(course: Course, note: Note, refreshOnly?: boolean): void;
  convertNotebookToHtml(course: Course, lo: Lo, refreshOnly?: boolean): void;
}
```

- `convertLabToHtml()` — processes each `LabStep` in the lab, converting `contentMd` to `contentHtml` with Shiki highlighting and URL filtering
- `convertNoteToHtml()` — converts the note's `contentMd` to `contentHtml`
- `convertNotebookToHtml()` — processes each cell: markdown cells get markdown-it conversion, code cells get Shiki highlighting, outputs are rendered by type
- `refreshOnly` flag — when `true`, re-renders HTML without re-fetching markdown (used when switching code themes)

## Processing Pipeline

### Base Markdown Processor

Configured in `@tutors/tutors-model-lib` (`markdown-utils.ts`):
- **markdown-it** with plugins: KaTeX (LaTeX math), anchors, TOC, emoji, sub/sup, mark, footnote, deflist
- Custom plugins for video players and podcast embeds
- `filter()` function rewrites relative image/archive paths to absolute CDN URLs

### Syntax Highlighting

**Shiki** code highlighter with:
- **29 languages** supported (TypeScript, JavaScript, Python, Java, Go, Rust, C++, HTML, CSS, SQL, and more)
- **7 themes**: github-light, github-dark, monokai, dracula, night-owl, one-dark-pro, catppuccin-latte
- Copy-button transformer adds a clipboard button to code blocks
- Theme persisted in `localStorage`

### Mermaid Diagrams

Fenced code blocks with language `mermaid` are rendered as `<div class="mermaid">` elements. Client-side Mermaid.js processes these on page load.

### Marp Presentations

Talks with `.marp` files use the `TalkMarp` component which renders Marp-formatted markdown as slide presentations. The renderer processes `---` delimiters as slide breaks and applies Marp themes.

### URL Filtering

The `filter()` function from `@tutors/tutors-model-lib` rewrites URLs in the converted HTML:
- Relative image paths → absolute CDN URLs based on course URL
- Archive download links → absolute CDN URLs
- Handles image types: `png`, `jpg`, `jpeg`, `gif`, `svg`, `PNG`, `JPG`, `JPEG`, `GIF`, `SVG`

## Notebook Rendering

`convertNotebookToHtml()` processes each `NotebookCell`:

| Cell Type | Processing |
|---|---|
| `markdown` | markdown-it conversion |
| `code` | Shiki syntax highlighting (language from `kernelLanguage`) |
| `raw` | Passed through as-is |

### Notebook Outputs

Each output is rendered by its `outputType`:

| Output Type | Rendering |
|---|---|
| `stream` | Plain text display |
| `execute_result` / `display_data` | Checks `data` for HTML, SVG, PNG, JPEG, LaTeX, or plain text (in priority order) |
| `error` | Formatted traceback with ANSI color stripping |
