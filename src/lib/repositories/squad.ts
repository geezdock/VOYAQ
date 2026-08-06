import { createClient } from "@/services/supabase/client";
import type { Squad, SquadMember, DestinationVote, BudgetPreference, DateProposal, Poll } from "@/types/squad";

const PENDING_KEY = "voyaq_pending_mutations";
const CACHE_KEY = "voyaq_squads_v1";
const MAX_QUEUE = 50;

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

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
    const isRealUser = isUuid(userId);
    const cached = loadCachedSquads();

    if (cached.length > 0) {
      if (isRealUser) {
        this.fetchFromSupabase(userId)
          .then((server) => {
            saveCachedSquads(server);
          })
          .catch(() => {
            // Network failure — keep the stale cache.
          });
      }
      return { data: cached, fromCache: true };
    }

    if (!isRealUser) {
      return { data: [], fromCache: false };
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
    if (!isUuid(id)) {
      return cached ?? null;
    }
    if (cached) {
      Promise.resolve(
        this.supabase
          .from("squads")
          .select("*, squad_members(*), destinations(*), destination_votes(*), budget_preferences(*), date_proposals(*), polls(*, poll_options(*, poll_votes(*)))")
          .eq("id", id)
          .single(),
      )
        .then(({ data }) => {
          if (data) {
            const mapped = mapRowToSquad(data);
            saveCachedSquads(loadCachedSquads().map((s) => (s.id === id ? mapped : s)));
          }
        })
        .catch(() => {
          // Network failure — keep the stale cache.
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
    if (!isUuid(input.createdBy)) {
      const squad: Squad = {
        id: input.id,
        name: input.name,
        inviteCode: input.inviteCode,
        createdBy: input.createdBy,
        memberLimit: input.memberLimit ?? 8,
        status: "planning",
        members: [],
        destinations: [],
        votes: [],
        budgetPerPerson: 0,
        budgetPreferences: [],
        dateProposals: [],
        polls: [],
        createdAt: new Date().toISOString(),
      };
      saveCachedSquads([...loadCachedSquads(), squad]);
      return squad;
    }

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
    previous?: Squad,
  ): Promise<SquadUpdateResult> {
    if (!isUuid(id)) {
      const current = loadCachedSquads().find((s) => s.id === id);
      if (current) {
        const updated = { ...current, ...changes };
        saveCachedSquads(loadCachedSquads().map((s) => (s.id === id ? updated : s)));
        return { data: updated };
      }
      return { data: changes as Squad };
    }

    const dbChanges: Record<string, unknown> = {};

    if (changes.name !== undefined) dbChanges.name = changes.name;
    if (changes.inviteCode !== undefined) dbChanges.invite_code = changes.inviteCode;
    if (changes.lockedDestination !== undefined) dbChanges.locked_destination = changes.lockedDestination ?? null;
    if (changes.lockedBudget !== undefined) dbChanges.locked_budget = changes.lockedBudget ?? null;
    if (changes.lockedDates !== undefined) dbChanges.locked_dates = changes.lockedDates ? JSON.stringify(changes.lockedDates) : null;
    if (changes.memberLimit !== undefined) dbChanges.member_limit = changes.memberLimit;
    if (changes.status !== undefined) dbChanges.status = changes.status;
    if (changes.budgetPerPerson !== undefined) dbChanges.budget_per_person = changes.budgetPerPerson;
    if (changes.dateProposals !== undefined) dbChanges.date_proposals_json = JSON.stringify(changes.dateProposals);
    if (changes.polls !== undefined) dbChanges.polls_json = JSON.stringify(changes.polls);

    // No scalar/nested column changed (e.g. a members-only edit) — just sync relational collections.
    if (Object.keys(dbChanges).length === 0) {
      if (previous) {
        await this.syncRelationalCollections(id, previous, changes);
      }
      const refetched = await this.fetchSquad(id).catch(() => null);
      return { data: refetched ?? undefined };
    }

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

    if (previous) {
      await this.syncRelationalCollections(id, previous, changes);
    }

    const refetched = await this.fetchSquad(id).catch(() => null);
    return { data: refetched ?? undefined };
  }

  /**
   * Best-effort sync of the relational child collections (members, destinations,
   * destination votes, budget preferences). Each operation is isolated so a
   * single failure (e.g. RLS in dev mode) never takes down the whole update.
   */
  private async syncRelationalCollections(
    squadId: string,
    prev: Squad,
    next: Partial<Squad>,
  ): Promise<void> {
    const nextMembers = next.members ?? prev.members;
    const prevMemberIds = new Set(prev.members.map((m) => m.id));
    const nextMemberIds = new Set(nextMembers.map((m) => m.id));

    for (const member of nextMembers) {
      if (!prevMemberIds.has(member.id)) {
        try {
          await this.addMember(squadId, member);
        } catch {
          // RLS / dev-mode (non-uuid ids) — ignore, local state remains authoritative.
        }
      }
    }
    for (const member of prev.members) {
      if (!nextMemberIds.has(member.id)) {
        try {
          await this.removeMember(squadId, member.id);
        } catch {
          // ignore
        }
      }
    }

    const nextDests = next.destinations ?? prev.destinations;
    const prevDestSet = new Set(prev.destinations);
    const nextDestSet = new Set(nextDests);
    const createdBy = next.createdBy ?? prev.createdBy;

    for (const name of nextDests) {
      if (!prevDestSet.has(name)) {
        try {
          await this.addDestination(squadId, name, createdBy);
        } catch {
          // ignore
        }
      }
    }
    for (const name of prev.destinations) {
      if (!nextDestSet.has(name)) {
        try {
          await this.removeDestination(squadId, name);
        } catch {
          // ignore
        }
      }
    }

    const prevVotes = new Map(prev.votes.map((v) => [v.memberId, v.destination]));
    const nextVotes = new Map((next.votes ?? prev.votes).map((v) => [v.memberId, v.destination]));

    for (const [memberId, destination] of nextVotes) {
      if (prevVotes.get(memberId) !== destination) {
        try {
          await this.upsertDestinationVote(squadId, { memberId, destination });
        } catch {
          // ignore
        }
      }
    }
    for (const memberId of prevVotes.keys()) {
      if (!nextVotes.has(memberId)) {
        try {
          await this.deleteDestinationVote(squadId, memberId);
        } catch {
          // ignore
        }
      }
    }

    const prevBudget = new Map(prev.budgetPreferences.map((p) => [p.memberId, p.amount]));
    const nextBudget = new Map((next.budgetPreferences ?? prev.budgetPreferences).map((p) => [p.memberId, p.amount]));

    for (const [memberId, amount] of nextBudget) {
      if (prevBudget.get(memberId) !== amount) {
        try {
          await this.upsertBudgetPreference(squadId, { memberId, amount });
        } catch {
          // ignore
        }
      }
    }
    for (const memberId of prevBudget.keys()) {
      if (!nextBudget.has(memberId)) {
        try {
          await this.deleteBudgetPreference(squadId, memberId);
        } catch {
          // ignore
        }
      }
    }
  }

  async deleteSquad(id: string): Promise<void> {
    if (isUuid(id)) {
      const { error } = await this.supabase.from("squads").delete().eq("id", id);
      if (error) throw new Error(error.message);
    }
    saveCachedSquads(loadCachedSquads().filter((s) => s.id !== id));
  }

  async addMember(squadId: string, member: SquadMember): Promise<void> {
    if (!isUuid(squadId) || !isUuid(member.id)) {
      const all = loadCachedSquads();
      const squad = all.find((s) => s.id === squadId);
      if (squad) {
        const updated = { ...squad, members: [...squad.members.filter((m) => m.id !== member.id), member] };
        saveCachedSquads(all.map((s) => (s.id === squadId ? updated : s)));
      }
      return;
    }

    const { error } = await this.supabase.from("squad_members").insert({
      squad_id: squadId,
      profile_id: member.id,
      verified: false,
    });
    if (error) throw new Error(error.message);
  }

  async removeMember(squadId: string, memberId: string): Promise<void> {
    if (!isUuid(squadId) || !isUuid(memberId)) {
      const all = loadCachedSquads();
      const squad = all.find((s) => s.id === squadId);
      if (squad) {
        const updated = { ...squad, members: squad.members.filter((m) => m.id !== memberId) };
        saveCachedSquads(all.map((s) => (s.id === squadId ? updated : s)));
      }
      return;
    }

    const { error } = await this.supabase
      .from("squad_members")
      .delete()
      .eq("squad_id", squadId)
      .eq("profile_id", memberId);
    if (error) throw new Error(error.message);
  }

  async updateMember(squadId: string, memberId: string, updates: Partial<SquadMember>): Promise<void> {
    if (!isUuid(squadId) || !isUuid(memberId)) {
      const all = loadCachedSquads();
      const squad = all.find((s) => s.id === squadId);
      if (squad) {
        const updated = {
          ...squad,
          members: squad.members.map((m) => (m.id === memberId ? { ...m, ...updates } : m)),
        };
        saveCachedSquads(all.map((s) => (s.id === squadId ? updated : s)));
      }
      return;
    }

    const dbChanges: Record<string, unknown> = {};
    if (updates.upiId !== undefined) dbChanges.upi_id = updates.upiId;
    if (Object.keys(dbChanges).length === 0) return;

    const { error } = await this.supabase
      .from("squad_members")
      .update(dbChanges)
      .eq("squad_id", squadId)
      .eq("profile_id", memberId);
    if (error) throw new Error(error.message);
  }

  async joinSquad(inviteCode: string): Promise<{ squadId?: string; squad?: Squad; error?: string }> {
    const { data, error } = await this.supabase.rpc("join_squad", {
      p_invite_code: inviteCode,
    });
    if (error) return { error: error.message };

    const squadId = (data as { id?: string } | undefined)?.id;
    if (!squadId) return { error: "Squad not found" };

    const squad = await this.fetchSquad(squadId).catch(() => null);
    return squad ? { squadId, squad } : { squadId };
  }

  async addDestination(squadId: string, name: string, createdBy: string): Promise<void> {
    if (!isUuid(squadId) || !isUuid(createdBy)) {
      const all = loadCachedSquads();
      const squad = all.find((s) => s.id === squadId);
      if (squad && !squad.destinations.includes(name)) {
        const updated = { ...squad, destinations: [...squad.destinations, name] };
        saveCachedSquads(all.map((s) => (s.id === squadId ? updated : s)));
      }
      return;
    }

    const { error } = await this.supabase.from("destinations").insert({
      squad_id: squadId,
      name,
      created_by: createdBy,
    });
    if (error) throw new Error(error.message);
  }

  async removeDestination(squadId: string, name: string): Promise<void> {
    if (!isUuid(squadId)) {
      const all = loadCachedSquads();
      const squad = all.find((s) => s.id === squadId);
      if (squad) {
        const updated = { ...squad, destinations: squad.destinations.filter((d) => d !== name) };
        saveCachedSquads(all.map((s) => (s.id === squadId ? updated : s)));
      }
      return;
    }

    const { error } = await this.supabase
      .from("destinations")
      .delete()
      .eq("squad_id", squadId)
      .eq("name", name);
    if (error) throw new Error(error.message);
  }

  async upsertDestinationVote(squadId: string, vote: DestinationVote): Promise<void> {
    if (!isUuid(squadId) || !isUuid(vote.memberId)) {
      const all = loadCachedSquads();
      const squad = all.find((s) => s.id === squadId);
      if (squad) {
        const updated = {
          ...squad,
          votes: [...squad.votes.filter((v) => v.memberId !== vote.memberId), vote],
        };
        saveCachedSquads(all.map((s) => (s.id === squadId ? updated : s)));
      }
      return;
    }

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

  async deleteDestinationVote(squadId: string, memberId: string): Promise<void> {
    if (!isUuid(squadId) || !isUuid(memberId)) {
      const all = loadCachedSquads();
      const squad = all.find((s) => s.id === squadId);
      if (squad) {
        const updated = { ...squad, votes: squad.votes.filter((v) => v.memberId !== memberId) };
        saveCachedSquads(all.map((s) => (s.id === squadId ? updated : s)));
      }
      return;
    }

    const { error } = await this.supabase
      .from("destination_votes")
      .delete()
      .eq("squad_id", squadId)
      .eq("member_id", memberId);
    if (error) throw new Error(error.message);
  }

  async upsertBudgetPreference(squadId: string, pref: BudgetPreference): Promise<void> {
    if (!isUuid(squadId) || !isUuid(pref.memberId)) {
      const all = loadCachedSquads();
      const squad = all.find((s) => s.id === squadId);
      if (squad) {
        const updated = {
          ...squad,
          budgetPreferences: [...squad.budgetPreferences.filter((p) => p.memberId !== pref.memberId), pref],
        };
        saveCachedSquads(all.map((s) => (s.id === squadId ? updated : s)));
      }
      return;
    }

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

  async deleteBudgetPreference(squadId: string, memberId: string): Promise<void> {
    if (!isUuid(squadId) || !isUuid(memberId)) {
      const all = loadCachedSquads();
      const squad = all.find((s) => s.id === squadId);
      if (squad) {
        const updated = { ...squad, budgetPreferences: squad.budgetPreferences.filter((p) => p.memberId !== memberId) };
        saveCachedSquads(all.map((s) => (s.id === squadId ? updated : s)));
      }
      return;
    }

    const { error } = await this.supabase
      .from("budget_preferences")
      .delete()
      .eq("squad_id", squadId)
      .eq("member_id", memberId);
    if (error) throw new Error(error.message);
  }

  async createDateProposal(squadId: string, proposal: DateProposal): Promise<void> {
    if (!isUuid(squadId) || !isUuid(proposal.id) || !isUuid(proposal.proposedBy)) {
      const all = loadCachedSquads();
      const squad = all.find((s) => s.id === squadId);
      if (squad) {
        const updated = { ...squad, dateProposals: [...squad.dateProposals, proposal] };
        saveCachedSquads(all.map((s) => (s.id === squadId ? updated : s)));
      }
      return;
    }

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
    if (!isUuid(id)) {
      return { unsubscribe: () => {} };
    }

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
          const payload = mutation.payload as { id: string; changes: Partial<Squad>; previous?: Squad };
          const result = await this.updateSquad(payload.id, payload.changes, undefined, payload.previous);
          if (result.error) throw new Error(result.error);
          if (result.conflict) throw new Error("conflict");
        }
        ok++;
      } catch {
        failed.push({ ...mutation, retryCount: mutation.retryCount + 1 });
      }
    }

    saveQueue(failed.filter((m) => m.retryCount < 3));
    return { ok, failed: failed.filter((m) => m.retryCount >= 3) };
  }

  getPendingCount(): number {
    return loadQueue().length;
  }
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

function mapRowToSquad(row: Record<string, unknown>): Squad {
  const members: SquadMember[] = ((row.squad_members as Record<string, unknown>[]) ?? []).map((m: Record<string, unknown>) => ({
    id: m.profile_id as string,
    name: m.display_name as string || "Member",
    initial: (m.display_name as string || "M").charAt(0).toUpperCase(),
    color: "bg-accent",
    verified: (m.verified as boolean) ?? false,
    joinedAt: m.joined_at as string || new Date().toISOString(),
    upiId: (m.upi_id as string | undefined) || undefined,
  }));

  const storedDateProposals = parseJson<DateProposal[] | null>(row.date_proposals_json, null);
  const storedPolls = parseJson<Poll[] | null>(row.polls_json, null);

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
    budgetPerPerson: Number(row.budget_per_person ?? 0) || 0,
    lockedBudget: (row.locked_budget as number) ?? undefined,
    budgetPreferences: ((row.budget_preferences as Record<string, unknown>[]) ?? []).map((p) => ({
      memberId: p.member_id as string,
      amount: p.amount as number,
    })),
    dateProposals: storedDateProposals ?? ((row.date_proposals as Record<string, unknown>[]) ?? []).map((p) => ({
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
    polls: storedPolls ?? ((row.polls as Record<string, unknown>[]) ?? []).map((p) => ({
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
