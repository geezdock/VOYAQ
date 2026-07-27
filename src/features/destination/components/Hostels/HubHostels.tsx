"use client";

import { Building2, Bed, Home, ExternalLink, Info, IndianRupee } from "lucide-react";
import { getDestinationEntry } from "@/constants/destinations";

interface HubHostelsProps {
  destinationName: string;
}

function toSlug(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

type DestType = "beach" | "hill" | "city" | "desert" | "pilgrimage" | "adventure";

interface PriceTier {
  hostel: string;    // Zostel / Hosteller range
  homestay: string;  // Airbnb range
}

const priceByType: Record<string, PriceTier> = {
  beach:      { hostel: "₹800 – ₹1,500",  homestay: "₹2,000 – ₹5,000" },
  hill:       { hostel: "₹600 – ₹1,200",  homestay: "₹1,500 – ₹4,000" },
  city:       { hostel: "₹1,000 – ₹2,000", homestay: "₹2,500 – ₹6,000" },
  desert:     { hostel: "₹700 – ₹1,500",  homestay: "₹1,500 – ₹3,500" },
  pilgrimage: { hostel: "₹500 – ₹1,000",  homestay: "₹1,000 – ₹2,500" },
  adventure:  { hostel: "₹600 – ₹1,200",  homestay: "₹1,500 – ₹4,000" },
};

const services = [
  {
    id: "zostel",
    name: "Zostel",
    tagline: "India's largest hostel network for backpackers",
    icon: Building2,
    description: "Dorm and private rooms at prime locations. Common room, kitchen, and community events.",
    url: (city: string) => `https://www.zostel.com/zostel/${encodeURIComponent(city)}`,
    priceKey: "hostel" as const,
    color: "text-[#F9A825]",
    bgColor: "bg-[#F9A825]/10",
    borderColor: "border-[#F9A825]/30",
  },
  {
    id: "hosteller",
    name: "The Hosteller",
    tagline: "Modern hostels with curated experiences",
    icon: Bed,
    description: "Clean, secure dorms and private rooms. In-house cafe, bonfires, and guided treks.",
    url: "https://www.thehosteller.com/",
    priceKey: "hostel" as const,
    color: "text-[#00A86B]",
    bgColor: "bg-[#00A86B]/10",
    borderColor: "border-[#00A86B]/30",
  },
  {
    id: "airbnb",
    name: "Airbnb",
    tagline: "Entire homes & apartments for the squad",
    icon: Home,
    description: "Book entire homes, apartments, or villas. Perfect for group stays with privacy.",
    url: (city: string) => `https://www.airbnb.co.in/s/${toSlug(city)}--India`,
    priceKey: "homestay" as const,
    color: "text-[#FF5A5F]",
    bgColor: "bg-[#FF5A5F]/10",
    borderColor: "border-[#FF5A5F]/30",
  },
];

export function HubHostels({ destinationName }: HubHostelsProps) {
  const entry = getDestinationEntry(destinationName);
  const city = entry?.city || destinationName;
  const destType = (entry?.type ?? "city") as DestType;
  const prices = priceByType[destType] || priceByType.city;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Building2 className="w-5 h-5 text-accent" />
        <h2 className="font-heading text-sm font-bold text-ink uppercase tracking-wider">
          Stay Options — {city}
        </h2>
      </div>

      <p className="font-mono text-xs text-ink-muted">
        Find accommodation in {city} suited for student group trips.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((svc) => {
          const href = typeof svc.url === "function" ? svc.url(city) : svc.url;
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
                    <p className="font-mono text-[9px] text-ink-muted">{svc.tagline}</p>
                  </div>
                </div>

                <p className="font-mono text-[11px] text-ink-muted leading-relaxed">
                  {svc.description}
                </p>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold ${svc.color} ${svc.bgColor} px-2 py-0.5 rounded`}>
                    <IndianRupee className="w-3 h-3" />
                    {prices[svc.priceKey]}
                  </span>
                  <span className="font-mono text-[9px] text-ink-muted/60">/ night</span>
                </div>

                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-1.5 w-full py-2 rounded-bruted border-2 font-mono text-[11px] font-bold transition-colors min-h-[40px] ${svc.borderColor} ${svc.color} hover:bg-ink/5`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Search on {svc.name}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
