// scripts/build-static.js
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const OUT = path.join(ROOT, "dist");
const FILES = [
  "index.html",
  "404.html",
  "styles.css",
  "script.js",
  "manifest.json",
  "sw.js",
  "cloudflare-integration.js",
  "icons"
];

function rimrafDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const filePath = path.join(dir, entry);
    const stat = fs.lstatSync(filePath);
    if (stat.isDirectory()) rimrafDir(filePath);
    else fs.unlinkSync(filePath);
  }
  fs.rmdirSync(dir);
}

function copy(src, dest) {
  const stat = fs.lstatSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copy(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

if (fs.existsSync(OUT)) rimrafDir(OUT);
fs.mkdirSync(OUT);

for (const file of FILES) {
  const src = path.join(ROOT, file);
  if (fs.existsSync(src)) {
    copy(src, path.join(OUT, file));
    console.log(`✅ Copiado: ${file}`);
  } else {
    console.log(`⚠️  Ignorado (não encontrado): ${file}`);
  }
}

console.log("✅ Pasta dist/ gerada com sucesso!");
