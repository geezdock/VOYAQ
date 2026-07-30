import sharp from "sharp";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public");

const WIDTH = 1280;
const HEIGHT = 640;

// Generate a simple SVG that looks like a branded OG card
const svg = `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="50%" stop-color="#16213e"/>
      <stop offset="100%" stop-color="#0f3460"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>

  <!-- Decorative circles -->
  <circle cx="1100" cy="100" r="180" fill="#f97316" opacity="0.08"/>
  <circle cx="150" cy="500" r="140" fill="#f97316" opacity="0.06"/>
  <circle cx="640" cy="320" r="300" fill="#f97316" opacity="0.03"/>

  <!-- Accent bar -->
  <rect x="80" y="280" width="60" height="6" rx="3" fill="url(#accent)"/>

  <!-- VOYAQ title -->
  <text x="80" y="250" font-family="sans-serif" font-size="72" font-weight="800" fill="#ffffff" letter-spacing="8">
    VOYAQ
  </text>

  <!-- Tagline -->
  <text x="80" y="340" font-family="sans-serif" font-size="28" fill="#94a3b8" letter-spacing="2">
    Plan trips. Together.
  </text>

  <!-- Feature bullets -->
  <text x="80" y="410" font-family="sans-serif" font-size="18" fill="#64748b">
    ● Squad-based trip planning for Indian students
  </text>
  <text x="80" y="450" font-family="sans-serif" font-size="18" fill="#64748b">
    ● Vote on destinations, align budgets, coordinate dates
  </text>
  <text x="80" y="490" font-family="sans-serif" font-size="18" fill="#64748b">
    ● AI-powered itineraries &amp; destination intelligence
  </text>

  <!-- Bottom-right decoration -->
  <text x="1200" y="590" font-family="monospace" font-size="14" fill="#334155" text-anchor="end">
    voyaq.app
  </text>

  <!-- Travel dots pattern -->
  <g fill="#f97316" opacity="0.15">
    <circle cx="100" cy="580" r="3"/>
    <circle cx="120" cy="570" r="2"/>
    <circle cx="140" cy="585" r="2.5"/>
    <circle cx="160" cy="575" r="2"/>
    <circle cx="180" cy="590" r="3"/>
    <circle cx="200" cy="565" r="2"/>
    <circle cx="220" cy="580" r="2.5"/>
  </g>
</svg>`;

async function main() {
  const buffer = Buffer.from(svg);
  await sharp(buffer).png().toFile(join(outDir, "og-image.png"));
  console.log("OG image generated: public/og-image.png");
}

main().catch(console.error);
