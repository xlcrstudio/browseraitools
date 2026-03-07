import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function KeywordArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          Keyword Research Guide: How to Find & Use SEO Keywords
        </h2>

        <ArticleSection title="What is Keyword Research?">
          <p>Keyword research is the process of discovering the words and phrases that people type into search engines when looking for information, products, or services. It is the foundation of any successful SEO strategy and informs every aspect of content creation, from blog posts to product pages.</p>
          <h4 className="font-bold text-slate-800 mt-4">Why Keyword Research Matters</h4>
          <p>Understanding what your audience searches for allows you to create content that matches their intent. Without keyword research, you are essentially guessing what topics to cover and which phrases to target -- leading to wasted effort and missed opportunities.</p>
          <h4 className="font-bold text-slate-800 mt-4">How Search Engines Use Keywords</h4>
          <p>Search engines like Google analyze the keywords on your pages to understand what your content is about. They then match your pages to relevant search queries. Modern search engines also consider synonyms, related terms, and the overall context of your content -- but keywords remain the primary signal for relevance.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Role of Keywords in Content Strategy</h4>
          <p>Keywords serve as the bridge between what your audience needs and the content you create. By targeting the right keywords, you can attract qualified traffic, answer real questions, and guide potential customers through their journey from awareness to purchase.</p>
        </ArticleSection>

        <ArticleSection title="Types of Keywords">
          <h4 className="font-bold text-slate-800 mt-2">By Length</h4>
          <ul className="space-y-3 text-slate-600">
            <li><strong className="text-slate-800">Short-Tail Keywords (1-2 words):</strong> Broad terms like "running shoes" or "email marketing." They have high search volume but are extremely competitive and often lack clear intent. Ranking for these requires significant authority and resources.</li>
            <li><strong className="text-slate-800">Medium-Tail Keywords (2-3 words):</strong> More specific phrases like "best running shoes" or "email marketing tools." They balance search volume with specificity and are often good targets for established sites looking to grow traffic.</li>
            <li><strong className="text-slate-800">Long-Tail Keywords (4+ words):</strong> Highly specific phrases like "best running shoes for flat feet 2024" or "free email marketing tools for small business." They have lower search volume but much higher conversion rates because the searcher knows exactly what they want.</li>
          </ul>
          <h4 className="font-bold text-slate-800 mt-4">By Search Intent</h4>
          <ul className="space-y-3 text-slate-600">
            <li><strong className="text-slate-800">Informational:</strong> The searcher wants to learn something. Examples: "how to do keyword research," "what is SEO." These keywords are ideal for blog posts, guides, and educational content that builds authority and trust.</li>
            <li><strong className="text-slate-800">Commercial:</strong> The searcher is researching before a purchase. Examples: "best keyword research tools," "Ahrefs vs SEMrush." Target these with comparison pages, reviews, and detailed product breakdowns.</li>
            <li><strong className="text-slate-800">Transactional:</strong> The searcher is ready to take action. Examples: "buy SEMrush subscription," "keyword tool free trial." These keywords belong on product pages, pricing pages, and landing pages designed to convert.</li>
            <li><strong className="text-slate-800">Navigational:</strong> The searcher is looking for a specific website or page. Examples: "Google Keyword Planner login," "Ahrefs dashboard." These are typically branded searches and are most relevant if you own the brand being searched.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="How to Do Keyword Research">
          <p>Effective keyword research follows a systematic process. Here are five steps to find the best keywords for your content:</p>
          <h4 className="font-bold text-slate-800 mt-4">Step 1: Understand Your Niche</h4>
          <p>Before diving into keyword tools, develop a deep understanding of your industry, audience, and competitors. What problems does your audience face? What language do they use? What topics do your competitors cover? This foundational knowledge shapes every keyword decision you make.</p>
          <h4 className="font-bold text-slate-800 mt-4">Step 2: Brainstorm Seed Keywords</h4>
          <p>Start with a list of broad topics related to your business. If you sell project management software, your seeds might include "project management," "team collaboration," "task tracking," and "workflow automation." These seed keywords become the starting point for deeper research.</p>
          <h4 className="font-bold text-slate-800 mt-4">Step 3: Expand with Tools</h4>
          <p>Use keyword research tools to expand your seed list into hundreds or thousands of related keywords. Tools like Google Keyword Planner, Ahrefs, SEMrush, and AI-powered generators can suggest related terms, questions, and variations you might not have considered.</p>
          <h4 className="font-bold text-slate-800 mt-4">Step 4: Analyze Intent</h4>
          <p>For each keyword, determine the search intent. Look at the current top-ranking pages to understand what Google considers the best answer. If the top results are all blog posts, the intent is likely informational. If they are product pages, the intent is transactional. Matching intent is critical for ranking.</p>
          <h4 className="font-bold text-slate-800 mt-4">Step 5: Prioritize</h4>
          <p>Not all keywords are worth targeting. Prioritize based on relevance to your business, search volume, keyword difficulty, and commercial value. Focus on keywords where you can realistically rank and that will drive meaningful traffic or conversions.</p>
        </ArticleSection>

        <ArticleSection title="Keyword Metrics Explained">
          <ul className="space-y-4 text-slate-600">
            <li>
              <strong className="text-slate-800">Search Volume:</strong>
              <p className="mt-1">The estimated number of times a keyword is searched per month. Higher volume means more potential traffic, but also typically more competition. A keyword with 10,000 monthly searches isn't automatically better than one with 500 -- context matters. A low-volume keyword with high commercial intent can be far more valuable than a high-volume informational query.</p>
            </li>
            <li>
              <strong className="text-slate-800">Keyword Difficulty:</strong>
              <p className="mt-1">A score (typically 0-100) that estimates how hard it will be to rank on the first page for a given keyword. Difficulty is influenced by the authority, content quality, and backlink profiles of the pages currently ranking. New or smaller websites should focus on lower-difficulty keywords to build authority before tackling competitive terms.</p>
            </li>
            <li>
              <strong className="text-slate-800">Search Intent:</strong>
              <p className="mt-1">The underlying goal behind a search query. Understanding intent is crucial because Google prioritizes pages that best satisfy the searcher's needs. Creating a product page for an informational keyword (or vice versa) will make it nearly impossible to rank, regardless of how well-optimized your page is.</p>
            </li>
            <li>
              <strong className="text-slate-800">Cost Per Click (CPC):</strong>
              <p className="mt-1">The average amount advertisers pay for a click on their ad for a given keyword. CPC is a strong indicator of commercial value -- keywords with high CPCs are ones where businesses are willing to pay for traffic, suggesting they lead to profitable conversions. Even if you are focused on organic traffic, CPC helps you identify high-value keywords worth targeting.</p>
            </li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Long-Tail Keyword Strategy">
          <h4 className="font-bold text-slate-800 mt-2">Benefits of Long-Tail Keywords</h4>
          <ul className="space-y-3 text-slate-600">
            <li><strong className="text-slate-800">Lower Competition:</strong> Long-tail keywords are less competitive because fewer websites target them specifically. This makes them ideal for newer websites or those with lower domain authority.</li>
            <li><strong className="text-slate-800">Higher Conversion Rates:</strong> Searchers using long-tail queries have a clearer idea of what they want. Someone searching "best waterproof hiking boots under $100" is much closer to buying than someone searching "hiking boots."</li>
            <li><strong className="text-slate-800">Better Content Focus:</strong> Long-tail keywords naturally guide your content creation. They tell you exactly what topic to cover and what angle to take, making it easier to create comprehensive, focused content.</li>
            <li><strong className="text-slate-800">Voice Search Optimization:</strong> As voice search grows, long-tail keywords become increasingly important. People speak in natural, conversational phrases that closely match long-tail queries.</li>
          </ul>
          <h4 className="font-bold text-slate-800 mt-4">How to Find Long-Tail Keywords</h4>
          <p>Use Google's autocomplete suggestions, "People Also Ask" boxes, and related searches at the bottom of search results pages. Answer-based tools and forums like Reddit and Quora are excellent sources for discovering the specific questions your audience asks. AI keyword generators can also expand a single seed keyword into dozens of long-tail variations.</p>
        </ArticleSection>

        <ArticleSection title="Keyword Clustering & Topic Clusters">
          <h4 className="font-bold text-slate-800 mt-2">What is Keyword Clustering?</h4>
          <p>Keyword clustering is the practice of grouping related keywords together so that a single piece of content can target multiple keywords simultaneously. Instead of creating separate pages for "email marketing tips," "email marketing best practices," and "how to improve email marketing," you create one comprehensive page that covers all three.</p>
          <h4 className="font-bold text-slate-800 mt-4">Benefits of Keyword Clustering</h4>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Avoids Keyword Cannibalization:</strong> Without clustering, you might accidentally create multiple pages targeting the same keywords, causing them to compete against each other in search results.</li>
            <li><strong className="text-slate-800">Creates Comprehensive Content:</strong> Clustering helps you cover a topic thoroughly, which search engines reward with higher rankings.</li>
            <li><strong className="text-slate-800">Improves Site Architecture:</strong> Topic clusters create a clear, organized structure that helps both search engines and users navigate your content.</li>
          </ul>
          <h4 className="font-bold text-slate-800 mt-4">How to Create Topic Clusters</h4>
          <p>Start by identifying a broad "pillar" topic that represents a main area of your business. Then find related subtopics (clusters) that support the pillar. Create a comprehensive pillar page and link it to detailed cluster pages covering each subtopic. This interconnected structure signals to search engines that your site is an authority on the topic.</p>
        </ArticleSection>

        <ArticleSection title="Common Keyword Research Mistakes">
          <ul className="space-y-3 text-slate-600">
            <li><strong className="text-slate-800">Targeting Only High-Volume Keywords:</strong> High-volume keywords are tempting but often too competitive for most websites. A balanced strategy includes a mix of high, medium, and low-volume keywords to capture traffic at every level.</li>
            <li><strong className="text-slate-800">Ignoring Search Intent:</strong> Targeting a keyword without understanding what the searcher actually wants leads to poor rankings and high bounce rates. Always check the current search results to understand what type of content Google expects for a given query.</li>
            <li><strong className="text-slate-800">Keyword Stuffing:</strong> Repeating a keyword unnaturally throughout your content doesn't help rankings and can actually hurt them. Search engines are sophisticated enough to understand context and synonyms. Write naturally and focus on comprehensively covering the topic.</li>
            <li><strong className="text-slate-800">Not Updating Keyword Research:</strong> Search trends change over time. Keywords that drove traffic last year may be declining, and new opportunities emerge constantly. Revisit your keyword strategy quarterly to stay current.</li>
            <li><strong className="text-slate-800">Ignoring Competitor Keywords:</strong> Your competitors have already done keyword research. Analyzing what they rank for reveals gaps in your own strategy and opportunities to create better content on the same topics.</li>
            <li><strong className="text-slate-800">Focusing Only on Rankings:</strong> Rankings are a means to an end, not the end itself. A keyword that ranks #1 but drives no conversions is less valuable than one that ranks #5 but consistently brings in customers. Tie your keyword strategy to business outcomes.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Advanced Keyword Strategies">
          <h4 className="font-bold text-slate-800 mt-2">Voice Search Optimization</h4>
          <p>Voice searches tend to be longer and more conversational than typed searches. Optimize for voice by targeting question-based keywords, using natural language, and providing concise, direct answers. Featured snippet optimization is particularly important since voice assistants often read the featured snippet as the answer.</p>
          <h4 className="font-bold text-slate-800 mt-4">Video SEO Keywords</h4>
          <p>YouTube is the second-largest search engine. Video keyword research involves finding terms that people search for on YouTube, which often differ from Google searches. "How-to" and tutorial-style keywords perform particularly well for video content. Use video titles, descriptions, and tags to target these keywords.</p>
          <h4 className="font-bold text-slate-800 mt-4">Local SEO Keywords</h4>
          <p>For businesses serving specific geographic areas, local keyword research is essential. Include location modifiers like city names, neighborhoods, and "near me" phrases. Optimize your Google Business Profile and create location-specific landing pages to capture local search traffic.</p>
          <h4 className="font-bold text-slate-800 mt-4">E-commerce Keyword Strategy</h4>
          <p>E-commerce keyword research focuses on product-related searches with transactional intent. Target product-specific terms, brand names, model numbers, and comparison queries. Optimize category pages for broader terms and individual product pages for specific long-tail keywords. Don't forget to target "best," "review," and "vs" queries that shoppers use during their research phase.</p>
        </ArticleSection>

        <div className="mt-10 bg-gradient-primary rounded-2xl p-6 md:p-8 text-center">
          <h3 className="text-xl font-display font-bold text-white mb-2">Ready to Find Your Keywords?</h3>
          <p className="text-purple-100 text-sm mb-4">Use the free AI Keyword Generator above to instantly discover high-value SEO keywords with search volume estimates, difficulty scores, and intent classification -- all powered by AI running privately in your browser.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-purple-700 bg-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-sm"
            data-testid="button-scroll-to-tool"
          >
            Generate Keywords &uarr;
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
        data-testid={`button-article-section-${title.toLowerCase().replace(/\s+/g, '-')}`}
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
