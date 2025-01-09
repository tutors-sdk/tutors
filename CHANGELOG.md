# Tutors Changelog

#### [2024-01-09]: Tutors 11.3.0

- Refactor: Services layer restructuring (#920)

  - Introduced barrel files for base, connect, and community services
  - Consolidated service types and re-export mechanisms
  - Improved code organization and maintainability

- Feature: Enhanced Card System (#917, #916, #910)

  - Introduced new card styles including landscape and circular options
  - Added fine-grained reactivity for better performance
  - Implemented persistent card style preferences
  - Simplified card layout and improved mobile responsiveness

- Feature: Live Integration Improvements (#914)

  - Enhanced live subsystem functionality
  - Improved time components and statistics display
  - Added conditional menu options based on course context
  - Updated stat formats and live system linking

- Refactor: Runes Management (#906)

  - Moved runes into appropriate service modules
  - Improved state management for course, theme, and layout
  - Simplified code style and theme management
  - Enhanced type safety and reduced complexity

- UI/UX Improvements

  - Enhanced lab navigation and article widths (#901)
  - Improved mobile responsiveness (#900)
  - Added scrollbar for LoContext Panel (#899)
  - Refined shell and footer components (#897)

- Fix: Course reader navigation improvements (#895)
- UI: Theme service enhancements

#### [2024-12-16]

- Feature: Layout Controls Enhancement

  - Converted layout controls to dropdown menu for better UX
  - Implemented Segmented control for layout menu
  - Improved wall display management
  - Enhanced icon bar functionality

- Fix: Navigation Improvements

  - Resolved scroll position reset between lab steps
  - Implemented smoother navigation experience
  - Enhanced user position tracking

- UI: Removed captured icon bar, replaced with standard implementation (#893)
- Feature: Layout controls converted to dropdown menu

#### [2024-12-14] : Tutors 11.2.0

- Feature: Copy/Paste Implementation (#892)

  - Added copy button for code blocks
  - Introduced new copy/paste button resources
  - Enhanced code block interaction
  - Improved user feedback for copy operations

- Refactor: Markdown Service Layer (#891)

  - Introduced dedicated markdown service interface
  - Improved code organization and maintainability
  - Enhanced markdown processing strategies
  - Streamlined service layer architecture

- UI: Code Theme Enhancements (#890, #889)
  - Removed highlight.js in favor of Shiki
  - Updated theme defaults and configurations
  - Added support for additional languages including Dockerfile
  - Refined code block presentation

#### [2024-12-12]

- Feature: Code Style System (#888)

  - Implemented Shiki code highlighting
  - Created comprehensive code theme selection
  - Introduced new markdown service architecture
  - Enhanced code block rendering performance

- Fix: Card Component Improvements (#886)

  - Enhanced card layout and responsiveness
  - Improved component architecture
  - Optimized rendering performance
  - Updated styling system

- Feature: Shiki code highlighting implementation (#887)
- Feature: Copy/Paste functionality for code blocks
- UI: Code theme updates and refinements

#### [2024-12-08]

- Feature: Adobe Panel integration (#884)
- Enhancement: PDF load timing updates
- UI: Footer and profile improvements

#### [2024-12-06]

- UI: Force theme implementation (#881)
- Refactor: UX taxonomy improvements (#880, #879)
- Feature: Theme persistence (#883, #882)
- Enhancement: Path handling improvements

#### [2024-12-04]

- Fix: Archives link correction (#878)
- Fix: Navigator improvements (#877)

#### [2024-12-03]

- Feature: Festive theme implementation (#876)
- UI: Particle effects added (#875)

#### [2024-12-02]

- UI: Animation system improvements (#874, #872)
- Feature: Festive theme enhancements (#873)

### 2024-11

#### [2024-11-28]

- UI: Links style improvements (#871, #870)
- Feature: Favorites system implementation (#869)

#### [2024-11-27]

- UI: Animated footer implementation (#868)
- UI: Theme updates and refinements (#867)
- Feature: Dynamic footer system (#866)
- Fix: Lab responsive design (#865)
- Fix: Theme persistence improvements (#864)

#### [2024-11-26]: Tutors 11.1.0

- UI: Theme system updates (#863, #862, #861)
- Fix: Theme persistence improvements (#860)
- Fix: Mode selection fix (#859)
- UI: Skeleton 3 implementation (#858, #857)

#### [2024-11-20]

- UI: Footer adjustments and refinements (#854, #851)
- Feature: Tutors time indicator reintroduction (#855)
- Enhancement: Footer adjustments (#852)

#### [2024-11-19]:

- Feature: Tutors time indicator implementation (#849)

#### [2024-11-18]: Tutors 11.0.0

- Fix: Netlify adapter improvements (#847)
- Fix: Terms and conditions updates (#846)
- Fix: Terms and netlify adapter (#848, #845)
- Release: Tutors 11 (#844)

### 2024-10

#### [2024-10-15]

- Feature: Cards layout update and improvements (#827, #826)
- Feature: Lab width improvements (#828)
- Enhancement: Note width adjustments

#### [2024-10-10]

- Feature: Charts logic update (#824, #822)
- Feature: Updated charts logic (#825)
- Enhancement: Navigation improvements

### 2024-09

#### [2024-09-27]

- Feature: Charts logic enhancement (#807)

#### [2024-09-16]

- Feature: Lab style improvements (#805, #803, #801)
- Feature: Lab styling improvements (#806)
- Enhancement: Context handling in labs

#### [2024-09-14]

- Feature: Tree context implementation (#799)
- Feature: Tree context implementation (#800)
- Enhancement: Navigation improvements

#### [2024-09-13]

- Feature: Nested topics support (#794)
- Fix: Analytics time tracking issues (#793)

#### [2024-09-05]

- Fix: Analytics time tracking improvements (#792, #790)

### 2024-08

#### [2024-08-30]

- Feature: Skeleton v2 migration (#461)
- Fix: Theme system improvements
- UI: Dyslexia theme implementation

#### [2024-08-17]

- Feature: Heatmap charts implementation
- Refactor: Analytics system improvements

### 2024-07

#### [2024-07-31]

- Feature: Generator Library
  - First draft of tutors-gen-html
  - Implemented tutors-gen-lib functionality
  - Enhanced build tasks and configurations

#### [2024-07-25]

- Feature: Authentication System
  - Implemented Supabase authentication
  - Added dashboard functionality
  - Enhanced user session management
  - Improved navigation and routing

#### [2024-07-20]

- Feature: Code Optimization
  - Enhanced course and LO utilities
  - Improved analytics service efficiency
  - Optimized listener management
  - Enhanced reader-lib models

#### [2024-07-15]

- Feature: TopDeck Implementation
  - Introduced unified top-level card deck display
  - Enhanced panel deck styling
  - Improved note card presentation
  - Optimized course and topic routes

#### [2024-07-10]

- Feature: Markdown Processing
  - Migrated to markdown-it with plugins
  - Added GitHub-style linkable headers
  - Enhanced code block rendering
  - Improved markdown utility functions

#### [2024-07-05]

- Feature: Client-Side Rendering
  - Implemented CSR for improved performance
  - Enhanced wall and talk components
  - Optimized lab rendering
  - Improved markdown processing

#### [2024-07-04]

- Enhancement: Video player width increase (#786)
- UI: Home page link improvements (#785)

#### [2024-07-08]

- Feature: Footer implementation (#787)

### 2024-06

#### [2024-06-30]

- Feature: Markdown Parser Enhancement
  - Improved initialization sequence
  - Enhanced KaTeX integration
  - Optimized parser performance
  - Added type definitions

#### [2024-06-25]

- Feature: Package Updates
  - Updated to latest SvelteKit version
  - Improved package dependencies
  - Enhanced version management
  - Fixed lab navigator filtering

#### [2024-06-20]

- Feature: Course Structure Improvements
  - Added side units to course home page
  - Enhanced units sidebar functionality
  - Improved course root structure
  - Better integration of side content

#### [2024-06-15]

- Fix: File Handling Improvements
  - Added support for key file types
  - Enhanced folder exclusion logic
  - Improved unknown LO type handling
  - Better image extension support

#### [2024-06-23]

- Fix: Analytics time tracking issues (#784, #783)

#### [2024-06-20]

- Fix: PDF version bump (#776)
- Documentation: Configuration update (#778)

#### [2024-06-11]

- Fix: Analytics time tracking improvements (#772, #771, #770)
- Fix: Simulator updates (#768, #767)

#### [2024-06-10]

- Fix: Analytics time improvements (#764, #763)

#### [2024-06-06]

- Fix: Analytics time tracking enhancements (#762, #761, #760)

#### [2024-06-05]

- Fix: Analytics time improvements (#759, #758)

#### [2024-06-04]

- Fix: Analytics time tracking updates (#757)

### 2024-05

#### [2024-05-31]

- Fix: Analytics time tracking improvements (#756, #755, #754, #753)

#### [2024-05-30]

- Development updates (#752)

#### [2024-05-28]

- Fix: Analytics time tracking enhancements (#751)
- Feature: Supabase and ECharts integration (#750)

#### [2024-05-17]

- Refactor: Theme reorganization (#746, #745)

#### [2024-05-15]

- Feature: Home page design update (#744, #743)

#### [2024-05-09]

- Refactor: Metrics system improvements (#741, #740)
- Refactor: Firebase metrics simplification (#739)

#### [2024-05-08]

- Fix: Supabase session handling (#738, #737, #736, #735)

### 2024-04

#### [2024-04-30]

- Feature: Server-Side Rendering Optimization
  - Set course and talk to SSR false by default
  - Improved performance and cost efficiency
  - Enhanced resource management

#### [2024-04-25]

- Feature: Image Support Enhancement

  - Improved image handling in panelnotes
  - Better image rendering and display
  - Enhanced test panel functionality

- Feature: Enhanced analytics system
- UI: Improved chart visualizations
- Fix: Various performance optimizations

### 2024-03

#### [2024-03-31]

- Feature: Learning Object Enhancements
  - Improved side units in walls
  - Enhanced talk functionality
  - Better lab content handling
  - Fixed phantom LOs implementation

#### [2024-03-25]

- Feature: UI/UX Improvements
  - Enhanced experience links organization
  - Improved loading animations
  - Better PDF handling with SSR
  - Enhanced popup store functionality

#### [2024-03-20]

- Feature: Dark Mode and Theme Updates
  - Enhanced dark mode implementation
  - Added additional icon functionality
  - Improved SSR compatibility
  - Updated theme builder

#### [2024-03-15]

- Feature: Skeleton Integration
  - Implemented ProgressRadial component
  - Added inspector functionality
  - Updated to Skeleton v1
  - Enhanced menu system with popups

#### [2024-03-10]

- Feature: Performance Optimizations
  - Enhanced presence system
  - Improved user summaries caching
  - Better subdomain support
  - Updated dependencies

#### [2024-03-05]

- Feature: Package Updates
  - Updated Vite to 4.2.0
  - Enhanced accessibility features
  - Added Holopin integration
  - Improved dark mode support

#### [2024-03-09]

- Feature: Labs as PDFs implementation (#734, #733, #732, #731, #730)

#### [2024-03-06]

- Development improvements (#728)

### 2024-02

#### [2024-02-28]

- Feature: Multi-domain Support
  - Added support for multiple subdomains
  - Enhanced course summary retrieval
  - Improved LO type determination
  - Updated route handling for web and GitHub

#### [2024-02-25]

- Feature: Auth0 Integration
  - Implemented Auth0 custom domain
  - Enhanced authentication flow
  - Improved security features

#### [2024-02-20]

- Feature: Storybook Integration
  - Initial Storybook setup
  - Added PR template and workflow
  - Enhanced build process
  - Updated package dependencies

#### [2024-02-15]

- Feature: Sidebar Enhancements
  - Added side-unit learning object
  - Improved sidebar support
  - Enhanced mobile lab navigation
  - Better unit URL support

#### [2024-02-10]

- Feature: Time Utilities
  - Added Tutors time utilities
  - Enhanced time tracking
  - Improved course catalogue
  - Updated time URL configuration

#### [2024-02-05]

- Feature: UI/UX Improvements
  - Enhanced mobile responsiveness
  - Updated theme builder
  - Improved card layouts
  - Added Valentine's theme

### 2024-01

#### [2024-01-31]

- Fix: Authentication page improvements (#696)
- Documentation: Contribution guidelines (#694)

#### [2024-01-27]

- Feature: Simulator implementation (#664, #663)

#### [2024-01-26]

- Feature: Simulator enhancements (#662, #661, #660, #659, #658)

#### [2024-01-25]

- Feature: Simulator improvements (#657, #656, #655, #654)

#### [2024-01-24]

- Fix: License and README updates (#652)

#### [2024-01-23]

- Fix: Remove anonymous users from active count (#650)

#### [2024-01-22]

- Feature: Edit button implementation (#648)

#### [2024-01-21]

- Fix: Source link improvements (#645)
- Documentation: Code of conduct (#643)
- Fix: README updates (#642)
- Feature: Mono-repo removal (#641)

#### [2024-01-19]

- Fix: Mobile links improvements (#638)
- Fix: Sticky lab navigation (#630)
- Fix: PartyKit initialization (#635)
- Fix: Anonymous environment support (#634)

#### [2024-01-18]

- Fix: Time calendar improvements (#631)
- Fix: Time profile updates (#628)
- Fix: Cypress tests (#624)

#### [2024-01-17]

- Fix: Grid styles (#626)
- Feature: Configuration updates (#625)

#### [2024-01-12]

- Fix: Add Vite plugin Svelte (#623)

#### [2024-01-09]

- Upgrade: Supabase authentication updates (#622)

## 2023

### 2023-12

#### [2023-12-17]

- Upgrade: Package updates (#620)

#### [2023-12-15]

- Fix: Tutors time rework (#617)

#### [2023-12-06]

- Feature: Enrollment support (#615)

### 2023-11

#### [2023-11-14]

- Fix: Remove backticks (#608)

#### [2023-11-08]

- Fix: Hide video in topic (#602)

#### [2023-11-06]

- Fix: Presence styling improvements (#600, #598, #595)
- Fix: Anonymous user avatar (#593)
- Fix: Live links (#591)
- Feature: PartyKit keys implementation (#590)
- Feature: Presence by student (#589)

#### [2023-11-05]

- Fix: Firebase initialization (#588)

#### [2023-11-04]

- Refactor: Presence system (#587, #586)

#### [2023-11-03]

- Feature: Replace live active with PartyKit (#585)
- Feature: Active PartyKit refactor (#584)

#### [2023-11-02]

- Feature: Active PartyKit implementation (#583)

#### [2023-11-01]

- Feature: PartyKit integration (#579)

### 2023-10

#### [2023-10-29]

- Fix: Log login details (#576)

#### [2023-10-26]

- Fix: Talk on course page (#574)

#### [2023-10-19]

- Feature: Mode type support (#568)

#### [2023-10-16]

- Feature: PKT files support (#564)

#### [2023-10-13]

- Refactor: Private support (#563)
- Fix: Generator file types (#562, #561)

#### [2023-10-09]

- Fix: Gallery updates (#557)
- Feature: Gallery implementation (#556)

#### [2023-10-08]

- Fix: Catalogue improvements (#555)

#### [2023-10-06]

- Refactor: Animation system cleanup (#554)

#### [2023-10-05]

- Fix: Undefined removal (#553)
- Fix: Portfolio improvements (#552)

### 2023-09

#### [2023-09-07]

- Feature: Enhanced Search Functionality

  - Implemented search across all labs and notes
  - Improved search result presentation
  - Added type "step" marking for lab steps

- Refactor: Card System Improvements
  - Streamlined card desk configurations
  - Enhanced user interface components
  - Improved performance and responsiveness

#### [2023-09-06]

- Feature: Calendar System Enhancement

  - Re-enabled calendar bar functionality
  - Improved calendar data loading from course model
  - Enhanced calendar integration

- Fix: CI/CD Pipeline
  - Updated Cypress test configurations
  - Improved test reliability and coverage
  - Enhanced build process efficiency

#### [2023-09-05]

- Feature: Union Model Implementation

  - Introduced new union-based type system
  - Improved model compatibility
  - Enhanced type safety across the application

- Fix: Course Navigation
  - Improved auto-numbering for labs
  - Enhanced properties loading from YAML
  - Fixed hash-based routing issues

#### [2023-09-04]

- Refactor: Model Architecture

  - Introduced new union-based model system
  - Improved service interactions
  - Enhanced type safety and maintainability

- Feature: Authentication Improvements
  - Enhanced login redirect handling
  - Improved user session management
  - Updated footer versioning system

#### [2023-09-01]

- Feature: Course Management
  - Added course addition functionality to dashboard
  - Implemented course deletion with confirmation
  - Added course accordion for better organization
  - Improved reactive updates for course list

### 2023-08

#### [2023-08-31]

- Feature: Version 3.1.0 Release
  - Major version bump with significant improvements
  - Enhanced type system implementation
  - Improved overall stability

#### [2023-08-30]

- Feature: Skeleton V2 Migration
  - Implemented new theming system
  - Added dyslexia theme support
  - Enhanced toast notifications
  - Removed legacy authentication systems

#### [2023-08-27]

- Refactor: CLI and Type System
  - Restructured types and decorators into models
  - Simplified creator generator package
  - Improved code organization and maintainability

#### [2023-08-24]

- Feature: Testing Infrastructure
  - Implemented Cypress test framework
  - Added comprehensive test coverage
  - Improved test reliability and maintainability

#### [2023-08-23]

- Feature: Social Integration
  - Added Discord integration to footer
  - Updated README with Discord information
  - Enhanced navigation button functionality

### 2023-07

#### [2023-07-31]

- Feature: Generator Library
  - First draft of tutors-gen-html
  - Implemented tutors-gen-lib functionality
  - Enhanced build tasks and configurations

#### [2023-07-25]

- Feature: Authentication System
  - Implemented Supabase authentication
  - Added dashboard functionality
  - Enhanced user session management
  - Improved navigation and routing

#### [2023-07-20]

- Feature: Code Optimization
  - Enhanced course and LO utilities
  - Improved analytics service efficiency
  - Optimized listener management
  - Enhanced reader-lib models

#### [2023-07-15]

- Feature: TopDeck Implementation
  - Introduced unified top-level card deck display
  - Enhanced panel deck styling
  - Improved note card presentation
  - Optimized course and topic routes

#### [2023-07-10]

- Feature: Markdown Processing
  - Migrated to markdown-it with plugins
  - Added GitHub-style linkable headers
  - Enhanced code block rendering
  - Improved markdown utility functions

#### [2023-07-05]

- Feature: Client-Side Rendering
  - Implemented CSR for improved performance
  - Enhanced wall and talk components
  - Optimized lab rendering
  - Improved markdown processing

### 2023-06

- Feature: Markdown processing improvements
- UI: Enhanced note card support
- Fix: Various UI and navigation fixes

### 2023-05

#### [2023-05-31]

- Feature: HEAnet Support
  - Re-enabled HEAnet integration
  - Enhanced network compatibility
  - Improved institutional access

#### [2023-05-30]

- Development updates (#752)

#### [2023-05-28]

- Fix: Analytics time tracking enhancements (#751)
- Feature: Supabase and ECharts integration (#750)

#### [2023-05-17]

- Refactor: Theme reorganization (#746, #745)

#### [2023-05-15]

- Feature: Home page design update (#744, #743)

#### [2023-05-09]

- Refactor: Metrics system improvements (#741, #740)
- Refactor: Firebase metrics simplification (#739)

#### [2023-05-08]

- Fix: Supabase session handling (#738, #737, #736, #735)

### 2023-04

#### [2023-04-30]

- Feature: Server-Side Rendering Optimization
  - Set course and talk to SSR false by default
  - Improved performance and cost efficiency
  - Enhanced resource management

#### [2023-04-25]

- Feature: Image Support Enhancement

  - Improved image handling in panelnotes
  - Better image rendering and display
  - Enhanced test panel functionality

- Feature: Enhanced analytics system
- UI: Improved chart visualizations
- Fix: Various performance optimizations

### 2023-03

#### [2023-03-18]

- Feature: Skeleton v1 update (#312)

### 2023-02

#### [2023-02-28]

- Dependency: Package updates (#298)

#### [2023-02-23]

- Fix: Generator improvements (#295, #294)
- Feature: Auth0 custom domain (#281)

#### [2023-02-22]

- Feature: Storybook implementation (#286)

#### [2023-02-21]

- Chore: Version bumps (#280)

#### [2023-02-14]

- Feature: Tutors time and skeleton updates (#269, #267)

#### [2023-02-08]

- Development improvements (#264, #263, #262)

#### [2023-02-07]

- Development updates (#261, #259, #258, #257)

#### [2023-02-04]

- Development enhancements (#252)

#### [2023-02-03]

- Feature: Autoplay videos (#248)

#### [2023-02-02]

- Feature: Skeleton 0.99.5 (#243)

### 2023-01

#### [2023-01-31]

- Feature: PWA Implementation
  - Added service worker support
  - Enhanced manifest configuration
  - Improved app installation flow
  - Added maskable icons

#### [2023-01-25]

- Feature: Theme System Updates
  - Enhanced seasonal themes
  - Improved dark mode support
  - Better text readability
  - Updated Halloween and dyslexia themes

#### [2023-01-20]

- Feature: Presence System
  - Enhanced online status tracking
  - Improved timer-based presence updates
  - Better event generation
  - Enhanced user session management

#### [2023-01-15]

- Feature: Lab Enhancements
  - Added copy code button
  - Improved enrollment system
  - Enhanced lab usage tracking
  - Better step navigation

#### [2023-01-10]

- Feature: UI/UX Improvements
  - Enhanced breadcrumb navigation
  - Updated Skeleton to 0.92.2
  - Improved dark mode persistence
  - Enhanced theme builder

#### [2023-01-05]

- Feature: SvelteKit Migration
  - Major update to SvelteKit
  - Enhanced SSR support
  - Improved PDF reader integration
  - Better note card handling

### 2022-12

#### [2022-12-31]

- Feature: End of Year Updates
  - Various bug fixes and improvements
  - Performance optimizations
  - Documentation updates
  - Package dependency updates

### 2022-11

- Feature: Course presence features
- UI: Student card redesign
- Enhancement: Navigation improvements

### 2022-10

- Feature: Search functionality
- UI: Card layout improvements
- Fix: Various bug fixes

### 2022-09

- Feature: Initial presence features
- UI: Course container improvements
- Enhancement: Loading animations

### 2022-08

#### [2022-08-22]

- Feature: Initial monorepo setup (#1)
- Chore: Initial dependency setup
- Feature: Basic course reader implementation

#### [2022-08-18]

- Initial repository setup
- Documentation: Added LICENSE and CODE_OF_CONDUCT.md

#### [2022-06-26]

- Initial commit
- Documentation: Created README.md
