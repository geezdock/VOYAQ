export interface ExpenseEntry {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitAmong: string[];
  date: string;
  category: "food" | "transport" | "stay" | "activities" | "other";
  createdAt: string;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export interface ExpenseSummary {
  totalSpent: number;
  perPerson: number;
  memberBalances: Record<string, number>;
  settlements: Settlement[];
}
