/**
 * generate-main-tool-pages.js
 * Generates static HTML pages for all 99 main tools.
 *
 * Usage:
 *   node generate-main-tool-pages.js --preview   (generates 3 sample files + console output)
 *   node generate-main-tool-pages.js             (generates all 99 files + regenerates sitemap)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const IS_PREVIEW = process.argv.includes("--preview");
const BASE_URL   = "https://browseraitools.com";
const TODAY      = "2026-03-27";
const OUT_DIR    = path.join(__dirname, "client", "public", "tools");

// ─── Load data ─────────────────────────────────────────────────────────────────
const { tools }  = JSON.parse(fs.readFileSync(path.join(__dirname, "tools-config.json"), "utf8"));
const reactLinks = JSON.parse(fs.readFileSync(path.join(__dirname, "react-tool-links.json"), "utf8"));

// Build slug → name map for related tool lookups
const slugToName = Object.fromEntries(tools.map((t) => [t.slug, t.name]));
const slugToCategory = Object.fromEntries(tools.map((t) => [t.slug, t.category]));

// ─── Title builder (≤60 chars) ─────────────────────────────────────────────────
function buildTitle(name) {
  const a = `${name} — Free AI | No Signup`;
  if (a.length <= 60) return a;
  const b = `Free ${name} | No Signup`;
  if (b.length <= 60) return b;
  const c = `Free ${name} | BrowserAITools`;
  if (c.length <= 60) return c;
  return c.slice(0, 57) + "...";
}

// ─── Description builder (150-160 chars per category) ─────────────────────────
const DESC_TMPL = {
  "Writing Tools":       (n) => `Use the free ${n} — no signup, no data sent. AI runs 100% in your browser via WebLLM. Rewrite, generate, and improve content privately and instantly.`,
  "Social Media Tools":  (n) => `Free ${n}: craft scroll-stopping social content with on-device AI. No account, no data shared. Runs 100% in your browser via WebLLM. Private and unlimited.`,
  "Business Tools":      (n) => `Free ${n}: create professional business content with on-device AI. No data sent, no account needed. Runs 100% in your browser via WebLLM. Private and unlimited.`,
  "Marketing Tools":     (n) => `Free ${n}: write high-converting marketing copy with on-device AI. No signup, no data sent. Runs 100% in your browser via WebLLM. Private and instant.`,
  "SEO Tools":           (n) => `Free ${n}: improve your SEO with on-device AI. No data sent, no account needed. Runs 100% in your browser via WebLLM. Private, instant, and unlimited.`,
  "Job & Career Tools":  (n) => `Free ${n}: advance your career with private AI. No signup, no data shared. Runs 100% in your browser via WebLLM. Unlimited, secure, and instant.`,
  "Productivity Tools":  (n) => `Free ${n}: stay productive with on-device AI. No data sent, no account needed. Runs 100% in your browser via WebLLM. Private, instant, and unlimited.`,
  "Unique & Viral Tools":(n) => `Free ${n}: unique AI tool — no signup, no data sent to any server. Runs 100% in your browser via WebLLM. Private, unlimited, and completely free.`,
  "Developer Tools":     (n) => `Free ${n}: developer AI tool with zero data sent to servers. No account needed. Runs 100% in your browser via WebLLM. Private, fast, and unlimited.`,
  "AI Assistant":        (n) => `Free ${n}: AI assistant that runs 100% in your browser. No data sent to servers, no account needed. Powered by WebLLM. Private, unlimited, and instant.`,
};

function buildDescription(tool) {
  const fn = DESC_TMPL[tool.category] ??
    ((n) => `Free ${n}: AI-powered tool. No signup, no data sent. Runs 100% in your browser via WebLLM. Private, unlimited, and completely free.`);
  const d = fn(tool.name);
  return d.length <= 160 ? d : d.slice(0, 157).replace(/\s\S*$/, "") + "...";
}

// ─── Hero intro per category (3-4 sentences, unique voice) ────────────────────
const HERO_INTROS = {
  "Writing Tools":
    (n) => `The ${n} lets you create, rewrite, and refine content in seconds — no cloud API, no account, no waiting. The AI model runs directly on your device using WebLLM, which means your writing stays completely private from start to finish. Whether you're drafting from scratch or polishing existing copy, you get high-quality AI output right in your browser. Completely free, completely unlimited, forever.`,
  "Social Media Tools":
    (n) => `The ${n} helps you craft scroll-stopping content for any platform in seconds. Because the AI runs locally via WebLLM, none of your ideas, captions, or drafts ever leave your device. No algorithm sees your content before you post it. Open the tool, describe what you need, and get polished social copy instantly — completely free and unlimited.`,
  "Business Tools":
    (n) => `The ${n} gives you a private AI assistant for all your business content needs. Running locally via WebLLM, it processes everything on your device with zero data sent to any server. There are no subscriptions, no credits to manage, and no account to create. Just open the tool and start generating professional-grade business content immediately.`,
  "Marketing Tools":
    (n) => `The ${n} is your always-on marketing content partner — running 100% on your device via WebLLM, with no data ever leaving your browser. Write ad copy, email sequences, landing pages, and more without sharing your strategy with any third-party server. No subscription, no rate limits, no login — just fast, private, unlimited marketing AI.`,
  "SEO Tools":
    (n) => `The ${n} helps you create search-optimised content without exposing your strategy to any external server. The AI runs locally in your browser via WebLLM — your keywords, drafts, and competitor research stay completely private. No signup, no API key, no subscription. Just open the tool and start improving your search performance right now.`,
  "Job & Career Tools":
    (n) => `The ${n} gives you a private AI career coach — available any time, at no cost. Your resume, cover letter, and interview prep all stay on your device because the AI runs locally via WebLLM. Nothing you share with the tool is ever sent to any server. No account needed, no free-trial limits. Your career moves stay confidential, always.`,
  "Productivity Tools":
    (n) => `The ${n} brings AI-powered productivity to your browser without any of the usual trade-offs. No signup, no subscription, and no data shared with external servers — the AI model runs locally on your device via WebLLM. Whether you're planning projects, writing notes, or organising ideas, you get instant AI assistance that's entirely private and unlimited.`,
  "Unique & Viral Tools":
    (n) => `The ${n} is unlike anything else in your AI toolkit — and it's completely free. The AI runs locally in your browser via WebLLM, so your inputs, ideas, and outputs never touch an external server. No account required, no daily limit, no watermark. Open it, use it as many times as you want, and keep 100% of what you create.`,
  "Developer Tools":
    (n) => `The ${n} brings AI assistance to your development workflow — without any API keys, cloud subscriptions, or data leaving your machine. The model runs entirely in your browser via WebLLM and WebGPU, giving you private, low-latency AI output for code, documentation, and technical writing. No signup, no rate limits, no dependencies.`,
  "AI Assistant":
    (n) => `The ${n} on BrowserAITools is a fully private AI assistant — no servers, no accounts, no data collection. The model downloads to your browser once via WebLLM, then runs entirely on your device using WebGPU acceleration. Your conversations never leave your browser. Use it for research, writing, brainstorming, or any task that benefits from a smart AI partner.`,
};

function buildHeroIntro(tool) {
  const fn = HERO_INTROS[tool.category] ??
    ((n) => `The ${n} is a free AI tool that runs entirely in your browser via WebLLM. No signup, no data sent to any server, no subscription required. Just open the tool and start using it instantly — private, unlimited, and always free.`);
  return fn(tool.name);
}

// ─── Category emoji icon ───────────────────────────────────────────────────────
const CAT_ICON = {
  "Writing Tools":       "&#9997;",   // ✍
  "Social Media Tools":  "&#128242;", // 📱
  "Business Tools":      "&#128188;", // 💼
  "Marketing Tools":     "&#128201;", // 📉
  "SEO Tools":           "&#128269;", // 🔍
  "Job & Career Tools":  "&#127891;", // 🎓
  "Productivity Tools":  "&#9889;",   // ⚡
  "Unique & Viral Tools":"&#128640;", // 🚀
  "Developer Tools":     "&#128187;", // 💻
  "AI Assistant":        "&#129302;", // 🤖
};
function getCatIcon(category) {
  return CAT_ICON[category] ?? "&#9881;"; // ⚙
}

// ─── All 6 variant URLs for a slug ────────────────────────────────────────────
function getVariants(slug) {
  return [
    { url: `/tools/variants/${slug}-free-unlimited.html`,    label: "Free & Unlimited" },
    { url: `/tools/variants/${slug}-no-signup.html`,          label: "No Signup Required" },
    { url: `/tools/variants/${slug}-runs-in-browser.html`,    label: "Runs in Browser" },
    { url: `/tools/variants/best-${slug}-2025.html`,          label: "Best 2025" },
    { url: `/tools/variants/free-${slug}.html`,               label: "Free Version" },
    { url: `/tools/variants/private-${slug}-no-data.html`,    label: "100% Private" },
  ];
}

// ─── FAQs ──────────────────────────────────────────────────────────────────────
function buildFaqs(tool) {
  const n = tool.name;
  const nl = n.toLowerCase();
  return [
    {
      q: `Is the ${n} completely free?`,
      a: `Yes — completely free, no payment required. The AI runs locally in your browser via WebLLM, so there are no server costs for us to recover. That means we can offer unlimited free usage to everyone, forever.`,
    },
    {
      q: `Does the ${n} send my data to any server?`,
      a: `No. Everything you type is processed entirely on your own device. The AI model runs inside your browser using WebGPU. Your content never leaves your browser and is never sent to any external server or third party.`,
    },
    {
      q: `Do I need to create an account to use the ${n}?`,
      a: `No signup or login required. Just open the page and start using it immediately. There are no accounts, no email forms, and no personal information needed — ever.`,
    },
    {
      q: `Which browsers work best with the ${n}?`,
      a: `Chrome and Edge (version 113+) provide the best experience as they have full WebGPU support. Firefox and Safari have limited WebGPU support at this time. For optimal performance, use Chrome or Edge on a desktop or laptop.`,
    },
    {
      q: `Can I use the ${nl} offline?`,
      a: `Yes! After the AI model downloads to your browser on first use (a one-time step), the ${nl} works fully offline. No internet connection is needed for subsequent sessions.`,
    },
  ];
}

// ─── JSON-LD schema ───────────────────────────────────────────────────────────
function buildSchema(tool, faqs) {
  const pageUrl = `${BASE_URL}/tools/${tool.slug}.html`;
  const mainUrl = `${BASE_URL}/${tool.slug}`;
  const desc    = buildDescription(tool);

  const faqEntities = faqs.map((f) => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a },
  }));

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": `${tool.name} — BrowserAITools`,
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any (Browser-based)",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "description": desc,
        "url": pageUrl,
        "sameAs": mainUrl,
        "author": { "@type": "Organization", "name": "BrowserAITools", "url": BASE_URL },
        "featureList": [
          "100% free — no payment required",
          "No signup or account needed",
          "Runs entirely in your browser via WebLLM",
          "Zero data sent to any server",
          "Works offline after first load",
          "Unlimited usage with no rate limits",
        ],
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqEntities,
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home",      "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": tool.name,   "item": pageUrl },
        ],
      },
    ],
  }, null, 2);
}

// ─── HTML template ─────────────────────────────────────────────────────────────
function buildHtml(tool) {
  const title    = buildTitle(tool.name);
  const desc     = buildDescription(tool);
  const intro    = buildHeroIntro(tool);
  const faqs     = buildFaqs(tool);
  const schema   = buildSchema(tool, faqs);
  const variants = getVariants(tool.slug);
  const icon     = getCatIcon(tool.category);
  const pageUrl  = `${BASE_URL}/tools/${tool.slug}.html`;
  const mainUrl  = `${BASE_URL}/${tool.slug}`;

  // Related tools: up to 8 — combine relatedSlugs + extra from same category
  const related = (tool.relatedSlugs || []).slice(0, 8).map((s) => ({
    slug: s,
    name: slugToName[s] || s,
    category: slugToCategory[s] || "",
    icon: getCatIcon(slugToCategory[s] || ""),
    url:  `/tools/${s}.html`,
  }));

  // Variant links HTML
  const variantLinksHtml = variants.map((v) => `
        <a href="${BASE_URL}${v.url}" class="related-item">
          <div class="related-icon">${icon}</div>
          <div style="min-width:0;flex:1">
            <div class="related-name">${tool.name}</div>
            <div class="related-cat">${v.label}</div>
          </div>
          <span style="flex-shrink:0;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:2px 7px;border-radius:9999px;background:#f3e8ff;color:#6b21a8">Variant</span>
        </a>`).join("");

  // Related tools HTML
  const relatedToolsHtml = related.map((r) => `
        <a href="${BASE_URL}${r.url}" class="related-item">
          <div class="related-icon">${r.icon}</div>
          <div style="min-width:0;flex:1">
            <div class="related-name">${r.name}</div>
            <div class="related-cat">${r.category}</div>
          </div>
        </a>`).join("");

  // FAQ HTML
  const faqHtml = faqs.map((f, i) => `
    <div class="faq-item border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <button onclick="toggleFAQ(${i})" class="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
        <span class="text-sm font-semibold text-slate-800 dark:text-slate-100" itemprop="name">${f.q}</span>
        <svg id="faq-icon-${i}" class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div id="faq-answer-${i}" class="hidden px-5 pb-4 bg-slate-50 dark:bg-slate-800/50" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed" itemprop="text">${f.a}</p>
      </div>
    </div>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <link rel="canonical" href="${BASE_URL}/tools/${tool.slug}" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:site_name" content="BrowserAITools" />
  <meta property="og:image" content="${BASE_URL}/logo.png" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${desc}" />

  <meta name="robots" content="index, follow" />
  <link rel="icon" href="/favicon.png" />

  <!-- Tailwind CDN (no defer — must run before paint so .hidden class is styled) -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- JSON-LD Schema -->
  <script type="application/ld+json">
${schema}
  </script>

  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #0f172a; line-height: 1.6; -webkit-font-smoothing: antialiased; }
    @media (prefers-color-scheme: dark) { body { background: #020617; color: #f1f5f9; } }
    .dark body { background: #020617; color: #f1f5f9; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 1.25rem; }
    .gradient-text { background: linear-gradient(135deg, #7e22ce, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    /* Header */
    .site-header { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.92); backdrop-filter: blur(10px); border-bottom: 1px solid #e2e8f0; }
    .dark .site-header { background: rgba(15,23,42,0.92); border-color: #1e293b; }
    .header-inner { height: 56px; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
    .site-logo { font-size: 1.2rem; font-weight: 900; text-decoration: none; display: flex; align-items: center; gap: 6px; }
    .site-logo img { width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0; }
    .site-nav { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
    .nav-link { padding: 6px 12px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #475569; text-decoration: none; transition: all .15s; }
    .nav-link:hover { color: #7e22ce; background: #f5f3ff; }
    .dark .nav-link { color: #94a3b8; }
    .dark .nav-link:hover { color: #c084fc; background: rgba(126,34,206,.15); }
    .nav-cta { background: #9333ea; color: #fff !important; }
    .nav-cta:hover { background: #7e22ce !important; }

    /* Breadcrumb */
    .breadcrumb { padding: 10px 0; font-size: 12px; color: #94a3b8; display: flex; align-items: center; gap: 6px; }
    .breadcrumb a { color: #94a3b8; text-decoration: none; }
    .breadcrumb a:hover { color: #9333ea; }

    /* Hero */
    .hero { text-align: center; padding: 3rem 0 1.5rem; }
    .badges { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 1.25rem; }
    .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
    .badge-green  { background: #dcfce7; color: #166534; }
    .badge-purple { background: #f3e8ff; color: #6b21a8; }
    .badge-blue   { background: #dbeafe; color: #1e40af; }
    .badge-orange { background: #ffedd5; color: #9a3412; }
    .dark .badge-green  { background: rgba(22,101,52,.25);  color: #86efac; }
    .dark .badge-purple { background: rgba(107,33,168,.25); color: #d8b4fe; }
    .dark .badge-blue   { background: rgba(30,64,175,.25);  color: #93c5fd; }
    .dark .badge-orange { background: rgba(154,52,18,.25);  color: #fdba74; }

    h1 { font-size: clamp(1.75rem, 5vw, 3rem); font-weight: 900; line-height: 1.15; margin-bottom: 1rem; }
    .hero-intro { font-size: 1rem; color: #475569; max-width: 680px; margin: 0 auto 1.5rem; line-height: 1.75; }
    .dark .hero-intro { color: #94a3b8; }
    .cta-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
    .btn-primary   { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: #9333ea; color: #fff; font-weight: 700; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 14px rgba(147,51,234,.35); transition: all .2s; }
    .btn-primary:hover { background: #7e22ce; transform: translateY(-1px); }
    .btn-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border: 1px solid #cbd5e1; color: #334155; font-weight: 600; border-radius: 12px; text-decoration: none; transition: all .15s; }
    .btn-secondary:hover { background: #fff; border-color: #a855f7; }
    .dark .btn-secondary { border-color: #334155; color: #cbd5e1; }
    .dark .btn-secondary:hover { background: #1e293b; border-color: #a855f7; }

    /* Feature strip */
    .feature-strip { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 1.5rem 0; }
    @media (min-width: 640px) { .feature-strip { grid-template-columns: repeat(4, 1fr); } }
    .feature-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1rem; text-align: center; }
    .dark .feature-card { background: #1e293b; border-color: #334155; }
    .feature-icon  { font-size: 1.5rem; margin-bottom: 4px; }
    .feature-title { font-size: 12px; font-weight: 700; color: #1e293b; }
    .dark .feature-title { color: #e2e8f0; }
    .feature-sub   { font-size: 11px; color: #64748b; margin-top: 2px; }

    /* Section */
    .section { margin: 2.5rem 0; }
    .section-title { font-size: 1.25rem; font-weight: 900; color: #0f172a; margin-bottom: 1rem; }
    .dark .section-title { color: #f1f5f9; }

    /* Embed */
    .embed-header  { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
    .embed-link    { font-size: 13px; font-weight: 600; color: #9333ea; text-decoration: none; }
    .embed-link:hover { text-decoration: underline; }
    .embed-wrapper { border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 1px 4px rgba(0,0,0,.06); background: #fff; position: relative; }
    .dark .embed-wrapper { border-color: #334155; background: #0f172a; }
    .tool-iframe   { width: 100%; display: block; border: none; }
    .embed-fallback { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; font-size: 13px; color: #94a3b8; pointer-events: none; z-index: 0; }
    .tool-iframe:not([src=""]) ~ .embed-fallback { z-index: -1; }
    .embed-note    { font-size: 11px; color: #94a3b8; text-align: center; margin-top: 8px; }
    .embed-note a  { color: #a855f7; }

    /* FAQ — ensure .hidden works even before Tailwind CDN finishes */
    .hidden { display: none !important; }
    .faq-chevron-open { transform: rotate(180deg); }

    /* How it works */
    .how-card  { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.5rem 2rem; }
    .dark .how-card { background: rgba(30,41,59,.6); border-color: #334155; }
    .how-steps { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-top: 1rem; }
    @media (min-width: 640px) { .how-steps { grid-template-columns: repeat(3, 1fr); } }
    .step-num  { width: 40px; height: 40px; border-radius: 10px; background: #f3e8ff; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.1rem; color: #6b21a8; margin-bottom: 8px; }
    .dark .step-num { background: rgba(107,33,168,.3); color: #d8b4fe; }
    .step-title { font-weight: 700; font-size: 0.95rem; color: #1e293b; margin-bottom: 4px; }
    .dark .step-title { color: #e2e8f0; }
    .step-body  { font-size: 13px; color: #64748b; line-height: 1.6; }

    /* Links sections */
    .links-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
    @media (min-width: 480px) { .links-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 900px) { .links-grid { grid-template-columns: repeat(3, 1fr); } }

    /* Related / variant items */
    .related-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
    @media (min-width: 480px) { .related-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 900px) { .related-grid { grid-template-columns: repeat(3, 1fr); } }
    .related-item { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; text-decoration: none; transition: all .15s; }
    .related-item:hover { border-color: #c084fc; box-shadow: 0 2px 8px rgba(168,85,247,.12); }
    .dark .related-item { background: #1e293b; border-color: #334155; }
    .related-icon { width: 36px; height: 36px; border-radius: 8px; background: #f3e8ff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; color: #6b21a8; flex-shrink: 0; }
    .dark .related-icon { background: rgba(107,33,168,.3); color: #d8b4fe; }
    .related-name { font-size: 13px; font-weight: 700; color: #1e293b; }
    .dark .related-name { color: #e2e8f0; }
    .related-cat  { font-size: 11px; color: #64748b; }

    /* FAQ */
    .faq-list { display: flex; flex-direction: column; gap: 8px; }
    .faq-item { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
    .dark .faq-item { border-color: #334155; }

    /* Footer */
    .site-footer { border-top: 1px solid #e2e8f0; background: #fff; margin-top: 3rem; }
    .dark .site-footer { background: #0f172a; border-color: #1e293b; }
    .footer-inner { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 2rem 0; font-size: 13px; color: #64748b; }
    @media (min-width: 640px) { .footer-inner { flex-direction: row; justify-content: space-between; } }
    .footer-brand { font-weight: 900; color: #0f172a; }
    .dark .footer-brand { color: #f1f5f9; }
    .footer-nav { display: flex; gap: 16px; }
    .footer-nav a { color: #64748b; text-decoration: none; }
    .footer-nav a:hover { color: #9333ea; }
  </style>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5894879730362339" crossorigin="anonymous"></script>
</head>
<body>

  <!-- Header -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="${BASE_URL}" class="site-logo"><img src="/logo.png" alt="BrowserAI Tools logo"><span class="gradient-text">BrowserAITools</span></a>
      <nav class="site-nav">
        <a href="${BASE_URL}" class="nav-link">Home</a>
        <a href="${BASE_URL}/#tools" class="nav-link">All Tools</a>
        <a href="${mainUrl}" class="nav-link nav-cta">${tool.name}</a>
      </nav>
    </div>
  </header>

  <!-- Breadcrumb -->
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="${BASE_URL}">Home</a>
      <span>/</span>
      <span>${tool.name}</span>
    </nav>
  </div>

  <main class="container">

    <!-- Hero -->
    <section class="hero">
      <div class="badges">
        <span class="badge badge-green">&#10003; 100% Free</span>
        <span class="badge badge-purple">&#10003; No Signup</span>
        <span class="badge badge-blue">&#10003; 100% Private</span>
        <span class="badge badge-orange">&#10003; Runs in Browser</span>
      </div>
      <h1><span class="gradient-text">${tool.name}</span></h1>
      <p class="hero-intro">${intro}</p>
      <div class="cta-row">
        <a href="#tool-embed" class="btn-primary">Use ${tool.name} Free &rarr;</a>
        <a href="${mainUrl}" class="btn-secondary">Open Full Page</a>
      </div>
    </section>

    <!-- Feature strip -->
    <div class="feature-strip">
      <div class="feature-card">
        <div class="feature-icon">&#128274;</div>
        <div class="feature-title">Zero Data Sent</div>
        <div class="feature-sub">Nothing leaves your browser</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">&#9889;</div>
        <div class="feature-title">Instant Results</div>
        <div class="feature-sub">On-device AI, no latency</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">&#8734;</div>
        <div class="feature-title">Unlimited Use</div>
        <div class="feature-sub">No quotas, no rate limits</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">&#127379;</div>
        <div class="feature-title">Always Free</div>
        <div class="feature-sub">No payment, no credits</div>
      </div>
    </div>

    <!-- Tool Embed -->
    <section id="tool-embed" class="section">
      <div class="embed-header">
        <h2 class="section-title" style="margin-bottom:0">${tool.name}</h2>
        <a href="${mainUrl}" class="embed-link">Open full page &rarr;</a>
      </div>
      <div class="embed-wrapper">
        <iframe
          id="tool-frame"
          src="/${tool.slug}"
          title="${tool.name} — Free Online AI Tool"
          width="100%"
          height="620"
          frameborder="0"
          loading="eager"
          allow="clipboard-write"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          style="border-radius:12px;border:1px solid #e5e5e5;display:block;"
        ></iframe>
        <div class="embed-fallback" aria-hidden="true">
          <svg width="32" height="32" fill="none" stroke="#c084fc" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          <span>Loading interactive tool&hellip;</span>
          <a href="/${tool.slug}" style="pointer-events:auto;color:#a855f7;font-weight:600;font-size:12px;">If it stays blank, open in new tab &rarr;</a>
        </div>
      </div>
      <p class="embed-note">
        Runs 100% in your browser — no data sent to any server.
        <a href="/${tool.slug}">Open in full page</a> for the best experience.
      </p>
    </section>

    <!-- How It Works -->
    <section class="section">
      <div class="how-card">
        <h2 class="section-title">How the ${tool.name} Works</h2>
        <div class="how-steps">
          <div>
            <div class="step-num">1</div>
            <div class="step-title">Model Downloads Once</div>
            <p class="step-body">On first use, a compact AI model downloads to your browser via WebLLM. This is a one-time step and the model is cached for all future sessions.</p>
          </div>
          <div>
            <div class="step-num">2</div>
            <div class="step-title">AI Runs Locally</div>
            <p class="step-body">Your input is processed entirely on your own device using WebGPU hardware acceleration. Nothing is sent to any external server at any point.</p>
          </div>
          <div>
            <div class="step-num">3</div>
            <div class="step-title">Instant Results</div>
            <p class="step-body">Get high-quality AI output in seconds. Copy, download, or share your results — completely private, completely free, and without any usage limits.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- All Variants of This Tool -->
    <section class="section">
      <h2 class="section-title">Explore ${tool.name} Versions</h2>
      <div class="related-grid">
        ${variantLinksHtml}
      </div>
    </section>

    <!-- Related Tools -->
    <section class="section">
      <h2 class="section-title">Related Free AI Tools</h2>
      <div class="related-grid">
        ${relatedToolsHtml}
      </div>
    </section>

    <!-- FAQ -->
    <section class="section" itemscope itemtype="https://schema.org/FAQPage">
      <h2 class="section-title">Frequently Asked Questions</h2>
      <div class="faq-list">
        ${faqHtml}
      </div>
    </section>

  </main>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container footer-inner">
      <div>
        <img src="/logo.png" alt="" style="width:20px;height:20px;border-radius:5px;vertical-align:middle;margin-right:5px;"><span class="footer-brand">BrowserAITools</span>
        &nbsp;&mdash; 100% Free. 100% Private. 100% In-Browser.
      </div>
      <nav class="footer-nav">
        <a href="${BASE_URL}">Home</a>
        <a href="${BASE_URL}/#tools">All Tools</a>
        <a href="${mainUrl}">${tool.name}</a>
      </nav>
    </div>
  </footer>

  <script>
    // Dark mode — reads localStorage.theme, falls back to system preference
    (function() {
      var saved = localStorage.getItem('theme');
      if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    })();

    // FAQ accordion — toggle answer visibility and chevron rotation
    function toggleFAQ(i) {
      var ans  = document.getElementById('faq-answer-' + i);
      var icon = document.getElementById('faq-icon-' + i);
      if (!ans) return;
      var isOpen = !ans.classList.contains('hidden');
      if (isOpen) {
        ans.classList.add('hidden');
        icon.style.transform = '';
      } else {
        ans.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
      }
    }

    // Hide the fallback overlay once the iframe loads
    var frame    = document.getElementById('tool-frame');
    var fallback = document.querySelector('.embed-fallback');
    if (frame && fallback) {
      frame.addEventListener('load', function() {
        fallback.style.display = 'none';
      });
    }
  </script>
</body>
</html>`;
}

// ─── Main ──────────────────────────────────────────────────────────────────────
function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const toolsToProcess = IS_PREVIEW ? tools.slice(0, 3) : tools;
  const generated = [];

  for (const tool of toolsToProcess) {
    const html     = buildHtml(tool);
    const outFile  = path.join(OUT_DIR, `${tool.slug}.html`);
    fs.writeFileSync(outFile, html, "utf8");
    generated.push({ slug: tool.slug, name: tool.name, size: html.length, file: outFile });
  }

  // ── Console summary ──────────────────────────────────────────────────────────
  console.log(`\n${IS_PREVIEW ? "[PREVIEW MODE — 3 files]" : "[FULL RUN — all 99 files]"} generate-main-tool-pages.js\n`);

  for (const g of generated) {
    console.log(`  ✓  client/public/tools/${g.slug}.html  (${(g.size / 1024).toFixed(1)} KB)`);
  }

  // ── Title / desc validation ──────────────────────────────────────────────────
  if (!IS_PREVIEW) {
    const titles = tools.map((t) => buildTitle(t.name));
    const descs  = tools.map((t) => buildDescription(t));
    console.log(`\nValidation:`);
    console.log(`  Title length  : ${Math.min(...titles.map(t=>t.length))}–${Math.max(...titles.map(t=>t.length))} chars (limit: 60)`);
    console.log(`  Desc length   : ${Math.min(...descs.map(d=>d.length))}–${Math.max(...descs.map(d=>d.length))} chars (limit: 160)`);
    console.log(`  Titles >60ch  : ${titles.filter(t=>t.length > 60).length}`);
    console.log(`  Descs >160ch  : ${descs.filter(d=>d.length > 160).length}`);
  }

  // ── Show first 3 file previews ───────────────────────────────────────────────
  for (const g of generated) {
    console.log(`\n${"─".repeat(65)}`);
    console.log(`PREVIEW: ${g.file}`);
    console.log("─".repeat(65));
    const lines = fs.readFileSync(g.file, "utf8").split("\n").slice(0, 18);
    console.log(lines.join("\n"));
    console.log("  ...");
  }

  if (!IS_PREVIEW) {
    // ── Regenerate sitemap ─────────────────────────────────────────────────────
    console.log("\n─────────────────────────────────────────────────────────────────");
    console.log("Regenerating sitemap.xml...");
    regenerateSitemap();
    console.log(`\n✅ Generated ${tools.length} main tool pages in client/public/tools/`);
  } else {
    console.log(`\n─────────────────────────────────────────────────────────────────`);
    console.log(`Preview complete. Run without --preview to generate all 99 files.`);
    console.log(`Also run node generate-unified-sitemap.js after full generation.\n`);
  }
}

// ─── Regenerate sitemap inline ─────────────────────────────────────────────────
function regenerateSitemap() {
  const PUBLIC_DIR      = path.join(__dirname, "client", "public");
  const VARIANTS_FILE   = path.join(PUBLIC_DIR, "sitemap-variants.xml");
  const OUT_SITEMAP     = path.join(PUBLIC_DIR, "sitemap.xml");
  const OUT_ROBOTS      = path.join(PUBLIC_DIR, "robots.txt");

  function urlEntry({ loc, lastmod, changefreq, priority }) {
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  }

  const entries = [];

  // Homepage
  entries.push(urlEntry({ loc: `${BASE_URL}/`, lastmod: TODAY, changefreq: "daily", priority: "1.0" }));

  // Static main tool pages (new — /tools/[slug].html)
  for (const tool of tools) {
    entries.push(urlEntry({
      loc:        `${BASE_URL}/tools/${tool.slug}.html`,
      lastmod:    TODAY,
      changefreq: "weekly",
      priority:   "0.8",
    }));
  }

  // All 594 variant pages
  const variantsXml = fs.readFileSync(VARIANTS_FILE, "utf8");
  const variantUrls = [...variantsXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const loc of variantUrls) {
    entries.push(urlEntry({ loc, lastmod: TODAY, changefreq: "monthly", priority: "0.7" }));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>`;
  fs.writeFileSync(OUT_SITEMAP, xml, "utf8");

  const robots = `User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml\n\n# AI Tools Directory - 100% Free & Private Browser Tools\n`;
  fs.writeFileSync(OUT_ROBOTS, robots, "utf8");

  console.log(`  Sitemap: ${entries.length} URLs (1 home + ${tools.length} tool pages + ${variantUrls.length} variants)`);
  console.log(`  Written: client/public/sitemap.xml`);
  console.log(`  Written: client/public/robots.txt`);
}

main();
