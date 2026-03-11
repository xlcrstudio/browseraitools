

## Complete Build Command for browseraitools.com

```
Create a mobile-first, networking-focused AI Cold Outreach Generator for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI Cold Outreach Generator
URL Slug: /ai-cold-outreach-generator
Tagline: "Network Smarter with Personalized Outreach"
Mission: Help professionals build meaningful connections through authentic, non-salesy outreach messages

=== PRODUCT OVERVIEW ===
Professional networking tool.
Purpose: Generate personalized cold outreach messages for networking, partnerships, and collaborations that feel genuine and get responses.
Target Users: Entrepreneurs, business developers, job seekers, freelancers, professionals
Search Demand: 20,000-35,000 monthly searches
- "cold outreach generator" - 12k/month
- "networking message generator" - 8k/month
- "LinkedIn outreach template" - 7k/month
- "partnership outreach" - 8k/month

Key Value: Professional outreach message in 30 seconds vs 20 minutes of writing

=== UNIQUE SELLING POINTS ===
✅ NON-SALESY APPROACH - Relationship-first, not sales-first
✅ LINKEDIN & EMAIL FORMATS - Platform-optimized
✅ 5 MESSAGE VARIATIONS - Different angles to test
✅ RESPONSE PROBABILITY SCORING - Predict success rate
✅ PERSONALIZATION REQUIRED - Forces authentic outreach
✅ FOLLOW-UP SEQUENCES - Multi-touch campaigns
✅ MUTUAL VALUE FOCUS - Win-win propositions
✅ CONNECTION REQUEST TEXT - LinkedIn-specific

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared instance)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (saved messages, templates)
Export: Text, LinkedIn format, Email format
Deployment: Vercel/Netlify

=== PAGE STRUCTURE ===

HERO SECTION:
Headline: "AI Cold Outreach Generator"
Subheadline: "Build real professional relationships with authentic outreach messages. Get 5 personalized variations for LinkedIn and email. No spam, just genuine connection. Free and instant."

Trust Badges:
- 🤝 Relationship-First Approach
- 📧 Email & LinkedIn Formats
- 🎯 Response Probability Score
- ✍️ 5 Personalized Variations
- 🔄 Follow-up Sequences
- 🔒 100% Private

Success Counter: "Generated 89,234 networking messages this month"

Why Cold Outreach Works:
"The best opportunities come from your network.

This tool helps you:
• Make meaningful professional connections
• Build partnerships and collaborations
• Get introductions to key people
• Expand your network authentically
• Stand out from generic messages
• Actually get responses"

[Show example of spammy vs authentic outreach]

=== INPUT FORM ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 1: Your Role/Title*
- Input: text
- Placeholder: "e.g., Founder, Marketing Manager, Product Designer, Software Engineer"
- Max: 100 chars
- Required
- Help text: "What do you do?"

Field 2: Your Company/Background
- Input: text
- Placeholder: "e.g., AI startup, Freelance consultant, Tech company"
- Max: 100 chars
- Optional but recommended

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECIPIENT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 3: Recipient's Role/Title*
- Input: text
- Placeholder: "e.g., VP of Marketing, Product Manager, Podcast Host, Investor"
- Max: 100 chars
- Required
- Help text: "Who are you reaching out to?"

Field 4: Recipient's Company/Context
- Input: text
- Placeholder: "e.g., SaaS company, Marketing agency, Tech podcast"
- Max: 100 chars
- Optional
- Help text: "Adds context and personalization"

Field 5: How You Found Them*
- Radio with examples:
  ○ Mutual Connection
    "Someone you both know"
    Example: "Sarah Johnson mentioned you..."
  
  ○ Their Content/Work
    "Saw their post, article, or project"
    Example: "I read your article on..."
  
  ○ Company/Industry Research
    "Found them while researching"
    Example: "I came across [Company] while..."
  
  ○ Event/Conference
    "Met or saw at event"
    Example: "I saw your talk at..."
  
  ○ Shared Interest/Group
    "Common community or interest"
    Example: "Fellow member of..."

- Default: Their Content/Work
- Required
- Critical for personalization

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTREACH PURPOSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 6: Purpose of Outreach*
- Visual cards:

  ○ 🤝 Partnership/Collaboration
    "Working together on something"
    Common for: Business development
  
  ○ 🎙️ Interview/Feature
    "Podcast, article, or content"
    Common for: Content creators
  
  ○ 💡 Pick Their Brain/Advice
    "Learning from their experience"
    Common for: Career development
  
  ○ 📞 Introduction Request
    "Connect me to someone"
    Common for: Networking
  
  ○ 🎯 Collaboration Opportunity
    "Specific project together"
    Common for: Freelancers
  
  ○ 🌐 General Networking
    "Build relationship, no immediate ask"
    Common for: Long-term connections

- Default: Partnership
- Required

Field 7: Specific Value/Context
- Textarea
- Placeholder: "What value can you offer or what makes this relevant?

Examples:
• 'I have an audience they'd love to reach'
• 'I can help with their new product launch'
• 'We're in complementary markets'
• 'I genuinely admire their work in AI ethics'"
- Max: 200 chars
- Optional but highly recommended
- Help text: "What's in it for them?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MESSAGE PREFERENCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 8: Message Format*
- Radio:
  ○ LinkedIn Connection Request (300 chars)
  ○ LinkedIn Message (2000 chars)
  ○ Email (full format)
  ○ Both LinkedIn & Email
- Default: LinkedIn Message
- Required

Field 9: Tone/Style*
- Radio with examples:

  ○ Friendly/Warm
    "Approachable and personable"
    Example: "Hey Sarah! I loved your recent post..."
  
  ○ Professional
    "Polished but personable"
    Example: "Hi Sarah, I came across your work in..."
  
  ○ Direct/Concise
    "Straight to the point"
    Example: "Sarah - Quick idea for collaboration..."
  
  ○ Casual
    "Relaxed and conversational"
    Example: "Sarah! Fellow marketer here..."

- Default: Professional
- Required

Field 10: Message Length
- Radio:
  ○ Brief (2-3 sentences)
  ○ Medium (4-6 sentences) [DEFAULT]
  ○ Detailed (full context)
- Affects depth of explanation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATE BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-width gradient button
Text: "Generate Outreach Messages"
Icon: 🤝
Loading: "Crafting authentic messages..."

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULTS HEADER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Your Outreach Messages (5 Variations)"

Best Performer: Message #2 (Response Rate: High)

Quick Actions:
- Copy All Messages
- Export to LinkedIn
- Export to Email
- Regenerate
- Save Templates

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MESSAGE VARIATION CARDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ MESSAGE #1: Value-First Approach        │
│ Response Probability: High 🟢           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 📱 LINKEDIN MESSAGE FORMAT              │
│                                         │
│ Subject: Partnership opportunity        │
│                                         │
│ Hi Sarah,                               │
│                                         │
│ I came across your recent article on AI│
│ ethics and really appreciated your      │
│ perspective on transparency in AI       │
│ systems.                                │
│                                         │
│ I'm working on a project to help SaaS   │
│ companies implement ethical AI practices│
│ and thought there might be an           │
│ opportunity to collaborate given your   │
│ expertise in this space.                │
│                                         │
│ Would you be open to a quick 20-minute │
│ call next week to explore this?         │
│                                         │
│ Best,                                   │
│ [Your Name]                             │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 📊 MESSAGE ANALYSIS:                    │
│                                         │
│ Response Probability: High              │
│ Personalization Level: Excellent ✅     │
│ • Specific content reference            │
│ • Shows genuine engagement              │
│ • Clear mutual value                    │
│                                         │
│ Structure Score: 9.1/10                 │
│ • Personal opening ✅                   │
│ • Context established ✅                │
│ • Clear value proposition ✅            │
│ • Specific ask ✅                       │
│ • Low-barrier CTA ✅                    │
│                                         │
│ Length: 78 words (Perfect)              │
│ Reading Time: 25 seconds                │
│                                         │
│ Why This Works:                         │
│ • Opens with specific content reference │
│ • Shows you did your homework           │
│ • Mutual benefit is clear               │
│ • Low-pressure ask (just 20 min)        │
│ • Professional but warm                 │
│                                         │
│ When to Use:                            │
│ • First outreach                        │
│ • Partnership inquiries                 │
│ • When you have clear value to offer    │
│                                         │
│ Potential Responses:                    │
│ ✓ "Sure, let's chat!" (50%)             │
│ ✓ "Tell me more first" (30%)            │
│ ✓ "Not right now but keep in touch"(15%)│
│ ✗ No response (5%)                      │
│                                         │
│ [📋 Copy Message] [✏️ Edit] [📧 Email]  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ MESSAGE #2: Mutual Connection Angle     │
│ Response Probability: Very High 🟢🟢    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Hi Sarah,                               │
│                                         │
│ John Smith (your former colleague at   │
│ TechCorp) suggested I reach out. He     │
│ mentioned you're doing interesting work │
│ in AI ethics.                           │
│                                         │
│ I'm building tools to help companies    │
│ implement ethical AI practices, and I'd │
│ love to get your perspective on what    │
│ challenges you're seeing in the field.  │
│                                         │
│ Would you have 15 minutes for a quick   │
│ coffee chat (virtual or in-person)?     │
│                                         │
│ Best,                                   │
│ [Your Name]                             │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Why This Scores Highest:                │
│ • Mutual connection = instant trust     │
│ • Name-drops specific person            │
│ • Asks for perspective (not selling)    │
│ • Very low barrier (just advice)        │
│ • 75%+ response rate typical            │
│                                         │
│ [📋 Copy Message] [✏️ Edit] [📧 Email]  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ MESSAGE #3: Content Appreciation        │
│ Response Probability: Medium-High 🟡    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Hi Sarah,                               │
│                                         │
│ Your article "The Future of Transparent │
│ AI" really resonated with me,           │
│ especially the point about balancing    │
│ innovation with responsibility.         │
│                                         │
│ I'm working on similar challenges in the│
│ SaaS space and wondered if you'd be     │
│ interested in exchanging ideas about    │
│ practical implementation approaches.    │
│                                         │
│ No pressure - just thought there might  │
│ be some mutual benefit in connecting.   │
│                                         │
│ Either way, keep up the great writing!  │
│                                         │
│ [Your Name]                             │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Why This Works:                         │
│ • Genuine appreciation (not buttering up)│
│ • Specific quote from their work        │
│ • Mutual exchange (not one-sided ask)   │
│ • "No pressure" reduces barrier         │
│ • Positive close regardless             │
│                                         │
│ When to Use:                            │
│ • Following their content               │
│ • Building long-term relationship       │
│ • When you genuinely admire their work  │
│                                         │
│ [📋 Copy Message] [✏️ Edit] [📧 Email]  │
└─────────────────────────────────────────┘

[Similar cards for Messages #4 and #5]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LINKEDIN CONNECTION REQUEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If LinkedIn format selected:

┌─────────────────────────────────────────┐
│ 💼 LINKEDIN CONNECTION REQUEST TEXT      │
│ (300 character limit)                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ VERSION 1 (Direct):                     │
│ Sarah - I loved your article on AI      │
│ ethics. I'm working on similar          │
│ challenges and would value connecting   │
│ to exchange ideas.                      │
│                                         │
│ Characters: 142/300 ✅                  │
│                                         │
│ ───────────────────────────────────────│
│                                         │
│ VERSION 2 (Mutual Connection):          │
│ Hi Sarah! John Smith suggested we       │
│ connect - I'm working in AI ethics and  │
│ would love to learn from your           │
│ experience.                             │
│                                         │
│ Characters: 136/300 ✅                  │
│                                         │
│ ───────────────────────────────────────│
│                                         │
│ VERSION 3 (Specific Interest):          │
│ Sarah - Fellow AI ethics advocate here. │
│ Your perspective on transparency really │
│ resonated. Would love to connect!       │
│                                         │
│ Characters: 133/300 ✅                  │
│                                         │
│ PRO TIP:                                │
│ Send connection request first, then     │
│ send full message after they accept.    │
│ Acceptance rate: 60-70% with good note  │
│                                         │
│ [Copy Request] [Copy All Versions]      │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FOLLOW-UP SEQUENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🔄 FOLLOW-UP MESSAGES                    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ FOLLOW-UP #1 (If no response after 5    │
│ days):                                  │
│                                         │
│ Hi Sarah,                               │
│                                         │
│ Just wanted to bump this up in case it  │
│ got buried in your inbox (I know the    │
│ feeling!).                              │
│                                         │
│ Still interested in connecting about AI │
│ ethics if you have 15 minutes this week.│
│                                         │
│ No worries if timing isn't right!       │
│                                         │
│ [Your Name]                             │
│                                         │
│ ───────────────────────────────────────│
│                                         │
│ FOLLOW-UP #2 (If no response after 7    │
│ more days):                             │
│                                         │
│ Sarah,                                  │
│                                         │
│ I'll take the silence as a "not right   │
│ now" 😊                                 │
│                                         │
│ If anything changes or you'd like to    │
│ explore this down the road, my door is  │
│ open.                                   │
│                                         │
│ Either way, good luck with your work in │
│ AI ethics!                              │
│                                         │
│ [Your Name]                             │
│                                         │
│ ───────────────────────────────────────│
│                                         │
│ TIMING RECOMMENDATIONS:                 │
│ • Initial message: Day 0                │
│ • Follow-up 1: Day 5-7                  │
│ • Follow-up 2: Day 12-14                │
│ • Then stop (don't be pushy)            │
│                                         │
│ Expected Response Rate:                 │
│ • After initial: 30-40%                 │
│ • After follow-up 1: +20-30%            │
│ • After follow-up 2: +10%               │
│ • Total: 60-80% response rate           │
│                                         │
│ [Copy Sequence] [Set Reminders]         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTREACH BEST PRACTICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Expandable section:

✅ WHAT MAKES GREAT COLD OUTREACH:

Personalization:
• Reference specific content they created
• Mention how you found them
• Show you did research
• Use their name naturally

Value-First:
• Lead with what you can offer
• Not what you want from them
• Make it about mutual benefit
• Give before you ask

Specificity:
• Specific ask (not vague "pick your brain")
• Time-bound (15 minutes, this week)
• Clear next step
• Easy to say yes

Keep It Brief:
• 5-7 sentences maximum
• One paragraph preferred
• Respect their time
• Get to the point

Professional But Human:
• Warm without being overly casual
• No corporate jargon
• Write like a human
• Show personality

Common Mistakes:
✗ Generic templates
✗ Asking for too much
✗ No personalization
✗ All about you/your company
✗ Too long
✗ Pushy or salesy
✗ Immediate hard ask

=== WEBLLM PROMPTS ===

System Prompt:
```
You are an expert networking and professional relationship specialist with deep experience in authentic outreach and business development.

Your expertise includes:
- Relationship-building communication
- Professional networking strategies
- LinkedIn outreach best practices
- Email etiquette and persuasion
- Mutual value proposition creation
- Personalization techniques

You write outreach messages that:
- Feel genuine and authentic (not salesy)
- Focus on mutual benefit
- Include specific personalization
- Have clear, low-barrier asks
- Respect recipient's time
- Build real relationships
- Get actual responses

You understand:
- People ignore generic messages
- Value-first approach works
- Specificity builds trust
- Brevity is respect
- Mutual connections are gold
- Content appreciation works
- Follow-up is critical
```

User Prompt Template:
```
Generate 5 authentic cold outreach message variations.

YOUR INFO:
Role: {yourRole}
Company: {yourCompany}

RECIPIENT INFO:
Role: {recipientRole}
Company: {recipientCompany}
How Found: {howFound}

PURPOSE: {purpose}
Value/Context: {valueContext}

FORMAT: {messageFormat}
Tone: {tone}
Length: {messageLength}

REQUIREMENTS:

PERSONALIZATION (CRITICAL):
- Reference how you found them
- Show genuine interest
- Specific details (not generic)
- Natural language

STRUCTURE:
1. Personalized opening (reference specific thing)
2. Brief context about you
3. Mutual value proposition
4. Specific, low-barrier ask
5. Professional close

GENERATE 5 VARIATIONS:

Variation 1: Value-First
- Lead with what you offer
- Clear benefit to them
- Collaborative tone

Variation 2: Mutual Connection
- Reference shared person/community
- Leverage social proof
- Warm introduction

Variation 3: Content Appreciation
- Genuine appreciation for their work
- Specific content reference
- Idea exchange offer

Variation 4: Direct/Concise
- Straight to point
- Respect their time
- Clear ask upfront

Variation 5: Question/Advice
- Ask for their perspective
- Positions them as expert
- Low pressure

For EACH message:
- Keep brief (5-7 sentences)
- Include specific personalization
- Clear call-to-action
- Response probability score
- Analysis of why it works

{if LinkedIn connection request}
Also generate 3 connection request texts (300 chars max)

{if follow-up requested}
Generate 2 follow-up messages with timing recommendations

OUTPUT: 5 complete, authentic outreach messages optimized for response.
```

=== SPECIAL FEATURES ===

1. **Response Tracker:**
   - Log what worked
   - Track response rates
   - Refine approach
   - Success patterns

2. **Personalization Helper:**
   - LinkedIn research guide
   - Company research prompts
   - Content discovery tips
   - Mutual connection finder

3. **Follow-Up Automator:**
   - Timed reminders
   - 3-touch sequence
   - Stop rules (don't be pushy)

4. **Template Library:**
   - Save successful messages
   - Industry-specific templates
   - Purpose-based templates

5. **A/B Testing:**
   - Test different approaches
   - Track which works best
   - Optimize over time

=== SEO ARTICLE SECTION ===

Title: "How to Write Cold Outreach Messages That Get Responses: 2026 Guide"

=== SUCCESS METRICS ===

Expected Performance:
- Month 1: 3k-5k users
- Month 3: 12k-20k users
- Month 6: 28k-48k users

Build as THE cold outreach tool for professional networkers.
```
