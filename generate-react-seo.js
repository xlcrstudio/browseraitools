/**
 * generate-react-seo.js
 * Generates client-side SEO infrastructure for browseraitools.com.
 * This is a 100% client-side site — Express only serves static files.
 *
 * Usage:
 *   node generate-react-seo.js --preview    show output + create files
 *   node generate-react-seo.js              same (no extra steps needed)
 *
 * Creates:
 *   client/src/seo-metadata.json       — SEO data for all 99 tools + homepage
 *   client/src/hooks/useToolSEO.ts     — React hook to set meta tags in-browser
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const IS_PREVIEW = process.argv.includes("--preview");
const BASE_URL   = "https://browseraitools.com";

const PATHS = {
  config:     path.join(__dirname, "tools-config.json"),
  reactLinks: path.join(__dirname, "react-tool-links.json"),
  seoMeta:    path.join(__dirname, "client", "src", "seo-metadata.json"),
  hook:       path.join(__dirname, "client", "src", "hooks", "useToolSEO.ts"),
};

// ─── Load data ────────────────────────────────────────────────────────────────
const { tools }  = JSON.parse(fs.readFileSync(PATHS.config, "utf8"));
const reactLinks = JSON.parse(fs.readFileSync(PATHS.reactLinks, "utf8"));

// ─── Title builder (≤60 chars, keyword-first) ────────────────────────────────
function buildTitle(name) {
  const full = `${name} — Free Private AI | BrowserAITools`;
  if (full.length <= 60) return full;
  const shorter = `Free ${name} | BrowserAITools`;
  if (shorter.length <= 60) return shorter;
  const maxNameLen = 60 - " | BrowserAITools".length - 5;
  return `Free ${name.slice(0, maxNameLen)}... | BrowserAITools`;
}

// ─── Description builder (~150 chars, unique per category) ───────────────────
const DESC_TEMPLATES = {
  "Writing Tools":
    (n) => `Use the free ${n}: no signup, no data sent. AI runs 100% in your browser via WebLLM. Rewrite, generate, and improve content privately.`,
  "Social Media Tools":
    (n) => `Free ${n}: create social content instantly with on-device AI. No account, no data shared. Runs 100% in your browser via WebLLM.`,
  "Business Tools":
    (n) => `Free ${n}: AI-powered business content tool. No data sent, no account needed. Runs 100% in your browser via WebLLM. Private and unlimited.`,
  "Marketing Tools":
    (n) => `Free ${n}: create high-converting copy with on-device AI. No signup, no data sent. Runs 100% in your browser via WebLLM. Private.`,
  "SEO Tools":
    (n) => `Free ${n}: improve your SEO with on-device AI. No data sent, no account needed. Runs 100% in your browser via WebLLM. Private and instant.`,
  "Job & Career Tools":
    (n) => `Free ${n}: advance your career with private AI. No signup, no data shared. Runs 100% in your browser via WebLLM. Unlimited and secure.`,
  "Productivity Tools":
    (n) => `Free ${n}: stay productive with on-device AI. No data sent, no account needed. Runs 100% in your browser via WebLLM. Private and instant.`,
  "Unique & Viral Tools":
    (n) => `Free ${n}: unique AI tool — no signup, no data sent to any server. Runs 100% in your browser via WebLLM. Private and completely free.`,
  "Developer Tools":
    (n) => `Free ${n}: developer AI tool with zero data sent to servers. No account needed. Runs 100% in your browser via WebLLM. Private and fast.`,
  "AI Assistant":
    (n) => `Free ${n}: AI assistant that runs 100% in your browser. No data sent to any server, no account needed. Powered by WebLLM. Private and unlimited.`,
};

function buildDescription(tool) {
  const fn = DESC_TEMPLATES[tool.category] ??
    ((n) => `Free ${n}: AI-powered tool. No signup, no data sent. Runs 100% in your browser via WebLLM. Private, unlimited, and completely free.`);
  const desc = fn(tool.name);
  if (desc.length <= 160) return desc;
  return desc.slice(0, 157).replace(/\s\S*$/, "") + "...";
}

// ─── Keywords builder ─────────────────────────────────────────────────────────
const CATEGORY_KEYWORDS = {
  "Writing Tools":       "writing, content creation, AI writer, text generator",
  "Social Media Tools":  "social media, captions, hashtags, content creator",
  "Business Tools":      "business, startup, entrepreneur, AI business tool",
  "Marketing Tools":     "marketing, copywriting, ad copy, email marketing",
  "SEO Tools":           "SEO, search engine optimization, keywords, content SEO",
  "Job & Career Tools":  "resume, career, job search, cover letter, LinkedIn",
  "Productivity Tools":  "productivity, planning, tasks, AI assistant",
  "Unique & Viral Tools":"viral, creative, AI tool, fun, unique",
  "Developer Tools":     "developer, code, programming, developer tools",
  "AI Assistant":        "AI assistant, chatbot, AI chat, language model",
};

function buildKeywords(tool) {
  const base = CATEGORY_KEYWORDS[tool.category] ?? "AI tool, free AI, browser AI";
  return `${tool.name.toLowerCase()}, free ${tool.name.toLowerCase()}, ${base}, free AI tool, browser AI, private AI, no signup AI, WebLLM`;
}

// ─── Build seo-metadata.json ──────────────────────────────────────────────────
function buildSeoMetadata() {
  const toolsMeta = {};

  for (const tool of tools) {
    const links = reactLinks[tool.slug] ?? { variants: [], related: [] };
    toolsMeta[tool.slug] = {
      title:       buildTitle(tool.name),
      description: buildDescription(tool),
      keywords:    buildKeywords(tool),
      og: {
        title:       buildTitle(tool.name),
        description: buildDescription(tool),
        url:         `${BASE_URL}/${tool.slug}`,
        image:       `${BASE_URL}/favicon.png`,
      },
      canonical:   `${BASE_URL}/${tool.slug}`,
      category:    tool.category,
      variants:    links.variants,
      related:     links.related,
    };
  }

  return {
    homepage: {
      title:       "BrowserAITools — 100+ Free Private AI Tools | No Signup",
      description: "100+ free AI tools that run entirely in your browser. No signup, no data sent to servers — 100% private. Powered by WebLLM and WebGPU.",
      keywords:    "free AI tools, browser AI, private AI tools, no signup AI, WebLLM tools, free online AI, in-browser AI",
      og: {
        title:       "BrowserAITools — 100+ Free Private AI Tools",
        description: "Free AI tools that run in your browser. No signup, zero data sent. Private, unlimited, instant.",
        url:         `${BASE_URL}/`,
        image:       `${BASE_URL}/favicon.png`,
      },
      canonical:   `${BASE_URL}/`,
    },
    tools: toolsMeta,
  };
}

// ─── useToolSEO.ts (client-side only) ────────────────────────────────────────
const USE_TOOL_SEO_TS = `import { useEffect } from "react";
import seoData from "../seo-metadata.json";

export interface ToolVariant {
  url: string;
  label: string;
}

export interface ToolRelated {
  slug: string;
  name: string;
  mainUrl: string;
  variantUrl: string | null;
}

export interface ToolSEOMeta {
  title: string;
  description: string;
  keywords: string;
  og: {
    title: string;
    description: string;
    url: string;
    image: string;
  };
  canonical: string;
  category?: string;
  variants?: ToolVariant[];
  related?: ToolRelated[];
}

type SeoData = {
  homepage: ToolSEOMeta;
  tools: Record<string, ToolSEOMeta>;
};

const data = seoData as SeoData;

/** Set or create a <meta name="..."> tag */
function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(\`meta[name="\${name}"]\`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Set or create a <meta property="og:..."> tag */
function setOG(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(\`meta[property="\${property}"]\`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Set or create <link rel="canonical"> */
function setCanonical(url: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

const DEFAULT_TITLE = "BrowserAITools — Free Private AI Tools | No Signup";

/**
 * useToolSEO
 *
 * Reads pre-generated metadata from seo-metadata.json (bundled by Vite at
 * build time — no network request). Updates document.title + all meta tags
 * in the browser on every route change, which is enough for Google (which
 * executes JavaScript) and for internal navigation.
 *
 * For social-share crawlers that don't execute JS, the static variant pages
 * in client/public/tools/variants/ already contain all required meta tags.
 *
 * Usage:
 *   const meta = useToolSEO("ai-chatbot");   // tool page
 *   const meta = useToolSEO(null);           // homepage
 */
export function useToolSEO(slug: string | null): ToolSEOMeta | null {
  const meta: ToolSEOMeta | null =
    slug === null ? data.homepage : data.tools[slug] ?? null;

  useEffect(() => {
    if (!meta) return;

    document.title = meta.title;
    setMeta("description", meta.description);
    setMeta("keywords", meta.keywords);
    setOG("og:title", meta.og.title);
    setOG("og:description", meta.og.description);
    setOG("og:url", meta.og.url);
    setOG("og:image", meta.og.image);
    setOG("og:type", "website");
    if (meta.canonical) setCanonical(meta.canonical);

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [meta]);

  return meta;
}
`;

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
  console.log(`\n${IS_PREVIEW ? "[PREVIEW MODE]" : "[FULL RUN]"} generate-react-seo.js`);
  console.log("100% client-side — no server middleware generated.\n");

  // 1. Build and write seo-metadata.json
  const seoMeta = buildSeoMetadata();
  fs.writeFileSync(PATHS.seoMeta, JSON.stringify(seoMeta, null, 2), "utf8");
  console.log(`✓  client/src/seo-metadata.json  (${Object.keys(seoMeta.tools).length} tools + homepage)`);

  // 2. Write useToolSEO.ts
  fs.writeFileSync(PATHS.hook, USE_TOOL_SEO_TS, "utf8");
  console.log("✓  client/src/hooks/useToolSEO.ts");

  // ── Show first 3 tool entries ───────────────────────────────────────────────
  const sampleSlugs = Object.keys(seoMeta.tools).slice(0, 3);

  console.log("\n─────────────────────────────────────────────────────────────");
  console.log("seo-metadata.json — first 3 tool entries:");
  console.log("─────────────────────────────────────────────────────────────");
  for (const slug of sampleSlugs) {
    const meta = seoMeta.tools[slug];
    console.log(`\n  [${slug}]`);
    console.log(`    title       (${meta.title.length}ch): ${meta.title}`);
    console.log(`    description (${meta.description.length}ch): ${meta.description}`);
    console.log(`    keywords    : ${meta.keywords.slice(0, 80)}…`);
    console.log(`    variants    : ${meta.variants?.length ?? 0} links`);
    console.log(`    related     : ${meta.related?.length ?? 0} links`);
  }

  // ── Show hook code ──────────────────────────────────────────────────────────
  console.log("\n─────────────────────────────────────────────────────────────");
  console.log("client/src/hooks/useToolSEO.ts:");
  console.log("─────────────────────────────────────────────────────────────");
  console.log(USE_TOOL_SEO_TS);

  // ── Validation stats ────────────────────────────────────────────────────────
  const titles = Object.values(seoMeta.tools).map((m) => m.title);
  const descs  = Object.values(seoMeta.tools).map((m) => m.description);
  const maxTitle = Math.max(...titles.map((t) => t.length));
  const minTitle = Math.min(...titles.map((t) => t.length));
  const maxDesc  = Math.max(...descs.map((d) => d.length));
  const minDesc  = Math.min(...descs.map((d) => d.length));

  console.log("─────────────────────────────────────────────────────────────");
  console.log("Validation:");
  console.log(`  Title length   : ${minTitle}–${maxTitle} chars (limit: 60)`);
  console.log(`  Desc length    : ${minDesc}–${maxDesc} chars (limit: 160)`);
  console.log(`  Titles >60ch   : ${titles.filter((t) => t.length > 60).length}`);
  console.log(`  Descs >160ch   : ${descs.filter((d) => d.length > 160).length}`);
  console.log("─────────────────────────────────────────────────────────────");
  console.log("\nFiles written:");
  console.log("  client/src/seo-metadata.json");
  console.log("  client/src/hooks/useToolSEO.ts\n");
}

main();
