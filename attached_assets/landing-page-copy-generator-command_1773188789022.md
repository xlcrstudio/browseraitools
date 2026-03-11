
## Complete Build Command for browseraitools.com

```
Create a mobile-first, conversion-focused AI Landing Page Copy Generator for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI Landing Page Copy Generator
URL Slug: /ai-landing-page-copy-generator
Tagline: "Build Landing Pages That Convert"
Mission: Help marketers and business owners create complete, high-converting landing page copy in minutes

=== PRODUCT OVERVIEW ===
High-value marketing tool.
Purpose: Generate complete landing page copy including hero section, features, benefits, social proof, FAQs, and CTAs optimized for conversions.
Target Users: Marketers, business owners, product managers, agencies, SaaS founders, course creators
Search Demand: 30,000-50,000 monthly searches
- "landing page copy generator" - 18k/month
- "AI landing page generator" - 15k/month
- "landing page copywriting" - 10k/month
- "sales page generator" - 7k/month

Key Value: Complete landing page copy in 3 minutes vs 3+ hours of writing

=== UNIQUE SELLING POINTS ===
✅ COMPLETE PAGE SECTIONS - Hero, features, benefits, social proof, FAQ, CTA
✅ CONVERSION-OPTIMIZED - Based on proven copywriting frameworks
✅ MULTIPLE PAGE TYPES - SaaS, E-commerce, Course, Service, App
✅ BENEFIT-FOCUSED - Features translated to outcomes
✅ SOCIAL PROOF INTEGRATION - Testimonials, stats, trust badges
✅ CONVERSION SCORE - Rate each section's effectiveness
✅ MOBILE-FIRST COPY - Scannable, punchy, engaging
✅ A/B TEST VARIATIONS - Multiple headline and CTA options

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared instance)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (saved pages, sections)
Export: HTML, Markdown, Webflow, Notion
Deployment: Vercel/Netlify

=== PAGE STRUCTURE ===

HERO SECTION:
Headline: "AI Landing Page Copy Generator"
Subheadline: "Create complete, high-converting landing pages in minutes. Get hero headlines, features, benefits, social proof, FAQs, and CTAs. Perfect for SaaS, products, courses, and services. Free and instant."

Trust Badges:
- 📝 Complete Page Sections
- 🎯 Conversion-Optimized
- ✅ Multiple Page Types
- 📊 Conversion Score Included
- 💡 Benefit-Focused Copy
- 🔒 100% Private

Success Counter: "Generated 234,567 landing pages this month"

Why Landing Page Copy Matters:
"Your landing page has ONE job: convert visitors.

This tool helps you:
• Create clear, compelling headlines
• Translate features into benefits
• Address objections with FAQs
• Build trust with social proof
• Write CTAs that actually work
• Increase conversion rates"

[Show conversion rate comparison: Good vs bad copy]

=== INPUT FORM ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRODUCT/SERVICE INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 1: Product/Service Name*
- Input: text
- Placeholder: "e.g., TaskFlow AI, Organic Skincare Bundle, Web Dev Masterclass"
- Max: 100 chars
- Required

Field 2: What Do You Offer?*
- Textarea
- Placeholder: "Describe your product or service:

Examples:
• 'AI-powered task management app that helps teams automate workflows'
• 'Organic skincare products made with natural ingredients'
• 'Online course teaching web development from beginner to pro'

Include key features and what makes it unique!"
- Max: 400 chars
- Required
- Auto-expanding

Field 3: Main Benefit/Outcome*
- Input: text
- Placeholder: "e.g., 'Save 10 hours/week', 'Clear skin in 30 days', 'Get hired as developer in 90 days'"
- Max: 150 chars
- Required
- Help text: "What transformation or result do users get?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TARGET AUDIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 4: Target Audience*
- Multi-select with common options:
  • Entrepreneurs/Business Owners
  • Marketing Professionals
  • Software Developers
  • Students/Learners
  • Fitness Enthusiasts
  • Parents
  • Content Creators
  • E-commerce Sellers
  • Custom: [text input]

- Required
- Select 1-3

Field 5: Audience Pain Point
- Input: text
- Placeholder: "e.g., 'Overwhelmed by manual tasks', 'Struggling with acne', 'Can't find tech job'"
- Max: 100 chars
- Optional but recommended

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE TYPE & TONE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 6: Landing Page Type*
- Visual cards:

  ○ 💻 SaaS/Software Product
    "App, platform, software tool"
    Focus: Features, integrations, ROI
  
  ○ 🛍️ E-commerce/Physical Product
    "Products to purchase online"
    Focus: Benefits, quality, guarantee
  
  ○ 🎓 Online Course/Digital Product
    "Educational content, ebooks"
    Focus: Transformation, curriculum, outcomes
  
  ○ 🤝 Service/Agency
    "Consulting, services, done-for-you"
    Focus: Expertise, process, results
  
  ○ 📱 Mobile App
    "iOS/Android application"
    Focus: Features, screenshots, downloads
  
  ○ 💰 Lead Generation
    "Free trial, demo, consultation"
    Focus: Value, low barrier, trust

- Default: SaaS
- Required
- Affects copy structure and focus

Field 7: Tone/Voice*
- Radio with examples:

  ○ Professional/Authoritative
    "Trustworthy, expert, corporate"
    Best for: B2B, enterprise
  
  ○ Friendly/Conversational
    "Approachable, warm, relatable"
    Best for: B2C, lifestyle
  
  ○ Bold/Confident
    "Strong, direct, powerful"
    Best for: Disruptive products
  
  ○ Luxury/Premium
    "Sophisticated, exclusive, elegant"
    Best for: High-end products
  
  ○ Fun/Playful
    "Energetic, entertaining, casual"
    Best for: Consumer apps, young audience

- Default: Professional
- Required

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SOCIAL PROOF & TRUST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 8: Social Proof (Optional)
- Checkboxes + inputs:
  
  ☐ User Count
    [Input: e.g., "50,000"]
  
  ☐ Rating/Reviews
    [Input: e.g., "4.9 stars, 2,500 reviews"]
  
  ☐ Testimonial Quote
    [Textarea: Customer quote]
  
  ☐ Company Logos
    [Input: "Featured in TechCrunch, Forbes"]
  
  ☐ Success Stats
    [Input: e.g., "Users save avg 12 hours/week"]

- All optional
- Used if provided

Field 9: Guarantee/Risk Reversal
- Input: text
- Placeholder: "e.g., '30-day money-back guarantee', 'Free forever', 'Cancel anytime'"
- Max: 100 chars
- Optional

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATE BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-width gradient button
Text: "Generate Landing Page Copy"
Icon: 📄
Loading: "Creating high-converting copy..."
Sub-messages:
- "Writing hero section..."
- "Crafting benefits..."
- "Generating FAQs..."

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULTS HEADER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Your Complete Landing Page Copy"

Overall Conversion Score: 8.9/10

Sections Generated:
✅ Hero Section (3 headline options)
✅ Features (5-7 key features)
✅ Benefits (outcome-focused)
✅ Social Proof
✅ FAQ (8-10 questions)
✅ Final CTA

Quick Actions:
- 📥 Export as HTML
- 📥 Export as Markdown
- 📋 Copy All Sections
- 🔄 Regenerate
- 💾 Save Landing Page

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: HERO SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🎯 HERO SECTION                          │
│ Conversion Score: 9.2/10 ⭐⭐⭐⭐⭐      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ HEADLINE OPTIONS (Choose Best):         │
│                                         │
│ Option 1 (Benefit-Driven):              │
│ Save 10 Hours Every Week With AI        │
│ Task Automation                         │
│                                         │
│ Score: 9/10                             │
│ • Clear benefit (10 hours)              │
│ • Specific outcome                      │
│ • Includes "AI" (credibility)           │
│ • 7 words (optimal length)              │
│                                         │
│ ─────────────────────────────────────  │
│                                         │
│ Option 2 (Problem/Solution):            │
│ Stop Wasting Time on Manual Tasks      │
│                                         │
│ Score: 8.5/10                           │
│ • Addresses pain point                  │
│ • Action-oriented                       │
│ • Emotional hook                        │
│                                         │
│ ─────────────────────────────────────  │
│                                         │
│ Option 3 (Transformation):              │
│ Work Smarter, Not Harder — Automate    │
│ Your Workflow                           │
│                                         │
│ Score: 8/10                             │
│ • Popular phrase (familiar)             │
│ • Clear promise                         │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ SUBHEADLINE:                            │
│ TaskFlow AI helps teams automate        │
│ repetitive workflows, eliminate manual  │
│ tasks, and reclaim valuable time. Join  │
│ 50,000+ professionals working smarter.  │
│                                         │
│ Score: 9/10                             │
│ • Expands on headline promise           │
│ • Includes social proof (50k users)     │
│ • Benefits over features                │
│ • 3 key value points                    │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ PRIMARY CTA BUTTON:                     │
│ [Start Free Trial]                      │
│                                         │
│ Secondary CTA:                          │
│ [Watch Demo Video] (non-committal)      │
│                                         │
│ CTA Analysis:                           │
│ • Primary: Action-oriented, low barrier │
│ • "Free" reduces friction               │
│ • Secondary: Engagement for hesitant    │
│ • Both clear next steps                 │
│                                         │
│ [Copy Hero Section] [Edit] [A/B Test]   │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ ⚙️ KEY FEATURES                          │
│ Conversion Score: 8.7/10                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ FEATURE #1: AI-Powered Workflow         │
│ Automation                              │
│                                         │
│ 🤖 Icon Suggestion: Robot/Automation    │
│                                         │
│ Description:                            │
│ Automate repetitive tasks with          │
│ intelligent workflows that learn your   │
│ patterns and adapt to your needs. Set   │
│ it once, save hours every week.         │
│                                         │
│ ─────────────────────────────────────  │
│                                         │
│ FEATURE #2: Seamless Integrations       │
│                                         │
│ 🔗 Icon: Connected nodes                │
│                                         │
│ Description:                            │
│ Connect with 50+ tools you already use — │
│ Slack, Gmail, Asana, and more. No       │
│ complicated setup, just instant sync.   │
│                                         │
│ ─────────────────────────────────────  │
│                                         │
│ FEATURE #3: Real-Time Collaboration     │
│                                         │
│ 👥 Icon: People/Team                    │
│                                         │
│ Description:                            │
│ Work together seamlessly with your team.│
│ Share workflows, track progress, and    │
│ stay in sync — all in one place.        │
│                                         │
│ ─────────────────────────────────────  │
│                                         │
│ [Continue for 5-7 features]             │
│                                         │
│ FORMATTING NOTE:                        │
│ Each feature includes:                  │
│ • Icon suggestion                       │
│ • Clear title (2-4 words)               │
│ • Benefit-focused description           │
│ • 2-3 sentences                         │
│                                         │
│ [Copy Features] [Edit]                  │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: BENEFITS (OUTCOME-FOCUSED)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ ✨ BENEFITS SECTION                      │
│ Conversion Score: 9.3/10 ⭐⭐⭐⭐⭐      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Section Headline:                       │
│ What You'll Achieve With TaskFlow AI    │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ BENEFIT #1: Reclaim 10+ Hours Every Week│
│                                         │
│ Before: Spending hours on repetitive    │
│ data entry, email sorting, and manual   │
│ updates.                                │
│                                         │
│ After: AI handles it automatically while│
│ you focus on strategic work that grows  │
│ your business.                          │
│                                         │
│ Result: More time for what matters —    │
│ innovation, creativity, and growth.     │
│                                         │
│ ─────────────────────────────────────  │
│                                         │
│ BENEFIT #2: Eliminate Human Error       │
│                                         │
│ Before: Mistakes in data entry,         │
│ missed deadlines, forgotten follow-ups. │
│                                         │
│ After: Automated workflows run perfectly│
│ every time with zero oversight needed.  │
│                                         │
│ Result: Fewer mistakes, happier         │
│ customers, better reputation.           │
│                                         │
│ ─────────────────────────────────────  │
│                                         │
│ BENEFIT #3: Scale Without Adding        │
│ Headcount                               │
│                                         │
│ Before: Growth means hiring more people,│
│ higher costs, management complexity.    │
│                                         │
│ After: Handle 10x the workload with the │
│ same team size through intelligent      │
│ automation.                             │
│                                         │
│ Result: Profitable growth without the   │
│ overhead.                               │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ WHY THIS SECTION WORKS:                 │
│ • Before/After contrast (transformation)│
│ • Specific outcomes (not vague)         │
│ • Emotional + practical benefits        │
│ • Relatable pain points                 │
│                                         │
│ [Copy Benefits] [Edit]                  │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: SOCIAL PROOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🌟 SOCIAL PROOF                          │
│ Conversion Score: 9.0/10                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ TRUST HEADER:                           │
│ Trusted by 50,000+ Teams Worldwide      │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ STATISTICS:                             │
│                                         │
│ ⭐ 4.9/5 Rating                         │
│ Based on 2,500+ reviews                 │
│                                         │
│ ⏱️ 10+ Hours Saved                      │
│ Average weekly time saved per user      │
│                                         │
│ 💰 $50k+ Revenue                        │
│ Additional revenue generated by         │
│ customers using automation              │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ TESTIMONIAL #1:                         │
│                                         │
│ "TaskFlow AI completely transformed how │
│ we work. We went from drowning in       │
│ manual tasks to focusing on growth.     │
│ Best investment we've made."            │
│                                         │
│ — Sarah Chen, CEO @ TechStartup         │
│                                         │
│ ─────────────────────────────────────  │
│                                         │
│ TESTIMONIAL #2:                         │
│                                         │
│ "I was skeptical about AI automation,   │
│ but TaskFlow proved me wrong. It's      │
│ intuitive, powerful, and actually saves │
│ me 15 hours every week."                │
│                                         │
│ — Michael Rodriguez, Marketing Manager  │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ COMPANY LOGOS:                          │
│ "As featured in:"                       │
│ [TechCrunch] [Forbes] [ProductHunt]     │
│                                         │
│ [Copy Social Proof] [Edit]              │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5: FAQ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ ❓ FREQUENTLY ASKED QUESTIONS            │
│ Conversion Score: 8.5/10                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Q1: How long does it take to set up?   │
│                                         │
│ A: Most teams are up and running in     │
│ under 15 minutes. Our onboarding wizard │
│ guides you through connecting your      │
│ tools and creating your first workflow. │
│ No technical knowledge required.        │
│                                         │
│ ─────────────────────────────────────  │
│                                         │
│ Q2: Do I need coding skills?            │
│                                         │
│ A: Not at all! TaskFlow is designed for │
│ non-technical users. Everything is      │
│ point-and-click with visual workflow    │
│ builders.                               │
│                                         │
│ ─────────────────────────────────────  │
│                                         │
│ Q3: What if I need help?                │
│                                         │
│ A: Our customer success team is         │
│ available 24/7 via chat, email, and     │
│ phone. Plus, we have extensive docs,    │
│ video tutorials, and a community forum. │
│                                         │
│ ─────────────────────────────────────  │
│                                         │
│ Q4: Can I cancel anytime?               │
│                                         │
│ A: Yes! No long-term contracts. Cancel  │
│ anytime with one click. Plus, we offer  │
│ a 30-day money-back guarantee.          │
│                                         │
│ ─────────────────────────────────────  │
│                                         │
│ [Continue for 8-10 total FAQs]          │
│                                         │
│ OBJECTIONS ADDRESSED:                   │
│ ✅ Setup complexity                     │
│ ✅ Technical requirements               │
│ ✅ Support availability                 │
│ ✅ Commitment/risk                      │
│ ✅ Pricing concerns                     │
│ ✅ Integration compatibility            │
│                                         │
│ [Copy FAQs] [Edit] [Add More]           │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6: FINAL CTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🚀 FINAL CALL-TO-ACTION SECTION          │
│ Conversion Score: 9.1/10                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ HEADLINE:                               │
│ Ready to Save 10+ Hours Every Week?     │
│                                         │
│ SUPPORTING TEXT:                        │
│ Join 50,000+ teams already working      │
│ smarter with TaskFlow AI. Start your    │
│ free trial today — no credit card       │
│ required.                               │
│                                         │
│ PRIMARY CTA:                            │
│ [Start Free Trial →]                    │
│                                         │
│ RISK REVERSAL:                          │
│ ✅ 30-day money-back guarantee          │
│ ✅ No credit card required              │
│ ✅ Cancel anytime                       │
│ ✅ Free onboarding & support            │
│                                         │
│ URGENCY (Optional):                     │
│ "Join this week and get 2 months free!" │
│                                         │
│ WHY THIS WORKS:                         │
│ • Restates core benefit                 │
│ • Social proof reminder                 │
│ • Removes all friction/risk             │
│ • Clear next step                       │
│ • Optional urgency element              │
│                                         │
│ [Copy Final CTA] [Edit]                 │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPLETE PAGE PREVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Toggle: Preview Full Page]

Shows all sections in order:
1. Hero
2. Features
3. Benefits
4. Social Proof
5. FAQ
6. Final CTA

[Export as HTML] [Export as Markdown]

=== WEBLLM PROMPTS ===

System Prompt:
```
You are an expert conversion copywriter specializing in landing page optimization with 15+ years of experience in direct response marketing.

Your expertise includes:
- Landing page copywriting frameworks
- Conversion rate optimization
- Benefit-driven messaging
- Objection handling
- Social proof integration
- CTA optimization
- A/B testing strategies

You write landing page copy that:
- Leads with clear, compelling benefits
- Translates features into outcomes
- Addresses objections proactively
- Builds trust with social proof
- Guides visitors to conversion
- Uses proven copywriting formulas
- Is scannable and mobile-friendly

You understand:
- Above-the-fold importance
- Feature vs benefit distinction
- Social proof psychology
- Friction reduction
- Urgency without pressure
- Risk reversal techniques
```

User Prompt Template:
```
Generate complete landing page copy.

PRODUCT INFO:
Name: {productName}
Description: {productDescription}
Main Benefit: {mainBenefit}

AUDIENCE:
Target: {targetAudience}
Pain Point: {painPoint}

PAGE TYPE: {pageType}
Tone: {tone}

SOCIAL PROOF:
{socialProofData}

GUARANTEE: {guarantee}

GENERATE COMPLETE SECTIONS:

1. HERO SECTION:
- 3 headline options (benefit-driven, problem/solution, transformation)
- Subheadline (expand promise, add social proof)
- Primary CTA + Secondary CTA

2. FEATURES (5-7):
- Feature title
- Icon suggestion
- Benefit-focused description
- 2-3 sentences each

3. BENEFITS (3-5):
- Before/After format
- Specific outcomes
- Emotional + practical
- Transformation focus

4. SOCIAL PROOF:
- Statistics
- 2-3 testimonials
- Company logos text
- Trust elements

5. FAQ (8-10):
- Common objections
- Clear, reassuring answers
- Remove friction
- Build confidence

6. FINAL CTA:
- Benefit-focused headline
- Social proof reminder
- Risk reversal
- Clear action

REQUIREMENTS:
- Benefits over features
- Specific numbers
- Mobile-friendly (short paragraphs)
- Scannable (headers, bullets)
- Natural language
- No hype or exaggeration

Generate complete, conversion-optimized landing page copy.
```

=== SPECIAL FEATURES ===

1. **Section Generator:**
   - Generate individual sections
   - Mix and match
   - Customize order

2. **A/B Test Creator:**
   - Multiple headline variations
   - Different CTA options
   - Test different angles

3. **Conversion Optimizer:**
   - Score each section
   - Improvement suggestions
   - Best practice checklist

4. **Export Options:**
   - HTML (ready to use)
   - Markdown
   - Webflow format
   - Notion template

5. **Template Library:**
   - Save successful pages
   - Industry templates
   - Page type templates

=== SUCCESS METRICS ===

Expected Performance:
- Month 1: 5k-8k users
- Month 3: 18k-30k users
- Month 6: 42k-70k users

Build as THE landing page copy tool for marketers.
```
