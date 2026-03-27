import React from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface ToolSchemaProps {
  faqs: FAQ[];
  toolName: string;
  toolDescription: string;
  category?: string;
}

const ToolSchema: React.FC<ToolSchemaProps> = ({ 
  faqs, 
  toolName, 
  toolDescription, 
  category = "ProductivityApplication" 
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": toolName,
        "description": toolDescription,
        "applicationCategory": category,
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "author": {
          "@type": "Organization",
          "name": "BrowserAITools"
        },
        "url": typeof window !== "undefined" ? `https://browseraitools.com${window.location.pathname}` : "https://browseraitools.com",
        "featureList": [
          "Runs 100% in-browser with WebLLM",
          "100% Private - nothing leaves your device",
          "Unlimited free use",
          "No sign-up required"
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default ToolSchema;
