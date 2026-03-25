import { useEffect } from "react";
import { EyeOff } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { PiiRedactor } from "@/components/PiiRedactor";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";

const FAQS = [
  {
    question: "What types of PII does this tool detect?",
    answer: "Full names, email addresses, phone numbers, physical and mailing addresses, Social Security Numbers, credit and debit card numbers, dates of birth, IP addresses, website URLs and domains, company and organization names, medical information (conditions, diagnoses, medications), bank account and routing numbers, passport and government ID numbers, and any other personal identifiers.",
  },
  {
    question: "Is my data private? Does any text leave my device?",
    answer: "Yes — completely private. The AI model runs entirely in your browser using WebGPU. Your text is never uploaded to a server, never stored, and never processed by any third party. This makes it safe to scan confidential documents, internal records, and sensitive communications.",
  },
  {
    question: "Can I choose which PII items to redact?",
    answer: "Yes. After scanning, the Detected PII tab shows every identified item with a toggle. You can mask or reveal individual items — for example, keep organization names visible but redact all person names and emails. The Redacted Text view updates instantly as you toggle items.",
  },
  {
    question: "What do the colored placeholder labels mean?",
    answer: "Each PII type gets its own colored label in the redacted text: [NAME] in blue, [EMAIL] in purple, [PHONE] in green, [ADDRESS] in orange, [SSN] and [CREDIT_CARD] in red, [DOB] in indigo, [ORGANIZATION] in amber, and so on. High-sensitivity items (SSN, credit cards, medical data, account numbers) are marked with a red 'HIGH SENSITIVITY' tag in the detected list.",
  },
  {
    question: "What is the word limit?",
    answer: "The tool scans up to 2,000 words of your text. For longer documents, paste sections separately — an amber notice appears if your text exceeds 2,000 words.",
  },
  {
    question: "When should I use this tool?",
    answer: "Before sharing text publicly or with third parties, before pasting content into external AI tools (like ChatGPT), when preparing data for training or testing, when anonymizing customer support tickets or feedback, before publishing case studies or testimonials, and when preparing documents for legal or compliance review.",
  },
  {
    question: "How accurate is the PII detection?",
    answer: "The AI is highly accurate for structured PII like emails, phone numbers, and SSNs. It also recognizes names, addresses, and organizations from context — something simple regex tools cannot do. For critical compliance use cases (GDPR, HIPAA), always review the output manually, as no automated tool provides 100% recall.",
  },
];

export default function PiiRedactorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI PII Redactor — Remove Personal Data Before Sharing | Browser AI Tools";

    const metas: Record<string, string> = {
      description: "Free AI PII redactor. Automatically detect and remove names, emails, phone numbers, SSNs, addresses and more. Color-coded results, per-item toggle, 100% private.",
    };
    const ogs: Record<string, string> = {
      "og:title": "Free AI PII Redactor — Remove Personal Data Before Sharing Text Online",
      "og:description": "Detect and redact all PII from any text. Names, emails, phones, addresses, SSNs, credit cards and more. Color-coded, per-item toggle, 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-pii-redactor",
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
            "name": "AI PII Redactor",
            "applicationCategory": "SecurityApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free AI PII redactor. Detect and remove personal data from any text. 100% private — runs in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI PII Redactor" icon={EyeOff} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          AI PII{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Redactor
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Paste any text and instantly detect and remove personal data — names, emails, phone numbers, addresses, SSNs, and more — before sharing it online or with third-party AI tools.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "Names · Emails · Phones",
            "SSN · Credit Cards · DOB",
            "Addresses · Organizations",
            "Medical · IP · URLs",
            "Per-Item Toggle",
            "Color-Coded Results",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="pii-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <PiiRedactor />
      </div>

      <AdBlock slot="pii-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>Remove Personal Data Before It's Too Late</h2>
        <p>
          Every time you paste text into an external AI tool, a support ticket system, a public forum, or a shared document, you risk exposing personal data. Names, email addresses, phone numbers, and government IDs can be scraped, stored, or used without consent — creating GDPR, HIPAA, or CCPA liability.
        </p>
        <p>
          This tool scans your text with an AI model running entirely in your browser. No data leaves your device. The model identifies 13 categories of PII, replaces each one with a labeled placeholder, and shows you exactly what was found — with per-item toggles to mask or reveal individual entries.
        </p>

        <h2>13 PII Categories Detected</h2>
        <ul>
          <li><strong>[NAME]</strong> — Full names of people, detected from context (not just pattern matching)</li>
          <li><strong>[EMAIL]</strong> — Email addresses in any format</li>
          <li><strong>[PHONE]</strong> — Phone numbers including international formats</li>
          <li><strong>[ADDRESS]</strong> — Physical and mailing addresses</li>
          <li><strong>[SSN]</strong> — Social Security Numbers (US)</li>
          <li><strong>[CREDIT_CARD]</strong> — Credit and debit card numbers</li>
          <li><strong>[DOB]</strong> — Dates of birth</li>
          <li><strong>[IP]</strong> — IPv4 and IPv6 addresses</li>
          <li><strong>[URL]</strong> — Website URLs and domains</li>
          <li><strong>[ORGANIZATION]</strong> — Company and organization names</li>
          <li><strong>[MEDICAL]</strong> — Medical conditions, diagnoses, medications</li>
          <li><strong>[ACCOUNT_NUMBER]</strong> — Bank account and routing numbers</li>
          <li><strong>[ID_NUMBER]</strong> — Passport and government ID numbers</li>
        </ul>

        <h2>When to Use a PII Redactor</h2>
        <ul>
          <li>Before pasting text into ChatGPT, Claude, Gemini, or any external AI tool</li>
          <li>Before sharing customer support tickets, bug reports, or feedback logs with vendors</li>
          <li>When anonymizing data for testing, demos, or development environments</li>
          <li>Before publishing case studies, testimonials, or user research</li>
          <li>When preparing documents for legal review, discovery, or compliance audits</li>
          <li>Before exporting data from CRMs, helpdesks, or databases for analysis</li>
        </ul>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="pii-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="AI PII Redactor"
        toolDescription="Free AI PII redactor. Detect and remove names, emails, phone numbers, SSNs, addresses, credit cards, and more from any text. Color-coded results, per-item toggle. 100% private."
        faqs={FAQS}
      />
    </>
  );
}
