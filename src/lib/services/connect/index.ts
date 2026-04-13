/**
 * Re-exports connect service and types for easier imports
 * @module
 */

export { tutorsConnectService } from "./services/connect.svelte";
export type { TutorsConnectService, TutorsId, ProfileStore, CourseVisit, CourseSentimentId } from "./types";
export { COURSE_SENTIMENT_IDS } from "./types";
