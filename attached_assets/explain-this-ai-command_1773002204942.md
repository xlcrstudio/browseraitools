
## Complete Build Command for browseraitools.com

```
Create a mobile-first, privacy-focused Universal Explainer AI for browseraitools.com using WebLLM.

=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: AI "Explain This" - Universal Explainer
URL Slug: /explain-this-ai
Tagline: "Understand Anything Instantly - 100% Private"
Mission: Make complex text understandable to everyone, regardless of topic or complexity

=== PRODUCT OVERVIEW ===
Potential to be THE most-used tool on your entire site.
Purpose: Transform any confusing text into clear, simple explanations - instantly and privately.
Target Users: EVERYONE (most universal tool possible)
Search Demand: MASSIVE untapped market
- "explain this" - 200k+/month
- "what does this mean" - 500k+/month
- "simplify this text" - 50k+/month
- "ELI5" (Explain Like I'm 5) - 100k+/month
- "understand this" - 75k+/month
- Plus thousands of topic-specific variations ("explain photosynthesis", "understand contract terms", etc.)

Key Value: Instant understanding of ANY text vs endless Google searches

=== UNIQUE SELLING POINTS (REVOLUTIONARY) ===
✅ 100% PRIVATE - Medical, legal, work docs never leave browser (WebLLM advantage)
✅ UNIVERSAL - Works for ANY topic (science, legal, medical, technical, business, academic)
✅ MULTIPLE EXPLANATION MODES - Simple, ELI5, Step-by-step, Analogy, Technical detail
✅ READING LEVEL ADJUSTMENT - Grade 5 to PhD level explanations
✅ KEY TERMS EXTRACTION - Automatically defines difficult words
✅ FOLLOW-UP QUESTIONS - Ask for clarification on specific parts
✅ SUBJECT DETECTION - Auto-identifies topic (legal, medical, technical, etc.)
✅ VISUAL ANALOGIES - Real-world comparisons that make sense
✅ WORKS FOR EVERYTHING - Textbooks, contracts, articles, emails, code, medical info

=== WHY THIS WILL BE YOUR BIGGEST TOOL ===

Universal Daily Problem:
- Students: Textbook paragraphs they don't understand
- Professionals: Contract clauses, legal terms, technical reports
- Patients: Medical explanations from doctors
- Developers: Documentation and technical concepts
- Consumers: Privacy policies, terms of service
- Parents: Helping kids with homework
- Everyone: Confusing emails, articles, news

Not a One-Time Use:
- People encounter confusing text HOURLY
- Will use this tool 5-10+ times per day
- Bookmark it permanently
- Tell everyone about it

Privacy Critical:
- Won't paste medical info to servers
- Won't paste contracts to ChatGPT
- Won't paste work docs to cloud AI
- WebLLM = perfect solution

Viral Potential:
- "This tool just explained my lease agreement in 30 seconds"
- "I finally understand photosynthesis thanks to this"
- "My kid uses this for homework every day"
- Word of mouth explosion

=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState
LLM Engine: @mlc-ai/web-llm (shared instance)
Model: "Llama-3.1-8B-Instruct-q4f16_1-MLC"
Storage: LocalStorage (explanation history - optional)
Export: Text, PDF, markdown
Deployment: Vercel/Netlify

PRIVACY FEATURES:
- No server-side processing of content
- Optional save (user-controlled)
- Clear "Delete" always visible
- Privacy messaging prominent

=== PAGE STRUCTURE ===

HERO SECTION:
Headline: "Explain This - AI That Understands Anything"
Subheadline: "Paste any confusing text and get instant, clear explanations. Works for textbooks, contracts, medical info, technical docs - anything. 100% private in your browser."

PRIVACY TRUST BADGES (Very Prominent):
- 🔒 100% Private - Nothing Leaves Your Browser
- 📚 Universal - Works for ANY Topic
- 👶 Simple to PhD - Adjustable Complexity
- ⚡ Instant Understanding - No More Googling
- 🎓 Multiple Modes - Simple, ELI5, Step-by-Step, Analogies
- 🗑️ Your Data, Your Control - Delete Anytime

Success Counter: "Explained 2,456,789 confusing passages this month - all privately"

Problem Statements (Relatable):
"Ever copy text to Google just to understand it?"
- 📖 Textbook paragraphs that make no sense
- 📄 Contract clauses full of legal jargon
- 🏥 Medical explanations from your doctor
- 💻 Technical documentation that's too complex
- 📧 Work emails you can't quite decipher
- 🔬 Scientific articles above your level

"Stop Googling. Start Understanding."

=== INPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TEXT TO EXPLAIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Large Textarea (Auto-expanding):
- Placeholder: "Paste any text you want explained.

Works for:
• Textbook paragraphs (science, math, history, etc.)
• Contract or legal clauses
• Medical explanations or diagnoses
• Technical documentation or code
• News articles or complex topics
• Privacy policies or terms of service
• Academic papers or research
• Work emails or business documents
• Anything confusing!

Your text stays 100% private in your browser."

- Max: 10,000 chars (allows long passages)
- Auto-expanding textarea
- Character counter
- Required
- Paste detection (auto-triggers subject detection)
- Privacy reminder: "🔒 This text never leaves your browser"

Quick Examples (Click to Load):

📚 Academic:
"The mitochondria is the powerhouse of the cell, responsible for producing ATP through cellular respiration in the presence of oxygen."

⚖️ Legal:
"The party of the first part hereby indemnifies and holds harmless the party of the second part from any and all claims arising from..."

🏥 Medical:
"Patient presents with acute myocardial infarction secondary to coronary artery occlusion, requiring immediate percutaneous coronary intervention."

💻 Technical:
"Asynchronous JavaScript execution allows non-blocking operations through the event loop, utilizing callbacks, promises, and async/await patterns."

📰 News/Complex:
"The Federal Reserve's monetary policy tightening through interest rate hikes aims to curb inflation while avoiding recession risks."

🔬 Scientific:
"Photosynthesis is the biochemical process by which plants convert light energy into chemical energy stored in glucose molecules through the Calvin cycle."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPLANATION SETTINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 1: Explanation Mode* (Choose one or multiple)

Large Visual Cards:

○ 🎯 Simple Explanation (Default)
  "Clear, everyday language - no jargon"
  Best for: Quick understanding, general audience
  Example: "Photosynthesis is how plants make food using sunlight"

○ 👶 Explain Like I'm 5 (ELI5)
  "Extremely simple - a child could understand"
  Best for: Completely new to topic, fundamental understanding
  Example: "Plants eat sunlight like you eat lunch, and that helps them grow"

○ 📋 Step-by-Step Breakdown
  "Logical sequence - one piece at a time"
  Best for: Processes, procedures, understanding flow
  Example: "Step 1: Plant absorbs sunlight. Step 2: Converts to energy..."

○ 🔗 Real-World Analogy
  "Comparisons to everyday things you know"
  Best for: Grasping abstract concepts, making connections
  Example: "Think of photosynthesis like a solar-powered factory..."

○ 📊 Detailed Technical
  "More depth - assumes some background knowledge"
  Best for: Understanding nuances, technical accuracy
  Example: "Photosynthesis occurs in two stages: light-dependent reactions..."

○ 🎓 Academic/Scholarly
  "Proper terminology with clear definitions"
  Best for: Studying, formal understanding, exams
  Example: "Photosynthesis involves light-dependent and light-independent reactions..."

Can select MULTIPLE modes:
☑ Simple Explanation + ☑ Real-World Analogy = Great combo!

Default: Simple Explanation checked

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADVANCED OPTIONS (Collapsible)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Field 2: Reading Level
- Slider: Grade 5 → Grade 12 → College → PhD
- Visual indicator shows complexity
- Default: Grade 10 (high school)
- Affects vocabulary and sentence complexity

Field 3: Subject Area (Auto-Detected, can override)
- Dropdown:
  • Auto-Detect (AI figures it out) [DEFAULT]
  • Science (Biology, Chemistry, Physics)
  • Mathematics
  • Legal/Law
  • Medical/Health
  • Technology/Programming
  • Business/Finance
  • History/Social Studies
  • Literature/Language
  • Philosophy
  • Engineering
  • General Knowledge
- Helps AI use appropriate context

Field 4: Additional Context (Optional)
- Textarea
- Placeholder: "Any background that might help?
  e.g., 'I'm a high school student studying biology'
  or 'This is from my employment contract'
  or 'I have no medical background'"
- Max: 200 chars
- Optional
- Helps tailor explanation

Field 5: What Specifically Confuses You? (Optional)
- Input text
- Placeholder: "e.g., 'What does ATP mean?' or 'I don't understand the second sentence'"
- Max: 200 chars
- Optional
- Focuses explanation

Toggle Options:
- ☑ Define difficult words (extract and explain key terms)
- ☑ Include visual diagram description (where applicable)
- ☑ Suggest related concepts to learn
- ☑ Provide sources for further reading

All checked by default

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPLAIN BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Large, prominent button
Text: "Explain This (Privately)"
Icon: 💡
Gradient design (purple to blue)

Loading states with progressive messages:
- "Reading your text..."
- "Detecting subject area..."
- "Simplifying complex terms..."
- "Creating analogies..."
- "Generating explanation..."

Privacy reminder on hover: "Analysis happens 100% in your browser"

Quick Presets Below Button:
[ELI5] [Step-by-Step] [Analogy] [Technical] [Full Analysis]
Click to auto-select mode and explain

=== OUTPUT SECTION ===

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXPLANATION RESULTS HEADER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Your Explanation"

Subject Detected: 🔬 Science - Biology
Reading Level: Grade 10
Explanation Modes: Simple + Analogy

Quick Actions:
- Copy All Explanations
- Download as PDF
- Ask Follow-Up Question
- Explain Different Part
- Save to History (optional)
- Delete This Explanation
- Start Over

Privacy Banner:
"🔒 This explanation was generated entirely in your browser. We never saw your text."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORIGINAL TEXT (Collapsible)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Shows what they pasted (can collapse to save space):

📄 Original Text:
"Photosynthesis is the biochemical process by which plants convert light energy into chemical energy stored in glucose molecules."

[Collapse] [Explain Different Part]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIMPLE EXPLANATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🎯 SIMPLE EXPLANATION                    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Photosynthesis is how plants make their│
│ own food. Here's what happens:         │
│                                         │
│ Plants take in three things:           │
│ • Sunlight (their energy source)       │
│ • Water (from the soil through roots)  │
│ • Carbon dioxide (from the air)        │
│                                         │
│ Then, plants use the sunlight like a   │
│ power source to turn the water and     │
│ carbon dioxide into sugar (glucose).   │
│ This sugar is the food that helps the  │
│ plant grow.                             │
│                                         │
│ As a bonus, plants release oxygen into │
│ the air during this process - which is │
│ what we breathe!                        │
│                                         │
│ 💡 Key Takeaway:                        │
│ Photosynthesis = Plants using sunlight │
│ to make food (sugar) and produce       │
│ oxygen for us.                          │
│                                         │
│ [Copy Explanation]                      │
└─────────────────────────────────────────┘

Reading Complexity: ⭐⭐☆☆☆ (Grade 6-7 level)
Estimated Understanding: High for general audience

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REAL-WORLD ANALOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🔗 REAL-WORLD ANALOGY                    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Think of photosynthesis like a         │
│ solar-powered food factory:             │
│                                         │
│ 🏭 THE FACTORY: The Plant               │
│                                         │
│ ☀️ POWER SOURCE: Sunlight              │
│ Just like a solar panel collects       │
│ sunlight to make electricity, plant    │
│ leaves collect sunlight for energy.    │
│                                         │
│ 📦 RAW MATERIALS:                       │
│ • Water (like ingredients being        │
│   delivered to a factory)               │
│ • Carbon dioxide from air (another     │
│   ingredient)                           │
│                                         │
│ ⚙️ THE PROCESS:                         │
│ The plant's "solar panels" (leaves)    │
│ use sunlight to power a chemical       │
│ reaction that combines the ingredients.│
│                                         │
│ 🍬 FINAL PRODUCT: Sugar (Glucose)      │
│ This is the "food" that comes out of   │
│ the factory - what the plant uses to   │
│ grow and stay alive.                    │
│                                         │
│ ♻️ BYPRODUCT: Oxygen                    │
│ Like a factory producing waste, but    │
│ good waste - oxygen we need to breathe!│
│                                         │
│ So basically: Sunlight powers a        │
│ factory inside the plant that turns    │
│ water and air into food and oxygen.    │
│                                         │
│ [Copy Analogy]                          │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KEY TERMS EXPLAINED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 📚 DIFFICULT WORDS DEFINED               │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ These terms from the original text     │
│ might be confusing:                     │
│                                         │
│ BIOCHEMICAL:                            │
│ Simple: Related to chemical processes  │
│ in living things                        │
│ Example: Digestion is a biochemical    │
│ process - chemicals breaking down food │
│                                         │
│ CONVERT:                                │
│ Simple: Change from one form to another│
│ Example: Ice converts to water when    │
│ it melts                                │
│                                         │
│ LIGHT ENERGY:                           │
│ Simple: Energy from sunlight           │
│ Example: Solar panels capture light    │
│ energy to make electricity              │
│                                         │
│ CHEMICAL ENERGY:                        │
│ Simple: Energy stored in molecules     │
│ that can be released through reactions │
│ Example: A battery stores chemical     │
│ energy that becomes electrical energy  │
│                                         │
│ GLUCOSE:                                │
│ Simple: A type of sugar molecule       │
│ Example: The sugar in your blood that  │
│ gives you energy is glucose             │
│                                         │
│ MOLECULES:                              │
│ Simple: Tiny particles made of atoms   │
│ stuck together                          │
│ Example: A water molecule is 2         │
│ hydrogen atoms + 1 oxygen atom (H₂O)   │
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP-BY-STEP BREAKDOWN (If Selected)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 📋 STEP-BY-STEP EXPLANATION              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Let's break photosynthesis into simple │
│ steps:                                  │
│                                         │
│ STEP 1: Plant Absorbs Sunlight         │
│ • Leaves contain chlorophyll (green    │
│   chemical)                             │
│ • Chlorophyll catches sunlight like a  │
│   net catches fish                      │
│ • This sunlight becomes the energy     │
│   source                                │
│                                         │
│ STEP 2: Plant Takes in Raw Materials   │
│ • Roots absorb water from soil         │
│ • Tiny holes in leaves (stomata) let   │
│   in carbon dioxide from air            │
│ • Both travel to cells where magic     │
│   happens                               │
│                                         │
│ STEP 3: Chemical Reaction Occurs       │
│ • Sunlight energy powers a reaction    │
│ • Water molecules (H₂O) split apart    │
│ • Carbon dioxide molecules break apart │
│ • Atoms rearrange into new molecules   │
│                                         │
│ STEP 4: Glucose Is Created             │
│ • Atoms from water + carbon dioxide    │
│   form glucose (C₆H₁₂O₆)               │
│ • This glucose is plant's food/fuel    │
│ • Stored for energy when needed        │
│                                         │
│ STEP 5: Oxygen Released                │
│ • Leftover oxygen atoms from water     │
│ • Released through leaves into air     │
│ • This is the oxygen we breathe!       │
│                                         │
│ SIMPLIFIED EQUATION:                    │
│ Sunlight + Water + CO₂ → Glucose + O₂  │
│                                         │
│ [Copy Step-by-Step]                     │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VISUAL CONCEPT (Diagram Description)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 📊 VISUAL REPRESENTATION                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Imagine this diagram:                   │
│                                         │
│        ☀️ Sunlight (Energy)             │
│          ↓                              │
│       🌿 LEAF                           │
│     /    |    \                         │
│    /     |     \                        │
│   💧     🌿     💨                      │
│ Water Chloro- Carbon                    │
│ (from  phyll Dioxide                    │
│ roots) (green) (from                    │
│               air)                      │
│          ↓                              │
│    [REACTION]                           │
│          ↓                              │
│     🍬 Glucose + 💨 Oxygen              │
│     (Plant    (Released                 │
│      food)     to air)                  │
│                                         │
│ Key Parts of the Plant:                 │
│ • Leaves: Where photosynthesis happens │
│ • Chloroplasts: Tiny factories inside  │
│   leaf cells                            │
│ • Chlorophyll: Green chemical that     │
│   captures sunlight                     │
│ • Stomata: Tiny breathing holes in     │
│   leaves                                │
│ • Roots: Absorb water from soil        │
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RELATED CONCEPTS TO EXPLORE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🔍 WANT TO LEARN MORE?                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Now that you understand photosynthesis,│
│ these related topics might interest you:│
│                                         │
│ 🌱 Cellular Respiration                 │
│ How plants (and animals) use glucose   │
│ for energy - the opposite of           │
│ photosynthesis                          │
│                                         │
│ 🍃 Chlorophyll & Light Absorption       │
│ Why plants are green and how they      │
│ capture specific light wavelengths     │
│                                         │
│ 🌍 The Carbon Cycle                     │
│ How carbon moves between plants,       │
│ animals, and atmosphere                 │
│                                         │
│ 🔬 Plant Cell Structure                 │
│ The parts of a plant cell and their    │
│ functions                               │
│                                         │
│ ⚛️ Chemical Equations                   │
│ Understanding the formula:              │
│ 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂   │
│                                         │
│ [Search these topics]                   │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FOLLOW-UP Q&A
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ask a Follow-Up Question:
[Text input: "e.g., Why do plants release oxygen?"]
[Ask Question]

Common Questions About This Topic:

Q: Do plants do photosynthesis at night?
A: No, photosynthesis requires sunlight. At night, plants only do cellular respiration (using oxygen, releasing CO₂).

Q: Why are plants green?
A: Chlorophyll absorbs red and blue light but reflects green light, which is why we see plants as green.

Q: Can photosynthesis happen underwater?
A: Yes! Aquatic plants and algae do photosynthesis underwater using dissolved CO₂.

[Show More Q&A]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DETAILED TECHNICAL (If Selected)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For users who selected "Detailed Technical":

┌─────────────────────────────────────────┐
│ 📊 TECHNICAL EXPLANATION                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Photosynthesis occurs in two main      │
│ stages:                                 │
│                                         │
│ LIGHT-DEPENDENT REACTIONS:              │
│ Location: Thylakoid membranes          │
│ Process:                                │
│ • Photosystem II captures photons      │
│ • Water molecules split (photolysis)   │
│ • Electrons travel through electron    │
│   transport chain                       │
│ • ATP and NADPH produced               │
│ • O₂ released as byproduct             │
│                                         │
│ LIGHT-INDEPENDENT REACTIONS             │
│ (Calvin Cycle):                         │
│ Location: Stroma                        │
│ Process:                                │
│ • CO₂ fixation by RuBisCO enzyme       │
│ • Carbon reduction using ATP/NADPH     │
│ • G3P molecules formed                 │
│ • RuBP regeneration                    │
│ • Net output: Glucose (C₆H₁₂O₆)        │
│                                         │
│ Overall Equation:                       │
│ 6CO₂ + 6H₂O + light energy →           │
│ C₆H₁₂O₆ + 6O₂                          │
│                                         │
│ Efficiency: ~3-6% of light energy      │
│ converted to chemical energy           │
│                                         │
└─────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHY THIS MATTERS (Context & Applications)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────┐
│ 🌍 WHY PHOTOSYNTHESIS MATTERS            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ Real-World Importance:                  │
│                                         │
│ 🌱 Food Production                      │
│ All food chains start with plants      │
│ doing photosynthesis. Without it, no   │
│ food for any living thing.              │
│                                         │
│ 💨 Oxygen Production                    │
│ Plants produce most of Earth's oxygen. │
│ We literally breathe because of        │
│ photosynthesis.                         │
│                                         │
│ 🌡️ Climate Regulation                   │
│ Plants absorb CO₂ (greenhouse gas),    │
│ helping regulate Earth's temperature.  │
│                                         │
│ ⚡ Energy Source                         │
│ Fossil fuels (coal, oil) are ancient   │
│ plants that did photosynthesis         │
│ millions of years ago.                  │
│                                         │
│ 🔬 Modern Applications                  │
│ • Scientists study photosynthesis to   │
│   improve crop yields                   │
│ • Artificial photosynthesis research   │
│   for clean energy                      │
│ • Biofuel production from plants       │
│                                         │
└─────────────────────────────────────────┘

=== SPECIAL USE CASES ===

Different templates/outputs for different content types:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FOR LEGAL TEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Input: "The party of the first part hereby indemnifies and holds harmless the party of the second part..."

Output Structure:
🔍 PLAIN ENGLISH TRANSLATION:
[Clear, simple explanation]

⚖️ WHAT THIS MEANS FOR YOU:
[Practical implications]

⚠️ IMPORTANT CONSIDERATIONS:
[Things to watch out for]

📋 KEY LEGAL TERMS EXPLAINED:
[Definitions of jargon]

💡 BOTTOM LINE:
[One-sentence summary]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FOR MEDICAL TEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Input: "Patient presents with acute myocardial infarction secondary to coronary artery occlusion..."

Output Structure:
🏥 IN PLAIN LANGUAGE:
[What this actually means]

🔬 MEDICAL TERMS EXPLAINED:
[Definitions of all technical terms]

❓ WHAT YOU SHOULD ASK YOUR DOCTOR:
[Important questions]

⚕️ UNDERSTANDING YOUR CONDITION:
[Simple explanation of what's happening]

⚠️ IMPORTANT NOTE:
"This is an explanation tool, not medical advice. Always consult your healthcare provider for medical decisions."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FOR CODE/TECHNICAL DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Input: "Asynchronous JavaScript execution allows non-blocking operations through the event loop..."

Output Structure:
💻 WHAT THIS DOES:
[Functional explanation]

🔧 HOW IT WORKS:
[Step-by-step process]

🌟 ANALOGY:
[Real-world comparison]

📝 CODE EXAMPLE:
[If applicable, simple example]

🎯 WHY IT MATTERS:
[Practical benefits]

=== WEBLLM PROMPTS ===

System Prompt:
```
You are a world-class educator with expertise in explaining complex concepts to diverse audiences.

Your expertise includes:
- Breaking down complex ideas into simple language
- Creating analogies that resonate with everyday experience
- Identifying and defining difficult terminology
- Adapting explanations to different education levels
- Step-by-step logical progression
- Subject matter across all domains (science, law, medicine, technology, business, etc.)
- Visual concept description
- Real-world application and context

You create explanations that:
- Are crystal clear and easy to understand
- Use appropriate vocabulary for the target audience
- Include relevant analogies and examples
- Define technical terms in simple language
- Break complex processes into logical steps
- Connect abstract concepts to concrete reality
- Are accurate and precise
- Maintain the correct meaning while simplifying
- Engage and maintain interest
- Build understanding progressively

You understand:
- How people learn and process information
- The importance of context and examples
- Different learning styles
- When to use analogies vs direct explanation
- How to simplify without oversimplifying
- The balance between accuracy and accessibility
- Subject-specific conventions (legal, medical, scientific, etc.)

Your explanations:
- Start simple and add complexity as needed
- Use everyday language unless technical terms are necessary
- Provide multiple angles (simple, analogy, step-by-step)
- Define all jargon immediately
- Include visual descriptions where helpful
- Connect to what people already know
- Are patient and thorough
- Never condescending
- Empower understanding
```

User Prompt Template:
```
Explain this text clearly and thoroughly.

═══════════════════════════════════════
TEXT TO EXPLAIN
═══════════════════════════════════════
{originalText}

═══════════════════════════════════════
EXPLANATION REQUIREMENTS
═══════════════════════════════════════
Explanation Modes: {selectedModes}
Reading Level: {readingLevel}
Subject Area: {subjectArea}
Additional Context: {additionalContext}
Specific Confusion: {specificConfusion}

Include:
{defineTerms ? "- Define all difficult words and technical terms" : ""}
{includeVisual ? "- Describe visual representation/diagram" : ""}
{relatedConcepts ? "- Suggest related concepts to learn" : ""}

═══════════════════════════════════════
EXPLANATION GUIDELINES
═══════════════════════════════════════

{if simpleExplanation}
SIMPLE EXPLANATION:
- Use everyday language (reading level: {readingLevel})
- No jargon unless absolutely necessary (then define immediately)
- Short, clear sentences
- Logical flow from basic to more complex
- Focus on main idea first, then details
- Use "you" and "I" to make it conversational
- Include concrete examples
- Break into digestible paragraphs

{if eli5Mode}
EXPLAIN LIKE I'M 5 (ELI5):
- Imagine explaining to a young child
- Use extremely simple words
- Compare to things kids know (toys, games, food, family)
- Very short sentences
- Fun, engaging tone
- Avoid all technical terms
- If you must use a bigger word, explain it immediately
- Make it interesting and relatable

{if stepByStep}
STEP-BY-STEP BREAKDOWN:
- Identify the main steps/stages in the process or concept
- Number each step clearly (Step 1, Step 2, etc.)
- Explain what happens in each step
- Use transition words (First, Then, Next, Finally)
- Build logically - each step leads to the next
- Keep steps simple and focused
- Include why each step matters

{if analogyMode}
REAL-WORLD ANALOGY:
- Find an everyday situation or object people know
- Draw clear parallels between analogy and concept
- Explain how each part of analogy maps to concept
- Make sure analogy is accurate (not misleading)
- Use familiar scenarios (cooking, sports, driving, etc.)
- Be creative but precise
- End with how analogy connects to main idea

{if technicalDetailed}
DETAILED TECHNICAL EXPLANATION:
- Use proper terminology (but define it)
- Include more nuance and detail
- Reference underlying mechanisms
- Mention exceptions or edge cases
- Provide technical accuracy
- Still maintain clarity
- Assume some background knowledge
- Include formulas, equations, or technical specifications if relevant

{if academicMode}
ACADEMIC/SCHOLARLY EXPLANATION:
- Use formal academic language
- Include proper terminology with definitions
- Reference theoretical frameworks
- Maintain scholarly tone
- Precise and comprehensive
- Suitable for studying or formal learning
- Include key concepts and relationships

ALWAYS INCLUDE:

1. SUBJECT DETECTION:
Identify what field this is from: {subjectArea}
Tailor explanation to that domain's conventions

2. KEY TERMS:
Extract all difficult or technical words
Define each in simple language
Provide examples of usage

3. MAIN IDEA:
Lead with the core concept in one clear sentence
Then elaborate

4. STRUCTURE:
- What it is (definition)
- How it works (process/mechanism)
- Why it matters (importance/application)
- Examples (concrete instances)

5. VISUAL DESCRIPTION (if applicable):
Describe what a diagram would show
Help reader visualize the concept
Use spatial language (top, bottom, inside, outside)

6. REAL-WORLD CONNECTION:
Why does this matter?
Where would you encounter this?
How is it applied in real life?

SUBJECT-SPECIFIC GUIDELINES:

Legal Text:
- Translate legalese to plain English
- Explain practical implications
- Note what this means for the parties involved
- Define legal terms clearly
- Mention potential consequences

Medical Text:
- Use patient-friendly language
- Explain anatomy/processes simply
- Define all medical terminology
- Provide context about severity/treatment
- Include disclaimer about seeking professional advice

Technical/Code:
- Explain functionality first
- Then explain mechanism
- Use clear technical analogies
- Include simple examples if helpful
- Note practical applications

Scientific:
- Build from basic principles
- Explain technical terms
- Use everyday examples of scientific concepts
- Include real-world applications
- Make abstract concrete

Business/Finance:
- Explain in terms of money/value
- Use everyday financial examples
- Define business jargon
- Connect to personal experience

AVOID:
✗ Talking down to reader
✗ Oversimplifying to the point of inaccuracy
✗ Using more jargon than necessary
✗ Assuming too much prior knowledge
✗ Making it boring or dry
✗ Circular definitions
✗ Vague analogies that don't help

QUALITY CHECKS:
✓ Would someone with zero background understand this?
✓ Are all technical terms defined?
✓ Is the explanation accurate?
✓ Does it progress logically?
✓ Are examples relevant and helpful?
✓ Is it engaging to read?
✓ Does it answer the core question?

═══════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════

{if simpleExplanation}
🎯 SIMPLE EXPLANATION
[Clear, accessible explanation in everyday language]

💡 KEY TAKEAWAY:
[One-sentence summary of main idea]

{if eli5Mode}
👶 EXPLAIN LIKE I'M 5
[Extremely simple explanation using child-friendly language and analogies]

{if stepByStep}
📋 STEP-BY-STEP BREAKDOWN
STEP 1: [Title]
[Explanation]

STEP 2: [Title]
[Explanation]

[Continue for all steps]

{if analogyMode}
🔗 REAL-WORLD ANALOGY
[Engaging analogy that makes concept click]

{if technicalDetailed}
📊 DETAILED TECHNICAL EXPLANATION
[More sophisticated explanation with proper terminology]

{if academicMode}
🎓 ACADEMIC/SCHOLARLY EXPLANATION
[Formal, comprehensive explanation using academic language]

ALWAYS INCLUDE:

📚 DIFFICULT WORDS DEFINED
[Word 1]: [Simple definition]
Example: [Usage example]

[Word 2]: [Simple definition]
Example: [Usage example]

[Continue for all difficult terms]

{if includeVisual}
📊 VISUAL REPRESENTATION
Imagine this diagram:
[Description of visual representation]

{if relatedConcepts}
🔍 RELATED CONCEPTS TO EXPLORE
• [Related concept 1]: [Why it's related]
• [Related concept 2]: [Why it's related]
• [Related concept 3]: [Why it's related]

🌍 WHY THIS MATTERS
[Real-world importance and applications]

Generate clear, comprehensive explanations that make complex ideas accessible to everyone.
```

=== SEO ARTICLE SECTION ===

Below tool, comprehensive 3000-word article:

Title: "How to Understand Complex Text: Complete Guide to Learning Anything"

H2: Why Complex Text is Hard to Understand
- Jargon and technical terms
- Assumed background knowledge
- Dense information
- Poor writing
- Subject-specific conventions

H2: Strategies for Understanding Difficult Text
- Break it down sentence by sentence
- Define every unfamiliar word
- Look for the main idea
- Create analogies
- Draw diagrams
- Teach it to someone else

H2: Understanding Different Types of Text

H3: Academic/Textbook Text
- How to approach
- Common patterns
- Study strategies

H3: Legal Documents
- Understanding contracts
- Translating legalese
- Key terms to know

H3: Medical Information
- Patient education
- Understanding diagnoses
- Asking the right questions

H3: Technical Documentation
- Code and programming
- Engineering specs
- Scientific papers

H3: Business/Financial
- Understanding reports
- Financial jargon
- Business communication

H2: The Power of Analogies
- How analogies work
- Creating your own
- When to use them
- Famous teaching analogies

H2: Breaking Down Step-by-Step
- Identifying processes
- Logical progression
- Flowcharting ideas

H2: Tools and Techniques
- Dictionary and glossaries
- Online resources
- AI explanation tools
- Study groups
- Expert consultation

H2: Common Confusing Concepts Explained
[50+ commonly confusing topics with clear explanations]

H2: FAQs
[50+ questions about understanding complex text]

=== SPECIAL FEATURES ===

1. **Smart Subject Detection:**
   - Auto-identifies topic (legal, medical, tech, etc.)
   - Adapts explanation style accordingly
   - Uses subject-appropriate analogies

2. **History & Comparison:**
   - Save explained texts (optional)
   - Compare different explanation modes
   - Track learning progress

3. **Interactive Follow-Up:**
   - Ask clarifying questions
   - Explain specific parts deeper
   - Get more examples

4. **Study Mode:**
   - Create flashcards from key terms
   - Generate quiz questions
   - Export study materials

5. **Multi-Language:**
   - Explain in different languages
   - Translate + explain
   - Language learning support

6. **Browser Extension:**
   - Highlight text on any website
   - Right-click "Explain This"
   - Instant popup explanation

=== WHY THIS WILL BE HUGE ===

1. **Universal Daily Need**: Everyone encounters confusing text multiple times daily
2. **Not One-Time Use**: Unlike generators, this solves ongoing problem
3. **All Subjects**: Works for science, law, medicine, tech, business - everything
4. **Privacy Critical**: People need to paste sensitive documents
5. **Bookmark Forever**: Will use 5-10+ times per day
6. **Student Essential**: Homework help tool
7. **Professional Tool**: Contract, report, email understanding
8. **Viral Sharing**: "This tool just explained my lease in 30 seconds"
9. **Low Competition**: Few tools do this well
10. **Massive Search Volume**: Hundreds of thousands of monthly searches

Build this as the universal comprehension engine that becomes indispensable to millions of users.

```
