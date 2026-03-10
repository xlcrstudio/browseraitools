import { useState } from "react";
import { Share2, Linkedin, Link as LinkIcon } from "lucide-react";
import { SiX } from "react-icons/si";

interface ShareResultButtonsProps {
  toolName: string;
  resultText?: string;
  url?: string;
}

const ShareResultButtons: React.FC<ShareResultButtonsProps> = ({
  toolName,
  resultText = "",
  url,
}) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const shareText = resultText
    ? `Just used ${toolName} — ${resultText.slice(0, 120)}...`
    : `Just used the free private ${toolName} on browseraitools.com — runs in browser, 100% private!`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: toolName, text: shareText, url: currentUrl });
      } catch {}
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-10" data-testid="section-share-buttons">
      <div className="flex flex-wrap gap-3 justify-center">
        {"share" in navigator && (
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium rounded-xl hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors"
            data-testid="button-native-share"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
        )}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-sm font-medium rounded-xl bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
          data-testid="link-share-twitter"
        >
          <SiX className="w-3.5 h-3.5" /> Post
        </a>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-sm font-medium rounded-xl bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
          data-testid="link-share-linkedin"
        >
          <Linkedin className="w-4 h-4 text-[#0A66C2]" /> LinkedIn
        </a>
        <button
          onClick={copyUrl}
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-sm font-medium rounded-xl bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
          data-testid="button-copy-link"
        >
          <LinkIcon className="w-4 h-4" /> {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
};

export default ShareResultButtons;
