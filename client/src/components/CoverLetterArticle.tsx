import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function CoverLetterArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          Cover Letter Guide: Structure, Tips & Examples
        </h2>

        <ArticleSection title="What is a Cover Letter?">
          <p>A cover letter is a one-page document that accompanies your resume when applying for a job. It introduces you to the hiring manager, explains why you're interested in the position, and highlights the most relevant qualifications that make you a strong candidate.</p>
          <p>Unlike a resume, which lists your experience and skills in a structured format, a cover letter tells your professional story. It connects the dots between your background and the specific role you're applying for.</p>
          <p><strong>Why do cover letters matter?</strong> According to hiring managers, a well-written cover letter can set you apart from other candidates with similar qualifications. It demonstrates your communication skills, enthusiasm for the role, and understanding of the company.</p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Key Insight:</strong> Even when a job posting says a cover letter is "optional," submitting one shows initiative and genuine interest. Many recruiters view it as a differentiator between equally qualified candidates.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Cover Letter Structure & Format">
          <p>A professional cover letter follows a standard business letter format. Here's the structure that hiring managers expect:</p>
          <h4 className="font-bold text-slate-800 mt-4">1. Header</h4>
          <p>Include your full name, email address, phone number, and optionally your LinkedIn profile or portfolio URL. Below that, add the date and the recipient's name, title, and company address if known.</p>
          <h4 className="font-bold text-slate-800 mt-4">2. Salutation</h4>
          <p>Address the hiring manager by name whenever possible. "Dear [Name]," is ideal. If you don't know the name, use "Dear Hiring Manager," — avoid outdated greetings like "To Whom It May Concern."</p>
          <h4 className="font-bold text-slate-800 mt-4">3. Opening Paragraph</h4>
          <p>State the position you're applying for, how you found it, and a compelling hook — a key achievement or reason you're excited about the role.</p>
          <h4 className="font-bold text-slate-800 mt-4">4. Body Paragraphs (1-2)</h4>
          <p>Highlight your most relevant experience, skills, and achievements. Use specific examples and metrics where possible. Connect your qualifications directly to the job requirements.</p>
          <h4 className="font-bold text-slate-800 mt-4">5. Closing Paragraph</h4>
          <p>Restate your enthusiasm, mention your availability for an interview, and include a clear call to action.</p>
          <h4 className="font-bold text-slate-800 mt-4">6. Sign-Off</h4>
          <p>Use a professional closing like "Sincerely," "Best regards," or "Thank you for your consideration," followed by your full name.</p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Ideal Length:</strong> Keep your cover letter between 250-400 words (roughly three-quarters of a page). Hiring managers spend an average of 30-60 seconds reviewing a cover letter, so conciseness is key.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="How to Write Each Section">
          <h4 className="font-bold text-slate-800 mt-2">Opening Paragraph Tips</h4>
          <p>Your opening is your first impression. Avoid generic openings like "I am writing to apply for..." Instead, lead with impact:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Lead with an achievement:</strong> "After increasing quarterly revenue by 35% at [Company], I'm excited to bring my sales expertise to [Target Company]."</li>
            <li><strong>Show genuine interest:</strong> "When I saw [Company]'s recent launch of [product/initiative], I knew my background in [skill] would be a perfect fit."</li>
            <li><strong>Reference a connection:</strong> "After speaking with [Name] about the [Role] position, I'm eager to contribute to your team's mission."</li>
          </ul>

          <h4 className="font-bold text-slate-800 mt-4">Body Paragraphs</h4>
          <p>This is where you prove your value. Use the STAR method (Situation, Task, Action, Result) to structure your examples:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Match 2-3 key requirements from the job description to your experience</li>
            <li>Use specific numbers and metrics: "Managed a $2M budget" or "Led a team of 12"</li>
            <li>Show impact, not just responsibilities: "Reduced customer churn by 20%" beats "Responsible for customer retention"</li>
            <li>Demonstrate knowledge of the company and how you can contribute</li>
          </ul>

          <h4 className="font-bold text-slate-800 mt-4">Closing Paragraph</h4>
          <p>End strong with enthusiasm and a clear next step:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>"I'd welcome the opportunity to discuss how my experience in [skill] can contribute to [Company]'s goals. I'm available for an interview at your convenience."</li>
            <li>"Thank you for considering my application. I look forward to the possibility of contributing to [Company]'s continued success."</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Cover Letter Writing Tips">
          <ul className="space-y-3 text-slate-600">
            <li><strong className="text-slate-800">1. Customize every letter:</strong> Generic cover letters are immediately obvious. Tailor each letter to the specific job and company.</li>
            <li><strong className="text-slate-800">2. Research the company:</strong> Reference specific projects, values, or news about the company to show genuine interest.</li>
            <li><strong className="text-slate-800">3. Mirror the job description language:</strong> Use keywords and phrases from the posting to pass ATS filters and show alignment.</li>
            <li><strong className="text-slate-800">4. Show, don't tell:</strong> Instead of saying "I'm a hard worker," provide an example that demonstrates it.</li>
            <li><strong className="text-slate-800">5. Quantify achievements:</strong> Numbers make your accomplishments concrete and memorable.</li>
            <li><strong className="text-slate-800">6. Keep it concise:</strong> Every sentence should serve a purpose. Cut filler words and redundant phrases.</li>
            <li><strong className="text-slate-800">7. Use active voice:</strong> "I led a team of 8 engineers" is stronger than "A team of 8 engineers was led by me."</li>
            <li><strong className="text-slate-800">8. Proofread meticulously:</strong> A single typo can disqualify you. Read it aloud, use spell-check, and have someone else review it.</li>
            <li><strong className="text-slate-800">9. Address gaps proactively:</strong> If you have an employment gap or are changing careers, briefly address it with a positive spin.</li>
            <li><strong className="text-slate-800">10. Match the company's tone:</strong> A startup may appreciate a conversational tone, while a law firm expects formality.</li>
            <li><strong className="text-slate-800">11. Include a strong subject line:</strong> For email applications, use a clear subject like "[Your Name] - Application for [Position]."</li>
            <li><strong className="text-slate-800">12. End with confidence:</strong> Express genuine enthusiasm without being desperate. Avoid phrases like "I hope to hear from you."</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Common Cover Letter Mistakes">
          <ul className="space-y-3 text-slate-600">
            <li><strong className="text-slate-800">Repeating your resume:</strong> Your cover letter should complement your resume, not duplicate it. Add context and personality to your qualifications.</li>
            <li><strong className="text-slate-800">Using a generic template:</strong> "Dear Sir/Madam, I am writing to express my interest..." signals that you didn't put in the effort to customize.</li>
            <li><strong className="text-slate-800">Focusing on yourself instead of the employer:</strong> Frame your experience in terms of what you can do for the company, not just what you want.</li>
            <li><strong className="text-slate-800">Writing too long:</strong> Anything over one page is too long. Aim for 250-400 words maximum.</li>
            <li><strong className="text-slate-800">Being too humble or too arrogant:</strong> Strike a balance between confidence and humility. Let your achievements speak for themselves.</li>
            <li><strong className="text-slate-800">Neglecting formatting:</strong> Use a clean, professional font (10-12pt), standard margins, and consistent spacing.</li>
            <li><strong className="text-slate-800">Forgetting to proofread:</strong> Spelling errors, wrong company names, or incorrect job titles are instant disqualifiers.</li>
            <li><strong className="text-slate-800">Using clichés:</strong> Avoid overused phrases like "think outside the box," "team player," or "go-getter."</li>
            <li><strong className="text-slate-800">Not including a call to action:</strong> Always end with a clear next step — request an interview or mention follow-up plans.</li>
            <li><strong className="text-slate-800">Wrong company or position name:</strong> Double-check that you've updated the company name and job title if reusing a template.</li>
            <li><strong className="text-slate-800">Salary expectations unprompted:</strong> Don't mention salary unless the job posting specifically asks for it.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="ATS-Friendly Cover Letters">
          <p><strong>What is ATS?</strong> An Applicant Tracking System (ATS) is software that companies use to manage job applications. Before a human ever sees your cover letter, ATS software scans it for relevant keywords and formatting.</p>
          <p><strong>Why it matters:</strong> Up to 75% of applications are rejected by ATS before reaching a hiring manager. An ATS-friendly cover letter dramatically increases your chances of being seen.</p>
          <h4 className="font-bold text-slate-800 mt-4">How to Optimize for ATS</h4>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Use keywords from the job description:</strong> Mirror the exact language used in the posting — if they say "project management," use that phrase, not "managing projects."</li>
            <li><strong>Stick to standard formatting:</strong> Avoid tables, columns, headers/footers, images, or text boxes. Use a simple, single-column layout.</li>
            <li><strong>Use standard section headings:</strong> Keep it simple with a traditional letter format rather than creative layouts.</li>
            <li><strong>Save as .docx or PDF:</strong> These formats are most reliably parsed by ATS systems.</li>
            <li><strong>Include the job title:</strong> Mention the exact position title as listed in the posting.</li>
            <li><strong>Use standard fonts:</strong> Arial, Calibri, Times New Roman, or similar widely-supported fonts.</li>
            <li><strong>Avoid special characters:</strong> Stick to standard punctuation. Fancy bullets or symbols may not parse correctly.</li>
          </ul>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>ATS Tip:</strong> Include both the full term and common abbreviations. For example, use "Search Engine Optimization (SEO)" so the ATS catches both versions.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Cover Letter Examples by Situation">
          <h4 className="font-bold text-slate-800 mt-2">Entry-Level / Recent Graduate</h4>
          <p>When you lack professional experience, focus on:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Relevant coursework, projects, or internships</li>
            <li>Transferable skills from part-time jobs, volunteering, or extracurricular activities</li>
            <li>Academic achievements and relevant certifications</li>
            <li>Enthusiasm and willingness to learn</li>
            <li>How your education prepared you for the role</li>
          </ul>

          <h4 className="font-bold text-slate-800 mt-4">Career Change</h4>
          <p>Transitioning to a new field? Emphasize:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Transferable skills that apply to the new role</li>
            <li>Relevant training, certifications, or self-study</li>
            <li>Your motivation for the career change</li>
            <li>How your unique background brings a fresh perspective</li>
            <li>Any freelance, volunteer, or side-project experience in the new field</li>
          </ul>

          <h4 className="font-bold text-slate-800 mt-4">Remote Job Applications</h4>
          <p>For remote positions, highlight:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Previous remote work experience and self-management skills</li>
            <li>Proficiency with collaboration tools (Slack, Zoom, Asana, etc.)</li>
            <li>Strong written communication abilities</li>
            <li>Time management and ability to work independently</li>
            <li>Your dedicated home office setup and reliable internet</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Cover Letter vs Resume">
          <p>Understanding the difference between these two documents is crucial for a strong application:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <h5 className="font-bold text-sm text-purple-600 mb-2">Cover Letter</h5>
              <ul className="text-sm text-slate-600 space-y-1 list-disc pl-4">
                <li>Narrative format with paragraphs</li>
                <li>Explains why you want this specific role</li>
                <li>Highlights 2-3 most relevant achievements</li>
                <li>Shows personality and communication style</li>
                <li>Customized for each application</li>
                <li>Addresses gaps or career changes</li>
                <li>One page maximum</li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <h5 className="font-bold text-sm text-blue-600 mb-2">Resume</h5>
              <ul className="text-sm text-slate-600 space-y-1 list-disc pl-4">
                <li>Structured format with bullet points</li>
                <li>Comprehensive list of experience and skills</li>
                <li>Covers your full work history</li>
                <li>Factual and data-driven</li>
                <li>Can be partially reused across applications</li>
                <li>Includes education and certifications</li>
                <li>One to two pages typical</li>
              </ul>
            </div>
          </div>
          <p><strong>Think of it this way:</strong> Your resume shows what you've done. Your cover letter explains why it matters for this particular role and company.</p>
        </ArticleSection>

        <div className="mt-10 bg-gradient-primary rounded-2xl p-6 md:p-8 text-center">
          <h3 className="text-xl font-display font-bold text-white mb-2">Ready to Write Your Cover Letter?</h3>
          <p className="text-purple-100 text-sm mb-4">Use the free AI Cover Letter Generator above to create a personalized, ATS-optimized cover letter in seconds.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-purple-700 bg-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-sm"
            data-testid="button-scroll-to-tool"
          >
            Generate My Cover Letter &uarr;
          </button>
        </div>
      </div>
    </section>
  );
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left group"
        data-testid={`button-article-section-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
      >
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-purple-700 transition-colors">{title}</h3>
        <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform shrink-0 ml-4", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 text-slate-600 text-[15px] leading-relaxed space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
