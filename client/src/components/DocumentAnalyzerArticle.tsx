import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function DocumentAnalyzerArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6">
          Best Private AI PDF Summarizer 2026 -- No Uploads, Truly Private Analysis
        </h2>

        <ArticleSection title="Why Privacy Matters for Document Analysis">
          <p>When you upload a PDF to cloud-based AI tools, your document is sent to external servers where it may be stored, analyzed, or used for training. For legal contracts, medical records, financial reports, and proprietary business documents, this creates serious privacy and compliance risks.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Problem with Cloud-Based Tools</h4>
          <p>Most AI document analyzers (ChatPDF, Notion AI, etc.) require uploading your files to their servers. Even with privacy policies, your data passes through third-party infrastructure. For HIPAA, GDPR, or attorney-client privileged documents, this may constitute a data breach.</p>
          <h4 className="font-bold text-slate-800 mt-4">How Browser AI Solves This</h4>
          <p>Our Document Analyzer uses WebLLM technology to run the AI model entirely in your browser. Your document text is extracted locally using PDF.js -- it never leaves your device. The analysis happens on your GPU, not a cloud server. This is true zero-knowledge privacy.</p>
        </ArticleSection>

        <ArticleSection title="How the AI Document Analyzer Works">
          <p>The tool combines two powerful technologies running entirely in your browser:</p>
          <h4 className="font-bold text-slate-800 mt-4">PDF Text Extraction</h4>
          <p>When you upload a PDF, the tool uses Mozilla's PDF.js library to extract text content directly in your browser. No file upload occurs -- the PDF is read as binary data in JavaScript and parsed locally. The extracted text is then passed to the AI model.</p>
          <h4 className="font-bold text-slate-800 mt-4">AI Analysis</h4>
          <p>The extracted text is analyzed by a Qwen 2.5 language model running via WebGPU in your browser. The model generates summaries, extracts key insights, identifies important quotes and statistics, and creates study questions -- all without any server communication.</p>
          <h4 className="font-bold text-slate-800 mt-4">Multiple Analysis Modes</h4>
          <p>Choose what you need: a full summary for quick understanding, key insights for decision-making, simplified explanations for complex topics, important quotes for citations, key statistics for data analysis, action items for next steps, or study questions for exam preparation.</p>
        </ArticleSection>

        <ArticleSection title="Best Use Cases">
          <h4 className="font-bold text-slate-800 mt-4">Students and Researchers</h4>
          <p>Quickly summarize research papers, extract methodology and findings, generate study questions for exam prep, and understand complex academic language with the ELI5 (Explain Like I'm 5) mode.</p>
          <h4 className="font-bold text-slate-800 mt-4">Legal Professionals</h4>
          <p>Analyze contracts and legal documents with complete confidentiality. Extract key clauses, identify action items and deadlines, and summarize lengthy filings without any data leaving your device.</p>
          <h4 className="font-bold text-slate-800 mt-4">Business Executives</h4>
          <p>Get executive summaries of lengthy reports, extract key metrics and KPIs, identify action items and recommendations, and prepare for meetings by understanding complex documents in minutes.</p>
          <h4 className="font-bold text-slate-800 mt-4">Journalists and Writers</h4>
          <p>Quickly analyze press releases, research reports, and source documents. Extract important quotes, identify key statistics, and generate interview questions based on document content.</p>
        </ArticleSection>

        <ArticleSection title="Supported Document Types">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">PDF Files:</strong> Research papers, legal contracts, business reports, ebooks, presentations, and any standard PDF document.</li>
            <li><strong className="text-slate-800">Plain Text:</strong> Paste any text from articles, emails, web pages, or documents. No character limit for pasting.</li>
            <li><strong className="text-slate-800">Web Articles:</strong> Copy and paste content from any web page for instant analysis and summarization.</li>
          </ul>
          <p className="mt-3">The tool handles documents up to 200,000 characters (roughly 50 pages). For longer documents, the tool automatically processes the most relevant sections to provide comprehensive analysis.</p>
        </ArticleSection>

        <ArticleSection title="Analysis Modes Explained">
          <h4 className="font-bold text-slate-800 mt-4">Full Summary</h4>
          <p>A comprehensive 2-4 paragraph overview covering the main arguments, findings, and conclusions. Designed to give you a complete understanding of the document in under 2 minutes of reading.</p>
          <h4 className="font-bold text-slate-800 mt-4">Key Insights</h4>
          <p>5-8 bullet points highlighting the most important findings, arguments, or data points. Each insight is concise and actionable, designed for quick scanning and decision-making.</p>
          <h4 className="font-bold text-slate-800 mt-4">Simplified Explanation (ELI5)</h4>
          <p>A plain-language version that explains the document as if you are smart but unfamiliar with the topic. Technical jargon is translated, complex concepts are broken down, and analogies are used where helpful.</p>
          <h4 className="font-bold text-slate-800 mt-4">Study Questions</h4>
          <p>5-10 thoughtful questions based on the document content, perfect for exam preparation, book club discussions, or interview preparation. Questions range from factual recall to critical analysis.</p>
        </ArticleSection>

        <ArticleSection title="Privacy Comparison: Browser AI vs Cloud Tools">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 pr-4 font-bold text-slate-800">Feature</th>
                  <th className="text-left py-2 pr-4 font-bold text-slate-800">Browser AI Tools</th>
                  <th className="text-left py-2 font-bold text-slate-800">Cloud AI Tools</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4">Data leaves device</td>
                  <td className="py-2 pr-4 text-emerald-600 font-medium">Never</td>
                  <td className="py-2 text-red-600 font-medium">Always</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4">Works offline</td>
                  <td className="py-2 pr-4 text-emerald-600 font-medium">Yes</td>
                  <td className="py-2 text-red-600 font-medium">No</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4">HIPAA/GDPR safe</td>
                  <td className="py-2 pr-4 text-emerald-600 font-medium">Yes</td>
                  <td className="py-2 text-red-600 font-medium">Varies</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 pr-4">Cost</td>
                  <td className="py-2 pr-4 text-emerald-600 font-medium">Free</td>
                  <td className="py-2 text-amber-600 font-medium">$10-30/mo</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Usage limits</td>
                  <td className="py-2 pr-4 text-emerald-600 font-medium">Unlimited</td>
                  <td className="py-2 text-amber-600 font-medium">Limited</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ArticleSection>

        <ArticleSection title="Tips for Best Results">
          <ul className="space-y-2 text-slate-600">
            <li><strong className="text-slate-800">Choose the right analysis mode:</strong> Use "Full Summary" for a quick overview, "Key Insights" for decision-making, and "Study Questions" for learning.</li>
            <li><strong className="text-slate-800">Set the reading level:</strong> Match it to your audience -- "Executive" for board presentations, "Student" for study notes, "Explain Like I'm 12" for complex topics.</li>
            <li><strong className="text-slate-800">Use focus areas:</strong> If you only care about financials in a 50-page report, tell the tool to focus on financial data. This produces more targeted results.</li>
            <li><strong className="text-slate-800">Try different lengths:</strong> Start with "Concise" for a quick scan, then use "Detailed" if you need deeper analysis of specific sections.</li>
            <li><strong className="text-slate-800">Clean text works best:</strong> If pasting text, remove headers, footers, and page numbers for cleaner analysis.</li>
          </ul>
        </ArticleSection>
      </div>
    </section>
  );
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left group"
        data-testid={`button-article-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
      >
        <h3 className="text-lg md:text-xl font-display font-bold text-slate-800 group-hover:text-purple-700 transition-colors">{title}</h3>
        <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform shrink-0 ml-4", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
            <div className="pt-4 text-slate-600 leading-relaxed space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
