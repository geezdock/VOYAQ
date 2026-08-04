import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UserAvatarDropdown } from "@/features/dashboard/components/UserAvatarDropdown";

const mockPush = vi.fn();
const mockSignOut = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/shared/providers/AuthContext", () => ({
  useAuth: () => ({ signOut: mockSignOut }),
}));

describe("UserAvatarDropdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("shows U initial when no username stored", () => {
    render(<UserAvatarDropdown />);
    expect(screen.getByText("U")).toBeInTheDocument();
  });

  it("shows username initial from sessionStorage", () => {
    sessionStorage.setItem("voyaq_username", "testuser");
    render(<UserAvatarDropdown />);
    expect(screen.getByText("T")).toBeInTheDocument();
  });

  it("opens dropdown on avatar click", () => {
    render(<UserAvatarDropdown />);
    fireEvent.click(screen.getByLabelText("User menu"));
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });

  it("navigates to profile on Profile click", () => {
    render(<UserAvatarDropdown />);
    fireEvent.click(screen.getByLabelText("User menu"));
    fireEvent.click(screen.getByText("Profile"));
    expect(mockPush).toHaveBeenCalledWith("/profile");
  });

  it("clears sessionStorage and navigates to / on Sign Out", () => {
    sessionStorage.setItem("voyaq_username", "testuser");
    render(<UserAvatarDropdown />);
    fireEvent.click(screen.getByLabelText("User menu"));
    fireEvent.click(screen.getByText("Sign Out"));
    expect(mockSignOut).toHaveBeenCalled();
    expect(sessionStorage.getItem("voyaq_username")).toBeNull();
    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
