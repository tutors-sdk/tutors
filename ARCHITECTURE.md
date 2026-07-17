# Tutors Reader - Architecture Documentation

> **Version:** 15.2.0  
> **Last Updated:** June 2026  
> **Purpose:** Onboarding guide, cross-skilling reference, and architectural overview for contributors

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Architecture](#core-architecture)
5. [Service Layer](#service-layer)
6. [UI Components](#ui-components)
7. [Routing & Navigation](#routing--navigation)
8. [Data Flow](#data-flow)
9. [External Integrations](#external-integrations)
10. [Development Workflow](#development-workflow)
11. [Key Concepts](#key-concepts)
12. [Testing & Quality](#testing--quality)
13. [Deployment](#deployment)
14. [Contributing Guidelines](#contributing-guidelines)

---

## Overview

**Tutors** is an open-source learning experience platform that transforms structured course content into an intuitive, discoverable web application. This repository contains the **Tutors Reader** - a SvelteKit-based front-end application that presents educational content with rich features including analytics, real-time presence, and interactive learning objects.

### Key Capabilities

- **Course Rendering**: Displays courses, topics, labs, talks, videos, and other learning objects
- **Real-time Features**: Live student presence tracking via PartyKit WebSockets
- **Analytics**: Learning event tracking via Supabase
- **Authentication**: GitHub OAuth integration via Auth.js
- **Theming**: Customizable themes with light/dark mode support
- **Accessibility**: Dyslexia-friendly fonts and accessible design patterns

### Related Repositories

- **[tutors-apps](https://github.com/tutors-sdk/tutors-apps)**: Course generators and CLI tools
- **[tutors-reference-manual](https://github.com/tutors-sdk/tutors-reference-manual)**: Documentation
- **[tutors-reference-course](https://github.com/tutors-sdk/tutors-reference-course)**: Example course

---

## Technology Stack

### Core Framework

- **[SvelteKit 2.x](https://kit.svelte.dev/)**: Full-stack framework with SSR/CSR support
- **[Svelte 5.x](https://svelte.dev/)**: Reactive UI framework with runes-based state management
- **[Vite 8.x](https://vitejs.dev/)**: Build tool and dev server
- **[TypeScript 6.x](https://www.typescriptlang.org/)**: Type-safe JavaScript

### UI & Styling

- **[Tailwind CSS 4.x](https://tailwindcss.com/)**: Utility-first CSS framework
- **[Skeleton UI](https://www.skeleton.dev/)**: Svelte component library
- **[Iconify](https://iconify.design/)**: Icon library

### Content Processing

- **[markdown-it](https://github.com/markdown-it/markdown-it)**: Markdown parser
- **[Shiki](https://shiki.style/)**: Syntax highlighting
- **[PDF.js](https://mozilla.github.io/pdf.js/)**: PDF rendering

### Backend & Services

- **[Supabase](https://supabase.com/)**: Database, authentication, and analytics backend
- **[Auth.js/SvelteKit](https://authjs.dev/)**: GitHub OAuth authentication
- **[PartyKit](https://www.partykit.io/)**: Real-time WebSocket communication

### Development Tools

- **[ESLint](https://eslint.org/)**: Code linting
- **[Prettier](https://prettier.io/)**: Code formatting
- **[svelte-check](https://github.com/sveltejs/language-tools)**: Type checking for Svelte

---

## Project Structure

```
tutors/
├── src/
│   ├── lib/                          # Shared libraries and utilities
│   │   ├── services/                 # Business logic layer
│   │   │   ├── course/              # Course data management
│   │   │   ├── community/           # Analytics & presence services
│   │   │   ├── connect/             # User connection & auth
│   │   │   ├── markdown/            # Markdown processing
│   │   │   └── themes/              # Theme & UI configuration
│   │   ├── ui/                      # UI components
│   │   │   ├── components/          # Generic reusable components
│   │   │   ├── learning-objects/    # Learning object displays
│   │   │   │   ├── content/         # Content renderers (Lab, Video, etc.)
│   │   │   │   ├── layout/          # Layout components (Cards, Panels)
│   │   │   │   └── structure/       # Structural components
│   │   │   ├── navigators/          # Navigation components
│   │   │   └── time/                # Time tracking UI
│   │   └── runes.svelte.ts          # Global reactive state
│   │
│   ├── routes/                       # SvelteKit routing
│   │   ├── (auth)/                  # Authentication routes
│   │   ├── (course-reader)/         # Course content routes
│   │   │   ├── course/              # Course home page
│   │   │   ├── topic/               # Topic pages
│   │   │   ├── lab/                 # Interactive lab viewer
│   │   │   ├── talk/                # Presentation viewer
│   │   │   ├── video/               # Video player
│   │   │   ├── note/                # Note/PDF viewer
│   │   │   ├── wall/                # Content wall/gallery
│   │   │   ├── search/              # Course search
│   │   │   └── time/                # Analytics dashboard
│   │   ├── (home)/                  # Landing page & course list
│   │   ├── (live)/                  # Real-time presence views
│   │   │   ├── live/                # Live student tracking
│   │   │   └── catalogue/           # Course catalogue
│   │   ├── +layout.svelte           # Root layout
│   │   └── +layout.server.ts        # Server-side layout logic
│   │
│   ├── hooks.client.ts               # Client-side hooks
│   └── app.css                       # Global styles
│
├── static/                           # Static assets
│   ├── lib/                         # Shared libraries (PDF.js worker)
│   ├── icons/                       # Icon assets
│   └── *.woff2                      # OpenDyslexic fonts
│
├── .env.example                      # Environment variable template
├── svelte.config.js                  # SvelteKit configuration
├── vite.config.ts                    # Vite build configuration
├── tsconfig.json                     # TypeScript configuration
├── tailwind.config.ts                # Tailwind CSS configuration (if exists)
├── package.json                      # Dependencies and scripts
└── README.md                         # Setup instructions
```

### Key Directories Explained

- **`src/lib/services/`**: Business logic layer, organized by domain (course, community, themes)
- **`src/lib/ui/`**: Presentational components, organized by function
- **`src/routes/`**: File-based routing with grouped routes using `(groupName)` syntax
- **`static/`**: Publicly accessible assets served as-is

---

## Core Architecture

### Architectural Pattern: Service-Oriented Architecture

The application follows a **service-oriented architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    SvelteKit Routes                      │
│                    (Presentation)                        │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                   UI Components                          │
│              (src/lib/ui/*)                              │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  Service Layer                           │
│            (src/lib/services/*)                          │
│                                                           │
│  ┌──────────┐  ┌───────────┐  ┌────────┐  ┌──────────┐ │
│  │  Course  │  │ Community │  │ Theme  │  │ Connect  │ │
│  │ Service  │  │  Service  │  │Service │  │ Service  │ │
│  └──────────┘  └───────────┘  └────────┘  └──────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              External Services & Data                    │
│                                                           │
│  ┌──────────┐  ┌───────────┐  ┌────────────────────┐   │
│  │ Supabase │  │ PartyKit  │  │ Course JSON (CDN)  │   │
│  └──────────┘  └───────────┘  └────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### State Management: Svelte 5 Runes

The application uses **Svelte 5's runes-based reactivity** for state management:

**Global State** (`src/lib/runes.svelte.ts`):

```typescript
// Example pattern
export const currentCourse = rune<Course | null>(null);
export const currentLo = rune<Lo | null>(null);
```

**Service-Level State** (within services):

```typescript
// Services maintain their own reactive state
export const courseService: CourseService = {
  courses: new Map<string, Course>(),
  labs: new Map<string, LiveLab>()
  // ...
};
```

### Data Loading Strategy

1. **Server-Side Rendering (SSR)**: Initial page loads fetch data server-side
2. **Client-Side Navigation**: Subsequent navigation uses client-side fetching
3. **Caching**: Services maintain in-memory caches of loaded courses/labs
4. **Progressive Enhancement**: Works without JavaScript for basic content

---

## Service Layer

The service layer encapsulates business logic and external service integrations. Each service follows a consistent pattern:

### Service Structure Pattern

```typescript
// types.ts - Type definitions
export interface XService {
  // State
  someData: Map<string, Data>;

  // Methods
  loadData(): Promise<void>;
  processData(input: Input): Output;
}

// index.ts - Public exports
export { xService } from "./services/x.svelte";
export type { XService } from "./types";

// services/x.svelte.ts - Implementation
export const xService: XService = {
  someData: new Map(),

  async loadData() {
    // Implementation
  },

  processData(input) {
    // Implementation
  }
};
```

### Core Services

#### 1. Course Service (`src/lib/services/course/`)

**Purpose**: Manages course data loading, caching, and navigation

**Key Responsibilities**:

- Fetch and parse course JSON from CDN/origin
- Cache loaded courses and learning objects
- Manage lab state with `LiveLab` instances
- Handle course tree decoration and URL resolution

**Key Files**:

- `services/course.svelte.ts`: Main course loading and caching logic
- `services/live-lab.ts`: Interactive lab session management
- `services/lo-tree.ts`: Course tree traversal and decoration
- `types.ts`: TypeScript interfaces

**Usage Example**:

```typescript
import { courseService } from "$lib/services/course";

const course = await courseService.readCourse(courseId, fetch);
const topic = await courseService.readTopic(courseId, topicId, fetch);
```

#### 2. Community Service (`src/lib/services/community/`)

**Purpose**: Real-time presence, analytics, and social features

**Sub-services**:

- **Analytics Service**: Tracks learning events to Supabase
- **Presence Service**: Manages course-specific real-time student presence
- **Live Service**: Platform-wide live activity monitoring
- **Catalogue Service**: Manages course catalogue and visit statistics

**Key Technologies**:

- Supabase for analytics storage
- PartyKit WebSockets for real-time communication

**Key Files**:

- `services/analytics.svelte.ts`: Learning event tracking
- `services/presence.svelte.ts`: Course presence tracking
- `services/live.svelte.ts`: Global live activity
- `utils/supabase-client.ts`: Supabase client initialization

#### 3. Theme Service (`src/lib/services/themes/`)

**Purpose**: Manages UI themes, icons, layouts, and display modes

**Features**:

- Light/dark mode toggle
- Multiple icon themes
- Card layout modes (expanded/compacted)
- Card styles (portrait/landscape/circular)
- Festive mode (snow animation)

**Key Files**:

- `services/themes.svelte.ts`: Theme state and methods
- `types.ts`: Theme-related type definitions

**Usage Example**:

```typescript
import { themeService } from "$lib/services/themes";

themeService.toggleDisplayMode(); // Light/dark toggle
themeService.setLayout("compacted");
const icon = themeService.getIcon("lab");
```

#### 4. Connect Service (`src/lib/services/connect/`)

**Purpose**: User authentication and session management

**Features**:

- GitHub OAuth integration
- Session persistence
- User profile management
- Course access control

**Key Files**:

- `services/connect.svelte.ts`: Connection service implementation
- `utils/allCourseAccess.ts`: Course access utilities

#### 5. Markdown Service (`src/lib/services/markdown/`)

**Purpose**: Markdown processing and rendering

**Features**:

- Markdown to HTML conversion
- Syntax highlighting with Shiki
- Code block enhancements (copy button)
- Custom markdown-it plugins

**Key Files**:

- `services/markdown.svelte.ts`: Markdown processing logic

---

## UI Components

### Component Organization

Components are organized by function and reusability:

```
src/lib/ui/
├── components/          # Generic, reusable components
├── learning-objects/    # Domain-specific LO components
│   ├── content/        # Content renderers (Lab, Video, Talk, etc.)
│   ├── layout/         # Layout components (Cards, Panels, Wall)
│   └── structure/      # Structural components
├── navigators/         # Navigation components
│   ├── buttons/        # Navigation buttons
│   ├── footers/        # Footer components
│   ├── titles/         # Title/header components
│   └── tutors-connect/ # User menu/profile
└── time/               # Time tracking & analytics UI
```

### Learning Object Types

The platform supports various learning object types, each with dedicated renderers:

| Type          | Component                               | Purpose                            |
| ------------- | --------------------------------------- | ---------------------------------- |
| **Course**    | `Course.svelte`                         | Course home page                   |
| **Topic**     | `Topic.svelte`                          | Topic collection page              |
| **Lab**       | `Lab.svelte`                            | Interactive step-by-step tutorials |
| **Talk**      | `TalkClient.svelte`, `TalkAdobe.svelte` | Presentation viewers               |
| **Video**     | `Video.svelte`                          | Video player                       |
| **Note**      | `Note.svelte`                           | PDF/document viewer                |
| **Wall**      | `Wall.svelte`                           | Gallery/grid view of content       |
| **PanelTalk** | `PanelTalk.svelte`                      | Panel-based presentations          |

### Component Patterns

#### Layout Components

**Cards** (`Cards.svelte`, `Card.svelte`):

- Displays collections of learning objects as cards
- Supports multiple card styles (portrait/landscape/circular)
- Responsive grid layouts

**Panels** (`Panels.svelte`):

- Tabbed/panel interface for structured content
- Used in courses and topics

**Units** (`Units.svelte`):

- Displays sequential units/modules

#### Content Components

All content components follow this pattern:

```svelte
<script lang="ts">
  import type { Lo, Course } from "@tutors/tutors-model-lib";
  import { courseService } from "$lib/services/course";

  interface Props {
    lo: Lo;
    course: Course;
  }
  let { lo, course }: Props = $props();

  // Component logic
</script>

<!-- Template -->
```

---

## Routing & Navigation

### SvelteKit File-Based Routing

The application uses SvelteKit's file-based routing with **route groups** for organization:

```
routes/
├── (auth)/                    # Authentication routes (no layout)
│   └── auth/
│       └── +page.svelte
│
├── (course-reader)/           # Course content routes
│   ├── +layout.svelte        # Shared course layout
│   ├── course/[courseId]/
│   ├── topic/[courseId]/[topicId]/
│   ├── lab/[courseId]/[...labId]/
│   ├── talk/[courseId]/[talkId]/
│   ├── video/[courseId]/[videoId]/
│   ├── note/[courseId]/[noteId]/
│   └── ...
│
├── (home)/                    # Public home routes
│   └── +page.svelte          # Landing page
│
└── (live)/                    # Real-time presence routes
    ├── live/
    └── catalogue/
```

### Route Parameters

Routes use dynamic parameters for content navigation:

- `[courseId]`: Course identifier (e.g., `reference-course`)
- `[topicId]`: Topic identifier within a course
- `[...labId]`: Catch-all for lab steps (e.g., `lab-01/step-01`)

### Navigation Flow

```
Landing Page (/)
    │
    ├─→ Course List → Course (/course/[courseId])
    │                    │
    │                    ├─→ Topic (/topic/[courseId]/[topicId])
    │                    │      │
    │                    │      └─→ Lab/Talk/Video/Note
    │                    │
    │                    └─→ Time Dashboard (/time/[courseId])
    │
    └─→ Live View (/live)
         │
         └─→ Catalogue (/catalogue)
```

---

## Data Flow

### Course Loading Sequence

```
1. User navigates to /course/[courseId]
         │
         ▼
2. +page.ts calls courseService.readCourse()
         │
         ▼
3. courseService fetches tutors.json from CDN
         │
         ▼
4. Course tree decorated with URLs and metadata
         │
         ▼
5. Course cached in courseService.courses Map
         │
         ▼
6. currentCourse rune updated
         │
         ▼
7. +page.svelte renders course with reactive data
```

### Learning Object Loading

```
1. User clicks on Lab card
         │
         ▼
2. Navigate to /lab/[courseId]/[labId]
         │
         ▼
3. +page.ts calls courseService.readLab()
         │
         ▼
4. courseService creates LiveLab instance
         │
         ▼
5. LiveLab fetches markdown files and converts to HTML
         │
         ▼
6. Lab cached in courseService.labs Map
         │
         ▼
7. +page.svelte renders Lab component
```

### Analytics Event Flow

```
User views learning object
         │
         ▼
analyticsService.reportPageLoad()
         │
         ▼
presenceService.sendLoEvent()
         │
         ├─→ Supabase (analytics storage)
         │
         └─→ PartyKit WebSocket (real-time broadcast)
                │
                ▼
         Other connected clients receive presence update
```

---

## External Integrations

### 1. Supabase Integration

**Purpose**: Analytics storage and user data

**Configuration**:

```env
PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
PUBLIC_SUPABASE_ANON_KEY="xxx"
```

**Tables Used**:

- Learning event logs
- User sessions
- Course catalogue
- Student visit records

**Client Setup** (`src/lib/services/community/utils/supabase-client.ts`):

```typescript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
```

### 2. PartyKit Integration

**Purpose**: Real-time WebSocket communication

**Configuration**:

```env
PUBLIC_party_kit_main_room="https://tutors.partykit.dev"
```

**Connection Pattern**:

```typescript
import PartySocket from "partysocket";

const socket = new PartySocket({
  host: PUBLIC_party_kit_main_room,
  room: courseId
});

socket.addEventListener("message", (event) => {
  // Handle real-time events
});
```

### 3. Auth.js (GitHub OAuth)

**Purpose**: User authentication

**Configuration**:

```env
PRIVATE_AUTH_GITHUB_ID="xxx"
PRIVATE_AUTH_GITHUB_SECRET="xxx"
PRIVATE_AUTH_SECRET="xxx"
```

**Flow**:

1. User clicks "Sign in with GitHub"
2. Redirect to GitHub OAuth
3. Callback to `/auth/callback`
4. Session stored in cookies
5. User data available in `$page.data.user`

### 4. External Course Content (CDN)

**Purpose**: Fetch course JSON and assets

**URL Pattern**:

```
https://[courseUrl]/tutors.json
https://[courseUrl]/[topicId]/[loId]/[file]
```

**Protocol**: Configurable via `courseProtocol` rune (http/https)

---

## Development Workflow

### Setup

```bash
# Clone repository
git clone https://github.com/tutors-sdk/tutors.git
cd tutors

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your keys (or set PUBLIC_ANON_MODE=TRUE)

# Start dev server
npm run dev
```

### Development Server

```bash
npm run dev
# Runs on http://localhost:3000
```

**Hot Module Replacement (HMR)**: Vite provides instant updates during development

### Local Course Testing

To test with a local course:

1. Generate a course using `tutors-gen-lib` (from tutors-apps)
2. Serve the course locally or deploy to a static host
3. Navigate to: `http://localhost:3000/course/[your-course-url]`

### Available Scripts

```json
{
  "dev": "vite dev", // Start dev server
  "build": "vite build", // Production build
  "preview": "vite preview", // Preview production build
  "check": "svelte-check", // Type checking
  "check:watch": "svelte-check --watch",
  "format": "prettier --write .", // Format code
  "lint": "prettier --check . && eslint ." // Lint code
}
```

### Code Quality Tools

**Type Checking**:

```bash
npm run check
```

**Linting**:

```bash
npm run lint
```

**Formatting**:

```bash
npm run format
```

---

## Key Concepts

### 1. Learning Objects (Lo)

Learning objects are the atomic units of content in Tutors. Each has:

- **Type**: course, topic, lab, talk, video, note, etc.
- **Route**: URL path to access the object
- **Metadata**: Title, summary, icon, image
- **Children**: Nested learning objects (topics contain labs/talks/etc.)

**Type Definition** (from `@tutors/tutors-model-lib`):

```typescript
interface Lo {
  type: string;
  title: string;
  route: string;
  summary?: string;
  icon?: IconType;
  img?: string;
  los?: Lo[]; // Children
  // ... more properties
}
```

### 2. Course Tree Structure

Courses are hierarchical:

```
Course
├── Topic 1
│   ├── Lab 1
│   ├── Talk 1
│   └── Video 1
├── Topic 2
│   ├── Lab 2
│   └── Note 1
└── Topic 3
    └── ...
```

**Tree Decoration** (`lo-tree.ts`):

- Adds `route` property to each Lo
- Builds lookup indexes (`topicIndex`, `labIndex`, etc.)
- Calculates `courseUrl` for asset fetching

### 3. Reactive State with Runes

Svelte 5 uses **runes** for fine-grained reactivity:

```typescript
// Global state
export const currentCourse = rune<Course | null>(null);

// Usage in components
$effect(() => {
  if (currentCourse.value) {
    console.log("Course changed:", currentCourse.value.title);
  }
});
```

**Key Runes**:

- `$state`: Reactive state
- `$derived`: Computed values
- `$effect`: Side effects
- `$props`: Component props

### 4. Service Singleton Pattern

Services are singleton objects exported directly:

```typescript
// services/x.svelte.ts
export const xService: XService = {
  data: new Map(),

  async loadData() {
    // Shared state across entire app
  }
};

// Import and use anywhere
import { xService } from "$lib/services/x";
await xService.loadData();
```

### 5. Anonymous Mode

When `PUBLIC_ANON_MODE=TRUE`:

- No authentication required
- Analytics disabled
- Presence features hidden
- Ideal for local development without backend setup

---

## Testing & Quality

### Current Testing Approach

The project currently relies on:

1. **Type Safety**: TypeScript with strict mode
2. **Linting**: ESLint with Svelte plugin
3. **Type Checking**: `svelte-check` for Svelte component types
4. **Manual Testing**: Browser-based testing during development

### Future Testing Recommendations

For contributors looking to add tests:

1. **Unit Tests**: Consider Vitest for service layer testing
2. **Component Tests**: Svelte Testing Library
3. **E2E Tests**: Playwright for critical user flows
4. **Visual Regression**: Storybook + Chromatic (optional)

### Code Quality Standards

- **TypeScript**: All new code should be typed
- **Prettier**: Code must be formatted (run `npm run format`)
- **ESLint**: No linting errors (run `npm run lint`)
- **Svelte Check**: No type errors (run `npm run check`)

---

## Deployment

### Build Process

```bash
npm run build
```

This creates a production build in the `build/` directory.

### Deployment Targets

The project uses **adapter-auto** which supports:

- **Netlify**: Primary deployment target (adapter-netlify included)
- **Vercel**: Auto-detected
- **Cloudflare Pages**: Auto-detected
- **Node.js**: Fallback adapter

### Environment Variables for Production

Required for full functionality:

```env
# Authentication
PRIVATE_AUTH_GITHUB_ID="xxx"
PRIVATE_AUTH_GITHUB_SECRET="xxx"
PRIVATE_AUTH_SECRET="xxx"

# Analytics
PUBLIC_SUPABASE_URL="xxx"
PUBLIC_SUPABASE_ANON_KEY="xxx"

# Real-time presence
PUBLIC_party_kit_main_room="xxx"

# PDF viewer
PUBLIC_PDF_KEY="xxx"
```

For anonymous mode (no backend):

```env
PUBLIC_ANON_MODE=TRUE
```

### Static Asset Hosting

Static assets in `static/` are served from the root path:

- `static/favicon.png` → `/favicon.png`
- `static/lib/pdf.worker.min.mjs` → `/lib/pdf.worker.min.mjs`

### CDN Considerations

Course JSON files are fetched from external URLs. Ensure:

- CORS headers allow requests from your domain
- Content is publicly accessible (or auth is handled)
- HTTPS is used in production

---

## Contributing Guidelines

### Getting Started

1. **Fork the repository**
2. **Create a branch** from `development` (not `main`)
3. **Make your changes** with clear, focused commits
4. **Test locally** - verify your changes work as expected
5. **Submit a Pull Request** to the `development` branch

### Contribution Workflow

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/tutors.git
cd tutors

# 2. Create feature branch
git checkout -b feature/my-new-feature development

# 3. Make changes and commit
git add .
git commit -m "Add: Description of changes"

# 4. Push to your fork
git push origin feature/my-new-feature

# 5. Open PR to tutors-sdk/tutors:development
```

### Commit Message Guidelines

Follow conventional commits:

```
Add: New feature or functionality
Update: Enhancement to existing feature
Fix: Bug fix
Refactor: Code restructuring without behavior change
Docs: Documentation changes
Style: Code style/formatting changes
Test: Adding or updating tests
```

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Double quotes for strings
- **Semicolons**: Not required (Prettier handles)
- **Imports**: Organized with `$lib/` aliases

### What to Contribute

**Good First Issues**:

- Bug fixes (labeled `fix`)
- Documentation improvements
- UI/UX enhancements
- Accessibility improvements

**Feature Contributions**:

- Discuss in an issue first (labeled `feature`)
- Ensure alignment with project goals
- Include documentation updates

**What to Avoid**:

- Breaking changes without discussion
- Large refactors without prior approval
- Dependencies with incompatible licenses

### Pull Request Checklist

- [ ] Code follows project style (run `npm run format`)
- [ ] No linting errors (`npm run lint`)
- [ ] Type checking passes (`npm run check`)
- [ ] Changes tested locally
- [ ] PR targets `development` branch
- [ ] PR description explains what and why
- [ ] Related issue linked (if applicable)

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/tutors-sdk/tutors/issues)
- **Discussions**: Use issue comments or discussions
- **Documentation**: [Tutors Reference Manual](https://tutors.dev/course/tutors-reference-manual)

---

## Appendix

### Glossary

- **Lo (Learning Object)**: Atomic unit of content (lab, talk, video, etc.)
- **Course**: Collection of topics and learning objects
- **Topic**: Grouping of related learning objects
- **Lab**: Step-by-step interactive tutorial
- **Talk**: Presentation/slide deck
- **Wall**: Gallery view of learning objects
- **Tutors Connect**: User authentication and session management
- **Presence**: Real-time tracking of online students
- **Catalogue**: Course directory and statistics

### Useful Links

- **Live Application**: [https://tutors.dev](https://tutors.dev)
- **Documentation**: [Reference Manual](https://tutors.dev/course/tutors-reference-manual)
- **Example Course**: [Reference Course](https://tutors.dev/course/reference-course)
- **Gallery**: [Course Gallery](https://tutors.dev/gallery)
- **GitHub**: [tutors-sdk Organization](https://github.com/tutors-sdk)

### Version History

- **15.2.0** (Current): Latest stable release
- See [CHANGELOG.md](./CHANGELOG.md) for detailed version history

---

## License

This project is licensed under the **MIT License**. See LICENSE file for details.

---

**Last Updated**: June 2026  
**Maintainer**: Tutors SDK Team  
**Contributors**: See [GitHub Contributors](https://github.com/tutors-sdk/tutors/graphs/contributors)

For questions or clarifications about this architecture document, please open an issue on GitHub.
