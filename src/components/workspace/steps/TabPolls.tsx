"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check } from "lucide-react";
import type { Squad, Poll } from "@/types/squad";
import { useSquad } from "@/lib/SquadContext";

interface TabPollsProps {
  squad: Squad;
  onUpdate: (squad: Squad) => void;
}

export function TabPolls({ squad, onUpdate }: TabPollsProps) {
  const { isMe, currentUserId } = useSquad();
  const [showCreate, setShowCreate] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  function handleCreate() {
    if (!question.trim() || options.filter((o) => o.trim()).length < 2) return;

    const uid = currentUserId || "me";
    const newPoll: Poll = {
      id: `poll-${Date.now()}`,
      question: question.trim(),
      options: options
        .filter((o) => o.trim())
        .map((label, i) => ({
          id: `opt-${Date.now()}-${i}`,
          label: label.trim(),
          votes: [],
        })),
      createdBy: uid,
      createdAt: new Date().toISOString(),
    };

    onUpdate({ ...squad, polls: [...squad.polls, newPoll] });
    setQuestion("");
    setOptions(["", ""]);
    setShowCreate(false);
  }

  function handleVote(pollId: string, optionId: string) {
    const uid = currentUserId || "me";
    const updatedPolls = squad.polls.map((poll) => {
      if (poll.id !== pollId) return poll;
      return {
        ...poll,
        options: poll.options.map((opt) => {
          const hasVoted = opt.votes.some((v) => isMe(v));
          if (opt.id === optionId) {
            return {
              ...opt,
              votes: hasVoted
                ? opt.votes.filter((v) => !isMe(v))
                : [...opt.votes, uid],
            };
          }
          return { ...opt, votes: opt.votes.filter((v) => !isMe(v)) };
        }),
      };
    });
    onUpdate({ ...squad, polls: updatedPolls });
  }

  function handleDeletePoll(pollId: string) {
    onUpdate({
      ...squad,
      polls: squad.polls.filter((p) => p.id !== pollId),
    });
  }

  function addOption() {
    setOptions([...options, ""]);
  }

  function removeOption(index: number) {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-bold text-ink-muted uppercase tracking-wider">
          Custom Polls
        </span>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="brut-btn text-sm px-4 py-3 min-h-[44px]"
        >
          <Plus className="w-4 h-4 mr-1 inline" />
          New Poll
        </button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border-[3px] border-ink rounded-[16px] bg-white p-5 sm:p-6 shadow-bruted-lg space-y-4">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="brut-input w-full text-sm"
                placeholder="Ask a question..."
                autoFocus
              />

              <div className="space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={opt}
                      onChange={(e) => {
                        const next = [...options];
                        next[i] = e.target.value;
                        setOptions(next);
                      }}
                      className="brut-input flex-1 text-sm"
                      placeholder={`Option ${i + 1}`}
                    />
                    {options.length > 2 && (
                      <button
                        onClick={() => removeOption(i)}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-surface-alt rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-ink-muted" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addOption}
                className="font-heading text-sm text-accent hover:text-accent-dark transition-colors"
              >
                + Add option
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 brut-btn text-sm !bg-surface-card !text-ink hover:!bg-surface-alt"
                >
                  Cancel
                </button>
                <button onClick={handleCreate} className="flex-1 brut-btn text-sm">
                  Create Poll
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {squad.polls.length === 0 && !showCreate && (
        <div className="border-[3px] border-dashed border-ink/20 rounded-[16px] p-8 text-center">
          <p className="font-heading text-sm text-ink-muted">
            No polls yet. Create one to get the group talking.
          </p>
        </div>
      )}

      {squad.polls.map((poll) => {
        const totalVotes = poll.options.reduce(
          (sum, opt) => sum + opt.votes.length,
          0
        );
        const myVote = poll.options.find((opt) =>
          opt.votes.some((v) => isMe(v))
        )?.id;

        return (
          <motion.div
            key={poll.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-[3px] border-ink rounded-[16px] bg-white p-5 sm:p-6 shadow-bruted-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <p className="font-heading text-base font-bold text-ink">
                {poll.question}
              </p>
              <button
                onClick={() => handleDeletePoll(poll.id)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-surface-alt rounded transition-colors shrink-0"
              >
                <X className="w-4 h-4 text-ink-muted" />
              </button>
            </div>

            <div className="space-y-3">
              {poll.options.map((opt) => {
                const pct =
                  totalVotes > 0
                    ? Math.round((opt.votes.length / totalVotes) * 100)
                    : 0;
                const isSelected = myVote === opt.id;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleVote(poll.id, opt.id)}
                    className={`w-full text-left rounded-[10px] border-[2px] p-3 transition-all ${
                      isSelected
                        ? "border-accent bg-accent/5"
                        : "border-ink/10 hover:border-ink/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`font-heading text-sm font-bold ${
                          isSelected ? "text-accent" : "text-ink"
                        }`}
                      >
                        {opt.label}
                      </span>
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <Check className="w-4 h-4 text-accent" />
                        )}
                        <span className="font-mono text-xs text-ink-muted">
                          {opt.votes.length}
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-[3px] bg-ink/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full rounded-[3px] ${
                          isSelected ? "bg-accent" : "bg-ink/30"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 text-center">
              <span className="font-mono text-[10px] text-ink-muted">
                {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
