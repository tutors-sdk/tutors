Feature: Lab Step Navigation
  As a student working through a lab
  I want to navigate between steps sequentially
  So that I can progress through the material in order

  Background:
    Given a lab with steps "Introduction", "Setup", "Exercise", "Summary"

  # EARS: Event-driven — "When the lab is opened, the system shall display the first step"
  Scenario: Opening a lab displays the first step
    When the lab is first opened
    Then the current chapter shall be "Step01"
    And the step index shall be 0

  # EARS: Event-driven — "When the user requests the next step, the system shall advance"
  Scenario: Navigating to the next step
    Given the current step is "Step02"
    When the user requests the next step
    Then the next step shall be "Step03"

  # EARS: Event-driven — "When the user requests the previous step, the system shall go back"
  Scenario: Navigating to the previous step
    Given the current step is "Step03"
    When the user requests the previous step
    Then the previous step shall be "Step02"

  # EARS: Unwanted — "If the user is on the last step, nextStep shall return empty"
  Scenario: Attempting to go past the last step
    Given the current step is "Step04"
    When the user requests the next step
    Then the next step shall be empty

  # EARS: Unwanted — "If the user is on the first step, prevStep shall return empty"
  Scenario: Attempting to go before the first step
    Given the current step is "Step01"
    When the user requests the previous step
    Then the previous step shall be empty

  # EARS: Event-driven — "When a specific step is selected, the system shall navigate directly"
  Scenario: Setting a specific chapter directly
    When the user navigates to step "Step03"
    Then the current chapter shall be "Step03"
    And the step index shall be 2
    And the navigation HTML shall contain links

  # EARS: Unwanted — "If an invalid step name is provided, the system shall ignore it"
  Scenario: Ignoring navigation to an invalid step
    Given the current step is "Step01"
    When the user navigates to step "nonexistent"
    Then the current chapter shall remain "Step01"
