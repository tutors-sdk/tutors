# Tutors Programme Guide

A programme groups multiple Tutors courses (modules) into a single degree stream, allowing learners to view all related courses through one unified page.

## Overview

In Tutors, a **course** is the fundamental unit of content. A **programme** sits above courses, providing a container that links related courses together — for example, all modules in a "Higher Diploma in Computer Science" degree.

The programme feature introduces:

- A `programme.json` manifest that defines the programme and lists its courses
- A `/programme/[programmeid]` route in the Tutors reader that renders the programme view
- A breadcrumb back-link from child courses to their parent programme

## Creating a Programme

### 1. Write `programme.json`

Create a `programme.json` file with the following structure:

```json
{
  "title": "HDip in Computer Science",
  "summary": "A conversion programme covering core CS fundamentals",
  "img": "banner.png",
  "icon": { "type": "fluent:hat-graduation-24-filled", "color": "success" },
  "courses": [
    "module-web-dev",
    "module-databases",
    "module-algorithms"
  ],
  "properties": {
    "credits": "120 ECTS"
  }
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Programme display name |
| `summary` | Yes | Short description shown below the title |
| `img` | No | Path to a banner image (relative to the programme root) |
| `icon` | No | Iconify icon object with `type` and `color` fields. Displayed when no image is set. Browse icons at [Iconify](https://icon-sets.iconify.design/) |
| `courses` | Yes | Array of course IDs. Each ID corresponds to a deployed Tutors course (e.g., the Netlify subdomain) |
| `properties` | No | Key-value metadata. `credits` is displayed in the programme header if present |

### 2. Deploy the Programme

Deploy the `programme.json` to a static hosting provider. The recommended approach mirrors how courses are deployed:

- **Netlify**: Deploy a repository containing `programme.json` to Netlify. The programme ID becomes the Netlify subdomain (e.g., `my-programme.netlify.app/programme.json`)
- **Any static host**: The reader accepts full URLs as well as Netlify subdomain IDs

### 3. Access the Programme

Navigate to the programme in the Tutors reader:

```
https://tutors.dev/programme/{programme-id}
```

For example, if your programme is deployed at `hdip-comp-sci.netlify.app`:

```
https://tutors.dev/programme/hdip-comp-sci
```

The reader fetches `programme.json`, loads metadata for each listed course in parallel, and renders them as clickable course cards.

## Linking Child Courses Back to the Programme

To add a breadcrumb back-link from a course to its parent programme, add the `parent` property to the course's `properties.yaml`:

```yaml
parent: programme/hdip-comp-sci
```

This renders a home icon in the course's breadcrumb bar that navigates back to the programme page. The value must match the route path: `programme/{programme-id}`.

## Local Development

To test a programme locally before deploying:

### Serve `programme.json` with CORS

The programme JSON needs to be served on a local port with CORS headers enabled. Create a `serve.py` in your programme directory:

```python
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

class CORSHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

print("Serving programme.json on http://localhost:3201")
HTTPServer(("", 3201), CORSHandler).serve_forever()
```

Run it:

```bash
python serve.py
```

### Start the Tutors reader

In a separate terminal:

```bash
cd tutors
npm run dev
```

### View the programme

Open in your browser:

```
http://localhost:5173/programme/localhost:3201
```

The reader resolves `localhost:3201` as a local URL, fetches `http://localhost:3201/programme.json`, and loads the child course metadata from their live Netlify deployments.

## Architecture

### How It Works

```
programme.json (hosted on Netlify or local)
  |
  v
programmeService.readProgramme()
  |
  +-- Fetches programme.json from {programmeId}.netlify.app
  +-- For each course ID in the courses array:
  |     +-- Fetches {courseId}.netlify.app/tutors.json
  |     +-- Extracts: title, summary, img, icon, credits
  |
  v
ProgrammeView.svelte
  |
  +-- Renders programme header (title, summary, icon, credits)
  +-- Renders course cards using the existing Card component
```

### Key Files (in the `tutors` reader)

| File | Purpose |
|------|---------|
| `src/lib/services/programme/types.ts` | Type definitions: `ProgrammeJson`, `ProgrammeCourseSummary`, `Programme` |
| `src/lib/services/programme/services/programme.svelte.ts` | Service that fetches and caches programme data |
| `src/lib/services/programme/index.ts` | Barrel export |
| `src/routes/(programme)/+layout.svelte` | Route group layout |
| `src/routes/(programme)/programme/[programmeid]/+page.ts` | Data loader |
| `src/routes/(programme)/programme/[programmeid]/+page.svelte` | Page component |
| `src/lib/ui/programme/ProgrammeView.svelte` | View component with header and course grid |

### Existing Mechanisms Used

- **`determineCourseUrl()`** — resolves programme and course IDs to URLs (Netlify subdomains, full URLs, or localhost)
- **`Card` component** — reused for rendering course cards in the programme view
- **`properties.parent` + `programHome` icon** — existing breadcrumb mechanism for child-to-parent navigation

## Example Repository

See [lgriffin/tutors-programme](https://github.com/lgriffin/tutors-programme) for a working example that links three courses into a single programme.

## Limitations

- **No combined analytics or progress tracking** — the programme view is read-only; analytics remain per-course
- **No cross-course search** — search operates within individual courses
- **One-way relationship** — the programme knows its courses, but courses only link back via the optional `parent` property
- **Manual authoring** — `programme.json` is hand-written; there is no generator in tutors-apps yet
