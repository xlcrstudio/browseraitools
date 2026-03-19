import { Link } from "wouter";
import { Home, ChevronRight } from "lucide-react";
import { ModelSelector } from "@/components/ModelSelector";

interface ToolPageHeaderProps {
  toolName: string;
  icon?: any;
}

export function ToolPageHeader({ toolName, icon: Icon }: ToolPageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 md:mb-8">
      <Link
        href="/"
        data-testid="link-tool-home"
        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors group"
      >
        <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-purple-50 flex items-center justify-center transition-colors">
          <Home className="w-4 h-4 text-slate-500 group-hover:text-purple-600 transition-colors" />
        </div>
        <span className="hidden sm:inline">Home</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
      </Link>

      <div className="flex items-center gap-2.5">
        <ModelSelector />
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-sm">
            <Icon className="w-4 h-4 text-white" />
          </div>
        )}
        <h1 className="text-lg md:text-xl font-bold font-display text-slate-800 dark:text-slate-100" data-testid="text-tool-title">
          {toolName}
        </h1>
      </div>
    </div>
  );
}
