import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ExplainThisArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          Free AI Explainer -- Understand Any Complex Text Privately
        </h2>

        <ArticleSection title="Why Complex Text Is Hard to Understand">
          <p>From dense academic papers to convoluted legal clauses, complex text can feel impenetrable. The problem is rarely a lack of intelligence -- it is a mismatch between the writer's assumed knowledge and the reader's background.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Expertise Curse</h4>
          <p>Experts unconsciously use jargon, nested references, and domain-specific shorthand that make their writing inaccessible to outsiders. A medical journal article presumes years of clinical training; a patent filing assumes familiarity with legal precedent. Without that context, even highly educated readers can struggle.</p>
          <h4 className="font-bold text-slate-800 mt-4">Cognitive Overload</h4>
          <p>When a passage contains too many unfamiliar terms, long sentences, and abstract ideas at once, working memory is overwhelmed. The reader re-reads the same paragraph multiple times, each pass yielding diminishing returns. AI-powered simplification breaks this cycle by translating dense text into manageable, layered explanations.</p>
        </ArticleSection>

        <ArticleSection title="Strategies for Understanding Difficult Material">
          <p>Before reaching for any tool, understanding how experts approach unfamiliar text can dramatically improve comprehension.</p>
          <h4 className="font-bold text-slate-800 mt-4">Chunking and Summarizing</h4>
          <p>Break a long passage into small paragraphs or sentences, then restate each chunk in your own words. This forces active processing rather than passive scanning. Our Explain This tool automates this by generating a step-by-step breakdown of any passage you paste in.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Feynman Technique</h4>
          <p>Named after physicist Richard Feynman, this method asks you to explain a concept as if teaching a child. If you cannot do it simply, you have not truly understood it. The ELI5 mode in our explainer mirrors this technique, forcing the AI to strip away jargon and use everyday language.</p>
        </ArticleSection>

        <ArticleSection title="Academic and Textbook Text">
          <p>Textbooks and scholarly articles are written for peer audiences, making them one of the most common sources of confusion for students, journalists, and curious non-experts.</p>
          <h4 className="font-bold text-slate-800 mt-4">Common Challenges</h4>
          <p>Academic writing features passive voice, hedging language ("it may be suggested that"), citation-heavy sentences, and specialized terminology. A single sentence can reference multiple prior studies, statistical methods, and theoretical frameworks simultaneously.</p>
          <h4 className="font-bold text-slate-800 mt-4">How AI Helps</h4>
          <p>The Simple and Analogy modes transform academic prose into clear, direct language. Key terms are automatically identified and defined, and complex arguments are restructured into logical sequences that build understanding from the ground up.</p>
        </ArticleSection>

        <ArticleSection title="Legal Documents">
          <p>Contracts, terms of service, and regulations are deliberately precise -- but that precision often comes at the cost of readability.</p>
          <h4 className="font-bold text-slate-800 mt-4">Why Legal Language Is Dense</h4>
          <p>Legal documents must anticipate every possible interpretation, which leads to long sentences filled with qualifiers, exceptions, and cross-references. A single clause might contain nested conditions that span an entire paragraph. Latin phrases, archaic terms, and boilerplate language add further barriers.</p>
          <h4 className="font-bold text-slate-800 mt-4">Practical Implications</h4>
          <p>Understanding what a contract actually says before you sign it is critical. Our tool can break down legal language into plain-English summaries, highlight key obligations and rights, and flag unusual clauses. While it is not a substitute for legal advice, it helps you ask better questions when consulting a lawyer.</p>
        </ArticleSection>

        <ArticleSection title="Medical Information">
          <p>Health literacy is a growing concern. Patients routinely receive test results, prescriptions, and discharge instructions written in clinical shorthand they cannot parse.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Stakes of Misunderstanding</h4>
          <p>Misreading a lab report or misunderstanding medication instructions can have serious consequences. Medical text is packed with abbreviations, Latin-derived terminology, and measurement units unfamiliar to most people. Even well-educated patients may struggle with a radiology report or pathology summary.</p>
          <h4 className="font-bold text-slate-800 mt-4">Empowering Patients</h4>
          <p>Using the Simple or ELI5 mode with the medical subject area, our tool translates clinical language into everyday terms. It defines medical abbreviations, explains what test values mean in context, and clarifies treatment recommendations. This helps patients have more informed conversations with their healthcare providers.</p>
        </ArticleSection>

        <ArticleSection title="Technical Documentation">
          <p>Software documentation, engineering specs, and API references serve a critical function but are notoriously difficult to follow for newcomers.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Documentation Problem</h4>
          <p>Technical docs are often written by the same engineers who built the system, embedding assumptions about prior knowledge, toolchain familiarity, and architectural context. Error messages, configuration files, and code comments can be equally cryptic.</p>
          <h4 className="font-bold text-slate-800 mt-4">Step-by-Step Clarity</h4>
          <p>The Step-by-Step mode excels with technical content, breaking procedures into numbered actions with clear prerequisites. The Technical mode preserves precision while reorganizing information for better flow. Combined with automatic term definitions, even unfamiliar frameworks and protocols become approachable.</p>
        </ArticleSection>

        <ArticleSection title="The Power of Analogies">
          <p>Analogies are one of the most effective tools for learning. They map unfamiliar concepts onto familiar ones, creating mental bridges that accelerate understanding.</p>
          <h4 className="font-bold text-slate-800 mt-4">Why Analogies Work</h4>
          <p>Cognitive science shows that the brain learns best by connecting new information to existing knowledge. Analogies exploit this by borrowing the structure of something you already understand. "DNA is like a blueprint" or "the immune system is like an army" are simple examples, but effective analogies can be far more nuanced.</p>
          <h4 className="font-bold text-slate-800 mt-4">AI-Generated Analogies</h4>
          <p>Our Analogy mode generates creative, context-appropriate comparisons for any concept. It considers the subject area and reading level to craft analogies that resonate. For a medical topic, it might compare cellular processes to factory assembly lines. For a legal concept, it might draw parallels to everyday agreements and negotiations.</p>
        </ArticleSection>

        <ArticleSection title="Tools and Techniques for Lifelong Learning">
          <p>Building strong comprehension skills is a lifelong endeavor. AI tools are one part of a broader toolkit for continuous learning.</p>
          <h4 className="font-bold text-slate-800 mt-4">Active Reading Habits</h4>
          <p>Highlight, annotate, and question as you read. Use our tool to check your understanding by comparing your interpretation with the AI's explanation. Over time, you will find that you need the tool less frequently as your domain vocabulary and pattern recognition improve.</p>
          <h4 className="font-bold text-slate-800 mt-4">Adjusting Complexity Gradually</h4>
          <p>Start with a simpler explanation and gradually increase the reading level. Our adjustable reading level slider -- from Grade 5 to PhD level -- lets you scaffold your understanding. Begin with an ELI5 overview, then re-read the original text with fresh context, and finally explore the Academic mode for deeper nuance.</p>
        </ArticleSection>
      </div>
    </section>
  );
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left group"
        data-testid={`button-article-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
      >
        <h3 className="text-lg md:text-xl font-display font-bold text-slate-800 group-hover:text-purple-700 transition-colors">{title}</h3>
        <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform shrink-0 ml-4", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
            <div className="pt-4 text-slate-600 leading-relaxed space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
