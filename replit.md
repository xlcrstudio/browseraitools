# Browser AI Tools

## Overview
A mobile-first, client-side AI tools website (browseraitools.com) that runs AI models entirely in the browser using WebLLM. No backend API calls for core functionality - everything is private and local.

## Architecture
- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion
- **AI Engine**: @mlc-ai/web-llm (Qwen 2.5 1.5B model, cached in IndexedDB)
- **State**: React useState + localStorage (no database needed)
- **Routing**: wouter (client-side)
- **Server**: Express serves the Vite frontend only (no API routes for app logic)

## Key Pages
- `/` - Homepage with hero, tool catalog, privacy section
- `/ai-hook-generator` - AI Hook Generator (tool #1)
- `/ai-cta-generator` - AI Call-to-Action Generator (tool #2)
- `/ai-cover-letter-generator` - AI Cover Letter Generator (tool #3, flagship)
- `/ai-startup-name-generator` - AI Startup Name Generator (tool #4)
- `/ai-business-idea-generator` - AI Business Idea Generator (tool #5)
- `/ai-keyword-generator` - AI Keyword Generator (tool #6)
- `/ai-hashtag-generator` - AI Hashtag Generator (tool #7)
- `/ai-tiktok-caption-generator` - AI TikTok Caption Generator (tool #8)
- `/ai-linkedin-post-generator` - AI LinkedIn Post Generator (tool #9)
- `/ai-tone-converter` - AI Tone Converter (tool #10)
- `/ai-interview-answer-generator` - AI Interview Answer Generator (tool #11)
- `/ai-resume-bullet-generator` - AI Resume Bullet Generator (tool #12)
- `/ai-blog-outline-generator` - AI Blog Outline Generator (tool #13)
- `/ai-document-analyzer` - AI Document Analyzer (tool #14)
- `/ai-message-analyzer` - AI Message Analyzer (tool #15)
- `/explain-this-ai` - AI Explain This (tool #16)
- `/ai-essay-writer` - AI Essay Writer (tool #17)
- `/privacy-policy` - Privacy Policy (React page, not static HTML)
- `/terms-of-service` - Terms of Service (React page, not static HTML)

## File Structure
- `client/src/pages/Home.tsx` - Homepage with hero, tool catalog, privacy section
- `client/src/pages/HookGeneratorPage.tsx` - Hook generator tool page
- `client/src/pages/CTAGeneratorPage.tsx` - CTA generator tool page
- `client/src/pages/CoverLetterGeneratorPage.tsx` - Cover letter generator tool page
- `client/src/pages/PrivacyPolicy.tsx` - Privacy Policy page
- `client/src/pages/TermsOfService.tsx` - Terms of Service page
- `client/src/components/Layout.tsx` - Shared layout with header (desktop mega menu + mobile drawer), footer with legal links
- `client/src/components/ToolPageHeader.tsx` - Reusable tool page header (home breadcrumb + tool name)
- `client/src/components/ToolFAQ.tsx` - Reusable FAQ accordion with Schema.org structured data
- `client/src/components/Hero.tsx` - Hook generator hero section
- `client/src/components/HookGenerator.tsx` - Main hook generation UI
- `client/src/components/HistorySidebar.tsx` - Hook history panel (localStorage)
- `client/src/components/CTAHero.tsx` - CTA generator hero section
- `client/src/components/CTAGenerator.tsx` - Main CTA generation UI with category filtering
- `client/src/components/CTAArticle.tsx` - CTA SEO article with collapsible sections
- `client/src/components/CoverLetterHero.tsx` - Cover letter generator hero section
- `client/src/components/CoverLetterGenerator.tsx` - Multi-section cover letter form + output display with save/load drafts
- `client/src/components/CoverLetterArticle.tsx` - Cover letter SEO article with collapsible sections
- `client/src/pages/StartupNameGeneratorPage.tsx` - Startup name generator tool page
- `client/src/components/StartupNameHero.tsx` - Startup name generator hero section
- `client/src/components/StartupNameGenerator.tsx` - Main startup name generation UI with name cards, favorites, filtering/sorting, domain heuristics
- `client/src/components/StartupNameArticle.tsx` - Startup name SEO article with collapsible sections
- `client/src/pages/BusinessIdeaGeneratorPage.tsx` - Business idea generator tool page
- `client/src/components/BusinessIdeaHero.tsx` - Business idea generator hero section
- `client/src/components/BusinessIdeaGenerator.tsx` - Main business idea generation UI with idea cards, favorites, filtering/sorting, expandable plans
- `client/src/components/BusinessIdeaArticle.tsx` - Business idea SEO article with collapsible sections
- `client/src/pages/KeywordGeneratorPage.tsx` - Keyword generator tool page
- `client/src/components/KeywordHero.tsx` - Keyword generator hero section
- `client/src/components/KeywordGenerator.tsx` - Main keyword generation UI with table/cluster views, intent filtering, difficulty scoring, CSV export
- `client/src/components/KeywordArticle.tsx` - Keyword research SEO article with collapsible sections
- `client/src/hooks/use-web-llm.ts` - WebLLM engine initialization & generation (exports `generate` + `generateRaw`)
- `client/src/hooks/use-hook-storage.ts` - localStorage-based hook history
- `client/src/hooks/use-cta-storage.ts` - localStorage-based CTA history with auto-categorization
- `client/src/hooks/use-cover-letter-storage.ts` - localStorage-based cover letter drafts (save/load/delete, max 10)
- `client/src/hooks/use-startup-name-storage.ts` - localStorage-based startup name history with favorites, domain availability heuristics
- `client/src/hooks/use-business-idea-storage.ts` - localStorage-based business idea history with favorites
- `client/src/hooks/use-keyword-storage.ts` - localStorage-based keyword research history with favorites
- `client/src/pages/HashtagGeneratorPage.tsx` - Hashtag generator tool page
- `client/src/components/HashtagHero.tsx` - Hashtag generator hero section
- `client/src/components/HashtagGenerator.tsx` - Main hashtag generation UI with platform selection, volume-categorized output, copy-paste ready sets, CSV export, favorites
- `client/src/components/HashtagArticle.tsx` - Hashtag strategy SEO article with collapsible sections
- `client/src/hooks/use-hashtag-storage.ts` - localStorage-based hashtag history with favorites
- `client/src/pages/TikTokCaptionGeneratorPage.tsx` - TikTok caption generator tool page
- `client/src/components/TikTokCaptionHero.tsx` - TikTok caption generator hero section
- `client/src/components/TikTokCaptionGenerator.tsx` - Main TikTok caption generation UI with multi-variation output, first comment suggestions, engagement analysis
- `client/src/components/TikTokCaptionArticle.tsx` - TikTok caption SEO article with collapsible sections
- `client/src/hooks/use-tiktok-caption-storage.ts` - localStorage-based TikTok caption history with favorites
- `client/src/pages/LinkedInPostGeneratorPage.tsx` - LinkedIn post generator tool page
- `client/src/components/LinkedInPostHero.tsx` - LinkedIn post generator hero section
- `client/src/components/LinkedInPostGenerator.tsx` - Main LinkedIn post generation UI with multiple versions, post analysis, first comment strategy, A/B testing
- `client/src/components/LinkedInPostArticle.tsx` - LinkedIn posting strategy SEO article with collapsible sections
- `client/src/hooks/use-linkedin-post-storage.ts` - localStorage-based LinkedIn post history with favorites
- `client/src/pages/ToneConverterPage.tsx` - Tone converter tool page
- `client/src/components/ToneConverterHero.tsx` - Tone converter hero section
- `client/src/components/ToneConverterGenerator.tsx` - Main tone converter UI with side-by-side comparison, change analysis, usage notes, 10 target tones
- `client/src/components/ToneConverterArticle.tsx` - Tone and communication SEO article with collapsible sections
- `client/src/hooks/use-tone-converter-storage.ts` - localStorage-based tone conversion history with favorites
- `client/src/pages/InterviewAnswerGeneratorPage.tsx` - Interview answer generator tool page
- `client/src/components/InterviewAnswerHero.tsx` - Interview answer generator hero section
- `client/src/components/InterviewAnswerGenerator.tsx` - Main interview answer generation UI with STAR method, delivery tips, follow-up prep, alternative angles, strengths breakdown
- `client/src/components/InterviewAnswerArticle.tsx` - Interview preparation SEO article with collapsible sections
- `client/src/hooks/use-interview-answer-storage.ts` - localStorage-based interview answer history with favorites
- `client/src/pages/ResumeBulletGeneratorPage.tsx` - Resume bullet generator tool page
- `client/src/components/ResumeBulletHero.tsx` - Resume bullet generator hero section
- `client/src/components/ResumeBulletGenerator.tsx` - Main resume bullet generation UI with bullet cards, "why it works" explanations, best combination, concise/detailed variations, improvement tips
- `client/src/components/ResumeBulletArticle.tsx` - Resume writing SEO article with collapsible sections
- `client/src/hooks/use-resume-bullet-storage.ts` - localStorage-based resume bullet history with favorites
- `client/src/pages/BlogOutlineGeneratorPage.tsx` - Blog outline generator tool page
- `client/src/components/BlogOutlineHero.tsx` - Blog outline generator hero section
- `client/src/components/BlogOutlineGenerator.tsx` - Main blog outline generation UI with title options, meta descriptions, intro structure, H2/H3 sections, conclusion, FAQ generation, content notes, SEO notes
- `client/src/components/BlogOutlineArticle.tsx` - Blog outline/content planning SEO article with collapsible sections
- `client/src/hooks/use-blog-outline-storage.ts` - localStorage-based blog outline history with favorites
- `client/src/pages/DocumentAnalyzerPage.tsx` - Document analyzer tool page
- `client/src/components/DocumentAnalyzerHero.tsx` - Document analyzer hero section
- `client/src/components/DocumentAnalyzerGenerator.tsx` - Main document analyzer UI with PDF upload (pdfjs-dist), text paste, 7 analysis modes, reading level, length pref, focus areas, structured + raw fallback output
- `client/src/components/DocumentAnalyzerArticle.tsx` - Document analysis SEO article with collapsible sections
- `client/src/hooks/use-document-analyzer-storage.ts` - localStorage-based document analysis history
- `client/src/pages/MessageAnalyzerPage.tsx` - Message analyzer tool page
- `client/src/components/MessageAnalyzerHero.tsx` - Message analyzer hero section
- `client/src/components/MessageAnalyzerGenerator.tsx` - Main message analyzer UI with 7 analysis modes (tone, intent, replies, red flags, relationship, professional, scam), quick examples, presets, context inputs, separate LLM calls per mode
- `client/src/components/MessageAnalyzerArticle.tsx` - Message analysis SEO article with collapsible sections
- `client/src/hooks/use-message-analyzer-storage.ts` - localStorage-based message analysis history
- `client/src/pages/ExplainThisPage.tsx` - Explain This tool page
- `client/src/components/ExplainThisHero.tsx` - Explain This hero section
- `client/src/components/ExplainThisGenerator.tsx` - Main explainer UI with 6 explanation modes (simple, ELI5, step-by-step, analogy, technical, academic), reading level slider, subject area detection, advanced options, separate LLM calls per mode + key terms
- `client/src/components/ExplainThisArticle.tsx` - Text comprehension SEO article with collapsible sections
- `client/src/hooks/use-explainer-storage.ts` - localStorage-based explanation history
- `client/src/pages/EssayWriterPage.tsx` - Essay writer tool page
- `client/src/components/EssayWriterHero.tsx` - Essay writer hero section
- `client/src/components/EssayWriterGenerator.tsx` - Main essay writer UI with 6 essay types, 5 academic levels, citation styles, word count slider, outline mode, tone selection, multi-call LLM per section
- `client/src/components/EssayWriterArticle.tsx` - Essay writing SEO article with collapsible sections
- `client/src/hooks/use-essay-writer-storage.ts` - localStorage-based essay history
- `client/src/lib/tools-data.ts` - All tools data organized by category
- `client/src/lib/faqs-data.ts` - FAQ content for tool pages (hookGeneratorFAQs, ctaGeneratorFAQs, coverLetterGeneratorFAQs, startupNameGeneratorFAQs, businessIdeaGeneratorFAQs, keywordGeneratorFAQs, hashtagGeneratorFAQs, tiktokCaptionGeneratorFAQs, linkedInPostGeneratorFAQs, toneConverterFAQs, interviewAnswerGeneratorFAQs, resumeBulletGeneratorFAQs, blogOutlineGeneratorFAQs, documentAnalyzerFAQs, messageAnalyzerFAQs, explainThisFAQs, essayWriterFAQs, defaultToolFAQs)

## Ad Blocks
- `client/src/components/AdBlock.tsx` - Reusable ad placeholder component with unique `slot` ID and `format` (horizontal/rectangle/vertical)
- Home page: 3 ad blocks (home-top before tools catalog, home-mid before privacy, home-bottom after privacy)
- Each tool page: 3 ad blocks (top after hero, mid between generator and article/FAQ, bottom after FAQ)
- Each ad block has `data-ad-slot` and `data-ad-format` attributes for ad network integration

## Design
- Mobile-first responsive design
- Purple-to-blue gradient primary colors
- Glass-panel effects, subtle background blurs
- Font: Plus Jakarta Sans (display), Inter (body)

## Important Notes
- WebLLM requires WebGPU (Chrome/Edge 113+). Graceful fallback message shown if unsupported.
- AI engine auto-initializes on page load (not on first generate click).
- Hook Generator, CTA Generator, Cover Letter Generator, Startup Name Generator, Business Idea Generator, Keyword Generator, Hashtag Generator, TikTok Caption Generator, LinkedIn Post Generator, Tone Converter, Interview Answer Generator, Resume Bullet Generator, Blog Outline Generator, Document Analyzer, Message Analyzer, Explain This, and Essay Writer are live (17 tools); other tools show "Coming Soon".
- No database, no backend storage - purely client-side app.
