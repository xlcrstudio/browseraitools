export function PDFSummarizerArticle() {
  return (
    <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-a:text-purple-600 mt-12">
      <h2>Why Use an AI PDF Summarizer?</h2>
      <p>
        Reading a full research paper, legal contract, or business report takes anywhere from 30 minutes to several hours. An AI PDF summarizer extracts the key information in seconds — giving you the core findings, main arguments, and critical data points without wading through every page.
      </p>
      <p>
        Unlike cloud-based tools like ChatPDF or AskYourPDF, this tool runs entirely in your browser using WebLLM. Your files are never sent to a server. The AI model runs locally on your GPU, which means your sensitive documents stay 100% private.
      </p>

      <h2>Who Benefits Most from PDF Summarization?</h2>
      <ul>
        <li><strong>Students</strong> — Quickly understand lecture notes, textbook chapters, and research papers before exams</li>
        <li><strong>Researchers</strong> — Screen dozens of papers efficiently to find the most relevant studies</li>
        <li><strong>Lawyers and paralegals</strong> — Review contracts, briefs, and case documents at speed</li>
        <li><strong>Consultants and analysts</strong> — Extract insights from industry reports and white papers</li>
        <li><strong>Journalists</strong> — Understand lengthy government reports and academic studies fast</li>
        <li><strong>Business professionals</strong> — Stay up-to-date on market research without reading every word</li>
      </ul>

      <h2>How Does In-Browser PDF Summarization Work?</h2>
      <p>
        This tool uses two technologies working together: <strong>PDF.js</strong> (Mozilla's open-source PDF renderer) to extract text from your file locally, and <strong>WebLLM</strong> to run a large language model directly on your device using WebGPU acceleration.
      </p>
      <ol>
        <li>You select or drag a PDF onto the upload zone — it never leaves your browser tab</li>
        <li>PDF.js reads the file and extracts all text, page by page</li>
        <li>The extracted text is passed to the on-device AI model</li>
        <li>The model generates a structured summary, key insights, and notable quotes</li>
        <li>You can then ask follow-up questions about the document</li>
      </ol>

      <h2>Summary Formats Explained</h2>
      <p>
        Choose the format that fits your purpose:
      </p>
      <ul>
        <li><strong>Short Summary</strong> — Best for quickly understanding whether a paper is relevant to your work. Returns 2-3 tight paragraphs covering the topic, method, and main finding.</li>
        <li><strong>Key Insights</strong> — Ideal for researchers and analysts. Extracts the 5 most important data points and findings with page references so you can verify them.</li>
        <li><strong>Bullet Points</strong> — Perfect for presentations or sharing with a team. Clean, scannable list format that can be pasted directly into slides or emails.</li>
        <li><strong>Executive Summary</strong> — Designed for decision makers. One paragraph: what this document is about, what it recommends, and what action (if any) is needed.</li>
      </ul>

      <h2>Ask Questions About Your PDF</h2>
      <p>
        After generating a summary, the Q&amp;A feature lets you ask specific questions about the document — similar to ChatPDF but with complete privacy. Ask things like:
      </p>
      <ul>
        <li>"What sample size was used in this study?"</li>
        <li>"What are the key recommendations in section 3?"</li>
        <li>"What limitations does the author acknowledge?"</li>
        <li>"Are there any conflicts of interest mentioned?"</li>
      </ul>
      <p>
        The AI answers using only the content of your document — it won't fabricate information that isn't there.
      </p>

      <h2>Privacy &amp; Security</h2>
      <p>
        Your PDFs never leave your device. There's no upload to a server, no API call with your document content, and no data retention. The AI runs directly on your computer's GPU using the WebGPU API available in modern browsers like Chrome and Edge.
      </p>
      <p>
        This makes it safe for confidential documents: legal contracts, medical records, financial reports, HR documents, and proprietary research.
      </p>
    </article>
  );
}
