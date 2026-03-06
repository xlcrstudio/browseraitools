import { Link } from "wouter";
import { useEffect } from "react";

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-10 pb-8 border-b-2 border-slate-200">
        <span className="inline-block bg-gradient-primary text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
          Free & Open
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mb-2" data-testid="heading-terms">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500">Last Updated: March 6, 2026</p>
      </header>

      <div className="prose prose-slate max-w-none space-y-8">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg">
          <h3 className="text-blue-800 font-bold text-lg mt-0 mb-2">The Simple Version</h3>
          <p className="text-blue-800 mb-0">
            <strong>Use our tools freely and responsibly.</strong> Browser AI Tools is free, browser-based, and runs locally on your device. Don't use it for illegal stuff, don't abuse it, and understand that AI-generated content may have errors. That's pretty much it.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p className="text-slate-600">By accessing or using Browser AI Tools ("the Service"), available at browseraitools.com, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.</p>
          <p className="text-slate-600">These Terms constitute a legally binding agreement between you ("User," "you," or "your") and Browser AI Tools ("we," "us," or "our").</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">2. Description of Service</h2>

          <h3 className="text-lg font-semibold text-slate-800">2.1 What Browser AI Tools Provides</h3>
          <p className="text-slate-600">Browser AI Tools is a collection of browser-based AI tools that run entirely on your device using WebLLM (Web Large Language Model) technology. Our Service includes, but is not limited to:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>Text generation tools (hooks, captions, outlines, etc.)</li>
            <li>Content improvement tools (rewriters, tone converters, etc.)</li>
            <li>Business and marketing tools (name generators, pitch generators, etc.)</li>
            <li>Productivity tools (planners, summarizers, etc.)</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-800">2.2 How It Works</h3>
          <p className="text-slate-600">Unlike traditional AI services:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>All AI processing happens <strong className="text-slate-800">locally in your browser</strong></li>
            <li>Your prompts and results <strong className="text-slate-800">never leave your device</strong></li>
            <li>No account registration or login is required</li>
            <li>The Service is provided <strong className="text-slate-800">completely free of charge</strong></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">3. No Account Required</h2>
          <p className="text-slate-600">Browser AI Tools does not require account creation, registration, or authentication. You can use the Service anonymously without providing any personal information.</p>
          <p className="text-slate-600">Since there are no accounts, there are no usernames, passwords, or associated account security responsibilities on our part.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">4. Acceptable Use Policy</h2>

          <h3 className="text-lg font-semibold text-slate-800">4.1 Permitted Uses</h3>
          <p className="text-slate-600">You may use Browser AI Tools for:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>Personal, educational, or commercial content creation</li>
            <li>Business and marketing purposes</li>
            <li>Creative writing and brainstorming</li>
            <li>Productivity and organizational tasks</li>
            <li>Any lawful purpose that doesn't violate these Terms</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-800">4.2 Prohibited Uses</h3>
          <p className="text-slate-600">You agree NOT to use Browser AI Tools for:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li><strong className="text-slate-800">Illegal Activities:</strong> Any purpose that violates local, state, national, or international law</li>
            <li><strong className="text-slate-800">Harmful Content:</strong> Generating content that promotes violence, terrorism, child exploitation, or harm to individuals or groups</li>
            <li><strong className="text-slate-800">Harassment:</strong> Creating content intended to harass, bully, threaten, or intimidate others</li>
            <li><strong className="text-slate-800">Misinformation:</strong> Deliberately generating false information intended to deceive or mislead</li>
            <li><strong className="text-slate-800">Spam:</strong> Mass-generating low-quality content for spam purposes</li>
            <li><strong className="text-slate-800">Impersonation:</strong> Creating content that impersonates others with malicious intent</li>
            <li><strong className="text-slate-800">Malware Distribution:</strong> Using the Service to generate code or content designed to harm computer systems</li>
            <li><strong className="text-slate-800">Circumventing Security:</strong> Attempting to hack, reverse engineer, or compromise the Service</li>
            <li><strong className="text-slate-800">Automated Abuse:</strong> Using bots or automated systems to overwhelm or abuse the Service</li>
          </ul>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-lg mt-4">
            <p className="text-amber-900 mb-0">
              <strong>Important:</strong> While we cannot monitor your usage (due to our client-side architecture), you are still responsible for using the Service ethically and legally. Violations of these Terms may result in legal action.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">5. Intellectual Property Rights</h2>

          <h3 className="text-lg font-semibold text-slate-800">5.1 Service Ownership</h3>
          <p className="text-slate-600">The Browser AI Tools website, including its design, code, branding, and documentation, is owned by us and protected by copyright, trademark, and other intellectual property laws.</p>

          <h3 className="text-lg font-semibold text-slate-800">5.2 AI-Generated Content Ownership</h3>
          <p className="text-slate-600"><strong className="text-slate-800">You own the content you generate.</strong> Any text, ideas, or outputs created using our tools belong to you, subject to these important conditions:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li><strong className="text-slate-800">No Guarantees of Uniqueness:</strong> AI models may generate similar content for different users. We cannot guarantee your generated content is unique or doesn't overlap with content created by others.</li>
            <li><strong className="text-slate-800">Third-Party Rights:</strong> You are responsible for ensuring your use of AI-generated content doesn't infringe on third-party intellectual property rights.</li>
            <li><strong className="text-slate-800">Attribution Not Required:</strong> You don't need to credit Browser AI Tools for generated content, though we appreciate it!</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-800">5.3 WebLLM and Open Source</h3>
          <p className="text-slate-600">Browser AI Tools uses WebLLM, an open-source project, and open-source AI models. These components are licensed under their respective open-source licenses. Our use of these tools complies with their license terms.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">6. Service Availability & Modifications</h2>

          <h3 className="text-lg font-semibold text-slate-800">6.1 "As-Is" Service</h3>
          <p className="text-slate-600">Browser AI Tools is provided on an "as-is" and "as-available" basis. We make no guarantees about:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>Continuous availability or uptime</li>
            <li>Compatibility with all browsers or devices</li>
            <li>Error-free operation</li>
            <li>Future availability of specific tools or features</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-800">6.2 Browser & Device Requirements</h3>
          <p className="text-slate-600">To use Browser AI Tools, you need:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>A modern web browser with WebGPU support (Chrome 113+, Edge 113+, or equivalent)</li>
            <li>Sufficient device memory and processing power</li>
            <li>JavaScript enabled</li>
            <li>An internet connection (for initial model download; offline thereafter)</li>
          </ul>
          <p className="text-slate-600">We are not responsible if the Service doesn't work on your specific browser or device.</p>

          <h3 className="text-lg font-semibold text-slate-800">6.3 Service Modifications</h3>
          <p className="text-slate-600">We reserve the right to:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>Modify, suspend, or discontinue any part of the Service at any time</li>
            <li>Add or remove tools and features</li>
            <li>Update AI models used by the Service</li>
            <li>Change these Terms (with notice as specified in Section 14)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">7. Disclaimers & Limitations of Liability</h2>

          <h3 className="text-lg font-semibold text-slate-800">7.1 AI Output Accuracy</h3>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-r-lg">
            <p className="text-amber-900 font-semibold mb-1">AI-Generated Content May Be Inaccurate</p>
            <p className="text-amber-900 mb-0">
              AI models can produce errors, biases, inappropriate content, or factually incorrect information. You are responsible for reviewing and verifying all AI-generated content before using it. We are not responsible for any consequences of using AI-generated content.
            </p>
          </div>

          <h3 className="text-lg font-semibold text-slate-800">7.2 No Professional Advice</h3>
          <p className="text-slate-600">Browser AI Tools does NOT provide:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>Legal advice (consult a licensed attorney)</li>
            <li>Medical advice (consult a licensed healthcare provider)</li>
            <li>Financial advice (consult a licensed financial advisor)</li>
            <li>Professional counseling or therapy</li>
          </ul>
          <p className="text-slate-600">Do not rely on AI-generated content as a substitute for professional expertise.</p>

          <h3 className="text-lg font-semibold text-slate-800">7.3 No Warranties</h3>
          <p className="text-slate-600">TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>Warranties of merchantability</li>
            <li>Fitness for a particular purpose</li>
            <li>Non-infringement</li>
            <li>Accuracy or reliability of outputs</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-800">7.4 Limitation of Liability</h3>
          <p className="text-slate-600">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>WE ARE NOT LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</li>
            <li>WE ARE NOT LIABLE FOR ANY LOSS OF PROFITS, DATA, BUSINESS OPPORTUNITIES, OR GOODWILL</li>
            <li>OUR TOTAL LIABILITY FOR ANY CLAIM RELATED TO THE SERVICE IS LIMITED TO $100 USD</li>
          </ul>
          <p className="text-slate-600">This limitation applies even if we've been advised of the possibility of such damages.</p>

          <h3 className="text-lg font-semibold text-slate-800">7.5 Basis of the Bargain</h3>
          <p className="text-slate-600">These disclaimers and limitations are fundamental elements of the agreement between you and us. The Service is provided free of charge, and these limitations reflect that.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">8. Indemnification</h2>
          <p className="text-slate-600">You agree to indemnify, defend, and hold harmless Browser AI Tools, its affiliates, and their respective officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses (including reasonable attorneys' fees) arising from:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>Your use or misuse of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party rights, including intellectual property rights</li>
            <li>Content you generate using the Service</li>
            <li>Any illegal or harmful activities conducted using the Service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">9. Privacy & Data</h2>
          <p className="text-slate-600">Your use of Browser AI Tools is subject to our <Link href="/privacy-policy" className="text-purple-600 hover:underline font-medium">Privacy Policy</Link>. Key points:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>We don't collect your prompts or AI-generated outputs</li>
            <li>All AI processing happens locally in your browser</li>
            <li>No account data exists (since there are no accounts)</li>
            <li>See our Privacy Policy for complete details</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">10. Copyright & DMCA</h2>

          <h3 className="text-lg font-semibold text-slate-800">10.1 Copyright Infringement</h3>
          <p className="text-slate-600">We respect intellectual property rights. If you believe content on our website (not AI-generated content, which we don't host) infringes your copyright, please contact us with:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>Your contact information</li>
            <li>Description of the copyrighted work</li>
            <li>Location of the allegedly infringing material</li>
            <li>A statement of good faith belief that use is unauthorized</li>
            <li>A statement under penalty of perjury that your notice is accurate</li>
            <li>Your physical or electronic signature</li>
          </ul>
          <p className="text-slate-600"><strong className="text-slate-800">Copyright Agent:</strong> dmca@browseraitools.com</p>

          <h3 className="text-lg font-semibold text-slate-800">10.2 AI-Generated Content & Copyright</h3>
          <p className="text-slate-600">AI-generated content may inadvertently resemble existing copyrighted works. You are responsible for ensuring your use of AI-generated content complies with copyright law.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">11. Third-Party Links & Services</h2>
          <p className="text-slate-600">Browser AI Tools may contain links to third-party websites or services (such as CDNs hosting WebLLM). We are not responsible for:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>The content or practices of third-party websites</li>
            <li>Third-party terms of service or privacy policies</li>
            <li>Availability or reliability of third-party services</li>
          </ul>
          <p className="text-slate-600">Your use of third-party services is at your own risk.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">12. Governing Law & Dispute Resolution</h2>

          <h3 className="text-lg font-semibold text-slate-800">12.1 Governing Law</h3>
          <p className="text-slate-600">These Terms are governed by the laws of Delaware, United States, without regard to conflict of law principles.</p>

          <h3 className="text-lg font-semibold text-slate-800">12.2 Dispute Resolution</h3>
          <p className="text-slate-600">Any disputes arising from these Terms or your use of the Service shall be resolved through:</p>
          <ol className="list-decimal pl-6 text-slate-600 space-y-2">
            <li><strong className="text-slate-800">Informal Negotiation:</strong> Contact us at legal@browseraitools.com to attempt resolution</li>
            <li><strong className="text-slate-800">Binding Arbitration:</strong> If negotiation fails, disputes shall be resolved through binding arbitration in Delaware, United States</li>
            <li><strong className="text-slate-800">Class Action Waiver:</strong> You agree to resolve disputes on an individual basis, not as part of a class action</li>
          </ol>

          <h3 className="text-lg font-semibold text-slate-800">12.3 Exceptions</h3>
          <p className="text-slate-600">Either party may seek injunctive relief in court to protect intellectual property rights or prevent unauthorized use of the Service.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">13. Termination</h2>

          <h3 className="text-lg font-semibold text-slate-800">13.1 Your Right to Stop Using</h3>
          <p className="text-slate-600">You may stop using Browser AI Tools at any time for any reason. Simply close your browser or clear your local storage.</p>

          <h3 className="text-lg font-semibold text-slate-800">13.2 Our Right to Terminate Access</h3>
          <p className="text-slate-600">We reserve the right to:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>Deny access to users who violate these Terms</li>
            <li>Block IP addresses engaged in abuse or automated attacks</li>
            <li>Discontinue the Service entirely (with or without notice)</li>
          </ul>
          <p className="text-slate-600">Due to our architecture (no accounts, client-side processing), enforcement is limited, but we may use technical measures to prevent abuse.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">14. Changes to These Terms</h2>
          <p className="text-slate-600">We may update these Terms at any time. When we do:</p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>We'll update the "Last Updated" date</li>
            <li>Significant changes will be highlighted on the website</li>
            <li>Continued use of the Service after changes constitutes acceptance</li>
          </ul>
          <p className="text-slate-600">We encourage you to review these Terms periodically.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">15. Severability</h2>
          <p className="text-slate-600">If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">16. Entire Agreement</h2>
          <p className="text-slate-600">These Terms, together with our Privacy Policy, constitute the entire agreement between you and Browser AI Tools regarding the Service and supersede any prior agreements.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">17. No Waiver</h2>
          <p className="text-slate-600">Our failure to enforce any right or provision of these Terms does not constitute a waiver of such right or provision.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900">18. Contact Information</h2>
          <p className="text-slate-600">Questions about these Terms? Contact us:</p>
          <p className="text-slate-600">
            <strong className="text-slate-800">General Inquiries:</strong> hello@browseraitools.com<br />
            <strong className="text-slate-800">Legal:</strong> legal@browseraitools.com<br />
            <strong className="text-slate-800">DMCA:</strong> dmca@browseraitools.com<br />
            <strong className="text-slate-800">Website:</strong> <a href="https://browseraitools.com" className="text-purple-600 hover:underline font-medium">browseraitools.com</a>
          </p>
        </section>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg">
          <h3 className="text-blue-800 font-bold text-lg mt-0 mb-2">Thank You for Using Browser AI Tools</h3>
          <p className="text-blue-800 mb-0">
            We built this service to provide free, private, browser-based AI tools. We hope you find them useful! Your responsible use helps us keep the Service free and open for everyone.
          </p>
        </div>

        <div className="pt-8 border-t-2 border-slate-200 text-center text-sm text-slate-500">
          <p className="font-semibold text-slate-700">Browser AI Tools</p>
          <p>Free AI Tools That Run In Your Browser</p>
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
