import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function BlogOutlineArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          How to Create a Blog Outline: Complete Guide for SEO-Optimized Content
        </h2>

        <ArticleSection title="Why Every Blog Post Needs an Outline">
          <p>Writing a blog post without an outline is like building a house without blueprints. You might finish, but the result will lack structure, flow, and coherence. A well-crafted outline saves time, improves quality, and dramatically increases your chances of ranking on search engines.</p>
          <h4 className="font-bold text-slate-800 mt-4">Time Savings</h4>
          <p>Writers who outline before writing report completing posts 40-60% faster. The outline eliminates the blank-page problem and gives you a clear roadmap from introduction to conclusion. You spend less time deciding what to write next and more time actually writing compelling content.</p>
          <h4 className="font-bold text-slate-800 mt-4">Better SEO Performance</h4>
          <p>Outlines help you plan keyword placement, heading structure, and content depth before you write a single word. This strategic approach ensures your content covers the topic comprehensively, which is exactly what search engines reward with higher rankings.</p>
        </ArticleSection>

        <ArticleSection title="The Anatomy of an Effective Blog Outline">
          <p>Every strong blog outline contains these essential components, each serving a specific purpose in guiding both the writer and the eventual reader:</p>
          <h4 className="font-bold text-slate-800 mt-4">Title and Meta Description</h4>
          <p>Your outline should start with 2-3 title options that include your primary keyword, are under 60 characters, and create curiosity or promise clear value. The meta description (150-160 characters) serves as your search result pitch -- it must compel searchers to click.</p>
          <h4 className="font-bold text-slate-800 mt-4">Introduction Structure</h4>
          <p>Plan your hook (attention-grabbing opening), problem statement (why the reader should care), promise (what they will gain), and preview (what you will cover). A strong introduction keeps readers scrolling past the first paragraph.</p>
          <h4 className="font-bold text-slate-800 mt-4">H2 and H3 Heading Hierarchy</h4>
          <p>Your main sections (H2) form the backbone of your post. Each should cover a distinct subtopic with 2-4 supporting subsections (H3). This hierarchy helps both readers scanning the post and search engines understanding your content structure.</p>
          <h4 className="font-bold text-slate-800 mt-4">Conclusion and CTA</h4>
          <p>Plan your key takeaways, call-to-action, and closing thought. The conclusion should reinforce the main message and tell readers exactly what to do next -- whether that is implementing what they learned, sharing the post, or exploring related content.</p>
        </ArticleSection>

        <ArticleSection title="Content Types and Their Ideal Structures">
          <p>Different blog post types require different outline structures. Choosing the right format for your topic dramatically affects engagement and SEO performance:</p>
          <h4 className="font-bold text-slate-800 mt-4">How-To Guides</h4>
          <p>Structure around sequential steps. Each H2 is a major step, with H3 subsections for details. Include materials needed, time estimates, and expected outcomes. How-to posts excel at capturing featured snippets and ranking for "how to" queries.</p>
          <h4 className="font-bold text-slate-800 mt-4">Listicles</h4>
          <p>Number your main sections (H2). Each item gets equal depth unless some deserve more attention. Include a brief comparison or summary table for scanners. Listicles are highly shareable and perform well on social media.</p>
          <h4 className="font-bold text-slate-800 mt-4">Ultimate Guides</h4>
          <p>These comprehensive resources cover every angle of a topic. Plan for 3000+ words with 6-10 H2 sections. Include a table of contents, downloadable resources, and expert quotes. Ultimate guides attract backlinks and establish authority.</p>
          <h4 className="font-bold text-slate-800 mt-4">Comparison Articles</h4>
          <p>Structure around the items being compared. Include a feature comparison table, pros and cons for each, and a clear recommendation. These posts capture high-intent commercial searches.</p>
        </ArticleSection>

        <ArticleSection title="SEO Optimization in Your Outline">
          <p>SEO should be built into your outline from the start, not added as an afterthought:</p>
          <h4 className="font-bold text-slate-800 mt-4">Keyword Placement Strategy</h4>
          <p>Plan to include your primary keyword in the title, first H2, first 100 words, and conclusion. Use semantic variations and related keywords naturally throughout H2 and H3 headings. This tells search engines your content comprehensively covers the topic.</p>
          <h4 className="font-bold text-slate-800 mt-4">Featured Snippet Optimization</h4>
          <p>Identify opportunities for featured snippets: definition paragraphs, numbered step lists, comparison tables, and FAQ sections. Structure these elements specifically in your outline so they are formatted correctly in the final post.</p>
          <h4 className="font-bold text-slate-800 mt-4">Internal and External Linking</h4>
          <p>Note linking opportunities in your outline. Plan 3-5 internal links to related content and 2-3 external links to authoritative sources. This strengthens your site architecture and signals credibility to search engines.</p>
        </ArticleSection>

        <ArticleSection title="Word Count Allocation">
          <p>Not every section deserves equal space. Strategic word count allocation keeps your content focused and readable:</p>
          <h4 className="font-bold text-slate-800 mt-4">The 10-70-10-10 Rule</h4>
          <p>Allocate approximately 10% to your introduction, 70% to main content sections, 10% to conclusion, and 10% to FAQs or supplementary content. For a 2000-word post, that means roughly 200 words for the intro, 1400 for the body, 200 for the conclusion, and 200 for FAQs.</p>
          <h4 className="font-bold text-slate-800 mt-4">Section Depth</h4>
          <p>Give more words to sections covering complex topics or high-value keywords. Your most important sections should be your most detailed. Simpler concepts can be covered more briefly without sacrificing quality.</p>
        </ArticleSection>

        <ArticleSection title="Multimedia and Content Enhancement">
          <p>Plan visual and interactive elements in your outline to break up text and increase engagement:</p>
          <h4 className="font-bold text-slate-800 mt-4">Image Placement</h4>
          <p>Plan at least one image per 300-500 words. Include screenshots, diagrams, infographics, or relevant photos. Note where each should appear in your outline so they are not an afterthought.</p>
          <h4 className="font-bold text-slate-800 mt-4">Data Visualization</h4>
          <p>Statistics and data are more compelling when visualized. Note in your outline where charts, graphs, or comparison tables would strengthen your argument and help readers understand complex information quickly.</p>
        </ArticleSection>

        <ArticleSection title="Common Blog Outline Mistakes">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Too vague:</strong> "Write about benefits" is not helpful. Specify which benefits, with what supporting evidence, targeting which reader concern.</li>
            <li><strong className="text-slate-800">No word count guidance:</strong> Without target lengths, writers either pad sections or cut them too short. Allocate words intentionally.</li>
            <li><strong className="text-slate-800">Ignoring search intent:</strong> If someone searches "best email marketing tools," they want a comparison list, not a tutorial on email marketing basics.</li>
            <li><strong className="text-slate-800">Missing the conclusion:</strong> Many outlines trail off after the main content. Plan a strong ending with clear takeaways and next steps.</li>
            <li><strong className="text-slate-800">No SEO strategy:</strong> Keyword placement, heading structure, and link building should be planned in the outline, not added during editing.</li>
            <li><strong className="text-slate-800">Rigid structure:</strong> An outline is a guide, not a prison. Leave room for the writer to discover new angles and insights during the writing process.</li>
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
