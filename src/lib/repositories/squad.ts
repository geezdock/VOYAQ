import { createClient } from "@/services/supabase/client";
import type { Squad, SquadMember, DestinationVote, BudgetPreference, DateProposal } from "@/types/squad";

const PENDING_KEY = "voyaq_pending_mutations";
const CACHE_KEY = "voyaq_squads_v1";
const MAX_QUEUE = 50;

interface PendingMutation {
  id: string;
  type: string;
  payload: unknown;
  createdAt: string;
  retryCount: number;
}

export interface SquadUpdateResult {
  data?: Squad;
  conflict?: { serverState: Squad };
  error?: string;
}

function loadQueue(): PendingMutation[] {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: PendingMutation[]) {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(queue));
  } catch {
    // quota
  }
}

function loadCachedSquads(): Squad[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCachedSquads(squads: Squad[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(squads));
  } catch {
    // quota
  }
}

export class SquadRepository {
  private supabase = createClient();

  async fetchUserSquads(userId: string): Promise<{ data: Squad[]; fromCache: boolean }> {
    const cached = loadCachedSquads();
    if (cached.length > 0) {
      this.fetchFromSupabase(userId).then((server) => {
        if (server.length > 0) {
          saveCachedSquads(server);
        }
      });
      return { data: cached, fromCache: true };
    }

    const server = await this.fetchFromSupabase(userId);
    saveCachedSquads(server);
    return { data: server, fromCache: false };
  }

  private async fetchFromSupabase(userId: string): Promise<Squad[]> {
    const [createdResult, memberResult] = await Promise.all([
      this.supabase
        .from("squads")
        .select("id")
        .eq("created_by", userId),
      this.supabase
        .from("squad_members")
        .select("squad_id")
        .eq("profile_id", userId),
    ]);

    if (createdResult.error) throw new Error(createdResult.error.message);
    if (memberResult.error) throw new Error(memberResult.error.message);

    const ids = [
      ...new Set([
        ...(createdResult.data ?? []).map((r) => r.id),
        ...(memberResult.data ?? []).map((r) => r.squad_id),
      ]),
    ];

    if (ids.length === 0) return [];

    const { data: rows, error } = await this.supabase
      .from("squads")
      .select("*, squad_members(*), destinations(*), destination_votes(*), budget_preferences(*), date_proposals(*), polls(*, poll_options(*, poll_votes(*)))")
      .in("id", ids);

    if (error) throw new Error(error.message);
    return rows ? rows.map(mapRowToSquad) : [];
  }

  async fetchSquad(id: string): Promise<Squad | null> {
    const cached = loadCachedSquads().find((s) => s.id === id);
    if (cached) {
      this.supabase
        .from("squads")
        .select("*, squad_members(*), destinations(*), destination_votes(*), budget_preferences(*), date_proposals(*), polls(*, poll_options(*, poll_votes(*)))")
        .eq("id", id)
        .single()
        .then(({ data }) => {
          if (data) {
            const mapped = mapRowToSquad(data);
            saveCachedSquads(loadCachedSquads().map((s) => (s.id === id ? mapped : s)));
          }
        });
      return cached;
    }

    const { data: row, error } = await this.supabase
      .from("squads")
      .select("*, squad_members(*), destinations(*), destination_votes(*), budget_preferences(*), date_proposals(*), polls(*, poll_options(*, poll_votes(*)))")
      .eq("id", id)
      .single();

    if (error) return null;
    const mapped = mapRowToSquad(row);
    const all = loadCachedSquads();
    const idx = all.findIndex((s) => s.id === id);
    if (idx >= 0) all[idx] = mapped;
    else all.push(mapped);
    saveCachedSquads(all);
    return mapped;
  }

  async createSquad(input: {
    id: string;
    name: string;
    inviteCode: string;
    createdBy: string;
    memberLimit?: number;
  }): Promise<Squad> {
    const { error } = await this.supabase.rpc("create_squad", {
      p_id: input.id,
      p_name: input.name,
      p_invite_code: input.inviteCode,
      p_created_by: input.createdBy,
      p_member_limit: input.memberLimit ?? 8,
    });

    if (error) throw new Error(error.message);
    const squad = await this.fetchSquad(input.id);
    if (!squad) throw new Error("Squad not found after creation");
    return squad;
  }

  async updateSquad(
    id: string,
    changes: Partial<Squad>,
    expectedVersion?: string,
  ): Promise<SquadUpdateResult> {
    const dbChanges: Record<string, unknown> = {};

    if (changes.name !== undefined) dbChanges.name = changes.name;
    if (changes.inviteCode !== undefined) dbChanges.invite_code = changes.inviteCode;
    if (changes.lockedDestination !== undefined) dbChanges.locked_destination = changes.lockedDestination ?? null;
    if (changes.lockedBudget !== undefined) dbChanges.locked_budget = changes.lockedBudget ?? null;
    if (changes.lockedDates !== undefined) dbChanges.locked_dates = changes.lockedDates ? JSON.stringify(changes.lockedDates) : null;
    if (changes.memberLimit !== undefined) dbChanges.member_limit = changes.memberLimit;
    if (changes.status !== undefined) dbChanges.status = changes.status;

    let query = this.supabase
      .from("squads")
      .update(dbChanges)
      .eq("id", id);

    if (expectedVersion) {
      query = query.eq("updated_at", expectedVersion);
    }

    const { data, error } = await query.select("updated_at").single();

    if (error) {
      if (error.code === "PGRST116" || (error as { details?: string }).details?.includes("0 rows")) {
        const serverState = await this.fetchSquad(id);
        if (serverState) {
          return { conflict: { serverState } };
        }
      }
      return { error: error.message };
    }

    const refetched = await this.fetchSquad(id).catch(() => null);
    return { data: refetched ?? undefined };
  }

  async deleteSquad(id: string): Promise<void> {
    const { error } = await this.supabase.from("squads").delete().eq("id", id);
    if (error) throw new Error(error.message);
    saveCachedSquads(loadCachedSquads().filter((s) => s.id !== id));
  }

  async addMember(squadId: string, member: SquadMember): Promise<void> {
    const { error } = await this.supabase.from("squad_members").insert({
      squad_id: squadId,
      profile_id: member.id,
      verified: false,
    });
    if (error) throw new Error(error.message);
  }

  async removeMember(squadId: string, memberId: string): Promise<void> {
    const { error } = await this.supabase
      .from("squad_members")
      .delete()
      .eq("squad_id", squadId)
      .eq("profile_id", memberId);
    if (error) throw new Error(error.message);
  }

  async upsertDestinationVote(squadId: string, vote: DestinationVote): Promise<void> {
    const { error } = await this.supabase.from("destination_votes").upsert(
      {
        squad_id: squadId,
        member_id: vote.memberId,
        destination: vote.destination,
      },
      { onConflict: "squad_id,member_id" },
    );
    if (error) throw new Error(error.message);
  }

  async upsertBudgetPreference(squadId: string, pref: BudgetPreference): Promise<void> {
    const { error } = await this.supabase.from("budget_preferences").upsert(
      {
        squad_id: squadId,
        member_id: pref.memberId,
        amount: pref.amount,
      },
      { onConflict: "squad_id,member_id" },
    );
    if (error) throw new Error(error.message);
  }

  async createDateProposal(squadId: string, proposal: DateProposal): Promise<void> {
    const { error } = await this.supabase.from("date_proposals").insert({
      id: proposal.id,
      squad_id: squadId,
      start_date: proposal.startDate,
      end_date: proposal.endDate,
      proposed_by: proposal.proposedBy,
    });
    if (error) throw new Error(error.message);
  }

  subscribeToSquad(id: string, onUpdate: (squad: Squad) => void): { unsubscribe: () => void } {
    const channel = this.supabase
      .channel(`squad:${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "squads", filter: `id=eq.${id}` },
        async () => {
          const squad = await this.fetchSquad(id);
          if (squad) onUpdate(squad);
        },
      )
      .subscribe();

    return {
      unsubscribe: () => {
        this.supabase.removeChannel(channel);
      },
    };
  }

  queueMutation(mutation: Omit<PendingMutation, "createdAt" | "retryCount">): void {
    const queue = loadQueue();
    queue.push({ ...mutation, createdAt: new Date().toISOString(), retryCount: 0 });
    if (queue.length > MAX_QUEUE) queue.shift();
    saveQueue(queue);
  }

  async flushQueue(): Promise<{ ok: number; failed: PendingMutation[] }> {
    const queue = loadQueue();
    if (queue.length === 0) return { ok: 0, failed: [] };

    const failed: PendingMutation[] = [];
    let ok = 0;

    for (const mutation of queue) {
      try {
        if (mutation.type === "updateSquad") {
          const payload = mutation.payload as { id: string; changes: Partial<Squad> };
          const result = await this.updateSquad(payload.id, payload.changes);
          if (result.error) throw new Error(result.error);
          if (result.conflict) {
            failed.push({ ...mutation, retryCount: mutation.retryCount + 1 });
            continue;
          }
        }
        ok++;
      } catch {
        const updated: PendingMutation = { ...mutation, retryCount: mutation.retryCount + 1 };
        if (updated.retryCount >= 3) {
          failed.push(updated);
        } else {
          failed.push(updated);
        }
      }
    }

    saveQueue(failed.filter((m) => m.retryCount < 3));
    return { ok, failed: failed.filter((m) => m.retryCount >= 3) };
  }

  getPendingCount(): number {
    return loadQueue().length;
  }

  getFailedMutations(): PendingMutation[] {
    return loadQueue().filter((m) => m.retryCount >= 3);
  }
}

function mapRowToSquad(row: Record<string, unknown>): Squad {
  const members: SquadMember[] = ((row.squad_members as Record<string, unknown>[]) ?? []).map((m: Record<string, unknown>) => ({
    id: m.profile_id as string,
    name: m.display_name as string || "Member",
    initial: (m.display_name as string || "M").charAt(0).toUpperCase(),
    color: "bg-accent",
    verified: (m.verified as boolean) ?? false,
    joinedAt: m.joined_at as string || new Date().toISOString(),
  }));

  return {
    id: row.id as string,
    name: row.name as string,
    inviteCode: row.invite_code as string,
    createdBy: row.created_by as string,
    destination: undefined,
    lockedDestination: (row.locked_destination as string) ?? undefined,
    destinations: ((row.destinations as Record<string, unknown>[]) ?? []).map((d) => d.name as string),
    members,
    memberLimit: (row.member_limit as number) ?? 8,
    votes: ((row.destination_votes as Record<string, unknown>[]) ?? []).map((v) => ({
      memberId: v.member_id as string,
      destination: v.destination as string,
    })),
    budgetPerPerson: 0,
    lockedBudget: (row.locked_budget as number) ?? undefined,
    budgetPreferences: ((row.budget_preferences as Record<string, unknown>[]) ?? []).map((p) => ({
      memberId: p.member_id as string,
      amount: p.amount as number,
    })),
    dateProposals: ((row.date_proposals as Record<string, unknown>[]) ?? []).map((p) => ({
      id: p.id as string,
      startDate: p.start_date as string,
      endDate: p.end_date as string,
      proposedBy: p.proposed_by as string,
      votes: [],
      createdAt: p.created_at as string,
    })),
    lockedDates: row.locked_dates
      ? (typeof row.locked_dates === "string"
          ? JSON.parse(row.locked_dates as string)
          : row.locked_dates)
      : undefined,
    polls: ((row.polls as Record<string, unknown>[]) ?? []).map((p) => ({
      id: p.id as string,
      question: p.question as string,
      options: ((p.poll_options as Record<string, unknown>[]) ?? []).map((o) => ({
        id: o.id as string,
        label: o.label as string,
        votes: ((o.poll_votes as Record<string, unknown>[]) ?? []).map((v) => v.member_id as string),
      })),
      createdBy: p.created_by as string,
      createdAt: p.created_at as string,
    })),
    status: (row.status as Squad["status"]) ?? "planning",
    createdAt: row.created_at as string,
  };
}
