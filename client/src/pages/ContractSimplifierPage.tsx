import { useEffect } from "react";
import { FileSignature } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ContractSimplifier } from "@/components/ContractSimplifier";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";

const FAQS = [
  {
    question: "What types of contracts can this tool analyze?",
    answer: "Any plain text legal document: NDAs (non-disclosure agreements), employment contracts, freelance agreements, service contracts, terms of service, privacy policies, lease agreements, partnership agreements, licensing agreements, and consulting contracts. Paste the text directly — no file upload required.",
  },
  {
    question: "What does the Plain English Summary include?",
    answer: "A 2-3 paragraph overview of what the contract does, who the parties are, and what obligations it creates — written for someone with no legal background. No jargon. It tells you the key purpose of the contract and what you're agreeing to at a high level.",
  },
  {
    question: "What are Key Clauses?",
    answer: "The most important sections of the contract, each explained in one plain sentence. Examples include the termination clause (how either party can end the agreement), the governing law clause (which state or country's laws apply), the limitation of liability clause (caps on damages), and payment terms. Each clause is named and explained without legal terminology.",
  },
  {
    question: "What are Red Flags and how are they rated?",
    answer: "Red flags are contract provisions that could be unfavorable to the signing party. They're rated High Risk (seriously unfavorable, uncommon in standard contracts), Medium Risk (worth negotiating or clarifying), or Low Risk (minor concern, common in many contracts). Each flag includes an exact quote from the contract and an explanation of why it's risky.",
  },
  {
    question: "What does the Highlighted Contract view show?",
    answer: "The original contract text with risk phrases colored by severity: red for high-risk phrases, amber for medium-risk, and yellow for low-risk. Hover over any highlighted phrase to see its risk category. This lets you quickly scan the document and see exactly where the problematic language appears in context.",
  },
  {
    question: "Is there a word limit for contracts?",
    answer: "The AI analyzes the first 900 words of the contract. An amber notice appears when your contract is longer. For long contracts, you can analyze key sections separately — paste just the compensation section, the IP assignment clauses, or the termination provisions to get focused analysis on the parts that matter most to you.",
  },
  {
    question: "Is my contract data private?",
    answer: "Yes — completely. The AI model runs entirely in your browser. Your contract text is never uploaded to any server, never stored anywhere, and never processed by a third party. This is critical for NDAs and confidential employment agreements, where sharing the text with an external service could itself violate confidentiality obligations.",
  },
  {
    question: "Does this replace a lawyer?",
    answer: "No. This tool is designed to help you understand what you're reading and identify areas to ask questions about — not to provide legal advice. For any contract with significant financial or legal implications, you should consult a licensed attorney. Think of this as a first-pass that helps you walk into that conversation better prepared.",
  },
];

export default function ContractSimplifierPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Contract Simplifier — Plain English Summary & Risk Analyzer | Browser AI Tools";

    const metas: Record<string, string> = {
      description: "Free AI contract simplifier. Paste any NDA, employment contract, or legal agreement and get a plain English summary, key clauses explained, and red flags highlighted by risk level. 100% private.",
    };
    const ogs: Record<string, string> = {
      "og:title": "Free AI Contract Simplifier — Plain English, Key Clauses & Risk Analyzer",
      "og:description": "Understand any contract instantly. Plain English summary, key clauses explained, red flags rated High/Medium/Low, and interactive risk highlights in the original text. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-contract-simplifier",
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
            "name": "AI Contract Simplifier",
            "applicationCategory": "LegalApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free AI contract simplifier with plain English summary, key clause explanations, and risk analysis. 100% private.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Contract Simplifier" icon={FileSignature} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          AI Contract{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Simplifier
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Paste any NDA, employment contract, or legal agreement and instantly get a plain English summary, every key clause explained, and red flags rated by risk level — with highlights in the original text.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "Plain English Summary",
            "Key Clauses Explained",
            "Red Flag Detection",
            "Risk Highlighting",
            "High / Medium / Low Severity",
            "NDAs · Employment · Freelance",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="contract-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <ContractSimplifier />
      </div>

      <AdBlock slot="contract-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>Understand Any Legal Contract in Minutes</h2>
        <p>
          Legal contracts are written for lawyers, not for the people signing them. Dense terminology, nested clauses, and passive voice constructions make it genuinely difficult to understand what you're agreeing to. This tool translates the contract into plain English and surfaces the specific phrases that warrant concern — before you sign.
        </p>
        <p>
          Everything runs locally in your browser. Your contract text never touches a server. For NDAs and confidential employment agreements, this matters — sharing your contract with an external AI service could itself be a confidentiality breach.
        </p>

        <h2>Four Views of Your Contract</h2>
        <ul>
          <li><strong>Plain English Summary</strong> — What the contract does, who the parties are, and what obligations it creates. Written for a general audience in 2-3 paragraphs.</li>
          <li><strong>Key Clauses Explained</strong> — The most important sections explained one by one in a single plain sentence each. Termination, payment, IP assignment, governing law, liability caps, non-compete, and more.</li>
          <li><strong>Red Flags</strong> — Provisions that could be unfavorable, rated High / Medium / Low. Each flag shows the exact quoted phrase from the contract and explains why it's a concern.</li>
          <li><strong>Highlighted Contract</strong> — Your original contract text with risk phrases colored inline. Red for high-risk, amber for medium-risk, yellow for low-risk. Hover any highlight to see the risk category.</li>
        </ul>

        <h2>Common Red Flags This Tool Identifies</h2>
        <ul>
          <li>Unlimited liability clauses that expose you to uncapped financial damages</li>
          <li>Perpetual, irrevocable IP licenses that let a company keep your work forever</li>
          <li>Broad non-compete clauses that restrict your ability to work in your field</li>
          <li>Unilateral amendment rights that let one party change the contract without notice</li>
          <li>Automatic renewal clauses that extend the contract indefinitely</li>
          <li>One-sided indemnification requiring you to cover the other party's legal costs</li>
          <li>Overly broad confidentiality definitions that restrict what you can discuss</li>
        </ul>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="contract-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="AI Contract Simplifier"
        toolDescription="Free AI contract simplifier and risk analyzer. Paste any NDA, employment contract, or legal agreement for a plain English summary, key clauses explained, and red flags highlighted by severity. 100% private."
        faqs={FAQS}
      />
    </>
  );
}
