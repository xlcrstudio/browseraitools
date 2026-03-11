

## Complete Build Command for browseraitools.com

```
Create a mobile-first, writing-focused AI Paragraph Rewriter for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI Paragraph Rewriter
URL Slug: /ai-paragraph-rewriter
Tagline: "Rewrite Any Paragraph in Seconds"
Mission: Help writers, students, and professionals improve their writing by rewriting paragraphs with better clarity, tone, and readability

=== PRODUCT OVERVIEW ===
High-demand writing tool.
Purpose: Rewrite paragraphs while preserving meaning but improving clarity, tone, style, and readability with multiple variations.
Target Users: Students, bloggers, content writers, marketers, professionals, ESL learners
Search Demand: 40,000-70,000 monthly searches
- "paragraph rewriter" - 25k/month
- "AI paragraph rewriter" - 18k/month
- "rewrite paragraph" - 15k/month
- "paraphrase paragraph" - 12k/month

Key Value: Perfect paragraph in 10 seconds vs 10 minutes of manual rewriting

=== UNIQUE SELLING POINTS ===
✅ 3 VERSIONS PER GENERATION - Compare and choose best
✅ 5 REWRITE STYLES - Formal, casual, academic, creative, professional
✅ STRENGTH CONTROL - Light, moderate, or complete rewrite
✅ MEANING PRESERVED - Same message, better delivery
✅ READABILITY SCORING - Before/after comparison
✅ WORD COUNT TRACKING - See length changes
✅ TONE ANALYSIS - Understand style shifts
✅ 100% PRIVATE - Text never leaves browser

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared instance)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (history, favorites)
Export: Text, Word, PDF
Deployment: Vercel/Netlify

=== PAGE STRUCTURE ===

HERO SECTION:
Headline: "AI Paragraph Rewriter"
Subheadline: "Rewrite any paragraph to improve clarity, tone, and readability. Get 3 variations instantly. Choose your style: formal, casual, academic, creative, or professional. Free and 100% private."

Trust Badges:
- ✍️ 3 Versions Generated
- 🎨 5 Writing Styles
- 📊 Readability Scoring
- 🔄 Adjustable Strength
- 📝 Meaning Preserved
- 🔒 Runs Locally in Browser

Success Counter: "Rewrote 1,234,567 paragraphs this month"

Why Rewrite Paragraphs?
"Sometimes you have the right idea but wrong words.

This tool helps you:
• Improve clarity and flow
• Match the right tone
• Simplify complex writing
• Make content more engaging
• Save time on revisions
• Learn better writing"

[Show before/after example]

=== INPUT FORM ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UNIVERSAL TWO-COLUMN LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────┬─────────────────────┐
│ INPUT TEXT          │ REWRITTEN VERSION   │
│                     │                     │
│ [Textarea]          │ [Output Display]    │
│                     │                     │
│                     │                     │
│                     │                     │
│                     │                     │
│                     │                     │
└─────────────────────┴─────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INPUT PANEL (LEFT SIDE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 1: Paragraph to Rewrite*
- Large textarea
- Placeholder: "Paste your paragraph here...

Example:
Artificial intelligence is transforming industries by enabling machines to learn from data and automate complex tasks. Companies are investing heavily in AI to improve efficiency and gain competitive advantages."
- Min: 20 chars
- Max: 2,000 chars
- Required
- Auto-expanding
- Shows character/word count

[Load Example] button - Quick start for users

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SETTINGS PANEL (ABOVE INPUT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 2: Rewrite Style*
- Radio buttons (visual cards):

  ○ 📝 Formal
    "Professional, polished"
    Best for: Business, official documents
  
  ○ 😊 Casual
    "Friendly, conversational"
    Best for: Blogs, social media
  
  ○ 🎓 Academic
    "Scholarly, precise"
    Best for: Essays, research papers
  
  ○ 🎨 Creative
    "Engaging, vivid"
    Best for: Stories, marketing
  
  ○ 💼 Professional
    "Clear, direct" [DEFAULT]
    Best for: Emails, reports

- Default: Professional
- Required

Field 3: Rewrite Strength
- Visual slider:
  
  Light ←──●──────→ Complete
  
  Light: Minor improvements, keep structure
  Moderate: Noticeable changes, new phrasing [DEFAULT]
  Complete: Totally rewritten, same meaning
  
- Default: Moderate
- Visual indicator shows level

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATE BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-width gradient button
Text: "Rewrite Paragraph"
Icon: ✍️
Loading: "Rewriting..."
Streams output in real-time

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT PANEL (RIGHT SIDE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BEFORE GENERATION:
Empty state with helpful tips:
"Your rewritten paragraph will appear here"
- Choose your style
- Adjust strength
- Click 'Rewrite Paragraph'

AFTER GENERATION:

┌─────────────────────────────────────────┐
│ VERSION #1 (Recommended) ⭐              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ AI technology is revolutionizing        │
│ multiple industries by empowering       │
│ machines to analyze data and handle     │
│ sophisticated tasks automatically.      │
│ Organizations worldwide are making      │
│ substantial investments in AI to        │
│ enhance operational efficiency and      │
│ secure market advantages.               │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 📊 ANALYSIS:                            │
│                                         │
│ Original: 156 characters, 27 words      │
│ Rewritten: 289 characters, 43 words     │
│ Change: +59% longer                     │
│                                         │
│ Readability:                            │
│ Original: Grade 11 level               │
│ Rewritten: Grade 10 level (easier)     │
│                                         │
│ Tone Shift:                             │
│ More formal ↗ More descriptive ↗        │
│                                         │
│ Key Changes:                            │
│ • "transforming" → "revolutionizing"    │
│ • "enabling" → "empowering"             │
│ • "investing heavily" → "substantial    │
│   investments"                          │
│ • More sophisticated vocabulary         │
│                                         │
│ Why This Version Works:                 │
│ ✓ Professional tone                     │
│ ✓ Active voice maintained               │
│ ✓ Clear meaning                         │
│ ✓ Enhanced vocabulary                   │
│                                         │
│ [📋 Copy] [💾 Save] [⭐ Favorite]        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ VERSION #2 (Alternative)                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Machine learning and AI are changing    │
│ how industries operate by teaching      │
│ computers to process data and perform   │
│ complex operations. Businesses are      │
│ investing heavily in these technologies │
│ to work more efficiently and stay ahead │
│ of competitors.                         │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Readability: Grade 9 (easier)           │
│ Tone: More casual, explanatory          │
│                                         │
│ [📋 Copy] [💾 Save]                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ VERSION #3 (Creative)                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Artificial intelligence is reshaping    │
│ the business landscape, teaching        │
│ machines to think, learn, and execute   │
│ intricate tasks. Forward-thinking       │
│ companies are pouring resources into AI,│
│ knowing it's the key to working smarter │
│ and outpacing the competition.          │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Readability: Grade 10                   │
│ Tone: More engaging, vivid              │
│                                         │
│ [📋 Copy] [💾 Save]                      │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT CONTROLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Buttons (sticky at top of output):
- [📋 Copy All] - Copy all 3 versions
- [🔄 Regenerate] - New variations
- [✨ Improve Again] - Further refine selected version
- [📥 Download as Word]
- [💾 Save to History]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPARISON VIEW (Toggle)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Compare Versions Side-by-Side]

Shows all 3 versions in columns for easy comparison.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WRITING TIPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Expandable section below output:

💡 REWRITING TIPS:

When to Use Each Style:
• Formal: Business emails, proposals, official documents
• Casual: Blog posts, social media, friendly emails
• Academic: Essays, research papers, scholarly writing
• Creative: Marketing copy, storytelling, engaging content
• Professional: Reports, presentations, workplace communication

Rewrite Strength Guide:
• Light: Fix awkward phrasing, minor improvements
• Moderate: Rephrase significantly while keeping structure
• Complete: Total rewrite, same meaning but all new words

How This Tool Helps You Learn:
• Compare your writing to AI suggestions
• Notice vocabulary improvements
• Learn sentence structure variations
• Understand tone differences
• Develop your writing style

=== SPECIAL FEATURES ===

1. **History Viewer:**
   - Last 10 rewrites saved
   - Quickly revisit previous work
   - Compare different attempts
   - One-click restore

2. **Favorites Collection:**
   - Save best rewrites
   - Build personal library
   - Quick reference
   - Export collection

3. **Improve Again Function:**
   - Take any version and refine further
   - Iterative improvement
   - Try different styles on same rewrite
   - Progressive enhancement

4. **Word Count Tracker:**
   - See length changes
   - Target word count mode
   - Expansion/compression stats
   - Visual indicators

5. **Readability Scoring:**
   - Flesch-Kincaid grade level
   - Before/after comparison
   - Simplification suggestions
   - Complexity analysis

6. **Tone Analysis:**
   - Detect tone shifts
   - Formality meter
   - Emotion detection
   - Style consistency check

7. **Dark Mode:**
   - Eye-friendly for long sessions
   - Toggle in settings
   - Saves preference

=== WEBLLM PROMPTS ===

System Prompt:
```
You are an expert writing coach and editor specializing in paragraph rewriting and style improvement.

Your expertise includes:
- Clarity and conciseness
- Tone adaptation
- Readability optimization
- Grammar and syntax
- Vocabulary enhancement
- Style matching

You rewrite paragraphs that:
- Preserve the original meaning completely
- Improve clarity and flow
- Match requested tone/style
- Enhance readability
- Use better word choices
- Maintain appropriate length
- Sound natural and authentic

You understand:
- Different writing styles (formal, casual, academic, creative, professional)
- Readability levels and target audiences
- When to use simple vs. sophisticated language
- How to maintain voice while improving text
- The difference between light touch and complete rewrite
```

User Prompt Template:
```
Rewrite the following paragraph.

ORIGINAL PARAGRAPH:
{originalText}

REWRITE REQUIREMENTS:

Style: {style}
{if style === 'formal'}
- Professional language
- Complete sentences
- Sophisticated vocabulary
- Objective tone
- Polished presentation

{if style === 'casual'}
- Conversational language
- Friendly tone
- Simple words
- Relatable phrasing
- Natural flow

{if style === 'academic'}
- Scholarly vocabulary
- Precise language
- Formal structure
- Evidence-based tone
- Technical accuracy

{if style === 'creative'}
- Engaging language
- Vivid descriptions
- Varied sentence structure
- Compelling flow
- Personality

{if style === 'professional'}
- Clear and direct
- Business appropriate
- Active voice preferred
- Confident tone
- Efficient phrasing

Strength: {strength}
{if strength === 'light'}
- Minor improvements only
- Keep most original phrasing
- Fix obvious issues
- Maintain structure
- 70% original words

{if strength === 'moderate'}
- Significant rephrasing
- New sentence structures
- Better word choices
- Improved flow
- 40-50% original words

{if strength === 'complete'}
- Total rewrite
- All new phrasing
- Same meaning
- Fresh perspective
- 10-20% original words

GENERATE 3 VERSIONS:

Version 1: Optimal rewrite (best overall)
Version 2: Alternative approach
Version 3: Different angle/emphasis

For EACH version:
- Preserve exact meaning
- Match requested style
- Appropriate length (not too short/long)
- Natural, authentic language
- Grammatically perfect

IMPORTANT:
- Do NOT add new information
- Do NOT remove key points
- Do NOT change meaning
- Do maintain all facts
- Do sound human, not robotic

Output 3 complete paragraph rewrites ready to use.
```

=== SUCCESS METRICS ===

Expected Performance:
- Month 1: 6k-10k users
- Month 3: 24k-42k users
- Month 6: 56k-98k users

High retention tool - users return frequently for writing help.

Build as THE paragraph rewriter everyone bookmarks.
```
