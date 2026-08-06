"use client";

import { useEffect, useState, useRef } from "react";
import { MapPin, Navigation, RefreshCw, Layers } from "lucide-react";
import { useFetch } from "@/shared/hooks/useFetch";
import { getPlaces } from "@/actions/data";
import { getDestinationCoords } from "@/constants/destinations";
import type { Attraction } from "@/types/destination";

interface HubMapProps {
  destinationName: string;
}

export function HubMap({ destinationName }: HubMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ remove: () => void }[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [showAttractions, setShowAttractions] = useState(true);

  const coords = getDestinationCoords(destinationName);

  const { data: attractions } = useFetch<Attraction[]>(
    () => getPlaces(destinationName, "attractions").then((d) => d.attractions ?? null),
    [destinationName],
  );

  useEffect(() => {
    if (!coords || mapInstanceRef.current) return;

    const clat = coords.lat;
    const clon = coords.lon;
    const cstate = coords.state;
    let cancelled = false;

    async function init() {
      try {
        const leaflet = await import("leaflet");
        await import("leaflet/dist/leaflet.css");
        if (cancelled || !mapRef.current) return;

        const L = leaflet.default;
        const map = L.map(mapRef.current).setView([clat, clon], 12);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 18,
        }).addTo(map);

        const mainIcon = L.divIcon({
          className: "",
          html: `<div style="background:#D4836A;color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:16px;font-weight:bold;cursor:pointer;">📍</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        L.marker([clat, clon], { icon: mainIcon })
          .addTo(map)
          .bindPopup(`<strong>${destinationName}</strong><br/>${cstate}`);

        mapInstanceRef.current = map;
        if (!cancelled) setMapReady(true);
      } catch {
        if (!cancelled) setMapError("Failed to load map");
      }
    }

    init();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
      mapInstanceRef.current = null;
    };
  }, [coords, destinationName]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!attractions || !showAttractions || !coords || !map) return;
    const clat = coords.lat;
    const clon = coords.lon;
    const attrs = attractions;

    for (const m of markersRef.current) m.remove();
    markersRef.current = [];

    async function addMarkers() {
      const leaflet = await import("leaflet");
      const L = leaflet.default;

      for (const attraction of attrs.slice(0, 15)) {
        const offsetLat = (Math.random() - 0.5) * 0.02;
        const offsetLon = (Math.random() - 0.5) * 0.02;

        const icon = L.divIcon({
          className: "",
          html: `<div style="background:#2D2A24;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.2);font-size:12px;cursor:pointer;">★</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([clat + offsetLat, clon + offsetLon], { icon }).addTo(map);
        markersRef.current.push(marker as unknown as { remove: () => void });
      }
    }

    addMarkers();

    return () => {
      for (const m of markersRef.current) m.remove();
      markersRef.current = [];
    };
  }, [attractions, showAttractions, coords]);

  if (!coords) {
    return (
      <div className="text-center py-16 space-y-3">
        <MapPin className="w-10 h-10 text-ink-muted/40 mx-auto" />
        <p className="font-heading text-sm text-ink-muted">Map unavailable for this destination</p>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="text-center py-16 space-y-3">
        <Navigation className="w-10 h-10 text-ink-muted/40 mx-auto" />
        <p className="font-heading text-sm text-ink-muted">{mapError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-accent" />
          <h2 className="font-heading text-sm font-bold text-ink uppercase tracking-wider">
            {destinationName} Map
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-ink-muted">
            {coords.lat.toFixed(2)}°N, {coords.lon.toFixed(2)}°E
          </span>
          {attractions && attractions.length > 0 && (
            <button
              onClick={() => setShowAttractions((v) => !v)}
              className={`flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-1 rounded-bruted border transition-colors min-h-[36px] ${
                showAttractions
                  ? "bg-accent/10 text-accent border-accent/30"
                  : "bg-ink/5 text-ink-muted border-ink/10"
              }`}
            >
              <Layers className="w-3 h-3" />
              Attractions
            </button>
          )}
        </div>
      </div>

      <div
        ref={mapRef}
        className="w-full h-[400px] sm:h-[500px] rounded-[12px] border-[3px] border-ink overflow-hidden"
        style={{ zIndex: 1 }}
      >
        {!mapReady && (
          <div className="w-full h-full flex items-center justify-center bg-surface-alt/50">
            <div className="text-center space-y-3">
              <RefreshCw className="w-6 h-6 text-accent animate-spin mx-auto" />
              <p className="font-heading text-sm text-ink-muted">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full" style={{ background: "#D4836A", border: "1px solid white", boxShadow: "0 0 0 1px rgba(0,0,0,0.2)" }} />
          <span className="font-mono text-[10px] text-ink-muted">{destinationName}</span>
        </div>
        {showAttractions && attractions && attractions.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#2D2A24" }} />
            <span className="font-mono text-[10px] text-ink-muted">{attractions.length} attractions (approx.)</span>
          </div>
        )}
      </div>
    </div>
  );
}
