// Génère les icônes PNG de l'app à partir de public/icon.svg
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(path.join(root, "public", "icon.svg"));

const targets = [
  { size: 192, file: "icon-192.png" },
  { size: 512, file: "icon-512.png" },
  { size: 180, file: "apple-touch-icon.png" },
];

for (const t of targets) {
  await sharp(svg).resize(t.size, t.size).png().toFile(path.join(root, "public", t.file));
  console.log("généré:", t.file);
}
