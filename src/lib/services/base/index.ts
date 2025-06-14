/**
 * Re-exports base types, utilities and constants for easier imports
 * @module
 */

// Supabase client and utilities
export {
  supabase,
  getNumOfLearningRecordsIncrements,
  getCalendarDuration,
  getCalendarCount,
  getDurationTotal,
  insertOrUpdateCalendar,
  handleInteractionData,
  storeStudentCourseLearningObjectInSupabase,
  updateLearningRecordsDuration,
  addOrUpdateStudent,
  formatDate,
  updateCalendarDuration
} from "./utils/supabase-client";
