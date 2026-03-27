import { type Request, type Response, type NextFunction } from "express";
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
    .replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
    // Replace meta description
    .replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${meta.description}"`
    )
    // Inject before </head>: OG tags + keywords + canonical
    .replace(
      /<\/head>/,
      `  <meta property="og:title" content="${meta.og.title}" />
  <meta property="og:description" content="${meta.og.description}" />
  <meta property="og:url" content="${meta.og.url}" />
  <meta property="og:image" content="${meta.og.image}" />
  <meta property="og:type" content="website" />
  <meta name="keywords" content="${meta.keywords}" />
  <link rel="canonical" href="${meta.canonical}" />
</head>`
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

  const slug = req.path.replace(/^\//, "") || null;
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
