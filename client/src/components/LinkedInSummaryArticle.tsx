import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function LinkedInSummaryArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6" data-testid="text-linkedin-summary-article-heading">
          How to Write a LinkedIn About Section That Gets You Hired in 2026 - Complete Guide
        </h2>

        <ArticleSection title="Why Your LinkedIn About Section Matters More Than Ever">
          <p>Your LinkedIn About section is the single most important piece of real estate on your professional profile. With over 1 billion members on the platform and recruiters spending an average of just 7.4 seconds scanning a profile before deciding whether to engage, your summary needs to make an immediate impact. In 2026, the About section has become even more critical as LinkedIn's algorithm increasingly uses it to match candidates with job opportunities and surface profiles in recruiter searches.</p>
          <h4 className="font-bold text-slate-800 mt-4">The First Impression That Opens Doors</h4>
          <p>When a recruiter or hiring manager visits your profile, the About section is typically the first substantial piece of content they read after your headline. Unlike your experience section, which lists roles chronologically, your About section tells your professional story in your own words. It is your chance to contextualize your career, highlight what makes you unique, and communicate your value proposition in a way that resonates with decision-makers. A compelling About section can be the difference between getting a message from a recruiter and being passed over for someone with a similar background but a more engaging profile.</p>
          <h4 className="font-bold text-slate-800 mt-4">Algorithm Visibility and Search Rankings</h4>
          <p>LinkedIn's search algorithm heavily weighs the content in your About section when determining which profiles appear in recruiter searches. The keywords, skills, and industry terminology you include directly affect whether your profile surfaces for relevant opportunities. Profiles with well-optimized About sections consistently rank higher in LinkedIn search results, receive more profile views, and generate more inbound connection requests from recruiters and potential collaborators.</p>
          <h4 className="font-bold text-slate-800 mt-4">Building Trust Before the Conversation</h4>
          <p>Your About section builds trust before you ever speak with a recruiter or potential client. It demonstrates your communication skills, your self-awareness about your professional strengths, and your understanding of your industry. A thoughtful, well-written summary signals professionalism and attention to detail -- qualities that every employer values regardless of the role or industry.</p>
        </ArticleSection>

        <ArticleSection title="What Recruiters Actually Look For in LinkedIn Profiles">
          <p>Understanding what recruiters prioritize when reviewing LinkedIn profiles gives you a significant advantage in crafting your About section. Recruiters evaluate thousands of profiles each week, and they have developed specific patterns for quickly identifying strong candidates. Knowing these patterns allows you to structure your summary to meet their expectations while standing out from the competition.</p>
          <h4 className="font-bold text-slate-800 mt-4">Clear Value Proposition</h4>
          <p>Recruiters want to understand what you do and what value you bring within the first two lines of your About section. They are not looking for vague statements about being a "passionate professional" or "team player." They want specific, quantifiable evidence of your impact: revenue generated, teams managed, projects delivered, or problems solved. The most effective About sections lead with a clear statement of expertise followed by concrete evidence of results.</p>
          <h4 className="font-bold text-slate-800 mt-4">Relevant Keywords and Skills</h4>
          <p>Recruiters use LinkedIn's search functionality to find candidates by entering specific keywords related to the role they are filling. If your About section does not contain the right keywords, you will not appear in these searches regardless of how qualified you are. Include industry-specific terminology, technical skills, certifications, and role-related keywords naturally throughout your summary. The goal is to match the language that recruiters use when searching for candidates like you.</p>
          <h4 className="font-bold text-slate-800 mt-4">Cultural Fit Signals</h4>
          <p>Beyond skills and experience, recruiters assess cultural fit by reading between the lines of your About section. Your tone, writing style, and the values you emphasize all communicate whether you would be a good match for their organization. A startup recruiter might look for entrepreneurial language and risk-taking examples, while a corporate recruiter might prioritize leadership experience and process improvement. Tailoring your tone to your target audience helps recruiters quickly identify you as a potential fit.</p>
        </ArticleSection>

        <ArticleSection title="The Anatomy of a Perfect LinkedIn Summary">
          <p>A high-performing LinkedIn summary follows a specific structure that captures attention, delivers value, and prompts action. While there is room for creativity and personal expression, the most effective summaries share common structural elements that work together to create a compelling professional narrative.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Hook: First Two Lines</h4>
          <p>LinkedIn shows only the first two to three lines of your About section before truncating with a "see more" link. These opening lines are critical -- they must be compelling enough to make readers click to see the full summary. Start with a bold statement, a surprising statistic, a provocative question, or a concise description of your unique professional identity. Avoid starting with "I am a..." and instead lead with your impact or expertise.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Body: Your Professional Story</h4>
          <p>The body of your summary should expand on your opening hook with supporting details. Include your key achievements, the problems you solve, the skills that set you apart, and the trajectory of your career. Use short paragraphs and line breaks for readability. Consider organizing the body around themes: what you have accomplished, what you are passionate about, and what you are looking for next. This structure gives readers a complete picture of who you are professionally.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Call to Action: What Comes Next</h4>
          <p>Every effective About section ends with a clear call to action. Tell readers what you want them to do after reading your summary: connect with you, send you a message, check out your portfolio, or reach out about collaboration opportunities. Without a call to action, even the most compelling summary leaves readers without a clear next step. Make it easy for people to engage with you by explicitly inviting them to take action.</p>
        </ArticleSection>

        <ArticleSection title="LinkedIn Keyword Strategy for Maximum Visibility">
          <p>Keywords are the foundation of LinkedIn search visibility. The platform's algorithm scans your entire profile -- especially your About section -- for relevant terms when matching you with recruiter searches, job recommendations, and content feeds. A strategic approach to keyword placement can dramatically increase your profile views and inbound opportunities.</p>
          <h4 className="font-bold text-slate-800 mt-4">Identifying Your Target Keywords</h4>
          <p>Start by researching the keywords that recruiters in your industry use when searching for candidates. Look at job descriptions for roles you want, note the skills and qualifications mentioned most frequently, and review the profiles of professionals who hold those positions. Pay attention to both technical keywords like specific tools, methodologies, and certifications, and softer keywords like leadership styles and industry expertise. Compile a list of 15 to 20 primary keywords that accurately represent your skills and align with your career goals.</p>
          <h4 className="font-bold text-slate-800 mt-4">Natural Integration</h4>
          <p>The most effective keyword strategy involves weaving your target keywords naturally into your narrative. Rather than listing keywords at the bottom of your summary, incorporate them into sentences that demonstrate your experience. For example, instead of listing "project management, Agile, Scrum," write "I lead cross-functional teams using Agile and Scrum methodologies, delivering complex projects on time and under budget." This approach satisfies the algorithm while creating a readable, engaging summary for human readers.</p>
          <h4 className="font-bold text-slate-800 mt-4">Keyword Density and Placement</h4>
          <p>Place your most important keywords in the first paragraph of your About section, as LinkedIn's algorithm gives extra weight to content that appears early in your profile. Repeat key terms two to three times throughout your summary using natural variations. Avoid keyword stuffing, which makes your summary sound robotic and can actually hurt your profile's performance. The goal is a keyword density that feels organic while ensuring search algorithms can accurately categorize your professional expertise.</p>
        </ArticleSection>

        <ArticleSection title="Writing a Strong Opening Hook That Stops the Scroll">
          <p>The opening of your LinkedIn About section determines whether anyone reads the rest. With the platform's truncation cutting off your summary after just a few lines, your hook must be compelling enough to earn the click. The best opening hooks create curiosity, establish credibility, or make a bold promise that compels readers to learn more about you.</p>
          <h4 className="font-bold text-slate-800 mt-4">Lead with Results</h4>
          <p>One of the most effective opening strategies is leading with your most impressive result. Numbers catch attention and immediately establish credibility: "I have helped 50+ startups raise over $200M in funding" or "My marketing campaigns have generated $15M in pipeline revenue over the past three years." These statements are specific, measurable, and immediately communicate your value. They work because they give the reader a concrete reason to keep reading and learn how you achieved those results.</p>
          <h4 className="font-bold text-slate-800 mt-4">Ask a Provocative Question</h4>
          <p>Questions engage readers by activating their curiosity and creating a mental dialogue. "What if your data infrastructure could predict customer churn 90 days in advance?" or "Why do 73% of digital transformations fail -- and what separates the ones that succeed?" These questions position you as someone who thinks deeply about industry challenges and has insights worth exploring. Follow the question with your answer or perspective to establish yourself as a thought leader in your space.</p>
          <h4 className="font-bold text-slate-800 mt-4">Make a Bold Statement</h4>
          <p>A confident, declarative opening can set you apart from the sea of generic summaries. "I build products that people actually want to use" or "I turn underperforming sales teams into revenue machines." These statements are direct, memorable, and communicate confidence in your abilities. The key is backing up bold claims with evidence in the body of your summary so the opening does not come across as empty bravado.</p>
        </ArticleSection>

        <ArticleSection title="Highlighting Achievements Without Sounding Arrogant">
          <p>One of the biggest challenges in writing a LinkedIn About section is showcasing your accomplishments without coming across as boastful or self-centered. The most effective summaries strike a balance between confidence and humility, presenting achievements in a way that demonstrates value while remaining approachable and authentic.</p>
          <h4 className="font-bold text-slate-800 mt-4">Use the Context-Action-Result Framework</h4>
          <p>Frame your achievements within the context of challenges you faced, actions you took, and results you delivered. Instead of simply stating "I increased revenue by 40%," provide the full picture: "When our company faced declining market share in a saturated industry, I developed and executed a product repositioning strategy that increased revenue by 40% within 18 months." This framework shifts the focus from self-promotion to problem-solving, which is inherently more interesting and less arrogant.</p>
          <h4 className="font-bold text-slate-800 mt-4">Credit Your Team</h4>
          <p>Acknowledging the contributions of your team and collaborators demonstrates leadership and emotional intelligence. Phrases like "I led a team of 12 engineers" or "working closely with cross-functional partners, we achieved" show that you can deliver results through others, which is a highly valued leadership quality. This approach also makes your summary more relatable and shows that you understand the collaborative nature of professional success.</p>
          <h4 className="font-bold text-slate-800 mt-4">Let Numbers Speak</h4>
          <p>Quantifiable achievements speak for themselves and rarely come across as arrogant because they are objective and verifiable. Instead of saying "I am an excellent salesperson," say "I consistently exceeded my quarterly targets by 25% and closed $3.2M in new business in 2025." Numbers transform subjective claims into factual statements that build credibility without requiring the reader to take your word for it. Wherever possible, replace adjectives with metrics to let your results do the talking.</p>
        </ArticleSection>

        <ArticleSection title="Common LinkedIn Summary Mistakes to Avoid">
          <p>Many professionals unknowingly sabotage their LinkedIn presence with About section mistakes that reduce visibility, weaken their personal brand, or fail to engage their target audience. Understanding these common pitfalls helps you craft a summary that avoids them and outperforms the majority of profiles on the platform.</p>
          <h4 className="font-bold text-slate-800 mt-4">Writing in Third Person</h4>
          <p>Writing your About section in third person creates an unnecessary distance between you and your reader. Phrases like "John is a seasoned marketing executive" feel impersonal and outdated compared to the more direct and engaging "I am a marketing executive who..." First person writing creates a conversational tone that builds connection and makes your summary feel like a genuine introduction rather than a formal biography. The only exception is if your industry or seniority level specifically favors third-person profiles, which is increasingly rare.</p>
          <h4 className="font-bold text-slate-800 mt-4">Being Too Vague</h4>
          <p>Generic statements like "I am a results-driven professional with a passion for excellence" say nothing memorable or specific about who you are. Every professional could write this sentence, which means it does nothing to differentiate you. Replace vague language with specific details: what results you drove, which industries you served, what tools and methodologies you used, and what measurable impact you made. Specificity is what transforms a forgettable summary into one that compels action.</p>
          <h4 className="font-bold text-slate-800 mt-4">Neglecting Mobile Formatting</h4>
          <p>Over 60% of LinkedIn traffic comes from mobile devices, yet most professionals format their About sections without considering how they appear on smaller screens. Long, unbroken paragraphs that look acceptable on a desktop become walls of text on mobile. Use short paragraphs of two to three sentences, add line breaks between sections, and front-load the most important information. Test how your summary looks on your phone and adjust until it is scannable and engaging on any device.</p>
          <h4 className="font-bold text-slate-800 mt-4">Leaving It Blank</h4>
          <p>Surprisingly, a significant percentage of LinkedIn users leave their About section completely blank. An empty summary is a missed opportunity that signals disinterest in your professional presence. Even a brief, well-crafted three-sentence summary is infinitely better than nothing. If time is a constraint, our AI LinkedIn Summary Generator can help you create a polished, professional About section in minutes, giving you a strong starting point that you can refine over time.</p>
        </ArticleSection>

        <ArticleSection title="Using AI to Write Your LinkedIn Summary Without Sounding Fake">
          <p>AI writing tools have become invaluable resources for crafting LinkedIn summaries, but using them effectively requires understanding how to maintain authenticity while leveraging their capabilities. The goal is not to replace your voice with AI-generated content, but to use AI as a starting point and creative partner that helps you articulate your professional story more effectively.</p>
          <h4 className="font-bold text-slate-800 mt-4">Start with Your Real Information</h4>
          <p>The most authentic AI-generated summaries begin with genuine, specific inputs. Rather than asking AI to "write a LinkedIn summary for a software engineer," provide your actual role, real achievements, specific skills, and career goals. The more detailed and truthful your inputs, the more personalized and authentic the output will be. Our tool asks for your specific role, experience level, key skills, achievements, and target audience to ensure that every generated summary is uniquely tailored to your professional identity.</p>
          <h4 className="font-bold text-slate-800 mt-4">Edit and Personalize the Output</h4>
          <p>Treat AI-generated content as a first draft, not a final product. Read through each version carefully and look for opportunities to add personal anecdotes, replace generic phrases with industry-specific language, and adjust the tone to match your natural communication style. Add details that only you would know: the specific challenge that sparked your career change, the mentor who shaped your leadership philosophy, or the project that taught you the most. These personal touches transform AI-assisted content into authentically yours.</p>
          <h4 className="font-bold text-slate-800 mt-4">Why Browser-Based AI Tools Are the Best Choice</h4>
          <p>Privacy is a legitimate concern when using AI tools with professional information. Browser-based tools like our LinkedIn Summary Generator process everything locally on your device, meaning your career details, achievements, and professional goals never leave your computer. This is particularly important for executives and professionals in sensitive industries who need to maintain confidentiality while optimizing their LinkedIn presence. You get the benefits of AI-assisted writing without the privacy risks of cloud-based alternatives.</p>
          <h4 className="font-bold text-slate-800 mt-4">Generating Multiple Versions for Testing</h4>
          <p>One of the greatest advantages of AI writing tools is the ability to generate multiple versions of your summary quickly. Our tool creates three distinct versions with different approaches -- allowing you to compare tones, structures, and emphasis points side by side. You can test different versions by updating your LinkedIn summary and monitoring which one generates more profile views, connection requests, and recruiter messages over a two-week period. This data-driven approach takes the guesswork out of optimizing your professional presence.</p>
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
