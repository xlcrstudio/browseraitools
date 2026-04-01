/**
 * generate-persona-pages.js
 * Generates static SEO-optimised persona hub pages.
 *
 * Usage:
 *   node generate-persona-pages.js             (generates all 6 pages)
 *   node generate-persona-pages.js --preview   (prints students page to console only)
 */

import fs   from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const IS_PREVIEW = process.argv.includes("--preview");
const BASE_URL   = "https://browseraitools.com";
const TODAY      = "2026-04-01";
const OUT_DIR    = path.join(__dirname, "client", "public", "personas");

// ─── Load tool list ─────────────────────────────────────────────────────────
const { tools } = JSON.parse(fs.readFileSync(path.join(__dirname, "tools-config.json"), "utf8"));

// ─── Persona definitions ────────────────────────────────────────────────────
const PERSONAS = [
  {
    slug:        "students",
    label:       "Students",
    emoji:       "🎓",
    title:       "Best Free AI Tools for Students — No Signup, 100% Private",
    metaDesc:    "Free AI tools built for students: essay writer, homework solver, flashcard generator, summarizer, citation generator & more. No signup. Runs 100% in your browser via WebLLM.",
    h1:          "Best Free AI Tools for Students",
    tagline:     "Study smarter, write faster, and learn deeper — all without paying a cent or sharing your data.",
    intro:       `Students face constant pressure: essays due at midnight, lectures to catch up on, papers to cite, and concepts that just won't click. BrowserAITools gives you a full suite of AI-powered study tools that run entirely inside your browser — no cloud servers, no signup, and no subscription fees. Every generation happens on your own device using WebLLM technology, so your notes, drafts, and ideas never leave your machine.

Whether you need to summarise a 40-page PDF in seconds, generate a properly formatted citation, check your essay for readability, or create flashcards from raw lecture notes, these tools handle the heavy lifting so you can focus on understanding the material. Unlike other "free" AI tools, there are no daily limits, no premium tiers, and no data collection. Open the tool, type your content, and get results in seconds. Compatible with Chrome and Edge on any device with WebGPU support — no extensions or downloads needed.`,
    categories:  ["Writing Tools", "AI Assistant", "Productivity Tools", "Job & Career Tools"],
    slugWhitelist: [
      "ai-essay-writer", "ai-homework-solver", "ai-flashcard-generator",
      "ai-text-summarizer", "ai-citation-generator", "ai-paraphrasing-tool",
      "explain-this-ai", "ai-pdf-summarizer", "ai-grammar-checker",
      "ai-readability-analyzer", "ai-plagiarism-checker", "ai-chatbot",
      "ai-personal-statement-generator", "ai-document-analyzer",
    ],
    howSteps: [
      { n: "1", title: "Open any tool",      body: "No download, no account. Click a tool from the grid below and it opens instantly in your browser." },
      { n: "2", title: "Paste your content", body: "Paste your essay, notes, or question. The AI runs locally on your device — nothing is uploaded." },
      { n: "3", title: "Get instant results", body: "Receive polished output in seconds. Copy, refine, or regenerate as many times as you need — it's unlimited and free." },
    ],
    faqs: [
      { q: "Are these AI tools actually free for students?",                    a: "Yes — completely free, forever. There are no paid tiers, no daily limits, and no credit card required. The AI runs on your device using WebLLM, so there are no server costs, which means no charges for you." },
      { q: "Will my essays or notes be stored anywhere?",                       a: "No. Everything you type stays in your browser tab. Nothing is sent to any server. When you close the tab, the data is gone. It's the most private AI tool you'll find." },
      { q: "Which tools are most useful for writing academic papers?",          a: "The Essay Writer, Paraphrasing Tool, Citation Generator, Grammar Checker, and Readability Analyzer are the most popular with students writing academic work." },
      { q: "Can I use these tools on my phone or tablet?",                     a: "Yes, but WebGPU support is required. Chrome on Android works well. Safari on iOS does not yet support WebGPU. For best performance, use Chrome or Edge on a laptop or desktop." },
      { q: "Do I need to install anything?",                                   a: "Nothing at all. Open the URL in a compatible browser and the AI model downloads once into your browser's local cache. Subsequent uses are instant." },
    ],
  },

  {
    slug:        "marketers",
    label:       "Marketers",
    emoji:       "📣",
    title:       "Best Free AI Tools for Marketers — No Signup, Runs in Browser",
    metaDesc:    "Free AI marketing tools: caption generator, ad copy, SEO titles, meta descriptions, hashtags, email generator & more. No signup. 100% private. Runs in your browser via WebLLM.",
    h1:          "Best Free AI Tools for Marketers",
    tagline:     "Ship more campaigns, write better copy, and rank higher — without paying for another SaaS tool.",
    intro:       `Marketers are expected to produce more content than ever: social captions, ad copy, landing pages, SEO titles, meta descriptions, email sequences, hashtags, and keyword research — all on tight deadlines and tighter budgets. BrowserAITools gives you a professional-grade AI content suite that runs 100% inside your browser, powered by WebLLM. No subscription. No API key. No data sent to any server.

Every tool in this collection was designed for the specific tasks marketers face daily. Generate scroll-stopping Instagram captions, A/B-testable ad copy, click-worthy SEO titles, and keyword clusters without touching your budget. Because the AI model runs locally on your device, your campaign ideas, brand messaging, and customer data stay completely private. You also get unlimited generations — no monthly word limits or "credits" to worry about. From solo freelancers to in-house marketing teams, BrowserAITools is the fastest way to 10× your content output without 10× the cost.`,
    categories:  ["Social Media Tools", "Marketing Tools", "SEO Tools"],
    slugWhitelist: [
      "ai-instagram-caption-generator", "ai-ad-copy-generator", "ai-seo-title-generator",
      "ai-meta-description-generator", "ai-hashtag-generator", "ai-hook-generator",
      "ai-keyword-generator", "ai-landing-page-copy-generator", "ai-content-repurposer",
      "ai-call-to-action-generator", "ai-email-response-generator", "ai-content-brief-generator",
      "ai-serp-intent-analyzer", "ai-content-gap-analyzer", "ai-tiktok-caption-generator",
    ],
    howSteps: [
      { n: "1", title: "Pick your format",     body: "Choose from captions, ad copy, SEO titles, hashtags, and more. Each tool is purpose-built for a specific marketing output." },
      { n: "2", title: "Enter your context",   body: "Paste your product description, target keyword, or campaign brief. The AI is context-aware and produces on-brand results." },
      { n: "3", title: "Copy and publish",      body: "Copy the output directly into your CMS, ad manager, or social scheduler. Iterate in seconds with no usage limits." },
    ],
    faqs: [
      { q: "Can I use these tools for client work?",                           a: "Yes. There are no restrictions on commercial use. Generate copy for clients, agencies, or your own brand — all for free." },
      { q: "Will my campaign briefs be stored or used for training?",          a: "No. The AI runs entirely in your browser. Nothing you type is sent to any server, logged, or used for model training." },
      { q: "Which tools are best for social media marketing?",                 a: "The Instagram Caption Generator, Hashtag Generator, Hook Generator, TikTok Caption Generator, and Content Repurposer are the most popular with social media marketers." },
      { q: "How accurate is the SEO content?",                                 a: "The AI produces contextually relevant titles, descriptions, and keyword clusters. We recommend using these as a strong first draft and refining for your specific brand voice." },
      { q: "Is there a limit to how much content I can generate?",            a: "No limits at all. Generate as many captions, headlines, or descriptions as you need. The only constraint is your browser's memory." },
    ],
  },

  {
    slug:        "developers",
    label:       "Developers",
    emoji:       "👨‍💻",
    title:       "Best Free AI Tools for Developers — No Signup, Runs in Browser",
    metaDesc:    "Free AI developer tools: code explainer, regex tester, JSON validator, diff checker, lorem ipsum, markdown converter & more. No signup. 100% private. Powered by WebLLM.",
    h1:          "Best Free AI Tools for Developers",
    tagline:     "Debug faster, document better, and ship cleaner code — all from your browser with zero data leaving your machine.",
    intro:       `Developers live in their browsers almost as much as their IDEs. BrowserAITools gives you a curated set of AI-powered utilities that slot into your workflow without adding another SaaS subscription. Every tool runs locally in your browser using WebLLM — no API keys, no cloud processing, no usage fees, and no data leaks. Your code snippets, regex patterns, and JSON payloads never leave your machine.

Explain a confusing code block, validate and format JSON payloads, test regex patterns against live input, compare diffs, convert Markdown to HTML, generate placeholder text for wireframes, or ask the AI chatbot to debug a tricky bug — all in the same browser tab. Because the model runs on your GPU via WebGPU, generations are fast and there are no rate limits to interrupt your flow. Whether you're a solo developer, part of a team, or doing a security-sensitive project, these tools keep your intellectual property private by design.`,
    categories:  ["Developer Tools", "Writing Tools", "AI Assistant"],
    slugWhitelist: [
      "ai-code-explainer", "regex-tester", "json-validator-formatter",
      "diff-checker", "markdown-converter", "lorem-ipsum-generator",
      "ai-chatbot", "ai-code-playground", "ai-prompt-generator",
      "word-counter", "case-converter", "ai-document-analyzer",
    ],
    howSteps: [
      { n: "1", title: "Open the tool",        body: "No install, no signup. Open any tool in Chrome or Edge. The AI model loads into your browser's local cache on first use." },
      { n: "2", title: "Paste your input",     body: "Paste code, JSON, regex, or Markdown. Everything runs on-device — your proprietary code never touches a server." },
      { n: "3", title: "Get instant output",   body: "Receive explained code, formatted JSON, or converted Markdown instantly. Unlimited iterations with no rate limits." },
    ],
    faqs: [
      { q: "Is it safe to paste proprietary code into these tools?",           a: "Yes. The AI model runs entirely inside your browser — your code is never sent to any server. It's processed locally using WebGPU and stays on your machine." },
      { q: "Which browser works best for developer tools?",                    a: "Chrome and Edge with hardware acceleration enabled give the best performance since they have the most complete WebGPU implementations." },
      { q: "Can I use the AI Code Explainer for unfamiliar languages?",        a: "Yes. The underlying LLM supports most mainstream languages including Python, JavaScript, TypeScript, Rust, Go, Java, C++, SQL, and more." },
      { q: "Is the JSON Validator strict about formatting?",                   a: "Yes, it validates against the JSON spec and highlights errors with line numbers. It also offers an auto-format/prettify option." },
      { q: "Are there any rate limits on the developer tools?",               a: "None. Generate, validate, explain, or convert as many times as you need. The only limit is your browser tab's memory." },
    ],
  },

  {
    slug:        "professionals",
    label:       "Professionals",
    emoji:       "💼",
    title:       "Best Free AI Tools for Professionals — No Signup, 100% Private",
    metaDesc:    "Free AI tools for professionals: meeting summarizer, email generator, cover letter, resume bullet, elevator pitch, decision maker & more. No signup. Runs in browser via WebLLM.",
    h1:          "Best Free AI Tools for Professionals",
    tagline:     "Save hours every week on writing, planning, and decision-making — with AI that never touches your employer's data.",
    intro:       `Professionals spend a disproportionate amount of time on writing tasks: summarising meetings, drafting emails, writing cover letters, building presentations, and crafting pitches. BrowserAITools gives you a suite of on-device AI tools that eliminate the friction from these tasks while keeping your work completely private. Because the AI runs inside your browser using WebLLM, your meeting notes, salary negotiations, and business strategies are never uploaded to any server.

From generating concise meeting summaries from rough notes, to writing polished elevator pitches and sales emails, to using the Decision Maker tool for complex trade-off analysis, these tools act as a tireless professional co-pilot. There are no subscription fees, no per-document charges, and no account to create. Whether you work in finance, consulting, law, HR, or operations, you'll find tools that match your daily workflow. Simply open the tool, describe your context, and get a polished first draft in seconds.`,
    categories:  ["Business Tools", "Job & Career Tools", "Productivity Tools"],
    slugWhitelist: [
      "ai-meeting-summary-generator", "ai-email-response-generator", "ai-cover-letter-generator",
      "ai-resume-bullet-generator", "ai-elevator-pitch-generator", "ai-decision-maker",
      "ai-sales-email-generator", "ai-cold-outreach-generator", "ai-ats-resume-matcher",
      "ai-goal-planner", "ai-weekly-planner-generator", "ai-value-proposition-generator",
      "ai-document-analyzer", "ai-pii-redactor",
    ],
    howSteps: [
      { n: "1", title: "Choose your task",     body: "Select the tool that matches your immediate need — meeting summary, email draft, elevator pitch, or decision analysis." },
      { n: "2", title: "Describe your context", body: "Paste your notes, job description, or situation. The AI is context-aware and tailors output to your specific scenario." },
      { n: "3", title: "Refine and use",        body: "Copy the polished draft into your email, document, or slide deck. Regenerate any section until it matches your voice." },
    ],
    faqs: [
      { q: "Is it safe to paste confidential work content into these tools?",  a: "Yes. All processing happens in your browser — nothing is sent to any server. Your meeting notes and business strategies stay on your device." },
      { q: "Can these tools help with job searching?",                         a: "Absolutely. The Cover Letter Generator, Resume Bullet Generator, and ATS Matcher are particularly popular with professionals changing roles or targeting new opportunities." },
      { q: "How good is the Meeting Summary Generator?",                       a: "Very effective for converting rough notes or transcripts into structured summaries with key decisions, action items, and attendees. Works best with detailed input." },
      { q: "Can I use the PII Redactor before sharing documents?",             a: "Yes. The PII Redactor identifies and removes personally identifiable information from text before you share it — useful for compliance and data governance." },
      { q: "Are there word or usage limits?",                                  a: "No limits at all. Generate as many meeting summaries, emails, or pitches as you need throughout your workday." },
    ],
  },

  {
    slug:        "writers",
    label:       "Writers",
    emoji:       "✍️",
    title:       "Best Free AI Tools for Writers — No Signup, Runs in Browser",
    metaDesc:    "Free AI writing tools: essay writer, blog generator, paraphrasing tool, headline improver, story starter, AI humanizer & more. No signup. 100% private. Powered by WebLLM.",
    h1:          "Best Free AI Tools for Writers",
    tagline:     "Overcome writer's block, polish every draft, and publish more — with AI that stays entirely on your device.",
    intro:       `Writers — bloggers, novelists, journalists, copywriters, content creators — all share the same obstacles: blank pages, repetitive phrasing, weak headlines, and the endless cycle of revising. BrowserAITools assembles the most powerful AI writing toolkit available for free, running completely inside your browser with no subscription, no word limits, and no data collection. Your drafts, story ideas, and creative work never leave your machine.

Use the AI Blog Generator to draft a full post from a headline, the Story Starter to escape creative block, the Paraphrasing Tool to reword without losing meaning, the Headline Improver to make titles irresistible, or the AI Humanizer to make AI-generated text sound genuinely human. The Sentence Expander and Shortener give you fine-grained control over length and density, while the Grammar Checker and Readability Analyzer help you polish every line. Whether you write for yourself, a brand, or clients, these tools help you produce more without burning out.`,
    categories:  ["Writing Tools", "Social Media Tools", "Unique & Viral Tools"],
    slugWhitelist: [
      "ai-blog-post-generator", "ai-essay-writer", "ai-paraphrasing-tool",
      "ai-headline-improver", "ai-story-starter", "ai-text-humanizer",
      "ai-grammar-checker", "ai-readability-analyzer", "ai-sentence-expander",
      "ai-sentence-shortener", "ai-sentence-simplifier", "ai-paragraph-rewriter",
      "ai-hook-generator", "ai-faq-generator", "ai-youtube-script-generator",
    ],
    howSteps: [
      { n: "1", title: "Pick your challenge",   body: "Whether you need a first draft, a better headline, or a paragraph rewrite — there's a specific tool for every writing obstacle." },
      { n: "2", title: "Feed it your content",  body: "Paste your draft, headline, or topic. The AI responds to context and produces output that matches your intent." },
      { n: "3", title: "Iterate freely",         body: "Regenerate, tweak, combine outputs. There are no usage limits so you can iterate until every line is exactly right." },
    ],
    faqs: [
      { q: "Will the AI writing tools work for fiction writing?",              a: "Yes. The Story Starter, Paragraph Rewriter, and AI Chatbot all work well for fiction. Feed them your genre, characters, and plot context for best results." },
      { q: "Can I use these tools to improve existing drafts?",                a: "Absolutely. The Paraphrasing Tool, Headline Improver, Grammar Checker, and Readability Analyzer are designed for editing and polishing existing text." },
      { q: "Does the AI Humanizer actually fool AI detectors?",               a: "It significantly reduces the statistical patterns that AI detectors look for. Results vary by detector and content type. It's a useful step in the editing process, not a guarantee." },
      { q: "Are these tools safe for commercial writing work?",               a: "Yes. There are no commercial use restrictions and nothing you write is stored or sent anywhere. Your client work stays completely private." },
      { q: "How long can the content be?",                                    a: "Most tools handle up to several thousand characters of input. For very long documents, break them into sections and process each one separately." },
    ],
  },

  {
    slug:        "founders",
    label:       "Founders",
    emoji:       "🚀",
    title:       "Best Free AI Tools for Founders & Startups — No Signup, Private",
    metaDesc:    "Free AI tools for founders: business name generator, value proposition, elevator pitch, sales email, landing page copy, target audience & more. No signup. Runs in browser.",
    h1:          "Best Free AI Tools for Founders",
    tagline:     "Launch faster, pitch sharper, and market smarter — with AI that keeps your startup ideas completely private.",
    intro:       `Founding a company means wearing every hat at once: naming the business, writing the pitch, building the landing page, researching the market, drafting cold outreach, and generating marketing content — all before product-market fit is even proven. BrowserAITools gives founders an AI toolkit that covers the full early-stage workflow, running 100% in your browser so your unreleased ideas and competitive strategies never reach a third-party server.

Generate a compelling startup name with the Business Name Generator, pressure-test your positioning with the Value Proposition Generator, script your investor pitch with the Elevator Pitch Generator, write your landing page copy, and draft targeted cold outreach — all for free, all instantly, all privately. Because WebLLM runs the AI model directly on your device using WebGPU, there's no subscription to worry about and no "credits" to ration. Iterate on your messaging and positioning as many times as you need without watching a usage counter tick down.`,
    categories:  ["Business Tools", "Marketing Tools", "SEO Tools", "Unique & Viral Tools"],
    slugWhitelist: [
      "ai-business-name-generator", "ai-value-proposition-generator", "ai-elevator-pitch-generator",
      "ai-landing-page-copy-generator", "ai-cold-outreach-generator", "ai-sales-email-generator",
      "ai-target-audience-generator", "ai-startup-name-generator", "ai-business-idea-generator",
      "ai-ad-copy-generator", "ai-hook-generator", "ai-content-brief-generator",
      "ai-pros-cons-generator", "ai-decision-maker", "ai-email-response-generator",
    ],
    howSteps: [
      { n: "1", title: "Name your challenge",   body: "Identify what's blocking you right now — naming, pitching, positioning, or outreach — and open the matching tool." },
      { n: "2", title: "Describe your startup", body: "Give the AI your product, target customer, and unique advantage. More context equals sharper output." },
      { n: "3", title: "Ship the output",        body: "Copy results directly into your deck, website, or email. No signup, no export fees, no watermarks." },
    ],
    faqs: [
      { q: "Will my startup idea be visible to anyone?",                       a: "No. The AI model runs inside your browser — your ideas, business plans, and pitch decks are never sent to any server or seen by anyone." },
      { q: "Can I generate investor pitch content with these tools?",          a: "Yes. The Elevator Pitch Generator, Value Proposition Generator, and Pros & Cons Generator are all useful for preparing investor-facing content." },
      { q: "Which tool is best for writing a landing page?",                  a: "The Landing Page Copy Generator is purpose-built for this. Pair it with the Hook Generator and Call-to-Action Generator for a complete above-the-fold section." },
      { q: "How do I find my target customer with these tools?",               a: "Start with the Target Audience Generator — describe your product and it returns a detailed buyer persona including demographics, pain points, and purchase triggers." },
      { q: "Are there limits on how many pitches or names I can generate?",   a: "No limits. Generate 50 business names, iterate on 20 elevator pitches, or rewrite your landing page headline all day. It's completely free and unlimited." },
    ],
  },
];

// ─── Shared CSS (identical to main tool pages) ───────────────────────────────
const SHARED_CSS = `
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
    .site-logo { font-size: 1.2rem; font-weight: 900; text-decoration: none; }
    .site-nav { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
    .nav-link { padding: 6px 12px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #475569; text-decoration: none; transition: all .15s; }
    .nav-link:hover { color: #7e22ce; background: #f5f3ff; }
    .dark .nav-link { color: #94a3b8; }
    .dark .nav-link:hover { color: #c084fc; background: rgba(126,34,206,.15); }
    .nav-cta { background: #9333ea; color: #fff !important; }
    .nav-cta:hover { background: #7e22ce !important; }

    /* Breadcrumb */
    .breadcrumb { padding: 10px 0; font-size: 12px; color: #94a3b8; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
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
    .hero-tagline { font-size: 1.1rem; font-weight: 600; color: #7e22ce; margin-bottom: 0.75rem; }
    .dark .hero-tagline { color: #c084fc; }
    .hero-intro { font-size: 1rem; color: #475569; max-width: 800px; margin: 0 auto 1.5rem; line-height: 1.8; }
    .dark .hero-intro { color: #94a3b8; }

    /* Section */
    .section { margin: 2.5rem 0; }
    .section-title { font-size: 1.25rem; font-weight: 900; color: #0f172a; margin-bottom: 1rem; }
    .dark .section-title { color: #f1f5f9; }

    /* Tool grid */
    .tool-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
    @media (min-width: 480px)  { .tool-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 768px)  { .tool-grid { grid-template-columns: repeat(3, 1fr); } }
    @media (min-width: 1100px) { .tool-grid { grid-template-columns: repeat(4, 1fr); } }
    .tool-card { display: flex; flex-direction: column; gap: 6px; padding: 16px; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; text-decoration: none; transition: all .15s; }
    .tool-card:hover { border-color: #c084fc; box-shadow: 0 4px 16px rgba(168,85,247,.12); transform: translateY(-1px); }
    .dark .tool-card { background: #1e293b; border-color: #334155; }
    .dark .tool-card:hover { border-color: #a855f7; }
    .tool-card-icon { width: 40px; height: 40px; border-radius: 10px; background: #f3e8ff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; color: #6b21a8; flex-shrink: 0; margin-bottom: 4px; }
    .dark .tool-card-icon { background: rgba(107,33,168,.3); color: #d8b4fe; }
    .tool-card-name { font-size: 13px; font-weight: 700; color: #1e293b; line-height: 1.3; }
    .dark .tool-card-name { color: #e2e8f0; }
    .tool-card-cat  { font-size: 11px; color: #64748b; }
    .tool-card-cta  { margin-top: auto; font-size: 11px; font-weight: 600; color: #9333ea; }

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

    /* FAQ */
    .hidden { display: none !important; }
    .faq-list { display: flex; flex-direction: column; gap: 8px; }
    .faq-item { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
    .dark .faq-item { border-color: #334155; }

    /* Persona nav strip */
    .persona-strip { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin: 1.5rem 0; }
    .persona-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 9999px; border: 1px solid #e2e8f0; background: #fff; font-size: 13px; font-weight: 600; color: #475569; text-decoration: none; transition: all .15s; }
    .persona-chip:hover { border-color: #a855f7; color: #7e22ce; background: #faf5ff; }
    .dark .persona-chip { background: #1e293b; border-color: #334155; color: #94a3b8; }
    .dark .persona-chip:hover { border-color: #a855f7; color: #c084fc; background: rgba(107,33,168,.15); }
    .persona-chip.active { border-color: #9333ea; background: #f3e8ff; color: #6b21a8; }
    .dark .persona-chip.active { background: rgba(107,33,168,.3); color: #d8b4fe; border-color: #7e22ce; }

    /* Footer */
    .site-footer { border-top: 1px solid #e2e8f0; background: #fff; margin-top: 3rem; }
    .dark .site-footer { background: #0f172a; border-color: #1e293b; }
    .footer-inner { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 2rem 0; font-size: 13px; color: #64748b; }
    @media (min-width: 640px) { .footer-inner { flex-direction: row; justify-content: space-between; } }
    .footer-brand { font-weight: 900; color: #0f172a; }
    .dark .footer-brand { color: #f1f5f9; }
    .footer-nav { display: flex; gap: 16px; flex-wrap: wrap; }
    .footer-nav a { color: #64748b; text-decoration: none; }
    .footer-nav a:hover { color: #9333ea; }
`;

// ─── Schema builder ───────────────────────────────────────────────────────────
function buildSchema(persona, pageTools) {
  const pageUrl = `${BASE_URL}/personas/${persona.slug}.html`;

  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name:        persona.h1,
    description: persona.metaDesc,
    url:         pageUrl,
    dateModified: TODAY,
    publisher: {
      "@type": "Organization",
      name: "BrowserAITools",
      url:  BASE_URL,
    },
    hasPart: pageTools.map((t) => ({
      "@type": "SoftwareApplication",
      name:            t.name,
      url:             `${BASE_URL}/${t.slug}`,
      applicationCategory: "WebApplication",
      operatingSystem: "Web Browser",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    })),
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: persona.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return [
    JSON.stringify(collectionPage, null, 2),
    JSON.stringify(faqPage, null, 2),
  ];
}

// ─── Initials for icon ────────────────────────────────────────────────────────
function initials(name) {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

// ─── Other persona chips ──────────────────────────────────────────────────────
const ALL_PERSONAS = [
  { slug: "students",      emoji: "🎓", label: "Students"      },
  { slug: "marketers",     emoji: "📣", label: "Marketers"     },
  { slug: "developers",    emoji: "👨‍💻", label: "Developers"    },
  { slug: "professionals", emoji: "💼", label: "Professionals" },
  { slug: "writers",       emoji: "✍️", label: "Writers"       },
  { slug: "founders",      emoji: "🚀", label: "Founders"      },
];

// ─── HTML builder ─────────────────────────────────────────────────────────────
function buildHtml(persona) {
  const pageUrl   = `${BASE_URL}/personas/${persona.slug}.html`;
  const canonUrl  = `${BASE_URL}/personas/${persona.slug}.html`;

  // Filter tools to just those in the whitelist (ordered), fall back to categories
  const pageTools = persona.slugWhitelist
    .map((s) => tools.find((t) => t.slug === s))
    .filter(Boolean);

  const [schemaCollection, schemaFaq] = buildSchema(persona, pageTools);

  // ── Tool grid HTML ──────────────────────────────────────────────────────────
  const toolGridHtml = pageTools.map((t) => `
    <a href="${BASE_URL}/${t.slug}" class="tool-card" rel="noopener">
      <div class="tool-card-icon">${initials(t.name)}</div>
      <div class="tool-card-name">${t.name}</div>
      <div class="tool-card-cat">${t.category}</div>
      <div class="tool-card-cta">Try free &rarr;</div>
    </a>`).join("");

  // ── How-to steps HTML ───────────────────────────────────────────────────────
  const howHtml = persona.howSteps.map((s) => `
    <div>
      <div class="step-num">${s.n}</div>
      <div class="step-title">${s.title}</div>
      <p class="step-body">${s.body}</p>
    </div>`).join("");

  // ── FAQ HTML ────────────────────────────────────────────────────────────────
  const faqHtml = persona.faqs.map((f, i) => `
    <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <button onclick="toggleFAQ(${i})" style="width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 20px;text-align:left;background:#fff;border:none;cursor:pointer;transition:background .15s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
        <span style="font-size:14px;font-weight:600;color:#1e293b;" itemprop="name">${f.q}</span>
        <svg id="faq-icon-${i}" style="width:16px;height:16px;color:#94a3b8;flex-shrink:0;transition:transform .2s;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div id="faq-answer-${i}" class="hidden" style="padding:0 20px 16px;background:#f8fafc;" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
        <p style="font-size:13px;color:#475569;line-height:1.7;" itemprop="text">${f.a}</p>
      </div>
    </div>`).join("");

  // ── Persona chips ───────────────────────────────────────────────────────────
  const personaChipsHtml = ALL_PERSONAS.map((p) => `
    <a href="/personas/${p.slug}.html" class="persona-chip${p.slug === persona.slug ? " active" : ""}">
      ${p.emoji} ${p.label}
    </a>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${persona.title}</title>
  <meta name="description" content="${persona.metaDesc}" />
  <link rel="canonical" href="${canonUrl}" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:title" content="${persona.title}" />
  <meta property="og:description" content="${persona.metaDesc}" />
  <meta property="og:site_name" content="BrowserAITools" />
  <meta property="og:image" content="${BASE_URL}/favicon.png" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${persona.title}" />
  <meta name="twitter:description" content="${persona.metaDesc}" />

  <meta name="robots" content="index, follow" />
  <link rel="icon" href="/favicon.png" />

  <!-- Tailwind CDN (no defer — needed before paint for .hidden) -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- JSON-LD: CollectionPage -->
  <script type="application/ld+json">
${schemaCollection}
  </script>

  <!-- JSON-LD: FAQPage -->
  <script type="application/ld+json">
${schemaFaq}
  </script>

  <style>${SHARED_CSS}</style>
</head>
<body>

  <!-- Header -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="${BASE_URL}" class="site-logo gradient-text">BrowserAITools</a>
      <nav class="site-nav">
        <a href="${BASE_URL}" class="nav-link">Home</a>
        <a href="${BASE_URL}/#tools" class="nav-link">All Tools</a>
        <a href="${BASE_URL}" class="nav-link nav-cta">Try Free &rarr;</a>
      </nav>
    </div>
  </header>

  <!-- Breadcrumb -->
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="${BASE_URL}">Home</a>
      <span>/</span>
      <a href="${BASE_URL}">AI Tools</a>
      <span>/</span>
      <span>For ${persona.label}</span>
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
      <h1><span style="font-size:2rem;margin-right:8px;">${persona.emoji}</span><span class="gradient-text">${persona.h1}</span></h1>
      <p class="hero-tagline">${persona.tagline}</p>
      <p class="hero-intro">${persona.intro.replace(/\n\n/g, "</p><p class=\"hero-intro\" style=\"margin-top:1rem;\">")}</p>
    </section>

    <!-- Persona navigation strip -->
    <div class="persona-strip" role="navigation" aria-label="Browse by persona">
      ${personaChipsHtml}
    </div>

    <!-- Tool Grid -->
    <section class="section">
      <h2 class="section-title">Top AI Tools for ${persona.label}</h2>
      <div class="tool-grid">
        ${toolGridHtml}
      </div>
    </section>

    <!-- How to Use -->
    <section class="section">
      <div class="how-card">
        <h2 class="section-title">How to Use These Tools as a ${persona.label.slice(0, -1)}</h2>
        <div class="how-steps">
          ${howHtml}
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section">
      <h2 class="section-title">Frequently Asked Questions</h2>
      <div class="faq-list" itemscope itemtype="https://schema.org/FAQPage">
        ${faqHtml}
      </div>
    </section>

  </main>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container footer-inner">
      <div>
        <span class="footer-brand">BrowserAITools</span>
        &nbsp;&mdash; 100% Free. 100% Private. 100% In-Browser.
      </div>
      <nav class="footer-nav">
        <a href="${BASE_URL}">Home</a>
        <a href="${BASE_URL}/#tools">All Tools</a>
        ${ALL_PERSONAS.map((p) => `<a href="/personas/${p.slug}.html">${p.label}</a>`).join("")}
      </nav>
    </div>
  </footer>

  <script>
    // Dark mode
    (function() {
      var saved = localStorage.getItem('theme');
      if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    })();

    // FAQ accordion
    function toggleFAQ(i) {
      var ans  = document.getElementById('faq-answer-' + i);
      var icon = document.getElementById('faq-icon-' + i);
      if (!ans) return;
      var isOpen = !ans.classList.contains('hidden');
      if (isOpen) {
        ans.classList.add('hidden');
        if (icon) icon.style.transform = '';
      } else {
        ans.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    }
  </script>
</body>
</html>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
  if (IS_PREVIEW) {
    const students = PERSONAS.find((p) => p.slug === "students");
    console.log("\n" + "─".repeat(70));
    console.log("PREVIEW: students.html");
    console.log("─".repeat(70));
    console.log(buildHtml(students).slice(0, 3000) + "\n  ...[truncated for preview]");
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  let count = 0;
  for (const persona of PERSONAS) {
    const html    = buildHtml(persona);
    const outFile = path.join(OUT_DIR, `${persona.slug}.html`);
    fs.writeFileSync(outFile, html, "utf8");
    const kb = (Buffer.byteLength(html, "utf8") / 1024).toFixed(1);
    console.log(`  ✓  ${persona.slug}.html  (${kb} KB, ${tools.filter((t) => persona.slugWhitelist.includes(t.slug)).length} tools)`);
    count++;
  }

  console.log(`\n✅ Generated ${count} persona pages in client/public/personas/`);
}

main();
