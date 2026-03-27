import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Home, ChevronRight, Share2, Copy, Check } from "lucide-react";
import { SiLinkedin, SiWhatsapp, SiFacebook } from "react-icons/si";
import { ModelSelector } from "@/components/ModelSelector";
import { cn } from "@/lib/utils";

interface ToolPageHeaderProps {
  toolName: string;
  icon?: any;
}

function ShareDropdown({ toolName }: { toolName: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = `Just used "${toolName}" — a free AI tool that runs 100% in your browser, no data sent to any server.`;

  const platforms = [
    {
      label: "X / Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: "hover:text-slate-900 dark:hover:text-slate-100",
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      icon: <SiLinkedin className="w-3.5 h-3.5" />,
      color: "hover:text-[#0A66C2]",
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
      icon: <SiWhatsapp className="w-3.5 h-3.5" />,
      color: "hover:text-[#25D366]",
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      icon: <SiFacebook className="w-3.5 h-3.5" />,
      color: "hover:text-[#1877F2]",
    },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => { setCopied(false); setOpen(false); }, 1500);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        data-testid="button-share"
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors",
          "text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20",
          open && "text-purple-600 bg-purple-50 dark:bg-purple-900/20"
        )}
      >
        <Share2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Share</span>
      </button>

      {open && (
        <div className={cn(
          "absolute right-0 top-full mt-2 z-50 w-44",
          "bg-white dark:bg-slate-900 rounded-xl shadow-lg shadow-slate-200/60 dark:shadow-black/30",
          "border border-slate-100 dark:border-slate-800 overflow-hidden"
        )}>
          <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest px-3 pt-3 pb-1">
            Share this tool
          </p>

          {platforms.map(p => (
            <a
              key={p.label}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`share-${p.label.toLowerCase().replace(/[^a-z]/g, "-")}`}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 transition-colors",
                "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                p.color
              )}
            >
              {p.icon}
              {p.label}
            </a>
          ))}

          <div className="border-t border-slate-50 dark:border-slate-800 mx-2 my-1" />

          <button
            type="button"
            onClick={copyLink}
            data-testid="share-copy-link"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-purple-600 transition-colors mb-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Link copied!" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}

export function ToolPageHeader({ toolName, icon: Icon }: ToolPageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 md:mb-8">
      <Link
        href="/"
        data-testid="link-tool-home"
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors group"
      >
        <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-purple-50 flex items-center justify-center transition-colors">
          <Home className="w-4 h-4 text-slate-500 group-hover:text-purple-600 transition-colors" />
        </div>
        <span className="hidden sm:inline">Home</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
      </Link>

      <div className="flex items-center gap-2">
        <ShareDropdown toolName={toolName} />
        <ModelSelector />
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-sm">
            <Icon className="w-4 h-4 text-white" />
          </div>
        )}
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-800 dark:text-slate-100" data-testid="text-tool-title">
          {toolName}
        </h1>
      </div>
    </div>
  );
}
