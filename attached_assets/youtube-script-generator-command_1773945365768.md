# Base44 Command: AI YouTube Script Generator

## Complete Build Command for browseraitools.com

```
Create a mobile-first, creator-focused AI YouTube Script Generator for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI YouTube Script Generator
URL Slug: /ai-youtube-script-generator
Tagline: "Create Engaging, High-Retention YouTube Scripts in Seconds"
Mission: Help YouTube creators generate viral, engaging scripts that keep viewers watching and boost channel growth

=== PRODUCT OVERVIEW ===
High-value content creation tool.
Purpose: Generate complete YouTube scripts with hooks, timestamps, CTAs, and viral elements optimized for retention and engagement.
Target Users: YouTubers, content creators, educators, marketers, video producers, influencers
Search Demand: 60,000-100,000 monthly searches
- "YouTube script generator" - 30k/month
- "AI YouTube script generator" - 18k/month
- "YouTube video script template" - 15k/month
- "how to write YouTube script" - 12k/month
- "viral YouTube script" - 10k/month
- "YouTube script maker" - 15k/month

Key Value: Professional script in 5 minutes vs 2 hours of writing

=== UNIQUE SELLING POINTS ===
✅ VIRAL HOOK GENERATION - First 10 seconds that grab attention
✅ TIMESTAMPED SECTIONS - Perfect for video chapters
✅ RETENTION OPTIMIZATION - Keeps viewers watching
✅ 4 SCRIPT STYLES - Storytelling, educational, list-based, viral
✅ VIRALITY SCORE - Rates engagement potential (0-10)
✅ BONUS OUTPUTS - Title ideas, thumbnail concepts
✅ CTA INTEGRATION - Subscribe reminders, engagement prompts
✅ PACING ANALYSIS - Ensures good flow

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared instance)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (saved scripts, favorites)
Export: Text, PDF, Word, TXT
Deployment: Vercel/Netlify

=== PAGE STRUCTURE ===

HERO SECTION:
Headline: "AI YouTube Script Generator"
Subheadline: "Create engaging, high-retention YouTube scripts in seconds. Get viral hooks, timestamped sections, CTAs, and retention analysis. Plus title ideas and thumbnail concepts. Free and unlimited."

Trust Badges:
- 🎬 Complete YouTube Scripts
- 🎯 Viral Hook Generation
- ⏱️ Timestamped Sections
- 📊 Virality Score (0-10)
- 🖼️ Title & Thumbnail Ideas
- 🔒 100% Private

Success Counter: "Generated 456,789 YouTube scripts this month"

Why Use Script Generator?
"Great YouTube videos start with great scripts.

This tool helps you:
• Write engaging scripts 10x faster
• Hook viewers in first 10 seconds
• Structure videos for retention
• Boost watch time and engagement
• Get more subscribers
• Grow your channel faster"

[Show before/after: 2 hours → 5 minutes]

=== INPUT FORM ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UNIVERSAL TWO-COLUMN LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────┬─────────────────────┐
│ VIDEO DETAILS       │ GENERATED SCRIPT    │
│                     │                     │
│ [Input Form]        │ [Output Display]    │
│                     │                     │
└─────────────────────┴─────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INPUT PANEL (LEFT SIDE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 1: Video Topic/Idea*
- Textarea
- Placeholder: "What is your video about?

Examples:
• 'How to make money online for beginners'
• '10 best productivity apps in 2026'
• 'My morning routine as a CEO'
• 'Why you should learn Python in 2026'
• 'I tested 5 AI tools so you don't have to'"
- Min: 10 chars
- Max: 500 chars
- Required

[📄 Load Example] button

Field 2: Target Audience*
- Input text or dropdown:
  • Beginners
  • Professionals
  • Students
  • Entrepreneurs
  • General audience
  • Tech enthusiasts
  • [Custom: input field]

- Default: General audience
- Required

Field 3: Video Length*
- Visual slider with presets:
  
  Short ←──●──────────→ Long
  
  Positions:
  • 3-5 minutes (Short)
  • 8-10 minutes (Medium) [DEFAULT]
  • 15-20 minutes (Long)
  • 30+ minutes (Extended)

- Shows estimated word count
- Default: 8-10 minutes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT SETTINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 4: Script Style*
- Visual cards (radio):

  ○ 📖 Storytelling
    "Narrative, engaging, personal"
    Best for: Vlogs, experiences, personal stories
  
  ○ 🎓 Educational
    "Informative, structured, clear"
    Best for: Tutorials, how-tos, explanations
  
  ○ 📋 List-Based
    "Numbered points, organized"
    Best for: Top 10s, listicles, roundups [DEFAULT]
  
  ○ 🔥 Viral/Hook-Heavy
    "Attention-grabbing, fast-paced"
    Best for: Trending topics, entertainment

- Default: List-Based
- Required

Field 5: Tone/Voice
- Radio:
  ○ Casual/Friendly (conversational)
  ○ Professional (polished, authoritative)
  ○ Energetic/Enthusiastic (upbeat, exciting) [DEFAULT]
  ○ Educational/Calm (teacher-like)
  ○ Humorous/Fun (entertaining)

Field 6: Advanced Options
- Checkboxes (expandable section):
  
  ☑ Include strong hook (first 10 seconds)
  ☑ Include CTA (subscribe, like, comment)
  ☑ Include examples/case studies
  ☐ Include storytelling elements
  ☐ Include timestamps (for chapters)
  ☐ Include B-roll suggestions
  ☐ Include on-screen text ideas

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATE BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-width gradient button
Text: "Generate YouTube Script"
Icon: 🎬
Loading: "Writing your script..."
Sub-messages:
- "Crafting viral hook..."
- "Structuring main content..."
- "Adding engagement elements..."

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT PANEL (RIGHT SIDE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🎬 YOUR YOUTUBE SCRIPT                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 📊 SCRIPT ANALYSIS                       │
│                                         │
│ Virality Score: 8.7/10 ⭐⭐⭐⭐         │
│ Retention Potential: High 🟢            │
│ Engagement Level: Excellent             │
│                                         │
│ Video Length: 8-10 minutes              │
│ Word Count: 1,200 words                 │
│ Speaking Time: 9:15 (at normal pace)    │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 🎯 HOOK (0:00 - 0:10)                    │
│                                         │
│ "You're wasting money if you're not     │
│ using these 5 productivity apps. I      │
│ tested 47 apps over 3 months, and these │
│ are the only ones that actually changed │
│ my life. Let's dive in."                │
│                                         │
│ Why This Hook Works:                    │
│ ✓ Creates curiosity ("which 5 apps?")   │
│ ✓ Shows authority ("tested 47 apps")    │
│ ✓ Promises value ("changed my life")    │
│ ✓ Direct and engaging                   │
│ ✓ Opens a loop (must watch to find out) │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 📺 INTRODUCTION (0:10 - 0:45)            │
│                                         │
│ "Hey everyone! If you're like me, you've│
│ downloaded hundreds of productivity apps│
│ looking for that perfect workflow. Most │
│ of them? Complete trash. But after      │
│ testing 47 different apps over the last │
│ 3 months, I found 5 that actually       │
│ deliver on their promises.              │
│                                         │
│ Today, I'm breaking down exactly why    │
│ these apps work, how to use them, and   │
│ which one is best for YOUR specific     │
│ needs. Stick around until the end       │
│ because app #5 is completely free and   │
│ honestly changed my entire morning      │
│ routine.                                │
│                                         │
│ Quick note—if you find this helpful,    │
│ smash that subscribe button. I test     │
│ productivity tools every week so you    │
│ don't have to waste your time or money. │
│ Alright, let's get into it."            │
│                                         │
│ [B-roll suggestion: Montage of app      │
│ icons, you working, productivity stats] │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 📝 MAIN CONTENT                          │
│                                         │
│ [1:00] APP #1: NOTION - THE ALL-IN-ONE  │
│                                         │
│ "First up is Notion, and yes I know     │
│ everyone talks about this one, but      │
│ here's what nobody tells you. Notion    │
│ isn't just a note-taking app—it's an    │
│ entire operating system for your life.  │
│                                         │
│ Here's how I use it: I have three main  │
│ databases. One for projects, one for    │
│ daily tasks, and one for long-term      │
│ goals. Everything connects together, so │
│ when I check off a task, it             │
│ automatically updates my project        │
│ dashboard.                              │
│                                         │
│ The game-changer? Templates. I created  │
│ a morning routine template that takes   │
│ 2 seconds to set up my entire day.      │
│                                         │
│ Best for: People who want one app to    │
│ replace everything.                     │
│ Cost: Free for personal use.            │
│ My rating: 9/10"                        │
│                                         │
│ [On-screen text: "Notion = Life OS"]    │
│ [B-roll: Screen recording of your       │
│ Notion setup]                           │
│                                         │
│ ───────────────────────────────────────│
│                                         │
│ [2:30] APP #2: TODOIST - SIMPLE & FAST  │
│                                         │
│ "If Notion feels overwhelming, Todoist  │
│ is the opposite. It's dead simple, but  │
│ incredibly powerful.                    │
│                                         │
│ What makes Todoist special is the       │
│ natural language processing. You can    │
│ just type 'Call mom tomorrow at 2pm'    │
│ and it automatically creates the task   │
│ with the right time. No clicking through│
│ menus, no date pickers—just type and    │
│ go.                                     │
│                                         │
│ I use this for rapid task capture. When │
│ I think of something, I just open       │
│ Todoist, type it, and forget about it.  │
│                                         │
│ Best for: People who want simple, fast  │
│ task management.                        │
│ Cost: Free (Pro is $4/month)            │
│ My rating: 8.5/10"                      │
│                                         │
│ [Continue for apps #3, #4, #5...]       │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 🎁 BONUS SECTION (7:30 - 8:15)           │
│                                         │
│ "Okay, quick bonus tip that nobody      │
│ talks about: Don't use all 5 apps at    │
│ once. That's productivity theater, not  │
│ actual productivity.                    │
│                                         │
│ Start with ONE. I recommend Todoist for │
│ most people because it's simple. Use it │
│ for 30 days until it's automatic. Then  │
│ add ONE more if you need it.            │
│                                         │
│ The mistake everyone makes? They        │
│ download all the apps, spend 3 hours    │
│ setting everything up, then never use   │
│ any of them. Don't be that person."     │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 📢 CALL TO ACTION (8:15 - 9:00)          │
│                                         │
│ "Alright, that's it! Those are my top 5 │
│ productivity apps after testing 47 of   │
│ them. If this video helped you, hit     │
│ that like button—it really helps the    │
│ algorithm show this to more people who  │
│ need it.                                │
│                                         │
│ And if you want more productivity       │
│ content, I literally test tools every   │
│ single week. Subscribe so you don't     │
│ miss the next one.                      │
│                                         │
│ Drop a comment and tell me: Which app   │
│ are YOU going to try first? I read      │
│ every comment and I'll reply with       │
│ specific tips for your situation.       │
│                                         │
│ Thanks for watching, and I'll see you   │
│ in the next one!"                       │
│                                         │
│ [End screen: Subscribe button,          │
│ suggested videos]                       │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ [📋 Copy Script] [📥 Download]          │
│ [⭐ Save] [🔄 Regenerate]                │
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCRIPT ANALYSIS & METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 📊 RETENTION ANALYSIS                    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Overall Virality Score: 8.7/10 ⭐       │
│                                         │
│ Component Scores:                       │
│                                         │
│ Hook Strength: 9.2/10 ⭐⭐⭐⭐⭐         │
│ ✓ Creates immediate curiosity           │
│ ✓ Opens multiple loops                  │
│ ✓ Promises specific value               │
│ ✓ Uses social proof (tested 47 apps)    │
│                                         │
│ Pacing: 8.5/10 ⭐⭐⭐⭐                  │
│ ✓ Good variation in content length      │
│ ✓ Strategic timestamps                  │
│ ✓ Bonus section adds value              │
│ ⚠️ Could add pattern interrupt at 5min  │
│                                         │
│ Engagement Potential: 9.0/10 ⭐         │
│ ✓ Multiple CTAs (subscribe, like,       │
│   comment)                              │
│ ✓ Personal stories included             │
│ ✓ Asks question to audience             │
│ ✓ Promises to reply to comments         │
│                                         │
│ Watch Time Optimization: 8.3/10 ⭐      │
│ ✓ Strong intro                          │
│ ✓ Promises value at end (app #5)        │
│ ✓ Bonus section retention hook          │
│ ⚠️ Could tease app #5 earlier           │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 🎯 WHAT MAKES THIS SCRIPT WORK           │
│                                         │
│ Strong Elements:                        │
│ • Immediate hook with specific promise  │
│ • Authority building (tested 47 apps)   │
│ • Numbered list format (easy to follow) │
│ • Personal experience and stories       │
│ • Practical, actionable advice          │
│ • Multiple engagement points            │
│ • Bonus section for retention           │
│                                         │
│ Potential Improvements:                 │
│ • Add pattern interrupt around 5:00     │
│ • Tease final app earlier (better loop) │
│ • Could include one failure story       │
│   (builds trust)                        │
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BONUS: TITLE IDEAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🎬 TITLE IDEAS (5 OPTIONS)               │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ TITLE #1 (RECOMMENDED): ⭐              │
│ "I Tested 47 Productivity Apps - Only   │
│ These 5 Are Worth It"                   │
│                                         │
│ Click Score: 9.1/10                     │
│ • Creates curiosity (which 5?)          │
│ • Shows authority (tested 47)           │
│ • Specific number (5 apps)              │
│ • Implies value/time saved              │
│ Character count: 58 (perfect for SEO)   │
│                                         │
│ ───────────────────────────────────────│
│                                         │
│ TITLE #2:                               │
│ "5 Productivity Apps That Actually      │
│ Changed My Life (NOT Clickbait)"        │
│                                         │
│ Click Score: 8.7/10                     │
│ • Personal transformation angle         │
│ • Addresses skepticism                  │
│                                         │
│ ───────────────────────────────────────│
│                                         │
│ TITLE #3:                               │
│ "Stop Using These Apps - Try These 5    │
│ Instead"                                │
│                                         │
│ Click Score: 8.3/10                     │
│ • Contrarian angle                      │
│ • Direct and punchy                     │
│                                         │
│ ───────────────────────────────────────│
│                                         │
│ TITLE #4:                               │
│ "The Only 5 Productivity Apps You       │
│ Actually Need in 2026"                  │
│                                         │
│ Click Score: 8.5/10                     │
│ • Simplification angle                  │
│ • Year reference (timely)               │
│                                         │
│ ───────────────────────────────────────│
│                                         │
│ TITLE #5:                               │
│ "I Wasted $500 on Productivity Apps -   │
│ Here's What Works"                      │
│                                         │
│ Click Score: 8.9/10                     │
│ • Relatable pain point                  │
│ • Shows investment/testing              │
│ • Promises solution                     │
│                                         │
│ [📋 Copy All Titles]                    │
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BONUS: THUMBNAIL CONCEPTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🖼️ THUMBNAIL IDEAS (3 CONCEPTS)          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ CONCEPT #1 (BEST):                      │
│ "Before/After Split Screen"             │
│                                         │
│ Left side:                              │
│ • You looking overwhelmed               │
│ • Cluttered desk with 47 app icons      │
│ • Red X or "DON'T" overlay              │
│                                         │
│ Right side:                             │
│ • You looking confident/happy           │
│ • Clean setup with 5 app icons          │
│ • Green checkmark or "DO THIS"          │
│                                         │
│ Text Overlay:                           │
│ "47 APPS → 5 APPS"                      │
│ Your face in both sides (emotional      │
│ contrast)                               │
│                                         │
│ Why It Works:                           │
│ • Clear transformation visual           │
│ • Curiosity (which 5?)                  │
│ • Emotional connection                  │
│ • Numbers stand out                     │
│                                         │
│ ───────────────────────────────────────│
│                                         │
│ CONCEPT #2:                             │
│ "App Icon Showcase"                     │
│                                         │
│ • Show 5 app icons clearly              │
│ • You pointing at them excitedly        │
│ • Big text: "ONLY THESE 5"              │
│ • Bright, colorful background           │
│                                         │
│ Why It Works:                           │
│ • Shows exactly what video delivers     │
│ • High curiosity (which apps?)          │
│                                         │
│ ───────────────────────────────────────│
│                                         │
│ CONCEPT #3:                             │
│ "Dramatic Reaction"                     │
│                                         │
│ • Your shocked/surprised face (close-up)│
│ • Text: "I TESTED 47 APPS"              │
│ • Subtext: "Only 5 worked..."           │
│ • Bright colors, high contrast          │
│                                         │
│ Why It Works:                           │
│ • Emotional hook                        │
│ • Creates curiosity                     │
│ • Personal touch (your face)            │
│                                         │
│ [💡 See Examples]                       │
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TIMESTAMPS FOR YOUTUBE CHAPTERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Copy these to your YouTube description:

```
0:00 Hook - Why Most Apps Fail
0:10 Introduction
1:00 App #1 - Notion (All-in-One)
2:30 App #2 - Todoist (Simple & Fast)
4:00 App #3 - [Next App]
5:30 App #4 - [Next App]
7:00 App #5 - [Final App]
7:30 Bonus Tip
8:15 Call to Action
```

[📋 Copy Timestamps]

=== WEBLLM PROMPTS ===

System Prompt:
```
You are an expert YouTube scriptwriter and viral content creator with deep knowledge of audience retention, engagement psychology, and viral video formats.

Your expertise includes:
- Hook writing and attention capture
- Video structure and pacing
- Audience retention strategies
- Call-to-action integration
- Storytelling techniques
- Educational content delivery
- Viral content patterns

You write scripts that:
- Hook viewers in first 10 seconds
- Maintain engagement throughout
- Structure content for retention
- Include strategic CTAs
- Use conversational, natural language
- Are optimized for the YouTube algorithm
- Drive likes, comments, and subscriptions

You understand:
- Different video formats (storytelling, educational, list-based, viral)
- Target audience psychology
- Pacing and pattern interrupts
- YouTube best practices
- Thumbnail and title optimization
- Engagement triggers
```

User Prompt Template:
```
Write a complete YouTube script.

VIDEO DETAILS:
Topic: {videoTopic}
Target Audience: {targetAudience}
Video Length: {videoLength} minutes
Script Style: {scriptStyle}
Tone: {tone}

REQUIREMENTS:

1. HOOK (First 10 seconds):
   - Grab attention immediately
   - Create curiosity or open loop
   - Promise specific value
   - Make viewer want to keep watching
   - Use pattern interrupt or bold statement

2. INTRODUCTION (30-45 seconds):
   - Expand on hook
   - Build credibility/authority
   - Preview what's coming
   - Include quick CTA (like/subscribe)
   - Tease valuable content at end

3. MAIN CONTENT:
   {if listBased}
   - Numbered points (clear structure)
   - Each point: 1-2 minutes
   - Include examples and details
   - Vary pacing (some short, some detailed)
   - Add personal stories/experiences
   
   {if storytelling}
   - Narrative arc (setup, conflict, resolution)
   - Personal anecdotes
   - Emotional connection
   - Relatable situations
   
   {if educational}
   - Clear explanations
   - Step-by-step instructions
   - Examples and demonstrations
   - Building blocks approach
   
   {if viral}
   - Fast-paced
   - Multiple hooks throughout
   - Pattern interrupts every 60-90 seconds
   - Emotional peaks

4. TIMESTAMPS:
   - Provide timestamp markers
   - Format: [MM:SS] Section Name
   - Perfect for YouTube chapters
   - Helps with navigation

5. ENGAGEMENT ELEMENTS:
   {if includeCTA}
   - Subscribe reminder (early in video)
   - Like button mention
   - Comment question (specific)
   - End screen CTAs
   
   {if includeExamples}
   - Real-world examples
   - Case studies
   - Personal experiences
   - Relatable scenarios
   
   {if includeStorytelling}
   - Personal anecdotes
   - Character/conflict/resolution
   - Emotional moments
   - Relatable situations

6. B-ROLL SUGGESTIONS:
   - Note where to add visuals
   - Screen recordings
   - Product shots
   - Montages
   - Text overlays

7. PACING:
   - Vary content density
   - Include pattern interrupts
   - Strategic pauses for effect
   - Energy shifts
   - Retention hooks every 2 minutes

8. CONCLUSION & CTA:
   - Recap key points
   - Final value delivery
   - Clear next steps
   - Multiple CTAs (like, subscribe, comment)
   - Specific comment question
   - End on memorable note

SCRIPT FORMAT:

[Timestamp] SECTION NAME

Script text here...

[Note: B-roll suggestion]
[On-screen text: Key point]

ADDITIONAL OUTPUTS:

Generate:
1. Complete script with timestamps
2. Virality score (0-10) with breakdown
3. Retention analysis
4. 5 title ideas with click scores
5. 3 thumbnail concepts
6. YouTube chapter timestamps

Tone: {tone}
- Natural, conversational
- Appropriate energy level
- Authentic voice
- Engaging delivery

Length: {videoLength} minutes = approximately {wordCount} words
(150 words per minute speaking pace)

Output complete, retention-optimized YouTube script ready to film.
```

=== SPECIAL FEATURES ===

1. **Virality Score Calculator:**
   - Rates 0-10
   - Breaks down by component
   - Specific improvement suggestions
   - Benchmark against viral videos

2. **Script Library:**
   - Save successful scripts
   - Organize by topic/style
   - Quick templates
   - Reuse structures

3. **A/B Title Testing:**
   - Multiple title variations
   - Click score predictions
   - SEO optimization
   - Character count check

4. **Thumbnail Concepts:**
   - Visual descriptions
   - Layout suggestions
   - Text overlay ideas
   - Color schemes

5. **Chapter Generator:**
   - Auto-generates timestamps
   - YouTube-ready format
   - Copy-paste ready
   - Optimized for search

6. **Voice-Over Timer:**
   - Calculates speaking time
   - Pacing recommendations
   - Section length balance
   - Total video length estimate

7. **Engagement Optimizer:**
   - CTA placement suggestions
   - Pattern interrupt markers
   - Retention hook locations
   - Loop closing reminders

=== SUCCESS METRICS ===

Expected Performance:
- Month 1: 10k-15k users
- Month 3: 35k-60k users
- Month 6: 80k-140k users

High retention - creators generate multiple scripts weekly.

Build as THE YouTube script generator all creators use.
```
