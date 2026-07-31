import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthFlow } from "../components/AuthFlow";

const { mockSignInAnonymously, mockUpdateUser, mockSignInWithGoogle, mockSignInWithMagicLink, mockPush, mockGetParam } =
  vi.hoisted(() => ({
    mockSignInAnonymously: vi.fn(),
    mockUpdateUser: vi.fn(),
    mockSignInWithGoogle: vi.fn(),
    mockSignInWithMagicLink: vi.fn(),
    mockPush: vi.fn(),
    mockGetParam: vi.fn<(key: string) => string | null>(() => null),
  }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: mockGetParam }),
}));

vi.mock("@/shared/providers/AuthContext", () => ({
  useAuth: () => ({
    signInWithGoogle: mockSignInWithGoogle,
    signInWithMagicLink: mockSignInWithMagicLink,
  }),
}));

vi.mock("@/services/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInAnonymously: mockSignInAnonymously,
      updateUser: mockUpdateUser,
    },
  }),
}));

describe("AuthFlow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetParam.mockReturnValue(null);
  });

  it("renders get-started mode by default", () => {
    render(<AuthFlow />);
    expect(screen.getByRole("heading", { name: /get started/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /let's go/i })).toBeInTheDocument();
  });

  it("renders login mode when mode=login", () => {
    mockGetParam.mockReturnValue("login");
    render(<AuthFlow />);
    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^sign in$/i })).toBeInTheDocument();
  });

  it("submits name via anonymous sign-in and redirects", async () => {
    mockSignInAnonymously.mockResolvedValue({ error: null });
    mockUpdateUser.mockResolvedValue({ error: null });
    render(<AuthFlow />);
    fireEvent.change(screen.getByPlaceholderText(/enter your name/i), { target: { value: "Rahul" } });
    fireEvent.click(screen.getByRole("button", { name: /let's go/i }));
    await waitFor(() => {
      expect(mockSignInAnonymously).toHaveBeenCalledTimes(1);
      expect(mockUpdateUser).toHaveBeenCalledWith({ data: { display_name: "Rahul" } });
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("calls signInWithGoogle on Google Login", () => {
    render(<AuthFlow />);
    fireEvent.click(screen.getByRole("button", { name: /google login/i }));
    expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
  });

  it("sends magic link in email mode and shows success", async () => {
    mockSignInWithMagicLink.mockResolvedValue({ error: null });
    render(<AuthFlow />);
    fireEvent.click(screen.getByRole("button", { name: /sign in with email magic link/i }));
    fireEvent.change(screen.getByPlaceholderText(/name@college\.edu/i), { target: { value: "rahul@college.edu" } });
    fireEvent.click(screen.getByRole("button", { name: /send magic link/i }));
    await waitFor(() => {
      expect(mockSignInWithMagicLink).toHaveBeenCalledWith("rahul@college.edu", "/dashboard");
      expect(screen.getByText(/magic link sent/i)).toBeInTheDocument();
    });
  });

  it("shows an error when anonymous sign-in fails", async () => {
    mockSignInAnonymously.mockResolvedValue({ error: new Error("Could not sign in anonymously. Use Google or Email below.") });
    render(<AuthFlow />);
    fireEvent.change(screen.getByPlaceholderText(/enter your name/i), { target: { value: "Rahul" } });
    fireEvent.click(screen.getByRole("button", { name: /let's go/i }));
    await waitFor(() => {
      expect(screen.getByText(/could not sign in anonymously/i)).toBeInTheDocument();
    });
  });
});
