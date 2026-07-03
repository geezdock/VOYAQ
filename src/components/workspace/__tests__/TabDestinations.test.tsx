import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TabDestinations } from "@/components/workspace/steps/TabDestinations";
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
    destinations: ["Goa", "Manali"],
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

describe("TabDestinations", () => {
  const onUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders destination names", () => {
    render(<TabDestinations squad={makeSquad()} onUpdate={onUpdate} />);
    expect(screen.getByText("Goa")).toBeInTheDocument();
    expect(screen.getByText("Manali")).toBeInTheDocument();
  });

  it("casts a vote for a destination", () => {
    render(<TabDestinations squad={makeSquad()} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Goa"));
    expect(onUpdate).toHaveBeenCalled();
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.votes).toContainEqual({ memberId: "me", destination: "Goa" });
  });

  it("changes existing vote to different destination", () => {
    const squad = makeSquad({ votes: [{ memberId: "me", destination: "Manali" }] });
    render(<TabDestinations squad={squad} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Goa"));
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.votes).toContainEqual({ memberId: "me", destination: "Goa" });
  });

  it("shows vote counts", () => {
    const squad = makeSquad({
      votes: [
        { memberId: "me", destination: "Goa" },
        { memberId: "r1", destination: "Goa" },
      ],
    });
    render(<TabDestinations squad={squad} onUpdate={onUpdate} />);
    const voteCounts = screen.getAllByText("2");
    expect(voteCounts.length).toBeGreaterThanOrEqual(1);
  });

  it("shows lock button when leading has >=50% of members", () => {
    const squad = makeSquad({
      votes: [
        { memberId: "me", destination: "Goa" },
        { memberId: "r1", destination: "Goa" },
      ],
    });
    render(<TabDestinations squad={squad} onUpdate={onUpdate} />);
    expect(screen.getByText(/Lock Goa/)).toBeInTheDocument();
  });

  it("does not show lock button when votes are <50% of members", () => {
    const squad = makeSquad({
      members: [
        { id: "me", name: "You", initial: "Y", color: "bg-accent", verified: true, joinedAt: "2026-01-01" },
        { id: "r1", name: "Rahul", initial: "R", color: "bg-red", verified: true, joinedAt: "2026-01-01" },
        { id: "a1", name: "Ananya", initial: "A", color: "bg-blue", verified: true, joinedAt: "2026-01-01" },
      ],
      votes: [{ memberId: "me", destination: "Goa" }],
    });
    render(<TabDestinations squad={squad} onUpdate={onUpdate} />);
    expect(screen.queryByText(/Lock/)).not.toBeInTheDocument();
  });

  it("locks destination", () => {
    const squad = makeSquad({
      votes: [
        { memberId: "me", destination: "Goa" },
        { memberId: "r1", destination: "Goa" },
      ],
    });
    render(<TabDestinations squad={squad} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText(/Lock Goa/));
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.lockedDestination).toBe("Goa");
  });

  it("unlocks destination", () => {
    const squad = makeSquad({ lockedDestination: "Goa" });
    render(<TabDestinations squad={squad} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Unlock"));
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.lockedDestination).toBeUndefined();
  });

  it("adds new destination via Enter key", () => {
    render(<TabDestinations squad={makeSquad()} onUpdate={onUpdate} />);
    const input = screen.getByPlaceholderText("Add destination...");
    fireEvent.change(input, { target: { value: "Pondicherry" } });
    fireEvent.keyDown(input, { key: "Enter" });
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.destinations).toContain("Pondicherry");
  });

  it("removes a destination via X button", () => {
    render(<TabDestinations squad={makeSquad()} onUpdate={onUpdate} />);
    const removeButtons = screen.getAllByRole("button").filter(
      (btn) => btn.querySelector(".lucide-x")
    );
    fireEvent.click(removeButtons[0]);
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.destinations.length).toBe(1);
  });

  it("disables voting when locked", () => {
    const squad = makeSquad({ lockedDestination: "Goa" });
    render(<TabDestinations squad={squad} onUpdate={onUpdate} />);
    const lockedBtn = screen.getAllByText("Goa").find(
      (el) => el.tagName === "BUTTON"
    );
    fireEvent.click(lockedBtn!);
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("hides add destination form when locked", () => {
    const squad = makeSquad({ lockedDestination: "Goa" });
    render(<TabDestinations squad={squad} onUpdate={onUpdate} />);
    expect(screen.queryByPlaceholderText("Add destination...")).not.toBeInTheDocument();
  });
});
