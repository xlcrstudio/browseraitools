import { useEffect } from "react";
import { Hash } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { WordCounter } from "@/components/WordCounter";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";

const FAQS = [
  {
    question: "How does the word counter work?",
    answer: "Type or paste your text and all stats update instantly — no button to press. Words are counted by splitting on whitespace, characters include all characters including spaces, and character count without spaces excludes all whitespace characters.",
  },
  {
    question: "What stats does this tool provide?",
    answer: "Words, characters (with and without spaces), sentences, paragraphs, unique words, reading time at 238 words per minute, speaking time at 150 words per minute, average word length, and average sentence length. It also provides a Flesch Reading Ease readability score, keyword density for the top 10 most frequent non-common words, and character usage bars for 8 popular platforms.",
  },
  {
    question: "What is the Flesch Reading Ease score?",
    answer: "The Flesch Reading Ease formula produces a score from 0 to 100. Scores of 70–100 are easy to read and suitable for a general audience. Scores of 50–69 are fairly difficult and may require re-reading. Scores below 50 are complex and best suited for academic or technical audiences. The score is based on average sentence length and average number of syllables per word.",
  },
  {
    question: "What platform limits are shown?",
    answer: "X (Twitter) at 280 characters, SMS at 160, Meta description at 160, email subject at 60, YouTube title at 100, Instagram caption at 2,200, LinkedIn post at 3,000, and Reddit title at 300. Each bar turns amber at 80% of the limit and red when you exceed it.",
  },
  {
    question: "How is keyword density calculated?",
    answer: "Common stop words (the, and, is, etc.) are filtered out. The remaining words are counted, and the top 10 are shown with their occurrence count and percentage of total words. This helps identify overused words or confirm your main topic is well represented.",
  },
  {
    question: "Is there a word or character limit?",
    answer: "No — you can paste as much text as you like. The tool runs entirely in your browser so there are no server limits. Very large documents may take a fraction of a second to process.",
  },
  {
    question: "Is my text stored or sent anywhere?",
    answer: "No. Everything runs entirely in your browser. Your text is never sent to a server and never stored. It's deleted the moment you close the tab.",
  },
];

export default function WordCounterPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free Word Counter & Character Counter — Live Stats | Browser AI Tools";

    const metas: Record<string, string> = {
      description: "Free word counter and character counter. Instant live stats — words, characters, sentences, reading time, readability score, keyword density, and platform limits.",
    };
    const ogs: Record<string, string> = {
      "og:title": "Free Word Counter & Character Counter — Live Stats, Readability & Platform Limits",
      "og:description": "Count words, characters, sentences, and paragraphs instantly. Includes reading time, Flesch readability score, keyword density, and character limits for Twitter, LinkedIn, Instagram and more.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/word-counter",
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
            "name": "Word Counter & Character Counter",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free word counter and character counter. Instant live stats — words, characters, sentences, reading time, readability score, and keyword density.",
          }),
        }}
      />

      <ToolPageHeader toolName="Word Counter" icon={Hash} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          Word &amp; Character{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Counter
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Instant live stats as you type — words, characters, sentences, paragraphs, reading time, readability score, keyword density, and platform character limits.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "Live as You Type",
            "Words & Characters",
            "Reading Time",
            "Flesch Readability",
            "Keyword Density",
            "Platform Limits",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="word-counter-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <WordCounter />
      </div>

      <AdBlock slot="word-counter-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>Why Word and Character Count Matters</h2>
        <p>
          Every platform has limits — Twitter's 280-character cap, LinkedIn's 3,000-character post limit, Google's 160-character meta description window, academic essays with word count requirements. Knowing exactly how much you've written before you hit publish prevents frustration and rewrites.
        </p>
        <p>
          This tool updates every character in real time so you're always watching your count — no copy-pasting to check, no estimating. The platform limit bars turn amber as you approach each limit and red when you exceed it.
        </p>

        <h2>Reading Time vs. Speaking Time</h2>
        <p>
          Reading time uses the average adult silent reading speed of 238 words per minute. Speaking time uses the average conversational speech rate of 150 words per minute — useful for presentations, podcasts, and speeches where a 2,000-word script equals about 13 minutes of talk time.
        </p>

        <h2>Understanding Flesch Reading Ease</h2>
        <p>
          The Flesch Reading Ease score runs from 0 to 100. A score of 70 or above is easily understood by most adults. Scores between 50 and 69 are understandable but may require effort. Below 50 is complex writing best suited to professionals or academics. The score is calculated from average sentence length and the number of syllables per word — shorter sentences with common words score higher.
        </p>
        <p>
          Most popular websites and newspapers target a score of 60–70. Academic papers often fall between 20 and 40.
        </p>

        <h2>Keyword Density</h2>
        <p>
          The keyword density table shows your top 10 most-used meaningful words — common words like "the," "and," "is" are filtered out. This helps SEO writers confirm their target keyword appears at a healthy frequency (typically 1–2%), and helps any writer notice when they're repeating themselves unintentionally.
        </p>

        <h2>Platform Character Limits Reference</h2>
        <ul>
          <li><strong>X (Twitter):</strong> 280 characters per post</li>
          <li><strong>SMS:</strong> 160 characters per message (longer messages are split)</li>
          <li><strong>Meta description:</strong> ~160 characters shown in Google search results</li>
          <li><strong>Email subject line:</strong> ~60 characters for full display on most clients</li>
          <li><strong>YouTube video title:</strong> 100 characters (first ~70 shown in search)</li>
          <li><strong>Instagram caption:</strong> 2,200 characters (first 125 shown before "more")</li>
          <li><strong>LinkedIn post:</strong> 3,000 characters</li>
          <li><strong>Reddit post title:</strong> 300 characters</li>
        </ul>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="word-counter-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="Word Counter & Character Counter"
        toolDescription="Free word counter and character counter. Instant live stats — words, characters, sentences, reading time, Flesch readability score, keyword density, and platform character limits for Twitter, LinkedIn, Instagram and more. 100% private."
        faqs={FAQS}
      />
    </>
  );
}
