import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { ShieldCheck, Sparkles, Menu, X, ChevronDown, ChevronRight, Lock } from "lucide-react";
import { toolCategories } from "@/lib/tools-data";
import { AnimatePresence, motion } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-300/20 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-300/20 blur-[120px] pointer-events-none z-0" />

      <Header />

      <main className="flex-1 relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {children}
      </main>

      <Footer />
    </div>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b-0 border-white/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" data-testid="link-home" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-slate-900">
            Browser<span className="text-purple-600">AI</span> Tools
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" data-testid="nav-desktop">
          <DesktopToolsMenu />
          <button
            onClick={() => {
              if (window.location.pathname !== "/") {
                window.location.href = "/#tools";
              } else {
                document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
          >
            All Tools
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <div data-testid="status-privacy" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100/50 text-emerald-700 text-xs font-semibold shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Private
          </div>

          <button
            data-testid="button-mobile-menu"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu onClose={() => setMobileOpen(false)} currentPath={location} />
        )}
      </AnimatePresence>
    </header>
  );
}

function DesktopToolsMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        data-testid="button-tools-menu"
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
      >
        Tools <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[720px] bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-100 p-5 grid grid-cols-2 gap-x-6 gap-y-4 max-h-[70vh] overflow-y-auto"
          >
            {toolCategories.map((category) => (
              <div key={category.slug}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                  {category.name}
                </h4>
                <div className="space-y-0.5">
                  {category.tools.map((tool) => {
                    const Icon = tool.icon;
                    if (tool.available) {
                      return (
                        <Link
                          key={tool.id}
                          href={tool.slug}
                          data-testid={`menu-tool-${tool.id}`}
                          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-purple-50 transition-colors group"
                          onClick={() => setOpen(false)}
                        >
                          <Icon className="w-4 h-4 text-purple-500 shrink-0" />
                          <span className="text-sm font-medium text-slate-700 group-hover:text-purple-700 truncate">{tool.name}</span>
                          <ChevronRight className="w-3 h-3 text-purple-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </Link>
                      );
                    }
                    return (
                      <div
                        key={tool.id}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg opacity-50"
                      >
                        <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-sm text-slate-400 truncate">{tool.name}</span>
                        <span className="text-[10px] text-slate-300 ml-auto shrink-0">Soon</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMenu({ onClose, currentPath }: { onClose: () => void; currentPath: string }) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <span className="font-display font-bold text-lg text-slate-900">
            Browser<span className="text-purple-600">AI</span> Tools
          </span>
          <button
            data-testid="button-mobile-menu-close"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <Link
            href="/"
            onClick={onClose}
            className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              currentPath === "/" ? "bg-purple-50 text-purple-700" : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            Home
          </Link>

          {toolCategories.map((category) => (
            <div key={category.slug}>
              <button
                onClick={() => setExpandedCategory(expandedCategory === category.slug ? null : category.slug)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {category.name}
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedCategory === category.slug ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {expandedCategory === category.slug && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-4 pb-2 space-y-0.5">
                      {category.tools.map((tool) => {
                        const Icon = tool.icon;
                        if (tool.available) {
                          return (
                            <Link
                              key={tool.id}
                              href={tool.slug}
                              onClick={onClose}
                              data-testid={`mobile-tool-${tool.id}`}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-purple-50 transition-colors"
                            >
                              <Icon className="w-4 h-4 text-purple-500 shrink-0" />
                              <span className="text-sm font-medium text-slate-700">{tool.name}</span>
                            </Link>
                          );
                        }
                        return (
                          <div
                            key={tool.id}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg opacity-40"
                          >
                            <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-sm text-slate-400">{tool.name}</span>
                            <span className="text-[10px] text-slate-300 ml-auto">Soon</span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
            <Lock className="w-3.5 h-3.5" />
            All tools run 100% privately in your browser
          </div>
        </div>
      </motion.div>
    </>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white/50 backdrop-blur-sm relative z-10 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-display font-bold text-sm text-slate-700">
              Browser<span className="text-purple-600">AI</span> Tools
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-800 transition-colors">Home</Link>
            <button
              onClick={() => {
                if (window.location.pathname !== "/") {
                  window.location.href = "/#tools";
                } else {
                  document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="hover:text-slate-800 transition-colors"
            >All Tools</button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Your data never leaves your browser.
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} browseraitools.com. Powered by WebLLM. All tools run locally in your browser.
        </div>
      </div>
    </footer>
  );
}
