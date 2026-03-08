import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function EssayWriterArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6" data-testid="text-essay-article-heading">
          Free AI Essay Writer -- Generate Structured, Citation-Ready Essays Privately
        </h2>

        <ArticleSection title="How AI Essay Writing Works">
          <p>AI essay writing leverages advanced language models to transform a topic and set of requirements into a well-structured, coherent essay. Rather than producing a single block of text, our tool breaks the writing process into discrete stages -- just like a skilled human writer would.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Multi-Step Process</h4>
          <p>First, the AI analyzes your topic and generates a thesis statement. Then it builds an outline with logical section flow. Finally, it writes each section individually -- introduction, body paragraphs, and conclusion -- ensuring each part connects to the thesis and supports the overall argument. This section-by-section approach produces far more coherent results than a single-pass generation.</p>
          <h4 className="font-bold text-slate-800 mt-4">Why Local AI Matters</h4>
          <p>Our essay writer runs entirely in your browser using WebLLM. Your topics, arguments, and generated essays never leave your device. This is especially important for academic work where confidentiality matters -- no cloud servers, no data logging, no third-party access to your intellectual work.</p>
        </ArticleSection>

        <ArticleSection title="Choosing the Right Essay Type">
          <p>Different essay types serve different purposes, and selecting the right one is the first step toward effective writing. Each type has its own structure, tone, and rhetorical approach.</p>
          <h4 className="font-bold text-slate-800 mt-4">Argumentative vs. Persuasive</h4>
          <p>Argumentative essays present evidence-based claims and address counterarguments objectively. Persuasive essays, by contrast, aim to convince the reader through emotional appeals and rhetorical techniques alongside evidence. The AI adapts its approach based on which type you select -- using more balanced language for argumentative and more compelling rhetoric for persuasive.</p>
          <h4 className="font-bold text-slate-800 mt-4">Expository, Narrative, and Descriptive</h4>
          <p>Expository essays explain a topic with facts and analysis without taking a position. Narrative essays tell a story with a clear arc and personal reflection. Descriptive essays paint a vivid picture using sensory details and figurative language. Each type calls for a different writing style, and the AI adjusts its vocabulary, sentence structure, and organizational approach accordingly.</p>
          <h4 className="font-bold text-slate-800 mt-4">Compare and Contrast</h4>
          <p>This type examines similarities and differences between two or more subjects. The AI can structure these essays in either block format (all of Subject A, then all of Subject B) or point-by-point format (alternating between subjects for each criterion), depending on what works best for your topic.</p>
        </ArticleSection>

        <ArticleSection title="Academic Level Adaptation">
          <p>An essay written for a high school class looks fundamentally different from one written for a doctoral program. The AI adjusts its output to match the expected sophistication of your academic level.</p>
          <h4 className="font-bold text-slate-800 mt-4">Vocabulary and Complexity</h4>
          <p>At the high school level, the AI uses clear, accessible language and straightforward arguments. College-level essays introduce more nuanced analysis and discipline-specific terminology. University and graduate-level work demands sophisticated argumentation, engagement with scholarly discourse, and precise academic language.</p>
          <h4 className="font-bold text-slate-800 mt-4">Depth of Analysis</h4>
          <p>Higher academic levels require deeper critical thinking. A high school essay might summarize and react to a topic. A master's thesis demands original analysis, synthesis of multiple sources, and contribution to the existing body of knowledge. The AI scales the depth of its analysis to match your selected level.</p>
        </ArticleSection>

        <ArticleSection title="Building Strong Arguments">
          <p>The foundation of any good essay is a clear thesis supported by well-structured arguments. The AI is designed to generate logically sound, evidence-aware content.</p>
          <h4 className="font-bold text-slate-800 mt-4">Thesis Development</h4>
          <p>A strong thesis statement is specific, debatable, and sets the direction for the entire essay. The AI crafts a thesis that directly addresses your topic, takes a clear position (for argumentative and persuasive types), and previews the main points that will be developed in the body paragraphs.</p>
          <h4 className="font-bold text-slate-800 mt-4">Counterarguments and Rebuttals</h4>
          <p>For argumentative and persuasive essays, addressing opposing viewpoints strengthens your position. When the counterarguments option is enabled, the AI includes a section that acknowledges the strongest objections to your thesis and provides reasoned rebuttals, demonstrating critical thinking and intellectual honesty.</p>
        </ArticleSection>

        <ArticleSection title="Citation Styles Explained">
          <p>Proper citation is essential in academic writing. Different disciplines favor different citation formats, and using the wrong one can cost you marks.</p>
          <h4 className="font-bold text-slate-800 mt-4">APA 7th Edition</h4>
          <p>The standard for social sciences, psychology, and education. APA uses author-date in-text citations and a References page. The AI formats in-text citations as (Author, Year) and generates properly structured reference entries.</p>
          <h4 className="font-bold text-slate-800 mt-4">MLA 9th Edition</h4>
          <p>Preferred in humanities, literature, and language studies. MLA uses author-page in-text citations and a Works Cited page. The AI follows the container model for source entries and uses parenthetical page references.</p>
          <h4 className="font-bold text-slate-800 mt-4">Chicago and Harvard</h4>
          <p>Chicago style is common in history and some social sciences, offering both notes-bibliography and author-date systems. Harvard style is widely used in UK and Australian universities. The AI adapts its citation formatting to match whichever style you select, ensuring consistency throughout the essay.</p>
        </ArticleSection>

        <ArticleSection title="Writing with Authenticity">
          <p>AI-generated content should serve as a starting point and learning tool, not a finished product. The best results come from combining AI assistance with your own voice and ideas.</p>
          <h4 className="font-bold text-slate-800 mt-4">Using AI as a Writing Partner</h4>
          <p>Think of the AI essay writer as a brainstorming partner and first-draft generator. It can help you organize your thoughts, identify logical gaps in your arguments, and overcome writer's block. The generated essay gives you a structured foundation that you can then refine with your own insights and experiences.</p>
          <h4 className="font-bold text-slate-800 mt-4">Adding Your Personal Touch</h4>
          <p>After generation, review the essay and inject your own perspective. Replace generic examples with specific ones from your research. Adjust the tone to match your natural writing style. Add personal anecdotes for narrative essays. The outline mode is particularly useful here -- it gives you the structure without the prose, so you write every word yourself.</p>
        </ArticleSection>

        <ArticleSection title="Editing and Refining AI Essays">
          <p>No first draft -- human or AI -- is perfect. Editing is where good writing becomes great writing.</p>
          <h4 className="font-bold text-slate-800 mt-4">Structural Review</h4>
          <p>Start by checking the overall flow. Does each paragraph logically follow the previous one? Does the conclusion effectively synthesize the arguments? Are there any gaps in logic or missing evidence? The AI provides a solid structure, but you may want to reorder paragraphs or add transitional sentences for better coherence.</p>
          <h4 className="font-bold text-slate-800 mt-4">Language and Style Polish</h4>
          <p>Next, focus on sentence-level improvements. Vary sentence length to create rhythm. Replace vague words with precise ones. Eliminate redundancy. Check that the tone is consistent throughout. Finally, proofread for grammar, spelling, and punctuation -- the details that distinguish polished academic writing from rough drafts.</p>
        </ArticleSection>

        <ArticleSection title="Ethics and Academic Integrity">
          <p>Using AI writing tools responsibly is essential, especially in academic settings where intellectual honesty is paramount.</p>
          <h4 className="font-bold text-slate-800 mt-4">Responsible Use Guidelines</h4>
          <p>AI essay writers are best used for learning, brainstorming, and drafting assistance. Use generated essays to understand how arguments are structured, how evidence is organized, and how academic prose flows. Always check your institution's policies on AI tool usage and disclose AI assistance where required.</p>
          <h4 className="font-bold text-slate-800 mt-4">Learning, Not Shortcutting</h4>
          <p>The most valuable use of this tool is educational. Generate an essay on a topic you are studying, then compare it to your own draft. Where does the AI's argument differ from yours? What evidence did it include that you missed? Use it as a study aid and writing coach rather than a replacement for your own critical thinking and learning process.</p>
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
