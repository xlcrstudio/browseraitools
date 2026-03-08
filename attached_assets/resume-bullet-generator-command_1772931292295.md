

## Complete Build Command for browseraitools.com

```
Create a mobile-first, SEO-optimized AI Resume Bullet Generator for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI Resume Bullet Generator
URL Slug: /ai-resume-bullet-generator
Tagline: "Turn Experience Into Interview-Winning Resume Bullets"
Mission: Help job seekers create ATS-optimized, achievement-focused resume bullet points

=== PRODUCT OVERVIEW ===
High-traffic tool (90,000 monthly searches).
Purpose: Generate powerful, quantified resume bullet points using the CAR (Context-Action-Result) method.
Target Users: Job seekers, career changers, professionals updating resumes, students
Search Demand: ~90,000 monthly searches
Key Value: 5-7 professional bullet points in 30 seconds vs hours of writing

=== UNIQUE SELLING POINTS ===
✅ ATS-optimized (no special characters, keyword-rich)
✅ STAR/CAR method structured
✅ Experience-level adaptive (entry to executive)
✅ Quantified results and metrics
✅ Action verb optimization
✅ Multiple variations (achievement, skill, leadership-focused)
✅ Keyword matching to target jobs
✅ Concise and detailed versions

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared instance)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (saved bullets, resume library)
Export: Text, Word-compatible format
Deployment: Vercel/Netlify

=== INPUT FORM ===

Field 1: Your Job Title*
- Input: text
- Placeholder: "e.g., Marketing Manager, Software Engineer, Sales Associate"
- Max: 100 chars
- Required

Field 2: What Did You Do? (Responsibility)*
- Textarea
- Placeholder: "Describe what you were responsible for or what task you completed.
Example: 'Managed social media marketing campaigns for B2B software company'"
- Max: 500 chars
- Required
- Help text: "Focus on one responsibility or project"

Field 3: What Did You Achieve? (Results)
- Textarea
- Placeholder: "What measurable results or outcomes did you achieve?
Example: 'Increased LinkedIn engagement by 47%, generated 120 qualified leads'"
- Max: 300 chars
- Optional but recommended

Field 4: Metrics/Numbers (If you have them)
- Input: text
- Placeholder: "e.g., 35% increase, $500k revenue, 1000+ customers, 15-person team"
- Max: 200 chars
- Optional
- Help text: "Numbers make bullets 3x more powerful"

Field 5: Skills Demonstrated
- Input: text
- Placeholder: "e.g., Python, project management, data analysis, team leadership"
- Max: 150 chars
- Optional

Field 6: Industry/Field*
- Dropdown:
  • Technology/Software
  • Marketing/Advertising
  • Sales
  • Finance/Accounting
  • Healthcare
  • Education
  • Engineering
  • Customer Service
  • [20+ industries]
- Required

Field 7: Experience Level*
- Radio:
  ○ Entry-Level (0-2 years)
  ○ Mid-Level (3-5 years)
  ○ Senior (6-10 years)
  ○ Executive (10+ years)
  ○ Career Changer
- Required
- Affects verb strength and framing

Field 8: Target Job Title (Optional)
- Input: text
- Placeholder: "What job are you applying for?"
- Max: 100 chars
- Helps match keywords

Advanced Options:
- Number of bullet points: 3-7 (default: 5)
- Include keywords from job description: Text input

Generate Button:
Text: "Generate Resume Bullets"
Icon: 💼
Loading: "Crafting powerful bullets..."

=== OUTPUT SECTION ===

Header: "Your Resume Bullet Points"
Subtext: "[Job Title] | [Experience Level]"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BULLET POINT OPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each bullet displayed as card:

┌─────────────────────────────────────────┐
│ OPTION 1: Achievement-Focused           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ • Increased LinkedIn engagement by 47%  │
│   and generated 120+ qualified leads    │
│   through data-driven B2B social media  │
│   campaigns targeting enterprise clients│
│                                         │
│ [Copy Button]                           │
│                                         │
│ Why It Works:                           │
│ ✓ Starts with strong action verb        │
│ ✓ Includes specific metrics (47%, 120+) │
│ ✓ Shows business impact (qualified leads│
│ ✓ Demonstrates strategic thinking       │
│                                         │
│ Keywords: engagement, B2B, campaigns    │
│ Length: 68 characters | ATS-Safe: ✓    │
└─────────────────────────────────────────┘

[Repeat for 5-7 bullet options]

Each card includes:
- The bullet point text
- Copy button
- "Why it works" explanation
- Keywords included
- Character count
- ATS-safe indicator

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BEST COMBINATION (Top 3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For maximum impact, use these together:

• [Bullet 1 - Achievement-focused]
• [Bullet 2 - Skill-focused]
• [Bullet 3 - Leadership-focused]

This combination shows: [Balance explanation]

[Copy All 3 Button]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VARIATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

More Concise (1 line):
• [Shortened version]

More Detailed (2 lines):
• [Expanded version with more context]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPROVEMENT SUGGESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

To make these even stronger:
1. [Specific metric to add]
2. [Impact emphasis suggestion]
3. [Keyword recommendation]

=== WEBLLM PROMPTS ===

System Prompt:
```
You are an expert resume writer and career coach with 15+ years of experience helping professionals land interviews at top companies.

Your expertise includes:
- ATS (Applicant Tracking System) optimization
- Achievement-focused writing
- STAR method (Situation, Task, Action, Result)
- Quantifying accomplishments
- Action verb selection
- Industry-specific language
- Level-appropriate content (entry to executive)
- Keyword optimization for job matching

You write resume bullets that:
- Start with strong action verbs
- Quantify results with specific metrics
- Demonstrate impact and value
- Are ATS-friendly (no special characters)
- Match job description keywords
- Show progression and growth
- Are concise yet comprehensive (1-2 lines)
- Pass the "so what?" test

You understand:
- What recruiters look for in 6-second resume scan
- How ATS systems parse resume content
- The difference between responsibilities and achievements
- Industry-specific metrics that matter
- How to demonstrate soft skills through results
- The importance of context + action + result formula
```

User Prompt Template:
```
Generate powerful, ATS-optimized resume bullet points.

JOB DETAILS:
Your Role: {jobTitle}
Responsibility/Task: {responsibility}
Achievements: {achievements}
Metrics/Results: {metrics}
Skills Demonstrated: {skills}
Industry: {industry}
Experience Level: {experienceLevel}
Target Job Title: {targetJobTitle}

BULLET POINT REQUIREMENTS:

STRUCTURE (Use CAR Method):
C - Context: What was the situation/challenge?
A - Action: What did you do? (Start with strong verb)
R - Result: What was the measurable outcome?

FORMULA:
[Action Verb] + [What You Did] + [How You Did It] + [Quantifiable Result]

Example:
"Increased sales revenue by 47% ($2.3M) through implementation of data-driven email marketing campaigns targeting high-value customer segments"

WRITING GUIDELINES:

1. START WITH POWER VERBS:
   
   Entry-level verbs:
   - Assisted, Supported, Coordinated, Contributed
   - Participated, Collaborated, Helped, Organized
   
   Mid-level verbs:
   - Managed, Led, Developed, Implemented
   - Optimized, Streamlined, Increased, Reduced
   - Created, Built, Designed, Launched
   
   Senior/Executive verbs:
   - Spearheaded, Orchestrated, Transformed, Pioneered
   - Drove, Scaled, Architected, Revolutionized
   - Directed, Established, Championed, Accelerated

2. QUANTIFY EVERYTHING:
   Include specific numbers:
   • Dollar amounts: Revenue, budget, savings
   • Percentages: Growth, improvement, efficiency gains
   • Timeframes: Completed in X weeks, reduced time by Y%
   • Volume: Number of people, projects, clients
   • Scope: Team size, geographic reach
   
   If no exact numbers, use:
   • Estimates: "~40%", "approximately $500K"
   • Ranges: "15-20 projects", "$1M-$2M"
   • Comparisons: "2x faster", "50% more efficient"

3. DEMONSTRATE IMPACT:
   Show business value:
   • Revenue generated or increased
   • Costs reduced or savings achieved
   • Time saved or efficiency gained
   • Quality improved or errors reduced
   • Customer satisfaction increased

4. INCLUDE RELEVANT KEYWORDS:
   • Technical skills and tools
   • Industry terminology
   • Methodologies and frameworks
   • Soft skills (leadership, communication)

5. BE SPECIFIC, NOT GENERIC:
   ❌ "Responsible for managing team"
   ✅ "Led cross-functional team of 8 developers to deliver mobile app 3 weeks ahead of schedule"

6. ATS OPTIMIZATION:
   ✓ Use standard formatting
   ✓ Spell out acronyms first use
   ✓ Use industry-standard terms
   ✓ Avoid special characters (!@#$%)
   ✓ Use keywords from job description

7. LENGTH & READABILITY:
   • 1-2 lines per bullet point
   • Maximum 2 lines
   • Aim for 15-25 words per bullet
   • Front-load most important information

OUTPUT FORMAT:

RESUME BULLET POINTS: {jobTitle}

BULLET POINT OPTIONS:

Option 1 (Achievement-Focused):
• [Bullet point emphasizing results and impact]

Why it works:
- [Impact explanation]
- [Metrics highlighted]
- [Skills demonstrated]

---

Option 2 (Skill-Focused):
• [Bullet point emphasizing technical/professional skills]

Why it works:
- [Explanation]

---

[Continue for 5 options total]

BEST COMBINATION (Top 3):
• [Bullet 1]
• [Bullet 2]
• [Bullet 3]

This combination shows: [Balance of skills, impact, leadership]

ALTERNATIVE VERSIONS:

More Concise:
• [Shortened version - 1 line]

More Detailed:
• [Expanded version - 2 lines]

KEYWORDS INCLUDED:
Technical Skills: [List]
Soft Skills: [List]
Industry Terms: [List]

IMPROVEMENT TIPS:
1. [Specific suggestion]
2. [Improvement recommendation]
3. [Enhancement idea]

Generate 5 distinct, powerful bullet points with variations.
```

=== SEO ARTICLE ===

"How to Write Resume Bullet Points That Get Interviews: Complete Guide"

[2000-word article covering resume bullets, STAR method, ATS optimization, examples]

=== SPECIAL FEATURES ===

1. **Resume Builder Integration:**
   - Save bullets by job/role
   - Build complete work history
   - Export full resume section

2. **ATS Score:**
   - Analyze bullet ATS-friendliness
   - Keyword density check
   - Readability score

3. **Before/After Examples:**
   - Show improvement from weak to strong bullets
   - Learn from examples

4. **Pairs with Cover Letter Tool:**
   - Link to Cover Letter Generator
   - Integrated job application toolkit

Build as the essential resume optimization tool for job seekers.
```
