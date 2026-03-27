import { useEffect } from "react";
import { Palette } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ImagePromptGenerator } from "@/components/ImagePromptGenerator";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import ShareResultButtons from "@/components/ShareResultButtons";

const FAQS = [
  {
    question: "What is an AI image prompt generator and why do I need one?",
    answer: "An AI image prompt generator turns your basic idea into a rich, detailed text prompt that an AI art tool (like Midjourney, DALL-E 3, or Flux) can use to create stunning images. Most people struggle to get great results from AI art tools because their prompts are too vague. This tool generates 8 optimized variations — with proper lighting, composition, mood, camera settings, and platform-specific parameters — so your images come out the way you imagined.",
  },
  {
    question: "Which AI art platforms are the 8 prompts optimized for?",
    answer: "Each generation produces 8 prompts: Midjourney v6 (with --ar, --v 6, --stylize, --q parameters), DALL-E 3 (natural language, descriptive), Flux 1.1 Pro (hyper-detailed and photorealistic), Stable Diffusion 3 (with auto-generated negative prompts), Leonardo AI (composition and atmosphere focused), Midjourney Cinematic (film-still variation with lens and cinematographer references), Adobe Firefly (commercial-safe wording), and a Universal prompt that works across any platform.",
  },
  {
    question: "What do the Midjourney parameters mean?",
    answer: "--ar sets the aspect ratio (e.g. --ar 16:9 for landscape). --v 6 uses Midjourney version 6, their most capable model. --stylize controls how artistic vs. literal the output is (0 = very literal, 1000 = maximum artistic interpretation). --q 2 sets quality to the highest level, doubling generation time for finer detail.",
  },
  {
    question: "What are the available styles?",
    answer: "You can choose from: Photorealistic, Cyberpunk, Studio Ghibli, Oil Painting, Anime/Manga, Watercolor, Cinematic, Dark Fantasy, Neon Noir, Minimalist, Sketch/Pencil, Baroque, Lo-fi Aesthetic, and Surrealism. Choosing 'None' lets the AI pick the most fitting aesthetic for your concept.",
  },
  {
    question: "What is the 'Remix' button for?",
    answer: "Hovering over any prompt card reveals a Remix button. Clicking it pre-fills the input with that prompt as a starting point, so you can describe a variation of it and generate 8 new prompts based on the remix concept. It's a way to iterate and explore variations of a prompt you liked.",
  },
  {
    question: "Is there a prompt history?",
    answer: "Yes. Every generation is automatically saved to your browser's local storage. Click the clock icon (history) to see your past 20 generations and reload any of them. Your history stays on your device and is never uploaded anywhere.",
  },
  {
    question: "Does this tool run privately without uploading my prompts?",
    answer: "Yes — completely. The AI model runs in your browser using WebLLM. Your ideas and prompts never leave your device. Nothing is sent to a server, stored in a cloud, or visible to anyone else. This makes it safe for commercial projects, client work, and confidential creative ideas.",
  },
  {
    question: "What is a negative prompt?",
    answer: "A negative prompt tells the AI what to avoid in the image. For Stable Diffusion, they're essential for avoiding common problems like blurry results, deformed hands, watermarks, and low quality. The tool auto-generates appropriate negative prompts for SD3 prompts based on your concept.",
  },
];

export default function ImagePromptGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free AI Image Prompt Generator — Midjourney, DALL-E 3, Flux & More | Browser AI Tools";

    const metaUpdates: Record<string, string> = {
      description: "Free AI image prompt generator — get 8 optimized prompts for Midjourney v6, DALL-E 3, Flux 1.1, Stable Diffusion 3, and more. 100% private, runs in your browser. No login required.",
    };
    const ogUpdates: Record<string, string> = {
      "og:title": "Free AI Image Prompt Generator — Midjourney, DALL-E 3 & Flux Prompts Instantly",
      "og:description": "Turn any idea into 8 studio-quality AI art prompts optimized for Midjourney v6, DALL-E 3, Flux, SD3, and more. Private, unlimited, no sign-up.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/ai-image-prompt-generator",
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
            "name": "AI Image Prompt Generator",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free AI image prompt generator with 8 platform-specific prompts for Midjourney v6, DALL-E 3, Flux 1.1, Stable Diffusion 3, Leonardo AI, and Adobe Firefly. 100% private, runs in your browser.",
          }),
        }}
      />

      <ToolPageHeader toolName="AI Image Prompt Generator" icon={Palette} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          AI Image{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Prompt Generator
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Turn any idea into 8 studio-quality prompts for Midjourney, DALL-E 3, Flux, Stable Diffusion, and more. Includes parameters, negative prompts, and one-click copy. Runs entirely in your browser.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "Midjourney v6 + Parameters",
            "DALL-E 3 & Flux",
            "Stable Diffusion 3",
            "8 Variations Every Time",
            "Prompt History",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="image-prompt-generator-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <ImagePromptGenerator />
      </div>

      <AdBlock slot="image-prompt-generator-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>Best AI Image Prompt Generator 2026 — Midjourney & DALL-E Prompts That Actually Work</h2>
        <p>
          Getting great results from AI image generators is less about the tool and more about the prompt. A vague description like "a warrior in a forest" produces average results. A detailed prompt with lighting, mood, camera perspective, color palette, and platform parameters produces images that look like they came from a professional studio. This tool bridges that gap — automatically.
        </p>
        <p>
          Describe your concept in plain English. Select a style and aspect ratio. The AI generates 8 optimized prompts — each tailored to a specific platform's strengths — in under 30 seconds. No account. No limit. No internet connection required after the model loads.
        </p>

        <h2>8 Platform-Specific Prompts Every Time</h2>
        <p>Each generation gives you a full set of prompts for every major platform:</p>
        <ul>
          <li><strong>Midjourney v6</strong> — with the exact parameters (--ar, --v 6, --stylize, --q 2) that produce the best results. No guessing.</li>
          <li><strong>DALL-E 3</strong> — natural language descriptive prompts that work with DALL-E's conversational understanding.</li>
          <li><strong>Flux 1.1 Pro</strong> — hyper-detailed prompts emphasizing photorealistic texture, lighting quality, and physical accuracy.</li>
          <li><strong>Stable Diffusion 3</strong> — prompt + auto-generated negative prompt (avoids blurry, deformed, low quality results automatically).</li>
          <li><strong>Leonardo AI</strong> — composition-focused prompts that align with Leonardo's strength in character rendering and dynamic poses.</li>
          <li><strong>Midjourney Cinematic</strong> — a film-still variation with lens type, focal length, and cinematographic references for a movie-quality result.</li>
          <li><strong>Adobe Firefly</strong> — commercially safe wording optimized for Firefly's content policies and creative effects system.</li>
          <li><strong>Universal</strong> — a platform-agnostic prompt rich enough to work well on any AI image generator.</li>
        </ul>

        <h2>What Makes a Great AI Image Prompt?</h2>
        <p>The best prompts share several characteristics that this tool applies automatically:</p>
        <ul>
          <li><strong>Specificity</strong> — "golden hour sunlight streaming through dusty church windows" is better than "nice lighting."</li>
          <li><strong>Composition details</strong> — camera angle, distance (close-up, wide shot, aerial), depth of field, and lens type.</li>
          <li><strong>Mood and atmosphere</strong> — foggy, ethereal, dramatic, melancholic, vibrant, surreal.</li>
          <li><strong>Art references</strong> — style of a director, painter, photographer, or art movement provides a strong aesthetic anchor.</li>
          <li><strong>Technical quality markers</strong> — 8K, hyperrealistic, photorealistic, ultra-detailed, octane render, award-winning photography.</li>
          <li><strong>Platform parameters</strong> — for Midjourney specifically, --stylize, --v, --ar, and --q have massive impact on output quality.</li>
        </ul>

        <h2>How to Use the Style Selector</h2>
        <p>
          Selecting a style provides a strong aesthetic anchor for all 8 prompts. "Cyberpunk" adds neon lighting, rain-slicked streets, and dystopian tech. "Studio Ghibli" brings hand-painted warmth, soft skies, and whimsical detail. "Baroque" adds dramatic chiaroscuro lighting and classical grandeur. "None" lets the AI choose the style that best fits your concept.
        </p>

        <h2>Prompt History and Remixing</h2>
        <p>
          Every generation is automatically saved to your browser's local storage — no account required. Revisit past generations with the history button, and remix any prompt you liked by hovering over a card and clicking Remix. Remixing is ideal for iterating: generate a base concept, find the prompt that came closest to your vision, and remix it for a refined second generation.
        </p>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="image-prompt-generator-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="AI Image Prompt Generator"
        toolDescription="Free AI image prompt generator — get 8 platform-specific prompts for Midjourney v6, DALL-E 3, Flux 1.1, Stable Diffusion 3, Leonardo AI, and Adobe Firefly. Private, unlimited, no login."
        faqs={FAQS}
      />

      <ShareResultButtons toolName="AI Image Prompt Generator" />
    </>
  );
}
