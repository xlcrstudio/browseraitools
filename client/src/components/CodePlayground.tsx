import { useState, useRef, useCallback, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Wrench, Loader2, AlertTriangle, Code, Terminal,
  Plus, Save, Trash2, Download, Copy, CheckCircle2,
  ChevronDown, X, Sparkles, RotateCcw, FileCode, FolderOpen,
  Maximize2, Minimize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { usePlaygroundProjects, type PlaygroundProject } from "@/hooks/use-playground-projects";

const TEMPLATES: Array<{ name: string; language: string; code: string; prompt: string }> = [
  { name: "Hello World (JS)", language: "javascript", prompt: "Hello World in JavaScript", code: '// Hello World in JavaScript\nconsole.log("Hello, World!");\nconsole.log("Welcome to the AI Code Playground");' },
  { name: "React Todo (JSX)", language: "javascript", prompt: "React todo app", code: '// React Todo App - runs with JSX in the preview\nconst { useState } = React;\n\nfunction App() {\n  const [todos, setTodos] = useState([]);\n  const [input, setInput] = useState("");\n\n  const addTodo = () => {\n    if (!input.trim()) return;\n    setTodos([...todos, { id: Date.now(), text: input, done: false }]);\n    setInput("");\n  };\n\n  const toggle = (id) => setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));\n  const remove = (id) => setTodos(todos.filter(t => t.id !== id));\n\n  return (\n    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">\n      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-6 w-full max-w-md">\n        <h1 className="text-2xl font-bold text-white mb-4">Todo List</h1>\n        <div className="flex gap-2 mb-4">\n          <input value={input} onChange={e => setInput(e.target.value)}\n            onKeyDown={e => e.key === "Enter" && addTodo()}\n            placeholder="Add a task..." className="flex-1 px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />\n          <button onClick={addTodo} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add</button>\n        </div>\n        <ul className="space-y-2">\n          {todos.map(t => (\n            <li key={t.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg group">\n              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} className="w-4 h-4" />\n              <span className={\"flex-1 text-white \" + (t.done ? \"line-through opacity-50\" : \"\")}>{t.text}</span>\n              <button onClick={() => remove(t.id)} className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100">Delete</button>\n            </li>\n          ))}\n        </ul>\n        {todos.length === 0 && <p className="text-slate-500 text-center py-4">No tasks yet. Add one above.</p>}\n      </div>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.getElementById("root")).render(<App />);' },
  { name: "React Component", language: "html", prompt: "React component", code: '<!DOCTYPE html>\n<html><head>\n<script src="https://unpkg.com/react@18/umd/react.development.js"><\/script>\n<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>\n<script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>\n<script src="https://cdn.tailwindcss.com"><\/script>\n</head><body>\n<div id="root"></div>\n<script type="text/babel">\nfunction App() {\n  const [count, setCount] = React.useState(0);\n  return (\n    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">\n      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">\n        <h1 className="text-3xl font-bold text-gray-800 mb-4">Counter App</h1>\n        <p className="text-6xl font-mono text-indigo-600 mb-6">{count}</p>\n        <div className="flex gap-3 justify-center">\n          <button onClick={() => setCount(c => c - 1)} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">-1</button>\n          <button onClick={() => setCount(0)} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Reset</button>\n          <button onClick={() => setCount(c => c + 1)} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">+1</button>\n        </div>\n      </div>\n    </div>\n  );\n}\nReactDOM.createRoot(document.getElementById("root")).render(<App />);\n<\/script>\n</body></html>' },
  { name: "Tailwind Page", language: "html", prompt: "Tailwind landing page", code: '<!DOCTYPE html>\n<html><head>\n<script src="https://cdn.tailwindcss.com"><\/script>\n</head><body class="bg-gray-50">\n<div class="min-h-screen flex items-center justify-center">\n  <div class="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">\n    <h1 class="text-4xl font-bold text-gray-900 mb-3">Welcome</h1>\n    <p class="text-gray-600 mb-6">This is a Tailwind CSS page generated in your browser.</p>\n    <button class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition">Get Started</button>\n  </div>\n</div>\n</body></html>' },
  { name: "Todo App", language: "html", prompt: "Todo app with HTML, CSS, and JavaScript", code: '<!DOCTYPE html>\n<html><head>\n<script src="https://cdn.tailwindcss.com"><\/script>\n</head><body class="bg-gray-100 min-h-screen flex items-center justify-center p-4">\n<div class="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">\n  <h1 class="text-2xl font-bold text-gray-800 mb-4">Todo List</h1>\n  <div class="flex gap-2 mb-4">\n    <input id="inp" type="text" placeholder="Add a task..." class="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />\n    <button onclick="addTodo()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add</button>\n  </div>\n  <ul id="list" class="space-y-2"></ul>\n</div>\n<script>\nvar list = document.getElementById("list");\nvar inp = document.getElementById("inp");\nfunction addTodo() {\n  var text = inp.value.trim();\n  if (!text) return;\n  var li = document.createElement("li");\n  li.className = "flex items-center gap-3 p-3 bg-gray-50 rounded-lg group";\n  li.innerHTML = \'<input type="checkbox" onchange="this.parentElement.classList.toggle(\\\'line-through\\\')" class="w-4 h-4"><span class="flex-1">\' + text + \'</span><button onclick="this.parentElement.remove()" class="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100">Delete</button>\';\n  list.appendChild(li);\n  inp.value = "";\n}\ninp.addEventListener("keydown", function(e) { if (e.key === "Enter") addTodo(); });\n<\/script>\n</body></html>' },
  { name: "Python Script", language: "python", prompt: "Python script", code: '# Python Script - runs via Pyodide (WebAssembly)\nimport math\nimport random\n\ndef fibonacci(n):\n    """Generate first n Fibonacci numbers"""\n    fib = [0, 1]\n    for i in range(2, n):\n        fib.append(fib[i-1] + fib[i-2])\n    return fib[:n]\n\ndef is_prime(n):\n    """Check if a number is prime"""\n    if n < 2:\n        return False\n    for i in range(2, int(math.sqrt(n)) + 1):\n        if n % i == 0:\n            return False\n    return True\n\nprint("=== Fibonacci Sequence ===")\nprint(fibonacci(15))\n\nprint("\\n=== Prime Numbers (1-50) ===")\nprimes = [n for n in range(1, 51) if is_prime(n)]\nprint(primes)\n\nprint("\\n=== Random Stats ===")\ndata = [random.randint(1, 100) for _ in range(20)]\nprint(f"Data: {data}")\nprint(f"Mean: {sum(data)/len(data):.1f}")\nprint(f"Min: {min(data)}, Max: {max(data)}")' },
  { name: "Data Dashboard", language: "html", prompt: "Data dashboard with charts", code: '<!DOCTYPE html>\n<html><head>\n<script src="https://cdn.tailwindcss.com"><\/script>\n</head><body class="bg-gray-50 p-6">\n<div class="max-w-4xl mx-auto">\n  <h1 class="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>\n  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">\n    <div class="bg-white rounded-xl p-6 shadow-sm border"><p class="text-sm text-gray-500">Users</p><p class="text-3xl font-bold text-indigo-600">12,847</p><p class="text-xs text-green-600 mt-1">+12.5% this month</p></div>\n    <div class="bg-white rounded-xl p-6 shadow-sm border"><p class="text-sm text-gray-500">Revenue</p><p class="text-3xl font-bold text-emerald-600">$48.2K</p><p class="text-xs text-green-600 mt-1">+8.3% this month</p></div>\n    <div class="bg-white rounded-xl p-6 shadow-sm border"><p class="text-sm text-gray-500">Conversion</p><p class="text-3xl font-bold text-purple-600">3.24%</p><p class="text-xs text-red-500 mt-1">-0.4% this month</p></div>\n  </div>\n  <div class="bg-white rounded-xl p-6 shadow-sm border">\n    <h2 class="text-lg font-bold text-gray-700 mb-4">Revenue (last 7 days)</h2>\n    <canvas id="chart" height="200"></canvas>\n  </div>\n</div>\n<script>\nvar ctx = document.getElementById("chart").getContext("2d");\nvar data = [4200, 5100, 4800, 6200, 5800, 7100, 6900];\nvar labels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];\nvar max = Math.max.apply(null, data) * 1.2;\nvar w = ctx.canvas.width, h = ctx.canvas.height;\nvar barW = w / data.length * 0.6, gap = w / data.length;\nfor (var i = 0; i < data.length; i++) {\n  var v = data[i];\n  var bh = (v / max) * (h - 40);\n  var x = i * gap + (gap - barW) / 2;\n  var y = h - bh - 20;\n  ctx.fillStyle = "#6366f1";\n  ctx.fillRect(x, y, barW, bh);\n  ctx.fillStyle = "#6b7280";\n  ctx.font = "11px sans-serif";\n  ctx.textAlign = "center";\n  ctx.fillText(labels[i], x + barW / 2, h - 4);\n  ctx.fillText("$" + (v/1000).toFixed(1) + "k", x + barW / 2, y - 6);\n}\n<\/script>\n</body></html>' },
  { name: "API Endpoint (Mock)", language: "javascript", prompt: "Mock API endpoint handler", code: '// Mock API Endpoint Handler\n// Simulates a REST API with in-memory data\n\nvar db = {\n  users: [\n    { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },\n    { id: 2, name: "Bob", email: "bob@example.com", role: "user" },\n    { id: 3, name: "Charlie", email: "charlie@example.com", role: "user" },\n  ]\n};\n\nfunction handleRequest(method, path, body) {\n  console.log(method + " " + path);\n  \n  if (path === "/api/users" && method === "GET") {\n    return { status: 200, data: db.users };\n  }\n  if (path === "/api/users" && method === "POST") {\n    var newUser = Object.assign({ id: db.users.length + 1 }, body);\n    db.users.push(newUser);\n    return { status: 201, data: newUser };\n  }\n  return { status: 404, error: "Not Found" };\n}\n\nconsole.log("--- GET /api/users ---");\nconsole.log(JSON.stringify(handleRequest("GET", "/api/users"), null, 2));\n\nconsole.log("\\n--- POST /api/users ---");\nconsole.log(JSON.stringify(handleRequest("POST", "/api/users", {\n  name: "Diana", email: "diana@example.com", role: "user"\n}), null, 2));\n\nconsole.log("\\n--- GET /api/users (after add) ---");\nconsole.log(JSON.stringify(handleRequest("GET", "/api/users"), null, 2));' },
  { name: "Algorithm: Sorting", language: "javascript", prompt: "Sorting algorithms comparison", code: '// Sorting Algorithms Comparison\n\nfunction bubbleSort(arr) {\n  var a = arr.slice();\n  for (var i = 0; i < a.length; i++)\n    for (var j = 0; j < a.length - i - 1; j++)\n      if (a[j] > a[j+1]) { var tmp = a[j]; a[j] = a[j+1]; a[j+1] = tmp; }\n  return a;\n}\n\nfunction quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  var pivot = arr[arr.length - 1];\n  var left = arr.filter(function(x, i) { return x <= pivot && i !== arr.length - 1; });\n  var right = arr.filter(function(x) { return x > pivot; });\n  return quickSort(left).concat([pivot], quickSort(right));\n}\n\nfunction mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  var mid = Math.floor(arr.length / 2);\n  var left = mergeSort(arr.slice(0, mid));\n  var right = mergeSort(arr.slice(mid));\n  var result = [], i = 0, j = 0;\n  while (i < left.length && j < right.length)\n    result.push(left[i] < right[j] ? left[i++] : right[j++]);\n  return result.concat(left.slice(i), right.slice(j));\n}\n\nvar data = [];\nfor (var k = 0; k < 20; k++) data.push(Math.floor(Math.random() * 100));\nconsole.log("Original:", data);\nconsole.log("Bubble Sort:", bubbleSort(data));\nconsole.log("Quick Sort:", quickSort(data));\nconsole.log("Merge Sort:", mergeSort(data));\n\nvar big = [];\nfor (var k = 0; k < 5000; k++) big.push(Math.random());\nvar t;\nt = performance.now(); bubbleSort(big); console.log("Bubble: " + (performance.now()-t).toFixed(1) + "ms");\nt = performance.now(); quickSort(big); console.log("Quick: " + (performance.now()-t).toFixed(1) + "ms");\nt = performance.now(); mergeSort(big); console.log("Merge: " + (performance.now()-t).toFixed(1) + "ms");' },
];

const SYSTEM_PROMPT = `You are a practical, production-ready coding assistant running entirely in the user's browser.

Core rules:
- Always output COMPLETE, runnable code in a single file when possible.
- Use modern, clean syntax with helpful comments.
- Prefer simple solutions over clever ones.
- Never use external dependencies unless absolutely necessary (and then list them clearly).
- For Python: use only standard library + common Pyodide-supported packages.

IMPORTANT - JavaScript execution environment:
- When the language is JavaScript:
  - For React/JSX code: Write JSX directly. React 18 and ReactDOM 18 are available as GLOBALS (UMD). Babel transpiles JSX automatically. Tailwind CSS is available via CDN.
  - NEVER use import statements. NEVER use require().
  - Destructure hooks from React: const { useState, useEffect, useRef, useCallback } = React;
  - Always use proper React state management. NEVER mutate state directly. Use useState for ALL dynamic data.
  - Wire up ALL event handlers (onChange, onClick, onKeyDown). Every input MUST have both value and onChange.
  - Always render with: ReactDOM.createRoot(document.getElementById("root")).render(<App />);
  - Use className="..." with Tailwind utility classes for styling. NEVER use tailwind() as a function.
  - For plain JS (no UI): Write vanilla JavaScript. console.log output appears in the console panel.
- When the language is HTML/CSS/JS: Write a complete HTML document with inline styles and scripts.

EXAMPLE of correct React code in JavaScript mode:
const { useState } = React;
function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const addItem = () => { if (!text.trim()) return; setItems([...items, { id: Date.now(), text }]); setText(""); };
  return (
    <div className="p-4">
      <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && addItem()} className="border p-2 rounded" />
      <button onClick={addItem} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">Add</button>
      <ul>{items.map(i => <li key={i.id}>{i.text}</li>)}</ul>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);

When fixing errors:
- Read the exact error message.
- Provide the FULL corrected code.
- Add a short explanation of what was wrong and why the fix works as a comment at the top.

Never apologize. Never say "I can't run code". Focus only on delivering working code.`;

const LANGS = [
  { id: "javascript", label: "JavaScript", monacoLang: "javascript" },
  { id: "html", label: "HTML/CSS/JS", monacoLang: "html" },
  { id: "python", label: "Python", monacoLang: "python" },
];

export function CodePlayground() {
  const { state, progress, error: llmError, generateRaw } = useWebLLM();
  const { projects, activeId, setActiveId, saveProject, deleteProject } = usePlaygroundProjects();

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(TEMPLATES[0].code);
  const [prompt, setPrompt] = useState("");
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [consoleError, setConsoleError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [projectName, setProjectName] = useState("Untitled");
  const [editorExpanded, setEditorExpanded] = useState(false);

  const htmlIframeRef = useRef<HTMLIFrameElement>(null);
  const jsIframeRef = useRef<HTMLIFrameElement>(null);
  const pyodideRef = useRef<any>(null);
  const pyodideLoadingRef = useRef(false);
  const runResolverRef = useRef<((val: { output: string[]; error: string }) => void) | null>(null);

  const isGenerating = state === "generating";
  const isReady = state === "ready" || state === "generating";

  const monacoLang = LANGS.find(l => l.id === language)?.monacoLang || "javascript";

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data) return;
      if (e.data.type === "playground-result" && runResolverRef.current) {
        runResolverRef.current({ output: e.data.output || [], error: e.data.error || "" });
        runResolverRef.current = null;
      }
      if (e.data.type === "playground-preview-error") {
        setConsoleOutput(prev => [...prev, "[ERROR] " + e.data.error]);
        setConsoleError(e.data.error);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const needsVisualPreview = useCallback((jsCode: string): boolean => {
    return /\bReact\b|\bReactDOM\b|\bJSX\b|\bcreateRoot\b|\bcreateElement\b|\brender\s*\(|<\w+[\s/>]|import\s+.*from\s+["']/.test(jsCode);
  }, []);

  const [showJsPreview, setShowJsPreview] = useState(false);

  const prepareReactCode = useCallback((jsCode: string): string => {
    let code = jsCode
      .replace(/^\s*import\s+.*?from\s+["'][^"']*["'];?\s*$/gm, '')
      .replace(/^\s*import\s+["'][^"']*["'];?\s*$/gm, '');
    const hooks = ['useState','useEffect','useRef','useCallback','useMemo','useContext','useReducer','createContext','Fragment','memo','forwardRef'];
    const used = hooks.filter(h => new RegExp('\\b' + h + '\\b').test(code));
    if (used.length > 0) {
      const alreadyDestructured = /const\s*\{[^}]*\}\s*=\s*React\s*;/.test(code);
      if (!alreadyDestructured) {
        code = 'const { ' + used.join(', ') + ' } = React;\n' + code;
      }
    }
    return code;
  }, []);

  const buildReactPreviewHTML = useCallback((jsCode: string): string => {
    const prepared = prepareReactCode(jsCode);
    const b64 = btoa(unescape(encodeURIComponent(prepared)));
    return '<!DOCTYPE html><html><head>' +
      '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style>*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,sans-serif}' +
      '#__err{display:none;padding:16px;background:#fef2f2;color:#b91c1c;border:1px solid #fca5a5;' +
      'border-radius:8px;margin:16px;font-family:monospace;font-size:13px;white-space:pre-wrap}' +
      '#__load{padding:24px;text-align:center;color:#64748b;font-size:14px}</style>' +
      '</head><body><div id="root"></div><div id="__err"></div>' +
      '<div id="__load">Loading React + Babel...</div>' +
      '<script>' +
      'var __running=false;' +
      'window.onerror=function(m,s,l,c,err){' +
      '  if(!__running)return false;' +
      '  document.getElementById("__load").style.display="none";' +
      '  var e=document.getElementById("__err");e.style.display="block";' +
      '  var msg=err?err.message:String(m);' +
      '  e.textContent="Error: "+msg;' +
      '  parent.postMessage({type:"playground-preview-error",error:msg},"*");' +
      '  return true;' +
      '};' +
      'var __b64="' + b64 + '";' +
      'function __loadSeq(urls,i,cb){' +
      '  if(i>=urls.length){cb();return}' +
      '  var s=document.createElement("script");s.src=urls[i];' +
      '  s.onload=function(){__loadSeq(urls,i+1,cb)};' +
      '  s.onerror=function(){' +
      '    document.getElementById("__load").style.display="none";' +
      '    var e=document.getElementById("__err");e.style.display="block";' +
      '    e.textContent="Failed to load: "+urls[i];' +
      '    parent.postMessage({type:"playground-preview-error",error:"Failed to load: "+urls[i]},"*");' +
      '  };' +
      '  document.head.appendChild(s);' +
      '}' +
      '__loadSeq([' +
      '  "https://unpkg.com/react@18/umd/react.development.js",' +
      '  "https://unpkg.com/react-dom@18/umd/react-dom.development.js",' +
      '  "https://unpkg.com/@babel/standalone@7/babel.min.js",' +
      '  "https://cdn.tailwindcss.com"' +
      '],0,function(){' +
      '  document.getElementById("__load").style.display="none";' +
      '  __running=true;' +
      '  try{' +
      '    var raw=decodeURIComponent(escape(atob(__b64)));' +
      '    var code=Babel.transform(raw,{presets:[["react",{runtime:"classic"}]]}).code;' +
      '    eval(code);' +
      '  }catch(err){' +
      '    var e=document.getElementById("__err");e.style.display="block";' +
      '    e.textContent="Error: "+err.message;' +
      '    parent.postMessage({type:"playground-preview-error",error:err.message},"*");' +
      '  }' +
      '});' +
      '<\/script></body></html>';
  }, []);

  const runJavaScript = useCallback((jsCode: string): Promise<{ output: string[]; error: string }> => {
    if (needsVisualPreview(jsCode)) {
      setShowJsPreview(true);
      if (htmlIframeRef.current) {
        htmlIframeRef.current.srcdoc = buildReactPreviewHTML(jsCode);
      }
      return Promise.resolve({ output: ["React/JSX code rendered in preview below."], error: "" });
    }

    setShowJsPreview(false);
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        runResolverRef.current = null;
        resolve({ output: ["[ERROR] Execution timed out (10s)"], error: "Execution timed out" });
      }, 10000);

      runResolverRef.current = (val) => {
        clearTimeout(timeout);
        resolve(val);
      };

      const escaped = jsCode.replace(/<\/script>/gi, '<\\/script>');
      const sandboxHTML = '<!DOCTYPE html><html><head></head><body><script>' +
        'var __output = []; var __error = "";' +
        'var console = {' +
        '  log: function() { var args = Array.prototype.slice.call(arguments); __output.push(args.map(function(a) { return typeof a === "object" ? JSON.stringify(a, null, 2) : String(a); }).join(" ")); },' +
        '  error: function() { var msg = Array.prototype.slice.call(arguments).join(" "); __output.push("[ERROR] " + msg); __error = msg; },' +
        '  warn: function() { __output.push("[WARN] " + Array.prototype.slice.call(arguments).join(" ")); },' +
        '  info: function() { __output.push("[INFO] " + Array.prototype.slice.call(arguments).join(" ")); }' +
        '};' +
        'try { ' + escaped + ' } catch(e) { __error = e.message || String(e); __output.push("[ERROR] " + __error); }' +
        'parent.postMessage({ type: "playground-result", output: __output, error: __error }, "*");' +
        '<\/script></body></html>';

      if (jsIframeRef.current) {
        jsIframeRef.current.srcdoc = sandboxHTML;
      }
    });
  }, [needsVisualPreview, buildReactPreviewHTML]);

  const runHTML = useCallback((htmlCode: string) => {
    if (!htmlIframeRef.current) return;
    htmlIframeRef.current.srcdoc = htmlCode;
    setConsoleOutput(["HTML rendered in preview below."]);
    setConsoleError("");
  }, []);

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;
    if (pyodideLoadingRef.current) return null;
    pyodideLoadingRef.current = true;
    setConsoleOutput(["Loading Python runtime (Pyodide)..."]);
    try {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
      document.head.appendChild(script);
      await new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Pyodide"));
      });
      const pyodide = await (window as any).loadPyodide();
      pyodideRef.current = pyodide;
      return pyodide;
    } catch (e: any) {
      setConsoleError("Failed to load Python runtime: " + e.message);
      pyodideLoadingRef.current = false;
      return null;
    }
  }, []);

  const runPython = useCallback(async (pyCode: string) => {
    const pyodide = await loadPyodide();
    if (!pyodide) return;

    const output: string[] = [];
    pyodide.setStdout({ batched: (text: string) => output.push(text) });
    pyodide.setStderr({ batched: (text: string) => output.push("[ERROR] " + text) });

    try {
      await pyodide.runPythonAsync(pyCode);
      setConsoleOutput(output.length > 0 ? output : ["(no output)"]);
      setConsoleError("");
    } catch (e: any) {
      const errMsg = e.message || String(e);
      output.push("[ERROR] " + errMsg);
      setConsoleOutput(output);
      setConsoleError(errMsg);
    }
  }, [loadPyodide]);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setConsoleOutput([]);
    setConsoleError("");

    try {
      if (language === "python") {
        await runPython(code);
      } else if (language === "html") {
        runHTML(code);
      } else {
        const result = await runJavaScript(code);
        setConsoleOutput(result.output.length > 0 ? result.output : ["(no output)"]);
        setConsoleError(result.error);
      }
    } catch (e: any) {
      setConsoleError(e.message || String(e));
    }
    setIsRunning(false);
  }, [code, language, runJavaScript, runHTML, runPython]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    setConsoleOutput([]); setConsoleError("");

    const jsEnvNote = language === "javascript" ? `
CRITICAL: Follow the JavaScript environment rules and EXAMPLE in your system prompt exactly.
- NEVER use import/require. React and ReactDOM are globals.
- Destructure: const { useState, useEffect } = React;
- Every input needs value={} and onChange={}.
- Use className="..." with Tailwind classes. NEVER call tailwind() as a function.
- End with: ReactDOM.createRoot(document.getElementById("root")).render(<App />);
` : "";
    const userPrompt = `USER REQUEST: ${prompt}

CURRENT LANGUAGE: ${language}
${jsEnvNote}
${code.trim() ? `CURRENT CODE IN EDITOR:\n${code}\n` : ""}
TASK: Generate complete runnable ${language === "html" ? "HTML" : language === "python" ? "Python" : "JavaScript"} code for this request.
Return ONLY the code block. No markdown fences. No explanations outside code comments.`;

    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.4,
      maxTokens: 4000,
      onChunk: (text) => {
        const cleaned = text.replace(/^```(?:javascript|html|python|js|py)?\n?/i, "").replace(/\n?```\s*$/, "");
        setCode(cleaned);
      },
    });

    if (result) {
      const cleaned = result.replace(/^```(?:javascript|html|python|js|py)?\n?/i, "").replace(/\n?```\s*$/, "");
      setCode(cleaned);
    }
  }, [prompt, code, language, generateRaw]);

  const handleFixError = useCallback(async () => {
    if (!consoleError) return;

    const jsFixNote = language === "javascript" ? `
CRITICAL: Follow the JavaScript environment rules and EXAMPLE in your system prompt exactly.
- NEVER use import/require. React and ReactDOM are globals.
- Destructure: const { useState, useEffect } = React;
- Every input needs value={} and onChange={}.
- Use className="..." with Tailwind classes. NEVER call tailwind() as a function.
- End with: ReactDOM.createRoot(document.getElementById("root")).render(<App />);
` : "";
    const userPrompt = `CURRENT CODE IN EDITOR:
${code}

RUNTIME ERROR:
${consoleError}

LANGUAGE: ${language}
${jsFixNote}
Fix this error. Return the FULL corrected code. Add a comment at the top explaining the fix. No markdown fences.`;

    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      maxTokens: 4000,
      onChunk: (text) => {
        const cleaned = text.replace(/^```(?:javascript|html|python|js|py)?\n?/i, "").replace(/\n?```\s*$/, "");
        setCode(cleaned);
      },
    });

    if (result) {
      const cleaned = result.replace(/^```(?:javascript|html|python|js|py)?\n?/i, "").replace(/\n?```\s*$/, "");
      setCode(cleaned);
      setConsoleError("");
      setConsoleOutput(["Code fixed. Click Run to test."]);
    }
  }, [code, consoleError, language, generateRaw]);

  const handleSave = useCallback(async () => {
    const id = await saveProject({
      id: activeId || undefined,
      name: projectName,
      language,
      code,
      prompt,
    });
    setActiveId(id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [activeId, projectName, language, code, prompt, saveProject, setActiveId]);

  const handleLoadProject = useCallback((project: PlaygroundProject) => {
    setCode(project.code);
    setLanguage(project.language);
    setPrompt(project.prompt);
    setProjectName(project.name);
    setActiveId(project.id);
    setConsoleOutput([]); setConsoleError("");
    setShowProjects(false);
  }, [setActiveId]);

  const handleNewProject = useCallback(() => {
    setCode(""); setPrompt(""); setProjectName("Untitled");
    setLanguage("javascript");
    setConsoleOutput([]); setConsoleError(""); setShowJsPreview(false);
    setActiveId(null);
  }, [setActiveId]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownload = () => {
    const ext = language === "python" ? ".py" : language === "html" ? ".html" : ".js";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = (projectName || "code") + ext; a.click();
    URL.revokeObjectURL(url);
  };

  const handleTemplate = (t: typeof TEMPLATES[0]) => {
    setCode(t.code); setLanguage(t.language); setPrompt(t.prompt);
    setProjectName(t.name);
    setConsoleOutput([]); setConsoleError(""); setShowJsPreview(false);
    setShowTemplates(false);
    setActiveId(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <button data-testid="button-new-project" onClick={handleNewProject} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 transition-all">
          <Plus className="w-4 h-4" /> New
        </button>
        <button data-testid="button-templates" onClick={() => setShowTemplates(!showTemplates)} aria-expanded={showTemplates} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 transition-all">
          <FileCode className="w-4 h-4" /> Templates <ChevronDown className={cn("w-3 h-3 transition-transform", showTemplates && "rotate-180")} />
        </button>
        {projects.length > 0 && (
          <button data-testid="button-projects" onClick={() => setShowProjects(!showProjects)} aria-expanded={showProjects} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 transition-all">
            <FolderOpen className="w-4 h-4" /> Projects ({projects.length}) <ChevronDown className={cn("w-3 h-3 transition-transform", showProjects && "rotate-180")} />
          </button>
        )}
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          {LANGS.map(l => (
            <button key={l.id} data-testid={`button-lang-${l.id}`} onClick={() => setLanguage(l.id)} aria-pressed={language === l.id} className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", language === l.id ? "bg-emerald-600 text-white shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200")}>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showTemplates && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              {TEMPLATES.map(t => (
                <button key={t.name} data-testid={`button-template-${t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} onClick={() => handleTemplate(t)} className="p-3 text-left rounded-lg border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all">
                  <p className="font-semibold text-sm text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.language}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProjects && projects.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
              {projects.map(p => (
                <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                  <button data-testid={`button-load-project-${p.id}`} onClick={() => handleLoadProject(p)} className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-sm text-slate-800 truncate">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.language} - {new Date(p.updatedAt).toLocaleDateString()}</p>
                  </button>
                  <button data-testid={`button-delete-project-${p.id}`} onClick={() => deleteProject(p.id)} aria-label={`Delete project ${p.name}`} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="space-y-1">
              <label htmlFor="pg-name" className="text-xs font-semibold text-slate-500">Project Name</label>
              <input id="pg-name" data-testid="input-project-name" type="text" value={projectName} onChange={e => setProjectName(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 font-medium text-slate-800" />
            </div>
            <div className="space-y-1">
              <label htmlFor="pg-prompt" className="text-xs font-semibold text-slate-500">Prompt</label>
              <textarea id="pg-prompt" data-testid="input-prompt" value={prompt} onChange={e => setPrompt(e.target.value)} rows={5} placeholder="Describe what you want to build..." className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 resize-none text-slate-800 placeholder:text-slate-400" />
            </div>

            {(state === "checking-gpu" || state === "downloading") && (
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-2 mb-1">
                  <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span className="text-xs font-semibold text-emerald-700">
                    {state === "checking-gpu" ? "Checking GPU..." : "Loading AI..."}
                  </span>
                </div>
                {state === "downloading" && (
                  <div className="w-full bg-emerald-200 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }} />
                  </div>
                )}
              </div>
            )}

            {llmError && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{llmError}</p>
              </div>
            )}

            <button data-testid="button-generate" onClick={handleGenerate} disabled={!prompt.trim() || isGenerating || !isReady} className={cn("w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2", prompt.trim() && !isGenerating && isReady ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0" : "bg-slate-200 text-slate-400 cursor-not-allowed")}>
              {isGenerating ? (<><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>) : (<><Sparkles className="w-4 h-4" /> Generate Code</>)}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className={cn("bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden", editorExpanded && "fixed inset-4 z-50 flex flex-col")}>
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-slate-400 font-mono ml-2">{projectName}.{language === "python" ? "py" : language === "html" ? "html" : "js"}</span>
              </div>
              <div className="flex items-center gap-1">
                <button data-testid="button-copy-code" onClick={handleCopyCode} className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" aria-label="Copy code">
                  {copiedCode ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button data-testid="button-download-code" onClick={handleDownload} className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" aria-label="Download code">
                  <Download className="w-4 h-4" />
                </button>
                <button data-testid="button-expand-editor" onClick={() => setEditorExpanded(!editorExpanded)} className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" aria-label={editorExpanded ? "Collapse editor" : "Expand editor"}>
                  {editorExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className={cn(editorExpanded ? "flex-1" : "h-[400px] md:h-[500px]")}>
              <Editor
                height="100%"
                language={monacoLang}
                value={code}
                onChange={(val) => setCode(val || "")}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  wordWrap: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  padding: { top: 12, bottom: 12 },
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button data-testid="button-run" onClick={handleRun} disabled={isRunning || !code.trim()} className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all", !isRunning && code.trim() ? "bg-emerald-600 text-white shadow-md hover:shadow-lg hover:bg-emerald-700" : "bg-slate-200 text-slate-400 cursor-not-allowed")}>
              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              Run
            </button>
            {consoleError && (
              <button data-testid="button-fix-error" onClick={handleFixError} disabled={isGenerating || !isReady} className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all", !isGenerating && isReady ? "bg-amber-500 text-white shadow-md hover:shadow-lg hover:bg-amber-600" : "bg-slate-200 text-slate-400 cursor-not-allowed")}>
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wrench className="w-4 h-4" />}
                Fix This Error
              </button>
            )}
            <div className="flex-1" />
            <button data-testid="button-save-project" onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 transition-all">
              {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
              {saved ? "Saved" : "Save"}
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-400">Console Output</span>
              </div>
              {consoleOutput.length > 0 && (
                <button data-testid="button-clear-console" onClick={() => { setConsoleOutput([]); setConsoleError(""); }} className="text-xs text-slate-500 hover:text-slate-300 transition-colors" aria-label="Clear console">
                  Clear
                </button>
              )}
            </div>
            <div className="p-4 font-mono text-sm max-h-[300px] overflow-y-auto min-h-[120px]">
              {consoleOutput.length === 0 && !consoleError && (
                <p className="text-slate-500 text-xs">Click "Run" to execute your code...</p>
              )}
              {consoleOutput.map((line, i) => (
                <div key={i} className={cn("py-0.5 whitespace-pre-wrap break-all", line.startsWith("[ERROR]") ? "text-red-400" : line.startsWith("[WARN]") ? "text-amber-400" : line.startsWith("[INFO]") ? "text-blue-400" : "text-emerald-300")}>
                  {line}
                </div>
              ))}
              {consoleError && !consoleOutput.some(l => l.includes(consoleError)) && (
                <div className="py-0.5 text-red-400 whitespace-pre-wrap break-all">[ERROR] {consoleError}</div>
              )}
            </div>
          </div>

          <div className={cn("bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden", !(language === "html" || showJsPreview) && "hidden")}>
            <div className="px-4 py-2 border-b border-slate-200 flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold text-slate-500">Live Preview</span>
            </div>
            <iframe ref={htmlIframeRef} data-testid="iframe-preview" title="Code Preview" sandbox="allow-scripts allow-modals allow-same-origin" className="w-full h-[400px] bg-white" />
          </div>
        </div>
      </div>
      <iframe ref={jsIframeRef} title="JS Sandbox" sandbox="allow-scripts allow-same-origin" className="hidden" aria-hidden="true" />
    </div>
  );
}
