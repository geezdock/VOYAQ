import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CreateSquadModal } from "@/components/dashboard/CreateSquadModal";

vi.mock("@/lib/SquadContext", () => ({
  useSquad: () => ({
    currentUserId: "me",
  }),
}));

describe("CreateSquadModal", () => {
  const onClose = vi.fn();
  const onCreated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when closed", () => {
    render(<CreateSquadModal open={false} onClose={onClose} onCreated={onCreated} />);
    expect(screen.queryByText("Create a Squad")).not.toBeInTheDocument();
  });

  it("renders form when open", () => {
    render(<CreateSquadModal open={true} onClose={onClose} onCreated={onCreated} />);
    expect(screen.getByText("Create a Squad")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Goa Crew 2026")).toBeInTheDocument();
    expect(screen.getByText("Launch Squad")).toBeInTheDocument();
  });

  it("shows error for empty squad name", () => {
    render(<CreateSquadModal open={true} onClose={onClose} onCreated={onCreated} />);
    fireEvent.click(screen.getByText("Launch Squad"));
    expect(screen.getByText("Enter a squad name")).toBeInTheDocument();
    expect(onCreated).not.toHaveBeenCalled();
  });

  it("creates squad with name only", () => {
    render(<CreateSquadModal open={true} onClose={onClose} onCreated={onCreated} />);
    fireEvent.change(screen.getByPlaceholderText("Goa Crew 2026"), { target: { value: "Test Squad" } });
    fireEvent.click(screen.getByText("Launch Squad"));
    expect(onCreated).toHaveBeenCalled();
    const squad = onCreated.mock.calls[0][0];
    expect(squad.name).toBe("Test Squad");
    expect(squad.members).toHaveLength(1);
    expect(squad.members[0].id).toBe("me");
    expect(squad.status).toBe("planning");
  });

  it("creates squad with destination", () => {
    render(<CreateSquadModal open={true} onClose={onClose} onCreated={onCreated} />);
    fireEvent.change(screen.getByPlaceholderText("Goa Crew 2026"), { target: { value: "Goa Trip" } });
    fireEvent.change(screen.getByPlaceholderText("Goa, Manali, Pondicherry..."), { target: { value: "Goa" } });
    fireEvent.click(screen.getByText("Launch Squad"));
    const squad = onCreated.mock.calls[0][0];
    expect(squad.destination).toBe("Goa");
    expect(squad.destinations).toEqual(["Goa"]);
  });

  it("generates invite code from name", () => {
    render(<CreateSquadModal open={true} onClose={onClose} onCreated={onCreated} />);
    fireEvent.change(screen.getByPlaceholderText("Goa Crew 2026"), { target: { value: "My Squad" } });
    fireEvent.click(screen.getByText("Launch Squad"));
    const squad = onCreated.mock.calls[0][0];
    expect(squad.inviteCode).toMatch(/^my-squad-/);
  });

  it("calls onClose when X button clicked", () => {
    render(<CreateSquadModal open={true} onClose={onClose} onCreated={onCreated} />);
    const xButton = document.querySelector(".lucide-x")?.closest("button");
    fireEvent.click(xButton!);
    expect(onClose).toHaveBeenCalled();
  });
});
