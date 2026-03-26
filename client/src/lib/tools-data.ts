import {
  PenTool, Type, AlignLeft, Maximize2, Minimize2, RefreshCw, Heading, List, FileText, HelpCircle,
  Instagram, Music2, Linkedin, Twitter, Hash, Youtube, FileEdit, User,
  Building2, Rocket, Lightbulb, Target, Presentation, Users,
  Megaphone, Mail, MessageSquare, MousePointerClick, Layout,
  Search, Tag, Key, BookOpen, Link2,
  Briefcase, ScrollText, UserCheck, MessageCircle, ScanSearch,
  ListChecks, ClipboardList, CalendarDays, Flag,
  Scale, ThumbsUp, Swords, ShieldQuestion, Heart, Flame, BookOpenCheck, Sparkles, UtensilsCrossed, MapPin, Code, Terminal, Wand2, Newspaper, Clapperboard, Bot, GraduationCap, ShieldCheck, FileSearch,
  CheckSquare, Languages, Shuffle, Palette, Code2, PenLine, Library, Quote, Gauge, ClipboardCheck, FileSignature, ShieldAlert, Layers, EyeOff, MessageSquareDiff, Hash, Type,
} from "lucide-react";

export interface Tool {
  id: number;
  name: string;
  slug: string;
  icon: any;
  available: boolean;
}

export interface ToolCategory {
  name: string;
  slug: string;
  description: string;
  tools: Tool[];
}

export const toolCategories: ToolCategory[] = [
  {
    name: "AI Assistant",
    slug: "ai-assistant",
    description: "Private, unlimited AI chat that runs entirely in your browser",
    tools: [
      { id: 68, name: "AI Chatbot", slug: "/ai-chatbot", icon: Bot, available: true },
    ],
  },
  {
    name: "Writing Tools",
    slug: "writing",
    description: "Enhance your writing with AI-powered tools",
    tools: [
      { id: 1, name: "AI Hook Generator", slug: "/ai-hook-generator", icon: Sparkles, available: true },
      { id: 2, name: "AI Paragraph Rewriter", slug: "/ai-paragraph-rewriter", icon: RefreshCw, available: true },
      { id: 3, name: "AI Sentence Simplifier", slug: "/ai-sentence-simplifier", icon: AlignLeft, available: true },
      { id: 4, name: "AI Sentence Expander", slug: "/ai-sentence-expander", icon: Maximize2, available: true },
      { id: 5, name: "AI Sentence Shortener", slug: "/ai-sentence-shortener", icon: Minimize2, available: true },
      { id: 6, name: "AI Tone Converter", slug: "/ai-tone-converter", icon: Type, available: true },
      { id: 7, name: "AI Headline Improver", slug: "/ai-headline-improver", icon: Heading, available: true },
      { id: 8, name: "AI Bullet Points Generator", slug: "/ai-bullet-points-generator", icon: List, available: true },
      { id: 9, name: "AI Blog Outline Generator", slug: "/ai-blog-outline-generator", icon: FileText, available: true },
      { id: 73, name: "AI Text Summarizer", slug: "/ai-text-summarizer", icon: BookOpen, available: true },
      { id: 75, name: "AI Grammar Checker", slug: "/ai-grammar-checker", icon: CheckSquare, available: true },
      { id: 76, name: "AI Translator", slug: "/ai-translator", icon: Languages, available: true },
      { id: 77, name: "AI Paraphrasing Tool", slug: "/ai-paraphrasing-tool", icon: Shuffle, available: true },
      { id: 78, name: "AI Image Prompt Generator", slug: "/ai-image-prompt-generator", icon: Palette, available: true },
      { id: 64, name: "AI PDF Summarizer", slug: "/ai-pdf-summarizer", icon: FileText, available: true },
      { id: 65, name: "AI Text Humanizer", slug: "/ai-humanizer", icon: Wand2, available: true },
      { id: 66, name: "AI Blog Post Generator", slug: "/ai-blog-post-generator", icon: Newspaper, available: true },
      { id: 67, name: "AI YouTube Script Generator", slug: "/ai-youtube-script-generator", icon: Clapperboard, available: true },
      { id: 10, name: "AI FAQ Generator", slug: "/ai-faq-generator", icon: HelpCircle, available: true },
      { id: 54, name: "AI Essay Writer", slug: "/ai-essay-writer", icon: ScrollText, available: true },
    ],
  },
  {
    name: "Social Media Tools",
    slug: "social-media",
    description: "Create engaging social media content effortlessly",
    tools: [
      { id: 11, name: "AI Instagram Caption Generator", slug: "/ai-instagram-caption-generator", icon: Instagram, available: true },
      { id: 12, name: "AI TikTok Caption Generator", slug: "/ai-tiktok-caption-generator", icon: Music2, available: true },
      { id: 13, name: "AI LinkedIn Post Generator", slug: "/ai-linkedin-post-generator", icon: Linkedin, available: true },
      { id: 14, name: "AI Tweet Generator", slug: "/ai-tweet-generator", icon: Twitter, available: true },
      { id: 15, name: "AI Hashtag Generator", slug: "/ai-hashtag-generator", icon: Hash, available: true },
      { id: 16, name: "AI YouTube Title Generator", slug: "/ai-youtube-title-generator", icon: Youtube, available: true },
      { id: 17, name: "AI YouTube Description Generator", slug: "/ai-youtube-description-generator", icon: FileEdit, available: true },
      { id: 18, name: "AI Instagram Bio Generator", slug: "/ai-instagram-bio-generator", icon: User, available: true },
    ],
  },
  {
    name: "Business Tools",
    slug: "business",
    description: "Launch and grow your business with AI assistance",
    tools: [
      { id: 19, name: "AI Business Name Generator", slug: "/ai-business-name-generator", icon: Building2, available: true },
      { id: 20, name: "AI Startup Name Generator", slug: "/ai-startup-name-generator", icon: Rocket, available: true },
      { id: 21, name: "AI Business Idea Generator", slug: "/ai-business-idea-generator", icon: Lightbulb, available: true },
      { id: 22, name: "AI Value Proposition Generator", slug: "/ai-value-proposition-generator", icon: Target, available: true },
      { id: 23, name: "AI Elevator Pitch Generator", slug: "/ai-elevator-pitch-generator", icon: Presentation, available: true },
      { id: 24, name: "AI Target Audience Generator", slug: "/ai-target-audience-generator", icon: Users, available: true },
    ],
  },
  {
    name: "Marketing Tools",
    slug: "marketing",
    description: "Supercharge your marketing campaigns",
    tools: [
      { id: 25, name: "AI Ad Copy Generator", slug: "/ai-ad-copy-generator", icon: Megaphone, available: true },
      { id: 74, name: "AI Email Response Generator", slug: "/ai-email-response-generator", icon: Mail, available: true },
      { id: 26, name: "AI Sales Email Generator", slug: "/ai-sales-email-generator", icon: Mail, available: true },
      { id: 27, name: "AI Cold Outreach Generator", slug: "/ai-cold-outreach-generator", icon: MessageSquare, available: true },
      { id: 28, name: "AI Call-to-Action Generator", slug: "/ai-cta-generator", icon: MousePointerClick, available: true },
      { id: 29, name: "AI Landing Page Copy Generator", slug: "/ai-landing-page-copy-generator", icon: Layout, available: true },
    ],
  },
  {
    name: "SEO Tools",
    slug: "seo",
    description: "Optimize your content for search engines",
    tools: [
      { id: 30, name: "AI Meta Description Generator", slug: "/ai-meta-description-generator", icon: Search, available: true },
      { id: 31, name: "AI SEO Title Generator", slug: "/ai-seo-title-generator", icon: Tag, available: true },
      { id: 32, name: "AI Keyword Generator", slug: "/ai-keyword-generator", icon: Key, available: true },
      { id: 33, name: "AI Content Brief Generator", slug: "/ai-content-brief-generator", icon: BookOpen, available: true },
      { id: 34, name: "AI Internal Link Suggestion Tool", slug: "/ai-internal-link-suggestion-tool", icon: Link2, available: true },
      { id: 58, name: "AI Content Gap Analyzer", slug: "/ai-content-gap-analyzer", icon: Search, available: true },
      { id: 59, name: "AI Schema Markup Generator", slug: "/ai-schema-markup-generator", icon: Code, available: true },
      { id: 60, name: "AI SERP Intent Analyzer", slug: "/ai-serp-intent-analyzer", icon: Target, available: true },
    ],
  },
  {
    name: "Job & Career Tools",
    slug: "career",
    description: "Accelerate your career with AI",
    tools: [
      { id: 35, name: "AI Resume Bullet Generator", slug: "/ai-resume-bullet-generator", icon: Briefcase, available: true },
      { id: 36, name: "AI Cover Letter Generator", slug: "/ai-cover-letter-generator", icon: FileText, available: true },
      { id: 37, name: "AI LinkedIn Summary Generator", slug: "/ai-linkedin-summary-generator", icon: UserCheck, available: true },
      { id: 38, name: "AI Interview Answer Generator", slug: "/ai-interview-answer-generator", icon: MessageCircle, available: true },
      { id: 61, name: "AI ATS Resume Matcher", slug: "/ai-ats-resume-matcher", icon: ScanSearch, available: true },
    ],
  },
  {
    name: "Productivity Tools",
    slug: "productivity",
    description: "Get more done with smart AI assistants",
    tools: [
      { id: 39, name: "AI To-Do List Generator", slug: "/ai-todo-list-generator", icon: ListChecks, available: true },
      { id: 40, name: "AI Meeting Summary Generator", slug: "/ai-meeting-summary-generator", icon: ClipboardList, available: true },
      { id: 41, name: "AI Weekly Planner Generator", slug: "/ai-weekly-planner-generator", icon: CalendarDays, available: true },
      { id: 42, name: "AI Goal Planner", slug: "/ai-goal-planner", icon: Flag, available: true },
    ],
  },
  {
    name: "Unique & Viral Tools",
    slug: "unique",
    description: "Fun and creative AI tools for any occasion",
    tools: [
      { id: 43, name: "AI Decision Maker", slug: "/ai-decision-maker", icon: Scale, available: true },
      { id: 44, name: "AI Pros & Cons Generator", slug: "/ai-pros-and-cons-generator", icon: ThumbsUp, available: true },
      { id: 45, name: "AI Debate Generator", slug: "/ai-debate-generator", icon: Swords, available: true },
      { id: 46, name: "AI Excuse Generator", slug: "/ai-excuse-generator", icon: ShieldQuestion, available: true },
      { id: 47, name: "AI Compliment Generator", slug: "/ai-compliment-generator", icon: Heart, available: true },
      { id: 48, name: "AI Roast Generator", slug: "/ai-roast-generator", icon: Flame, available: true },
      { id: 49, name: "AI Story Starter", slug: "/ai-story-starter", icon: BookOpenCheck, available: true },
      { id: 50, name: "AI Prompt Generator", slug: "/ai-prompt-generator", icon: PenTool, available: true },
      { id: 51, name: "AI Document Analyzer", slug: "/ai-document-analyzer", icon: FileText, available: true },
      { id: 52, name: "AI Message Analyzer", slug: "/ai-message-analyzer", icon: MessageSquare, available: true },
      { id: 53, name: "AI Explain This", slug: "/explain-this-ai", icon: Lightbulb, available: true },
      { id: 55, name: "AI Dating Profile Generator", slug: "/ai-dating-profile-generator", icon: Heart, available: true },
      { id: 56, name: "AI Meal Planner", slug: "/ai-meal-planner", icon: UtensilsCrossed, available: true },
      { id: 57, name: "AI Travel Planner", slug: "/ai-travel-itinerary-planner", icon: MapPin, available: true },
      { id: 80, name: "AI Flashcard Generator", slug: "/ai-flashcard-generator", icon: BookOpen, available: true },
      { id: 81, name: "AI Personal Statement Generator", slug: "/ai-personal-statement-generator", icon: PenLine, available: true },
      { id: 82, name: "AI Local Knowledge Chat", slug: "/ai-local-knowledge-chat", icon: Library, available: true },
      { id: 83, name: "AI Citation Generator", slug: "/ai-citation-generator", icon: Quote, available: true },
      { id: 84, name: "AI Readability Analyzer", slug: "/ai-readability-analyzer", icon: Gauge, available: true },
      { id: 85, name: "AI Essay Grader", slug: "/ai-essay-grader", icon: ClipboardCheck, available: true },
      { id: 86, name: "AI YouTube Summarizer", slug: "/ai-youtube-summarizer", icon: Youtube, available: true },
      { id: 87, name: "AI Contract Simplifier", slug: "/ai-contract-simplifier", icon: FileSignature, available: true },
      { id: 88, name: "AI Contract Risk Analyzer", slug: "/ai-contract-simplifier", icon: ShieldAlert, available: true },
      { id: 89, name: "AI Content Repurposer", slug: "/ai-content-repurposer", icon: Layers, available: true },
      { id: 90, name: "AI PII Redactor", slug: "/ai-pii-redactor", icon: EyeOff, available: true },
      { id: 91, name: "AI Writing Feedback Coach", slug: "/ai-writing-feedback-coach", icon: MessageSquareDiff, available: true },
      { id: 92, name: "Word Counter", slug: "/word-counter", icon: Hash, available: true },
      { id: 93, name: "AI Plagiarism Checker", slug: "/ai-plagiarism-checker", icon: ScanSearch, available: true },
      { id: 94, name: "Case Converter", slug: "/case-converter", icon: Type, available: true },
      { id: 70, name: "AI Homework Solver", slug: "/ai-homework-solver", icon: GraduationCap, available: true },
      { id: 71, name: "AI Text Detector", slug: "/ai-text-detector", icon: ShieldCheck, available: true },
      { id: 72, name: "AI PDF Chat", slug: "/ai-pdf-chat", icon: FileSearch, available: true },
    ],
  },
  {
    name: "Developer Tools",
    slug: "developer",
    description: "AI-powered tools for developers and coders",
    tools: [
      { id: 63, name: "Private AI Code Playground", slug: "/ai-code-playground", icon: Terminal, available: true },
      { id: 79, name: "AI Code Explainer", slug: "/ai-code-explainer", icon: Code2, available: true },
    ],
  },
];

export const allTools = toolCategories.flatMap(c => c.tools);
export const availableTools = allTools.filter(t => t.available);
export const comingSoonTools = allTools.filter(t => !t.available);
