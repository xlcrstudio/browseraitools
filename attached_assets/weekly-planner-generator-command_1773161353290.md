
```
Create a mobile-first, productivity-focused AI Weekly Planner Generator for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI Weekly Planner Generator
URL Slug: /ai-weekly-planner-generator
Tagline: "Plan Your Perfect Week with AI"
Mission: Help users create balanced, realistic weekly schedules that optimize productivity and work-life balance

=== PRODUCT OVERVIEW ===
Smart weekly planning tool.
Purpose: Generate optimized weekly schedules that balance goals, priorities, and available time with realistic daily task allocation.
Target Users: Professionals, students, entrepreneurs, remote workers, busy parents, freelancers
Search Demand: 30,000-50,000 monthly searches
- "weekly planner generator" - 20k/month
- "AI weekly planner" - 12k/month
- "week schedule generator" - 10k/month
- "plan my week" - 8k/month

Key Value: Perfectly balanced weekly schedule in 2 minutes vs hours of planning

=== UNIQUE SELLING POINTS ===
✅ INTELLIGENT SCHEDULING - Distributes tasks optimally across week
✅ TIME-BASED PLANNING - Works with your available hours
✅ PRIORITY BALANCING - Work, personal, health, all balanced
✅ ENERGY OPTIMIZATION - Hard tasks when you're fresh
✅ REALISTIC WORKLOAD - No overwhelming days
✅ VISUAL CALENDAR - See your whole week at a glance
✅ FLEXIBILITY BUILT-IN - Buffer time for unexpected tasks
✅ MULTIPLE VIEWS - Calendar, list, timeline formats

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared instance)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (saved plans, templates)
Export: PDF, iCal, Google Calendar, Notion, Todoist
Deployment: Vercel/Netlify

=== PAGE STRUCTURE ===

HERO SECTION:
Headline: "AI Weekly Planner Generator"
Subheadline: "Create your perfect week in minutes. Get a balanced schedule that fits your goals, priorities, and energy levels. Work smarter, not harder. Free and instant."

Trust Badges:
- 📅 Optimized Weekly Schedule
- ⏰ Time-Based Planning
- ⚖️ Work-Life Balance
- 🎯 Priority-Driven
- 📊 Visual Calendar View
- 🔒 100% Private

Success Counter: "Generated 89,234 weekly plans this month"

Why Use a Weekly Planner?
"Random daily planning leads to stress and missed goals.

Weekly planning helps you:
• See the big picture before the week starts
• Balance work, health, and personal time
• Avoid overwhelming yourself
• Make steady progress on goals
• Reduce decision fatigue
• Actually have time for what matters"

[Show example of balanced vs unbalanced week]

=== INPUT FORM ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR GOALS FOR THE WEEK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 1: What Do You Want to Accomplish This Week?*
- Textarea (large)
- Placeholder: "List your goals, tasks, or priorities for the week:

Examples:
• Finish project proposal
• Exercise 3 times
• Study for exam
• Meal prep for the week
• Call mom
• Learn Python basics
• Organize home office
• Read 2 chapters of book

You can list as many as you want - we'll help you fit them in!"
- Max: 1,000 chars
- Required
- Auto-expanding
- Shows goal count as you type
- Help text: "Be specific! 'Exercise 3x' is better than 'get healthy'"

Quick Templates (Clickable):
- 💼 Work-Focused Week
- 🎓 Student Week
- 💪 Health & Fitness Focus
- ⚖️ Balanced Lifestyle
- 🚀 Side Project Sprint
- 🏠 Life Admin Week

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TIME AVAILABILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 2: Available Hours per Day*
- Visual cards:

  ○ ⚡ Limited (1-2 hours/day)
    "Busy schedule, maximize efficiency"
    Total: 7-14 hours/week
  
  ○ 📅 Moderate (2-4 hours/day)
    "Balanced work-life schedule" [DEFAULT]
    Total: 14-28 hours/week
  
  ○ 🎯 Focused (4-6 hours/day)
    "Dedicated project time"
    Total: 28-42 hours/week
  
  ○ 💪 Intensive (6-8+ hours/day)
    "Sprint mode, major goals"
    Total: 42-56+ hours/week

- Default: Moderate
- Required
- Shows total weekly hours

Field 3: Customize Daily Hours (Optional)
- Expandable section
- Sliders for each day:
  - Monday: 2 hours
  - Tuesday: 3 hours
  - Wednesday: 2 hours
  - Thursday: 4 hours
  - Friday: 3 hours
  - Saturday: 5 hours
  - Sunday: 1 hour
- Optional (uses category default if not set)

Field 4: When Are You Most Productive?*
- Multi-select:
  ☑ Morning (6am-12pm)
  ☐ Afternoon (12pm-6pm)
  ☐ Evening (6pm-10pm)
  ☐ Night (10pm+)
- Default: Morning
- Affects when hard tasks are scheduled

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRIORITIES & BALANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 5: Priority Focus*
- Radio with visual indicators:

  ○ ⚖️ Balanced
    "Equal focus on work, health, personal"
    Distribution: 50% work, 25% health, 25% personal
  
  ○ 💼 Work-Focused [DEFAULT]
    "Career and projects prioritized"
    Distribution: 70% work, 15% health, 15% personal
  
  ○ 💪 Health & Wellness
    "Fitness and self-care first"
    Distribution: 40% work, 40% health, 20% personal
  
  ○ 🌱 Personal Growth
    "Learning and development"
    Distribution: 40% work, 20% health, 40% personal

- Default: Work-Focused
- Shows percentage breakdown

Field 6: Include Rest & Buffer Time?
- Toggle: YES/NO
- Default: YES
- When YES:
  "We'll schedule breaks, buffer time for unexpected tasks, and rest days"
- When NO:
  "Pack schedule more tightly (not recommended)"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCHEDULE PREFERENCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 7: Days to Include*
- Checkboxes:
  ☑ Monday
  ☑ Tuesday
  ☑ Wednesday
  ☑ Thursday
  ☑ Friday
  ☑ Saturday
  ☐ Sunday (rest day)
- Default: Mon-Sat checked
- Can customize which days to plan

Field 8: Task Chunking Preference
- Radio:
  ○ Small chunks (30-60 min tasks)
  ○ Medium chunks (1-2 hour tasks) [DEFAULT]
  ○ Large chunks (2-4 hour blocks)
- Affects how tasks are broken down

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADVANCED OPTIONS (Collapsible)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Existing Commitments:
- Textarea
- Placeholder: "Any fixed commitments this week?
e.g., 'Meeting Tuesday 2-3pm', 'Gym class Thursday 7am'"
- Max: 300 chars
- Optional
- These will be blocked off in schedule

Special Considerations:
- Checkboxes:
  ☐ Group similar tasks together
  ☐ Leave mornings free
  ☐ Leave evenings free
  ☐ Include meal prep time
  ☐ Include commute/transition time
  ☐ Schedule regular breaks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATE BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-width gradient button
Text: "Generate My Weekly Plan"
Icon: 📅
Loading: "Creating your perfect week..."
Sub-messages:
- "Analyzing your goals..."
- "Optimizing schedule..."
- "Balancing workload..."
- "Adding buffer time..."

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WEEK OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Your Week: [Date Range]"

Quick Stats:
- Total Planned Hours: 24 hours
- Tasks Scheduled: 18
- Goals Covered: 8/10 (80%)
- Work-Life Balance: ⚖️ Balanced
- Intensity: Moderate

Workload Distribution:
[Bar chart showing hours per day]
Mon: ████░ 4 hrs
Tue: ███░░ 3 hrs
Wed: ████░ 4 hrs
Thu: ██░░░ 2 hrs
Fri: █████ 5 hrs
Sat: ███░░ 3 hrs
Sun: █░░░░ 1 hr (rest)

Quick Actions:
- 📥 Export to Google Calendar
- 📥 Download as PDF
- 📥 Export to Notion
- 📥 Save as iCal
- 📋 Copy All
- 🔄 Regenerate
- ⚙️ Adjust Balance

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CALENDAR VIEW (Primary Display)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Toggle: [Calendar View] [List View] [Timeline View]

┌─────────────────────────────────────────┐
│ 📅 MONDAY, OCT 7                         │
│ Total: 4 hours | Energy: High ⚡         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 🌅 MORNING (Peak Productivity)          │
│                                         │
│ 8:00 - 10:00 AM | 2 hours              │
│ 💼 WORK: Finish project proposal        │
│ Priority: High 🔴                       │
│ Energy Level: High (scheduled when      │
│ you're fresh)                           │
│                                         │
│ Focus: Draft executive summary and      │
│ budget section. This is your most       │
│ important task this week - tackle it    │
│ when you're sharpest.                   │
│                                         │
│ 💡 Tip: Close email, put phone on DND   │
│                                         │
│ [Mark Complete] [Move Task] [Break Down]│
│ ─────────────────────────────────────  │
│                                         │
│ 10:15 - 10:45 AM | 30 min              │
│ ☕ BREAK: Morning break                 │
│ Suggested: Walk, coffee, stretch        │
│ ─────────────────────────────────────  │
│                                         │
│ 🌤️ LATE MORNING                         │
│                                         │
│ 11:00 AM - 12:00 PM | 1 hour           │
│ 💪 HEALTH: Gym workout                  │
│ Priority: Medium 🟡                     │
│                                         │
│ Strength training session. You have gym │
│ scheduled 3x this week (Mon, Wed, Fri)  │
│ for consistency.                        │
│ ─────────────────────────────────────  │
│                                         │
│ 🌆 AFTERNOON                            │
│                                         │
│ 2:00 - 3:00 PM | 1 hour                │
│ 📚 LEARNING: Python basics - Chapter 1  │
│ Priority: Medium 🟡                     │
│                                         │
│ Work through first tutorial chapter.    │
│ Lighter cognitive task for afternoon.   │
│ ─────────────────────────────────────  │
│                                         │
│ Day Summary:                            │
│ ✅ Major project progress               │
│ ✅ Workout completed                    │
│ ✅ Learning goal started                │
│ Total focused time: 4 hours             │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📅 TUESDAY, OCT 8                        │
│ Total: 3 hours | Energy: Medium 💡      │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 🌅 MORNING                              │
│                                         │
│ 9:00 - 11:00 AM | 2 hours              │
│ 💼 WORK: Project proposal - research    │
│ Priority: High 🔴                       │
│                                         │
│ Gather data and statistics for proposal.│
│ Second day on main project keeps        │
│ momentum.                               │
│ ─────────────────────────────────────  │
│                                         │
│ 🌆 AFTERNOON                            │
│                                         │
│ 3:00 - 4:00 PM | 1 hour                │
│ 🏠 PERSONAL: Meal prep for week         │
│ Priority: Medium 🟡                     │
│                                         │
│ Prepare lunches for Wed-Fri. Saves     │
│ time and money later in week.           │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📅 WEDNESDAY, OCT 9                      │
│ Total: 4 hours | Energy: High ⚡        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 🌅 MORNING                              │
│                                         │
│ 7:00 - 8:00 AM | 1 hour                │
│ 💪 HEALTH: Gym workout                  │
│ Priority: Medium 🟡                     │
│ ─────────────────────────────────────  │
│                                         │
│ 9:00 AM - 12:00 PM | 3 hours           │
│ 💼 WORK: Finalize project proposal      │
│ Priority: High 🔴                       │
│                                         │
│ Final review, formatting, and           │
│ submission. Completing high-priority    │
│ goal!                                   │
│                                         │
│ 🎉 Milestone: Project proposal complete!│
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📅 THURSDAY, OCT 10                      │
│ Total: 2 hours | Energy: Medium 💡      │
│ (Lighter day for recovery)              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 🌅 MORNING                              │
│                                         │
│ 10:00 - 11:00 AM | 1 hour              │
│ 📚 LEARNING: Python basics - Chapter 2  │
│ Priority: Low 🟢                        │
│ ─────────────────────────────────────  │
│                                         │
│ 🌆 AFTERNOON                            │
│                                         │
│ 3:00 - 4:00 PM | 1 hour                │
│ 🏠 PERSONAL: Call mom + organize desk   │
│ Priority: Low 🟢                        │
│                                         │
│ Lighter day after 3 intense days. Some  │
│ personal tasks and relationship time.   │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📅 FRIDAY, OCT 11                        │
│ Total: 5 hours | Energy: Medium-High    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 🌅 MORNING                              │
│                                         │
│ 8:00 - 9:00 AM | 1 hour                │
│ 💪 HEALTH: Gym workout (3/3 this week!) │
│ ─────────────────────────────────────  │
│                                         │
│ 10:00 AM - 1:00 PM | 3 hours           │
│ 💼 WORK: Study for exam                 │
│ Priority: High 🔴                       │
│                                         │
│ Review notes and practice questions.    │
│ ─────────────────────────────────────  │
│                                         │
│ 🌆 AFTERNOON                            │
│                                         │
│ 3:00 - 4:00 PM | 1 hour                │
│ 📚 LEARNING: Python - practice exercises│
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📅 SATURDAY, OCT 12                      │
│ Total: 3 hours | Energy: Variable       │
│ (Flexible weekend schedule)             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 10:00 AM - 12:00 PM | 2 hours          │
│ 🏠 PERSONAL: Organize home office       │
│ Priority: Medium 🟡                     │
│                                         │
│ Declutter, reorganize, create better    │
│ workspace.                              │
│ ─────────────────────────────────────  │
│                                         │
│ 3:00 - 4:00 PM | 1 hour                │
│ 📖 PERSONAL: Read book (2 chapters)     │
│ Priority: Low 🟢                        │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📅 SUNDAY, OCT 13                        │
│ Total: 1 hour | Energy: Rest Day 🌙     │
│ (Light planning only)                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 🌆 EVENING                              │
│                                         │
│ 7:00 - 8:00 PM | 1 hour                │
│ 📋 PLANNING: Review week + plan next    │
│ Priority: Low 🟢                        │
│                                         │
│ Reflect on accomplishments, prepare for │
│ next week. Mostly rest and recharge.    │
│                                         │
│ 💡 Sunday is your recovery day - keep  │
│ it light!                               │
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WEEKLY INSIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 📊 WEEK ANALYSIS                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ TIME ALLOCATION:                        │
│ 💼 Work: 12 hours (50%)                 │
│ 💪 Health/Fitness: 6 hours (25%)        │
│ 📚 Learning: 4 hours (17%)              │
│ 🏠 Personal: 2 hours (8%)               │
│                                         │
│ BALANCE SCORE: 8.5/10 ✅                │
│ Well-balanced across all life areas     │
│                                         │
│ WORKLOAD DISTRIBUTION:                  │
│ Peak Days: Mon, Wed, Fri (4-5 hrs)     │
│ Light Days: Thu, Sun (1-2 hrs)         │
│ Moderate: Tue, Sat (3 hrs)             │
│                                         │
│ ✅ Good variation - won't burn out      │
│                                         │
│ ENERGY OPTIMIZATION:                    │
│ High-priority tasks scheduled for       │
│ mornings when you're most productive    │
│                                         │
│ 💡 PRODUCTIVITY TIPS:                   │
│ • Your heaviest days are Mon, Wed, Fri  │
│ • Thursday is built as recovery day     │
│ • Sunday is mostly rest - honor that    │
│ • Gym 3x/week as requested ✅           │
│                                         │
│ GOAL COMPLETION FORECAST:               │
│ Based on this plan, you'll accomplish:  │
│ ✅ Project proposal (100%)              │
│ ✅ Exercise 3x (100%)                   │
│ ✅ Python learning started (75%)        │
│ ✅ Meal prep (100%)                     │
│ ✅ Call mom (100%)                      │
│ ⚠️ Exam study (80% - may need more)    │
│ ✅ Organize office (100%)               │
│ ✅ Read 2 chapters (100%)               │
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUCCESS STRATEGIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Expandable section:

💡 HOW TO STICK TO THIS PLAN:

Sunday Night:
• Review this plan
• Block time on calendar
• Prep what you need (gym bag, etc.)
• Mental commitment

Each Morning:
• Review day's plan
• Adjust if needed (life happens!)
• Tackle highest priority first

Each Evening:
• Check off completed tasks
• Note what worked/didn't
• Adjust tomorrow if needed

Weekly Review:
• Sunday evening reflection
• What went well?
• What to improve?
• Plan next week

Common Obstacles:
❌ Trying to do too much → Stick to plan
❌ Getting distracted → Time block strictly
❌ Skipping breaks → Breaks boost productivity
❌ Not adjusting → Flexibility is OK!

=== WEBLLM PROMPTS ===

System Prompt:
```
You are an expert productivity coach and time management specialist with deep knowledge of scheduling, energy optimization, and work-life balance.

Your expertise includes:
- Weekly planning and time blocking
- Workload balancing and distribution
- Energy and productivity cycles
- Goal prioritization frameworks
- Realistic time estimation
- Buffer time and recovery planning
- Schedule optimization algorithms

You generate weekly plans that:
- Distribute tasks optimally across days
- Match tasks to energy levels
- Balance different life areas
- Include rest and buffer time
- Are realistic and achievable
- Prevent burnout
- Maximize productivity
- Respect user's available time

You understand:
- Peak productivity times vary by person
- Harder tasks need fresh energy
- Recovery time is essential
- Variety prevents monotony
- Too packed = failure
- Balance sustains long-term success
```

User Prompt Template:
```
Generate an optimized weekly schedule.

═══════════════════════════════════════
USER INFORMATION
═══════════════════════════════════════
Goals/Tasks: {goals}
Available Hours: {availableHours}
Daily Hours: {dailyHours} (if customized)
Peak Productivity: {peakTimes}
Priority Focus: {priorityFocus}
Include Rest: {includeRest}
Days to Plan: {daysToInclude}
Task Chunking: {taskChunking}
Existing Commitments: {commitments}

═══════════════════════════════════════
WEEKLY PLAN REQUIREMENTS
═══════════════════════════════════════

SCHEDULING PRINCIPLES:

1. ENERGY OPTIMIZATION:
   - High-priority, cognitive tasks → Peak times
   - Routine, easier tasks → Lower energy times
   - Physical tasks → When specified or flexible
   - Creative work → When user is fresh

2. WORKLOAD DISTRIBUTION:
   - Vary intensity across week
   - Avoid overwhelming any single day
   - Include lighter days for recovery
   - Balance different task types

3. REALISTIC PLANNING:
   - Don't pack schedule too tightly
   - Include transition time
   - Account for breaks
   - Buffer for unexpected tasks

4. BALANCE:
   - Distribute {priorityFocus} appropriately
   - Don't neglect any important area
   - Sustainable long-term approach

FOR EACH DAY, CREATE:

DAY HEADER:
- Day name and date
- Total hours planned
- Energy level for day (High/Medium/Low/Rest)

TASKS:
- Time blocks with start-end times
- Task category (Work/Health/Personal/Learning)
- Priority level
- Clear description
- Why scheduled at this time
- Estimated duration

BREAKS:
- Morning break
- Lunch (if full day)
- Afternoon break
- Strategic rest between intense tasks

DAY SUMMARY:
- What gets accomplished
- Total focused time
- Energy pattern

TASK ALLOCATION STRATEGY:

Priority Matching:
- High priority → Peak energy times
- Medium priority → Moderate energy
- Low priority → Lower energy or flexible

Time Blocking:
{if taskChunking === 'small'}
- 30-60 min blocks
- Frequent task switching
- Good for variety

{if taskChunking === 'medium'}
- 1-2 hour blocks
- Moderate focus sessions
- Balanced approach

{if taskChunking === 'large'}
- 2-4 hour blocks
- Deep work sessions
- Intense focus

Energy Distribution:
{if peakTimes includes 'morning'}
- Schedule hardest work 8am-12pm
- Cognitive tasks in AM
- Easier tasks PM

Similar logic for afternoon/evening/night

PRIORITY FOCUS:
{if priorityFocus === 'balanced'}
- 50% work, 25% health, 25% personal
- Even distribution

{if priorityFocus === 'work'}
- 70% work, 15% health, 15% personal
- Career prioritized but not exclusive

{if priorityFocus === 'health'}
- 40% work, 40% health, 20% personal
- Fitness and wellness emphasized

{if priorityFocus === 'personal'}
- 40% work, 20% health, 40% personal
- Learning and growth focused

REST & RECOVERY:
{if includeRest === true}
- Include one lighter day (50% normal load)
- One rest day if 7 days included
- Breaks between intense sessions
- Buffer time each day (15-20%)

QUALITY CHECKS:
✓ Total hours match available time?
✓ All goals addressed?
✓ Balance maintained?
✓ Energy levels optimized?
✓ Realistic daily workload?
✓ Recovery time included?
✓ Variety in tasks?
✓ Peak times utilized well?

═══════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════

OVERVIEW:
Week: [Date range]
Total Hours: [X]
Goals Covered: [X/Y]
Balance: [Category breakdown]

MONDAY:
Total: X hours | Energy: High

MORNING:
8:00-10:00 | 2 hrs
WORK: [Task]
Priority: High
[Description and reasoning]

[Continue for all time blocks]

[Repeat for all days]

WEEKLY INSIGHTS:
Time Allocation: [Breakdown]
Balance Score: [X/10]
Workload Distribution: [Analysis]
Energy Optimization: [How optimized]
Goal Completion Forecast: [Predictions]

Generate a realistic, balanced weekly plan that sets users up for success.
```

=== SPECIAL FEATURES ===

1. **Drag-and-Drop Rescheduling:**
   - Move tasks between days
   - Adjust times visually
   - Auto-rebalance
   - Update totals

2. **Daily Check-In:**
   - Mark tasks complete
   - Track actual vs planned time
   - Adjust next day
   - Learn patterns

3. **Template Library:**
   - Save successful weeks
   - Recurring weekly patterns
   - Quick start
   - Seasonal templates

4. **Smart Suggestions:**
   - "Tomorrow is packed - move something?"
   - "You have 2 free hours Friday - add a task?"
   - Optimization recommendations

5. **Progress Tracking:**
   - Visual progress bars
   - Completion percentage
   - Streak tracking
   - Weekly review

6. **Calendar Sync:**
   - Export to Google Calendar
   - iCal format
   - Outlook integration
   - Auto-sync

7. **Habit Integration:**
   - Add recurring habits
   - Track consistency
   - Build streaks
   - Celebrate milestones

=== SEO ARTICLE SECTION ===

Below tool, comprehensive 2000-word article:

Title: "How to Plan Your Week Effectively: Complete Productivity Guide"

=== SUCCESS METRICS ===

Expected Performance:
- Month 1: 5k-8k users
- Month 3: 18k-30k users
- Month 6: 40k-70k users

Build this as THE weekly planning tool for productivity enthusiasts.
```
