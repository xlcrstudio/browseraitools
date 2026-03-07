interface AdBlockProps {
  slot: string;
  format?: "horizontal" | "rectangle" | "vertical";
  className?: string;
}

export function AdBlock({ slot, format = "horizontal", className = "" }: AdBlockProps) {
  const heightClass =
    format === "horizontal"
      ? "min-h-[90px]"
      : format === "rectangle"
        ? "min-h-[250px]"
        : "min-h-[600px]";

  return (
    <div
      data-testid={`ad-block-${slot}`}
      data-ad-slot={slot}
      data-ad-format={format}
      className={`w-full flex items-center justify-center bg-slate-50/50 border border-dashed border-slate-200 rounded-xl overflow-hidden ${heightClass} ${className}`}
    >
      <div className="text-center px-4 py-3">
        <p className="text-xs text-slate-300 font-medium uppercase tracking-wider">Advertisement</p>
      </div>
    </div>
  );
}
