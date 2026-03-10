

## Complete Build Command for browseraitools.com

```
Create a mobile-first, conversion-focused AI Ad Copy Generator for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI Ad Copy Generator
URL Slug: /ai-ad-copy-generator
Tagline: "Create High-Converting Ad Copy in Seconds"
Mission: Help marketers and business owners create compelling ad copy that drives clicks and conversions across all platforms

=== PRODUCT OVERVIEW ===
High-demand marketing tool.
Purpose: Generate multiple variations of ad copy optimized for different platforms (Facebook, Instagram, Google Ads) with headlines, body copy, and CTAs.
Target Users: Digital marketers, social media managers, business owners, agencies, e-commerce brands
Search Demand: 45,000-75,000 monthly searches
- "ad copy generator" - 30k/month
- "AI ad copy generator" - 20k/month
- "Facebook ad copy generator" - 15k/month
- "ad copywriting tool" - 10k/month

Key Value: 5 tested ad variations in 30 seconds vs hours of copywriting

=== UNIQUE SELLING POINTS ===
✅ PLATFORM-OPTIMIZED - Facebook, Instagram, Google Ads, LinkedIn
✅ 5 VARIATIONS - A/B test ready
✅ COMPLETE ADS - Headline + body + CTA
✅ CONVERSION SCORING - Rate each ad's potential
✅ CHARACTER LIMITS - Platform-specific constraints
✅ AUDIENCE TARGETING - Tailored to specific demographics
✅ TONE OPTIONS - Persuasive, friendly, urgent, luxury
✅ MULTIPLE FORMATS - Carousel, story, feed, search

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared instance)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (saved ads, winners)
Export: Text, CSV, Meta Ads format
Deployment: Vercel/Netlify

=== PAGE STRUCTURE ===

HERO SECTION:
Headline: "AI Ad Copy Generator"
Subheadline: "Create high-converting ad copy for Facebook, Instagram, Google, and more. Get 5 variations with headlines, body copy, and CTAs. Perfect for A/B testing. Free and instant."

Trust Badges:
- 📱 All Platforms (FB, IG, Google, LinkedIn)
- 📝 5 Complete Ad Variations
- 🎯 Conversion Score Included
- ⚡ Character Limit Optimized
- 📊 A/B Test Ready
- 🔒 100% Private

Success Counter: "Generated 567,890 ad copies this month"

Why Use an Ad Copy Generator?
"Great ad copy = More clicks = More sales.

This tool helps you:
• Test multiple ad angles quickly
• Write platform-optimized copy
• Beat writer's block
• Save hours on copywriting
• Increase conversion rates
• Scale your ad campaigns"

[Show example of winning ad vs losing ad]

=== INPUT FORM ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRODUCT/SERVICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 1: What Are You Advertising?*
- Textarea
- Placeholder: "Describe your product or service:

Examples:
• 'AI productivity app that helps entrepreneurs automate tasks'
• 'Organic skincare line for sensitive skin'
• 'Online course teaching web development'
• 'Local gym with personal training'
• 'SaaS tool for email marketing'

Include key features and benefits!"
- Max: 500 chars
- Required
- Auto-expanding

Field 2: Unique Selling Point (USP)
- Input: text
- Placeholder: "e.g., 'Saves 10 hours/week', '100% natural ingredients', 'Get hired in 60 days'"
- Max: 100 chars
- Optional but recommended
- Help text: "What makes you different?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TARGET AUDIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 3: Target Audience*
- Multi-select with search:
  
  Popular Audiences:
  • Entrepreneurs
  • Small Business Owners
  • Students
  • Parents
  • Professionals (25-45)
  • Millennials
  • Gen Z
  • Fitness Enthusiasts
  • Tech-Savvy Users
  • Creative Professionals
  
  Or custom:
  [Custom audience input]

- Default: Select one
- Required

Field 4: Audience Pain Point (Optional)
- Input: text
- Placeholder: "e.g., 'Struggling with productivity', 'Tired of expensive gyms'"
- Max: 100 chars

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AD PLATFORM & FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 5: Ad Platform*
- Visual cards:

  ○ 📘 Facebook Feed
    "Newsfeed ads, engagement focused"
    Character limits optimized
  
  ○ 📸 Instagram Feed/Story
    "Visual-first, mobile-optimized"
    Short, punchy copy
  
  ○ 🔍 Google Search Ads
    "Search intent, direct response"
    Headline + description format
  
  ○ 💼 LinkedIn
    "Professional, B2B focused"
    Formal tone options
  
  ○ 🎯 General/Multi-Platform
    "Works anywhere"
    Flexible format

- Default: Facebook
- Required
- Affects character limits and style

Field 6: Ad Format (if Facebook/Instagram)
- Radio:
  ○ Single Image/Video
  ○ Carousel (multiple products)
  ○ Story Ad
  ○ Collection
- Default: Single Image
- Affects copy structure

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TONE & STYLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 7: Tone/Voice*
- Visual cards with examples:

  ○ 💪 Persuasive/Direct
    "Action-oriented, benefit-focused"
    Example: "Stop wasting time. Start achieving more."
  
  ○ 😊 Friendly/Conversational
    "Warm, approachable, relatable"
    Example: "Hey! We made something you'll love..."
  
  ○ ⚡ Urgent/FOMO
    "Time-sensitive, scarcity-driven"
    Example: "Last chance! Offer ends tonight."
  
  ○ ✨ Luxury/Premium
    "Sophisticated, exclusive, high-end"
    Example: "Experience elegance redefined."
  
  ○ 🎉 Playful/Fun
    "Energetic, entertaining, bold"
    Example: "Ready to level up? Let's do this!"
  
  ○ 📊 Professional/Informative
    "Fact-based, authoritative, B2B"
    Example: "Increase efficiency by 40%."

- Default: Persuasive
- Required

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CAMPAIGN GOAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 8: Campaign Objective
- Radio:
  ○ Conversions/Sales (Drive purchases)
  ○ Lead Generation (Get signups/emails)
  ○ Traffic (Drive website visits)
  ○ Awareness (Build brand recognition)
  ○ Engagement (Likes, comments, shares)
  ○ App Installs
- Default: Conversions
- Affects CTA and messaging

Field 9: Special Offer (Optional)
- Input: text
- Placeholder: "e.g., '50% off', 'Free trial', 'Limited time offer'"
- Max: 50 chars
- Highlighted in copy if provided

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATE BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-width gradient button
Text: "Generate Ad Copy"
Icon: 📝
Loading: "Creating high-converting ads..."

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULTS HEADER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Your Ad Copy Variations (5 Generated)"

Best Performing: Ad #2 (Score: 9.1/10)

Quick Actions:
- Copy All 5 Ads
- Export as CSV
- Regenerate
- Save Winners

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AD VARIATION CARDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ AD VARIATION #1: Benefit-Focused        │
│ Conversion Score: 8.8/10 ⭐⭐⭐⭐        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 📰 HEADLINE (40 chars)                  │
│ Work Smarter With AI                    │
│                                         │
│ 📝 PRIMARY TEXT (125 chars)             │
│ Tired of repetitive tasks eating up     │
│ your time? Our AI productivity app      │
│ automates your daily workflow and saves │
│ you 10+ hours every week. Focus on what │
│ matters most.                           │
│                                         │
│ 📢 CALL-TO-ACTION                       │
│ Try It Free →                           │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 📊 AD PREVIEW:                          │
│ ┌───────────────────────────────────┐  │
│ │ [Image placeholder]                │  │
│ │                                    │  │
│ │ Work Smarter With AI               │  │
│ │                                    │  │
│ │ Tired of repetitive tasks eating   │  │
│ │ up your time? Our AI productivity  │  │
│ │ app automates your daily workflow  │  │
│ │ and saves you 10+ hours every week.│  │
│ │                                    │  │
│ │ [Try It Free →]                    │  │
│ └───────────────────────────────────┘  │
│                                         │
│ ✅ ANALYSIS:                            │
│                                         │
│ Conversion Potential: High              │
│ • Strong benefit (saves 10 hours)       │
│ • Clear pain point (repetitive tasks)   │
│ • Specific outcome (what you get)       │
│ • Low-barrier CTA (free trial)          │
│                                         │
│ Character Counts:                       │
│ ✓ Headline: 20/40 chars                 │
│ ✓ Body: 125/125 chars (perfect!)        │
│ ✓ Mobile optimized                      │
│                                         │
│ Emotional Triggers:                     │
│ • Pain point (tired of...)              │
│ • Time saving (10 hours)                │
│ • Freedom (focus on what matters)       │
│                                         │
│ When to Use:                            │
│ • Cold traffic                          │
│ • Awareness campaigns                   │
│ • Broad targeting                       │
│                                         │
│ A/B Test Against: #3, #5                │
│                                         │
│ [📋 Copy Ad] [✏️ Edit] [⭐ Mark Winner] │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ AD VARIATION #2: Social Proof           │
│ Conversion Score: 9.1/10 ⭐⭐⭐⭐⭐ BEST  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 📰 HEADLINE                             │
│ Join 50,000+ Productive Entrepreneurs   │
│                                         │
│ 📝 PRIMARY TEXT                         │
│ See why thousands of entrepreneurs are  │
│ ditching manual work for AI automation. │
│ Our app saves an average of 12 hours    │
│ per week. "Game-changer for my          │
│ business!" - Sarah K., Founder          │
│                                         │
│ 📢 CALL-TO-ACTION                       │
│ Start Free Trial →                      │
│                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ ✅ ANALYSIS:                            │
│                                         │
│ Conversion Potential: Very High         │
│ • Social proof (50,000 users)           │
│ • Testimonial quote (credibility)       │
│ • Specific metric (12 hours/week)       │
│ • Bandwagon effect                      │
│                                         │
│ Why This Scores Highest:                │
│ • Uses concrete numbers                 │
│ • Includes testimonial                  │
│ • Creates FOMO (others using it)        │
│ • Specific time savings                 │
│                                         │
│ When to Use:                            │
│ • Retargeting campaigns                 │
│ • Warm audiences                        │
│ • Consideration stage                   │
│                                         │
│ [📋 Copy Ad] [✏️ Edit] [⭐ Mark Winner] │
└─────────────────────────────────────────┘

[Similar cards for Ads #3, #4, #5]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPARISON TABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quick comparison view:

| Ad | Score | Approach      | Best For        |
|----|-------|---------------|-----------------|
| #1 | 8.8   | Benefit       | Cold traffic    |
| #2 | 9.1   | Social proof  | Retargeting ⭐  |
| #3 | 8.5   | Problem/solve | Awareness       |
| #4 | 8.7   | Urgency/FOMO  | Limited offers  |
| #5 | 8.6   | Feature-focus | Product launch  |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A/B TESTING RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🧪 RECOMMENDED A/B TESTS                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ TEST 1: Social Proof vs Benefit         │
│ A: Ad #2 (social proof)                 │
│ B: Ad #1 (benefit-focused)              │
│                                         │
│ Hypothesis: Social proof will win for   │
│ warm traffic, benefit for cold          │
│                                         │
│ TEST 2: Headline Length                 │
│ A: Short headline (20 chars)            │
│ B: Long headline (35 chars)             │
│                                         │
│ TEST 3: CTA Variation                   │
│ A: "Try It Free"                        │
│ B: "Start Free Trial"                   │
│ C: "Get Started"                        │
│                                         │
│ Expected Results:                       │
│ • Social proof typically +15-25% CTR    │
│ • Specific numbers improve conversion   │
│ • Free trial CTAs outperform generic    │
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AD COPYWRITING BEST PRACTICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Expandable section:

✅ WHAT MAKES GREAT AD COPY:

Headlines:
• Clear benefit or hook
• 5-10 words maximum
• Include numbers when possible
• Create curiosity
• Address pain point

Body Copy:
• Lead with benefit, not features
• Use "you" language (customer-focused)
• Include social proof when available
• Specific numbers beat vague claims
• Address objections
• Keep it scannable (short paragraphs)

Call-to-Action:
• Action-oriented verbs
• Create urgency when appropriate
• Low barrier to entry
• Benefit-focused
• Examples: "Start Free Trial", "Get 50% Off"

Platform-Specific:
Facebook/Instagram:
- Stop the scroll (strong hook)
- Mobile-first (short sentences)
- Emoji okay (use sparingly)
- 125 chars primary text ideal

Google Ads:
- Match search intent
- Include keyword in headline
- Specific offer/benefit
- 30 char headline limit

Common Mistakes:
✗ Too much text (trim it down)
✗ Features instead of benefits
✗ Weak CTA ("Learn More")
✗ No social proof
✗ Generic messaging
✗ Missing urgency

=== WEBLLM PROMPTS ===

System Prompt:
```
You are an expert digital advertising copywriter with 10+ years of experience creating high-converting ad copy for Facebook, Instagram, Google Ads, and other platforms.

Your expertise includes:
- Direct response copywriting
- Conversion rate optimization
- Platform-specific ad formats
- A/B testing strategies
- Audience psychology
- Benefit-driven messaging
- Call-to-action optimization
- Social proof integration

You write ad copy that:
- Hooks attention immediately
- Focuses on benefits over features
- Uses specific numbers and proof
- Includes clear calls-to-action
- Matches platform best practices
- Speaks directly to target audience
- Creates urgency when appropriate
- Optimizes for character limits

You understand:
- Different platforms require different approaches
- Mobile-first is essential
- Specificity beats vagueness
- Social proof increases conversion
- Testing multiple variations is crucial
```

User Prompt Template:
```
Generate 5 high-converting ad copy variations.

PRODUCT/SERVICE:
{productDescription}
USP: {usp}
Pain Point: {painPoint}

TARGET AUDIENCE:
{targetAudience}

PLATFORM: {platform}
Format: {adFormat}
Tone: {tone}
Campaign Goal: {campaignGoal}
Special Offer: {specialOffer}

REQUIREMENTS:

STRUCTURE (for each ad):
1. Headline (attention-grabbing, 5-10 words)
2. Primary Text (benefit-focused, 100-150 chars for social)
3. Call-to-Action (action-oriented)

CHARACTER LIMITS:
{if platform === 'facebook'}
- Headline: 40 chars max
- Primary text: 125 chars recommended
- Short and punchy

{if platform === 'instagram'}
- Headline: 40 chars max
- Primary text: 125 chars recommended
- Mobile-optimized, visual-first

{if platform === 'google'}
- Headline: 30 chars max
- Description: 90 chars max
- Keyword-focused

GENERATE 5 VARIATIONS WITH DIFFERENT ANGLES:

Variation 1: Benefit-Focused
- Lead with primary benefit
- Specific outcome
- Clear value proposition

Variation 2: Social Proof
- Include numbers (users, ratings, etc.)
- Testimonial or statistic
- Bandwagon effect

Variation 3: Problem/Solution
- Start with pain point
- Present solution
- Transformation promise

Variation 4: Urgency/FOMO
- Time-sensitive offer
- Scarcity element
- Limited availability

Variation 5: Feature Highlight
- Unique differentiator
- Specific functionality
- "How it works" angle

For EACH variation include:
- Headline
- Primary text
- CTA
- Conversion score estimate (0-10)
- Why this angle works
- When to use it

TONE GUIDELINES:
{tone-specific instructions}

OUTPUT FORMAT:
AD #1: [Angle Type]
Headline: [Text]
Primary Text: [Text]
CTA: [Text]
Score: X/10
Analysis: [Why it works]

Generate 5 complete, platform-optimized ad variations ready for testing.
```

=== SPECIAL FEATURES ===

1. **Character Counter:**
   - Real-time count
   - Platform limits
   - Color coding (green/yellow/red)

2. **Conversion Scorer:**
   - AI-powered scoring
   - Based on copywriting best practices
   - Comparison across variations

3. **Platform Previews:**
   - See ad as it appears on platform
   - Mobile and desktop views
   - Visual mockups

4. **Ad Library:**
   - Save winning ads
   - Track performance
   - Reuse successful copy

5. **Competitor Analysis:**
   - Paste competitor ads
   - Get improvement suggestions
   - Learn from their approach

6. **Bulk Generation:**
   - Multiple products at once
   - Campaign-level creation
   - Export all at once

=== SEO ARTICLE SECTION ===

Title: "How to Write High-Converting Ad Copy: Complete Guide 2026"

=== SUCCESS METRICS ===

Expected Performance:
- Month 1: 7k-12k users
- Month 3: 28k-45k users
- Month 6: 65k-110k users

Build this as THE ad copy tool for marketers.
```
