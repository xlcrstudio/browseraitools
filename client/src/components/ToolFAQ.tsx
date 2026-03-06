import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface FAQItem {
  question: string;
  answer: string;
}

interface ToolFAQProps {
  toolName: string;
  faqs: FAQItem[];
}

export function ToolFAQ({ toolName, faqs }: ToolFAQProps) {
  return (
    <section className="mt-16 mb-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold font-display text-slate-800 mb-2 text-center">
        Frequently Asked Questions
      </h2>
      <p className="text-sm text-slate-400 text-center mb-8">
        Everything you need to know about the {toolName}
      </p>

      <div className="space-y-3" itemScope itemType="https://schema.org/FAQPage">
        {faqs.map((faq, i) => (
          <FAQAccordion key={i} faq={faq} index={i} />
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
}

function FAQAccordion({ faq, index }: { faq: FAQItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="bg-white rounded-xl border border-slate-100 shadow-sm"
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
    >
      <button
        data-testid={`button-faq-${index}`}
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm md:text-base font-semibold text-slate-700" itemProp="name">
          {faq.question}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
            itemScope
            itemProp="acceptedAnswer"
            itemType="https://schema.org/Answer"
          >
            <div className="px-5 pb-4 text-sm text-slate-500 leading-relaxed" itemProp="text">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
