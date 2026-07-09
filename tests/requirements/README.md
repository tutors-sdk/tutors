# EARS Requirements Documentation

This directory contains behavior-driven requirements written using the **EARS (Easy Approach to Requirements Syntax)** framework.

## Purpose

EARS requirements serve as:
- **Living documentation** of system behavior
- **Direct mapping** to automated test cases
- **Shared understanding** between stakeholders, developers, and QA
- **Traceability** from requirement → test → code

## Structure

Each requirement document follows this format:

```markdown
# Feature Name Requirements

## Event-Driven Requirements
**R1**: WHEN <trigger> the Tutors Reader shall <response>

## State-Driven Requirements
**R2**: WHILE <state> the Tutors Reader shall <response>

## Unwanted Behaviors
**R3**: IF <condition> THEN the Tutors Reader shall <response>

## Optional Features
**R4**: WHERE <feature enabled> the Tutors Reader shall <response>
```

## Requirements Index

| Document | Feature Area | Test Coverage | Status |
|----------|-------------|---------------|--------|
| [course-loading.ears.md](./course-loading.ears.md) | Course Loading & Caching | ✅ 16/16 tests | Complete |
| [authentication.ears.md](./authentication.ears.md) | GitHub OAuth & Sessions | 🚧 0/12 tests | Draft |
| [analytics.ears.md](./analytics.ears.md) | Learning Event Tracking | 🚧 0/10 tests | Draft |
| [lab-navigation.ears.md](./lab-navigation.ears.md) | Lab Step Navigation | 🚧 0/15 tests | Draft |
| [presence.ears.md](./presence.ears.md) | Real-time User Presence | 🚧 0/8 tests | Draft |

Legend:
- ✅ Complete - All requirements have passing tests
- 🚧 Draft - Requirements documented but tests not implemented
- 📝 Planned - Feature identified but requirements not written

## Creating New Requirements

1. **Copy the template** from `template.ears.md`
2. **Choose the right EARS pattern** for each requirement:
   - **Event-Driven** (WHEN/THEN) - Most common, ~70% of requirements
   - **State-Driven** (WHILE) - Continuous behavior in a state
   - **Unwanted Behaviors** (IF/THEN) - Error cases and edge conditions
   - **Optional Features** (WHERE) - Feature-flagged or conditional behavior
   - **Ubiquitous** (shall) - Applies everywhere, no conditions

3. **Write requirements before code** (BDD approach)
4. **Review with stakeholders** before implementation
5. **Map tests to requirement IDs** (e.g., `R1`, `R2`, etc.)

## Writing Good Requirements

### ✅ Good Examples

```
WHEN a user clicks the "Next" button the Tutors Reader shall navigate to the next lab step

IF a course fetch returns HTTP 404 THEN the Tutors Reader shall display "Course not found"

WHILE a course is loading the Tutors Reader shall display a spinner with "Loading course..." text
```

### ❌ Bad Examples

```
The system should handle navigation properly
(Too vague - what is "properly"?)

When logging in, authenticate the user
(Missing system name, unclear response)

The app shall work offline
(Too broad - specify which features work offline)
```

## Best Practices

1. **One behavior per requirement** - Avoid "and" statements
2. **Be specific about triggers** - "user clicks Login button" not "when logging in"
3. **State measurable outcomes** - "display error within 3 seconds" not "show error quickly"
4. **Include acceptance criteria** - Concrete values, timings, states
5. **Use consistent language** - Always "the Tutors Reader shall" not "system will" or "should"
6. **Number requirements** - R1, R2, R3... for traceability
7. **Update when behavior changes** - EARS docs are living documentation

## Linking Requirements to Tests

Tests should reference requirement IDs in their describe blocks:

```typescript
// tests/integration/course-service.test.ts

describe('Feature: Course Loading', () => {
  // Implements R1 from course-loading.ears.md
  describe('R1: WHEN a user navigates to /course/{courseId}', () => {
    it('the Tutors Reader shall fetch tutors.json from the course URL', async () => {
      // Test implementation
    });
  });
  
  // Implements R2 from course-loading.ears.md
  describe('R2: WHEN a course is successfully loaded', () => {
    it('the Tutors Reader shall cache it in courseService.courses Map', async () => {
      // Test implementation
    });
  });
});
```

## Reviewing Requirements

Before merging new requirements:
- [ ] Each requirement uses correct EARS template
- [ ] Requirements are specific and testable
- [ ] Requirement IDs are unique within document
- [ ] At least one test exists for each requirement (or issue created)
- [ ] Stakeholder has reviewed and approved

## Stakeholder Sign-off

Requirements in this directory represent **agreed-upon system behavior**. Changes to requirements require:
1. Developer proposal with rationale
2. Stakeholder review
3. Test updates to match new requirements
4. Documentation update in this README

---

**Note**: These requirements drive the automated test suite. Changing a requirement without updating tests will cause test failures.
