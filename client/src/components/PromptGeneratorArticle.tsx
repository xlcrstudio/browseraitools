import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function PromptGeneratorArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6" data-testid="text-prompt-generator-article-heading">
          How to Write Perfect AI Prompts in 2026 - Complete Prompt Engineering Guide
        </h2>

        <ArticleSection title="Why Prompt Engineering Is the Most Important AI Skill">
          <p>As AI tools become embedded in every profession and creative discipline, the ability to communicate effectively with large language models has emerged as the single most valuable skill of the decade. Prompt engineering is not just a technical curiosity -- it is the bridge between human intent and machine output, and mastering it determines whether you get mediocre results or extraordinary ones.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Skill Gap Between Casual Users and Power Users</h4>
          <p>Most people interact with AI by typing vague, conversational requests and accepting whatever the model returns. Power users, on the other hand, craft precise, structured prompts that consistently produce high-quality, actionable output. The difference in results between these two groups is staggering. A well-engineered prompt can produce content that rivals professional writers, generate code that compiles on the first run, or analyze data with the rigor of an experienced analyst. The gap is not in the AI itself -- it is in how you communicate with it.</p>
          <h4 className="font-bold text-slate-800 mt-4">Why Every Professional Needs This Skill</h4>
          <p>Whether you are a marketer drafting campaigns, a developer debugging code, a researcher synthesizing literature, or a student writing essays, your ability to prompt AI effectively directly impacts your productivity and output quality. Organizations are beginning to recognize prompt engineering as a core competency, with dedicated roles and training programs emerging across industries. Those who invest in learning prompt engineering now position themselves at the forefront of the AI-augmented workforce.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Compounding Returns of Better Prompts</h4>
          <p>Every improvement in your prompting technique compounds over time. A slightly better prompt template used across hundreds of interactions saves hours of editing, reduces errors, and produces more consistent results. Teams that standardize their prompt engineering practices see measurable improvements in content quality, development speed, and decision-making accuracy. Prompt engineering is not a one-time skill -- it is an ongoing practice that delivers increasing returns as you refine your approach.</p>
        </ArticleSection>

        <ArticleSection title="The Anatomy of a High-Performance Prompt">
          <p>A high-performance prompt is not a random string of instructions. It follows a deliberate structure that gives the AI model everything it needs to produce exactly what you want. Understanding the components of a well-constructed prompt is the foundation of effective prompt engineering.</p>
          <h4 className="font-bold text-slate-800 mt-4">Context Setting and Background Information</h4>
          <p>Every effective prompt begins by establishing context. This includes the domain, the audience, the purpose of the output, and any relevant background information the model needs to generate an appropriate response. Without context, the AI defaults to generic, surface-level output. By providing rich context -- such as industry-specific terminology, target audience demographics, or project constraints -- you guide the model toward responses that are relevant, specific, and immediately useful.</p>
          <h4 className="font-bold text-slate-800 mt-4">Clear Task Definition and Output Format</h4>
          <p>Ambiguity is the enemy of good AI output. The task definition should specify exactly what you want the model to do, using action verbs and measurable criteria. Instead of asking the AI to "write something about marketing," a high-performance prompt would instruct it to "write a 500-word blog introduction targeting SaaS founders, using a conversational tone, with three specific statistics about customer acquisition costs." Specifying the output format -- whether a numbered list, a table, a JSON object, or a narrative paragraph -- eliminates guesswork and ensures the result is immediately actionable.</p>
          <h4 className="font-bold text-slate-800 mt-4">Constraints, Guardrails, and Quality Criteria</h4>
          <p>The best prompts include explicit constraints that prevent common failure modes. These might include word count limits, topics to avoid, tone requirements, factual accuracy standards, or formatting rules. Constraints do not limit the AI -- they focus it. A prompt that says "do not use jargon, keep sentences under 20 words, and include at least one concrete example per paragraph" produces dramatically better output than one that simply asks for "clear writing." Quality criteria give the model a target to aim for, resulting in output that meets your standards on the first attempt.</p>
        </ArticleSection>

        <ArticleSection title="Role-Playing and Persona-Based Prompting">
          <p>One of the most powerful prompt engineering techniques is assigning the AI a specific role or persona. This approach fundamentally changes how the model generates its response, drawing on domain-specific knowledge, vocabulary, and reasoning patterns associated with that role.</p>
          <h4 className="font-bold text-slate-800 mt-4">How Persona Assignment Changes Model Behavior</h4>
          <p>When you tell an AI to "act as a senior data scientist with 15 years of experience in healthcare analytics," the model adjusts its vocabulary, reasoning depth, and level of technical detail accordingly. It draws on patterns associated with expert-level discourse in that domain, producing output that is more sophisticated, nuanced, and authoritative than a generic response. Persona-based prompting effectively narrows the model's vast knowledge base to the subset most relevant to your task, resulting in higher-quality, more focused output.</p>
          <h4 className="font-bold text-slate-800 mt-4">Choosing the Right Persona for Your Task</h4>
          <p>The persona you assign should match the type of output you need. For creative writing, assign a persona of an award-winning author in your target genre. For technical documentation, use a senior technical writer with expertise in your field. For business strategy, adopt the persona of a management consultant at a top firm. The more specific and detailed the persona, the more tailored the output. Including details like years of experience, industry specialization, communication style, and notable achievements all contribute to shaping the response quality.</p>
          <h4 className="font-bold text-slate-800 mt-4">Multi-Persona Prompting for Complex Tasks</h4>
          <p>Advanced prompt engineers use multiple personas within a single interaction to tackle complex problems. You might instruct the AI to first analyze a business problem as a financial analyst, then critique that analysis as a risk manager, and finally synthesize both perspectives as a CEO making a strategic decision. This multi-persona approach produces more balanced, thoroughly considered output that accounts for different viewpoints and catches blind spots that a single-perspective prompt would miss.</p>
        </ArticleSection>

        <ArticleSection title="Chain-of-Thought and Step-by-Step Techniques">
          <p>Chain-of-thought prompting is one of the most significant breakthroughs in prompt engineering. By explicitly asking the AI to show its reasoning process, you dramatically improve the accuracy and reliability of complex outputs, particularly for tasks involving logic, mathematics, analysis, and multi-step problem solving.</p>
          <h4 className="font-bold text-slate-800 mt-4">Why Reasoning Chains Improve Output Quality</h4>
          <p>When an AI model is asked to jump directly to an answer, it often takes shortcuts that lead to errors, especially on complex tasks. Chain-of-thought prompting forces the model to break its reasoning into explicit, sequential steps, which surfaces intermediate conclusions that can be verified. Research has shown that chain-of-thought prompting can improve accuracy on mathematical and logical reasoning tasks by over 30 percent compared to direct-answer prompting. The technique works because it mirrors how humans solve complex problems -- by working through the logic step by step rather than guessing at the final answer.</p>
          <h4 className="font-bold text-slate-800 mt-4">Implementing Step-by-Step Instructions</h4>
          <p>The simplest form of chain-of-thought prompting is adding phrases like "think step by step," "show your reasoning," or "break this down into steps" to your prompt. For more control, you can specify the exact steps you want the model to follow. For example, when asking for a content strategy, you might instruct: "Step 1: Identify the target audience and their pain points. Step 2: List three content themes that address those pain points. Step 3: For each theme, propose two specific content pieces with titles and formats. Step 4: Create a publishing timeline." This structured approach ensures thorough, logical output.</p>
          <h4 className="font-bold text-slate-800 mt-4">Tree-of-Thought and Branching Reasoning</h4>
          <p>Tree-of-thought prompting extends chain-of-thought by asking the model to explore multiple reasoning paths before settling on the best answer. Instead of following a single linear chain, the model evaluates several possible approaches, assesses their merits, and selects the most promising path. This technique is particularly valuable for creative tasks, strategic planning, and any situation where there are multiple valid approaches. By exploring alternatives before committing to a solution, tree-of-thought prompting produces more innovative and thoroughly vetted results.</p>
        </ArticleSection>

        <ArticleSection title="Few-Shot Examples and Structured Output">
          <p>Few-shot prompting is the practice of including example inputs and outputs within your prompt to demonstrate the exact format, style, and quality you expect. This technique is remarkably effective because it shows the model what success looks like rather than just describing it.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Power of Learning by Example</h4>
          <p>Humans learn best by example, and AI models respond similarly. When you include two or three examples of ideal input-output pairs in your prompt, the model extracts patterns from those examples and applies them to your actual request. This is far more effective than trying to describe every nuance of your desired output in words. A single well-chosen example can communicate tone, format, level of detail, and style more clearly than paragraphs of instructions. Few-shot examples are particularly valuable for tasks with specific formatting requirements, domain-specific terminology, or unique stylistic preferences.</p>
          <h4 className="font-bold text-slate-800 mt-4">Designing Effective Example Pairs</h4>
          <p>The quality of your few-shot examples directly determines the quality of the output. Each example should demonstrate a different aspect of your requirements -- one might show the correct tone, another the right level of detail, and a third the proper format. Avoid using examples that are too similar to each other, as this limits the model's understanding of your requirements. Include edge cases in your examples to show the model how to handle unusual inputs. The most effective few-shot prompts typically use two to five examples, with diminishing returns beyond that number.</p>
          <h4 className="font-bold text-slate-800 mt-4">Requesting Structured Output Formats</h4>
          <p>One of the most practical applications of prompt engineering is requesting output in structured formats such as JSON, CSV, markdown tables, or XML. Structured output is immediately parseable by downstream systems, making it invaluable for automation workflows. When requesting structured output, provide a clear schema or template that shows exactly what fields you expect, their data types, and any constraints. Combining structured output requests with few-shot examples creates highly reliable, machine-readable results that can be integrated directly into your tools and workflows without manual reformatting.</p>
        </ArticleSection>

        <ArticleSection title="Prompt Optimization for Different AI Models">
          <p>Not all AI models respond to prompts in the same way. Each model architecture has its own strengths, limitations, and preferred prompting patterns. Understanding these differences allows you to optimize your prompts for the specific model you are using, extracting maximum performance from each platform.</p>
          <h4 className="font-bold text-slate-800 mt-4">Understanding Model-Specific Behaviors</h4>
          <p>Different language models have been trained on different datasets, with different optimization objectives, and with different architectural choices. Some models excel at following complex, multi-step instructions, while others perform better with simpler, more direct prompts. Some models are more creative and prone to generating novel content, while others are more conservative and factual. Learning the characteristics of the models you use regularly -- their context window sizes, their tendencies toward verbosity or conciseness, their strengths in different domains -- allows you to tailor your prompts accordingly.</p>
          <h4 className="font-bold text-slate-800 mt-4">Adapting Prompts Across Platforms</h4>
          <p>A prompt that works brilliantly with one model may produce mediocre results with another. When switching between models, you often need to adjust your prompting style. Some models respond well to system-level instructions, while others perform better when instructions are woven into the user message. Some models handle negative instructions ("do not include...") better than others. Building a library of prompt templates optimized for each model you use saves time and ensures consistent quality across platforms.</p>
          <h4 className="font-bold text-slate-800 mt-4">Browser-Based Models and Privacy Advantages</h4>
          <p>Browser-based AI models, like those used in our prompt generator, offer unique advantages for prompt engineering practice. Because they run entirely on your device, you can experiment freely without concerns about data privacy or API costs. This local processing model is ideal for iterating on sensitive prompts, testing prompt variations rapidly, and developing your prompt engineering skills through hands-on practice. The trade-off in model size is offset by the complete privacy and zero-cost experimentation that browser-based processing provides.</p>
        </ArticleSection>

        <ArticleSection title="Common Prompt Mistakes That Kill Your Results">
          <p>Even experienced AI users make prompt engineering mistakes that significantly degrade their results. Recognizing and avoiding these common pitfalls is often the fastest path to dramatically better AI output.</p>
          <h4 className="font-bold text-slate-800 mt-4">Vague Instructions and Missing Context</h4>
          <p>The most common mistake is providing prompts that are too vague or lack essential context. Asking an AI to "write a blog post about marketing" gives the model almost no useful constraints, resulting in generic, unfocused output. Every prompt should answer the questions: Who is the audience? What is the specific topic? What format should the output take? What tone is appropriate? What length is expected? The more of these questions your prompt answers, the better the output will be. Investing an extra minute in crafting a detailed prompt saves significant time in editing and re-prompting.</p>
          <h4 className="font-bold text-slate-800 mt-4">Overloading a Single Prompt</h4>
          <p>Trying to accomplish too much in a single prompt is a recipe for mediocre results. When you ask the AI to research, analyze, write, format, and optimize all in one request, the quality of each component suffers. Break complex tasks into sequential prompts, where each prompt focuses on one specific step. Use the output of one prompt as input for the next. This sequential approach produces higher-quality results at each stage and gives you the opportunity to review and refine intermediate outputs before proceeding.</p>
          <h4 className="font-bold text-slate-800 mt-4">Ignoring Iterative Refinement</h4>
          <p>Many users treat AI interaction as a one-shot process -- they send a prompt, accept the output, and move on. The best results come from iterative refinement, where you review the initial output, identify what could be improved, and craft follow-up prompts that address specific shortcomings. This conversational approach to prompt engineering treats the AI as a collaborative partner rather than a vending machine. Each iteration builds on the previous output, progressively refining the result until it meets your exact standards.</p>
        </ArticleSection>

        <ArticleSection title="Advanced Prompt Engineering Techniques for 2026">
          <p>The field of prompt engineering continues to evolve rapidly, with new techniques emerging that push the boundaries of what is possible with AI-generated content. These advanced methods represent the cutting edge of human-AI collaboration and offer significant advantages to those who master them.</p>
          <h4 className="font-bold text-slate-800 mt-4">Meta-Prompting and Self-Improving Prompts</h4>
          <p>Meta-prompting involves using the AI to help you write better prompts. You can ask the model to analyze your existing prompt, identify weaknesses, and suggest improvements. This recursive approach creates a feedback loop that rapidly improves prompt quality. Advanced practitioners use meta-prompting to generate entire prompt libraries -- asking the AI to create optimized prompts for specific use cases, complete with variable placeholders, quality criteria, and example outputs. This technique transforms prompt engineering from an art into a systematic, scalable practice.</p>
          <h4 className="font-bold text-slate-800 mt-4">Prompt Chaining and Workflow Automation</h4>
          <p>Prompt chaining connects multiple prompts into automated workflows where the output of one prompt feeds directly into the next. This technique enables complex, multi-stage processes that would be impossible with a single prompt. For example, a content creation chain might start with audience research, flow into topic ideation, then outline generation, followed by draft writing, and finally editing and optimization. Each stage uses a specialized prompt optimized for its specific task, producing results that far exceed what any single prompt could achieve.</p>
          <h4 className="font-bold text-slate-800 mt-4">Constitutional and Self-Evaluating Prompts</h4>
          <p>Constitutional prompting embeds evaluation criteria directly into the prompt, asking the model to generate output and then evaluate its own work against specified standards. The model produces its initial response, critiques it according to your criteria, and then produces an improved version. This self-evaluation loop within a single prompt interaction produces notably higher-quality output because the model actively checks its work against your requirements. As models become more capable, this technique will become increasingly powerful, enabling AI-generated content that consistently meets professional standards without human review cycles.</p>
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
        className="flex items-center justify-between gap-4 w-full text-left group"
        data-testid={`button-article-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
      >
        <h3 className="text-lg md:text-xl font-display font-bold text-slate-800 group-hover:text-purple-700 transition-colors">{title}</h3>
        <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform shrink-0", open && "rotate-180")} />
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
