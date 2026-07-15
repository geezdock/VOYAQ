import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  phoneSchema,
  emailSchema,
  otpSchema,
  dobSchema,
  calculateAge,
  usernameSchema,
  isUsernameAvailable,
} from "@/utils/validation";

describe("phoneSchema", () => {
  it("accepts valid 10-digit Indian numbers starting with 6-9", () => {
    expect(phoneSchema.safeParse("9876543210").success).toBe(true);
    expect(phoneSchema.safeParse("6123456789").success).toBe(true);
    expect(phoneSchema.safeParse("7999999999").success).toBe(true);
    expect(phoneSchema.safeParse("8000000000").success).toBe(true);
  });

  it("rejects numbers starting with 0-5", () => {
    expect(phoneSchema.safeParse("5123456789").success).toBe(false);
    expect(phoneSchema.safeParse("0123456789").success).toBe(false);
    expect(phoneSchema.safeParse("1999999999").success).toBe(false);
  });

  it("rejects numbers shorter than 10 digits", () => {
    expect(phoneSchema.safeParse("987654321").success).toBe(false);
    expect(phoneSchema.safeParse("98765432").success).toBe(false);
  });

  it("rejects numbers longer than 10 digits", () => {
    expect(phoneSchema.safeParse("98765432101").success).toBe(false);
  });

  it("rejects non-numeric input", () => {
    expect(phoneSchema.safeParse("abcdefghij").success).toBe(false);
    expect(phoneSchema.safeParse("987654321a").success).toBe(false);
    expect(phoneSchema.safeParse("98765-4321").success).toBe(false);
  });
});

describe("emailSchema", () => {
  it("accepts valid emails", () => {
    expect(emailSchema.safeParse("user@example.com").success).toBe(true);
    expect(emailSchema.safeParse("test@domain.co").success).toBe(true);
    expect(emailSchema.safeParse("a+b@c.com").success).toBe(true);
  });

  it("rejects malformed emails", () => {
    expect(emailSchema.safeParse("").success).toBe(false);
    expect(emailSchema.safeParse("notanemail").success).toBe(false);
    expect(emailSchema.safeParse("@example.com").success).toBe(false);
    expect(emailSchema.safeParse("user@").success).toBe(false);
  });
});

describe("otpSchema", () => {
  it("accepts exactly 6 numeric digits", () => {
    expect(otpSchema.safeParse("123456").success).toBe(true);
    expect(otpSchema.safeParse("000000").success).toBe(true);
    expect(otpSchema.safeParse("999999").success).toBe(true);
  });

  it("rejects non-6-digit strings", () => {
    expect(otpSchema.safeParse("12345").success).toBe(false);
    expect(otpSchema.safeParse("1234567").success).toBe(false);
    expect(otpSchema.safeParse("").success).toBe(false);
  });

  it("rejects non-numeric input", () => {
    expect(otpSchema.safeParse("12345a").success).toBe(false);
    expect(otpSchema.safeParse("abcdef").success).toBe(false);
    expect(otpSchema.safeParse("12 345").success).toBe(false);
  });
});

describe("dobSchema", () => {
  it("accepts valid past dates", () => {
    expect(dobSchema.safeParse("2000-01-15").success).toBe(true);
    expect(dobSchema.safeParse("1990-12-31").success).toBe(true);
  });

  it("rejects future dates", () => {
    expect(dobSchema.safeParse("2030-01-01").success).toBe(false);
  });

  it("rejects invalid format", () => {
    expect(dobSchema.safeParse("15-01-2000").success).toBe(false);
    expect(dobSchema.safeParse("2000/01/15").success).toBe(false);
    expect(dobSchema.safeParse("not-a-date").success).toBe(false);
  });
});

describe("calculateAge", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-21"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calculates correct age when birthday has passed this year", () => {
    expect(calculateAge("2000-01-15")).toBe(26);
  });

  it("calculates correct age when birthday has not yet occurred", () => {
    expect(calculateAge("2000-08-15")).toBe(25);
  });

  it("calculates correct age on birthday", () => {
    expect(calculateAge("2000-06-21")).toBe(26);
  });

  it("returns 0 for a newborn", () => {
    expect(calculateAge("2026-06-20")).toBe(0);
  });
});

describe("usernameSchema", () => {
  it("accepts valid usernames (3-20 chars, alphanumeric + underscore)", () => {
    expect(usernameSchema.safeParse("abc").success).toBe(true);
    expect(usernameSchema.safeParse("user_123").success).toBe(true);
    expect(usernameSchema.safeParse("a".repeat(20)).success).toBe(true);
  });

  it("rejects usernames shorter than 3 characters", () => {
    expect(usernameSchema.safeParse("ab").success).toBe(false);
    expect(usernameSchema.safeParse("a").success).toBe(false);
    expect(usernameSchema.safeParse("").success).toBe(false);
  });

  it("rejects usernames longer than 20 characters", () => {
    expect(usernameSchema.safeParse("a".repeat(21)).success).toBe(false);
  });

  it("rejects usernames starting with underscore", () => {
    expect(usernameSchema.safeParse("_abc").success).toBe(false);
  });

  it("rejects consecutive underscores", () => {
    expect(usernameSchema.safeParse("a__b").success).toBe(false);
  });

  it("rejects special characters", () => {
    expect(usernameSchema.safeParse("user-name").success).toBe(false);
    expect(usernameSchema.safeParse("user.name").success).toBe(false);
    expect(usernameSchema.safeParse("user@name").success).toBe(false);
  });

  it("accepts single underscore (not consecutive, not leading/trailing)", () => {
    expect(usernameSchema.safeParse("a_b").success).toBe(true);
  });
});

describe("isUsernameAvailable", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns false for taken usernames", async () => {
    const result = isUsernameAvailable("admin");
    vi.advanceTimersByTime(1000);
    expect(await result).toBe(false);
  });

  it("returns true for available usernames", async () => {
    const result = isUsernameAvailable("uniqueuser123");
    vi.advanceTimersByTime(1000);
    expect(await result).toBe(true);
  });

  it("is case-insensitive", async () => {
    const result = isUsernameAvailable("ADMIN");
    vi.advanceTimersByTime(1000);
    expect(await result).toBe(false);
  });
});
