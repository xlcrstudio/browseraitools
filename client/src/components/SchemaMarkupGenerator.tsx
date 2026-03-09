import { useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2, AlertTriangle, Copy, CheckCircle2,
  RotateCcw, RefreshCw, ShieldCheck, Code,
  HelpCircle, FileText, ShoppingBag, UtensilsCrossed,
  ListChecks, Building2, MapPin, Video,
  Calendar, Briefcase, GraduationCap, ChevronRight,
  ChevronDown, Plus, Trash2, Download
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import {
  useSchemaMarkupStorage,
  type SchemaMarkup,
} from "@/hooks/use-schema-markup-storage";

const SCHEMA_TYPES = [
  { value: "FAQPage", label: "FAQPage", icon: HelpCircle },
  { value: "Article", label: "Article", icon: FileText },
  { value: "Product", label: "Product", icon: ShoppingBag },
  { value: "Recipe", label: "Recipe", icon: UtensilsCrossed },
  { value: "HowTo", label: "HowTo", icon: ListChecks },
  { value: "Organization", label: "Organization", icon: Building2 },
  { value: "LocalBusiness", label: "LocalBusiness", icon: MapPin },
  { value: "VideoObject", label: "VideoObject", icon: Video },
  { value: "Event", label: "Event", icon: Calendar },
  { value: "JobPosting", label: "JobPosting", icon: Briefcase },
  { value: "Course", label: "Course", icon: GraduationCap },
  { value: "BreadcrumbList", label: "BreadcrumbList", icon: ChevronRight },
];

const CURRENCY_OPTIONS = ["USD", "EUR", "GBP"];
const AVAILABILITY_OPTIONS = [
  { value: "https://schema.org/InStock", label: "InStock" },
  { value: "https://schema.org/OutOfStock", label: "OutOfStock" },
  { value: "https://schema.org/PreOrder", label: "PreOrder" },
];
const EMPLOYMENT_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "TEMPORARY", "INTERN"];

const MAX_TITLE_CHARS = 200;
const MAX_URL_CHARS = 500;
const MAX_DESC_CHARS = 1000;

const DESCRIPTION_PLACEHOLDERS: Record<string, string> = {
  FAQPage: "Brief description of the FAQ page topic...",
  Article: "Article summary or meta description...",
  Product: "Product description for schema markup...",
  Recipe: "Brief description of the recipe...",
  HowTo: "What this how-to guide teaches...",
  Organization: "Description of the organization...",
  LocalBusiness: "Description of the business...",
  VideoObject: "Description of the video content...",
  Event: "Description of the event...",
  JobPosting: "Job description summary...",
  Course: "Course description and learning outcomes...",
  BreadcrumbList: "Description of the page navigation...",
};

const SYSTEM_PROMPT = `You are an expert in Schema.org structured data and JSON-LD markup. Generate valid, Google-compliant JSON-LD schema markup. Always output valid JSON that can be parsed by JSON.parse(). Follow Google's structured data guidelines strictly. Do not include comments in JSON output.`;

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface HowToStep {
  id: string;
  name: string;
  text: string;
}

interface BreadcrumbItem {
  id: string;
  name: string;
  url: string;
}

export function SchemaMarkupGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveMarkup } = useSchemaMarkupStorage();

  const [pageTitle, setPageTitle] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [schemaType, setSchemaType] = useState("");
  const [description, setDescription] = useState("");

  const [faqItems, setFaqItems] = useState<FAQItem[]>([{ id: generateId(), question: "", answer: "" }]);
  const [articleAuthor, setArticleAuthor] = useState("");
  const [articlePublishDate, setArticlePublishDate] = useState("");
  const [articleImageUrl, setArticleImageUrl] = useState("");

  const [productPrice, setProductPrice] = useState("");
  const [productCurrency, setProductCurrency] = useState("USD");
  const [productRating, setProductRating] = useState("");
  const [productAvailability, setProductAvailability] = useState(AVAILABILITY_OPTIONS[0].value);

  const [recipePrepTime, setRecipePrepTime] = useState("");
  const [recipeCookTime, setRecipeCookTime] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState("");

  const [howToSteps, setHowToSteps] = useState<HowToStep[]>([{ id: generateId(), name: "", text: "" }]);

  const [orgLogoUrl, setOrgLogoUrl] = useState("");
  const [orgFoundingDate, setOrgFoundingDate] = useState("");
  const [orgContactEmail, setOrgContactEmail] = useState("");

  const [localAddress, setLocalAddress] = useState("");
  const [localPhone, setLocalPhone] = useState("");
  const [localHours, setLocalHours] = useState("");
  const [localLat, setLocalLat] = useState("");
  const [localLng, setLocalLng] = useState("");

  const [videoUrl, setVideoUrl] = useState("");
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [videoUploadDate, setVideoUploadDate] = useState("");

  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventTicketUrl, setEventTicketUrl] = useState("");
  const [eventPerformer, setEventPerformer] = useState("");

  const [jobCompany, setJobCompany] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobSalaryRange, setJobSalaryRange] = useState("");
  const [jobEmploymentType, setJobEmploymentType] = useState("FULL_TIME");

  const [courseProvider, setCourseProvider] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [courseCost, setCourseCost] = useState("");

  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([{ id: generateId(), name: "", url: "" }]);

  const [includeBreadcrumbs, setIncludeBreadcrumbs] = useState(false);
  const [addImageSchema, setAddImageSchema] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentMarkup, setCurrentMarkup] = useState<SchemaMarkup | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState("");
  const [jsonValid, setJsonValid] = useState<boolean | null>(null);
  const [prettyJson, setPrettyJson] = useState("");

  const addFaqItem = () => setFaqItems((prev) => [...prev, { id: generateId(), question: "", answer: "" }]);
  const removeFaqItem = (id: string) => setFaqItems((prev) => prev.length > 1 ? prev.filter((f) => f.id !== id) : prev);
  const updateFaqItem = (id: string, field: "question" | "answer", value: string) =>
    setFaqItems((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));

  const addHowToStep = () => setHowToSteps((prev) => [...prev, { id: generateId(), name: "", text: "" }]);
  const removeHowToStep = (id: string) => setHowToSteps((prev) => prev.length > 1 ? prev.filter((s) => s.id !== id) : prev);
  const updateHowToStep = (id: string, field: "name" | "text", value: string) =>
    setHowToSteps((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));

  const addBreadcrumbItem = () => setBreadcrumbItems((prev) => [...prev, { id: generateId(), name: "", url: "" }]);
  const removeBreadcrumbItem = (id: string) => setBreadcrumbItems((prev) => prev.length > 1 ? prev.filter((b) => b.id !== id) : prev);
  const updateBreadcrumbItem = (id: string, field: "name" | "url", value: string) =>
    setBreadcrumbItems((prev) => prev.map((b) => (b.id === id ? { ...b, [field]: value } : b)));

  const buildDynamicFieldsString = (): string => {
    const parts: string[] = [];
    switch (schemaType) {
      case "FAQPage":
        faqItems.forEach((f, i) => {
          parts.push(`Q${i + 1}: ${f.question}\nA${i + 1}: ${f.answer}`);
        });
        break;
      case "Article":
        if (articleAuthor) parts.push(`Author: ${articleAuthor}`);
        if (articlePublishDate) parts.push(`Publish Date: ${articlePublishDate}`);
        if (articleImageUrl) parts.push(`Image URL: ${articleImageUrl}`);
        break;
      case "Product":
        if (productPrice) parts.push(`Price: ${productPrice} ${productCurrency}`);
        if (productRating) parts.push(`Rating: ${productRating}/5`);
        parts.push(`Availability: ${AVAILABILITY_OPTIONS.find((a) => a.value === productAvailability)?.label || productAvailability}`);
        break;
      case "Recipe":
        if (recipePrepTime) parts.push(`Prep Time: ${recipePrepTime}`);
        if (recipeCookTime) parts.push(`Cook Time: ${recipeCookTime}`);
        if (recipeIngredients) parts.push(`Ingredients:\n${recipeIngredients}`);
        break;
      case "HowTo":
        howToSteps.forEach((s, i) => {
          parts.push(`Step ${i + 1}: ${s.name}\n${s.text}`);
        });
        break;
      case "Organization":
        if (orgLogoUrl) parts.push(`Logo URL: ${orgLogoUrl}`);
        if (orgFoundingDate) parts.push(`Founding Date: ${orgFoundingDate}`);
        if (orgContactEmail) parts.push(`Contact Email: ${orgContactEmail}`);
        break;
      case "LocalBusiness":
        if (localAddress) parts.push(`Address: ${localAddress}`);
        if (localPhone) parts.push(`Phone: ${localPhone}`);
        if (localHours) parts.push(`Hours: ${localHours}`);
        if (localLat && localLng) parts.push(`Coordinates: ${localLat}, ${localLng}`);
        break;
      case "VideoObject":
        if (videoUrl) parts.push(`Video URL: ${videoUrl}`);
        if (videoThumbnailUrl) parts.push(`Thumbnail URL: ${videoThumbnailUrl}`);
        if (videoDuration) parts.push(`Duration: ${videoDuration}`);
        if (videoUploadDate) parts.push(`Upload Date: ${videoUploadDate}`);
        break;
      case "Event":
        if (eventDate) parts.push(`Event Date: ${eventDate}`);
        if (eventLocation) parts.push(`Location: ${eventLocation}`);
        if (eventTicketUrl) parts.push(`Ticket URL: ${eventTicketUrl}`);
        if (eventPerformer) parts.push(`Performer: ${eventPerformer}`);
        break;
      case "JobPosting":
        if (jobCompany) parts.push(`Company: ${jobCompany}`);
        if (jobLocation) parts.push(`Location: ${jobLocation}`);
        if (jobSalaryRange) parts.push(`Salary: ${jobSalaryRange}`);
        parts.push(`Employment Type: ${jobEmploymentType}`);
        break;
      case "Course":
        if (courseProvider) parts.push(`Provider: ${courseProvider}`);
        if (courseDuration) parts.push(`Duration: ${courseDuration}`);
        if (courseCost) parts.push(`Cost: ${courseCost}`);
        break;
      case "BreadcrumbList":
        breadcrumbItems.forEach((b, i) => {
          parts.push(`${i + 1}. ${b.name} — ${b.url}`);
        });
        break;
    }
    return parts.join("\n");
  };

  const handleReset = () => {
    setPageTitle("");
    setPageUrl("");
    setSchemaType("");
    setDescription("");
    setFaqItems([{ id: generateId(), question: "", answer: "" }]);
    setArticleAuthor(""); setArticlePublishDate(""); setArticleImageUrl("");
    setProductPrice(""); setProductCurrency("USD"); setProductRating(""); setProductAvailability(AVAILABILITY_OPTIONS[0].value);
    setRecipePrepTime(""); setRecipeCookTime(""); setRecipeIngredients("");
    setHowToSteps([{ id: generateId(), name: "", text: "" }]);
    setOrgLogoUrl(""); setOrgFoundingDate(""); setOrgContactEmail("");
    setLocalAddress(""); setLocalPhone(""); setLocalHours(""); setLocalLat(""); setLocalLng("");
    setVideoUrl(""); setVideoThumbnailUrl(""); setVideoDuration(""); setVideoUploadDate("");
    setEventDate(""); setEventLocation(""); setEventTicketUrl(""); setEventPerformer("");
    setJobCompany(""); setJobLocation(""); setJobSalaryRange(""); setJobEmploymentType("FULL_TIME");
    setCourseProvider(""); setCourseDuration(""); setCourseCost("");
    setBreadcrumbItems([{ id: generateId(), name: "", url: "" }]);
    setIncludeBreadcrumbs(false); setAddImageSchema(false); setAdvancedOpen(false);
    setStreamingText(""); setCurrentMarkup(null); setCopiedId(null);
    setGenerationProgress(""); setJsonValid(null); setPrettyJson("");
  };

  const copyToClipboard = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (id) { setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); }
    } catch {}
  };

  const downloadJson = (json: string, filename: string) => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateSection = async (sectionPrompt: string, maxTokens: number, temperature: number): Promise<string> => {
    const result = await generateRaw({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: sectionPrompt },
      ],
      temperature,
      maxTokens,
      onChunk: () => {},
    });
    return result || "";
  };

  const handleGenerate = async () => {
    if (!pageTitle.trim() || !schemaType) return;

    setIsGenerating(true);
    setStreamingText("");
    setCurrentMarkup(null);
    setGenerationProgress("");
    setJsonValid(null);
    setPrettyJson("");

    const dynamicFields = buildDynamicFieldsString();
    let allRawText = "";
    let jsonLdOutput = "";
    let implementationGuide = "";

    try {
      setGenerationProgress("Generating schema... (1/2)");
      setStreamingText("--- Generating JSON-LD schema... ---");

      const advancedNotes: string[] = [];
      if (includeBreadcrumbs && schemaType !== "BreadcrumbList") advancedNotes.push("Include a BreadcrumbList schema alongside the main schema.");
      if (addImageSchema) advancedNotes.push("Include ImageObject schema for any images referenced.");

      const schemaPrompt = `Generate valid JSON-LD schema markup for a ${schemaType} schema.

Page Title: ${pageTitle}
${pageUrl ? `Page URL: ${pageUrl}` : ""}
Schema Type: ${schemaType}
${description ? `Description: ${description}` : ""}

Dynamic Fields:
${dynamicFields || "No additional fields provided."}

${advancedNotes.length > 0 ? `Additional requirements:\n${advancedNotes.join("\n")}` : ""}

Output ONLY valid JSON-LD (starting with { and ending with }). Include @context and @type. Follow Google's structured data guidelines. Do not include any text before or after the JSON.`;

      const schemaResult = await generateSection(schemaPrompt, 800, 0.3);
      jsonLdOutput = schemaResult.trim();

      let extracted = jsonLdOutput;
      const jsonMatch = jsonLdOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extracted = jsonMatch[0];
      }

      try {
        const parsed = JSON.parse(extracted);
        setPrettyJson(JSON.stringify(parsed, null, 2));
        setJsonValid(true);
        jsonLdOutput = JSON.stringify(parsed, null, 2);
      } catch {
        setPrettyJson(extracted);
        setJsonValid(false);
      }

      allRawText = `JSON-LD SCHEMA:\n${jsonLdOutput}`;
      setStreamingText(allRawText);

      setGenerationProgress("Creating implementation guide... (2/2)");
      setStreamingText(allRawText + "\n\n--- Creating implementation guide... ---");

      const guidePrompt = `Based on the following ${schemaType} JSON-LD schema, provide an implementation guide:

${jsonLdOutput.slice(0, 600)}

Include:
1. How to add this schema to your website (where to place the script tag)
2. Rich results eligibility for this schema type
3. Suggested additional schema types that complement ${schemaType}
4. Testing instructions (Google Rich Results Test, Schema Markup Validator)

Be concise and actionable.`;

      const guideResult = await generateSection(guidePrompt, 500, 0.6);
      implementationGuide = guideResult.trim();
      allRawText += `\n\nIMPLEMENTATION GUIDE:\n${implementationGuide}`;
      setStreamingText(allRawText);

      const markup: SchemaMarkup = {
        id: generateId(),
        pageTitle,
        pageUrl,
        schemaType,
        description,
        dynamicFields,
        jsonLdOutput,
        implementationGuide,
        rawText: allRawText.trim(),
        createdAt: new Date().toISOString(),
      };
      setCurrentMarkup(markup);
      saveMarkup(markup);
    } catch (err) {
      console.error("Generation error:", err);
      if (jsonLdOutput) {
        const partial: SchemaMarkup = {
          id: generateId(),
          pageTitle,
          pageUrl,
          schemaType,
          description,
          dynamicFields,
          jsonLdOutput,
          implementationGuide,
          rawText: allRawText.trim(),
          createdAt: new Date().toISOString(),
        };
        setCurrentMarkup(partial);
        saveMarkup(partial);
      }
    }
    setIsGenerating(false);
    setGenerationProgress("");
  };

  const canGenerate =
    state === "ready" &&
    pageTitle.trim().length > 0 &&
    schemaType.length > 0 &&
    !isGenerating;

  const hasOutput = currentMarkup && (currentMarkup.jsonLdOutput || currentMarkup.rawText);

  const scriptTag = prettyJson ? `<script type="application/ld+json">\n${prettyJson}\n</script>` : "";

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-schema-markup-generator">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="page-title-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Page Title * <span className="font-normal text-slate-400">(required)</span>
            </label>
            <input
              id="page-title-input"
              data-testid="input-page-title"
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value.slice(0, MAX_TITLE_CHARS))}
              placeholder="e.g., Best Running Shoes 2026 - Complete Guide"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
            <span data-testid="text-page-title-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {pageTitle.length}/{MAX_TITLE_CHARS}
            </span>
          </div>

          <div>
            <label htmlFor="page-url-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Page URL <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="page-url-input"
              data-testid="input-page-url"
              type="text"
              value={pageUrl}
              onChange={(e) => setPageUrl(e.target.value.slice(0, MAX_URL_CHARS))}
              placeholder="https://yoursite.com/page"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            />
            <span data-testid="text-page-url-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {pageUrl.length}/{MAX_URL_CHARS}
            </span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Schema Type * <span className="font-normal text-slate-400">(select one)</span></label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" data-testid="container-schema-types">
              {SCHEMA_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    data-testid={`button-schema-${type.value}`}
                    onClick={() => setSchemaType(type.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 px-3 py-4 rounded-xl text-sm font-medium border transition-all text-center",
                      schemaType === type.value
                        ? "bg-emerald-100 text-emerald-700 border-emerald-300 ring-1 ring-emerald-200"
                        : "bg-white text-slate-600 border-slate-200 hover:border-emerald-200"
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="text-xs">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {schemaType && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4"
              data-testid="container-dynamic-fields"
            >
              {schemaType === "FAQPage" && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">FAQ Items * <span className="font-normal text-slate-400">(min 1)</span></label>
                  {faqItems.map((item, idx) => (
                    <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/30 space-y-2" data-testid={`container-faq-item-${idx}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-500">Q{idx + 1}</span>
                        {faqItems.length > 1 && (
                          <button data-testid={`button-remove-faq-${idx}`} onClick={() => removeFaqItem(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <input
                        data-testid={`input-faq-question-${idx}`}
                        type="text"
                        value={item.question}
                        onChange={(e) => updateFaqItem(item.id, "question", e.target.value)}
                        placeholder="Enter question..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all text-sm"
                      />
                      <textarea
                        data-testid={`input-faq-answer-${idx}`}
                        value={item.answer}
                        onChange={(e) => updateFaqItem(item.id, "answer", e.target.value)}
                        placeholder="Enter answer..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all text-sm resize-y"
                      />
                    </div>
                  ))}
                  <button data-testid="button-add-faq" onClick={addFaqItem} className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
                    <Plus className="w-4 h-4" /> Add Question
                  </button>
                </div>
              )}

              {schemaType === "Article" && (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="article-author" className="block text-sm font-semibold text-slate-700 mb-1.5">Author</label>
                    <input id="article-author" data-testid="input-article-author" type="text" value={articleAuthor} onChange={(e) => setArticleAuthor(e.target.value)} placeholder="Author name" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                  </div>
                  <div>
                    <label htmlFor="article-date" className="block text-sm font-semibold text-slate-700 mb-1.5">Publish Date</label>
                    <input id="article-date" data-testid="input-article-date" type="date" value={articlePublishDate} onChange={(e) => setArticlePublishDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                  </div>
                  <div>
                    <label htmlFor="article-image" className="block text-sm font-semibold text-slate-700 mb-1.5">Image URL</label>
                    <input id="article-image" data-testid="input-article-image" type="text" value={articleImageUrl} onChange={(e) => setArticleImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                  </div>
                </div>
              )}

              {schemaType === "Product" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="product-price" className="block text-sm font-semibold text-slate-700 mb-1.5">Price</label>
                      <input id="product-price" data-testid="input-product-price" type="text" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} placeholder="29.99" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                    </div>
                    <div>
                      <label htmlFor="product-currency" className="block text-sm font-semibold text-slate-700 mb-1.5">Currency</label>
                      <select id="product-currency" data-testid="select-product-currency" value={productCurrency} onChange={(e) => setProductCurrency(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all">
                        {CURRENCY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="product-rating" className="block text-sm font-semibold text-slate-700 mb-1.5">Rating (1-5)</label>
                      <input id="product-rating" data-testid="input-product-rating" type="number" min={1} max={5} step={0.1} value={productRating} onChange={(e) => setProductRating(e.target.value)} placeholder="4.5" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                    </div>
                    <div>
                      <label htmlFor="product-availability" className="block text-sm font-semibold text-slate-700 mb-1.5">Availability</label>
                      <select id="product-availability" data-testid="select-product-availability" value={productAvailability} onChange={(e) => setProductAvailability(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all">
                        {AVAILABILITY_OPTIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {schemaType === "Recipe" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="recipe-prep" className="block text-sm font-semibold text-slate-700 mb-1.5">Prep Time</label>
                      <input id="recipe-prep" data-testid="input-recipe-prep" type="text" value={recipePrepTime} onChange={(e) => setRecipePrepTime(e.target.value)} placeholder="e.g., 15 minutes" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                    </div>
                    <div>
                      <label htmlFor="recipe-cook" className="block text-sm font-semibold text-slate-700 mb-1.5">Cook Time</label>
                      <input id="recipe-cook" data-testid="input-recipe-cook" type="text" value={recipeCookTime} onChange={(e) => setRecipeCookTime(e.target.value)} placeholder="e.g., 30 minutes" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="recipe-ingredients" className="block text-sm font-semibold text-slate-700 mb-1.5">Ingredients <span className="font-normal text-slate-400">(one per line)</span></label>
                    <textarea id="recipe-ingredients" data-testid="input-recipe-ingredients" value={recipeIngredients} onChange={(e) => setRecipeIngredients(e.target.value)} placeholder={"2 cups flour\n1 cup sugar\n3 eggs\n1 cup milk"} rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-y" />
                  </div>
                </div>
              )}

              {schemaType === "HowTo" && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">Steps * <span className="font-normal text-slate-400">(min 1)</span></label>
                  {howToSteps.map((step, idx) => (
                    <div key={step.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/30 space-y-2" data-testid={`container-howto-step-${idx}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-500">Step {idx + 1}</span>
                        {howToSteps.length > 1 && (
                          <button data-testid={`button-remove-step-${idx}`} onClick={() => removeHowToStep(step.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <input data-testid={`input-step-name-${idx}`} type="text" value={step.name} onChange={(e) => updateHowToStep(step.id, "name", e.target.value)} placeholder="Step name..." className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all text-sm" />
                      <textarea data-testid={`input-step-text-${idx}`} value={step.text} onChange={(e) => updateHowToStep(step.id, "text", e.target.value)} placeholder="Step instructions..." rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all text-sm resize-y" />
                    </div>
                  ))}
                  <button data-testid="button-add-step" onClick={addHowToStep} className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
                    <Plus className="w-4 h-4" /> Add Step
                  </button>
                </div>
              )}

              {schemaType === "Organization" && (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="org-logo" className="block text-sm font-semibold text-slate-700 mb-1.5">Logo URL</label>
                    <input id="org-logo" data-testid="input-org-logo" type="text" value={orgLogoUrl} onChange={(e) => setOrgLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                  </div>
                  <div>
                    <label htmlFor="org-founding" className="block text-sm font-semibold text-slate-700 mb-1.5">Founding Date</label>
                    <input id="org-founding" data-testid="input-org-founding" type="date" value={orgFoundingDate} onChange={(e) => setOrgFoundingDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                  </div>
                  <div>
                    <label htmlFor="org-email" className="block text-sm font-semibold text-slate-700 mb-1.5">Contact Email</label>
                    <input id="org-email" data-testid="input-org-email" type="email" value={orgContactEmail} onChange={(e) => setOrgContactEmail(e.target.value)} placeholder="info@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                  </div>
                </div>
              )}

              {schemaType === "LocalBusiness" && (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="local-address" className="block text-sm font-semibold text-slate-700 mb-1.5">Address</label>
                    <textarea id="local-address" data-testid="input-local-address" value={localAddress} onChange={(e) => setLocalAddress(e.target.value)} placeholder="123 Main St, City, State, ZIP" rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-y" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="local-phone" className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
                      <input id="local-phone" data-testid="input-local-phone" type="text" value={localPhone} onChange={(e) => setLocalPhone(e.target.value)} placeholder="+1-555-123-4567" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                    </div>
                    <div>
                      <label htmlFor="local-hours" className="block text-sm font-semibold text-slate-700 mb-1.5">Hours</label>
                      <input id="local-hours" data-testid="input-local-hours" type="text" value={localHours} onChange={(e) => setLocalHours(e.target.value)} placeholder="Mon-Fri 9am-5pm" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="local-lat" className="block text-sm font-semibold text-slate-700 mb-1.5">Latitude <span className="font-normal text-slate-400">(optional)</span></label>
                      <input id="local-lat" data-testid="input-local-lat" type="text" value={localLat} onChange={(e) => setLocalLat(e.target.value)} placeholder="40.7128" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                    </div>
                    <div>
                      <label htmlFor="local-lng" className="block text-sm font-semibold text-slate-700 mb-1.5">Longitude <span className="font-normal text-slate-400">(optional)</span></label>
                      <input id="local-lng" data-testid="input-local-lng" type="text" value={localLng} onChange={(e) => setLocalLng(e.target.value)} placeholder="-74.0060" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                    </div>
                  </div>
                </div>
              )}

              {schemaType === "VideoObject" && (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="video-url" className="block text-sm font-semibold text-slate-700 mb-1.5">Video URL</label>
                    <input id="video-url" data-testid="input-video-url" type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                  </div>
                  <div>
                    <label htmlFor="video-thumb" className="block text-sm font-semibold text-slate-700 mb-1.5">Thumbnail URL</label>
                    <input id="video-thumb" data-testid="input-video-thumbnail" type="text" value={videoThumbnailUrl} onChange={(e) => setVideoThumbnailUrl(e.target.value)} placeholder="https://example.com/thumbnail.jpg" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="video-duration" className="block text-sm font-semibold text-slate-700 mb-1.5">Duration</label>
                      <input id="video-duration" data-testid="input-video-duration" type="text" value={videoDuration} onChange={(e) => setVideoDuration(e.target.value)} placeholder="PT5M30S (ISO 8601)" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                    </div>
                    <div>
                      <label htmlFor="video-upload" className="block text-sm font-semibold text-slate-700 mb-1.5">Upload Date</label>
                      <input id="video-upload" data-testid="input-video-upload-date" type="date" value={videoUploadDate} onChange={(e) => setVideoUploadDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                    </div>
                  </div>
                </div>
              )}

              {schemaType === "Event" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="event-date" className="block text-sm font-semibold text-slate-700 mb-1.5">Event Date</label>
                      <input id="event-date" data-testid="input-event-date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                    </div>
                    <div>
                      <label htmlFor="event-location" className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
                      <input id="event-location" data-testid="input-event-location" type="text" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="Venue name or address" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="event-ticket" className="block text-sm font-semibold text-slate-700 mb-1.5">Ticket URL</label>
                      <input id="event-ticket" data-testid="input-event-ticket" type="text" value={eventTicketUrl} onChange={(e) => setEventTicketUrl(e.target.value)} placeholder="https://tickets.example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                    </div>
                    <div>
                      <label htmlFor="event-performer" className="block text-sm font-semibold text-slate-700 mb-1.5">Performer</label>
                      <input id="event-performer" data-testid="input-event-performer" type="text" value={eventPerformer} onChange={(e) => setEventPerformer(e.target.value)} placeholder="Artist or speaker name" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                    </div>
                  </div>
                </div>
              )}

              {schemaType === "JobPosting" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="job-company" className="block text-sm font-semibold text-slate-700 mb-1.5">Company</label>
                      <input id="job-company" data-testid="input-job-company" type="text" value={jobCompany} onChange={(e) => setJobCompany(e.target.value)} placeholder="Company name" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                    </div>
                    <div>
                      <label htmlFor="job-location" className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
                      <input id="job-location" data-testid="input-job-location" type="text" value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} placeholder="City, State or Remote" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="job-salary" className="block text-sm font-semibold text-slate-700 mb-1.5">Salary Range</label>
                      <input id="job-salary" data-testid="input-job-salary" type="text" value={jobSalaryRange} onChange={(e) => setJobSalaryRange(e.target.value)} placeholder="$50,000 - $80,000" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                    </div>
                    <div>
                      <label htmlFor="job-employment" className="block text-sm font-semibold text-slate-700 mb-1.5">Employment Type</label>
                      <select id="job-employment" data-testid="select-job-employment" value={jobEmploymentType} onChange={(e) => setJobEmploymentType(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all">
                        {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {schemaType === "Course" && (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="course-provider" className="block text-sm font-semibold text-slate-700 mb-1.5">Provider</label>
                    <input id="course-provider" data-testid="input-course-provider" type="text" value={courseProvider} onChange={(e) => setCourseProvider(e.target.value)} placeholder="University or platform name" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="course-duration" className="block text-sm font-semibold text-slate-700 mb-1.5">Duration</label>
                      <input id="course-duration" data-testid="input-course-duration" type="text" value={courseDuration} onChange={(e) => setCourseDuration(e.target.value)} placeholder="e.g., 8 weeks" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                    </div>
                    <div>
                      <label htmlFor="course-cost" className="block text-sm font-semibold text-slate-700 mb-1.5">Cost</label>
                      <input id="course-cost" data-testid="input-course-cost" type="text" value={courseCost} onChange={(e) => setCourseCost(e.target.value)} placeholder="Free or $49.99" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all" />
                    </div>
                  </div>
                </div>
              )}

              {schemaType === "BreadcrumbList" && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">Breadcrumb Items</label>
                  {breadcrumbItems.map((item, idx) => (
                    <div key={item.id} className="flex items-start gap-2" data-testid={`container-breadcrumb-item-${idx}`}>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input data-testid={`input-breadcrumb-name-${idx}`} type="text" value={item.name} onChange={(e) => updateBreadcrumbItem(item.id, "name", e.target.value)} placeholder="Page name" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all text-sm" />
                        <input data-testid={`input-breadcrumb-url-${idx}`} type="text" value={item.url} onChange={(e) => updateBreadcrumbItem(item.id, "url", e.target.value)} placeholder="https://example.com/page" className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all text-sm" />
                      </div>
                      {breadcrumbItems.length > 1 && (
                        <button data-testid={`button-remove-breadcrumb-${idx}`} onClick={() => removeBreadcrumbItem(item.id)} className="mt-1 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button data-testid="button-add-breadcrumb" onClick={addBreadcrumbItem} className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
                    <Plus className="w-4 h-4" /> Add Breadcrumb
                  </button>
                </div>
              )}
            </motion.div>
          )}

          <div>
            <label htmlFor="description-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Description <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="description-input"
              data-testid="input-description"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC_CHARS))}
              placeholder={DESCRIPTION_PLACEHOLDERS[schemaType] || "Add a description for your schema..."}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all resize-y"
            />
            <span data-testid="text-description-char-count" className="text-xs text-slate-400 mt-1 block text-right">
              {description.length}/{MAX_DESC_CHARS}
            </span>
          </div>

          <div>
            <button
              data-testid="button-toggle-advanced"
              onClick={() => setAdvancedOpen(!advancedOpen)}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ChevronDown className={cn("w-4 h-4 transition-transform", advancedOpen && "rotate-180")} />
              Advanced Options
            </button>
            {advancedOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 space-y-3 pl-6"
                data-testid="container-advanced-options"
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    data-testid="toggle-breadcrumbs"
                    type="checkbox"
                    checked={includeBreadcrumbs}
                    onChange={(e) => setIncludeBreadcrumbs(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">Include breadcrumbs schema</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    data-testid="toggle-image-schema"
                    type="checkbox"
                    checked={addImageSchema}
                    onChange={(e) => setAddImageSchema(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700">Add image schema</span>
                </label>
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span data-testid="text-privacy-reminder">Processed 100% locally in your browser — nothing is sent to any server</span>
          </div>

          <div className="flex gap-3">
            <button
              data-testid="button-generate"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={cn(
                "flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all flex items-center justify-center gap-3",
                canGenerate
                  ? "bg-gradient-primary shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0"
                  : "bg-slate-300 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <><Loader2 className="w-5 h-5 animate-spin" />Generating schema...</>
              ) : (
                <><Code className="w-5 h-5" />Generate Schema (Privately)</>
              )}
            </button>
            <button
              data-testid="button-reset"
              onClick={handleReset}
              disabled={isGenerating}
              className="px-4 py-4 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /><span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {isGenerating && streamingText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8"
          data-testid="container-streaming"
        >
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600" data-testid="text-generation-progress">
              {generationProgress || "Generating schema... 100% in-browser"}
            </span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-600 font-mono leading-relaxed" data-testid="text-streaming-output">
            {streamingText}
          </pre>
        </motion.div>
      )}

      {currentMarkup && !isGenerating && hasOutput && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
          data-testid="container-results"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider" data-testid="heading-results">Schema Markup</span>
              <p className="text-sm text-slate-500 mt-0.5" data-testid="text-result-subtitle">
                {schemaType} — {pageTitle}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                data-testid="button-copy-all"
                onClick={() => copyToClipboard(currentMarkup.rawText, "all")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  copiedId === "all" ? "bg-emerald-100 text-emerald-700" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                )}
              >
                {copiedId === "all" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedId === "all" ? "Copied!" : "Copy All"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs" data-testid="container-quick-stats">
            <div data-testid="stat-schema-type" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <Code className="w-3.5 h-3.5" /> {schemaType}
            </div>
            <div data-testid="stat-rich-results" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" /> Rich Results Eligible: Yes
            </div>
            <div data-testid="stat-validation" className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border",
              jsonValid === true ? "bg-emerald-50 border-emerald-200 text-emerald-700" : jsonValid === false ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-slate-50 border-slate-200 text-slate-600"
            )}>
              {jsonValid === true ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              Validation: {jsonValid === true ? "Passed" : jsonValid === false ? "Warning" : "N/A"}
            </div>
            <div data-testid="stat-privacy" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Private
            </div>
          </div>

          {prettyJson && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-json-output">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-json-output">JSON-LD Schema</h3>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    data-testid="button-copy-json"
                    onClick={() => copyToClipboard(prettyJson, "json")}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                      copiedId === "json" ? "bg-emerald-100 text-emerald-700" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    )}
                  >
                    {copiedId === "json" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === "json" ? "Copied" : "Copy JSON"}
                  </button>
                  <button
                    data-testid="button-copy-script"
                    onClick={() => copyToClipboard(scriptTag, "script")}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                      copiedId === "script" ? "bg-emerald-100 text-emerald-700" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                    )}
                  >
                    {copiedId === "script" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === "script" ? "Copied" : "Copy <script> Tag"}
                  </button>
                  <button
                    data-testid="button-download-json"
                    onClick={() => downloadJson(prettyJson, `${schemaType.toLowerCase()}-schema.json`)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-violet-50 text-violet-700 hover:bg-violet-100 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Download .json
                  </button>
                </div>
              </div>
              {jsonValid === false && (
                <div className="mb-3 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2" data-testid="warning-json-invalid">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">The generated JSON could not be validated. Please review and fix any syntax issues before using.</p>
                </div>
              )}
              <div className="rounded-xl bg-slate-900 p-4 overflow-x-auto">
                <pre className="text-sm text-green-400 font-mono leading-relaxed whitespace-pre-wrap" data-testid="text-json-output">
                  {prettyJson}
                </pre>
              </div>
            </div>
          )}

          {currentMarkup.implementationGuide && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-implementation-guide">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <h3 className="text-base font-bold text-slate-800" data-testid="heading-implementation-guide">Implementation Guide</h3>
                </div>
                <button
                  data-testid="button-copy-guide"
                  onClick={() => copyToClipboard(currentMarkup.implementationGuide, "guide")}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all",
                    copiedId === "guide" ? "bg-emerald-100 text-emerald-700" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  )}
                >
                  {copiedId === "guide" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === "guide" ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4">
                <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed" data-testid="text-implementation-guide">
                  {currentMarkup.implementationGuide}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              data-testid="button-regenerate"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-emerald-200 text-emerald-700 font-medium hover:bg-emerald-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Regenerate
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function EngineStatus({ state, progress, error }: { state: string; progress: { text: string; percent: number }; error: string | null }) {
  if (state === "error") {
    return (
      <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3" data-testid="status-error">
        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-700" data-testid="text-error-title">AI Engine Error</p>
          <p className="text-sm text-red-600 mt-1" data-testid="text-error-message">{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200" data-testid="status-loading">
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
        <span className="text-sm font-medium text-emerald-700" data-testid="text-engine-status">
          {state === "checking-gpu" ? "Checking WebGPU support..." : "Loading AI model..."}
        </span>
      </div>
      {state === "downloading" && (
        <div className="w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-primary rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }} />
        </div>
      )}
    </div>
  );
}
