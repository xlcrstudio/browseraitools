import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ATSArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-slate-100 mb-6" data-testid="text-ats-article-heading">
          Best Free AI ATS Resume Matcher 2026 - Get Your Exact Match Score Instantly
        </h2>

        <ArticleSection title="How ATS Systems Work in 2026">
          <p>Applicant Tracking Systems have evolved significantly from simple keyword filters to sophisticated AI-powered screening tools. In 2026, over 98% of Fortune 500 companies and 75% of all employers use ATS software to process job applications before a human recruiter ever sees them. These systems parse your resume, extract structured data, and compare it against the job description to generate a relevance score.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Modern ATS Parsing</h4>
          <p>Current ATS platforms like Workday, Greenhouse, Lever, and iCIMS use natural language processing to understand context beyond simple keyword matching. They analyze job titles, skills, experience duration, education, and certifications. However, they still rely heavily on keyword matching as the primary screening mechanism, which is why optimizing your resume for specific job descriptions remains critical.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">The 75% Rejection Rate</h4>
          <p>Studies consistently show that approximately 75% of resumes are rejected by ATS before reaching a human reviewer. The primary reasons include missing keywords from the job description, incompatible formatting, and lack of relevant skills terminology. Understanding how ATS scoring works gives you a significant advantage over candidates who apply with generic resumes.</p>
        </ArticleSection>

        <ArticleSection title="Why Match Scores Matter for Job Seekers">
          <p>Your ATS match score directly determines whether your resume reaches a recruiter. Most ATS platforms rank candidates by relevance score, and recruiters typically only review the top 10-20% of applicants. A match score below 60% almost guarantees your resume will never be seen by a human.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">The Sweet Spot: 80%+ Match</h4>
          <p>Career experts and ATS consultants consistently recommend targeting an 80% or higher match score for competitive positions. At this threshold, your resume demonstrates strong alignment with the role requirements while still being authentic. Scores above 90% can sometimes appear suspicious to recruiters, suggesting keyword stuffing rather than genuine qualification.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Score Components</h4>
          <p>A comprehensive ATS match score typically comprises three main components: keyword match (how many job-specific terms appear in your resume), skills alignment (technical and soft skills overlap), and experience relevance (how well your work history maps to the role requirements). Each component contributes differently depending on the role and industry.</p>
        </ArticleSection>

        <ArticleSection title="Step-by-Step Resume Optimization Guide">
          <p>Optimizing your resume for ATS is a systematic process that starts with understanding the job description and ends with strategic keyword placement throughout your document.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Step 1: Analyze the Job Description</h4>
          <p>Read the job description carefully and identify required skills, preferred qualifications, key responsibilities, and industry-specific terminology. Pay attention to words and phrases that appear multiple times, as these indicate high-priority requirements. Note both technical skills (Python, SQL, Agile) and soft skills (leadership, communication, problem-solving).</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Step 2: Map Your Experience</h4>
          <p>For each requirement in the job description, identify corresponding experience from your career history. Use the same terminology the job description uses rather than synonyms. If the posting says "project management" do not substitute "project coordination" unless you also include the exact phrase used in the listing.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Step 3: Restructure Your Bullets</h4>
          <p>Rewrite your experience bullets to naturally incorporate missing keywords. Use the CAR format (Challenge, Action, Result) while weaving in relevant terms. Each bullet should demonstrate a specific achievement while including keywords that the ATS will recognize and score positively.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Step 4: Verify and Iterate</h4>
          <p>After making changes, run your updated resume through an ATS matcher again to verify score improvement. Repeat the optimization process until you reach your target score. Focus on the highest-impact missing keywords first, as adding a few critical terms can dramatically improve your overall match percentage.</p>
        </ArticleSection>

        <ArticleSection title="Common ATS Resume Mistakes to Avoid">
          <p>Even well-qualified candidates can be rejected by ATS due to formatting and content mistakes that prevent proper parsing and scoring.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Formatting Issues</h4>
          <p>Headers and footers are often ignored by ATS parsers, so critical information like contact details should appear in the main body. Complex tables, columns, text boxes, and graphics can confuse parsing algorithms. Use simple, clean formatting with standard section headers (Experience, Education, Skills) that ATS systems recognize. Avoid images, logos, and decorative elements that cannot be parsed.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Keyword Mistakes</h4>
          <p>Using acronyms without spelling them out (or vice versa) can cause keyword misses. Include both forms: "Search Engine Optimization (SEO)" covers both versions. Avoid keyword stuffing by hiding white text or cramming unrelated terms into your resume, as modern ATS systems can detect and penalize this practice. Also avoid using creative section titles like "Where I've Made an Impact" instead of "Experience."</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Content Gaps</h4>
          <p>Missing a dedicated Skills section is a common oversight that significantly impacts keyword matching. ATS systems scan this section specifically for technical and role-specific skills. Even if these skills appear in your experience bullets, a standalone Skills section ensures they are properly parsed and counted toward your match score.</p>
        </ArticleSection>

        <ArticleSection title="Keyword Optimization Strategies">
          <p>Strategic keyword placement is the single most effective way to improve your ATS match score. The key is balancing optimization with natural, readable content that also impresses human reviewers.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">High-Impact Placement Areas</h4>
          <p>Skills sections, job titles, and the first bullet point under each role carry the most weight in ATS scoring algorithms. Place your strongest keyword matches in these positions. Your professional summary at the top of the resume is another high-impact area where you can naturally incorporate multiple relevant keywords and phrases from the job description.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Keyword Density</h4>
          <p>The ideal keyword density varies by ATS platform, but as a general rule, important keywords should appear 2-3 times throughout your resume in different contexts. For example, if "project management" is a key requirement, it might appear in your Skills section, in a bullet point describing a specific project you led, and in your professional summary.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Natural Integration</h4>
          <p>Keywords should be woven naturally into achievement-focused sentences rather than listed in isolation. Instead of simply adding "data analysis" to a skills list, write "Performed data analysis on customer behavior datasets, identifying trends that increased retention by 23%." This approach satisfies both ATS algorithms and human readers who value context and impact.</p>
        </ArticleSection>

        <ArticleSection title="Skills Gap Analysis Explained">
          <p>A skills gap analysis compares the technical and soft skills required by a job description against the skills demonstrated in your resume. Understanding these gaps is the first step toward addressing them effectively.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Hard Skills vs Soft Skills</h4>
          <p>Hard skills like programming languages, software tools, certifications, and methodologies are typically easier to identify and address in your resume. Soft skills like leadership, communication, and teamwork are equally important but harder to quantify. The best approach is to demonstrate soft skills through specific examples rather than simply listing them.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Addressing Skill Gaps</h4>
          <p>Not every missing skill requires adding the exact term to your resume. If you genuinely lack a required skill, consider whether you have transferable experience that demonstrates capability. If the gap is significant, mention related experience and consider pursuing certifications or training. Honesty is important because passing ATS is only the first hurdle, and you will need to demonstrate competence in interviews.</p>
        </ArticleSection>

        <ArticleSection title="Industry-Specific ATS Tips">
          <p>Different industries have unique ATS optimization requirements based on the terminology, qualifications, and experience formats their recruiters expect.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Technology and Engineering</h4>
          <p>Tech roles heavily weight specific programming languages, frameworks, cloud platforms, and methodologies. Include exact version numbers and tool names when relevant. For example, "React 18, TypeScript 5, AWS (EC2, S3, Lambda), Docker, Kubernetes, Agile/Scrum" is much more effective than "modern web technologies." List technologies in a dedicated Technical Skills section for maximum ATS visibility.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Healthcare and Medical</h4>
          <p>Medical roles require exact certification names, license numbers, and specific clinical terminology. ATS systems in healthcare are particularly strict about qualifications, so "Registered Nurse (RN), BLS/ACLS certified, Epic EMR proficient" carries significantly more weight than general descriptions of patient care experience.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Finance and Consulting</h4>
          <p>Finance roles emphasize certifications (CFA, CPA, Series 7), specific software (Bloomberg Terminal, SAP, Oracle Financials), and quantifiable achievements. Use exact dollar figures, percentages, and metrics whenever possible, as finance ATS systems are tuned to recognize and prioritize quantitative accomplishments.</p>
        </ArticleSection>

        <ArticleSection title="How This Tool Compares to Paid Alternatives">
          <p>Paid ATS matching tools like Jobscan, Teal, and Skillsyncer offer valuable features, but our free AI ATS Resume Matcher provides comparable analysis with a critical advantage: complete privacy.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Privacy Advantage</h4>
          <p>Most paid tools upload your resume and job descriptions to their servers, creating data profiles and sometimes sharing information with recruiters or third parties. Our tool runs entirely in your browser using WebLLM technology. Your resume content, job descriptions, and match results never leave your device. This makes it safe for confidential job searches where you do not want your current employer to discover you are looking.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Cost Comparison</h4>
          <p>Jobscan charges $50 per month for unlimited scans. Teal charges $29 per month. Skillsyncer is $25 per month. Our tool is completely free with no usage limits, no account required, and no upselling. For job seekers already spending money on courses, certifications, and interview preparation, a free ATS matching tool removes one more financial barrier.</p>
        </ArticleSection>

        <ArticleSection title="Real Before and After Examples">
          <p>The difference between an unoptimized and optimized resume can be dramatic in terms of ATS match scores. Here are typical improvement patterns that users experience.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Software Engineer Example</h4>
          <p>Before optimization: 52% match. The resume used "coding" instead of "software development," listed "AWS" without specific services, and had no mention of "CI/CD" despite extensive deployment experience. After optimization: 87% match. Adding specific AWS services (EC2, Lambda, S3), changing "coding" to "software development and engineering," and adding a bullet about CI/CD pipeline implementation boosted the score by 35 percentage points.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Marketing Manager Example</h4>
          <p>Before optimization: 61% match. The resume emphasized "brand awareness campaigns" but the job description specified "performance marketing" and "growth hacking." After optimization: 84% match. Reframing existing experience using the job description's terminology while adding missing keywords like "attribution modeling" and "customer acquisition cost" significantly improved alignment without fabricating experience.</p>
        </ArticleSection>

        <ArticleSection title="Building an ATS-Optimized Resume from Scratch">
          <p>If you are starting fresh, building your resume with ATS optimization in mind from the beginning saves significant time compared to retrofitting an existing document.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Template Selection</h4>
          <p>Choose a clean, single-column template with standard fonts (Arial, Calibri, Times New Roman, Georgia). Avoid templates with graphics, columns, text boxes, or unusual formatting. Use clearly labeled sections: Professional Summary, Experience, Education, Skills, Certifications. These standard headers are universally recognized by ATS parsers.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Content Strategy</h4>
          <p>Create a master resume with all your experience, skills, and achievements documented in detail. For each application, create a tailored version that emphasizes the keywords and experience most relevant to that specific job description. This modular approach lets you quickly customize your resume while maintaining a comprehensive record of your career history.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">File Format</h4>
          <p>Unless specifically requested otherwise, submit your resume as a PDF. Modern ATS systems parse PDFs accurately, and the format preserves your formatting across devices. If the application system specifically requests a .docx file, submit in that format instead. Avoid .doc (older Word format), .pages, or any other non-standard file types.</p>
        </ArticleSection>

        <ArticleSection title="Future of ATS and AI in Recruitment">
          <p>The recruitment technology landscape is rapidly evolving with AI advancements that are changing how resumes are evaluated and candidates are selected.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">AI-Powered Screening</h4>
          <p>Next-generation ATS platforms are moving beyond keyword matching to semantic understanding. These systems can recognize that "managed a team of 12 engineers" demonstrates "leadership" and "team management" even without those exact phrases. However, explicit keyword matching remains the dominant scoring mechanism in 2026, making optimization tools essential for the foreseeable future.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Skills-Based Hiring</h4>
          <p>The trend toward skills-based hiring means ATS systems are placing increasing weight on demonstrated competencies over traditional qualifications like degree requirements. This shift benefits candidates who can articulate specific, measurable skills and achievements in their resumes, making detailed keyword optimization even more important for career changers and non-traditional candidates.</p>
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
