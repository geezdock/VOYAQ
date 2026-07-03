import { createClient } from "../supabase";
import type { Squad, SquadMember, DestinationVote, BudgetPreference, DateProposal, Poll, PollOption } from "@/types/squad";

interface ProfileRow {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_initial: string | null;
  avatar_color: string;
}

interface SquadMemberRow {
  id: string;
  squad_id: string;
  profile_id: string;
  verified: boolean;
  joined_at: string;
  profile?: ProfileRow;
}

interface DestinationRow {
  id: string;
  squad_id: string;
  name: string;
  created_by: string;
}

interface DestinationVoteRow {
  id: string;
  squad_id: string;
  member_id: string;
  destination: string;
}

interface BudgetPreferenceRow {
  id: string;
  squad_id: string;
  member_id: string;
  amount: number;
}

interface DateProposalVoteRow {
  id: string;
  date_proposal_id: string;
  member_id: string;
}

interface DateProposalRow {
  id: string;
  squad_id: string;
  start_date: string;
  end_date: string;
  proposed_by: string;
  created_at: string;
  date_proposal_votes: DateProposalVoteRow[];
}

interface PollVoteRow {
  id: string;
  poll_option_id: string;
  member_id: string;
}

interface PollOptionRow {
  id: string;
  poll_id: string;
  label: string;
  poll_votes: PollVoteRow[];
}

interface PollRow {
  id: string;
  squad_id: string;
  question: string;
  created_by: string;
  created_at: string;
  poll_options: PollOptionRow[];
}

interface SquadRow {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  destination: string | null;
  locked_destination: string | null;
  member_limit: number;
  budget_per_person: number | null;
  locked_budget: number | null;
  locked_start_date: string | null;
  locked_end_date: string | null;
  status: string;
  created_at: string;
  squad_members: SquadMemberRow[];
  destinations: DestinationRow[];
  destination_votes: DestinationVoteRow[];
  budget_preferences: BudgetPreferenceRow[];
  date_proposals: (DateProposalRow)[];
  polls: (PollRow)[];
}

function memberRowToMember(row: SquadMemberRow): SquadMember {
  return {
    id: row.profile_id,
    name: row.profile?.display_name || "Unknown",
    initial: row.profile?.avatar_initial || (row.profile?.display_name?.[0] || "?"),
    color: row.profile?.avatar_color || "bg-accent",
    verified: row.verified,
    joinedAt: row.joined_at,
  };
}

export function squadRowToSquad(row: SquadRow): Squad {
  const members = (row.squad_members || []).map(memberRowToMember);
  const dateProposals: DateProposal[] = (row.date_proposals || []).map((dp) => ({
    id: dp.id,
    startDate: dp.start_date,
    endDate: dp.end_date,
    proposedBy: dp.proposed_by,
    votes: (dp.date_proposal_votes || []).map((v) => v.member_id),
    createdAt: dp.created_at,
  }));
  const polls: Poll[] = (row.polls || []).map((p) => ({
    id: p.id,
    question: p.question,
    options: (p.poll_options || []).map((opt) => ({
      id: opt.id,
      label: opt.label,
      votes: (opt.poll_votes || []).map((v) => v.member_id),
    })),
    createdBy: p.created_by,
    createdAt: p.created_at,
  }));

  return {
    id: row.id,
    name: row.name,
    inviteCode: row.invite_code,
    createdBy: row.created_by,
    destination: row.destination || undefined,
    lockedDestination: row.locked_destination || undefined,
    destinations: (row.destinations || []).map((d) => d.name),
    members,
    memberLimit: row.member_limit,
    votes: (row.destination_votes || []).map((v) => ({
      memberId: v.member_id,
      destination: v.destination,
    })),
    budgetPerPerson: row.budget_per_person || 0,
    lockedBudget: row.locked_budget || undefined,
    budgetPreferences: (row.budget_preferences || []).map((bp) => ({
      memberId: bp.member_id,
      amount: bp.amount,
    })),
    dateProposals,
    lockedDates: row.locked_start_date && row.locked_end_date
      ? { start: row.locked_start_date, end: row.locked_end_date }
      : undefined,
    polls,
    status: row.status as Squad["status"],
    createdAt: row.created_at,
  };
}

const SQUAD_SELECT = `
  *,
  squad_members(*, profile:profiles(*)),
  destinations(*),
  destination_votes(*),
  budget_preferences(*),
  date_proposals(*, date_proposal_votes(*)),
  polls(*, poll_options(*, poll_votes(*)))
`;

export async function fetchUserSquads(userId: string): Promise<Squad[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("squads")
    .select(SQUAD_SELECT)
    .or(`created_by.eq.${userId},squad_members.profile_id.eq.${userId}`);
  if (error) throw error;
  return (data || []).map(squadRowToSquad);
}

export async function fetchSquadById(squadId: string): Promise<Squad | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("squads")
    .select(SQUAD_SELECT)
    .eq("id", squadId)
    .single();
  if (error) return null;
  return squadRowToSquad(data);
}

export async function fetchSquadByInviteCode(code: string): Promise<Squad | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("squads")
    .select(SQUAD_SELECT)
    .eq("invite_code", code)
    .single();
  if (error) return null;
  return squadRowToSquad(data);
}

export async function createSquadInDb(
  input: {
    name: string;
    inviteCode: string;
    destination?: string;
    memberLimit: number;
    budgetPerPerson: number;
    startDate?: string;
    endDate?: string;
  },
  userId: string,
): Promise<Squad> {
  const supabase = createClient();

  const { data: squadData, error: squadError } = await supabase
    .from("squads")
    .insert({
      name: input.name,
      invite_code: input.inviteCode,
      created_by: userId,
      destination: input.destination || null,
      member_limit: input.memberLimit,
      budget_per_person: input.budgetPerPerson,
      status: "planning",
    })
    .select("id")
    .single();

  if (squadError) throw squadError;

  await supabase.from("squad_members").insert({
    squad_id: squadData.id,
    profile_id: userId,
    verified: true,
  });

  if (input.startDate && input.endDate) {
    await supabase.from("date_proposals").insert({
      squad_id: squadData.id,
      start_date: input.startDate,
      end_date: input.endDate,
      proposed_by: userId,
    });
  }

  const created = await fetchSquadById(squadData.id);
  if (!created) throw new Error("Failed to fetch created squad");
  return created;
}

export async function joinSquadInDb(squadId: string, userId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("squad_members").insert({
    squad_id: squadId,
    profile_id: userId,
    verified: true,
  });
  if (error) throw error;
}

function diff<T>(oldArr: T[], newArr: T[], key: (item: T) => string): { added: T[]; removed: T[] } {
  const oldMap = new Map(oldArr.map((item) => [key(item), item]));
  const newMap = new Map(newArr.map((item) => [key(item), item]));

  const added = newArr.filter((item) => !oldMap.has(key(item)));
  const removed = oldArr.filter((item) => !newMap.has(key(item)));

  return { added, removed };
}

export async function syncSquad(
  newSquad: Squad,
  oldSquad: Squad | null,
): Promise<void> {
  const supabase = createClient();
  const squadId = newSquad.id;

  await supabase
    .from("squads")
    .update({
      name: newSquad.name,
      destination: newSquad.destination || null,
      locked_destination: newSquad.lockedDestination || null,
      member_limit: newSquad.memberLimit,
      budget_per_person: newSquad.budgetPerPerson,
      locked_budget: newSquad.lockedBudget ?? null,
      locked_start_date: newSquad.lockedDates?.start || null,
      locked_end_date: newSquad.lockedDates?.end || null,
      status: newSquad.status,
    })
    .eq("id", squadId);

  if (oldSquad) {
    const destDiff = diff(oldSquad.destinations, newSquad.destinations, (d) => d);
    for (const name of destDiff.added) {
      await supabase.from("destinations").insert({ squad_id: squadId, name, created_by: newSquad.createdBy });
    }
    if (destDiff.removed.length > 0) {
      for (const name of destDiff.removed) {
        await supabase.from("destinations").delete().eq("squad_id", squadId).eq("name", name);
      }
    }
  } else {
    for (const name of newSquad.destinations) {
      await supabase.from("destinations").insert({ squad_id: squadId, name, created_by: newSquad.createdBy });
    }
  }

  if (oldSquad) {
    const oldVotes = oldSquad.votes;
    const newVotes = newSquad.votes;
    const voteDiff = diff(oldVotes, newVotes, (v) => v.memberId);
    for (const v of voteDiff.removed) {
      await supabase.from("destination_votes").delete().eq("squad_id", squadId).eq("member_id", v.memberId);
    }
    for (const v of voteDiff.added) {
      await supabase.from("destination_votes").insert({ squad_id: squadId, member_id: v.memberId, destination: v.destination }).maybeSingle();
    }
    const existingVotes = newVotes.filter((nv) => oldVotes.some((ov) => ov.memberId === nv.memberId));
    for (const v of existingVotes) {
      const oldV = oldVotes.find((ov) => ov.memberId === v.memberId);
      if (oldV && oldV.destination !== v.destination) {
        await supabase.from("destination_votes").update({ destination: v.destination }).eq("squad_id", squadId).eq("member_id", v.memberId);
      }
    }
  } else {
    for (const v of newSquad.votes) {
      await supabase.from("destination_votes").insert({ squad_id: squadId, member_id: v.memberId, destination: v.destination }).maybeSingle();
    }
  }

  if (oldSquad) {
    const oldPrefs = oldSquad.budgetPreferences;
    const newPrefs = newSquad.budgetPreferences;
    const prefDiff = diff(oldPrefs, newPrefs, (p) => p.memberId);
    for (const p of prefDiff.removed) {
      await supabase.from("budget_preferences").delete().eq("squad_id", squadId).eq("member_id", p.memberId);
    }
    for (const p of prefDiff.added) {
      await supabase.from("budget_preferences").insert({ squad_id: squadId, member_id: p.memberId, amount: p.amount }).maybeSingle();
    }
    const existingPrefs = newPrefs.filter((np) => oldPrefs.some((op) => op.memberId === np.memberId));
    for (const p of existingPrefs) {
      const oldP = oldPrefs.find((op) => op.memberId === p.memberId);
      if (oldP && oldP.amount !== p.amount) {
        await supabase.from("budget_preferences").update({ amount: p.amount }).eq("squad_id", squadId).eq("member_id", p.memberId);
      }
    }
  } else {
    for (const p of newSquad.budgetPreferences) {
      await supabase.from("budget_preferences").insert({ squad_id: squadId, member_id: p.memberId, amount: p.amount }).maybeSingle();
    }
  }

  if (oldSquad) {
    const propDiff = diff(oldSquad.dateProposals, newSquad.dateProposals, (dp) => dp.id);
    for (const dp of propDiff.removed) {
      await supabase.from("date_proposals").delete().eq("id", dp.id);
    }
    for (const dp of propDiff.added) {
      const { data: inserted } = await supabase.from("date_proposals").insert({
        squad_id: squadId, start_date: dp.startDate, end_date: dp.endDate,
        proposed_by: dp.proposedBy,
      }).select("id").single();
      if (inserted && dp.votes.length > 0) {
        await supabase.from("date_proposal_votes").insert(
          dp.votes.map((memberId) => ({ date_proposal_id: inserted.id, member_id: memberId })),
        );
      }
    }
    for (const dp of newSquad.dateProposals) {
      const oldDp = oldSquad.dateProposals.find((odp) => odp.id === dp.id);
      if (oldDp) {
        const oldVotes = oldDp.votes;
        const newVotes = dp.votes;
        const removed = oldVotes.filter((v) => !newVotes.includes(v));
        const added = newVotes.filter((v) => !oldVotes.includes(v));
        const dbId = dp.id;
        for (const memberId of removed) {
          await supabase.from("date_proposal_votes").delete().eq("date_proposal_id", dbId).eq("member_id", memberId);
        }
        for (const memberId of added) {
          await supabase.from("date_proposal_votes").insert({ date_proposal_id: dbId, member_id: memberId }).maybeSingle();
        }
      }
    }
  } else {
    for (const dp of newSquad.dateProposals) {
      const { data: inserted } = await supabase.from("date_proposals").insert({
        squad_id: squadId, start_date: dp.startDate, end_date: dp.endDate,
        proposed_by: dp.proposedBy,
      }).select("id").single();
      if (inserted && dp.votes.length > 0) {
        await supabase.from("date_proposal_votes").insert(
          dp.votes.map((memberId) => ({ date_proposal_id: inserted.id, member_id: memberId })),
        );
      }
    }
  }

  if (oldSquad) {
    const pollDiff = diff(oldSquad.polls, newSquad.polls, (p) => p.id);
    for (const p of pollDiff.removed) {
      await supabase.from("polls").delete().eq("id", p.id);
    }
    for (const p of pollDiff.added) {
      const { data: inserted } = await supabase.from("polls").insert({
        squad_id: squadId, question: p.question, created_by: p.createdBy,
      }).select("id").single();
      if (inserted) {
        for (const opt of p.options) {
          const { data: optInserted } = await supabase.from("poll_options").insert({
            poll_id: inserted.id, label: opt.label,
          }).select("id").single();
          if (optInserted && opt.votes.length > 0) {
            await supabase.from("poll_votes").insert(
              opt.votes.map((memberId) => ({ poll_option_id: optInserted.id, member_id: memberId })),
            );
          }
        }
      }
    }
    for (const p of newSquad.polls) {
      const oldP = oldSquad.polls.find((op) => op.id === p.id);
      if (oldP) {
        const optDiff = diff(oldP.options, p.options, (o) => o.id);
        for (const o of optDiff.removed) {
          await supabase.from("poll_options").delete().eq("id", o.id);
        }
        for (const o of optDiff.added) {
          const { data: optInserted } = await supabase.from("poll_options").insert({
            poll_id: p.id, label: o.label,
          }).select("id").single();
          if (optInserted && o.votes.length > 0) {
            await supabase.from("poll_votes").insert(
              o.votes.map((memberId) => ({ poll_option_id: optInserted.id, member_id: memberId })),
            );
          }
        }
        for (const opt of p.options) {
          const oldOpt = oldP.options.find((oo) => oo.id === opt.id);
          if (oldOpt) {
            const removed = oldOpt.votes.filter((v) => !opt.votes.includes(v));
            const added = opt.votes.filter((v) => !oldOpt.votes.includes(v));
            for (const memberId of removed) {
              await supabase.from("poll_votes").delete().eq("poll_option_id", opt.id).eq("member_id", memberId);
            }
            for (const memberId of added) {
              await supabase.from("poll_votes").insert({ poll_option_id: opt.id, member_id: memberId }).maybeSingle();
            }
          }
        }
      }
    }
  } else {
    for (const p of newSquad.polls) {
      const { data: inserted } = await supabase.from("polls").insert({
        squad_id: squadId, question: p.question, created_by: p.createdBy,
      }).select("id").single();
      if (inserted) {
        for (const opt of p.options) {
          const { data: optInserted } = await supabase.from("poll_options").insert({
            poll_id: inserted.id, label: opt.label,
          }).select("id").single();
          if (optInserted && opt.votes.length > 0) {
            await supabase.from("poll_votes").insert(
              opt.votes.map((memberId) => ({ poll_option_id: optInserted.id, member_id: memberId })),
            );
          }
        }
      }
    }
  }

  if (oldSquad) {
    const memDiff = diff(oldSquad.members, newSquad.members, (m) => m.id);
    for (const m of memDiff.removed) {
      await supabase.from("squad_members").delete().eq("squad_id", squadId).eq("profile_id", m.id);
    }
    for (const m of memDiff.added) {
      await supabase.from("squad_members").insert({ squad_id: squadId, profile_id: m.id, verified: m.verified }).maybeSingle();
    }
  }
}
