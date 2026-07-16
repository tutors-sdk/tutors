Feature: Theme Switching
  As a user
  I want to switch between visual themes
  So that I can customize my learning environment

  # EARS: Event-driven — "When a theme is set, the system shall persist it and update the DOM"
  Scenario: Setting a theme persists to localStorage
    When the user sets the theme to "classic"
    Then localStorage shall contain theme "classic"
    And the document data-theme attribute shall be "classic"

  # EARS: Event-driven — "When dark mode is enabled, the system shall add the dark CSS class"
  Scenario: Enabling dark mode
    When the user sets display mode to "dark"
    Then the document shall have the "dark" CSS class
    And localStorage modeCurrent shall be "dark"

  # EARS: Event-driven — "When display mode is toggled, the system shall switch between light and dark"
  Scenario: Toggling display mode from light to dark
    Given the display mode is "light"
    When the user toggles the display mode
    Then the display mode shall be "dark"

  Scenario: Toggling display mode from dark to light
    Given the display mode is "dark"
    When the user toggles the display mode
    Then the display mode shall be "light"

  # EARS: Event-driven — "When layout is toggled, the system shall switch between expanded and compacted"
  Scenario: Toggling layout
    Given the layout is "expanded"
    When the user toggles the layout
    Then the layout shall be "compacted"

  # EARS: Ubiquitous — "The system shall default to the tutors theme when no theme is set"
  Scenario: Default theme when none specified
    When the user sets the theme to ""
    Then the current theme shall be "tutors"

  # EARS: Event-driven — "When an icon is requested, the system shall return it from the current theme"
  Scenario: Retrieving an icon from the current theme
    Given the current theme is "tutors"
    When the user requests the icon for type "tutors"
    Then an icon shall be returned with a type and color
