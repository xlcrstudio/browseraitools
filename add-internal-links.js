/**
 * add-internal-links.js
 * Injects enhanced internal-link sections into every variant HTML page.
 *
 * Usage:
 *   node add-internal-links.js --preview    (process first 3 files only)
 *   node add-internal-links.js              (process all 594 files)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Config ──────────────────────────────────────────────────────────────────
const BASE_URL       = "https://browseraitools.com";
const VARIANTS_DIR   = path.join(__dirname, "client", "public", "tools", "variants");
const CONFIG_FILE    = path.join(__dirname, "tools-config.json");
const REPORT_FILE    = path.join(__dirname, "related-links-report.json");
const REACT_FILE     = path.join(__dirname, "react-tool-links.json");
const PREVIEW_DIR    = path.join(__dirname, "preview-internal-links");

const IS_PREVIEW = process.argv.includes("--preview");
const PREVIEW_LIMIT = 3;

// ─── Load tools config ────────────────────────────────────────────────────────
const { tools } = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
const toolBySlug = Object.fromEntries(tools.map((t) => [t.slug, t]));

// ─── Variant type detection from filename ─────────────────────────────────────
const VARIANT_META = {
  free:      { label: "Free Version",       qualifier: "free"       },
  best:      { label: "Best 2025",          qualifier: "best"       },
  nosignup:  { label: "No Signup Required", qualifier: "no-signup"  },
  private:   { label: "Private & Secure",   qualifier: "private"    },
  browser:   { label: "Browser-Based",      qualifier: "browser"    },
  unlimited: { label: "Free & Unlimited",   qualifier: "unlimited"  },
};

function detectVariantType(filename) {
  if (filename.startsWith("free-"))             return "free";
  if (filename.startsWith("best-"))             return "best";
  if (filename.startsWith("private-"))          return "private";
  if (filename.endsWith("-no-signup.html"))      return "nosignup";
  if (filename.endsWith("-runs-in-browser.html")) return "browser";
  if (filename.endsWith("-free-unlimited.html")) return "unlimited";
  return "free";
}

function variantLabel(filename) {
  return VARIANT_META[detectVariantType(filename)]?.label ?? "Free Version";
}

// ─── Category icons (text-safe, no emoji issues in HTML) ─────────────────────
const CATEGORY_ICONS = {
  "Writing Tools":    "✍",
  "Social Media Tools": "📱",
  "Business Tools":   "💼",
  "Marketing Tools":  "📣",
  "SEO Tools":        "🔍",
  "Job & Career Tools": "👔",
  "Productivity Tools": "⚡",
  "Unique & Viral Tools": "🎯",
  "Developer Tools":  "💻",
  "AI Assistant":     "🤖",
};

function toolIcon(slug) {
  const tool = toolBySlug[slug];
  return CATEGORY_ICONS[tool?.category] ?? "🤖";
}

// ─── Extract canonical slug from HTML ────────────────────────────────────────
function extractSlug(html) {
  const m = html.match(/<link rel="canonical" href="https:\/\/browseraitools\.com\/([^"]+)"/);
  return m?.[1] ?? null;
}

// ─── Build the full variant index: slug → [filenames] ────────────────────────
function buildVariantIndex() {
  const files = fs.readdirSync(VARIANTS_DIR).filter((f) => f.endsWith(".html"));
  const idx = {};
  for (const filename of files) {
    const html = fs.readFileSync(path.join(VARIANTS_DIR, filename), "utf8");
    const slug = extractSlug(html);
    if (!slug) continue;
    if (!idx[slug]) idx[slug] = [];
    idx[slug].push(filename);
  }
  return idx;
}

// ─── Build a single link card HTML ───────────────────────────────────────────
function card({ href, icon, title, subtitle, badge }) {
  return `        <a href="${href}" class="related-item">
          <div class="related-icon">${icon}</div>
          <div style="min-width:0;flex:1">
            <div class="related-name">${title}</div>
            <div class="related-cat">${subtitle}</div>
          </div>${badge ? `\n          <span style="flex-shrink:0;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:2px 7px;border-radius:9999px;background:#f3e8ff;color:#6b21a8">${badge}</span>` : ""}
        </a>`;
}

// ─── Build the enhanced Related Tools section ─────────────────────────────────
function buildSection({ tool, currentFile, variantIndex }) {
  const currentType = detectVariantType(currentFile);
  const cards = [];

  // ── Block A: other keyword variants of the SAME tool (2-3 links) ──────────
  const sameToolOthers = (variantIndex[tool.slug] ?? [])
    .filter((f) => f !== currentFile)
    .slice(0, 3);

  for (const f of sameToolOthers) {
    cards.push(card({
      href:     `${BASE_URL}/tools/variants/${f}`,
      icon:     toolIcon(tool.slug),
      title:    tool.name,
      subtitle: variantLabel(f),
      badge:    "Variant",
    }));
  }

  // ── Block B: one variant page per related tool (up to 5 links) ────────────
  const preferredTypes = ["free", "best", "private", "browser", "nosignup", "unlimited"];
  // Pick a variant type different from the current page for variety
  const altTypes = preferredTypes.filter((t) => t !== currentType);

  for (const relSlug of (tool.relatedSlugs ?? []).slice(0, 5)) {
    const relTool = toolBySlug[relSlug];
    if (!relTool) continue;
    const relFiles = variantIndex[relSlug] ?? [];
    if (!relFiles.length) continue;

    // Pick a variant that's a different type from the current page
    const picked =
      relFiles.find((f) => altTypes.includes(detectVariantType(f))) ?? relFiles[0];

    cards.push(card({
      href:     `${BASE_URL}/tools/variants/${picked}`,
      icon:     toolIcon(relSlug),
      title:    relTool.name,
      subtitle: `${variantLabel(picked)} · ${relTool.category.replace(" Tools", "")}`,
      badge:    null,
    }));
  }

  // ── Block C: main tool page links for the related tools (fills to 9 total) ─
  if (cards.length < 8) {
    for (const relSlug of (tool.relatedSlugs ?? []).slice(0, 3)) {
      if (cards.length >= 9) break;
      const relTool = toolBySlug[relSlug];
      if (!relTool) continue;
      cards.push(card({
        href:     `${BASE_URL}/${relSlug}`,
        icon:     toolIcon(relSlug),
        title:    relTool.name,
        subtitle: `${relTool.category} · Main page`,
        badge:    null,
      }));
    }
  }

  const linkCount = cards.length;

  const html = `
    <!-- Related Tools -->
    <section class="section">
      <h2 class="section-title">Related Free AI Tools</h2>
      <div class="related-grid">
${cards.join("\n")}
      </div>
      <div class="see-all">
        <a href="${BASE_URL}/#tools">Browse all ${tools.length}+ free AI tools &rarr;</a>
      </div>
    </section>

`;

  return { html, linkCount };
}

// ─── Inject into a single HTML file ──────────────────────────────────────────
function processFile({ filename, variantIndex, outputDir }) {
  const inPath  = path.join(VARIANTS_DIR, filename);
  const outPath = path.join(outputDir, filename);

  const html    = fs.readFileSync(inPath, "utf8");
  const slug    = extractSlug(html);
  if (!slug) return { filename, slug: null, linksInjected: 0, skipped: true };

  const tool = toolBySlug[slug];
  if (!tool) return { filename, slug, linksInjected: 0, skipped: true };

  // Replace the existing Related Tools section (from marker to blank line before FAQ)
  const START_MARKER = "    <!-- Related Tools -->";
  const END_MARKER   = "    <!-- FAQ -->";

  const startIdx = html.indexOf(START_MARKER);
  const endIdx   = html.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1) {
    return { filename, slug, linksInjected: 0, skipped: true, reason: "markers not found" };
  }

  const { html: newSection, linkCount } = buildSection({
    tool,
    currentFile: filename,
    variantIndex,
  });

  const newHtml =
    html.slice(0, startIdx) +
    newSection +
    html.slice(endIdx);

  fs.writeFileSync(outPath, newHtml, "utf8");

  return { filename, slug, linksInjected: linkCount, skipped: false };
}

// ─── Generate react-tool-links.json helper ────────────────────────────────────
function generateReactLinks(variantIndex) {
  const output = {};
  for (const tool of tools) {
    const variants = (variantIndex[tool.slug] ?? []).slice(0, 3).map((f) => ({
      url:   `/tools/variants/${f}`,
      label: variantLabel(f),
    }));
    const related = (tool.relatedSlugs ?? []).slice(0, 4).map((slug) => {
      const relFiles = variantIndex[slug] ?? [];
      const picked   = relFiles[0] ?? null;
      return {
        slug,
        name:       toolBySlug[slug]?.name ?? slug,
        mainUrl:    `/${slug}`,
        variantUrl: picked ? `/tools/variants/${picked}` : null,
      };
    });
    output[tool.slug] = { variants, related };
  }
  return output;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
  console.log("\nBuilding variant index…");
  const variantIndex = buildVariantIndex();

  const allFiles = fs.readdirSync(VARIANTS_DIR).filter((f) => f.endsWith(".html"));
  const filesToProcess = IS_PREVIEW ? allFiles.slice(0, PREVIEW_LIMIT) : allFiles;

  // Set output directory
  const outputDir = IS_PREVIEW ? PREVIEW_DIR : VARIANTS_DIR;
  if (IS_PREVIEW) {
    if (!fs.existsSync(PREVIEW_DIR)) fs.mkdirSync(PREVIEW_DIR, { recursive: true });
    console.log(`\n[PREVIEW MODE] Processing ${PREVIEW_LIMIT} files → ${PREVIEW_DIR}\n`);
  } else {
    console.log(`\nProcessing all ${filesToProcess.length} variant files…\n`);
  }

  const report = [];
  let totalLinks = 0;

  for (const filename of filesToProcess) {
    const result = processFile({ filename, variantIndex, outputDir });
    report.push(result);
    totalLinks += result.linksInjected;
    const status = result.skipped ? "SKIP" : "OK  ";
    console.log(`  ${status}  ${filename}`);
  }

  // ── Save react-tool-links.json (always) ────────────────────────────────────
  const reactLinks = generateReactLinks(variantIndex);
  fs.writeFileSync(REACT_FILE, JSON.stringify(reactLinks, null, 2), "utf8");

  // ── Save report ────────────────────────────────────────────────────────────
  const reportFile = IS_PREVIEW
    ? path.join(__dirname, "related-links-report-preview.json")
    : REPORT_FILE;

  const fullReport = {
    mode:          IS_PREVIEW ? "preview" : "full",
    processedAt:   new Date().toISOString(),
    totalFiles:    filesToProcess.length,
    totalModified: report.filter((r) => !r.skipped).length,
    totalSkipped:  report.filter((r) =>  r.skipped).length,
    totalLinks,
    avgLinksPerPage: +(totalLinks / (report.filter((r) => !r.skipped).length || 1)).toFixed(1),
    files: report,
  };

  fs.writeFileSync(reportFile, JSON.stringify(fullReport, null, 2), "utf8");

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log(`
──────────────────────────────────────────────────
${IS_PREVIEW ? "PREVIEW COMPLETE" : "DONE"}
  Mode              : ${IS_PREVIEW ? "Preview (first " + PREVIEW_LIMIT + " files)" : "Full batch"}
  Files processed   : ${filesToProcess.length}
  Files modified    : ${report.filter((r) => !r.skipped).length}
  Total links added : ${totalLinks}
  Avg links/page    : ${fullReport.avgLinksPerPage}
  Output dir        : ${outputDir}
  Report saved      : ${reportFile}
  React links JSON  : ${REACT_FILE}
──────────────────────────────────────────────────
${IS_PREVIEW ? `\nPreview files are in: ${PREVIEW_DIR}\nReview them, then run: node add-internal-links.js\n` : ""}
`);
}

main();
