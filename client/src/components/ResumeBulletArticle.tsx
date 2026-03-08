import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ResumeBulletArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          How to Write Resume Bullet Points That Get Interviews: Complete Guide
        </h2>

        <ArticleSection title="What Makes a Great Resume Bullet Point?">
          <p>A great resume bullet point is not a job description -- it is a proof of impact. Recruiters spend an average of 6-7 seconds scanning a resume, which means every bullet needs to immediately communicate value. The strongest bullets follow a simple formula: start with a power verb, describe what you did, explain how you did it, and quantify the result.</p>
          <h4 className="font-bold text-slate-800 mt-4">The CAR Method</h4>
          <p>CAR stands for Context-Action-Result, a proven framework for structuring resume bullets. Context sets the scene (team size, challenge, scope), Action describes what you specifically did (using strong verbs), and Result shows the measurable outcome. This structure transforms bland responsibilities into compelling achievements that make recruiters take notice.</p>
          <h4 className="font-bold text-slate-800 mt-4">Responsibilities vs. Achievements</h4>
          <p>The biggest mistake job seekers make is listing responsibilities instead of achievements. "Managed social media accounts" tells a recruiter nothing about your impact. "Grew Instagram following by 340% in 6 months, generating 2,400 monthly website visits" proves your value with specific numbers. Always answer the question: "So what happened because I did this?"</p>
        </ArticleSection>

        <ArticleSection title="Power Action Verbs by Experience Level">
          <p>The verb you start with signals your level of contribution and sets the tone for the entire bullet point. Choose verbs that match your experience level and the impression you want to create.</p>
          <h4 className="font-bold text-slate-800 mt-4">Entry-Level Verbs</h4>
          <p>For early-career professionals: Assisted, Coordinated, Contributed, Supported, Organized, Researched, Compiled, Prepared, Collaborated, Documented. These show initiative without overclaiming. Even at entry level, pair these with specific numbers: "Assisted in processing 200+ customer orders daily with 99.5% accuracy rate."</p>
          <h4 className="font-bold text-slate-800 mt-4">Mid-Level Verbs</h4>
          <p>For professionals with 3-5 years: Managed, Led, Developed, Implemented, Optimized, Streamlined, Increased, Reduced, Created, Launched. These demonstrate ownership and direct contribution: "Streamlined onboarding process, reducing new hire ramp-up time from 4 weeks to 10 days."</p>
          <h4 className="font-bold text-slate-800 mt-4">Senior and Executive Verbs</h4>
          <p>For leaders and executives: Spearheaded, Orchestrated, Transformed, Pioneered, Drove, Scaled, Architected, Directed, Established, Championed. These convey strategic vision and organizational impact: "Spearheaded digital transformation initiative across 3 business units, driving $4.2M in annual cost savings."</p>
        </ArticleSection>

        <ArticleSection title="How to Quantify Your Achievements">
          <p>Numbers are the single most powerful element of a resume bullet. They transform vague claims into credible proof. Here are the key categories of metrics to include:</p>
          <h4 className="font-bold text-slate-800 mt-4">Revenue and Financial Impact</h4>
          <p>Dollar amounts generated, saved, or managed: "Generated $1.8M in new business revenue through strategic partnership development." If you do not have exact figures, use reasonable estimates: "Contributed to approximately $500K in cost savings through process improvements."</p>
          <h4 className="font-bold text-slate-800 mt-4">Percentages and Growth</h4>
          <p>Improvement rates, efficiency gains, growth metrics: "Improved customer retention by 23% through implementation of proactive outreach program." Percentages work well when absolute numbers seem small -- "increased team efficiency by 35%" is more impactful than "saved 2 hours per week."</p>
          <h4 className="font-bold text-slate-800 mt-4">Volume and Scale</h4>
          <p>Number of people managed, projects completed, clients served: "Managed portfolio of 45 enterprise accounts representing $12M in annual recurring revenue." Scale shows the scope of your responsibility and helps recruiters understand the complexity of your work.</p>
          <h4 className="font-bold text-slate-800 mt-4">Time and Efficiency</h4>
          <p>Speed improvements, deadlines met, time saved: "Delivered project 3 weeks ahead of schedule, enabling early market entry that captured 15% first-mover advantage." Time metrics demonstrate reliability and efficiency.</p>
        </ArticleSection>

        <ArticleSection title="ATS Optimization for Resume Bullets">
          <p>Applicant Tracking Systems (ATS) scan resumes before a human ever sees them. Up to 75% of resumes are rejected by ATS before reaching a recruiter. Here is how to ensure yours gets through:</p>
          <h4 className="font-bold text-slate-800 mt-4">Keyword Matching</h4>
          <p>Study the job description carefully and mirror its exact language. If the posting says "project management," do not write "managed projects" -- use the exact phrase. Include both spelled-out terms and common abbreviations: "Search Engine Optimization (SEO)" covers both formats.</p>
          <h4 className="font-bold text-slate-800 mt-4">Formatting Rules</h4>
          <p>Avoid special characters, tables, headers, and graphics that ATS cannot parse. Use standard bullet points, consistent formatting, and common section headers. Stick to standard fonts and avoid columns or text boxes that confuse parsing algorithms.</p>
          <h4 className="font-bold text-slate-800 mt-4">Industry-Standard Terminology</h4>
          <p>Use the language of your industry. Technical roles should include specific technologies, frameworks, and methodologies. Business roles should reference recognized frameworks like Six Sigma, Agile, or OKRs. The closer your language matches job postings, the higher your ATS score.</p>
        </ArticleSection>

        <ArticleSection title="Common Resume Bullet Mistakes">
          <p>Even experienced professionals make these errors that weaken their resume:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Starting with "Responsible for":</strong> This passive phrase adds no value. Replace with a strong action verb that shows what you actually accomplished.</li>
            <li><strong className="text-slate-800">Being too vague:</strong> "Improved processes" means nothing without specifics. Which process? By how much? What was the business impact?</li>
            <li><strong className="text-slate-800">Listing duties instead of outcomes:</strong> Employers know what the job involves. They want to know what happened because you did it well.</li>
            <li><strong className="text-slate-800">Using the same verb repeatedly:</strong> Starting every bullet with "Managed" is monotonous. Vary your verbs to showcase different aspects of your capabilities.</li>
            <li><strong className="text-slate-800">Writing bullets that are too long:</strong> Keep bullets to 1-2 lines maximum. Front-load the most important information because recruiters may not read to the end.</li>
            <li><strong className="text-slate-800">Ignoring the target role:</strong> Tailor bullets to match the job you are applying for. Generic bullets that do not connect to the target role get passed over.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Resume Bullets by Industry">
          <p>Different industries value different types of achievements. Tailor your metrics and language accordingly:</p>
          <h4 className="font-bold text-slate-800 mt-4">Technology and Engineering</h4>
          <p>Focus on system performance, code quality, uptime, user adoption, and technical complexity: "Architected microservices platform handling 2M+ daily API requests with 99.99% uptime." Include specific technologies, languages, and frameworks.</p>
          <h4 className="font-bold text-slate-800 mt-4">Marketing and Sales</h4>
          <p>Emphasize revenue, conversion rates, campaign ROI, and growth: "Drove 156% increase in qualified leads through multi-channel content strategy, contributing $3.2M to pipeline." Include channels, tools, and measurable outcomes.</p>
          <h4 className="font-bold text-slate-800 mt-4">Finance and Operations</h4>
          <p>Highlight cost savings, compliance, accuracy, and process efficiency: "Reduced month-end close cycle from 12 to 5 business days while maintaining 100% audit compliance." Precision and risk management metrics matter most.</p>
          <h4 className="font-bold text-slate-800 mt-4">Healthcare and Education</h4>
          <p>Focus on patient outcomes, student achievement, compliance, and service quality: "Implemented patient follow-up protocol that reduced readmission rates by 18% across a 200-bed facility." Regulatory compliance and quality metrics are key.</p>
        </ArticleSection>

        <ArticleSection title="Building Your Complete Resume">
          <p>Individual bullets are powerful, but their arrangement matters too:</p>
          <h4 className="font-bold text-slate-800 mt-4">Order Matters</h4>
          <p>Lead with your strongest, most relevant bullet for each position. Recruiters read from top to bottom and may stop partway through. Your most impressive achievement should always come first.</p>
          <h4 className="font-bold text-slate-800 mt-4">Variety and Balance</h4>
          <p>Mix different types of achievements: quantitative results, leadership examples, technical accomplishments, and cross-functional collaboration. This paints a complete picture of your capabilities rather than appearing one-dimensional.</p>
          <h4 className="font-bold text-slate-800 mt-4">Relevance to Target Role</h4>
          <p>Every bullet should connect to the requirements of the job you want. If the posting emphasizes team leadership, lead with management-focused bullets. If it prioritizes technical skills, frontload your technical achievements. Customize for each application.</p>
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
