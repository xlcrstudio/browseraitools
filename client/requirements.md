## Packages
@mlc-ai/web-llm | Local browser-based LLM engine for private, offline AI generation
framer-motion | Smooth page transitions and element animations
lucide-react | Beautiful, consistent iconography
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility to merge tailwind classes without style conflicts

## Notes
- 100% Client-side application. No backend API calls are made for the core functionality.
- WebLLM requires a browser with WebGPU support (Chrome 113+, Edge 113+, Mac Safari 18+ with flags).
- The model (Llama-3.1-8B) will be downloaded and cached in the browser's IndexedDB on first run.
