import {
  PenTool, Type, AlignLeft, Maximize2, Minimize2, RefreshCw, Heading, List, FileText, HelpCircle,
  Instagram, Music2, Linkedin, Twitter, Hash, Youtube, FileEdit, User,
  Building2, Rocket, Lightbulb, Target, Presentation, Users,
  Megaphone, Mail, MessageSquare, MousePointerClick, Layout,
  Search, Tag, Key, BookOpen, Link2,
  Briefcase, ScrollText, UserCheck, MessageCircle,
  ListChecks, ClipboardList, CalendarDays, Flag,
  Scale, ThumbsUp, Swords, ShieldQuestion, Heart, Flame, BookOpenCheck, Sparkles, UtensilsCrossed, MapPin, Code,
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
    name: "Writing Tools",
    slug: "writing",
    description: "Enhance your writing with AI-powered tools",
    tools: [
      { id: 1, name: "AI Hook Generator", slug: "/ai-hook-generator", icon: Sparkles, available: true },
      { id: 2, name: "AI Paragraph Rewriter", slug: "/paragraph-rewriter", icon: RefreshCw, available: false },
      { id: 3, name: "AI Sentence Simplifier", slug: "/sentence-simplifier", icon: AlignLeft, available: false },
      { id: 4, name: "AI Sentence Expander", slug: "/sentence-expander", icon: Maximize2, available: false },
      { id: 5, name: "AI Sentence Shortener", slug: "/sentence-shortener", icon: Minimize2, available: false },
      { id: 6, name: "AI Tone Converter", slug: "/ai-tone-converter", icon: Type, available: true },
      { id: 7, name: "AI Headline Improver", slug: "/headline-improver", icon: Heading, available: false },
      { id: 8, name: "AI Bullet Point Generator", slug: "/bullet-point-generator", icon: List, available: false },
      { id: 9, name: "AI Blog Outline Generator", slug: "/ai-blog-outline-generator", icon: FileText, available: true },
      { id: 10, name: "AI FAQ Generator", slug: "/faq-generator", icon: HelpCircle, available: false },
      { id: 54, name: "AI Essay Writer", slug: "/ai-essay-writer", icon: ScrollText, available: true },
    ],
  },
  {
    name: "Social Media Tools",
    slug: "social-media",
    description: "Create engaging social media content effortlessly",
    tools: [
      { id: 11, name: "AI Instagram Caption Generator", slug: "/instagram-caption-generator", icon: Instagram, available: false },
      { id: 12, name: "AI TikTok Caption Generator", slug: "/ai-tiktok-caption-generator", icon: Music2, available: true },
      { id: 13, name: "AI LinkedIn Post Generator", slug: "/ai-linkedin-post-generator", icon: Linkedin, available: true },
      { id: 14, name: "AI Tweet Generator", slug: "/tweet-generator", icon: Twitter, available: false },
      { id: 15, name: "AI Hashtag Generator", slug: "/ai-hashtag-generator", icon: Hash, available: true },
      { id: 16, name: "AI YouTube Title Generator", slug: "/youtube-title-generator", icon: Youtube, available: false },
      { id: 17, name: "AI YouTube Description Generator", slug: "/youtube-description-generator", icon: FileEdit, available: false },
      { id: 18, name: "AI Instagram Bio Generator", slug: "/instagram-bio-generator", icon: User, available: false },
    ],
  },
  {
    name: "Business Tools",
    slug: "business",
    description: "Launch and grow your business with AI assistance",
    tools: [
      { id: 19, name: "AI Business Name Generator", slug: "/business-name-generator", icon: Building2, available: false },
      { id: 20, name: "AI Startup Name Generator", slug: "/ai-startup-name-generator", icon: Rocket, available: true },
      { id: 21, name: "AI Business Idea Generator", slug: "/ai-business-idea-generator", icon: Lightbulb, available: true },
      { id: 22, name: "AI Value Proposition Generator", slug: "/value-proposition-generator", icon: Target, available: false },
      { id: 23, name: "AI Elevator Pitch Generator", slug: "/elevator-pitch-generator", icon: Presentation, available: false },
      { id: 24, name: "AI Target Audience Generator", slug: "/target-audience-generator", icon: Users, available: false },
    ],
  },
  {
    name: "Marketing Tools",
    slug: "marketing",
    description: "Supercharge your marketing campaigns",
    tools: [
      { id: 25, name: "AI Ad Copy Generator", slug: "/ad-copy-generator", icon: Megaphone, available: false },
      { id: 26, name: "AI Sales Email Generator", slug: "/sales-email-generator", icon: Mail, available: false },
      { id: 27, name: "AI Cold Outreach Generator", slug: "/cold-outreach-generator", icon: MessageSquare, available: false },
      { id: 28, name: "AI Call-to-Action Generator", slug: "/ai-cta-generator", icon: MousePointerClick, available: true },
      { id: 29, name: "AI Landing Page Copy Generator", slug: "/landing-page-copy-generator", icon: Layout, available: false },
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
    ],
  },
  {
    name: "Productivity Tools",
    slug: "productivity",
    description: "Get more done with smart AI assistants",
    tools: [
      { id: 39, name: "AI To-Do List Generator", slug: "/todo-list-generator", icon: ListChecks, available: false },
      { id: 40, name: "AI Meeting Summary Generator", slug: "/meeting-summary-generator", icon: ClipboardList, available: false },
      { id: 41, name: "AI Weekly Planner Generator", slug: "/weekly-planner-generator", icon: CalendarDays, available: false },
      { id: 42, name: "AI Goal Planner", slug: "/goal-planner", icon: Flag, available: false },
    ],
  },
  {
    name: "Unique & Viral Tools",
    slug: "unique",
    description: "Fun and creative AI tools for any occasion",
    tools: [
      { id: 43, name: "AI Decision Maker", slug: "/decision-maker", icon: Scale, available: false },
      { id: 44, name: "AI Pros & Cons Generator", slug: "/pros-cons-generator", icon: ThumbsUp, available: false },
      { id: 45, name: "AI Debate Generator", slug: "/debate-generator", icon: Swords, available: false },
      { id: 46, name: "AI Excuse Generator", slug: "/excuse-generator", icon: ShieldQuestion, available: false },
      { id: 47, name: "AI Compliment Generator", slug: "/compliment-generator", icon: Heart, available: false },
      { id: 48, name: "AI Roast Generator", slug: "/ai-roast-generator", icon: Flame, available: true },
      { id: 49, name: "AI Story Starter", slug: "/story-starter", icon: BookOpenCheck, available: false },
      { id: 50, name: "AI Prompt Generator", slug: "/prompt-generator", icon: PenTool, available: false },
      { id: 51, name: "AI Document Analyzer", slug: "/ai-document-analyzer", icon: FileText, available: true },
      { id: 52, name: "AI Message Analyzer", slug: "/ai-message-analyzer", icon: MessageSquare, available: true },
      { id: 53, name: "AI Explain This", slug: "/explain-this-ai", icon: Lightbulb, available: true },
      { id: 55, name: "AI Dating Profile Generator", slug: "/ai-dating-profile-generator", icon: Heart, available: true },
      { id: 56, name: "AI Meal Planner", slug: "/ai-meal-planner", icon: UtensilsCrossed, available: true },
      { id: 57, name: "AI Travel Planner", slug: "/ai-travel-itinerary-planner", icon: MapPin, available: true },
    ],
  },
];

export const allTools = toolCategories.flatMap(c => c.tools);
export const availableTools = allTools.filter(t => t.available);
export const comingSoonTools = allTools.filter(t => !t.available);
