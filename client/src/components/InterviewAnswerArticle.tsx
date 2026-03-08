import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function InterviewAnswerArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          How to Answer Interview Questions Using the STAR Method: Complete Guide
        </h2>

        <ArticleSection title="What is the STAR Method?">
          <p>The STAR method is a structured approach to answering behavioral interview questions. STAR stands for Situation, Task, Action, and Result -- four components that help you tell a compelling, organized story about your professional experiences.</p>
          <h4 className="font-bold text-slate-800 mt-4">Why Interviewers Use Behavioral Questions</h4>
          <p>Behavioral questions like "Tell me about a time when..." are based on the premise that past behavior predicts future performance. Interviewers use them to understand how you actually handled situations, not how you think you would handle them hypothetically. This makes your real examples far more valuable than theoretical answers.</p>
          <h4 className="font-bold text-slate-800 mt-4">Why STAR Works</h4>
          <p>Without structure, most people ramble through their answers, burying the key points. The STAR method forces you to organize your thoughts into a clear narrative: set the scene, explain your role, describe your actions, and quantify the results. This structure makes your answer memorable and demonstrates critical thinking.</p>
        </ArticleSection>

        <ArticleSection title="S - Situation: Set the Context">
          <p>The Situation is your opening -- it sets the scene for your story. In 2-3 sentences, explain where you were, what was happening, and why it mattered.</p>
          <h4 className="font-bold text-slate-800 mt-4">What to Include</h4>
          <p>Provide enough context for the interviewer to understand the challenge without over-explaining. Mention your role, the company or team, and the specific circumstances. Include relevant details like timelines, team size, or stakes involved.</p>
          <h4 className="font-bold text-slate-800 mt-4">Common Mistakes</h4>
          <p>Don't spend too long on the setup -- many candidates use half their time on context alone. The situation should take no more than 20% of your answer. Avoid irrelevant details and get to the point quickly. The interviewer wants to hear what you did, not a detailed history of the company.</p>
        </ArticleSection>

        <ArticleSection title="T - Task: Your Responsibility">
          <p>The Task explains what you specifically needed to accomplish. This is where you clarify your individual role and responsibility within the situation.</p>
          <h4 className="font-bold text-slate-800 mt-4">Making It Clear</h4>
          <p>Use "I" statements to establish ownership. Even if you worked on a team, be clear about your specific contribution and accountability. Explain what success looked like and any constraints you were working within. This should be 1-2 sentences -- brief but specific.</p>
          <h4 className="font-bold text-slate-800 mt-4">Why It Matters</h4>
          <p>Interviewers want to understand your scope of responsibility. Were you leading the initiative or contributing as a team member? Were you solving a problem you identified or responding to an assignment? The task section establishes your level of ownership and initiative.</p>
        </ArticleSection>

        <ArticleSection title="A - Action: What You Did">
          <p>The Action section is the heart of your answer -- it should be the most detailed part. This is where you describe the specific steps you took to address the task.</p>
          <h4 className="font-bold text-slate-800 mt-4">Be Specific and Detailed</h4>
          <p>Describe 3-5 concrete actions you took. Explain your reasoning -- why did you choose this approach? What skills, tools, or methods did you use? How did you navigate challenges along the way? This section should demonstrate your capabilities through actions, not claims.</p>
          <h4 className="font-bold text-slate-800 mt-4">Show Your Thinking</h4>
          <p>Don't just list what you did -- explain how you decided to do it. Interviewers value your thought process as much as the outcome. Phrases like "I analyzed the data and realized..." or "After evaluating our options, I chose to..." show analytical thinking and decision-making ability.</p>
        </ArticleSection>

        <ArticleSection title="R - Result: The Outcome">
          <p>The Result is your closer -- it proves your actions made a difference. Quantify your results wherever possible with specific numbers, percentages, or comparisons.</p>
          <h4 className="font-bold text-slate-800 mt-4">Quantify When Possible</h4>
          <p>Numbers make your results concrete and memorable. "Increased sales by 35%" is far more impactful than "improved sales significantly." If you don't have exact numbers, use reasonable estimates with context: "approximately 40% improvement based on our tracking."</p>
          <h4 className="font-bold text-slate-800 mt-4">Include Learning</h4>
          <p>End with what you learned and how it applies going forward. This shows self-awareness and growth mindset -- qualities every employer values. Connect your learning to the role you're interviewing for when possible.</p>
        </ArticleSection>

        <ArticleSection title="Common Interview Questions by Type">
          <p>Different question types require slightly different approaches:</p>
          <h4 className="font-bold text-slate-800 mt-4">Behavioral Questions</h4>
          <p>"Tell me about a time when you dealt with conflict," "Describe a situation where you had to meet a tight deadline," "Give an example of when you showed leadership." These require specific past examples using the full STAR framework. Never answer with a hypothetical -- always use a real experience.</p>
          <h4 className="font-bold text-slate-800 mt-4">Strengths and Weaknesses</h4>
          <p>For strengths, choose one relevant to the role and back it with a STAR example. For weaknesses, choose a genuine area for improvement (not "perfectionism"), explain how you've recognized it, and describe specific steps you're taking to improve. Show self-awareness without undermining your candidacy.</p>
          <h4 className="font-bold text-slate-800 mt-4">"Tell Me About Yourself"</h4>
          <p>Structure as: Present (current role/situation), Past (relevant experience), Future (why this role). Keep it under 2 minutes, focused on professional life, and tailored to the job. This is your elevator pitch, not your life story.</p>
          <h4 className="font-bold text-slate-800 mt-4">"Why Should We Hire You?"</h4>
          <p>Summarize your top 2-3 relevant strengths, connect them to specific company needs, and demonstrate unique value you'd bring. Be confident but not arrogant. Reference specific aspects of the role that align with your experience.</p>
        </ArticleSection>

        <ArticleSection title="Interview Answer Mistakes to Avoid">
          <p>Even well-prepared candidates make these common mistakes:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Being too vague:</strong> "I'm a hard worker" tells the interviewer nothing. Replace vague claims with specific examples and measurable results.</li>
            <li><strong className="text-slate-800">Rambling without structure:</strong> Without STAR, answers meander. Practice keeping each section concise -- Situation (20%), Task (10%), Action (50%), Result (20%).</li>
            <li><strong className="text-slate-800">Not owning your contribution:</strong> Saying "we" throughout without clarifying your specific role. Use "I" for your actions and "we" only when describing team context.</li>
            <li><strong className="text-slate-800">Badmouthing previous employers:</strong> Even if your experience was negative, frame challenges professionally. Focus on what you learned rather than assigning blame.</li>
            <li><strong className="text-slate-800">Memorizing word-for-word:</strong> Rehearsed answers sound robotic. Know your key points and practice delivering them naturally, but don't memorize scripts.</li>
            <li><strong className="text-slate-800">Going over time:</strong> Most interview answers should be 1-2 minutes. Practice with a timer to build awareness of pacing.</li>
            <li><strong className="text-slate-800">Forgetting the result:</strong> Many candidates tell a great story but forget to share the outcome. The result is what makes your answer compelling -- always end strong.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="How to Prepare for Your Interview">
          <p>Systematic preparation dramatically improves performance:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Step 1 -- Research common questions:</strong> Look up typical questions for your role, industry, and experience level. Most interviews draw from a predictable pool of behavioral questions.</li>
            <li><strong className="text-slate-800">Step 2 -- Identify 5-7 key experiences:</strong> Choose versatile examples that showcase different skills. Each should have clear, quantifiable results. These examples can be adapted for multiple questions.</li>
            <li><strong className="text-slate-800">Step 3 -- Structure each using STAR:</strong> Write out the four components for each experience. Focus on making the Action section specific and the Result section quantifiable.</li>
            <li><strong className="text-slate-800">Step 4 -- Practice out loud:</strong> Answering in your head is different from speaking. Practice with a timer, recording yourself, or with a friend who can give feedback.</li>
            <li><strong className="text-slate-800">Step 5 -- Research the company:</strong> Understand their mission, values, recent news, and challenges. Tailor your examples to show how your experience addresses their specific needs.</li>
            <li><strong className="text-slate-800">Step 6 -- Prepare questions to ask:</strong> Having thoughtful questions shows genuine interest. Ask about team culture, growth opportunities, and current challenges the team faces.</li>
          </ul>
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
        <h3 className="text-lg md:text-xl font-display font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
          {title}
        </h3>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-slate-400 transition-transform shrink-0 ml-4",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 text-slate-600 leading-relaxed space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
