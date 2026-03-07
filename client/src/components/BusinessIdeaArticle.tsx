import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function BusinessIdeaArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          Business Idea Guide: How to Find, Validate & Launch Profitable Ideas
        </h2>

        <ArticleSection title="Why Most People Fail to Find Good Business Ideas">
          <p>Finding a viable business idea is one of the biggest hurdles aspiring entrepreneurs face. But the problem usually isn't a lack of ideas -- it's falling into common traps that derail the process before it even begins.</p>
          <h4 className="font-bold text-slate-800 mt-4">Waiting for the "Perfect" Idea</h4>
          <p>Many people never start because they're waiting for a groundbreaking, never-before-seen concept. The reality is that most successful businesses aren't revolutionary -- they simply execute well on solving a real problem. Uber didn't invent taxis; Airbnb didn't invent lodging. They improved on existing models.</p>
          <h4 className="font-bold text-slate-800 mt-4">Following Trends Blindly</h4>
          <p>Jumping on the latest trend without understanding the underlying market dynamics is a recipe for failure. By the time a trend is mainstream, the window for easy entry has often closed. Instead, look for emerging needs rather than copying what's already saturated.</p>
          <h4 className="font-bold text-slate-800 mt-4">Ignoring Your Own Skills</h4>
          <p>The best business ideas leverage what you already know and can do. Starting a tech company when you have no technical background (and no technical co-founder) dramatically increases your risk. Your skills are your unfair advantage -- use them.</p>
          <h4 className="font-bold text-slate-800 mt-4">Not Validating Before Building</h4>
          <p>Building a product nobody wants is the most expensive mistake in entrepreneurship. Too many founders spend months (or years) building before confirming there's actual demand. Validation should come before investment.</p>
        </ArticleSection>

        <ArticleSection title="What Makes a Good Business Idea?">
          <p>Not all business ideas are created equal. The strongest ideas share several key characteristics:</p>
          <ul className="space-y-3 text-slate-600">
            <li><strong className="text-slate-800">Solves a Real Problem:</strong> The best businesses address genuine pain points. If people are actively searching for solutions, spending money on alternatives, or complaining about the status quo, there's an opportunity.</li>
            <li><strong className="text-slate-800">Has a Defined Target Market:</strong> "Everyone" is not a target market. Great ideas identify a specific group of people with a specific need. The more clearly you can define your ideal customer, the easier it is to reach them.</li>
            <li><strong className="text-slate-800">Customers Are Willing to Pay:</strong> Just because something is useful doesn't mean people will pay for it. Your idea needs to solve a problem that's painful enough (or create value that's compelling enough) for people to open their wallets.</li>
            <li><strong className="text-slate-800">You Can Deliver:</strong> Can you realistically build and deliver this product or service? Consider your skills, resources, and network. The best idea in the world means nothing if you can't execute on it.</li>
            <li><strong className="text-slate-800">Scalable Potential:</strong> While not every business needs to become a billion-dollar company, having room to grow beyond just you is important for long-term viability and value creation.</li>
            <li><strong className="text-slate-800">Competitive Advantage:</strong> What makes your approach different or better? This could be your expertise, a unique process, better technology, lower costs, or superior customer experience.</li>
            <li><strong className="text-slate-800">Matches Your Skills:</strong> Ideas that align with your existing knowledge, experience, and network have a much higher probability of success.</li>
            <li><strong className="text-slate-800">Fits Your Lifestyle:</strong> A business that requires 80-hour weeks won't work if you want work-life balance. Consider how the business model fits your desired lifestyle and commitments.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="How to Generate Business Ideas">
          <p>Generating business ideas isn't about having a sudden flash of genius. It's a systematic process that anyone can follow:</p>
          <h4 className="font-bold text-slate-800 mt-4">1. Start with Your Skills</h4>
          <p>Make a comprehensive list of everything you're good at -- professional skills, hobbies, knowledge areas, certifications. These represent your competitive advantages. A software developer might build SaaS tools. A writer might create a content agency. A fitness enthusiast might launch online coaching.</p>
          <h4 className="font-bold text-slate-800 mt-4">2. Identify Problems Around You</h4>
          <p>Pay attention to frustrations -- yours and others'. What do people complain about? What takes too long? What's too expensive? What's confusing? Every complaint is a potential business opportunity.</p>
          <h4 className="font-bold text-slate-800 mt-4">3. Follow Your Interests</h4>
          <p>Passion alone won't make a business successful, but it provides the motivation to push through hard times. Industries you're genuinely interested in are worth exploring because you'll naturally understand the customer better.</p>
          <h4 className="font-bold text-slate-800 mt-4">4. Spot Market Trends</h4>
          <p>Look at what's growing: remote work tools, AI applications, sustainability products, health and wellness, aging population services. Trends indicate where demand is heading, not just where it is today.</p>
          <h4 className="font-bold text-slate-800 mt-4">5. Improve Existing Ideas</h4>
          <p>You don't need to invent something new. Look at existing businesses and ask: How could this be faster, cheaper, more convenient, better designed, or more personalized? Many successful companies are simply better versions of what already exists.</p>
        </ArticleSection>

        <ArticleSection title="Business Idea Categories">
          <h4 className="font-bold text-slate-800 mt-2">Service-Based Businesses</h4>
          <p>Service businesses are often the fastest to launch and require the least upfront capital. You're selling your time and expertise.</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Consulting:</strong> Leverage deep expertise in a specific field to advise businesses or individuals</li>
            <li><strong>Freelancing:</strong> Offer specialized skills like writing, design, development, or marketing on a project basis</li>
            <li><strong>Agency:</strong> Build a team that delivers services at scale -- marketing agencies, development shops, design studios</li>
          </ul>

          <h4 className="font-bold text-slate-800 mt-4">Product-Based Businesses</h4>
          <p>Product businesses create tangible or digital goods that can be sold repeatedly without trading time for money.</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>Physical Products:</strong> Consumer goods, specialty items, handmade products, or white-label goods</li>
            <li><strong>Digital Products:</strong> E-books, templates, software tools, stock assets, printables</li>
            <li><strong>Subscription Boxes:</strong> Curated collections of products delivered on a recurring basis</li>
          </ul>

          <h4 className="font-bold text-slate-800 mt-4">Online/Digital Businesses</h4>
          <p>Digital businesses can often be run from anywhere with an internet connection and scale without proportional cost increases.</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li><strong>SaaS (Software as a Service):</strong> Subscription-based software tools solving specific problems</li>
            <li><strong>Online Courses:</strong> Package your expertise into structured learning experiences</li>
            <li><strong>Membership Sites:</strong> Gated communities with exclusive content, networking, or resources</li>
          </ul>

          <h4 className="font-bold text-slate-800 mt-4">Local Business Ideas</h4>
          <p>Local businesses serve a specific geographic area and often benefit from less online competition and stronger customer relationships.</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Home services (cleaning, landscaping, handyman)</li>
            <li>Food trucks or specialty food businesses</li>
            <li>Personal training or wellness studios</li>
            <li>Pet care services</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="Low-Cost Business Ideas">
          <p>You don't need a fortune to start a business. Here are 10 ideas you can launch for under $1,000:</p>
          <ol className="list-decimal pl-5 space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Freelance Writing or Copywriting</strong> -- Start with a portfolio website and pitch to businesses needing content.</li>
            <li><strong className="text-slate-800">Social Media Management</strong> -- Help local businesses manage their online presence for a monthly retainer.</li>
            <li><strong className="text-slate-800">Virtual Assistant Services</strong> -- Offer administrative, scheduling, and organizational support remotely.</li>
            <li><strong className="text-slate-800">Online Tutoring</strong> -- Teach subjects you excel in through video calls and digital materials.</li>
            <li><strong className="text-slate-800">Print-on-Demand Store</strong> -- Design products that are only printed and shipped when customers order.</li>
            <li><strong className="text-slate-800">Bookkeeping Services</strong> -- Help small businesses manage their finances with affordable software tools.</li>
            <li><strong className="text-slate-800">Web Design for Small Businesses</strong> -- Create professional websites using modern no-code or low-code platforms.</li>
            <li><strong className="text-slate-800">Pet Sitting and Dog Walking</strong> -- Build a local client base through referrals and online platforms.</li>
            <li><strong className="text-slate-800">Digital Course Creation</strong> -- Package your expertise into a self-paced online course.</li>
            <li><strong className="text-slate-800">Reselling and Flipping</strong> -- Buy undervalued items and resell them on marketplaces for a profit.</li>
          </ol>
        </ArticleSection>

        <ArticleSection title="Validating Your Business Idea">
          <p>Before investing significant time or money, validate your idea with real-world evidence:</p>
          <h4 className="font-bold text-slate-800 mt-4">Market Research</h4>
          <p>Search for existing competitors, analyze their reviews, and look for gaps in the market. Use tools like Google Trends to see if demand is growing. Check forums, Reddit, and social media to understand what your target audience is saying about the problem you want to solve.</p>
          <h4 className="font-bold text-slate-800 mt-4">Talk to Potential Customers</h4>
          <p>Nothing beats direct conversations. Interview 10-20 people who fit your target market. Ask about their pain points, how they currently solve the problem, and what they'd pay for a better solution. Listen more than you pitch.</p>
          <h4 className="font-bold text-slate-800 mt-4">Build an MVP (Minimum Viable Product)</h4>
          <p>Create the simplest possible version of your product or service that delivers core value. This might be a landing page with a signup form, a manual version of an automated service, or a basic prototype. The goal is to test demand with minimal investment.</p>
          <h4 className="font-bold text-slate-800 mt-4">Financial Validation</h4>
          <p>Run the numbers. Calculate your expected costs, pricing, and break-even point. Can you realistically acquire customers at a cost that leaves room for profit? Are your revenue projections based on reasonable assumptions?</p>
        </ArticleSection>

        <ArticleSection title="Common Business Idea Mistakes">
          <ul className="space-y-3 text-slate-600">
            <li><strong className="text-slate-800">Skipping Market Research:</strong> Assuming people want your product without evidence is the number one reason startups fail. Always validate demand before building.</li>
            <li><strong className="text-slate-800">Being Too Broad:</strong> Trying to serve everyone means you serve no one well. Start narrow, dominate a niche, then expand.</li>
            <li><strong className="text-slate-800">Ignoring Competition:</strong> Competition isn't bad -- it proves there's a market. But ignoring your competitors means you won't understand how to differentiate.</li>
            <li><strong className="text-slate-800">Underestimating Costs:</strong> Most new businesses underestimate expenses by 50% or more. Account for marketing, tools, taxes, insurance, and unexpected costs.</li>
            <li><strong className="text-slate-800">No Unique Value Proposition:</strong> If you can't clearly explain why someone should choose you over alternatives, you'll struggle to attract and retain customers.</li>
            <li><strong className="text-slate-800">Perfectionism:</strong> Waiting until everything is "perfect" before launching means you'll never launch. Done is better than perfect. You can iterate and improve based on real feedback.</li>
            <li><strong className="text-slate-800">Wrong Pricing:</strong> Pricing too low undervalues your offering and makes profitability difficult. Pricing too high without demonstrating value loses customers. Research your market and test different price points.</li>
          </ul>
        </ArticleSection>

        <ArticleSection title="From Idea to Business">
          <p>Once you've identified and validated a promising idea, follow this action plan to bring it to life:</p>
          <ol className="list-decimal pl-5 space-y-3 text-slate-600">
            <li><strong className="text-slate-800">Choose Your Idea:</strong> Pick the idea that best combines your skills, market demand, and personal motivation. Don't overthink it -- you can always pivot later.</li>
            <li><strong className="text-slate-800">Validate with Real People:</strong> Before spending money, confirm that real people want what you're offering. Get pre-orders, signups, or letters of intent.</li>
            <li><strong className="text-slate-800">Create a Simple Business Plan:</strong> Outline your target market, value proposition, revenue model, marketing strategy, and financial projections. Keep it to one or two pages.</li>
            <li><strong className="text-slate-800">Register Your Business:</strong> Choose a business structure (sole proprietor, LLC, etc.), register your business name, and handle any necessary permits or licenses.</li>
            <li><strong className="text-slate-800">Build Your MVP:</strong> Create the minimum viable version of your product or service. Focus on delivering the core value proposition without unnecessary features.</li>
            <li><strong className="text-slate-800">Get Your First Customers:</strong> Use your network, social media, content marketing, or direct outreach to land your first 10 customers. Early customers provide invaluable feedback.</li>
            <li><strong className="text-slate-800">Iterate and Scale:</strong> Use customer feedback to improve your offering. Once you have a repeatable process for acquiring and serving customers, invest in scaling.</li>
          </ol>
        </ArticleSection>

        <div className="mt-10 bg-gradient-primary rounded-2xl p-6 md:p-8 text-center">
          <h3 className="text-xl font-display font-bold text-white mb-2">Ready to Discover Your Next Business?</h3>
          <p className="text-purple-100 text-sm mb-4">Use the free AI Business Idea Generator above to instantly get personalized business ideas with viability scores and action plans tailored to your skills and budget.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-purple-700 bg-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-sm"
            data-testid="button-scroll-to-tool"
          >
            Generate Business Ideas &uarr;
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
