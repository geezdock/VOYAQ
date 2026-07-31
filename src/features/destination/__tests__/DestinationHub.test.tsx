import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DestinationHub } from "../components/DestinationHub";
import type { Squad } from "@/types/squad";

vi.mock("next/dynamic", () => ({
  default: () => {
    function MockDynamic() {
      return <div data-testid="hub-tab-content">lazy</div>;
    }
    return MockDynamic;
  },
}));

function makeSquad(overrides: Partial<Squad> = {}): Squad {
  return {
    id: "squad-1",
    name: "Goa Crew",
    inviteCode: "goa-trip-abc",
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

function getArrows() {
  const buttons = screen.getAllByRole("button") as HTMLButtonElement[];
  return { prev: buttons[buttons.length - 2], next: buttons[buttons.length - 1] };
}

describe("DestinationHub", () => {
  const onBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the destination name and back button", () => {
    render(<DestinationHub squad={makeSquad()} onBack={onBack} />);
    expect(screen.getByRole("heading", { level: 1, name: "Goa" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /trip/i })).toBeInTheDocument();
  });

  it("renders all 15 tabs with Overview active first", () => {
    render(<DestinationHub squad={makeSquad()} onBack={onBack} />);
    expect(screen.getByRole("button", { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /book travel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^stay$/i })).toBeInTheDocument();
    expect(screen.getByText("1 / 15")).toBeInTheDocument();
  });

  it("clicks a tab to activate it", () => {
    render(<DestinationHub squad={makeSquad()} onBack={onBack} />);
    fireEvent.click(screen.getByRole("button", { name: /book travel/i }));
    expect(screen.getByText("14 / 15")).toBeInTheDocument();
  });

  it("navigates with next and prev arrows", () => {
    render(<DestinationHub squad={makeSquad()} onBack={onBack} />);
    const { prev, next } = getArrows();
    expect(prev.disabled).toBeTruthy();
    fireEvent.click(next);
    expect(screen.getByText("2 / 15")).toBeInTheDocument();
    expect(screen.queryByText("1 / 15")).not.toBeInTheDocument();
    const { prev: prevAfter, next: nextAfter } = getArrows();
    expect(prevAfter.disabled).toBeFalsy();
    fireEvent.click(prevAfter);
    expect(screen.getByText("1 / 15")).toBeInTheDocument();
    expect(nextAfter.disabled).toBeFalsy();
  });

  it("disables the next arrow on the last tab", () => {
    render(<DestinationHub squad={makeSquad()} onBack={onBack} />);
    fireEvent.click(screen.getByRole("button", { name: /^stay$/i }));
    const { next } = getArrows();
    expect(next.disabled).toBeTruthy();
  });

  it("calls onBack when back button clicked", () => {
    render(<DestinationHub squad={makeSquad()} onBack={onBack} />);
    fireEvent.click(screen.getByRole("button", { name: /trip/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("shows no-destination state when no destination is selected", () => {
    render(
      <DestinationHub
        squad={makeSquad({
          destination: null as unknown as string,
          lockedDestination: null as unknown as string | undefined,
        })}
        onBack={onBack}
      />,
    );
    expect(screen.getByText("No destination selected")).toBeInTheDocument();
  });
});
