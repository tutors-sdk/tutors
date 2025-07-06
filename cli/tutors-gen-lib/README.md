# Tutors Generator Library

Core generator library for the Tutors platform, responsible for transforming course content into both static and dynamic web experiences.

## Features

- Course Generation: Transform course content into web-ready formats
- Static Site Generation: Generate static HTML sites using Vento templating
- Dynamic Course Generation: Create JSON-based dynamic course structures
- Resource Management: Handle course assets and resources
- LLM Support: Generate AI-ready content from courses

## Key Components

- `services/`: Core services for course building, resource management, and course emission
- `templates/`: Vento templates for generating static HTML sites
- `utils/`: Utilities for file handling, LLM generation, and Netlify deployment
- `types/`: Core type definitions specific to the generator

## Usage

```typescript
import { parseCourse, generateStaticCourse, generateDynamicCourse } from "@tutors/tutors-gen-lib";

// Parse a course from a directory
const course = parseCourse(courseFolder);

// Generate static site
await generateStaticCourse(course, outputFolder);

// Generate dynamic course
generateDynamicCourse(course, outputFolder);
```

## Templates

The library uses Vento templating engine to generate static HTML sites with:
- Responsive layouts
- Navigation components
- Course content cards
- Lab step navigation
- Wall views for content organization
