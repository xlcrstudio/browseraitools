import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function GoalPlannerArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-slate-100 mb-6" data-testid="text-goal-planner-article-heading">
          How to Achieve Any Goal: Complete Planning Guide 2026
        </h2>

        <ArticleSection title="Why Goal Planning Matters">
          <p>Goal planning is the bridge between aspiration and achievement. Research from Harvard Business School found that the 3% of MBA graduates who wrote down clear goals earned ten times more than the remaining 97% combined over a 10-year period. Writing goals down is powerful, but structuring them into actionable plans with milestones and timelines is transformative.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">The Cost of Unstructured Ambition</h4>
          <p>Most people have goals they care deeply about -- advancing their career, getting healthier, building a business, learning new skills. Yet fewer than 10% of people feel they actually achieve their New Year's resolutions, according to research from the University of Scranton. The gap between wanting something and achieving it almost always comes down to planning. Without a structured roadmap, goals remain wishes. You might feel motivated for a few days or weeks, but without clear milestones and weekly actions, motivation fades and old habits reassert themselves.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">The Planning Advantage</h4>
          <p>A well-structured goal plan does several things simultaneously. It breaks an overwhelming ambition into manageable phases. It creates checkpoints where you can celebrate progress and course-correct. It identifies potential obstacles before they derail you. And it provides a daily and weekly answer to the question that stops most people: "What should I do next?" When you know exactly what to do this week, and why it matters in the context of your larger goal, taking action becomes dramatically easier.</p>
        </ArticleSection>

        <ArticleSection title="The Science of Goal Achievement">
          <p>Decades of psychological research have revealed consistent patterns in how humans set and achieve goals. Understanding these patterns can dramatically improve your success rate regardless of what you are trying to accomplish.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Goal-Setting Theory</h4>
          <p>Edwin Locke and Gary Latham's goal-setting theory, developed through over 1,000 studies spanning 35 years, established that specific, challenging goals lead to higher performance than vague or easy goals. Their research shows that clear goals direct attention and effort, energize action, increase persistence, and motivate strategy development. A goal like "run a marathon in under 4 hours by October" activates fundamentally different brain processes than "get in better shape."</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Implementation Intentions</h4>
          <p>Psychologist Peter Gollwitzer's research on implementation intentions demonstrates that planning when, where, and how you will take action roughly doubles your chances of following through. Simply stating "I will study for my certification exam for 45 minutes every weekday morning at 6:30 AM in my home office" is far more effective than "I will study more." AI-generated weekly action plans create these implementation intentions automatically, specifying what needs to happen during each week of your roadmap.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">The Progress Principle</h4>
          <p>Teresa Amabile's research at Harvard Business School revealed that the single most important factor in sustaining motivation is a sense of making progress on meaningful work. Even small wins trigger positive emotions and increased engagement. This is why milestone-based planning is so effective -- each completed milestone provides a tangible marker of progress that fuels continued effort. Without milestones, even substantial progress can feel invisible, leading to discouragement and abandonment.</p>
        </ArticleSection>

        <ArticleSection title="SMART Goals Framework">
          <p>The SMART framework remains one of the most effective tools for goal formulation. Originally developed by George Doran in 1981, it has been refined and validated through decades of practical application in business, education, athletics, and personal development.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Specific: Define What You Actually Want</h4>
          <p>Vague goals produce vague results. "Get better at coding" could mean anything from learning basic HTML to mastering distributed systems. A specific version might be "Build and deploy three full-stack web applications using React and Node.js." Specificity eliminates ambiguity and makes it clear when you have achieved your goal. Our AI goal planner transforms even broadly stated goals into specific, well-defined outcomes with measurable success criteria.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Measurable: Track Progress Quantitatively</h4>
          <p>If you cannot measure it, you cannot manage it. Measurable goals include numbers, percentages, frequencies, or other quantifiable markers. "Increase savings" becomes "save $12,000 over 12 months by setting aside $1,000 per month." Measurable milestones allow you to see exactly where you stand relative to your target and make adjustments if you are falling behind. The progress tracking in our tool provides this measurement automatically.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Achievable, Relevant, and Time-Bound</h4>
          <p>Goals should stretch you without being unrealistic. They should align with your broader life priorities and values. And they must have a deadline. Open-ended goals suffer from perpetual postponement -- there is always tomorrow. A time-bound goal with a clear end date creates urgency and enables backward planning. The AI generates timeframes that match your available hours and current starting point, ensuring your plan is ambitious but realistic.</p>
        </ArticleSection>

        <ArticleSection title="Milestone-Based Planning">
          <p>Milestone-based planning is the engine that converts long-term goals into daily action. Rather than trying to plan every detail of a six-month journey upfront, you define major waypoints and flesh out the immediate next milestone in detail.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Why Milestones Work</h4>
          <p>Milestones create a series of achievable sub-goals within your larger objective. Each milestone represents a meaningful checkpoint -- not just a calendar date, but a concrete achievement that moves you closer to your final goal. Completing milestones triggers the same reward mechanisms in your brain as achieving the final goal, but on a shorter cycle. A six-month goal with five milestones gives you roughly monthly wins to celebrate, maintaining motivation through the long middle stretch where most people give up.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Structuring Effective Milestones</h4>
          <p>Each milestone should have a clear name, a specific timeline, measurable key outcomes, and a list of weekly actions needed to achieve it. The key outcomes tell you what "done" looks like for this phase. Weekly actions break the milestone into bite-sized pieces you can schedule on your calendar. This structure eliminates the common problem of having a plan but not knowing what to do on any given day. You simply look at the current week's actions and execute them.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Adaptive Planning</h4>
          <p>One of the biggest advantages of milestone-based planning is adaptability. Life rarely goes exactly according to plan. When unexpected events derail your week, you can adjust within the current milestone without losing sight of your overall trajectory. If a milestone takes longer than planned, you can compress subsequent milestones or adjust your final deadline. This flexibility prevents the all-or-nothing thinking that causes people to abandon entire plans after a single setback.</p>
        </ArticleSection>

        <ArticleSection title="Overcoming Common Obstacles">
          <p>Every meaningful goal comes with obstacles. The difference between people who achieve their goals and those who don't is not the absence of obstacles but the presence of strategies to handle them. Anticipating obstacles before they occur is one of the most powerful planning techniques available.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Time Constraints</h4>
          <p>The most common obstacle is "not enough time." But time is never really the issue -- it is prioritization. Everyone has the same 168 hours per week. The question is how many of those hours you can realistically dedicate to your goal and how to use those hours most effectively. Our AI asks about your available weekly hours and builds a plan that fits within those constraints, so you never face the discouraging realization that your plan requires more time than you have.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Motivation Dips</h4>
          <p>Motivation is not constant. It fluctuates based on stress, sleep, weather, social feedback, and dozens of other factors. Relying on motivation alone is like trying to power a house with a generator that randomly shuts off. Systems and habits are far more reliable. A structured plan with specific weekly actions reduces dependence on motivation by creating routine. When Tuesday evening is always "work on milestone three, week two tasks," the decision to act is already made.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Fear of Failure</h4>
          <p>Many people avoid setting specific goals because specific goals can be specifically failed. Vague goals feel safer because you can never definitively fail at "get better at something." But this safety is an illusion -- you also can never definitively succeed. The obstacle-solution pairs generated by AI help normalize the possibility of setbacks by pre-planning responses to likely challenges. When you have already decided what you will do if you miss a week or encounter a particular difficulty, failure becomes a temporary detour rather than a dead end.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Resource Limitations</h4>
          <p>Whether it is budget, tools, skills, or connections, resource limitations can feel like insurmountable barriers. Effective planning identifies exactly which resources you need for each phase of your goal, often revealing that many perceived barriers are smaller than they appear. AI-generated resource lists for each milestone help you prepare in advance, spread costs over time, and find alternatives for expensive or hard-to-access resources.</p>
        </ArticleSection>

        <ArticleSection title="The Role of AI in Goal Planning">
          <p>Artificial intelligence brings several unique advantages to the goal planning process that complement human creativity and determination. Understanding what AI does well and where human judgment remains essential helps you get the most from AI-powered planning tools.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Pattern Recognition Across Domains</h4>
          <p>AI models have been trained on vast amounts of information about how goals are achieved across every domain imaginable -- from fitness transformations to business launches, from career transitions to creative projects. This broad knowledge base allows AI to identify common patterns, typical timelines, likely obstacles, and proven strategies that you might not know about from personal experience. It functions like having access to thousands of coaches and mentors simultaneously.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Personalized Roadmap Generation</h4>
          <p>Unlike generic goal-planning templates, AI can tailor your roadmap to your specific situation. Your starting point, available time, budget constraints, and personal preferences all influence the plan that gets generated. Two people with the same goal but different circumstances will receive different plans, with different milestone timelines and different weekly actions. This personalization dramatically increases the likelihood that you will actually follow through, because the plan feels realistic and relevant to your life.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Browser-Based Privacy</h4>
          <p>Our goal planner runs entirely in your browser using WebLLM technology. Your goals, dreams, and personal circumstances never leave your device. There is no account to create, no data uploaded to servers, and no risk of your plans being exposed in a data breach. Whether you are planning a career change, a financial strategy, or a deeply personal goal, your privacy is absolutely guaranteed. The AI model runs locally on your hardware, providing the benefits of artificial intelligence without the privacy costs of cloud-based services.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Iterative Refinement</h4>
          <p>AI-generated plans are starting points, not final answers. You can generate multiple plans with different timeframes, adjust your constraints, and experiment with different levels of detail. Each generation takes seconds rather than the hours manual planning would require. This rapid iteration lets you compare approaches and find the plan structure that resonates most with how you work and think. The best goal plan is one you will actually follow, and having options helps you find that plan faster.</p>
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
        <ChevronDown className={cn("w-5 h-5 text-slate-400 dark:text-slate-500 transition-transform", open && "rotate-180")} />
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
