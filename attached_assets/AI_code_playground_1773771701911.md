Create a mobile-first, SEO-optimized Private AI Code Playground for browseraitools.com using WebLLM.
=== BRAND IDENTITY ===
Website: browseraitools.com
Tool Name: Private AI Code Playground
URL Slug: /ai-code-playground
Tagline: "Generate, Run & Fix Code in Your Browser – Nothing Leaves Your Device"
Mission: Give developers and learners a fully private, unlimited code playground where they can prompt, generate, instantly run, and auto-fix code with zero data leaving the device.
=== PRODUCT OVERVIEW ===
High-traffic tool (~130,000 monthly searches).
Purpose: Prompt or choose template → AI generates code → click Run → code executes instantly in-browser → error? Click “Fix Error” → AI sees both code + real console error and fixes it in one shot.
Target Users: Developers, students, bootcamp learners, indie hackers, anyone who codes
Search Demand: ~130,000 monthly searches ("browser code playground", "private ai code editor", "run code in browser", "offline code playground")
Key Value: Full generate-run-debug loop in your browser with zero limits and total privacy
=== UNIQUE SELLING POINTS ===
✅ True 3-panel playground (Prompt | Monaco Editor | Live Console)
✅ One-click “Fix This Error” (AI sees real runtime error)
✅ Instant in-browser execution (JavaScript + Pyodide Python)
✅ Persistent local projects (IndexedDB)
✅ Model switcher (Qwen 3 7B / Llama 3.3 8B / Phi-4-mini)
✅ Zero data leaves your device — works completely offline
✅ Templates, auto-save, shareable links, VS Code export
=== TECHNICAL FOUNDATION ===
Framework: React 18 + Vite
Styling: Tailwind CSS 3.4+
State Management: React useState + Monaco Editor
LLM Engine: @mlc-ai/web-llm (shared instance with streaming)
Model Options: Qwen-3-7B-Instruct-q4f16_1-MLC (best coding), Llama-3.3-8B-Instruct-q4f16_1-MLC, Phi-4-mini
Code Execution:

JavaScript/HTML/Tailwind/React → iframe sandbox
Python → Pyodide (WebAssembly) with NumPy, Pandas, Matplotlib
Storage: IndexedDB (persistent projects)
Export: .zip for VS Code, shareable local URL
Deployment: Vercel/Netlify

=== PAGE STRUCTURE ===
HERO SECTION:
Headline: "Private AI Code Playground"
Subheadline: "Generate, run, and instantly fix code entirely in your browser. No data leaves your device. No limits. No login."
Trust Badges:

⚡ Monaco Editor (VS Code quality)
▶ Instant Run Button
🔧 One-Click Fix Error
🐍 Python + JS Support
💾 Persistent Projects
🔒 100% Private & Offline

Success Counter: "Executed 1.2 million lines of code privately this month"
=== INPUT FORM & LAYOUT ===
Three-panel layout (desktop) / stacked mobile:
Left Panel – Prompt & Templates

Textarea prompt
Template buttons: React Component, Python Script, Tailwind Page, SQL Query, API Endpoint, Todo App, Data Dashboard, etc.

Center Panel – Monaco Editor

Full VS Code-level editor with syntax highlighting, line numbers, auto-complete
Live character count

Bottom Panel – Console / Output / Errors

Live output area
Error display with “Fix This Error” button (one-click)

GENERATE BUTTON
Large animated button: "Generate Code ✨"
Run Button: "▶ Run"
Fix Button: "🔧 Fix This Error"
=== OUTPUT SECTION ===
Live workflow:

Prompt or template → streaming code appears in Monaco Editor
Click ▶ Run → code executes instantly (iframe or Pyodide)
Output appears in bottom console
Error? Click “Fix This Error” → LLM receives full code + exact error message → corrected code replaces editor with explanation

Persistent project tabs at top (Saved Projects via IndexedDB)
=== WEBLLM PROMPTS ===
System Prompt:
textYou are a practical, production-ready coding assistant running entirely in the user's browser.

Core rules:
- Always output COMPLETE, runnable code in a single file when possible.
- Use modern, clean syntax with helpful comments.
- Prefer simple solutions over clever ones.
- Never use external dependencies unless absolutely necessary (and then list them clearly).
- For HTML/JS: include Tailwind via CDN when it makes sense.
- For Python: use only standard library + common Pyodide-supported packages.

When fixing errors:
- Read the exact error message.
- Provide the FULL corrected code.
- Add a short explanation of what was wrong and why the fix works.

Never apologize. Never say "I can't run code". Focus only on delivering working code.
User Prompt Template:
textYou are helping the user in a private browser code playground.

═══════════════════════════════════════
USER REQUEST: {prompt or template name}

CURRENT CODE IN EDITOR:
{currentCodeFromMonaco}

LATEST CONSOLE OUTPUT / ERROR:
{consoleOutputOrError}

═══════════════════════════════════════
TASK:
If this is a new request: generate complete runnable code.
If there is an error: fix the code completely and explain the change in one short sentence at the top (as a comment).

Always return ONLY the full corrected code block. No extra explanations outside the code unless fixing an error.
=== SEO ARTICLE SECTION ===
Below the tool, comprehensive 2800-word article:
Title: "Private AI Code Playground 2026 – Run & Fix Code in Browser (No Upload, No Limits)"
[Full guide: why private code tools matter, how Pyodide + WebLLM works, comparison vs Replit/ChatGPT/Cursor, real use cases for students & developers]
=== SPECIAL FEATURES ===

Model Switcher (Qwen 3 7B / Llama 3.3 8B / Phi-4-mini)
One-click “Fix This Error” (auto-feeds code + real error)
20+ ready templates
Persistent projects (IndexedDB)
“Continue in VS Code” .zip export
Shareable local URL (loads exact project)
Dark/light mode sync with site

Build this as the #1 Private AI Code Playground on the internet — the addictive generate-run-fix tool every developer will use daily and never leave.