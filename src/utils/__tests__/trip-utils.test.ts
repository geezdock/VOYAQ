import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getCountdown, formatDate, getDays } from "@/utils/dates";
import { formatRupee } from "@/utils/currency";

describe("getCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns expired when target is in the past", () => {
    const result = getCountdown("2026-07-15");
    expect(result.expired).toBe(true);
    expect(result.days).toBe(0);
  });

  it("returns correct days/hours/minutes for future date", () => {
    const result = getCountdown("2026-08-15T00:00:00Z");
    expect(result.expired).toBe(false);
    expect(result.days).toBe(14);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
  });

  it("returns zeros when target is now", () => {
    const result = getCountdown("2026-08-01T00:00:00Z");
    expect(result.expired).toBe(true);
  });

  it("includes hours and minutes offset", () => {
    const result = getCountdown("2026-08-01T05:30:00Z");
    expect(result.hours).toBe(5);
    expect(result.minutes).toBe(30);
  });
});

describe("formatDate", () => {
  it("formats date in en-IN short style", () => {
    const result = formatDate("2026-08-15");
    expect(result).toContain("Aug");
    expect(result).toContain("2026");
    expect(result).toContain("15");
  });
});

describe("getDays", () => {
  it("returns 1 for same day", () => {
    expect(getDays("2026-08-15", "2026-08-15")).toBe(1);
  });

  it("returns 3 for 3-day trip", () => {
    expect(getDays("2026-08-15", "2026-08-17")).toBe(3);
  });

  it("returns 7 for week-long trip", () => {
    expect(getDays("2026-08-15", "2026-08-21")).toBe(7);
  });
});

describe("formatRupee", () => {
  it("formats 0 as ₹0", () => {
    expect(formatRupee(0)).toBe("₹0");
  });

  it("formats 5000 with comma", () => {
    expect(formatRupee(5000)).toBe("₹5,000");
  });

  it("formats large numbers", () => {
    expect(formatRupee(100000)).toBe("₹1,00,000");
  });
});
