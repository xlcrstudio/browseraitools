import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function IGBioArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-slate-100 mb-6" data-testid="text-ig-bio-article-heading">
          How to Write the Perfect Instagram Bio: Complete Guide 2026
        </h2>

        <ArticleSection title="Why Your Instagram Bio Matters">
          <p>Your Instagram bio is the most valuable piece of real estate on your profile. It is the first thing visitors see when they land on your page, and it directly influences whether they hit the follow button or scroll away. With only 150 characters to work with, every single word must earn its place. Studies show that users spend an average of just three to five seconds evaluating a profile before deciding to follow, making your bio a critical conversion point.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">First Impressions Are Everything</h4>
          <p>When someone discovers your profile through a hashtag, explore page, or tagged post, your bio is their first real interaction with your brand or personality. A clear, compelling bio that immediately communicates who you are and what value you provide dramatically increases the chance of gaining a new follower. Think of your bio as a three-second elevator pitch that needs to convey your identity, value, and personality all at once.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">The Bio as a Conversion Tool</h4>
          <p>Beyond attracting followers, your bio serves as a conversion mechanism. It can drive traffic to your website, promote your latest content, encourage direct messages for business inquiries, and establish credibility in your niche. A strategically crafted bio with a clear call-to-action can turn casual profile visitors into engaged followers, customers, or collaborators.</p>
        </ArticleSection>

        <ArticleSection title="Instagram Bio Character Limit (150 Chars)">
          <p>Instagram enforces a strict 150-character limit on bios. This includes all text, spaces, line breaks, and emojis. Understanding how to maximize this limited space is what separates forgettable bios from memorable ones. Every character counts, and knowing how to structure your content within this constraint is a skill that top creators and brands have mastered.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Character Counting Tips</h4>
          <p>Most emojis count as two characters due to Unicode encoding, although some simpler ones count as one. Line breaks count as one character each. Special characters and symbols vary in their character count. When crafting your bio, always test it in the actual Instagram app to confirm it fits within the limit before publishing.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Making Every Character Count</h4>
          <p>Use abbreviations where natural, such as "and" to "&" or "with" to "w/". Pipe characters (|) and bullet points work as compact separators. Choose shorter, punchier words over longer alternatives. Remove unnecessary articles like "the" and "a" when they do not add meaning. These small optimizations can free up ten to twenty characters for more impactful content.</p>
        </ArticleSection>

        <ArticleSection title="Essential Elements of a Great Bio">
          <p>The most effective Instagram bios consistently include four to five key elements that work together to create a complete picture of who you are and why someone should follow you.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Who You Are</h4>
          <p>Lead with your identity or profession. This should be immediately clear from the first line. Whether you are a photographer, fitness coach, small business owner, or content creator, stating your role or title helps visitors instantly understand your niche and relevance to their interests.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">What You Offer</h4>
          <p>Beyond who you are, communicate the value you provide. What will followers gain from your content? This could be inspiration, education, entertainment, product recommendations, or lifestyle content. Framing your bio around the benefit to the follower rather than just about yourself makes it significantly more compelling.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Your Unique Angle</h4>
          <p>What makes you different from the thousands of other accounts in your niche? Whether it is a specific achievement, a unique perspective, or a memorable personal detail, including something distinctive helps you stand out. Phrases like "50+ countries visited" or "Featured in Forbes" immediately set you apart.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Call-to-Action</h4>
          <p>Every effective bio includes a clear call-to-action. Whether it is directing visitors to your link, encouraging them to DM you, or promoting your latest offer, a CTA tells visitors what to do next. Without one, you leave engagement to chance rather than intention.</p>
        </ArticleSection>

        <ArticleSection title="Instagram Bio Ideas by Niche">
          <p>Different niches benefit from different bio approaches. Understanding what works in your specific category helps you craft bios that resonate with your target audience.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Fitness and Health</h4>
          <p>Fitness bios should lead with credentials or transformation results. Include specific specialties like "HIIT | Nutrition | Mindset" and use strong action verbs. Credentials build trust in this niche where expertise matters. A combination of professional achievement and motivational tone tends to perform best.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Travel and Lifestyle</h4>
          <p>Travel bios benefit from specific numbers like "40+ countries" and current location updates. Use travel-related emojis sparingly to add visual appeal. Including what type of travel content you create, whether budget tips, luxury experiences, or adventure travel, helps attract the right followers.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Business and Entrepreneurship</h4>
          <p>Business bios should prioritize credibility and value proposition. Include specific results, company names, or revenue figures where appropriate. Professional language with minimal emojis works best for B2B audiences, while a slightly more casual tone works for direct-to-consumer brands.</p>
        </ArticleSection>

        <ArticleSection title="Emoji Strategy for Instagram Bios">
          <p>Emojis are one of the most powerful tools in your bio arsenal when used strategically. They add personality, break up text, and provide visual cues that help visitors scan your bio quickly.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">The Sweet Spot: 3-5 Emojis</h4>
          <p>Research and analysis of top-performing Instagram profiles shows that three to five emojis hit the perfect balance. Fewer than three can make your bio feel plain, while more than seven starts to look cluttered and unprofessional. The key is strategic placement, not emoji quantity.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Niche-Relevant Emojis</h4>
          <p>Choose emojis that reinforce your niche and brand. A fitness coach might use dumbbells and flex emojis, while a food blogger would use utensils and dish emojis. Avoid random decorative emojis that do not add meaning. Each emoji should either convey information or reinforce your brand identity.</p>
        </ArticleSection>

        <ArticleSection title="How to Format Your Bio (Line Breaks)">
          <p>Line breaks transform a dense block of text into a scannable, visually appealing bio. They are one of the simplest yet most impactful formatting techniques available on Instagram.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Creating Line Breaks</h4>
          <p>To add line breaks in your Instagram bio, type your bio in a notes app first with each line on a separate row, then copy and paste it into Instagram. Some users also use invisible characters or bio formatting tools. The key is testing your formatting in the actual app, as what looks good in a text editor may display differently on Instagram.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Optimal Line Structure</h4>
          <p>Most effective bios use three to five lines. A common structure is: Line 1 for your name or title, Line 2 for what you do, Line 3 for a unique fact or credential, and Line 4 for a call-to-action. This creates a natural reading flow that guides visitors through your key information in order of importance.</p>
        </ArticleSection>

        <ArticleSection title="Professional vs Personal Bio Styles">
          <p>The right bio style depends entirely on your goals and audience. Understanding the spectrum from ultra-professional to playfully personal helps you find the tone that best represents your brand.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Professional Bios</h4>
          <p>Professional bios prioritize credibility and clarity. They typically use titles, credentials, and measurable achievements. Emoji usage is minimal and purposeful. These bios work best for consultants, coaches, B2B brands, and anyone whose primary goal is establishing authority and trust.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Personal and Fun Bios</h4>
          <p>Personal bios lean into personality, humor, and relatability. They often include quirky details, playful language, and more liberal emoji use. These bios excel for lifestyle creators, entertainment accounts, and personal brands where authenticity and approachability are the primary draw.</p>
        </ArticleSection>

        <ArticleSection title="Common Instagram Bio Mistakes">
          <p>Even experienced creators and brands make preventable bio mistakes that cost them followers and engagement opportunities.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Being Too Generic</h4>
          <p>Phrases like "Living my best life" or "Love, laugh, live" tell visitors nothing unique about you. These overused expressions make your profile blend into millions of others. Replace generic phrases with specific details that only apply to you and your brand.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Not Clarifying What You Do</h4>
          <p>Visitors should understand what your account is about within seconds. If your bio is all personality and no substance, people may enjoy reading it but still not follow because they do not understand what content they will get. Always clearly communicate your niche or content focus.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Emoji Overload</h4>
          <p>Using too many emojis makes your bio look cluttered and unprofessional. It can also make the text harder to read and may give the impression of trying too hard. Stick to the three to five emoji sweet spot and ensure each one serves a purpose.</p>
        </ArticleSection>

        <ArticleSection title="Bio Examples That Get Followers">
          <p>Studying successful bios reveals patterns and principles you can apply to your own profile. The best bios consistently demonstrate clarity, personality, and strategic formatting.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">The Credibility Bio</h4>
          <p>Bios that lead with impressive credentials or achievements naturally build trust. Mentioning publications you have been featured in, follower milestones, or professional certifications immediately establishes authority. This works especially well in competitive niches where expertise differentiates you from hobbyists.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">The Story Bio</h4>
          <p>Bios that tell a mini story or transformation create emotional connection. Starting with a relatable situation and showing where you are now builds rapport with visitors who may be on a similar journey. These bios work particularly well for coaches, fitness accounts, and personal development creators.</p>
        </ArticleSection>

        <ArticleSection title="Optimizing Your Bio for Business">
          <p>Business accounts have different bio requirements than personal accounts. The focus shifts from self-expression to clear communication of value, offerings, and how to take the next step.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Lead with Your Value Proposition</h4>
          <p>Business bios should immediately communicate what problem you solve or what value you provide. Use language that speaks to your target customer's needs and desires rather than describing your company's features. Frame everything from the customer's perspective.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">Include a Clear CTA</h4>
          <p>Every business bio needs a specific call-to-action. Whether it is "Shop our latest collection" with an arrow pointing to the link, "DM for a free consultation," or "Book your session today," tell visitors exactly what action you want them to take next.</p>
        </ArticleSection>

        <ArticleSection title="Updating Your Bio (When and How)">
          <p>Your bio should not remain static. Regular updates keep your profile fresh and relevant, reflecting your latest achievements, offerings, and priorities.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">When to Update</h4>
          <p>Update your bio when you launch a new product or service, achieve a significant milestone, change your content focus, run a promotion or campaign, or notice declining profile visit to follow conversion rates. Seasonal updates and timely references can also make your profile feel more current and engaged.</p>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-4">A/B Testing Your Bio</h4>
          <p>Try different bio versions over one to two week periods and monitor your profile visit to follower conversion rate using Instagram Insights. Test different CTAs, emoji usage levels, and formatting styles. Small changes can lead to significant improvements in follow rates over time. Keep notes on which versions perform best so you can identify patterns in what resonates with your audience.</p>
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
        <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", open && "rotate-180")} />
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
