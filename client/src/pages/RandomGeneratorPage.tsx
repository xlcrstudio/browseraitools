import { useEffect } from "react";
import { Shuffle } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { RandomGenerator } from "@/components/RandomGenerator";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";

const FAQS = [
  {
    question: "How are the random numbers generated?",
    answer: "All numbers are generated using the Web Cryptography API (crypto.getRandomValues), which produces cryptographically secure random numbers. This is far more unpredictable than Math.random() and suitable for any use case including security, games, and fair selections.",
  },
  {
    question: "What modes does this tool have?",
    answer: "Five modes: Number (generate one or multiple random numbers in any range), List (pick random winners or items from your own list), Dice (roll any standard RPG dice — d4, d6, d8, d10, d12, d20, d100 — with multiple dice and modifiers), Coin (flip a coin), and Weighted (pick randomly where each option has a custom probability).",
  },
  {
    question: "Can it pick multiple winners from a list without repeats?",
    answer: "Yes. In List mode, enter your items one per line or comma-separated, set how many to pick, and the tool uses a Fisher-Yates shuffle to select them. Every item has exactly equal probability of being chosen, and no item can be selected twice.",
  },
  {
    question: "How does weighted random work?",
    answer: "In Weighted mode, each option has a weight (any positive number). The probability of an option being selected equals its weight divided by the sum of all weights. For example, Option A at weight 70 and Option B at weight 30 gives a 70%/30% split. The weights don't need to add up to 100 — they're relative.",
  },
  {
    question: "How does the dice roller work?",
    answer: "Select a die type (d4, d6, d8, d10, d12, d20, or d100), set how many dice to roll (1–20), and add an optional modifier (+/-). Results show each individual die and the total. Statistics (minimum, maximum, average) are shown for multi-dice rolls.",
  },
  {
    question: "Is there a history of previous results?",
    answer: "Yes — the tool keeps your last 10 results from any mode in a history panel at the bottom of the page. Each entry shows the mode, parameters, and result, with a copy button. The history is cleared when you refresh the page or click 'Clear history'.",
  },
  {
    question: "Is any data sent to a server?",
    answer: "No — everything runs entirely in your browser. No data is sent, stored, or logged anywhere.",
  },
];

export default function RandomGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free Random Number Generator & Decision Maker — Dice, Lists, Weighted | Browser AI Tools";

    const metas: Record<string, string> = {
      description: "Free random number generator, list picker, dice roller, coin flip, and weighted random selector. Cryptographically secure. Instant, private, no signup.",
    };
    const ogs: Record<string, string> = {
      "og:title": "Free Random Number Generator — Numbers, Lists, Dice, Coin Flip & Weighted Random",
      "og:description": "Generate random numbers, pick winners from lists, roll dice, flip coins, and do weighted random selections. Cryptographically secure and 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/random-number-generator",
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
            "name": "Random Number Generator",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free random number generator, list picker, dice roller, coin flip, and weighted random selector. Cryptographically secure and 100% private.",
          }),
        }}
      />

      <ToolPageHeader toolName="Random Generator" icon={Shuffle} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          Random Number{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Generator
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Generate random numbers, pick winners from lists, roll dice, flip coins, and make weighted random decisions — all cryptographically secure.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "Number Ranges",
            "List Picker",
            "Dice Roller",
            "Coin Flip",
            "Weighted Random",
            "Result History",
            "Crypto Secure",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="random-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <RandomGenerator />
      </div>

      <AdBlock slot="random-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>Five Random Generation Modes</h2>

        <h3>Number Mode</h3>
        <p>Generate one or multiple random integers within any range. Toggle "No duplicates" to ensure unique values, and "Sort ascending" to order the results. Supports generating up to 50 numbers at once.</p>

        <h3>List Mode</h3>
        <p>Paste any list of names, items, or options — one per line or comma-separated. Set how many to pick and the tool uses a cryptographically secure Fisher-Yates shuffle to select winners. Every item has exactly equal probability. Useful for classroom selections, giveaways, team drafts, and random assignments.</p>

        <h3>Dice Mode</h3>
        <p>Roll standard RPG dice: d4, d6, d8, d10, d12, d20, and d100. Set how many dice to roll and add a modifier. Multi-dice rolls show individual die results plus the total, with min/max/average statistics. Perfect for D&D, tabletop RPGs, and board games.</p>

        <h3>Coin Mode</h3>
        <p>A simple 50/50 coin flip with a heads-or-tails result. Uses cryptographic randomness — no bias toward either outcome.</p>

        <h3>Weighted Mode</h3>
        <p>Assign different probabilities to each option. Add as many options as you need and set a weight for each. The percentage shown next to each weight updates in real time. Useful for choosing restaurants, making decisions when you have a preference but want an element of chance, or simulating probability-weighted events.</p>

        <h2>Why Cryptographically Secure Randomness Matters</h2>
        <p>Most online random number generators use <code>Math.random()</code>, which is a pseudo-random number generator seeded with a predictable value. It's fine for casual use but not truly unpredictable. This tool uses <code>crypto.getRandomValues()</code> — the same API used for cryptographic keys — which draws from the operating system's entropy pool. Every result is genuinely unpredictable.</p>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="random-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="Random Number Generator"
        toolDescription="Free random number generator, list picker, dice roller, coin flip, and weighted random selector. Five modes, cryptographically secure randomness, result history. 100% private."
        faqs={FAQS}
      />
    </>
  );
}
