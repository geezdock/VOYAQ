import sharp from "sharp";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const svgPath = resolve(root, "src", "app", "icon.svg");

const svg = readFileSync(svgPath, "utf-8");

await Promise.all([
  sharp(Buffer.from(svg)).resize(192, 192).png().toFile(resolve(root, "public", "icon-192x192.png")),
  sharp(Buffer.from(svg)).resize(512, 512).png().toFile(resolve(root, "public", "icon-512x512.png")),
]);

console.log("PWA icons generated");
