// One-off script: shrink the images actually imported by src/assets/assets.js
// in place (same filenames, same extensions) so no import paths change.
// Run with: node scripts/optimize-images.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, "..", "src", "assets");

// [relative path from src/assets, max long-edge px]
const targets = [
  ["crepes.jpg", 900],
  ["ice.jpeg", 900],
  ["kent.jpg", 900],
  ["noodle.png", 900],
  ["top.jfif", 1600],
  ["top2.jpg", 1600],
  ["topping.jpg", 1600],
  ["top3.jpg", 900],
  ["top1.jpeg", 900],
  ["spuds-1.png", 900],
  ["spuds-2.png", 900],
  ["spuds-3.jpg", 900],
  ["spuds-4.png", 900],
  ["spuds-5.png", 900],
  ["logo.png", 600],
  ["recipe.jpg", 1600],
  ["kizembe.jpg", 1600],
  ["kize.png", 1600],
  ["images/water.jpeg", 1600],
  ["images/hazelnut.jpeg", 900],
  ["images/spuds.jpeg", 900],
  ["cara.jpeg", 900],
  ["cake.png", 1600],
  ["sauces.png", 1600],
  ["logo3.jfif", 300],
  ["logo2.jfif", 300],
  ["logo1.png", 300],
];

const isPng = (p) => p.toLowerCase().endsWith(".png");

async function optimize(relPath, maxSize) {
  const fullPath = path.join(assetsDir, relPath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`skip (not found): ${relPath}`);
    return;
  }
  const before = fs.statSync(fullPath).size;
  const input = fs.readFileSync(fullPath);

  let pipeline = sharp(input).resize({
    width: maxSize,
    height: maxSize,
    fit: "inside",
    withoutEnlargement: true,
  });

  pipeline = isPng(relPath)
    ? pipeline.png({ quality: 80, compressionLevel: 9, palette: true })
    : pipeline.jpeg({ quality: 78, mozjpeg: true });

  const output = await pipeline.toBuffer();
  fs.writeFileSync(fullPath, output);
  const after = output.length;
  console.log(
    `${relPath}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`,
  );
}

const run = async () => {
  for (const [relPath, maxSize] of targets) {
    await optimize(relPath, maxSize);
  }
};

run();
