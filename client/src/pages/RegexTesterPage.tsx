import { useEffect } from "react";
import { Terminal } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { RegexTester } from "@/components/RegexTester";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import { SimilarTools } from "@/components/RelatedTools";

const FAQS = [
  {
    question: "What is a regular expression (regex)?",
    answer: "A regular expression is a sequence of characters that defines a search pattern. They are used in programming and text editors to match, find, and manipulate strings. For example, the pattern [0-9]{3}-[0-9]{4} matches any string in the format 555-1234.",
  },
  {
    question: "What flags are available and what do they do?",
    answer: "Four flags: g (global) finds all matches instead of stopping at the first; i (case-insensitive) makes A and a equivalent; m (multiline) makes ^ and $ match the start and end of each line rather than the whole string; s (dot-all) makes the dot . match newline characters too, which it normally skips.",
  },
  {
    question: "What does the Pattern Breakdown section show?",
    answer: "It parses your regex token by token and explains what each piece does in plain English. Anchors, character classes, quantifiers, groups, lookaheads, lookbehinds, and escape sequences are each identified and labelled with a short description. This is useful for understanding complex patterns you found online.",
  },
  {
    question: "How does the AI Pattern Generator work?",
    answer: "It runs a small language model entirely in your browser using WebGPU. The first time you click 'Load AI' it downloads the model to your device — this takes a few minutes depending on your connection. After that it generates regex patterns from plain-English descriptions. Your prompts and the model output never leave your device.",
  },
  {
    question: "What common patterns are in the library?",
    answer: "12 ready-to-use patterns covering: email addresses, URLs, US phone numbers, IPv4 addresses, hex color codes, dates (MM/DD/YYYY), credit card numbers, usernames, strong passwords, US ZIP codes, hashtags, and HTML tags. Clicking Load instantly fills the pattern and a sample test string so you can see it working.",
  },
  {
    question: "What does Coverage % mean?",
    answer: "Coverage is the percentage of characters in the test text that were captured by at least one match. For example if your test text is 10 characters long and your pattern matched 3 characters, coverage is 30%. It's a quick indicator of how much of the text your pattern is capturing.",
  },
  {
    question: "Is my text private?",
    answer: "Completely. All regex execution happens in JavaScript in your browser. Your patterns and test text never leave your device. The AI generation also runs locally on your device — nothing is sent to a server.",
  },
];

export default function RegexTesterPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free Regex Tester & Generator — Test & Build Regular Expressions Online | Browser AI Tools";

    const metas: Record<string, string> = {
      description: "Free online regex tester. Test regular expressions with live match highlighting, pattern breakdown, 12 common patterns, and AI generation. 100% private — runs in your browser.",
    };
    const ogs: Record<string, string> = {
      "og:title": "Free Regex Tester & Generator — Live Highlighting, Pattern Breakdown & AI",
      "og:description": "Test and build regular expressions online. Live match highlighting, token-by-token breakdown, 12 common patterns library, and AI generation from plain English. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/regex-tester",
    };

    for (const [name, content] of Object.entries(metas)) {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("name", name); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
    }
    for (const [property, content] of Object.entries(ogs)) {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("property", property); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
    }
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Regex Tester & Generator",
            "applicationCategory": "DeveloperApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free online regex tester with live match highlighting, pattern breakdown, common patterns library, and AI generation.",
          }),
        }}
      />

      <ToolPageHeader toolName="Regex Tester" icon={Terminal} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          Regex Tester{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            & Generator
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Test and build regular expressions with live match highlighting. Explains every token, includes 12 common patterns, and generates regex from plain English with AI.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "Live Highlighting",
            "Pattern Breakdown",
            "12 Common Patterns",
            "Match Details",
            "g / i / m / s Flags",
            "AI Generator",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="regex-tester-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <RegexTester />
      </div>

      <AdBlock slot="regex-tester-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>How to Use the Regex Tester</h2>
        <p>
          Type or paste any JavaScript-compatible regular expression into the pattern field — without the surrounding slashes. Then type or paste the text you want to test against in the Test Text area. Matches are highlighted in yellow instantly as you type.
        </p>

        <h2>Regex Flags</h2>
        <p>Toggle any combination of the four flags:</p>
        <ul>
          <li><strong>g (global)</strong> — finds every match in the text, not just the first</li>
          <li><strong>i (case-insensitive)</strong> — <code>Hello</code> and <code>hello</code> are treated as identical</li>
          <li><strong>m (multiline)</strong> — <code>^</code> and <code>$</code> match the start and end of each line instead of the whole string</li>
          <li><strong>s (dot-all)</strong> — <code>.</code> matches newline characters, which it normally skips</li>
        </ul>

        <h2>Pattern Breakdown</h2>
        <p>
          Expand the Pattern Breakdown section to see a token-by-token explanation of your regex. Each component — anchors, character classes, quantifiers, groups, lookaheads, and escaped sequences — is identified and explained in plain English. This is especially useful when reading patterns found in documentation or Stack Overflow.
        </p>

        <h2>Common Patterns Library</h2>
        <p>
          The library contains 12 pre-built patterns for the most common use cases. Clicking Load on any pattern fills both the regex field and a matching test string so you can see it working immediately. The patterns use double-escaped backslashes (as required when strings are stored as JavaScript variables) and are all tested against their example text.
        </p>

        <h2>AI Pattern Generator</h2>
        <p>
          Describe what you want to match in plain English and the AI generates a JavaScript regex. The AI model runs entirely in your browser — no cloud API, no server, no data sent anywhere. The first load downloads the model to your device which takes a few minutes; after that generation is instant.
        </p>

        <h2>Regex Quick Reference</h2>
        <h3>Character Classes</h3>
        <ul>
          <li><code>\d</code> — any digit [0-9]</li>
          <li><code>\D</code> — any non-digit</li>
          <li><code>\w</code> — word character [A-Za-z0-9_]</li>
          <li><code>\s</code> — whitespace (space, tab, newline)</li>
          <li><code>[abc]</code> — any of a, b, or c</li>
          <li><code>[^abc]</code> — anything except a, b, or c</li>
          <li><code>[a-z]</code> — any lowercase letter</li>
        </ul>
        <h3>Anchors</h3>
        <ul>
          <li><code>^</code> — start of string (or line with m flag)</li>
          <li><code>$</code> — end of string (or line with m flag)</li>
          <li><code>\b</code> — word boundary</li>
        </ul>
        <h3>Quantifiers</h3>
        <ul>
          <li><code>*</code> — 0 or more</li>
          <li><code>+</code> — 1 or more</li>
          <li><code>?</code> — 0 or 1 (optional)</li>
          <li><code>{"{"}n{"}"}</code> — exactly n times</li>
          <li><code>{"{"}n,m{"}"}</code> — between n and m times</li>
          <li>Add <code>?</code> after any quantifier for lazy (non-greedy) matching</li>
        </ul>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <SimilarTools slugs={["/diff-checker", "/json-validator", "/markdown-converter", "/lorem-ipsum-generator", "/password-generator", "/color-palette-generator"]} />

      <AdBlock slot="regex-tester-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="Regex Tester & Generator"
        toolDescription="Free online regex tester with live match highlighting. Test regular expressions with instant visual feedback, token-by-token pattern breakdown, 12 common patterns library, g/i/m/s flag toggles, and AI generation from plain English. 100% private."
        faqs={FAQS}
      />
    </>
  );
}
