import { describe, it, expect } from "vitest";
import { cn } from "@/utils/cn";
import { formatCurrency, clamp } from "@/utils/currency";

describe("cn", () => {
  it("joins truthy strings with space", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters out false, null, and undefined", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("returns empty string for no truthy args", () => {
    expect(cn()).toBe("");
    expect(cn(false, null, undefined)).toBe("");
  });

  it("handles single argument", () => {
    expect(cn("single")).toBe("single");
  });
});

describe("formatCurrency", () => {
  it("formats with ₹ prefix", () => {
    expect(formatCurrency(1000)).toBe("₹1,000");
  });

  it("formats large numbers with Indian locale", () => {
    expect(formatCurrency(100000)).toBe("₹1,00,000");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("₹0");
  });

  it("formats small amounts", () => {
    expect(formatCurrency(500)).toBe("₹500");
  });
});

describe("clamp", () => {
  it("returns value within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps below min", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("clamps above max", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("handles value equal to min", () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  it("handles value equal to max", () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });
});
