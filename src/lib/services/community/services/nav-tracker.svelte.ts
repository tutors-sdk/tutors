import { browser } from "$app/environment";
import type { EngagementState } from "../types.svelte";
import { insertNavEvent } from "../utils/supabase-client";

const SESSION_GAP_MS = 20 * 60 * 1000;
const SESSION_HARD_CUT_MS = 4 * 60 * 60 * 1000;
const MAX_DURATION_MS = SESSION_GAP_MS;

function loadSessionState(): { sessionId: string; sessionStartTs: number } | null {
  if (!browser) return null;
  try {
    const raw = sessionStorage.getItem("tutors-nav-session");
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return null;
}

function saveSessionState(sessionId: string, sessionStartTs: number): void {
  if (!browser) return;
  try {
    sessionStorage.setItem("tutors-nav-session", JSON.stringify({ sessionId, sessionStartTs }));
  } catch {
    /* ignore */
  }
}

export const navTrackerService = {
  sessionId: "",
  sessionStartTs: 0,
  lastNavTs: 0,
  lastLoId: "",
  lastNavEventTs: 0,

  init() {
    if (!browser) return;
    const stored = loadSessionState();
    if (stored) {
      this.sessionId = stored.sessionId;
      this.sessionStartTs = stored.sessionStartTs;
    } else {
      this.newSession();
    }
    this.lastNavTs = Date.now();
    this.lastNavEventTs = Date.now();
  },

  newSession() {
    this.sessionId = crypto.randomUUID();
    this.sessionStartTs = Date.now();
    this.lastLoId = "";
    saveSessionState(this.sessionId, this.sessionStartTs);
  },

  logNavEvent(courseId: string, loId: string, loType: string, engagement: EngagementState, studentId: string) {
    if (!browser || !courseId || !loId || !studentId) return;

    const now = Date.now();

    if (!this.sessionId) {
      this.newSession();
    }

    const gap = now - this.lastNavTs;
    const sessionAge = now - this.sessionStartTs;
    if (gap > SESSION_GAP_MS || sessionAge > SESSION_HARD_CUT_MS) {
      this.newSession();
    }

    let durationMs: number | null = null;
    if (this.lastLoId && this.lastNavEventTs) {
      durationMs = Math.min(now - this.lastNavEventTs, MAX_DURATION_MS);
    }

    const referrerLo = this.lastLoId || null;

    void insertNavEvent({
      student_id: studentId,
      course_id: courseId,
      lo_id: loId,
      lo_type: loType,
      session_id: this.sessionId,
      duration_ms: durationMs,
      referrer_lo: referrerLo,
      engagement
    });

    this.lastLoId = loId;
    this.lastNavTs = now;
    this.lastNavEventTs = now;
  },

  getSessionId(): string {
    return this.sessionId;
  }
};
