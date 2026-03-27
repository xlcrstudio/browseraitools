/**
 * generate-react-seo.js
 * Generates SEO infrastructure for browseraitools.com React app.
 *
 * Usage:
 *   node generate-react-seo.js --preview    (preview only — creates files, no prod edits)
 *   node generate-react-seo.js              (full run — same output, no extra steps)
 *
 * Creates:
 *   client/src/seo-metadata.json
 *   client/src/hooks/useToolSEO.ts
 *   server/seoMiddleware.ts
 *
 * Does NOT touch server/index.ts — prints the exact snippet to add manually.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const IS_PREVIEW = process.argv.includes("--preview");
const BASE_URL   = "https://browseraitools.com";

const PATHS = {
  config:       path.join(__dirname, "tools-config.json"),
  reactLinks:   path.join(__dirname, "react-tool-links.json"),
  seoMeta:      path.join(__dirname, "client", "src", "seo-metadata.json"),
  hook:         path.join(__dirname, "client", "src", "hooks", "useToolSEO.ts"),
  middleware:   path.join(__dirname, "server", "seoMiddleware.ts"),
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
  // Absolute fallback — truncate name
  const maxNameLen = 60 - " | BrowserAITools".length - 5;
  return `Free ${name.slice(0, maxNameLen)}... | BrowserAITools`;
}

// ─── Description builder (~150 chars, unique per category) ───────────────────
// Template chosen so the final string stays ≤160 chars for all tool names
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

// ─── Build full seo-metadata.json ─────────────────────────────────────────────
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

// ─── useToolSEO.ts ────────────────────────────────────────────────────────────
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

/** Set a <meta> tag by name, creating it if absent. */
function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(\`meta[name="\${name}"]\`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Set an Open Graph <meta> tag by property. */
function setOG(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(\`meta[property="\${property}"]\`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Set <link rel="canonical"> */
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
 * Pass a tool slug (e.g. "ai-chatbot") to get its SEO metadata
 * and automatically update document.title + meta tags on mount.
 * Pass null for the homepage.
 */
export function useToolSEO(slug: string | null): ToolSEOMeta | null {
  const meta: ToolSEOMeta | null =
    slug === null
      ? data.homepage
      : data.tools[slug] ?? null;

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

// ─── seoMiddleware.ts ─────────────────────────────────────────────────────────
const SEO_MIDDLEWARE_TS = `import { type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";

// ── Types ──────────────────────────────────────────────────────────────────────
interface OgMeta {
  title: string;
  description: string;
  url: string;
  image: string;
}

interface PageMeta {
  title: string;
  description: string;
  keywords: string;
  og: OgMeta;
  canonical: string;
}

interface SeoData {
  homepage: PageMeta;
  tools: Record<string, PageMeta>;
}

// ── Load SEO metadata once at startup ────────────────────────────────────────
// In production the file is in client/src/ (source), accessible at build time.
// If the JSON was bundled by Vite, import it directly instead.
let seoData: SeoData | null = null;

const SEO_PATHS = [
  path.join(process.cwd(), "client", "src", "seo-metadata.json"),
  path.join(__dirname, "..", "client", "src", "seo-metadata.json"),
];

for (const p of SEO_PATHS) {
  if (fs.existsSync(p)) {
    try {
      seoData = JSON.parse(fs.readFileSync(p, "utf8")) as SeoData;
      break;
    } catch {
      // continue
    }
  }
}

if (!seoData) {
  console.warn("[seoMiddleware] seo-metadata.json not found — middleware disabled.");
}

// ── Inject meta tags into index.html HTML string ─────────────────────────────
function injectMeta(html: string, meta: PageMeta): string {
  return html
    // Replace <title>
    .replace(/<title>[^<]*<\\/title>/, \`<title>\${meta.title}</title>\`)
    // Replace meta description
    .replace(
      /<meta name="description" content="[^"]*"/,
      \`<meta name="description" content="\${meta.description}"\`
    )
    // Inject before </head>: OG tags + keywords + canonical
    .replace(
      /<\\/head>/,
      \`  <meta property="og:title" content="\${meta.og.title}" />
  <meta property="og:description" content="\${meta.og.description}" />
  <meta property="og:url" content="\${meta.og.url}" />
  <meta property="og:image" content="\${meta.og.image}" />
  <meta property="og:type" content="website" />
  <meta name="keywords" content="\${meta.keywords}" />
  <link rel="canonical" href="\${meta.canonical}" />
</head>\`
    );
}

// ── Resolve index.html path ───────────────────────────────────────────────────
function getIndexHtml(): string | null {
  const candidates = [
    path.join(process.cwd(), "server", "public", "index.html"),
    path.join(__dirname, "public", "index.html"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// ── Middleware ────────────────────────────────────────────────────────────────
export function seoMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Only handle GET requests for page routes
  if (req.method !== "GET") return next();
  if (req.path.startsWith("/api")) return next();
  if (req.path.startsWith("/tools/variants")) return next();
  if (req.path.includes(".")) return next(); // skip static assets

  if (!seoData) return next();

  const slug = req.path.replace(/^\\//, "") || null;
  const meta: PageMeta | null =
    slug === null || slug === ""
      ? seoData.homepage
      : seoData.tools[slug] ?? null;

  if (!meta) return next();

  const indexPath = getIndexHtml();
  if (!indexPath) return next();

  try {
    const html = fs.readFileSync(indexPath, "utf8");
    const modified = injectMeta(html, meta);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(modified);
  } catch {
    next();
  }
}
`;

// ─── server/index.ts snippet ──────────────────────────────────────────────────
const INDEX_TS_SNIPPET = `// ── Add at the top of server/index.ts (with other imports): ──────────────────
import { seoMiddleware } from "./seoMiddleware";

// ── Add inside the async IIFE, inside the production block: ───────────────────
if (process.env.NODE_ENV === "production") {
  app.use(seoMiddleware);   // ← ADD THIS LINE (before serveStatic)
  serveStatic(app);
}
`;

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
  console.log(`\n${IS_PREVIEW ? "[PREVIEW MODE]" : "[FULL RUN]"} generate-react-seo.js\n`);

  // 1. Build seo-metadata.json
  const seoMeta = buildSeoMetadata();
  fs.writeFileSync(PATHS.seoMeta, JSON.stringify(seoMeta, null, 2), "utf8");
  console.log(`✓  client/src/seo-metadata.json  (${Object.keys(seoMeta.tools).length} tools + homepage)`);

  // 2. Write useToolSEO.ts
  fs.writeFileSync(PATHS.hook, USE_TOOL_SEO_TS, "utf8");
  console.log("✓  client/src/hooks/useToolSEO.ts");

  // 3. Write seoMiddleware.ts
  fs.writeFileSync(PATHS.middleware, SEO_MIDDLEWARE_TS, "utf8");
  console.log("✓  server/seoMiddleware.ts");

  console.log("\n✗  server/index.ts  — NOT modified (see snippet below)\n");

  // ── Show first 3 seo-metadata.json entries ─────────────────────────────────
  const sampleSlugs = Object.keys(seoMeta.tools).slice(0, 3);
  const sample = Object.fromEntries(
    sampleSlugs.map((slug) => [slug, seoMeta.tools[slug]])
  );

  console.log("─────────────────────────────────────────────────────────────");
  console.log("seo-metadata.json — first 3 tool entries:");
  console.log("─────────────────────────────────────────────────────────────");
  for (const [slug, meta] of Object.entries(sample)) {
    console.log(`\n  [${slug}]`);
    console.log(`    title       (${meta.title.length}ch): ${meta.title}`);
    console.log(`    description (${meta.description.length}ch): ${meta.description}`);
    console.log(`    keywords    : ${meta.keywords.slice(0, 80)}…`);
    console.log(`    variants    : ${meta.variants?.length ?? 0} links`);
    console.log(`    related     : ${meta.related?.length ?? 0} links`);
  }

  // ── Show useToolSEO.ts ─────────────────────────────────────────────────────
  console.log("\n─────────────────────────────────────────────────────────────");
  console.log("client/src/hooks/useToolSEO.ts:");
  console.log("─────────────────────────────────────────────────────────────");
  console.log(USE_TOOL_SEO_TS);

  // ── Show seoMiddleware.ts ──────────────────────────────────────────────────
  console.log("─────────────────────────────────────────────────────────────");
  console.log("server/seoMiddleware.ts:");
  console.log("─────────────────────────────────────────────────────────────");
  console.log(SEO_MIDDLEWARE_TS);

  // ── Show server/index.ts snippet ───────────────────────────────────────────
  console.log("─────────────────────────────────────────────────────────────");
  console.log("Snippet to add to server/index.ts (NOT auto-applied):");
  console.log("─────────────────────────────────────────────────────────────");
  console.log(INDEX_TS_SNIPPET);

  // ── Meta stats ─────────────────────────────────────────────────────────────
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
  console.log("─────────────────────────────────────────────────────────────\n");

  if (IS_PREVIEW) {
    console.log("Preview complete. Files created:");
    console.log("  client/src/seo-metadata.json");
    console.log("  client/src/hooks/useToolSEO.ts");
    console.log("  server/seoMiddleware.ts");
    console.log("\nTo apply server/index.ts changes, copy the snippet above manually.");
    console.log("(Note: files use .ts extension to match the existing TypeScript codebase.)\n");
  }
}

main();
