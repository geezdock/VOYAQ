import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TabBudget } from "@/components/workspace/steps/TabBudget";
import type { Squad } from "@/types/squad";

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
      { id: "a1", name: "Ananya", initial: "A", color: "bg-blue", verified: true, joinedAt: "2026-01-01" },
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

describe("TabBudget", () => {
  const onUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders budget input and set button", () => {
    render(<TabBudget squad={makeSquad()} onUpdate={onUpdate} />);
    expect(screen.getByText("Your Budget")).toBeInTheDocument();
    expect(screen.getByText("Set")).toBeInTheDocument();
  });

  it("sets budget preference", () => {
    render(<TabBudget squad={makeSquad()} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Set"));
    expect(onUpdate).toHaveBeenCalled();
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.budgetPreferences).toContainEqual(
      expect.objectContaining({ memberId: "me", amount: expect.any(Number) })
    );
  });

  it("updates existing budget preference", () => {
    const squad = makeSquad({
      budgetPreferences: [{ memberId: "me", amount: 3000 }],
    });
    render(<TabBudget squad={squad} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Set"));
    const updated = onUpdate.mock.calls[0][0];
    const mePref = updated.budgetPreferences.find((p: { memberId: string }) => p.memberId === "me");
    expect(mePref).toBeDefined();
  });

  it("shows participation percentage", () => {
    const squad = makeSquad({
      budgetPreferences: [
        { memberId: "me", amount: 5000 },
        { memberId: "r1", amount: 5000 },
      ],
    });
    render(<TabBudget squad={squad} onUpdate={onUpdate} />);
    expect(screen.getByText("67% of squad has set their budget")).toBeInTheDocument();
  });

  it("shows conflict when multiple amounts exist", () => {
    const squad = makeSquad({
      budgetPreferences: [
        { memberId: "me", amount: 5000 },
        { memberId: "r1", amount: 8000 },
      ],
    });
    render(<TabBudget squad={squad} onUpdate={onUpdate} />);
    expect(screen.getByText("Conflict")).toBeInTheDocument();
  });

  it("shows no conflict with single amount", () => {
    const squad = makeSquad({
      budgetPreferences: [
        { memberId: "me", amount: 5000 },
        { memberId: "r1", amount: 5000 },
      ],
    });
    render(<TabBudget squad={squad} onUpdate={onUpdate} />);
    expect(screen.queryByText("Conflict")).not.toBeInTheDocument();
  });

  it("shows recommended budget average", () => {
    const squad = makeSquad({
      budgetPreferences: [
        { memberId: "me", amount: 4000 },
        { memberId: "r1", amount: 6000 },
      ],
    });
    render(<TabBudget squad={squad} onUpdate={onUpdate} />);
    expect(screen.getByText("₹5,000")).toBeInTheDocument();
  });

  it("shows lock button when >=50% participation and >1 preference", () => {
    const squad = makeSquad({
      budgetPreferences: [
        { memberId: "me", amount: 5000 },
        { memberId: "r1", amount: 5000 },
      ],
    });
    render(<TabBudget squad={squad} onUpdate={onUpdate} />);
    expect(screen.getByText(/Lock Budget/)).toBeInTheDocument();
  });

  it("does not show lock button with <=1 preference", () => {
    const squad = makeSquad({
      budgetPreferences: [{ memberId: "me", amount: 5000 }],
    });
    render(<TabBudget squad={squad} onUpdate={onUpdate} />);
    expect(screen.queryByText(/Lock Budget/)).not.toBeInTheDocument();
  });

  it("locks budget at average", () => {
    const squad = makeSquad({
      budgetPreferences: [
        { memberId: "me", amount: 4000 },
        { memberId: "r1", amount: 6000 },
      ],
    });
    render(<TabBudget squad={squad} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText(/Lock Budget/));
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.lockedBudget).toBe(5000);
  });

  it("unlocks budget", () => {
    const squad = makeSquad({ lockedBudget: 5000 });
    render(<TabBudget squad={squad} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Unlock"));
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.lockedBudget).toBeUndefined();
  });

  it("disables input when locked", () => {
    const squad = makeSquad({ lockedBudget: 5000 });
    render(<TabBudget squad={squad} onUpdate={onUpdate} />);
    expect(screen.getByRole("spinbutton")).toBeDisabled();
  });
});
