Feature: Analytics Tracking
  As an instructor
  I want student interactions to be recorded
  So that I can monitor engagement and provide support

  # EARS: Event-driven — "When a learning event occurs, the system shall record it"
  Scenario: Recording a learning event
    Given a student is viewing a learning object
    When a learning event is triggered
    Then the event shall be recorded in the analytics service
    And the presence service shall broadcast the event if sharing is enabled

  # EARS: State-driven — "While the page is visible, the timer shall update duration every 30 seconds"
  Scenario: Timer updates page duration
    Given the analytics timer is running
    When 30 seconds elapse with the page visible
    Then the page count shall be updated

  # EARS: Unwanted — "If analytics is disabled, learning events shall be silently skipped"
  Scenario: Learning events skipped when analytics disabled
    Given analytics is disabled
    When a learning event is triggered
    Then no analytics call shall be made

  # EARS: Event-driven — "When a course is visited, the visit shall be logged"
  Scenario: Logging a course visit
    Given a student is authenticated
    When the student visits a course
    Then the course visit shall be recorded in the profile
    And the presence listener shall start for that course
