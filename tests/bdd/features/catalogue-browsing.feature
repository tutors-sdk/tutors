Feature: Catalogue Browsing
  As a prospective student
  I want to browse available courses
  So that I can find relevant learning material

  # EARS: Event-driven — "When the catalogue is requested, the system shall fetch courses from Supabase"
  Scenario: Fetching the course catalogue
    Given the catalogue service is available
    When the catalogue is requested
    Then courses shall be returned from the database
    And each entry shall have a course_id and visit_count

  # EARS: Event-driven — "When the catalogue count is requested, return the total"
  Scenario: Getting the catalogue count
    Given the catalogue service is available
    When the catalogue count is requested
    Then a numeric count shall be returned

  # EARS: Event-driven — "When the student count is requested, return the total"
  Scenario: Getting the student count
    Given the catalogue service is available
    When the student count is requested
    Then a numeric count shall be returned

  # EARS: Unwanted — "If the database query fails, return an empty result"
  Scenario: Handling database errors gracefully
    Given the catalogue database query fails
    When the catalogue is requested
    Then an empty list shall be returned
