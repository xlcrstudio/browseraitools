
## Complete Build Command for browseraitools.com

```
Create a mobile-first, SEO-optimized AI Blog Outline Generator for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI Blog Outline Generator
URL Slug: /ai-blog-outline-generator
Tagline: "Create SEO-Optimized Blog Outlines in Seconds"
Mission: Help content creators and marketers plan high-ranking blog content instantly

=== PRODUCT OVERVIEW ===
High-traffic tool (90,000 monthly searches).
Purpose: Generate comprehensive, SEO-optimized blog post outlines with title options, structure, and content guidance.
Target Users: Content marketers, bloggers, SEO professionals, agencies, freelance writers
Search Demand: ~90,000 monthly searches
Key Value: Complete blog structure in 30 seconds vs hours of planning

=== UNIQUE SELLING POINTS ===
✅ SEO-optimized (title, meta, keyword placement)
✅ Multiple title options with explanations
✅ Word count allocation per section
✅ H2/H3 subheading suggestions
✅ Content notes and examples for each section
✅ FAQ section generation
✅ Multimedia placement suggestions
✅ Internal/external linking opportunities
✅ Featured snippet optimization

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared instance)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (save outlines, favorites)
Export: Markdown, Google Docs format, PDF
Deployment: Vercel/Netlify

=== INPUT FORM ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRIMARY INPUTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 1: Blog Topic/Title Idea*
- Input: text
- Placeholder: "e.g., How to Start a Blog in 2026, Best Email Marketing Tools, SEO for Beginners"
- Max: 200 chars
- Required
- Help text: "What do you want to write about?"

Field 2: Target Audience*
- Input: text
- Placeholder: "e.g., beginner bloggers, small business owners, marketing professionals"
- Max: 100 chars
- Required
- Help text: "Who will read this blog post?"

Field 3: Content Type*
- Radio buttons:
  ○ How-To Guide / Tutorial
  ○ Listicle (Top 10, Best X, etc.)
  ○ Ultimate Guide / Comprehensive Resource
  ○ Comparison / vs Article
  ○ Review / Product Roundup
  ○ Opinion / Thought Leadership
  ○ Case Study / Success Story
  ○ News / Trend Analysis
- Default: How-To Guide
- Required

Field 4: Target Word Count*
- Slider or input
- Range: 500-5000 words
- Default: 1500 words
- Shows: "Short (500-1000)", "Medium (1000-2000)", "Long (2000-3000)", "Comprehensive (3000+)"
- Required

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEO & KEYWORDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 5: Primary Keyword (Optional)
- Input: text
- Placeholder: "e.g., blog outline, content marketing, SEO tips"
- Max: 50 chars
- Help text: "Main keyword you want to rank for"

Field 6: Secondary Keywords (Optional)
- Input: text (comma-separated)
- Placeholder: "e.g., content strategy, blog writing, SEO optimization"
- Max: 200 chars
- Help text: "Related keywords to include"

Field 7: Search Intent
- Dropdown:
  • Informational (Learn, understand, how-to)
  • Commercial (Best, top, reviews, comparisons)
  • Transactional (Buy, discount, near me) [less common for blogs]
- Default: Informational

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STYLE & TONE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 8: Tone
- Pills/tags:
  • Professional
  • Conversational
  • Educational
  • Entertaining
  • Authoritative
- Default: Professional
- Can select multiple

Field 9: Content Depth
- Radio:
  ○ Beginner-friendly (simple explanations)
  ○ Intermediate (balanced depth)
  ○ Advanced/Technical (expert-level)
- Default: Intermediate

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADVANCED OPTIONS (Collapsible)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Include FAQ section: Toggle (default: ON)
- Include introduction hook: Toggle (default: ON)
- Include meta description: Toggle (default: ON)
- Optimize for featured snippets: Toggle (default: ON)
- Suggest multimedia (images, videos): Toggle (default: ON)
- Number of title options: 3-5 (default: 3)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATE BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-width gradient button
Text: "Generate Blog Outline"
Icon: 📝
Loading: "Analyzing topic... Creating structure... Optimizing for SEO..."

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTLINE DISPLAY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Header:
"Your Blog Outline: [Topic]"
Word count: "1,847 words estimated"

Action Buttons:
- Copy All (copies entire outline)
- Export to Google Docs
- Export as Markdown
- Save Outline (localStorage)
- Regenerate

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TITLE OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Option 1: [SEO-optimized title]
✓ 58 characters | ✓ Includes primary keyword | ✓ Click-worthy
Why it works: [Explanation]
[Copy button]

Option 2: [Alternative title]
[Same format]

Option 3: [Alternative title]
[Same format]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
META DESCRIPTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Option 1: [Meta description 155 chars]
[Copy button]

Option 2: [Alternative meta]
[Copy button]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTRODUCTION (150-200 words)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HOOK: [Attention-grabbing opening]

STRUCTURE:
• Problem: [Pain point to address]
• Promise: [What reader will gain]  
• Preview: [Key topics covered]

[Expand for full guidance]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MAIN CONTENT SECTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each section displayed as expandable card:

┌─────────────────────────────────────────┐
│ H2: Understanding Blog Outlines         │
│ Word Count: 300 words                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ KEY POINTS TO COVER:                    │
│ • What is a blog outline                │
│ • Why outlines improve content quality │
│ • Benefits for SEO and readability     │
│                                         │
│ SUBSECTIONS (H3):                       │
│ → Definition and Purpose                │
│ → Benefits of Outlining                 │
│ → Common Outline Mistakes              │
│                                         │
│ CONTENT NOTES:                          │
│ • Include statistics on improved       │
│   writing speed with outlines          │
│ • Add example of good vs bad outline  │
│                                         │
│ SEO NOTES:                              │
│ • Include keyword: "blog outline"      │
│ • Internal link to: [Related article]  │
│                                         │
│ MULTIMEDIA:                             │
│ • Image: Example blog outline diagram │
│                                         │
│ [Copy Section] [Expand Details]        │
└─────────────────────────────────────────┘

[Repeat for all main sections]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONCLUSION (100-150 words)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KEY TAKEAWAYS:
• [Takeaway 1]
• [Takeaway 2]
• [Takeaway 3]

CALL-TO-ACTION:
[Suggested CTA for reader]

FINAL THOUGHT:
[Closing statement]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FAQ SECTION (5-7 Questions)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Q1: [Common question about topic]
A: [Brief answer guidance - 2-3 sentences]

Q2: [Question]
A: [Answer guidance]

[Continue for 5-7 FAQs]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT ENHANCEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MULTIMEDIA SUGGESTIONS:
📸 Image 1: [Description and placement]
📊 Infographic: [Data to visualize]
🎥 Video: [Topic suggestion]

DATA/STATISTICS:
📈 [Stat 1]: [Where to use and source]
📈 [Stat 2]: [Where to use and source]

INTERNAL LINKS:
🔗 Link to: [Related article topic]
🔗 Link to: [Tool or resource]

EXTERNAL AUTHORITY LINKS:
🌐 Link to: [Authoritative source]
🌐 Link to: [Research study]

=== WEBLLM PROMPTS ===

System Prompt:
```
You are an expert content strategist and SEO specialist with 10+ years of experience creating high-ranking blog content.

Your expertise includes:
- SEO-optimized content structure
- Audience engagement techniques
- Information architecture and content flow
- Search intent matching
- Skimmable, scannable content design
- Hook writing and attention retention
- Content depth and comprehensiveness
- Internal linking strategies
- Featured snippet optimization

You create blog outlines that:
- Match search intent perfectly
- Are comprehensive yet focused
- Include engaging hooks and CTAs
- Optimize for on-page SEO
- Structure content for readability
- Include multimedia suggestions
- Guide the writer clearly
- Rank on page 1 of Google

You understand:
- How people consume blog content (skimming, scanning)
- What makes readers click, read, and share
- How to structure for both humans and search engines
- The balance between SEO and user experience
- Content depth appropriate to topic complexity
```

User Prompt Template:
```
Create a comprehensive, SEO-optimized blog outline.

═══════════════════════════════════════
BLOG DETAILS
═══════════════════════════════════════
Topic: {topic}
Target Audience: {targetAudience}
Content Type: {contentType}
Target Word Count: {targetWordCount} words
Tone: {tone}
Search Intent: {searchIntent}
Primary Keyword: {primaryKeyword}
Secondary Keywords: {secondaryKeywords}

═══════════════════════════════════════
OUTLINE REQUIREMENTS
═══════════════════════════════════════

STRUCTURE:

1. TITLE OPTIONS (3 variations)
   - SEO-optimized (include primary keyword)
   - Compelling and click-worthy
   - Clear benefit or promise
   - 50-60 characters ideal
   - Use power words where appropriate
   
   Format for each:
   • Title text
   • Why it works (1 sentence)

2. META DESCRIPTION (2 options)
   - 150-160 characters
   - Include primary keyword
   - Clear value proposition
   - Call to action
   - Compelling reason to click

3. INTRODUCTION (Structure)
   - Hook (1-2 sentences that grab attention)
   - Problem statement (what pain point)
   - Promise/Solution (what they'll learn)
   - Preview of key points
   - Target length: 150-200 words
   
   Provide:
   • Hook suggestion
   • Key points to cover
   • Transition to main content

4. MAIN CONTENT SECTIONS

   For each H2 section provide:
   
   H2: [Section Title]
   - Word count allocation: [XXX words]
   - Key points to cover: [3-5 bullet points]
   - Subsections (H3): [List 2-4 H3s if needed]
   - Content notes: [Specific guidance]
   - SEO notes: [Keywords to include naturally]
   - Engagement elements: [Examples, data, quotes to include]
   
   Create {Math.ceil(targetWordCount / 300)} main sections (H2)
   Each H2 should have 2-4 H3 subsections where appropriate

5. SUPPORTING ELEMENTS

   Throughout the outline, suggest:
   - Where to add images/graphics
   - Where to include data/statistics
   - Where to add examples or case studies
   - Where to use lists, tables, or comparison charts
   - Internal linking opportunities
   - External citation opportunities

6. CONCLUSION
   - Summary of key takeaways (3-5 points)
   - Call-to-action (what should reader do next)
   - Final thought or question
   - Target length: 100-150 words

7. OPTIONAL SECTIONS (Include if relevant)
   - FAQ section (5-7 common questions)
   - Quick takeaways box (TL;DR summary)
   - Resources/Tools section
   - Next steps/Action items

═══════════════════════════════════════
CONTENT GUIDELINES
═══════════════════════════════════════

SEO OPTIMIZATION:
✓ Include primary keyword in H1, first H2, first 100 words
✓ Include related keywords naturally in H2/H3 headings
✓ Use semantic variations of main keyword
✓ Structure for featured snippets (definitions, lists, tables)
✓ Suggest internal links to related content
✓ Include opportunities for external authoritative links

READABILITY:
✓ Break up long sections with H3 subheadings
✓ Keep paragraphs short (2-4 sentences)
✓ Use bullet points and numbered lists
✓ Include pull quotes or callout boxes
✓ Vary sentence length for rhythm
✓ Use transition words between sections

ENGAGEMENT:
✓ Start each section with a mini-hook
✓ Include specific examples or scenarios
✓ Add data/statistics for credibility
✓ Use "you" language (second person)
✓ Include actionable takeaways
✓ End sections with transitions to next topic

CONTENT DEPTH:
✓ Be comprehensive (cover topic thoroughly)
✓ Include beginner and advanced information
✓ Address common misconceptions
✓ Provide context and background
✓ Include expert insights or quotes
✓ Offer unique perspective or data

OUTPUT FORMAT:

BLOG OUTLINE: [Topic]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TITLE OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Option 1: [Title]
Why: [Explanation]

Option 2: [Title]
Why: [Explanation]

Option 3: [Title]
Why: [Explanation]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
META DESCRIPTION OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Option 1: [Meta description]

Option 2: [Meta description]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTRODUCTION (150-200 words)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HOOK: [Attention-grabbing opening]

STRUCTURE:
• Problem: [Pain point to address]
• Promise: [What reader will gain]
• Preview: [Key topics covered]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MAIN CONTENT OUTLINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

H2: [Section 1 Title]
Word Count: [XXX words]

Key Points:
• [Point 1]
• [Point 2]
• [Point 3]

H3: [Subsection 1.1]
- [Content guidance]

H3: [Subsection 1.2]
- [Content guidance]

Content Notes:
- [Specific examples to include]
- [Data/statistics to reference]
- [Expert quotes to consider]

SEO Notes:
- Include keywords: [list]
- Internal link to: [suggestion]

Visual Elements:
- [Image/graphic suggestion]
- [Chart/table suggestion]

---

[Repeat for all main sections]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONCLUSION (100-150 words)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KEY TAKEAWAYS:
• [Takeaway 1]
• [Takeaway 2]
• [Takeaway 3]

CALL-TO-ACTION:
[Specific action for reader]

FINAL THOUGHT:
[Closing statement or question]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FAQ SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Q1: [Question]
A: [Brief answer direction]

Q2: [Question]
A: [Brief answer direction]

[Continue for 5-7 FAQs]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT ENHANCEMENT SUGGESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MULTIMEDIA:
• [Image 1]: [Description and placement]
• [Infographic]: [Topic and data to visualize]
• [Video]: [Topic for embedded video]

DATA/STATISTICS:
• [Stat 1]: [Where to use and why]
• [Stat 2]: [Where to use and why]

EXAMPLES/CASE STUDIES:
• [Example 1]: [Brief description]
• [Example 2]: [Brief description]

INTERNAL LINKS:
• Link to: [Related article topic]
• Link to: [Related tool/resource]

EXTERNAL AUTHORITY LINKS:
• Link to: [Authoritative source type]
• Link to: [Research/study type]

Create this comprehensive outline that a writer can follow to create exceptional, ranking content.
```

=== SEO ARTICLE SECTION ===

Below the tool, comprehensive 2000-word article:

Title: "How to Create a Blog Outline: Complete Guide for SEO-Optimized Content"

[Full article covering blog outline best practices, SEO, content structure, etc.]

=== SPECIAL FEATURES ===

1. **Save Outlines Library:**
   - Save unlimited outlines to localStorage
   - Organize by topic/category
   - Quick load previous outlines
   - Edit saved outlines

2. **Export Options:**
   - Markdown (for developers/bloggers)
   - Google Docs format
   - Plain text
   - PDF (formatted outline)

3. **Content Calendar Integration:**
   - Add to content calendar
   - Set publish date
   - Track status (outlined, drafted, published)

4. **Collaboration Features:**
   - Generate shareable link
   - Export for team review
   - Comment/feedback mode

Build this as the essential content planning tool for bloggers and marketers.
```
