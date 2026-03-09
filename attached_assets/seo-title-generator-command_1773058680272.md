

## Complete Build Command for browseraitools.com

```
Create a mobile-first, SEO-optimized AI SEO Title Generator for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI SEO Title Generator
URL Slug: /ai-seo-title-generator
Tagline: "Create Click-Worthy SEO Titles That Rank and Convert"
Mission: Help content creators and marketers generate compelling, SEO-optimized titles that drive traffic and engagement

=== PRODUCT OVERVIEW ===
HIGH-TRAFFIC SEO TOOL - Massive search demand.
Purpose: Generate 10 high-CTR, SEO-optimized titles that rank well and compel clicks.
Target Users: Bloggers, content marketers, SEO professionals, YouTubers, copywriters, business owners
Search Demand: 70,000-120,000 monthly searches
- "SEO title generator" - 60k/month
- "blog title generator" - 35k/month  
- "AI title generator" - 25k/month
- "headline generator" - 20k/month

Key Value: 10 professionally-crafted titles in 30 seconds vs hours of brainstorming

=== UNIQUE SELLING POINTS ===
✅ 10 variations per generation (extensive options)
✅ Multiple title styles (list, question, how-to, power words, number-based)
✅ Character limit optimization (50-60 chars for SEO)
✅ Headline scoring system (SEO strength + click potential)
✅ Emotional trigger detection
✅ Power word integration
✅ A/B testing recommendations
✅ Content type specific (blog, product, video, landing page)
✅ Keyword density optimization

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared instance)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (saved titles, favorites, winning formulas)
Export: Text, CSV, spreadsheet
Deployment: Vercel/Netlify

=== PAGE STRUCTURE ===

HERO SECTION:
Headline: "AI SEO Title Generator"
Subheadline: "Generate 10 click-worthy, SEO-optimized titles that rank on Google and drive traffic. Perfect for blogs, products, videos, and landing pages. Instant results with headline scoring."

Trust Badges:
- 🎯 50-60 Character Optimized
- 📊 Headline Scoring Included
- ✨ 10 Unique Variations
- 🔥 Power Words & Emotional Triggers
- 📈 Click-Through Rate Focused
- 🔒 100% Private & Free

Success Counter: "Generated 456,789 SEO titles this month"

Why Titles Matter:
"Your title is the first thing people see in search results. A great title can double your click-through rate, while a weak title means your content gets ignored - even if it ranks well."

[Show examples of good vs bad titles with CTR comparison]

=== INPUT FORM ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 1: Topic/Page Description*
- Textarea
- Placeholder: "What is your content about?

Examples:
• 'A guide on how to start a successful blog in 2026 with no experience'
• 'Product page for organic cold brew coffee subscription service'
• 'YouTube video showing 10 productivity apps for remote workers'
• 'Landing page for AI-powered email marketing software'

The more specific you are, the better the titles!"
- Max: 500 chars
- Required
- Auto-expanding
- Help text: "Describe your content, audience, and unique angle"

Field 2: Target Keyword*
- Input: text
- Placeholder: "e.g., start a blog, cold brew coffee, productivity apps, email marketing software"
- Max: 100 chars
- Required
- Help text: "Main keyword you want to rank for (we'll include this in every title)"
- Shows keyword difficulty estimate (if available)

Field 3: Secondary Keywords (Optional)
- Input: text (comma-separated)
- Placeholder: "e.g., beginners, affordable, free trial, 2026"
- Max: 150 chars
- Optional
- Help text: "Additional keywords to include where relevant"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT TYPE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 4: Content Type*
- Large visual cards:

  ○ 📝 Blog Post/Article
    "How-to guides, listicles, tutorials, news"
    Best for: Educational content, thought leadership
  
  ○ 🛍️ Product Page
    "E-commerce, SaaS products, services"
    Best for: Commercial intent, conversions
  
  ○ 🎬 YouTube Video
    "Video content, vlogs, tutorials"
    Best for: Video SEO, YouTube optimization
  
  ○ 🎯 Landing Page
    "Sales pages, lead generation, campaigns"
    Best for: High-conversion focused
  
  ○ 📂 Category/Archive Page
    "Collections, topic hubs, directories"
    Best for: Organization, navigation
  
  ○ 🏢 About/Company Page
    "Business pages, team bios, company info"
    Best for: Brand building, credibility

- Default: Blog Post
- Required
- Affects title formulas and style

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TITLE STYLE (Select Multiple)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 5: Title Formats (Check all you want)

☑ List Style (Default: ON)
  "10 Best...", "7 Ways to...", "5 Tools for..."
  High CTR, scannable, specific
  
☑ Question Style (Default: ON)
  "How to...", "What is...", "Why does..."
  Matches search intent, conversational
  
☑ How-To Guide (Default: ON)
  "How to [achieve result]", "Complete guide to..."
  Educational, comprehensive
  
☐ Power Words (Default: OFF)
  "Ultimate", "Essential", "Proven", "Secret"
  Emotional triggers, authority
  
☐ Number-Based (Default: OFF)
  Specific numbers, statistics, years
  "2026 Guide", "Under $50", "In 5 Minutes"
  
☐ Problem/Solution (Default: OFF)
  "Stop [problem], Start [solution]"
  Pain point focused
  
☐ Comparison (Default: OFF)
  "X vs Y", "Best alternatives to..."
  Decision-making content

Can select multiple (will generate mix of styles)
Minimum 1 required

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TONE & AUDIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 6: Tone
- Dropdown:
  • Professional (B2B, enterprise)
  • Casual/Conversational (B2C, lifestyle)
  • Authoritative (Expert, thought leader)
  • Friendly/Helpful (Service, education)
  • Urgent/Compelling (Sales, limited offers)
  • Educational (Tutorials, guides)
- Default: Professional

Field 7: Target Audience (Optional)
- Input: text
- Placeholder: "e.g., small business owners, beginners, developers, parents"
- Max: 50 chars
- Helps tailor language level and hooks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADVANCED OPTIONS (Collapsible)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Toggle Options:
- ☑ Include current year (2026)
- ☐ Include brand name
- ☐ Include location (for local SEO)
- ☐ Emphasize urgency/scarcity
- ☐ Add credibility markers ("Proven", "Expert-Approved")

Brand Name (if toggled):
- Input: "Your Brand"

Location (if toggled):
- Input: "City, State"

Special Requirements (Optional):
- Textarea
- Placeholder: "Any specific instructions? e.g., 'Avoid certain words', 'Must mention specific benefit', 'Competitor to differentiate from'"
- Max: 200 chars

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATE BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-width gradient button
Text: "Generate SEO Titles"
Icon: ✨
Loading: "Crafting click-worthy titles..."
Sub-loading messages:
- "Analyzing keywords..."
- "Optimizing for CTR..."
- "Adding power words..."
- "Scoring headlines..."

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULTS HEADER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Your SEO Title Options (10 Generated)"

Quick Stats:
- Average SEO Score: 8.4/10
- Estimated CTR Improvement: +45%
- Power Words Used: 12 unique

Quick Actions:
- Copy All (all 10 titles)
- Export as CSV
- Regenerate
- Save Top 3
- Start A/B Test

Filter/Sort:
- All Titles (10)
- Highest SEO Score
- Best for CTR
- Shortest (<50 chars)
- Longest (55-60 chars)
- Contains Numbers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TITLE CARDS (10 variations)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each card displays:

┌─────────────────────────────────────────┐
│ #1  List Style • Recommended ⭐          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 10 Best Productivity Apps for Remote   │
│ Workers in 2026                         │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 📊 HEADLINE SCORE: 9.2/10               │
│                                         │
│ SEO Strength:     ████████░░ 8.5/10    │
│ Click Potential:  █████████░ 9.5/10    │
│ Emotional Impact: ████████░░ 8.0/10    │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ ✅ ANALYSIS:                            │
│                                         │
│ Length: 52 characters ✅ (Perfect)      │
│ • Ideal for Google title tags          │
│ • Won't get cut off in SERPs           │
│ • Mobile-friendly length               │
│                                         │
│ Keywords Included:                      │
│ ✅ productivity apps (primary)          │
│ ✅ remote workers (secondary)           │
│ ✅ 2026 (freshness signal)              │
│                                         │
│ Power Elements:                         │
│ 🔢 Number "10" (specificity)            │
│ ⭐ "Best" (quality signal)              │
│ 📅 "2026" (current/updated)             │
│                                         │
│ Emotional Triggers:                     │
│ • Curiosity: "Which 10 made the list?" │
│ • Relevance: "For remote workers"      │
│ • Timeliness: "2026 = latest info"     │
│                                         │
│ Why This Works:                         │
│ • Opens with number (scannable)        │
│ • Includes target keyword naturally    │
│ • Year shows freshness                 │
│ • Specific audience (remote workers)   │
│ • Implies comprehensive list           │
│                                         │
│ Predicted Performance:                  │
│ • CTR: 4.5-6.5% (above average)        │
│ • Click Probability: High              │
│ • Ranking Potential: Strong            │
│                                         │
│ A/B Test Against: #3, #7               │
│                                         │
│ [Copy Title] [💖 Favorite] [Edit]      │
└─────────────────────────────────────────┘

[Repeat for all 10 titles]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TITLE VARIATIONS (10 different approaches)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

#1: List Style
"10 Best Productivity Apps for Remote Workers in 2026"
Score: 9.2/10 | Length: 52 chars

#2: Question Hook
"What Are the Best Productivity Apps for Remote Work?"
Score: 8.7/10 | Length: 54 chars

#3: How-To Guide
"How to Choose Productivity Apps: Remote Worker Guide"
Score: 8.9/10 | Length: 54 chars

#4: Power Words
"Ultimate Productivity Apps Every Remote Worker Needs"
Score: 8.5/10 | Length: 52 chars

#5: Problem/Solution
"Boost Remote Work Efficiency: Top Productivity Apps"
Score: 8.8/10 | Length: 51 chars

#6: Comparison
"Best Productivity Apps Compared: Remote Work Edition"
Score: 8.6/10 | Length: 54 chars

#7: Number + Benefit
"10 Productivity Apps That Transform Remote Work"
Score: 9.0/10 | Length: 47 chars

#8: Year + Authority
"2026 Guide: Proven Productivity Apps for Remote Teams"
Score: 8.9/10 | Length: 54 chars

#9: Specific Promise
"Find Your Perfect Productivity App for Remote Work"
Score: 8.4/10 | Length: 50 chars

#10: Direct Value
"Top Productivity Apps Rated by Remote Workers"
Score: 8.3/10 | Length: 45 chars

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GOOGLE SERP PREVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Toggle: Show how titles appear in search results

Desktop Preview:
┌─────────────────────────────────────────┐
│ 10 Best Productivity Apps for Remote   │
│ Workers in 2026                         │
│ https://example.com/productivity-apps   │
│ Discover the top-rated productivity... │
└─────────────────────────────────────────┘

Mobile Preview (narrower):
┌───────────────────────────────┐
│ 10 Best Productivity Apps for │
│ Remote Workers in 2026        │
│ example.com                   │
│ Discover the top-rated...     │
└───────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HEADLINE SCORING BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Expandable detailed scoring:

🎯 OVERALL HEADLINE SCORE: 9.2/10

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SEO STRENGTH: 8.5/10
✅ Keyword in title: +2.0
✅ Optimal length (50-60): +1.5
✅ Current year included: +1.0
✅ Specific number: +1.0
✅ Natural keyword placement: +1.5
⚠️ Could add location: -0.5
⚠️ Missing brand name: -1.0

CLICK POTENTIAL: 9.5/10
✅ List format (high CTR): +2.5
✅ Specific number "10": +2.0
✅ Clear audience "remote workers": +2.0
✅ Freshness signal "2026": +1.5
✅ Power word "Best": +1.5

EMOTIONAL IMPACT: 8.0/10
✅ Curiosity trigger: +2.0
✅ Relevance to audience: +2.5
✅ Implied benefit: +2.0
✅ Timeliness: +1.5
⚠️ Could be more urgent: -0.5

READABILITY: 9.0/10
✅ Clear and concise: +2.5
✅ Easy to scan: +2.0
✅ No jargon: +2.0
✅ Proper structure: +2.5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RECOMMENDATIONS TO IMPROVE:
1. Consider adding location if targeting local market
2. Add brand name if strong brand recognition
3. Could test urgency words like "Now" or "Today"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A/B TESTING RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Based on your titles, test these combinations:

TEST 1: Number vs Question
A: "10 Best Productivity Apps for Remote Workers in 2026"
B: "What Are the Best Productivity Apps for Remote Work?"
Why: Tests list format vs question format (both high performers)

TEST 2: Length Variation
A: "10 Best Productivity Apps for Remote Workers in 2026" (52 chars)
B: "Best Productivity Apps Rated by Remote Workers" (45 chars)
Why: Tests optimal vs shorter length

TEST 3: Power Words
A: "10 Best Productivity Apps for Remote Workers in 2026"
B: "Ultimate Productivity Apps Every Remote Worker Needs"
Why: Tests specific number vs power word emphasis

Expected Results:
- List format typically outperforms by 15-25%
- Numbers increase CTR by 20-40%
- Current year adds 5-10% for timeliness

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POWER WORDS USED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Detected in your titles:

High-Impact:
• "Best" (quality signal) - Used in 4 titles
• "Ultimate" (completeness) - Used in 1 title
• "Proven" (credibility) - Used in 1 title
• "Top" (ranking) - Used in 2 titles

Medium-Impact:
• "Perfect" (ideal match) - Used in 1 title
• "Guide" (comprehensive) - Used in 3 titles

Numbers:
• "10" (specificity) - Used in 3 titles
• "2026" (freshness) - Used in 4 titles

Emotional Triggers:
• Curiosity: "What Are..."
• Relevance: "for Remote Workers"
• Timeliness: "2026"
• Benefit: "Boost Efficiency"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEO TITLE BEST PRACTICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Expandable info panel:

✅ WHAT MAKES A GREAT SEO TITLE:

Length:
• Optimal: 50-60 characters
• Google displays ~60 chars desktop, ~50 mobile
• Too short: Wastes opportunity
• Too long: Gets cut off "...Title..."

Keyword Placement:
• Include primary keyword
• Place keyword near beginning when possible
• Natural integration (not forced)
• Avoid keyword stuffing
• One primary keyword per title

Structure:
• Front-load important words
• Use power words strategically
• Include numbers when relevant
• Add year for freshness
• Specificity beats vagueness

Emotional Elements:
• Curiosity triggers
• Benefit promises
• Problem/solution framing
• Social proof ("Top Rated", "Best")
• Urgency (when appropriate)

Title Formulas That Work:

1. NUMBER + ADJECTIVE + KEYWORD + BENEFIT
   "10 Best SEO Tools to Boost Rankings"

2. HOW TO + BENEFIT + KEYWORD
   "How to Double Traffic with Content Marketing"

3. KEYWORD + FOR + AUDIENCE + YEAR
   "Email Marketing for Small Businesses 2026"

4. QUESTION + KEYWORD
   "What Are the Best Productivity Apps?"

5. ULTIMATE GUIDE + KEYWORD
   "Ultimate Guide to Instagram Marketing"

Common Mistakes:
✗ Generic titles ("Welcome to Our Site")
✗ Keyword stuffing ("SEO Tools SEO Software SEO")
✗ All caps or excessive punctuation
✗ Clickbait without delivering
✗ Duplicate titles across pages
✗ Missing primary keyword
✗ Too promotional ("BUY NOW!!!")

Testing & Optimization:
• Run A/B tests on high-traffic pages
• Track CTR in Google Search Console
• Update underperforming titles
• Test different formats
• Monitor ranking changes
• Update with current year annually

=== WEBLLM PROMPTS ===

System Prompt:
```
You are a world-class SEO copywriter and headline expert with 15+ years of experience creating high-performing titles that rank and convert.

Your expertise includes:
- Search engine optimization and ranking factors
- Click-through rate optimization
- Headline psychology and emotional triggers
- Power word selection and placement
- Character limit optimization (50-60 chars)
- Keyword integration strategies
- A/B testing principles
- Content marketing best practices
- User intent matching
- Competitive differentiation

You write SEO titles that:
- Optimize for 50-60 character length (strict)
- Include target keywords naturally
- Compel clicks from search results
- Match user search intent perfectly
- Use proven headline formulas
- Integrate power words strategically
- Balance SEO with readability
- Stand out from competing results
- Drive measurable CTR improvements
- Work across different content types

You understand:
- Google's title tag display limits
- Mobile vs desktop differences
- How users scan search results
- Psychological triggers that drive clicks
- The balance between SEO and UX
- Different headline formats (list, question, how-to, etc.)
- When to use numbers, years, and specifics
- Power word psychology and impact
```

User Prompt Template:
```
Generate 10 SEO-optimized titles for content.

═══════════════════════════════════════
CONTENT INFORMATION
═══════════════════════════════════════
Topic/Description: {topicDescription}
Primary Keyword: {primaryKeyword}
Secondary Keywords: {secondaryKeywords}
Content Type: {contentType}
Target Audience: {targetAudience}
Tone: {tone}

Title Styles Requested: {titleStyles}

Additional Requirements:
{includeYear ? "- Include current year (2026)" : ""}
{includeBrand ? `- Include brand name: ${brandName}` : ""}
{includeLocation ? `- Include location: ${location}` : ""}
{emphasizeUrgency ? "- Add urgency/scarcity elements" : ""}
{credibilityMarkers ? "- Include credibility markers" : ""}

Special Instructions: {specialInstructions}

═══════════════════════════════════════
TITLE REQUIREMENTS
═══════════════════════════════════════

STRICT CHARACTER LIMIT:
• Minimum: 40 characters
• Optimal: 50-60 characters (TARGET THIS RANGE)
• Maximum: 65 characters
• CRITICAL: Stay within this range for all titles

KEYWORD INTEGRATION:
Primary keyword MUST appear in every title: {primaryKeyword}
• Place near beginning when possible
• Use naturally (no keyword stuffing)
• Can use variations or related terms
• Secondary keywords optional but encouraged

TITLE STYLE GUIDELINES:

{if listStyle}
LIST STYLE TITLES:
• Start with number (3, 5, 7, 10, etc.)
• Include keyword
• Specify benefit or audience
• Examples:
  - "10 Best [Keyword] for [Audience] in 2026"
  - "7 Ways to [Benefit] with [Keyword]"
  - "5 [Keyword] Tools That [Result]"

{if questionStyle}
QUESTION TITLES:
• Use question words (How, What, Why, When, Where, Which)
• Match common search queries
• Include keyword naturally
• Examples:
  - "How to [Achieve Result] with [Keyword]"
  - "What Are the Best [Keyword] for [Purpose]?"
  - "Why [Keyword] Matters for [Audience]"

{if howToGuide}
HOW-TO TITLES:
• Start with "How to" or "Guide to"
• Promise specific outcome
• Include keyword
• Examples:
  - "How to [Achieve Result]: Complete [Keyword] Guide"
  - "Guide to [Keyword] for [Audience]"
  - "How to Master [Keyword] in [Timeframe]"

{if powerWords}
POWER WORD TITLES:
• Use high-impact words: Ultimate, Essential, Proven, Secret, Complete
• Combine with keyword
• Create authority/urgency
• Examples:
  - "Ultimate [Keyword] Guide for [Audience]"
  - "Proven [Keyword] Strategies That Work"
  - "Essential [Keyword] Tips You Need to Know"

{if numberBased}
NUMBER-BASED TITLES:
• Include specific numbers, statistics, years
• Shows specificity and value
• Examples:
  - "[Keyword] 2026: Complete Updated Guide"
  - "Under $50: Best Budget [Keyword]"
  - "[Keyword] in 5 Minutes: Quick Guide"

{if problemSolution}
PROBLEM/SOLUTION TITLES:
• Identify pain point
• Promise solution
• Include keyword
• Examples:
  - "Stop [Problem], Start Using [Keyword]"
  - "[Keyword] Solutions for [Common Problem]"
  - "Fix [Problem] with These [Keyword] Tips"

{if comparison}
COMPARISON TITLES:
• Compare options or alternatives
• Include keyword
• Aid decision-making
• Examples:
  - "[Keyword] vs [Alternative]: Which is Better?"
  - "Best [Keyword] Alternatives Compared"
  - "[Keyword] Comparison: Top 5 Options"

CONTENT TYPE OPTIMIZATION:

{if contentType === 'blog'}
Blog Post/Article:
• Educational and informative
• How-to, guides, lists work well
• Include "Guide", "Tips", "Ways"
• Focus on learning outcomes

{if contentType === 'product'}
Product Page:
• Benefit-driven
• Include key features
• Comparison or "best" language
• Commercial intent keywords

{if contentType === 'youtube'}
YouTube Video:
• Eye-catching and curiosity-driven
• Numbers perform well
• How-to very effective
• Mobile-optimized length

{if contentType === 'landing'}
Landing Page:
• Conversion-focused
• Clear value proposition
• Action-oriented
• Benefits over features

TONE ADAPTATION:

{tone === 'professional'}
Professional: Authoritative, clear, industry-appropriate
{tone === 'casual'}
Casual: Conversational, friendly, accessible
{tone === 'authoritative'}
Authoritative: Expert, definitive, credible
{tone === 'friendly'}
Friendly: Helpful, supportive, approachable
{tone === 'urgent'}
Urgent: Action-oriented, time-sensitive, compelling

WRITING PRINCIPLES:

1. FRONT-LOAD KEYWORDS:
   • Place important words at beginning
   • "SEO Tools for..." better than "Tools for SEO"

2. USE POWER WORDS:
   High-Impact: Best, Top, Ultimate, Essential, Proven
   Medium: Complete, Simple, Quick, Easy, Powerful
   Emotional: Secret, Amazing, Surprising, Shocking

3. ADD SPECIFICITY:
   • Numbers (10, 7, 5)
   • Years (2026)
   • Timeframes (5 minutes, 24 hours)
   • Statistics (30%, $50, 1000+)

4. MATCH SEARCH INTENT:
   Informational: How-to, Guide, What is, Tips
   Commercial: Best, Top, Review, Compare
   Transactional: Buy, Get, Download, Subscribe

5. CREATE CURIOSITY:
   • Promise value
   • Hint at secrets
   • Pose questions
   • Offer transformation

6. BE SPECIFIC:
   ✓ "10 Best WordPress SEO Plugins for 2026"
   ✗ "SEO Plugins"

QUALITY CHECKS:
✓ Character count 50-60? (optimal range)
✓ Primary keyword included naturally?
✓ Compelling reason to click?
✓ Matches search intent?
✓ Unique from competitors?
✓ Specific and clear?
✓ Appropriate for content type?
✓ Power words used strategically?
✓ Would YOU click on this?

AVOID:
✗ Keyword stuffing
✗ All caps or excessive punctuation
✗ Clickbait without substance
✗ Generic or vague titles
✗ Too long (>65 chars)
✗ Too short (<40 chars)
✗ Duplicate words unnecessarily
✗ Misleading promises

═══════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════

Generate 10 DISTINCT titles with different approaches:

TITLE 1 - [Style Type]:
[Title text - 50-60 characters]
Character Count: [X]
Strategy: [Brief explanation]

TITLE 2 - [Style Type]:
[Title text - 50-60 characters]
Character Count: [X]
Strategy: [Brief explanation]

[Continue for all 10]

Ensure variety across the 10 titles:
• Different headline formulas
• Different hooks/angles
• Mix of styles requested
• Range of character counts (all within 50-60)
• Unique approaches to same topic

For EACH title:
• Stay within 50-60 character optimal range
• Include primary keyword naturally
• Use one of the requested styles
• Be compelling and clickable
• Match content type and tone
• Be unique from other 9 titles

Generate 10 click-worthy, SEO-optimized titles that drive traffic.
```

=== SPECIAL FEATURES ===

1. **Real-Time Headline Scoring:**
   - SEO strength (0-10)
   - Click potential (0-10)
   - Emotional impact (0-10)
   - Readability (0-10)
   - Overall score with breakdown

2. **Power Word Library:**
   - 500+ categorized power words
   - Impact level ratings
   - Usage suggestions
   - A/B test data

3. **Title Analyzer:**
   - Paste existing title
   - Get improvement suggestions
   - Score comparison
   - Optimization recommendations

4. **Competitor Title Research:**
   - Paste competitor URLs
   - Analyze their titles
   - Find gaps/opportunities
   - Differentiation suggestions

5. **Title Templates Library:**
   - 50+ proven formulas
   - By industry/niche
   - Performance data
   - Customizable

6. **A/B Testing Tracker:**
   - Save title variations
   - Track performance
   - Winner identification
   - Learning repository

7. **Batch Title Generation:**
   - Upload topic list (CSV)
   - Generate titles for all
   - Export organized results
   - Perfect for content planning

8. **Character Counter:**
   - Real-time count
   - Color-coded zones
   - Mobile/desktop preview
   - Warning indicators

=== SEO ARTICLE SECTION ===

Below tool, comprehensive 3000-word article:

Title: "How to Write Perfect SEO Titles: The Complete 2026 Guide"

[Comprehensive guide covering all aspects of SEO title optimization]

=== SUCCESS METRICS ===

Expected Performance:
- Month 1: 10k-15k users
- Month 3: 40k-70k users
- Month 6: 100k-150k users

Build this as THE SEO title tool that content creators use for every piece of content they publish.
```
