Feature: Presence Tracking
  As a student
  I want to see who else is online in my course
  So that I feel connected to my learning community

  # EARS: Event-driven — "When a student views a learning object, the system shall broadcast presence"
  Scenario: Broadcasting presence when viewing content
    Given a student is sharing their presence
    And the student is viewing a learning object
    When a presence event is sent
    Then the event shall be broadcast to the global room
    And the event shall be broadcast to the course room
    And the event payload shall include the student's identity

  # EARS: Event-driven — "When a WebSocket message arrives, the student map shall be updated"
  Scenario: Receiving a new student presence event
    Given the presence listener is active for course "test-course"
    When a new student event arrives for course "test-course"
    Then the student shall be added to the online list
    And the student shall be indexed in the event map

  # EARS: Event-driven — "When an existing student sends a new event, their record shall be updated"
  Scenario: Updating an existing student's activity
    Given the presence listener is active for course "test-course"
    And student "user1" is already in the online list
    When student "user1" sends a new event with title "New Activity"
    Then the student's record shall be updated with the new title

  # EARS: Unwanted — "If an event arrives for a different course, it shall be ignored"
  Scenario: Ignoring events from other courses
    Given the presence listener is active for course "test-course"
    When an event arrives for course "other-course"
    Then the online list shall not change
