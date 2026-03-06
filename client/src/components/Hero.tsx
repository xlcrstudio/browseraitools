import { motion } from "framer-motion";
import { Zap, Cpu, Lock } from "lucide-react";

export function Hero() {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-6 ring-1 ring-purple-200/50 shadow-sm">
          <SparklesIcon className="w-4 h-4" />
          Powered by Llama 3 running directly in your browser
        </div>
      </motion.div>

      <motion.h1 
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display leading-tight mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Generate Viral Hooks <br className="hidden md:block"/>
        <span className="text-gradient">in Seconds.</span>
      </motion.h1>

      <motion.p 
        className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Stop staring at a blank page. Create irresistible hooks for Twitter, LinkedIn, YouTube, and TikTok using offline, private AI.
      </motion.p>

      <motion.div 
        className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          <Lock className="w-4 h-4 text-emerald-500" />
          No Servers (100% Private)
        </div>
        <div className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          <Zap className="w-4 h-4 text-amber-500" />
          Always Free
        </div>
        <div className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          <Cpu className="w-4 h-4 text-blue-500" />
          Works Offline
        </div>
      </motion.div>
    </div>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}
