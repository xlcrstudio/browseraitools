import { useEffect } from "react";
import { KeyRound } from "lucide-react";
import { ToolPageHeader } from "@/components/ToolPageHeader";
import { PasswordGenerator } from "@/components/PasswordGenerator";
import { AdBlock } from "@/components/AdBlock";
import ToolSchema from "@/components/ToolSchema";
import { SimilarTools } from "@/components/RelatedTools";
import ShareResultButtons from "@/components/ShareResultButtons";

const FAQS = [
  {
    question: "How are the passwords generated?",
    answer: "All passwords are generated using the browser's built-in cryptographic random number generator (crypto.getRandomValues), the same API used by password managers and security tools. This ensures true randomness — not the predictable pseudo-random numbers used by most programming functions.",
  },
  {
    question: "Is my password sent to a server?",
    answer: "No. Every operation — generation and strength analysis — runs entirely in your browser using JavaScript. No passwords, keystrokes, or results are ever transmitted to any server. You can even disconnect from the internet and the tool will still work.",
  },
  {
    question: "What makes a password strong?",
    answer: "The two most important factors are length and character variety. A 16-character password using uppercase letters, lowercase letters, numbers, and symbols is exponentially harder to crack than an 8-character password using only lowercase letters. Avoid dictionary words, keyboard patterns (qwerty, asdf), sequential characters (123, abc), and personal information like names or birthdays.",
  },
  {
    question: "What is a passphrase and when should I use one?",
    answer: "A passphrase is a sequence of random words joined by a separator — for example 'Apple-Bridge-Cloud-Dance-42'. Passphrases are long (30+ characters) and easy to remember, making them stronger than most character passwords while being more human-friendly. They're ideal for master passwords, Wi-Fi passwords, and anything you need to type regularly.",
  },
  {
    question: "What is entropy and why does it matter?",
    answer: "Entropy (measured in bits) represents how unpredictable a password is. Each bit doubles the number of possible passwords an attacker must try. A 60-bit password has about 1 quintillion possibilities; a 100-bit password has over 1 nonillion. Modern cracking rigs can test billions of passwords per second, so higher entropy directly translates to longer crack times.",
  },
  {
    question: "What is the difference between an online and offline attack?",
    answer: "An online attack targets a live login form — rate limiting and account lockouts slow attackers to about 100 guesses per second. An offline attack occurs when a database of password hashes is stolen; attackers can then test billions of guesses per second on their own hardware. Always use passwords strong enough to resist offline attacks, not just online ones.",
  },
  {
    question: "What does 'exclude ambiguous characters' do?",
    answer: "It removes characters that look similar in certain fonts — 0 (zero) and O (letter O), l (lowercase L) and 1 (number one) and I (uppercase i). This makes passwords easier to read aloud, type from a printed sheet, or share verbally without confusion. The security impact is minimal since only a few characters are removed from a large charset.",
  },
  {
    question: "How should I store generated passwords?",
    answer: "Use a reputable password manager such as Bitwarden, 1Password, or KeePass. Never store passwords in plain text files, emails, or notes apps. Password managers encrypt your vault with a master password and sync securely across devices, so you only need to remember one strong master passphrase.",
  },
];

export default function PasswordGeneratorPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Free Password Generator & Strength Checker — Cryptographically Secure | Browser AI Tools";

    const metas: Record<string, string> = {
      description: "Generate cryptographically secure random passwords, passphrases, and PINs. Check password strength with entropy analysis and crack time estimates. 100% private — runs in your browser.",
    };
    const ogs: Record<string, string> = {
      "og:title": "Free Password Generator & Strength Checker — Secure & Private",
      "og:description": "Generate strong passwords and passphrases. Analyze strength with entropy, crack time, and detailed feedback. 100% client-side — nothing sent to any server.",
      "og:type": "website",
      "og:url": "https://browseraitools.com/password-generator",
    };

    for (const [name, content] of Object.entries(metas)) {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("name", name); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
    }
    for (const [property, content] of Object.entries(ogs)) {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("property", property); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
    }
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Password Generator & Strength Checker",
            "applicationCategory": "SecurityApplication",
            "offers": { "@type": "Offer", "price": "0" },
            "description": "Free cryptographically secure password generator with strength analysis, entropy calculation, and crack time estimation. 100% client-side.",
          }),
        }}
      />

      <ToolPageHeader toolName="Password Generator" icon={KeyRound} />

      <section className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-slate-50 mb-4 leading-tight">
          Password{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Generator
          </span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Generate cryptographically strong passwords and passphrases — or check the strength of an existing password with entropy analysis and crack time estimates. Runs entirely in your browser.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-5 text-xs">
          {[
            "Crypto-Random",
            "4 Password Styles",
            "Strength Checker",
            "Entropy Analysis",
            "Crack Time Estimate",
            "No Ambiguous Chars",
            "100% Private",
          ].map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800">
              {b}
            </span>
          ))}
        </div>
      </section>

      <AdBlock slot="password-generator-top" format="horizontal" className="mb-8" />

      <div className="mb-10">
        <PasswordGenerator />
      </div>

      <AdBlock slot="password-generator-mid" format="horizontal" className="mb-10" />

      <article className="max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-headings:font-display prose-headings:font-bold mt-8 mb-12">
        <h2>Why Password Security Matters</h2>
        <p>
          Weak or reused passwords are behind the vast majority of account compromises. When one service is breached, attackers use the stolen credentials to try every other major website automatically — a technique called credential stuffing. A unique, strong password for every account is the single most effective step you can take to protect your digital life.
        </p>

        <h2>Understanding Password Strength</h2>

        <h3>Length Is the Most Important Factor</h3>
        <p>
          Each additional character multiplies the number of possible passwords exponentially. A 16-character password using all character types has more possible combinations than there are atoms in the observable universe. A 12-character password using only lowercase letters can be cracked in hours by modern hardware.
        </p>

        <h3>Character Variety Adds Exponential Security</h3>
        <p>
          Adding uppercase letters, numbers, and symbols expands the "charset size" — the number of possible characters at each position. A lowercase-only password has 26 possibilities per character. Adding all four types gives 95+ possibilities per character, making each position about 3.7× harder to brute force.
        </p>

        <h3>Avoid Patterns</h3>
        <p>
          Password crackers don't try random characters — they try dictionary words, common substitutions (@ for a, 3 for e), keyboard patterns (qwerty, 123456), and date formats first. A "complex-looking" password like <code>P@ssw0rd2024!</code> is cracked in seconds because it follows predictable rules that crackers know well.
        </p>

        <h2>Password Styles Explained</h2>

        <h3>Random</h3>
        <p>Maximum security. Cryptographically random characters from your chosen charset. Best for account passwords stored in a password manager, where memorability isn't a concern.</p>

        <h3>Passphrase</h3>
        <p>Random words joined by a separator. Long (30+ characters) and memorable. Ideal for master passwords, Wi-Fi passwords, and disk encryption keys — anything you need to type from memory.</p>

        <h3>Pronounceable</h3>
        <p>Consonant-vowel patterns that produce readable syllables. More memorable than pure random characters while still being much stronger than dictionary words. Good for passwords that need to be typed or shared verbally.</p>

        <h3>PIN</h3>
        <p>Numeric only. Only suitable for phone lock screens (backed by biometrics) and ATMs with hardware-enforced lockouts. Never use a PIN as a replacement for a real password.</p>

        <h2>Frequently Asked Questions</h2>
        {FAQS.map(faq => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </article>

      <SimilarTools slugs={["/regex-tester", "/json-validator", "/diff-checker", "/lorem-ipsum-generator", "/markdown-converter", "/color-palette-generator"]} />

      <AdBlock slot="password-generator-bottom" format="horizontal" className="mt-10" />

      <ToolSchema
        toolName="Password Generator & Strength Checker"
        toolDescription="Free cryptographically secure password generator and strength checker. Supports random passwords, passphrases, pronounceable passwords, and PINs. Strength analysis includes entropy, crack time estimates, and detailed feedback. 100% client-side."
        faqs={FAQS}
      />

      <ShareResultButtons toolName="Password Generator" />
    </>
  );
}
