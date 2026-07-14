import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TripView } from "@/components/trip/TripView";
import type { Squad } from "@/types/squad";

const mockPush = vi.fn();
const mockUpdateSquad = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/lib/SquadContext", () => ({
  useSquad: () => ({
    updateSquad: mockUpdateSquad,
    isMe: (id: string) => id === "me",
    currentUserId: "me",
  }),
}));

function makeSquad(overrides: Partial<Squad> = {}): Squad {
  return {
    id: "squad-1",
    name: "Goa Crew",
    inviteCode: "goa-trip",
    createdBy: "me",
    destination: "Goa",
    lockedDestination: "Goa",
    destinations: ["Goa"],
    members: [
      { id: "me", name: "You", initial: "Y", color: "bg-accent", verified: true, joinedAt: "2026-01-01" },
    ],
    memberLimit: 8,
    votes: [],
    budgetPerPerson: 5000,
    lockedBudget: 5000,
    budgetPreferences: [],
    dateProposals: [],
    lockedDates: { start: "2026-08-15", end: "2026-08-17" },
    polls: [],
    status: "booked",
    createdAt: "2026-01-01",
    ...overrides,
  };
}

describe("TripView", () => {
  const onBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-01"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows "Trip not ready" when no lockedDestination', () => {
    render(<TripView squad={makeSquad({ lockedDestination: undefined })} onBack={onBack} />);
    expect(screen.getByText("Trip not ready")).toBeInTheDocument();
  });

  it('shows "Trip not ready" when no lockedBudget', () => {
    render(<TripView squad={makeSquad({ lockedBudget: undefined })} onBack={onBack} />);
    expect(screen.getByText("Trip not ready")).toBeInTheDocument();
  });

  it('shows "Trip not ready" when no lockedDates', () => {
    render(<TripView squad={makeSquad({ lockedDates: undefined })} onBack={onBack} />);
    expect(screen.getByText("Trip not ready")).toBeInTheDocument();
  });

  it("renders squad name when all locked", () => {
    render(<TripView squad={makeSquad()} onBack={onBack} />);
    expect(screen.getByText("Goa Crew")).toBeInTheDocument();
  });

  it("shows Booked status badge", () => {
    render(<TripView squad={makeSquad()} onBack={onBack} />);
    expect(screen.getByText("Booked")).toBeInTheDocument();
  });

  it("shows Cancelled status badge", () => {
    render(<TripView squad={makeSquad({ status: "cancelled" })} onBack={onBack} />);
    expect(screen.getByText("Cancelled")).toBeInTheDocument();
  });

  it("shows Cancel button for booked trip", () => {
    render(<TripView squad={makeSquad()} onBack={onBack} />);
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("shows Cancel button for pending trip", () => {
    render(<TripView squad={makeSquad({ status: "pending" })} onBack={onBack} />);
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("hides Cancel button for cancelled trip", () => {
    render(<TripView squad={makeSquad({ status: "cancelled" })} onBack={onBack} />);
    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
  });

  it("shows Book Again button for cancelled trip", () => {
    render(<TripView squad={makeSquad({ status: "cancelled" })} onBack={onBack} />);
    expect(screen.getByText("Book Again")).toBeInTheDocument();
  });

  it("opens cancel confirmation modal", () => {
    render(<TripView squad={makeSquad()} onBack={onBack} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.getByText("Cancel Trip?")).toBeInTheDocument();
  });

  it("closes cancel confirmation on Keep Trip", () => {
    render(<TripView squad={makeSquad()} onBack={onBack} />);
    fireEvent.click(screen.getByText("Cancel"));
    fireEvent.click(screen.getByText("Keep Trip"));
    expect(screen.queryByText("Cancel Trip?")).not.toBeInTheDocument();
  });

  it("calls updateSquad with cancelled status on Yes, Cancel", () => {
    render(<TripView squad={makeSquad()} onBack={onBack} />);
    fireEvent.click(screen.getByText("Cancel"));
    fireEvent.click(screen.getByText("Yes, Cancel"));
    expect(mockUpdateSquad).toHaveBeenCalledWith(expect.objectContaining({ status: "cancelled" }));
  });

  it("calls updateSquad and router.push on Book Again", () => {
    render(<TripView squad={makeSquad({ status: "cancelled" })} onBack={onBack} />);
    fireEvent.click(screen.getByText("Book Again"));
    expect(mockUpdateSquad).toHaveBeenCalledWith(
      expect.objectContaining({ status: "planning", lockedDestination: undefined, lockedBudget: undefined, lockedDates: undefined }),
    );
    expect(mockPush).toHaveBeenCalledWith("/workspace/squad-1");
  });

  it("shows countdown with days/hrs/min", () => {
    render(<TripView squad={makeSquad()} onBack={onBack} />);
    expect(screen.getByText("14")).toBeInTheDocument();
  });

  it('shows "Trip cancelled" banner for cancelled status', () => {
    render(<TripView squad={makeSquad({ status: "cancelled" })} onBack={onBack} />);
    expect(screen.getByText("Trip cancelled")).toBeInTheDocument();
  });

  it("renders trip stats (destination, budget, duration)", () => {
    render(<TripView squad={makeSquad()} onBack={onBack} />);
    expect(screen.getAllByText("Goa").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/3d/)).toBeInTheDocument();
  });

  it("calls onBack when Dashboard button clicked", () => {
    render(<TripView squad={makeSquad()} onBack={onBack} />);
    const dashboardButtons = screen.getAllByText("Dashboard");
    fireEvent.click(dashboardButtons[0]);
    expect(onBack).toHaveBeenCalled();
  });
});
