// Browser-side file parsing for PDF, DOCX, XLSX, PPTX, and plain text formats

// ─── PDF ─────────────────────────────────────────────────────────────────────

async function parsePdf(buffer: ArrayBuffer): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  // Use locally bundled worker — no CDN dependency, no network request
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const pdf = await pdfjs.getDocument({ data: buffer }).promise;
  const parts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item: any) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s{2,}/g, " ")
      .trim();
    if (text) parts.push(text);
  }

  return parts.join("\n\n");
}

// ─── DOCX ─────────────────────────────────────────────────────────────────────

async function parseDocx(buffer: ArrayBuffer): Promise<string> {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value.trim();
}

// ─── XLSX / XLS ───────────────────────────────────────────────────────────────

async function parseXlsx(buffer: ArrayBuffer): Promise<string> {
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(buffer, { type: "array" });
  const parts: string[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const csv = XLSX.utils.sheet_to_csv(sheet);
    if (csv.trim()) {
      parts.push(`[Sheet: ${sheetName}]\n${csv}`);
    }
  }

  return parts.join("\n\n");
}

// ─── PPTX ─────────────────────────────────────────────────────────────────────

async function parsePptx(buffer: ArrayBuffer): Promise<string> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(buffer);
  const slideFiles = Object.keys(zip.files)
    .filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)?.[0] ?? "0");
      const nb = parseInt(b.match(/\d+/)?.[0] ?? "0");
      return na - nb;
    });

  const parts: string[] = [];

  for (let i = 0; i < slideFiles.length; i++) {
    const xml = await zip.files[slideFiles[i]].async("string");
    // Strip XML tags and extract text content
    const text = xml
      .replace(/<a:r[^>]*>[\s\S]*?<\/a:r>/g, match =>
        match.replace(/<[^>]+>/g, "")
      )
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/\s{2,}/g, " ")
      .trim();
    if (text) parts.push(`[Slide ${i + 1}]\n${text}`);
  }

  return parts.join("\n\n");
}

// ─── DOCM / DOC (best-effort) ─────────────────────────────────────────────────

async function parseDocOld(buffer: ArrayBuffer): Promise<string> {
  // Old .doc format — attempt to extract visible ASCII text (lossy but functional)
  const bytes = new Uint8Array(buffer);
  let text = "";
  for (let i = 0; i < bytes.length; i++) {
    const c = bytes[i];
    if ((c >= 32 && c < 127) || c === 9 || c === 10 || c === 13) {
      text += String.fromCharCode(c);
    }
  }
  // Clean up runs of garbage
  return text
    .replace(/[^\x20-\x7E\n\t]{3,}/g, " ")
    .replace(/\s{3,}/g, "\n\n")
    .replace(/^[^a-zA-Z]+/, "")
    .trim();
}

// ─── Main dispatcher ──────────────────────────────────────────────────────────

export type ParseResult = { text: string; warning?: string };

export async function parseFile(file: File): Promise<ParseResult> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const buffer = await file.arrayBuffer();

  switch (ext) {
    case "pdf":
      return { text: await parsePdf(buffer) };

    case "docx":
    case "docm":
      return { text: await parseDocx(buffer) };

    case "doc":
      return {
        text: await parseDocOld(buffer),
        warning: ".doc (old Word format) has limited text extraction. Save as .docx for best results.",
      };

    case "xlsx":
    case "xls":
    case "xlsm":
    case "csv":
      return { text: await parseXlsx(buffer) };

    case "pptx":
    case "pptm":
      return { text: await parsePptx(buffer) };

    case "txt":
    case "md":
    case "json":
    case "xml":
    case "html":
    case "htm":
    case "log":
    case "rtf": {
      const text = await file.text();
      // For HTML/RTF, strip tags
      if (ext === "html" || ext === "htm") {
        return { text: text.replace(/<[^>]+>/g, " ").replace(/\s{2,}/g, " ").trim() };
      }
      return { text };
    }

    default:
      throw new Error(`Unsupported file type: .${ext}`);
  }
}

export const ACCEPTED_EXTENSIONS = [
  ".pdf",
  ".docx", ".doc",
  ".xlsx", ".xls",
  ".pptx",
  ".txt", ".md", ".csv",
  ".json", ".xml",
  ".html", ".htm",
  ".log",
];

export const ACCEPTED_MIME = ACCEPTED_EXTENSIONS.join(",");
