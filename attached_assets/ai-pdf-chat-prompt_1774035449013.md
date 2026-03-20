# AI PDF Chat - Complete Build Specification

## Product Positioning
**Tagline:** "Chat with PDFs Instantly — No Upload, No Server, Fully Private"

**Core Value Proposition:**
- 100% client-side processing (privacy-first)
- No file uploads to external servers
- Instant responses using local AI
- Free to use, no login required

---

## Technical Architecture

### Stack Requirements
- **Frontend:** React with TypeScript
- **PDF Processing:** PDF.js for rendering and text extraction
- **AI Integration:** Anthropic Claude API (client-side calls)
- **State Management:** React hooks + localStorage
- **Styling:** Tailwind CSS with custom design tokens

### Performance Critical Features
- Chunked PDF parsing (process large files without freezing)
- Incremental text extraction (show progress)
- Debounced search queries
- Virtual scrolling for large documents

---

## UI Layout Specification

### Above the Fold

**Header Section:**
```
[Logo] AI PDF Chat
H1: Chat With Any PDF (Free & Private)
Subheading: No uploads, no servers - everything runs in your browser
```

**Primary CTA Buttons:**
- Upload PDF (large, prominent)
- Try Sample PDF 🔥 (secondary button with sample document)

**Trust Indicators:**
- "🔒 100% Private - Files never leave your device"
- "⚡ Instant Responses"
- "🆓 Completely Free"

### Main Application Layout

**Split View (Responsive):**

#### Left Panel (50% width on desktop)
**PDF Viewer Component:**
- Full PDF rendering with PDF.js
- Zoom controls (25%, 50%, 75%, 100%, 125%, 150%, 200%)
- Page navigation:
  - Previous/Next buttons
  - Page number input (e.g., "Page 5 of 24")
  - Jump to page dropdown
- Thumbnail sidebar (collapsible) 🔥
  - Miniature page previews
  - Click to jump to page
  - Current page highlight
- Search in PDF functionality
  - Highlight all matches
  - Navigation between results
- Text selection with floating action button:
  - "Ask about this" button appears on text highlight
  - Auto-injects selected text into chat

#### Right Panel (50% width on desktop)
**Chat Interface:**

**Dynamic Suggested Prompts (Content-Aware)** 🔥
```
When PDF loads, analyze structure and show relevant prompts:

For academic papers:
- "Summarize the main findings"
- "What methodology was used?"
- "List key references"

For business documents:
- "What are the action items?"
- "Summarize key decisions"
- "Extract important dates"

For legal documents:
- "What are the main terms?"
- "Identify obligations"
- "List all parties involved"

General prompts (always available):
- "Summarize this entire document"
- "What is this document about?"
- "Create a table of contents"
```

**Chat Message Area:**
- Auto-scroll to latest message
- Message bubbles with:
  - User messages (right-aligned, blue)
  - AI responses (left-aligned, gray)
  - Timestamp
  - Page references (clickable to jump to page)
- Loading indicator during AI response
- Copy button for each AI message

**Input Area:**
- Large text input with auto-expand
- Character counter
- Send button
- Quick actions:
  - "Explain this page" (context: current page)
  - "Summarize document"
  - Clear chat button

---

## Core Features Implementation

### 1. PDF Processing Pipeline

**Step 1: File Upload**
```javascript
// Accept PDF via:
- File input dialog
- Drag and drop
- URL input (optional)

// Validation:
- File type check (.pdf only)
- Size limit (recommend 50MB max for performance)
- Error handling for corrupted files
```

**Step 2: Chunked Parsing** (Performance Critical)
```javascript
// Process PDF in chunks to avoid UI freeze
async function processPDF(file) {
  const pdf = await pdfjsLib.getDocument(file);
  const numPages = pdf.numPages;
  
  // Extract text page by page with progress
  let fullText = '';
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    
    fullText += `\n--- PAGE ${i} ---\n${pageText}`;
    
    // Update progress UI
    updateProgress(i / numPages * 100);
  }
  
  return {
    fullText,
    numPages,
    metadata: await pdf.getMetadata()
  };
}
```

### 2. Semantic Search Over PDF 🔥

**Implementation:**
```javascript
// Create searchable chunks with metadata
function createSearchableChunks(fullText, chunkSize = 1000) {
  const chunks = [];
  const pages = fullText.split('--- PAGE');
  
  pages.forEach((pageText, pageNum) => {
    // Split long pages into smaller chunks
    const words = pageText.split(' ');
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push({
        text: words.slice(i, i + chunkSize).join(' '),
        pageNum: pageNum + 1,
        chunkId: `page${pageNum}_chunk${i}`
      });
    }
  });
  
  return chunks;
}

// Search function with relevance scoring
function searchPDF(query, chunks) {
  return chunks
    .map(chunk => ({
      ...chunk,
      score: calculateRelevance(query, chunk.text)
    }))
    .filter(chunk => chunk.score > 0.3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // Top 5 most relevant chunks
}

function calculateRelevance(query, text) {
  // Simple keyword matching (can be enhanced with TF-IDF)
  const queryWords = query.toLowerCase().split(' ');
  const textWords = text.toLowerCase();
  
  let matches = 0;
  queryWords.forEach(word => {
    if (textWords.includes(word)) matches++;
  });
  
  return matches / queryWords.length;
}
```

### 3. AI Chat Integration

**Claude API Call Structure:**
```javascript
async function askClaude(userQuestion, pdfContext, conversationHistory) {
  // Find relevant chunks
  const relevantChunks = searchPDF(userQuestion, pdfContext.chunks);
  
  // Build context for Claude
  const contextText = relevantChunks
    .map(chunk => `[Page ${chunk.pageNum}]: ${chunk.text}`)
    .join('\n\n');
  
  const systemPrompt = `You are a helpful AI assistant analyzing a PDF document. 
  
  The user has uploaded a PDF and is asking questions about it. Use the provided context to answer accurately. Always cite page numbers when referencing specific information.
  
  PDF Context:
  ${contextText}
  
  If the answer isn't in the provided context, say so clearly.`;
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        ...conversationHistory,
        { role: 'user', content: userQuestion }
      ]
    })
  });
  
  return response.json();
}
```

### 4. Highlight → Ask Feature

**Implementation:**
```javascript
// Detect text selection in PDF viewer
document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  if (selectedText.length > 0) {
    // Get position of selection
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Show floating button near selection
    showFloatingButton({
      text: 'Ask about this',
      position: { x: rect.x, y: rect.y - 40 },
      onClick: () => {
        // Inject selected text into chat
        populateChatInput(`Explain: "${selectedText}"`);
      }
    });
  }
});
```

---

## Smart Interactions

### 1. Click Paragraph → Auto-Inject
```javascript
// Make PDF text paragraphs clickable
function makeInteractive(pdfContainer) {
  const paragraphs = pdfContainer.querySelectorAll('.textLayer span');
  
  paragraphs.forEach(p => {
    p.addEventListener('click', (e) => {
      const text = e.target.textContent;
      populateChatInput(`Tell me about: "${text}"`);
    });
  });
}
```

### 2. Quick Action Buttons

**"Explain this page"**
```javascript
function explainCurrentPage(currentPageNum, pdfText) {
  const pageText = extractPageText(pdfText, currentPageNum);
  askClaude(`Please explain the content on page ${currentPageNum}: ${pageText}`);
}
```

**"Summarize entire document"**
```javascript
function summarizeDocument(pdfMetadata, fullText) {
  const prompt = `Please provide a comprehensive summary of this ${pdfMetadata.numPages}-page document. Include:
  1. Main topic/purpose
  2. Key points
  3. Important conclusions or recommendations
  
  Document text: ${fullText.slice(0, 10000)}...`; // Truncate if too long
  
  askClaude(prompt);
}
```

---

## Retention Loops

### 1. Save Session Locally

**LocalStorage Structure:**
```javascript
const sessionData = {
  sessionId: generateUUID(),
  timestamp: Date.now(),
  pdfInfo: {
    name: file.name,
    numPages: pdf.numPages,
    // Don't store full PDF - too large
  },
  chatHistory: [
    { role: 'user', content: '...', timestamp: ... },
    { role: 'assistant', content: '...', timestamp: ... }
  ],
  bookmarks: [
    { pageNum: 5, note: 'Important section' }
  ]
};

localStorage.setItem(`pdf-chat-session-${sessionId}`, JSON.stringify(sessionData));
```

### 2. "Re-open Last PDF"

**Implementation:**
```javascript
// On app load, check for recent sessions
function checkRecentSessions() {
  const sessions = Object.keys(localStorage)
    .filter(key => key.startsWith('pdf-chat-session-'))
    .map(key => JSON.parse(localStorage.getItem(key)))
    .sort((a, b) => b.timestamp - a.timestamp);
  
  if (sessions.length > 0) {
    showResumePrompt(sessions[0]);
  }
}

function showResumePrompt(session) {
  // Show modal: "Resume your chat with [filename]?"
  // If yes, restore chat history (but user must re-upload PDF)
}
```

### 3. Export Features 🔥

**Export Summary**
```javascript
function exportSummary(chatHistory, pdfName) {
  // Generate markdown document
  const markdown = `# Summary: ${pdfName}
  
Generated: ${new Date().toLocaleDateString()}

## Chat Summary

${chatHistory.map(msg => `
**${msg.role === 'user' ? 'Question' : 'Answer'}:**
${msg.content}
`).join('\n---\n')}
`;
  
  downloadAsFile(markdown, `${pdfName}-summary.md`);
}
```

**Export Notes**
```javascript
function exportNotes(userMessages) {
  const notes = userMessages
    .filter(msg => msg.role === 'user')
    .map(msg => `- ${msg.content}`)
    .join('\n');
  
  downloadAsFile(notes, 'pdf-notes.txt');
}
```

**Export Q&A Pairs** 🔥
```javascript
function exportQAPairs(chatHistory) {
  const pairs = [];
  
  for (let i = 0; i < chatHistory.length - 1; i += 2) {
    if (chatHistory[i].role === 'user' && chatHistory[i + 1].role === 'assistant') {
      pairs.push({
        question: chatHistory[i].content,
        answer: chatHistory[i + 1].content
      });
    }
  }
  
  const csv = 'Question,Answer\n' + pairs.map(p => 
    `"${p.question}","${p.answer}"`
  ).join('\n');
  
  downloadAsFile(csv, 'qa-pairs.csv');
}
```

---

## Viral Feature: Generate Study Notes from PDF 🔥

**Implementation:**
```javascript
async function generateStudyNotes(pdfText, pdfMetadata) {
  const prompt = `You are an expert study guide creator. Based on this document, create comprehensive study notes in the following format:

  # Study Notes: [Document Title]
  
  ## Overview
  [Brief summary]
  
  ## Key Concepts
  [Bullet points of main ideas]
  
  ## Important Definitions
  [Term: Definition format]
  
  ## Summary Points
  [Numbered list of key takeaways]
  
  ## Study Questions
  [5-10 questions to test understanding]
  
  Document content:
  ${pdfText.slice(0, 15000)}`;
  
  const response = await askClaude(prompt);
  
  // Display in modal with export button
  showStudyNotesModal(response);
}
```

**CTA Placement:**
- Prominent button in chat interface: "📝 Generate Study Notes"
- Auto-suggest for academic PDFs (detect keywords: research, study, chapter, textbook)

**Viral Mechanics:**
- Shareable study notes (export as PDF or markdown)
- "Generated with AI PDF Chat" watermark
- Social sharing buttons