import { type Page } from "@playwright/test";

export async function mockSupabaseSession(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      "sb-session",
      JSON.stringify({
        access_token: "mock-token",
        user: {
          id: "mock-user-id",
          email: "test@voyaq.app",
          user_metadata: { name: "Test User" },
        },
      }),
    );
  });
}

export const MOCK_SQUAD = {
  id: "test-squad-1",
  name: "Goa Crew",
  destination: "Goa",
  lockedDestination: "Goa",
  budgetPerPerson: 15000,
  lockedBudget: 15000,
  lockedDates: { start: "2026-08-15", end: "2026-08-18" },
  memberLimit: 5,
  members: [
    { id: "user-1", name: "Alice", initial: "A", color: "bg-blue-500", upiId: "alice@upi" },
    { id: "user-2", name: "Bob", initial: "B", color: "bg-green-500" },
    { id: "user-3", name: "Charlie", initial: "C", color: "bg-purple-500" },
  ],
  inviteCode: "goa-trip-abc",
  status: "booked",
  createdAt: Date.now(),
  destinations: ["Goa", "Manali"],
  destinationVotes: { "Goa": ["user-1", "user-2"], "Manali": ["user-3"] },
  dateProposals: [],
  dateVotes: {},
  budgetPreferences: { "user-1": 15000, "user-2": 12000 },
  polls: [],
  expenses: [],
};
