import { NextResponse } from "next/server";
import { getDestinationCoords } from "@/lib/destinations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dest = searchParams.get("dest");

  if (!dest) {
    return NextResponse.json({ error: "Missing 'dest' parameter" }, { status: 400 });
  }

  const coords = getDestinationCoords(dest);
  const key = dest.toLowerCase().trim();
  const state = coords?.state ?? "";

  try {
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(key + " festivals events")}&format=json&srlimit=3`,
      { headers: { "User-Agent": "VOYAQ/1.0" } },
    );
    const searchData = await searchRes.json();
    const pages = searchData?.query?.search ?? [];

    const eventPages = await Promise.all(
      pages.slice(0, 2).map(async (page: any) => {
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page.title)}`,
          { headers: { "User-Agent": "VOYAQ/1.0" } },
        );
        if (!res.ok) return null;
        return res.json();
      }),
    );

    const events = eventPages
      .filter(Boolean)
      .slice(0, 6)
      .map((page: any, i: number) => ({
        name: page.titles?.normalized ?? page.title ?? `Event in ${dest}`,
        date: page.description?.includes("festival") ? "Seasonal" : "Annual",
        description: page.extract?.split("\n")[0]?.slice(0, 200) ?? `Cultural event in ${dest}`,
        venue: key.charAt(0).toUpperCase() + key.slice(1),
        category: page.description?.includes("festival")
          ? "Cultural Festival"
          : page.description?.includes("music")
            ? "Music Festival"
            : "Local Event",
      }));

    if (events.length === 0) {
      events.push({
        name: `${dest.charAt(0).toUpperCase() + dest.slice(1)} Festival Season`,
        date: "Seasonal",
        description: `${dest} hosts various cultural festivals and events throughout the year. Check local listings for upcoming events during your visit.`,
        venue: key.charAt(0).toUpperCase() + key.slice(1),
        category: "Cultural Festival",
      });
    }

    return NextResponse.json({ events });
  } catch {
    return NextResponse.json(
      { events: [{ name: "Local Events", date: "Check locally", description: `Events and festivals in ${state || dest} area.`, venue: dest.charAt(0).toUpperCase() + dest.slice(1), category: "Local Event" }] },
    );
  }
}
