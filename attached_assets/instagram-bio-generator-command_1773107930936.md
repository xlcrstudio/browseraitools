

## Complete Build Command for browseraitools.com

```
Create a mobile-first, Instagram-optimized AI Bio Generator for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI Instagram Bio Generator
URL Slug: /ai-instagram-bio-generator
Tagline: "Create the Perfect Instagram Bio That Gets Followers"
Mission: Help creators, influencers, and brands craft compelling Instagram bios that attract followers and express personality

=== PRODUCT OVERVIEW ===
HIGH-DEMAND social media tool.
Purpose: Generate creative, engaging Instagram bios with perfect formatting, emojis, and personality that fit the 150-character limit.
Target Users: Influencers, content creators, small businesses, personal brands, social media managers
Search Demand: 60,000-100,000 monthly searches
- "Instagram bio generator" - 50k/month
- "Instagram bio ideas" - 30k/month
- "AI bio generator" - 15k/month
- "aesthetic Instagram bio" - 10k/month

Key Value: 5 perfect Instagram bios in 30 seconds vs hours of brainstorming

=== UNIQUE SELLING POINTS ===
✅ 150-CHARACTER OPTIMIZED - Fits Instagram limit perfectly
✅ 5 VARIATIONS - Multiple styles to choose from
✅ EMOJI INTEGRATION - Strategic emoji placement
✅ NICHE-SPECIFIC - Tailored to your industry/category
✅ TONE OPTIONS - Professional, fun, aesthetic, minimal, etc.
✅ LINE BREAK FORMATTING - Perfect visual structure
✅ LINK IN BIO TEXT - Optimized call-to-action
✅ MOBILE PREVIEW - See how it looks in Instagram app
✅ AESTHETIC OPTIONS - Trendy formatting styles

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared instance)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (saved bios, favorites)
Export: Text, formatted for Instagram
Deployment: Vercel/Netlify

=== PAGE STRUCTURE ===

HERO SECTION:
Headline: "AI Instagram Bio Generator"
Subheadline: "Create the perfect Instagram bio in seconds. Generate 5 unique bio options with emojis, perfect formatting, and personality. Stand out and get more followers. Free and instant."

Trust Badges:
- 📱 150-Character Optimized
- ✨ 5 Unique Variations
- 😊 Smart Emoji Placement
- 🎨 Aesthetic Formatting Options
- 💼 Niche-Specific Bios
- 🔒 100% Private

Success Counter: "Generated 567,890 Instagram bios this month"

Why Your Instagram Bio Matters:
"Your Instagram bio is the first thing people see. It's your chance to:
• Make a strong first impression
• Show your personality or brand
• Tell people what you do
• Get followers to click your link
• Stand out from millions of accounts

With only 150 characters, every word counts!"

[Show examples of great Instagram bios with follower counts]

=== INPUT FORM ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABOUT YOU/YOUR BRAND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 1: Name/Brand*
- Input: text
- Placeholder: "e.g., Alex, Sarah's Kitchen, TechTips, FitLife Coaching"
- Max: 50 chars
- Required
- Help text: "Your name or business name"

Field 2: What Do You Do?*
- Input: text
- Placeholder: "e.g., Travel photographer, Fitness coach, Coffee shop owner, Marketing consultant"
- Max: 100 chars
- Required
- Help text: "Your profession, passion, or what your brand does"

Field 3: Niche/Category*
- Visual category cards:

  ○ ✈️ Travel
  ○ 💪 Fitness & Health
  ○ 🎨 Art & Design
  ○ 💼 Business & Entrepreneurship
  ○ 👗 Fashion & Style
  ○ 💄 Beauty & Makeup
  ○ 🍔 Food & Cooking
  ○ 📸 Photography
  ○ 💻 Tech & Software
  ○ 🎵 Music & Entertainment
  ○ 📚 Education & Learning
  ○ 🏠 Lifestyle & Home
  ○ 🐾 Pets & Animals
  ○ ⚽ Sports & Athletics
  ○ 👨‍👩‍👧 Parenting & Family
  ○ 🌱 Wellness & Mindfulness
  ○ 🎮 Gaming
  ○ 📝 Writing & Content Creation
  ○ 🎬 Video & Film
  ○ 💰 Finance & Investing
  ○ 🌍 Sustainability & Eco
  ○ 🔧 DIY & Crafts
  ○ 🎭 Personal Brand
  ○ 🏢 Company/Brand

- Required
- Affects emoji and style suggestions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BIO STYLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 4: Bio Tone/Style*
- Large visual cards with examples:

  ○ 💼 Professional
    "Polished and credible - B2B focused"
    Example: "Marketing Strategist | Helping brands grow
    10+ years experience | Speaker"
  
  ○ 🎉 Fun & Playful
    "Energetic and approachable - personality-driven"
    Example: "Coffee addict ☕ | Dog mom 🐕
    Making people laugh since '95 😂"
  
  ○ 🌸 Aesthetic/Minimal
    "Clean, artistic, trendy - visual appeal"
    Example: "photographer 📷
    capturing moments
    based in NYC ✨"
  
  ○ 😊 Friendly & Approachable
    "Warm and relatable - builds connection"
    Example: "Hey! I'm Sarah 👋
    Sharing my wellness journey
    Let's grow together! 🌱"
  
  ○ 💪 Motivational/Inspiring
    "Empowering and uplifting"
    Example: "Empowering you to live your best life 🌟
    Fitness & mindset coach
    Your transformation starts here"
  
  ○ 🎯 Direct & Clear
    "Straightforward and informative"
    Example: "Freelance Graphic Designer
    Logo & Brand Identity
    📧 hello@email.com"

- Default: Friendly
- Required

Field 5: Emoji Usage*
- Radio:
  ○ Lots (Multiple emojis, visual appeal)
  ○ Moderate (Strategic placement) [DEFAULT]
  ○ Minimal (1-2 emojis only)
  ○ None (No emojis, text only)
- Default: Moderate

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADDITIONAL INFO (Optional)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 6: Location (Optional)
- Input: text
- Placeholder: "e.g., NYC, Los Angeles, Based in Tokyo"
- Max: 30 chars
- Optional
- Checkbox: ☐ Include location pin emoji 📍

Field 7: What Makes You Unique?
- Textarea
- Placeholder: "What sets you apart? Any accomplishments, quirks, or unique angles?
e.g., 'Featured in Forbes', 'Traveled to 50 countries', 'Self-taught coder'"
- Max: 150 chars
- Optional
- Help text: "This helps create more personalized bios"

Field 8: Include in Bio (Multi-select)
- Checkboxes:
  ☐ Your age/year (e.g., "Born in '95")
  ☐ Achievements/credentials
  ☐ Mission statement
  ☐ Call-to-action (check link, DM, etc.)
  ☐ Contact email
  ☐ Hashtag/branded tag

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADVANCED OPTIONS (Collapsible)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Link in Bio Text:
- Input: text
- Placeholder: "e.g., 👇 Check out my latest video, 🔗 Shop my looks, 📧 Free guide below"
- Optional
- Commonly included in bios

Special Characters:
- Toggles:
  ☐ Include line breaks (aesthetic formatting)
  ☐ Use symbols (→ • | ↓ ✨)
  ☐ Centered text (aesthetic style)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATE BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-width gradient button
Text: "Generate Instagram Bios"
Icon: ✨
Loading: "Creating perfect bios..."

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULTS HEADER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Your Instagram Bio Options (5 Generated)"

Quick Actions:
- Copy All 5 Bios
- Save Favorites
- Regenerate
- Try Different Style

Filter:
- All (5)
- With Emojis
- Professional
- Aesthetic
- Shortest (<100 chars)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BIO CARDS (5 variations)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each bio displayed as card with mobile preview:

┌─────────────────────────────────────────┐
│ BIO #1: Friendly & Engaging              │
│ Style: Fun • Length: 142 characters     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ INSTAGRAM PREVIEW:                      │
│ ┌───────────────────────────────────┐  │
│ │ 📱 Instagram Bio Preview           │  │
│ │ ─────────────────────────────────  │  │
│ │                                    │  │
│ │ Coffee lover ☕ | Travel addict ✈️ │  │
│ │ Capturing the world one photo at a │  │
│ │ time 📸                            │  │
│ │ 50+ countries & counting 🌍        │  │
│ │ 📍 Based in NYC                    │  │
│ │                                    │  │
│ └───────────────────────────────────┘  │
│                                         │
│ PLAIN TEXT (Easy Copy):                 │
│ ─────────────────────────────────────  │
│ Coffee lover ☕ | Travel addict ✈️      │
│ Capturing the world one photo at a     │
│ time 📸                                 │
│ 50+ countries & counting 🌍             │
│ 📍 Based in NYC                         │
│ ─────────────────────────────────────  │
│                                         │
│ 📊 BIO ANALYSIS:                        │
│ • Characters: 142/150 ✅                │
│ • Emojis: 5 (perfect balance)          │
│ • Lines: 5 (good visual structure)     │
│ • Personality: High                    │
│ • Memorability: Strong                 │
│                                         │
│ ✨ Why This Works:                      │
│ • Opens with personality (coffee, travel)│
│ • Shows what you do (photography)      │
│ • Includes impressive stat (50 countries│
│ • Location adds context                │
│ • Emojis make it visually appealing    │
│                                         │
│ Best For:                               │
│ • Travel content creators               │
│ • Lifestyle photographers               │
│ • Personal brand building               │
│                                         │
│ [📋 Copy Bio] [💖 Favorite] [📱 Preview]│
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ BIO #2: Professional & Credible          │
│ Style: Professional • Length: 138 chars │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Travel Photographer 📸                  │
│ Featured in Nat Geo & Condé Nast        │
│ Workshops & prints available            │
│ 📍 NYC | 🌍 Working worldwide           │
│ 👇 Shop my work                         │
│                                         │
│ ─────────────────────────────────────  │
│                                         │
│ Why This Works:                         │
│ • Leads with profession                 │
│ • Establishes credibility (publications)│
│ • Clear offerings (workshops, prints)   │
│ • Call-to-action (shop)                 │
│ • Professional yet approachable         │
│                                         │
│ Best For:                               │
│ • Established professionals             │
│ • Selling products/services             │
│ • Building authority                    │
│                                         │
│ [📋 Copy Bio] [💖 Favorite]             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ BIO #3: Aesthetic & Minimal              │
│ Style: Aesthetic • Length: 98 chars     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│         photographer 📷                 │
│      chasing golden hours               │
│       currently in nyc                  │
│           ✨                            │
│                                         │
│ ─────────────────────────────────────  │
│                                         │
│ Why This Works:                         │
│ • Clean, minimalist aesthetic           │
│ • Centered text (trendy style)          │
│ • Poetic language                       │
│ • Less commercial, more artistic        │
│ • Stands out visually                   │
│                                         │
│ Note: Centered text requires spaces     │
│ (Instagram doesn't support true center) │
│                                         │
│ Best For:                               │
│ • Artists and creatives                 │
│ • Aesthetic-focused accounts            │
│ • Building artistic brand               │
│                                         │
│ [📋 Copy Bio] [💖 Favorite]             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ BIO #4: Direct & Action-Oriented         │
│ Style: Direct • Length: 125 chars       │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ 📸 Travel Photography                   │
│ 🎓 Teaching photo workshops             │
│ 🌍 50+ countries documented             │
│ 👇 Free travel photography guide        │
│ ↓ Link below                            │
│                                         │
│ ─────────────────────────────────────  │
│                                         │
│ Why This Works:                         │
│ • Clear bullet structure                │
│ • Easy to scan quickly                  │
│ • Multiple value propositions           │
│ • Strong CTA (free guide)               │
│ • Link direction clear                  │
│                                         │
│ Best For:                               │
│ • Lead generation                       │
│ • Multiple offerings                    │
│ • Clear calls-to-action needed          │
│                                         │
│ [📋 Copy Bio] [💖 Favorite]             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ BIO #5: Story-Driven                     │
│ Style: Friendly • Length: 145 chars     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Hey! I'm Alex 👋                        │
│ Left my 9-5 to travel the world 🌍      │
│ Now helping others do the same          │
│ 📸 Travel tips & photography            │
│ 💌 Collab: alex@email.com               │
│                                         │
│ ─────────────────────────────────────  │
│                                         │
│ Why This Works:                         │
│ • Personal introduction                 │
│ • Relatable transformation story        │
│ • Shows value (helping others)          │
│ • Clear contact for partnerships        │
│ • Conversational and warm               │
│                                         │
│ Best For:                               │
│ • Personal brands                       │
│ • Building connection                   │
│ • Influencer collaborations             │
│                                         │
│ [📋 Copy Bio] [💖 Favorite]             │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTAGRAM BIO BEST PRACTICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Expandable info panel:

✅ INSTAGRAM BIO OPTIMIZATION:

Character Limit:
• Maximum: 150 characters
• Every character counts!
• Include line breaks in character count
• Emojis count as 1-2 characters
• Plan carefully what to include

First Line Critical:
• Most important information first
• Who you are or what you do
• Hook people immediately
• This shows in previews

Emoji Strategy:
• Visual appeal and personality
• Break up text
• Highlight key points
• Don't overdo it (3-7 is sweet spot)
• Use relevant emojis for your niche

Line Breaks:
• Make bio scannable
• Better visual structure
• 3-5 lines typically works
• Mobile-friendly formatting

Include:
✓ Who you are/what you do
✓ Your unique value
✓ Call-to-action if relevant
✓ Location (if important)
✓ Contact method (if business)
✓ Link direction ("👇 Link below")

Common Mistakes:
✗ Too generic ("Living my best life")
✗ Unclear what you do
✗ Too many emojis (overwhelming)
✗ No clear purpose/value
✗ Missing call-to-action
✗ Not using line breaks
✗ Trying to say too much

=== WEBLLM PROMPTS ===

System Prompt:
```
You are a social media branding expert specializing in Instagram profile optimization and personal branding.

Your expertise includes:
- Instagram bio optimization
- Personal branding and positioning
- Social media copywriting
- Emoji strategy and visual appeal
- Character limit optimization (150 chars)
- Niche-specific language and trends
- Call-to-action formulation
- Profile conversion optimization

You create Instagram bios that:
- Capture personality in 150 characters
- Are immediately clear and engaging
- Use emojis strategically (not excessively)
- Include proper line breaks for readability
- Match the user's niche and audience
- Stand out from generic bios
- Include relevant calls-to-action
- Drive profile engagement
- Are mobile-optimized and scannable

You understand:
- Instagram's character limit (150 chars)
- Different bio styles (professional, aesthetic, fun, minimal)
- Niche-specific language and emojis
- What makes bios memorable and clickable
- Balance between personality and clarity
- The importance of the first line
- How to optimize for different goals (followers, sales, awareness)
```

User Prompt Template:
```
Generate 5 unique Instagram bio options.

═══════════════════════════════════════
USER INFORMATION
═══════════════════════════════════════
Name/Brand: {name}
What You Do: {whatYouDo}
Niche/Category: {niche}
Bio Style: {bioStyle}
Emoji Usage: {emojiUsage}

Optional Details:
Location: {location}
Unique Qualities: {uniqueQualities}
Include: {includeElements}
Link in Bio Text: {linkInBioText}

═══════════════════════════════════════
BIO REQUIREMENTS
═══════════════════════════════════════

CHARACTER LIMIT:
• Strict maximum: 150 characters
• Count every character including spaces
• Line breaks count as characters
• Emojis count as 1-2 characters
• Stay well under limit (140-150 range)

STRUCTURE:

Line 1 (Most Important):
- Who you are OR what you do
- Most important information first
- Hook people immediately
- This line shows in search previews

Lines 2-4:
- Additional context
- Value proposition
- Achievements or unique qualities
- What makes you different

Final Line (Optional):
- Call-to-action
- Contact information
- Location
- Link direction

EMOJI USAGE:

{if emojiUsage === 'lots'}
Lots of Emojis (6-10):
• Use emojis frequently
• Multiple per line possible
• Visual and playful
• Match niche (travel: ✈️🌍, fitness: 💪🏋️)

{if emojiUsage === 'moderate'}
Moderate Emojis (3-5):
• Strategic placement
• Highlight key points
• Not overwhelming
• Professional yet engaging

{if emojiUsage === 'minimal'}
Minimal Emojis (1-2):
• Very selective
• Professional appearance
• Clean and simple
• Usually professional or business

{if emojiUsage === 'none'}
No Emojis:
• Text only
• Ultra-professional
• Minimal aesthetic
• Serious/corporate

BIO STYLE GUIDELINES:

{if bioStyle === 'professional'}
Professional:
• Credible and polished
• Clear value proposition
• Industry-appropriate language
• Accomplishments/credentials
• Contact method if business
• Example: "Marketing Strategist | Forbes Contributor | Helping brands grow"

{if bioStyle === 'fun'}
Fun & Playful:
• Personality-driven
• Humor and lightness
• Relatable and approachable
• Shows interests/quirks
• Example: "Dog mom 🐕 | Coffee addict ☕ | Making people smile since '95"

{if bioStyle === 'aesthetic'}
Aesthetic/Minimal:
• Clean and artistic
• Poetic or minimal language
• Visual appeal
• Often centered or spaced
• Lowercase style common
• Example: "photographer 📷\nchasing light\nbased in la ✨"

{if bioStyle === 'friendly'}
Friendly & Approachable:
• Warm and welcoming
• Second person ("you") optional
• Builds connection
• Personal introduction
• Example: "Hey! I'm Sarah 👋\nSharing my wellness journey\nLet's grow together 🌱"

NICHE-SPECIFIC ELEMENTS:

{niche} specific language:
- Use appropriate terminology
- Include niche-relevant emojis
- Match community expectations
- Reference common interests

Include Elements:
{if includeLocation}
• Location: {location}
• Use 📍 emoji if appropriate

{if includeAge}
• Age or year reference
• "Born in '95" or "25 | Creator"

{if includeAchievements}
• Credentials or achievements
• "Featured in X" or "100k+ community"

{if includeCTA}
• Call-to-action
• "DM for collabs" or "👇 Check link"

LINE BREAKS:
Use line breaks to:
• Separate ideas
• Improve scannability
• Create visual structure
• Make it mobile-friendly

Format example:
Line 1: Who you are
Line 2: What you do
Line 3: Unique value
Line 4: CTA or contact

QUALITY CHECKS:

✓ Under 150 characters?
✓ First line is strong and clear?
✓ Emojis match style request?
✓ Appropriate for niche?
✓ Line breaks improve readability?
✓ Unique and memorable?
✓ Clear value or personality?
✓ Would YOU click follow?

AVOID:
✗ Generic phrases ("Living my best life")
✗ Unclear what you do
✗ Too many emojis (overwhelming)
✗ Run-on sentences
✗ Clichés and overused phrases
✗ Going over character limit
✗ Trying to say too much

═══════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════

Generate 5 distinct bio options with different styles:

BIO #1 - [Style Type]:
[Complete bio - ready to copy]
Characters: [X/150]

BIO #2 - [Different style]:
[Complete bio - ready to copy]
Characters: [X/150]

[Continue for 5 bios]

Each bio should:
• Have unique approach or angle
• Stay under 150 characters
• Use appropriate emojis for style
• Include line breaks where helpful
• Be ready to copy-paste to Instagram
• Match the requested tone and niche

Variety across 5 bios:
- Different opening hooks
- Varying emoji usage
- Mix of formatting styles
- Different emphasis (personality vs credentials vs value)
- Range from shorter to near-limit length

Generate creative, engaging Instagram bios that make people want to follow.
```

=== SPECIAL FEATURES ===

1. **Character Counter:**
   - Real-time character count
   - Visual indicator (green/yellow/red)
   - Warning when approaching limit
   - Line break counter

2. **Mobile Preview:**
   - See exactly how bio looks in Instagram
   - Test different styles
   - Copy-paste ready
   - Screenshot functionality

3. **Emoji Picker:**
   - Browse by category
   - Trending emojis
   - Niche-specific suggestions
   - Copy individual emojis

4. **Bio Templates:**
   - Save successful bios
   - Industry-specific templates
   - Trending formats
   - Quick customization

5. **A/B Testing:**
   - Try different bios
   - Track follower growth
   - Note which performs best
   - Optimize over time

6. **Bio Elements Library:**
   - Common phrases by niche
   - Call-to-action templates
   - Achievement formats
   - Location formats

7. **Aesthetic Tools:**
   - Text centering helper
   - Special character library
   - Line break optimizer
   - Formatting presets

=== SEO ARTICLE SECTION ===

Below tool, comprehensive 2000-word article:

Title: "How to Write the Perfect Instagram Bio: Complete Guide 2026"

H2: Why Your Instagram Bio Matters
H2: Instagram Bio Character Limit (150 Chars)
H2: Essential Elements of a Great Bio
H2: Instagram Bio Ideas by Niche
H2: Emoji Strategy for Instagram Bios
H2: How to Format Your Bio (Line Breaks)
H2: Professional vs Personal Bio Styles
H2: Common Instagram Bio Mistakes
H2: Bio Examples That Get Followers
H2: How to Add Links to Your Bio
H2: Optimizing Your Bio for Business
H2: Updating Your Bio (When and How)
H2: FAQs (40+ questions)

=== SUCCESS METRICS ===

Expected Performance:
- Month 1: 10k-15k users
- Month 3: 40k-60k users
- Month 6: 90k-150k users

Build this as THE Instagram bio tool for creators and influencers.
```
