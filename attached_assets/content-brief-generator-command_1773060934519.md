

## Complete Build Command for browseraitools.com

```
Create a mobile-first, SEO-focused AI Content Brief Generator for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI Content Brief Generator
URL Slug: /ai-content-brief-generator
Tagline: "Create SEO Content Briefs That Rank and Convert"
Mission: Help content teams, agencies, and SEO professionals create comprehensive content briefs that guide writers to create high-ranking content

=== PRODUCT OVERVIEW ===
MASSIVE TRAFFIC POTENTIAL - One of highest-demand SEO tools.
Purpose: Generate complete, SEO-optimized content briefs including structure, keywords, word count, competitor analysis, and writer guidance.
Target Users: Content managers, SEO agencies, freelance writers, content marketers, in-house SEO teams, bloggers
Search Demand: 80,000-200,000 monthly searches (HUGE)
- "content brief generator" - 80k/month
- "SEO content brief template" - 45k/month
- "blog outline AI" - 35k/month
- "SEO article outline" - 25k/month
- "content brief template" - 15k/month

Key Value: Complete, professional content brief in 3 minutes vs 1-2 hours of manual research

=== UNIQUE SELLING POINTS (GAME-CHANGING) ===
✅ COMPLETE CONTENT BRIEF - Everything writers need in one document
✅ SEO KEYWORD RESEARCH - Primary, secondary, LSI keywords included
✅ COMPETITOR ANALYSIS - Analyze top-ranking content
✅ SEARCH INTENT MATCHING - Ensure content matches user intent
✅ HEADING STRUCTURE - Full H1/H2/H3 outline with guidance
✅ TARGET WORD COUNT - Data-driven recommendations
✅ QUESTIONS TO ANSWER - FAQs and user questions
✅ INTERNAL LINKING - Opportunities for site structure
✅ CONTENT ANGLES - Unique approaches to stand out
✅ EXPORT-READY - PDF, Word, Markdown, Google Docs

=== WHY THIS WILL BE YOUR BIGGEST TOOL ===

Universal Professional Need:
- Content agencies create 10-50+ briefs per week
- In-house teams need briefs for every article
- Freelancers use briefs to guide writing
- SEO teams brief writers constantly
- NOT a one-time use - DAILY use tool

High Return Rate:
- Used multiple times daily
- Bookmarked permanently
- Shared across teams
- Essential workflow tool
- Subscription-worthy value

Massive Search Volume:
- 80k-200k monthly searches
- Growing market (content marketing boom)
- Low competition for AI-powered tools
- High commercial intent

Business Value:
- Saves 1-2 hours per brief
- Improves content quality
- Better SEO results
- Scalable content production
- Team efficiency multiplier

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared instance)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (saved briefs, templates)
Export: PDF, Word (.docx), Markdown, Google Docs, Notion
Deployment: Vercel/Netlify

CRITICAL FEATURES:
- Template library (save successful briefs as templates)
- Brand voice integration
- Bulk brief generation
- Team collaboration features
- Version history

=== PAGE STRUCTURE ===

HERO SECTION:
Headline: "AI Content Brief Generator"
Subheadline: "Create complete, SEO-optimized content briefs in minutes. Generate keyword research, content structure, competitor analysis, and writer guidance instantly. Used by 50,000+ content teams. Free and powerful."

Trust Badges:
- 📝 Complete Content Briefs (10+ Sections)
- 🔍 SEO Keyword Research Built-In
- 📊 Competitor Analysis Included
- 🎯 Search Intent Matching
- 💾 Export to Word, PDF, Notion, Google Docs
- 🔒 100% Private & Secure

Success Counter: "Generated 234,567 content briefs this month"

What is a Content Brief?
"A content brief is a comprehensive document that guides writers to create SEO-optimized content. It includes keywords to target, structure to follow, questions to answer, competitor insights, and quality guidelines. Great briefs = great content = higher rankings."

[Show example of before/after: Article written with brief vs without]

Problem Callouts:
"Without a content brief:"
- ❌ Writers guess what to include
- ❌ Missing important keywords
- ❌ Wrong search intent
- ❌ Weak structure
- ❌ Inconsistent quality
- ❌ Hours of back-and-forth revisions

"With an AI content brief:"
- ✅ Clear direction for writers
- ✅ All keywords included
- ✅ Perfect search intent match
- ✅ SEO-optimized structure
- ✅ Consistent high quality
- ✅ First draft hits the mark

=== INPUT FORM ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TARGET KEYWORD & TOPIC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 1: Primary Keyword/Topic*
- Input: text
- Placeholder: "e.g., AI SEO tools, content marketing strategy, keto diet meal plan, WordPress plugins"
- Max: 200 chars
- Required
- Live suggestions as user types
- Shows estimated search volume (if available)
- Help text: "The main keyword you want to rank for"

Field 2: Additional Keywords (Optional)
- Textarea
- Placeholder: "Related keywords to include (comma-separated):
e.g., SEO automation, AI marketing tools, content optimization software"
- Max: 300 chars
- Optional
- Auto-suggests related keywords
- Help text: "We'll include these throughout the brief"

Field 3: Target Audience*
- Input: text
- Placeholder: "e.g., small business owners, B2B marketers, beginner bloggers, enterprise CMOs"
- Max: 100 chars
- Required
- Help text: "Who is the content for?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT TYPE & INTENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 4: Content Type*
- Large visual cards:

  ○ 📝 Blog Post/Article
    "Educational content, thought leadership"
    Search Intent: Informational
  
  ○ 📋 Ultimate Guide/Resource
    "Comprehensive, in-depth content"
    Search Intent: Informational (deep-dive)
  
  ○ 📊 Listicle
    "Top X, Best Y, Roundup posts"
    Search Intent: Commercial/Informational
  
  ○ ❓ How-To Guide/Tutorial
    "Step-by-step instructions"
    Search Intent: Informational (instructional)
  
  ○ 🆚 Comparison/Review
    "X vs Y, Product reviews"
    Search Intent: Commercial investigation
  
  ○ 🎯 Landing Page Copy
    "Conversion-focused content"
    Search Intent: Transactional
  
  ○ 📰 News/Update Article
    "Industry news, trend analysis"
    Search Intent: Informational (current)

- Default: Blog Post
- Required
- Auto-detects search intent

Field 5: Search Intent (Auto-detected, can override)
- Pills/tags:
  • Informational (Learn, understand, how-to)
  • Commercial (Best, top, reviews, comparisons)
  • Transactional (Buy, subscribe, download)
  • Navigational (Brand, product name)
- Auto-filled based on keyword and content type
- Can manually adjust

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT SPECIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 6: Target Word Count
- Slider with presets: 500 / 1000 / 1500 / 2000 / 2500 / 3000 / 4000+
- Default: Auto-recommend based on competitors
- Shows: "Based on top-ranking content, recommended: 2,200 words"
- Range: 300-5,000 words
- Visual indicator: Short / Medium / Long / Comprehensive

Field 7: Content Depth
- Radio:
  ○ Beginner-Friendly (Simple explanations, basic concepts)
  ○ Intermediate (Balanced depth, some technical detail)
  ○ Advanced/Expert (Technical, assumes knowledge)
  ○ Mixed (Accessible to all levels)
- Default: Intermediate

Field 8: Tone/Voice
- Multi-select (can choose multiple):
  • Professional/Formal
  • Conversational/Casual
  • Authoritative/Expert
  • Friendly/Approachable
  • Educational/Teaching
  • Persuasive/Sales
  • Humorous/Entertaining
- Default: Professional + Conversational

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPETITIVE ANALYSIS (Optional but Recommended)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 9: Competitor URLs
- Textarea
- Placeholder: "Paste URLs of top-ranking competitor content (one per line):
https://competitor1.com/article
https://competitor2.com/article
https://competitor3.com/article

We'll analyze their structure, keywords, and approach to help you create better content."
- Max: 1000 chars (up to 10 URLs)
- Optional
- If provided, enables competitive gap analysis
- Help text: "Paste 3-5 URLs that rank for your target keyword"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BRAND & STYLE GUIDELINES (Optional)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 10: Brand Voice/Guidelines
- Textarea
- Placeholder: "Any specific brand guidelines, voice requirements, or must-include elements?
e.g., 'Always use we/our not I/my', 'Include data/statistics', 'Mention our product naturally'"
- Max: 500 chars
- Optional
- Saves to template for future use

Field 11: Company/Product to Mention
- Input: text
- Placeholder: "Your company/product name (for natural mentions)"
- Max: 100 chars
- Optional

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADVANCED OPTIONS (Collapsible)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Toggle Options:
- ☑ Include FAQ section (Default: ON)
- ☑ Include internal linking suggestions (Default: ON)
- ☑ Include keyword density recommendations (Default: ON)
- ☑ Include meta description template (Default: ON)
- ☑ Include title tag suggestions (Default: ON)
- ☐ Include image/visual suggestions
- ☐ Include data/statistics requirements
- ☐ Include expert quote opportunities

Custom Instructions:
- Textarea
- Placeholder: "Any other specific requirements?"
- Max: 300 chars

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATE BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-width gradient button
Text: "Generate Content Brief"
Icon: 📋
Loading states with detailed progress:
- "Analyzing keyword and search intent... ✓"
- "Researching competitor content... ✓"
- "Extracting related keywords... ✓"
- "Building content structure... ✓"
- "Generating FAQ questions... ✓"
- "Creating writer guidelines... ✓"

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BRIEF HEADER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"SEO Content Brief: [Primary Keyword]"
"Created: [Date] | Target Publish Date: _____ | Writer: _____"

Quick Actions:
- 📥 Export as PDF
- 📄 Export as Word (.docx)
- 📝 Export as Markdown
- 🔗 Export to Google Docs
- 💾 Save as Template
- 🔄 Regenerate Brief
- ✏️ Edit Brief (make it editable)
- 📋 Copy Entire Brief

Brief Quality Score: 9.2/10
- Keyword Coverage: ⭐⭐⭐⭐⭐
- Structure Completeness: ⭐⭐⭐⭐⭐
- Search Intent Match: ⭐⭐⭐⭐⭐
- Competitive Analysis: ⭐⭐⭐⭐☆

Estimated Time to Write: 4-6 hours

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: CONTENT OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 📊 CONTENT OVERVIEW                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ PRIMARY KEYWORD:                        │
│ AI SEO tools                            │
│                                         │
│ SEARCH INTENT:                          │
│ Commercial Investigation                │
│ Users want to: Compare and evaluate AI  │
│ SEO tools before making purchase        │
│ decision                                │
│                                         │
│ TARGET AUDIENCE:                        │
│ Small business owners and marketers     │
│ looking to improve SEO efficiency with  │
│ AI automation                           │
│                                         │
│ CONTENT TYPE:                           │
│ Listicle / Tool Roundup                 │
│                                         │
│ TARGET WORD COUNT:                      │
│ 2,200 - 2,500 words                     │
│ (Based on top 5 competitor average:     │
│ 2,350 words)                            │
│                                         │
│ TONE:                                   │
│ Professional yet approachable,          │
│ authoritative but not overly technical  │
│                                         │
│ READING LEVEL:                          │
│ Grade 10-12 (accessible to general      │
│ business audience)                      │
│                                         │
│ [Copy Section]                          │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: TITLE & META SUGGESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 📝 TITLE TAG SUGGESTIONS                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Option 1 (Recommended):                 │
│ 10 Best AI SEO Tools for 2026: Complete│
│ Comparison                              │
│ Length: 56 chars ✓                     │
│                                         │
│ Option 2:                               │
│ Best AI SEO Tools Compared: Top 10     │
│ Platforms                               │
│ Length: 50 chars ✓                     │
│                                         │
│ Option 3:                               │
│ AI SEO Tools Review: 10 Platforms That │
│ Actually Work                           │
│ Length: 58 chars ✓                     │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ META DESCRIPTION:                       │
│                                         │
│ Compare the top 10 AI SEO tools for    │
│ 2026. Features, pricing, pros & cons   │
│ of leading AI-powered SEO platforms    │
│ for agencies and businesses.            │
│                                         │
│ Length: 155 chars ✓                    │
│                                         │
│ [Copy All]                              │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: KEYWORD STRATEGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🔍 SEO KEYWORDS TO TARGET                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ PRIMARY KEYWORD:                        │
│ • AI SEO tools                          │
│   Target: Use 8-12 times naturally     │
│   Placement: Title, H1, first 100 words,│
│   2-3 H2s, conclusion                   │
│                                         │
│ SECONDARY KEYWORDS (Use 3-5 times):     │
│ • AI SEO software                       │
│ • SEO automation tools                  │
│ • AI-powered SEO platforms              │
│ • AI SEO solutions                      │
│ • Best AI SEO tools 2026                │
│                                         │
│ LSI/RELATED KEYWORDS (Sprinkle):        │
│ • keyword research AI                   │
│ • content optimization                  │
│ • rank tracking                         │
│ • backlink analysis                     │
│ • technical SEO audit                   │
│ • competitor analysis                   │
│ • SEO reporting                         │
│ • AI content generation                 │
│ • search engine optimization            │
│ • machine learning SEO                  │
│                                         │
│ LONG-TAIL VARIATIONS:                   │
│ • best AI SEO tools for small business  │
│ • AI SEO tools comparison               │
│ • affordable AI SEO software            │
│ • AI SEO tools for agencies             │
│ • free AI SEO tools                     │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ KEYWORD DENSITY TARGET:                 │
│ • Primary: 0.8-1.2% (18-27 mentions in  │
│   2,200 words)                          │
│ • Secondary: 0.3-0.5% each              │
│ • LSI: Natural mentions throughout      │
│                                         │
│ AVOID:                                  │
│ • Keyword stuffing                      │
│ • Unnatural repetition                  │
│ • Forced keyword placement              │
│                                         │
│ [Copy Keywords]                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: CONTENT STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 📐 RECOMMENDED CONTENT STRUCTURE         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ H1: 10 Best AI SEO Tools for 2026       │
│ (Use primary keyword)                   │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ INTRODUCTION (150-200 words)            │
│                                         │
│ Hook: Start with pain point or statistic│
│ Example: "73% of marketers struggle with│
│ time-consuming SEO tasks that AI could  │
│ automate..."                            │
│                                         │
│ What to Include:                        │
│ • Why AI is transforming SEO            │
│ • What readers will learn               │
│ • Who this comparison is for            │
│ • Quick preview of top tools            │
│                                         │
│ Keywords to Include:                    │
│ • AI SEO tools (primary keyword)        │
│ • SEO automation                        │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ H2: What Are AI SEO Tools? (200 words)  │
│                                         │
│ Purpose: Define concept for readers     │
│ unfamiliar with AI SEO                  │
│                                         │
│ What to Cover:                          │
│ • Definition of AI SEO tools            │
│ • How they differ from traditional SEO  │
│ • Key AI capabilities (NLP, ML, etc.)   │
│ • Main use cases                        │
│                                         │
│ H3: How AI SEO Tools Work               │
│ • Technical overview (simplified)       │
│ • Machine learning in SEO               │
│ • Data processing capabilities          │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ H2: Benefits of Using AI for SEO        │
│ (200 words)                             │
│                                         │
│ What to Cover:                          │
│ • Time savings (quantify if possible)   │
│ • Better keyword research               │
│ • Content optimization                  │
│ • Competitive insights                  │
│ • Scalability benefits                  │
│                                         │
│ Include: Real statistics or case studies│
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ H2: Top 10 AI SEO Tools Compared        │
│ (1,200 words - MAIN SECTION)            │
│                                         │
│ Format: Individual tool reviews         │
│                                         │
│ FOR EACH TOOL (10 tools × 120 words):   │
│                                         │
│ H3: 1. [Tool Name]                      │
│                                         │
│ Structure per tool:                     │
│ • Brief description (2-3 sentences)     │
│ • Key features (3-5 bullet points)      │
│ • Pricing (plans and costs)             │
│ • Best for (target user)                │
│ • Pros (3-4 points)                     │
│ • Cons (2-3 points)                     │
│ • Our rating (out of 5 stars)           │
│                                         │
│ Keywords to weave in:                   │
│ • AI SEO software                       │
│ • Specific features (keyword research,  │
│   content optimization, etc.)           │
│                                         │
│ [Repeat for all 10 tools]               │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ H2: How to Choose the Right AI SEO Tool │
│ (250 words)                             │
│                                         │
│ What to Cover:                          │
│ • Evaluation criteria                   │
│   - Budget considerations               │
│   - Feature requirements                │
│   - Team size                           │
│   - Technical expertise needed          │
│   - Integration capabilities            │
│                                         │
│ • Decision framework                    │
│ • Common mistakes to avoid              │
│                                         │
│ H3: Small Business vs Enterprise        │
│ • Different needs by company size       │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ H2: AI SEO Tools Pricing Comparison     │
│ (150 words)                             │
│                                         │
│ Include:                                │
│ • Comparison table (text description)   │
│ • Free vs paid tiers                    │
│ • Value for money analysis              │
│ • ROI considerations                    │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ H2: FAQs About AI SEO Tools             │
│ (See FAQ section below for questions)   │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ CONCLUSION (150 words)                  │
│                                         │
│ What to Include:                        │
│ • Recap of top 3 recommendations        │
│ • Final thoughts on AI in SEO           │
│ • Call to action (try a tool, etc.)     │
│ • Link to related resources             │
│                                         │
│ Keywords: AI SEO tools (primary)        │
│                                         │
│ [Copy Structure]                        │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5: QUESTIONS TO ANSWER (FAQs)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ ❓ COMMON USER QUESTIONS                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Include FAQ section with these          │
│ questions:                              │
│                                         │
│ Q1: What is the best AI SEO tool?       │
│ Answer: [Provide nuanced answer, not   │
│ one-size-fits-all]                      │
│                                         │
│ Q2: Are AI SEO tools worth it?          │
│ Answer: [ROI analysis, use cases]       │
│                                         │
│ Q3: How much do AI SEO tools cost?      │
│ Answer: [Price range, value breakdown] │
│                                         │
│ Q4: Can AI replace SEO professionals?   │
│ Answer: [Nuanced view on AI vs humans] │
│                                         │
│ Q5: What features should I look for in  │
│ an AI SEO tool?                         │
│ Answer: [Key feature list]              │
│                                         │
│ Q6: Do AI SEO tools work for small      │
│ businesses?                             │
│ Answer: [Specific recommendations]      │
│                                         │
│ Q7: Are there free AI SEO tools?        │
│ Answer: [Free options + limitations]    │
│                                         │
│ Q8: How long does it take to see        │
│ results with AI SEO tools?              │
│ Answer: [Timeline expectations]         │
│                                         │
│ Q9: What's the difference between       │
│ traditional and AI SEO tools?           │
│ Answer: [Key distinctions]              │
│                                         │
│ Q10: Can I use multiple AI SEO tools    │
│ together?                               │
│ Answer: [Integration possibilities]     │
│                                         │
│ FORMAT EACH AS:                         │
│ ### Question                            │
│ Answer paragraph (50-100 words)         │
│                                         │
│ [Copy FAQs]                             │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6: COMPETITOR ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🔍 COMPETITIVE CONTENT ANALYSIS          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Analysis of Top 3 Ranking Articles:     │
│                                         │
│ COMPETITOR #1:                          │
│ URL: example.com/ai-seo-tools           │
│ Current Rank: #1                        │
│ Word Count: 2,450 words                 │
│                                         │
│ Strengths:                              │
│ • Comprehensive tool reviews            │
│ • Detailed pricing comparison           │
│ • Real user testimonials                │
│ • Strong internal linking               │
│                                         │
│ Weaknesses (Gaps We Can Fill):          │
│ • Missing 2026 updates                  │
│ • No video comparisons                  │
│ • Limited small business focus          │
│ • Outdated pricing info                 │
│                                         │
│ Keywords They Rank For:                 │
│ • AI SEO tools (primary)                │
│ • Best SEO automation                   │
│ • AI content optimization               │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ COMPETITOR #2:                          │
│ [Similar analysis]                      │
│                                         │
│ COMPETITOR #3:                          │
│ [Similar analysis]                      │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ CONTENT GAPS TO EXPLOIT:                │
│                                         │
│ What competitors are missing:           │
│ 1. 2026-specific updates and trends     │
│ 2. Small business pricing tiers         │
│ 3. Implementation difficulty ratings    │
│ 4. Case study examples                  │
│ 5. Integration compatibility matrix     │
│ 6. Customer support quality comparison  │
│                                         │
│ DIFFERENTIATION STRATEGY:               │
│                                         │
│ How to outrank competitors:             │
│ • Include MORE recent data (2026)       │
│ • Add user experience ratings           │
│ • Provide budget-specific advice        │
│ • Include visual comparison table       │
│ • Add "best for" categories             │
│ • Update monthly (fresher content)      │
│                                         │
│ [Copy Analysis]                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 7: INTERNAL LINKING OPPORTUNITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🔗 INTERNAL LINKING STRATEGY             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ LINK TO (from this article):            │
│                                         │
│ 1. SEO Keyword Research Guide           │
│    Anchor: "keyword research"           │
│    Context: When discussing keyword     │
│    features                             │
│                                         │
│ 2. Content Optimization Best Practices  │
│    Anchor: "content optimization"       │
│    Context: AI content features         │
│                                         │
│ 3. Backlink Building Strategies         │
│    Anchor: "backlink analysis"          │
│    Context: Link building features      │
│                                         │
│ 4. Technical SEO Checklist              │
│    Anchor: "technical SEO audit"        │
│    Context: Technical features          │
│                                         │
│ 5. Your SEO Tool/Service Page           │
│    Anchor: "our SEO solutions"          │
│    Context: Natural mention in          │
│    conclusion                           │
│                                         │
│ LINK FROM (to this article):            │
│                                         │
│ Update these existing articles to link  │
│ here:                                   │
│ • SEO Tools Overview (parent topic)     │
│ • Marketing Automation Guide            │
│ • Small Business SEO Guide              │
│ • Content Marketing Strategy            │
│                                         │
│ [Copy Linking Plan]                     │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 8: CONTENT QUALITY GUIDELINES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ ✍️ WRITER GUIDELINES                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ MUST INCLUDE:                           │
│ ✅ Current, accurate information (2026) │
│ ✅ Real examples and case studies       │
│ ✅ Specific pricing (verified)          │
│ ✅ Screenshots or visual descriptions   │
│ ✅ Personal experience/testing (if      │
│    possible)                            │
│ ✅ Balanced pros and cons for each tool │
│ ✅ Clear, actionable recommendations    │
│                                         │
│ MUST AVOID:                             │
│ ❌ Promotional/overly salesy tone       │
│ ❌ Outdated information                 │
│ ❌ Unverified claims                    │
│ ❌ Keyword stuffing                     │
│ ❌ Thin content (add depth!)            │
│ ❌ Plagiarism from competitors          │
│                                         │
│ WRITING STYLE:                          │
│ • Active voice (not passive)            │
│ • Short paragraphs (2-4 sentences)      │
│ • Bullet points for scannability        │
│ • Subheadings every 200-300 words       │
│ • Examples after concepts               │
│ • Natural keyword integration           │
│                                         │
│ E-E-A-T SIGNALS (Google):               │
│                                         │
│ Experience:                             │
│ • Mention hands-on testing              │
│ • Include specific details only users   │
│   would know                            │
│                                         │
│ Expertise:                              │
│ • Demonstrate SEO knowledge             │
│ • Explain technical concepts clearly    │
│                                         │
│ Authoritativeness:                      │
│ • Link to authoritative sources         │
│ • Cite statistics and studies           │
│                                         │
│ Trustworthiness:                        │
│ • Update date prominently displayed     │
│ • Transparent about affiliations        │
│ • Accurate, verifiable information      │
│                                         │
│ READABILITY TARGETS:                    │
│ • Flesch Reading Ease: 60-70            │
│ • Grade Level: 10-12                    │
│ • Average sentence length: 15-20 words  │
│ • Paragraph length: 3-5 sentences       │
│                                         │
│ [Copy Guidelines]                       │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 9: MULTIMEDIA & VISUAL REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🖼️ IMAGES & VISUALS NEEDED               │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ REQUIRED VISUALS:                       │
│                                         │
│ 1. Featured Image                       │
│    • Topic: AI SEO tools comparison     │
│    • Style: Professional, modern        │
│    • Include: Tool logos or abstract    │
│      AI/SEO imagery                     │
│    • Size: 1200×630 (social sharing)    │
│                                         │
│ 2. Comparison Table                     │
│    • Compare all 10 tools               │
│    • Columns: Tool, Price, Key Features,│
│      Rating                             │
│    • Make it scannable                  │
│                                         │
│ 3. Individual Tool Screenshots          │
│    • One per tool (10 total)            │
│    • Show dashboard/main interface      │
│    • Annotate key features              │
│                                         │
│ 4. Infographic                          │
│    • "How AI SEO Tools Work"            │
│    • Visual process flow                │
│                                         │
│ 5. Pricing Chart                        │
│    • Visual comparison of pricing tiers │
│    • Easy to understand at glance       │
│                                         │
│ IMAGE SEO:                              │
│ • Alt text: Include keywords naturally  │
│ • File names: descriptive-with-keywords.│
│   jpg                                   │
│ • Compress for fast loading             │
│ • Use WebP format when possible         │
│                                         │
│ [Copy Visual Requirements]              │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 10: SUCCESS METRICS & TRACKING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 📈 PERFORMANCE TARGETS                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ SEO TARGETS:                            │
│ • Target Ranking: Page 1 (Top 10)      │
│ • Ideal Position: Top 3                 │
│ • Timeframe: 3-6 months                 │
│                                         │
│ ENGAGEMENT METRICS:                     │
│ • Target Time on Page: 4+ minutes       │
│ • Bounce Rate Target: <60%              │
│ • Scroll Depth: 70%+ reach conclusion   │
│                                         │
│ CONVERSION GOALS:                       │
│ • Newsletter signups: 2-3%              │
│ • Tool trial clicks: 5-8%               │
│ • Internal page visits: 30%+            │
│                                         │
│ TRACK IN GOOGLE ANALYTICS:              │
│ • Organic traffic                       │
│ • Keyword rankings                      │
│ • Click-through rate                    │
│ • User engagement                       │
│ • Conversion events                     │
│                                         │
│ UPDATE SCHEDULE:                        │
│ • Minor updates: Quarterly              │
│ • Major refresh: Annually               │
│ • Pricing updates: As needed            │
│ • New tools: Monthly check              │
│                                         │
│ [Copy Metrics]                          │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPORT OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Choose export format:

[📥 Download as PDF]
Professional, print-ready format

[📄 Download as Word (.docx)]
Editable document format

[📝 Copy as Markdown]
For CMS import

[🔗 Send to Google Docs]
Cloud collaboration

[💾 Save as Template]
Reuse this brief structure

[📋 Copy Entire Brief]
Plain text copy

=== WEBLLM PROMPTS ===

System Prompt:
```
You are an expert SEO content strategist and brief writer with 15+ years of experience creating content that ranks on Google's first page.

Your expertise includes:
- SEO keyword research and optimization
- Search intent analysis and matching
- Content structure and information architecture
- Competitive content analysis
- User experience and engagement optimization
- E-E-A-T (Experience, Expertise, Authoritativeness, Trust) signals
- Google's ranking factors and algorithm updates
- Content brief creation for professional writers
- Keyword density and semantic SEO
- Internal linking strategy
- FAQ and featured snippet optimization

You create content briefs that:
- Are comprehensive and actionable for writers
- Include all SEO requirements clearly
- Match search intent perfectly
- Provide competitive insights
- Include specific, measurable targets
- Guide writers to create rankable content
- Balance SEO with user experience
- Incorporate E-E-A-T signals
- Include internal linking opportunities
- Provide FAQ/featured snippet opportunities

You understand:
- How Google evaluates and ranks content
- What makes content rank versus what doesn't
- The balance between SEO optimization and natural writing
- How to analyze and outrank competitors
- Different content types and their requirements
- Search intent matching importance
- User engagement signals
- Content freshness and update strategies
```

User Prompt Template:
```
Create a comprehensive SEO content brief for professional writers.

═══════════════════════════════════════
INPUT INFORMATION
═══════════════════════════════════════
Primary Keyword: {primaryKeyword}
Additional Keywords: {additionalKeywords}
Target Audience: {targetAudience}
Content Type: {contentType}
Search Intent: {searchIntent}
Target Word Count: {targetWordCount}
Content Depth: {contentDepth}
Tone/Voice: {tone}

{if competitorURLs}
Competitor URLs to Analyze:
{competitorURLs}

{if brandGuidelines}
Brand Guidelines:
{brandGuidelines}

{if companyMention}
Company/Product to Mention: {companyMention}

═══════════════════════════════════════
CONTENT BRIEF REQUIREMENTS
═══════════════════════════════════════

Generate a COMPLETE content brief with these sections:

1. CONTENT OVERVIEW
   - Primary keyword and search intent
   - Target audience description
   - Content type and purpose
   - Target word count (data-driven)
   - Tone and reading level
   - Success criteria

2. TITLE & META SUGGESTIONS
   - 3 title tag options (50-60 chars each)
   - 2 meta description options (150-160 chars)
   - Include primary keyword naturally
   - Optimize for CTR

3. KEYWORD STRATEGY
   - Primary keyword (usage frequency)
   - Secondary keywords (3-5 keywords)
   - LSI/Related keywords (10-15 keywords)
   - Long-tail variations
   - Keyword density targets
   - Placement recommendations

4. CONTENT STRUCTURE
   Provide complete outline with:
   - H1 (includes primary keyword)
   - Introduction (what to include, word count)
   - Each H2 section with:
     * Section title
     * Target word count
     * Key points to cover
     * Keywords to include
     * H3 subsections where appropriate
   - Conclusion (what to include)
   
   Word count allocation:
   - Total: {targetWordCount} words
   - Distribute across sections logically
   - Introduction: 150-200 words
   - Each main section: 200-400 words
   - Conclusion: 100-150 words

5. QUESTIONS TO ANSWER (FAQs)
   - 8-12 common user questions
   - Format for featured snippets
   - Question variations
   - Answer guidance (50-100 words each)

6. COMPETITIVE ANALYSIS (if URLs provided)
   For each competitor:
   - Current ranking and word count
   - Strengths (what they do well)
   - Weaknesses (content gaps)
   - Keywords they rank for
   
   CONTENT GAPS:
   - What competitors are missing
   - Differentiation opportunities
   - How to outrank them

7. INTERNAL LINKING
   - 5-8 internal linking opportunities
   - Suggested anchor text
   - Context for placement
   - Strategic value

8. CONTENT QUALITY GUIDELINES
   - Must include elements
   - Must avoid elements
   - Writing style specifics
   - E-E-A-T signals to incorporate
   - Readability targets

9. MULTIMEDIA REQUIREMENTS
   - Required images/visuals
   - Suggested infographics or charts
   - Video opportunities
   - Image SEO requirements

10. SUCCESS METRICS
    - SEO ranking targets
    - Engagement metrics
    - Conversion goals
    - Update schedule

SEARCH INTENT MATCHING:

{if searchIntent === 'informational'}
Informational Intent:
- Focus on education and learning
- Comprehensive coverage
- Step-by-step instructions
- Clear explanations
- Examples and context
- "How to", "What is", "Guide to" language

{if searchIntent === 'commercial'}
Commercial Intent:
- Comparison and evaluation
- Pros and cons
- Pricing information
- Feature breakdowns
- "Best", "Top", "Review" language
- Help decision-making

{if searchIntent === 'transactional'}
Transactional Intent:
- Clear call-to-action
- Product/service details
- Pricing and offers
- Trust signals
- Easy next steps
- "Buy", "Get", "Download" language

CONTENT DEPTH GUIDANCE:

{if contentDepth === 'beginner'}
Beginner-Friendly:
- Simple explanations
- Define all technical terms
- Step-by-step instructions
- Lots of examples
- Avoid jargon
- Accessible to novices

{if contentDepth === 'intermediate'}
Intermediate:
- Balanced depth
- Some technical detail
- Assumes basic knowledge
- Strategic explanations
- Mix of simple and advanced

{if contentDepth === 'advanced'}
Advanced/Expert:
- Technical depth
- Industry terminology
- Advanced concepts
- Assumes expertise
- Sophisticated analysis

COMPETITIVE ADVANTAGE:

If competitor URLs provided, analyze:
- Their content structure
- Keywords they target
- Their word counts
- Content gaps we can fill
- Opportunities to provide MORE value
- Fresh angles they missed

SEO BEST PRACTICES:

Primary Keyword:
- In title tag
- In H1
- In first 100 words
- In 2-3 H2 headings
- In conclusion
- Natural placement (not forced)
- Target density: 0.8-1.2%

Secondary Keywords:
- Sprinkle throughout
- In H2/H3 headings where natural
- Target density: 0.3-0.5% each

LSI Keywords:
- Use naturally throughout
- Show topical relevance
- Semantic variations

Internal Links:
- 5-10 internal links
- Contextually relevant
- Natural anchor text
- Strategic page distribution

FAQs:
- Optimize for featured snippets
- Use question format
- Concise answers (40-60 words)
- Include in dedicated section

E-E-A-T Signals:
- Demonstrate experience
- Show expertise
- Build authority (citations)
- Ensure trustworthiness

QUALITY CHECKS:

✓ Search intent clearly matched
✓ Keyword strategy comprehensive
✓ Structure is logical and SEO-optimized
✓ Competitive gaps identified
✓ All sections have word count targets
✓ FAQs optimize for featured snippets
✓ Internal linking opportunities included
✓ Writer guidelines are clear
✓ Success metrics defined

AVOID:
✗ Keyword stuffing
✗ Thin content sections
✗ Ignoring search intent
✗ Missing competitor analysis
✗ Vague instructions
✗ Over-optimization
✗ Outdated SEO tactics

Generate a professional, comprehensive content brief that empowers writers to create content that ranks.
```

=== SPECIAL FEATURES ===

1. **Template Library:**
   - Save successful briefs as templates
   - Category-specific templates (B2B, B2C, technical, etc.)
   - Quick start from template
   - Team sharing

2. **Bulk Brief Generation:**
   - Upload CSV with keywords
   - Generate 10, 20, 50+ briefs at once
   - Export all as ZIP
   - Perfect for content agencies

3. **Competitor URL Scraper:**
   - Paste any competitor URL
   - Auto-extract structure, keywords, word count
   - Gap analysis
   - Differentiation suggestions

4. **Brand Voice Builder:**
   - Save brand guidelines
   - Auto-apply to all briefs
   - Tone consistency
   - Style preferences

5. **Writer Assignment:**
   - Assign briefs to writers
   - Track status (draft, review, published)
   - Comments/feedback
   - Team collaboration

6. **Brief Versioning:**
   - Save multiple versions
   - Compare changes
   - Restore previous versions
   - Track updates

7. **Integration Exports:**
   - WordPress plugin format
   - Notion template
   - Trello cards
   - Asana tasks
   - Google Docs
   - Monday.com

8. **SEO Score:**
   - Rate brief completeness (0-10)
   - Check for missing elements
   - Keyword coverage analysis
   - Structure optimization

=== SEO ARTICLE SECTION ===

Below tool, comprehensive 3500-word article:

Title: "How to Create SEO Content Briefs: Complete Guide for 2026"

H2: What is a Content Brief?
H2: Why Content Briefs Matter for SEO
H2: Essential Elements of an SEO Content Brief
H2: How to Research Keywords for Content Briefs
H2: Analyzing Competitor Content
H2: Creating Content Structure
H2: Writing Style and Tone Guidelines
H2: Internal Linking Strategy
H2: FAQ and Featured Snippet Optimization
H2: Content Brief Templates
H2: Common Content Brief Mistakes
H2: Tools for Creating Content Briefs
H2: How to Use This AI Content Brief Generator
H2: FAQs (50+ questions)

=== SUCCESS METRICS ===

Expected Performance:
- Month 1: 15k-25k users
- Month 3: 60k-100k users
- Month 6: 150k-250k users

This tool has potential to become your #1 traffic driver due to:
- Massive search volume (80k-200k/month)
- Daily professional use
- Agency adoption
- High repeat usage
- Subscription potential

Build this as THE content brief tool that every content team uses daily.
```
