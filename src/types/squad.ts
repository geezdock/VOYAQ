export type SquadStatus = "planning" | "voting" | "ready" | "pending" | "booked" | "cancelled";

export type WorkspaceTab = "squad" | "destinations" | "dates" | "budget" | "polls";

export interface SquadMember {
  id: string;
  name: string;
  initial: string;
  color: string;
  verified: boolean;
  joinedAt: string;
  upiId?: string;
}

export interface DestinationVote {
  memberId: string;
  destination: string;
}

export interface BudgetPreference {
  memberId: string;
  amount: number;
}

export interface DateProposal {
  id: string;
  startDate: string;
  endDate: string;
  proposedBy: string;
  votes: string[];
  createdAt: string;
}

export interface PollOption {
  id: string;
  label: string;
  votes: string[];
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdBy: string;
  createdAt: string;
}

export interface Squad {
  id: string;
  name: string;
  inviteCode: string;
  createdBy: string;
  destination?: string;
  lockedDestination?: string;
  destinations: string[];
  members: SquadMember[];
  memberLimit: number;
  votes: DestinationVote[];
  budgetPerPerson: number;
  lockedBudget?: number;
  budgetPreferences: BudgetPreference[];
  dateProposals: DateProposal[];
  lockedDates?: { start: string; end: string };
  polls: Poll[];
  status: SquadStatus;
  createdAt: string;
}
