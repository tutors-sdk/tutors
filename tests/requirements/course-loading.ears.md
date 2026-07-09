# Course Loading Requirements

**Document ID**: `course-loading.ears.md`  
**Created**: 2024-07-09  
**Last Updated**: 2024-07-09  
**Owner**: Tutors Development Team  
**Status**: Active

## Overview

The Course Loading feature manages fetching, parsing, caching, and decorating course data from remote JSON files. It is the foundation of the Tutors Reader, enabling users to browse course content.

**User Story**:
> As a **student or instructor**  
> I want to **load course content from a URL**  
> So that I can **view and navigate the course materials**

---

## Event-Driven Requirements

### R1: Course URL Determination from Netlify URLs

**R1**: WHEN a user provides a Netlify URL (e.g., `https://test-course.netlify.app`) the Tutors Reader shall extract the courseId by removing `.netlify.app` from the domain

- **Rationale**: Many courses are hosted on Netlify, and we need to identify them uniquely
- **Acceptance Criteria**:
  - [x] Input: `https://test-course.netlify.app` → courseId: `https://test-course`, courseUrl: `https://test-course.netlify.app`
  - [x] Input: `test-course.netlify.app` → courseId: `test-course`, courseUrl: `test-course.netlify.app`
- **Test Status**: ✅ Implemented
- **Test Location**: `src/lib/services/course/services/__tests__/lo-tree.test.ts` (line 13-18)

### R2: Course URL Determination from Custom Domains

**R2**: WHEN a user provides a custom domain URL (e.g., `courses.university.edu`) the Tutors Reader shall use the domain as both courseId and courseUrl

- **Rationale**: Support self-hosted courses on custom domains
- **Acceptance Criteria**:
  - [x] Custom domain preserved as-is
  - [x] No modification to the URL
- **Test Status**: ✅ Implemented
- **Test Location**: `src/lib/services/course/services/__tests__/lo-tree-mutation-killers.test.ts` (line 33-41)

### R3: Course URL Determination from Plain Course IDs

**R3**: WHEN a user provides a plain courseId (e.g., `advanced-web-dev`) the Tutors Reader shall construct a Netlify URL by appending `.netlify.app`

- **Rationale**: Default hosting is Netlify, so plain IDs should assume Netlify URLs
- **Acceptance Criteria**:
  - [x] Input: `advanced-web-dev` → courseId: `advanced-web-dev`, courseUrl: `advanced-web-dev.netlify.app`
  - [x] `.netlify.app` suffix added to courseUrl
- **Test Status**: ✅ Implemented
- **Test Location**: `src/lib/services/course/services/__tests__/lo-tree-mutation-killers.test.ts` (line 44-54)

### R4: Localhost Protocol Handling

**R4**: WHEN a user provides a localhost URL or 192.x.x.x IP address the Tutors Reader shall set the protocol to `http://` instead of `https://`

- **Rationale**: Local development environments typically use HTTP, not HTTPS
- **Acceptance Criteria**:
  - [x] `localhost` → protocol set to `http://`
  - [x] `localhost:3000` → protocol set to `http://`
  - [x] `192.168.1.1` → protocol set to `http://`
  - [x] Other domains remain `https://`
- **Test Status**: ✅ Implemented
- **Test Location**: `src/lib/services/course/services/__tests__/lo-tree-80-percent.test.ts` (line 316-344)

### R5: Course Fetching from URL

**R5**: WHEN a user navigates to `/course/{courseId}` the Tutors Reader shall fetch `tutors.json` from the course URL

- **Rationale**: Course data is stored in a standard JSON format
- **Acceptance Criteria**:
  - [x] Fetch called with URL containing `/tutors.json`
  - [x] HTTP GET request initiated
- **Test Status**: ✅ Implemented
- **Test Location**: `tests/integration/course-service.test.ts` (line 36-50)

### R6: Course Caching After Successful Load

**R6**: WHEN a course is successfully loaded the Tutors Reader shall cache it in `courseService.courses` Map with courseId as the key

- **Rationale**: Avoid redundant network requests for the same course
- **Acceptance Criteria**:
  - [x] Course stored in Map with exact courseId
  - [x] Subsequent requests return cached instance
  - [x] No duplicate fetch calls
- **Test Status**: ✅ Implemented
- **Test Location**: `tests/integration/course-service-mutation-killers.test.ts` (line 32-49)

### R7: Cached Course Retrieval

**R7**: WHEN the same course is requested again the Tutors Reader shall return the cached version without calling fetch

- **Rationale**: Performance optimization and reduced network usage
- **Acceptance Criteria**:
  - [x] Fetch not called on second request
  - [x] Same object reference returned (not a copy)
  - [x] fetch call count remains at 1
- **Test Status**: ✅ Implemented
- **Test Location**: `tests/integration/course-service-mutation-killers.test.ts` (line 82-117)

### R8: Course Property Injection

**R8**: WHEN a course is loaded the Tutors Reader shall inject courseId and courseUrl properties into the course object

- **Rationale**: Course needs to know its own identity for routing and analytics
- **Acceptance Criteria**:
  - [x] `course.courseId` set to provided courseId
  - [x] `course.courseUrl` set to determined URL
  - [x] Properties are non-empty strings
- **Test Status**: ✅ Implemented
- **Test Location**: `tests/integration/course-service-mutation-killers.test.ts` (line 51-78)

---

## State-Driven Requirements

### R9: Loading State Display

**R9**: WHILE a course is being loaded the Tutors Reader shall display a loading indicator

- **Rationale**: Provide visual feedback during network operations
- **Acceptance Criteria**:
  - [ ] Loading spinner visible
  - [ ] "Loading course..." text displayed
  - [ ] Content area blocked from interaction
- **Test Status**: 🚧 Pending (Component test needed)
- **Test Location**: N/A

### R10: Offline Cached Course Access

**R10**: WHILE the user is offline the Tutors Reader shall serve cached course data if available

- **Rationale**: Progressive Web App functionality for offline learning
- **Acceptance Criteria**:
  - [ ] Cached course accessible without network
  - [ ] Offline indicator displayed
  - [ ] Graceful degradation message shown
- **Test Status**: 🚧 Pending (PWA feature not yet implemented)
- **Test Location**: N/A

---

## Unwanted Behaviors

### R11: HTTP Error Handling

**R11**: IF the course fetch returns an HTTP error status (400, 403, 404, 500) THEN the Tutors Reader shall throw an error with the status code and message

- **Rationale**: Users need clear feedback when courses are unavailable
- **Acceptance Criteria**:
  - [x] Error message includes status code
  - [x] Error message follows format: "Fetch failed with status {code}"
  - [x] Promise rejects (not silently fails)
- **Test Status**: ✅ Implemented
- **Test Location**: `tests/integration/course-error-handling.test.ts` (line 14-47)

### R12: JSON Parsing Error Handling

**R12**: IF the course JSON is malformed THEN the Tutors Reader shall propagate the JSON parsing error

- **Rationale**: Distinguish between network errors and data format errors
- **Acceptance Criteria**:
  - [x] Original parse error propagated
  - [x] Error message preserved (e.g., "Invalid JSON")
  - [x] No silent failure
- **Test Status**: ✅ Implemented
- **Test Location**: `tests/integration/course-error-handling.test.ts` (line 49-62)

### R13: Network Error Handling

**R13**: IF the network request fails (timeout, DNS error, connection refused) THEN the Tutors Reader shall propagate the network error unchanged

- **Rationale**: Preserve original error for debugging and user messaging
- **Acceptance Criteria**:
  - [x] Network error propagated as-is
  - [x] Error type preserved (e.g., "Network timeout", "ENOTFOUND")
  - [x] Stack trace maintained
- **Test Status**: ✅ Implemented
- **Test Location**: `tests/integration/course-error-handling.test.ts` (line 64-80)

### R14: Invalid Course ID Handling

**R14**: IF a courseId is empty or null THEN the Tutors Reader shall throw a validation error

- **Rationale**: Prevent invalid requests and provide early failure feedback
- **Acceptance Criteria**:
  - [ ] Empty string rejected
  - [ ] Null/undefined rejected
  - [ ] Clear error message: "Invalid courseId"
- **Test Status**: 🚧 Pending (Input validation not implemented)
- **Test Location**: N/A

---

## URL Placeholder Replacement Requirements

### R15: CourseURL Placeholder in Routes

**R15**: WHEN processing learning object routes the Tutors Reader shall replace `{{COURSEURL}}` placeholder with the courseId

- **Rationale**: Learning objects use template URLs that need course context
- **Acceptance Criteria**:
  - [x] Route: `/topic/{{COURSEURL}}/intro` → `/topic/my-course/intro`
  - [x] All `{{COURSEURL}}` instances replaced
  - [x] No placeholders remain after processing
- **Test Status**: ✅ Implemented
- **Test Location**: `src/lib/services/course/services/__tests__/lo-tree-mutation-killers.test.ts` (line 183-206)

### R16: CourseURL Placeholder in Media Resources

**R16**: WHEN processing learning object media (img, video, pdf) the Tutors Reader shall replace `{{COURSEURL}}` with the courseUrl for media and courseId for video

- **Rationale**: Images and PDFs use full domain, videos use courseId
- **Acceptance Criteria**:
  - [x] `img: "https://{{COURSEURL}}/image.png"` → `img: "https://example.com/image.png"`
  - [x] `video: "https://{{COURSEURL}}/video.mp4"` → `video: "https://my-course/video.mp4"`
  - [x] `pdf: "https://{{COURSEURL}}/slides.pdf"` → `pdf: "https://example.com/slides.pdf"`
- **Test Status**: ✅ Implemented
- **Test Location**: `src/lib/services/course/services/__tests__/lo-tree-mutation-killers.test.ts` (line 183-206)

---

## Archive-Specific Requirements

### R17: Archive File Route Construction

**R17**: WHEN processing an archive-type learning object the Tutors Reader shall construct the route as `https://{courseUrl}/{archiveFile}`

- **Rationale**: Archive downloads need direct file access URLs
- **Acceptance Criteria**:
  - [x] Archive route format: `https://domain.com/file.zip`
  - [x] Uses courseUrl (not courseId)
  - [x] Includes archiveFile property
- **Test Status**: ✅ Implemented
- **Test Location**: `src/lib/services/course/services/__tests__/lo-tree-mutation-killers.test.ts` (line 164-181)

---

## Protocol-Specific Requirements

### R18: HTTP Protocol URL Conversion

**R18**: WHEN courseProtocol is set to `http://` the Tutors Reader shall replace all `https://` URLs in routes, images, videos, and PDFs with `http://`

- **Rationale**: Support HTTP-only development environments
- **Acceptance Criteria**:
  - [x] Route URLs converted: `https://example.com` → `http://example.com`
  - [x] Image URLs converted
  - [x] Video URLs converted
  - [x] PDF URLs converted
  - [x] HTTPS URLs remain unchanged when protocol is `https://`
- **Test Status**: ✅ Implemented
- **Test Location**: `src/lib/services/course/services/__tests__/lo-tree-80-percent.test.ts` (line 157-240)

---

## Type-Specific PDF Processing

### R19: Talk and Paneltalk PDF Processing

**R19**: WHEN processing a learning object of type "talk" or "paneltalk" the Tutors Reader shall replace `{{COURSEURL}}` in the pdf property

- **Rationale**: Talk slides are hosted PDFs that need course context
- **Acceptance Criteria**:
  - [x] Talk PDFs processed
  - [x] Paneltalk PDFs processed
  - [x] Undefined PDFs handled gracefully
- **Test Status**: ✅ Implemented
- **Test Location**: `src/lib/services/course/services/__tests__/lo-tree-mutation-killers.test.ts` (line 76-112)

### R20: Tutorial PDF Conditional Processing

**R20**: WHEN processing a learning object of type "tutorial" the Tutors Reader shall only replace `{{COURSEURL}}` in the pdf property if the pdf property exists

- **Rationale**: Not all tutorials have PDFs, avoid errors on undefined properties
- **Acceptance Criteria**:
  - [x] PDF replaced when defined
  - [x] No error when PDF undefined
  - [x] Uses strict equality check (===)
- **Test Status**: ✅ Implemented
- **Test Location**: `src/lib/services/course/services/__tests__/lo-tree-80-percent.test.ts` (line 455-485)

### R21: Lab PDF Processing

**R21**: WHEN processing a learning object of type "lab" the Tutors Reader shall replace `{{COURSEURL}}` in the pdf property

- **Rationale**: Lab instructions may have downloadable PDF versions
- **Acceptance Criteria**:
  - [x] Lab PDFs processed
  - [x] Undefined PDFs handled gracefully
- **Test Status**: ✅ Implemented
- **Test Location**: `src/lib/services/course/services/__tests__/lo-tree-mutation-killers.test.ts` (line 146-162)

---

## Regex Pattern Matching

### R22: URL Pattern Detection

**R22**: WHEN determining if input is a URL the Tutors Reader shall match against the regex pattern for valid URLs with optional protocol, domain, port, path, query, and fragment

- **Rationale**: Support multiple URL formats (with/without protocol, with ports, with paths)
- **Acceptance Criteria**:
  - [x] Matches: `https://example.com`
  - [x] Matches: `example.com`
  - [x] Matches: `sub.example.com`
  - [x] Matches: `example.com:8080`
  - [x] Matches: `example.com/path/to/course`
  - [x] Does not match: `simple-course` (plain text)
- **Test Status**: ✅ Implemented
- **Test Location**: `src/lib/services/course/services/__tests__/lo-tree-80-percent.test.ts` (line 248-313)

---

## Non-Functional Requirements

### NFR1: Course Load Performance

**NFR1**: The Tutors Reader shall load and display a course within 3 seconds on a standard broadband connection (10 Mbps)

- **Metric**: Time from navigation to first content render
- **Acceptance Criteria**:
  - [ ] Measured via Lighthouse performance audit
  - [ ] 90th percentile < 3 seconds
- **Test Status**: 🚧 Pending (Performance testing not implemented)

### NFR2: Cache Storage Limit

**NFR2**: The Tutors Reader shall store up to 50 courses in the in-memory cache before evicting least recently used courses

- **Metric**: Number of courses in `courseService.courses` Map
- **Acceptance Criteria**:
  - [ ] Cache size monitored
  - [ ] LRU eviction policy implemented
- **Test Status**: 🚧 Pending (LRU cache not implemented)

### NFR3: Minimal Course Structure Validation

**NFR3**: The Tutors Reader shall successfully load and display courses with only required fields (`title`, `los`)

- **Metric**: Course renders with minimal data
- **Acceptance Criteria**:
  - [x] Minimal course accepted
  - [x] No runtime errors with missing optional fields
- **Test Status**: ✅ Implemented
- **Test Location**: `tests/integration/course-error-handling.test.ts` (line 82-101)

---

## Dependencies

**Upstream**:
- `@tutors/tutors-model-lib` - Course data types and utilities
- Fetch API - Network requests
- Svelte runes - Reactive state management

**Downstream**:
- Navigation system - Depends on course routes being decorated
- Analytics - Depends on courseId being set
- Content rendering - Depends on learning objects being processed

**External Services**:
- Netlify hosting (default)
- Custom domain hosting (optional)

---

## Out of Scope

- **GraphQL support**: Course data is JSON-based only
- **Real-time updates**: Course changes require page refresh
- **Course versioning**: No support for multiple course versions
- **Partial course loading**: Entire course JSON must be fetched at once
- **Course search/filtering**: Handled by separate catalogue service

---

## Change History

| Date | Requirement ID | Change | Reason |
|------|---------------|--------|--------|
| 2024-07-09 | R1-R22 | Initial requirements documented | Captured existing tested behavior |
| 2024-07-09 | NFR1-NFR3 | Added non-functional requirements | Performance and quality targets |

---

## Test Coverage Summary

**Total Requirements**: 22 functional + 3 non-functional = 25  
**Tested**: 16 functional requirements = **64% coverage**  
**Pending**: 6 functional + 2 non-functional = 9 requirements

**Mutation Test Score**: 70.63% (lo-tree.ts)

**Next Priorities**:
1. R9 - Loading state component tests
2. R14 - Input validation
3. NFR1 - Performance benchmarking
