/**
 * Renders AI chat message text with markdown-like formatting.
 * Handles bold, inline code, headings, bullet lists, and numbered lists.
 * Also fixes inline numbered lists (e.g. "1. foo 2. bar") by splitting them.
 */
export function MsgContent({ text }: { text: string }) {
  // Pre-process: split inline numbered items onto their own lines
  // e.g. "...attention: 1. Foo 2. Bar" → split at each " N. "
  const normalised = text
    .replace(/\s+(\d+)\.\s+(?=[A-Z*"'])/g, "\n$1. ")
    // Also handle lines ending mid-sentence before a dash list item
    .replace(/\s+-\s+(?=[A-Z*"'])/g, "\n- ");

  const lines = normalised.split("\n");
  const els: JSX.Element[] = [];
  let listItems: { ordered: boolean; text: string }[] = [];
  let listOrdered = false;
  let key = 0;

  const renderInline = (s: string) => {
    const parts = s.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
    return parts.map((p, i) => {
      if (p.startsWith("**") && p.endsWith("**"))
        return <strong key={i} className="font-semibold">{p.slice(2, -2)}</strong>;
      if (p.startsWith("*") && p.endsWith("*") && p.length > 2)
        return <em key={i}>{p.slice(1, -1)}</em>;
      if (p.startsWith("`") && p.endsWith("`"))
        return <code key={i} className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-600 text-xs font-mono">{p.slice(1, -1)}</code>;
      return <span key={i}>{p}</span>;
    });
  };

  const flushList = () => {
    if (!listItems.length) return;
    if (listOrdered) {
      els.push(
        <ol key={key++} className="space-y-1 my-1.5 pl-1">
          {listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-1.5 text-sm leading-relaxed">
              <span className="shrink-0 text-purple-400 font-semibold mt-0.5 min-w-[1rem]">{i + 1}.</span>
              <span>{renderInline(item.text)}</span>
            </li>
          ))}
        </ol>
      );
    } else {
      els.push(
        <ul key={key++} className="space-y-1 my-1.5">
          {listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-1.5 text-sm leading-relaxed">
              <span className="shrink-0 text-purple-400 font-bold mt-0.5">•</span>
              <span>{renderInline(item.text)}</span>
            </li>
          ))}
        </ul>
      );
    }
    listItems = [];
  };

  for (const line of lines) {
    const orderedMatch = line.match(/^(\d+)\.\s+(.*)/);
    const unorderedMatch = line.match(/^[-*]\s+(.*)/);

    if (line.startsWith("# ")) {
      flushList();
      els.push(<p key={key++} className="font-bold text-base mt-2 mb-1">{renderInline(line.slice(2))}</p>);
    } else if (line.startsWith("## ") || line.startsWith("### ")) {
      flushList();
      const level = line.startsWith("### ") ? 4 : 3;
      els.push(<p key={key++} className={`font-semibold ${level === 3 ? "text-sm" : "text-xs"} mt-2 mb-0.5`}>{renderInline(line.replace(/^#{2,3} /, ""))}</p>);
    } else if (orderedMatch) {
      if (listItems.length && !listOrdered) flushList();
      listOrdered = true;
      listItems.push({ ordered: true, text: orderedMatch[2] });
    } else if (unorderedMatch) {
      if (listItems.length && listOrdered) flushList();
      listOrdered = false;
      listItems.push({ ordered: false, text: unorderedMatch[1] });
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      els.push(<p key={key++} className="text-sm leading-relaxed mb-1">{renderInline(line)}</p>);
    }
  }
  flushList();
  return <>{els}</>;
}
