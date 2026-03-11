import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface ToolEntry {
  name: string;
  path: string;
  category: string;
}

const ALL_TOOLS: ToolEntry[] = [
  { name: "AI Hook Generator", path: "/ai-hook-generator", category: "ProductivityApplication" },
  { name: "AI Tone Converter", path: "/ai-tone-converter", category: "ProductivityApplication" },
  { name: "AI Blog Outline Generator", path: "/ai-blog-outline-generator", category: "BusinessApplication" },
  { name: "AI Essay Writer", path: "/ai-essay-writer", category: "ProductivityApplication" },
  { name: "AI Instagram Caption Generator", path: "/ai-instagram-caption-generator", category: "EntertainmentApplication" },
  { name: "AI TikTok Caption Generator", path: "/ai-tiktok-caption-generator", category: "EntertainmentApplication" },
  { name: "AI LinkedIn Post Generator", path: "/ai-linkedin-post-generator", category: "BusinessApplication" },
  { name: "AI Tweet Generator", path: "/ai-tweet-generator", category: "EntertainmentApplication" },
  { name: "AI Hashtag Generator", path: "/ai-hashtag-generator", category: "ProductivityApplication" },
  { name: "AI YouTube Title Generator", path: "/ai-youtube-title-generator", category: "ProductivityApplication" },
  { name: "AI YouTube Description Generator", path: "/ai-youtube-description-generator", category: "ProductivityApplication" },
  { name: "AI Instagram Bio Generator", path: "/ai-instagram-bio-generator", category: "EntertainmentApplication" },
  { name: "AI Startup Name Generator", path: "/ai-startup-name-generator", category: "ProductivityApplication" },
  { name: "AI Business Idea Generator", path: "/ai-business-idea-generator", category: "ProductivityApplication" },
  { name: "AI Call-to-Action Generator", path: "/ai-cta-generator", category: "ProductivityApplication" },
  { name: "AI Sales Email Generator", path: "/ai-sales-email-generator", category: "BusinessApplication" },
  { name: "AI Ad Copy Generator", path: "/ai-ad-copy-generator", category: "BusinessApplication" },
  { name: "AI Elevator Pitch Generator", path: "/ai-elevator-pitch-generator", category: "BusinessApplication" },
  { name: "AI Cold Outreach Generator", path: "/ai-cold-outreach-generator", category: "BusinessApplication" },
  { name: "AI Landing Page Copy Generator", path: "/ai-landing-page-copy-generator", category: "BusinessApplication" },
  { name: "AI Target Audience Generator", path: "/ai-target-audience-generator", category: "BusinessApplication" },
  { name: "AI Value Proposition Generator", path: "/ai-value-proposition-generator", category: "BusinessApplication" },
  { name: "AI Business Name Generator", path: "/ai-business-name-generator", category: "BusinessApplication" },
  { name: "AI Meeting Summary Generator", path: "/ai-meeting-summary-generator", category: "BusinessApplication" },
  { name: "AI Paragraph Rewriter", path: "/ai-paragraph-rewriter", category: "UtilitiesApplication" },
  { name: "AI Meta Description Generator", path: "/ai-meta-description-generator", category: "BusinessApplication" },
  { name: "AI SEO Title Generator", path: "/ai-seo-title-generator", category: "BusinessApplication" },
  { name: "AI Keyword Generator", path: "/ai-keyword-generator", category: "BusinessApplication" },
  { name: "AI Content Brief Generator", path: "/ai-content-brief-generator", category: "BusinessApplication" },
  { name: "AI Internal Link Suggestion Tool", path: "/ai-internal-link-suggestion-tool", category: "BusinessApplication" },
  { name: "AI Content Gap Analyzer", path: "/ai-content-gap-analyzer", category: "BusinessApplication" },
  { name: "AI Schema Markup Generator", path: "/ai-schema-markup-generator", category: "BusinessApplication" },
  { name: "AI SERP Intent Analyzer", path: "/ai-serp-intent-analyzer", category: "BusinessApplication" },
  { name: "AI Resume Bullet Generator", path: "/ai-resume-bullet-generator", category: "BusinessApplication" },
  { name: "AI Cover Letter Generator", path: "/ai-cover-letter-generator", category: "BusinessApplication" },
  { name: "AI LinkedIn Summary Generator", path: "/ai-linkedin-summary-generator", category: "BusinessApplication" },
  { name: "AI Interview Answer Generator", path: "/ai-interview-answer-generator", category: "BusinessApplication" },
  { name: "AI ATS Resume Matcher", path: "/ai-ats-resume-matcher", category: "BusinessApplication" },
  { name: "AI To-Do List Generator", path: "/ai-todo-list-generator", category: "ProductivityApplication" },
  { name: "AI Weekly Planner Generator", path: "/ai-weekly-planner-generator", category: "ProductivityApplication" },
  { name: "AI Goal Planner", path: "/ai-goal-planner", category: "ProductivityApplication" },
  { name: "AI Decision Maker", path: "/ai-decision-maker", category: "ProductivityApplication" },
  { name: "AI Pros & Cons Generator", path: "/ai-pros-and-cons-generator", category: "ProductivityApplication" },
  { name: "AI Debate Generator", path: "/ai-debate-generator", category: "ProductivityApplication" },
  { name: "AI Excuse Generator", path: "/ai-excuse-generator", category: "EntertainmentApplication" },
  { name: "AI Compliment Generator", path: "/ai-compliment-generator", category: "EntertainmentApplication" },
  { name: "AI Roast Generator", path: "/ai-roast-generator", category: "EntertainmentApplication" },
  { name: "AI Story Starter", path: "/ai-story-starter", category: "EntertainmentApplication" },
  { name: "AI Prompt Generator", path: "/ai-prompt-generator", category: "ProductivityApplication" },
  { name: "AI Document Analyzer", path: "/ai-document-analyzer", category: "ProductivityApplication" },
  { name: "AI Explain This", path: "/ai-explain-this", category: "ProductivityApplication" },
  { name: "AI Message Analyzer", path: "/ai-message-analyzer", category: "ProductivityApplication" },
  { name: "AI Dating Profile Generator", path: "/ai-dating-profile-generator", category: "EntertainmentApplication" },
  { name: "AI Meal Planner", path: "/ai-meal-planner", category: "ProductivityApplication" },
  { name: "AI Travel Planner", path: "/ai-travel-planner", category: "ProductivityApplication" },
];

const RelatedTools: React.FC<{ currentToolName: string; currentCategory: string }> = ({ currentToolName, currentCategory }) => {
  const sameCategory = ALL_TOOLS.filter(
    (t) => t.name !== currentToolName && t.category === currentCategory
  );

  const otherCategory = ALL_TOOLS.filter(
    (t) => t.name !== currentToolName && t.category !== currentCategory
  );

  const related = [...sameCategory.slice(0, 4), ...otherCategory.slice(0, Math.max(0, 5 - sameCategory.length))].slice(0, 5);

  if (related.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12" data-testid="section-related-tools">
      <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
        <h3 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100 mb-6">
          Related AI Tools You Might Love
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {related.map((tool) => (
            <Link
              key={tool.path}
              href={tool.path}
              className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
              data-testid={`link-related-${tool.path.slice(1)}`}
            >
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                  {tool.name}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Free &middot; Private &middot; In-browser</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedTools;
