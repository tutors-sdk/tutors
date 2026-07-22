import PartySocket from "partysocket";
import { PUBLIC_party_kit_main_room } from "$env/static/public";
import { rune } from "$lib/runes.svelte";
import {
  LoRecord,
  type ClassHealthMetrics,
  type DashboardAlert,
  type EngagementState,
  type StudentDashboardState
} from "../types.svelte";
import { refreshLoRecord } from "./presence.svelte";

const partyKitServer = PUBLIC_party_kit_main_room;

const STALE_THRESHOLD_MS = 5 * 60 * 1000;
const STUCK_MULTIPLIER = 2;
const THRASH_WINDOW_MS = 5 * 60 * 1000;
const THRASH_MIN_COUNT = 3;
const MAX_NAV_HISTORY = 20;
const MAX_ACTIVE_ALERTS = 5;
const ALERT_COOLDOWN_MS = 2 * 60 * 1000;
const EVAL_INTERVAL_MS = 30_000;
const IDLE_ALERT_MS = 5 * 60 * 1000;

function getMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function getMAD(values: number[], median: number): number {
  if (values.length === 0) return 0;
  const deviations = values.map((v) => Math.abs(v - median));
  return getMedian(deviations);
}

function modifiedZScore(values: number[], x: number): number {
  const median = getMedian(values);
  const mad = getMAD(values, median);
  if (mad === 0) return 0;
  return (0.6745 * (x - median)) / mad;
}

function generateAlertId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export const dashboardAggregatorService = {
  studentStates: rune<Map<string, StudentDashboardState>>(new Map()),
  studentsOnline: rune<LoRecord[]>([]),
  alerts: rune<DashboardAlert[]>([]),
  classHealth: rune<ClassHealthMetrics>({
    totalStudents: 0,
    activeCount: 0,
    idleCount: 0,
    awayCount: 0,
    disconnectedCount: 0,
    activePercent: 100,
    healthLevel: "green"
  }),
  isListening: rune<boolean>(false),

  partyKitCourse: <PartySocket>{},
  studentEventMap: new Map<string, LoRecord>(),
  evalIntervalId: null as ReturnType<typeof setInterval> | null,
  alertCooldowns: new Map<string, number>(),

  startListening(courseId: string) {
    this.stopListening();

    if (PUBLIC_party_kit_main_room === "XXX") return;

    this.partyKitCourse = new PartySocket({
      host: partyKitServer,
      room: courseId
    });
    this.partyKitCourse.addEventListener("message", this.onMessage.bind(this));
    this.isListening.value = true;

    this.evalIntervalId = setInterval(() => {
      this.updateTimers();
      this.evaluateAlerts();
      this.computeClassHealth();
    }, EVAL_INTERVAL_MS);
  },

  startMockListening() {
    this.stopListening();
    this.isListening.value = true;
    this.evalIntervalId = setInterval(() => {
      this.updateTimers();
      this.evaluateAlerts();
      this.computeClassHealth();
    }, EVAL_INTERVAL_MS);
  },

  injectMessage(data: any) {
    this.onMessage({ data: JSON.stringify(data) } as MessageEvent);
  },

  stopListening() {
    if (this.partyKitCourse?.close) {
      this.partyKitCourse.close();
    }
    if (this.evalIntervalId) {
      clearInterval(this.evalIntervalId);
      this.evalIntervalId = null;
    }
    this.studentStates.value = new Map();
    this.studentsOnline.value = [];
    this.studentEventMap.clear();
    this.alerts.value = [];
    this.alertCooldowns.clear();
    this.isListening.value = false;
  },

  onMessage(event: MessageEvent) {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch {
      return;
    }

    if (!data.user?.id || data.user.fullName === "Anon") return;

    const existingLo = this.studentEventMap.get(data.user.id);
    if (!existingLo) {
      const lo = new LoRecord(data);
      this.studentsOnline.value = [...this.studentsOnline.value, lo];
      this.studentEventMap.set(data.user.id, lo);
    } else {
      refreshLoRecord(existingLo, data);
      existingLo.engagement = data.engagement;
      existingLo.heartbeatTs = data.heartbeatTs;
    }

    this.updateStudentState(data);
    this.evaluateAlerts();
    this.computeClassHealth();
  },

  updateStudentState(record: any) {
    const userId = record.user?.id;
    if (!userId) return;

    const now = Date.now();
    const states = new Map(this.studentStates.value);
    const existing = states.get(userId);

    const loChanged = existing ? existing.currentLoId !== record.loRoute : true;

    const state: StudentDashboardState = {
      userId,
      fullName: record.user.fullName ?? userId,
      avatar: record.user.avatar ?? "",
      currentLoId: record.loRoute ?? "",
      currentLoTitle: record.title ?? "",
      currentLoType: record.type ?? "",
      engagement: record.engagement ?? record.user.engagement ?? "active",
      timeOnCurrentLoMs: loChanged ? 0 : (existing?.timeOnCurrentLoMs ?? 0),
      currentLoStartTs: loChanged ? now : (existing?.currentLoStartTs ?? now),
      lastEventTs: now,
      navHistory: existing?.navHistory ?? [],
      thrashCount: existing?.thrashCount ?? 0,
      sentiment: record.user.sentiment ?? "neutral"
    };

    if (loChanged && record.loRoute) {
      state.navHistory = [
        ...state.navHistory.slice(-(MAX_NAV_HISTORY - 1)),
        { loId: record.loRoute, ts: now, engagement: state.engagement }
      ];
      state.thrashCount = this.countThrashing(state.navHistory);
    }

    states.set(userId, state);
    this.studentStates.value = states;
  },

  updateTimers() {
    const now = Date.now();
    const states = new Map(this.studentStates.value);
    let changed = false;

    for (const [, state] of states) {
      const newTime = now - state.currentLoStartTs;
      if (newTime !== state.timeOnCurrentLoMs) {
        state.timeOnCurrentLoMs = newTime;
        changed = true;
      }
    }

    if (changed) {
      this.studentStates.value = states;
    }
  },

  countThrashing(history: Array<{ loId: string; ts: number }>): number {
    if (history.length < 3) return 0;
    const now = Date.now();
    const recent = history.filter((h) => now - h.ts < THRASH_WINDOW_MS);
    let count = 0;
    for (let i = 2; i < recent.length; i++) {
      if (recent[i].loId === recent[i - 2].loId && recent[i].loId !== recent[i - 1].loId) {
        count++;
      }
    }
    return count;
  },

  evaluateAlerts() {
    const states = this.studentStates.value;
    const now = Date.now();
    const newAlerts: DashboardAlert[] = [];

    const timesOnLo = Array.from(states.values())
      .filter((s) => now - s.lastEventTs < STALE_THRESHOLD_MS)
      .map((s) => s.timeOnCurrentLoMs);
    const medianTime = getMedian(timesOnLo);

    const loStuckCounts = new Map<string, number>();

    for (const [, state] of states) {
      if (now - state.lastEventTs > STALE_THRESHOLD_MS) continue;

      const isIdle = state.engagement === "idle" || state.engagement === "away";
      const idleDuration = isIdle ? now - state.lastEventTs : 0;
      const isOverMedian = medianTime > 0 && state.timeOnCurrentLoMs > medianTime * STUCK_MULTIPLIER;
      const isThrashing = state.thrashCount >= THRASH_MIN_COUNT;
      const zScore = timesOnLo.length >= 3 ? modifiedZScore(timesOnLo, state.timeOnCurrentLoMs) : 0;
      const isOutlier = zScore > 3.5;

      if (isIdle && idleDuration > IDLE_ALERT_MS && isOverMedian) {
        this.addAlert(newAlerts, state, "red", "stuck-idle", `${state.fullName} may be stuck and idle on "${state.currentLoTitle}"`);
        loStuckCounts.set(state.currentLoId, (loStuckCounts.get(state.currentLoId) ?? 0) + 1);
      } else if (isThrashing) {
        this.addAlert(newAlerts, state, "amber", "thrashing", `${state.fullName} is navigating back and forth`);
      } else if (isOverMedian && (isIdle || isOutlier)) {
        this.addAlert(newAlerts, state, "amber", "stuck", `${state.fullName} may be stuck on "${state.currentLoTitle}"`);
        loStuckCounts.set(state.currentLoId, (loStuckCounts.get(state.currentLoId) ?? 0) + 1);
      } else if (isIdle && idleDuration > IDLE_ALERT_MS) {
        this.addAlert(newAlerts, state, "amber", "idle", `${state.fullName} has been idle for ${Math.round(idleDuration / 60000)} min`);
      }
    }

    for (const [loId, count] of loStuckCounts) {
      if (count >= 3) {
        const loTitle = Array.from(states.values()).find((s) => s.currentLoId === loId)?.currentLoTitle ?? loId;
        newAlerts.unshift({
          id: generateAlertId(),
          studentId: "",
          studentName: "",
          studentAvatar: "",
          severity: "red",
          rule: "cohort-stuck",
          message: `${count} students may be stuck on "${loTitle}"`,
          timestamp: now,
          loId,
          loTitle,
          dismissed: false
        });
      }
    }

    const existing = this.alerts.value.filter((a) => !a.dismissed);
    const combined = [...newAlerts, ...existing.filter((e) => !newAlerts.some((n) => n.studentId === e.studentId && n.rule === e.rule))];

    const severityOrder: Record<string, number> = { red: 0, amber: 1, green: 2 };
    combined.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    this.alerts.value = combined.slice(0, MAX_ACTIVE_ALERTS * 2);
  },

  addAlert(
    alerts: DashboardAlert[],
    state: StudentDashboardState,
    severity: "red" | "amber" | "green",
    rule: string,
    message: string
  ) {
    const key = `${state.userId}:${rule}`;
    const now = Date.now();
    const lastAlert = this.alertCooldowns.get(key);
    if (lastAlert && now - lastAlert < ALERT_COOLDOWN_MS) return;

    this.alertCooldowns.set(key, now);
    alerts.push({
      id: generateAlertId(),
      studentId: state.userId,
      studentName: state.fullName,
      studentAvatar: state.avatar,
      severity,
      rule,
      message,
      timestamp: now,
      loId: state.currentLoId,
      loTitle: state.currentLoTitle,
      dismissed: false
    });
  },

  dismissAlert(alertId: string) {
    this.alerts.value = this.alerts.value.map((a) => (a.id === alertId ? { ...a, dismissed: true } : a));
  },

  computeClassHealth() {
    const now = Date.now();
    const states = this.studentStates.value;
    let active = 0;
    let idle = 0;
    let away = 0;
    let disconnected = 0;

    for (const [, state] of states) {
      if (now - state.lastEventTs > STALE_THRESHOLD_MS) {
        disconnected++;
      } else if (state.engagement === "active") {
        active++;
      } else if (state.engagement === "idle") {
        idle++;
      } else {
        away++;
      }
    }

    const total = states.size;
    const activePercent = total > 0 ? Math.round((active / total) * 100) : 100;
    let healthLevel: "green" | "amber" | "red";
    if (activePercent >= 80) {
      healthLevel = "green";
    } else if (activePercent >= 60) {
      healthLevel = "amber";
    } else {
      healthLevel = "red";
    }

    this.classHealth.value = {
      totalStudents: total,
      activeCount: active,
      idleCount: idle,
      awayCount: away,
      disconnectedCount: disconnected,
      activePercent,
      healthLevel
    };
  }
};
