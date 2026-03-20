# AI Homework Solver - Complete Build Specification

## Product Positioning
**Tagline:** "Solve Any Homework Step-by-Step (Like a Private Tutor)"

**Core Value Proposition:**
- Step-by-step solutions with explanations
- Multi-subject support (math, science, history, etc.)
- Image upload support (take photo of homework)
- Learning-focused (not just answers)

---

## Technical Architecture

### Stack Requirements
- **Frontend:** React with TypeScript
- **AI Integration:** Anthropic Claude API (Sonnet 4)
- **OCR:** Tesseract.js for image text extraction
- **Image Processing:** Canvas API for preprocessing
- **Math Rendering:** KaTeX or MathJax for equations
- **State Management:** React hooks + localStorage
- **Styling:** Tailwind CSS

### Performance Optimizations
- Image compression before OCR
- Progressive rendering of steps
- Caching solved problems locally
- Debounced API calls

---

## UI Layout Specification

### Above the Fold

**Header Section:**
```
[Logo] AI Homework Solver
H1: AI Homework Solver (Step-by-Step Answers)
Subheading: Get detailed explanations for any homework problem
```

**Primary Input Options:**
- **Text Input Tab** (default)
  - Large textarea: "Paste your question here..."
  - Character counter
- **Image Upload Tab**
  - Drag-and-drop zone
  - Camera icon for mobile photo capture
  - "Upload Image" button

**Subject Auto-Detect Banner** 🔥
```
After input, show:
"📚 Detected: [Mathematics / Physics / Chemistry / History / etc.]"
- Auto-detected from question content
- User can manually override if incorrect
```

**Quick Example Questions:**
```
Try these examples:
- "Solve: 2x + 5 = 13"
- "Explain the water cycle"
- "What caused World War I?"
- "Calculate the area of a circle with radius 5cm"
```

### Main Application Layout

**Single Column, Card-Based Design:**

#### Input Section (Top)
**Question Display:**
- Original question text (editable)
- If from image: show original image thumbnail
- Subject tag badge
- Difficulty indicator (auto-detected: Easy/Medium/Hard)

**Action Buttons:**
```
Primary: [Solve This Problem]
Secondary: 
- [Show Hints First]
- [Explain Like I'm 10] (simplified mode)
- [Clear] 
```

#### Output Section (Progressive Reveal)

**Card 1: Quick Answer** (appears first)
```
✓ Final Answer
[Large, prominent display of answer]

Example: "x = 4"
```

**Card 2: Step-by-Step Solution** (main feature)
```
📝 Solution Steps

Step 1: [Title of step]
[Detailed explanation]
[Mathematical notation if applicable]

Step 2: [Title of step]
[Explanation]
[Visual diagram if helpful]

[Continue for all steps...]

Each step has:
- Clear numbering
- Bold step title
- Detailed explanation in plain language
- Math rendering for equations
- Optional: "Why this step?" tooltip
```

**Card 3: Key Concepts** 🔥
```
💡 Key Concepts Used

- [Concept 1]: Brief definition
- [Concept 2]: Brief definition
- [Concept 3]: Brief definition

[Link to learn more about each concept]
```

**Card 4: Practice More**
```
🎯 Practice Similar Problems

[Auto-generated similar questions]
- Problem 1
- Problem 2
- Problem 3

[Solve Another Problem button]
```

---

## Core Features Implementation

### 1. Subject Auto-Detection 🔥

**Implementation:**
```javascript
function detectSubject(questionText) {
  const subjectKeywords = {
    mathematics: ['solve', 'equation', 'calculate', 'x =', 'derivative', 'integral', 'polynomial', 'fraction', 'algebra', 'geometry', 'trigonometry'],
    physics: ['force', 'velocity', 'acceleration', 'energy', 'mass', 'newton', 'motion', 'wave', 'light', 'electricity'],
    chemistry: ['element', 'compound', 'molecule', 'reaction', 'atom', 'periodic table', 'bond', 'acid', 'base', 'pH'],
    biology: ['cell', 'DNA', 'organism', 'photosynthesis', 'evolution', 'ecosystem', 'species', 'protein'],
    history: ['war', 'revolution', 'century', 'empire', 'treaty', 'civilization', 'ancient', 'modern'],
    literature: ['author', 'novel', 'poem', 'theme', 'character', 'metaphor', 'shakespeare'],
    geography: ['country', 'continent', 'river', 'mountain', 'climate', 'capital', 'ocean']
  };
  
  const scores = {};
  const lowerText = questionText.toLowerCase();
  
  Object.entries(subjectKeywords).forEach(([subject, keywords]) => {
    scores[subject] = keywords.filter(kw => lowerText.includes(kw)).length;
  });
  
  const detectedSubject = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])[0];
  
  return {
    subject: detectedSubject[0],
    confidence: detectedSubject[1] > 0 ? 'high' : 'low'
  };
}
```

### 2. OCR Integration (Tesseract.js)

**Image Preprocessing:**
```javascript
async function preprocessImage(imageFile) {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      // Resize if too large (max 2000px width)
      let width = img.width;
      let height = img.height;
      
      if (width > 2000) {
        height = (height / width) * 2000;
        width = 2000;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Increase contrast for better OCR
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        // Convert to grayscale
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        // Apply threshold
        const threshold = gray > 128 ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = threshold;
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      canvas.toBlob(resolve, 'image/png');
    };
    
    img.src = URL.createObjectURL(imageFile);
  });
}

async function extractTextFromImage(imageFile) {
  // Preprocess image
  const processedImage = await preprocessImage(imageFile);
  
  // Show loading indicator
  showLoadingMessage('Reading your homework...');
  
  // Run OCR
  const result = await Tesseract.recognize(
    processedImage,
    'eng',
    {
      logger: m => {
        if (m.status === 'recognizing text') {
          updateProgress(m.progress * 100);
        }
      }
    }
  );
  
  return result.data.text;
}
```

### 3. Multi-Step Reasoning Formatting

**Claude API Integration with Step Structure:**
```javascript
async function solveHomework(question, subject) {
  const systemPrompt = `You are an expert tutor helping a student understand their homework. Your goal is to teach, not just give answers.

Subject: ${subject}

Response Format (MANDATORY):

ANSWER:
[Provide the final answer clearly]

STEPS:
Step 1: [Step title]
[Detailed explanation of this step]
[Show work/calculations]

Step 2: [Step title]
[Explanation]
[Calculations]

[Continue for all steps needed]

CONCEPTS:
- [Key concept 1]: [Brief explanation]
- [Key concept 2]: [Brief explanation]

WHY_IT_MATTERS:
[Brief explanation of why this problem/topic is important]

IMPORTANT:
- Break down complex steps into smaller sub-steps
- Explain WHY each step is done, not just HOW
- Use simple language suitable for students
- Include examples or analogies where helpful
- For math: show all work clearly
- For science: explain underlying principles
- For humanities: provide context`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2500,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Problem: ${question}\n\nPlease solve this step-by-step following the format exactly.`
        }
      ]
    })
  });
  
  const data = await response.json();
  return parseStructuredResponse(data.content[0].text);
}

function parseStructuredResponse(text) {
  const sections = {
    answer: '',
    steps: [],
    concepts: [],
    why_it_matters: ''
  };
  
  // Parse ANSWER section
  const answerMatch = text.match(/ANSWER:\s*([\s\S]*?)(?=STEPS:|$)/);
  if (answerMatch) sections.answer = answerMatch[1].trim();
  
  // Parse STEPS section
  const stepsMatch = text.match(/STEPS:\s*([\s\S]*?)(?=CONCEPTS:|$)/);
  if (stepsMatch) {
    const stepsText = stepsMatch[1];
    const stepRegex = /Step \d+:([^\n]+)\n([\s\S]*?)(?=Step \d+:|$)/g;
    let match;
    
    while ((match = stepRegex.exec(stepsText)) !== null) {
      sections.steps.push({
        title: match[1].trim(),
        content: match[2].trim()
      });
    }
  }
  
  // Parse CONCEPTS section
  const conceptsMatch = text.match(/CONCEPTS:\s*([\s\S]*?)(?=WHY_IT_MATTERS:|$)/);
  if (conceptsMatch) {
    const conceptLines = conceptsMatch[1].split('\n').filter(line => line.trim().startsWith('-'));
    sections.concepts = conceptLines.map(line => {
      const [name, ...descParts] = line.replace(/^-\s*/, '').split(':');
      return {
        name: name.trim(),
        description: descParts.join(':').trim()
      };
    });
  }
  
  // Parse WHY_IT_MATTERS section
  const whyMatch = text.match(/WHY_IT_MATTERS:\s*([\s\S]*?)$/);
  if (whyMatch) sections.why_it_matters = whyMatch[1].trim();
  
  return sections;
}
```

### 4. "Explain Like I'm 10" Mode

**Implementation:**
```javascript
async function simplifiedExplanation(question, subject) {
  const systemPrompt = `You are explaining homework to a 10-year-old child. Use:
  - Very simple words
  - Short sentences
  - Everyday examples and analogies
  - Encouraging tone
  - No complex jargon
  
  Break down the problem into tiny, easy steps.`;
  
  const response = await askClaude(question, systemPrompt);
  return response;
}
```

### 5. "Show More Steps" Feature

**Implementation:**
```javascript
// For initially collapsed steps
function renderStepWithExpandToggle(step, index) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="step-card">
      <div className="step-header">
        <span className="step-number">Step {index + 1}</span>
        <h3>{step.title}</h3>
      </div>
      
      <div className="step-content">
        {expanded ? (
          <>
            {step.content}
            <button onClick={() => setExpanded(false)}>
              Show Less
            </button>
          </>
        ) : (
          <>
            {step.content.slice(0, 100)}...
            <button onClick={() => setExpanded(true)}>
              Show More Steps
            </button>
          </>
        )}
      </div>
    </div>
  );
}
```

---

## Viral + SEO Strategy (Critical Traffic Engine)

### Auto-Generated Question Pages

**URL Structure:**
```
/solve/[subject]/[question-slug]

Examples:
/solve/math/how-to-factor-quadratic-equations
/solve/chemistry/balance-chemical-equations-step-by-step
/solve/physics/calculate-force-using-newtons-second-law
```

**Page Generation Pipeline:**
```javascript
// When user solves a problem, offer to create shareable page
async function createShareableSolution(question, solution, subject) {
  const slug = generateSlug(question);
  const pageData = {
    question,
    solution,
    subject,
    createdAt: Date.now(),
    views: 0,
    helpful_count: 0
  };
  
  // Store in database or static file system
  savePage(`/solve/${subject}/${slug}`, pageData);
  
  // Show share modal
  showShareModal({
    url: `https://yoursite.com/solve/${subject}/${slug}`,
    title: `How to solve: ${question}`,
    description: solution.answer
  });
}

function generateSlug(question) {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}
```

**SEO Template for Generated Pages:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>How to Solve: [Question] | Step-by-Step Solution</title>
  <meta name="description" content="Detailed step-by-step solution to [question]. Learn [subject] with clear explanations and examples.">
  
  <!-- Schema.org markup for rich snippets -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to solve: [question]",
    "description": "[brief answer]",
    "step": [
      {
        "@type": "HowToStep",
        "name": "[Step 1 title]",
        "text": "[Step 1 content]"
      }
      // ... more steps
    ]
  }
  </script>
</head>
<body>
  <h1>How to Solve: [Question]</h1>
  
  <div class="answer-box">
    <strong>Answer:</strong> [final answer]
  </div>
  
  <h2>Step-by-Step Solution</h2>
  [Render all steps]
  
  <div class="try-solver-cta">
    <button>Solve Your Own Homework Problem</button>
  </div>
  
  <section class="related-problems">
    <h3>Related Problems</h3>
    [List similar solved problems]
  </section>
</body>
</html>
```

### Common Question Database

**Build library of frequently asked problems:**
```javascript
const commonQuestions = {
  math: [
    "How to solve quadratic equations",
    "How to find the slope of a line",
    "How to calculate percentage",
    "How to factor polynomials",
    "How to solve systems of equations"
  ],
  chemistry: [
    "How to balance chemical equations",
    "How to calculate molarity",
    "How to name ionic compounds",
    "How to determine oxidation states"
  ],
  physics: [
    "How to calculate velocity",
    "How to use Newton's laws",
    "How to solve projectile motion problems",
    "How to calculate work and energy"
  ]
  // ... more subjects
};

// Pre-generate pages for these common questions
async function seedCommonQuestions() {
  for (const [subject, questions] of Object.entries(commonQuestions)) {
    for (const question of questions) {
      const solution = await solveHomework(question, subject);
      createShareableSolution(question, solution, subject);
    }
  }
}
```

---

## Retention Features

### 1. Save Solved Problems

**LocalStorage Structure:**
```javascript
const solvedProblems = {
  history: [
    {
      id: generateUUID(),
      question: "...",
      subject: "math",
      solution: { ... },
      solvedAt: Date.now(),
      starred: false
    }
  ],
  favorites: []
};

// Save to localStorage
function saveSolvedProblem(problem) {
  const history = JSON.parse(localStorage.getItem('homework-history') || '{"history":[]}');
  history.history.unshift(problem);
  
  // Keep only last 50 problems
  history.history = history.history.slice(0, 50);
  
  localStorage.setItem('homework-history', JSON.stringify(history));
}

// UI Component
function HistorySidebar() {
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('homework-history') || '{"history":[]}');
    setHistory(saved.history);
  }, []);
  
  return (
    <div className="history-panel">
      <h3>Recent Problems</h3>
      {history.map(item => (
        <div key={item.id} className="history-item" onClick={() => loadProblem(item)}>
          <span className="subject-tag">{item.subject}</span>
          <p>{item.question.slice(0, 60)}...</p>
          <button onClick={(e) => {
            e.stopPropagation();
            toggleStar(item.id);
          }}>
            {item.starred ? '⭐' : '☆'}
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 2. "Practice Similar Questions" 🔥

**Implementation:**
```javascript
async function generatePracticeProblems(originalQuestion, subject, difficulty) {
  const prompt = `Based on this homework problem:
  "${originalQuestion}"
  
  Generate 3 similar practice problems at the same difficulty level.
  Return ONLY a JSON array with this structure:
  [
    { "question": "...", "hint": "..." },
    { "question": "...", "hint": "..." },
    { "question": "...", "hint": "..." }
  ]`;
  
  const response = await askClaude(prompt);
  const problems = JSON.parse(response.content[0].text);
  
  return problems;
}

// UI Component
function PracticeSection({ originalProblem }) {
  const [practiceProblems, setPracticeProblems] = useState([]);
  
  useEffect(() => {
    generatePracticeProblems(
      originalProblem.question,
      originalProblem.subject,
      originalProblem.difficulty
    ).then(setPracticeProblems);
  }, [originalProblem]);
  
  return (
    <div className="practice-card">
      <h3>🎯 Practice Similar Problems</h3>
      {practiceProblems.map((problem, i) => (
        <div key={i} className="practice-item">
          <p>{problem.question}</p>
          <button onClick={() => solveProblem(problem.question)}>
            Solve This
          </button>
          <details>
            <summary>Need a hint?</summary>
            {problem.hint}
          </details>
        </div>
      ))}
    </div>
  );
}
```

---

## Gamification Features (New)

### 1. Daily Streak Tracker

**Implementation:**
```javascript
function updateStreak() {
  const streakData = JSON.parse(localStorage.getItem('homework-streak') || '{"current":0,"best":0,"lastDate":null}');
  
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  if (streakData.lastDate === yesterday || streakData.lastDate === today) {
    // Continue streak
    if (streakData.lastDate !== today) {
      streakData.current += 1;
      streakData.lastDate = today;
    }
  } else {
    // Streak broken, reset
    streakData.current = 1;
    streakData.lastDate = today;
  }
  
  // Update best streak
  if (streakData.current > streakData.best) {
    streakData.best = streakData.current;
  }
  
  localStorage.setItem('homework-streak', JSON.stringify(streakData));
  
  return streakData;
}

// UI Component
function StreakBanner() {
  const streak = updateStreak();
  
  return (
    <div className="streak-banner">
      🔥 {streak.current} day streak! Keep learning!
      {streak.current >= 7 && <span className="achievement">🏆 One week milestone!</span>}
    </div>
  );
}
```

### 2. Encouragement Feedback

**After Solving:**
```javascript
function showEncouragement(problemsToday) {
  const messages = [
    "Great job! 🎉",
    "You're on fire! 🔥",
    "Keep up the excellent work! 💪",
    "Learning is your superpower! ⚡",
    "You solved it! Well done! ⭐"
  ];
  
  if (problemsToday === 1) {
    return "First problem of the day! 🌟";
  } else if (problemsToday === 5) {
    return "You solved 5 problems today! You're crushing it! 🏆";
  } else if (problemsToday === 10) {
    return "10 problems! You're a homework champion! 👑";
  }
  
  return messages[Math.floor(Math.random() * messages.length)];
}
```

### 3. Subject Progress Tracking

**Implementation:**
```javascript
function trackProgress() {
  const progress = JSON.parse(localStorage.getItem('subject-progress') || '{}');
  
  // Track problems solved per subject
  function addProblem(subject) {
    if (!progress[subject]) {
      progress[subject] = { solved: 0, topics: {} };
    }
    progress[subject].solved += 1;
    localStorage.setItem('subject-progress', JSON.stringify(progress));
  }
  
  // UI Display
  return (
    <div className="progress-dashboard">
      <h3>Your Learning Progress</h3>
      {Object.entries(progress).map(([subject, data]) => (
        <div key={subject} className="subject-progress">
          <span className="subject-name">{subject}</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(data.solved * 2, 100)}%` }}></div>
          </div>
          <span className="problems-count">{data.solved} problems solved</span>
        </div>
      ))}
    </div>
  );
}
```

---

## Mobile Optimization

### Camera Integration
```javascript
// For mobile devices
function MobileCameraCapture() {
  const inputRef = useRef(null);
  
  return (
    <button onClick={() => inputRef.current.click()}>
      📸 Take Photo of Homework
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => handleImageCapture(e.target.files[0])}
        style={{ display: 'none' }}
      />
    </button>
  );
}
```

### Responsive Layout
```css
/* Mobile-first design */
@media (max-width: 768px) {
  .input-section {
    padding: 1rem;
  }
  
  .solution-card {
    margin: 0.5rem 0;
  }
  
  .step-content {
    font-size: 16px; /* Readable on mobile */
    line-height: 1.6;
  }
}
```

---

## Analytics & Optimization

### Track Key Metrics
```javascript
// Track what users are solving
function logProblemSolved(subject, difficulty, method) {
  // Send to analytics
  analytics.track('Problem Solved', {
    subject,
    difficulty,
    inputMethod: method, // 'text' or 'image'
    timestamp: Date.now()
  });
}

// Track which subjects are most popular
// Use this data to:
// 1. Pre-generate more content for popular subjects
// 2. Improve OCR for common problem types
// 3. Optimize step explanations
```

---

## Content Strategy for Traffic Explosion

### 1. Create Landing Pages for Each Subject
```
/math-homework-solver
/physics-homework-help
/chemistry-problem-solver
/biology-homework-answers
```

### 2. Blog Content (SEO Magnets)
```
- "How to Solve [Topic] Step by Step"
- "Top 10 Hardest [Subject] Problems Explained"
- "Study Guide: Master [Topic] in 7 Days"
- "[Subject] Formulas You Must Know"
```

### 3. Social Proof
```
Display statistics:
- "Join 50,000+ students getting homework help"
- "1M+ problems solved this month"
- "Average 4.8/5 rating"
```

---

## Success Metrics

**Track these KPIs:**
- Problems solved per day
- Unique users
- Return rate (daily/weekly)
- Average session duration
- Most popular subjects
- OCR success rate
- User satisfaction (thumbs up/down on solutions)