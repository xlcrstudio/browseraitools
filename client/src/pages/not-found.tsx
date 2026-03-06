import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Search className="w-10 h-10 text-slate-400" />
        </div>
        <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Page not found</h1>
        <p className="text-slate-500 mb-8 max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          href="/" 
          className="px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors shadow-lg"
        >
          Return to Generator
        </Link>
      </div>
    </Layout>
  );
}
