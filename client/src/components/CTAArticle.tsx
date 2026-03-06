import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function CTAArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          Call-to-Action Guide: Examples, Best Practices & Psychology
        </h2>

        <ArticleSection title="What is a Call-to-Action (CTA)?">
          <p>A call-to-action (CTA) is a prompt that tells your audience exactly what action you want them to take next. Whether it's "Buy Now," "Sign Up Free," or "Download the Guide," CTAs are the bridge between interest and conversion.</p>
          <p>In marketing, CTAs appear everywhere: landing pages, emails, social media ads, blog posts, and sales materials. They're the final push that transforms passive readers into active customers.</p>
          <p><strong>The difference between a good CTA and a great CTA can mean the difference between 2% and 10% conversion rates.</strong></p>
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg my-4">
            <p className="text-purple-800 mb-0 text-sm"><strong>CTA vs Tagline vs Slogan:</strong> A tagline represents your brand ("Just Do It"), a slogan is campaign-specific ("Because You're Worth It"), but a CTA prompts immediate action ("Start Your Free Trial Today").</p>
          </div>
        </ArticleSection>

        <ArticleSection title="Anatomy of a High-Converting CTA">
          <p>Great CTAs aren't accidents — they're engineered using proven psychological principles:</p>
          <h4 className="font-bold text-slate-800 mt-4">1. Action Verbs</h4>
          <p>Every high-converting CTA starts with a strong verb: <strong>Start, Get, Claim, Join, Discover, Unlock, Download.</strong> Avoid weak verbs like "learn more" or "click here."</p>
          <h4 className="font-bold text-slate-800 mt-4">2. Value Proposition</h4>
          <p>Your CTA should clearly communicate what the user gets. Compare "Submit" (vague) vs "Get Your Free Marketing Plan" (clear benefit).</p>
          <h4 className="font-bold text-slate-800 mt-4">3. Urgency and Scarcity</h4>
          <p>Time-based urgency ("Get 50% Off Today Only"), quantity scarcity ("Only 3 Spots Left"), and FOMO ("Don't Miss This Limited Offer") all motivate immediate action.</p>
          <h4 className="font-bold text-slate-800 mt-4">4. Risk Removal</h4>
          <p>Reducing perceived risk increases conversions: "Start Your Free Trial," "Try It Risk-Free for 30 Days," "No Credit Card Required."</p>
          <h4 className="font-bold text-slate-800 mt-4">5. Specificity</h4>
          <p>Specific CTAs convert better. "See How We Increased Sales by 47%" beats "Learn More" every time.</p>
        </ArticleSection>

        <ArticleSection title="CTA Examples by Platform">
          <h4 className="font-bold text-slate-800 mt-2">Email CTAs</h4>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Download Your Free Resource Here</li>
            <li>Yes, Send Me the Checklist</li>
            <li>Book Your Free Strategy Call</li>
            <li>Claim Your Exclusive Discount</li>
            <li>See What's New</li>
          </ul>
          <p className="text-sm text-slate-500 mt-2"><strong>Pro tip:</strong> Use first-person CTAs in emails ("Get My Free Trial" instead of "Get Your Free Trial"). Studies show first-person CTAs can increase clicks by up to 90%.</p>

          <h4 className="font-bold text-slate-800 mt-4">Landing Page CTAs</h4>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Start Your Free 14-Day Trial</li>
            <li>Get Instant Access Now</li>
            <li>Join 50,000+ Happy Customers</li>
            <li>Get Your Personalized Plan</li>
            <li>Don't Miss Out - Start Free Today</li>
          </ul>

          <h4 className="font-bold text-slate-800 mt-4">Social Media Ad CTAs</h4>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Shop Now and Save 40%</li>
            <li>Get Your Free Quote</li>
            <li>Download the App</li>
            <li>Register for Our Webinar</li>
            <li>Get Early Access</li>
          </ul>

          <h4 className="font-bold text-slate-800 mt-4">Sales Email CTAs</h4>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>See How [Company] Solved This Problem</li>
            <li>Schedule Your Personalized Demo</li>
            <li>Let's Get You Started Today</li>
            <li>Secure Your Discount Before Friday</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="CTA Psychology & Conversion Principles">
          <p><strong>Action-Oriented Language:</strong> Our brains respond to action words. "Get instant access now" beats "More information available here."</p>
          <p><strong>First-Person vs Second-Person:</strong> Research shows "Get My Free Trial" often outperforms "Get Your Free Trial" — the user takes ownership.</p>
          <p><strong>Urgency and Scarcity:</strong> We're wired to avoid loss. "Offer Ends Tonight," "Only 5 Left in Stock," and "Limited to First 100 Customers" tap into this.</p>
          <p><strong>Benefit Clarity:</strong> Your CTA should make the benefit crystal clear. "Get Your Free SEO Audit" beats "Submit Form."</p>
          <p><strong>Friction Reduction:</strong> Every extra click reduces conversions. Phrases like "No credit card required" and "Setup in under 2 minutes" address objections proactively.</p>
        </ArticleSection>

        <ArticleSection title="Common CTA Mistakes to Avoid">
          <ul className="space-y-3 text-slate-600">
            <li><strong className="text-slate-800">Vague CTAs:</strong> "Learn More" doesn't give users a compelling reason to click. Be specific about the outcome.</li>
            <li><strong className="text-slate-800">Too Many CTAs:</strong> Multiple CTAs create decision paralysis. Focus on one primary action per page.</li>
            <li><strong className="text-slate-800">Misaligned CTAs:</strong> Match your CTA to where the user is in their journey. A blog reader shouldn't see "Buy Now for $997."</li>
            <li><strong className="text-slate-800">No Value Proposition:</strong> "Click Here" tells users nothing about what they'll get.</li>
            <li><strong className="text-slate-800">Buried CTAs:</strong> Make CTAs visually distinct, above the fold, and mobile-optimized.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Power Words for CTAs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <h5 className="font-bold text-sm text-orange-600 mb-2">Urgency Words</h5>
              <p className="text-sm text-slate-600">Now, Today, Immediately, Instant, Fast, Hurry, Limited, Last Chance, Deadline, Don't Miss</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <h5 className="font-bold text-sm text-emerald-600 mb-2">Value Words</h5>
              <p className="text-sm text-slate-600">Free, Save, Bonus, Exclusive, Premium, Guaranteed, Proven, Best, Ultimate</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <h5 className="font-bold text-sm text-purple-600 mb-2">Action Words</h5>
              <p className="text-sm text-slate-600">Get, Start, Join, Unlock, Claim, Grab, Discover, Try, Access, Download, Build</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <h5 className="font-bold text-sm text-blue-600 mb-2">Trust Words</h5>
              <p className="text-sm text-slate-600">Guaranteed, Certified, Verified, Tested, Proven, Trusted, Secure, Expert, Professional</p>
            </div>
          </div>
        </ArticleSection>

        <ArticleSection title="CTA Formulas That Work">
          <div className="space-y-3 text-slate-600">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="font-semibold text-slate-800 text-sm mb-1">Formula 1: [Action Verb] + [Benefit]</p>
              <p className="text-sm">"Start Saving Money Today" &middot; "Get Better Results Now" &middot; "Unlock Premium Features"</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="font-semibold text-slate-800 text-sm mb-1">Formula 2: [Action] + [Value Prop] + [Urgency]</p>
              <p className="text-sm">"Download Your Free Guide Before Friday" &middot; "Start Your 14-Day Trial Today"</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="font-semibold text-slate-800 text-sm mb-1">Formula 3: [Action] + [Specific Outcome]</p>
              <p className="text-sm">"Join 10,000+ Happy Customers" &middot; "Build Your First Campaign in 5 Minutes"</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="font-semibold text-slate-800 text-sm mb-1">Formula 4: [Question] + [Answer Action]</p>
              <p className="text-sm">"Ready to Grow? Get Started Free" &middot; "Want Better Results? Try It Now"</p>
            </div>
          </div>
        </ArticleSection>

        <ArticleSection title="Industry-Specific CTA Examples">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <h5 className="font-bold text-sm text-slate-800 mb-2">E-commerce</h5>
              <ul className="text-sm text-slate-600 space-y-1 list-disc pl-4">
                <li>Add to Cart</li>
                <li>Buy Now and Save 30%</li>
                <li>Get Free Shipping Today</li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <h5 className="font-bold text-sm text-slate-800 mb-2">SaaS</h5>
              <ul className="text-sm text-slate-600 space-y-1 list-disc pl-4">
                <li>Start Your Free Trial</li>
                <li>See It in Action</li>
                <li>Join 50,000+ Users</li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <h5 className="font-bold text-sm text-slate-800 mb-2">Service Business</h5>
              <ul className="text-sm text-slate-600 space-y-1 list-disc pl-4">
                <li>Book Your Free Consultation</li>
                <li>Get Your Custom Quote</li>
                <li>Talk to an Expert</li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <h5 className="font-bold text-sm text-slate-800 mb-2">B2B</h5>
              <ul className="text-sm text-slate-600 space-y-1 list-disc pl-4">
                <li>Request a Demo</li>
                <li>Download the Whitepaper</li>
                <li>See Enterprise Pricing</li>
              </ul>
            </div>
          </div>
        </ArticleSection>

        <div className="mt-10 bg-gradient-primary rounded-2xl p-6 md:p-8 text-center">
          <h3 className="text-xl font-display font-bold text-white mb-2">Ready to Generate Your Own CTAs?</h3>
          <p className="text-purple-100 text-sm mb-4">Use the free AI Call-to-Action Generator above to instantly create 15-20 high-converting CTAs customized for your campaign.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-purple-700 bg-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-sm"
            data-testid="button-scroll-to-tool"
          >
            Start Generating CTAs &uarr;
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
