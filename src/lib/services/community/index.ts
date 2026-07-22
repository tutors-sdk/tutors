/**
 * Re-exports community services and types for easier imports
 * @module
 */

// Service exports
export { catalogueService } from "./services/catalogue";
export { liveService } from "./services/live.svelte";
export { presenceService } from "./services/presence.svelte";
export { analyticsService } from "./services/analytics.svelte";
export { activityMonitorService } from "./services/activity-monitor.svelte";
export { navTrackerService } from "./services/nav-tracker.svelte";
export { dashboardAggregatorService } from "./services/dashboard-aggregator.svelte";
export { startMockSimulation, stopMockSimulation } from "./services/dashboard-mock";

// Type exports
export type { LoUser, LoEvent, CatalogueService, CatalogueEntry, EngagementState } from "./types.svelte";
export type { DashboardAlert, StudentDashboardState, ClassHealthMetrics, AlertSeverity, NavEventRow } from "./types.svelte";
export { LoRecord } from "./types.svelte";
export { supabase } from "./utils/supabase-client";
