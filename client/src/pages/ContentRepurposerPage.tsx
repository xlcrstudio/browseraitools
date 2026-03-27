import { useEffect } from "react";
import { Layers } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ContentRepurposer } from "@/components/ContentRepurposer";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import ShareResultButtons from "@/components/ShareResultButtons";

const FAQS = [
  {
    question: "What content formats does the AI generate?",
    answer: "Five ready-to-post tweets (each with a character count), a LinkedIn post, an email newsletter with a subject line and full body, three ad hooks for Facebook/Google/LinkedIn ads, and an Instagram caption with hashtags — all generated from a single piece of source content.",
  },
  {
    question: "What types of content can I repurpose?",
    answer: "Any long-form text: blog posts, articles, essays, podcast transcripts, YouTube video transcripts, newsletters, speeches, whitepapers, or reports. Select the content type from the dropdown so the AI tones each output appropriately.",
  },
  {
    question: "How are the tweets different from each other?",
    answer: "Each tweet takes a different angle: the first is a compelling hook, the second a different perspective, the third is stat or insight-driven, the fourth is a question or provocative take, and the fifth is an actionable tip. All are ready to post with character counts shown.",
  },
  {
    question: "What makes the LinkedIn post different from the tweets?",
    answer: "The LinkedIn post is 150-200 words, written in a professional tone with short paragraphs and a strong opening hook. It ends with a question designed to drive comments and engagement — which is how LinkedIn's algorithm rewards posts.",
  },
  {
    question: "What is the email newsletter version?",
    answer: "A 150-200 word conversational email version of your content, starting with 'Hey [First Name],' — complete with the key insight, a tip, and a soft call to action. A compelling subject line is generated separately so you can copy it directly into your email tool.",
  },
  {
    question: "What are ad hooks and how do I use them?",
    answer: "Short 10-15 word phrases designed to stop the scroll in paid ads. Three hooks are generated using different psychological angles: curiosity, problem-awareness, and social proof. Paste them into the headline field of a Facebook, Google, or LinkedIn ad campaign.",
  },
  {
    question: "Is there a word limit on my source content?",
    answer: "The AI processes the first 800 words. An amber notice appears if your content is longer. For very long pieces like book chapters or lengthy transcripts, paste the section with the most valuable content — typically the introduction and key arguments.",
  },
  {
    question: "Is my content private?",
    answer: "Yes — completely. The AI model runs on your GPU inside your browser. Your content is never sent to any server or third party. You can safely repurpose confidential drafts, internal documents, or pre-published content.",
  },
];

export default function ContentRepurposerPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Content Repurposer — Turn One Post Into 10 Formats | Browser AI Tools";

    const metas: Record<string, string> = {
      description: "Free AI content repurposer. Turn any blog post or article into tweets, a LinkedIn post, an email newsletter, ad hooks, and an Instagram caption — instantly. 100% private.",
    };
    const ogs: Record<string, string> = {
      "og:title": "Free AI Content Repurposer — Turn One Piece of Content into 10 Formats",
      "og:description": "Paste a blog post, article, or transcript and instantly get 5 tweets, a LinkedIn post, email newsletter, 3 ad hooks, and an Instagram caption. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-content-repurposer",
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
            "name": "AI Content Repurposer",
            "applicationCategory": "ProductivityApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free AI content repurposer. Turn any blog post, article, or transcript into tweets, LinkedIn post, email newsletter, ad hooks, and Instagram caption. 100% private.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Content Repurposer" icon={Layers} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          AI Content{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Repurposer
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Paste any blog post, article, or transcript and instantly get five tweets, a LinkedIn post, an email newsletter, three ad hooks, and an Instagram caption — in one click.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "5 Tweets",
            "LinkedIn Post",
            "Email Newsletter",
            "3 Ad Hooks",
            "Instagram Caption",
            "Blog · Podcast · Article",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="repurposer-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <ContentRepurposer />
      </div>

      <AdBlock slot="repurposer-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>Stop Writing Every Format From Scratch</h2>
        <p>
          Creating content for multiple platforms is one of the most time-consuming parts of content marketing. Writing a blog post is already significant work — rewriting it into five tweets, a LinkedIn post, an email, and an Instagram caption on top of that is hours more. This tool does all of it in seconds, from a single paste.
        </p>
        <p>
          The AI doesn't just copy and paste. Each format is rewritten with platform-specific tone, length, and structure. Tweets are punchy and hook-driven. The LinkedIn post has short paragraphs and a discussion question. The email has a subject line and conversational opener. Ad hooks are built to stop scrolling. Instagram gets visual line breaks and hashtags.
        </p>

        <h2>What Each Format Is Optimized For</h2>
        <ul>
          <li><strong>5 Tweets</strong> — Each takes a different angle: hook, alternate perspective, insight, provocative question, actionable tip. Character counts shown for each. Copy individually or all at once.</li>
          <li><strong>LinkedIn Post</strong> — 150-200 words, professional tone, strong opener, short paragraphs, ends with a question to drive comments and algorithm reach.</li>
          <li><strong>Email Newsletter</strong> — Subject line + 150-200 word body. Conversational tone, starts with "Hey [First Name]," includes the main insight and a soft call to action.</li>
          <li><strong>Ad Hooks</strong> — Three 10-15 word headlines built for paid ads: one curiosity-driven, one problem-focused, one social-proof or results-based. Ready for Facebook, Google, or LinkedIn ads.</li>
          <li><strong>Instagram Caption</strong> — 100-150 words with line breaks, visual rhythm, and 8-10 relevant hashtags appended at the end.</li>
        </ul>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="repurposer-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="AI Content Repurposer"
        toolDescription="Free AI content repurposer. Turn any blog post, article, or transcript into tweets, a LinkedIn post, an email newsletter, ad hooks, and an Instagram caption instantly. 100% private."
        faqs={FAQS}
      />

      <ShareResultButtons toolName="AI Content Repurposer" />
    </>
  );
}
