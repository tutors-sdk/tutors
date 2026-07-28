import { browser } from "$app/environment";
import { rune } from "$lib/runes.svelte";
import type { EngagementState } from "../types.svelte";

const IDLE_THRESHOLD_MS = 5 * 60 * 1000;
const AWAY_THRESHOLD_MS = 15 * 60 * 1000;
const TAB_HIDDEN_AWAY_MS = 2 * 60 * 1000;
const THROTTLE_MS = 3000;
const EVAL_INTERVAL_MS = 10_000;

function throttle(fn: () => void, ms: number): () => void {
  let last = 0;
  return () => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn();
    }
  };
}

export const activityMonitorService = {
  engagementState: rune<EngagementState>("active"),
  lastActivityTs: 0,
  tabHiddenSinceTs: 0,
  isTabVisible: true,
  evalIntervalId: null as ReturnType<typeof setInterval> | null,
  throttledRecordActivity: null as (() => void) | null,
  boundOnVisibilityChange: null as (() => void) | null,
  boundOnFocus: null as (() => void) | null,
  boundOnBlur: null as (() => void) | null,

  start() {
    if (!browser) return;

    this.lastActivityTs = Date.now();
    this.tabHiddenSinceTs = 0;
    this.isTabVisible = !document.hidden;
    this.engagementState.value = "active";

    this.throttledRecordActivity = throttle(() => {
      this.lastActivityTs = Date.now();
      if (this.engagementState.value !== "active") {
        this.engagementState.value = "active";
      }
    }, THROTTLE_MS);

    const activityEvents = ["mousemove", "scroll", "keydown", "click", "touchstart"];
    for (const event of activityEvents) {
      document.addEventListener(event, this.throttledRecordActivity, { passive: true });
    }

    this.boundOnVisibilityChange = () => this.onVisibilityChange();
    this.boundOnFocus = () => this.onWindowFocus();
    this.boundOnBlur = () => this.onWindowBlur();

    document.addEventListener("visibilitychange", this.boundOnVisibilityChange);
    window.addEventListener("focus", this.boundOnFocus);
    window.addEventListener("blur", this.boundOnBlur);

    this.evalIntervalId = setInterval(() => this.evaluateState(), EVAL_INTERVAL_MS);
  },

  stop() {
    if (!browser) return;

    if (this.throttledRecordActivity) {
      const activityEvents = ["mousemove", "scroll", "keydown", "click", "touchstart"];
      for (const event of activityEvents) {
        document.removeEventListener(event, this.throttledRecordActivity);
      }
    }
    if (this.boundOnVisibilityChange) {
      document.removeEventListener("visibilitychange", this.boundOnVisibilityChange);
    }
    if (this.boundOnFocus) {
      window.removeEventListener("focus", this.boundOnFocus);
    }
    if (this.boundOnBlur) {
      window.removeEventListener("blur", this.boundOnBlur);
    }
    if (this.evalIntervalId) {
      clearInterval(this.evalIntervalId);
      this.evalIntervalId = null;
    }
  },

  onVisibilityChange() {
    if (document.hidden) {
      this.isTabVisible = false;
      this.tabHiddenSinceTs = Date.now();
    } else {
      this.isTabVisible = true;
      this.tabHiddenSinceTs = 0;
      this.lastActivityTs = Date.now();
    }
    this.evaluateState();
  },

  onWindowFocus() {
    this.isTabVisible = true;
    this.tabHiddenSinceTs = 0;
    this.lastActivityTs = Date.now();
    this.evaluateState();
  },

  onWindowBlur() {
    if (!this.tabHiddenSinceTs) {
      this.tabHiddenSinceTs = Date.now();
    }
  },

  evaluateState() {
    const now = Date.now();
    const elapsed = now - this.lastActivityTs;
    const tabHiddenDuration = this.isTabVisible ? 0 : now - (this.tabHiddenSinceTs || now);

    let state: EngagementState;
    if (tabHiddenDuration >= TAB_HIDDEN_AWAY_MS) {
      state = "away";
    } else if (elapsed >= AWAY_THRESHOLD_MS) {
      state = "away";
    } else if (elapsed >= IDLE_THRESHOLD_MS) {
      state = "idle";
    } else {
      state = "active";
    }

    if (this.engagementState.value !== state) {
      this.engagementState.value = state;
    }
  },

  getState(): EngagementState {
    return this.engagementState.value;
  }
};
