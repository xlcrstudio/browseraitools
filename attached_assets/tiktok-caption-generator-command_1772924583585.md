
## Complete Build Command for browseraitools.com

```
Create a mobile-first, SEO-optimized AI TikTok Caption Generator for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI TikTok Caption Generator
URL Slug: /ai-tiktok-caption-generator
Tagline: "Go Viral with Perfect TikTok Captions"
Mission: Help TikTok creators write engaging captions that maximize views and engagement

=== PRODUCT OVERVIEW ===
High-traffic tool (80,000 monthly searches).
Purpose: Generate viral-optimized TikTok captions with hooks, CTAs, and strategic hashtags.
Target Users: TikTok creators, brands, social media managers, influencers, content creators
Search Demand: ~80,000 monthly searches
Key Value: 5 viral caption options in 30 seconds vs hours of brainstorming

=== UNIQUE SELLING POINTS ===
✅ Viral hook formulas (first 3 words critical)
✅ Platform-optimized for TikTok algorithm
✅ Strategic hashtags (5-8 optimal count)
✅ Engagement triggers built-in
✅ Tone variations (casual, funny, inspiring, educational)
✅ First comment suggestions
✅ Trending format integration
✅ Character count optimization
✅ Multiple caption variations

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared instance)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (saved captions, templates)
Export: Text, Copy all variations
Deployment: Vercel/Netlify

=== PAGE STRUCTURE ===

HERO SECTION:
Headline: "AI TikTok Caption Generator"
Subheadline: "Create viral TikTok captions that get you on the FYP. AI-powered hooks, hashtags, and CTAs that drive engagement. Free, private, instant."
Trust Badges:
- 🔥 Viral Hook Formulas
- 🎯 FYP Optimized
- #️⃣ Strategic Hashtags
- 💬 Engagement Triggers
- 📱 Platform-Native Style
- 🔒 100% Private

Success Counter: "Generated 89,234 viral captions this month"

=== INPUT FORM ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VIDEO CONTENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 1: What's Your Video About?*
- Textarea
- Placeholder: "Describe your TikTok video content. Be specific!
Examples:
  • Morning coffee routine at my favorite downtown cafe
  • 10-minute full body workout you can do at home
  • How I grew my small business to $100k in 6 months
  • Trying the viral TikTok pasta recipe
  • Day in the life as a software engineer"
- Max: 300 chars
- Required
- Help text: "The more details, the better the caption"

Field 2: Video Hook/Opening (Optional)
- Input: text
- Placeholder: "e.g., Wait for the latte art reveal, This changed my fitness game, Nobody talks about this..."
- Max: 100 chars
- Optional
- Help text: "What's the first thing viewers see/hear?"

Field 3: Trending Sound Used? (Optional)
- Input: text
- Placeholder: "e.g., Original audio, [Song name], Trending sound about [topic]"
- Max: 100 chars
- Optional
- Help text: "Helps tailor caption to audio style"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NICHE & AUDIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 4: Content Niche*
- Dropdown with search:
  • Fitness & Health
  • Food & Cooking
  • Beauty & Skincare
  • Fashion & Style
  • Travel & Adventure
  • Comedy & Entertainment
  • Education & Learning
  • Business & Entrepreneurship
  • Lifestyle & Vlogs
  • Dance & Music
  • Pets & Animals
  • Technology & Gadgets
  • Art & Creativity
  • Sports & Athletics
  • Parenting & Family
  • Home & DIY
  • Gaming
  • Finance & Money Tips
  • Motivation & Self-Improvement
  • [40+ categories]
- Required

Field 5: Target Audience*
- Radio buttons:
  ○ Gen Z (13-24 years)
  ○ Millennials (25-40 years)
  ○ Broad/All Ages
- Default: Gen Z
- Required

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACCOUNT & GOALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 6: Account Type*
- Radio:
  ○ Creator (Personal brand/influencer)
  ○ Brand (Business/company account)
  ○ Educational (Teaching/tutorial content)
  ○ Entertainment (Comedy/fun content)
- Default: Creator
- Required

Field 7: Content Type*
- Radio:
  ○ Educational/Tutorial
  ○ Entertainment/Comedy
  ○ Lifestyle/Vlog
  ○ Product/Review
  ○ Motivational/Inspirational
  ○ Trend/Challenge
- Default: Educational
- Required

Field 8: Primary Goal*
- Checkboxes (can select multiple):
  ☑ Get on FYP (For You Page)
  ☑ Drive Engagement (comments/shares)
  ☐ Grow Followers
  ☐ Generate Sales/Clicks
  ☐ Build Community
- Default: FYP and Engagement selected
- Required

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAPTION STYLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 9: Tone/Vibe*
- Pills/tags (select 1-2):
  • Casual
  • Funny
  • Inspiring
  • Educational
  • Relatable
  • Hype/Energetic
  • Mysterious
  • Storytelling
- Default: Casual
- Can select up to 2

Field 10: Caption Length
- Radio:
  ○ Short (50-100 chars) - Quick hook
  ○ Medium (100-200 chars) - Standard [DEFAULT]
  ○ Long (200-300 chars) - Story/context
- Default: Medium

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADVANCED OPTIONS (Collapsible)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Include hashtags: Toggle (default: ON)
- Number of hashtags: Slider 3-8 (default: 5)
- Include emojis: Toggle (default: ON)
- Number of caption variations: 3-7 (default: 5)
- Use trending formats: Toggle (default: ON)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATE BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-width gradient button
Text: "Generate TikTok Captions"
Icon: 🎬
Loading state: "Creating viral captions..."
Progress: "Crafting hooks... Adding CTAs... Optimizing hashtags..."

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULTS OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Your TikTok Caption Options (5 Generated)"

Quick Actions:
- Copy All Captions (for testing)
- Regenerate All
- Save Favorites
- Export as Text File

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAPTION CARDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each caption displayed as card:

┌─────────────────────────────────────────┐
│ OPTION 1: Relatable Hook + CTA          │
│ Casual Tone | Engagement Focus          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ POV: You finally found a morning        │
│ routine that actually works 👀          │
│                                         │
│ No 5am wake-ups, no cold showers, just │
│ coffee and vibes ☕✨                   │
│                                         │
│ Comment "morning" if you need this rn   │
│                                         │
│ #morningroutine #coffeetok #realistic  │
│ #productivity #fyp                      │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 📊 Stats:                               │
│ • Characters: 182                       │
│ • Hashtags: 5                          │
│ • Emojis: 4                            │
│ • Engagement Potential: ⭐⭐⭐⭐⭐     │
│                                         │
│ ✨ Why It Works:                        │
│ • "POV:" format (trending)              │
│ • Relatable pain point (5am wake-ups)  │
│ • Clear CTA (comment trigger)           │
│ • Strategic hashtags (niche + broad)    │
│ • Emojis add personality               │
│                                         │
│ [Copy Caption] [💖 Save] [Regenerate]  │
└─────────────────────────────────────────┘

[Repeat for 5 caption options]

Each card shows:
- Complete caption (formatted, ready to paste)
- Character count
- Hashtag count
- Emoji count
- Engagement potential rating
- "Why it works" analysis
- Copy, save, regenerate buttons

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAPTION VARIATIONS BY ANGLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Captions organized by strategy:

🔥 OPTION 1: Curiosity Hook
[Caption designed to make viewers watch]

😂 OPTION 2: Relatable/Funny
[Caption with humor and relatability]

💡 OPTION 3: Educational Value
[Caption emphasizing learning/tips]

❓ OPTION 4: Question/Engagement
[Caption ending with question]

🎯 OPTION 5: Direct/Bold Statement
[Caption with strong hook]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIRST COMMENT SUGGESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pin one of these as your first comment:

Option A: Additional Context
"Full routine breakdown on my IG! Link in bio 👆"

Option B: Engagement Question
"What time do YOU wake up? Drop it below 👇"

Option C: Series Tease
"Part 2 coming tomorrow with my actual routine 👀 Follow so you don't miss it"

Option D: Product/Link (if applicable)
"Coffee mug is from [Brand] - link in bio! ☕"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HASHTAG BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hashtag Strategy Explained:

Used in captions:
#morningroutine (2.3M posts) - Niche-specific
#coffeetok (890k posts) - Community tag
#realistic (450k posts) - Medium competition
#productivity (3.1M posts) - Broad reach
#fyp (Trending discovery tag)

Why This Mix Works:
• 1 broad hashtag for discovery (productivity, fyp)
• 2 niche hashtags for target audience (morningroutine, coffeetok)
• 2 medium hashtags for sweet spot (realistic)

Alternative Hashtag Sets:

Set A (More Niche):
#morningvibes #coffeetime #productivityhacks #aestheticroutine #fyp

Set B (Broader Reach):
#lifehacks #dailyroutine #motivation #selfcare #fyp

Set C (Trending Focus):
#thatgirl #fyp #viral #trending #relatable

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POSTING STRATEGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🕐 Best Times to Post:
- Weekdays: 6-9am, 12-1pm, 7-9pm EST
- Weekends: 9-11am, 7-9pm EST
- Your niche: Morning content performs best 6-10am

📱 Engagement Tactics:
1. Post your video
2. Immediately pin one of the first comments above
3. Respond to first 10 comments within 30 minutes
4. Ask follow-up questions to commenters
5. Like replies to your comments
6. Share to Stories if you have followers

🔄 Testing Strategy:
- Try different caption from this set if first doesn't perform
- Test different hashtag sets
- Track which hooks get most comments
- Save high-performing formats

💡 Pro Tips:
• TikTok favors early engagement (first 1-2 hours critical)
• Respond quickly = algorithm boost
• Questions in captions = more comments
• Controversial (but kind) = more engagement
• Personal stories = connection

=== WEBLLM PROMPTS ===

System Prompt:
```
You are a viral TikTok content strategist who understands what makes videos go viral and how to write captions that maximize engagement.

Your expertise includes:
- TikTok algorithm and FYP (For You Page) optimization
- Viral caption formulas and hooks
- Hashtag strategy for TikTok growth
- Call-to-action techniques for engagement
- Trending audio and challenge integration
- Community building through captions
- Brand voice for TikTok (authentic, casual, relatable)
- Emoji usage for visual appeal
- Gen Z communication style

You write TikTok captions that:
- Hook viewers in first 3 words
- Are optimized for the FYP algorithm
- Include strategic hashtags (5-8 max)
- Have clear calls-to-action
- Use emojis effectively (not excessively)
- Match trending formats when relevant
- Encourage comments and engagement
- Are authentic and relatable
- Work for different content types

You understand:
- Gen Z communication style
- TikTok's casual, authentic tone
- The power of curiosity gaps and cliffhangers
- How questions drive comments
- When to use trending sounds vs original audio
- Story arc in captions (setup, payoff)
- The balance between trendy and timeless
```

User Prompt Template:
```
Generate viral TikTok captions optimized for engagement and FYP.

═══════════════════════════════════════
VIDEO DETAILS
═══════════════════════════════════════
Video Content: {videoContent}
Niche: {niche}
Target Audience: {targetAudience}
Hook/Opening: {hook}
Trending Sound: {trendingSound}
Account Type: {accountType}
Content Type: {contentType}
Primary Goal: {goal}
Tone: {tone}
Caption Length: {captionLength}
Include Hashtags: {includeHashtags}
Number of Captions: {numCaptions}

═══════════════════════════════════════
CAPTION REQUIREMENTS
═══════════════════════════════════════

CAPTION STRUCTURE:

1. HOOK (First Line - Critical):
   - Grab attention immediately
   - Create curiosity or surprise
   - Question, bold statement, or relatable pain point
   - Make people WANT to watch
   - 3-7 words ideal
   
   Hook Formulas:
   • "POV: [Relatable scenario]"
   • "Nobody talks about [pain point]"
   • "This changed everything for me..."
   • "Wait for it... 👀"
   • "[Surprising statement]"
   • "Red flag if [relatable thing] 🚩"
   • "I tried [thing] so you don't have to"
   • "Day [X] of [challenge/journey]"

2. CONTEXT (Optional Middle):
   - Set up the story or situation
   - Build anticipation
   - Keep it brief (1-2 sentences max)
   - Use emojis to break up text

3. PAYOFF/VALUE:
   - Deliver on the hook's promise
   - Share the insight/tip/punchline
   - Make it worth their time

4. CALL-TO-ACTION:
   - Drive specific engagement
   - Ask a question
   - Request comment/duet/stitch
   - "Like if [relatable]"
   - "Follow for more [topic]"
   - "Comment [something] if [relatable]"

5. HASHTAGS (5-8 max):
   - Mix of volume (high, medium, low)
   - Include trending tags if relevant
   - Niche-specific tags
   - Placed at END of caption

CAPTION LENGTH:
- Ideal: 100-150 characters
- Can go longer if storytelling
- Front-load key information (first line shows in feed)
- Line breaks for readability

TIKTOK WRITING STYLE:

✓ Casual & Conversational:
  - Write like you talk
  - Use "you" and "I"
  - Contractions (don't, won't, here's)
  - Lowercase can work for some niches

✓ Relatable & Authentic:
  - Share vulnerabilities
  - Use humor and self-deprecation
  - Reference common experiences
  - Be real, not polished

✓ Emoji Usage:
  - 2-5 emojis per caption
  - Visual breaks and emphasis
  - Match the mood/content
  - Not every word (overwhelming)

✓ Formatting:
  - Use line breaks
  - ALL CAPS for emphasis (sparingly)
  - Keep it scannable

✓ Engagement Triggers:
  - Ask questions
  - Create debate
  - Request opinions
  - "Tag someone who [relatable]"
  - "Which one are you? 👇"

TRENDING FORMATS (Use when relevant):

• "POV: [scenario]"
• "Nobody talks about how..."
• "This is your sign to..."
• "Things I wish I knew about [topic]"
• "Green flags: [list] 🟢"
• "Red flags: [list] 🚩"
• "Tell me you're a [type] without telling me"
• "[Number] things about [topic] that actually work"
• "Storytime: [topic]"
• "Day [X] of [challenge/journey]"

CALLS-TO-ACTION (Pick based on goal):

For Engagement:
• "Comment [emoji] if you relate"
• "Which one are you? Drop a [emoji]"
• "Let me know if you want part 2"
• "What would you do in this situation?"
• "Am I the only one? 👀"

For Follows:
• "Follow for more [topic] tips"
• "Part 2 on my page 👉"
• "More [content type] coming"

For Shares:
• "Send this to someone who needs to see it"
• "Tag your [friend type]"
• "Share this with [target person]"

For Sales (if applicable):
• "Link in bio for [product]"
• "Get it before it's gone 🔗"
• "Use code [CODE] for [discount]"

AVOID:
✗ Asking for likes/follows desperately
✗ Too many hashtags (looks spammy)
✗ Generic captions that could apply to any video
✗ Clickbait that doesn't deliver
✗ Walls of text (hard to read)
✗ Corporate/sales language
✗ Obvious ads (unless clearly disclosed)

═══════════════════════════════════════
HASHTAG STRATEGY
═══════════════════════════════════════

Include {numHashtags} hashtags:

1-2 Trending/Viral: (if relevant)
   #fyp #foryou #viral #trending

2-3 Niche-Specific:
   Related to content category
   Example: #booktok #cleaningtiktok #fitnessmotivation

2-3 Content Descriptors:
   What the video shows
   Example: #morningroutine #beforeandafter #tutorial

═══════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════

TIKTOK CAPTIONS: {videoContent}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAPTION OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPTION 1 ({tone} - {goal} focused):
[Complete caption with emojis and line breaks]

{includeHashtags ? '#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5' : ''}

Why it works:
• Hook: [explanation]
• Engagement trigger: [explanation]
• CTA effectiveness: [explanation]

Character count: [X]
Engagement potential: ⭐⭐⭐⭐⭐

---

OPTION 2 (Alternative angle):
[Complete caption]

{includeHashtags ? '#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5' : ''}

Why it works:
• [Explanation]

Character count: [X]
Engagement potential: [Rating]

---

[Continue for {numCaptions} total options]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIRST COMMENT SUGGESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pin this comment to your video:

Option A: [Follow-up question or added context]
Option B: [Teaser for next video]
Option C: [Additional value or tip]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POSTING STRATEGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best Times: [Based on niche and audience]
• [Time 1]
• [Time 2]

Respond to Comments:
• Reply within first 30 minutes
• Ask follow-up questions
• Heart comments strategically

Engagement Boosters:
• Respond with video replies to top comments
• Create Part 2 if lots of requests
• Duet/Stitch trending content in niche

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALTERNATIVE HASHTAG SETS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{includeHashtags ? `
If performance is low, try:

Set A (Broader reach):
#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5

Set B (Niche targeting):
#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5

Set C (Trending focus):
#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5
` : ''}

Generate {numCaptions} viral-optimized TikTok captions with variation.
```

=== SEO ARTICLE SECTION ===

Below the tool, comprehensive 2000-word article:

Title: "How to Write TikTok Captions That Go Viral: Complete Guide 2026"

[Full article covering TikTok caption strategy, hooks, hashtags, algorithm optimization]

=== SPECIAL FEATURES ===

1. **Caption Templates Library:**
   - Pre-built templates by niche
   - Viral format collection
   - Trending hooks database
   - Quick customization

2. **Performance Tracker:**
   - Log which captions performed best
   - Track engagement by caption style
   - Learn from top performers
   - A/B test results

3. **Trending Formats:**
   - Updated weekly with new trends
   - Viral challenge templates
   - Sound-specific caption styles

4. **Integration:**
   - Pairs with Hashtag Generator
   - Save to content calendar
   - Batch generate for multiple videos

Build this as the essential TikTok caption tool that helps creators go viral.
```
