

## Complete Build Command for browseraitools.com

```
Create mobile-first AI Sentence Expander for browseraitools.com using WebLLM.

BRAND: AI Sentence Expander | /ai-sentence-expander
TAGLINE: "Turn Short Sentences Into Detailed Writing"
MISSION: Help writers expand brief ideas into comprehensive, detailed sentences with context and examples

SEARCH DEMAND: 20,000-35,000/month
- "sentence expander" - 12k/month
- "AI sentence expander" - 8k/month
- "expand sentence" - 10k/month
- "make sentence longer" - 5k/month

KEY FEATURES:
✅ 3 expansion levels (slight, paragraph, detailed)
✅ Optional examples inclusion
✅ Context addition
✅ Detail enhancement
✅ Length tracking (2x, 5x, 10x)
✅ Before/after comparison
✅ Multiple variations
✅ Educational explanations

TWO-COLUMN LAYOUT:
┌─────────────────────┬─────────────────────┐
│ SHORT SENTENCE      │ EXPANDED VERSION    │
│                     │                     │
│ [Input]             │ [AI Output]         │
└─────────────────────┴─────────────────────┘

INPUT FORM:

Field 1: Short Sentence*
- Input text
- Placeholder: "AI improves productivity."
- Max: 200 chars
- [Load Example] button

Field 2: Expansion Level*
- Visual slider:
  ○ Slightly Longer (2-3x length)
  ○ Paragraph Expansion (full paragraph) [DEFAULT]
  ○ Detailed Explanation (comprehensive)

Field 3: Enhancement Options
- Checkboxes:
  ☑ Include Examples
  ☑ Add Context
  ☐ Include Statistics
  ☐ Add Expert Perspective

GENERATE BUTTON:
"Expand Sentence" | Icon: 📝

OUTPUT STRUCTURE:

┌─────────────────────────────────────────┐
│ ✨ EXPANDED SENTENCE                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Artificial intelligence significantly   │
│ improves productivity by automating     │
│ repetitive tasks, analyzing large       │
│ datasets quickly, and helping           │
│ professionals focus on higher-value     │
│ work. For example, AI tools can         │
│ schedule meetings, summarize documents, │
│ and analyze customer data—saving teams  │
│ 10+ hours per week.                     │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 📊 EXPANSION ANALYSIS                    │
│                                         │
│ Original: 4 words, 24 characters        │
│ Expanded: 56 words, 356 characters      │
│ Length Increase: 14x longer             │
│                                         │
│ What Was Added:                         │
│ ✓ Specific benefits (automation,        │
│   analysis, focus)                      │
│ ✓ Concrete examples (meetings,          │
│   documents, data)                      │
│ ✓ Quantifiable result (10+ hours)       │
│ ✓ Context (professionals, teams)        │
│ ✓ Explanation of how (by automating...) │
│                                         │
│ Enhancement Breakdown:                  │
│ • Context: "by automating repetitive    │
│   tasks..."                             │
│ • Examples: "schedule meetings,         │
│   summarize documents"                  │
│ • Statistics: "10+ hours per week"      │
│ • Specificity: From vague to concrete   │
│                                         │
│ [📋 Copy] [🔄 Expand More] [📉 Shorten] │
└─────────────────────────────────────────┘

ALTERNATIVE EXPANSIONS:

Version 2 (Different Angle):
"AI-powered tools boost workplace productivity by taking over time-consuming manual processes. These systems excel at pattern recognition and data processing, enabling workers to shift their attention from routine operations to strategic thinking and creative problem-solving."

Version 3 (With Statistics):
"Organizations implementing AI see productivity gains of 30-40%. AI improves efficiency by handling data analysis 100x faster than humans, reducing errors, and freeing employees to focus on complex decision-making rather than repetitive tasks."

[Copy All Versions]

EXPANSION TECHNIQUES USED:

1. Method Explanation ("by automating...")
2. Concrete Examples ("schedule meetings")
3. Quantification ("10+ hours")
4. Beneficiary Clarification ("professionals")
5. Outcome Specification ("focus on higher-value work")

WEBLLM PROMPT:

System: Expert writing coach specializing in expansion, elaboration, and detailed explanation.

User: Expand this sentence: {sentence}

Level: {expansionLevel}

{if slight}
- 2-3x longer
- Add one supporting detail
- Keep concise

{if paragraph}
- Full paragraph (50-80 words)
- Add context, examples, explanation
- Comprehensive but focused

{if detailed}
- Thorough explanation (100+ words)
- Multiple examples
- Statistics if requested
- Expert perspective
- Full context

Options: {includeExamples, addContext, includeStats}

Generate:
1. Primary expanded version
2. Alternative expansion (different angle)
3. Third variation (with statistics if applicable)
4. Breakdown of what was added
5. Expansion technique analysis

Output natural, detailed expansion ready to use.

SUCCESS METRICS:
Month 1: 3k-5k users
Month 3: 12k-21k users
Month 6: 28k-49k users

Build as THE sentence expander for writers.
```
