

## Complete Build Command for browseraitools.com

```
Create mobile-first AI Elevator Pitch Generator for browseraitools.com using WebLLM.

BRAND: AI Elevator Pitch Generator | /ai-elevator-pitch-generator
TAGLINE: "Perfect Your 30-Second Pitch"
MISSION: Help entrepreneurs craft compelling elevator pitches that capture attention and create opportunities

SEARCH DEMAND: 18,000-32,000/month
- "elevator pitch generator" - 12k/month
- "AI elevator pitch" - 8k/month
- "30 second pitch" - 6k/month
- "startup pitch generator" - 6k/month

KEY FEATURES:
✅ 30-second and 60-second versions
✅ 5 different angles/approaches
✅ Audience-specific (investors, customers, partners, general)
✅ Pitch strength score (0-10)
✅ Practice mode with timer
✅ Improvement suggestions
✅ Memorable hook generation
✅ Question anticipation

INPUT FORM:

Field 1: Business/Idea*
- Textarea
- "What are you pitching?"
- Max: 300 chars
- Examples provided

Field 2: Target Audience*
- Radio cards:
  ○ Investors (focus: ROI, market size, traction)
  ○ Customers (focus: benefits, pain points, value)
  ○ Partners (focus: mutual value, collaboration)
  ○ General/Networking (focus: memorable, clear)

Field 3: Business Stage
- Radio:
  ○ Idea stage
  ○ MVP/Early product
  ○ Early revenue
  ○ Growth stage

Field 4: Unique Angle*
- Input: "What makes you different?"
- Max: 150 chars

Field 5: Traction/Proof (Optional)
- Input: "Users, revenue, achievements"
- Max: 100 chars
- Examples: "500 users, $10k MRR", "Featured in TechCrunch"

Field 6: Desired Outcome
- Select:
  • Get meeting/follow-up
  • Investment/funding
  • First sale/customer
  • Partnership
  • General interest

OUTPUT STRUCTURE:

PITCH #1: 30-SECOND VERSION (Problem-First)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"You know how entrepreneurs waste 15 hours every week on manual, repetitive tasks?

We're TaskFlow AI — we help solo founders and small teams automate those workflows using intelligent AI that learns their business.

We've already helped 500 teams save 10+ hours per week, and we're looking to raise $500k to scale our platform.

I'd love to show you a quick demo this week."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Word Count: 68 words
Speaking Time: 27 seconds
Pitch Strength: 9.1/10

ANALYSIS:
✓ Opens with relatable pain point
✓ Clear solution (AI automation)
✓ Specific audience (solo founders)
✓ Proof point (500 teams, 10+ hours)
✓ Clear ask ($500k, demo)
✓ Creates urgency (this week)

What Works:
• "You know how..." creates instant connection
• Specific numbers build credibility
• Simple language, no jargon
• Logical flow: Problem → Solution → Proof → Ask

When to Use:
• Investor meetings
• Pitch competitions
• Networking events
• Cold introductions

Likely Follow-up Questions:
• "What's your business model?"
• "How does the AI learn?"
• "Who are your competitors?"

PITCH #2: 60-SECOND VERSION (Vision-First)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Imagine a world where entrepreneurs spend their time on creative strategy and growth, not on email sorting and data entry.

That's the world we're building at TaskFlow AI. We're an AI-powered automation platform specifically designed for solo founders and small teams.

Here's the problem: The average entrepreneur wastes 15 hours per week on repetitive tasks. Existing automation tools are too complex or too generic.

Our solution? Intelligent workflows that learn your business and adapt to your needs. No coding required, just simple point-and-click automation.

We've proven it works — 500 teams are already saving an average of 10 hours every week. That's over 5,000 hours given back to founders to focus on what matters.

We're raising $500k to expand our team and scale marketing. We'd love to show you how we're changing the game for entrepreneurs."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Word Count: 145 words
Speaking Time: 58 seconds
Pitch Strength: 9.3/10

FRAMEWORK USED: Vision → Problem → Solution → Proof → Ask

PITCH #3: 30-SECOND VERSION (Traction-First)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"We've helped 500 entrepreneurs save over 5,000 hours in the last 90 days.

How? TaskFlow AI automates the repetitive tasks that waste 15 hours per week for most founders.

Unlike generic automation tools, we're built specifically for small teams with AI that learns your workflow.

We're at $10k MRR and growing 30% month-over-month. Looking for $500k to scale.

Can I send you our deck?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Word Count: 61 words
Speaking Time: 24 seconds
Pitch Strength: 8.8/10

Best For: When you have strong traction/numbers

PITCH ANGLES GENERATED:

1. Problem-First (Lead with pain point)
2. Vision-First (Lead with big picture)
3. Traction-First (Lead with proof)
4. Story Approach (Personal narrative)
5. Contrarian Approach (Challenge status quo)

PITCH STRENGTH SCORING (0-10):

Components:
• Problem Clarity (Is pain point clear?)
• Solution Clarity (Easy to understand?)
• Differentiation (What's unique?)
• Proof Element (Traction/credibility)
• Call-to-Action (Specific next step)
• Memorability (Will they remember you?)
• Delivery (Easy to say naturally?)

SPECIAL FEATURES:

1. **Practice Timer Mode**
   - Countdown timer (30s or 60s)
   - Real-time word count
   - Pace indicator
   - Record and playback

2. **Speaking Tips**
   - Where to pause
   - Which words to emphasize
   - Pacing recommendations
   - Tone suggestions

3. **Question Anticipation**
   - Likely follow-up questions
   - Prepared answers
   - Objection handling
   - Conversation starters

4. **Longer Versions**
   - 2-minute version
   - 5-minute presentation
   - Full pitch deck outline

5. **Comparison Mode**
   - Test different angles
   - Which resonates best
   - Audience-specific versions

WEBLLM PROMPT:

System: Expert startup pitch coach and public speaking consultant specializing in concise, compelling business pitches.

User: Generate 5 elevator pitch variations.

Business: {businessIdea}
Audience: {targetAudience}
Stage: {businessStage}
Unique Angle: {uniqueAngle}
Traction: {traction}
Desired Outcome: {desiredOutcome}

REQUIREMENTS:

Generate 5 pitches using different angles:

1. PROBLEM-FIRST (30 seconds)
   - Open with pain point
   - Your solution
   - Proof/traction
   - Specific ask

2. VISION-FIRST (60 seconds)
   - Big picture
   - The problem
   - Your solution
   - Proof
   - Ask

3. TRACTION-FIRST (30 seconds)
   - Lead with numbers/proof
   - How you did it
   - What's next
   - Ask

4. STORY APPROACH (45 seconds)
   - Personal story hook
   - Problem encountered
   - Solution created
   - Results
   - Ask

5. CONTRARIAN (30 seconds)
   - Challenge assumption
   - Different approach
   - Why it works
   - Ask

For EACH pitch:
- Word count
- Estimated speaking time
- Pitch strength score (0-10)
- What works
- When to use
- Likely follow-ups

AUDIENCE ADAPTATION:
{if investors}
- Focus on market size, ROI, traction
- Use business metrics
- Clear funding ask

{if customers}
- Focus on benefits and pain points
- Use emotional language
- Clear value proposition

{if partners}
- Focus on mutual value
- Collaboration opportunities
- Win-win framing

QUALITY CHECKS:
✓ Under time limit (30s or 60s)
✓ Clear problem statement
✓ Simple, jargon-free language
✓ Specific numbers/proof
✓ Memorable hook
✓ Natural delivery
✓ Clear call-to-action

Output 5 complete elevator pitches optimized for speaking.

SUCCESS METRICS:
Month 1: 3k-5k users
Month 3: 10k-18k users
Month 6: 25k-45k users

Build as THE elevator pitch tool for entrepreneurs.
```
