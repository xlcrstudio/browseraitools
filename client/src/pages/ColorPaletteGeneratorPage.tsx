import { useEffect } from "react";
import { Palette } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { ColorPaletteGenerator } from "@/components/ColorPaletteGenerator";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";

const FAQS = [
  {
    question: "What harmony types does the palette generator support?",
    answer: "Six color theory harmonies plus a full shade scale: Monochromatic (one hue, five lightness levels), Complementary (base + opposite hue), Analogous (three adjacent hues), Triadic (three evenly-spaced hues), Split-Complementary (softer version of complementary), Tetradic (four hues at 90-degree intervals), and Shades 50–900 (a complete Tailwind-style scale from lightest to darkest).",
  },
  {
    question: "What do the WCAG contrast badges mean?",
    answer: "Every color card shows its contrast ratio against white and black text. AAA (7:1 ratio) is the highest standard, required for small text in the most accessible designs. AA (4.5:1) is the minimum standard required by WCAG 2.1 for normal text. A ✕ means the combination does not meet AA — avoid using that color as a text color on that background.",
  },
  {
    question: "How do I copy a color?",
    answer: "Three ways: click the color swatch directly to copy the hex value; use the small copy buttons under each card to copy the hex, rgb(), or hsl() format individually; or click 'Copy as CSS' to copy all colors as a :root {} CSS variables block.",
  },
  {
    question: "What is the color wheel math behind each harmony?",
    answer: "All harmonies are calculated in HSL color space by rotating the hue angle. Complementary adds 180°. Analogous adds ±30°. Triadic adds 120° and 240°. Split-complementary adds 150° and 210°. Tetradic adds 90°, 180°, and 270°. Saturation and lightness are preserved from the base color, with small adjustments for visual balance.",
  },
  {
    question: "What does the Shades 50–900 mode generate?",
    answer: "It creates a complete shade scale similar to Tailwind CSS's color system — 10 swatches from near-white (50) through the mid-range (500, closest to your input color) down to near-black (900). This is useful for building a full design system token set from a single brand color.",
  },
  {
    question: "Can I enter any starting color?",
    answer: "Yes — use the native color picker, type any valid 6-digit hex code directly into the input field, or click one of the preset swatches (Ocean, Forest, Sunset, Lavender, Amber, Slate). The shuffle button generates a random visually-pleasing color (constrained to mid-range saturation and lightness).",
  },
  {
    question: "Is my color data private?",
    answer: "Completely. All palette generation and contrast calculations happen in your browser using JavaScript and color theory math. Nothing is sent to a server.",
  },
];

export default function ColorPaletteGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free Color Palette Generator — Harmonies, Shades & WCAG Contrast | Browser AI Tools";

    const metas: Record<string, string> = {
      description: "Free color palette generator. Create harmonious palettes from any color — complementary, analogous, triadic, monochromatic, shades 50–900. WCAG contrast checker included.",
    };
    const ogs: Record<string, string> = {
      "og:title": "Free Color Palette Generator — Harmonies, WCAG Contrast & CSS Export",
      "og:description": "Generate color palettes from any base color. 7 harmony types, full shade scales, WCAG AA/AAA contrast badges, CSS variables export. 100% private.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/color-palette-generator",
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
            "name": "Color Palette Generator",
            "applicationCategory": "DesignApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free color palette generator. Create harmonious palettes from any color with WCAG contrast checking and CSS export.",
          }),
        }}
      />

      <ToolPageHeader toolName="Color Palette Generator" icon={Palette} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          Color Palette{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Generator
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Generate harmonious color palettes from any base color. Six color theory harmonies, full shade scales, WCAG contrast checking, and CSS variables export.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "7 Harmony Types",
            "Shades 50–900",
            "WCAG AA / AAA",
            "CSS Export",
            "Click to Copy",
            "Hex / RGB / HSL",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="color-palette-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <ColorPaletteGenerator />
      </div>

      <AdBlock slot="color-palette-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>Color Theory: How Each Harmony Works</h2>

        <h3>Monochromatic</h3>
        <p>Uses a single hue across five lightness levels — lightest tint through the base to the darkest shade. Monochromatic palettes feel cohesive and elegant but benefit from a strong typographic hierarchy to create contrast. Safe choice for minimalist designs.</p>

        <h3>Complementary</h3>
        <p>Pairs the base color with the hue directly opposite on the color wheel (+180°). Complementary pairs have the highest natural contrast and create vibrant, energetic designs. The key is using one color as dominant and the complement sparingly as an accent.</p>

        <h3>Analogous</h3>
        <p>Uses three or more hues adjacent on the color wheel (±15° and ±30°). Analogous palettes feel natural and harmonious because they appear in nature — sunsets, forests, and oceans. They lack natural contrast, so pair them with dark neutral text.</p>

        <h3>Triadic</h3>
        <p>Three hues evenly distributed at 120° intervals. Triadic palettes are balanced and vibrant without the harshness of complementary. One color should dominate (60%), one support (30%), and one accent (10%) for best results.</p>

        <h3>Split-Complementary</h3>
        <p>Like complementary but instead of the exact opposite hue, uses the two hues flanking it (+150° and +210°). This gives strong contrast similar to complementary but feels less harsh and is easier to work with in practice.</p>

        <h3>Tetradic (Double Complementary)</h3>
        <p>Four colors at 90° intervals — two complementary pairs. Tetradic palettes are the richest and most complex. They work best when one color dominates and the others serve as accents. Avoid using all four in equal amounts.</p>

        <h3>Shades 50–900</h3>
        <p>Generates a complete 10-step shade scale modeled after Tailwind CSS's color system. 50 is the lightest near-white, 900 is the darkest near-black, and 500 is the closest to your input. This is the standard format for design system color tokens.</p>

        <h2>WCAG Accessibility Contrast</h2>
        <p>
          Every color card shows its contrast ratio against white and black text. The WCAG 2.1 standard requires a minimum 4.5:1 ratio for normal text (AA) and 7:1 for AAA. Large text (18pt+ or bold 14pt+) only requires 3:1 for AA. Use the contrast badges to ensure your color combinations are accessible to users with low vision.
        </p>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <AdBlock slot="color-palette-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="Color Palette Generator"
        toolDescription="Free color palette generator. Create harmonious palettes from any base color using 7 color theory harmony types. Includes WCAG AA/AAA contrast checking, full shade scales, and CSS variables export."
        faqs={FAQS}
      />
    </>
  );
}
