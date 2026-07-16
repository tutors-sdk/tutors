Feature: Course Loading and Caching
  As a student
  I want courses to load reliably and be cached
  So that navigation is fast after first load

  Background:
    Given the system is initialized

  # EARS: Event-driven — "When the user navigates to a course, the system shall fetch and cache it"
  Scenario: Loading a course by plain ID resolves to Netlify
    When the user navigates to course "test-course-2025"
    Then the system shall resolve the course URL to "test-course-2025.netlify.app"
    And the resolved course ID shall be "test-course-2025"

  # EARS: Event-driven — "When a full URL is provided, the system shall extract the course ID"
  Scenario: Loading a course by full Netlify URL
    When the user navigates to course "https://test-course-2025.netlify.app"
    Then the resolved course ID shall be "https://test-course-2025"
    And the resolved course URL shall be "https://test-course-2025.netlify.app"

  # EARS: State-driven — "While a course is cached, the system shall return it without fetching"
  Scenario: Returning to a cached course avoids redundant fetch
    Given course "test-course" has been loaded and cached
    When the user navigates to course "test-course" again
    Then the system shall return the cached course
    And no additional HTTP request shall be made

  # EARS: Unwanted — "If the course endpoint fails, the system shall report the error"
  Scenario: Handling a course fetch failure
    Given the course endpoint returns HTTP 404
    When the user attempts to load course "nonexistent-course"
    Then the system shall throw an error
    And the course shall not be cached

  # EARS: Option — "Where different input formats are provided, the system shall resolve appropriately"
  Scenario Outline: URL resolution for different input formats
    When the user navigates to course "<input>"
    Then the resolved course ID shall be "<expectedId>"
    And the resolved course URL shall be "<expectedUrl>"

    Examples:
      | input                           | expectedId                      | expectedUrl                     |
      | my-course                       | my-course                       | my-course.netlify.app           |
      | https://custom.example.com      | https://custom.example.com      | https://custom.example.com      |
      | localhost:3000                   | localhost:3000                  | localhost:3000                  |
      | 192.168.1.5:3000                | 192.168.1.5:3000                | 192.168.1.5:3000                |
