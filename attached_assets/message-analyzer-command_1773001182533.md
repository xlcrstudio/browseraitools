

## Complete Build Command for browseraitools.com

```
Create a mobile-first, privacy-focused AI Message Analyzer for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI Message Analyzer (Private Conversation Analyzer)
URL Slug: /ai-message-analyzer
Tagline: "Understand Any Message - 100% Private, 100% Free"
Mission: Help people interpret confusing messages, emails, and conversations with complete privacy

=== PRODUCT OVERVIEW ===
Breakthrough tool with massive viral potential.
Purpose: Analyze messages, emails, texts, and conversations to reveal tone, intent, hidden meaning, and suggest replies - all while keeping data 100% private in the browser.
Target Users: EVERYONE who communicates digitally (universal appeal)
Search Demand: Massive untapped market
- "what does this text mean" - 50k+/month
- "is this email rude" - 20k+/month  
- "how to respond to this message" - 40k+/month
- "is this a scam text" - 100k+/month
- "analyze my conversation" - 15k+/month
- Plus hundreds of long-tail variations

Key Value: Instant message analysis with perfect privacy vs. guessing or asking friends

=== UNIQUE SELLING POINTS (GAME-CHANGING) ===
✅ 100% PRIVATE - Data never leaves browser (WebLLM advantage)
✅ Tone detection (friendly, passive-aggressive, professional, flirty, cold, etc.)
✅ Intent analysis (what they REALLY mean)
✅ Reply suggestions (multiple tones: professional, friendly, direct, diplomatic)
✅ Scam/phishing detection
✅ Relationship context analyzer (dating, work, family, business)
✅ Red flag detection (manipulation, gaslighting, love bombing)
✅ Emotional intelligence insights
✅ Suggested next steps
✅ Multiple analysis modes in one tool

=== WHY THIS COULD GO VIRAL ===

Universal Problem:
- Everyone gets confusing messages daily
- Relationship anxiety (dating texts)
- Work stress (email interpretation)
- Scam concerns (suspicious messages)
- Social anxiety (did I offend them?)

Emotional Relevance:
- People care DEEPLY about communication
- High anxiety around misunderstanding
- Relationship implications
- Career consequences

Privacy Critical:
- Most people won't upload private messages to servers
- Dating texts, work emails, family arguments
- WebLLM = perfect solution

High Return Rate:
- People get confusing messages constantly
- Will use repeatedly
- Bookmark and share

Shareability:
- "OMG you need to see what this tool said about his text"
- Viral potential through word-of-mouth
- Social proof ("this tool helped me understand...")

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared instance)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (analysis history - optional, user-controlled)
Export: Text, PDF analysis report
Deployment: Vercel/Netlify

CRITICAL PRIVACY FEATURES:
- No analytics on message content
- No server-side processing
- Optional save (user controlled)
- Clear privacy messaging everywhere
- "Delete analysis" button always visible

=== PAGE STRUCTURE ===

HERO SECTION:
Headline: "AI Message Analyzer"
Subheadline: "Understand any message instantly. Analyze tone, decode hidden meaning, get reply suggestions - all 100% private in your browser. Perfect for texts, emails, DMs, or any conversation."

PRIVACY TRUST BADGES (Prominent):
- 🔒 100% Private - Nothing Leaves Your Browser
- 👁️ No One Sees Your Messages - Not Even Us
- 🚫 No Servers - Runs Entirely Locally
- ⚡ WebLLM Powered - AI in Your Browser
- 🗑️ Delete Anytime - Full Control

Success Counter: "Analyzed 156,789 messages this month - all privately"

Problem/Benefit Callouts:
"Ever wonder..."
- 💬 "What does this text really mean?"
- 📧 "Is this email passive-aggressive?"
- ❓ "How should I respond to this?"
- 🚩 "Is this person manipulating me?"
- 💔 "Are they actually interested in me?"
- 🎣 "Is this message a scam?"

"This tool helps you understand with complete privacy."

=== INPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MESSAGE INPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Large Textarea:
- Placeholder: "Paste the message, email, text, or conversation you want to analyze.

Examples:
• A confusing text from someone you're dating
• An email from your boss that feels off
• A suspicious message claiming to be from your bank
• A conversation where you're not sure how they feel
• A message you're worried might sound rude

Your message stays 100% private in your browser."

- Max: 5000 chars (allows full conversations)
- Auto-expanding textarea
- Character counter shown
- Required
- Privacy reminder below: "🔒 This message never leaves your browser"

Quick Examples (Click to Load):
- Dating text: "Hey, been really busy lately. Maybe we can hang out sometime if things calm down."
- Work email: "Per my last email, I mentioned this deadline was important."
- Suspicious: "Your package could not be delivered. Click here to reschedule: bit.ly/xyz123"
- Cold response: "Thanks for reaching out. I'll think about it."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTEXT (Optional but Recommended)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 1: Relationship Context
- Dropdown:
  • Dating/Romantic Interest
  • Partner/Spouse
  • Friend
  • Family Member
  • Boss/Manager
  • Colleague/Coworker
  • Client/Customer
  • Recruiter/Job Related
  • Stranger/Unknown
  • Potential Scam
  • Other
- Default: Auto-detect
- Help text: "Helps provide context-specific insights"

Field 2: What's Your Main Question? (Optional)
- Input: text
- Placeholder: "e.g., Are they interested in me? Is this rude? How should I respond? Is this a scam?"
- Max: 200 chars
- Optional
- Helps focus analysis

Field 3: Your Relationship History (Optional)
- Textarea
- Placeholder: "Any background that might help understand this message?
e.g., 'We've been dating for 2 months but he's been distant lately'
or 'This is a work colleague I've had tension with'"
- Max: 300 chars
- Optional
- Provides deeper context

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANALYSIS OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Choose What to Analyze (Checkboxes - can select multiple):

☑ Tone Analysis
  Detect the emotional tone (friendly, cold, professional, flirty, angry, etc.)

☑ Intent Analysis  
  What does the sender really mean? What are they trying to communicate?

☑ Reply Suggestions
  Get 3-5 suggested responses in different tones

☑ Red Flags Check
  Identify manipulation, gaslighting, scam indicators, or concerning patterns

☐ Relationship Insights
  Understand interest level, enthusiasm, commitment signals (for dating/relationships)

☐ Professional Analysis
  Work-appropriate interpretation (for emails, professional messages)

☐ Scam Detection
  Check for phishing, fraud, manipulation tactics

Default: Tone Analysis, Intent Analysis, Reply Suggestions all checked

Quick Presets:
- [Dating Message] - Tone + Intent + Relationship Insights + Reply
- [Work Email] - Tone + Intent + Professional Analysis + Reply
- [Suspicious Message] - Scam Detection + Red Flags + Intent
- [Full Analysis] - All options

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANALYZE BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Large, prominent button
Text: "Analyze Message (Privately)"
Icon: 🔍
Loading states:
- "Analyzing tone..."
- "Detecting intent..."
- "Checking for red flags..."
- "Generating reply suggestions..."

Privacy reminder on button hover: "Analysis happens 100% in your browser"

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANALYSIS RESULTS HEADER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Your Private Message Analysis"

Quick Actions:
- Copy Full Analysis
- Download as PDF
- Save to History (optional - user controlled)
- Delete Analysis (clears everything)
- Analyze Different Message
- Share Tool (not analysis - just the tool link)

Privacy Reminder Banner:
"🔒 This analysis happened entirely in your browser. We never saw this message."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TONE ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Card with visual indicators:

┌─────────────────────────────────────────┐
│ 📊 TONE ANALYSIS                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Primary Tone: Polite but Non-Committal  │
│ ██████████░░░░░░░░░░ 60% Neutral        │
│ ████░░░░░░░░░░░░░░░░ 25% Polite         │
│ ██░░░░░░░░░░░░░░░░░░ 15% Distant        │
│                                         │
│ TONE INDICATORS:                        │
│ ✓ Polite language ("Maybe", "if")       │
│ ✓ Lack of enthusiasm (no exclamation)  │
│ ✓ Non-specific timeframe ("sometime")  │
│ ✓ Conditional phrasing ("if things     │
│   calm down")                           │
│                                         │
│ WHAT THIS MEANS:                        │
│ The sender is being courteous but not  │
│ showing strong interest in meeting.    │
│ The vague language suggests they're    │
│ keeping options open rather than       │
│ committing to specific plans.          │
│                                         │
│ EMOTIONAL TEMPERATURE: 😐 Cool          │
│ ENTHUSIASM LEVEL: ⭐⭐☆☆☆ Low           │
│                                         │
└─────────────────────────────────────────┘

Tone Categories Detected:
• Professional: 20%
• Friendly: 25%
• Neutral: 60%
• Polite: 40%
• Non-committal: 70%
• Distant: 30%

Compare to Other Tones:
If they were interested, you'd expect:
- Specific time/date suggestions
- Enthusiastic language
- Follow-up questions
- Exclamation points or emojis

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTENT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🎯 WHAT THEY REALLY MEAN                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ SURFACE MEANING:                        │
│ "I've been busy and we might meet next │
│ week."                                  │
│                                         │
│ LIKELY ACTUAL INTENT:                   │
│ The sender is politely creating        │
│ distance without explicitly rejecting. │
│ This is a "soft no" - they're not     │
│ saying they don't want to meet, but   │
│ they're also not making it happen.    │
│                                         │
│ WHAT THEY'RE COMMUNICATING:             │
│ 1. They acknowledge your interest      │
│ 2. They're not ready to commit to      │
│    specific plans                       │
│ 3. They're leaving the door open but  │
│    not walking through it               │
│ 4. They want to maintain politeness    │
│    without obligation                   │
│                                         │
│ PROBABLE REASONS:                       │
│ • Genuinely busy (30% likely)          │
│ • Not that interested (50% likely)     │
│ • Unsure/waiting to see (20% likely)   │
│                                         │
│ RED FLAGS: 🚩                           │
│ • Vague timeframe ("sometime")         │
│ • Conditional language ("if things     │
│   calm down")                           │
│ • No specific date offered             │
│ • Passive tone (you'd need to follow  │
│   up)                                   │
│                                         │
│ GREEN FLAGS: ✅                          │
│ • Still responding (not ghosting)      │
│ • Polite and respectful                │
│ • Didn't completely shut down idea     │
│                                         │
│ CONFIDENCE LEVEL: 75%                   │
│ This interpretation is based on common │
│ communication patterns, but individual │
│ circumstances vary.                     │
│                                         │
└─────────────────────────────────────────┘

What This Means for You:
• Don't read too much into this message
• Ball is in their court for now
• If they were excited, they'd suggest specific plans
• Give them space and see if they follow up
• Don't chase - let them come to you if interested

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REPLY SUGGESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 💬 SUGGESTED REPLIES (3 Options)         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ OPTION 1: Casual & Low-Pressure         │
│ Recommended: ⭐⭐⭐⭐⭐                    │
│                                         │
│ "No problem! Let me know when things   │
│ settle down and we'll find a time that │
│ works. 😊"                              │
│                                         │
│ Why this works:                         │
│ ✓ Mirrors their casual tone            │
│ ✓ Doesn't pressure them                │
│ ✓ Puts ball in their court             │
│ ✓ Keeps door open                      │
│ ✓ Shows you're not desperate           │
│                                         │
│ [Copy Reply]                            │
│                                         │
│ ─────────────────────────────────────  │
│                                         │
│ OPTION 2: Direct & Clear                │
│ Recommended: ⭐⭐⭐☆☆                    │
│                                         │
│ "Sounds good! Just give me a heads up  │
│ when you're free and we'll make it     │
│ happen."                                │
│                                         │
│ Why this works:                         │
│ ✓ Straightforward                      │
│ ✓ Shows confidence                     │
│ ✓ No pressure but clear interest       │
│ ⚠️ Slightly more eager than Option 1   │
│                                         │
│ [Copy Reply]                            │
│                                         │
│ ─────────────────────────────────────  │
│                                         │
│ OPTION 3: Match Their Energy            │
│ Recommended: ⭐⭐⭐⭐☆                    │
│                                         │
│ "Cool, sounds like you have a lot      │
│ going on. Hit me up whenever!"         │
│                                         │
│ Why this works:                         │
│ ✓ Mirrors their non-committal tone     │
│ ✓ Very casual and pressure-free        │
│ ✓ Completely in their court            │
│ ✓ Shows you're not invested            │
│ ⚠️ Might seem too indifferent          │
│                                         │
│ [Copy Reply]                            │
│                                         │
└─────────────────────────────────────────┘

ADVANCED REPLY OPTIONS:

If You Want to Test Interest:
"I'm around this Thursday at 7pm if that works? If not, no worries!"
• Direct but gives them easy out
• Tests if they'll commit or keep dodging

If You Want to Back Off:
"Totally understand. Good luck with everything!"
• Ends pursuit gracefully
• Leaves door open if they change mind

If You Want More Context:
"What's keeping you busy? Hope everything's okay!"
• Shows care/interest
• Might reveal if excuse is real or polite brush-off

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RED FLAGS & WARNING SIGNS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🚩 POTENTIAL CONCERNS                    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ COMMUNICATION PATTERNS DETECTED:        │
│                                         │
│ ⚠️ Non-Specific Timeframes              │
│ Severity: Medium                        │
│ The phrase "sometime next week" and    │
│ "if things calm down" are intentionally│
│ vague. This could indicate:            │
│ • Genuine uncertainty                  │
│ • Avoiding commitment                  │
│ • Keeping options open                 │
│                                         │
│ ⚠️ Conditional Language                 │
│ Severity: Medium                        │
│ "Maybe" and "if" language shows        │
│ hesitation. Compare to enthusiastic:   │
│ "Let's meet next Thursday!"            │
│                                         │
│ ⚠️ Low Enthusiasm Markers               │
│ Severity: Low-Medium                    │
│ No exclamation points, emojis, or      │
│ excitement indicators. Contrast with   │
│ interested person: "I'd love to! Can't │
│ wait!"                                  │
│                                         │
│ ✅ POSITIVE SIGNS:                       │
│ • Still responding (not ghosting)      │
│ • Polite and respectful                │
│ • Acknowledged your message            │
│ • Didn't give hard "no"                │
│                                         │
│ OVERALL RISK ASSESSMENT:                │
│ Low Risk of Scam: ✅                    │
│ Moderate Risk of Lack of Interest: ⚠️  │
│ High Risk of Miscommunication: ❌       │
│                                         │
│ NOT DETECTED:                           │
│ ✗ Manipulation tactics                 │
│ ✗ Gaslighting language                │
│ ✗ Love bombing                         │
│ ✗ Scam indicators                      │
│ ✗ Aggressive or hostile tone           │
│                                         │
└─────────────────────────────────────────┘

Context-Specific Red Flags:

For Dating/Romantic:
🚩 Pattern: "Slow Fade"
This message shows classic "slow fade" characteristics:
- Responds but doesn't initiate
- Vague about future plans
- No concrete commitments
- Polite but distant

What to Watch For:
- Do they ever suggest specific plans?
- Do they initiate contact or only respond?
- How long between responses?
- Do their actions match their words?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RELATIONSHIP INSIGHTS (Dating Context)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 💝 INTEREST LEVEL ANALYSIS               │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ INTEREST METER:                         │
│ ██████░░░░░░░░░░░░░░ 30% Interested    │
│                                         │
│ INTERPRETATION:                         │
│ Based on this message, the sender is   │
│ showing LOW to MODERATE interest.      │
│                                         │
│ INTEREST INDICATORS:                    │
│                                         │
│ HIGH INTEREST signals (Not Present):   │
│ ✗ Suggesting specific times/dates      │
│ ✗ Asking questions about you           │
│ ✗ Enthusiastic language                │
│ ✗ Quick responses                      │
│ ✗ Making effort to connect             │
│                                         │
│ LOW INTEREST signals (Present):        │
│ ✓ Vague future plans                   │
│ ✓ Conditional language                 │
│ ✓ No follow-up questions               │
│ ✓ Minimal engagement                   │
│ ✓ Lack of enthusiasm                   │
│                                         │
│ WHAT THIS SUGGESTS:                     │
│                                         │
│ Likely Scenario (60% probability):     │
│ They're not actively interested but    │
│ being polite. They may respond if you  │
│ initiate but won't pursue on their own.│
│                                         │
│ Alternative Scenario (30% probability):│
│ They're genuinely busy right now and  │
│ will reach out when things settle. If  │
│ this is true, they'll suggest specific │
│ plans later.                            │
│                                         │
│ Test Scenario (10% probability):       │
│ They're testing your interest level.   │
│ Being vague to see if you'll pursue or │
│ back off.                               │
│                                         │
│ RECOMMENDED ACTION:                     │
│ 1. Send casual, low-pressure reply     │
│ 2. Don't initiate again after this     │
│ 3. Wait for them to suggest concrete   │
│    plans                                │
│ 4. If they don't follow up in 1-2     │
│    weeks, they're not interested       │
│ 5. Don't take it personally - move on  │
│                                         │
│ REMEMBER:                               │
│ When someone is interested, they make  │
│ it easy. You won't be confused about   │
│ their interest level. If you're        │
│ confused, that's usually your answer.  │
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCAM DETECTION (If Selected)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Example for suspicious message:

┌─────────────────────────────────────────┐
│ 🚨 SCAM RISK ASSESSMENT                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ RISK LEVEL: 🔴 HIGH - Likely Scam      │
│                                         │
│ SCAM INDICATORS DETECTED:               │
│                                         │
│ ⚠️ URGENCY TACTICS (Severity: HIGH)    │
│ Message creates false urgency:         │
│ "immediately", "urgent", "act now"     │
│ Why: Scammers pressure quick action    │
│ before you can think critically        │
│                                         │
│ ⚠️ SUSPICIOUS LINKS (Severity: CRITICAL)│
│ Contains shortened URL (bit.ly/xyz)    │
│ Why: Legitimate companies use official │
│ domains, not link shorteners           │
│ ⚠️ DO NOT CLICK THIS LINK               │
│                                         │
│ ⚠️ IMPERSONATION (Severity: HIGH)      │
│ Claims to be from official source      │
│ Why: Banks/companies don't contact via │
│ text with urgent requests              │
│                                         │
│ ⚠️ REQUEST FOR ACTION (Severity: HIGH) │
│ Asks you to click, call, or verify     │
│ Why: Phishing attempts to steal info   │
│                                         │
│ ⚠️ GRAMMAR/SPELLING (Severity: MEDIUM) │
│ Professional companies proofread       │
│                                         │
│ LEGITIMATE MESSAGE WOULD HAVE:          │
│ ✓ Official company domain              │
│ ✓ No urgency pressure                  │
│ ✓ Account-specific details             │
│ ✓ Option to verify through official   │
│   channels                              │
│ ✓ Professional tone                    │
│                                         │
│ RECOMMENDED ACTIONS:                    │
│ 1. ❌ DO NOT click any links            │
│ 2. ❌ DO NOT call phone numbers         │
│ 3. ❌ DO NOT reply to message           │
│ 4. ✅ Contact company through official │
│    website/phone                        │
│ 5. ✅ Report as spam/phishing           │
│ 6. ✅ Delete message                    │
│                                         │
│ HOW TO VERIFY:                          │
│ • Google the official company website  │
│ • Call the number on their official    │
│   site (not the one in message)        │
│ • Log into your account directly       │
│   (not through link)                    │
│ • Check for similar scam reports       │
│   online                                │
│                                         │
└─────────────────────────────────────────┘

Common Scam Types This Could Be:
• Phishing (stealing login credentials)
• Smishing (SMS phishing)
• Package delivery scam
• Account verification scam
• Urgency scam

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROFESSIONAL EMAIL ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For work emails:

┌─────────────────────────────────────────┐
│ 💼 PROFESSIONAL COMMUNICATION ANALYSIS   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ EMAIL TONE: Passive-Aggressive          │
│ Confidence: 85%                         │
│                                         │
│ ANALYSIS OF: "Per my last email..."    │
│                                         │
│ SURFACE MEANING:                        │
│ Referring back to previous email       │
│                                         │
│ LIKELY ACTUAL MEANING:                  │
│ "I already told you this. You should   │
│ have read/remembered my previous email.│
│ I'm frustrated at having to repeat     │
│ myself."                                │
│                                         │
│ PASSIVE-AGGRESSIVE INDICATORS:          │
│ ✓ "Per my last email" (classic phrase) │
│ ✓ Implies you weren't paying attention │
│ ✓ Polite words, annoyed subtext        │
│ ✓ Indirect expression of frustration   │
│                                         │
│ WHAT SENDER IS COMMUNICATING:           │
│ 1. They're irritated (not expressing   │
│    it directly)                         │
│ 2. They feel information was already   │
│    provided                             │
│ 3. They view this as your oversight    │
│ 4. They want you to know they noticed  │
│                                         │
│ RECOMMENDED RESPONSE STRATEGY:          │
│                                         │
│ DO:                                     │
│ ✓ Acknowledge you missed it            │
│ ✓ Thank them for clarification         │
│ ✓ Take ownership professionally        │
│ ✓ Move forward constructively          │
│                                         │
│ DON'T:                                  │
│ ✗ Get defensive                        │
│ ✗ Make excuses                         │
│ ✗ Mirror their passive-aggression      │
│ ✗ Ignore the subtext                   │
│                                         │
│ SAMPLE REPLY:                           │
│ "Thank you for the clarification - I  │
│ apologize for missing that in your    │
│ previous email. I've reviewed it now  │
│ and [take appropriate action]. I      │
│ appreciate your patience."             │
│                                         │
│ WHY THIS REPLY WORKS:                   │
│ • Takes ownership without groveling    │
│ • Shows you've now reviewed it         │
│ • Maintains professionalism            │
│ • Moves conversation forward           │
│ • Doesn't escalate tension             │
│                                         │
└─────────────────────────────────────────┘

Professional Context Ratings:
• Professionalism: ★★★☆☆
• Directness: ★★☆☆☆
• Passive-Aggression: ★★★★☆
• Constructiveness: ★★☆☆☆

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT STEPS & GUIDANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What You Should Do Next:

IMMEDIATE ACTIONS:
1. Choose a reply option (or craft your own)
2. Send it without overthinking
3. Put your phone down for a while
4. Don't expect immediate response

WAIT & OBSERVE:
- Give them 2-3 days to respond
- Don't double-text or follow up
- Notice if they suggest concrete plans
- Pay attention to effort level

IF THEY RESPOND:
- Look for enthusiasm increase
- Check if they offer specifics
- Notice who's doing the pursuing

IF THEY DON'T RESPOND:
- That's your answer
- Don't chase
- Move on with grace
- Your time is valuable too

TRUST YOUR GUT:
- If something feels off, it probably is
- Confusion is often a signal
- When someone wants to see you, you'll know
- Don't make excuses for lack of effort

REMEMBER:
You deserve someone who's excited about you. If you're constantly analyzing their messages and wondering where you stand, that's usually a sign you already know the answer.

=== EXAMPLE USE CASES ===

Show 8-10 real-world examples:

EXAMPLE 1: Dating Text
Input: "Sorry I've been MIA! Work has been crazy. Rain check?"
Analysis: Low interest, vague excuse, no alternative suggested

EXAMPLE 2: Boss Email  
Input: "We need to discuss your performance. Schedule a meeting ASAP."
Analysis: Serious, urgent, potentially concerning, prepare professionally

EXAMPLE 3: Suspicious Message
Input: "URGENT: Your account has been locked. Verify here: bit.ly/abc"
Analysis: Clear phishing attempt, multiple red flags, do not click

EXAMPLE 4: Cold Response
Input: "K."
Analysis: Dismissive, disinterested, potentially upset, low engagement

EXAMPLE 5: Mixed Signals
Input: "Had a great time! Let's do it again soon 😊"
Analysis: Genuine positivity, specific praise, emoji shows warmth

EXAMPLE 6: Passive-Aggressive Colleague
Input: "Thanks for 'finally' getting back to me on this."
Analysis: Sarcastic quotes indicate frustration, handle diplomatically

EXAMPLE 7: Recruiter Message
Input: "We'd like to move forward with next steps. Are you available Thursday?"
Analysis: Positive signal, specific ask, shows genuine interest

EXAMPLE 8: Potential Manipulation
Input: "If you really cared about me, you'd do this..."
Analysis: Guilt trip, emotional manipulation, red flag behavior

[Each example is clickable to load and analyze]

=== WEBLLM PROMPTS ===

System Prompt:
```
You are an expert communication analyst with deep understanding of human psychology, linguistics, and social dynamics.

Your expertise includes:
- Tone detection and analysis
- Intent interpretation
- Relationship dynamics
- Professional communication
- Scam and phishing detection
- Emotional intelligence
- Manipulation pattern recognition
- Cultural communication norms
- Digital communication psychology

You analyze messages to reveal:
- Explicit meaning (what they said)
- Implicit meaning (what they meant)
- Emotional tone and subtext
- Intent and motivations
- Red flags or concerning patterns
- Appropriate response strategies

Your analyses are:
- Psychologically insightful
- Nuanced and context-aware
- Honest but tactful
- Evidence-based (citing specific phrases)
- Actionable (providing clear next steps)
- Empathetic to user's situation
- Non-judgmental
- Helpful for decision-making

You understand:
- The difference between politeness and interest
- Passive-aggressive communication patterns
- Manipulation tactics (gaslighting, love bombing, etc.)
- Scam and phishing indicators
- Professional vs personal communication norms
- Dating and relationship communication dynamics
- The anxiety people feel about unclear messages

You provide:
- Clear explanations of tone and intent
- Specific evidence from the message
- Confidence levels for interpretations
- Multiple possible explanations when ambiguous
- Practical advice for next steps
- Suggested replies in appropriate tones
```

User Prompt Template:
```
Analyze this message and provide comprehensive insights.

═══════════════════════════════════════
MESSAGE TO ANALYZE
═══════════════════════════════════════
{message}

═══════════════════════════════════════
CONTEXT
═══════════════════════════════════════
Relationship: {relationshipContext}
Main Question: {mainQuestion}
Background: {relationshipHistory}

═══════════════════════════════════════
ANALYSIS REQUESTED
═══════════════════════════════════════
{selectedAnalysisTypes}

TONE ANALYSIS: {toneAnalysisRequested}
INTENT ANALYSIS: {intentAnalysisRequested}
REPLY SUGGESTIONS: {replySuggestionsRequested}
RED FLAGS: {redFlagsRequested}
RELATIONSHIP INSIGHTS: {relationshipInsightsRequested}
PROFESSIONAL ANALYSIS: {professionalAnalysisRequested}
SCAM DETECTION: {scamDetectionRequested}

═══════════════════════════════════════
ANALYSIS REQUIREMENTS
═══════════════════════════════════════

{if toneAnalysisRequested}
TONE ANALYSIS:
Identify:
- Primary emotional tone
- Secondary tones present
- Tone percentages/strength
- Specific indicators (words, punctuation, phrasing)
- What this tone suggests
- Emotional temperature (warm/cool/neutral)
- Enthusiasm level (high/medium/low)

Tone Categories to Consider:
- Friendly / Warm / Cold / Distant
- Professional / Casual / Informal
- Enthusiastic / Neutral / Disinterested
- Polite / Rude / Passive-Aggressive
- Genuine / Sarcastic / Dismissive
- Romantic / Platonic / Ambiguous
- Confident / Uncertain / Defensive
- Direct / Vague / Evasive

{if intentAnalysisRequested}
INTENT ANALYSIS:
Explain:
- Surface meaning (what they explicitly said)
- Likely actual meaning (what they probably meant)
- What they're really communicating
- Probable motivations
- What they want from this message
- What they expect as response

Provide:
- Confidence level (percentage)
- Alternative interpretations if ambiguous
- Supporting evidence from message
- Context-specific implications

{if replySuggestionsRequested}
REPLY SUGGESTIONS:
Generate 3-5 suggested replies:

Reply 1: Recommended approach
- Full reply text
- Why it works (3-5 bullet points)
- When to use this
- Rating (stars)

Reply 2: Alternative tone
- Full reply text
- Different approach/tone
- When this is better
- Rating

Reply 3: Another option
- Full reply text
- Different strategy
- Context for use
- Rating

Additional Advanced Replies (if applicable):
- If you want to test interest
- If you want to back off
- If you want more context
- If you want to be direct

Each reply should:
- Match relationship context
- Be authentic and natural
- Achieve specific communication goal
- Avoid common mistakes
- Consider power dynamics

{if redFlagsRequested}
RED FLAGS & WARNING SIGNS:
Identify:
- Manipulation tactics (gaslighting, guilt-tripping, etc.)
- Concerning communication patterns
- Dishonesty indicators
- Pressure or urgency tactics
- Boundary violations
- Disrespect or contempt markers
- Love bombing or excessive flattery
- Hot/cold behavior patterns

For Each Red Flag:
- Severity level (Low/Medium/High/Critical)
- Specific evidence in message
- Why this is concerning
- What it might indicate
- Pattern to watch for

Also Note:
- Green flags (positive signs)
- Context that might mitigate concerns
- Overall risk assessment

{if relationshipInsightsRequested}
RELATIONSHIP INSIGHTS (Dating/Personal):
Analyze:
- Interest level (percentage + meter visual)
- Enthusiasm indicators
- Commitment signals or lack thereof
- Pursuit balance (who's chasing whom)
- Communication effort level
- Future-oriented language
- Question asking (showing interest in you)

Provide:
- Interest meter (visual percentage)
- High interest signals (present/absent)
- Low interest signals (present/absent)
- Likely scenarios with probabilities
- Recommended actions
- What to watch for next
- Reality check guidance

{if professionalAnalysisRequested}
PROFESSIONAL COMMUNICATION ANALYSIS:
Evaluate:
- Professional tone appropriateness
- Passive-aggressive elements
- Power dynamics
- Directness vs diplomacy
- Constructiveness
- Boundary appropriateness
- Urgency level
- Action items implied

Rate:
- Professionalism (stars)
- Directness (stars)
- Passive-aggression (stars)
- Constructiveness (stars)

Provide:
- Context-appropriate interpretation
- Recommended professional response
- How to handle diplomatically
- Potential implications

{if scamDetectionRequested}
SCAM/PHISHING DETECTION:
Check for:
- Urgency tactics
- Suspicious links/attachments
- Impersonation attempts
- Request for sensitive info
- Grammar/spelling issues
- Too-good-to-be-true offers
- Pressure to act quickly
- Unusual sender information

Provide:
- Risk level (Low/Medium/High/Critical)
- Specific scam indicators
- Type of scam (phishing, smishing, etc.)
- Why each indicator is suspicious
- What legitimate message would have
- Recommended immediate actions
- How to verify legitimacy
- Reporting options

═══════════════════════════════════════
OUTPUT REQUIREMENTS
═══════════════════════════════════════

Structure your analysis clearly:

For each requested analysis type, provide:
1. Clear section header
2. Visual indicators where helpful
3. Specific evidence from message
4. Confidence levels
5. Context-aware interpretations
6. Actionable recommendations
7. User-friendly explanations

Be:
- Honest but tactful
- Specific and evidence-based
- Helpful and actionable
- Empathetic to user's concerns
- Clear about confidence levels
- Realistic about interpretations

Avoid:
- Sugarcoating when clarity needed
- Making user feel bad
- Overly technical jargon
- Absolute certainty (communication is nuanced)
- Judgment of either party

Remember:
- Users are anxious and seeking clarity
- They need honest but kind insights
- Specificity helps (quote exact phrases)
- Context matters enormously
- Multiple interpretations can exist
- Empower user to make informed decisions

Generate comprehensive, helpful analysis that gives the user clarity and confidence in their next steps.
```

=== SEO ARTICLE SECTION ===

Below the tool, comprehensive 3000-word article:

Title: "How to Analyze Messages and Texts: Complete Communication Guide"

H2: Why Message Analysis Matters
- Digital communication lacks tone cues
- Easy to misinterpret meaning
- High stakes in relationships and work
- Anxiety from unclear messages

H2: Understanding Message Tone
- What is tone in text communication
- Common tone types
- How to identify tone
- Tone vs intent
- Context matters

H2: Decoding Hidden Meaning
- Reading between the lines
- Subtext and implications
- What people don't say
- Cultural factors
- Gender communication differences

H2: Red Flags in Communication
- Manipulation tactics
- Gaslighting signs
- Love bombing patterns
- Hot and cold behavior
- Boundary violations
- When to be concerned

H2: Professional Email Analysis
- Passive-aggressive phrases
- Power dynamics in email
- Urgency vs importance
- Professional vs friendly
- How to respond professionally

H2: Dating Message Interpretation
- Interest level indicators
- Enthusiasm vs politeness
- Commitment language
- Who initiates and when
- Texting patterns and meaning
- When someone is interested vs polite

H2: Scam Detection
- Phishing red flags
- Common scam tactics
- Urgency manipulation
- Link safety
- How to verify legitimacy

H2: Reply Strategies
- When to respond
- Matching tone appropriately
- Setting boundaries
- Keeping or creating distance
- Professional responses
- Personal responses

H2: FAQs
- How do I know if someone likes me?
- What does it mean when they take long to respond?
- How do I know if I'm being manipulated?
- Should I trust my gut?
- What are the signs of a scam?
[30+ detailed FAQs]

=== SPECIAL FEATURES ===

1. **Analysis History** (Optional - User Controlled):
   - Save previous analyses
   - Compare messages from same person
   - Track communication patterns
   - User can delete anytime

2. **Pattern Recognition**:
   - Multiple messages from same person
   - Identify behavior patterns
   - Track consistency/inconsistency

3. **Conversation Thread Analysis**:
   - Analyze entire text thread
   - See pattern evolution
   - Interest level over time

4. **Quick Analysis Mode**:
   - One-click analysis
   - Fast tone detection
   - Brief summary format

5. **Export Analysis**:
   - PDF report
   - Show to friend for second opinion
   - Save for reference

6. **Privacy Controls**:
   - Auto-delete option
   - No-save mode
   - Clear all history button
   - Privacy dashboard

=== MARKETING ANGLES ===

**Landing Page Headlines to Test:**
- "What Does This Text Really Mean? Find Out Instantly"
- "Decode Any Message - 100% Private AI Analysis"
- "Stop Overthinking Messages - Get Instant Clarity"
- "Is This Person Interested in You? Analyze Their Text"
- "Detect Scams & Manipulation - Free Message Analyzer"

**Social Proof:**
- "See what people discovered about their messages"
- Before/after interpretations
- "This tool showed me he wasn't interested - saved me months"
- "Caught a phishing scam before I clicked the link"

**Privacy Messaging (Critical):**
- Prominent throughout site
- "Your messages never leave your browser"
- "Not even we can see what you analyze"
- "100% private, 100% secure"
- Trust badges and explanations

**Viral Loop:**
- After analysis: "Share this tool (not your analysis)"
- "Help your friends understand their messages too"
- Social sharing of tool link
- "Don't let your friends overthink texts"

=== WHY THIS WILL GO VIRAL ===

1. **Universal Problem**: Everyone gets confusing messages
2. **Emotional Stakes**: Relationships, jobs, safety
3. **Privacy Angle**: People won't use if not private
4. **Immediate Value**: Instant clarity
5. **Shareable**: "OMG you need to try this"
6. **Repeat Use**: Daily confusing messages
7. **Multiple Use Cases**: Dating, work, scams, family
8. **Anxiety Relief**: Reduces overthinking
9. **Decision Support**: Clear next steps
10. **Trust Building**: Accurate insights = word of mouth

Build this as THE message analysis tool that goes viral through word-of-mouth because it solves a massive, emotional, everyday problem with complete privacy.

```

---

## 🎯 MASSIVE OPPORTUNITY

This tool could become your most popular because:

✅ **Universal appeal** (everyone gets confusing messages)  
✅ **Emotional urgency** (relationship anxiety, work stress)  
✅ **Perfect for WebLLM** (privacy is ESSENTIAL)  
✅ **High return rate** (people need this constantly)  
✅ **Viral potential** ("you need to see what this said about his text!")  
✅ **Multiple use cases** (dating, work, scams, family)  

This isn't just another AI tool - this solves a deeply emotional problem that people struggle with daily. Combined with WebLLM's privacy advantage, this could be your breakout viral tool.
