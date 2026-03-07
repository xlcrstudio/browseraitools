

## Complete Build Command for browseraitools.com

```
Create a mobile-first, SEO-optimized AI Hashtag Generator for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI Hashtag Generator
URL Slug: /ai-hashtag-generator
Tagline: "Grow Your Social Media with Perfect Hashtags"
Mission: Help creators and brands discover high-performing hashtags for maximum reach

=== PRODUCT OVERVIEW ===
High-traffic tool (90,000 monthly searches).
Purpose: Generate platform-optimized hashtag sets for Instagram, TikTok, LinkedIn, and Twitter.
Target Users: Social media managers, content creators, influencers, brands, marketing agencies
Search Demand: ~90,000 monthly searches
Key Value: 30 optimized hashtags in seconds vs hours of research

=== UNIQUE SELLING POINTS ===
✅ Platform-specific strategies (Instagram ≠ TikTok ≠ LinkedIn)
✅ Hashtags categorized by volume (high/medium/low)
✅ Copy-paste ready sets
✅ Trending hashtag detection
✅ Ban-safe (no shadowbanned hashtags)
✅ Community hashtag suggestions
✅ Alternative sets for A/B testing
✅ Performance predictions

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared instance)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (saved hashtag sets, favorites)
Export: Text, CSV
Deployment: Vercel/Netlify

=== INPUT FORM ===

Field 1: Content Description*
- Textarea
- Placeholder: "Describe your post/content (e.g., 'Morning coffee photo at downtown cafe', 'Fitness motivation video', 'Marketing tips for small business')"
- Max: 300 chars
- Required

Field 2: Platform*
- Checkboxes (can select multiple):
  ☑ Instagram (30 hashtags)
  ☐ TikTok (5-8 hashtags)
  ☐ LinkedIn (3-5 hashtags)
  ☐ Twitter (1-2 hashtags)
  ☐ All Platforms (optimized for each)
- Default: Instagram selected
- Required

Field 3: Niche/Category*
- Dropdown:
  • Fitness & Health
  • Food & Cooking
  • Travel & Adventure
  • Fashion & Beauty
  • Business & Entrepreneurship
  • Technology & Gadgets
  • Photography & Art
  • Lifestyle & Wellness
  • Parenting & Family
  • Education & Learning
  • [30+ categories]
- Required

Field 4: Account Size
- Radio:
  ○ Small (<10k followers)
  ○ Medium (10k-100k followers)
  ○ Large (100k+ followers)
- Default: Small
- Affects hashtag competition level

Field 5: Goal
- Multi-select pills:
  • Maximize Reach
  • Drive Engagement
  • Build Community
  • Grow Followers
  • Generate Sales
- Can select multiple

Advanced Options:
- Include trending hashtags: Toggle (default: ON)
- Include branded hashtags: Toggle (default: ON)
- Number of hashtags: Slider based on platform

Generate Button:
Text: "Generate Hashtags"
Icon: #️⃣
Loading: "Finding perfect hashtags..."

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COPY-PASTE READY SET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For Instagram (30 hashtags):
#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5
#hashtag6 #hashtag7 #hashtag8 #hashtag9 #hashtag10
[6 rows total]

[Copy All Button]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HASHTAGS BY CATEGORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 HIGH-VOLUME (Maximum Reach):
Expandable card showing:
#hashtag (2.5M posts) [Copy]
#hashtag (1.8M posts) [Copy]
#hashtag (900k posts) [Copy]

📊 MEDIUM-VOLUME (Sweet Spot):
[Similar format, 8-12 hashtags]

🎯 NICHE/TARGETED (Engaged Community):
[Similar format, 10-15 hashtags]

🌟 TRENDING (Current):
[Trending hashtags if available]

💼 COMMUNITY:
[Community/engagement hashtags]

🏷️ BRANDED:
[Your brand hashtags]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRATEGY NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Why These Hashtags:
• [Strategic explanation]
• [Mix of reach vs targeting]
• [Community building aspect]

Expected Results:
• Estimated Reach: [Range based on followers]
• Engagement Potential: High/Medium/Low
• Competition Level: [Assessment]

Tips:
• Rotate hashtags every 3-5 posts
• Track which drive most impressions
• Build library of top performers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALTERNATIVE SETS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Set A (Broader Reach):
[Different hashtag mix]

Set B (Niche Targeting):
[Different hashtag mix]

Set C (Trending Focus):
[Different hashtag mix]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HASHTAGS TO AVOID
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ #bannedhashtag - Shadowbanned
⚠️ #spamhashtag - Too spammy
⚠️ #overusedhashtag - No value for small accounts

=== WEBLLM PROMPTS ===

System Prompt:
```
You are a social media growth expert specializing in hashtag strategy across Instagram, TikTok, LinkedIn, and Twitter.

Your expertise includes:
- Hashtag research and trend analysis
- Platform-specific hashtag strategies
- Reach vs. engagement optimization
- Niche and branded hashtag discovery
- Hashtag competition analysis
- Viral content patterns
- Community building through hashtags
- Hashtag performance metrics

You create hashtag strategies that:
- Maximize reach and engagement
- Mix high-volume and niche hashtags
- Are relevant to content and audience
- Follow platform best practices
- Include trending and evergreen tags
- Avoid banned or spam hashtags
- Build community connection
- Drive discoverability

You understand:
- Instagram algorithm (30 hashtag limit, mix of sizes)
- TikTok hashtag trends and FYP algorithm
- LinkedIn professional hashtag usage (3-5 max)
- Twitter hashtag etiquette (1-2 max)
- The balance between reach and relevance
- How to avoid shadowbans
- Hashtag saturation levels
```

User Prompt Template:
```
Generate optimized hashtags for social media growth.

CONTENT DETAILS:
Platform: {platform}
Content: {content}
Niche: {niche}
Target Audience: {targetAudience}
Content Type: {contentType}
Account Size: {accountSize}
Goals: {goals}
Number of Hashtags: {numHashtags}

HASHTAG STRATEGY REQUIREMENTS:

HASHTAG MIX (Balanced Approach):

INSTAGRAM STRATEGY (30 hashtags):
• 3-5 High-Volume hashtags (500k-5M posts) - Maximum reach
• 8-12 Medium-Volume hashtags (50k-500k posts) - Sweet spot
• 10-15 Low-Volume hashtags (1k-50k posts) - Highly targeted
• 2-3 Niche-Specific hashtags (Your specific community)
• 1-2 Branded hashtags (Your brand or campaign)

TIKTOK STRATEGY (5-8 hashtags):
• 1-2 Trending hashtags (Current viral tags)
• 2-3 Niche hashtags (Your content category)
• 1-2 Broad discovery hashtags (#fyp, #foryou, #viral)
• 1 Specific descriptive hashtag

LINKEDIN STRATEGY (3-5 hashtags):
• 2-3 Industry-specific hashtags
• 1-2 Skill/topic hashtags
• Professional, not casual
• Avoid overused generic tags

TWITTER STRATEGY (1-2 hashtags):
• Trending hashtags (if relevant)
• Community/campaign hashtags
• Keep minimal for readability

HASHTAG CATEGORIES:

1. PRIMARY HASHTAGS (Core Content)
2. SECONDARY HASHTAGS (Related Topics)
3. COMMUNITY HASHTAGS
4. TRENDING HASHTAGS (If Relevant)
5. BRANDED HASHTAGS

QUALITY CRITERIA:
✓ Relevance: Must relate directly to content
✓ Search-ability: People actively searching these
✓ Competition Level: Mix of competitive and achievable
✓ Ban-Safe: No shadowbanned or spam hashtags
✓ Spelling: Correct spelling, no typos
✓ Specificity: Balanced between broad and niche

AVOID:
✗ Banned/shadowbanned hashtags
✗ Spam hashtags (#like4like, #follow4follow)
✗ Irrelevant trending tags
✗ Too generic (#love, #instagood alone)
✗ Broken or misspelled hashtags

OUTPUT FORMAT:

HASHTAG STRATEGY: {content}

RECOMMENDED HASHTAG SET:
[Copy-paste ready hashtag list with all hashtags]

HASHTAGS BY CATEGORY:

🔥 HIGH-VOLUME (Maximum Reach):
#hashtag (2.5M posts)
[Continue]

📊 MEDIUM-VOLUME (Sweet Spot):
[Continue]

🎯 NICHE/TARGETED:
[Continue]

🌟 TRENDING (Current):
[If applicable]

💼 COMMUNITY/ENGAGEMENT:
[Community hashtags]

🏷️ BRANDED:
[Brand hashtags]

STRATEGY NOTES:
[Why these hashtags work]
[Performance predictions]
[Tips for usage]

ALTERNATIVE SETS:
[2-3 alternative hashtag combinations]

HASHTAGS TO AVOID:
[Banned or spam hashtags to skip]

Generate {numHashtags} highly-optimized, relevant hashtags organized by strategy.
```

=== SEO ARTICLE ===

"How to Use Hashtags: Complete Guide for Instagram, TikTok & More"

[2000-word article covering hashtag strategy, best practices, platform differences]

=== SPECIAL FEATURES ===

1. **Hashtag Library:**
   - Save successful hashtag sets
   - Organize by platform/niche
   - Track performance notes
   - Quick copy previous sets

2. **Performance Tracker:**
   - Log which sets perform best
   - Note impressions/engagement
   - Learn from top performers

3. **Banned Hashtag Checker:**
   - Verify hashtags aren't shadowbanned
   - Alert if risky hashtags detected
   - Suggest safe alternatives

Build this as the essential hashtag tool for social media growth.
```
