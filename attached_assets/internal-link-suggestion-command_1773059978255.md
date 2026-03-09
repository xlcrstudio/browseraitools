

## Complete Build Command for browseraitools.com

```
Create a mobile-first, SEO-focused AI Internal Link Suggestion Tool for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI Internal Link Suggestion Tool
URL Slug: /ai-internal-link-suggestion-tool
Tagline: "Optimize Your Site Structure with Smart Internal Linking"
Mission: Help SEO professionals and website owners build strong internal linking structures that improve rankings and user experience

=== PRODUCT OVERVIEW ===
Advanced SEO tool for professionals.
Purpose: Analyze page content and suggest strategic internal linking opportunities to improve site structure, crawlability, topical authority, and PageRank distribution.
Target Users: SEO professionals, content marketers, web developers, agencies, site owners
Search Demand: 20,000-50,000 monthly searches
- "internal link generator" - 15k/month
- "internal linking SEO tool" - 12k/month
- "internal link suggestion AI" - 8k/month
- "site structure optimization" - 10k/month

Key Value: Intelligent internal linking strategy in minutes vs manual analysis

=== UNIQUE SELLING POINTS ===
✅ AI-powered relevance analysis
✅ Anchor text suggestions (SEO-optimized)
✅ Topical authority mapping
✅ Link density optimization
✅ Crawlability improvement recommendations
✅ PageRank distribution analysis
✅ Contextual link placement
✅ Avoid over-optimization warnings
✅ Competitor internal linking insights

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared instance)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (site structure, linking patterns)
Export: CSV, JSON, SEO report
Deployment: Vercel/Netlify

=== PAGE STRUCTURE ===

HERO SECTION:
Headline: "AI Internal Link Suggestion Tool"
Subheadline: "Build powerful internal linking structures that boost rankings. AI analyzes your content and suggests strategic internal links with optimized anchor text. Improve crawlability, topical authority, and PageRank distribution."

Trust Badges:
- 🔗 Smart Anchor Text Suggestions
- 🎯 Topical Relevance Scoring
- 📊 Link Density Analysis
- 🕷️ Crawlability Optimization
- 📈 PageRank Distribution
- 🔒 100% Private

Success Counter: "Analyzed 45,678 pages for internal linking this month"

Why Internal Linking Matters:
"Internal links are one of the most powerful (and overlooked) SEO strategies. Good internal linking helps:
• Google crawl and index your site better
• Build topical authority on key topics
• Distribute PageRank to important pages
• Improve user navigation and engagement
• Rank higher in search results"

[Show diagram of strong vs weak internal linking structure]

=== INPUT FORM ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE CONTENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 1: Page Content to Analyze*
- Large textarea (auto-expanding)
- Placeholder: "Paste the full content of the page you want to add internal links to.

You can paste:
• Blog post content
• Product page description
• Service page text
• Category page content
• Any page where you want to add internal links

Include the full text so the AI can identify relevant linking opportunities."
- Max: 10,000 chars
- Required
- Shows word count
- Help text: "Paste the actual page content (not HTML)"

Field 2: Page URL/Title
- Input: text
- Placeholder: "e.g., /blog/seo-guide-2026 or 'Complete SEO Guide 2026'"
- Max: 200 chars
- Optional but recommended
- Help text: "Helps track which page you're optimizing"

Field 3: Target Keywords for This Page
- Input: text (comma-separated)
- Placeholder: "e.g., SEO guide, search engine optimization, SEO tips"
- Max: 200 chars
- Optional
- Help text: "Main keywords this page targets"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SITE STRUCTURE (Your Other Pages)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 4: Existing Site Pages*
- Large textarea (auto-expanding)
- Placeholder: "Paste your site's pages that could be linked to. Format:

Option A - URLs List:
/blog/keyword-research-guide
/blog/link-building-tips
/tools/seo-analyzer
/services/seo-consulting

Option B - URL + Description:
/blog/keyword-research-guide | Complete guide to finding keywords
/blog/link-building-tips | 15 proven link building strategies
/tools/seo-analyzer | Free SEO analysis tool

Option C - Sitemap XML:
[Paste your XML sitemap]

The more pages you include, the better the suggestions!"
- Max: 20,000 chars
- Required
- Accepts multiple formats
- Help text: "List pages that could receive internal links"

Field 5: Current Internal Links (Optional)
- Textarea
- Placeholder: "List internal links already on this page (so we don't duplicate):
/about
/contact
/blog/seo-basics"
- Max: 2,000 chars
- Optional
- Helps avoid duplicate suggestions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LINKING STRATEGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 6: Linking Goal
- Radio buttons:
  ○ Topical Authority
    "Link to pages on similar topics to build expertise cluster"
  
  ○ PageRank Distribution
    "Link to important pages that need ranking boost"
  
  ○ User Experience
    "Link to helpful resources users would want to explore"
  
  ○ Balanced Approach
    "Mix of SEO and UX considerations" [DEFAULT]

- Default: Balanced
- Required

Field 7: Number of Internal Links to Suggest
- Slider: 3-15 links
- Default: 5-10
- Shows recommended range based on content length
- Help text: "Depends on content length. Longer content can support more links."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADVANCED OPTIONS (Collapsible)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Toggle Options:
- ☑ Include anchor text suggestions (Default: ON)
- ☑ Prioritize deep pages (not just homepage) (Default: ON)
- ☐ Suggest links to conversion pages (products, services)
- ☐ Only suggest links to high-authority pages
- ☐ Avoid over-optimization (vary anchor text)

Priority Pages (Optional):
- Textarea
- Placeholder: "Pages you especially want to link to:
/services/seo-consulting
/products/premium-plan"
- Help text: "We'll prioritize these if relevant"

Avoid Linking To (Optional):
- Textarea
- Placeholder: "Pages to exclude:
/admin
/checkout
/thank-you"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANALYZE BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-width gradient button
Text: "Analyze & Suggest Internal Links"
Icon: 🔗
Loading: "Analyzing content structure..."
Sub-messages:
- "Identifying topics..."
- "Matching relevant pages..."
- "Optimizing anchor text..."
- "Calculating link density..."

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANALYSIS OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Internal Linking Analysis for: [Page Title]"

Quick Stats:
- Content Length: 2,450 words
- Suggested Links: 8 opportunities
- Current Links: 3 (existing)
- Recommended Total: 8-12 links
- Link Density: 0.5% (healthy)
- Topical Relevance Score: 8.7/10

Quick Actions:
- Export All Suggestions (CSV/JSON)
- Generate HTML Code
- Save Analysis
- Analyze Different Page
- View Site Link Map

Status Indicators:
✅ Link density: Optimal (0.3-0.5%)
✅ Topical relevance: High
⚠️ Could add 2-4 more links
✅ Anchor text variety: Good

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERNAL LINK SUGGESTIONS (Ranked by Priority)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each suggestion displayed as detailed card:

┌─────────────────────────────────────────┐
│ SUGGESTION #1                            │
│ Priority: High 🔥 • Relevance: 9.5/10    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 🔗 SUGGESTED LINK:                      │
│ Link To: /blog/keyword-research-guide   │
│ Page Title: "Complete Keyword Research  │
│              Guide for 2026"            │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 📝 RECOMMENDED ANCHOR TEXT:             │
│                                         │
│ Option 1 (Primary): keyword research    │
│ • Natural, exact match                  │
│ • SEO strength: High                    │
│ • User-friendly: ✅                     │
│                                         │
│ Option 2 (Alternative): finding the     │
│ right keywords                          │
│ • Natural, descriptive                  │
│ • SEO strength: Medium                  │
│ • Less exact, more conversational       │
│                                         │
│ Option 3 (Branded): our keyword guide   │
│ • Branded, natural                      │
│ • SEO strength: Low-Medium              │
│ • Good for anchor text diversity        │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 📍 WHERE TO PLACE:                      │
│ Suggested location in your content:     │
│                                         │
│ "...before you optimize your content.   │
│ Start with [keyword research] to        │
│ understand what your audience is        │
│ searching for..."                       │
│                                         │
│ Context: Paragraph 3, discussing SEO    │
│ fundamentals                            │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ ✨ WHY THIS LINK WORKS:                 │
│                                         │
│ Topical Relevance:                      │
│ • Both pages about SEO fundamentals     │
│ • Natural topic progression             │
│ • Builds topical authority cluster      │
│                                         │
│ SEO Benefits:                           │
│ • Passes PageRank to important page     │
│ • Reinforces keyword relevance          │
│ • Improves crawlability                 │
│                                         │
│ User Experience:                        │
│ • Helpful related resource              │
│ • Natural next step in learning         │
│ • Keeps users on site longer            │
│                                         │
│ Strategic Value:                        │
│ • Target page ranks #15 for "keyword    │
│   research" - could boost with more     │
│   internal links                        │
│ • Complements current page topic        │
│ • Part of SEO content cluster           │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 💡 IMPLEMENTATION:                      │
│                                         │
│ HTML Code:                              │
│ <a href="/blog/keyword-research-guide"> │
│ keyword research</a>                    │
│                                         │
│ Markdown:                               │
│ [keyword research](/blog/keyword-       │
│ research-guide)                         │
│                                         │
│ [Copy HTML] [Copy Markdown] [Skip]     │
└─────────────────────────────────────────┘

[Repeat for 5-10 suggestions, ranked by priority]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LINK DENSITY ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 📊 INTERNAL LINK DENSITY                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Current State:                          │
│ • Total Words: 2,450                    │
│ • Current Internal Links: 3             │
│ • Current Density: 0.12%                │
│                                         │
│ With Suggested Links:                   │
│ • Suggested Additional Links: 8         │
│ • Total Links: 11                       │
│ • New Density: 0.45%                    │
│                                         │
│ ASSESSMENT: ✅ Optimal                  │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ RECOMMENDED LINK DENSITY:               │
│                                         │
│ ✅ Healthy Range: 0.3% - 0.5%           │
│ ⚠️ Low (add more): < 0.2%               │
│ ⚠️ High (reduce): > 1.0%                │
│ 🚫 Over-optimized: > 2.0%               │
│                                         │
│ Your Score: 0.45% ✅                    │
│                                         │
│ RECOMMENDATION:                         │
│ Your link density will be in the sweet │
│ spot. This provides good SEO value     │
│ without over-optimization risk.         │
│                                         │
│ You could add 2-4 more links if you    │
│ find additional relevant opportunities.│
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOPICAL AUTHORITY MAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🎯 TOPICAL AUTHORITY ANALYSIS            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ This page is part of:                   │
│ SEO FUNDAMENTALS CLUSTER                │
│                                         │
│ Current Cluster Structure:              │
│                                         │
│     [SEO Guide 2026] ← You are here    │
│            ↓                            │
│     ┌──────┼──────┐                    │
│     │      │      │                    │
│  Keyword Link  Technical                │
│  Research Building SEO                  │
│     ↓      ↓      ↓                    │
│  (More sub-topics)                      │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ SUGGESTED CLUSTER LINKS:                │
│                                         │
│ ✅ Linked to 3/7 cluster pages          │
│                                         │
│ Still need links to:                    │
│ • Link Building Strategies (Important!) │
│ • Technical SEO Checklist               │
│ • Content Optimization Guide            │
│ • Local SEO Best Practices              │
│                                         │
│ IMPACT OF COMPLETING CLUSTER:           │
│ • Stronger topical authority            │
│ • Better ranking potential              │
│ • Improved site structure               │
│ • Enhanced crawlability                 │
│                                         │
│ [View Full Site Cluster Map]            │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGERANK DISTRIBUTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 📈 PAGERANK FLOW OPTIMIZATION            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Pages Suggested for Internal Links:     │
│                                         │
│ HIGH PRIORITY (Need PageRank boost):    │
│ • /blog/keyword-research-guide          │
│   Current: 5 incoming internal links    │
│   With your link: 6 links               │
│   Impact: Medium-High                   │
│                                         │
│ • /services/seo-consulting              │
│   Current: 12 incoming internal links   │
│   With your link: 13 links              │
│   Impact: High (conversion page)        │
│                                         │
│ MEDIUM PRIORITY:                        │
│ • /blog/link-building-tips              │
│   Current: 8 links | Impact: Medium     │
│                                         │
│ ALREADY WELL-LINKED:                    │
│ • /blog/seo-basics                      │
│   Current: 23 links (sufficient)        │
│   Not in suggestions                    │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ STRATEGIC RECOMMENDATIONS:              │
│                                         │
│ 1. Prioritize links to conversion pages│
│    (services, products) when contextual │
│                                         │
│ 2. Support underperforming content      │
│    (pages with <5 internal links)       │
│                                         │
│ 3. Build topic clusters (related        │
│    content linked together)             │
│                                         │
│ 4. Don't over-link to already strong    │
│    pages (>20 internal links)           │
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANCHOR TEXT OPTIMIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 📝 ANCHOR TEXT STRATEGY                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ ANCHOR TEXT DIVERSITY ANALYSIS:         │
│                                         │
│ Your suggested anchor texts:            │
│                                         │
│ Exact Match: 30% (3/10 links)           │
│ • "keyword research"                    │
│ • "link building"                       │
│ • "SEO tools"                           │
│                                         │
│ Partial Match: 40% (4/10 links)         │
│ • "finding keywords"                    │
│ • "building quality backlinks"          │
│ • "SEO software tools"                  │
│ • "search optimization"                 │
│                                         │
│ Branded/Generic: 20% (2/10 links)       │
│ • "our guide"                           │
│ • "read more here"                      │
│                                         │
│ Naked URLs: 10% (1/10 links)            │
│ • Full URL displayed                    │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ ASSESSMENT: ✅ Well-Balanced            │
│                                         │
│ HEALTHY ANCHOR TEXT MIX:                │
│ • Exact match: 20-40% ✅                │
│ • Partial match: 30-50% ✅              │
│ • Branded/Generic: 20-30% ✅            │
│ • Naked URLs: 5-15% ✅                  │
│                                         │
│ TIPS:                                   │
│ • Vary anchor text for same target page │
│ • Use natural, contextual phrases       │
│ • Avoid over-optimization (>50% exact)  │
│ • Mix commercial & informational        │
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRAWLABILITY IMPROVEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🕷️ CRAWLABILITY OPTIMIZATION             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ DEEP PAGE LINKING:                      │
│                                         │
│ Current page depth: 2 clicks from       │
│ homepage                                │
│                                         │
│ Pages we suggest linking to:            │
│                                         │
│ ✅ Shallow pages (1-2 clicks):          │
│ • /blog/keyword-research-guide (2)      │
│ • /services/seo-consulting (1)          │
│                                         │
│ ⚠️ Deep pages (3-4 clicks):             │
│ • /blog/advanced-technical-seo (4)      │
│ • /resources/seo-glossary (3)           │
│                                         │
│ RECOMMENDATION:                         │
│ By linking to deeper pages, you help    │
│ Google discover and index them faster.  │
│                                         │
│ Impact:                                 │
│ • Faster indexing of deep content       │
│ • Better PageRank distribution          │
│ • Improved site architecture            │
│ • More pages in search results          │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ ORPHAN PAGE CHECK:                      │
│                                         │
│ ✅ No orphan pages detected in          │
│    suggested links                      │
│                                         │
│ (Orphan pages = pages with no internal │
│  links pointing to them)                │
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPLEMENTATION CODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Auto-generated HTML/Markdown:

HTML Version:
```html
<!-- Suggestion #1 -->
<p>...before you optimize your content. Start with 
<a href="/blog/keyword-research-guide">keyword research</a> 
to understand what your audience is searching for...</p>

<!-- Suggestion #2 -->
<p>...effective strategies include 
<a href="/blog/link-building-tips">building quality backlinks</a> 
from authoritative sites...</p>

[Continue for all suggestions]
```

Markdown Version:
```markdown
...before you optimize your content. Start with 
[keyword research](/blog/keyword-research-guide) 
to understand what your audience is searching for...
```

WordPress Shortcode:
```
[internal-link url="/blog/keyword-research-guide"]keyword research[/internal-link]
```

[Copy HTML] [Copy Markdown] [Copy WordPress]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERNAL LINKING BEST PRACTICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Expandable info panel:

✅ INTERNAL LINKING FUNDAMENTALS:

Link Density:
• Optimal: 0.3-0.5% of total words
• Example: 1,000 word article = 3-5 internal links
• Too few: Missing opportunities
• Too many: Over-optimization, spammy

Anchor Text:
• Use descriptive, relevant phrases
• Mix exact match with variations
• Avoid generic "click here" or "read more"
• Natural placement in context
• Vary anchor text for same target page

Strategic Linking:
• Link to relevant, related content
• Support important pages (products, services)
• Build topical clusters (related content)
• Help deep pages get discovered
• Don't just link to homepage

Placement:
• Within main content (not just footer/sidebar)
• Early in article when relevant
• Natural flow, not forced
• Where users would actually click
• Multiple links spread throughout long content

User Experience:
• Truly helpful to readers
• Adds value to content
• Natural next steps
• Keeps users engaged
• Reduces bounce rate

SEO Benefits:
• Helps Google understand site structure
• Distributes PageRank strategically
• Builds topical authority
• Improves crawlability
• Can boost rankings

Common Mistakes:
✗ Too many links (>2% density)
✗ Over-optimized anchor text (all exact match)
✗ Only linking to homepage
✗ Generic anchor text
✗ Irrelevant links
✗ Broken internal links
✗ Links in hidden content

=== WEBLLM PROMPTS ===

System Prompt:
```
You are an expert SEO strategist specializing in internal linking architecture and site structure optimization.

Your expertise includes:
- Internal linking strategy and best practices
- Topical authority and content clustering
- PageRank distribution and link equity
- Crawlability and indexation optimization
- Anchor text optimization and diversity
- User experience and navigation
- Link density analysis
- Site architecture planning

You analyze content to suggest internal links that:
- Are highly topically relevant
- Use optimal anchor text (varied, natural)
- Build topical authority clusters
- Distribute PageRank strategically
- Improve site crawlability
- Enhance user experience
- Avoid over-optimization
- Follow SEO best practices

You understand:
- How search engines use internal links
- The balance between SEO and UX
- Anchor text diversity importance
- Topical clustering concepts
- PageRank flow mechanics
- Link density thresholds
- Natural vs forced linking
- When to link and when not to
```

User Prompt Template:
```
Analyze page content and suggest strategic internal linking opportunities.

═══════════════════════════════════════
PAGE CONTENT TO ANALYZE
═══════════════════════════════════════
{pageContent}

Page URL/Title: {pageURL}
Target Keywords: {targetKeywords}

═══════════════════════════════════════
AVAILABLE INTERNAL PAGES
═══════════════════════════════════════
{existingSitePages}

Current Internal Links (already on page):
{currentInternalLinks}

═══════════════════════════════════════
LINKING STRATEGY
═══════════════════════════════════════
Goal: {linkingGoal}
Number of Links Requested: {numLinks}

Preferences:
{includeAnchorText ? "- Suggest optimized anchor text" : ""}
{prioritizeDeepPages ? "- Prioritize deep pages over homepage" : ""}
{conversionPages ? "- Include links to conversion pages" : ""}
{highAuthority ? "- Only suggest high-authority pages" : ""}
{avoidOverOptimization ? "- Vary anchor text to avoid over-optimization" : ""}

Priority Pages: {priorityPages}
Avoid Linking To: {avoidPages}

═══════════════════════════════════════
ANALYSIS REQUIREMENTS
═══════════════════════════════════════

For EACH suggested internal link, provide:

1. TARGET PAGE:
   - URL of page to link to
   - Page title/description
   - Why this page is relevant

2. ANCHOR TEXT SUGGESTIONS:
   Generate 3 anchor text options:
   - Option 1: Exact match (target keyword)
   - Option 2: Partial match (descriptive phrase)
   - Option 3: Branded/generic (for diversity)
   
   For each option, note:
   - SEO strength (High/Medium/Low)
   - Naturalness in context
   - User-friendliness

3. PLACEMENT RECOMMENDATION:
   - Where in the content to place link
   - Surrounding context (quote sentence before/after)
   - Why this placement makes sense

4. STRATEGIC VALUE:
   Explain why this link is valuable:
   - Topical Relevance: How related to current page
   - SEO Benefits: PageRank, authority, indexing
   - User Experience: Why helpful to readers
   - Strategic Value: Cluster building, conversions, etc.

5. RELEVANCE SCORE:
   Rate topical relevance: 0-10
   (10 = extremely relevant, same topic)
   (7-9 = highly relevant, related topic)
   (5-6 = moderately relevant, complementary)
   (<5 = low relevance, don't suggest)

RANKING CRITERIA:

Prioritize suggestions based on:
1. Topical relevance (highest weight)
2. Strategic importance (PageRank needs, conversions)
3. User value (truly helpful)
4. Crawlability improvement (deep pages)
5. Cluster building (topic hubs)

LINKING BEST PRACTICES:

Link Density:
• Calculate: (number of links / word count) * 100
• Target: 0.3-0.5% is optimal
• Warn if suggesting too many links
• Consider existing links in calculation

Anchor Text Diversity:
• Mix exact match, partial match, branded/generic
• Avoid over-optimization (>50% exact match = risky)
• Use natural, contextual phrases
• Vary anchor text if linking to same page

Topical Clustering:
• Identify related content groups
• Suggest links that build clusters
• Connect hub pages to sub-topic pages
• Build topical authority

PageRank Distribution:
• Identify pages needing link equity
• Prioritize important pages (conversions)
• Don't over-link to already strong pages
• Balance link flow across site

User Experience:
• Links must be genuinely helpful
• Natural progression of information
• Clear next steps for readers
• Maintain content flow

AVOID:
✗ Irrelevant links (relevance score <5)
✗ Over-optimization (too many exact match anchors)
✗ Excessive link density (>1%)
✗ Generic anchor text only ("click here")
✗ Links to pages explicitly marked avoid
✗ Duplicate suggestions to existing links
✗ Forced, unnatural link placement

═══════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════

Generate {numLinks} internal link suggestions, ranked by priority:

SUGGESTION #1
Priority: [High/Medium/Low] • Relevance: [X/10]

SUGGESTED LINK:
Link To: [URL]
Page Title: [Title]

RECOMMENDED ANCHOR TEXT:
Option 1 (Primary): [anchor text]
• SEO strength: [High/Medium/Low]
• Context: [How it fits]

Option 2 (Alternative): [anchor text]
• SEO strength: [High/Medium/Low]
• Context: [How it fits]

Option 3 (Branded): [anchor text]
• SEO strength: [Low-Medium]
• Context: [For diversity]

WHERE TO PLACE:
Suggested location: [Quote surrounding text]
Context: [Which paragraph/section]

WHY THIS LINK WORKS:
Topical Relevance:
• [Explanation]

SEO Benefits:
• [Specific benefits]

User Experience:
• [Why helpful]

Strategic Value:
• [Business/ranking value]

[Repeat for all suggestions]

LINK DENSITY ANALYSIS:
Current internal links: [X]
Suggested additional links: [Y]
Total: [X+Y]
New density: [Z]%
Assessment: [Optimal/Too high/Too low]

TOPICAL AUTHORITY:
This page is part of: [Topic cluster]
Suggested cluster links: [List related pages]
Impact: [How this strengthens authority]

ANCHOR TEXT DIVERSITY:
Exact match: [X]%
Partial match: [Y]%
Branded/Generic: [Z]%
Assessment: [Balanced/Needs variety/Good]

Generate strategic, SEO-optimized internal link suggestions that improve rankings and user experience.
```

=== SPECIAL FEATURES ===

1. **Site-Wide Analysis:**
   - Upload entire sitemap
   - Analyze all pages
   - Generate site-wide linking recommendations
   - Export comprehensive report

2. **Visual Link Map:**
   - Interactive site structure visualization
   - See link relationships
   - Identify orphan pages
   - Find over/under-linked pages

3. **Broken Link Checker:**
   - Scan for broken internal links
   - Get fix suggestions
   - Bulk update recommendations

4. **Competitor Analysis:**
   - Paste competitor URLs
   - Analyze their internal linking
   - Get strategic insights
   - Learn from their structure

5. **Automated Reports:**
   - Generate PDF reports
   - Before/after comparisons
   - Track improvements
   - Client-ready format

6. **Integration Export:**
   - WordPress plugin format
   - JavaScript snippet
   - CMS-specific code
   - API endpoint

=== SEO ARTICLE SECTION ===

Below tool, 3000-word article:

Title: "Internal Linking for SEO: The Complete 2026 Guide"

[Comprehensive guide covering all aspects of internal linking strategy]

=== SUCCESS METRICS ===

Expected Performance:
- Month 1: 3k-5k users (SEO professionals)
- Month 3: 10k-20k users
- Month 6: 25k-50k users

Build this as THE internal linking tool for serious SEO professionals.
```
