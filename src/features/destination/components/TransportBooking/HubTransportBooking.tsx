"use client";

import { Train, Bus, Plane, ExternalLink, Info } from "lucide-react";
import { getDestinationEntry } from "@/constants/destinations";
import { trackEvent, VOYAQ_EVENTS } from "@/lib/analytics";

interface HubTransportBookingProps {
  destinationName: string;
}

const services = [
  {
    id: "irctc",
    name: "IRCTC",
    icon: Train,
    description: "Book reserved train tickets across India. Official Indian Railways portal.",
    url: "https://www.irctc.co.in/nget/train-search",
    tip: "Requires IRCTC login. Create an account before booking.",
    color: "text-[#E86A3C]",
    bgColor: "bg-[#E86A3C]/10",
    borderColor: "border-[#E86A3C]/30",
  },
  {
    id: "redbus",
    name: "RedBus",
    icon: Bus,
    description: "Book intercity and interstate bus tickets. Wide network across India.",
    url: "https://www.redbus.in/",
    tip: "Enter your origin and destination to find bus routes to your destination.",
    color: "text-[#D84B3E]",
    bgColor: "bg-[#D84B3E]/10",
    borderColor: "border-[#D84B3E]/30",
  },
  {
    id: "skyscanner",
    name: "Skyscanner",
    icon: Plane,
    description: "Compare flight prices across airlines. Find the cheapest routes to your destination.",
    url: "https://www.skyscanner.net/",
    tip: "Search flights anywhere. Use 'Everywhere' to find the cheapest destination.",
    color: "text-[#1B53E0]",
    bgColor: "bg-[#1B53E0]/10",
    borderColor: "border-[#1B53E0]/30",
  },
];

export function HubTransportBooking({ destinationName }: HubTransportBookingProps) {
  const entry = getDestinationEntry(destinationName);
  const city = entry?.city || destinationName;
  const state = entry?.state || "";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Train className="w-5 h-5 text-accent" />
        <h2 className="font-heading text-sm font-bold text-ink uppercase tracking-wider">
          Book Travel — {city}
        </h2>
      </div>

      <p className="font-mono text-xs text-ink-muted">
        Book transport to {city}{state ? `, ${state}` : ""} from these trusted platforms.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((svc) => {
          const href = svc.url;
          const Icon = svc.icon;
          return (
            <div
              key={svc.id}
              className="border-2 border-ink/10 rounded-[12px] bg-white overflow-hidden hover:border-ink/20 transition-colors"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${svc.bgColor} flex items-center justify-center ${svc.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold text-ink">{svc.name}</h3>
                    <p className="font-mono text-[10px] text-ink-muted">{city}</p>
                  </div>
                </div>

                <p className="font-mono text-[11px] text-ink-muted leading-relaxed">
                  {svc.description}
                </p>

                <div className="flex items-start gap-1.5 text-[10px] font-mono text-ink-muted/60">
                  <Info className="w-3 h-3 shrink-0 mt-0.5" />
                  <span>{svc.tip}</span>
                </div>

                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent(VOYAQ_EVENTS.TOOLKIT_BOOKING_CLICKED, {
                      service: svc.id,
                      destination: city,
                    })
                  }
                  className={`flex items-center justify-center gap-1.5 w-full py-2 rounded-bruted border-2 font-mono text-[11px] font-bold transition-colors min-h-[40px] ${svc.borderColor} ${svc.color} hover:bg-ink/5`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open {svc.name}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
