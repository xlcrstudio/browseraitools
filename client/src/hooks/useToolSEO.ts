import { useEffect } from "react";
import seoData from "../seo-metadata.json";

export interface ToolVariant {
  url: string;
  label: string;
}

export interface ToolRelated {
  slug: string;
  name: string;
  mainUrl: string;
  variantUrl: string | null;
}

export interface ToolSEOMeta {
  title: string;
  description: string;
  keywords: string;
  og: {
    title: string;
    description: string;
    url: string;
    image: string;
  };
  canonical: string;
  category?: string;
  variants?: ToolVariant[];
  related?: ToolRelated[];
}

type SeoData = {
  homepage: ToolSEOMeta;
  tools: Record<string, ToolSEOMeta>;
};

const data = seoData as SeoData;

/** Set a <meta> tag by name, creating it if absent. */
function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Set an Open Graph <meta> tag by property. */
function setOG(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Set <link rel="canonical"> */
function setCanonical(url: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

const DEFAULT_TITLE = "BrowserAITools — Free Private AI Tools | No Signup";

/**
 * useToolSEO
 * Pass a tool slug (e.g. "ai-chatbot") to get its SEO metadata
 * and automatically update document.title + meta tags on mount.
 * Pass null for the homepage.
 */
export function useToolSEO(slug: string | null): ToolSEOMeta | null {
  const meta: ToolSEOMeta | null =
    slug === null
      ? data.homepage
      : data.tools[slug] ?? null;

  useEffect(() => {
    if (!meta) return;

    document.title = meta.title;
    setMeta("description", meta.description);
    setMeta("keywords", meta.keywords);
    setOG("og:title", meta.og.title);
    setOG("og:description", meta.og.description);
    setOG("og:url", meta.og.url);
    setOG("og:image", meta.og.image);
    setOG("og:type", "website");
    if (meta.canonical) setCanonical(meta.canonical);

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [meta]);

  return meta;
}
