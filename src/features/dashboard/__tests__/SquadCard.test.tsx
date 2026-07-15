import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SquadCard } from "@/features/dashboard/components/SquadCard";
import type { Squad } from "@/types/squad";

function makeSquad(overrides: Partial<Squad> = {}): Squad {
  return {
    id: "squad-1",
    name: "Goa Crew",
    inviteCode: "goa-trip",
    createdBy: "me",
    destinations: ["Goa", "Manali"],
    members: [
      { id: "me", name: "You", initial: "Y", color: "bg-accent", verified: true, joinedAt: "2026-01-01" },
    ],
    memberLimit: 8,
    votes: [],
    budgetPerPerson: 5000,
    budgetPreferences: [],
    dateProposals: [],
    polls: [],
    status: "planning",
    createdAt: "2026-01-01",
    ...overrides,
  };
}

describe("SquadCard", () => {
  const onSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders squad name and destination", () => {
    render(<SquadCard squad={makeSquad()} onSelect={onSelect} />);
    expect(screen.getByText("Goa Crew")).toBeInTheDocument();
    expect(screen.getByText("Goa")).toBeInTheDocument();
  });

  it("shows status badge for planning", () => {
    render(<SquadCard squad={makeSquad()} onSelect={onSelect} />);
    expect(screen.getByText("Planning")).toBeInTheDocument();
  });

  it("shows status badge for booked", () => {
    render(<SquadCard squad={makeSquad({ status: "booked" })} onSelect={onSelect} />);
    expect(screen.getByText("Booked")).toBeInTheDocument();
  });

  it("calls onSelect with squad id on click", () => {
    render(<SquadCard squad={makeSquad()} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenCalledWith("squad-1");
  });

  it("shows member count", () => {
    render(<SquadCard squad={makeSquad()} onSelect={onSelect} />);
    expect(screen.getByText("1 / 8 members")).toBeInTheDocument();
  });
});
