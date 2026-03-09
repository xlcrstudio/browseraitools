import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function YTDescArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-slate-100 mb-6" data-testid="text-yt-desc-article-heading">
          How to Write YouTube Descriptions That Get Views: Complete 2026 Guide
        </h2>

        <ArticleSection title="Why YouTube Descriptions Matter for SEO">
          <p>YouTube descriptions are far more than simple video summaries. They serve as one of the most powerful SEO tools available to content creators. A well-optimized description can help your video rank higher in YouTube search, appear in Google search results, increase click-through rates, and drive meaningful engagement. YouTube's algorithm uses description text to understand what your video is about, making it a critical factor in how your content gets discovered and recommended.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">The First 150 Characters Are Critical</h4>
          <p>YouTube only displays the first 150 characters of your description in search results and the collapsed view on your video page. This means your opening lines need to accomplish three things simultaneously: include your primary keyword, hook the viewer's attention, and communicate the video's value proposition. Most creators waste this valuable real estate with generic phrases like "In this video I'll show you..." when they could be writing compelling hooks that drive clicks.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">How YouTube's Algorithm Uses Descriptions</h4>
          <p>YouTube's natural language processing has become remarkably sophisticated. The algorithm analyzes your description to understand the topic, context, and relevance of your video. It uses this information alongside other signals like watch time, engagement, and click-through rate to determine where and how often to recommend your content. A keyword-rich description that naturally integrates relevant search terms can significantly boost your video's visibility across YouTube search, suggested videos, and the homepage feed.</p>
        </ArticleSection>

        <ArticleSection title="Anatomy of a Perfect YouTube Description">
          <p>The most effective YouTube descriptions follow a proven structure that balances SEO optimization with viewer engagement. Understanding each component and its purpose allows you to create descriptions that serve both the algorithm and your audience.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">The Hook: Opening Lines That Convert</h4>
          <p>Your first two to three lines are the most important part of your entire description. They appear in search results, on the video page before the "Show more" click, and in social media previews. Effective hooks use patterns like "Discover the [number] best [topic] that [benefit]" or "Want to [achieve goal]? Here are [number] proven [methods]." These formulas work because they promise specific value and create curiosity without being misleading.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Value Proposition and Content Overview</h4>
          <p>After the hook, provide a clear overview of what viewers will learn or experience. Use bullet points with emoji markers for easy scanning. List four to eight key topics covered in the video, incorporating secondary keywords naturally. This section helps viewers decide whether to watch while simultaneously providing the algorithm with additional context about your content.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Timestamps: The Engagement Multiplier</h4>
          <p>Timestamps serve multiple purposes. They improve viewer experience by allowing easy navigation, increase watch time by helping viewers find relevant sections quickly, and appear as chapters in YouTube's interface. YouTube also uses timestamps to better understand your content structure. Always start with 00:00 and use descriptive labels that include relevant keywords when appropriate.</p>
        </ArticleSection>

        <ArticleSection title="Keyword Strategy for YouTube Descriptions">
          <p>Effective keyword integration is the foundation of YouTube description SEO. The goal is to include your target keywords naturally throughout the description without resorting to keyword stuffing, which can actually hurt your ranking.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Primary Keyword Placement</h4>
          <p>Your primary keyword should appear in the first sentence of your description. This signals to YouTube what your video is primarily about. Use the keyword again two to three times throughout the rest of the description, varying the phrasing slightly each time. For example, if your primary keyword is "productivity tools," you might also use "tools for productivity," "productive workflow," or "productivity software."</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Secondary and Long-Tail Keywords</h4>
          <p>Beyond your primary keyword, include eight to fifteen related terms and long-tail variations. These help your video appear in a wider range of searches. For a video about "best AI tools," secondary keywords might include "artificial intelligence software," "AI productivity apps," "machine learning tools," and "AI tools for beginners." AI description generators excel at identifying and naturally integrating these secondary keywords.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Avoiding Keyword Stuffing</h4>
          <p>YouTube's algorithm can detect and penalize keyword stuffing. The key is natural integration where keywords flow within useful, readable sentences. If a sentence reads awkwardly because of a forced keyword, rewrite it. Your description should provide genuine value to viewers who actually read it, not just serve as a keyword dump for the algorithm.</p>
        </ArticleSection>

        <ArticleSection title="Hashtag Strategy That Works">
          <p>YouTube hashtags serve a specific purpose in discoverability. When used correctly, they can expose your content to viewers browsing specific topics. However, improper hashtag use can actually harm your video's performance.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">The Sweet Spot: 8-15 Hashtags</h4>
          <p>Research consistently shows that eight to fifteen hashtags is the optimal range for YouTube descriptions. Fewer than eight limits your discoverability, while more than fifteen can be flagged as spam. The first three hashtags you include will appear above your video title, making them especially important for visibility and branding.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Mixing Broad and Niche Tags</h4>
          <p>An effective hashtag strategy combines broad, high-volume tags with specific, niche tags. Broad tags like #YouTube or #tutorial expose your content to large audiences, while niche tags like #AIproductivity or #codingbeginner target viewers who are more likely to engage deeply with your content. Include at least one branded hashtag for your channel to build searchable brand recognition over time.</p>
        </ArticleSection>

        <ArticleSection title="Calls-to-Action That Drive Engagement">
          <p>Strategic calls-to-action within your description can significantly impact your channel's growth metrics. The key is making CTAs specific, benefit-focused, and natural rather than pushy or generic.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Subscribe CTAs</h4>
          <p>Rather than a generic "subscribe to my channel," frame your subscribe CTA around the value the viewer will receive. "Subscribe for weekly AI and productivity tips" tells the viewer exactly what they will get and how often. Including the content frequency and topic sets clear expectations and attracts subscribers who are genuinely interested in your niche.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Comment-Driving CTAs</h4>
          <p>Comments are one of the strongest engagement signals for YouTube's algorithm. Ask specific questions that are easy to answer. "Which of these 10 tools are you most excited to try?" is far more effective than "Let me know what you think in the comments." Specific questions lower the barrier to commenting and generate more meaningful engagement.</p>
        </ArticleSection>

        <ArticleSection title="Description Length Optimization">
          <p>The ideal description length depends on your video type, content complexity, and audience expectations. There is no single correct length, but understanding when to use each approach helps you optimize effectively.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Short Descriptions (100-150 Words)</h4>
          <p>Best for shorter videos under ten minutes, simple content, and mobile-first audiences. Short descriptions focus on the essential hook, a few key points, and a CTA. They work well for entertainment content, quick tips, and news commentary where viewers want to get straight to the point.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Standard Descriptions (200-300 Words)</h4>
          <p>The most versatile option that works for most video types. Standard descriptions include all key elements: hook, value proposition, content overview, timestamps, links, CTAs, and hashtags. This length provides enough space for thorough keyword integration without overwhelming the viewer.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Detailed Descriptions (300-500 Words)</h4>
          <p>Ideal for tutorials, comprehensive guides, and educational content where viewers benefit from additional context. Detailed descriptions can include FAQ sections, expanded resource lists, and more thorough explanations. They provide the most keyword integration opportunities and tend to perform best for search-driven content.</p>
        </ArticleSection>

        <ArticleSection title="Common YouTube Description Mistakes">
          <p>Even experienced creators make description mistakes that limit their video's potential reach. Avoiding these common pitfalls can immediately improve your content's discoverability and engagement.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Writing Too Little (or Nothing)</h4>
          <p>One of the most common mistakes is leaving descriptions empty or writing just one sentence. Every character you leave unused is a missed SEO opportunity. Even if you are pressed for time, use an AI description generator to create a well-optimized description quickly rather than publishing with a bare minimum.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Generic Openings That Waste the First 150 Characters</h4>
          <p>Starting with "Hey guys, welcome back to my channel" or "In this video I..." wastes the most valuable real estate in your description. These generic phrases tell the algorithm nothing useful about your content and fail to hook viewers in search results. Lead with your value proposition and primary keyword instead.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Missing Timestamps for Long Videos</h4>
          <p>For videos longer than ten minutes, timestamps are essentially mandatory. They improve the viewer experience, boost your chances of appearing in YouTube's chapter feature, and provide additional keyword opportunities. Not including timestamps for long-form content signals to both viewers and the algorithm that you have not fully optimized your video.</p>
        </ArticleSection>

        <ArticleSection title="How AI YouTube Description Generators Help">
          <p>AI-powered description generators have become an essential tool for content creators who want to optimize their SEO without spending excessive time on each video's description. These tools leverage natural language processing to create descriptions that are both human-readable and algorithm-friendly.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Consistent Quality at Scale</h4>
          <p>One of the biggest advantages of using an AI description generator is maintaining consistent quality across all your videos. When you are publishing multiple videos per week, the quality of manually written descriptions often declines due to time pressure and creative fatigue. AI generators produce consistently optimized descriptions every time, ensuring that no video is published with a subpar description.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Privacy-First Browser-Based Tools</h4>
          <p>Browser-based AI tools like this one run entirely on your device, meaning your video topics, content summaries, and generated descriptions never leave your browser. This is particularly important for creators who work with sensitive content, unreleased products, or embargoed information. Unlike cloud-based alternatives, no data is stored on external servers and no account creation is required.</p>
        </ArticleSection>
      </div>
    </section>
  );
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 dark:border-slate-700 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 pr-4">{title}</h3>
        <ChevronDown className={cn("w-5 h-5 text-slate-400 shrink-0 transition-transform", open && "rotate-180")} />
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
            <div className="pb-6 text-slate-600 dark:text-slate-400 leading-relaxed space-y-3 text-[15px]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
