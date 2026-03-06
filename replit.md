# Browser AI Tools

## Overview
A mobile-first, client-side AI tools website (browseraitools.com) that runs AI models entirely in the browser using WebLLM. No backend API calls for core functionality - everything is private and local.

## Architecture
- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion
- **AI Engine**: @mlc-ai/web-llm (Llama 3.1 8B model, cached in IndexedDB)
- **State**: React useState + localStorage (no database needed)
- **Routing**: wouter (client-side)
- **Server**: Express serves the Vite frontend only (no API routes for app logic)

## Key Pages
- `/` - Homepage with full tool catalog (50 tools across 8 categories)
- `/hook-generator` - AI Hook Generator (first live tool)

## File Structure
- `client/src/pages/Home.tsx` - Homepage with hero, tool catalog, privacy section, CTA
- `client/src/pages/HookGeneratorPage.tsx` - Hook generator tool page
- `client/src/components/Layout.tsx` - Shared layout with header (desktop mega menu + mobile drawer), footer
- `client/src/components/Hero.tsx` - Hook generator hero section
- `client/src/components/HookGenerator.tsx` - Main hook generation UI
- `client/src/components/HistorySidebar.tsx` - Hook history panel (localStorage)
- `client/src/hooks/use-web-llm.ts` - WebLLM engine initialization & generation (auto-loads on page mount)
- `client/src/hooks/use-hook-storage.ts` - localStorage-based hook history
- `client/src/lib/tools-data.ts` - All 50 tools data organized by category

## Design
- Mobile-first responsive design
- Purple-to-blue gradient primary colors
- Glass-panel effects, subtle background blurs
- Font: Plus Jakarta Sans (display), Inter (body)

## Important Notes
- WebLLM requires WebGPU (Chrome/Edge 113+). Graceful fallback message shown if unsupported.
- AI engine auto-initializes on page load (not on first generate click).
- Only Hook Generator is live; other 49 tools show "Coming Soon".
- No database, no backend storage - purely client-side app.
