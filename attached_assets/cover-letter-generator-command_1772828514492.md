

## Complete Build Command for browseraitools.com

```
Create a mobile-first, SEO-optimized AI Cover Letter Generator for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI Cover Letter Generator
URL Slug: /ai-cover-letter-generator
Tagline: "Land Your Dream Job with AI-Powered Cover Letters"
Mission: Help job seekers create personalized, professional cover letters instantly

=== PRODUCT OVERVIEW ===
Highest-traffic tool in the suite (150,000 monthly searches).
Purpose: Generate customized, professional cover letters tailored to specific job applications.
Target Users: Job seekers, career changers, recent graduates, professionals
Search Demand: ~150,000 monthly searches
Key Value: Personalized cover letters in 30 seconds vs hours of writing

=== UNIQUE SELLING POINTS ===
✅ Personalized to job description (not generic templates)
✅ ATS-optimized (passes Applicant Tracking Systems)
✅ Multiple tone options (professional, enthusiastic, formal, creative)
✅ Export-ready (.txt, .docx formats)
✅ Industry-specific customization
✅ Experience level adaptation (entry-level, mid-career, senior, career change)

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState/useContext
LLM Engine: @mlc-ai/web-llm (shared instance)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (save drafts, preferences)
Export: Text download + optional DOCX generation
Deployment: Vercel/Netlify

WebLLM Integration:
- Reuse shared model instance
- Streaming for progressive display
- Save multiple drafts locally
- Version history in localStorage

=== PAGE STRUCTURE ===

HEADER (Shared Component):
- Logo: "Browser AI Tools"
- Breadcrumb: Home > Cover Letter Generator
- "100% Private • 100% Free" badge
- Navigation menu

HERO SECTION:
Headline: "AI Cover Letter Generator"
Subheadline: "Create personalized, professional cover letters in 30 seconds. Tailored to your job, experience, and skills. 100% free, 100% private."
Trust Badges: 
- 💼 ATS-Optimized
- 🎯 Personalized to Job
- 🔒 100% Private
- ⚡ Generated in Seconds
- 📄 Export as DOCX

Success Counter: "12,847 Cover Letters Generated Today"

=== MAIN TOOL INTERFACE ===

INPUT FORM (Progressive Disclosure - Step by Step):

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1: JOB DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 1: Job Title*
- Input: text
- Placeholder: "e.g., Senior Marketing Manager, Software Engineer, Sales Associate"
- Max: 100 chars
- Required
- Help text: "The exact job title from the posting"

Field 2: Company Name*
- Input: text
- Placeholder: "e.g., Google, Acme Corp, Local Business"
- Max: 100 chars
- Required

Field 3: Job Description
- Input: large textarea (expandable)
- Placeholder: "Paste the full job description here (optional but recommended for best results)"
- Max: 5000 chars
- Optional but highly recommended
- Character counter shown
- Help text: "More details = better personalization"

Field 4: Company Info (Optional)
- Input: textarea
- Placeholder: "What do you know about this company? (mission, values, recent news, why you admire them)"
- Max: 500 chars
- Optional
- Help text: "Shows you've done research"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2: YOUR BACKGROUND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 5: Your Name*
- Input: text
- Placeholder: "Your Full Name"
- Required

Field 6: Current/Most Recent Job Title*
- Input: text
- Placeholder: "e.g., Marketing Coordinator, Recent Graduate, Career Changer"
- Required

Field 7: Years of Experience*
- Dropdown:
  • Entry-level (0-2 years)
  • Mid-level (3-5 years)
  • Senior (6-10 years)
  • Expert (10+ years)
  • Career Changer (switching fields)
  • Recent Graduate
- Required
- Impacts tone and content structure

Field 8: Your Key Skills & Achievements
- Textarea (rich input)
- Placeholder: "List your top 3-5 relevant skills and achievements for this role.
Examples:
• Increased sales by 40% through data-driven campaigns
• Led team of 8 developers building mobile app
• Proficient in Python, React, AWS"
- Max: 1000 chars
- Required
- Bullet point encouraged
- Help text: "Focus on achievements relevant to the job posting"

Field 9: Why This Job?*
- Textarea
- Placeholder: "Why are you interested in this specific role? What excites you about it?"
- Max: 300 chars
- Required
- Help text: "Your genuine motivation - be specific"

Field 10: Career Transition Info (if applicable)
- Textarea
- Placeholder: "If you're changing careers, explain how your previous experience is relevant"
- Max: 300 chars
- Shown only if "Career Changer" selected in Field 7

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3: CUSTOMIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 11: Tone & Style
- Radio buttons with descriptions:
  ○ Professional (Most common - formal but warm)
  ○ Enthusiastic (Show passion and energy)
  ○ Formal (Traditional, conservative industries)
  ○ Creative (Tech, startups, creative fields)
  ○ Balanced (Safe middle ground)
- Default: Professional

Field 12: Cover Letter Length
- Slider or radio:
  ○ Concise (250-300 words, 3 paragraphs)
  ○ Standard (350-400 words, 4 paragraphs) [DEFAULT]
  ○ Detailed (450-500 words, 5 paragraphs)
- Default: Standard

Field 13: Special Considerations (Optional)
- Checkboxes:
  ☐ Employment gap to address
  ☐ Relocation mentioned
  ☐ Salary requirements mentioned
  ☐ Reference a referral/connection
  ☐ Remote work preference
- Text input appears for checked items

Field 14: Additional Notes (Optional)
- Textarea
- Placeholder: "Anything else to include? (referrals, specific projects to mention, unique circumstances)"
- Max: 300 chars

ADVANCED OPTIONS (Collapsible):
- ATS Optimization Level: High/Medium/Low
- Include contact info header: Yes/No
- Signature line: Yes/No/Custom

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERATE BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full-width button on mobile, centered on desktop
Text: "Generate My Cover Letter"
Icon: 💼
Gradient purple-to-blue
Loading state: "Generating your cover letter..."
Disabled until required fields complete
Keyboard shortcut: Cmd/Ctrl + Enter

Progress indicator during generation:
"Analyzing job description... ✓"
"Matching your skills... ✓"
"Writing personalized letter... ⏳"
"Finalizing... ✓"

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COVER LETTER DISPLAY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Header Section:
- "Your Cover Letter" (with word count: "387 words")
- Action buttons row:
  • Copy to Clipboard
  • Download as .txt
  • Download as .docx (if possible)
  • Edit in Browser (makes editable)
  • Regenerate (with variations)
  • Save Draft (to localStorage)

Preview Display:
- Clean, letter-formatted display
- Proper spacing and paragraphs
- Optional contact header (if enabled):
  [Your Name]
  [Your Email] | [Your Phone]
  [Your LinkedIn]
  
  [Date]
  
  [Hiring Manager Name/Title]
  [Company Name]
  [Company Address]

- Letter body with clear paragraph breaks
- Professional formatting
- Easy to read typography

Editing Mode:
- Click "Edit in Browser" makes entire letter editable
- Live character/word count
- Save edits to localStorage
- Export edited version

Variation Generator:
- "Generate Alternative Version" button
- Options for variation:
  • Different opening paragraph
  • Different tone (try enthusiastic vs professional)
  • Shorter/longer version
  • Different emphasis (skills vs experience vs passion)

Quality Indicators:
- ATS Score: 85/100 (Good)
- Readability: Grade 10-12 (Professional)
- Tone Match: Professional ✓
- Length: 387 words (Ideal)

Tips Section (Below letter):
"💡 Tips to Improve Your Cover Letter"
- Customize the [brackets] with specific details
- Add specific numbers/metrics if you have them
- Proofread for typos before sending
- Save as PDF before submitting (maintains formatting)
- Address hiring manager by name if you can find it

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COVER LETTER TEMPLATES SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Example Cover Letters by Industry"

Show 4-6 example cover letters:

Example 1: Tech/Software Engineering
- Preview first paragraph
- "See full example" expands
- Shows job description used
- Shows final cover letter

Example 2: Marketing/Sales
Example 3: Healthcare/Nursing
Example 4: Finance/Banking
Example 5: Education/Teaching
Example 6: Career Change Example

Each example includes:
- Industry tag
- Experience level
- Job title
- Preview of quality
- "Use this template" button (pre-fills form)

=== SEO ARTICLE SECTION ===

Comprehensive 2000-2500 word article below the tool:

Article Title: "How to Write a Cover Letter That Gets Interviews: Complete Guide + AI Tool"

Outline:

H2: What is a Cover Letter?
- Definition and purpose
- Why cover letters still matter in 2026
- When you need a cover letter
- Cover letter vs resume

H2: Cover Letter Structure & Format
H3: Standard Cover Letter Format
- Header (contact info)
- Date and recipient info
- Salutation
- Opening paragraph
- Body paragraphs (2-3)
- Closing paragraph
- Sign-off

H3: Cover Letter Length
- Ideal length: 250-400 words
- 3-4 paragraphs standard
- One page maximum

H2: How to Write Each Section

H3: Opening Paragraph
- Hook the reader immediately
- State the position clearly
- Show enthusiasm
- Mention referral if applicable
- Examples: 5 strong opening paragraphs

H3: Body Paragraphs
- Paragraph 1: Why you're qualified (match skills to job)
- Paragraph 2: Why this company (show research)
- Paragraph 3 (optional): Address concerns (gaps, relocation, etc.)
- Examples with annotations

H3: Closing Paragraph
- Reiterate interest
- Call to action
- Thank the reader
- Professional sign-off
- Examples: 5 strong closings

H2: Cover Letter Writing Tips

20+ specific tips:
1. Customize for each job (never generic)
2. Address hiring manager by name when possible
3. Use specific numbers and achievements
4. Mirror language from job description
5. Show, don't tell (use examples)
6. Avoid clichés ("team player", "hard worker")
7. Keep paragraphs short (3-4 lines)
8. Use active voice
9. Proofread multiple times
10. Get someone else to review
[... continue to 20]

H2: Common Cover Letter Mistakes

15 mistakes to avoid:
1. Generic "To Whom It May Concern"
2. Repeating your resume verbatim
3. Focusing on what you want (vs what you offer)
4. Typos and grammar errors
5. Wrong company name (copy-paste error)
6. Too long (over one page)
7. Unprofessional email address
8. Salary requirements unless requested
9. Negative language about previous employers
10. Overly casual or overly formal tone
[... continue to 15]

H2: Cover Letter Examples by Situation

H3: Entry-Level Cover Letter
- Full example with annotations
- Key strategies for no experience
- Highlighting education and potential

H3: Career Change Cover Letter
- Full example with annotations
- Addressing the transition
- Transferable skills emphasis

H3: Internal Position Cover Letter
- Leveraging company knowledge
- Different approach

H3: Referred by Employee Cover Letter
- Using the referral effectively

H3: Remote Job Cover Letter
- Addressing remote work specifically

H2: ATS-Friendly Cover Letters

What is an ATS (Applicant Tracking System)?
- How ATS scans cover letters
- Keywords to include
- Formatting for ATS
- What to avoid (tables, images, fancy fonts)

H2: Industry-Specific Cover Letter Tips

Brief sections for:
- Tech/Engineering
- Healthcare
- Education
- Finance
- Marketing/Sales
- Creative Fields
- Government/Public Sector

H2: Cover Letter vs Resume

Key differences table:
- Purpose
- Length
- Content
- Tone
- When needed
- Customization level

H2: How to Use the AI Cover Letter Generator

Step-by-step guide:
1. Paste the job description
2. Enter your background
3. Customize tone and length
4. Generate and review
5. Edit and personalize further
6. Export and submit

Tips for best AI results:
- Be specific about achievements
- Include metrics when possible
- Paste full job description
- Review and personalize output

H2: FAQs About Cover Letters

15-20 common questions:
- Do I need a cover letter if not required?
- How long should a cover letter be?
- Should I mention salary in cover letter?
- Can I use the same cover letter for multiple jobs?
- Should I address employment gaps?
- What if I don't know the hiring manager's name?
- Should I attach cover letter or paste in email?
- How do I address a career change?
- Can I use an AI-generated cover letter?
- How do I make my cover letter stand out?
[... continue with detailed answers]

H2: Cover Letter Checklist

Downloadable checklist:
Before sending, verify:
☐ Job title is correct
☐ Company name is correct
☐ Hiring manager name is correct (if known)
☐ No typos or grammar errors
☐ Customized to this specific job
☐ Includes specific achievements
☐ Shows company research
☐ Professional tone maintained
☐ Under one page
☐ Saved as PDF
☐ File named professionally
☐ Matches resume formatting

Call-to-Action: "Generate your personalized cover letter with our free AI tool above ↑"

=== WEBLLM PROMPT ENGINEERING ===

System Prompt:
```
You are an expert career coach and professional resume writer with 15+ years of experience helping job seekers land interviews at Fortune 500 companies and startups.

Your expertise includes:
- Writing compelling, personalized cover letters that get interviews
- Understanding ATS (Applicant Tracking System) optimization
- Tailoring content to specific industries and experience levels
- Matching candidate skills to job requirements
- Professional business writing with appropriate tone
- Career transition strategies
- Addressing employment gaps and special circumstances

You write cover letters that:
- Are personalized to the specific job and company
- Highlight relevant achievements with specific examples
- Show genuine enthusiasm and company research
- Use professional yet warm tone
- Are ATS-optimized with relevant keywords
- Follow standard business letter format
- Are concise (250-400 words typical)
- Avoid clichés and generic statements

You understand the psychology of hiring managers and what makes them want to interview a candidate.
```

User Prompt Template:
```
Write a personalized, professional cover letter for this job application.

═══════════════════════════════════════
JOB DETAILS
═══════════════════════════════════════
Job Title: {job_title}
Company: {company_name}
Job Description: {job_description}
Company Info: {company_info}

═══════════════════════════════════════
CANDIDATE BACKGROUND
═══════════════════════════════════════
Name: {candidate_name}
Current Role: {current_role}
Experience Level: {experience_level}
Key Skills & Achievements:
{skills_and_achievements}

Motivation for This Role:
{why_this_job}

{career_transition_info}

═══════════════════════════════════════
REQUIREMENTS
═══════════════════════════════════════

STRUCTURE:
1. Opening paragraph (2-3 sentences):
   - State the position you're applying for
   - Express genuine enthusiasm
   - Brief hook about why you're qualified
   {referral_mention}

2. Body paragraph 1 (4-5 sentences):
   - Highlight 2-3 most relevant skills/achievements from candidate's background
   - Use specific examples with metrics when possible
   - Directly connect to job requirements from the description
   - Show how past experience prepares them for this role

3. Body paragraph 2 (3-4 sentences):
   - Show knowledge of the company
   - Explain why they're specifically interested in THIS company
   - Connect company's mission/values to candidate's goals
   - Demonstrate research beyond surface level

{special_paragraphs}

4. Closing paragraph (2-3 sentences):
   - Reiterate enthusiasm and fit
   - Clear call to action (request interview)
   - Professional thank you
   - Forward-looking statement

TONE & STYLE:
- {tone} tone throughout
- Professional but personable
- Active voice (strong action verbs)
- Confident without being arrogant
- Genuine enthusiasm without over-the-top flattery

FORMATTING:
- {length} words (approximately)
- Clear paragraph breaks
- Professional business letter format
- ATS-friendly (no special characters, tables, or formatting)

CONTENT GUIDELINES:
✓ Personalized to this specific job (mention company name 2-3 times)
✓ Use keywords from job description naturally
✓ Include specific achievements with numbers/metrics
✓ Show company research (mention recent news, mission, values)
✓ Avoid generic statements ("I'm a hard worker")
✓ No clichés ("thinking outside the box")
✓ Don't repeat resume - add new context
✓ Address any special circumstances naturally
✓ End with clear next step request

{ats_requirements}

OUTPUT FORMAT:
[Your Name]
[Your Email] | [Your Phone]
{contact_header}

[Today's Date]

Dear [Hiring Manager/Title],

[Opening paragraph]

[Body paragraph 1]

[Body paragraph 2]

{special_paragraph_3}

[Closing paragraph]

Sincerely,
[Your Name]

Write the complete cover letter following all requirements above. Make it compelling, personalized, and interview-worthy.
```

Dynamic Prompt Modifiers:

Experience Level Adjustments:
```javascript
const experienceLevelGuidance = {
  'entry-level': `
    - Emphasize education, internships, projects, coursework
    - Highlight transferable skills and eagerness to learn
    - Show passion and potential over experience
    - Mention relevant coursework or academic achievements`,
  
  'mid-level': `
    - Focus on career progression and growing responsibilities
    - Highlight specific achievements and impact
    - Balance experience with continued growth potential`,
  
  'senior': `
    - Emphasize leadership, strategy, and business impact
    - Highlight team management and mentoring
    - Show track record of results and innovation
    - Position as industry expert`,
  
  'career-changer': `
    - Address career transition directly and positively
    - Emphasize transferable skills from previous field
    - Show how diverse background is an asset
    - Explain clear motivation for change
    - Connect previous experience to new role requirements`
};
```

Tone Variations:
```javascript
const toneGuidance = {
  professional: "Formal but warm, using clear professional language without being stiff",
  enthusiastic: "Show genuine excitement and passion while maintaining professionalism",
  formal: "Traditional corporate tone, conservative language, extremely polished",
  creative: "Personality shows through, conversational yet professional, creative industry appropriate",
  balanced: "Middle ground - professional with touch of personality"
};
```

=== UX/UI DESIGN ===

Progressive Disclosure Pattern:
- Step 1 shown first (Job Details)
- Step 2 appears after Step 1 complete
- Step 3 appears after Step 2 complete
- OR: Show all with visual hierarchy (recommended for power users)

Visual Design:
- Clean, professional aesthetic (this is career-focused)
- Trust-building design elements
- Success stories/testimonials
- Professional color palette (purple/blue gradient maintained but sophisticated)

Form Optimization:
- Large, easy-to-fill inputs
- Clear labels and help text
- Real-time validation (required fields)
- Character counters on text areas
- Smart defaults (most common choices)
- Save draft automatically every 30 seconds

Mobile Optimization:
- Stack all form fields vertically
- Large touch targets (min 44px)
- Keyboard-friendly (proper input types)
- Sticky generate button
- Easy copy/download on mobile

=== SPECIAL FEATURES ===

1. Save Drafts Feature:
- Auto-save to localStorage every 30s
- "My Saved Cover Letters" section
- List of saved letters with metadata
- Quick load previous letter
- Edit saved letters

2. Template Library:
- Pre-built templates by industry
- "Start from template" option
- Template preview before using
- Customizable starting points

3. Comparison Mode:
- Generate 2-3 variations
- Side-by-side comparison
- Vote on best version
- Combine elements from multiple versions

4. Version History:
- Track edits made to generated letter
- Revert to previous version
- Compare versions

5. Export Options:
- Plain text (.txt)
- Rich text for easy pasting
- DOCX format (if possible with libraries)
- PDF (future enhancement)
- Copy formatted for email

=== SEO OPTIMIZATION ===

Meta Tags:
```html
<title>Free AI Cover Letter Generator - Land Interviews Faster | Browser AI Tools</title>
<meta name="description" content="Generate personalized, professional cover letters instantly. AI-powered, ATS-optimized, 100% free. Get interviews faster with tailored cover letters.">
<meta name="keywords" content="cover letter generator, AI cover letter, free cover letter, cover letter template, professional cover letter, ATS cover letter">

<!-- Open Graph -->
<meta property="og:title" content="AI Cover Letter Generator - Free & Private">
<meta property="og:description" content="Create personalized cover letters that get interviews. 100% free, 100% private, generated in 30 seconds.">
```

Target Keywords:
- Primary: "cover letter generator" (150k/month)
- Secondary: "free cover letter generator", "AI cover letter"
- Long-tail: "cover letter template", "how to write cover letter", "professional cover letter"

Internal Linking:
- Link to AI Resume Bullet Generator
- Link to AI Interview Answer Generator
- "Complete job search toolkit" messaging

=== PERFORMANCE TARGETS ===

- Page load: < 1.2s
- Form to result: 5-10 seconds
- Generation streaming: Progressive display
- Export: Instant download
- Mobile performance: 95+ Lighthouse score

=== SUCCESS METRICS ===

Track (privacy-respecting):
- Cover letters generated per day
- Most common industries
- Experience levels distribution
- Export format preferences
- Return visitor rate (localStorage)

Goals:
- 500+ daily generations in month 1
- 2000+ daily by month 3
- 60%+ return visitor rate
- 4+ average word count match to target

Build this as the flagship tool for browseraitools.com - the highest quality free cover letter generator on the internet. Focus on personalization quality over quantity of features.
```

---

## 🎯 Key Differentiators

This Cover Letter Generator stands out because:
1. **Truly personalized** (analyzes job description, not just templates)
2. **Experience-level adaptive** (entry-level vs senior different approach)
3. **ATS-optimized** (passes applicant tracking systems)
4. **Privacy-focused** (job search is sensitive - data stays private)
5. **Export-ready** (multiple formats for easy submission)
6. **Save drafts** (return and edit multiple applications)

This will be your highest-traffic tool and set the quality bar for all others.
