import { type Page } from "@playwright/test";

export async function stripNextDevTools(page: Page) {
  await page.addInitScript(() => {
    const purge = () => {
      document.querySelectorAll("nextjs-portal").forEach((el) => el.remove());
      document.querySelectorAll("[data-nextjs-dev-tools-button]").forEach((el) => el.remove());
      const logo = document.getElementById("next-logo");
      if (logo) logo.remove();
    };
    purge();
    setInterval(purge, 250);
    new MutationObserver(purge).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });
}

export async function waitForDevToolsStripped(page: Page) {
  await page.waitForFunction(() => {
    const hasPortal = document.querySelectorAll("nextjs-portal").length > 0;
    const hasButton = document.querySelectorAll("[data-nextjs-dev-tools-button]").length > 0;
    return !hasPortal && !hasButton;
  });
}

export async function settleAnimations(page: Page, ms = 1600) {
  await page.waitForTimeout(ms);
}

export async function mockSupabaseSession(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      "voyaq_dev_user",
      JSON.stringify({ id: "mock-user-id", display_name: "Test User" }),
    );
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

export async function seedMockSquad(page: Page, squad = MOCK_SQUAD) {
  await page.addInitScript((s) => {
    localStorage.setItem("voyaq_squads_v1", JSON.stringify([s]));
    localStorage.setItem("voyaq_pending_mutations", JSON.stringify([]));
  }, squad);
}

export const MOCK_SQUAD = {
  id: "test-squad-1",
  name: "Goa Crew",
  destination: "Goa",
  createdBy: "mock-user-id",
  lockedDestination: "Goa",
  budgetPerPerson: 15000,
  lockedBudget: 15000,
  lockedDates: { start: "2026-08-15", end: "2026-08-18" },
  memberLimit: 5,
  members: [
    { id: "user-1", name: "Alice", initial: "A", color: "bg-blue-500", upiId: "alice@upi", verified: true, joinedAt: new Date().toISOString() },
    { id: "user-2", name: "Bob", initial: "B", color: "bg-green-500", verified: true, joinedAt: new Date().toISOString() },
    { id: "user-3", name: "Charlie", initial: "C", color: "bg-purple-500", verified: false, joinedAt: new Date().toISOString() },
  ],
  inviteCode: "goa-trip-abc",
  status: "booked",
  createdAt: new Date().toISOString(),
  destinations: ["Goa", "Manali"],
  votes: [
    { memberId: "user-1", destination: "Goa" },
    { memberId: "user-2", destination: "Goa" },
    { memberId: "user-3", destination: "Manali" },
  ],
  budgetPreferences: [
    { memberId: "user-1", amount: 15000 },
    { memberId: "user-2", amount: 12000 },
  ],
  dateProposals: [],
  polls: [],
  expenses: [],
};
