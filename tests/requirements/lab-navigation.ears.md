# Lab Navigation Requirements

**Document ID**: `lab-navigation.ears.md`  
**Created**: 2024-07-09  
**Last Updated**: 2024-07-09  
**Owner**: Tutors Development Team  
**Status**: Draft

## Overview

The Lab Navigation feature enables users to progress through multi-step lab exercises with next/previous controls, progress tracking, and time monitoring.

**User Story**:

> As a **student**  
> I want to **navigate through lab steps sequentially**  
> So that I can **complete exercises at my own pace and track my progress**

---

## Event-Driven Requirements

### R1: Next Step Navigation

**R1**: WHEN a user clicks the "Next" button the Tutors Reader shall navigate to the next lab step and increment currentStepIndex

- **Rationale**: Linear progression through learning material
- **Acceptance Criteria**:
  - [ ] currentStepIndex incremented by 1
  - [ ] Next step content rendered
  - [ ] URL updated with new step number
  - [ ] Progress bar updated
- **Test Status**: 🚧 Pending
- **Test Location**: N/A

### R2: Previous Step Navigation

**R2**: WHEN a user clicks the "Previous" button the Tutors Reader shall navigate to the previous lab step and decrement currentStepIndex

- **Rationale**: Allow review of prior steps
- **Acceptance Criteria**:
  - [ ] currentStepIndex decremented by 1
  - [ ] Previous step content rendered
  - [ ] URL updated with new step number
- **Test Status**: 🚧 Pending
- **Test Location**: N/A

### R3: Direct Step Navigation

**R3**: WHEN a user clicks a step in the navigation sidebar the Tutors Reader shall jump directly to that step

- **Rationale**: Quick access to any step without sequential clicking
- **Acceptance Criteria**:
  - [ ] currentStepIndex set to clicked step
  - [ ] Target step content rendered
  - [ ] URL updated correctly
- **Test Status**: 🚧 Pending
- **Test Location**: N/A

### R4: Lab Timer Start

**R4**: WHEN a user navigates to the first lab step the Tutors Reader shall start a timer to track time spent

- **Rationale**: Analytics on student engagement and difficulty
- **Acceptance Criteria**:
  - [ ] Timer starts on step 0
  - [ ] Start time recorded
  - [ ] Timer not started on subsequent revisits
- **Test Status**: 🚧 Pending
- **Test Location**: N/A

### R5: Lab Completion

**R5**: WHEN a user completes the last lab step the Tutors Reader shall record completion time and display completion status

- **Rationale**: Track completion for progress monitoring
- **Acceptance Criteria**:
  - [ ] Completion time calculated
  - [ ] Completion event sent to analytics
  - [ ] Completion badge displayed
- **Test Status**: 🚧 Pending
- **Test Location**: N/A

### R6: Progress Persistence

**R6**: WHEN a user returns to a lab they previously started the Tutors Reader shall restore their last visited step

- **Rationale**: Resume progress without losing place
- **Acceptance Criteria**:
  - [ ] Last step index stored in localStorage
  - [ ] Restored on lab reload
  - [ ] Completion status preserved
- **Test Status**: 🚧 Pending
- **Test Location**: N/A

---

## State-Driven Requirements

### R7: First Step State

**R7**: WHILE on the first lab step the Tutors Reader shall disable the "Previous" button

- **Rationale**: Cannot navigate before first step
- **Acceptance Criteria**:
  - [ ] Previous button disabled (aria-disabled="true")
  - [ ] Visual styling indicates disabled state
  - [ ] Clicking has no effect
- **Test Status**: 🚧 Pending
- **Test Location**: N/A

### R8: Last Step State

**R8**: WHILE on the last lab step the Tutors Reader shall disable the "Next" button and display "Finish" button

- **Rationale**: Distinguish completion from continuing
- **Acceptance Criteria**:
  - [ ] Next button hidden or disabled
  - [ ] Finish button shown
  - [ ] Clicking Finish records completion
- **Test Status**: 🚧 Pending
- **Test Location**: N/A

### R9: Progress Indicator

**R9**: WHILE navigating through a lab the Tutors Reader shall display progress as "Step X of Y" and update the progress bar

- **Rationale**: User awareness of position in lab
- **Acceptance Criteria**:
  - [ ] Step counter shows "3 of 10"
  - [ ] Progress bar fills proportionally
  - [ ] Percentage displayed
- **Test Status**: 🚧 Pending
- **Test Location**: N/A

### R10: Active Step Highlighting

**R10**: WHILE viewing a lab step the Tutors Reader shall highlight the current step in the sidebar navigation

- **Rationale**: Visual indication of current location
- **Acceptance Criteria**:
  - [ ] Current step has distinct styling
  - [ ] Previous steps marked as completed
  - [ ] Future steps marked as not started
- **Test Status**: 🚧 Pending
- **Test Location**: N/A

---

## Unwanted Behaviors

### R11: Invalid Step Navigation

**R11**: IF a user attempts to navigate to a step index outside the valid range THEN the Tutors Reader shall remain on the current step and log a warning

- **Rationale**: Prevent undefined behavior from invalid indices
- **Acceptance Criteria**:
  - [ ] Index < 0 rejected
  - [ ] Index >= totalSteps rejected
  - [ ] Warning logged to console
  - [ ] UI state unchanged
- **Test Status**: 🚧 Pending
- **Test Location**: N/A

### R12: Missing Lab Steps

**R12**: IF a lab has no steps (empty array) THEN the Tutors Reader shall display an error message "This lab has no content"

- **Rationale**: Handle malformed lab data gracefully
- **Acceptance Criteria**:
  - [ ] Error message displayed
  - [ ] No navigation controls shown
  - [ ] No crash or infinite loop
- **Test Status**: 🚧 Pending
- **Test Location**: N/A

---

## Optional Features

### R13: Keyboard Navigation

**R13**: WHERE keyboard navigation is enabled the Tutors Reader shall support arrow keys for next/previous navigation

- **Rationale**: Accessibility and power user efficiency
- **Acceptance Criteria**:
  - [ ] Right arrow → next step
  - [ ] Left arrow → previous step
  - [ ] Keyboard shortcuts documented
- **Test Status**: 🚧 Pending
- **Test Location**: N/A

### R14: Autoplay Mode

**R14**: WHERE autoplay is enabled the Tutors Reader shall automatically advance to the next step after a configurable delay

- **Rationale**: Presentation or demo mode
- **Acceptance Criteria**:
  - [ ] Delay configurable (default 5 seconds)
  - [ ] Pause/resume controls visible
  - [ ] Disabled on last step
- **Test Status**: 🚧 Pending
- **Test Location**: N/A

### R15: Markdown Content Rendering

**R15**: WHERE a lab step contains markdown content the Tutors Reader shall render it with syntax highlighting for code blocks

- **Rationale**: Rich formatting for instructional content
- **Acceptance Criteria**:
  - [ ] Markdown parsed to HTML
  - [ ] Code blocks syntax highlighted
  - [ ] Images and links functional
- **Test Status**: 🚧 Pending
- **Test Location**: N/A

---

## Non-Functional Requirements

### NFR1: Step Navigation Performance

**NFR1**: The Tutors Reader shall render the next lab step within 100ms of clicking Next

- **Metric**: Time from click to content visible
- **Acceptance Criteria**:
  - [ ] 95th percentile < 100ms
  - [ ] No flash of unstyled content
- **Test Status**: 🚧 Pending

### NFR2: Timer Accuracy

**NFR2**: The Tutors Reader shall track lab time with accuracy within ±1 second over a 1-hour session

- **Metric**: Comparison of recorded time vs actual elapsed time
- **Acceptance Criteria**:
  - [ ] Drift < 1 second per hour
  - [ ] Survives tab backgrounding
- **Test Status**: 🚧 Pending

---

## Dependencies

**Upstream**:

- Course loading (lab data structure)
- Markdown rendering service
- Analytics service (for time tracking)

**Downstream**:

- Progress tracking across courses
- Student analytics dashboard
- Completion certificates

**External Services**:

- None (all client-side)

---

## Out of Scope

- **Branching labs**: Only linear step progression supported
- **Collaborative labs**: Multi-user real-time editing not supported
- **Lab submission**: No grading or instructor feedback system
- **Inline exercises**: No interactive code execution

---

## Change History

| Date       | Requirement ID | Change        | Reason           |
| ---------- | -------------- | ------------- | ---------------- |
| 2024-07-09 | R1-R15         | Initial draft | Feature planning |

---

## Test Coverage Summary

**Total Requirements**: 15 functional + 2 non-functional = 17  
**Tested**: 0 requirements = **0% coverage**  
**Status**: Draft - implementation pending

**Next Steps**:

1. Implement LiveLab class with step navigation
2. Write component tests for Lab.svelte
3. Add E2E test for complete lab journey
