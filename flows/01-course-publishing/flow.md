# Flow 01: Course Content Publishing

## Overview

Course authors create content as Markdown files in a structured directory hierarchy. The tutors CLI tools (in `tutors-apps` repo) parse this content and generate either JSON (for the Tutors Reader) or static HTML (for offline use), which is then deployed to Netlify.

## Trigger

- Course author runs `deno run -A jsr:@tutors/tutors-publish` (JSON) or `deno run -A jsr:@tutors/tutors-publish-html` (HTML) from the course directory.

## Repositories Involved

| Repository | Role |
|---|---|
| `tutors-apps` | CLI tools (`cli/tutors/main.ts`, `cli/tutors-lite/main.ts`), generator library, model library |

## Flow Diagram

```mermaid
sequenceDiagram
    participant Author as Course Author
    participant CLI as tutors CLI<br/>(tutors-apps/cli/tutors/main.ts)
    participant GenLib as tutors-gen-lib<br/>(course-builder.ts)
    participant ModelLib as tutors-model-lib<br/>(lo-types.ts)
    participant FS as File System
    participant Netlify as Netlify CDN

    Author->>CLI: Run `deno run -A jsr:@tutors/tutors-publish`
    CLI->>FS: Check for course.md in current directory
    alt course.md not found
        CLI-->>Author: Error: "Cannot locate course.md"
    end
    CLI->>GenLib: parseCourse(srcFolder)
    GenLib->>FS: Read course.md, properties.yaml, enrollment.yaml, calendar.yaml
    GenLib->>FS: Recursively scan directory tree
    loop For each directory
        GenLib->>ModelLib: Create Lo objects (Topic, Unit, Lab, Talk, Note, etc.)
        GenLib->>FS: Read markdown content, images, PDFs
        GenLib->>ModelLib: Build parent-child relationships
    end
    GenLib-->>CLI: Return Course object graph
    
    alt JSON Generation (tutors CLI)
        CLI->>GenLib: generateDynamicCourse(lo, destFolder)
        GenLib->>FS: Write json/tutors.json
        GenLib->>FS: Copy assets (images, PDFs, archives)
        GenLib->>FS: Write netlify.toml
    else HTML Generation (tutors-lite CLI)
        CLI->>GenLib: generateStaticCourse(lo, destFolder)
        GenLib->>GenLib: Download Vento templates from GitHub
        GenLib->>FS: Render templates → HTML files
        GenLib->>FS: Copy assets and styles
        GenLib->>FS: Write html/ folder structure
    end

    Author->>Netlify: Deploy (git push or netlify deploy)
    Netlify-->>Netlify: Serve tutors.json + assets at [courseId].netlify.app
```

## Input Directory Structure

```
course-folder/
├── course.md              # Course title, summary, content
├── properties.yaml        # Course properties (icon, private, etc.)
├── calendar.yaml          # Course calendar data
├── enrollment.yaml        # Enrolled student list
├── topic-01/
│   ├── topic.md           # Topic title and content
│   ├── unit-01/
│   │   ├── unit.md
│   │   ├── talk-01/
│   │   │   ├── talk.md
│   │   │   └── talk.pdf
│   │   ├── lab-01/
│   │   │   ├── lab.md
│   │   │   ├── 01.md      # Lab steps
│   │   │   └── 02.md
│   │   └── note-01/
│   │       └── note.md
│   └── side-01/
│       └── side.md
└── topic-02/
    └── ...
```

## Output (JSON Generator)

```
json/
├── tutors.json            # Complete course structure
├── [topic-assets]/        # Copied images, PDFs
└── netlify.toml           # Deployment config
```

## Key Files

| File | Repository | Purpose |
|---|---|---|
| `cli/tutors/main.ts` | tutors-apps | JSON generator entry point |
| `cli/tutors-lite/main.ts` | tutors-apps | HTML generator entry point |
| `cli/tutors-gen-lib/src/services/course-builder.ts` | tutors-apps | Parses course from filesystem |
| `cli/tutors-gen-lib/src/services/course-emitter.ts` | tutors-apps | Emits static HTML |
| `cli/tutors-model-lib/src/types/learning-objects.ts` | tutors-apps | Lo type definitions |

## External Calls

| Target | URL Pattern | Purpose |
|---|---|---|
| GitHub (templates) | `https://raw.githubusercontent.com/tutors-sdk/tutors-apps/refs/heads/development/cli/tutors-gen-lib/src/templates/vento/` | Download Vento templates for HTML generation |
