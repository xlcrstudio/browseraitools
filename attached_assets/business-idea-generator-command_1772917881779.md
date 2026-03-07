

## Complete Build Command for browseraitools.com

```
Create a mobile-first, SEO-optimized AI Business Idea Generator for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI Business Idea Generator
URL Slug: /ai-business-idea-generator
Tagline: "Discover Your Next Business Opportunity"
Mission: Help entrepreneurs discover profitable, actionable business ideas

=== PRODUCT OVERVIEW ===
Fourth-highest traffic tool (100,000 monthly searches).
Purpose: Generate creative, viable business ideas with validation framework and next steps.
Target Users: Aspiring entrepreneurs, side hustlers, innovators, students, career changers
Search Demand: ~100,000 monthly searches
Key Value: 25+ validated business ideas with action plans in seconds

=== UNIQUE SELLING POINTS ===
✅ Personalized to skills, budget, interests
✅ Viability scoring (market demand, competition, startup costs)
✅ Step-by-step action plan for each idea
✅ Revenue model suggestions
✅ Market size estimates
✅ Startup cost estimates
✅ Time-to-launch estimates
✅ Similar successful businesses as examples
✅ Save and compare favorite ideas

===  TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (saved ideas, favorites, user profile)
Export: PDF business plan outline, CSV idea list
Deployment: Vercel/Netlify

=== PAGE STRUCTURE ===

HERO SECTION:
Headline: "AI Business Idea Generator"
Subheadline: "Discover profitable business ideas tailored to your skills, budget, and interests. Get 25+ validated ideas with action plans. Free, private, AI-powered."
Trust Badges:
- 💡 25+ Personalized Ideas
- 💰 Viability Scoring
- 📋 Action Plans Included
- 📊 Market Analysis
- 🚀 Launch Roadmap
- 🔒 100% Private

Success Counter: "Generated 34,567 business ideas this month"

=== INPUT FORM ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR BACKGROUND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 1: Your Skills & Experience*
- Textarea
- Placeholder: "What are you good at? What's your professional background?
Examples:
• Marketing and social media
• Software development and coding
• Graphic design and creative work
• Sales and customer service
• Writing and content creation
• Teaching and training"
- Max: 500 chars
- Required
- Help text: "More detail = better-matched ideas"

Field 2: Your Interests/Passions
- Textarea
- Placeholder: "What topics or industries excite you?
Examples:
• Health and wellness
• Sustainability and environment
• Technology and AI
• Food and cooking
• Travel and adventure
• Education and learning"
- Max: 300 chars
- Optional but recommended

Field 3: Available Time*
- Radio buttons:
  ○ Part-time/Side Hustle (10-20 hrs/week)
  ○ Full-time commitment (40+ hrs/week)
  ○ Flexible (can adjust based on idea)
- Required

Field 4: Startup Budget*
- Dropdown:
  • Minimal ($0-$500) - bootstrap, no investment
  • Low ($500-$5,000) - small investment
  • Medium ($5,000-$25,000) - moderate capital
  • High ($25,000-$100,000) - significant investment
  • Very High ($100,000+) - venture-scale
  • Flexible (depends on opportunity)
- Required
- Default: Low

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUSINESS PREFERENCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 5: Business Model Preference (Multi-select)
- Checkboxes:
  ☑ Online/Digital Business
  ☑ Service-Based Business
  ☐ Product-Based Business
  ☐ Local/Physical Location
  ☐ B2B (Business to Business)
  ☐ B2C (Business to Consumer)
  ☐ Subscription/Recurring Revenue
  ☐ Marketplace/Platform
- Can select multiple
- Default: Online, Service-based

Field 6: Industry/Market Interest (Multi-select)
- Pills/tags (select up to 5):
  • Technology & Software
  • E-commerce & Retail
  • Health & Wellness
  • Education & Training
  • Marketing & Advertising
  • Food & Beverage
  • Finance & Investing
  • Sustainability/Green
  • Entertainment & Media
  • Real Estate
  • Professional Services
  • Home Services
  • Fashion & Beauty
  • Travel & Hospitality
  • Fitness & Sports
  • Any/Open to all

Field 7: Risk Tolerance*
- Slider or radio:
  ○ Low Risk (Proven models, low investment)
  ○ Medium Risk (Some innovation, moderate investment)
  ○ High Risk (Innovative/disruptive, higher potential)
- Default: Medium

Field 8: Timeline to Profitability
- Dropdown:
  • Quick wins (1-3 months)
  • Short-term (3-6 months)
  • Medium-term (6-12 months) [DEFAULT]
  • Long-term (12+ months, willing to build)
  • Flexible

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADDITIONAL PREFERENCES (Optional)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 9: Special Considerations
- Checkboxes:
  ☐ Must be location-independent
  ☐ Environmentally sustainable
  ☐ Social impact focused
  ☐ Can work solo (no employees needed)
  ☐ Scalable to large business
  ☐ Low competition preferred

Field 10: Ideas to Avoid
- Text input
- Placeholder: "Any types of businesses you definitely don't want? (e.g., food service, consulting, drop shipping)"
- Max: 200 chars

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATE BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-width gradient button
Text: "Generate Business Ideas"
Icon: 💡
Loading: "Analyzing your profile... Matching opportunities... Creating action plans..."

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULTS OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Your Personalized Business Ideas (25 Generated)"

Summary Cards:
┌────────────────────┐ ┌────────────────────┐
│ High Viability (8) │ │ Quick Launch (12)  │
│ 85+ score         │ │ 1-3 months        │
└────────────────────┘ └────────────────────┘

┌────────────────────┐ ┌────────────────────┐
│ Low Investment(15) │ │ Online-Only (18)   │
│ Under $5k         │ │ Location-free     │
└────────────────────┘ └────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILTERS & SORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Sort by:
  • Viability Score (High to Low) [DEFAULT]
  • Startup Cost (Low to High)
  • Time to Launch (Fast to Slow)
  • Profit Potential (High to Low)
  • Difficulty (Easy to Hard)

- Filter by:
  • Budget: All | Under $500 | Under $5k | Under $25k
  • Model: All | Online | Service | Product | Local
  • Timeline: All | Quick (1-3mo) | Medium (3-6mo) | Long (6+mo)
  • Difficulty: All | Easy | Medium | Hard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUSINESS IDEA CARDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each idea displayed as expandable card:

┌────────────────────────────────────────────────────┐
│ 💡 AI-Powered Resume Writing Service                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                    │
│ Viability Score: 87/100 🟢 High                   │
│                                                    │
│ ┌──────────┬─────────────┬──────────┬───────────┐ │
│ │💰 Budget │ ⏱️ Timeline │ 📈 Revenue│ 🎯 Diff  │ │
│ │  $1,500  │  2 months   │ $5k/mo   │  Medium  │ │
│ └──────────┴─────────────┴──────────┴───────────┘ │
│                                                    │
│ THE OPPORTUNITY:                                   │
│ Create a service helping job seekers create        │
│ professional, ATS-optimized resumes using AI.      │
│ Target career changers, recent grads, and          │
│ professionals seeking promotions.                  │
│                                                    │
│ WHY THIS WORKS FOR YOU:                            │
│ ✓ Matches your marketing background               │
│ ✓ Low startup costs ($1,500)                      │
│ ✓ Can start part-time                             │
│ ✓ High demand (millions job hunting monthly)      │
│ ✓ Recurring customers (career progression)        │
│                                                    │
│ [❤️ Save] [👁️ View Full Plan] [📋 Copy]          │
└────────────────────────────────────────────────────┘

EXPANDED VIEW (Click "View Full Plan"):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUSINESS PLAN OUTLINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Business: AI-Powered Resume Writing Service

EXECUTIVE SUMMARY:
Professional resume writing service leveraging AI tools to create ATS-optimized, industry-specific resumes. Target market: mid-career professionals, career changers, and recent graduates. Revenue model: tiered pricing ($99-$299 per resume) with upsells (LinkedIn optimization, cover letters, interview coaching).

MARKET ANALYSIS:

Market Size:
- 50M+ job seekers annually in US
- Resume writing market: $500M+
- Growing remote work = more job changes
- Average person job hunts every 2-3 years

Target Customer:
- Age: 25-45
- Career changers seeking better positions
- Income: $50k-$150k salary range
- Pain point: Bad resumes = no interviews
- Willing to invest in career advancement

Competition:
- TopResume, ZipJob, ResumeSpice (established)
- Freelance writers on Upwork/Fiverr
- DIY templates (Canva, Google Docs)
- Your advantage: AI efficiency + personal touch

Market Trends:
✓ ATS optimization increasingly critical
✓ Remote hiring = more competition
✓ Career changes more frequent
✓ AI tools making writers more efficient
⚠️ AI commoditization risk (stay premium)

REVENUE MODEL:

Pricing Tiers:
1. Basic Resume: $99
   - ATS-optimized single-page resume
   - One revision included
   - 48-hour turnaround

2. Professional Package: $199
   - 2-page resume + cover letter template
   - LinkedIn profile optimization guide
   - Two revisions
   - 72-hour turnaround

3. Executive Package: $299
   - Multi-page resume for senior roles
   - Custom cover letter
   - LinkedIn profile rewrite
   - Interview coaching (30 min)
   - Unlimited revisions
   - 5-day turnaround

Upsells:
- Rush delivery (+$50)
- Additional cover letters ($49 each)
- LinkedIn profile writing ($149)
- Interview coaching ($99/hr)
- Job search strategy session ($199)

Revenue Projections:
Month 1-3: 5 clients/month = $1,000/mo
Month 4-6: 15 clients/month = $3,000/mo
Month 7-12: 25 clients/month = $5,000/mo
Year 2: 50 clients/month = $10,000/mo

STARTUP COSTS:

Initial Investment: $1,500
- Website/domain ($500)
- AI tools (ChatGPT Plus, Grammarly): ($200)
- Marketing (Google Ads, Facebook): ($500)
- Legal (LLC, contracts): ($200)
- Portfolio samples: ($100)

Monthly Operating:
- AI tools: $50
- Website hosting: $25
- Marketing: $200-500
- Accounting/software: $25
Total: $300-600/month

OPERATIONS:

Service Delivery:
1. Client onboarding form (collect info)
2. Initial consultation call (30 min)
3. Draft resume using AI + templates
4. Client review and feedback
5. Revisions (1-2 rounds)
6. Final delivery + LinkedIn guide

Time per Client:
- Research/consultation: 1 hour
- Resume drafting: 2-3 hours
- Revisions: 1 hour
- Total: 4-5 hours per client

Tools & Technology:
- AI: ChatGPT, Claude (resume drafting)
- Design: Canva Pro (templates)
- CRM: HubSpot Free (client management)
- Scheduling: Calendly
- Payment: Stripe
- Website: WordPress or Squarespace

MARKETING STRATEGY:

Customer Acquisition:

1. Content Marketing (Organic):
   - Blog: "How to write a resume"
   - YouTube: Resume tips videos
   - LinkedIn: Career advice posts
   - SEO: Rank for "resume writer [city]"
   - Cost: Time investment
   - Timeline: 3-6 months for traction

2. Paid Advertising (Immediate):
   - Google Ads: "Resume writing service"
   - Facebook/Instagram: Career-focused targeting
   - LinkedIn Ads: Professional demographic
   - Budget: $500/month initially
   - Expected: 10-15 leads/month

3. Partnerships:
   - Career coaches (referral agreements)
   - LinkedIn groups (value-add participation)
   - University career centers (alumni discount)
   - Recruiting agencies (upsell their candidates)

4. Social Proof:
   - Before/after resume examples
   - Client testimonials (video preferred)
   - "Jobs landed" success stories
   - LinkedIn recommendations

Pricing: $100-300 CAC (customer acquisition cost)
Goal: 3x return on ad spend

COMPETITIVE ADVANTAGES:

1. AI-Enhanced Efficiency:
   - Deliver quality faster than competitors
   - Lower costs = competitive pricing
   - Handle more volume

2. Niche Specialization:
   - Focus on specific industries (tech, healthcare, finance)
   - Become known expert in that niche
   - Charge premium for specialization

3. Personal Touch:
   - Consultation call (not template-only)
   - Understand career goals
   - Tailored advice beyond resume

4. Value-Add Services:
   - Free LinkedIn audit with resume
   - Interview tips document
   - Salary negotiation guide
   - Job search strategy

RISK ANALYSIS:

Risks & Mitigation:

1. AI Commoditization Risk:
   - Risk: Free AI tools make DIY easy
   - Mitigation: Focus on premium service, consultation, expertise
   - Strategy: Emphasize human insight + AI efficiency

2. Market Saturation:
   - Risk: Many resume writers already exist
   - Mitigation: Niche down (tech resumes, exec resumes)
   - Strategy: Differentiate on speed, quality, specialization

3. Economic Downturn:
   - Risk: Hiring freezes = fewer job seekers
   - Mitigation: Diversify (also help with LinkedIn, interview prep)
   - Strategy: Even in recession, people need jobs

4. Client Dissatisfaction:
   - Risk: Unlimited revisions = scope creep
   - Mitigation: Clear revision policy, manage expectations
   - Strategy: Detailed intake, samples shown upfront

GROWTH ROADMAP:

Phase 1 (Months 1-3): Launch & Validate
☐ Build website and portfolio
☐ Create resume templates
☐ Acquire first 10 clients (even at discount)
☐ Collect testimonials
☐ Refine service delivery process
Goal: Prove concept, get feedback

Phase 2 (Months 4-6): Scale Marketing
☐ Launch Google Ads campaign
☐ Start content marketing (blog, YouTube)
☐ Build email list
☐ Partner with career coaches
☐ Optimize conversion funnel
Goal: Consistent 15 clients/month

Phase 3 (Months 7-12): Systematize
☐ Create SOP (standard operating procedures)
☐ Build library of templates by industry
☐ Automate intake/scheduling
☐ Hire part-time assistant
☐ Expand service offerings
Goal: 25+ clients/month, systems in place

Phase 4 (Year 2): Scale or Specialize
Option A: Hire writers, become agency
Option B: Niche into high-ticket ($500+ execs)
Option C: Productize (DIY course + templates)
Option D: All of the above

SUCCESS METRICS:

Track these KPIs:
- Clients per month
- Average transaction value
- Client satisfaction (CSAT score)
- Repeat business rate
- Referral rate
- Time per client (efficiency)
- Marketing ROI
- Client job offer rate (outcome)

Targets:
- Month 3: 5 clients, $1k revenue
- Month 6: 15 clients, $3k revenue
- Month 12: 25 clients, $5k revenue
- Year 2: 50 clients, $10k revenue

NEXT STEPS (Action Plan):

Week 1:
☐ Register business name and domain
☐ Set up business bank account
☐ Create 3 sample resume templates
☐ Build basic website (Squarespace)
☐ Set up Calendly and Stripe

Week 2-3:
☐ Write website copy and service descriptions
☐ Create client intake form
☐ Build email templates (onboarding, delivery)
☐ Set up social media profiles
☐ Create before/after portfolio samples

Week 4:
☐ Soft launch to friends/network (discounted)
☐ Ask for testimonials
☐ Start Google Ads with small budget ($200)
☐ Post on LinkedIn offering services
☐ Join relevant Facebook/LinkedIn groups

Month 2-3:
☐ Refine based on feedback
☐ Increase ad spend
☐ Start content marketing
☐ Build referral partnerships
☐ Optimize conversion rate

RESOURCES & LEARNING:

Recommended Reading:
- "The $100 Startup" by Chris Guillebeau
- Resume writing industry blogs
- ATS optimization guides
- Pricing psychology resources

Tools to Master:
- ChatGPT/Claude (resume drafting)
- Canva (design templates)
- LinkedIn (research, marketing)
- Google Analytics (track website)

Communities:
- Resume Writers Association groups
- Freelance/solopreneur communities
- Industry-specific LinkedIn groups

SIMILAR SUCCESS STORIES:

- TopResume (started as freelancer, now $50M+ revenue)
- ZipJob (bootstrapped, profitable within 6 months)
- Individual resume writers earning $100k+/year
- Many six-figure resume writing businesses

This business is proven, profitable, and matches your skills. The AI angle gives you competitive advantage in efficiency and quality.

[💾 Save Full Plan] [📄 Export PDF] [📧 Email to Me]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
END OF EXPANDED VIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

=== COMPARISON MODE ===

"Compare Your Favorites" (Select 2-4 ideas)

Side-by-side comparison table:
┌────────────────┬────────────────┬────────────────┐
│ Idea 1         │ Idea 2         │ Idea 3         │
├────────────────┼────────────────┼────────────────┤
│ Resume Service │ AI Chatbot Dev │ Digital Course │
│ Score: 87      │ Score: 82      │ Score: 78      │
│ Cost: $1,500   │ Cost: $3,000   │ Cost: $800     │
│ Time: 2 mo     │ Time: 3 mo     │ Time: 6 mo     │
│ Revenue: $5k   │ Revenue: $8k   │ Revenue: $3k   │
└────────────────┴────────────────┴────────────────┘

Strengths/Weaknesses comparison
Best fit recommendation

=== SEO ARTICLE (2000+ words) ===

Title: "How to Find a Profitable Business Idea in 2026: Complete Guide"

H2: Why Most People Fail to Find Good Business Ideas
- Common myths about business ideas
- Waiting for "perfect idea" paralysis
- Following trends blindly
- Ignoring their own skills
- Not validating before starting

H2: What Makes a Good Business Idea?

Criteria for profitable ideas:
1. Solves a real problem (pain or desire)
2. Has a defined target market
3. Customers willing to pay
4. You can deliver the solution
5. Scalable or sustainable
6. Competitive advantage possible
7. Matches your skills/interests
8. Fits your lifestyle goals

H2: How to Generate Business Ideas

Method 1: Start with Your Skills
- Inventory your experience
- Professional skills audit
- Hidden talents discovery
- Combining unique skills

Method 2: Identify Problems
- Your own pain points
- Problems you've solved
- Industry inefficiencies
- Underserved markets

Method 3: Follow Your Interests
- Passion + profit intersection
- Hobbies as businesses
- Interest-driven niches

Method 4: Spot Trends Early
- Technology trends
- Demographic shifts
- Regulatory changes
- Social movements

Method 5: Improve Existing Ideas
- Better execution
- Underserved niche
- Modern technology
- Different business model

Method 6: Franchising & Proven Models
- Buying proven concepts
- Franchise opportunities
- Licensing models

H2: Business Idea Categories

Service-Based Ideas:
- Consulting
- Freelancing
- Agency models
- Local services
Examples and starter tips for each

Product-Based Ideas:
- Physical products
- Digital products
- Subscription boxes
- Handmade goods

Online/Digital Ideas:
- SaaS products
- Mobile apps
- Online courses
- Membership sites
- Affiliate sites

Local Business Ideas:
- Retail stores
- Restaurants/food
- Home services
- Mobile businesses

H2: Low-Cost Business Ideas

25 ideas under $1,000:
1. Social media management
2. Virtual assistant services
3. Content writing/copywriting
4. Web design
5. Online tutoring
[Continue to 25 with brief descriptions]

H2: High-Profit Business Ideas

Businesses with strong margins:
- SaaS products
- Digital courses
- Consulting
- Coaching
- Information products
Why they're profitable + examples

H2: Side Hustle Ideas

Part-time business ideas:
- Freelance work
- Selling products online
- Service businesses
- Content creation
- Investment income
Balancing with full-time job

H2: Validating Your Business Idea

Before investing time/money:

Step 1: Market Research
- Google Trends analysis
- Competitor research
- Reddit/forum discussions
- Keywords search volume

Step 2: Talk to Potential Customers
- Surveys
- Interviews
- Landing page test
- Pre-sales

Step 3: MVP (Minimum Viable Product)
- Start small
- Test quickly
- Get feedback
- Iterate

Step 4: Financial Validation
- Cost estimates
- Pricing research
- Profit margin calculation
- Break-even analysis

H2: Common Business Idea Mistakes

15 mistakes to avoid:
1. No market research
2. Too broad targeting
3. Ignoring competition
4. Underestimating costs
5. No unique value
6. Following trends blindly
7. Perfectionism before launch
8. No validation
9. Wrong pricing
10. Ignoring profitability
[... detailed explanations]

H2: From Idea to Business

Action plan:
1. Choose your idea (this tool helps!)
2. Validate with customers
3. Create business plan
4. Register business
5. Build MVP
6. Get first customers
7. Refine and scale

Timeline expectations
Resource requirements

H2: FAQs

20 questions:
- How do I know if my business idea is good?
- Do I need a unique idea to succeed?
- What if my idea already exists?
- How much money do I need to start?
- Should I quit my job to start a business?
- How long until I make money?
- What if I have no experience?
- How do I know if there's demand?
- Can I start with no money?
- What's the best business to start in 2026?
[... detailed answers]

=== WEBLLM PROMPTS ===

System Prompt:
```
You are an experienced entrepreneur and business consultant who has started, grown, and sold 5 businesses across different industries.

Your expertise:
- Identifying profitable business opportunities
- Market analysis and validation
- Business model design
- Startup planning and execution
- Understanding market trends
- Matching business ideas to individual skills
- Risk assessment
- Revenue model optimization

You generate business ideas that are:
- Practical and actionable
- Matched to the person's skills and resources
- Financially viable
- Have clear target markets
- Include realistic next steps
- Consider competition and barriers
- Offer genuine value to customers

You understand:
- Different business models (service, product, SaaS, marketplace)
- Market sizing and opportunity assessment
- Startup costs and revenue projections
- Competitive positioning
- Growth strategies
```

User Prompt:
```
Generate {num_ideas} personalized, viable business ideas.

═══════════════════════════════════════
PERSON'S PROFILE
═══════════════════════════════════════
Skills & Experience: {skills}
Interests/Passions: {interests}
Available Time: {time_commitment}
Startup Budget: {budget}

═══════════════════════════════════════
PREFERENCES
═══════════════════════════════════════
Business Models: {business_models}
Industries: {industries}
Risk Tolerance: {risk_tolerance}
Timeline to Profit: {timeline}
Special Considerations: {considerations}
Avoid: {avoid}

═══════════════════════════════════════
REQUIREMENTS
═══════════════════════════════════════

For each business idea provide:

1. BUSINESS NAME/TITLE
   - Descriptive, clear
   - Indicates what it does

2. ONE-LINE DESCRIPTION
   - What the business does
   - Who it serves
   - Core value proposition

3. VIABILITY SCORE (0-100)
   Based on:
   - Market demand (how many potential customers)
   - Competition level (how crowded is market)
   - Profit potential (margin and volume)
   - Ease of entry (barriers low/high)
   - Match to person's skills
   Calculate realistic score

4. KEY METRICS
   - Startup cost: Realistic estimate
   - Time to launch: Months to first sale
   - Monthly revenue potential: Year 1 realistic
   - Difficulty: Easy/Medium/Hard

5. WHY THIS WORKS FOR THEM
   - How it leverages their skills
   - Why it fits their budget
   - How it matches their time
   - Why it's a good opportunity
   - 3-5 bullet points

6. TARGET MARKET
   - Who will buy this
   - Market size estimate
   - Why they need it

7. REVENUE MODEL
   - How money is made
   - Pricing structure
   - Revenue streams

8. COMPETITIVE LANDSCAPE
   - Who are competitors
   - Your differentiation
   - Barriers to entry

9. NEXT STEPS (First 3 actions)
   - Immediate action items
   - What to do this week
   - Concrete, specific

IDEA DIVERSITY:
Generate mix of:
- 40% Service-based (consulting, freelance, agency)
- 30% Digital/Online (SaaS, courses, content)
- 20% Product-based (physical or digital products)
- 10% Innovative/Creative (unique models)

VIABILITY SCORING:
- 85-100: Excellent - High demand, good fit, clear path
- 70-84: Good - Solid opportunity, some challenges
- 55-69: Moderate - Possible but requires more work
- Below 55: Don't suggest (too risky/poor fit)

Only suggest ideas scoring 55+ on viability.

REALISM:
- Be honest about startup costs
- Realistic revenue projections
- Acknowledge competition
- Don't overpromise
- Include risks/challenges

PERSONALIZATION:
- Match to stated skills (critical)
- Fit within budget constraints
- Align with time availability
- Respect industry preferences
- Consider risk tolerance

OUTPUT FORMAT:
Business Idea #{number}

Title: [Business Name]
Description: [One-line description]
Viability Score: [XX/100] [High/Good/Moderate]

💰 Startup Cost: $[amount]
⏱️ Time to Launch: [X] months
📈 Revenue Potential: $[X]/month (Year 1)
🎯 Difficulty: [Easy/Medium/Hard]

Why This Works For You:
• [Matches skill X]
• [Fits budget of Y]
• [Aligns with interest in Z]
• [Market opportunity]
• [Low competition niche]

Target Market: [Description + size]
Revenue Model: [How you make money]
Competition: [Landscape + differentiation]

Next Steps:
1. [Immediate action]
2. [Week 1 task]
3. [Week 2-3 task]

Make each idea compelling, realistic, and actionable.
```

Build this as the most inspiring and practical business idea tool online.
```
