import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthMethodSelect } from "@/components/auth/AuthMethodSelect";

describe("AuthMethodSelect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders "Get started" heading for get-started mode', () => {
    render(<AuthMethodSelect mode="get-started" />);
    expect(screen.getByText("Get started")).toBeInTheDocument();
  });

  it('renders "Welcome back" heading for login mode', () => {
    render(<AuthMethodSelect mode="login" />);
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
  });

  it("shows correct subtext for get-started mode", () => {
    render(<AuthMethodSelect mode="get-started" />);
    expect(screen.getByText("Join your squad and start planning trips.")).toBeInTheDocument();
  });

  it("shows correct subtext for login mode", () => {
    render(<AuthMethodSelect mode="login" />);
    expect(screen.getByText("Sign in to your account.")).toBeInTheDocument();
  });

  it("shows maintenance modal when Google is clicked", () => {
    const onSelect = vi.fn();
    render(<AuthMethodSelect mode="get-started" onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Continue with Google"));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByText("Under Maintenance")).toBeInTheDocument();
    expect(screen.getByText("Sign in with Google is temporarily unavailable.")).toBeInTheDocument();
  });

  it("shows maintenance modal when Phone is clicked", () => {
    const onSelect = vi.fn();
    render(<AuthMethodSelect mode="get-started" onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Phone"));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByText("Under Maintenance")).toBeInTheDocument();
    expect(screen.getByText("Phone number sign in is temporarily unavailable.")).toBeInTheDocument();
  });

  it("calls onSelect with email when Email is clicked", () => {
    const onSelect = vi.fn();
    render(<AuthMethodSelect mode="get-started" onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Email"));
    expect(onSelect).toHaveBeenCalledWith("email");
  });
});
