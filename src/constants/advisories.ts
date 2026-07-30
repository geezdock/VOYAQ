import type { GovAdvisory } from "@/types/intel";

export const GOV_ADVISORIES: GovAdvisory[] = [
  {
    state: "Himachal Pradesh",
    severity: "advisory",
    title: "Mountain Road Safety",
    description: "Mountain roads in Himachal can be narrow and prone to landslides during monsoon (Jul–Sep). Check road conditions before traveling, avoid night driving in hilly areas, and carry chains if driving to higher altitudes.",
    source: "State Tourism Dept",
    updatedAt: "2026-06-01",
  },
  {
    state: "Ladakh",
    severity: "warning",
    title: "Altitude Sickness Risk",
    description: "Ladakh is at high altitude (3,500m+). Acclimatize for 2 days before strenuous activity. Avoid alcohol, stay hydrated, and carry Diamox if prone to altitude sickness. Khardung La pass requires prior acclimatization.",
    source: "Ministry of Tourism",
    updatedAt: "2026-05-15",
  },
  {
    state: "Uttarakhand",
    severity: "advisory",
    title: "Char Dham Yatra Regulations",
    description: "The Char Dham Yatra (May–Oct) requires mandatory registration. Expect heavy traffic and limited accommodation. Check weather before attempting high-altitude temples like Kedarnath.",
    source: "Uttarakhand Tourism",
    updatedAt: "2026-05-01",
  },
  {
    state: "Goa",
    severity: "info",
    title: "Monsoon Season Precautions",
    description: "Goa's monsoon (Jun–Sep) brings rough seas. Red flags on beaches mean no swimming. Water sports may be suspended. Carry insect repellent due to increased mosquito activity.",
    source: "Goa Tourism",
    updatedAt: "2026-06-10",
  },
  {
    state: "Rajasthan",
    severity: "advisory",
    title: "Desert Heat Safety",
    description: "Summer temperatures in Rajasthan can exceed 45°C (Apr–Jun). Carry water, avoid midday outdoor activity, and wear sun protection. Desert safaris are best done early morning or late evening.",
    source: "IMD",
    updatedAt: "2026-04-01",
  },
  {
    state: "Kerala",
    severity: "advisory",
    title: "Monsoon Landslide Risk",
    description: "Kerala's monsoon (Jun–Sep) can cause landslides in hill stations like Munnar and Wayanad. Check district warnings before traveling to hilly areas. Avoid trekking during heavy rain.",
    source: "Kerala SDMA",
    updatedAt: "2026-06-01",
  },
  {
    state: "Sikkim",
    severity: "warning",
    title: "Nathula Pass Permits",
    description: "Nathula Pass requires a Protected Area Permit (PAP), obtainable through registered tour operators. The pass is open only on Wed–Sun and subject to weather clearance. Foreign nationals need additional permits.",
    source: "Sikkim Tourism",
    updatedAt: "2026-05-01",
  },
  {
    state: "Jammu & Kashmir",
    severity: "advisory",
    title: "Seasonal Access Restrictions",
    description: "Some areas in Kashmir may have seasonal access restrictions. Check local news before traveling to border regions. Srinagar–Leh highway opens fully by May/June depending on snow clearance.",
    source: "J&K Tourism",
    updatedAt: "2026-05-20",
  },
  {
    state: "Meghalaya",
    severity: "info",
    title: "Heavy Rainfall Warning",
    description: "Meghalaya receives the heaviest rainfall in India (Jun–Sep). Carry rain gear, check road conditions (landslides possible), and avoid trekking to waterfalls during heavy rain. Cherrapunji and Mawsynram see daily rain.",
    source: "IMD",
    updatedAt: "2026-06-05",
  },
  {
    state: "Andaman & Nicobar",
    severity: "advisory",
    title: "Ferry Schedule & Weather",
    description: "Ferry services to islands are weather-dependent, especially during monsoon (May–Nov). Book in advance and allow buffer days. Carry mosquito repellent — dengue is prevalent.",
    source: "Andaman Tourism",
    updatedAt: "2026-06-01",
  },
];

export function getAdvisoriesByState(state: string): GovAdvisory[] {
  return GOV_ADVISORIES.filter(
    (a) => a.state.toLowerCase() === state.toLowerCase(),
  );
}
