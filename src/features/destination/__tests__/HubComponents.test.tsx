import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { HubFood } from "../components/Food/HubFood";
import { HubPlaces } from "../components/Places/HubPlaces";
import { HubEvents } from "../components/Events/HubEvents";
import { HubTransport } from "../components/Transport/HubTransport";
import { HubBudget } from "../components/Budget/HubBudget";
import type { Squad } from "@/types/squad";

const mockFood = [
  { name: "Test Dish", description: "A test dish", category: "Main", priceRange: "₹200", tags: ["spicy"], restaurant: "Test Cafe" },
];

const mockAttractions = [
  { name: "Test Beach", description: "A test beach", category: "Beach", approximateCost: 0, duration: "2 hrs", bestTime: "Morning" },
];

const mockEvents = [
  { name: "Test Fest", date: "2026-08-15", description: "A test festival", venue: "Test Venue", category: "Cultural" },
];

const mockTransport = [
  { mode: "Bus", from: "City A", to: "City B", cost: 500, duration: "4 hrs", details: "AC bus available" },
];

const mockBudget = [
  { category: "Food", estimatedCost: 1000, notes: "Per day" },
  { category: "Stay", estimatedCost: 2000, notes: "Per night" },
];

const { getPlacesFoodMock, getPlacesAttractionsMock, getEventsMock, getTransportMock, getBudgetInsightsMock } = vi.hoisted(() => ({
  getPlacesFoodMock: vi.fn(),
  getPlacesAttractionsMock: vi.fn(),
  getEventsMock: vi.fn(),
  getTransportMock: vi.fn(),
  getBudgetInsightsMock: vi.fn(),
}));

vi.mock("@/actions/data", () => ({
  getPlaces: (_dest: string, type: string) => (type === "food" ? getPlacesFoodMock() : getPlacesAttractionsMock()),
  getEvents: getEventsMock,
  getTransport: getTransportMock,
  getBudgetInsights: getBudgetInsightsMock,
}));

function makeSquad(overrides: Partial<Squad> = {}): Squad {
  return {
    id: "squad-1",
    name: "Test Squad",
    inviteCode: "test",
    createdBy: "me",
    destinations: ["Goa"],
    members: [],
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

describe("HubFood", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("shows loading state", () => {
    getPlacesFoodMock.mockReturnValue(new Promise(() => {}));
    render(<HubFood destinationName="goa" />);
    expect(screen.getByTestId("hub-skeleton")).toBeInTheDocument();
  });

  it("shows empty state when no results", async () => {
    getPlacesFoodMock.mockResolvedValue({ items: [] });
    render(<HubFood destinationName="goa" />);
    await waitFor(() => expect(screen.getByText("No restaurants found nearby")).toBeInTheDocument());
  });

  it("shows error state with retry button", async () => {
    getPlacesFoodMock.mockResolvedValue(null);
    render(<HubFood destinationName="goa" />);
    await waitFor(() => expect(screen.getByText("Failed to load restaurants")).toBeInTheDocument());
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("renders food items on success", async () => {
    getPlacesFoodMock.mockResolvedValue({ items: mockFood });
    render(<HubFood destinationName="goa" />);
    await waitFor(() => expect(screen.getByText("Test Dish")).toBeInTheDocument());
    expect(screen.getByText("Test Cafe")).toBeInTheDocument();
    expect(screen.getByText("₹200")).toBeInTheDocument();
  });

  it("retry button re-fetches", async () => {
    getPlacesFoodMock.mockResolvedValueOnce(null).mockResolvedValueOnce({ items: mockFood });
    render(<HubFood destinationName="goa" />);
    await waitFor(() => expect(screen.getByText("Failed to load restaurants")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Retry"));
    await waitFor(() => expect(screen.getByText("Test Dish")).toBeInTheDocument());
    expect(getPlacesFoodMock).toHaveBeenCalledTimes(2);
  });
});

describe("HubPlaces", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("shows loading state", () => {
    getPlacesAttractionsMock.mockReturnValue(new Promise(() => {}));
    render(<HubPlaces destinationName="goa" />);
    expect(screen.getByTestId("hub-skeleton")).toBeInTheDocument();
  });

  it("shows error state with retry", async () => {
    getPlacesAttractionsMock.mockResolvedValue(null);
    render(<HubPlaces destinationName="goa" />);
    await waitFor(() => expect(screen.getByText("Failed to load attractions")).toBeInTheDocument());
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("renders attractions grouped by category", async () => {
    getPlacesAttractionsMock.mockResolvedValue({ attractions: mockAttractions });
    render(<HubPlaces destinationName="goa" />);
    await waitFor(() => expect(screen.getByText("Test Beach")).toBeInTheDocument());
    expect(screen.getByText("Beach")).toBeInTheDocument();
  });
});

describe("HubEvents", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("shows loading state", () => {
    getEventsMock.mockReturnValue(new Promise(() => {}));
    render(<HubEvents destinationName="goa" />);
    expect(screen.getByTestId("hub-skeleton")).toBeInTheDocument();
  });

  it("shows empty state", async () => {
    getEventsMock.mockResolvedValue({ events: [] });
    render(<HubEvents destinationName="goa" />);
    await waitFor(() => expect(screen.getByText("No upcoming events found")).toBeInTheDocument());
  });

  it("renders events on success", async () => {
    getEventsMock.mockResolvedValue({ events: mockEvents });
    render(<HubEvents destinationName="goa" />);
    await waitFor(() => expect(screen.getByText("Test Fest")).toBeInTheDocument());
    expect(screen.getByText("Test Venue")).toBeInTheDocument();
  });
});

describe("HubTransport", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("shows loading state", () => {
    getTransportMock.mockReturnValue(new Promise(() => {}));
    render(<HubTransport destinationName="goa" />);
    expect(screen.getByTestId("hub-skeleton")).toBeInTheDocument();
  });

  it("shows error state with retry", async () => {
    getTransportMock.mockResolvedValue(null);
    render(<HubTransport destinationName="goa" />);
    await waitFor(() => expect(screen.getByText("Failed to load transport options")).toBeInTheDocument());
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("renders transport options on success", async () => {
    getTransportMock.mockResolvedValue({ options: mockTransport });
    render(<HubTransport destinationName="goa" />);
    await waitFor(() => expect(screen.getByText("Bus")).toBeInTheDocument());
    expect(screen.getByText("AC bus available")).toBeInTheDocument();
  });
});

describe("HubBudget", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("shows loading state", () => {
    getBudgetInsightsMock.mockReturnValue(new Promise(() => {}));
    render(<HubBudget destinationName="goa" squad={makeSquad({ lockedBudget: 5000 })} />);
    expect(screen.getByText("Loading budget insights...")).toBeInTheDocument();
  });

  it("shows error state with retry", async () => {
    getBudgetInsightsMock.mockResolvedValue(null);
    render(<HubBudget destinationName="goa" squad={makeSquad({ lockedBudget: 5000 })} />);
    await waitFor(() => expect(screen.getByText("Failed to load budget insights")).toBeInTheDocument());
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("renders budget breakdown on success", async () => {
    getBudgetInsightsMock.mockResolvedValue({ insights: mockBudget });
    render(<HubBudget destinationName="goa" squad={makeSquad({ lockedBudget: 5000 })} />);
    await waitFor(() => expect(screen.getByText("Budget Breakdown")).toBeInTheDocument());
    expect(screen.getByText("₹1,000")).toBeInTheDocument();
    expect(screen.getAllByText("₹2,000").length).toBe(2);
  });

  it("shows over budget state", async () => {
    getBudgetInsightsMock.mockResolvedValue({ insights: mockBudget });
    render(<HubBudget destinationName="goa" squad={makeSquad({ lockedBudget: 2000 })} />);
    await waitFor(() => expect(screen.getByText("Budget Breakdown")).toBeInTheDocument());
    expect(screen.getByText(/-₹1,000/)).toBeInTheDocument();
  });
});