import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function BusinessNameArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          How to Choose the Perfect Business Name: Complete Guide
        </h2>

        <ArticleSection title="Why Your Business Name Matters">
          <p>Your business name is the foundation of your brand identity. It is often the first thing potential customers encounter and it shapes their perception before they ever interact with your product or service. A strong business name is memorable, easy to spell, and communicates something meaningful about what you do.</p>
          <p>Research shows that businesses with clear, brandable names grow faster in early stages because customers can remember and recommend them more easily. A name that is hard to pronounce, spell, or remember creates friction at every customer touchpoint.</p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Key Insight:</strong> The best business names balance uniqueness with clarity. They stand out from competitors while still giving customers a sense of what the business does or represents.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Naming Styles and When to Use Them">
          <h4 className="font-bold text-slate-800 mt-4">Modern / Tech</h4>
          <p>Short, clean names that feel contemporary and digital-native. Think Stripe, Uber, Slack. These work best for technology companies, startups, and businesses targeting younger demographics. They are often one syllable or two syllables with strong consonant sounds.</p>
          <h4 className="font-bold text-slate-800 mt-4">Creative / Playful</h4>
          <p>Fun, approachable names that feel friendly and informal. Think Snapchat, TikTok, Bumble. These excel for consumer-facing brands, social platforms, and lifestyle products. They often use alliteration, rhyming, or onomatopoeia.</p>
          <h4 className="font-bold text-slate-800 mt-4">Professional / Corporate</h4>
          <p>Authoritative names that convey trust and expertise. Think McKinsey, Deloitte, Bloomberg. These are ideal for consulting firms, financial services, legal practices, and B2B enterprises where credibility is paramount.</p>
          <h4 className="font-bold text-slate-800 mt-4">Descriptive</h4>
          <p>Names that directly describe what the business does. Think Facebook, YouTube, Salesforce. These provide immediate clarity about the product or service, making marketing easier in early stages. The trade-off is less flexibility if the business pivots.</p>
          <h4 className="font-bold text-slate-800 mt-4">Invented / Unique</h4>
          <p>Completely original words that carry no pre-existing meaning. Think Google, Xerox, Kodak. These are highly brandable and trademark-friendly, but require more marketing investment to establish meaning. They work when you want complete ownership of a word.</p>
        </ArticleSection>

        <ArticleSection title="Brandability: What Makes a Name Stick">
          <p>A brandable name scores high on several dimensions that determine how well it will perform as a long-term brand asset:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Memorability:</strong> Can someone remember it after hearing it once? The best names create mental hooks through rhythm, imagery, or emotional association.</li>
            <li><strong className="text-slate-800">Pronounceability:</strong> Can anyone say it correctly on the first try? Names that cause pronunciation confusion create word-of-mouth barriers.</li>
            <li><strong className="text-slate-800">Spellability:</strong> Can someone type it into a browser without guessing? Unusual spellings feel creative but cost you traffic.</li>
            <li><strong className="text-slate-800">Uniqueness:</strong> Does it stand apart from competitors? A name too similar to existing brands causes confusion and potential legal issues.</li>
            <li><strong className="text-slate-800">Emotional resonance:</strong> Does it evoke the right feeling? The best names trigger positive associations aligned with brand values.</li>
            <li><strong className="text-slate-800">Scalability:</strong> Will it still work if the business expands into new products or markets?</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Domain and Digital Presence">
          <p>In the digital age, your business name and your domain name are deeply connected. Before committing to a name, consider these digital factors:</p>
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">.com availability:</strong> While not strictly necessary anymore, a matching .com domain still carries the most trust and is easiest for customers to remember.</li>
            <li><strong className="text-slate-800">Alternative TLDs:</strong> Extensions like .io (tech), .ai (artificial intelligence), .co (startups), and industry-specific TLDs can work well if the .com is taken.</li>
            <li><strong className="text-slate-800">Social handles:</strong> Check if your name is available as a username on key platforms. Consistent handles across platforms strengthen brand recognition.</li>
            <li><strong className="text-slate-800">SEO considerations:</strong> Names that include relevant keywords can provide a slight search advantage, but brandability should always come first.</li>
          </ul>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Pro Tip:</strong> If your ideal .com is taken, try adding a word like "get," "use," "try," or "hello" before or after the name. For example, getstripe.com redirects to stripe.com.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Common Naming Mistakes to Avoid">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Too generic:</strong> Names like "Best Marketing Solutions" are forgettable and impossible to trademark. Aim for distinctive, not descriptive.</li>
            <li><strong className="text-slate-800">Hard to spell:</strong> Creative spellings like "Kwik" or "Xtreme" cause confusion. Every misspelling is a lost customer.</li>
            <li><strong className="text-slate-800">Too long:</strong> Names with more than 3 words are hard to remember, hard to fit on business cards, and hard to use as social handles.</li>
            <li><strong className="text-slate-800">Limiting geography:</strong> Unless you will always be local, avoid city or region names that prevent future expansion.</li>
            <li><strong className="text-slate-800">Negative associations:</strong> Always check your name in other languages and cultures. What sounds great in English might mean something unfortunate elsewhere.</li>
            <li><strong className="text-slate-800">Too trendy:</strong> Naming trends fade. A name that feels fresh today might feel dated in 5 years. Aim for timeless over trendy.</li>
          </ul>
        </ArticleSection>
      </div>
    </section>
  );
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 py-4">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left group" data-testid={`button-article-section-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} aria-expanded={open}>
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-purple-700 transition-colors">{title}</h3>
        <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform shrink-0 ml-4", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="pt-4 text-slate-600 text-[15px] leading-relaxed space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
