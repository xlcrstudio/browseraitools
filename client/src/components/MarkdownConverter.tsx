import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, RotateCcw, Eye, Code } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

// ─── Configure marked ─────────────────────────────────────────────────────────

marked.setOptions({ gfm: true, breaks: false });

// ─── HTML → Markdown ──────────────────────────────────────────────────────────

function htmlToMd(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return nodeToMd(doc.body).trim();
}

function nodeToMd(node: Node, ctx: { listType?: "ul" | "ol"; depth?: number; ordered?: number } = {}): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent ?? "").replace(/\n\s+/g, " ");
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  const children = () => Array.from(el.childNodes).map(n => nodeToMd(n, ctx)).join("");
  const block = (content: string) => `\n\n${content}\n\n`;

  switch (tag) {
    case "h1": return block(`# ${children().trim()}`);
    case "h2": return block(`## ${children().trim()}`);
    case "h3": return block(`### ${children().trim()}`);
    case "h4": return block(`#### ${children().trim()}`);
    case "h5": return block(`##### ${children().trim()}`);
    case "h6": return block(`###### ${children().trim()}`);
    case "p": return block(children().trim());
    case "br": return "\n";
    case "strong": case "b": return `**${children()}**`;
    case "em": case "i": return `*${children()}*`;
    case "del": case "s": return `~~${children()}~~`;
    case "code": return el.closest("pre") ? children() : `\`${children()}\``;
    case "pre": {
      const codeEl = el.querySelector("code");
      const lang = codeEl ? (codeEl.className.match(/language-(\w+)/) ?? [])[1] ?? "" : "";
      const text = el.textContent ?? "";
      return block(`\`\`\`${lang}\n${text.trim()}\n\`\`\``);
    }
    case "blockquote":
      return block(children().trim().split("\n").map(l => `> ${l}`).join("\n"));
    case "ul": {
      const items = Array.from(el.children).filter(c => c.tagName === "LI");
      return block(items.map(li => `- ${nodeToMd(li).trim()}`).join("\n"));
    }
    case "ol": {
      const items = Array.from(el.children).filter(c => c.tagName === "LI");
      return block(items.map((li, i) => `${i + 1}. ${nodeToMd(li).trim()}`).join("\n"));
    }
    case "li": return children().trim();
    case "a": {
      const href = el.getAttribute("href") ?? "";
      const title = el.getAttribute("title");
      return title ? `[${children()}](${href} "${title}")` : `[${children()}](${href})`;
    }
    case "img": {
      const src = el.getAttribute("src") ?? "";
      const alt = el.getAttribute("alt") ?? "";
      const title = el.getAttribute("title");
      return title ? `![${alt}](${src} "${title}")` : `![${alt}](${src})`;
    }
    case "table": {
      const rows = Array.from(el.querySelectorAll("tr"));
      const cells = (row: Element) => Array.from(row.querySelectorAll("td, th")).map(c => c.textContent?.trim() ?? "");
      if (rows.length === 0) return "";
      const header = cells(rows[0]);
      const sep = header.map(() => "---");
      const body = rows.slice(1).map(r => cells(r));
      const fmtRow = (c: string[]) => `| ${c.join(" | ")} |`;
      return block([fmtRow(header), fmtRow(sep), ...body.map(fmtRow)].join("\n"));
    }
    case "hr": return block("---");
    case "div": case "article": case "section": case "main": case "header": case "footer":
    case "span": case "body":
      return children();
    default:
      return children();
  }
}

// ─── Markdown formatter ───────────────────────────────────────────────────────

function formatMarkdown(md: string): string {
  return md
    .replace(/^(#{1,6})([^ #])/gm, "$1 $2")          // Space after #
    .replace(/\n*(#{1,6} .+)\n*/gm, "\n\n$1\n\n")    // Blank lines around headings
    .replace(/^(\s*)[*+](\s)/gm, "$1-$2")             // Normalise list bullets to -
    .replace(/\n{3,}/g, "\n\n")                        // Max 2 consecutive blank lines
    .trim();
}

// ─── Stats ───────────────────────────────────────────────────────────────────

function getStats(input: string, output: string) {
  const words = input.trim() ? input.trim().split(/\s+/).length : 0;
  const headings = (input.match(/^#{1,6}\s/gm) ?? []).length;
  const links = (input.match(/\[.+?\]\(.+?\)/g) ?? []).length;
  const codeBlocks = (input.match(/```[\s\S]*?```/g) ?? []).length;
  return { words, headings, links, codeBlocks, inSize: `${input.length} chars`, outSize: `${output.length} chars` };
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      disabled={!text}
      className={cn(
        "flex items-center gap-1.5 text-xs font-semibold transition-colors disabled:opacity-30",
        copied ? "text-green-500" : "text-slate-400 hover:text-purple-600"
      )}>
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied!" : label}
    </button>
  );
}

// ─── Preview styles (injected inside shadow preview) ─────────────────────────

const PREVIEW_CSS = `
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; line-height: 1.7; color: #1e293b; margin: 0; padding: 1rem; background: transparent; }
  h1,h2,h3,h4,h5,h6 { font-weight: 700; line-height: 1.3; margin: 1.2em 0 0.5em; }
  h1 { font-size: 1.75rem; } h2 { font-size: 1.4rem; } h3 { font-size: 1.15rem; }
  p { margin: 0 0 1em; }
  a { color: #7c3aed; text-decoration: underline; }
  code { background: #f1f5f9; border-radius: 4px; padding: 0.15em 0.4em; font-size: 0.875em; font-family: 'Fira Mono', monospace; }
  pre { background: #1e293b; border-radius: 8px; padding: 1rem; overflow-x: auto; margin: 1em 0; }
  pre code { background: none; padding: 0; color: #e2e8f0; font-size: 0.8rem; }
  blockquote { border-left: 4px solid #7c3aed; margin: 1em 0; padding: 0.5em 1em; background: #f5f3ff; border-radius: 0 6px 6px 0; color: #4c1d95; }
  ul,ol { padding-left: 1.5em; margin: 0 0 1em; }
  li { margin: 0.25em 0; }
  table { border-collapse: collapse; width: 100%; margin: 1em 0; }
  th { background: #f8fafc; font-weight: 700; }
  th,td { border: 1px solid #e2e8f0; padding: 0.5em 0.75em; text-align: left; }
  hr { border: none; border-top: 2px solid #e2e8f0; margin: 1.5em 0; }
  img { max-width: 100%; }
  @media (prefers-color-scheme: dark) {
    body { color: #e2e8f0; }
    code { background: #334155; }
    blockquote { background: #1e1b4b; color: #c4b5fd; }
    th { background: #1e293b; }
    th,td { border-color: #334155; }
    hr { border-color: #334155; }
  }
`;

// ─── Main component ───────────────────────────────────────────────────────────

type Mode = "md-html" | "html-md";
type OutTab = "code" | "preview";

const MD_SAMPLE = `# Welcome to Markdown

## Features

Convert **bold**, *italic*, and ~~strikethrough~~ text instantly.

### Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Lists

- Item one
- Item two
  - Nested item

1. First step
2. Second step

### Table

| Name    | Role     | Score |
|---------|----------|------:|
| Alice   | Engineer | 98    |
| Bob     | Designer | 87    |

> **Note:** This is a blockquote with _formatting_ inside.

[Learn more](https://commonmark.org)
`;

const HTML_SAMPLE = `<h1>My Article</h1>
<p>This is a <strong>formatted</strong> article with <em>various</em> elements.</p>
<h2>Features</h2>
<ul>
  <li>Point one</li>
  <li>Point two</li>
</ul>
<blockquote>
  <p>A compelling quote here.</p>
</blockquote>
<pre><code class="language-python">def hello():
    print("Hello, World!")
</code></pre>`;

export function MarkdownConverter() {
  const [mode, setMode] = useState<Mode>("md-html");
  const [input, setInput] = useState("");
  const [outTab, setOutTab] = useState<OutTab>("preview");

  const placeholder = mode === "md-html" ? MD_SAMPLE : HTML_SAMPLE;

  const output = useMemo<string>(() => {
    const text = input || placeholder;
    if (mode === "md-html") {
      try { return marked(text) as string; }
      catch { return ""; }
    } else {
      return htmlToMd(text);
    }
  }, [input, mode, placeholder]);

  const previewHtml = useMemo(() => {
    if (mode === "md-html") return DOMPurify.sanitize(output);
    return DOMPurify.sanitize(marked(output) as string);
  }, [output, mode]);

  const stats = useMemo(() => {
    const src = mode === "md-html" ? (input || placeholder) : output;
    return getStats(src, output);
  }, [input, output, mode, placeholder]);

  const handleFormat = useCallback(() => {
    if (mode === "md-html") setInput(i => formatMarkdown(i || placeholder));
  }, [mode, placeholder]);

  const switchMode = (m: Mode) => { setMode(m); setInput(""); };

  const outputLabel = mode === "md-html" ? "HTML Output" : "Markdown Output";

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">

      {/* Mode tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
        {[
          { id: "md-html" as Mode, label: "Markdown → HTML" },
          { id: "html-md" as Mode, label: "HTML → Markdown" },
        ].map(m => (
          <button key={m.id} type="button" data-testid={`tab-${m.id}`}
            onClick={() => switchMode(m.id)}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all",
              mode === m.id
                ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            )}>{m.label}</button>
        ))}
      </div>

      {/* Main panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Input */}
        <div className="glass-panel rounded-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              {mode === "md-html" ? "Markdown Input" : "HTML Input"}
            </p>
            <div className="flex items-center gap-3">
              {mode === "md-html" && (
                <button type="button" onClick={handleFormat} data-testid="button-format"
                  className="text-xs text-purple-500 hover:text-purple-700 font-semibold transition-colors">
                  Format MD
                </button>
              )}
              {input && (
                <button type="button" onClick={() => setInput("")}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors">
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              )}
              {!input && (
                <button type="button" onClick={() => setInput(placeholder)}
                  className="text-xs text-purple-500 hover:text-purple-700 font-semibold transition-colors">
                  Load sample
                </button>
              )}
            </div>
          </div>
          <textarea
            data-testid="input-content"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={placeholder}
            spellCheck={false}
            className="flex-1 w-full bg-transparent text-slate-800 dark:text-slate-100 px-4 py-4 text-sm font-mono outline-none resize-none leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-600 min-h-[420px]"
          />
        </div>

        {/* Output */}
        <div className="glass-panel rounded-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{outputLabel}</p>
            <div className="flex items-center gap-3">
              <CopyBtn text={output} />
              {/* Preview toggle (only for MD→HTML) */}
              {mode === "md-html" && (
                <div className="flex gap-0.5 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  {[
                    { id: "preview" as OutTab, icon: Eye },
                    { id: "code" as OutTab, icon: Code },
                  ].map(({ id, icon: Icon }) => (
                    <button key={id} type="button" data-testid={`outtab-${id}`}
                      onClick={() => setOutTab(id)}
                      className={cn(
                        "p-1.5 rounded-md transition-all",
                        outTab === id ? "bg-white dark:bg-slate-700 text-purple-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                      )}>
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto min-h-[420px]">
            <AnimatePresence mode="wait">
              {mode === "md-html" && outTab === "preview" ? (
                <motion.div key="preview"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full">
                  <style>{`
                    .md-preview h1,h2,h3,h4,h5,h6 { font-weight: 700; line-height: 1.3; margin: 1.2em 0 0.5em; }
                    .md-preview h1 { font-size: 1.6rem; } .md-preview h2 { font-size: 1.3rem; } .md-preview h3 { font-size: 1.1rem; }
                    .md-preview p { margin: 0 0 1em; }
                    .md-preview a { color: #7c3aed; text-decoration: underline; }
                    .md-preview code:not(pre code) { background: #f1f5f9; border-radius: 4px; padding: 0.15em 0.4em; font-size: 0.875em; font-family: monospace; }
                    .dark .md-preview code:not(pre code) { background: #334155; }
                    .md-preview pre { background: #1e293b; border-radius: 8px; padding: 1rem; overflow-x: auto; margin: 1em 0; }
                    .md-preview pre code { background: none; padding: 0; color: #e2e8f0; font-size: 0.8rem; }
                    .md-preview blockquote { border-left: 4px solid #7c3aed; margin: 1em 0; padding: 0.5em 1em; background: #f5f3ff; border-radius: 0 6px 6px 0; color: #4c1d95; }
                    .dark .md-preview blockquote { background: #1e1b4b; color: #c4b5fd; }
                    .md-preview ul,.md-preview ol { padding-left: 1.5em; margin: 0 0 1em; }
                    .md-preview li { margin: 0.25em 0; }
                    .md-preview table { border-collapse: collapse; width: 100%; margin: 1em 0; }
                    .md-preview th { background: #f8fafc; font-weight: 700; }
                    .dark .md-preview th { background: #1e293b; }
                    .md-preview th,.md-preview td { border: 1px solid #e2e8f0; padding: 0.5em 0.75em; text-align: left; }
                    .dark .md-preview th,.dark .md-preview td { border-color: #334155; }
                    .md-preview hr { border: none; border-top: 2px solid #e2e8f0; margin: 1.5em 0; }
                    .dark .md-preview hr { border-color: #334155; }
                    .md-preview img { max-width: 100%; }
                  `}</style>
                  <div
                    className="md-preview px-5 py-4 text-sm text-slate-800 dark:text-slate-100 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                </motion.div>
              ) : (
                <motion.div key="code"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="h-full">
                  <pre className="px-4 py-4 text-xs text-slate-700 dark:text-slate-200 font-mono leading-relaxed overflow-auto whitespace-pre-wrap break-words min-h-full">
                    {output || <span className="text-slate-300 dark:text-slate-600">Output will appear here…</span>}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Words", value: stats.words.toString() },
          { label: "Headings", value: stats.headings.toString() },
          { label: "Links", value: stats.links.toString() },
          { label: "Code Blocks", value: stats.codeBlocks.toString() },
        ].map(s => (
          <div key={s.label} className="glass-panel rounded-xl p-3 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
            <p className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5 tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
