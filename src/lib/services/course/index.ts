/**
 * Re-exports course service, utilities and types for easier imports
 * @module
 */

export { courseService } from "./services/course.svelte";
export { LiveLab } from "./services/live-lab";

// Utils exports
export { 
  filterByType,
  setShowHide,
  removeLeadingHashes 
} from "./utils/lo-utils";
export { 
  searchHits,
  isValid 
} from "./utils/search";

// Type exports
export type { 
  CourseService,
  LabService 
} from "./types";
export type { 
  ResultType 
} from "./utils/search";
