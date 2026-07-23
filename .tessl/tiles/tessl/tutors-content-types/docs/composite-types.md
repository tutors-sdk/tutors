# Composite Types

Composite types are learning objects that contain child Los. They form the structural hierarchy of a course.

## Composite

Base for all container types. Extends `Lo` with child collections.

```typescript { .api }
type Composite = Lo & {
  toc: Lo[];
  los: Lo[];
  panels: Panels;
  units: Units;
};
```

- **`toc`**: Table of contents — flattened list of child Los for navigation.
- **`los`**: Direct child learning objects.
- **`panels`**: Extracted panel-style Los (videos, talks, notes, podcasts) displayed prominently at the top.
- **`units`**: Extracted units, sides, and remaining standard Los for structured display.

## Panels

Collection of panel-style learning objects extracted from a composite's children.

```typescript { .api }
type Panels = {
  panelVideos: PanelVideo[];
  panelTalks: PanelTalk[];
  panelNotes: PanelNote[];
  panelPodcasts: Podcast[];
};
```

Panel Los are displayed as prominent cards at the top of a topic or unit page, separated from the standard card grid.

## Units

Structural groupings within a composite.

```typescript { .api }
type Units = {
  units: Unit[];
  sides: Side[];
  standardLos: Lo[];
};
```

- **`units`**: Primary content groupings displayed in the main column.
- **`sides`**: Secondary content displayed in a sidebar column when present.
- **`standardLos`**: Remaining Los not categorized as units or sides.

## Course

Top-level container. Extends `Composite` with course-wide metadata, indexes, and configuration.

```typescript { .api }
type Course = Composite & {
  type: "course";
  courseId: string;
  courseUrl: string;
  topicIndex: Map<string, Topic>;
  loIndex: Map<string, Lo>;
  walls?: Lo[][];
  wallMap?: Map<string, Lo[]>;
  properties: Properties;
  calendar?: Properties;
  enrollment?: Enrollment;
  courseCalendar?: Calendar;
  authLevel: number;
  isPortfolio: boolean;
  isPrivate: boolean;
  llm: number;
  pdfOrientation: string;
  areVideosHidden: boolean;
  areLabStepsAutoNumbered: boolean;
  hasEnrollment: boolean;
  hasCalendar: boolean;
  defaultPdfReader: string;
  footer: string;
  ignorePin: string;
  companions: IconNavBar;
  wallBar: IconNavBar;
};
```

### Key Course Fields

- **`courseId`**: Identifier used in URLs and caching (e.g., `"reference-course"`).
- **`courseUrl`**: CDN base URL where course JSON and assets are hosted.
- **`topicIndex`**: Map from route strings to `Topic` objects for fast lookup.
- **`loIndex`**: Map from route strings to any `Lo` for fast lookup by path.
- **`walls`**: Auto-generated aggregations of Los by type (e.g., all labs, all talks) for wall views.
- **`wallMap`**: Map from type string to Los of that type.
- **`properties`**: Course-level front matter configuration.
- **`companions`**: External links displayed in the secondary navigator (e.g., Slack, Zoom, GitHub).
- **`wallBar`**: Navigation icons for wall views (filtered by which types exist in the course).

## Topic

A major section within a course. Contains units, sides, and panel Los.

```typescript { .api }
type Topic = Composite & {
  type: "topic";
};
```

## Unit

A grouping within a topic. Contains labs, talks, notes, and other simple Los.

```typescript { .api }
type Unit = Composite & {
  type: "unit";
};
```

## Side

A sidebar grouping within a topic. Rendered in a secondary column alongside units.

```typescript { .api }
type Side = Composite & {
  type: "side";
};
```
