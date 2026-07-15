import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { SquadGrid } from "@/features/dashboard/components/SquadGrid";
import type { Squad } from "@/types/squad";

function makeSquad(id: string, name: string): Squad {
  return {
    id,
    name,
    inviteCode: `code-${id}`,
    createdBy: "me",
    destinations: [],
    members: [{ id: "me", name: "You", initial: "Y", color: "bg-accent", verified: true, joinedAt: "2026-01-01" }],
    memberLimit: 8,
    votes: [],
    budgetPerPerson: 0,
    budgetPreferences: [],
    dateProposals: [],
    polls: [],
    status: "planning",
    createdAt: "2026-01-01",
  };
}

describe("SquadGrid", () => {
  const onSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all squads", () => {
    const squads = [makeSquad("1", "Goa"), makeSquad("2", "Manali")];
    render(<SquadGrid squads={squads} onSelect={onSelect} />);
    expect(screen.getByText("Goa")).toBeInTheDocument();
    expect(screen.getByText("Manali")).toBeInTheDocument();
  });

  it("renders empty grid for empty array", () => {
    const { container } = render(<SquadGrid squads={[]} onSelect={onSelect} />);
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.queryByText("Goa")).not.toBeInTheDocument();
  });
});
