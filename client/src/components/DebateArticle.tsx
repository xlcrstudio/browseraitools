import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function DebateArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-slate-100 mb-6" data-testid="text-debate-article-heading">
          How to Build Strong Debate Arguments: Complete Guide 2026
        </h2>

        <ArticleSection title="What Makes a Strong Debate Argument">
          <p>A strong debate argument combines clear logic, credible evidence, and persuasive delivery into a cohesive claim that is difficult to refute. The foundation of any effective argument rests on three pillars: a specific claim, supporting evidence, and logical reasoning that connects them. Without all three, even passionate arguments crumble under scrutiny.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">The Claim-Evidence-Reasoning Framework</h4>
          <p>Every strong argument begins with a clear, specific claim that directly addresses the debate resolution. Vague or overly broad claims are easy targets for opponents. After stating your claim, present concrete evidence such as statistics, expert opinions, historical examples, or case studies. Finally, explain the reasoning that connects your evidence to your claim, showing why the evidence proves your point rather than assuming the connection is obvious.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Argument Strength Factors</h4>
          <p>The strongest arguments share common characteristics: they are specific rather than general, they anticipate counterarguments, they use credible and verifiable evidence, and they appeal to both logic and values. An argument that only relies on emotional appeal lacks substance, while one that is purely statistical may fail to connect with the audience on a human level. The best arguments blend both approaches strategically.</p>
        </ArticleSection>

        <ArticleSection title="Pro vs Con Argument Balance">
          <p>Effective debate preparation requires understanding both sides of an issue with equal depth and rigor. Even if you are assigned to argue one side, knowing the opposing arguments as well as your own gives you a significant strategic advantage in anticipating attacks and preparing rebuttals.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Why Balance Matters</h4>
          <p>Understanding both perspectives develops critical thinking skills that extend far beyond debate. It helps you evaluate information more objectively, recognize bias in media and arguments, and make better decisions in your personal and professional life. The ability to steelman opposing views, presenting them in their strongest form, is a hallmark of intellectual honesty and rigorous thinking.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Building Equally Strong Cases</h4>
          <p>When preparing arguments, allocate equal time and effort to both sides. For each Pro argument, find a Con argument of comparable strength. This exercise often reveals nuances and complexities that a one-sided analysis would miss. Many debaters find that thoroughly exploring the opposing side actually strengthens their own arguments by helping them address weaknesses proactively.</p>
        </ArticleSection>

        <ArticleSection title="Types of Debate Arguments">
          <p>Arguments in debate generally fall into several categories, each with its own strengths and ideal use cases. Understanding these types helps you construct a well-rounded case that approaches the topic from multiple angles.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Logical Arguments</h4>
          <p>Logical arguments rely on facts, data, statistics, and cause-and-effect reasoning. They are particularly effective in policy debates and when addressing audiences that value empirical evidence. A logical argument might use economic data to show the cost-benefit analysis of a policy, or cite scientific studies to support a claim about environmental impact.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Value-Based Arguments</h4>
          <p>Value arguments appeal to principles, ethics, rights, and moral frameworks. They are central to Lincoln-Douglas style debate and are powerful when the resolution involves a conflict between competing values such as security versus privacy, or individual liberty versus collective welfare. These arguments connect with audiences on a deeper level than pure data.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Practical Arguments</h4>
          <p>Practical arguments focus on real-world feasibility, implementation challenges, and observable outcomes. They ask whether a proposed solution would actually work in practice, considering logistical constraints, economic reality, and human behavior. These arguments are grounded in pragmatism and often cite historical precedents or analogous situations.</p>
        </ArticleSection>

        <ArticleSection title="Using Evidence Effectively">
          <p>Evidence is the backbone of credible argumentation. Without evidence, arguments are merely opinions. However, not all evidence is created equal, and knowing how to select, present, and contextualize evidence is a skill that separates adequate debaters from exceptional ones.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Types of Evidence</h4>
          <p>Statistical evidence provides quantifiable support and is particularly persuasive when it comes from reputable sources. Expert testimony leverages the credibility of recognized authorities. Case studies offer detailed real-world examples that illustrate abstract concepts. Historical precedent shows how similar situations have played out in the past. Each type serves a different purpose, and the most compelling arguments use multiple types of evidence together.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Evaluating Evidence Quality</h4>
          <p>Not all evidence carries equal weight. Consider the source's credibility, the recency of the data, the methodology used in studies, and whether the evidence directly supports the specific claim being made. Be wary of cherry-picked statistics, outdated studies, and evidence taken out of context. Always be prepared to defend the quality and relevance of your evidence when challenged.</p>
        </ArticleSection>

        <ArticleSection title="Common Logical Fallacies to Avoid">
          <p>Logical fallacies are errors in reasoning that undermine the validity of an argument. Recognizing them in your own arguments helps you build stronger cases, and identifying them in opponents' arguments gives you powerful tools for rebuttal.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Straw Man Fallacy</h4>
          <p>A straw man occurs when you misrepresent your opponent's argument to make it easier to attack. Instead of addressing what they actually said, you argue against a distorted version. This is one of the most common fallacies in debate and is easily identified by attentive judges. Always engage with the strongest version of your opponent's argument.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Ad Hominem Attacks</h4>
          <p>Attacking the person making the argument rather than the argument itself is both logically fallacious and poor debate etiquette. Even if an opponent has personal flaws or biases, these do not automatically invalidate their arguments. Focus on the logic and evidence, not the character of the speaker.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">False Dichotomy</h4>
          <p>Presenting only two options when more exist is a false dichotomy. Phrases like "either we do X or everything fails" ignore the many possible alternatives and middle ground solutions. Strong debaters acknowledge complexity and nuance rather than oversimplifying issues into binary choices.</p>
        </ArticleSection>

        <ArticleSection title="Rebuttal Strategies">
          <p>Effective rebuttals are often what separate winning debates from losing ones. A rebuttal does not simply disagree with the opponent but systematically dismantles their argument while reinforcing your own position.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">The Four-Step Rebuttal</h4>
          <p>First, clearly restate the opponent's argument to show you understand it accurately. Second, identify the specific flaw in their reasoning, evidence, or logic. Third, present your counter-evidence or alternative reasoning. Fourth, explain why your position is stronger on this particular point. This structured approach ensures your rebuttal is clear, fair, and devastating.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Turning Arguments</h4>
          <p>One of the most powerful rebuttal techniques is turning your opponent's argument to support your own side. This involves showing that the evidence or logic they present actually leads to a conclusion that favors your position, not theirs. Turns are difficult to execute but extremely impactful when done effectively.</p>
        </ArticleSection>

        <ArticleSection title="Debate Preparation Tips">
          <p>Thorough preparation is the single biggest factor in debate success. No amount of natural speaking ability can compensate for inadequate research and planning.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Research Both Sides</h4>
          <p>Spend equal time researching arguments for and against your position. Read academic papers, news articles, expert opinions, and opposition sources. Take notes on the strongest arguments from each side. Understanding your opponent's best arguments helps you prepare targeted rebuttals and avoid being caught off guard.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Practice Under Pressure</h4>
          <p>Knowing your arguments is different from delivering them effectively under time pressure. Practice speaking your arguments aloud, time yourself, and simulate the pressure of an actual debate. Record yourself and review your performance. Pay attention to clarity, pacing, and confidence. The more you practice, the more natural your delivery becomes.</p>
        </ArticleSection>

        <ArticleSection title="Different Debate Formats Explained">
          <p>Different debate formats emphasize different skills and have distinct structural requirements. Understanding the format you are preparing for helps you tailor your arguments appropriately.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Lincoln-Douglas Debate</h4>
          <p>Lincoln-Douglas debate focuses on values and philosophical frameworks. Debaters argue about competing moral principles, making it ideal for topics involving rights, justice, and ethics. Arguments center on establishing a value premise and criterion for evaluating the resolution. This format rewards philosophical depth and principled reasoning over pure policy analysis.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Policy Debate</h4>
          <p>Policy debate involves detailed analysis of specific plans to change the status quo. Debaters must demonstrate that a problem exists, that their plan solves it, and that the advantages outweigh the disadvantages. This format is evidence-intensive and rewards thorough research, detailed plan writing, and careful cost-benefit analysis.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Parliamentary Debate</h4>
          <p>Parliamentary debate emphasizes impromptu speaking and quick thinking. With limited preparation time, debaters must construct arguments on the spot using their general knowledge. This format rewards breadth of knowledge, adaptability, and persuasive speaking ability over extensive pre-debate research.</p>
        </ArticleSection>

        <ArticleSection title="Critical Thinking Through Debate">
          <p>Debate is one of the most effective tools for developing critical thinking skills. The process of constructing and evaluating arguments trains the mind to think more clearly, identify flaws in reasoning, and consider multiple perspectives before forming conclusions.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Evaluating Claims</h4>
          <p>Through debate practice, you develop the ability to quickly assess whether a claim is supported by evidence, whether the reasoning is sound, and whether alternative explanations exist. This skill transfers directly to evaluating information in everyday life, from news articles to business proposals to personal decisions.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Intellectual Humility</h4>
          <p>Engaging seriously with opposing viewpoints builds intellectual humility, the recognition that your current views might be wrong or incomplete. This openness to revision based on evidence and argument is a hallmark of strong critical thinking and leads to better decision-making in all areas of life.</p>
        </ArticleSection>

        <ArticleSection title="How to Research for Debates">
          <p>Effective debate research goes beyond a quick internet search. It involves systematic information gathering from diverse sources, critical evaluation of evidence quality, and organized note-taking that allows quick access during debates.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Primary vs Secondary Sources</h4>
          <p>Primary sources like original research papers, government data, and firsthand accounts carry more weight than secondary sources like news articles and blog posts. When possible, trace claims back to their original source to verify accuracy and context. This habit not only strengthens your evidence but also protects you from citing information that has been misrepresented in secondary reporting.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Organizing Your Research</h4>
          <p>Create a systematic filing system for your research. Organize evidence by topic, argument, and source type. Include full citations for every piece of evidence so you can quickly verify and reference it during debates. Well-organized research gives you a significant advantage when you need to find specific evidence quickly under time pressure.</p>
        </ArticleSection>
      </div>
    </section>
  );
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        data-testid={`toggle-article-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
      >
        <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-200">{title}</h3>
        <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 text-slate-600 dark:text-slate-300 space-y-3 text-[15px] leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
