import { useState } from "react";
import { Share2, Linkedin, Link as LinkIcon, Check } from "lucide-react";
import { SiX, SiFacebook, SiInstagram, SiTiktok } from "react-icons/si";

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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentUrl = url || (typeof window !== "undefined"
    ? `https://browseraitools.com${window.location.pathname}`
    : "https://browseraitools.com");

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

  const copyThen = (id: string, destination: string) => {
    navigator.clipboard.writeText(`${shareText}\n${currentUrl}`);
    setCopiedId(id);
    setTimeout(() => {
      window.open(destination, "_blank", "noopener,noreferrer");
      setTimeout(() => setCopiedId(null), 2000);
    }, 300);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedId("link");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const btnClass =
    "flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-sm font-medium rounded-xl bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-10" data-testid="section-share-buttons">
      <p className="text-center text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
        Share this tool
      </p>

      <div className="flex flex-wrap gap-2.5 justify-center">
        {"share" in navigator && (
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium rounded-xl hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors"
            data-testid="button-native-share"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
        )}

        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
          data-testid="link-share-twitter"
        >
          <SiX className="w-3.5 h-3.5" /> Post
        </a>

        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
          data-testid="link-share-linkedin"
        >
          <Linkedin className="w-4 h-4 text-[#0A66C2]" /> LinkedIn
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
          data-testid="link-share-facebook"
        >
          <SiFacebook className="w-4 h-4 text-[#1877F2]" /> Facebook
        </a>

        <button
          onClick={() => copyThen("instagram", "https://www.instagram.com")}
          className={btnClass}
          data-testid="button-share-instagram"
          title="Copies text to clipboard, then opens Instagram so you can paste it"
        >
          {copiedId === "instagram"
            ? <Check className="w-4 h-4 text-green-500" />
            : <SiInstagram className="w-4 h-4 text-[#E1306C]" />}
          {copiedId === "instagram" ? "Copied!" : "Instagram"}
        </button>

        <button
          onClick={() => copyThen("tiktok", "https://www.tiktok.com")}
          className={btnClass}
          data-testid="button-share-tiktok"
          title="Copies text to clipboard, then opens TikTok so you can paste it"
        >
          {copiedId === "tiktok"
            ? <Check className="w-4 h-4 text-green-500" />
            : <SiTiktok className="w-4 h-4" />}
          {copiedId === "tiktok" ? "Copied!" : "TikTok"}
        </button>

        <button
          onClick={copyUrl}
          className={btnClass}
          data-testid="button-copy-link"
        >
          {copiedId === "link"
            ? <Check className="w-4 h-4 text-green-500" />
            : <LinkIcon className="w-4 h-4" />}
          {copiedId === "link" ? "Copied!" : "Copy Link"}
        </button>
      </div>

      <p className="text-center text-[11px] text-slate-300 dark:text-slate-600 mt-2.5">
        Instagram & TikTok: text is copied to your clipboard — just paste it when the app opens
      </p>
    </div>
  );
};

export default ShareResultButtons;
