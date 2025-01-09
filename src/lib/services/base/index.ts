/**
 * Re-exports base types, utilities and constants for easier imports
 * @module
 */

// Type exports from lo-types
export type { 
  Lo,
  Course,
  Topic,
  Lab,
  LabStep,
  Talk,
  Note,
  Web,
  Github,
  Archive,
  PanelNote,
  PanelTalk,
  PanelVideo,
  Panels,
  Units,
  Composite,
  Unit,
  Side,
  Calendar,
  WeekType,
  VideoIdentifier,
  VideoIdentifiers,
  LearningResource,
  Properties,
  IconType,
  LearningRecord,
  LoType
} from "./lo-types";

// Utility functions from lo-types
export { 
  imageTypes,
  assetTypes,
  isCompositeLo 
} from "./lo-types";

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
