Feature: User Authentication
  As a student
  I want to authenticate via GitHub
  So that my progress is tracked and I can access protected courses

  # EARS: Complex — "Given user is not authenticated, when visiting protected course, redirect to auth"
  Scenario: Unauthenticated user is redirected from protected course
    Given the user is not authenticated
    And the course has auth level greater than 0
    When the user visits the course
    Then the system shall redirect to "/auth"
    And the course ID shall be stored for post-login redirect

  # EARS: Event-driven — "When share is toggled, the system shall update localStorage and Supabase"
  Scenario: Toggling share preference on
    Given the user is authenticated with share "false"
    When the user toggles share
    Then share shall be set to "true" in localStorage
    And the online status shall be updated

  Scenario: Toggling share preference off
    Given the user is authenticated with share "true"
    When the user toggles share
    Then share shall be set to "false" in localStorage

  # EARS: State-driven — "While in anonymous mode, the system shall skip all auth operations"
  Scenario: Anonymous mode skips authentication
    Given the system is in anonymous mode
    When a course visit is recorded
    Then no analytics shall be tracked
    And no presence events shall be sent

  # EARS: Unwanted — "If a user is not on the whitelist, the system shall redirect to home"
  Scenario: Non-whitelisted user is redirected
    Given the user is authenticated as "outsider"
    And the course has a whitelist containing "insider"
    When the whitelist is checked
    Then the system shall redirect to "/"
