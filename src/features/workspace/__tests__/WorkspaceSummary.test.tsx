import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WorkspaceSummary } from "@/features/workspace/components/WorkspaceSummary";
import type { Squad } from "@/types/squad";

function makeSquad(overrides: Partial<Squad> = {}): Squad {
  return {
    id: "squad-1",
    name: "Test Squad",
    inviteCode: "test-abc1",
    createdBy: "me",
    destinations: ["Goa"],
    members: [
      { id: "me", name: "You", initial: "Y", color: "bg-accent", verified: true, joinedAt: "2026-01-01" },
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

describe("WorkspaceSummary", () => {
  const onClose = vi.fn();
  const onUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows "Trip Summary" when not all locked', () => {
    render(<WorkspaceSummary squad={makeSquad()} onClose={onClose} onUpdate={onUpdate} />);
    expect(screen.getByText("Trip Summary")).toBeInTheDocument();
  });

  it('shows "Trip Ready!" when all 3 locked', () => {
    const squad = makeSquad({
      lockedDestination: "Goa",
      lockedBudget: 5000,
      lockedDates: { start: "2026-08-15", end: "2026-08-17" },
    });
    render(<WorkspaceSummary squad={squad} onClose={onClose} onUpdate={onUpdate} />);
    expect(screen.getByText("Trip Ready!")).toBeInTheDocument();
  });

  it("calls onUpdate with booked status on Book Trip", () => {
    const squad = makeSquad({
      lockedDestination: "Goa",
      lockedBudget: 5000,
      lockedDates: { start: "2026-08-15", end: "2026-08-17" },
    });
    render(<WorkspaceSummary squad={squad} onClose={onClose} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Book Trip"));
    expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ status: "booked" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onUpdate with pending status on Pending", () => {
    const squad = makeSquad({
      lockedDestination: "Goa",
      lockedBudget: 5000,
      lockedDates: { start: "2026-08-15", end: "2026-08-17" },
    });
    render(<WorkspaceSummary squad={squad} onClose={onClose} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Pending"));
    expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ status: "pending" }));
  });

  it("calls onUpdate with cancelled status on Cancel", () => {
    const squad = makeSquad({
      lockedDestination: "Goa",
      lockedBudget: 5000,
      lockedDates: { start: "2026-08-15", end: "2026-08-17" },
    });
    render(<WorkspaceSummary squad={squad} onClose={onClose} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ status: "cancelled", lockedDestination: undefined, lockedBudget: undefined, lockedDates: undefined }),
    );
  });

  it("shows progress dots reflecting lock state", () => {
    const squad = makeSquad({
      lockedDestination: "Goa",
      lockedBudget: undefined,
      lockedDates: undefined,
    });
    render(<WorkspaceSummary squad={squad} onClose={onClose} onUpdate={onUpdate} />);
    expect(screen.getByText("1/3 decisions locked")).toBeInTheDocument();
  });

  it("hides Book/Pending/Cancel buttons when not all locked", () => {
    render(<WorkspaceSummary squad={makeSquad()} onClose={onClose} onUpdate={onUpdate} />);
    expect(screen.queryByText("Book Trip")).not.toBeInTheDocument();
    expect(screen.getByText("Lock all decisions to enable booking")).toBeInTheDocument();
  });
});
