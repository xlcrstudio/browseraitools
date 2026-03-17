

## Complete Build Command for browseraitools.com

```
Create a mobile-first, education-focused AI Sentence Simplifier for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI Sentence Simplifier
URL Slug: /ai-sentence-simplifier
Tagline: "Make Complex Sentences Easy to Understand"
Mission: Help students, ESL learners, and readers understand complex sentences by simplifying them while preserving meaning

=== PRODUCT OVERVIEW ===
Educational writing tool.
Purpose: Simplify complex sentences into easy-to-understand language with step-by-step explanations of changes made.
Target Users: Students, ESL learners, readers, educators, technical writers, accessibility professionals
Search Demand: 25,000-45,000 monthly searches
- "sentence simplifier" - 15k/month
- "AI sentence simplifier" - 10k/month
- "simplify complex sentences" - 8k/month
- "ELI5 generator" - 12k/month

Key Value: Understand complex text in 5 seconds vs struggling for minutes

=== UNIQUE SELLING POINTS ===
✅ 3 SIMPLIFICATION LEVELS - Slight, moderate, ELI5
✅ STEP-BY-STEP BREAKDOWN - See exactly what changed
✅ VOCABULARY LEARNING - Definitions of complex words
✅ READABILITY SCORING - Before/after comparison
✅ PERFECT FOR ESL - Learn English better
✅ STUDENT-FRIENDLY - Academic text made easy
✅ PRESERVES MEANING - Same message, simpler words
✅ EDUCATIONAL - Learn as you simplify

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared instance)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (history, vocabulary list)
Export: Text, PDF, Flashcards
Deployment: Vercel/Netlify

=== PAGE STRUCTURE ===

HERO SECTION:
Headline: "AI Sentence Simplifier"
Subheadline: "Simplify complex sentences into easy-to-understand language. Perfect for students, ESL learners, and anyone who wants clear writing. Get step-by-step explanations of changes. Free and 100% private."

Trust Badges:
- 📚 3 Simplification Levels
- 📝 Step-by-Step Breakdown
- 📖 Vocabulary Learning
- 📊 Readability Scoring
- 🌍 Perfect for ESL Learners
- 🔒 Runs in Your Browser

Success Counter: "Simplified 567,890 sentences this month"

Why Simplify Sentences?
"Complex writing excludes people. Simple writing includes everyone.

This tool helps you:
• Understand difficult text
• Learn new vocabulary
• Improve reading comprehension
• Study complex subjects
• Write more clearly
• Communicate better"

[Show before/after example]

=== INPUT FORM ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UNIVERSAL TWO-COLUMN LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────┬─────────────────────┐
│ COMPLEX SENTENCE    │ SIMPLIFIED VERSION  │
│                     │                     │
│ [Textarea]          │ [Output Display]    │
│                     │                     │
└─────────────────────┴─────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INPUT PANEL (LEFT SIDE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 1: Complex Sentence*
- Textarea
- Placeholder: "Paste complex sentence here...

Examples:
• 'The utilization of sophisticated algorithms facilitates efficient data analysis.'
• 'The implementation of comprehensive cybersecurity protocols is paramount for organizational resilience.'
• 'Notwithstanding the aforementioned considerations, subsequent developments necessitate reevaluation.'"
- Min: 10 chars
- Max: 500 chars
- Required
- Auto-expanding
- Shows character count

[Load Example] button

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SETTINGS PANEL (ABOVE INPUT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 2: Simplification Level*
- Visual slider with labels:

  Slight ←──●──────────→ ELI5
  
  Positions:
  • Slightly Simpler (keep some sophistication)
  • Moderately Simpler (balance) [DEFAULT]
  • Very Simple - ELI5 (explain like I'm 5)

- Default: Moderately Simpler
- Required
- Visual examples below slider

Examples shown:
• Slight: "Advanced algorithms help analyze data efficiently"
• Moderate: "Smart computer programs help study information quickly"
• ELI5: "Special computer helpers look at information and find answers fast"

Field 3: Show Explanations
- Toggle: ON/OFF
- Default: ON
- When ON: Shows step-by-step breakdown

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATE BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-width gradient button
Text: "Simplify Sentence"
Icon: 📚
Loading: "Simplifying..."

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT PANEL (RIGHT SIDE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ ✨ SIMPLIFIED SENTENCE                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Advanced algorithms help analyze data   │
│ more efficiently.                       │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 📊 READABILITY ANALYSIS                  │
│                                         │
│ Original: Grade 14 (College Level)      │
│ Simplified: Grade 8 (Middle School)     │
│ Improvement: ⬇️ 43% Easier to Read      │
│                                         │
│ Reading Time:                           │
│ Original: 8 seconds                     │
│ Simplified: 5 seconds                   │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 📝 STEP-BY-STEP BREAKDOWN               │
│                                         │
│ What Changed:                           │
│                                         │
│ 1. "utilization" → "use"                │
│    Reason: Simpler, more common word    │
│    Level: Basic vocabulary              │
│                                         │
│ 2. "sophisticated algorithms" →         │
│    "advanced algorithms"                │
│    Reason: "Advanced" is clearer        │
│    Level: More accessible               │
│                                         │
│ 3. "facilitates" → "helps"              │
│    Reason: Common verb everyone knows   │
│    Level: Everyday language             │
│                                         │
│ 4. "efficient data analysis" →          │
│    "analyze data efficiently"           │
│    Reason: Active voice, clearer action │
│    Level: Simpler structure             │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 📖 VOCABULARY LEARNED                    │
│                                         │
│ Complex Words Explained:                │
│                                         │
│ "utilization" (noun)                    │
│ Definition: The act of using something  │
│ Simple form: use, usage                 │
│ Example: "The utilization of solar      │
│ energy" = "The use of solar energy"     │
│                                         │
│ "facilitates" (verb)                    │
│ Definition: Makes something easier      │
│ Simple form: helps, enables, allows     │
│ Example: "Technology facilitates        │
│ communication" = "Technology helps      │
│ communication"                          │
│                                         │
│ "sophisticated" (adjective)             │
│ Definition: Complex and advanced        │
│ Simple form: advanced, complex, smart   │
│ Example: "Sophisticated technology" =   │
│ "Advanced technology"                   │
│                                         │
│ [💾 Save to Vocabulary List]            │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 💡 WHY THIS SIMPLIFICATION WORKS        │
│                                         │
│ ✓ Uses common, everyday words           │
│ ✓ Active voice (clearer action)         │
│ ✓ Shorter, more direct phrasing         │
│ ✓ Preserves complete meaning            │
│ ✓ Easier for non-native speakers        │
│ ✓ More accessible to all readers        │
│                                         │
│ [📋 Copy] [🔄 Simplify More] [⬆️ Expand]│
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALTERNATIVE SIMPLIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Expandable section:

[Show Other Ways to Say This]

┌─────────────────────────────────────────┐
│ ALTERNATIVE #1:                         │
│ "Smart computer programs help study     │
│ information quickly."                   │
│                                         │
│ Grade Level: 6                          │
│ Best for: Young students, basic English │
│ [Copy]                                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ ALTERNATIVE #2 (ELI5):                  │
│ "Special computer helpers look at       │
│ numbers and find answers really fast."  │
│                                         │
│ Grade Level: 3                          │
│ Best for: Children, complete beginners  │
│ [Copy]                                  │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LEARNING FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 📚 VOCABULARY BUILDER                    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ You've learned 3 new words today!       │
│                                         │
│ Your Vocabulary List (Last 10):         │
│ • utilization → use                     │
│ • facilitates → helps                   │
│ • sophisticated → advanced              │
│                                         │
│ [📥 Download Flashcards]                │
│ [📧 Email Me Daily Words]               │
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LEARNING TIPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Expandable section:

💡 HOW TO USE THIS TOOL TO LEARN:

For Students:
• Paste complex sentences from textbooks
• Study the simplified version first
• Review the step-by-step breakdown
• Learn the vocabulary definitions
• Save words to your vocabulary list

For ESL Learners:
• Compare original vs. simplified
• See which words are difficult
• Learn common replacements
• Build your vocabulary gradually
• Practice with easier versions

For Better Writing:
• See how experts simplify
• Learn to use active voice
• Understand word choice
• Recognize unnecessary complexity
• Apply to your own writing

When to Simplify:
✓ Reading academic papers
✓ Understanding legal documents
✓ Learning technical subjects
✓ Studying for tests
✓ Improving comprehension
✓ Writing for wider audiences

=== SPECIAL FEATURES ===

1. **Vocabulary Flashcards:**
   - Auto-generate flashcards
   - Export to Anki/Quizlet
   - Track learned words
   - Spaced repetition

2. **Reading Level Detector:**
   - Automatic grade level
   - Flesch-Kincaid score
   - Complexity analysis
   - Improvement suggestions

3. **Word-by-Word Mode:**
   - Click any complex word
   - Get instant definition
   - See simpler alternatives
   - Learn contextually

4. **Progressive Simplification:**
   - Start slight
   - Simplify more if needed
   - Three levels in sequence
   - Find right balance

5. **Comparison View:**
   - Side-by-side comparison
   - Highlight changes
   - Color-coded differences
   - Easy to understand

6. **Sentence Library:**
   - Save difficult sentences
   - Build personal collection
   - Review anytime
   - Track progress

7. **Audio Pronunciation:**
   - Hear simplified version
   - Practice pronunciation
   - ESL-friendly
   - Natural speech

=== WEBLLM PROMPTS ===

System Prompt:
```
You are an expert educator and plain language specialist focused on making complex language accessible to all readers.

Your expertise includes:
- Plain language writing principles
- Vocabulary simplification
- Readability optimization
- ESL/EFL teaching methods
- Active voice conversion
- Clear communication

You simplify sentences that:
- Preserve exact meaning
- Use common, everyday words
- Follow active voice when possible
- Are appropriate for target level
- Remain grammatically correct
- Sound natural and fluent

You understand:
- Different reading levels (ELI5, middle school, high school, college)
- Common vs. sophisticated vocabulary
- When to use simpler synonyms
- How to maintain meaning while simplifying
- ESL learner challenges
- Educational value of step-by-step explanations
```

User Prompt Template:
```
Simplify this complex sentence.

ORIGINAL SENTENCE:
{complexSentence}

SIMPLIFICATION LEVEL: {level}

{if level === 'slight'}
TARGET: High school reading level
- Keep some sophistication
- Use accessible but educated vocabulary
- Minor simplifications only
- Maintain professional tone

{if level === 'moderate'}
TARGET: Middle school reading level (Grade 8)
- Replace complex words with common words
- Use simple sentence structures
- Active voice preferred
- Clear and direct

{if level === 'ELI5'}
TARGET: Elementary school (Grade 3-5)
- Explain like I'm 5 years old
- Very simple words only
- Short sentences
- Concrete examples
- No jargon whatsoever

REQUIREMENTS:

1. SIMPLIFIED SENTENCE:
   - Same meaning as original
   - Appropriate for target level
   - Natural and fluent
   - Grammatically perfect

2. STEP-BY-STEP BREAKDOWN:
   For each change made:
   - Show original phrase → simplified phrase
   - Explain why changed
   - Note reading level impact

3. VOCABULARY DEFINITIONS:
   For complex words replaced:
   - Word and part of speech
   - Simple definition
   - Simpler alternatives
   - Example sentence showing usage

4. READABILITY ANALYSIS:
   - Original grade level
   - Simplified grade level
   - Percentage improvement
   - Reading time estimate

5. WHY IT WORKS:
   - List 3-5 improvements made
   - Explain accessibility benefits
   - Note who benefits most

GENERATE:
- 1 primary simplified sentence
- 2 alternative simplifications (different levels)
- Complete breakdown and analysis
- Vocabulary learning section

Output complete, educational simplification ready to learn from.
```

=== SUCCESS METRICS ===

Expected Performance:
- Month 1: 4k-7k users
- Month 3: 15k-27k users
- Month 6: 35k-63k users

High retention - students return frequently for study help.

Build as THE sentence simplifier for students and ESL learners.
```
