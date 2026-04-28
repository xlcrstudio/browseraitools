import { useEffect } from "react";
import { Mail, MessageSquare, Shield, Clock } from "lucide-react";

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Contact Us | Browser AI Tools";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Get in touch with the Browser AI Tools team. We'd love to hear your feedback, questions, or partnership ideas.");
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-10 pb-8 border-b-2 border-slate-200 dark:border-slate-700">
        <span className="inline-block bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
          Get in Touch
        </span>
        <h1
          className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-slate-100 mb-3"
          data-testid="heading-contact"
        >
          Contact Us
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Have a question, suggestion, or just want to say hello? We're happy to hear from you.
        </p>
      </header>

      <div className="space-y-8">
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-6 flex gap-4 items-start">
          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-800 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-purple-600 dark:text-purple-300" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-1">Email Us</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Send us an email and we'll get back to you as soon as possible.
            </p>
            <a
              href="mailto:xlcrstudio@gmail.com"
              data-testid="link-email"
              className="inline-flex items-center gap-2 font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors text-base"
            >
              xlcrstudio@gmail.com
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Feedback</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              Tell us how we can improve the tools or suggest new ones you'd like to see.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Privacy Questions</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              Questions about how your data is (not) handled? We're happy to explain.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Response Time</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              We typically reply within 1–2 business days.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <h2 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Before you write</h2>
          <ul className="text-slate-600 dark:text-slate-400 text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold mt-0.5">•</span>
              <span>For bug reports, please include your browser name and version.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold mt-0.5">•</span>
              <span>For tool requests, a short description of the use case is enough to get started.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-bold mt-0.5">•</span>
              <span>For partnership or business enquiries, feel free to reach out directly.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
