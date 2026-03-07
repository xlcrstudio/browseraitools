import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function TikTokCaptionArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          How to Write TikTok Captions That Go Viral: Complete Guide
        </h2>

        <ArticleSection title="Why TikTok Captions Matter More Than You Think">
          <p>Many creators treat TikTok captions as an afterthought, but they're a critical piece of the algorithm puzzle. While your video content drives initial engagement, your caption influences how TikTok categorizes and distributes your content.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Algorithm Connection</h4>
          <p>TikTok's algorithm reads your caption to understand what your video is about. This affects which audiences see your content on the For You Page. A well-crafted caption with relevant keywords and hashtags helps TikTok match your content with the right viewers.</p>
          <h4 className="font-bold text-slate-800 mt-4">Engagement Multiplier</h4>
          <p>Captions that ask questions, create debate, or include calls-to-action significantly boost comment rates. More comments signal to the algorithm that your content is engaging, which leads to more distribution. It's a positive feedback loop that starts with your caption.</p>
        </ArticleSection>

        <ArticleSection title="The Anatomy of a Viral TikTok Caption">
          <p>The best-performing TikTok captions follow a consistent structure, even when they look casual and spontaneous:</p>
          <h4 className="font-bold text-slate-800 mt-4">1. The Hook (First 3 Words)</h4>
          <p>The first few words of your caption appear in the feed before users tap "more." These words need to create enough curiosity to stop the scroll. Effective hook formulas include: "POV: [scenario]," "Nobody talks about...," "This changed everything...," and "Wait for it..."</p>
          <h4 className="font-bold text-slate-800 mt-4">2. The Context</h4>
          <p>Keep this brief -- one or two sentences maximum. Set up the situation, provide background, or build anticipation for the payoff. Use line breaks and emojis to make it scannable.</p>
          <h4 className="font-bold text-slate-800 mt-4">3. The Value/Payoff</h4>
          <p>Deliver on what your hook promised. Whether it's a tip, a punchline, or a revelation, make sure viewers feel rewarded for reading.</p>
          <h4 className="font-bold text-slate-800 mt-4">4. The Call-to-Action</h4>
          <p>Tell viewers what to do next. "Comment [word] if you relate," "Follow for more [topic]," or "Send this to someone who needs it." Specific CTAs outperform vague ones every time.</p>
          <h4 className="font-bold text-slate-800 mt-4">5. Strategic Hashtags</h4>
          <p>Place 5-8 hashtags at the end of your caption. Mix trending tags (#fyp, #foryou) with niche-specific ones. Too many hashtags look spammy; too few limits your discoverability.</p>
        </ArticleSection>

        <ArticleSection title="TikTok Caption Formulas That Work">
          <p>These proven formulas consistently drive high engagement across niches:</p>
          <ul className="space-y-3 text-slate-600">
            <li><strong className="text-slate-800">The POV Format:</strong> "POV: [relatable scenario]" -- This format creates an immersive experience and is endlessly shareable because viewers see themselves in the scenario.</li>
            <li><strong className="text-slate-800">The Curiosity Gap:</strong> "Nobody talks about [topic]..." -- This creates urgency and makes viewers feel like they're about to learn something exclusive.</li>
            <li><strong className="text-slate-800">The Challenge:</strong> "Day [X] of [challenge]" -- Series-based captions drive follow-backs because viewers want to see the next installment.</li>
            <li><strong className="text-slate-800">The Hot Take:</strong> "[Controversial but kind opinion]" -- Opinions drive comments. Just keep it respectful and authentic to your brand.</li>
            <li><strong className="text-slate-800">The List Format:</strong> "[Number] things about [topic] that actually work" -- Lists promise specific value and are easy to consume.</li>
            <li><strong className="text-slate-800">The Story Hook:</strong> "Storytime: [intriguing premise]" -- Stories create emotional investment and drive watch time.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Hashtag Strategy for TikTok Growth">
          <p>TikTok hashtags work differently from Instagram. Fewer, more targeted hashtags tend to outperform hashtag stuffing:</p>
          <h4 className="font-bold text-slate-800 mt-4">The Ideal TikTok Hashtag Mix (5-8 total)</h4>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">1-2 Trending/Discovery Tags:</strong> #fyp, #foryou, #viral -- These signal to the algorithm that you want broader distribution.</li>
            <li><strong className="text-slate-800">2-3 Niche-Specific Tags:</strong> Tags your target audience follows, like #booktok, #fitnesstips, #recipeideas.</li>
            <li><strong className="text-slate-800">2-3 Content Descriptors:</strong> Tags that describe what your specific video shows -- #morningroutine, #beforeandafter, #tutorial.</li>
          </ul>
          <p>Avoid using banned or flagged hashtags. These can shadow-suppress your content. Keep hashtags relevant -- using trending tags unrelated to your content confuses the algorithm.</p>
        </ArticleSection>

        <ArticleSection title="Caption Length: Short vs. Long">
          <p>There's no single "best" caption length on TikTok. The right length depends on your content type and goal:</p>
          <h4 className="font-bold text-slate-800 mt-4">Short Captions (50-100 characters)</h4>
          <p>Best for: entertainment content, memes, trends, dance videos. When the video speaks for itself, a short punchy caption adds flavor without competing for attention.</p>
          <h4 className="font-bold text-slate-800 mt-4">Medium Captions (100-200 characters)</h4>
          <p>Best for: most content types. This gives you enough room for a hook, context, and CTA without overwhelming viewers. This is the sweet spot for most creators.</p>
          <h4 className="font-bold text-slate-800 mt-4">Long Captions (200-300 characters)</h4>
          <p>Best for: storytelling, educational content, product reviews. When your video needs context or you're sharing a personal story, longer captions add depth. Use line breaks and emojis to maintain readability.</p>
        </ArticleSection>

        <ArticleSection title="Tone and Voice for TikTok">
          <p>TikTok rewards authenticity over polish. Your caption tone should feel natural and conversational:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Write Like You Talk:</strong> Use contractions, informal language, and conversational rhythm. Nobody wants to read corporate speak on TikTok.</li>
            <li><strong className="text-slate-800">Use "You" and "I":</strong> Direct address creates a personal connection. "I tried this so you don't have to" is more engaging than "This product was tested."</li>
            <li><strong className="text-slate-800">Be Vulnerable:</strong> Sharing struggles, mistakes, and honest opinions builds trust and drives engagement. Perfection is boring on TikTok.</li>
            <li><strong className="text-slate-800">Match Your Audience:</strong> Gen Z appreciates humor, self-deprecation, and cultural references. Millennials respond to nostalgia, life hacks, and relatable adulting content.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="The First Comment Strategy">
          <p>Your first comment is almost as important as your caption. Pinning a strategic first comment can dramatically boost engagement:</p>
          <h4 className="font-bold text-slate-800 mt-4">Types of First Comments</h4>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">The Engagement Question:</strong> "What time do YOU wake up? Drop it below" -- This gives viewers a low-effort way to engage, boosting your comment count.</li>
            <li><strong className="text-slate-800">The Series Tease:</strong> "Part 2 coming tomorrow -- follow so you don't miss it" -- This drives follows and builds anticipation.</li>
            <li><strong className="text-slate-800">The Additional Context:</strong> "Full breakdown on my page!" -- This encourages profile visits and deeper engagement with your content.</li>
            <li><strong className="text-slate-800">The CTA Link:</strong> "Link in bio for [resource]" -- For creators monetizing through links, this is essential. Keep it natural.</li>
          </ul>
          <p>Post your first comment immediately after publishing. The algorithm considers early engagement heavily in distribution decisions.</p>
        </ArticleSection>

        <ArticleSection title="Common TikTok Caption Mistakes">
          <p>Avoid these common pitfalls that can hurt your reach and engagement:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Generic Captions:</strong> "Check this out!" or "New video!" tells the algorithm nothing about your content and gives viewers no reason to engage.</li>
            <li><strong className="text-slate-800">Too Many Hashtags:</strong> More than 8-10 hashtags looks spammy and can actually reduce reach. Quality over quantity.</li>
            <li><strong className="text-slate-800">Begging for Engagement:</strong> "Please like and follow!" comes across as desperate. Instead, create value that naturally earns engagement.</li>
            <li><strong className="text-slate-800">Clickbait That Doesn't Deliver:</strong> Misleading hooks might get initial views but destroy trust and hurt your account long-term.</li>
            <li><strong className="text-slate-800">Walls of Text:</strong> Long paragraphs without line breaks are unreadable on mobile. Use spacing and emojis to break up text.</li>
            <li><strong className="text-slate-800">Corporate Language:</strong> "We are pleased to announce..." has no place on TikTok. Keep it human and casual.</li>
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
