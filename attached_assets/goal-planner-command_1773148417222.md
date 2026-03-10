
## Complete Build Command for browseraitools.com

```
Create a mobile-first, goal-achievement focused AI Goal Planner for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI Goal Planner
URL Slug: /ai-goal-planner
Tagline: "Turn Ambitions Into Step-by-Step Action Plans"
Mission: Help users achieve big goals by breaking them into realistic milestones, monthly phases, and weekly actions

=== PRODUCT OVERVIEW ===
Strategic goal achievement tool.
Purpose: Transform ambitious goals into structured roadmaps with milestones, timelines, action steps, and progress tracking.
Target Users: Entrepreneurs, students, professionals, life-changers, anyone with big goals
Search Demand: 25,000-45,000 monthly searches
- "goal planner" - 18k/month
- "AI goal planner" - 10k/month
- "goal roadmap generator" - 8k/month
- "achieve goals planner" - 9k/month

Key Value: Complete goal roadmap in 3 minutes vs weeks of planning

=== UNIQUE SELLING POINTS ===
✅ MILESTONE BREAKDOWN - Big goals → Achievable phases
✅ TIME-BASED ROADMAP - 3, 6, 12 month planning
✅ WEEKLY ACTION STEPS - Know what to do each week
✅ PROGRESS TRACKING - Visual milestone completion
✅ OBSTACLE IDENTIFICATION - Anticipate and plan for challenges
✅ RESOURCE PLANNING - Tools, skills, budget needed
✅ MOTIVATION SYSTEM - Celebrate wins, stay motivated
✅ MULTIPLE GOAL TYPES - Career, business, health, personal

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared instance)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (saved goals, progress tracking)
Export: PDF, Notion, Trello, Markdown
Deployment: Vercel/Netlify

=== PAGE STRUCTURE ===

HERO SECTION:
Headline: "AI Goal Planner"
Subheadline: "Turn any ambition into a step-by-step roadmap. Get milestones, timelines, and weekly actions for achieving your biggest goals. From dream to reality. Free and instant."

Trust Badges:
- 🎯 Milestone Breakdown
- 📅 3, 6, 12 Month Roadmaps
- 📝 Weekly Action Plans
- 📊 Progress Tracking
- 🚀 Success Strategies
- 🔒 100% Private

Success Counter: "Planned 67,890 life-changing goals this month"

Why Use a Goal Planner?
"Big goals are overwhelming without a plan.

This tool helps you:
• Break massive goals into small steps
• See the clear path from here to there
• Know exactly what to do each week
• Stay motivated with milestone celebrations
• Anticipate and overcome obstacles
• Actually achieve what you set out to do"

[Show example: Big goal → Milestone roadmap]

=== INPUT FORM ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR GOAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 1: What's Your Goal?*
- Textarea (large)
- Placeholder: "Describe your goal in detail:

Examples:
• Start an online business selling handmade jewelry
• Lose 30 pounds and run a 5K
• Learn web development and get a tech job
• Write and publish my first book
• Save $10,000 for a down payment
• Build an audience of 10,000 followers
• Get promoted to senior manager
• Launch a successful podcast

Be specific! The more detail, the better the plan."
- Max: 500 chars
- Required
- Auto-expanding
- Help text: "What do you want to achieve?"

Quick Goal Examples (Clickable):
- 💼 Career Advancement
- 🚀 Start a Business
- 💪 Health & Fitness
- 📚 Learn New Skill
- 💰 Financial Goal
- 🎨 Creative Project
- 🏠 Life Milestone

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TIMEFRAME & TYPE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 2: Timeframe*
- Visual cards:

  ○ ⚡ 3 Months (Quarter)
    "Short-term sprint, focused push"
    Milestones: Monthly
    Actions: Weekly
  
  ○ 📅 6 Months (Half Year)
    "Balanced timeline for significant change" [DEFAULT]
    Milestones: Bi-monthly
    Actions: Weekly
  
  ○ 📆 1 Year (Annual)
    "Major transformation, sustained effort"
    Milestones: Quarterly
    Actions: Weekly
  
  ○ 🎯 Custom
    "Set your own timeline"
    Input: [___] months

- Default: 6 Months
- Required
- Affects milestone structure

Field 3: Goal Type*
- Visual category cards:

  ○ 💼 Career
    "Job change, promotion, skills"
  
  ○ 🚀 Business/Entrepreneurship
    "Start business, grow revenue, launch product"
  
  ○ 💪 Health & Fitness
    "Weight loss, muscle gain, habits"
  
  ○ 📚 Learning/Education
    "New skill, certification, degree"
  
  ○ 💰 Financial
    "Save money, pay debt, invest"
  
  ○ 🎨 Creative
    "Write book, create art, build project"
  
  ○ 👥 Relationships
    "Family, social, networking"
  
  ○ 🌱 Personal Growth
    "Mindset, habits, self-improvement"

- Default: Business
- Required
- Affects strategies and advice

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURRENT SITUATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 4: Starting Point
- Textarea
- Placeholder: "Where are you starting from?

Examples:
• 'Complete beginner, no experience'
• 'Have basic knowledge, took one course'
• 'Currently employed, want to transition'
• 'Tried before but didn't finish'
• 'Have $2,000 saved already'

This helps create a realistic plan."
- Max: 300 chars
- Optional but recommended
- Affects difficulty and timeline

Field 5: Available Time per Week
- Slider: 2-40 hours/week
- Default: 10 hours
- Visual indicator:
  - 2-5 hours: "Part-time commitment"
  - 5-10 hours: "Solid weekly progress"
  - 10-20 hours: "Serious dedication"
  - 20-40 hours: "Full-time focus"
- Affects milestone pacing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONSTRAINTS & RESOURCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 6: Budget (Optional)
- Input: number
- Placeholder: "e.g., $500, $5000"
- Optional
- Currency: $
- Help text: "Budget available for this goal (tools, courses, etc.)"

Field 7: Constraints (Optional)
- Textarea
- Placeholder: "Any limitations or challenges?
e.g., 'Full-time job', 'Limited budget', 'No prior experience', 'Family commitments'"
- Max: 200 chars
- Optional
- Helps create realistic plan

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADVANCED OPTIONS (Collapsible)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Include in Plan:
- Checkboxes:
  ☑ Milestone celebrations (stay motivated)
  ☑ Obstacle planning (anticipate challenges)
  ☑ Resource recommendations (tools, courses)
  ☑ Skill development needs
  ☑ Accountability checkpoints
  ☐ Budget breakdown
  ☐ Networking/mentorship suggestions

Planning Style:
- Radio:
  ○ Aggressive (Fast-paced, ambitious)
  ○ Balanced (Realistic, sustainable) [DEFAULT]
  ○ Conservative (Slower, more certainty)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATE BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-width gradient button
Text: "Create My Goal Roadmap"
Icon: 🎯
Loading: "Building your path to success..."
Sub-messages:
- "Analyzing your goal..."
- "Creating milestones..."
- "Planning action steps..."
- "Identifying resources..."

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GOAL ROADMAP HEADER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Your Goal Roadmap: [Goal Title]"
Timeline: [Timeframe]
Start Date: [Today's Date]
Target Completion: [End Date]

Progress Tracker:
[Visual progress bar: 0% complete]
Milestones: 0/6 completed

Quick Stats:
- Total Milestones: 6
- Weekly Actions: 24 weeks
- Estimated Hours: 240 total
- Difficulty: Moderate

Quick Actions:
- 📥 Download as PDF
- 📥 Export to Notion
- 📥 Export to Trello
- 📋 Copy Roadmap
- ⏰ Set Reminders
- 📊 Track Progress
- 🔄 Regenerate

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GOAL OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🎯 GOAL OVERVIEW                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ YOUR GOAL:                              │
│ Start an online business selling        │
│ handmade jewelry                        │
│                                         │
│ TIMELINE: 6 Months                      │
│ Start: October 2024                     │
│ Target: April 2025                      │
│                                         │
│ SUCCESS CRITERIA:                       │
│ By April 2025, you will have:          │
│ ✓ Launched an online store             │
│ ✓ Created product inventory (20+ items)│
│ ✓ Made first sales (goal: $1,000)      │
│ ✓ Established social media presence    │
│ ✓ Developed sustainable production     │
│                                         │
│ WHAT YOU'RE STARTING WITH:              │
│ • Beginner in e-commerce                │
│ • Some jewelry-making skills            │
│ • 10 hours/week available               │
│ • $500 budget                           │
│                                         │
│ THE PATH AHEAD:                         │
│ This roadmap breaks your 6-month goal   │
│ into 6 major milestones, each with     │
│ specific actions. You'll build your     │
│ business step-by-step, validating as    │
│ you go, and avoiding common pitfalls.   │
│                                         │
│ Stay committed, celebrate small wins,   │
│ and you'll have a thriving business by  │
│ April!                                  │
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MILESTONE ROADMAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Visual timeline with milestones:

[Oct] → [Nov] → [Dec] → [Jan] → [Feb] → [Mar] → [Apr]
  M1     M2      M3      M4      M5      M6     🎉

┌─────────────────────────────────────────┐
│ 📍 MILESTONE 1: Foundation & Research    │
│ Timeline: Month 1 (Oct 2024)            │
│ Status: ☐ Not Started                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ GOAL: Research market, validate idea,   │
│ and build foundational knowledge        │
│                                         │
│ KEY OUTCOMES:                           │
│ ✓ Identified target audience            │
│ ✓ Researched 10+ competitors            │
│ ✓ Validated product demand              │
│ ✓ Learned e-commerce basics             │
│ ✓ Created initial product designs       │
│                                         │
│ WEEKLY ACTIONS:                         │
│                                         │
│ Week 1 (Oct 1-7):                       │
│ • Research handmade jewelry market      │
│ • Identify 3 potential niches           │
│ • Study successful Etsy shops (2 hrs)   │
│ • Join 2 online communities             │
│                                         │
│ Week 2 (Oct 8-14):                      │
│ • Analyze top 10 competitors            │
│ • Note pricing, styles, marketing       │
│ • Survey potential customers (3 hrs)    │
│ • Validate product ideas                │
│                                         │
│ Week 3 (Oct 15-21):                     │
│ • Take e-commerce basics course (5 hrs) │
│ • Learn Etsy/Shopify platforms          │
│ • Sketch 15 product designs             │
│                                         │
│ Week 4 (Oct 22-31):                     │
│ • Finalize top 5 product designs        │
│ • Calculate production costs            │
│ • Set preliminary pricing               │
│ • Document learnings                    │
│                                         │
│ RESOURCES NEEDED:                       │
│ • Free: Etsy, Pinterest research        │
│ • $50: E-commerce course (Udemy)        │
│ • Time: 10 hrs/week                     │
│                                         │
│ POTENTIAL OBSTACLES:                    │
│ ⚠️ Analysis paralysis                   │
│ Solution: Limit research to 1 month,    │
│ then move to action                     │
│                                         │
│ ⚠️ Too many product ideas               │
│ Solution: Focus on best 5 to start      │
│                                         │
│ MILESTONE CELEBRATION:                  │
│ 🎉 Completed Month 1! Treat yourself to │
│ coffee and review your progress!        │
│                                         │
│ [Mark Complete] [View Details]          │
│ ─────────────────────────────────────  │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📍 MILESTONE 2: Setup & Legal            │
│ Timeline: Month 2 (Nov 2024)            │
│ Status: ☐ Not Started                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ GOAL: Establish business legally and    │
│ set up online presence                  │
│                                         │
│ KEY OUTCOMES:                           │
│ ✓ Registered business name              │
│ ✓ Opened business bank account          │
│ ✓ Created Etsy shop                     │
│ ✓ Set up basic branding                 │
│ ✓ Established social media              │
│                                         │
│ WEEKLY ACTIONS:                         │
│                                         │
│ Week 5 (Nov 1-7):                       │
│ • Register business name                │
│ • Apply for business license (if needed)│
│ • Open business bank account            │
│ • Budget: $100 for setup fees           │
│                                         │
│ Week 6 (Nov 8-14):                      │
│ • Create Etsy shop account              │
│ • Design shop banner and logo (Canva)   │
│ • Write shop policies                   │
│ • Set up payment processing             │
│                                         │
│ Week 7 (Nov 15-21):                     │
│ • Create Instagram business account     │
│ • Design cohesive visual brand          │
│ • Plan content calendar                 │
│ • Post first 5 pieces of content        │
│                                         │
│ Week 8 (Nov 22-30):                     │
│ • Photograph sample products            │
│ • Write compelling product descriptions │
│ • Set up shop sections/categories       │
│ • Test checkout process                 │
│                                         │
│ RESOURCES NEEDED:                       │
│ • $100: Business registration           │
│ • $0: Free Canva account                │
│ • $0: Free Etsy listing (first 40)      │
│                                         │
│ POTENTIAL OBSTACLES:                    │
│ ⚠️ Legal confusion                      │
│ Solution: Consult SCORE.org (free       │
│ business mentors)                       │
│                                         │
│ MILESTONE CELEBRATION:                  │
│ 🎉 You're official! Share your new shop │
│ with friends and family!                │
│                                         │
│ [Mark Complete] [View Details]          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📍 MILESTONE 3: Product Creation         │
│ Timeline: Month 3 (Dec 2024)            │
│ Status: ☐ Not Started                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ GOAL: Create initial inventory of       │
│ 10-15 products ready to sell            │
│                                         │
│ KEY OUTCOMES:                           │
│ ✓ Produced 10-15 quality pieces         │
│ ✓ Professional product photos           │
│ ✓ Listed all items on Etsy              │
│ ✓ Priced competitively                  │
│ ✓ Created product variations            │
│                                         │
│ WEEKLY ACTIONS:                         │
│ Week 9-12: [Detailed production plan]   │
│                                         │
│ RESOURCES NEEDED:                       │
│ • $200: Materials and supplies          │
│ • $50: Photography setup                │
│                                         │
│ [Mark Complete] [View Details]          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📍 MILESTONE 4: Launch & First Sales     │
│ Timeline: Month 4 (Jan 2025)            │
│ Status: ☐ Not Started                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ GOAL: Officially launch shop and make   │
│ first 5-10 sales                        │
│                                         │
│ KEY OUTCOMES:                           │
│ ✓ Launched shop publicly                │
│ ✓ Ran promotional campaign              │
│ ✓ Made 5-10 sales                       │
│ ✓ Received first customer reviews       │
│ ✓ Established shipping process          │
│                                         │
│ [Detailed weekly actions...]            │
│                                         │
│ MILESTONE CELEBRATION:                  │
│ 🎉 FIRST SALE! This is huge! Frame your│
│ first dollar earned!                    │
│                                         │
│ [Mark Complete] [View Details]          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📍 MILESTONE 5: Growth & Optimization    │
│ Timeline: Month 5 (Feb 2025)            │
│ Status: ☐ Not Started                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ GOAL: Increase sales, optimize listings,│
│ and grow social media                   │
│                                         │
│ [Detailed plan...]                      │
│                                         │
│ [Mark Complete] [View Details]          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📍 MILESTONE 6: Sustainability & Scale   │
│ Timeline: Month 6 (Mar-Apr 2025)        │
│ Status: ☐ Not Started                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ GOAL: Reach $1,000 in sales, establish │
│ sustainable production system           │
│                                         │
│ KEY OUTCOMES:                           │
│ ✓ Hit $1,000 revenue milestone          │
│ ✓ Streamlined production                │
│ ✓ Built email list (100+ subscribers)   │
│ ✓ Planned next phase growth             │
│                                         │
│ [Detailed plan...]                      │
│                                         │
│ FINAL CELEBRATION:                      │
│ 🎊 YOU DID IT! 6 months ago this was    │
│ just a dream. Now it's a real business! │
│                                         │
│ [Mark Complete] [View Details]          │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SKILLS & RESOURCES NEEDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🎓 SKILLS TO DEVELOP                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ MONTH 1-2: Foundation Skills            │
│ • E-commerce basics                     │
│   Resource: Shopify Academy (Free)      │
│ • Product photography                   │
│   Resource: YouTube tutorials (Free)    │
│ • Social media marketing                │
│   Resource: HubSpot Academy (Free)      │
│                                         │
│ MONTH 3-4: Production Skills            │
│ • Jewelry-making techniques             │
│   Resource: Skillshare ($15/mo)         │
│ • Inventory management                  │
│   Resource: Free spreadsheet templates  │
│                                         │
│ MONTH 5-6: Growth Skills                │
│ • SEO optimization                      │
│   Resource: Moz Beginner's Guide (Free) │
│ • Email marketing                       │
│   Resource: Mailchimp tutorials (Free)  │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 💰 BUDGET BREAKDOWN                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Total Budget Available: $500            │
│                                         │
│ ALLOCATION:                             │
│ Month 1: $50                            │
│ • E-commerce course: $50                │
│                                         │
│ Month 2: $100                           │
│ • Business registration: $100           │
│                                         │
│ Month 3: $250                           │
│ • Materials & supplies: $200            │
│ • Photography setup: $50                │
│                                         │
│ Month 4: $50                            │
│ • Marketing/ads: $50                    │
│                                         │
│ Month 5-6: $50                          │
│ • Additional inventory: $50             │
│                                         │
│ ✅ Total: $500 (within budget!)         │
│                                         │
│ REVENUE PROJECTION:                     │
│ Month 4: $100-200 (first sales)         │
│ Month 5: $300-400                       │
│ Month 6: $500-600                       │
│ Total 6-month revenue: $900-1,200       │
│                                         │
│ ROI: Positive by month 6! 🎉            │
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OBSTACLES & SOLUTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ ⚠️ COMMON OBSTACLES & HOW TO OVERCOME    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ OBSTACLE #1: Perfectionism               │
│ When: Month 1-2                         │
│ Risk: High                              │
│                                         │
│ Problem: Spending too long on research  │
│ and design without taking action        │
│                                         │
│ Solution:                               │
│ • Set strict 1-month research deadline  │
│ • Launch with "good enough" not perfect │
│ • Remember: You can improve as you go   │
│                                         │
│ ───────────────────────────────────────│
│                                         │
│ OBSTACLE #2: First Sales Fear            │
│ When: Month 4                           │
│ Risk: Medium                            │
│                                         │
│ Problem: Fear of putting yourself out   │
│ there and possibly failing              │
│                                         │
│ Solution:                               │
│ • Start with friends/family             │
│ • Join supportive online communities    │
│ • Remember: Every business starts at 0  │
│ • Celebrate ANY sale, no matter how     │
│   small                                 │
│                                         │
│ ───────────────────────────────────────│
│                                         │
│ OBSTACLE #3: Time Management             │
│ When: Throughout                        │
│ Risk: High                              │
│                                         │
│ Problem: Balancing business with        │
│ full-time job and life                  │
│                                         │
│ Solution:                               │
│ • Block 10 hrs/week on calendar         │
│ • Use weekends for production           │
│ • Batch similar tasks                   │
│ • Say no to non-essentials for 6 months │
│                                         │
│ ───────────────────────────────────────│
│                                         │
│ OBSTACLE #4: Slow Sales                  │
│ When: Month 4-5                         │
│ Risk: Medium                            │
│                                         │
│ Problem: Not getting as many sales as   │
│ hoped                                   │
│                                         │
│ Solution:                               │
│ • Improve product photos                │
│ • Test different pricing                │
│ • Increase social media activity        │
│ • Run small promotions                  │
│ • Ask for customer feedback             │
│ • Don't give up - sales take time!      │
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUCCESS STRATEGIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🚀 HOW TO ACTUALLY ACHIEVE THIS GOAL     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ WEEKLY REVIEW RITUAL:                   │
│ Every Sunday evening:                   │
│ 1. Review last week's progress          │
│ 2. Check off completed actions          │
│ 3. Plan next week's tasks               │
│ 4. Adjust timeline if needed            │
│ 5. Celebrate wins (no matter how small) │
│                                         │
│ ACCOUNTABILITY SYSTEM:                  │
│ • Find an accountability partner        │
│ • Join online entrepreneur community    │
│ • Share progress weekly                 │
│ • Track metrics (sales, followers, etc.)│
│                                         │
│ MOTIVATION BOOSTERS:                    │
│ • Create vision board                   │
│ • Set up rewards for milestones         │
│ • Follow inspiring entrepreneurs        │
│ • Document your journey                 │
│ • Remember your "why"                   │
│                                         │
│ WHEN YOU FEEL STUCK:                    │
│ • Review progress (you've come far!)    │
│ • Reach out to mentor/community         │
│ • Take a day off, come back fresh       │
│ • Break next step into smaller pieces   │
│ • Remember: Progress > Perfection       │
│                                         │
│ WHAT SUCCESS LOOKS LIKE:                │
│ Month 6 goals:                          │
│ ✓ $1,000 in revenue                     │
│ ✓ 20+ products listed                   │
│ ✓ 500+ Instagram followers              │
│ ✓ 5-star customer reviews               │
│ ✓ Sustainable production system         │
│ ✓ Clear plan for next 6 months          │
│                                         │
│ But most importantly:                   │
│ 🎉 YOU STARTED A REAL BUSINESS!         │
│                                         │
└─────────────────────────────────────────┘

=== WEBLLM PROMPTS ===

System Prompt:
```
You are an expert goal achievement coach and strategic planner with deep knowledge of milestone planning, habit formation, and sustained motivation.

Your expertise includes:
- Breaking big goals into achievable milestones
- Realistic timeline creation
- Resource and skill planning
- Obstacle anticipation and mitigation
- Progress tracking and accountability
- Motivation and celebration systems
- Domain-specific strategies (business, fitness, learning, etc.)

You generate goal roadmaps that:
- Transform ambitions into concrete plans
- Include realistic timelines and milestones
- Provide weekly actionable steps
- Anticipate and plan for obstacles
- Include resource recommendations
- Balance ambition with achievability
- Include celebration and motivation
- Are adapted to user's constraints

You understand:
- Different goal types require different strategies
- Starting points matter enormously
- Constraints shape feasibility
- Motivation wanes without wins
- Obstacles are predictable and plannable
- Balance prevents burnout
- Flexibility is essential
```

User Prompt Template:
```
Generate a comprehensive goal achievement roadmap.

═══════════════════════════════════════
GOAL INFORMATION
═══════════════════════════════════════
Goal: {goal}
Timeframe: {timeframe}
Goal Type: {goalType}
Starting Point: {startingPoint}
Available Time: {availableTime} hours/week
Budget: {budget}
Constraints: {constraints}

Include:
Celebrations: {includeCelebrations}
Obstacles: {includeObstacles}
Resources: {includeResources}

═══════════════════════════════════════
ROADMAP REQUIREMENTS
═══════════════════════════════════════

STRUCTURE:

1. GOAL OVERVIEW
   - Clear goal statement
   - Success criteria (what "done" looks like)
   - Starting point assessment
   - Timeline and target date
   - Motivational framing

2. MILESTONE BREAKDOWN
   Based on {timeframe}:
   - 3 months: 3-4 monthly milestones
   - 6 months: 5-6 bi-monthly milestones  
   - 12 months: 6-8 quarterly milestones
   
   For EACH milestone:
   - Clear outcome/deliverable
   - Timeline (month/quarter)
   - Key outcomes checklist
   - Weekly action steps (4 weeks per milestone)
   - Resources needed
   - Potential obstacles
   - Celebration/reward

3. WEEKLY ACTIONS
   For each week within milestones:
   - 3-5 specific, actionable tasks
   - Time estimates
   - Priority levels
   - Dependencies
   - Measurable outcomes

4. SKILLS & RESOURCES
   - Skills to develop (by phase)
   - Learning resources (courses, books, etc.)
   - Tools needed
   - Budget allocation
   - Mentorship/community needs

5. OBSTACLE PLANNING
   - Common obstacles for this goal type
   - When they typically occur
   - Risk level assessment
   - Mitigation strategies
   - Backup plans

6. SUCCESS STRATEGIES
   - Weekly review rituals
   - Accountability systems
   - Motivation techniques
   - What to do when stuck
   - Success metrics

GOAL TYPE ADAPTATION:

{if goalType === 'business'}
Business/Entrepreneurship:
- Focus on validation before building
- Revenue milestones
- Customer acquisition
- Market research early
- Iterative approach

{if goalType === 'health'}
Health & Fitness:
- Gradual progression
- Habit formation focus
- Nutrition and exercise balance
- Rest and recovery
- Measurable metrics (weight, reps, etc.)

{if goalType === 'learning'}
Learning/Education:
- Curriculum structure
- Practice and application
- Portfolio building
- Certification paths
- Spaced repetition

{if goalType === 'financial'}
Financial:
- Specific number targets
- Monthly saving goals
- Budget optimization
- Investment strategies
- Tracking systems

REALISTIC PLANNING:

Consider {availableTime}:
- <5 hrs/week: Conservative pacing, longer timeline
- 5-10 hrs/week: Standard pacing
- 10-20 hrs/week: Accelerated possible
- 20+ hrs/week: Full-time focus, faster timeline

Consider {budget}:
- Low budget: Free resources, DIY approach
- Medium budget: Some paid tools/courses
- High budget: Premium resources, mentorship

Consider {constraints}:
- Adapt plan to work around limitations
- Suggest creative solutions
- Realistic expectations

QUALITY CHECKS:
✓ Milestones build logically?
✓ Timeline is realistic?
✓ Weekly actions are specific?
✓ Obstacles anticipated?
✓ Resources within budget?
✓ Celebrations included?
✓ Motivation sustained?

═══════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════

GOAL OVERVIEW:
[Clear framing of goal and path]

MILESTONE 1: [Title]
Timeline: [Month/Quarter]
Goal: [What you'll achieve]

Key Outcomes:
✓ [Outcome 1]
✓ [Outcome 2]

Weekly Actions:
Week 1: [Specific tasks]
Week 2: [Specific tasks]
[Continue]

Resources Needed:
[List with costs]

Potential Obstacles:
[List with solutions]

Milestone Celebration:
[How to celebrate]

[Repeat for all milestones]

SKILLS & RESOURCES:
[Organized by phase]

OBSTACLES & SOLUTIONS:
[Comprehensive list]

SUCCESS STRATEGIES:
[How to actually achieve this]

Generate an inspiring, realistic roadmap that helps users achieve their biggest goals.
```

=== SPECIAL FEATURES ===

1. **Progress Tracking:**
   - Visual milestone completion
   - Weekly check-ins
   - Percentage complete
   - Streak tracking

2. **Flexible Adjustment:**
   - Modify timeline
   - Add/remove milestones
   - Adjust weekly actions
   - Update based on progress

3. **Accountability:**
   - Set reminders
   - Email check-ins
   - Share with partner
   - Weekly review prompts

4. **Celebration System:**
   - Milestone rewards
   - Progress badges
   - Success visualization
   - Share achievements

5. **Resource Library:**
   - Curated courses
   - Tool recommendations
   - Community connections
   - Expert interviews

6. **Template Library:**
   - Save successful plans
   - Goal-type templates
   - Quick start
   - Community templates

7. **Analytics:**
   - Time to completion
   - Success rate
   - Common obstacles
   - Improvement insights

=== SEO ARTICLE SECTION ===

Below tool, comprehensive 2500-word article:

Title: "How to Achieve Any Goal: Complete Planning Guide 2026"

=== SUCCESS METRICS ===

Expected Performance:
- Month 1: 4k-6k users
- Month 3: 15k-25k users
- Month 6: 35k-60k users

Build this as THE goal achievement tool for ambitious people.
```
