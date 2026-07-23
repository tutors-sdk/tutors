# Type Utilities

Utility functions and types for working with the Lo type system.

## Type Classification

### simpleTypes

```typescript { .api }
const simpleTypes: string[] = [
  "note", "archive", "web", "github", "panelnote", "paneltalk",
  "panelvideo", "podcast", "talk", "book", "lab", "tutorial", "notebook"
];
```

### loCompositeTypes

```typescript { .api }
const loCompositeTypes: string[] = ["unit", "side", "topic", "course"];
```

### loTypes

Combined array of all 17 Lo type strings.

```typescript { .api }
const loTypes: string[] = simpleTypes.concat(loCompositeTypes);
```

### LoType

Union type derived from `loTypes`.

```typescript { .api }
type LoType = (typeof loTypes)[number];
```

### isCompositeLo

```typescript { .api }
function isCompositeLo(lo: Lo): boolean
```

Returns `true` if `lo.type` is one of `"unit"`, `"side"`, `"topic"`, or `"course"`.

## Ordering

### preOrder

Map defining display order for Lo types. Lower values appear first.

```typescript { .api }
const preOrder: Map<string, number> = new Map([
  ["course", 0], ["unit", 1], ["side", 2], ["topic", 3],
  ["talk", 4], ["tutorial", 5], ["book", 6], ["lab", 7],
  ["note", 8], ["web", 9], ["github", 10], ["archive", 11],
  ["panelnote", 12], ["paneltalk", 13], ["panelvideo", 14],
  ["podcast", 15], ["notebook", 16]
]);
```

## Traversal Utilities

From `@tutors/tutors-model-lib/utils/lo-utils`:

### flattenLos

```typescript { .api }
function flattenLos(los: Lo[]): Lo[]
```

Recursively flattens a nested Lo tree into a single array.

### filterByType

```typescript { .api }
function filterByType(los: Lo[], type: string): Lo[]
```

Filters a flat Lo array to only include Los of the specified type.

### sortLos

```typescript { .api }
function sortLos(los: Lo[]): Lo[]
```

Sorts Los using the `preOrder` map — composite types first, then simple types in defined order.

### crumbs

```typescript { .api }
function crumbs(lo: Lo | undefined, los: Lo[]): Lo[]
```

Builds breadcrumb trail by walking up the `parentLo` chain.

### loadIcon

```typescript { .api }
function loadIcon(lo: Lo): void
```

Reads `icon` property from `lo.frontMatter` and sets `lo.icon` as an `IconType` with type and color fields.

## Supporting Types

### LearningRecord

Tracks student interaction with a learning object.

```typescript { .api }
interface LearningRecord {
  date: Date;
  pageLoads: number;
  timeActive: number;
}
```

### IconType

```typescript { .api }
type IconType = {
  type: string;
  color: string;
};
```

### IconNav

Navigation icon with link and tooltip.

```typescript { .api }
type IconNav = {
  link: string;
  type: string;
  tip: string;
  target: string;
};
```

### IconNavBar

Collection of navigation icons with visibility flag.

```typescript { .api }
type IconNavBar = {
  show: boolean;
  bar: IconNav[];
};
```

### VideoIdentifier / VideoIdentifiers

```typescript { .api }
type VideoIdentifier = {
  service: string;
  id: string;
  url?: string;
  externalUrl?: string;
};

type VideoIdentifiers = {
  videoid: string;
  videoIds: VideoIdentifier[];
};
```

### Calendar Types

```typescript { .api }
type WeekType = { title: string; type: string; date: string; dateObj: Date };
type Calendar = { title: string; weeks: WeekType[]; currentWeek?: WeekType };
type Student = { name: string; id: string };
type Enrollment = { whitelist: string[]; students: Student[] };
```
