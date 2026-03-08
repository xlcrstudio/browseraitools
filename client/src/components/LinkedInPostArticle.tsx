import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function LinkedInPostArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          How to Write LinkedIn Posts That Get Engagement: Complete Guide
        </h2>

        <ArticleSection title="Why LinkedIn Posts Matter for Your Career">
          <p>LinkedIn has evolved far beyond a job search platform. With over 900 million professionals, it's the premier platform for building your professional brand, establishing thought leadership, and creating meaningful business connections.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Compound Effect of Posting</h4>
          <p>Consistent LinkedIn posting creates a compound effect. Each post expands your network, establishes credibility, and opens doors to opportunities you didn't know existed. Professionals who post regularly report more inbound opportunities, speaking invitations, and career advancement.</p>
          <h4 className="font-bold text-slate-800 mt-4">Algorithm Rewards Value</h4>
          <p>LinkedIn's algorithm prioritizes content that drives meaningful engagement -- comments, shares, and extended reading time. Unlike other platforms, LinkedIn rewards professional value over entertainment. Posts that teach, inspire, or provoke thoughtful discussion perform best.</p>
        </ArticleSection>

        <ArticleSection title="The Anatomy of a High-Performing LinkedIn Post">
          <p>The best LinkedIn posts follow a consistent structure, even when they appear spontaneous:</p>
          <h4 className="font-bold text-slate-800 mt-4">1. The Hook (First 3 Lines)</h4>
          <p>LinkedIn shows only the first three lines before the "see more" button. These lines must create enough curiosity to make someone stop scrolling and click. Effective hooks include bold statements, surprising statistics, personal failures, or thought-provoking questions.</p>
          <h4 className="font-bold text-slate-800 mt-4">2. The Story/Context</h4>
          <p>Build on your hook with context. Share the personal experience, industry observation, or situation that frames your insight. Keep paragraphs short -- one to three sentences maximum. Use line breaks liberally for scannability.</p>
          <h4 className="font-bold text-slate-800 mt-4">3. The Value/Insight</h4>
          <p>This is your core contribution -- the actionable advice, unique perspective, or lesson learned. Structure this as bullet points, numbered lists, or short paragraphs. Make each point specific and actionable rather than generic.</p>
          <h4 className="font-bold text-slate-800 mt-4">4. The Call-to-Action</h4>
          <p>End with a question or invitation that encourages comments. "What's your experience with this?" or "Share your biggest lesson from [topic]" gives readers a clear way to engage. Specific CTAs outperform generic ones.</p>
          <h4 className="font-bold text-slate-800 mt-4">5. Strategic Hashtags</h4>
          <p>Use 3-5 relevant hashtags at the end. Mix one broad industry tag, one or two medium-reach tags, and one niche tag. More than 5 hashtags can look spammy and may reduce reach.</p>
        </ArticleSection>

        <ArticleSection title="LinkedIn Post Types That Drive Engagement">
          <p>Different post types serve different purposes. The best LinkedIn creators mix these formats:</p>
          <ul className="space-y-3 text-slate-600">
            <li><strong className="text-slate-800">Value/Advice Posts:</strong> Share actionable tips or lessons from your experience. These establish expertise and provide immediate value. Structure as numbered lists or bullet points for scannability.</li>
            <li><strong className="text-slate-800">Story Posts:</strong> Personal or professional narratives with a clear lesson. Vulnerability builds trust -- sharing failures often outperforms sharing successes. Include a beginning, middle, and takeaway.</li>
            <li><strong className="text-slate-800">Insight/Opinion Posts:</strong> Share your perspective on industry trends or challenges. Contrarian views (when thoughtful and backed by experience) drive the most engagement. Position yourself as someone who thinks deeply about your field.</li>
            <li><strong className="text-slate-800">Question Posts:</strong> Ask your network for input on a genuine question. These drive the highest comment rates because they lower the barrier to engagement. Share your own perspective first before asking others.</li>
            <li><strong className="text-slate-800">Announcement Posts:</strong> Career updates, project launches, or milestone celebrations. Add personal context and lessons learned rather than just stating the news.</li>
            <li><strong className="text-slate-800">List Posts:</strong> Numbered or bulleted lists of tips, resources, or observations. These are highly scannable and shareable. Each item should provide standalone value.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Writing Hooks That Stop the Scroll">
          <p>Your hook determines whether anyone reads your post. Here are proven hook formulas for LinkedIn:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">The Failure Hook:</strong> "I made a $50,000 mistake last quarter." -- Specific numbers and admitted failures create irresistible curiosity.</li>
            <li><strong className="text-slate-800">The Counter-Intuitive Hook:</strong> "Stop networking. Seriously." -- Challenging common wisdom immediately grabs attention.</li>
            <li><strong className="text-slate-800">The Lesson Hook:</strong> "After 10 years in marketing, here's what I wish I knew on day one:" -- Experience-based hooks signal valuable insights ahead.</li>
            <li><strong className="text-slate-800">The Question Hook:</strong> "Why do 70% of new managers fail in their first year?" -- Questions that highlight surprising problems drive engagement.</li>
            <li><strong className="text-slate-800">The Bold Statement Hook:</strong> "Most career advice is wrong." -- Provocative claims make people want to read your reasoning.</li>
          </ul>
          <p>The best hooks share two qualities: they create a knowledge gap that can only be filled by reading further, and they promise value worth the reader's time.</p>
        </ArticleSection>

        <ArticleSection title="LinkedIn Formatting Best Practices">
          <p>How you format your post significantly impacts readability and engagement:</p>
          <h4 className="font-bold text-slate-800 mt-4">Line Breaks Are Essential</h4>
          <p>Use single line breaks between thoughts and double line breaks between sections. LinkedIn audiences read on mobile, and dense text blocks get skipped. Each paragraph should be 1-3 sentences maximum.</p>
          <h4 className="font-bold text-slate-800 mt-4">Professional Emoji Usage</h4>
          <p>Use 2-4 emojis strategically throughout your post. Stick to professional options like light bulb, chart, target, or checkmark. Avoid excessive emoji use -- it can undermine your professional credibility.</p>
          <h4 className="font-bold text-slate-800 mt-4">Lists and Bullet Points</h4>
          <p>Use arrows, bullets, or numbers to structure key points. Lists are scannable and help readers extract value quickly. This is especially effective for advice and insight posts.</p>
          <h4 className="font-bold text-slate-800 mt-4">Avoid These Formatting Mistakes</h4>
          <p>Don't include links in the main post body -- LinkedIn deprioritizes posts with external links. Put links in your first comment instead. Don't use walls of text, excessive hashtags, or clickbait hooks that don't deliver on their promise.</p>
        </ArticleSection>

        <ArticleSection title="The LinkedIn Algorithm: What You Need to Know">
          <p>Understanding how LinkedIn distributes content helps you maximize your reach:</p>
          <h4 className="font-bold text-slate-800 mt-4">Early Engagement Is Critical</h4>
          <p>LinkedIn evaluates your post's performance in the first 60-90 minutes. Posts that receive quick comments and meaningful engagement get distributed more widely. This is why posting time and having an engaged network matters.</p>
          <h4 className="font-bold text-slate-800 mt-4">Dwell Time Matters</h4>
          <p>LinkedIn tracks how long people spend reading your post. Longer, value-rich posts that keep readers engaged signal quality content to the algorithm. This doesn't mean every post should be long -- but it should be worth reading.</p>
          <h4 className="font-bold text-slate-800 mt-4">Comments Outweigh Likes</h4>
          <p>A comment is worth significantly more than a like in LinkedIn's algorithm. Posts that drive genuine conversations get distributed to wider audiences. This is why ending with a question is so effective.</p>
          <h4 className="font-bold text-slate-800 mt-4">Best Posting Times</h4>
          <p>Tuesday through Thursday, 8-10am in your audience's timezone tends to perform best. Avoid weekends and late evenings. However, consistency matters more than perfect timing -- find a schedule you can maintain.</p>
        </ArticleSection>

        <ArticleSection title="Building Thought Leadership Through Posts">
          <p>Consistent, valuable posting is the fastest way to build thought leadership on LinkedIn:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Choose Your Niche:</strong> Focus on 2-3 topics you can speak to with authority. Trying to be an expert in everything dilutes your positioning.</li>
            <li><strong className="text-slate-800">Share Original Insights:</strong> Don't just reshare articles. Add your unique perspective, experience, and analysis. Original thinking is what separates thought leaders from content sharers.</li>
            <li><strong className="text-slate-800">Be Vulnerable:</strong> Sharing failures, challenges, and lessons learned builds trust faster than only sharing successes. Professionals connect with authenticity.</li>
            <li><strong className="text-slate-800">Engage With Others:</strong> Comment thoughtfully on others' posts. This builds relationships and increases your visibility. Quality comments can be as valuable as your own posts.</li>
            <li><strong className="text-slate-800">Stay Consistent:</strong> Post 2-4 times per week. Consistency is more important than volume. Your audience will come to expect and look forward to your content.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Common LinkedIn Posting Mistakes">
          <p>Avoid these pitfalls that can hurt your professional brand:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Being Too Promotional:</strong> LinkedIn audiences disengage from constant self-promotion. Follow the 80/20 rule -- 80% value, 20% promotion.</li>
            <li><strong className="text-slate-800">Humble-Bragging:</strong> "So humbled to announce my third promotion this year" fools no one. Be genuine about your achievements without false modesty.</li>
            <li><strong className="text-slate-800">Generic Content:</strong> "Hard work pays off!" adds no value. Share specific insights, experiences, and actionable advice that only you can provide.</li>
            <li><strong className="text-slate-800">Ignoring Comments:</strong> Not responding to comments signals disinterest and hurts your algorithm performance. Engage meaningfully with everyone who takes time to comment.</li>
            <li><strong className="text-slate-800">Inconsistent Posting:</strong> Posting daily for a week then disappearing for a month is worse than posting twice a week consistently. Build a sustainable rhythm.</li>
            <li><strong className="text-slate-800">Links in Post Body:</strong> External links in your post body reduce reach by up to 50%. Put links in your first comment instead.</li>
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
