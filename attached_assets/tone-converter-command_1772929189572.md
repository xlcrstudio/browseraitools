
## Complete Build Command for browseraitools.com

```
Create a mobile-first, SEO-optimized AI Tone Converter for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI Tone Converter
URL Slug: /ai-tone-converter
Tagline: "Perfect Your Message Tone Instantly"
Mission: Help professionals and writers adapt their message tone for any audience or context

=== PRODUCT OVERVIEW ===
High-traffic tool (70,000 monthly searches).
Purpose: Convert text between different tones while preserving core message and meaning.
Target Users: Professionals, writers, marketers, students, customer service, communicators
Search Demand: ~70,000 monthly searches
Key Value: Perfect tone in 10 seconds vs rewriting from scratch

=== UNIQUE SELLING POINTS ===
✅ 10+ tone options (professional, casual, friendly, formal, persuasive, etc.)
✅ Preserves core message and facts
✅ Shows what changed (before/after comparison)
✅ Multiple variations per tone
✅ Usage notes and context suggestions
✅ Audience fit analysis
✅ Preserve length option
✅ Side-by-side comparison view

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared instance)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (saved conversions, history)
Export: Text, comparison view
Deployment: Vercel/Netlify

=== PAGE STRUCTURE ===

HERO SECTION:
Headline: "AI Tone Converter"
Subheadline: "Transform your message tone instantly. Convert between professional, casual, friendly, formal, and more. Perfect for emails, messages, and any written communication. Free and private."
Trust Badges:
- 🎭 10+ Tone Options
- 💬 Preserves Your Message
- 🔄 Before/After Comparison
- ✍️ Natural-Sounding Results
- 📊 Usage Guidance
- 🔒 100% Private

Success Counter: "Converted 45,678 messages this month"

=== INPUT FORM ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR TEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 1: Text to Convert*
- Large textarea (auto-expanding)
- Placeholder: "Paste or type your text here. Examples:
  
  Email: 'Hey! Just wanted to check in on that report. When do you think you'll have it done?'
  
  Message: 'I can't make it to the meeting tomorrow.'
  
  Text: 'This idea won't work and here's why...'
  
The tool will convert it to your target tone while keeping the meaning."
- Max: 2000 chars
- Required
- Character counter shown
- Help text: "Enter the text you want to convert"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TONE SELECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 2: Current Tone (Optional)
- Dropdown:
  • Auto-Detect (AI detects current tone)
  • Neutral
  • Casual
  • Professional
  • Informal
  • Formal
  • Direct
  • Passive
  • Emotional
  • Detached
- Default: Auto-Detect
- Optional
- Help text: "What tone does your text currently have?"

Field 3: Target Tone*
- Large pills/cards with descriptions:

  ○ Professional
    "Clear, respectful, business-appropriate"
    Example: Emails to colleagues, business communication
  
  ○ Casual
    "Relaxed, conversational, friendly"
    Example: Messages to friends, informal emails
  
  ○ Friendly
    "Warm, approachable, positive"
    Example: Customer service, networking
  
  ○ Formal
    "Traditional, diplomatic, official"
    Example: Legal, academic, executive communication
  
  ○ Persuasive
    "Compelling, convincing, action-oriented"
    Example: Sales, proposals, requests
  
  ○ Empathetic
    "Understanding, supportive, compassionate"
    Example: Apologies, sensitive topics, support
  
  ○ Confident
    "Assertive, definitive, authoritative"
    Example: Leadership, expertise, decision-making
  
  ○ Apologetic
    "Remorseful, accountable, solution-focused"
    Example: Mistakes, delays, service issues
  
  ○ Enthusiastic
    "Energetic, positive, exciting"
    Example: Announcements, celebrations, motivation
  
  ○ Direct
    "Straightforward, concise, clear"
    Example: Instructions, urgent messages, clarity needed

- Required
- Shows example use cases for each

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTEXT (Optional)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 4: Purpose
- Input: text
- Placeholder: "e.g., Declining a meeting, Requesting feedback, Following up on proposal"
- Max: 100 chars
- Optional
- Help text: "Why are you sending this message?"

Field 5: Audience
- Input: text
- Placeholder: "e.g., Boss, Client, Friend, Customer, Team member"
- Max: 50 chars
- Optional
- Help text: "Who will read this?"

Field 6: Preserve Length
- Toggle switch
- Default: OFF
- Labels: 
  - ON: "Keep similar length"
  - OFF: "Adjust length as needed for tone"
- Help text: "Some tones naturally need more/fewer words"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADVANCED OPTIONS (Collapsible)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Generate alternative version: Toggle (default: ON)
- Show detailed comparison: Toggle (default: ON)
- Maintain key phrases: Text input (comma-separated phrases to keep)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONVERT BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-width gradient button
Text: "Convert Tone"
Icon: 🎭
Loading: "Converting to {targetTone} tone..."
Disabled if no text entered

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONVERTED TEXT DISPLAY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Header:
"Your Text in {Target Tone} Tone"

View Options:
- Side-by-Side View (original | converted)
- Converted Only (clean view)
- Comparison View (highlighted changes)

Action Buttons:
- Copy Converted Text
- Download as Text File
- Save Conversion (to history)
- Try Different Tone
- Regenerate

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MAIN CONVERTED TEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Clean display of converted text]

Example output for "Professional" tone:

Original (Casual):
"Hey! Just wanted to check in on that report. When do you think you'll have it done?"

Converted (Professional):
"Hello,

I wanted to follow up regarding the status of the report we discussed. Could you please provide an estimated completion date at your earliest convenience?

Thank you for your time."

[Copy Button]

Character count: Original 87 → Converted 156

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT CHANGED (Analysis)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Expandable section showing detailed comparison:

🔄 Key Changes:

Vocabulary Adjustments:
• "Hey!" → "Hello,"
  Explanation: More formal greeting
  
• "check in on" → "follow up regarding"
  Explanation: Professional business language
  
• "When do you think you'll have it done?" → "Could you please provide an estimated completion date"
  Explanation: Respectful request format, removes casual phrasing

Sentence Structure:
• Added paragraph break for readability
• Changed question format to polite request
• Added formal closing

Formality Changes:
• Removed exclamation points
• Added "please" and "thank you"
• Used complete, formal sentences
• Increased word count for courtesy

Tone Indicators:
✓ Original tone: Casual, direct, friendly
✓ New tone: Professional, respectful, courteous
✓ Message preserved: Yes - still requesting report status
✓ Appropriate for: Business emails, manager communication

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALTERNATIVE VERSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Hi there,

I hope this message finds you well. I'm writing to inquire about the progress on the report we've been working on. Would you be able to share an expected timeline for completion?

I appreciate your attention to this matter.

Best regards"

Character count: 198

Why This Version:
• Slightly warmer while still professional
• Good for established relationships
• More conversational than first version

When to Use:
• When you know the person well
• Less formal corporate cultures
• Ongoing projects with regular contact

[Copy Alternative]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USAGE NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Best Used For:
• Business emails to supervisors
• Client communication
• Professional requests
• Formal follow-ups

👥 Audience Fit:
• Colleagues you don't know well
• Management and executives
• Clients and customers
• External stakeholders

⚠️ May Need Adjustment If:
• Relationship is very casual
• Company culture is extremely informal
• Message is time-sensitive (can be more direct)
• You want to show more personality

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIDE-BY-SIDE COMPARISON (Toggle View)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────────────┬──────────────────┐
│ ORIGINAL         │ PROFESSIONAL     │
├──────────────────┼──────────────────┤
│ Hey!             │ Hello,           │
│                  │                  │
│ Just wanted to   │ I wanted to      │
│ check in on that │ follow up        │
│ report.          │ regarding the    │
│                  │ status of the    │
│ When do you      │ report we        │
│ think you'll     │ discussed.       │
│ have it done?    │                  │
│                  │ Could you please │
│                  │ provide an       │
│                  │ estimated        │
│                  │ completion date? │
│                  │                  │
│                  │ Thank you.       │
└──────────────────┴──────────────────┘

Differences highlighted:
- Green = Added
- Red = Removed
- Yellow = Modified

=== TONE EXAMPLES & COMPARISONS ===

Show example conversions for each tone:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TONE COMPARISON EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Original: "I can't make it to the meeting tomorrow."

🎩 Formal:
"I regret to inform you that I will be unable to attend tomorrow's scheduled meeting. Please accept my apologies for any inconvenience this may cause."

💼 Professional:
"I won't be able to attend the meeting tomorrow. I apologize for the short notice and any inconvenience."

😊 Friendly:
"Hey! Unfortunately I won't be able to make tomorrow's meeting. Sorry about that! Let me know if there's anything I can catch up on afterward."

🤝 Casual:
"Can't make it tomorrow, sorry! Mind filling me in on what I miss?"

😔 Apologetic:
"I'm really sorry, but I won't be able to attend the meeting tomorrow. I take full responsibility for not giving more notice. Is there any way I can make it up to the team?"

💪 Confident:
"I won't be attending tomorrow's meeting. I'll review the notes and follow up on any action items that require my input."

❤️ Empathetic:
"I understand this may be inconvenient, but unfortunately I'm unable to attend tomorrow's meeting. I really appreciate your understanding, and I'm happy to catch up afterward."

[Try These Examples] - Click to load into tool

=== WEBLLM PROMPTS ===

System Prompt:
```
You are an expert communication specialist and professional writer who understands how tone shapes meaning and perception.

Your expertise includes:
- Tone analysis and adaptation
- Business communication best practices
- Emotional intelligence in writing
- Audience-appropriate language
- Cultural and contextual sensitivity
- Voice preservation while shifting tone
- Register shifting (formal to casual and vice versa)
- Persuasive and diplomatic language

You convert text between tones while:
- Maintaining the core message and meaning
- Preserving key information and facts
- Adapting vocabulary appropriately
- Adjusting sentence structure and complexity
- Changing emotional coloring
- Keeping or removing jargon as needed
- Ensuring natural, authentic voice
- Avoiding awkward or forced language

You understand:
- Professional vs casual communication contexts
- When formality matters (job apps, proposals)
- When casualness builds connection (marketing, social)
- How tone affects persuasiveness
- Cultural norms in business communication
- The spectrum from aggressive to diplomatic
- How punctuation and formatting affect tone
```

User Prompt Template:
```
Convert the tone of the provided text while preserving its core message.

═══════════════════════════════════════
ORIGINAL TEXT
═══════════════════════════════════════
{originalText}

═══════════════════════════════════════
CONVERSION DETAILS
═══════════════════════════════════════
Current Tone: {currentTone}
Target Tone: {targetTone}
Purpose: {purpose}
Audience: {audience}
Preserve Length: {preserveLength}

═══════════════════════════════════════
TONE CONVERSION GUIDELINES
═══════════════════════════════════════

TONE CHARACTERISTICS:

PROFESSIONAL TONE:
• Formal but not stiff
• Clear and direct
• Respectful and courteous
• Industry-appropriate terminology
• Complete sentences
• Minimal contractions
• Polite formulations ("I would appreciate...")
• Objective language
Examples:
- "I would like to request..."
- "Please find attached..."
- "I am writing to inquire..."

CASUAL TONE:
• Conversational and relaxed
• Contractions welcome (don't, won't, can't)
• Simple, everyday language
• Shorter sentences
• Can use "you" and "I"
• Friendly but still respectful
• Avoid jargon unless audience-appropriate
Examples:
- "Hey, just wanted to check..."
- "No worries!"
- "Let me know if you need anything"

FRIENDLY TONE:
• Warm and approachable
• Positive language
• Personal touches
• Encouragement and support
• Empathetic phrasing
• Smiles in words (without being fake)
• Build rapport
Examples:
- "I'd be happy to help with that!"
- "Great question - here's what I think..."
- "Thanks so much for reaching out!"

FORMAL TONE:
• Highly professional
• Traditional business language
• Complete, complex sentences
• No contractions
• Respectful titles and forms of address
• Objective, impersonal when appropriate
• Diplomatic phrasing
Examples:
- "I am writing to formally request..."
- "It would be appreciated if you could..."
- "Please accept my sincere apologies..."

PERSUASIVE TONE:
• Compelling and convincing
• Benefit-focused language
• Active voice
• Confident but not pushy
• Use of social proof or authority
• Clear value proposition
• Strategic word choice
• Call-to-action
Examples:
- "Imagine what you could achieve..."
- "Join thousands who have already..."
- "Don't miss this opportunity to..."

EMPATHETIC TONE:
• Understanding and compassionate
• Acknowledge feelings/concerns
• Validate experiences
• Supportive language
• "I understand" phrasing
• Gentle, kind word choice
• Show you care
Examples:
- "I completely understand how frustrating that must be..."
- "That sounds really challenging..."
- "You're absolutely right to feel concerned about..."

CONFIDENT TONE:
• Assertive but not arrogant
• Definitive statements
• Strong action verbs
• Remove hedging language ("maybe", "kind of")
• Expertise evident
• Direct and clear
Examples:
- "I can solve this issue by..."
- "The best approach is..."
- "I recommend we proceed with..."

APOLOGETIC TONE:
• Genuine remorse
• Take ownership/responsibility
• Avoid defensive language
• Explain without excusing
• Offer solution/next steps
• Sincere, not perfunctory
Examples:
- "I sincerely apologize for..."
- "This was entirely my mistake..."
- "I take full responsibility and will ensure..."

ENTHUSIASTIC TONE:
• Energetic and excited
• Positive, upbeat language
• Exclamation points (used judiciously)
• Power words (amazing, incredible, fantastic)
• Show genuine excitement
• Infectious positivity
Examples:
- "I'm so excited to share this with you!"
- "This is absolutely fantastic news!"
- "Can't wait to get started on this!"

DIRECT TONE:
• Clear and to the point
• No fluff or filler
• Short sentences
• Simple language
• Action-oriented
• Efficient communication
Examples:
- "Here's what we need to do:"
- "The answer is no."
- "Please send by Friday."

CONVERSION RULES:

1. PRESERVE CORE MESSAGE:
   ✓ Don't change facts or key information
   ✓ Keep the main point clear
   ✓ Maintain logical structure
   ✓ Don't add or remove important details

2. ADJUST VOCABULARY:
   • Formal → Professional: Use industry terms
   • Casual → Professional: Remove slang
   • Professional → Casual: Simplify jargon
   • Adjust formality of verbs and nouns

3. SENTENCE STRUCTURE:
   • Formal: Longer, complex sentences
   • Casual: Shorter, simpler sentences
   • Professional: Clear, direct sentences
   • Persuasive: Varied lengths for rhythm

4. PERSONAL PRONOUNS:
   • Formal: Minimize "I" and "you"
   • Casual/Friendly: Use "I" and "you" freely
   • Professional: Balanced use

5. FORMATTING:
   • Contractions: Use in casual, avoid in formal
   • Punctuation: Exclamations in enthusiastic, minimal in formal
   • Capitalization: Standard in professional

6. LENGTH CONSIDERATION:
   {preserveLength ? `
   • Match approximate length of original
   • Same number of sentences roughly
   • Don't pad or cut significantly
   ` : `
   • Adjust length as needed for tone
   • Some tones naturally require more/fewer words
   • Prioritize natural sound over exact length
   `}

═══════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════

TONE CONVERSION: {targetTone.toUpperCase()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONVERTED TEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Complete converted text in {targetTone} tone]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT CHANGED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Key Tone Shifts:
• [Specific change 1]: "original phrase" → "new phrase"
• [Specific change 2]: "original phrase" → "new phrase"
• [Specific change 3]: "original phrase" → "new phrase"

Vocabulary Adjustments:
• Formality level: [Increased/Decreased/Maintained]
• Sentence complexity: [Simplified/Elaborated/Similar]
• Personal pronouns: [Added/Removed/Adjusted]
• Contractions: [Added/Removed]

Tone Indicators:
• Original tone felt: [Description]
• New tone achieves: [Description]
• Appropriate for: [Use cases]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALTERNATIVE VERSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Slightly different take on same tone conversion]

Why this version:
[When to use this alternative]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USAGE NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Best Used For:
• [Context 1]
• [Context 2]
• [Context 3]

Audience Fit:
• [Audience description]

May Need Adjustment If:
• [Specific scenario requiring tweak]

Provide natural, authentic tone conversion that sounds human-written.
```

=== SEO ARTICLE SECTION ===

Below the tool, comprehensive 2000-word article:

Title: "How to Adjust Your Writing Tone: Complete Communication Guide"

[Full article covering tone in writing, when to use each tone, professional communication, etc.]

=== SPECIAL FEATURES ===

1. **Tone Comparison Tool:**
   - Show same text in multiple tones
   - Compare side-by-side
   - Choose best option

2. **Conversion History:**
   - Save recent conversions
   - Quick reload previous texts
   - Learn from past adjustments

3. **Tone Templates:**
   - Pre-built examples for common scenarios
   - Email templates
   - Message templates
   - Document templates

4. **Batch Conversion:**
   - Convert multiple messages at once
   - Consistent tone across documents
   - Bulk email processing

Build this as the essential tone adjustment tool for professional communicators.
```
