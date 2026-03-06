# Reusable Component Architecture for Browser AI Tools
## Build All 50 Tools 10x Faster

---

## 🏗️ Architecture Overview

This component structure allows you to build all 50 AI tools by:
1. **Reusing 80% of code** across tools
2. **Sharing WebLLM instance** (load once, use everywhere)
3. **Consistent UX** across all tools
4. **Rapid development** (new tool in 1-2 hours instead of days)

---

## 📁 File Structure

```
/src
├── /components
│   ├── /shared              # Used across ALL tools
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ModelStatus.jsx
│   │   ├── GenerateButton.jsx
│   │   ├── OutputCard.jsx
│   │   ├── CopyButton.jsx
│   │   ├── ExportButton.jsx
│   │   ├── LoadingState.jsx
│   │   └── ToolWrapper.jsx
│   │
│   ├── /tool-specific       # Unique per tool
│   │   ├── /hook-generator
│   │   │   ├── HookInputForm.jsx
│   │   │   ├── HookOutputCard.jsx
│   │   │   └── HookExamples.jsx
│   │   │
│   │   ├── /cta-generator
│   │   │   ├── CTAInputForm.jsx
│   │   │   ├── CTAOutputCard.jsx
│   │   │   ├── CTACategoryBadge.jsx
│   │   │   └── CTAExamples.jsx
│   │   │
│   │   └── /[future-tools]
│   │
│   └── /seo
│       ├── SEOArticle.jsx
│       └── SchemaMarkup.jsx
│
├── /lib
│   ├── webllm-manager.js    # Singleton WebLLM instance
│   ├── prompt-builder.js    # Prompt engineering utilities
│   ├── output-parser.js     # Parse AI responses
│   └── storage.js           # LocalStorage utilities
│
├── /hooks
│   ├── useWebLLM.js         # WebLLM hook for all tools
│   ├── useGeneration.js     # Generation logic hook
│   └── useLocalStorage.js   # Persist data hook
│
├── /config
│   ├── tools-config.js      # All 50 tools metadata
│   ├── prompt-templates.js  # Prompt templates
│   └── seo-config.js        # SEO metadata per tool
│
└── /pages
    ├── index.jsx            # Homepage listing all tools
    ├── hook-generator.jsx
    ├── cta-generator.jsx
    └── [all-other-tools].jsx
```

---

## 🧩 Shared Component Library

### 1. **Header.jsx** (Site-Wide Navigation)

```jsx
// /components/shared/Header.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS_CONFIG } from '@/config/tools-config';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🔒</span>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Browser AI Tools
            </span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Tools Dropdown */}
            <ToolsDropdown tools={TOOLS_CONFIG} />
            
            <Link to="/about" className="text-gray-700 hover:text-purple-600">
              About
            </Link>
            <Link to="/privacy" className="text-gray-700 hover:text-purple-600">
              Privacy
            </Link>
            
            {/* Badge */}
            <div className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-full">
              100% Private • 100% Free
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {/* Hamburger icon */}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && <MobileMenu tools={TOOLS_CONFIG} />}
    </header>
  );
};
```

---

### 2. **ModelStatus.jsx** (WebLLM Loading Indicator)

```jsx
// /components/shared/ModelStatus.jsx

import { useWebLLM } from '@/hooks/useWebLLM';

export const ModelStatus = () => {
  const { status, progress, error } = useWebLLM();
  
  if (status === 'ready') {
    return (
      <div className="flex items-center space-x-2 text-emerald-600 text-sm">
        <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full"></span>
        <span>AI Model Ready</span>
      </div>
    );
  }
  
  if (status === 'loading') {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-blue-600 text-sm">
          <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <span>Downloading AI model... {progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500">
          First-time setup takes 30-60s. Your browser will cache this for future visits.
        </p>
      </div>
    );
  }
  
  if (status === 'error') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 font-semibold">AI Model Error</p>
        <p className="text-sm text-red-600 mt-1">{error}</p>
        <p className="text-xs text-red-500 mt-2">
          Browser AI Tools requires WebGPU support. Please use Chrome 113+ or Edge 113+.
        </p>
      </div>
    );
  }
  
  return null;
};
```

---

### 3. **GenerateButton.jsx** (Universal Generate Button)

```jsx
// /components/shared/GenerateButton.jsx

export const GenerateButton = ({ 
  onClick, 
  isGenerating, 
  isDisabled,
  text = "Generate",
  loadingText = "Generating...",
  icon = "🎯"
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled || isGenerating}
      className={`
        w-full md:w-auto
        px-8 py-4
        bg-gradient-to-r from-purple-600 to-blue-600
        text-white font-semibold text-lg
        rounded-xl
        shadow-lg hover:shadow-xl
        transform hover:scale-105
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        flex items-center justify-center space-x-2
      `}
    >
      {isGenerating ? (
        <>
          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          <span>{icon}</span>
          <span>{text}</span>
        </>
      )}
    </button>
  );
};
```

---

### 4. **OutputCard.jsx** (Generic Output Display)

```jsx
// /components/shared/OutputCard.jsx

import { CopyButton } from './CopyButton';

export const OutputCard = ({ 
  content, 
  category = null,
  charCount = null,
  onCopy,
  actions = []
}) => {
  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
      {/* Header with category badge */}
      {category && (
        <div className="flex items-center justify-between mb-3">
          <span className={`
            px-3 py-1 rounded-full text-xs font-semibold
            ${getCategoryColor(category)}
          `}>
            {category}
          </span>
          {charCount && (
            <span className="text-xs text-gray-500">{charCount} characters</span>
          )}
        </div>
      )}
      
      {/* Main content */}
      <p className="text-lg text-gray-900 font-medium leading-relaxed mb-4">
        {content}
      </p>
      
      {/* Actions */}
      <div className="flex items-center space-x-3">
        <CopyButton text={content} onCopy={onCopy} />
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const getCategoryColor = (category) => {
  const colors = {
    urgency: 'bg-orange-100 text-orange-700',
    benefit: 'bg-emerald-100 text-emerald-700',
    curiosity: 'bg-purple-100 text-purple-700',
    'risk-free': 'bg-blue-100 text-blue-700',
    action: 'bg-amber-100 text-amber-700',
  };
  return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-700';
};
```

---

### 5. **CopyButton.jsx** (Copy to Clipboard)

```jsx
// /components/shared/CopyButton.jsx

import { useState } from 'react';

export const CopyButton = ({ text, onCopy }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  return (
    <button
      onClick={handleCopy}
      className="group flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium text-emerald-600">Copied!</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">Copy</span>
        </>
      )}
    </button>
  );
};
```

---

### 6. **ToolWrapper.jsx** (Page Layout Template)

```jsx
// /components/shared/ToolWrapper.jsx

import { Header } from './Header';
import { Footer } from './Footer';
import { ModelStatus } from './ModelStatus';
import { SEOHead } from '@/components/seo/SEOHead';

export const ToolWrapper = ({ 
  children,
  toolName,
  description,
  seoConfig
}) => {
  return (
    <>
      <SEOHead {...seoConfig} />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Tool Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {toolName}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              {description}
            </p>
            
            {/* Model Status */}
            <div className="flex justify-center mb-8">
              <ModelStatus />
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <span>🎯</span>
                <span>Conversion-Focused</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>💰</span>
                <span>Always Free</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>🔒</span>
                <span>100% Private</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>⚡</span>
                <span>Instant Results</span>
              </span>
            </div>
          </div>
          
          {/* Tool Content */}
          {children}
        </main>
        
        <Footer />
      </div>
    </>
  );
};
```

---

## 🔧 Core Hooks

### useWebLLM.js (Shared WebLLM Instance)

```javascript
// /hooks/useWebLLM.js

import { createContext, useContext, useState, useEffect } from 'react';
import * as webllm from '@mlc-ai/web-llm';

const WebLLMContext = createContext();

export const WebLLMProvider = ({ children }) => {
  const [engine, setEngine] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    initializeEngine();
  }, []);
  
  const initializeEngine = async () => {
    try {
      setStatus('loading');
      
      // Check WebGPU support
      if (!navigator.gpu) {
        throw new Error('WebGPU not supported. Use Chrome 113+ or Edge 113+');
      }
      
      // Create engine with progress tracking
      const engineInstance = await webllm.CreateMLCEngine(
        "Llama-3.1-8B-Instruct-q4f16_1-MLC",
        {
          initProgressCallback: (report) => {
            setProgress(Math.round(report.progress * 100));
          }
        }
      );
      
      setEngine(engineInstance);
      setStatus('ready');
    } catch (err) {
      console.error('WebLLM initialization error:', err);
      setError(err.message);
      setStatus('error');
    }
  };
  
  return (
    <WebLLMContext.Provider value={{ engine, status, progress, error }}>
      {children}
    </WebLLMContext.Provider>
  );
};

export const useWebLLM = () => {
  const context = useContext(WebLLMContext);
  if (!context) {
    throw new Error('useWebLLM must be used within WebLLMProvider');
  }
  return context;
};
```

---

### useGeneration.js (Universal Generation Hook)

```javascript
// /hooks/useGeneration.js

import { useState } from 'react';
import { useWebLLM } from './useWebLLM';

export const useGeneration = () => {
  const { engine, status } = useWebLLM();
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  
  const generate = async (systemPrompt, userPrompt, options = {}) => {
    if (status !== 'ready' || !engine) {
      throw new Error('AI model not ready');
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await engine.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: options.temperature || 0.8,
        max_tokens: options.maxTokens || 600,
        stream: options.stream !== false // Default to streaming
      });
      
      if (options.stream !== false) {
        // Handle streaming
        let fullText = '';
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          fullText += content;
          options.onProgress?.(fullText);
        }
        return fullText;
      } else {
        // Non-streaming
        return response.choices[0]?.message?.content || '';
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    generate,
    isGenerating,
    results,
    error,
    canGenerate: status === 'ready'
  };
};
```

---

## ⚙️ Configuration Files

### tools-config.js (All 50 Tools Metadata)

```javascript
// /config/tools-config.js

export const TOOLS_CONFIG = [
  {
    id: 'hook-generator',
    name: 'AI Hook Generator',
    slug: '/hook-generator',
    description: 'Generate viral hooks for YouTube, TikTok, blogs & ads',
    category: 'writing',
    searchVolume: 80000,
    icon: '🎣',
    color: 'purple'
  },
  {
    id: 'cta-generator',
    name: 'AI CTA Generator',
    slug: '/cta-generator',
    description: 'Create high-converting call-to-action phrases',
    category: 'marketing',
    searchVolume: 40000,
    icon: '🎯',
    color: 'blue'
  },
  {
    id: 'tone-converter',
    name: 'AI Tone Converter',
    slug: '/tone-converter',
    description: 'Convert text tone: professional, friendly, persuasive, casual',
    category: 'writing',
    searchVolume: 70000,
    icon: '🎭',
    color: 'emerald'
  },
  // ... all 50 tools
];

export const TOOL_CATEGORIES = {
  writing: 'Writing Tools',
  social: 'Social Media',
  business: 'Business',
  marketing: 'Marketing',
  seo: 'SEO Tools',
  career: 'Job & Career',
  productivity: 'Productivity',
  unique: 'Unique Tools'
};
```

---

## 🚀 Tool Template (Copy for Each New Tool)

```jsx
// /pages/cta-generator.jsx

import { useState } from 'react';
import { ToolWrapper } from '@/components/shared/ToolWrapper';
import { GenerateButton } from '@/components/shared/GenerateButton';
import { OutputCard } from '@/components/shared/OutputCard';
import { useGeneration } from '@/hooks/useGeneration';
import { CTAInputForm } from '@/components/tool-specific/cta-generator/CTAInputForm';
import { SEO_CONFIG } from '@/config/seo-config';
import { buildCTAPrompt } from '@/lib/prompt-builder';

export default function CTAGenerator() {
  const { generate, isGenerating, canGenerate } = useGeneration();
  const [formData, setFormData] = useState({
    product: '',
    audience: '',
    goal: '',
    platform: 'all',
    tone: 'persuasive'
  });
  const [ctas, setCTAs] = useState([]);
  
  const handleGenerate = async () => {
    const { systemPrompt, userPrompt } = buildCTAPrompt(formData);
    
    const result = await generate(systemPrompt, userPrompt, {
      onProgress: (text) => {
        // Update UI with partial results
        const parsed = parseCTAs(text);
        setCTAs(parsed);
      }
    });
    
    const finalCTAs = parseCTAs(result);
    setCTAs(categorizeCTAs(finalCTAs));
  };
  
  return (
    <ToolWrapper
      toolName="AI Call-to-Action Generator"
      description="Generate high-converting CTAs for your marketing campaigns"
      seoConfig={SEO_CONFIG.ctaGenerator}
    >
      {/* Input Form */}
      <CTAInputForm 
        data={formData}
        onChange={setFormData}
      />
      
      {/* Generate Button */}
      <div className="text-center my-8">
        <GenerateButton
          onClick={handleGenerate}
          isGenerating={isGenerating}
          isDisabled={!canGenerate || !formData.product}
          text="Generate CTAs"
          icon="🎯"
        />
      </div>
      
      {/* Results */}
      {ctas.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Generated CTAs ({ctas.length})</h2>
          <div className="grid gap-4">
            {ctas.map((cta, index) => (
              <OutputCard
                key={index}
                content={cta.text}
                category={cta.category}
                charCount={cta.charCount}
              />
            ))}
          </div>
        </div>
      )}
    </ToolWrapper>
  );
}
```

---

## ⚡ Quick Start Guide

### To Add a New Tool (5 Steps):

1. **Add to config** (`tools-config.js`):
```javascript
{
  id: 'sentence-expander',
  name: 'AI Sentence Expander',
  slug: '/sentence-expander',
  // ...
}
```

2. **Create page** (`/pages/sentence-expander.jsx`):
```jsx
// Copy tool template above, customize form/prompts
```

3. **Create input form** (`/components/tool-specific/sentence-expander/InputForm.jsx`):
```jsx
// Tool-specific input fields
```

4. **Build prompt** (`/lib/prompt-builder.js`):
```javascript
export const buildSentenceExpanderPrompt = (formData) => {
  // Return { systemPrompt, userPrompt }
}
```

5. **Add SEO config** (`/config/seo-config.js`):
```javascript
sentenceExpander: {
  title: '...',
  description: '...',
  // ...
}
```

**That's it!** You now have a fully functional new tool.

---

## 📊 Benefits of This Architecture

✅ **80% code reuse** across all tools  
✅ **Shared WebLLM instance** (load once, use everywhere)  
✅ **Consistent UX** (users learn once, use all tools)  
✅ **Rapid development** (new tool in 1-2 hours)  
✅ **Easy maintenance** (fix once, all tools benefit)  
✅ **Scalable** (add 50 more tools easily)  

---

This architecture will let you build all 50 tools in weeks instead of months!
