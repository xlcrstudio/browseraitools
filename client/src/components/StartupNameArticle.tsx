import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function StartupNameArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          Startup Naming Guide: Strategies, Examples & Best Practices
        </h2>

        <ArticleSection title="Why Your Startup Name Matters">
          <p>Your startup name is often the very first thing investors, customers, and partners encounter. It shapes first impressions within seconds and sets the tone for every interaction that follows.</p>
          <p><strong>Fundraising Impact:</strong> Investors see thousands of pitches. A memorable, brandable name makes your startup stick in their minds long after the meeting ends. Names that are easy to say and spell get shared more often in investor circles.</p>
          <p><strong>Customer Perception:</strong> Your name signals what kind of company you are before anyone reads a single line of copy. A playful name suggests approachability; a technical name implies expertise. The right name attracts your ideal customers and repels those who aren't a fit.</p>
          <p><strong>Domain and SEO Impact:</strong> In the digital age, your startup name directly affects your online presence. A name with an available .com domain carries more authority. Names that are unique and brandable tend to rank faster in search engines because they face less keyword competition.</p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>Key Insight:</strong> Research shows that startups with memorable, easy-to-pronounce names raise 10-15% more in early funding rounds compared to those with complex or forgettable names.</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Qualities of Great Startup Names">
          <p>The best startup names share several key qualities that make them effective:</p>
          <ul className="space-y-3 text-slate-600">
            <li><strong className="text-slate-800">Memorable:</strong> A great name sticks in people's minds after hearing it just once. Think of how easily you remember names like Slack, Stripe, or Zoom.</li>
            <li><strong className="text-slate-800">Brandable:</strong> The name should be distinctive enough to own. Generic names like "Fast Delivery App" can never become true brands the way Uber or Lyft have.</li>
            <li><strong className="text-slate-800">Easy to Spell and Pronounce:</strong> If people can't spell your name after hearing it, you'll lose word-of-mouth referrals. If they can't pronounce it after reading it, they won't talk about you.</li>
            <li><strong className="text-slate-800">Available Domain:</strong> In today's market, having a matching .com domain (or a strong alternative like .io or .ai) is essential for credibility and discoverability.</li>
            <li><strong className="text-slate-800">Scalable:</strong> Your name should grow with your company. "San Francisco Pet Sitting" limits you geographically and by service. A name like "Rover" scales infinitely.</li>
            <li><strong className="text-slate-800">Timeless:</strong> Avoid trendy naming conventions that will feel dated in five years. Names built on current slang or fads lose their appeal quickly.</li>
            <li><strong className="text-slate-800">Legally Available:</strong> Before falling in love with a name, verify it's not trademarked in your industry. Legal conflicts can force expensive rebrands.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Startup Naming Strategies">
          <p>There are several proven strategies for creating startup names, each with distinct advantages:</p>

          <h4 className="font-bold text-slate-800 mt-4">Compound Words</h4>
          <p>Combine two familiar words to create something new. Examples: Dropbox, YouTube, Facebook, Snapchat.</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Pros:</strong> Immediately meaningful, easy to understand, descriptive of product function</li>
            <li><strong>Cons:</strong> Harder to find available domains, can feel less unique</li>
          </ul>

          <h4 className="font-bold text-slate-800 mt-4">Invented Words</h4>
          <p>Create entirely new words that sound appealing. Examples: Spotify, Kodak, Xerox, Hulu.</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Pros:</strong> Highly unique, domains more likely available, strong trademark protection</li>
            <li><strong>Cons:</strong> No inherent meaning, requires more marketing to build recognition</li>
          </ul>

          <h4 className="font-bold text-slate-800 mt-4">Descriptive Names</h4>
          <p>Names that describe what the product does. Examples: Salesforce, Shopify, Booking.com, Grammarly.</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Pros:</strong> Instant clarity about the product, good for SEO, low marketing effort needed</li>
            <li><strong>Cons:</strong> Can limit future pivots, harder to differentiate, may feel generic</li>
          </ul>

          <h4 className="font-bold text-slate-800 mt-4">Metaphorical Names</h4>
          <p>Use a metaphor to evoke qualities of the brand. Examples: Amazon (vast), Apple (approachable), Oracle (wisdom), Jaguar (speed).</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Pros:</strong> Rich with meaning, emotionally resonant, highly memorable</li>
            <li><strong>Cons:</strong> Connection may not be obvious, can confuse if metaphor is too abstract</li>
          </ul>

          <h4 className="font-bold text-slate-800 mt-4">Portmanteau Names</h4>
          <p>Blend parts of two words into one. Examples: Instagram (instant + telegram), Pinterest (pin + interest), Microsoft (microcomputer + software).</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Pros:</strong> Creative and clever, combines meanings, often sounds natural</li>
            <li><strong>Cons:</strong> Can feel forced if not done well, may be hard to spell</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Domain Name Considerations">
          <p>Your domain name is your digital address. Choosing the right one is critical for credibility and growth.</p>

          <h4 className="font-bold text-slate-800 mt-4">Best TLDs for Startups</h4>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>.com</strong> — The gold standard. Carries the most trust and recognition worldwide.</li>
            <li><strong>.io</strong> — Popular with tech startups. Signals innovation and developer focus.</li>
            <li><strong>.ai</strong> — Ideal for AI and machine learning startups. Growing in recognition.</li>
            <li><strong>.co</strong> — A solid alternative to .com. Used by companies like Angel.co.</li>
            <li><strong>.app</strong> — Great for mobile-first or application-based startups.</li>
          </ul>

          <h4 className="font-bold text-slate-800 mt-4">Strategies When .com Is Unavailable</h4>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Add a prefix:</strong> getslack.com, tryfigma.com, usezoom.com</li>
            <li><strong>Use a different TLD:</strong> notion.so, linear.app, vercel.com</li>
            <li><strong>Modify the name slightly:</strong> Add "hq," "app," or "labs" as a suffix</li>
            <li><strong>Negotiate to buy:</strong> Many premium domains can be acquired through brokers</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Testing Your Startup Name">
          <p>Before committing to a name, run it through the 7-Second Test. A great startup name should pass all seven checks:</p>
          <div className="space-y-3 my-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="font-semibold text-slate-800 text-sm mb-1">1. The Spell Test</p>
              <p className="text-sm text-slate-600">Can someone spell it correctly after hearing it once? Say your name aloud to 10 people and ask them to write it down.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="font-semibold text-slate-800 text-sm mb-1">2. The Memory Test</p>
              <p className="text-sm text-slate-600">Tell someone your startup name. Ask them 24 hours later if they remember it. If they can't, it's not sticky enough.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="font-semibold text-slate-800 text-sm mb-1">3. The Professional Test</p>
              <p className="text-sm text-slate-600">Does it sound credible in a boardroom? Would a Fortune 500 company take a meeting with a startup by this name?</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="font-semibold text-slate-800 text-sm mb-1">4. The Pronunciation Test</p>
              <p className="text-sm text-slate-600">Can people pronounce it correctly on the first try, in any English-speaking country?</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="font-semibold text-slate-800 text-sm mb-1">5. The Business Card Test</p>
              <p className="text-sm text-slate-600">Does it look good printed on a business card? Is it short enough to fit comfortably on branded materials?</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="font-semibold text-slate-800 text-sm mb-1">6. The Investor Test</p>
              <p className="text-sm text-slate-600">Would you feel proud saying this name in a pitch meeting? Does it convey ambition and professionalism?</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="font-semibold text-slate-800 text-sm mb-1">7. The Global Test</p>
              <p className="text-sm text-slate-600">Does the name work across cultures? Check for unintended meanings in major world languages before committing.</p>
            </div>
          </div>
        </ArticleSection>

        <ArticleSection title="Common Naming Mistakes">
          <ul className="space-y-3 text-slate-600">
            <li><strong className="text-slate-800">Too Generic:</strong> Names like "Tech Solutions" or "Smart App" are impossible to brand, rank for, or trademark. They blend into the noise.</li>
            <li><strong className="text-slate-800">Too Similar to Competitors:</strong> If your name sounds like an existing company in your space, you'll constantly be confused with them and may face legal challenges.</li>
            <li><strong className="text-slate-800">Impossible to Spell:</strong> Creative spelling (replacing "i" with "y" or dropping vowels) can backfire. If users can't type your URL correctly, you lose traffic.</li>
            <li><strong className="text-slate-800">Negative Connotations:</strong> Always research what your name might mean in other languages or subcultures. What sounds great in English might be offensive elsewhere.</li>
            <li><strong className="text-slate-800">Too Limiting:</strong> "Portland Organic Dog Treats" locks you into a geography, niche, and product. Choose a name that allows room to grow.</li>
            <li><strong className="text-slate-800">Hard to Pronounce:</strong> If people stumble over your name, they won't recommend you. Word of mouth depends on words that are easy to say.</li>
            <li><strong className="text-slate-800">Trademark Conflicts:</strong> Using a name that's already trademarked can result in costly legal battles and forced rebranding at the worst possible time.</li>
            <li><strong className="text-slate-800">Cultural Insensitivity:</strong> Names that reference specific cultures, traditions, or languages without understanding can alienate potential customers and create PR crises.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Industry-Specific Naming Tips">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <h5 className="font-bold text-sm text-slate-800 mb-2">Tech / SaaS</h5>
              <ul className="text-sm text-slate-600 space-y-1 list-disc pl-4">
                <li>Short, punchy names work best (Slack, Zoom, Notion)</li>
                <li>Consider .io or .ai domains</li>
                <li>Invented words signal innovation</li>
                <li>Avoid overly technical jargon</li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <h5 className="font-bold text-sm text-slate-800 mb-2">E-commerce</h5>
              <ul className="text-sm text-slate-600 space-y-1 list-disc pl-4">
                <li>Names should feel trustworthy and approachable</li>
                <li>Consider names that hint at the shopping experience</li>
                <li>Alliterative names are highly memorable</li>
                <li>A .com domain is especially important for consumer trust</li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <h5 className="font-bold text-sm text-slate-800 mb-2">Healthcare</h5>
              <ul className="text-sm text-slate-600 space-y-1 list-disc pl-4">
                <li>Names must convey trust and professionalism</li>
                <li>Avoid names that sound too casual or playful</li>
                <li>Latin or Greek roots can add authority</li>
                <li>Ensure compliance with industry naming regulations</li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <h5 className="font-bold text-sm text-slate-800 mb-2">FinTech</h5>
              <ul className="text-sm text-slate-600 space-y-1 list-disc pl-4">
                <li>Balance innovation with trustworthiness</li>
                <li>Names like Stripe and Square suggest simplicity</li>
                <li>Avoid names that sound risky or unstable</li>
                <li>Consider regulatory implications of your name</li>
              </ul>
            </div>
          </div>
        </ArticleSection>

        <ArticleSection title="After You Choose Your Name">
          <p>Once you've settled on the perfect name, move quickly to secure it across all channels:</p>
          <div className="space-y-3 my-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="font-semibold text-slate-800 text-sm mb-1">1. Register Your Domain</p>
              <p className="text-sm text-slate-600">Secure the .com first, then grab relevant alternatives (.io, .ai, .co). Consider common misspellings too.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="font-semibold text-slate-800 text-sm mb-1">2. Claim Social Media Handles</p>
              <p className="text-sm text-slate-600">Reserve your name on Twitter/X, LinkedIn, Instagram, Facebook, TikTok, and GitHub. Consistency across platforms builds brand recognition.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="font-semibold text-slate-800 text-sm mb-1">3. File for Trademark</p>
              <p className="text-sm text-slate-600">Start with a trademark search on USPTO (or your country's equivalent). File your application early to protect your brand.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="font-semibold text-slate-800 text-sm mb-1">4. Register Your Business Name</p>
              <p className="text-sm text-slate-600">Register your business name with your state or local government. This provides legal protection in your operating jurisdiction.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="font-semibold text-slate-800 text-sm mb-1">5. Create Brand Guidelines</p>
              <p className="text-sm text-slate-600">Document how your name should be written (capitalization, spacing), your logo usage, brand colors, and voice guidelines.</p>
            </div>
          </div>
        </ArticleSection>

        <div className="mt-10 bg-gradient-primary rounded-2xl p-6 md:p-8 text-center">
          <h3 className="text-xl font-display font-bold text-white mb-2">Ready to Find Your Startup Name?</h3>
          <p className="text-purple-100 text-sm mb-4">Use the free AI Startup Name Generator above to instantly discover 30+ brandable names with meanings and analysis tailored to your business.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-purple-700 bg-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-sm"
            data-testid="button-scroll-to-tool"
          >
            Start Generating Names &uarr;
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
        data-testid={`button-section-${title.toLowerCase().replace(/\s+/g, "-")}`}
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
