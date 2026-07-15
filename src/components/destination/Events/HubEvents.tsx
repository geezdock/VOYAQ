"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, Tag, SearchX, RefreshCw } from "lucide-react";
import { useFetch } from "@/lib/hooks/useFetch";
import { fetchEvents } from "@/lib/services/events";
import type { EventItem } from "@/types/destination";

interface HubEventsProps {
  destinationName: string;
}

export function HubEvents({ destinationName }: HubEventsProps) {
  const { data: events, loading, error, retry } = useFetch<EventItem[]>(
    () => fetchEvents(destinationName),
    [destinationName],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="font-heading text-sm text-ink-muted">Loading events...</p>
      </div>
    );
  }

  if (error || !events || events.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <CalendarDays className="w-10 h-10 text-ink-muted/40 mx-auto" />
        <p className="font-heading text-sm text-ink-muted">
          {error ? "Failed to load events" : "No upcoming events found"}
        </p>
        <p className="font-mono text-xs text-ink-muted/60">
          {error ? "Check your connection and try again" : "Check back closer to your travel dates"}
        </p>
        {error && (
          <button
            onClick={retry}
            className="inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-accent hover:text-accent/80 transition-colors min-h-[44px] px-4"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {events.map((event, i) => (
        <motion.div
          key={event.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="border-2 border-ink/10 rounded-[12px] bg-surface-card p-4 sm:p-5 space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-heading text-sm font-bold text-ink">{event.name}</h3>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-accent bg-accent/10 px-2 py-1 rounded-bruted shrink-0">
              <Tag className="w-3 h-3" />
              {event.category}
            </span>
          </div>
          <p className="font-heading text-xs text-ink-muted leading-relaxed">{event.description}</p>
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-1.5 font-mono text-xs text-ink-muted">
              <CalendarDays className="w-3.5 h-3.5 shrink-0" />
              {event.date}
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs text-ink-muted">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {event.venue}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}