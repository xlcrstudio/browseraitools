import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { SiX, SiFacebook, SiWhatsapp, SiLinkedin } from "react-icons/si";
import { cn } from "@/lib/utils";

interface InlineShareButtonsProps {
  text?: string;
  className?: string;
}

export function InlineShareButtons({ text, className }: InlineShareButtonsProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const toolName =
    typeof document !== "undefined"
      ? (document.querySelector<HTMLElement>('[data-testid="text-tool-title"]')?.textContent?.trim() ||
          document.title.split(" — ")[0].split(" | ")[0] ||
          "this tool")
      : "this tool";

  const shareMsg = text
    ? `${text.slice(0, 200)}${text.length > 200 ? "..." : ""}`
    : `Just used ${toolName} on browseraitools.com — free AI tools that run 100% in your browser!`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMsg)}&url=${encodeURIComponent(url)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareMsg}\n${url}`)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const iconBtn = "w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700";

  return (
    <div className={cn("flex items-center gap-0.5", className)} data-testid="inline-share-buttons">
      <span className="text-[10px] font-semibold text-slate-300 dark:text-slate-600 uppercase tracking-widest mr-1 select-none">
        Share
      </span>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Post on X / Twitter"
        className={cn(iconBtn, "hover:text-slate-900 dark:hover:text-slate-100")}
        data-testid="inline-share-x"
      >
        <SiX className="w-3.5 h-3.5" />
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on Facebook"
        className={cn(iconBtn, "hover:text-[#1877F2]")}
        data-testid="inline-share-facebook"
      >
        <SiFacebook className="w-3.5 h-3.5" />
      </a>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on LinkedIn"
        className={cn(iconBtn, "hover:text-[#0A66C2]")}
        data-testid="inline-share-linkedin"
      >
        <SiLinkedin className="w-3.5 h-3.5" />
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on WhatsApp"
        className={cn(iconBtn, "hover:text-[#25D366]")}
        data-testid="inline-share-whatsapp"
      >
        <SiWhatsapp className="w-3.5 h-3.5" />
      </a>
      <button
        type="button"
        onClick={copyLink}
        title="Copy link"
        className={cn(iconBtn, "hover:text-purple-600")}
        data-testid="inline-share-copy-link"
      >
        {copiedLink ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
