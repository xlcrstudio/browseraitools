/**
 * patch-tool-personas.js
 * Adds a `personas` array to every tool in tools-config.json.
 * Run:  node patch-tool-personas.js [--preview]
 */
import fs   from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const IS_PREVIEW = process.argv.includes("--preview");
const CONFIG     = path.join(__dirname, "tools-config.json");

// ─── Persona map: slug → personas[] ─────────────────────────────────────────
// Every tool gets at least one persona. Aiming for 20-40 tools per persona
// so no page is thin and all are topically coherent.
const PERSONA_MAP = {
  // ── AI Assistant ───────────────────────────────────────────────────────────
  "ai-chatbot":                     ["students", "developers", "professionals", "writers", "founders"],

  // ── Writing Tools ──────────────────────────────────────────────────────────
  "ai-hook-generator":              ["marketers", "writers", "founders"],
  "ai-paragraph-rewriter":          ["writers", "students", "marketers"],
  "ai-sentence-simplifier":         ["writers", "students"],
  "ai-sentence-expander":           ["writers", "students"],
  "ai-sentence-shortener":          ["writers", "marketers"],
  "ai-tone-converter":              ["writers", "professionals", "marketers"],
  "ai-headline-improver":           ["writers", "marketers", "founders"],
  "ai-bullet-points-generator":     ["writers", "professionals", "marketers"],
  "ai-blog-outline-generator":      ["writers", "marketers"],
  "ai-text-summarizer":             ["students", "professionals", "writers"],
  "ai-grammar-checker":             ["students", "writers"],
  "ai-translator":                  ["students", "professionals"],
  "ai-paraphrasing-tool":           ["students", "writers"],
  "ai-image-prompt-generator":      ["marketers", "founders", "writers"],
  "ai-pdf-summarizer":              ["students", "professionals"],
  "ai-humanizer":                   ["writers", "students"],
  "ai-blog-post-generator":         ["writers", "marketers", "founders"],
  "ai-youtube-script-generator":    ["writers", "marketers"],
  "ai-faq-generator":               ["writers", "marketers", "founders"],
  "ai-essay-writer":                ["students", "writers"],
  "ai-essay-grader":                ["students"],
  "ai-content-repurposer":          ["marketers", "writers", "founders"],
  "ai-writing-feedback-coach":      ["students", "writers"],
  "word-counter":                   ["writers", "students"],
  "ai-plagiarism-checker":          ["students", "writers"],
  "case-converter":                 ["developers", "writers"],
  "lorem-ipsum-generator":          ["developers"],

  // ── Social Media Tools ─────────────────────────────────────────────────────
  "ai-instagram-caption-generator": ["marketers", "founders"],
  "ai-tiktok-caption-generator":    ["marketers", "founders"],
  "ai-linkedin-post-generator":     ["marketers", "professionals"],
  "ai-tweet-generator":             ["marketers", "founders"],
  "ai-hashtag-generator":           ["marketers"],
  "ai-youtube-title-generator":     ["marketers", "writers"],
  "ai-youtube-description-generator":["marketers", "writers"],
  "ai-instagram-bio-generator":     ["marketers", "founders"],
  "ai-youtube-summarizer":          ["students", "professionals"],

  // ── Business Tools ─────────────────────────────────────────────────────────
  "ai-business-name-generator":     ["founders"],
  "ai-startup-name-generator":      ["founders"],
  "ai-business-idea-generator":     ["founders"],
  "ai-value-proposition-generator": ["founders", "marketers"],
  "ai-elevator-pitch-generator":    ["founders", "professionals"],
  "ai-target-audience-generator":   ["founders", "marketers"],

  // ── Marketing Tools ────────────────────────────────────────────────────────
  "ai-ad-copy-generator":           ["marketers", "founders"],
  "ai-email-response-generator":    ["professionals", "marketers"],
  "ai-sales-email-generator":       ["professionals", "founders", "marketers"],
  "ai-cold-outreach-generator":     ["professionals", "founders", "marketers"],
  "ai-cta-generator":               ["marketers", "founders"],
  "ai-landing-page-copy-generator": ["founders", "marketers"],

  // ── SEO Tools ──────────────────────────────────────────────────────────────
  "ai-meta-description-generator":  ["marketers", "founders", "developers"],
  "ai-seo-title-generator":         ["marketers", "founders"],
  "ai-keyword-generator":           ["marketers", "founders"],
  "ai-content-brief-generator":     ["marketers", "writers", "founders"],
  "ai-internal-link-suggestion-tool":["marketers", "developers"],
  "ai-content-gap-analyzer":        ["marketers", "founders"],
  "ai-schema-markup-generator":     ["developers", "marketers"],
  "ai-serp-intent-analyzer":        ["marketers", "founders"],

  // ── Job & Career Tools ─────────────────────────────────────────────────────
  "ai-resume-bullet-generator":     ["professionals", "students"],
  "ai-cover-letter-generator":      ["professionals", "students"],
  "ai-linkedin-summary-generator":  ["professionals"],
  "ai-interview-answer-generator":  ["professionals", "students"],
  "ai-ats-resume-matcher":          ["professionals", "students"],

  // ── Productivity Tools ─────────────────────────────────────────────────────
  "ai-todo-list-generator":         ["students", "professionals"],
  "ai-meeting-summary-generator":   ["professionals"],
  "ai-weekly-planner-generator":    ["students", "professionals"],
  "ai-goal-planner":                ["students", "professionals", "founders"],

  // ── Unique & Viral Tools ───────────────────────────────────────────────────
  "ai-decision-maker":              ["professionals", "founders", "students"],
  "ai-pros-and-cons-generator":     ["professionals", "founders", "students"],
  "ai-debate-generator":            ["students", "founders"],
  "ai-excuse-generator":            ["students"],
  "ai-compliment-generator":        ["writers"],
  "ai-roast-generator":             ["writers", "marketers"],
  "ai-story-starter":               ["writers", "students"],
  "ai-prompt-generator":            ["developers", "writers"],
  "ai-document-analyzer":           ["students", "professionals"],
  "ai-message-analyzer":            ["professionals", "marketers"],
  "explain-this-ai":                ["students", "developers"],
  "ai-dating-profile-generator":    ["writers"],
  "ai-meal-planner":                ["students", "professionals"],
  "ai-travel-itinerary-planner":    ["professionals", "students"],
  "ai-flashcard-generator":         ["students"],
  "ai-personal-statement-generator":["students"],
  "ai-local-knowledge-chat":        ["professionals", "developers"],
  "ai-citation-generator":          ["students"],
  "ai-readability-analyzer":        ["students", "writers"],
  "ai-contract-simplifier":         ["professionals", "founders"],
  "ai-pii-redactor":                ["professionals", "developers"],
  "random-number-generator":        ["developers"],
  "diff-checker":                   ["developers"],
  "color-palette-generator":        ["developers", "marketers"],
  "password-generator":             ["developers"],
  "ai-homework-solver":             ["students"],
  "ai-text-detector":               ["writers", "students"],
  "ai-pdf-chat":                    ["students", "professionals"],

  // ── Developer Tools ────────────────────────────────────────────────────────
  "ai-code-playground":             ["developers"],
  "ai-code-explainer":              ["developers", "students"],
  "regex-tester":                   ["developers"],
  "markdown-converter":             ["developers", "writers"],
  "json-validator":                 ["developers"],
};

// ─── Patch ────────────────────────────────────────────────────────────────────
const raw   = JSON.parse(fs.readFileSync(CONFIG, "utf8"));
const tools = raw.tools;

let patched = 0;
let missing = [];

const updated = tools.map((tool) => {
  const personas = PERSONA_MAP[tool.slug];
  if (!personas) {
    missing.push(tool.slug);
    return tool; // leave unmodified if somehow not mapped
  }
  patched++;
  return { ...tool, personas };
});

// ─── Counts per persona ───────────────────────────────────────────────────────
const personaNames = ["students", "marketers", "developers", "professionals", "writers", "founders"];
const counts = Object.fromEntries(personaNames.map((p) => [p, 0]));
updated.forEach((t) => (t.personas || []).forEach((p) => counts[p]++));

if (IS_PREVIEW) {
  console.log("\n── Sample: first 5 tools with personas ──────────────────────────\n");
  updated.slice(0, 5).forEach((t) => {
    console.log(JSON.stringify({ name: t.name, slug: t.slug, category: t.category, personas: t.personas }, null, 2));
  });

  console.log("\n── Tool counts per persona ──────────────────────────────────────");
  personaNames.forEach((p) => console.log(`  ${p.padEnd(15)}: ${counts[p]} tools`));

  if (missing.length) console.log("\n⚠ Unmapped slugs:", missing);
  else console.log("\n✓ All", patched, "tools mapped — no unmapped slugs.");
  process.exit(0);
}

// ─── Write ────────────────────────────────────────────────────────────────────
raw.tools = updated;
fs.writeFileSync(CONFIG, JSON.stringify(raw, null, 2), "utf8");

console.log("\n── Tool counts per persona ──────────────────────────────────────");
personaNames.forEach((p) => console.log(`  ${p.padEnd(15)}: ${counts[p]} tools`));

if (missing.length) console.log("\n⚠ Unmapped:", missing);
console.log(`\n✅ tools-config.json updated — ${patched} tools now have personas field.`);
