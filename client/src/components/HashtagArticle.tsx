import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function HashtagArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          How to Use Hashtags: Complete Guide for Instagram, TikTok & More
        </h2>

        <ArticleSection title="Why Hashtags Still Matter in 2025">
          <p>Hashtags remain one of the most effective organic discovery tools across social media platforms. When used strategically, they put your content in front of people who are actively searching for or following specific topics.</p>
          <p>The key shift is that random hashtag usage no longer works. Platforms have gotten smarter about categorizing content, and using irrelevant or spammy hashtags can actually hurt your reach. A strategic, research-backed approach is essential.</p>
          <h4 className="font-bold text-slate-800 mt-4">How Hashtags Drive Growth</h4>
          <p>Hashtags serve three primary functions: discoverability (helping new audiences find you), categorization (telling the algorithm what your content is about), and community building (connecting you with niche audiences). The most successful creators use hashtags to accomplish all three simultaneously.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Volume Mix Strategy</h4>
          <p>The most effective hashtag strategy uses a mix of high-volume (broad reach), medium-volume (sweet spot), and low-volume (targeted niche) hashtags. This gives your content the best chance of ranking in multiple hashtag feeds while still reaching engaged, relevant audiences.</p>
        </ArticleSection>

        <ArticleSection title="Instagram Hashtag Strategy (30 Hashtags)">
          <p>Instagram allows up to 30 hashtags per post, and using all 30 strategically can significantly boost reach. The platform's algorithm uses hashtags to understand and categorize your content.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Ideal Instagram Hashtag Mix</h4>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">3-5 High-Volume (500k-5M posts):</strong> These are broad hashtags that give your content maximum exposure potential. Examples: #fitnessmotivation, #foodporn, #travelphotography</li>
            <li><strong className="text-slate-800">8-12 Medium-Volume (50k-500k posts):</strong> This is the sweet spot where you have the best chance of appearing in top posts. Your content can compete here without being buried instantly.</li>
            <li><strong className="text-slate-800">10-15 Low-Volume (1k-50k posts):</strong> Highly targeted hashtags where you can dominate. These attract the most engaged, relevant followers.</li>
            <li><strong className="text-slate-800">2-3 Community Hashtags:</strong> Hashtags that connect you with specific communities in your niche. These often have highly engaged audiences.</li>
            <li><strong className="text-slate-800">1-2 Branded Hashtags:</strong> Your own branded hashtags that build recognition and encourage user-generated content.</li>
          </ul>
          <h4 className="font-bold text-slate-800 mt-4">Instagram Hashtag Best Practices</h4>
          <p>Place hashtags in the caption or first comment (both work equally well). Rotate your hashtag sets every 3-5 posts to avoid being flagged as spam. Research which hashtags your top competitors use and which ones drive the most engagement in your niche.</p>
        </ArticleSection>

        <ArticleSection title="TikTok Hashtag Strategy (5-8 Hashtags)">
          <p>TikTok's algorithm works differently from Instagram's. Fewer, more targeted hashtags tend to perform better than stuffing the caption with tags. The platform relies heavily on content analysis rather than hashtags alone.</p>
          <h4 className="font-bold text-slate-800 mt-4">TikTok Hashtag Mix</h4>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">1-2 Trending Hashtags:</strong> Current viral or trending tags that can push your content to the For You page.</li>
            <li><strong className="text-slate-800">2-3 Niche Hashtags:</strong> Specific to your content category so TikTok shows it to the right audience.</li>
            <li><strong className="text-slate-800">1-2 Broad Discovery Tags:</strong> Tags like #fyp or #foryou that signal to the algorithm you want broader distribution.</li>
            <li><strong className="text-slate-800">1 Descriptive Hashtag:</strong> A specific tag that describes exactly what your video is about.</li>
          </ul>
          <p>On TikTok, trending sounds and content format matter more than hashtags. Use hashtags to complement your content strategy, not as the primary discovery mechanism.</p>
        </ArticleSection>

        <ArticleSection title="LinkedIn Hashtag Strategy (3-5 Hashtags)">
          <p>LinkedIn is a professional platform where hashtag usage should be minimal and strategic. Using too many hashtags looks unprofessional and can reduce engagement.</p>
          <h4 className="font-bold text-slate-800 mt-4">LinkedIn Best Practices</h4>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">2-3 Industry Hashtags:</strong> Professional, industry-specific tags like #SaaS, #DigitalMarketing, #Leadership</li>
            <li><strong className="text-slate-800">1-2 Topic Hashtags:</strong> Specific to the subject of your post, like #RemoteWork, #AI, #CareerGrowth</li>
          </ul>
          <p>Avoid casual or Instagram-style hashtags on LinkedIn. Stick to professional, widely-followed tags that your target audience is likely following. Place hashtags at the end of your post, not inline.</p>
        </ArticleSection>

        <ArticleSection title="Twitter/X Hashtag Strategy (1-2 Hashtags)">
          <p>Twitter thrives on brevity. One or two well-chosen hashtags outperform tweets stuffed with tags. The platform's character limit and fast-moving feed mean every character counts.</p>
          <p>Use trending hashtags when they're genuinely relevant to your content. Jumping on unrelated trends is transparent and hurts credibility. Create campaign-specific hashtags for events, launches, or ongoing series. Monitor Twitter Trends to find real-time opportunities.</p>
        </ArticleSection>

        <ArticleSection title="Common Hashtag Mistakes to Avoid">
          <p>Even experienced creators make hashtag mistakes that limit their reach:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Using Banned Hashtags:</strong> Platforms shadowban certain hashtags that have been associated with spam or inappropriate content. Using them can tank your reach.</li>
            <li><strong className="text-slate-800">Never Rotating Hashtags:</strong> Using the exact same set of hashtags on every post signals spam behavior to the algorithm.</li>
            <li><strong className="text-slate-800">Only Using High-Volume Tags:</strong> Your content gets buried in seconds when competing against millions of posts.</li>
            <li><strong className="text-slate-800">Irrelevant Hashtags:</strong> Using popular but unrelated hashtags confuses the algorithm and attracts the wrong audience.</li>
            <li><strong className="text-slate-800">Too Many or Too Few:</strong> Each platform has an optimal number. Using too many looks spammy; too few leaves reach on the table.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="How to Track Hashtag Performance">
          <p>Using hashtags without tracking results is like marketing blindfolded. Here's how to measure what's working:</p>
          <h4 className="font-bold text-slate-800 mt-4">Key Metrics to Track</h4>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Impressions from Hashtags:</strong> Instagram Insights shows how many impressions came specifically from hashtags. Track this for every post.</li>
            <li><strong className="text-slate-800">Reach vs. Followers:</strong> If your reach consistently exceeds your follower count, your hashtags are working to attract new audiences.</li>
            <li><strong className="text-slate-800">Engagement Rate by Set:</strong> Compare engagement rates when using different hashtag sets. This reveals which combinations resonate best.</li>
            <li><strong className="text-slate-800">Follower Growth Correlation:</strong> Track which hashtag sets correlate with the most new followers. These are your highest-value tags.</li>
          </ul>
          <p>Build a hashtag library organized by niche and performance. Save your top-performing sets and rotate between them. Over time, you'll develop a data-driven hashtag strategy that consistently delivers results.</p>
        </ArticleSection>

        <ArticleSection title="Building Your Hashtag Library">
          <p>The most efficient approach to hashtag strategy is building a reusable library of tested, proven hashtag sets:</p>
          <h4 className="font-bold text-slate-800 mt-4">Organizing Your Library</h4>
          <p>Create categories based on your content pillars. For a fitness account, you might have sets for workout videos, meal prep, motivation, transformation posts, and educational content. Each category should have 3-5 different hashtag sets that you rotate between.</p>
          <h4 className="font-bold text-slate-800 mt-4">Testing New Hashtags</h4>
          <p>Dedicate 20% of your hashtag slots to testing new tags. Keep the other 80% as proven performers. This way you're always discovering new opportunities without risking your baseline performance. Track which new hashtags earn a permanent spot in your library.</p>
          <p>Our AI Hashtag Generator helps you quickly discover and organize hashtags by volume, category, and platform -- giving you a head start on building your library.</p>
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
