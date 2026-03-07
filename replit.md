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
- `client/src/lib/tools-data.ts` - All tools data organized by category
- `client/src/lib/faqs-data.ts` - FAQ content for tool pages (hookGeneratorFAQs, ctaGeneratorFAQs, coverLetterGeneratorFAQs, startupNameGeneratorFAQs, businessIdeaGeneratorFAQs, keywordGeneratorFAQs, defaultToolFAQs)

## Design
- Mobile-first responsive design
- Purple-to-blue gradient primary colors
- Glass-panel effects, subtle background blurs
- Font: Plus Jakarta Sans (display), Inter (body)

## Important Notes
- WebLLM requires WebGPU (Chrome/Edge 113+). Graceful fallback message shown if unsupported.
- AI engine auto-initializes on page load (not on first generate click).
- Hook Generator, CTA Generator, Cover Letter Generator, Startup Name Generator, Business Idea Generator, and Keyword Generator are live; other tools show "Coming Soon".
- No database, no backend storage - purely client-side app.
