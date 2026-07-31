import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExpenseTracker } from "../components/ExpenseTracker";
import type { Squad } from "@/types/squad";

const { useExpensesMock } = vi.hoisted(() => ({
  useExpensesMock: vi.fn(),
}));

vi.mock("@/shared/providers/SquadContext", () => ({
  useSquad: () => ({ updateMember: vi.fn() }),
}));

vi.mock("../hooks/useExpenses", () => ({
  useExpenses: useExpensesMock,
}));

vi.mock("../components/AddExpenseForm", () => ({
  AddExpenseForm: () => <div data-testid="add-expense-form" />,
}));

vi.mock("../components/ExpenseList", () => ({
  ExpenseList: () => <div data-testid="expense-list" />,
}));

vi.mock("../components/SettlementMatrix", () => ({
  SettlementMatrix: () => <div data-testid="settlement-matrix" />,
}));

vi.mock("../components/PerPersonBreakdown", () => ({
  PerPersonBreakdown: () => <div data-testid="per-person-breakdown" />,
}));

function makeSquad(overrides: Partial<Squad> = {}): Squad {
  return {
    id: "squad-1",
    name: "Goa Crew",
    inviteCode: "goa-trip-abc",
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

describe("ExpenseTracker", () => {
  const onBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useExpensesMock.mockReturnValue({
      expenses: [],
      summary: {
        totalSpent: 0,
        perPerson: 0,
        memberBalances: {},
        settlements: [],
      },
      loading: false,
      error: null,
      addExpense: vi.fn(),
      removeExpense: vi.fn(),
      clearExpenses: vi.fn(),
    });
  });

  it("renders the header, back button, and squad summary", () => {
    render(<ExpenseTracker squad={makeSquad()} onBack={onBack} />);
    expect(screen.getByRole("button", { name: /trip/i })).toBeInTheDocument();
    expect(screen.getByText(/Goa Crew — Expense Summary/)).toBeInTheDocument();
    expect(screen.getByText("Expenses (0)")).toBeInTheDocument();
    expect(screen.getByTestId("add-expense-form")).toBeInTheDocument();
    expect(screen.getByTestId("settlement-matrix")).toBeInTheDocument();
  });

  it("calls onBack when back button clicked", () => {
    render(<ExpenseTracker squad={makeSquad()} onBack={onBack} />);
    fireEvent.click(screen.getByRole("button", { name: /trip/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("does not show Clear All when there are no expenses", () => {
    render(<ExpenseTracker squad={makeSquad()} onBack={onBack} />);
    expect(screen.queryByRole("button", { name: /clear all/i })).not.toBeInTheDocument();
  });

  it("shows Clear All and balance sections when expenses exist", () => {
    useExpensesMock.mockReturnValue({
      expenses: [
        { id: "e1", description: "Boat ride", amount: 500, paidBy: "me", splitAmong: ["me"], date: "2026-08-15", category: "activities", createdAt: "2026-08-15" },
      ],
      summary: {
        totalSpent: 500,
        perPerson: 500,
        memberBalances: { me: 500 },
        settlements: [],
      },
      loading: false,
      error: null,
      addExpense: vi.fn(),
      removeExpense: vi.fn(),
      clearExpenses: vi.fn(),
    });
    render(<ExpenseTracker squad={makeSquad()} onBack={onBack} />);
    expect(screen.getByText("Expenses (1)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear all/i })).toBeInTheDocument();
    expect(screen.getByTestId("per-person-breakdown")).toBeInTheDocument();
  });

  it("calls clearExpenses when Clear All clicked", () => {
    const clearExpenses = vi.fn();
    useExpensesMock.mockReturnValue({
      expenses: [
        { id: "e1", description: "Boat ride", amount: 500, paidBy: "me", splitAmong: ["me"], date: "2026-08-15", category: "activities", createdAt: "2026-08-15" },
      ],
      summary: {
        totalSpent: 500,
        perPerson: 500,
        memberBalances: { me: 500 },
        settlements: [],
      },
      loading: false,
      error: null,
      addExpense: vi.fn(),
      removeExpense: vi.fn(),
      clearExpenses,
    });
    render(<ExpenseTracker squad={makeSquad()} onBack={onBack} />);
    fireEvent.click(screen.getByRole("button", { name: /clear all/i }));
    expect(clearExpenses).toHaveBeenCalledTimes(1);
  });
});
