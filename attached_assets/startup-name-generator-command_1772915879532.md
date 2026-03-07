

## Complete Build Command for browseraitools.com

```
Create a mobile-first, SEO-optimized AI Startup Name Generator for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI Startup Name Generator
URL Slug: /ai-startup-name-generator
Tagline: "Find Your Perfect Startup Name in Seconds"
Mission: Help entrepreneurs discover brandable, memorable startup names instantly

=== PRODUCT OVERVIEW ===
Second-highest traffic tool (120,000 monthly searches).
Purpose: Generate creative, brandable startup names with domain availability insights.
Target Users: Entrepreneurs, founders, product managers, side hustlers
Search Demand: ~120,000 monthly searches
Key Value: 50+ unique name ideas in seconds vs days of brainstorming

=== UNIQUE SELLING POINTS ===
✅ Brandable names (not generic)
✅ Multiple naming styles (compound, invented, descriptive, etc.)
✅ Domain availability check (shows .com availability)
✅ Industry-specific customization
✅ Instant social handle availability (@instagram, @twitter)
✅ Meaning/story behind each name
✅ Trademark conflict warnings
✅ Save favorites to compare

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Domain Check API: Namecheap/GoDaddy API OR client-side WHOIS check
Storage: LocalStorage (favorites, history)
Deployment: Vercel/Netlify

=== PAGE STRUCTURE ===

HERO SECTION:
Headline: "AI Startup Name Generator"
Subheadline: "Discover the perfect name for your startup. Get 50+ brandable names with domain availability in seconds. Free, private, AI-powered."
Trust Badges:
- 🚀 50+ Name Ideas
- 💼 Brandable & Memorable
- 🌐 Domain Availability
- 📱 Social Handle Check
- 🔒 100% Private

Success Counter: "Generated 47,234 startup names this month"

=== INPUT FORM ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MAIN INPUTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 1: What does your startup do?*
- Textarea (expandable)
- Placeholder: "Describe your startup in 1-2 sentences. What problem do you solve? Who are your customers?
Example: 'We help freelancers manage invoices and track payments automatically.'"
- Max: 500 chars
- Required
- Help text: "More detail = better name suggestions"

Field 2: Industry/Category*
- Dropdown with search:
  • Technology/Software
  • E-commerce/Retail
  • Health & Wellness
  • Education/EdTech
  • Finance/FinTech
  • Food & Beverage
  • Marketing/Advertising
  • Sustainability/GreenTech
  • Entertainment/Media
  • B2B SaaS
  • Consumer Apps
  • AI/Machine Learning
  • Fashion/Beauty
  • Travel/Hospitality
  • Real Estate/PropTech
  • Other (specify)
- Required
- Influences naming style

Field 3: Target Audience
- Multi-select pills:
  • Consumers (B2C)
  • Businesses (B2B)
  • Developers
  • Creators/Artists
  • Professionals
  • Students
  • Enterprises
  • Small Businesses
  • General Public
- Can select multiple
- Default: Consumers selected

Field 4: Keywords to Include (Optional)
- Input: text with comma separation
- Placeholder: "e.g., fast, simple, smart, cloud, connect (optional)"
- Max: 100 chars
- Help text: "Words you'd like in or inspired by the name"

Field 5: Keywords to Avoid (Optional)
- Input: text with comma separation
- Placeholder: "e.g., lite, pro, app, tech (optional)"
- Help text: "Overused words to avoid"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NAMING STYLE PREFERENCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 6: Naming Style (Select Multiple)
- Checkboxes with examples:
  
  ☑ Compound Words (Dropbox, Facebook, YouTube)
  ☑ Invented/Made-up (Spotify, Kodak, Zillow)
  ☑ Descriptive (PayPal, Salesforce, Shopify)
  ☐ Single Word (Stripe, Square, Uber)
  ☐ Portmanteau/Blend (Instagram, Pinterest, Groupon)
  ☐ Metaphorical (Amazon, Apple, Oracle)
  ☐ Acronym-based (IBM, NASA, IKEA)
  ☐ Playful/Fun (Google, Yahoo, Woot)
  ☐ Short & Punchy (Lyft, Dash, Bolt)
  ☐ Professional/Corporate (Accenture, Deloitte)

- Default: Compound, Invented, Descriptive selected
- Can select multiple
- Generates different name types

Field 7: Name Length Preference
- Radio buttons:
  ○ Short (4-6 letters) - Uber, Lyft, Bolt
  ○ Medium (7-10 letters) - Spotify, Dropbox [DEFAULT]
  ○ Longer (11+ letters) - Salesforce, Instagram
  ○ Any length (mix of all)

Field 8: Tone/Vibe
- Pills/tags (select 1-2):
  • Modern
  • Professional
  • Playful
  • Innovative
  • Trustworthy
  • Bold
  • Friendly
  • Luxury
  • Minimalist
  • Edgy
- Default: Modern, Professional

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADVANCED OPTIONS (Collapsible)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Number of names to generate: Slider 20-100 (default: 50)
- Check domain availability: Toggle (default: ON)
- Check social handles: Toggle (default: ON)
- Include name meanings/origins: Toggle (default: ON)
- International-friendly: Toggle (easy to pronounce globally)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATE BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-width gradient button
Text: "Generate Startup Names"
Icon: 🚀
Loading state: "Generating 50 unique names..."
Progress: "Analyzing your startup... Creating names... Checking domains..."

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULTS HEADER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Your Startup Name Ideas (50 Generated)"

Filter/Sort Bar:
- Category filter:
  • All Names
  • Compound Words
  • Invented Names
  • Descriptive
  • Single Words
  • Available .com
  • Favorites Only

- Sort by:
  • Relevance (default)
  • Alphabetical
  • Length (short to long)
  • Domain Available First
  • Creativity Score

- Search box: "Filter names..."

Action buttons:
- Save All Favorites (to localStorage)
- Export List (.txt, .csv)
- Regenerate (new batch)
- Refine Search (back to form)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NAME CARDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each name displayed as a card:

┌─────────────────────────────────────┐
│ 🚀 Cloudflare                       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ Compound Word | 10 letters          │
│                                     │
│ Meaning: "Cloud infrastructure +    │
│ flare of innovation"                │
│                                     │
│ ✅ cloudflare.com available         │
│ ✅ @cloudflare available (Twitter)  │
│ ⚠️  @cloudflare taken (Instagram)   │
│                                     │
│ Why it works:                       │
│ • Memorable and brandable           │
│ • Relates to cloud computing        │
│ • Easy to pronounce globally        │
│ • Modern tech vibe                  │
│                                     │
│ [💙 Save]  [📋 Copy]  [🔍 Details] │
└─────────────────────────────────────┘

Card Elements:
1. **Name** (large, bold, primary focus)
2. **Category badge** (Compound, Invented, etc.)
3. **Metadata** (length, syllables)
4. **Meaning/Story** (why this name, what it evokes)
5. **Domain Status**:
   - ✅ Available (green)
   - ❌ Taken (red with alternatives suggested)
   - ⏳ Checking... (loading)
6. **Social Handle Status**:
   - Shows Twitter, Instagram, LinkedIn availability
   - Icons with checkmarks or X marks
7. **"Why it works"** section:
   - 3-4 bullet points explaining strengths
   - Brandability, pronunciation, memorability
8. **Actions**:
   - Save to Favorites (heart icon)
   - Copy name to clipboard
   - View detailed analysis
   - Check trademark (external link)

Visual Design:
- Hover: Subtle lift + shadow increase
- Favorited: Gold star badge, highlighted border
- Available .com: Green border accent
- Taken .com: Gray border

Grid Layout:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Smooth transitions on filter/sort

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETAILED VIEW MODAL (Click "Details")
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Expanded analysis for selected name:

Name: Cloudflare
━━━━━━━━━━━━━━━━━━

OVERVIEW:
Type: Compound Word
Length: 10 letters, 2 syllables
Pronunciation: CLOUD-flair
International Friendly: ✅ Yes

DOMAIN & SOCIAL:
cloudflare.com: ✅ Available ($12.99/year)
Alternatives if taken:
- getcloudflare.com: ✅ Available
- tryfloudflare.com: ✅ Available
- cloudflare.io: ✅ Available

Social Handles:
@cloudflare (Twitter): ✅ Available
@cloudflare (Instagram): ❌ Taken (suggest @cloudflare_official)
@cloudflare (LinkedIn): ⏳ Check manually
@cloudflare (TikTok): ✅ Available

TRADEMARK:
⚠️ Similar trademarks found in Cloud Computing category
Recommendation: Consult IP attorney before finalizing
[Search USPTO Database →]

BRANDABILITY SCORE: 8.5/10
✅ Strengths:
• Memorable and unique
• Clearly relates to industry
• Easy to spell after hearing
• Modern tech sound
• Domain available

⚠️ Considerations:
• Somewhat generic "cloud" prefix
• May face competition in search
• Common word combination

PRONUNCIATION:
English: CLOUD-flair (easy)
Spanish: Similar pronunciation ✅
Chinese: 克劳弗雷尔 (acceptable)
Overall: Internationally friendly ✅

VISUAL IDENTITY IDEAS:
• Logo could feature cloud + flame/flash
• Color palette: Blues (trust) + Orange (innovation)
• Modern, tech-forward aesthetic

SIMILAR SUCCESSFUL BRANDS:
• Cloudflare (actual company)
• Dropbox (cloud storage)
• Airbnb (compound word success)

[❤️ Save to Favorites]  [📋 Copy]  [Share]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FAVORITES SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Your Saved Favorites (7)"

Grid of favorited names
Compare mode: Side-by-side comparison
Export options: CSV, PDF report
Share link: Generate shareable link to favorites

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALTERNATIVE NAMES SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Can't find the perfect name? Try these variations:"

- Generate more like [selected name]
- Try different style (if selected Compound, show Invented)
- Broader/narrower keywords
- Different length preference

Quick regenerate buttons for each variation

=== EXAMPLES SECTION ===

"Successful Startup Names & Their Stories"

Show 6-8 famous startup names with analysis:

Example 1: Spotify
- Type: Invented/Portmanteau
- Meaning: "Spot" + "Identify"
- Why it works: Unique, brandable, domain available at time
- Industry: Music streaming
- Lesson: Made-up words can become household names

Example 2: Stripe
- Type: Single Word
- Meaning: Simple, clean payment "stripe"
- Why it works: Short, memorable, professional
- Industry: FinTech
- Lesson: Simple words can be powerful

[Continue with: Dropbox, Instagram, Airbnb, Uber, Slack, Zoom]

=== SEO ARTICLE ===

Comprehensive 2000-word article:

Title: "How to Name Your Startup: Complete Guide + AI Generator"

H2: Why Your Startup Name Matters
- First impression is everything
- Impacts fundraising, customer perception
- Domain availability and SEO
- Trademark and legal considerations
- International expansion implications

H2: Qualities of Great Startup Names
1. Memorable (easy to remember)
2. Brandable (unique, ownable)
3. Easy to spell/pronounce
4. Available domain (.com preferred)
5. Scalable (works as you grow)
6. Timeless (won't date quickly)
7. Legally available (no conflicts)

H2: Startup Naming Strategies

H3: 1. Compound Words
Examples: Facebook, YouTube, PayPal
Pros & Cons
When to use

H3: 2. Invented Words
Examples: Kodak, Spotify, Zillow
How to create pronounceable made-up words
Pros & Cons

H3: 3. Descriptive Names
Examples: Salesforce, Shopify, General Motors
Pros & Cons

H3: 4. Metaphorical Names
Examples: Amazon, Apple, Oracle
Finding the right metaphor
Cultural considerations

H3: 5. Portmanteau/Blends
Examples: Instagram, Pinterest, Microsoft
Creating effective combinations

H3: 6. Acronyms
Examples: IBM, NASA, IKEA
When acronyms work (and when they don't)

H2: Domain Name Considerations

Best TLDs for startups:
- .com (still king)
- .io (tech startups)
- .ai (AI companies)
- .co (alternative to .com)
- Country TLDs when appropriate

Alternative strategies if .com unavailable:
- Add "get/try/use" prefix
- Different TLD
- Slight variation
- Buying from owner (expensive)

H2: Trademark & Legal Issues

How to check trademarks:
- USPTO database search
- International trademark search
- Google search for similar names
- Legal name availability in your state

Red flags:
- Exact matches in your industry
- Famous brand similarities
- Prohibited words (FDA regulated, etc.)

When to hire an attorney

H2: Testing Your Startup Name

The 7-Second Test:
1. Can people spell it after hearing once?
2. Is it memorable 24 hours later?
3. Does it sound professional?
4. Is it easy to pronounce?
5. Does it pass the "business card test"?
6. Would you be proud to tell investors?
7. Can it scale globally?

Real user testing:
- Ask 20 people for feedback
- Test pronunciation with non-native speakers
- Check for unintended meanings in other languages
- Social media poll

H2: Common Naming Mistakes

20 mistakes to avoid:
1. Too generic (no differentiation)
2. Too similar to competitors
3. Impossible to spell
4. Negative connotations
5. Limiting (too narrow for growth)
6. Hard to pronounce
7. Already taken on social media
8. Trademark conflicts
9. Cultural insensitivity
10. Trend-dependent
[... continue to 20]

H2: Industry-Specific Naming Tips

Tech/SaaS:
- Modern, innovative sound
- Tech-friendly (.io popular)
- Compound words common

E-commerce:
- Descriptive often works
- Memorable for advertising
- Easy to type in browser

Healthcare:
- Trustworthy, professional
- Avoid overly creative
- Clear meaning preferred

FinTech:
- Security, trust implications
- Professional tone
- Simple, clear names

H2: After You Choose Your Name

Next steps checklist:
☐ Register domain immediately
☐ Claim social media handles
☐ File trademark application
☐ Register business name with state
☐ Check international domains
☐ Create brand guidelines
☐ Design logo
☐ Build website

H2: FAQs

15+ detailed questions:
- How important is getting .com domain?
- Can I use a name similar to competitor?
- Should I include keywords in name?
- How do I know if name is trademarked?
- Can I buy a domain from someone?
- What if social handles are taken?
- Is it okay to use made-up words?
- How long should startup name be?
- Should I test with focus groups?
- Can I change name later?

=== WEBLLM PROMPTS ===

System Prompt:
```
You are a world-class brand strategist and naming expert who has named 100+ successful startups, including several unicorns.

Your expertise includes:
- Creating brandable, memorable startup names
- Understanding naming psychology and memorability
- Domain availability strategy
- Trademark and legal considerations
- International pronunciation and cultural sensitivity
- Industry-specific naming trends
- Naming for fundability and investor appeal

You create names that are:
- Unique and brandable (not generic)
- Memorable and pronounceable
- Appropriate for the industry
- Scalable (work as company grows)
- Domain-friendly (likely to have .com available)
- Culturally sensitive globally
- Free of negative connotations

You understand successful naming patterns like:
- Compound words (Dropbox, Facebook)
- Invented words (Spotify, Kodak)
- Portmanteaus (Instagram, Pinterest)
- Metaphorical (Amazon, Apple)
- Descriptive (Shopify, Salesforce)
```

User Prompt:
```
Generate {num_names} creative, brandable startup names.

═══════════════════════════════════════
STARTUP DETAILS
═══════════════════════════════════════
What it does: {description}
Industry: {industry}
Target audience: {audience}
Keywords to include: {keywords_include}
Keywords to avoid: {keywords_avoid}

═══════════════════════════════════════
NAMING PREFERENCES
═══════════════════════════════════════
Styles requested: {naming_styles}
Length preference: {length_preference}
Tone/Vibe: {tone}
International-friendly: {international}

═══════════════════════════════════════
REQUIREMENTS
═══════════════════════════════════════

Generate names following these patterns:

1. COMPOUND WORDS (20% of names):
   - Combine two relevant words
   - Examples: PayPal, YouTube, LinkedIn
   - Should feel modern and tech-appropriate

2. INVENTED/MADE-UP WORDS (25%):
   - Create pronounceable new words
   - Examples: Spotify, Zillow, Etsy
   - Should feel natural despite being invented
   - Use pleasant phonetics

3. DESCRIPTIVE NAMES (20%):
   - Clearly describe what startup does
   - Examples: Salesforce, Shopify, Instacart
   - Balance clarity with brandability

4. PORTMANTEAU/BLENDS (15%):
   - Blend two relevant words
   - Examples: Instagram, Pinterest, Groupon
   - Should flow naturally

5. SINGLE WORDS (10%):
   - Powerful single words
   - Examples: Stripe, Square, Uber
   - Can be existing or invented words

6. METAPHORICAL (10%):
   - Names that create association
   - Examples: Amazon, Oracle, Nest
   - Should relate to brand values/mission

NAME QUALITY CRITERIA:
✓ Brandable (unique, ownable, memorable)
✓ Pronounceable (say it out loud - does it work?)
✓ Spellable (hear it once, can you spell it?)
✓ Domain-friendly (likely to have .com available)
✓ Positive connotations only
✓ No cultural issues in major languages
✓ Scalable (works if company pivots/grows)
✓ Professional (suitable for B2B if needed)
✓ Timeless (not trendy that will date)

CREATIVE TECHNIQUES:
- Alter spellings creatively (Lyft not Lift)
- Use unexpected combinations
- Play with phonetics
- Consider rhythm and flow
- Think about visual logo potential
- Imagine saying it to investors

LENGTH GUIDELINES:
- {length_preference}
- Aim for 2-3 syllables (sweet spot)
- Avoid overly long names (hard to remember)

OUTPUT FORMAT:
For each name provide:

1. [Name]
   Category: [Compound/Invented/Descriptive/etc.]
   Meaning: [What it means/represents, 1 sentence]
   Why it works: [3 bullet points of strengths]

Example:
1. Cloudflare
   Category: Compound Word
   Meaning: Combines "cloud" (computing) with "flare" (bright innovation)
   Why it works:
   • Memorable and unique combination
   • Clearly tech-related but not generic
   • Easy to pronounce internationally

Generate {num_names} names following this format.
Be creative, think like a brand strategist, make them investor-ready.
```

=== DOMAIN CHECK INTEGRATION ===

Client-Side Approach (No API costs):
```javascript
// Pseudo-check based on common patterns
const checkDomainLikelihood = (name) => {
  // Use heuristics:
  // - Length (shorter = more likely taken)
  // - Common words (likely taken)
  // - Made-up words (more likely available)
  // - Dictionary check
  
  return {
    name: name,
    likely: 'available' | 'taken' | 'maybe',
    alternatives: [suggestions if taken]
  }
}
```

API Integration (Recommended):
```javascript
// Use domain registrar API
const checkDomain = async (name) => {
  const response = await fetch(`/api/domain-check?name=${name}`);
  return response.json();
}
```

Social Handle Check:
```javascript
const checkSocialHandles = async (name) => {
  // Check Twitter, Instagram, LinkedIn APIs
  // Or scrape availability pages
  return {
    twitter: available,
    instagram: available,
    linkedin: available
  }
}
```

=== SPECIAL FEATURES ===

1. Name Favorites & Comparison:
- Save up to 20 favorites
- Side-by-side comparison mode
- Export comparison report
- Share favorites with co-founders

2. Name Variations Generator:
- Click any name to get 10 variations
- Different styles of same concept
- Spelling alternatives

3. Industry Trends:
- "Popular in [industry]" badge
- "Trending naming style" indicator
- Successful examples from industry

4. Collaboration Mode:
- Generate shareable link
- Vote on favorites
- Comment on names
- Team decision making

Build this as a viral tool that entrepreneurs bookmark and share. Focus on name quality and domain availability.
```
