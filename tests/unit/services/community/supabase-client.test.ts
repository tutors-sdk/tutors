import {
  localYyyyMmDd,
  instantLocalYmd,
  isReceivedAtOnLocalDay,
  isReceivedAtInLocalWeek,
  isReceivedAtInLocalMonth,
  isReceivedAtInLocalYear,
  formatDate
} from "$lib/services/community/utils/supabase-client";

describe("supabase-client date utilities", () => {
  describe("localYyyyMmDd", () => {
    it("formats a date as YYYY-MM-DD", () => {
      const d = new Date(2025, 0, 5);
      expect(localYyyyMmDd(d)).toBe("2025-01-05");
    });

    it("pads single-digit months and days", () => {
      const d = new Date(2025, 2, 3);
      expect(localYyyyMmDd(d)).toBe("2025-03-03");
    });

    it("handles December correctly", () => {
      const d = new Date(2025, 11, 25);
      expect(localYyyyMmDd(d)).toBe("2025-12-25");
    });

    it("defaults to current date when no argument given", () => {
      const result = localYyyyMmDd();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("instantLocalYmd", () => {
    it("converts an ISO string to local YYYY-MM-DD", () => {
      const result = instantLocalYmd("2025-06-15T10:30:00Z");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("returns null for null input", () => {
      expect(instantLocalYmd(null)).toBeNull();
    });

    it("returns null for undefined input", () => {
      expect(instantLocalYmd(undefined)).toBeNull();
    });

    it("returns null for empty string", () => {
      expect(instantLocalYmd("")).toBeNull();
    });

    it("returns null for whitespace-only string", () => {
      expect(instantLocalYmd("   ")).toBeNull();
    });

    it("returns null for invalid date string", () => {
      expect(instantLocalYmd("not-a-date")).toBeNull();
    });

    it("trims whitespace from input", () => {
      const result = instantLocalYmd("  2025-06-15T10:30:00Z  ");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("isReceivedAtOnLocalDay", () => {
    it("returns true for same day", () => {
      const ref = new Date(2025, 5, 15, 10, 0, 0);
      const iso = new Date(2025, 5, 15, 14, 30, 0).toISOString();
      expect(isReceivedAtOnLocalDay(iso, ref)).toBe(true);
    });

    it("returns false for different day", () => {
      const ref = new Date(2025, 5, 15);
      const iso = new Date(2025, 5, 16).toISOString();
      expect(isReceivedAtOnLocalDay(iso, ref)).toBe(false);
    });

    it("returns false for null input", () => {
      expect(isReceivedAtOnLocalDay(null)).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(isReceivedAtOnLocalDay("")).toBe(false);
    });
  });

  describe("isReceivedAtInLocalWeek", () => {
    it("returns true for same Monday-Sunday week", () => {
      // Wednesday June 18, 2025
      const ref = new Date(2025, 5, 18);
      // Monday June 16, 2025 (same week)
      const iso = new Date(2025, 5, 16).toISOString();
      expect(isReceivedAtInLocalWeek(iso, ref)).toBe(true);
    });

    it("returns false for different weeks", () => {
      const ref = new Date(2025, 5, 18);
      const iso = new Date(2025, 5, 9).toISOString();
      expect(isReceivedAtInLocalWeek(iso, ref)).toBe(false);
    });

    it("returns false for null input", () => {
      expect(isReceivedAtInLocalWeek(null)).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(isReceivedAtInLocalWeek("")).toBe(false);
    });

    it("returns false for invalid date", () => {
      expect(isReceivedAtInLocalWeek("not-a-date")).toBe(false);
    });
  });

  describe("isReceivedAtInLocalMonth", () => {
    it("returns true for same month", () => {
      const ref = new Date(2025, 5, 15);
      const iso = new Date(2025, 5, 1).toISOString();
      expect(isReceivedAtInLocalMonth(iso, ref)).toBe(true);
    });

    it("returns false for different month", () => {
      const ref = new Date(2025, 5, 15);
      const iso = new Date(2025, 4, 15).toISOString();
      expect(isReceivedAtInLocalMonth(iso, ref)).toBe(false);
    });

    it("returns false for null input", () => {
      expect(isReceivedAtInLocalMonth(null)).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(isReceivedAtInLocalMonth("")).toBe(false);
    });
  });

  describe("isReceivedAtInLocalYear", () => {
    it("returns true for same year", () => {
      const ref = new Date(2025, 0, 1);
      const iso = new Date(2025, 11, 31).toISOString();
      expect(isReceivedAtInLocalYear(iso, ref)).toBe(true);
    });

    it("returns false for different year", () => {
      const ref = new Date(2025, 5, 15);
      const iso = new Date(2024, 5, 15).toISOString();
      expect(isReceivedAtInLocalYear(iso, ref)).toBe(false);
    });

    it("returns false for null input", () => {
      expect(isReceivedAtInLocalYear(null)).toBe(false);
    });
  });

  describe("formatDate", () => {
    it("formats a date as YYYY-MM-DD", () => {
      const d = new Date(2025, 0, 5);
      expect(formatDate(d)).toBe("2025-01-05");
    });

    it("pads single-digit months and days", () => {
      const d = new Date(2025, 2, 3);
      expect(formatDate(d)).toBe("2025-03-03");
    });
  });
});
