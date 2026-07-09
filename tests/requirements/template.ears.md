# [Feature Name] Requirements

**Document ID**: `[feature-name].ears.md`  
**Created**: [Date]  
**Last Updated**: [Date]  
**Owner**: [Product Owner Name]  
**Status**: Draft | Active | Deprecated

## Overview

Brief description of the feature and its purpose in the Tutors Reader application.

**User Story**:
> As a [type of user]  
> I want [goal/desire]  
> So that [benefit/value]

---

## Event-Driven Requirements

> WHEN \<trigger> the Tutors Reader shall \<response>
>
> Use for: User actions, system events, external triggers

**R1**: WHEN [trigger event] the Tutors Reader shall [system response]

- **Rationale**: Why this behavior is needed
- **Acceptance Criteria**:
  - [ ] Criterion 1
  - [ ] Criterion 2
- **Test Status**: ✅ Implemented | 🚧 Pending | ❌ Failed
- **Test Location**: `tests/[type]/[file].test.ts` (line XXX)

---

## State-Driven Requirements

> WHILE \<in state> the Tutors Reader shall \<response>
>
> Use for: Continuous behavior that applies while in a specific state

**R2**: WHILE [system is in this state] the Tutors Reader shall [continuous response]

- **Rationale**: Why this behavior is needed
- **Acceptance Criteria**:
  - [ ] Criterion 1
  - [ ] Criterion 2
- **Test Status**: ✅ Implemented | 🚧 Pending | ❌ Failed
- **Test Location**: `tests/[type]/[file].test.ts` (line XXX)

---

## Unwanted Behaviors

> IF \<error condition> THEN the Tutors Reader shall \<error handling>
>
> Use for: Error cases, edge conditions, security violations

**R3**: IF [error condition occurs] THEN the Tutors Reader shall [error response]

- **Rationale**: Why this error handling is needed
- **Acceptance Criteria**:
  - [ ] Criterion 1
  - [ ] Criterion 2
- **Test Status**: ✅ Implemented | 🚧 Pending | ❌ Failed
- **Test Location**: `tests/[type]/[file].test.ts` (line XXX)

---

## Optional Features

> WHERE \<feature enabled> the Tutors Reader shall \<response>
>
> Use for: Feature flags, configuration-dependent behavior

**R4**: WHERE [feature is enabled] the Tutors Reader shall [conditional response]

- **Rationale**: Why this optional behavior exists
- **Acceptance Criteria**:
  - [ ] Criterion 1
  - [ ] Criterion 2
- **Test Status**: ✅ Implemented | 🚧 Pending | ❌ Failed
- **Test Location**: `tests/[type]/[file].test.ts` (line XXX)

---

## Ubiquitous Requirements

> The Tutors Reader shall \<response>
>
> Use for: Behavior that applies everywhere with no conditions

**R5**: The Tutors Reader shall [always do this]

- **Rationale**: Why this is a universal requirement
- **Acceptance Criteria**:
  - [ ] Criterion 1
  - [ ] Criterion 2
- **Test Status**: ✅ Implemented | 🚧 Pending | ❌ Failed
- **Test Location**: `tests/[type]/[file].test.ts` (line XXX)

---

## Non-Functional Requirements

Performance, security, accessibility, and other quality attributes.

**NFR1**: The Tutors Reader shall [performance/security/accessibility requirement]

- **Metric**: How to measure (e.g., "page load time < 3 seconds")
- **Acceptance Criteria**:
  - [ ] Criterion 1
- **Test Status**: ✅ Implemented | 🚧 Pending | ❌ Failed

---

## Dependencies

- **Upstream**: Requirements from other features that must be satisfied first
- **Downstream**: Features that depend on this one
- **External Services**: APIs, databases, third-party integrations

---

## Out of Scope

Explicitly document what this feature does NOT cover to prevent scope creep.

- Not handling X because [reason]
- Not supporting Y because [reason]

---

## Change History

| Date | Requirement ID | Change | Reason |
|------|---------------|--------|--------|
| 2024-01-15 | R3 | Added error case for timeout | Bug #123 |
| 2024-01-10 | R1 | Initial version | Feature kickoff |

---

## Notes

Additional context, technical notes, or design decisions that don't fit elsewhere.
