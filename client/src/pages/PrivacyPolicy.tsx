import { Link } from "wouter";
import { useEffect } from "react";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-10 pb-8 border-b-2 border-slate-200">
        <span className="inline-block bg-gradient-primary text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
          Privacy-First AI
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mb-2" data-testid="heading-privacy">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500">Last Updated: March 6, 2026</p>
      </header>

      <div className="prose prose-slate max-w-none space-y-8">
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 rounded-r-lg">
          <h3 className="text-emerald-800 font-bold text-lg mt-0 mb-2">The Short Version (TL;DR)</h3>
          <p className="text-emerald-700 mb-0">
            <strong>We don't collect your data. Period.</strong> Browser AI Tools runs entirely in your browser using WebLLM technology. Your prompts, results, and usage never leave your device. We can't see what you're doing because there are no servers processing your requests.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">1. Introduction</h2>
          <p className="text-slate-600">Welcome to Browser AI Tools ("we," "our," or "us"). This Privacy Policy explains how we handle information when you use our browser-based AI tools available at browseraitools.com (the "Service").</p>
          <p className="text-slate-600">Unlike traditional AI services, Browser AI Tools is fundamentally different: <strong className="text-slate-800">all AI processing happens locally in your web browser</strong> using WebLLM technology. This means we genuinely don't collect, store, or transmit your data to our servers.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">2. Our Privacy-First Approach</h2>
          <h3 className="text-lg font-semibold text-slate-800">How Browser AI Tools Works</h3>
          <p className="text-slate-600">When you use our tools:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li><strong className="text-slate-800">AI Model Download:</strong> Your browser downloads the AI model once (stored in your browser's cache)</li>
            <li><strong className="text-slate-800">Local Processing:</strong> All text generation happens entirely on your device using WebLLM</li>
            <li><strong className="text-slate-800">No Server Calls:</strong> Your prompts and results never leave your browser</li>
            <li><strong className="text-slate-800">No Accounts:</strong> We don't require registration, so we have no user database</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg mt-4">
            <p className="text-blue-800 mb-0">
              <strong>Technical Note:</strong> We use WebLLM (Web Large Language Model) technology, which runs AI models directly in your browser using WebGPU. This is fundamentally different from services like ChatGPT or Claude, which send your data to cloud servers for processing.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">3. Information We DO NOT Collect</h2>
          <p className="text-slate-600">Because of our client-side architecture, we do not and cannot collect:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>Your prompts or input text</li>
            <li>AI-generated outputs or results</li>
            <li>Usage patterns or behavior analytics</li>
            <li>Personal information (names, emails, addresses)</li>
            <li>Account credentials (we don't have accounts)</li>
            <li>IP addresses linked to usage data</li>
            <li>Device fingerprints or identifiers</li>
            <li>Cookies for tracking purposes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">4. Information We DO Collect (Minimal)</h2>

          <h3 className="text-lg font-semibold text-slate-800">4.1 Website Analytics (Optional & Anonymous)</h3>
          <p className="text-slate-600">We may use privacy-respecting analytics services (such as Plausible or Fathom Analytics) to understand basic website traffic patterns. These services collect:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>Page views (which pages are visited)</li>
            <li>Referring websites (where visitors come from)</li>
            <li>General geographic location (country/city level only)</li>
            <li>Device type (mobile, desktop, tablet)</li>
          </ul>
          <p className="text-slate-600"><strong className="text-slate-800">Important:</strong> These analytics are:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>Completely anonymous (no personal identification)</li>
            <li>Aggregated (we see trends, not individual users)</li>
            <li>GDPR-compliant and do not use cookies</li>
            <li>Cannot be linked to your AI tool usage</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-800">4.2 Technical Logs (Server-Level Only)</h3>
          <p className="text-slate-600">Our web hosting provider may automatically log:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>Server access logs (IP address, timestamp, requested page)</li>
            <li>Error logs (for technical debugging)</li>
          </ul>
          <p className="text-slate-600">These logs are:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>Standard for all websites</li>
            <li>Retained for 30 days maximum</li>
            <li>Used only for security and technical maintenance</li>
            <li>Never analyzed or used for marketing</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">5. Browser-Based Storage</h2>

          <h3 className="text-lg font-semibold text-slate-800">What Your Browser Stores Locally</h3>
          <p className="text-slate-600">To improve your experience, your browser may store data locally on your device using:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li><strong className="text-slate-800">IndexedDB:</strong> Stores the downloaded AI model (prevents re-downloading on each visit)</li>
            <li><strong className="text-slate-800">LocalStorage:</strong> May store your preferences (theme, tool settings, generation history)</li>
            <li><strong className="text-slate-800">Browser Cache:</strong> Stores website files for faster loading</li>
          </ul>
          <p className="text-slate-600"><strong className="text-slate-800">Important:</strong> This data is stored entirely on YOUR device. We cannot access it. You can clear it anytime through your browser settings.</p>

          <h3 className="text-lg font-semibold text-slate-800">How to Clear Your Local Data</h3>
          <p className="text-slate-600"><strong className="text-slate-800">Chrome/Edge:</strong> Settings &rarr; Privacy and Security &rarr; Clear Browsing Data &rarr; Select "Cached images and files" and "Site settings"</p>
          <p className="text-slate-600"><strong className="text-slate-800">Firefox:</strong> Settings &rarr; Privacy & Security &rarr; Cookies and Site Data &rarr; Clear Data</p>
          <p className="text-slate-600"><strong className="text-slate-800">Safari:</strong> Preferences &rarr; Privacy &rarr; Manage Website Data &rarr; Remove browseraitools.com</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">6. Third-Party Services</h2>

          <h3 className="text-lg font-semibold text-slate-800">6.1 WebLLM / CDN Services</h3>
          <p className="text-slate-600">The AI models are delivered via Content Delivery Networks (CDNs) such as:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>jsdelivr.net (for WebLLM library)</li>
            <li>Hugging Face (for AI model files)</li>
          </ul>
          <p className="text-slate-600">When you first load the page, your browser downloads the AI model from these services. They may log your IP address as part of standard CDN operations, but they cannot see your prompts or generated content.</p>

          <h3 className="text-lg font-semibold text-slate-800">6.2 No Other Third-Party Services</h3>
          <p className="text-slate-600">We do not use:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>Google Analytics or similar tracking</li>
            <li>Social media pixels (Facebook, Twitter, etc.)</li>
            <li>Advertising networks</li>
            <li>Marketing automation tools</li>
            <li>Third-party AI APIs (OpenAI, Anthropic, etc.)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">7. Data Security</h2>
          <p className="text-slate-600">Since we don't collect your data, there's no centralized database to breach. However, we still take security seriously:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li><strong className="text-slate-800">HTTPS Encryption:</strong> All traffic to browseraitools.com uses TLS/SSL encryption</li>
            <li><strong className="text-slate-800">No Authentication:</strong> No passwords or credentials means no credential theft risk</li>
            <li><strong className="text-slate-800">Client-Side Processing:</strong> Your data never crosses network boundaries during AI generation</li>
            <li><strong className="text-slate-800">Open Source:</strong> WebLLM is open-source and auditable</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg mt-4">
            <p className="text-blue-800 mb-0">
              <strong>Your Responsibility:</strong> Since all processing happens on your device, your data security depends on your device security. Keep your browser updated and use antivirus software.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">8. Children's Privacy</h2>
          <p className="text-slate-600">Browser AI Tools is not directed at children under 13. Because we don't collect personal information, we don't knowingly collect data from children. Parents should supervise their children's internet usage.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">9. International Users & GDPR Compliance</h2>

          <h3 className="text-lg font-semibold text-slate-800">GDPR Rights</h3>
          <p className="text-slate-600">Under the EU General Data Protection Regulation (GDPR), you have rights regarding your personal data. Since we don't collect personal data, most GDPR provisions don't apply. However:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li><strong className="text-slate-800">Right to Access:</strong> We don't have data to provide</li>
            <li><strong className="text-slate-800">Right to Deletion:</strong> We don't store data to delete</li>
            <li><strong className="text-slate-800">Right to Data Portability:</strong> Not applicable (no data collected)</li>
            <li><strong className="text-slate-800">Right to Object:</strong> You can stop using the service anytime</li>
          </ul>
          <p className="text-slate-600">If you're concerned about the minimal analytics data (if enabled), contact us to request exclusion.</p>

          <h3 className="text-lg font-semibold text-slate-800">California Privacy Rights (CCPA)</h3>
          <p className="text-slate-600">California residents have specific privacy rights under CCPA. Since we don't sell personal information and don't collect personal data through our AI tools, most CCPA provisions don't apply. However:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>We don't sell your personal information</li>
            <li>We don't share personal information for cross-context behavioral advertising</li>
            <li>We don't collect sensitive personal information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">10. Cookies</h2>
          <p className="text-slate-600">We do not use cookies for tracking or advertising. Any cookies used are strictly necessary for website functionality (such as session management) and cannot be disabled without affecting the site's operation.</p>

          <h3 className="text-lg font-semibold text-slate-800">Essential Cookies Only</h3>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>Session cookies (if implemented for multi-page workflows)</li>
            <li>Preference cookies (theme, language settings)</li>
          </ul>
          <p className="text-slate-600">No consent banner is required because we don't use non-essential cookies.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">11. Changes to This Privacy Policy</h2>
          <p className="text-slate-600">We may update this Privacy Policy to reflect changes in our practices or for legal reasons. When we do:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>We'll update the "Last Updated" date at the top</li>
            <li>Significant changes will be highlighted on our website</li>
            <li>We'll maintain the same privacy-first principles</li>
          </ul>
          <p className="text-slate-600">Continued use of the Service after changes constitutes acceptance of the updated policy.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">12. Open Source & Transparency</h2>
          <p className="text-slate-600">We believe in transparency. Our website code may be made available as open source, allowing anyone to verify our privacy claims. WebLLM itself is open source and can be audited at <a href="https://github.com/mlc-ai/web-llm" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-medium">github.com/mlc-ai/web-llm</a>.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">13. Contact Us</h2>
          <p className="text-slate-600">If you have questions about this Privacy Policy or our privacy practices, please contact us:</p>
          <p className="text-slate-600">
            <strong className="text-slate-800">Email:</strong> privacy@browseraitools.com<br />
            <strong className="text-slate-800">Website:</strong> <a href="https://browseraitools.com" className="text-purple-600 hover:underline font-medium">browseraitools.com</a>
          </p>
        </section>

        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 rounded-r-lg">
          <h3 className="text-emerald-800 font-bold text-lg mt-0 mb-2">Why Choose Browser AI Tools?</h3>
          <p className="text-emerald-700 mb-0">
            Privacy isn't just a policy for us — it's our architecture. By running AI entirely in your browser, we've eliminated the biggest privacy risk: sending your data to cloud servers. Try our tools knowing your ideas, drafts, and creativity stay yours alone.
          </p>
        </div>

        <div className="pt-8 border-t-2 border-slate-200 text-center text-sm text-slate-500">
          <p className="font-semibold text-slate-700">Browser AI Tools</p>
          <p>Privacy-First AI Powered by WebLLM</p>
          <p>&copy; {new Date().getFullYear()} Browser AI Tools. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/" className="text-purple-600 hover:underline">Home</Link>
            {" | "}
            <Link href="/terms-of-service" className="text-purple-600 hover:underline">Terms of Service</Link>
            {" | "}
            <Link href="/privacy-policy" className="text-purple-600 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
