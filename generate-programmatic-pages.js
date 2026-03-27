#!/usr/bin/env node
/**
 * Programmatic SEO Page Generator for browseraitools.com
 * Generates keyword-variant landing pages for every tool.
 *
 * Usage: node generate-programmatic-pages.js
 * Output: client/public/tools/variants/*.html + client/public/sitemap-variants.xml
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Config ───────────────────────────────────────────────────────────────────
const CONFIG_FILE = path.join(__dirname, "tools-config.json");
const OUTPUT_DIR = path.join(__dirname, "client", "public", "tools", "variants");
const SITEMAP_OUT = path.join(__dirname, "client", "public", "sitemap-variants.xml");
const BASE_URL = "https://browseraitools.com";
const TODAY = new Date().toISOString().split("T")[0];

// ─── Load config ──────────────────────────────────────────────────────────────
const { tools } = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toKebab(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ─── Variant keyword generation ───────────────────────────────────────────────
const VARIANT_TYPES = [
  { type: "free",      label: "Free"      },
  { type: "best",      label: "Best 2025" },
  { type: "nosignup",  label: "No Signup" },
  { type: "private",   label: "Private"   },
  { type: "browser",   label: "Browser"   },
  { type: "unlimited", label: "Unlimited" },
];

function buildVariants(tool) {
  const n = tool.name;
  return VARIANT_TYPES.map((v) => {
    const keyword = {
      free:      `Free ${n}`,
      best:      `Best ${n} 2025`,
      nosignup:  `${n} No Signup`,
      private:   `Private ${n} No Data`,
      browser:   `${n} Runs in Browser`,
      unlimited: `${n} Free Unlimited`,
    }[v.type];
    const filename = toKebab(keyword) + ".html";
    return { ...v, keyword, filename };
  });
}

// ─── Title generation (≤60 chars, keyword-first) ─────────────────────────────
// Titles kept short enough to accommodate the longest tool names
function buildTitle(type, tool) {
  const n = tool.name;
  const titles = {
    free:      `Free ${n} | No Signup`,
    best:      `Best ${n} 2025 — Private`,
    nosignup:  `${n} — No Account Needed`,
    private:   `${n} — Zero Data Sent`,
    browser:   `${n} — Runs in Browser`,
    unlimited: `${n} — Unlimited & Free`,
  };
  const raw = titles[type] || `${n} | BrowserAITools`;
  // Hard truncate at 60 chars, preserving word boundaries
  if (raw.length <= 60) return raw;
  return raw.slice(0, 57).replace(/\s\S*$/, "") + "...";
}

// ─── Meta description generation (≤160 chars, complete sentences) ─────────────
function buildMeta(type, tool) {
  const n = tool.name;
  // Each template ≤ 160 chars when tool name ≤ 35 chars (longest name is 33 chars)
  const metas = {
    free:
      `Use the free ${n} — no signup, no cost, no data shared. Runs 100% in your browser via WebLLM. Private, unlimited, and instant.`,
    best:
      `The best ${n} in 2025. Runs in your browser via WebLLM — zero data leaves your device. Free, private, and unlimited. No account needed.`,
    nosignup:
      `Try the ${n} with no signup or login required. 100% free and private. Your data never leaves your browser — powered by on-device AI.`,
    private:
      `The most private ${n} online. No data sent to any server — AI runs locally in your browser via WebLLM. Free, secure, and instant.`,
    browser:
      `${n} that runs 100% in your browser via WebLLM. No servers, no cloud, no tracking. Instant, private, and completely free. Try it now.`,
    unlimited:
      `Unlimited free ${n} — no daily limits, no subscriptions, no data shared. Runs on-device via WebLLM. The most private AI tool online.`,
  };
  const meta = metas[type] || `Free private ${n} on BrowserAITools. Runs 100% in your browser — zero data leaves your device. Free and unlimited.`;
  // Safety clamp — should never be needed but guarantees compliance
  if (meta.length <= 160) return meta;
  return meta.slice(0, 157).replace(/\s\S*$/, "") + "...";
}

// ─── H1 generation ────────────────────────────────────────────────────────────
function buildH1(type, tool) {
  const n = tool.name;
  return {
    free:      `Free ${n}`,
    best:      `Best ${n} — 2025`,
    nosignup:  `${n}: No Signup, No Login`,
    private:   `${n}: Private & Secure`,
    browser:   `${n}: 100% Browser-Based`,
    unlimited: `${n}: Free & Unlimited`,
  }[type] || n;
}

// ─── Intro paragraph (~180 words each, unique per variant type) ───────────────
function buildIntro(type, tool) {
  const n = tool.name;
  const nl = n.toLowerCase();
  const intros = {
    free: `Looking for a completely free ${nl}? You've found it. BrowserAITools offers the ${n} at zero cost — no hidden fees, no premium tiers, no credit cards ever. Powered by WebLLM, the AI model runs directly inside your web browser using your device's own hardware. Every result is generated locally — 100% on your device. Your text, your ideas, and your data never leave your browser. There are no servers processing your information, no logs being kept, and no accounts to create. Simply open the tool, enter your content, and get high-quality AI-generated results in seconds. Whether you need it once or use it every day, the ${n} is always free and always private. It works on any modern browser with WebGPU support — Chrome and Edge work best. No extensions needed, no app to download. Just open the page and start generating instantly.`,

    best: `If you're searching for the best ${nl} in 2025, look no further. BrowserAITools has built a ${n} that combines cutting-edge on-device AI with complete privacy — something no other tool can match. While most AI tools send your data to cloud servers, ours runs entirely inside your browser using WebLLM and WebGPU technology. Your prompts, content, and results are never uploaded anywhere. The quality rivals leading paid services, yet it's completely free with no rate limits or subscriptions. In 2025, privacy-first AI tools are increasingly essential — especially for professionals handling sensitive content. The ${n} at BrowserAITools gives you state-of-the-art AI results without sacrificing your privacy. Try it today: no account required, no data collected, just fast and powerful AI that works entirely for you, on your own device.`,

    nosignup: `Want to use a ${nl} without creating an account or signing up? BrowserAITools makes it possible. Our ${n} is fully functional without any registration, login, or personal information. Just open the page and start using it immediately. There are no email forms to fill out, no passwords to create, and no terms to scroll through. This is possible because the AI runs entirely inside your browser using WebLLM — there's no backend account system because there's no backend processing your data at all. Your content stays on your device. The model runs locally using your browser's WebGPU API. Everything is processed in real-time on your own hardware. For anyone tired of creating yet another online account or concerned about data privacy, the ${n} is the perfect solution. Get instant AI results completely anonymously, with zero signup required.`,

    private: `Privacy is at the core of the ${n} on BrowserAITools. Unlike conventional AI tools that send your content to remote servers, ours processes everything locally inside your browser using WebLLM and WebGPU. When you type text into this tool, it never leaves your device. The AI model runs on your own CPU and GPU — not on any cloud infrastructure we control. This means zero data collection, zero logs, and zero risk of your content being stored, sold, or used to train AI models. For professionals in law, healthcare, finance, and other sensitive fields, this level of privacy is essential. Paste confidential documents, client information, or personal data without worry. No VPN needed, no special setup required. The ${n} is completely free, works offline after the model loads, and delivers high-quality results on par with paid services — without ever exposing your data.`,

    browser: `The ${n} on BrowserAITools is designed to run 100% inside your web browser — no server-side processing, no cloud APIs, no external requests for your content. This is made possible by WebLLM, a technology that brings powerful language models directly to your browser using WebGPU hardware acceleration. When you open this tool, the AI model downloads once to your device. After that, all generation happens locally — even offline. Results are fast, private, and completely free. No software, browser extensions, or apps needed. As long as you're using a WebGPU-capable browser like Chrome or Edge, the ${n} works perfectly out of the box. Your data is never shared with third parties — every character you type stays on your device. Browser-native AI: powerful, instant, and private by design.`,

    unlimited: `The ${n} on BrowserAITools is free to use with absolutely no limits. No daily quotas, no rate limits, no "you've used your free credits" messages. Because the AI runs locally in your browser via WebLLM, there are no server costs for us to recover — which means we can offer unlimited free usage to everyone. Run the tool once, or run it a thousand times — it makes no difference. Your usage is never tracked, throttled, or capped. For power users, content teams, researchers, and anyone who relies on AI daily, this is a game-changer. Most AI tools impose strict limits unless you pay. With BrowserAITools, there's nothing to subscribe to. The ${n} is yours to use freely, privately, and without restriction. Open the tool below, enter your content, and get high-quality AI results instantly — as many times as you need, forever.`,
  };
  return intros[type] || `Use the free, private ${n} on BrowserAITools. Powered by WebLLM, everything runs 100% in your browser — no data leaves your device, no account needed, and no limits.`;
}

// ─── FAQ generation ───────────────────────────────────────────────────────────
function buildFAQs(tool) {
  const n = tool.name;
  const nl = n.toLowerCase();
  return [
    {
      q: `Is the ${n} completely free?`,
      a: `Yes, completely free. There are no plans, subscriptions, or hidden costs. The AI runs locally in your browser via WebLLM, so there are no server costs for us — and no charges for you, ever.`,
    },
    {
      q: `Does the ${n} send my data to any server?`,
      a: `No. Every word you type is processed entirely on your own device. The AI model runs inside your browser using WebGPU. Your content never leaves your browser and is never sent to any external server.`,
    },
    {
      q: `Do I need to create an account to use the ${n}?`,
      a: `No signup or login required. Just open the page and start using it immediately. There are no accounts, no email forms, and no personal information needed whatsoever.`,
    },
    {
      q: `Which browsers support the ${n}?`,
      a: `The tool works best in Chrome and Edge (version 113+) which support WebGPU. Firefox and Safari have limited WebGPU support currently. For the best experience, use Chrome or Edge on desktop.`,
    },
    {
      q: `Can I use the ${nl} offline?`,
      a: `Yes! After the AI model downloads to your browser the first time (a one-time step), the ${nl} works fully offline. No internet connection is needed for subsequent uses.`,
    },
  ];
}

// ─── Related tools HTML ────────────────────────────────────────────────────────
function buildRelatedToolsHTML(tool) {
  const related = tool.relatedSlugs
    .map((slug) => tools.find((t) => t.slug === slug))
    .filter(Boolean)
    .slice(0, 6);

  return related
    .map(
      (t) => `
      <a href="${BASE_URL}/${t.slug}"
         class="group flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-purple-400 hover:shadow-md transition-all">
        <span class="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-700 dark:text-purple-300 font-black text-sm shrink-0">AI</span>
        <div class="min-w-0">
          <p class="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors truncate">${t.name}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 truncate">${t.category}</p>
        </div>
      </a>`
    )
    .join("");
}

// ─── JSON-LD schema ────────────────────────────────────────────────────────────
function buildSchema({ type, tool, canonicalUrl, variantUrl, faqs }) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: `${tool.name} — BrowserAITools`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any (Browser-based)",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description: buildMeta(type, tool),
        url: variantUrl,
        sameAs: canonicalUrl,
        author: { "@type": "Organization", name: "BrowserAITools", url: BASE_URL },
        featureList: [
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
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: tool.name, item: canonicalUrl },
          { "@type": "ListItem", position: 3, name: buildH1(type, tool), item: variantUrl },
        ],
      },
    ],
  };
  return JSON.stringify(schema, null, 2);
}

// ─── Full HTML template ────────────────────────────────────────────────────────
function buildHTML({ variant, tool }) {
  const { type, keyword, filename } = variant;
  const canonicalUrl = `${BASE_URL}/${tool.slug}`;
  const variantUrl = `${BASE_URL}/tools/variants/${filename}`;
  const title = buildTitle(type, tool);
  const metaDesc = buildMeta(type, tool);
  const h1 = buildH1(type, tool);
  const intro = buildIntro(type, tool);
  const faqs = buildFAQs(tool);
  const relatedHTML = buildRelatedToolsHTML(tool);
  const schema = buildSchema({ type, tool, canonicalUrl, variantUrl, faqs });

  const faqsHTML = faqs
    .map(
      (f, i) => `
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
    </div>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${metaDesc}" />
  <link rel="canonical" href="${canonicalUrl}" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${variantUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${metaDesc}" />
  <meta property="og:site_name" content="BrowserAITools" />
  <meta property="og:image" content="${BASE_URL}/favicon.png" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${metaDesc}" />

  <meta name="robots" content="index, follow" />

  <!-- Tailwind CDN -->
  <script src="https://cdn.tailwindcss.com" defer></script>
  <script>
    // Tailwind config (runs sync before paint)
    window.tailwind = window.tailwind || {};
    document.addEventListener('DOMContentLoaded', function() {
      if (typeof tailwind !== 'undefined' && tailwind.config) {
        tailwind.config = { darkMode: 'class', theme: { extend: { colors: { purple: { 50:'#faf5ff',100:'#f3e8ff',200:'#e9d5ff',300:'#d8b4fe',400:'#c084fc',500:'#a855f7',600:'#9333ea',700:'#7e22ce',800:'#6b21a8',900:'#581c87' } } } } };
      }
    });
  </script>

  <!-- JSON-LD Schema -->
  <script type="application/ld+json">
${schema}
  </script>

  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #0f172a; line-height: 1.6; -webkit-font-smoothing: antialiased; }
    @media (prefers-color-scheme: dark) { body { background: #020617; color: #f1f5f9; } }
    .dark body { background: #020617; color: #f1f5f9; }

    /* Layout */
    .container { max-width: 1100px; margin: 0 auto; padding: 0 1.25rem; }

    /* Gradient text */
    .gradient-text { background: linear-gradient(135deg, #7e22ce, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    /* Header */
    .site-header { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.92); backdrop-filter: blur(10px); border-bottom: 1px solid #e2e8f0; }
    .dark .site-header { background: rgba(15,23,42,0.92); border-color: #1e293b; }
    .header-inner { height: 56px; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
    .site-logo { font-size: 1.2rem; font-weight: 900; text-decoration: none; }
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
    .badge-green { background: #dcfce7; color: #166534; }
    .badge-purple { background: #f3e8ff; color: #6b21a8; }
    .badge-blue { background: #dbeafe; color: #1e40af; }
    .badge-orange { background: #ffedd5; color: #9a3412; }
    .dark .badge-green { background: rgba(22,101,52,.25); color: #86efac; }
    .dark .badge-purple { background: rgba(107,33,168,.25); color: #d8b4fe; }
    .dark .badge-blue { background: rgba(30,64,175,.25); color: #93c5fd; }
    .dark .badge-orange { background: rgba(154,52,18,.25); color: #fdba74; }

    h1 { font-size: clamp(1.75rem, 5vw, 3rem); font-weight: 900; line-height: 1.15; margin-bottom: 1rem; }
    .hero-intro { font-size: 1rem; color: #475569; max-width: 680px; margin: 0 auto 1.5rem; line-height: 1.75; }
    .dark .hero-intro { color: #94a3b8; }
    .cta-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
    .btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: #9333ea; color: #fff; font-weight: 700; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 14px rgba(147,51,234,.35); transition: all .2s; }
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
    .feature-icon { font-size: 1.5rem; margin-bottom: 4px; }
    .feature-title { font-size: 12px; font-weight: 700; color: #1e293b; }
    .dark .feature-title { color: #e2e8f0; }
    .feature-sub { font-size: 11px; color: #64748b; margin-top: 2px; }

    /* Section headings */
    .section { margin: 2.5rem 0; }
    .section-title { font-size: 1.25rem; font-weight: 900; color: #0f172a; margin-bottom: 1rem; }
    .dark .section-title { color: #f1f5f9; }

    /* Tool embed */
    .embed-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
    .embed-link { font-size: 13px; font-weight: 600; color: #9333ea; text-decoration: none; }
    .embed-link:hover { text-decoration: underline; }
    .embed-wrapper { border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 1px 4px rgba(0,0,0,.06); background: #fff; }
    .dark .embed-wrapper { border-color: #334155; background: #0f172a; }
    .tool-iframe { width: 100%; border: none; min-height: 900px; display: block; }
    .embed-note { font-size: 11px; color: #94a3b8; text-align: center; margin-top: 8px; }
    .embed-note a { color: #a855f7; }

    /* How it works */
    .how-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.5rem 2rem; }
    .dark .how-card { background: rgba(30,41,59,.6); border-color: #334155; }
    .how-steps { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-top: 1rem; }
    @media (min-width: 640px) { .how-steps { grid-template-columns: repeat(3, 1fr); } }
    .step-num { width: 40px; height: 40px; border-radius: 10px; background: #f3e8ff; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.1rem; color: #6b21a8; margin-bottom: 8px; }
    .dark .step-num { background: rgba(107,33,168,.3); color: #d8b4fe; }
    .step-title { font-weight: 700; font-size: 0.95rem; color: #1e293b; margin-bottom: 4px; }
    .dark .step-title { color: #e2e8f0; }
    .step-body { font-size: 13px; color: #64748b; line-height: 1.6; }

    /* Related tools */
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
    .related-cat { font-size: 11px; color: #64748b; }
    .see-all { text-align: center; margin-top: 12px; }
    .see-all a { display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 13px; font-weight: 600; color: #334155; text-decoration: none; transition: all .15s; }
    .see-all a:hover { background: #fff; border-color: #a855f7; }
    .dark .see-all a { border-color: #334155; color: #cbd5e1; }

    /* FAQ */
    .faq-list { display: flex; flex-direction: column; gap: 8px; }
    .faq-item { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
    .dark .faq-item { border-color: #334155; }
    .faq-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 20px; text-align: left; background: #fff; border: none; cursor: pointer; transition: background .15s; }
    .faq-btn:hover { background: #f8fafc; }
    .dark .faq-btn { background: #1e293b; }
    .dark .faq-btn:hover { background: #0f172a; }
    .faq-q { font-size: 14px; font-weight: 600; color: #1e293b; }
    .dark .faq-q { color: #e2e8f0; }
    .faq-chevron { width: 16px; height: 16px; color: #94a3b8; flex-shrink: 0; transition: transform .2s; }
    .faq-answer { display: none; padding: 0 20px 16px; background: #f8fafc; }
    .dark .faq-answer { background: rgba(30,41,59,.5); }
    .faq-answer p { font-size: 13px; color: #475569; line-height: 1.7; }
    .dark .faq-answer p { color: #94a3b8; }

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
</head>
<body>

  <!-- Header -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="${BASE_URL}" class="site-logo gradient-text">BrowserAITools</a>
      <nav class="site-nav">
        <a href="${BASE_URL}" class="nav-link">Home</a>
        <a href="${BASE_URL}/#tools" class="nav-link">All Tools</a>
        <a href="${canonicalUrl}" class="nav-link nav-cta">${tool.name}</a>
      </nav>
    </div>
  </header>

  <!-- Breadcrumb -->
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="${BASE_URL}">Home</a>
      <span>/</span>
      <a href="${canonicalUrl}">${tool.name}</a>
      <span>/</span>
      <span>${keyword}</span>
    </nav>
  </div>

  <main class="container">

    <!-- Hero -->
    <section class="hero">
      <div class="badges">
        <span class="badge badge-green">✓ 100% Free</span>
        <span class="badge badge-purple">✓ No Signup</span>
        <span class="badge badge-blue">✓ 100% Private</span>
        <span class="badge badge-orange">✓ Runs in Browser</span>
      </div>
      <h1><span class="gradient-text">${h1}</span></h1>
      <p class="hero-intro">${intro}</p>
      <div class="cta-row">
        <a href="#tool-embed" class="btn-primary">Try it Free &rarr;</a>
        <a href="${canonicalUrl}" class="btn-secondary">Main Tool Page</a>
      </div>
    </section>

    <!-- Feature strip -->
    <div class="feature-strip">
      <div class="feature-card">
        <div class="feature-icon">🔒</div>
        <div class="feature-title">Zero Data Sent</div>
        <div class="feature-sub">Nothing leaves your browser</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">⚡</div>
        <div class="feature-title">Instant Results</div>
        <div class="feature-sub">On-device AI, no latency</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">∞</div>
        <div class="feature-title">Unlimited Use</div>
        <div class="feature-sub">No quotas, no rate limits</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🆓</div>
        <div class="feature-title">Always Free</div>
        <div class="feature-sub">No payment, no credits</div>
      </div>
    </div>

    <!-- Tool Embed -->
    <section id="tool-embed" class="section">
      <div class="embed-header">
        <h2 class="section-title" style="margin-bottom:0">${tool.name}</h2>
        <a href="${canonicalUrl}" class="embed-link">Open full page &rarr;</a>
      </div>
      <div class="embed-wrapper">
        <iframe
          src="${canonicalUrl}"
          title="${tool.name} — Free Online AI Tool"
          class="tool-iframe"
          loading="lazy"
          allow="clipboard-write"
          id="tool-frame"
        ></iframe>
      </div>
      <p class="embed-note">
        The tool above runs 100% in your browser. No data is sent to any server.
        <a href="${canonicalUrl}">Open in full page</a> for the best experience.
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
            <p class="step-body">On first use, a compact AI model downloads to your browser via WebLLM. This only happens once and is cached for future sessions.</p>
          </div>
          <div>
            <div class="step-num">2</div>
            <div class="step-title">AI Runs Locally</div>
            <p class="step-body">Your input is processed entirely on your device using WebGPU hardware acceleration. Nothing is sent to any external server.</p>
          </div>
          <div>
            <div class="step-num">3</div>
            <div class="step-title">Instant Results</div>
            <p class="step-body">Get high-quality AI output in seconds. Copy, download, or share your results — completely private, completely free.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Tools -->
    <section class="section">
      <h2 class="section-title">Related Free AI Tools</h2>
      <div class="related-grid">
        ${relatedHTML}
      </div>
      <div class="see-all">
        <a href="${BASE_URL}/#tools">See all ${tools.length}+ free AI tools &rarr;</a>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section" itemscope itemtype="https://schema.org/FAQPage">
      <h2 class="section-title">Frequently Asked Questions</h2>
      <div class="faq-list">
${faqsHTML}
      </div>
    </section>

  </main>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container footer-inner">
      <div>
        <span class="footer-brand">BrowserAITools</span>
        &nbsp;— 100% Free. 100% Private. 100% In-Browser.
      </div>
      <nav class="footer-nav">
        <a href="${BASE_URL}">Home</a>
        <a href="${BASE_URL}/#tools">All Tools</a>
        <a href="${canonicalUrl}">${tool.name}</a>
      </nav>
    </div>
  </footer>

  <script>
    // Dark mode (match saved preference or system)
    (function() {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    })();

    // FAQ accordion
    function toggleFAQ(i) {
      const ans = document.getElementById('faq-answer-' + i);
      const icon = document.getElementById('faq-icon-' + i);
      const isOpen = ans.style.display === 'block';
      ans.style.display = isOpen ? 'none' : 'block';
      icon.style.transform = isOpen ? '' : 'rotate(180deg)';
    }

    // Auto-expand iframe height to content
    var frame = document.getElementById('tool-frame');
    if (frame) {
      frame.style.minHeight = '900px';
      frame.addEventListener('load', function() {
        try {
          var h = frame.contentWindow.document.documentElement.scrollHeight;
          if (h > 600) frame.style.height = h + 'px';
        } catch(e) {
          // cross-origin fallback — keep min-height
        }
      });
    }
  </script>
</body>
</html>`;
}

// ─── Main generation loop ─────────────────────────────────────────────────────
function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const sitemapUrls = [];
  let totalPages = 0;
  const exampleFiles = [];

  console.log(`\nGenerating programmatic SEO pages for ${tools.length} tools...\n`);

  for (const tool of tools) {
    const variants = buildVariants(tool);
    for (const variant of variants) {
      const html = buildHTML({ variant, tool });
      const outPath = path.join(OUTPUT_DIR, variant.filename);
      fs.writeFileSync(outPath, html, "utf8");
      sitemapUrls.push(`${BASE_URL}/tools/variants/${variant.filename}`);
      totalPages++;
      if (exampleFiles.length < 3) exampleFiles.push(variant.filename);
    }
    process.stdout.write(`  OK  ${tool.name} (${variants.length} variants)\n`);
  }

  // Sitemap
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
    .map(
      (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join("\n")}
</urlset>`;
  fs.writeFileSync(SITEMAP_OUT, sitemapXml, "utf8");

  console.log(`
-------------------------------------------
DONE
  Total pages : ${totalPages}
  Output dir  : ${OUTPUT_DIR}
  Sitemap     : ${SITEMAP_OUT}

Example files:
${exampleFiles.map((f) => "  " + path.join(OUTPUT_DIR, f)).join("\n")}
-------------------------------------------
`);
}

main();
