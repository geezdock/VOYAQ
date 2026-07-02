import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
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
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("starts at auth-method step", () => {
    const { result } = renderHook(() => useAuthSteps());
    expect(result.current.state.step).toBe("auth-method");
    expect(result.current.mode).toBe("get-started");
  });

  it("goTo transitions to the given step", () => {
    const { result } = renderHook(() => useAuthSteps());
    act(() => result.current.goTo("phone"));
    expect(result.current.state.step).toBe("phone");
  });

  it("backMap for auth-method pushes to /", () => {
    const { result } = renderHook(() => useAuthSteps());
    act(() => result.current.backMap["auth-method"]!());
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("backMap for phone goes back to auth-method", () => {
    const { result } = renderHook(() => useAuthSteps());
    act(() => result.current.goTo("phone"));
    act(() => result.current.backMap["phone"]!());
    expect(result.current.state.step).toBe("auth-method");
  });

  it("stepLabel returns correct labels", () => {
    const { result } = renderHook(() => useAuthSteps());
    expect(result.current.stepLabel["auth-method"]).toBe("Step 1");
    expect(result.current.stepLabel["username"]).toBe("Step 5");
  });

  it("getOTPLabel returns phone label when authMethod is phone", () => {
    const { result } = renderHook(() => useAuthSteps());
    act(() => result.current.setState((prev: any) => ({ ...prev, authMethod: "phone", phone: "9876543210" })));
    const label = result.current.getOTPLabel();
    expect(label.sublabel).toBe("Enter the code sent to");
    expect(label.label).toContain("98765");
  });

  it("getOTPLabel returns email label when authMethod is email", () => {
    const { result } = renderHook(() => useAuthSteps());
    act(() => result.current.setState((prev: any) => ({ ...prev, authMethod: "email", email: "test@example.com" })));
    const label = result.current.getOTPLabel();
    expect(label.label).toBe("test@example.com");
  });

  it("handleGoogleAuth goes to age-gate in get-started mode", () => {
    const { result } = renderHook(() => useAuthSteps());
    act(() => result.current.handleGoogleAuth());
    expect(result.current.state.step).toBe("age-gate");
  });

  it("handleOTPComplete goes to age-gate in get-started mode", () => {
    const { result } = renderHook(() => useAuthSteps());
    act(() => result.current.handleOTPComplete());
    expect(result.current.state.step).toBe("age-gate");
  });

  it("handleUsernameComplete stores username and sets location", () => {
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      value: { ...originalLocation, href: "" },
      writable: true,
    });

    const { result } = renderHook(() => useAuthSteps());
    act(() => result.current.handleUsernameComplete("testuser"));
    expect(sessionStorage.getItem("voyaq_username")).toBe("testuser");
  });
});

describe("useAuthSteps login mode", () => {
  beforeEach(() => {
    mockMode = "login";
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  afterEach(() => {
    mockMode = "get-started";
  });

  it("reads login mode from searchParams", () => {
    const { result } = renderHook(() => useAuthSteps());
    expect(result.current.mode).toBe("login");
  });

  it("handleGoogleAuth redirects to dashboard in login mode", () => {
    const { result } = renderHook(() => useAuthSteps());
    act(() => result.current.handleGoogleAuth());
    expect(sessionStorage.getItem("voyaq_username")).toBe("You");
  });

  it("handleOTPComplete redirects to dashboard in login mode", () => {
    const { result } = renderHook(() => useAuthSteps());
    act(() => result.current.handleOTPComplete());
    expect(sessionStorage.getItem("voyaq_username")).toBe("You");
  });
});
