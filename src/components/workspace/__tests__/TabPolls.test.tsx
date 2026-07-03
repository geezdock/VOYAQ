import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TabPolls } from "@/components/workspace/steps/TabPolls";
import type { Squad, Poll } from "@/types/squad";

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
    destinations: [],
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

describe("TabPolls", () => {
  const onUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty state", () => {
    render(<TabPolls squad={makeSquad()} onUpdate={onUpdate} />);
    expect(screen.getByText("No polls yet. Create one to get the group talking.")).toBeInTheDocument();
  });

  it("shows create button", () => {
    render(<TabPolls squad={makeSquad()} onUpdate={onUpdate} />);
    expect(screen.getByText("New Poll")).toBeInTheDocument();
  });

  it("shows create form when new poll clicked", () => {
    render(<TabPolls squad={makeSquad()} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("New Poll"));
    expect(screen.getByPlaceholderText("Ask a question...")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Option 1")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Option 2")).toBeInTheDocument();
  });

  it("adds new option", () => {
    render(<TabPolls squad={makeSquad()} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("New Poll"));
    fireEvent.click(screen.getByText("+ Add option"));
    expect(screen.getByPlaceholderText("Option 3")).toBeInTheDocument();
  });

  it("removes option when more than 2 exist", () => {
    render(<TabPolls squad={makeSquad()} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("New Poll"));
    fireEvent.click(screen.getByText("+ Add option"));
    const removeButtons = screen.getAllByRole("button").filter(
      (btn) => btn.querySelector("svg")?.classList.contains("lucide-x")
    );
    expect(removeButtons.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(removeButtons[0]);
    expect(screen.queryByPlaceholderText("Option 3")).not.toBeInTheDocument();
  });

  it("creates poll with 2 options", () => {
    render(<TabPolls squad={makeSquad()} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("New Poll"));
    fireEvent.change(screen.getByPlaceholderText("Ask a question..."), {
      target: { value: "Best destination?" },
    });
    fireEvent.change(screen.getByPlaceholderText("Option 1"), {
      target: { value: "Goa" },
    });
    fireEvent.change(screen.getByPlaceholderText("Option 2"), {
      target: { value: "Manali" },
    });
    fireEvent.click(screen.getByText("Create Poll"));
    expect(onUpdate).toHaveBeenCalled();
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.polls).toHaveLength(1);
    expect(updated.polls[0].question).toBe("Best destination?");
    expect(updated.polls[0].options).toHaveLength(2);
  });

  it("does not create poll with empty question", () => {
    render(<TabPolls squad={makeSquad()} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("New Poll"));
    fireEvent.change(screen.getByPlaceholderText("Option 1"), { target: { value: "Goa" } });
    fireEvent.change(screen.getByPlaceholderText("Option 2"), { target: { value: "Manali" } });
    fireEvent.click(screen.getByText("Create Poll"));
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("does not create poll with fewer than 2 filled options", () => {
    render(<TabPolls squad={makeSquad()} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("New Poll"));
    fireEvent.change(screen.getByPlaceholderText("Ask a question..."), {
      target: { value: "Question?" },
    });
    fireEvent.change(screen.getByPlaceholderText("Option 1"), { target: { value: "Goa" } });
    fireEvent.click(screen.getByText("Create Poll"));
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("displays existing polls", () => {
    const poll: Poll = {
      id: "poll-1",
      question: "Best food?",
      options: [
        { id: "opt-1", label: "Vada Pav", votes: [] },
        { id: "opt-2", label: "Biryani", votes: [] },
      ],
      createdBy: "me",
      createdAt: "2026-01-01",
    };
    const squad = makeSquad({ polls: [poll] });
    render(<TabPolls squad={squad} onUpdate={onUpdate} />);
    expect(screen.getByText("Best food?")).toBeInTheDocument();
    expect(screen.getByText("Vada Pav")).toBeInTheDocument();
    expect(screen.getByText("Biryani")).toBeInTheDocument();
  });

  it("votes on poll option", () => {
    const poll: Poll = {
      id: "poll-1",
      question: "Best food?",
      options: [
        { id: "opt-1", label: "Vada Pav", votes: [] },
        { id: "opt-2", label: "Biryani", votes: [] },
      ],
      createdBy: "me",
      createdAt: "2026-01-01",
    };
    const squad = makeSquad({ polls: [poll] });
    render(<TabPolls squad={squad} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Vada Pav"));
    const updated = onUpdate.mock.calls[0][0];
    const votedOpt = updated.polls[0].options.find((o: { id: string }) => o.id === "opt-1");
    expect(votedOpt.votes).toContain("me");
  });

  it("removes vote when clicking same option", () => {
    const poll: Poll = {
      id: "poll-1",
      question: "Best food?",
      options: [
        { id: "opt-1", label: "Vada Pav", votes: ["me"] },
        { id: "opt-2", label: "Biryani", votes: [] },
      ],
      createdBy: "me",
      createdAt: "2026-01-01",
    };
    const squad = makeSquad({ polls: [poll] });
    render(<TabPolls squad={squad} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Vada Pav"));
    const updated = onUpdate.mock.calls[0][0];
    const votedOpt = updated.polls[0].options.find((o: { id: string }) => o.id === "opt-1");
    expect(votedOpt.votes).not.toContain("me");
  });

  it("exclusive voting removes vote from other option", () => {
    const poll: Poll = {
      id: "poll-1",
      question: "Best food?",
      options: [
        { id: "opt-1", label: "Vada Pav", votes: ["me"] },
        { id: "opt-2", label: "Biryani", votes: [] },
      ],
      createdBy: "me",
      createdAt: "2026-01-01",
    };
    const squad = makeSquad({ polls: [poll] });
    render(<TabPolls squad={squad} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText("Biryani"));
    const updated = onUpdate.mock.calls[0][0];
    const opt1 = updated.polls[0].options.find((o: { id: string }) => o.id === "opt-1");
    const opt2 = updated.polls[0].options.find((o: { id: string }) => o.id === "opt-2");
    expect(opt1.votes).not.toContain("me");
    expect(opt2.votes).toContain("me");
  });

  it("shows total vote count", () => {
    const poll: Poll = {
      id: "poll-1",
      question: "Best food?",
      options: [
        { id: "opt-1", label: "Vada Pav", votes: ["me", "r1"] },
        { id: "opt-2", label: "Biryani", votes: ["r1"] },
      ],
      createdBy: "me",
      createdAt: "2026-01-01",
    };
    const squad = makeSquad({ polls: [poll] });
    render(<TabPolls squad={squad} onUpdate={onUpdate} />);
    expect(screen.getByText("3 votes")).toBeInTheDocument();
  });

  it("deletes poll", () => {
    const poll: Poll = {
      id: "poll-1",
      question: "Best food?",
      options: [
        { id: "opt-1", label: "Vada Pav", votes: [] },
        { id: "opt-2", label: "Biryani", votes: [] },
      ],
      createdBy: "me",
      createdAt: "2026-01-01",
    };
    const squad = makeSquad({ polls: [poll] });
    render(<TabPolls squad={squad} onUpdate={onUpdate} />);
    const deleteBtn = screen.getByRole("button", { name: "" });
    fireEvent.click(deleteBtn);
    const updated = onUpdate.mock.calls[0][0];
    expect(updated.polls).toHaveLength(0);
  });
});
