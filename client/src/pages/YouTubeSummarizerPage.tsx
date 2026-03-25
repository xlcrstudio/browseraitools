import { useEffect } from "react";
import { Youtube } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { YouTubeSummarizer } from "@/components/YouTubeSummarizer";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";

const FAQS = [
  {
    question: "How do I get the transcript from a YouTube video?",
    answer: "Open the video on YouTube, click the three-dot menu (⋮) below the video, and select 'Show transcript'. In the transcript panel, click the three-dot menu inside the panel and turn off timestamps. Then click inside the transcript, press Ctrl+A (Cmd+A on Mac) to select all the text, and Ctrl+C to copy it. Paste it into the transcript box above.",
  },
  {
    question: "Do all YouTube videos have transcripts?",
    answer: "Most YouTube videos have auto-generated captions that you can access as a transcript, especially if they're in English. If a video doesn't show the 'Show transcript' option, either the creator has disabled captions or the video doesn't have any. Longer videos (over 30 minutes) work just as well — the tool summarizes the first 1,200 words if the transcript is very long.",
  },
  {
    question: "What do the four output tabs contain?",
    answer: "Full Summary gives you a 3-4 paragraph narrative overview of the video's main content and ideas. Key Takeaways gives you 5 bullet-point insights you can reference quickly. Action Steps gives you 4 specific, actionable things you can do based on what the video covers. Tweet Thread gives you a 5-tweet thread ready to post, with a hook, insights, and a call to action.",
  },
  {
    question: "Why is there a 1,200-word transcript limit?",
    answer: "The AI model runs locally in your browser using WebGPU, which has a context window limit. For most YouTube videos (5–20 minutes), the transcript is under 1,200 words and gets processed fully. For longer videos, the first 1,200 words are summarized — you'll see a notice when this happens. An amber badge will appear telling you the summary covers the first portion of the video.",
  },
  {
    question: "Can I summarize videos in other languages?",
    answer: "Yes. Paste the transcript in any language and the AI will summarize it. The output will be in the same language as the transcript. For best results, turn off timestamps in the YouTube transcript panel before copying — timestamps can break sentence flow and make the output less coherent.",
  },
  {
    question: "Why does the URL field say 'optional'?",
    answer: "The URL is used only to look up the video's title and thumbnail for display purposes — it doesn't fetch the transcript automatically. YouTube's transcript data isn't accessible from a browser directly due to security restrictions, which is why you need to paste it manually. The URL lookup uses YouTube's public embed metadata and works for any public video.",
  },
  {
    question: "Is my transcript data private?",
    answer: "Yes. Everything runs in your browser. The transcript text is never sent to any server — the AI model processes it locally using WebGPU. Nothing is logged, stored, or uploaded. This makes the tool safe to use for private or unlisted video content.",
  },
  {
    question: "Can I copy the summaries?",
    answer: "Yes. Each tab has its own Copy button in the top-right corner. There's also a 'Copy All' button in the results header that copies all four sections — full summary, key takeaways, action steps, and the tweet thread — into your clipboard as formatted plain text.",
  },
];

export default function YouTubeSummarizerPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI YouTube Summarizer — Summary, Key Points & Tweet Thread | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Free AI YouTube summarizer. Paste any video transcript and get an instant full summary, key takeaways, action steps, and a ready-to-post tweet thread. 100% private.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI YouTube Summarizer — Summary, Key Takeaways, Action Steps & Tweet Thread",
      "og:description": "Summarize any YouTube video instantly. Get a full summary, key takeaways, action steps, and a tweet thread from the transcript. 100% private — runs in your browser.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-youtube-summarizer",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "AI YouTube Summarizer",
            "applicationCategory": "ProductivityApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free AI YouTube summarizer. Get instant full summary, key takeaways, action steps, and tweet thread from any video transcript. 100% private.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI YouTube Summarizer" icon={Youtube} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          AI YouTube{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600">
            Summarizer
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Paste any YouTube transcript and get an instant full summary, key takeaways, action steps, and a ready-to-post tweet thread — all running privately in your browser.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "Full Summary",
            "Key Takeaways",
            "Action Steps",
            "Tweet Thread",
            "Any Language",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 font-semibold border border-red-200 dark:border-red-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="yt-summarizer-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <YouTubeSummarizer />
      </div>

      <AdBlock slot="yt-summarizer-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>Summarize Any YouTube Video in Four Formats</h2>
        <p>
          Instead of watching a 30-minute video to find the three key insights you actually needed, paste the transcript and get them in seconds. The full summary gives you the narrative arc. Key Takeaways extracts the five most important points. Action Steps tells you what to do with what you learned. The Tweet Thread packages the insights for sharing.
        </p>
        <p>
          The AI model runs entirely in your browser — your transcript never leaves your device. This matters if you're summarizing private, unlisted, or sensitive video content.
        </p>

        <h2>How to Get the YouTube Transcript</h2>
        <p>
          YouTube provides transcripts for most videos with captions. Open the video, click the three-dot menu (⋮) below the player, and select "Show transcript". In the transcript panel that appears on the right, click the three-dot menu at the top of the panel and disable timestamps — this removes the time codes and gives you clean readable text. Select all the transcript text, copy it, and paste it above.
        </p>
        <p>
          If "Show transcript" doesn't appear, the video's creator has disabled captions or the video doesn't have auto-generated captions. This typically affects very short clips, music videos, and some live streams.
        </p>

        <h2>Tweet Thread Generator</h2>
        <p>
          The Tweet Thread tab produces a 5-tweet thread with a hook opener, two insight tweets, an actionable takeaway, and a closing call to action. Each tweet shows a character count so you can see at a glance whether it fits within Twitter/X's 280-character limit. Every tweet has its own copy button for easy editing in a Twitter client.
        </p>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="yt-summarizer-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="AI YouTube Summarizer"
        toolDescription="Free AI YouTube summarizer. Paste any video transcript and get an instant full summary, key takeaways, action steps, and a ready-to-post tweet thread. 100% private."
        faqs={FAQS}
      />
    </>
  );
}
