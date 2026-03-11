

## Complete Build Command for browseraitools.com

```
Create mobile-first AI Bullet Points Generator for browseraitools.com using WebLLM.

BRAND: AI Bullet Points Generator | /ai-bullet-points-generator
TAGLINE: "Convert Text Into Clear Bullet Lists"  
MISSION: Transform paragraphs into scannable, organized bullet point lists

SEARCH DEMAND: 30,000-50,000/month
- "bullet points generator" - 18k/month
- "AI bullet points generator" - 12k/month
- "text to bullet points" - 12k/month
- "create bullet list" - 8k/month

KEY FEATURES:
✅ 4 bullet styles (key points, steps, pros/cons, summary)
✅ Icon options (✓, →, •, ★, numbers)
✅ Nested bullets (sub-points)
✅ Formatting options
✅ Markdown export
✅ Copy as HTML

TWO-COLUMN LAYOUT:
┌─────────────────────┬─────────────────────┐
│ PARAGRAPH TEXT      │ BULLET POINTS       │
│                     │                     │
│ [Input]             │ [AI Output]         │
└─────────────────────┴─────────────────────┘

INPUT FORM:

Field 1: Text to Convert*
- Textarea
- Placeholder: "Remote work offers flexibility and reduces commuting time. Employees can work from anywhere, improving work-life balance and increasing productivity..."
- Max: 2,000 chars
- [Load Example]

Field 2: Bullet Style*
- Radio cards:
  ○ Key Points (main takeaways)
  ○ Step-by-Step (sequential)
  ○ Pros and Cons (comparison)
  ○ Summary Bullets (overview) [DEFAULT]

Field 3: Icon Style
- Radio:
  ○ Checkmarks (✓)
  ○ Arrows (→)
  ○ Dots (•) [DEFAULT]
  ○ Stars (★)
  ○ Numbers (1, 2, 3...)

Field 4: Include Sub-Points
- Toggle: YES/NO
- Default: YES

GENERATE BUTTON:
"Generate Bullet Points" | Icon: 📋

OUTPUT STRUCTURE:

┌─────────────────────────────────────────┐
│ 📋 BULLET POINTS                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Benefits of Remote Work                 │
│                                         │
│ • Flexible work schedules               │
│ • No commuting required                 │
│ • Work from anywhere in the world       │
│ • Better work-life balance              │
│ • Increased productivity                │
│ • Cost savings (no travel expenses)     │
│ • More time with family                 │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ WITH NESTED BULLETS:                    │
│                                         │
│ Benefits of Remote Work                 │
│                                         │
│ • Flexibility                           │
│   → Choose your own hours               │
│   → Adapt schedule to personal needs    │
│   → Balance work with life priorities   │
│                                         │
│ • Location Independence                 │
│   → Work from home                      │
│   → Work while traveling                │
│   → No geographic constraints           │
│                                         │
│ • Productivity Improvements             │
│   → Fewer office distractions           │
│   → Comfortable personal environment    │
│   → Focus during peak energy hours      │
│                                         │
│ • Cost Savings                          │
│   → No commute expenses                 │
│   → Reduced professional wardrobe costs │
│   → Less money on meals out             │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ PROS & CONS FORMAT:                     │
│                                         │
│ Remote Work Analysis                    │
│                                         │
│ ✅ PROS:                                │
│ • Flexible schedules                    │
│ • No commute time                       │
│ • Work from anywhere                    │
│ • Better work-life balance              │
│ • Increased productivity                │
│ • Cost savings                          │
│                                         │
│ ❌ CONS:                                │
│ • Less social interaction               │
│ • Potential isolation                   │
│ • Communication challenges              │
│ • Home distractions                     │
│ • Work-life boundary blur               │
│ • Technology dependencies               │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ STEP-BY-STEP FORMAT:                    │
│                                         │
│ How to Start Working Remotely           │
│                                         │
│ 1. Discuss with your employer           │
│    → Present benefits and your plan     │
│    → Propose trial period               │
│                                         │
│ 2. Set up home workspace                │
│    → Dedicated work area                │
│    → Reliable internet connection       │
│    → Proper equipment                   │
│                                         │
│ 3. Establish routine                    │
│    → Set regular work hours             │
│    → Create daily schedule              │
│    → Build healthy habits               │
│                                         │
│ [📋 Copy] [🔄 Change Style] [📥 Export] │
└─────────────────────────────────────────┘

FORMATTING OPTIONS:

[Show Formatting Panel]

Export as:
• Plain Text
• Markdown
• HTML
• Google Docs format
• Notion format
• Copy to Clipboard

Icon Styles Available:
• • Dots (default)
• ✓ Checkmarks
• → Arrows  
• ★ Stars
• 1. Numbers
• ► Triangles

WEBLLM PROMPT:

System: Expert content organizer specializing in information architecture and scannable formatting.

User: Convert this text into bullet points: {text}

Style: {bulletStyle}

{if keyPoints}
- Extract main ideas
- 5-8 bullets
- Most important first

{if stepByStep}
- Sequential order
- Numbered or ordered
- Action-oriented
- Clear progression

{if prosAndCons}
- Balanced positive/negative
- Equal number each side
- Objective analysis

{if summary}
- Comprehensive overview
- All key information
- Organized logically

Sub-points: {includeSubPoints}
- Add nested bullets for detail
- 2-3 sub-points per main point
- Indented for hierarchy

Output:
1. Title/header
2. Bullet list (formatted with {icon})
3. Nested version (if requested)
4. Alternative format
5. Markdown version for export

Generate clear, scannable bullet points.

SUCCESS METRICS:
Month 1: 5k-8k users
Month 3: 18k-30k users
Month 6: 42k-70k users

Build as THE bullet points generator for content creators.
```
