import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TabSquad } from "@/components/workspace/steps/TabSquad";
import type { Squad } from "@/types/squad";

vi.mock("@/lib/SquadContext", () => ({
  useSquad: () => ({
    isMe: (id: string) => id === "me",
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

describe("TabSquad", () => {
  const onUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows all squad members", () => {
    render(<TabSquad squad={makeSquad()} onUpdate={onUpdate} />);
    const youElements = screen.getAllByText("You");
    expect(youElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Rahul")).toBeInTheDocument();
  });

  it("shows invite code", () => {
    render(<TabSquad squad={makeSquad()} onUpdate={onUpdate} />);
    expect(screen.getByText(/test-abc1/)).toBeInTheDocument();
  });

  it("removes other member when remove clicked", () => {
    render(<TabSquad squad={makeSquad()} onUpdate={onUpdate} />);
    const removeButtons = screen.getAllByTitle(/Remove/);
    fireEvent.click(removeButtons[0]);
    expect(onUpdate).toHaveBeenCalled();
    const updated: Squad = onUpdate.mock.calls[0][0];
    expect(updated.members.length).toBe(1);
  });
});
