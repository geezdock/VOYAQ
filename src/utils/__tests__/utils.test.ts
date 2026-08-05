import { describe, it, expect } from "vitest";
import { cn } from "@/utils/cn";

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
