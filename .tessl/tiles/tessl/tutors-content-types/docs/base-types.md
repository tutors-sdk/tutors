# Base Types

## Lo

The foundational type for all content in Tutors. Every learning object — from a full course to a single note — extends or implements `Lo`.

```typescript { .api }
type Lo = {
  type: string;
  id: string;
  title: string;
  summary: string;
  contentMd: string;
  contentHtml?: string;
  route: string;
  authLevel: number;
  img: string;
  imgFile: string;
  icon?: IconType;
  video: string;
  videoids: VideoIdentifiers;
  hide: boolean;
  frontMatter: Properties;
  parentLo?: Lo;
  parentTopic?: Topic;
  parentCourse?: Course;
  breadCrumbs?: Lo[];
  learningRecords?: Map<string, LearningRecord>;
};
```

### Key Fields

- **`type`**: Discriminator string — one of the 17 Lo types (e.g., `"lab"`, `"topic"`, `"course"`).
- **`id`**: Unique identifier within the course, derived from the content folder name.
- **`route`**: URL path used for navigation. Injected during `decorateCourseTree()` with the course URL replacing `{{COURSEURL}}` placeholders.
- **`contentMd`**: Raw markdown source. Converted to `contentHtml` during tree decoration (except for labs/notes/notebooks which defer conversion).
- **`authLevel`**: Access control level. `0` = public, higher values require authentication. Set via `frontMatter` properties.
- **`img`** / **`imgFile`**: Display image URL and filename for cards/thumbnails.
- **`icon`**: Optional Iconify icon override from frontMatter.
- **`hide`**: When `true`, the Lo is excluded from navigation and display.
- **`frontMatter`**: A `Properties` instance containing key-value pairs from the content's YAML front matter.
- **`parentLo`** / **`parentTopic`** / **`parentCourse`**: Back-references set during tree decoration for navigation and breadcrumb building.

## LabStep

A single step within a lab. Labs contain an ordered array of these.

```typescript { .api }
type LabStep = {
  title: string;
  shortTitle: string;
  contentMd: string;
  contentHtml?: string;
  route: string;
  id: string;
  parentLo?: Lab;
  type: string;
};
```

- **`shortTitle`**: Abbreviated title used in the lab step navbar.
- **`contentMd`** / **`contentHtml`**: Each step has its own markdown content, converted to HTML when the lab is loaded.

## Properties

Dynamic property collection for front matter. Uses a string index signature.

```typescript { .api }
class Properties {
  [key: string]: string;
}
```

Common property keys used in courses: `credits`, `auth`, `icon`, `hide`, `order`, `videoid`, `whitelist`, `enrollment`, `companions`, `calendar`, `llm`, `footer`, `ignorepin`, `pdforientation`, `defaultpdfreader`, `arevideos hidden`, `arelabstepsautonumbered`.
