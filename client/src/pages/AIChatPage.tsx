import { useEffect } from "react";
import { Bot } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { AIChat } from "@/components/AIChat";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";

const chatFAQs = [
  { question: "Is this AI chatbot completely free?", answer: "Yes. It runs entirely in your browser using WebLLM — no subscriptions, no accounts, no usage limits. The AI model downloads once and is cached locally for all future sessions." },
  { question: "Are my conversations private?", answer: "Completely. Unlike ChatGPT and other cloud-based AI tools, this chatbot processes everything locally using your device's GPU. Your messages, topics, and responses are never sent to any server. Everything stays on your device." },
  { question: "Does it work offline?", answer: "Yes, after the initial model download (about 1GB). The model is cached in your browser, so subsequent sessions work without an internet connection." },
  { question: "What are the inline message actions?", answer: "Every AI response has three inline actions: Rewrite (generates an alternative version), Expand (adds more detail and examples), and Summarize (condenses to 2-3 sentences). These appear when you hover over an AI message." },
  { question: "How do I search my chat history?", answer: "Use the search box at the top of the sidebar. It filters your thread titles in real time. You can also pin important chats so they appear at the top of the list." },
];

export default function AIChatPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free Private AI Chatbot — No Login, Runs in Your Browser | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Free private AI chatbot that runs entirely in your browser. No signup, no data tracking, works offline. Chat history saved locally. Copy, rewrite, expand any AI response.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free Private AI Chatbot — No Login, 100% Private | Browser AI Tools",
      "og:description": "Chat with AI privately. No signup. No data sent to servers. Works offline. Full chat history. Runs in your browser using WebLLM.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-chatbot",
    };

    for (const [name, content] of Object.entries(metaUpdates)) {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("name", name); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
    }
    for (const [property, content] of Object.entries(ogUpdates)) {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("property", property); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
    }
  }, []);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "AI Chatbot",
        "applicationCategory": "UtilitiesApplication",
        "offers": { "@type": "Offer", "price": "0" },
        "description": "Free private AI chatbot. Runs in your browser. No signup, no data tracking, works offline. Chat history saved locally.",
      })}} />

      <ToolPageHeader toolName="AI Chatbot" icon={Bot} />

      <div className="pb-4">
        <AIChat />
      </div>

      <AdBlock slot="ai-chatbot-mid" format="horizontal" className="my-8" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>The Private AI Chatbot That Runs in Your Browser</h2>
        <p>
          Most AI chatbots — ChatGPT, Claude, Gemini — send every message you type to cloud servers for processing. That means your questions, sensitive topics, business ideas, and personal thoughts pass through corporate infrastructure and may be used to train future models.
        </p>
        <p>
          This chatbot is different. It runs the AI model locally on your device using WebLLM and WebGPU. Nothing you type leaves your browser. Your conversations are stored in your browser's local storage — not on any external server.
        </p>

        <h2>Key Features</h2>
        <ul>
          <li><strong>Persistent chat history</strong> — Your threads are saved locally and available across sessions</li>
          <li><strong>Pin important chats</strong> — Keep frequently referenced conversations at the top of your list</li>
          <li><strong>Inline message actions</strong> — Rewrite, Expand, or Summarize any AI response with one click</li>
          <li><strong>Prompt suggestions</strong> — Quick-start chips for common tasks</li>
          <li><strong>Works offline</strong> — After the first model download, no internet required</li>
          <li><strong>No account required</strong> — Start chatting immediately</li>
        </ul>

        <h2>Frequently Asked Questions</h2>
        {chatFAQs.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="ai-chatbot-bottom" format="horizontal" className="mb-10" />
      <ToolSchema faqs={chatFAQs} toolName="AI Chatbot" toolDescription="Free private AI chatbot. Runs entirely in your browser. No signup, no data tracking, works offline after first load." category="UtilitiesApplication" />
    </>
  );
}
