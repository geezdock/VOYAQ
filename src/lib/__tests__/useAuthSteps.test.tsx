import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAuthSteps } from "@/lib/useAuthSteps";

const mockPush = vi.fn();
let mockMode = "get-started";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({
    get: (key: string) => (key === "mode" ? mockMode : null),
  }),
}));

describe("useAuthSteps", () => {
  it("returns mode from searchParams", () => {
    const { result } = renderHook(() => useAuthSteps());
    expect(result.current.mode).toBe("get-started");
  });

  it("handleComplete pushes to dashboard", () => {
    const { result } = renderHook(() => useAuthSteps());
    result.current.handleComplete("testuser");
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("reads login mode from searchParams", () => {
    mockMode = "login";
    const { result } = renderHook(() => useAuthSteps());
    expect(result.current.mode).toBe("login");
    mockMode = "get-started";
  });
});
