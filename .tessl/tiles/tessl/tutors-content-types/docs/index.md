# Tutors Content Types (Learning Objects)

All content in the Tutors platform is represented as Learning Objects (Los). The type system is defined in `@tutors/tutors-model-lib` and forms the backbone of course structure, rendering, and navigation. Types split into two categories: composite types that contain child Los, and simple types that represent leaf content.

## Package Information

- **Package Name**: @tutors/tutors-model-lib
- **Package Type**: npm (via JSR)
- **Language**: TypeScript
- **Installation**: `npm install npm:@jsr/tutors__tutors-model-lib`

## Core Imports

```typescript
import type {
  Lo, Course, Topic, Unit, Side, Lab, LabStep, Talk, Note,
  Notebook, NotebookCell, Archive, Web, Github, Tutorial,
  PanelNote, PanelTalk, PanelVideo, Podcast,
  Composite, Panels, Units
} from "@tutors/tutors-model-lib";

import {
  simpleTypes, loCompositeTypes, loTypes, isCompositeLo, preOrder, Properties
} from "@tutors/tutors-model-lib";

import type { LoType, LearningRecord } from "@tutors/tutors-model-lib";
```

## Type Hierarchy

```
Lo (base)
  +-- Lab        (type: "lab",       adds los: LabStep[], pdf, pdfFile)
  +-- Talk       (type: "talk",      adds pdf, pdfFile)
  |     +-- PanelTalk  (type: "paneltalk")
  +-- Archive    (type: "archive",   adds archiveFile?)
  +-- Web        (type: "web")
  +-- Github     (type: "github")
  +-- Tutorial   (type: "tutorial",  adds pdf, pdfFile)
  +-- Note       (type: "note")
  +-- Notebook   (type: "notebook",  adds cells, kernelLanguage, kernelName)
  +-- Podcast    (type: "podcast",   adds episode)
  +-- PanelNote  (type: "panelnote")
  +-- PanelVideo (type: "panelvideo")
  +-- Composite  (adds toc, los, panels, units)
        +-- Topic   (type: "topic")
        +-- Unit    (type: "unit")
        +-- Side    (type: "side")
        +-- Course  (type: "course", adds courseId, courseUrl, indexes, properties, ...)
```

## Type Classification

```typescript
const simpleTypes = [
  "note", "archive", "web", "github", "panelnote", "paneltalk",
  "panelvideo", "podcast", "talk", "book", "lab", "tutorial", "notebook"
];

const loCompositeTypes = ["unit", "side", "topic", "course"];

const loTypes = simpleTypes.concat(loCompositeTypes); // all 17 types
```

## Capabilities

- [Base Types](base-types.md) — The `Lo` base type and its fields, `LabStep`, `Properties` class
- [Composite Types](composite-types.md) — `Composite`, `Course`, `Topic`, `Unit`, `Side`, `Panels`, `Units`
- [Simple Types](simple-types.md) — `Lab`, `Talk`, `Note`, `Notebook`, `Archive`, `Web`, `Github`, `Tutorial`, `PanelNote`, `PanelTalk`, `PanelVideo`, `Podcast`
- [Type Utilities](type-utilities.md) — `isCompositeLo()`, `filterByType()`, `flattenLos()`, `preOrder`, `LearningRecord`, icon types, media types
