/**
 * generate-unified-sitemap.js
 * Generates client/public/sitemap.xml and client/public/robots.txt
 *
 * Usage: node generate-unified-sitemap.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL    = "https://browseraitools.com";
const TODAY       = "2026-03-27";
const PUBLIC_DIR  = path.join(__dirname, "client", "public");
const CONFIG_FILE = path.join(__dirname, "tools-config.json");
const VARIANTS_SITEMAP = path.join(PUBLIC_DIR, "sitemap-variants.xml");
const OUT_SITEMAP = path.join(PUBLIC_DIR, "sitemap.xml");
const OUT_ROBOTS  = path.join(PUBLIC_DIR, "robots.txt");

// ─── Load tools config ────────────────────────────────────────────────────────
const { tools } = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));

// ─── Extract variant URLs from existing sitemap-variants.xml ─────────────────
const variantsXml = fs.readFileSync(VARIANTS_SITEMAP, "utf8");
const variantUrls = [...variantsXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

// ─── Build <url> entries ──────────────────────────────────────────────────────
function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const entries = [];

// 1. Homepage
entries.push(urlEntry({
  loc:        `${BASE_URL}/`,
  lastmod:    TODAY,
  changefreq: "daily",
  priority:   "1.0",
}));

// 2. Static utility pages
entries.push(urlEntry({
  loc:        `${BASE_URL}/contact`,
  lastmod:    TODAY,
  changefreq: "yearly",
  priority:   "0.4",
}));

// 3. Main tool pages (one per unique slug)
for (const tool of tools) {
  entries.push(urlEntry({
    loc:        `${BASE_URL}/tools/${tool.slug}.html`,
    lastmod:    TODAY,
    changefreq: "weekly",
    priority:   "0.8",
  }));
}

// 3. All 594 variant pages (from sitemap-variants.xml, update priority to 0.7)
for (const loc of variantUrls) {
  entries.push(urlEntry({
    loc,
    lastmod:    TODAY,
    changefreq: "monthly",
    priority:   "0.7",
  }));
}

// ─── Write sitemap.xml ────────────────────────────────────────────────────────
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

fs.writeFileSync(OUT_SITEMAP, sitemapXml, "utf8");

// ─── Write robots.txt ─────────────────────────────────────────────────────────
const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${BASE_URL}/sitemap.xml

# AI Tools Directory - 100% Free & Private Browser Tools
`;

fs.writeFileSync(OUT_ROBOTS, robotsTxt, "utf8");

// ─── Console output ───────────────────────────────────────────────────────────
const totalUrls = entries.length;

console.log(`
──────────────────────────────────────────────────────────
  Homepage          : 1 URL
  Static pages      : 1 URL  (/contact)
  Main tool pages   : ${tools.length} URLs
  Variant pages     : ${variantUrls.length} URLs
  ─────────────────────────────────────────────────────
  Total URLs        : ${totalUrls}
──────────────────────────────────────────────────────────

First 15 lines of sitemap.xml:
───────────────────────────────`);

const first15 = sitemapXml.split("\n").slice(0, 15).join("\n");
console.log(first15);

console.log(`
Full robots.txt:
───────────────────────────────
${robotsTxt.trim()}
───────────────────────────────

✅ Unified sitemap.xml and robots.txt generated in client/public/
`);
