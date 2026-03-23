import { useEffect } from "react";
import { PenLine } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { PersonalStatementGenerator } from "@/components/PersonalStatementGenerator";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";

const FAQS = [
  {
    question: "What types of essays can this tool generate?",
    answer: "Five types: Common App Personal Statement (650 words), UC Application PIQ Essay (350 words), Supplemental Essays (250 words, school-specific prompts for Harvard, Stanford, MIT, Yale, Columbia, Princeton, and UChicago), Graduate School Statement of Purpose (1000 words), and Scholarship Essays (500 words). You can also override the word count for any type.",
  },
  {
    question: "How many versions does it generate?",
    answer: "Two complete versions of your essay, each with a different opening approach. Version 1 opens with an immediate scene or action — putting the reader inside the moment with vivid details. Version 2 opens reflectively — starting from the insight or realization, then building back to the story. You can switch between them and refine each independently.",
  },
  {
    question: "What are the refinement options?",
    answer: "Five refinements you can apply to any version: More Authentic (removes formal language, makes it sound more genuinely like you), Stronger Opening (rewrites only the first paragraph for a more compelling hook), Shorten (cuts about 20% while keeping all key content), More Specific (replaces generic statements with concrete examples and details), and Stronger Ending (rewrites the final paragraph for a more memorable conclusion).",
  },
  {
    question: "What school-specific prompts are available?",
    answer: "For Common App: all 7 official prompts. For UC Application: all 8 Personal Insight Questions. For Supplemental Essays: Harvard, Stanford, MIT, Yale, Columbia, Princeton, UChicago, plus a Custom field where you can paste any prompt. For Graduate School and Scholarships, you describe your goals and the tool generates appropriately.",
  },
  {
    question: "Is my personal information kept private?",
    answer: "Yes — completely. The AI model runs entirely in your browser. Your story, achievements, and personal details never leave your device and are never uploaded, stored, or logged anywhere. This is especially important given the sensitive nature of personal statements.",
  },
  {
    question: "How should I fill in the questionnaire for the best results?",
    answer: "The more specific detail you provide, the better your essay will be. Instead of 'I like science,' write 'I spent three summers interning at a materials science lab, ran experiments on graphene conductivity, and published a paper with my mentor.' Concrete details are what separate good essays from great ones — and what the AI uses to make your essay sound authentically yours.",
  },
  {
    question: "Can I use this for graduate school applications?",
    answer: "Yes. The Graduate School Statement of Purpose mode generates a 1000-word essay that covers your academic background, research interests, career goals, and why you're choosing this field. Fill in your research experience, academic achievements, and specific program interests in the questionnaire for the best results.",
  },
  {
    question: "What makes a strong college personal statement?",
    answer: "Admissions officers read thousands of essays. What stands out: a specific, concrete story (not a vague theme), a clear sense of the applicant's voice and personality, genuine reflection on growth or change, and an authentic perspective the reader hasn't seen before. The weakest essays list accomplishments — the strongest ones reveal character through one focused experience.",
  },
];

export default function PersonalStatementGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Personal Statement Generator — College Essays & SOP | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Free AI personal statement and college essay generator. Common App, UC, supplemental essays, and graduate school SOP. School-specific prompts. Private, no login required.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Personal Statement Generator — College Essays, Common App & Grad School",
      "og:description": "Generate polished college essays and personal statements for Common App, UC, Harvard, Stanford, and more. 2 versions + 5 refinement options. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-personal-statement-generator",
    };

    for (const [name, content] of Object.entries(metaUpdates)) {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("name", name); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
    }
    for (const [property, content] of Object.entries(ogUpdates)) {
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
            "name": "AI Personal Statement Generator",
            "applicationCategory": "EducationApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free AI personal statement and college essay generator for Common App, UC, supplemental essays, and graduate school. 100% private.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Personal Statement Generator" icon={PenLine} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          AI Personal{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Statement Generator
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Answer a guided questionnaire about your story — get two polished college essays with different angles, five refinement options, and school-specific prompts. Your information stays on your device.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "Common App & UC",
            "Harvard / Stanford / MIT",
            "Grad School SOP",
            "2 Versions Generated",
            "5 Refinement Options",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="personal-statement-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <PersonalStatementGenerator />
      </div>

      <AdBlock slot="personal-statement-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>The AI Personal Statement Generator That Sounds Like You</h2>
        <p>
          Most AI essay tools produce generic, interchangeable essays that sound like they were written by a committee. This tool is different: it uses a guided questionnaire to gather the specific details — the real story, the actual growth, the concrete achievements — that make an essay authentically yours. Then it writes two complete versions from different angles so you can choose the approach that resonates most.
        </p>
        <p>
          Your personal information, story, and application details never leave your browser. The AI model runs locally on your GPU, which means no account, no upload, and no risk of your application material being used as training data or stored on a server.
        </p>

        <h2>Five Essay Types Supported</h2>
        <ul>
          <li><strong>Common App Personal Statement</strong> — All 7 official prompts, 650 words. The main essay most colleges require.</li>
          <li><strong>UC Application PIQ</strong> — All 8 Personal Insight Questions, 350 words each. For University of California campuses.</li>
          <li><strong>Supplemental Essays</strong> — School-specific prompts for Harvard, Stanford, MIT, Yale, Columbia, Princeton, UChicago, or any custom prompt you paste in.</li>
          <li><strong>Graduate School Statement of Purpose</strong> — 1000-word academic essay covering research background, interests, and goals.</li>
          <li><strong>Scholarship Essay</strong> — 500-word award essays adaptable to any scholarship prompt.</li>
        </ul>

        <h2>Two Versions, Five Refinements</h2>
        <p>
          The tool generates two complete essays simultaneously — one that opens in the middle of the action (scene-first approach) and one that opens with a reflective insight (idea-first approach). After reading both, you can apply any of five refinements to either version:
        </p>
        <ul>
          <li><strong>More Authentic</strong> — Strips formal language and makes the essay sound like a real student wrote it, not an AI or a counselor.</li>
          <li><strong>Stronger Opening</strong> — Rewrites only the first paragraph to hook the reader immediately.</li>
          <li><strong>Shorten</strong> — Cuts 20% while preserving all key content and meaning.</li>
          <li><strong>More Specific</strong> — Replaces vague claims with concrete details, examples, and sensory language.</li>
          <li><strong>Stronger Ending</strong> — Rewrites the final paragraph to close with insight and forward momentum.</li>
        </ul>

        <h2>What Makes a Great College Essay</h2>
        <p>
          The strongest college essays share several characteristics: they focus on one specific story rather than trying to cover everything, they reveal the applicant's personality and values through action rather than stating them directly, they show genuine self-reflection and growth, and they avoid the clichés that admissions officers see thousands of times ("I have always been passionate about," "since I was a little kid," "this experience changed my life").
        </p>
        <p>
          The questionnaire in this tool is designed to draw out the specifics that separate great essays from average ones. The more concrete detail you provide — names, places, specific moments, real dialogue — the more your essay will stand out.
        </p>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="personal-statement-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="AI Personal Statement Generator"
        toolDescription="Free AI personal statement and college essay generator for Common App, UC, Harvard, Stanford, MIT supplemental essays, and graduate school SOP. 2 versions, 5 refinement options. 100% private."
        faqs={FAQS}
      />
    </>
  );
}
