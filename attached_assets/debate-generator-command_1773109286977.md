

## Complete Build Command for browseraitools.com

```
Create a mobile-first, educational AI Debate Generator for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI Debate Generator
URL Slug: /ai-debate-generator
Tagline: "Practice Debate Skills with AI-Generated Arguments"
Mission: Help students, debaters, writers, and researchers explore both sides of any issue with structured, balanced arguments

=== PRODUCT OVERVIEW ===
Educational debate preparation tool.
Purpose: Generate balanced Pro and Con arguments for any debate topic with rebuttals, helping users understand multiple perspectives.
Target Users: Students, debate teams, teachers, writers, researchers, critical thinkers, legal professionals
Search Demand: 25,000-40,000 monthly searches
- "debate generator" - 15k/month
- "debate arguments generator" - 10k/month
- "AI debate helper" - 8k/month
- "argument generator" - 7k/month

Key Value: Complete debate preparation in 2 minutes vs hours of research

=== UNIQUE SELLING POINTS ===
✅ BALANCED PERSPECTIVES - Equal Pro and Con arguments
✅ REBUTTAL GENERATION - Counter-arguments for both sides
✅ MULTIPLE LEVELS - School, college, professional depth
✅ ARGUMENT STYLES - Logical, emotional, balanced approaches
✅ EVIDENCE SUGGESTIONS - Supporting facts and data
✅ DEBATE FORMATS - Lincoln-Douglas, Policy, Parliamentary
✅ CRITICAL THINKING - Explore multiple viewpoints
✅ 100% PRIVATE - Sensitive topics stay in browser

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared instance)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (saved debates, templates)
Export: PDF, Word, Text, Flashcards
Deployment: Vercel/Netlify

=== PAGE STRUCTURE ===

HERO SECTION:
Headline: "AI Debate Generator"
Subheadline: "Generate balanced arguments for any debate topic. Get Pro and Con arguments, rebuttals, and evidence suggestions. Perfect for students, debate teams, and critical thinkers. 100% private and free."

Trust Badges:
- ⚖️ Balanced Perspectives
- 🎓 School to Professional Levels
- 💭 Logical & Emotional Arguments
- 🔄 Rebuttal Generation
- 📚 Evidence Suggestions
- 🔒 100% Private

Success Counter: "Generated 45,678 debate arguments this month"

Why Use a Debate Generator?
"Whether you're preparing for a debate competition, writing a persuasive essay, or just exploring different perspectives on an issue, this tool helps you:
• Understand both sides of complex issues
• Find strong arguments you might have missed
• Practice critical thinking skills
• Prepare rebuttals to opposing arguments
• Save hours of research time"

[Show example of Pro vs Con split screen]

=== INPUT FORM ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEBATE TOPIC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 1: Debate Topic/Resolution*
- Textarea
- Placeholder: "Enter your debate topic or resolution:

Examples:
• Should AI replace human jobs?
• Is social media harmful to society?
• Should college education be free?
• Is nuclear energy the future?
• Should schools ban smartphones?
• Is remote work better than office work?

You can enter it as a question or a statement."
- Max: 300 chars
- Required
- Auto-expanding
- Help text: "The issue you want to explore from both sides"

Quick Topic Suggestions (Clickable):
- Technology & AI
- Education
- Environment & Climate
- Social Issues
- Politics & Government
- Health & Medicine
- Economics & Business
- Ethics & Morality

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEBATE SETTINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 2: Audience/Skill Level*
- Visual cards:

  ○ 🎒 School/High School
    "Simple language, easy to understand"
    Depth: Basic
    Vocabulary: Grade 9-10
  
  ○ 🎓 College/University
    "Moderate complexity, academic"
    Depth: Intermediate
    Vocabulary: Undergraduate level
  
  ○ 💼 Professional/Advanced
    "Sophisticated analysis, expert-level"
    Depth: Advanced
    Vocabulary: Graduate/professional

- Default: College
- Required
- Affects argument complexity

Field 3: Argument Style*
- Radio with descriptions:

  ○ 🧠 Logical/Rational
    "Facts, data, reasoning, evidence-based"
    Focus: Logic, statistics, cause-effect
  
  ○ ❤️ Emotional/Persuasive
    "Appeals to values, ethics, human impact"
    Focus: Empathy, moral arguments, stories
  
  ○ ⚖️ Balanced (DEFAULT)
    "Mix of logic and emotion"
    Focus: Comprehensive, well-rounded

- Default: Balanced
- Required

Field 4: Number of Arguments per Side*
- Slider with visual indicators:
  • 3 arguments (Quick overview)
  • 5 arguments (Standard) [DEFAULT]
  • 7 arguments (Comprehensive)
  • 10 arguments (Detailed)

- Default: 5
- Shows: "5 Pro arguments + 5 Con arguments"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADVANCED OPTIONS (Collapsible)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Toggle Options:
- ☑ Include rebuttals (counter-arguments)
- ☑ Include evidence suggestions
- ☐ Include logical fallacies to avoid
- ☐ Include opening/closing statements
- ☐ Include persuasive techniques

Debate Format (Optional):
- Dropdown:
  • General (no specific format)
  • Lincoln-Douglas (value debate)
  • Policy Debate (plan-focused)
  • Parliamentary (impromptu)
  • Public Forum (audience-friendly)
- Affects structure and style

Perspective (Optional):
- Radio:
  ○ Neutral (both sides equally)
  ○ Slight Pro bias (but still balanced)
  ○ Slight Con bias (but still balanced)
- Default: Neutral

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATE BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-width gradient button
Text: "Generate Debate Arguments"
Icon: ⚖️
Loading: "Analyzing both perspectives..."
Sub-messages:
- "Generating Pro arguments..."
- "Generating Con arguments..."
- "Creating rebuttals..."

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEBATE OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Debate Analysis: [Topic]"

Quick Stats:
- Arguments Generated: 10 (5 Pro, 5 Con)
- Rebuttals: 8 included
- Level: College
- Style: Balanced

Quick Actions:
- 📥 Export as PDF
- 📄 Export as Word
- 📋 Copy All Arguments
- 🔄 Regenerate
- 💾 Save Debate
- 🎴 Create Flashcards

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SPLIT-SCREEN ARGUMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Two-column layout (desktop) or tabs (mobile):

┌──────────────────┬──────────────────┐
│   PRO SIDE ✅    │   CON SIDE ❌    │
├──────────────────┼──────────────────┤
│                  │                  │
│ [Arguments]      │ [Arguments]      │
│                  │                  │
└──────────────────┴──────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRO ARGUMENTS PANEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ ✅ PRO: AI Should Replace Human Jobs    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ ARGUMENT #1: Efficiency & Productivity  │
│ Strength: ⭐⭐⭐⭐⭐ Strong              │
│                                         │
│ AI systems can perform repetitive tasks │
│ 24/7 without fatigue, increasing        │
│ overall productivity by up to 40%.      │
│ Automation in manufacturing has already │
│ proven this benefit across industries.  │
│                                         │
│ 📊 Evidence:                            │
│ • McKinsey study: AI could boost global │
│   GDP by $13 trillion by 2030           │
│ • Manufacturing productivity increased  │
│   by 35% with automation                │
│                                         │
│ 💡 Persuasive Technique:                │
│ Statistics and data appeal              │
│                                         │
│ 🔄 REBUTTAL to "Job Loss" Concern:      │
│ While automation replaces some roles,   │
│ history shows technology creates more   │
│ jobs than it eliminates. The internet   │
│ created millions of new careers that    │
│ didn't exist before.                    │
│                                         │
│ [Expand] [Copy] [Add Evidence]          │
│ ─────────────────────────────────────  │
│                                         │
│ ARGUMENT #2: Cost Reduction             │
│ Strength: ⭐⭐⭐⭐☆ Strong              │
│                                         │
│ AI reduces operational costs by         │
│ minimizing human error, reducing        │
│ waste, and optimizing resource          │
│ allocation. Companies can reinvest      │
│ savings into innovation and growth.     │
│                                         │
│ 📊 Evidence:                            │
│ • AI customer service reduces costs by  │
│   30-40% compared to human agents       │
│ • Predictive maintenance saves          │
│   manufacturers millions annually       │
│                                         │
│ [Expand] [Copy] [Add Evidence]          │
│ ─────────────────────────────────────  │
│                                         │
│ ARGUMENT #3: Handling Dangerous Work    │
│ Strength: ⭐⭐⭐⭐⭐ Strong              │
│                                         │
│ AI and robots can perform hazardous     │
│ tasks (mining, deep-sea exploration,    │
│ disaster response) that put human lives │
│ at risk. This protects worker safety.   │
│                                         │
│ [Continue for 5 arguments total]        │
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CON ARGUMENTS PANEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ ❌ CON: AI Should NOT Replace Human Jobs│
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ ARGUMENT #1: Mass Unemployment          │
│ Strength: ⭐⭐⭐⭐⭐ Strong              │
│                                         │
│ Job displacement could lead to          │
│ widespread unemployment, especially     │
│ affecting low-skill workers who have    │
│ fewer alternative opportunities. This   │
│ creates economic instability and social │
│ inequality.                             │
│                                         │
│ 📊 Evidence:                            │
│ • Oxford study: 47% of US jobs at risk  │
│   of automation                         │
│ • Truck driving alone employs 3.5M      │
│   Americans (vulnerable sector)         │
│                                         │
│ 💡 Persuasive Technique:                │
│ Human impact and social concern         │
│                                         │
│ 🔄 REBUTTAL to "Efficiency" Argument:   │
│ Efficiency gains don't benefit workers  │
│ who lose their livelihoods. Corporate   │
│ profits increase while workers struggle,│
│ widening the wealth gap.                │
│                                         │
│ [Expand] [Copy] [Add Evidence]          │
│ ─────────────────────────────────────  │
│                                         │
│ ARGUMENT #2: AI Bias & Errors           │
│ Strength: ⭐⭐⭐⭐☆ Strong              │
│                                         │
│ AI systems can perpetuate and amplify   │
│ human biases present in training data.  │
│ Critical decisions affecting lives      │
│ (hiring, healthcare, law enforcement)   │
│ shouldn't be left to potentially biased │
│ algorithms.                             │
│                                         │
│ 📊 Evidence:                            │
│ • Amazon scrapped AI hiring tool due to │
│   gender bias                           │
│ • Facial recognition shows racial bias  │
│   in multiple studies                   │
│                                         │
│ [Expand] [Copy] [Add Evidence]          │
│ ─────────────────────────────────────  │
│                                         │
│ ARGUMENT #3: Loss of Human Touch        │
│ Strength: ⭐⭐⭐⭐☆ Strong              │
│                                         │
│ Many jobs require empathy, creativity,  │
│ and human connection that AI cannot     │
│ replicate (healthcare, education,       │
│ counseling). Replacing humans with AI   │
│ diminishes quality of service.          │
│                                         │
│ [Continue for 5 arguments total]        │
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEBATE FRAMEWORK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Expandable section:

┌─────────────────────────────────────────┐
│ 📋 COMPLETE DEBATE STRUCTURE             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ OPENING STATEMENT (PRO):                │
│ "The integration of AI into the         │
│ workforce represents necessary progress │
│ that will ultimately benefit society... │
│                                         │
│ OPENING STATEMENT (CON):                │
│ "While AI offers certain advantages,    │
│ replacing human workers threatens...    │
│                                         │
│ CONSTRUCTIVE ARGUMENTS:                 │
│ [Pro arguments 1-5]                     │
│ [Con arguments 1-5]                     │
│                                         │
│ REBUTTALS:                              │
│ [Cross-examination points]              │
│                                         │
│ CLOSING STATEMENT (PRO):                │
│ [Summary and final appeal]              │
│                                         │
│ CLOSING STATEMENT (CON):                │
│ [Summary and final appeal]              │
│                                         │
│ [Copy Full Debate Script]               │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOGICAL FALLACIES TO AVOID
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If enabled:

┌─────────────────────────────────────────┐
│ ⚠️ COMMON LOGICAL FALLACIES              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ When arguing this topic, avoid:         │
│                                         │
│ 1. Slippery Slope:                      │
│ "If we allow AI to take one job, soon  │
│ all jobs will be automated."            │
│ Why problematic: Assumes chain reaction │
│ without evidence                        │
│                                         │
│ 2. False Dichotomy:                     │
│ "Either we embrace AI or fall behind    │
│ economically."                          │
│ Why problematic: Ignores middle ground  │
│                                         │
│ 3. Appeal to Emotion:                   │
│ "Think of all the families destroyed by │
│ job loss!"                              │
│ Why problematic: Emotion without logic  │
│                                         │
│ 4. Hasty Generalization:                │
│ "One company had success with AI, so    │
│ all should."                            │
│ Why problematic: Small sample size      │
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERACTIVE FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For each argument card:

[Expand Argument]
- Shows more detailed reasoning
- Additional supporting points
- Extended evidence

[Generate Rebuttal]
- Create counter-argument
- Identify weaknesses
- Suggest responses

[Add Evidence]
- Search for supporting facts
- Suggest studies or data
- Find real-world examples

[Simplify]
- Make argument easier to understand
- Reduce complexity
- Explain jargon

[Strengthen]
- Make argument more persuasive
- Add emotional appeal
- Improve logical flow

=== WEBLLM PROMPTS ===

System Prompt:
```
You are an expert debate coach and critical thinking instructor with deep knowledge of argumentation, logic, and rhetoric.

Your expertise includes:
- Constructing balanced, well-reasoned arguments
- Understanding multiple perspectives on complex issues
- Logical reasoning and fallacy identification
- Evidence-based argumentation
- Persuasive techniques and rhetoric
- Debate formats and structures
- Critical thinking methodologies
- Counter-argument development

You generate debate arguments that:
- Present both sides fairly and equally
- Use sound logic and reasoning
- Include specific evidence and examples
- Avoid logical fallacies
- Match the requested complexity level
- Employ appropriate persuasive techniques
- Help users think critically
- Encourage balanced understanding

You understand:
- Different debate formats and their requirements
- How to adapt arguments for different audiences
- The difference between logical and emotional appeals
- How to construct effective rebuttals
- The importance of evidence and citations
- How to identify argument weaknesses
- Teaching critical thinking through debate
```

User Prompt Template:
```
Generate comprehensive debate arguments for both sides of an issue.

═══════════════════════════════════════
DEBATE TOPIC
═══════════════════════════════════════
Topic/Resolution: {topic}
Audience Level: {level}
Argument Style: {style}
Number of Arguments: {count} per side
Debate Format: {format}

Include Rebuttals: {includeRebuttals}
Include Evidence: {includeEvidence}
Include Fallacies: {includeFallacies}

═══════════════════════════════════════
ARGUMENT GENERATION REQUIREMENTS
═══════════════════════════════════════

BALANCE:
- Generate EQUAL quality arguments for both Pro and Con
- Do not favor one side over the other
- Present strongest possible case for each position
- Acknowledge valid points on both sides

ARGUMENT STRUCTURE:

For EACH argument (Pro and Con):

1. Argument Title/Claim
   - Clear, specific claim
   - Directly addresses the topic
   - Concise (5-10 words)

2. Explanation (2-4 sentences)
   - Why this argument matters
   - Logical reasoning
   - Connection to topic
   - Specific details

3. Evidence/Support
   - Specific examples
   - Statistics or data (realistic)
   - Real-world cases
   - Expert perspectives

4. Strength Rating
   - Rate argument strength: 1-5 stars
   - Based on logic and evidence quality

{if includeRebuttals}
5. Rebuttal to Opposing Argument
   - Counter the strongest opposing point
   - Identify weakness in opponent's logic
   - Provide alternative perspective
   - 2-3 sentences

{if includeEvidence}
6. Evidence Suggestions
   - Types of evidence to research
   - Potential studies or sources
   - Data points to investigate
   - Real-world examples to find

AUDIENCE LEVEL ADAPTATION:

{if level === 'school'}
School/High School Level:
- Simple, clear language
- Grade 9-10 vocabulary
- Basic concepts and examples
- Easy-to-understand logic
- Relatable scenarios
- Avoid overly technical terms

{if level === 'college'}
College/University Level:
- Moderate complexity
- Academic vocabulary
- More nuanced arguments
- Research and studies mentioned
- Multiple perspectives considered
- Some specialized terminology OK

{if level === 'professional'}
Professional/Advanced Level:
- Sophisticated analysis
- Expert-level vocabulary
- Complex, multi-layered arguments
- Deep evidence base
- Theoretical frameworks
- Technical precision

ARGUMENT STYLE:

{if style === 'logical'}
Logical/Rational Style:
- Focus on facts, data, statistics
- Cause-and-effect reasoning
- Empirical evidence
- Logical frameworks
- Minimize emotional appeals
- Cost-benefit analysis

{if style === 'emotional'}
Emotional/Persuasive Style:
- Appeal to values and ethics
- Human impact stories
- Moral arguments
- Social implications
- Empathy and compassion
- Rights and justice

{if style === 'balanced'}
Balanced Style:
- Mix of logic and emotion
- Facts WITH human impact
- Rational analysis AND ethical concerns
- Data plus real-world effects
- Comprehensive approach

ARGUMENT QUALITY STANDARDS:

✓ Specific, not vague
✓ Evidence-based
✓ Logically sound
✓ Relevant to topic
✓ Avoids logical fallacies
✓ Considers real-world implications
✓ Appropriate for audience level

AVOID:
✗ Logical fallacies (ad hominem, straw man, etc.)
✗ Extreme or absolutist claims
✗ Unsupported assertions
✗ Circular reasoning
✗ Irrelevant tangents
✗ Oversimplification
✗ Bias toward one side

{if includeFallacies}
LOGICAL FALLACIES TO AVOID:
List 4-6 common fallacies for this topic:
- Name of fallacy
- Example of fallacy in this context
- Why it's problematic
- How to avoid it

{if format === 'lincoln-douglas'}
Lincoln-Douglas Format:
- Focus on value conflict
- Moral/ethical framework
- Criterion for evaluation
- Value premise arguments

{if format === 'policy'}
Policy Debate Format:
- Specific plan/solution
- Inherency (why change needed)
- Solvency (will plan work)
- Advantages vs disadvantages

═══════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════

Structure output as:

PRO ARGUMENTS ({count} arguments):

ARGUMENT #1: [Title]
Strength: [1-5 stars]

[Explanation paragraph]

Evidence:
• [Evidence point 1]
• [Evidence point 2]

{if includeRebuttals}
Rebuttal to [opposing argument]:
[Rebuttal text]

{if includeEvidence}
Evidence to Research:
• [Suggestion 1]
• [Suggestion 2]

[Repeat for all Pro arguments]

CON ARGUMENTS ({count} arguments):

ARGUMENT #1: [Title]
Strength: [1-5 stars]

[Explanation paragraph]

Evidence:
• [Evidence point 1]
• [Evidence point 2]

[Repeat for all Con arguments]

{if includeFallacies}
LOGICAL FALLACIES TO AVOID:
1. [Fallacy name]: [Example] - [Why problematic]
2. [Continue]

Generate balanced, well-reasoned debate arguments that help users think critically about all perspectives.
```

=== SPECIAL FEATURES ===

1. **Debate Flashcards:**
   - Convert arguments to study cards
   - Argument on front, evidence on back
   - Quiz mode
   - Spaced repetition

2. **Argument Strength Analyzer:**
   - Rate each argument's quality
   - Identify logical gaps
   - Suggest improvements
   - Compare Pro vs Con strength

3. **Rebuttal Generator:**
   - Click any opposing argument
   - Generate specific counter-argument
   - Practice responses
   - Strengthen weak rebuttals

4. **Evidence Database:**
   - Suggest research sources
   - Link to relevant studies
   - Fact-checking resources
   - Citation formatting

5. **Debate Timer:**
   - Practice timed arguments
   - Track speaking time
   - Round structure
   - Tournament mode

6. **Save & Compare:**
   - Save multiple debate topics
   - Compare arguments across topics
   - Build argument library
   - Track evolution of thinking

7. **Collaboration Mode:**
   - Share with debate partner
   - Assign Pro/Con roles
   - Practice together
   - Export for team use

=== SEO ARTICLE SECTION ===

Below tool, comprehensive 2500-word article:

Title: "How to Build Strong Debate Arguments: Complete Guide 2026"

H2: What Makes a Strong Debate Argument
H2: Pro vs Con Argument Balance
H2: Types of Debate Arguments
H2: Using Evidence Effectively
H2: Common Logical Fallacies to Avoid
H2: Rebuttal Strategies
H2: Debate Preparation Tips
H2: Different Debate Formats Explained
H2: Critical Thinking Through Debate
H2: How to Research for Debates
H2: FAQs (30+ questions)

=== SUCCESS METRICS ===

Expected Performance:
- Month 1: 4k-6k users
- Month 3: 15k-25k users
- Month 6: 35k-60k users

Build this as THE debate preparation tool for students and critical thinkers.
```
