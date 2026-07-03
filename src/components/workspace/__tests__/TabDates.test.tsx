import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TabDates } from "@/components/workspace/steps/TabDates";
import type { Squad, DateProposal } from "@/types/squad";

vi.mock("@/lib/SquadContext", () => ({
  useSquad: () => ({
    isMe: (id: string) => id === "me",
    currentUserId: "me",
  }),
}));

function makeSquad(overrides: Partial<Squad> = {}): Squad {
  return {
    id: "squad-1",
    name: "Test Squad",
    inviteCode: "test-abc1",
    createdBy: "me",
    destinations: ["Goa"],
    members: [
      { id: "me", name: "You", initial: "Y", color: "bg-accent", verified: true, joinedAt: "2026-01-01" },
      { id: "r1", name: "Rahul", initial: "R", color: "bg-red", verified: true, joinedAt: "2026-01-01" },
    ],
    memberLimit: 8,
    votes: [],
    budgetPerPerson: 0,
    budgetPreferences: [],
    dateProposals: [],
    polls: [],
    status: "planning",
    createdAt: "2026-01-01",
    ...overrides,
  };
}

function getDateInputs(container: HTMLElement) {
  return Array.from(container.querySelectorAll('input[type="date"]')) as HTMLInputElement[];
}

describe("TabDates", () => {
  const onUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty state", () => {
    render(<TabDates squad={makeSquad()} onUpdate={onUpdate} />);
    expect(screen.getByText("No date proposals yet. Propose a timeline to get started.")).toBeInTheDocument();
  });

  it("shows propose button", () => {
    render(<TabDates squad={makeSquad()} onUpdate={onUpdate} />);
    expect(screen.getByText("Propose Dates")).toBeInTheDocument();
  });

  it("shows proposal form when propose button clicked", () => {
    render(<TabDates squad={makeSquad()} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Propose Dates"));
    expect(screen.getByText("Propose a date range")).toBeInTheDocument();
  });

  it("shows error when proposing with missing dates", () => {
    render(<TabDates squad={makeSquad()} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Propose Dates"));
    fireEvent.click(screen.getByText("Propose"));
    expect(screen.getByText("Select both start and end dates")).toBeInTheDocument();
  });

  it("shows error when end date before start date", () => {
    const { container } = render(<TabDates squad={makeSquad()} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Propose Dates"));
    const dateInputs = getDateInputs(container);
    fireEvent.change(dateInputs[0], { target: { value: "2026-08-15" } });
    fireEvent.change(dateInputs[1], { target: { value: "2026-08-10" } });
    fireEvent.click(screen.getByText("Propose"));
    expect(screen.getByText("End date must be after start date")).toBeInTheDocument();
  });

  it("creates a proposal with valid dates", () => {
    const { container } = render(<TabDates squad={makeSquad()} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Propose Dates"));
    const dateInputs = getDateInputs(container);
    fireEvent.change(dateInputs[0], { target: { value: "2026-08-15" } });
    fireEvent.change(dateInputs[1], { target: { value: "2026-08-17" } });
    fireEvent.click(screen.getByText("Propose"));
    expect(onUpdate).toHaveBeenCalled();
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.dateProposals).toHaveLength(1);
    expect(updated.dateProposals[0].startDate).toBe("2026-08-15");
    expect(updated.dateProposals[0].endDate).toBe("2026-08-17");
  });

  it("displays existing proposals", () => {
    const proposal: DateProposal = {
      id: "dp-1",
      startDate: "2026-08-15",
      endDate: "2026-08-17",
      proposedBy: "me",
      votes: ["me"],
      createdAt: "2026-06-15T12:00:00Z",
    };
    const squad = makeSquad({ dateProposals: [proposal] });
    render(<TabDates squad={squad} onUpdate={onUpdate} />);
    expect(screen.getByText(/15 Aug/)).toBeInTheDocument();
    expect(screen.getByText(/17 Aug/)).toBeInTheDocument();
  });

  it("toggles vote on proposal", () => {
    const proposal: DateProposal = {
      id: "dp-1",
      startDate: "2026-08-15",
      endDate: "2026-08-17",
      proposedBy: "r1",
      votes: [],
      createdAt: "2026-06-15T12:00:00Z",
    };
    const squad = makeSquad({ dateProposals: [proposal] });
    render(<TabDates squad={squad} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Vote Yes"));
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.dateProposals[0].votes).toContain("me");
  });

  it("removes vote when clicking voted button", () => {
    const proposal: DateProposal = {
      id: "dp-1",
      startDate: "2026-08-15",
      endDate: "2026-08-17",
      proposedBy: "r1",
      votes: ["me"],
      createdAt: "2026-06-15T12:00:00Z",
    };
    const squad = makeSquad({ dateProposals: [proposal] });
    render(<TabDates squad={squad} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Voted ✓"));
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.dateProposals[0].votes).not.toContain("me");
  });

  it("shows lock button when >=50% approval", () => {
    const proposal: DateProposal = {
      id: "dp-1",
      startDate: "2026-08-15",
      endDate: "2026-08-17",
      proposedBy: "me",
      votes: ["me", "r1"],
      createdAt: "2026-06-15T12:00:00Z",
    };
    const squad = makeSquad({ dateProposals: [proposal] });
    render(<TabDates squad={squad} onUpdate={onUpdate} />);
    expect(screen.getByText("Lock")).toBeInTheDocument();
  });

  it("locks dates", () => {
    const proposal: DateProposal = {
      id: "dp-1",
      startDate: "2026-08-15",
      endDate: "2026-08-17",
      proposedBy: "me",
      votes: ["me", "r1"],
      createdAt: "2026-06-15T12:00:00Z",
    };
    const squad = makeSquad({ dateProposals: [proposal] });
    render(<TabDates squad={squad} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Lock"));
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.lockedDates).toEqual({ start: "2026-08-15", end: "2026-08-17" });
  });

  it("shows locked dates banner", () => {
    const squad = makeSquad({ lockedDates: { start: "2026-08-15", end: "2026-08-17" } });
    render(<TabDates squad={squad} onUpdate={onUpdate} />);
    expect(screen.getByText("Dates Locked")).toBeInTheDocument();
  });

  it("unlocks dates", () => {
    const squad = makeSquad({ lockedDates: { start: "2026-08-15", end: "2026-08-17" } });
    render(<TabDates squad={squad} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Unlock"));
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.lockedDates).toBeUndefined();
  });

  it("deletes proposal", () => {
    const proposal: DateProposal = {
      id: "dp-1",
      startDate: "2026-08-15",
      endDate: "2026-08-17",
      proposedBy: "me",
      votes: [],
      createdAt: "2026-06-15T12:00:00Z",
    };
    const squad = makeSquad({ dateProposals: [proposal] });
    render(<TabDates squad={squad} onUpdate={onUpdate} />);
    const deleteBtn = screen.getAllByRole("button").find(
      (btn) => btn.querySelector(".lucide-trash2")
    );
    if (deleteBtn) fireEvent.click(deleteBtn);
    expect(onUpdate).toHaveBeenCalled();
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.dateProposals).toHaveLength(0);
  });
});
