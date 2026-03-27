import { useState, useCallback } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { InlineShareButtons } from "@/components/InlineShareButtons";

// ─── Lorem Ipsum corpus ───────────────────────────────────────────────────────

const LOREM_WORDS = [
  "lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit",
  "sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore",
  "magna","aliqua","enim","ad","minim","veniam","quis","nostrud",
  "exercitation","ullamco","laboris","nisi","aliquip","ex","ea","commodo",
  "consequat","duis","aute","irure","in","reprehenderit","voluptate","velit",
  "esse","cillum","eu","fugiat","nulla","pariatur","excepteur","sint",
  "occaecat","cupidatat","non","proident","sunt","culpa","qui","officia",
  "deserunt","mollit","anim","id","est","laborum","perspiciatis","unde",
  "omnis","iste","natus","error","voluptatem","accusantium","doloremque",
  "laudantium","totam","rem","aperiam","eaque","ipsa","quae","ab","illo",
  "inventore","veritatis","quasi","architecto","beatae","vitae","dicta",
  "explicabo","nemo","ipsam","quia","voluptas","aspernatur","odit","aut",
  "fugit","consequuntur","magni","dolores","eos","ratione","sequi","nesciunt",
  "neque","porro","quisquam","dolorem","adipisci","numquam","eius","modi",
  "tempora","incidunt","labore","magnam","aliquam","quaerat","minima",
  "nostrum","exercitationem","ullam","corporis","suscipit","laboriosam",
  "aliquid","commodi","consequatur","quis","autem","vel","eum","iure",
  "reprehenderit","qui","voluptatem","nulla","accusantium",
];

const LOREM_START = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

function rng(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 4294967296; };
}

let _seed = Date.now();
function rand() { _seed = (_seed * 1664525 + 1013904223) & 0xffffffff; return (_seed >>> 0) / 4294967296; }
function pick<T>(arr: T[]): T { return arr[Math.floor(rand() * arr.length)]; }
function shuffle<T>(arr: T[]): T[] { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function loremSentence(words: string[]): string {
  const len = 8 + Math.floor(rand() * 12); // 8–19 words
  const picked: string[] = [];
  for (let i = 0; i < len; i++) picked.push(words[Math.floor(rand() * words.length)]);
  picked[0] = picked[0].charAt(0).toUpperCase() + picked[0].slice(1);
  return picked.join(" ") + ".";
}

function loremParagraph(numSentences = 0): string {
  const count = numSentences || (3 + Math.floor(rand() * 3)); // 3–5
  const sents: string[] = [];
  for (let i = 0; i < count; i++) sents.push(loremSentence(LOREM_WORDS));
  return sents.join(" ");
}

// ─── Realistic themed sentence banks ─────────────────────────────────────────

const THEMES: Record<string, string[]> = {
  general: [
    "Our approach combines innovation with proven methodologies to deliver outstanding results.",
    "We believe that collaboration and transparency are the foundations of every successful project.",
    "By focusing on what matters most, we create solutions that make a real difference.",
    "Every decision we make is guided by a commitment to quality and long-term value.",
    "Our team brings diverse expertise and a shared passion for excellence to every challenge.",
    "We work closely with our partners to understand their goals and exceed their expectations.",
    "Continuous improvement is at the heart of everything we do.",
    "Our solutions are designed to scale with your needs and adapt to changing circumstances.",
    "We prioritize clear communication and actionable insights throughout every engagement.",
    "Building trust through consistent delivery and honest relationships drives our success.",
    "From concept to completion, we maintain the highest standards of craftsmanship and care.",
    "Our proven track record speaks to our ability to deliver complex projects on time and on budget.",
    "We embrace challenges as opportunities to innovate and create meaningful impact.",
    "Sustainable growth requires a careful balance of ambition and pragmatism.",
    "Our clients' success is the ultimate measure of our own achievement.",
  ],
  tech: [
    "Our cloud-native platform delivers enterprise-grade performance with seamless horizontal scalability.",
    "Built on modern microservices architecture, the system processes millions of requests at sub-100ms latency.",
    "Advanced ML pipelines enable real-time data enrichment and predictive analytics at scale.",
    "The API-first design ensures frictionless integration with your existing technology stack.",
    "Automated CI/CD pipelines reduce deployment risk while accelerating release cadence.",
    "End-to-end encryption and zero-trust security architecture protect sensitive data at every layer.",
    "Our distributed caching strategy eliminates bottlenecks and ensures consistent throughput.",
    "Infrastructure-as-code enables reproducible environments and eliminates configuration drift.",
    "The event-driven architecture decouples services and improves overall system resilience.",
    "Container orchestration ensures optimal resource utilization across heterogeneous workloads.",
    "Observability tooling provides deep visibility into system health through metrics, logs, and traces.",
    "GraphQL APIs deliver exactly the data clients need, minimizing over-fetching and network overhead.",
    "Edge computing capabilities bring processing closer to the end user, reducing latency dramatically.",
    "Our SDK abstracts complex cryptographic operations behind a clean, developer-friendly interface.",
    "Real-time WebSocket connections power collaborative features with sub-second update propagation.",
  ],
  business: [
    "Strategic alignment between operational priorities and long-term vision drives sustainable competitive advantage.",
    "Our market analysis reveals significant untapped opportunities in the mid-market segment.",
    "Cross-functional collaboration accelerates decision-making and reduces time-to-market by up to 40%.",
    "A data-driven approach to resource allocation maximizes return on investment across the portfolio.",
    "Stakeholder engagement throughout the project lifecycle ensures broad organizational buy-in.",
    "Our change management framework minimizes disruption while accelerating adoption of new processes.",
    "Agile methodologies enable rapid iteration based on real customer feedback and market signals.",
    "Building a culture of continuous improvement requires leadership commitment at every level.",
    "Risk management frameworks help organizations navigate uncertainty with confidence and clarity.",
    "Operational efficiency initiatives free up capital for investment in high-growth opportunities.",
    "Transparent reporting and clear KPIs keep teams aligned around shared goals and accountability.",
    "Customer lifetime value optimization is a more powerful growth lever than pure acquisition spend.",
    "Partnership ecosystems multiply reach and capability without proportional increases in overhead.",
    "Board-level digital transformation strategies require both vision and disciplined execution.",
    "Quarterly business reviews create structured opportunities to recalibrate priorities and celebrate wins.",
  ],
  food: [
    "Crafted from locally sourced, seasonal ingredients that celebrate the best of each harvest.",
    "Our chefs blend traditional culinary techniques with modern flavor profiles for a memorable dining experience.",
    "Every dish is prepared fresh daily, using herbs and produce grown in our rooftop garden.",
    "The menu changes with the seasons, ensuring peak freshness and supporting local farmers.",
    "Bold spices and unexpected flavor combinations create dishes that surprise and delight.",
    "Our signature slow-roasting method develops deep, complex flavors over a twelve-hour process.",
    "Farm-to-table philosophy guides every purchasing decision, from proteins to artisan cheeses.",
    "Thoughtfully curated wine pairings elevate each course and highlight regional varietals.",
    "House-made pastas, breads, and condiments reflect our unwavering commitment to craft.",
    "The open kitchen concept invites diners to witness the care and skill behind every plate.",
    "Fermentation and preservation techniques bring out unexpected depth in familiar ingredients.",
    "Our dessert program showcases pastry artistry with seasonal fruits and house-churned ice creams.",
    "Dietary accommodations are handled with the same care and creativity as our signature dishes.",
    "The tasting menu offers a curated journey through the chef's most inspired seasonal creations.",
    "Every element on the plate — texture, color, temperature — is intentional and harmonious.",
  ],
  travel: [
    "Discover breathtaking landscapes and immersive cultural experiences that create memories for a lifetime.",
    "Our carefully curated itineraries balance iconic landmarks with hidden local gems.",
    "Expert local guides share insider knowledge that transforms a tour into a genuine cultural exchange.",
    "Flexible scheduling and small group sizes ensure a personalized, unhurried exploration.",
    "Every accommodation is handpicked for character, comfort, and authentic sense of place.",
    "From mountain trekking to coastal sailing, the journey is crafted around your sense of adventure.",
    "Sustainable tourism practices protect the destinations we visit for generations to come.",
    "Pre-trip briefings ensure you arrive informed, prepared, and excited for every experience.",
    "Off-the-beaten-path discoveries often become the most cherished highlights of any journey.",
    "Immersive culinary experiences connect travelers with local culture through the universal language of food.",
    "Our 24/7 concierge support ensures peace of mind throughout every stage of your journey.",
    "Photography workshops at golden-hour locations help you capture the beauty of each destination.",
    "Language and cultural orientation sessions deepen appreciation and foster meaningful connections.",
    "Private yacht charters and chartered flights unlock remote destinations inaccessible to mainstream travel.",
    "Each journey is thoughtfully paced to blend exploration, relaxation, and genuine discovery.",
  ],
  fashion: [
    "Contemporary design meets timeless elegance in this carefully considered collection.",
    "Premium fabrics and meticulous tailoring create pieces that transition effortlessly from day to evening.",
    "Each garment reflects our commitment to sustainable practices and enduring style.",
    "The silhouettes are informed by modern aesthetics while honoring classic construction techniques.",
    "Limited-edition colorways are developed in collaboration with emerging artists and dye houses.",
    "Our supply chain transparency ensures every piece is produced under fair and ethical conditions.",
    "Versatile layering pieces form the foundation of a wardrobe built for modern life.",
    "Attention to detail — from interior stitching to hardware — distinguishes true quality.",
    "The collection draws inspiration from architectural forms and natural textures found in nature.",
    "Natural fibers are selected for breathability, durability, and their graceful aging over time.",
    "Each season, we release only a curated number of styles, prioritizing depth over breadth.",
    "Our accessories are designed to anchor and elevate any outfit with understated confidence.",
    "The capsule wardrobe philosophy guides our design process from initial sketch to final production.",
    "Deadstock fabrics and upcycled materials reduce waste without compromising quality or aesthetic.",
    "Fit is everything — our in-house atelier offers complimentary alterations on every garment.",
  ],
  healthcare: [
    "Patient-centered care delivered by board-certified specialists using the latest evidence-based protocols.",
    "Our comprehensive wellness programs address physical, mental, and emotional health holistically.",
    "Cutting-edge diagnostic imaging and laboratory services enable accurate, timely clinical decisions.",
    "A multidisciplinary care team collaborates to develop personalized treatment plans for every patient.",
    "Telehealth capabilities extend our reach, connecting patients with specialists regardless of geography.",
    "Preventive care and early intervention programs reduce long-term health costs and improve outcomes.",
    "Our electronic health records system ensures seamless information flow across all care settings.",
    "Compassionate nursing staff provide round-the-clock monitoring and responsive bedside care.",
    "Research partnerships with leading academic institutions keep our clinical practice at the forefront.",
    "Patient education programs empower individuals to make informed decisions about their health.",
    "Rigorous infection control protocols and safety checklists protect patients and staff alike.",
    "Rehabilitation services are tailored to each patient's recovery goals and lifestyle needs.",
    "Mental health integration within primary care reduces stigma and improves access to support.",
    "Our community outreach programs bring preventive screenings to underserved populations.",
    "Transparent pricing and financial counseling help patients navigate the cost of care with confidence.",
  ],
  finance: [
    "Strategic financial planning designed to help you achieve long-term goals with discipline and clarity.",
    "Our fiduciary advisors provide objective guidance free from commission-driven product incentives.",
    "Diversified portfolio construction across asset classes reduces risk while preserving growth potential.",
    "Tax-efficient investment strategies compound wealth faster by minimizing drag on returns.",
    "Retirement income planning ensures sustainable withdrawals that outlast even long retirements.",
    "Estate planning integration protects accumulated wealth and ensures a smooth transfer to heirs.",
    "Regular portfolio rebalancing maintains target allocations through market cycles and volatility.",
    "Alternative investments including private equity and real assets provide valuable diversification.",
    "Our proprietary risk assessment framework aligns investment strategy with your unique risk tolerance.",
    "Fee transparency and annual reporting keep you fully informed about your investment performance.",
    "Cash flow analysis and budgeting tools provide a clear picture of your current financial health.",
    "Insurance planning addresses longevity, health, and liability risks that can derail financial goals.",
    "Our global custody relationships provide access to a broad universe of investment opportunities.",
    "Behavioral coaching helps clients avoid emotional decisions during periods of market turbulence.",
    "Philanthropic planning strategies maximize charitable impact while delivering meaningful tax benefits.",
  ],
};

const HEADING_POOL: Record<string, string[]> = {
  general: ["Our Approach","Why It Matters","What We Deliver","Our Commitment","How We Work","The Process","Key Principles","Our Mission"],
  tech: ["System Architecture","Performance at Scale","Security & Compliance","Developer Experience","Infrastructure","API Design","Data Pipeline","Observability"],
  business: ["Market Opportunity","Strategic Priorities","Execution Framework","Key Metrics","Team & Culture","Partnerships","Financial Overview","Roadmap"],
  food: ["Seasonal Menu","Our Ingredients","The Kitchen","Culinary Philosophy","Signature Dishes","Pairings","The Team","Special Menus"],
  travel: ["The Destination","Your Itinerary","Getting There","Accommodation","Local Experiences","Food & Culture","Practical Details","Why Travel With Us"],
  fashion: ["The Collection","Materials & Craft","Sustainability","Sizing & Fit","Care Guide","Design Philosophy","Collaborations","Season Notes"],
  healthcare: ["Our Services","Care Philosophy","Clinical Team","Patient Resources","Facilities","Research & Innovation","Insurance & Billing","Contact & Hours"],
  finance: ["Investment Philosophy","Portfolio Strategy","Risk Management","Fee Structure","Our Advisors","Reporting","Tax Planning","Getting Started"],
};

// ─── Generation functions ─────────────────────────────────────────────────────

type TextType = "lorem" | "realistic";
type OutputFormat = "plain" | "html" | "markdown" | "json";
type QuantityUnit = "paragraphs" | "sentences" | "words";

function generateRealistic(theme: string, numParagraphs: number, withHeadings: boolean): string[] {
  const pool = [...(THEMES[theme] || THEMES.general)];
  const headings = shuffle([...(HEADING_POOL[theme] || HEADING_POOL.general)]);
  const paragraphs: string[] = [];

  for (let p = 0; p < numParagraphs; p++) {
    const sentCount = 3 + Math.floor(rand() * 3);
    const shuffled = shuffle(pool);
    const para = shuffled.slice(0, sentCount).join(" ");
    paragraphs.push(para);
  }

  if (!withHeadings) return paragraphs;
  return paragraphs.map((p, i) => (headings[i % headings.length] ? `__H__${headings[i % headings.length]}\n${p}` : p));
}

function generateLorem(numParagraphs: number, startWithLorem: boolean, withHeadings: boolean): string[] {
  const headings = shuffle([...HEADING_POOL.general]);
  const paragraphs: string[] = [];
  for (let i = 0; i < numParagraphs; i++) {
    let para = loremParagraph();
    if (i === 0 && startWithLorem) {
      para = LOREM_START + " " + loremParagraph(2).split(". ").slice(1).join(". ");
    }
    paragraphs.push(para);
  }
  if (!withHeadings) return paragraphs;
  return paragraphs.map((p, i) => (headings[i % headings.length] ? `__H__${headings[i % headings.length]}\n${p}` : p));
}

function wordsToParas(words: number): number { return Math.max(1, Math.ceil(words / 80)); }
function sentencesToParas(sentences: number): number { return Math.max(1, Math.ceil(sentences / 4)); }

function formatOutput(paragraphs: string[], format: OutputFormat): string {
  // Strip heading markers
  const parts = paragraphs.map(p => {
    const hMatch = p.match(/^__H__(.+)\n([\s\S]+)/);
    if (hMatch) return { heading: hMatch[1], body: hMatch[2] };
    return { heading: null, body: p };
  });

  switch (format) {
    case "html":
      return parts.map(({ heading, body }) =>
        (heading ? `<h2>${heading}</h2>\n` : "") + `<p>${body}</p>`
      ).join("\n\n");

    case "markdown":
      return parts.map(({ heading, body }) =>
        (heading ? `## ${heading}\n\n` : "") + body
      ).join("\n\n");

    case "json": {
      const obj: Record<string, unknown> = {
        paragraphs: parts.map(p => p.body),
        word_count: parts.reduce((n, p) => n + p.body.split(/\s+/).length, 0),
      };
      if (parts.some(p => p.heading)) obj.headings = parts.map(p => p.heading ?? null);
      return JSON.stringify(obj, null, 2);
    }

    default: // plain
      return parts.map(({ heading, body }) =>
        (heading ? `${heading.toUpperCase()}\n\n` : "") + body
      ).join("\n\n");
  }
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function stats(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const sentences = (text.match(/[.!?]+/g) ?? []).length;
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
  return { words, chars, sentences, paragraphs };
}

// ─── Main component ───────────────────────────────────────────────────────────

const THEMES_LIST = [
  { id: "general", label: "General" },
  { id: "tech", label: "Technology" },
  { id: "business", label: "Business" },
  { id: "food", label: "Food" },
  { id: "travel", label: "Travel" },
  { id: "fashion", label: "Fashion" },
  { id: "healthcare", label: "Healthcare" },
  { id: "finance", label: "Finance" },
];

export function LoremIpsumGenerator() {
  const [type, setType] = useState<TextType>("lorem");
  const [theme, setTheme] = useState("general");
  const [quantity, setQuantity] = useState(3);
  const [unit, setUnit] = useState<QuantityUnit>("paragraphs");
  const [format, setFormat] = useState<OutputFormat>("plain");
  const [withHeadings, setWithHeadings] = useState(false);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    _seed = Date.now();
    let numParagraphs = unit === "paragraphs" ? quantity : unit === "sentences" ? sentencesToParas(quantity) : wordsToParas(quantity);
    numParagraphs = Math.max(1, Math.min(30, numParagraphs));

    const paragraphs = type === "lorem"
      ? generateLorem(numParagraphs, startWithLorem, withHeadings)
      : generateRealistic(theme, numParagraphs, withHeadings);

    setOutput(formatOutput(paragraphs, format));
  }, [type, theme, quantity, unit, format, withHeadings, startWithLorem]);

  // Generate on first render
  useState(() => { generate(); });

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const s = stats(output);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">

      {/* Controls */}
      <div className="glass-panel rounded-2xl p-4 space-y-4">

        {/* Type row */}
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-20 shrink-0">Type</span>
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {([
              { id: "lorem" as TextType, label: "Lorem Ipsum" },
              { id: "realistic" as TextType, label: "Realistic" },
            ]).map(t => (
              <button key={t.id} type="button" data-testid={`type-${t.id}`}
                onClick={() => setType(t.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  type === t.id ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                )}>{t.label}</button>
            ))}
          </div>
          {type === "lorem" && (
            <label className="flex items-center gap-2 cursor-pointer ml-2">
              <input type="checkbox" checked={startWithLorem} onChange={e => setStartWithLorem(e.target.checked)}
                className="w-3.5 h-3.5 accent-purple-600" />
              <span className="text-xs text-slate-500 font-semibold">Start with "Lorem ipsum…"</span>
            </label>
          )}
        </div>

        {/* Theme row (realistic only) */}
        {type === "realistic" && (
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-20 shrink-0">Theme</span>
            <div className="flex flex-wrap gap-1.5">
              {THEMES_LIST.map(t => (
                <button key={t.id} type="button" data-testid={`theme-${t.id}`}
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl border text-xs font-bold transition-all",
                    theme === t.id
                      ? "bg-purple-600 border-purple-600 text-white shadow-sm shadow-purple-500/20"
                      : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-purple-300"
                  )}>{t.label}</button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity row */}
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-20 shrink-0">Amount</span>
          <div className="flex items-center gap-2">
            <input type="number" min={1} max={unit === "words" ? 5000 : unit === "sentences" ? 200 : 30}
              value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              data-testid="input-quantity"
              className="w-20 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-purple-400 text-center tabular-nums" />
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {(["paragraphs", "sentences", "words"] as QuantityUnit[]).map(u => (
                <button key={u} type="button" data-testid={`unit-${u}`}
                  onClick={() => setUnit(u)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all",
                    unit === u ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  )}>{u}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Format + headings row */}
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-20 shrink-0">Format</span>
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {(["plain", "html", "markdown", "json"] as OutputFormat[]).map(f => (
              <button key={f} type="button" data-testid={`format-${f}`}
                onClick={() => setFormat(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all",
                  format === f ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                )}>{f === "plain" ? "Plain Text" : f.toUpperCase()}</button>
            ))}
          </div>
          {format !== "json" && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={withHeadings} onChange={e => setWithHeadings(e.target.checked)}
                className="w-3.5 h-3.5 accent-purple-600" />
              <span className="text-xs text-slate-500 font-semibold">Include headings</span>
            </label>
          )}
        </div>

        {/* Generate button */}
        <div className="flex justify-end">
          <button type="button" onClick={generate}
            data-testid="button-generate"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-black shadow-sm shadow-purple-500/20 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Generate
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Words", value: s.words.toLocaleString(), color: "text-slate-700 dark:text-slate-200" },
          { label: "Characters", value: s.chars.toLocaleString(), color: "text-slate-700 dark:text-slate-200" },
          { label: "Sentences", value: s.sentences.toLocaleString(), color: "text-slate-700 dark:text-slate-200" },
          { label: "Paragraphs", value: s.paragraphs.toLocaleString(), color: "text-slate-700 dark:text-slate-200" },
        ].map(st => (
          <div key={st.label} className="glass-panel rounded-xl p-3 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{st.label}</p>
            <p className={cn("text-xl font-black mt-0.5 tabular-nums", st.color)}>{st.value}</p>
          </div>
        ))}
      </div>

      {/* Output */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Output</p>
          <button type="button" onClick={copy} data-testid="button-copy"
            className={cn("flex items-center gap-1.5 text-xs font-semibold transition-colors", copied ? "text-green-500" : "text-slate-400 hover:text-purple-600")}>
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy all"}
          </button>
          <InlineShareButtons />
        </div>
        <textarea
          readOnly
          value={output}
          data-testid="output-text"
          rows={14}
          className={cn(
            "w-full bg-transparent px-4 py-4 text-sm outline-none resize-none leading-relaxed text-slate-700 dark:text-slate-200",
            format === "plain" ? "font-sans" : "font-mono"
          )}
        />
      </div>
    </div>
  );
}
