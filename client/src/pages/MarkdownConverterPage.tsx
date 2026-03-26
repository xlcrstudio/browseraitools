import { useEffect } from "react";
import { FileCode } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { MarkdownConverter } from "@/components/MarkdownConverter";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import { SimilarTools } from "@/components/RelatedTools";

const FAQS = [
  {
    question: "What Markdown features are supported?",
    answer: "Full GitHub Flavored Markdown (GFM): headings (H1–H6), bold, italic, strikethrough, inline code, fenced code blocks with language tags, unordered lists, ordered lists, nested lists, task lists, blockquotes, links, images, tables with alignment, and horizontal rules.",
  },
  {
    question: "Can it convert HTML back to Markdown?",
    answer: "Yes — switch to 'HTML → Markdown' mode. It handles headings, paragraphs, bold, italic, strikethrough, inline code, code blocks, blockquotes, ordered and unordered lists, links, images, tables, and horizontal rules. The output is clean, standard Markdown with no leftover HTML tags.",
  },
  {
    question: "What does the Preview tab show?",
    answer: "The Preview tab renders the converted HTML in a styled reading view — exactly how the Markdown would look on a page, complete with formatted headings, highlighted code blocks, styled blockquotes, and working tables. It updates live as you type.",
  },
  {
    question: "What does 'Format MD' do?",
    answer: "Format MD cleans up your Markdown source: adds a required space after # heading markers, ensures blank lines appear before and after every heading, normalises bullet markers to dashes, and collapses excessive blank lines. It makes Markdown more consistent and readable.",
  },
  {
    question: "Is there a length limit?",
    answer: "No. The converter runs entirely in your browser — there's no server involved. You can convert documents of any size, though very large files (hundreds of kilobytes) may take a moment to render.",
  },
  {
    question: "Is this safe for converting HTML with scripts or sensitive content?",
    answer: "Yes — the HTML rendered in the Preview is sanitised with DOMPurify, which strips script tags, event handlers, and other potentially dangerous content before rendering. The raw HTML output (Code tab) is the original converted result.",
  },
  {
    question: "Is my content private?",
    answer: "Completely. All conversion happens in your browser using JavaScript. Nothing is sent to a server, stored, or logged.",
  },
];

export default function MarkdownConverterPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free Markdown to HTML Converter — Live Preview, HTML to Markdown | Browser AI Tools";

    const metas: Record<string, string> = {
      description: "Free Markdown to HTML converter with live preview. Convert Markdown to HTML or HTML to Markdown instantly. Supports GFM tables, code blocks, task lists, and more.",
    };
    const ogs: Record<string, string> = {
      "og:title": "Free Markdown ↔ HTML Converter — Live Preview, GFM Support",
      "og:description": "Convert Markdown to HTML or HTML to Markdown instantly. Live rendered preview, GitHub Flavored Markdown support, tables, code blocks. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/markdown-converter",
    };

    for (const [name, content] of Object.entries(metas)) {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("name", name); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
    }
    for (const [property, content] of Object.entries(ogs)) {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("property", property); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
    }
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Markdown to HTML Converter",
            "applicationCategory": "DeveloperApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free Markdown to HTML converter with live preview. Convert Markdown to HTML or HTML to Markdown instantly.",
          }),
        }}
      />

      <ToolPageHeader toolName="Markdown Converter" icon={FileCode} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          Markdown{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Converter
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Convert Markdown to HTML with live preview, or convert HTML back to clean Markdown. GitHub Flavored Markdown, tables, code blocks, and more.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "Live Preview",
            "MD → HTML",
            "HTML → MD",
            "GFM Tables",
            "Code Blocks",
            "Format & Clean",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="markdown-converter-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <MarkdownConverter />
      </div>

      <AdBlock slot="markdown-converter-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>Markdown to HTML Conversion</h2>
        <p>
          The converter uses the <strong>marked</strong> library with GitHub Flavored Markdown (GFM) enabled — the same dialect used on GitHub, GitLab, and most modern documentation platforms. Paste any Markdown and the HTML output and live preview update instantly as you type.
        </p>

        <h2>Supported Markdown Elements</h2>
        <ul>
          <li><strong>Headings</strong> — H1 through H6 using # prefix or underline syntax</li>
          <li><strong>Emphasis</strong> — <code>**bold**</code>, <code>*italic*</code>, <code>~~strikethrough~~</code></li>
          <li><strong>Inline code</strong> — backtick syntax (<code>`code`</code>)</li>
          <li><strong>Fenced code blocks</strong> — triple backtick with optional language identifier</li>
          <li><strong>Lists</strong> — unordered (-, *, +), ordered (1. 2. 3.), and nested</li>
          <li><strong>Tables</strong> — GFM pipe tables with left/center/right alignment</li>
          <li><strong>Blockquotes</strong> — single and nested using &gt; prefix</li>
          <li><strong>Links</strong> — inline, reference, and titled links</li>
          <li><strong>Images</strong> — with alt text and optional title</li>
          <li><strong>Horizontal rules</strong> — using ---, ***, or ___</li>
        </ul>

        <h2>HTML to Markdown Conversion</h2>
        <p>
          Switch to HTML → Markdown mode to reverse the process. The converter walks the HTML DOM tree and maps every element to its Markdown equivalent — headings, paragraphs, emphasis tags, code blocks, lists, tables, blockquotes, links, and images are all handled. Wrapper divs and class attributes are stripped automatically to produce clean, portable Markdown.
        </p>

        <h2>When to Use Markdown vs HTML</h2>
        <p>
          <strong>Use Markdown</strong> when writing content: blog posts, README files, documentation, notes. It's faster to type and easier to read as raw source. <strong>Use HTML</strong> when publishing: web pages need HTML, and many CMS platforms, email clients, and APIs expect HTML rather than Markdown. This tool bridges the gap in both directions.
        </p>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <SimilarTools slugs={["/lorem-ipsum-generator", "/diff-checker", "/regex-tester", "/json-validator", "/color-palette-generator", "/password-generator"]} />

      <AdBlock slot="markdown-converter-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="Markdown Converter"
        toolDescription="Free Markdown to HTML converter with live preview. Convert Markdown to HTML or HTML to clean Markdown. Supports GitHub Flavored Markdown, tables, fenced code blocks, task lists, blockquotes. 100% private."
        faqs={FAQS}
      />
    </>
  );
}
