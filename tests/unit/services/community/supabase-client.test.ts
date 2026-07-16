// Mock @supabase/supabase-js before any imports that trigger module-level createClient
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({}))
}));

import {
  localYyyyMmDd,
  instantLocalYmd,
  formatDate,
  isReceivedAtOnLocalDay,
  isReceivedAtInLocalWeek,
  isReceivedAtInLocalMonth,
  isReceivedAtInLocalYear
} from "$lib/services/community/utils/supabase-client";

// ---------------------------------------------------------------------------
// localYyyyMmDd
// ---------------------------------------------------------------------------
describe("localYyyyMmDd", () => {
  it("pads single-digit month and day (Jan 5)", () => {
    const d = new Date(2025, 0, 5); // Jan 5, 2025
    expect(localYyyyMmDd(d)).toBe("2025-01-05");
  });

  it("pads single-digit day (Mar 9)", () => {
    const d = new Date(2025, 2, 9); // Mar 9, 2025
    expect(localYyyyMmDd(d)).toBe("2025-03-09");
  });

  it("handles double-digit month and day (Dec 31)", () => {
    const d = new Date(2025, 11, 31); // Dec 31, 2025
    expect(localYyyyMmDd(d)).toBe("2025-12-31");
  });

  it("defaults to current date when called with no arguments", () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    expect(localYyyyMmDd()).toBe(`${y}-${m}-${day}`);
  });
});

// ---------------------------------------------------------------------------
// instantLocalYmd
// ---------------------------------------------------------------------------
describe("instantLocalYmd", () => {
  it("returns null for null", () => {
    expect(instantLocalYmd(null)).toBeNull();
  });

  it("returns null for undefined", () => {
    expect(instantLocalYmd(undefined)).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(instantLocalYmd("")).toBeNull();
  });

  it("returns null for whitespace-only string", () => {
    expect(instantLocalYmd("   ")).toBeNull();
  });

  it("returns null for an invalid date string", () => {
    expect(instantLocalYmd("not-a-date")).toBeNull();
  });

  it("returns YYYY-MM-DD for a valid ISO string", () => {
    // Use a date constructed in local timezone to guarantee the expected output
    const ref = new Date(2025, 5, 15, 10, 30, 0); // Jun 15, 2025, 10:30 local
    const iso = ref.toISOString();
    // The function converts back via new Date(iso) which yields the same instant,
    // then formats using local getFullYear/getMonth/getDate
    expect(instantLocalYmd(iso)).toBe(localYyyyMmDd(ref));
  });
});

// ---------------------------------------------------------------------------
// formatDate
// ---------------------------------------------------------------------------
describe("formatDate", () => {
  it("pads single-digit month and day (Jan 5)", () => {
    const d = new Date(2025, 0, 5);
    expect(formatDate(d)).toBe("2025-01-05");
  });

  it("pads single-digit day (Mar 9)", () => {
    const d = new Date(2025, 2, 9);
    expect(formatDate(d)).toBe("2025-03-09");
  });

  it("handles double-digit month and day (Dec 31)", () => {
    const d = new Date(2025, 11, 31);
    expect(formatDate(d)).toBe("2025-12-31");
  });
});

// ---------------------------------------------------------------------------
// isReceivedAtOnLocalDay
// ---------------------------------------------------------------------------
describe("isReceivedAtOnLocalDay", () => {
  it("returns true when the ISO string is on the same local day as ref", () => {
    const ref = new Date(2025, 3, 10, 14, 0, 0); // Apr 10, 2025 14:00
    const iso = new Date(2025, 3, 10, 8, 30, 0).toISOString(); // same day, different time
    expect(isReceivedAtOnLocalDay(iso, ref)).toBe(true);
  });

  it("returns false when the ISO string is on a different local day", () => {
    const ref = new Date(2025, 3, 10, 14, 0, 0); // Apr 10
    const iso = new Date(2025, 3, 11, 8, 0, 0).toISOString(); // Apr 11
    expect(isReceivedAtOnLocalDay(iso, ref)).toBe(false);
  });

  it("returns false for null", () => {
    expect(isReceivedAtOnLocalDay(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isReceivedAtOnLocalDay(undefined)).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isReceivedAtOnLocalDay("")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isReceivedAtInLocalWeek  (Monday-start weeks)
// ---------------------------------------------------------------------------
describe("isReceivedAtInLocalWeek", () => {
  // 2025-04-07 is a Monday
  const monday = new Date(2025, 3, 7, 12, 0, 0);

  it("returns true for a date on the same Monday", () => {
    const iso = new Date(2025, 3, 7, 9, 0, 0).toISOString();
    expect(isReceivedAtInLocalWeek(iso, monday)).toBe(true);
  });

  it("returns true for the following Sunday in the same week", () => {
    const sunday = new Date(2025, 3, 13, 20, 0, 0).toISOString(); // Sun Apr 13
    expect(isReceivedAtInLocalWeek(sunday, monday)).toBe(true);
  });

  it("returns true for a mid-week day (Wednesday)", () => {
    const wed = new Date(2025, 3, 9, 15, 0, 0).toISOString(); // Wed Apr 9
    expect(isReceivedAtInLocalWeek(wed, monday)).toBe(true);
  });

  it("returns false for the previous Sunday (different week)", () => {
    const prevSunday = new Date(2025, 3, 6, 23, 59, 0).toISOString(); // Sun Apr 6
    expect(isReceivedAtInLocalWeek(prevSunday, monday)).toBe(false);
  });

  it("returns false for the following Monday (next week)", () => {
    const nextMonday = new Date(2025, 3, 14, 0, 0, 0).toISOString(); // Mon Apr 14
    expect(isReceivedAtInLocalWeek(nextMonday, monday)).toBe(false);
  });

  it("returns false for null", () => {
    expect(isReceivedAtInLocalWeek(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isReceivedAtInLocalWeek(undefined)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isReceivedAtInLocalMonth
// ---------------------------------------------------------------------------
describe("isReceivedAtInLocalMonth", () => {
  const ref = new Date(2025, 5, 15); // Jun 15, 2025

  it("returns true when same month and year", () => {
    const iso = new Date(2025, 5, 1).toISOString(); // Jun 1, 2025
    expect(isReceivedAtInLocalMonth(iso, ref)).toBe(true);
  });

  it("returns false when different month", () => {
    const iso = new Date(2025, 6, 15).toISOString(); // Jul 15, 2025
    expect(isReceivedAtInLocalMonth(iso, ref)).toBe(false);
  });

  it("returns false when same month number but different year", () => {
    const iso = new Date(2024, 5, 15).toISOString(); // Jun 15, 2024
    expect(isReceivedAtInLocalMonth(iso, ref)).toBe(false);
  });

  it("returns false for null", () => {
    expect(isReceivedAtInLocalMonth(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isReceivedAtInLocalMonth(undefined)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isReceivedAtInLocalYear
// ---------------------------------------------------------------------------
describe("isReceivedAtInLocalYear", () => {
  const ref = new Date(2025, 0, 1); // Jan 1, 2025

  it("returns true when same year", () => {
    const iso = new Date(2025, 11, 31).toISOString(); // Dec 31, 2025
    expect(isReceivedAtInLocalYear(iso, ref)).toBe(true);
  });

  it("returns false when different year", () => {
    const iso = new Date(2024, 11, 31).toISOString(); // Dec 31, 2024
    expect(isReceivedAtInLocalYear(iso, ref)).toBe(false);
  });

  it("returns false for null", () => {
    expect(isReceivedAtInLocalYear(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isReceivedAtInLocalYear(undefined)).toBe(false);
  });
});
