# Browser AI Tools

## Overview
Browser AI Tools is a mobile-first, client-side web application offering a suite of AI tools that run entirely in the browser using WebLLM. The project's vision is to provide private, local, and accessible AI utilities without relying on backend API calls for core functionality. It aims to empower users with a diverse range of AI-powered generators and analyzers for creative, professional, and personal use cases.

## User Preferences
I prefer iterative development with clear communication on progress and potential changes. Before making any major architectural or design changes, please ask for confirmation. I value clear and concise explanations for technical decisions.

## System Architecture
The application is built on a modern web stack:
- **Frontend**: React 18, Vite, Tailwind CSS, and Framer Motion for a dynamic and responsive user interface.
- **AI Engine**: Utilizes `@mlc-ai/web-llm` with the Qwen 2.5 1.5B model, cached in IndexedDB for offline access and performance. All AI processing occurs client-side.
- **State Management**: Leverages React's `useState` and browser `localStorage` for persistent data storage without a backend database.
- **Routing**: `wouter` for efficient client-side navigation.
- **Server**: A minimal Express server solely for serving the Vite frontend assets; no application logic or API routes are handled server-side.
- **UI/UX Design**: Emphasizes a mobile-first responsive design, featuring a distinct purple-to-blue gradient color scheme, glass-panel effects, subtle background blurs, and uses Plus Jakarta Sans for display text and Inter for body text.
- **Core Features**: The application offers a growing catalog of 36 AI tools, including various generators (e.g., Hook, CTA, Cover Letter, Startup Name, Business Idea, Keyword, Hashtag, TikTok Caption, LinkedIn Post, Resume Bullet, Blog Outline, Essay Writer, Dating Profile, Meal Planner, Travel Planner, Schema Markup, Meta Description, SEO Title, Content Brief, Excuse) and analyzers (e.g., Tone Converter, Interview Answer, Document Analyzer, Message Analyzer, Explain This, Content Gap Analyzer, SERP Intent Analyzer, Internal Link Suggestion). Each tool integrates unique features like history tracking, favorites, specific output formats, and structured data generation.
- **Ad Integration**: Features reusable ad placeholder components (`AdBlock.tsx`) strategically placed on the homepage and within each tool page to support monetization through ad networks.

## External Dependencies
- **@mlc-ai/web-llm**: For in-browser AI model execution.
- **React 18**: Frontend JavaScript library.
- **Vite**: Next-generation frontend tooling.
- **Tailwind CSS**: Utility-first CSS framework.
- **Framer Motion**: React animation library.
- **wouter**: Small routing library for React.
- **Express**: Minimal web server to serve static assets.
- **pdfjs-dist**: (For Document Analyzer) A library for parsing and rendering PDFs in the browser.