import { useState, useCallback, useEffect } from "react";
import { Copy, Check, RefreshCw, Eye, EyeOff, ShieldCheck, ShieldAlert, ShieldX, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { InlineShareButtons } from "@/components/InlineShareButtons";

// ─── Character sets ───────────────────────────────────────────────────────────

const CS_UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const CS_UPPER_AMB = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const CS_LOWER = "abcdefghjkmnpqrstuvwxyz";
const CS_LOWER_AMB = "abcdefghijklmnopqrstuvwxyz";
const CS_NUM = "23456789";
const CS_NUM_AMB = "0123456789";
const CS_SYM = "!@#$%^&*-_=+?";

const AMBIGUOUS = new Set(["0", "O", "l", "1", "I"]);

// ─── Crypto random ────────────────────────────────────────────────────────────

function cRand(): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] / 0xffffffff;
}
function cInt(max: number): number { return Math.floor(cRand() * max); }
function pickFrom(s: string): string { return s[cInt(s.length)]; }
function shuffleStr(arr: string[]): string[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = cInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ─── Wordlist (passphrases) ───────────────────────────────────────────────────

const WORDS = [
  "apple","bridge","cloud","dance","eagle","flame","grape","happy","ivory","jungle",
  "karma","lemon","magic","north","ocean","piano","quiet","river","storm","tiger",
  "ultra","valor","witch","xenon","yield","zebra","amber","brave","crisp","delta",
  "ember","frost","gamma","hover","index","joker","kneel","lunar","maple","nexus",
  "oasis","panda","quest","radar","scout","thorn","ultra","vivid","water","xerox",
  "yacht","zones","audio","blaze","chess","dodge","epoch","flair","globe","hazel",
  "igloo","jazzy","knoll","lance","micro","noble","olive","pixel","quill","relay",
  "spark","toast","umbra","venom","waltz","exist","young","zonal","alpha","boxer",
  "cedar","denim","elite","forge","grace","hinge","input","jewel","kiosk","lyric",
  "metro","nylon","orbit","prism","query","raven","solar","tower","unify","viola",
  "wheat","exact","plank","crimp","swift","blunt","crisp","flock","grind","hatch",
  "inbox","joint","knack","lever","marsh","notch","oxide","prawn","quota","rivet",
  "scalp","torch","uncut","verge","wring","expel","plaza","chord","drive","frame",
  "gloom","hippo","input","jumbo","kitty","laser","manor","nerve","otter","petty",
  "quota","robin","snare","tulip","ultra","voter","windy","extra","proud","clock",
  "brain","candy","daisy","entry","fairy","ghost","heart","input","jewel","kazoo",
];

// ─── Pronounceable generation ─────────────────────────────────────────────────

const CONS = "bcdfghjklmnprstvwz";
const VOWS = "aeiou";

function syllable(): string {
  const patterns = ["CVC", "CV", "VC", "CCV"];
  const p = patterns[cInt(patterns.length)];
  return p.split("").map(c => c === "C" ? CONS[cInt(CONS.length)] : VOWS[cInt(VOWS.length)]).join("");
}

function pronounceable(length: number, noAmbiguous: boolean): string {
  let out = "";
  while (out.length < length) out += syllable();
  let result = out.slice(0, length);
  if (noAmbiguous) result = result.split("").filter(c => !AMBIGUOUS.has(c)).join("").slice(0, length);
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// ─── Random password ──────────────────────────────────────────────────────────

function generateRandom(
  length: number,
  upper: boolean, lower: boolean, nums: boolean, syms: boolean,
  noAmb: boolean,
): string {
  const U = noAmb ? CS_UPPER : CS_UPPER_AMB;
  const L = noAmb ? CS_LOWER : CS_LOWER_AMB;
  const N = noAmb ? CS_NUM : CS_NUM_AMB;
  const S = CS_SYM;

  const sets: string[] = [];
  if (upper) sets.push(U);
  if (lower) sets.push(L);
  if (nums) sets.push(N);
  if (syms) sets.push(S);
  if (!sets.length) sets.push(L);

  const combined = sets.join("");

  // Ensure at least one from each set
  const required = sets.map(s => pickFrom(s));
  const rest: string[] = [];
  for (let i = required.length; i < length; i++) rest.push(pickFrom(combined));

  return shuffleStr([...required, ...rest]).join("");
}

// ─── Passphrase ───────────────────────────────────────────────────────────────

function generatePassphrase(wordCount: number, sep: string, addNumber: boolean): string {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const w = WORDS[cInt(WORDS.length)];
    words.push(w.charAt(0).toUpperCase() + w.slice(1));
  }
  let result = words.join(sep);
  if (addNumber) result += sep + (10 + cInt(90));
  return result;
}

// ─── PIN ─────────────────────────────────────────────────────────────────────

function generatePin(length: number): string {
  let pin = "";
  for (let i = 0; i < length; i++) pin += cInt(10).toString();
  return pin;
}

// ─── Strength analysis ────────────────────────────────────────────────────────

const COMMON_PASSWORDS = new Set([
  "password","password1","password123","123456","1234567","12345678","123456789",
  "qwerty","qwerty123","abc123","letmein","monkey","master","dragon","iloveyou",
  "sunshine","princess","welcome","shadow","login","admin","passw0rd","trustno1",
  "superman","batman","michael","jessica","football","baseball","soccer","hello",
  "test","user","pass","1q2w3e","q1w2e3r4","111111","222222","333333","666666",
  "000000","123123","654321","696969","aaaaaa","zxcvbn","qazwsx","password!",
]);

const KEYBOARD_ROWS = ["qwertyuiop","asdfghjkl","zxcvbnm","1234567890"];

function hasKeyboardPattern(pw: string): boolean {
  const lower = pw.toLowerCase();
  for (const row of KEYBOARD_ROWS) {
    for (let i = 0; i < row.length - 2; i++) {
      if (lower.includes(row.slice(i, i + 3))) return true;
    }
  }
  return false;
}

function hasSequential(pw: string): boolean {
  for (let i = 0; i < pw.length - 2; i++) {
    const a = pw.charCodeAt(i), b = pw.charCodeAt(i + 1), c = pw.charCodeAt(i + 2);
    if (b === a + 1 && c === a + 2) return true;
    if (b === a - 1 && c === a - 2) return true;
  }
  return false;
}

function hasRepeat(pw: string): boolean {
  for (let i = 0; i < pw.length - 2; i++) {
    if (pw[i] === pw[i + 1] && pw[i] === pw[i + 2]) return true;
  }
  return false;
}

function charsetSize(pw: string): number {
  let size = 0;
  if (/[a-z]/.test(pw)) size += 26;
  if (/[A-Z]/.test(pw)) size += 26;
  if (/[0-9]/.test(pw)) size += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) size += 32;
  return size || 26;
}

interface StrengthResult {
  score: number;         // 0-100
  label: string;
  entropy: number;
  crackOnline: string;   // human readable
  crackOffline: string;
  strengths: string[];
  weaknesses: string[];
  color: string;
  level: 0 | 1 | 2 | 3 | 4; // 0=very weak...4=very strong
}

function formatCrackTime(seconds: number): string {
  if (seconds < 1) return "Instant";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
  if (seconds < 3153600000) return `${(seconds / 31536000).toFixed(1)} years`;
  if (seconds < 3153600000000) return `${(seconds / 31536000000).toFixed(0)} thousand years`;
  if (seconds < 3153600000000000) return `${(seconds / 31536000000000).toFixed(0)} million years`;
  return "Billions of years";
}

function analyzeStrength(pw: string): StrengthResult {
  if (!pw) return {
    score: 0, label: "—", entropy: 0, crackOnline: "—", crackOffline: "—",
    strengths: [], weaknesses: [], color: "slate", level: 0,
  };

  const len = pw.length;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNum = /[0-9]/.test(pw);
  const hasSym = /[^a-zA-Z0-9]/.test(pw);
  const typeCount = [hasUpper, hasLower, hasNum, hasSym].filter(Boolean).length;
  const cs = charsetSize(pw);
  const entropy = Math.floor(Math.log2(cs) * len);
  const isCommon = COMMON_PASSWORDS.has(pw.toLowerCase());
  const kbPat = hasKeyboardPattern(pw);
  const seqPat = hasSequential(pw);
  const repPat = hasRepeat(pw);

  // Score components
  let score = 0;

  // Length (0-40 pts)
  if (len >= 6) score += 5;
  if (len >= 8) score += 10;
  if (len >= 10) score += 5;
  if (len >= 12) score += 10;
  if (len >= 16) score += 10;

  // Character variety (0-40 pts)
  if (hasLower) score += 5;
  if (hasUpper) score += 10;
  if (hasNum) score += 10;
  if (hasSym) score += 15;

  // Entropy bonus (0-20 pts)
  if (entropy > 40) score += 5;
  if (entropy > 60) score += 5;
  if (entropy > 80) score += 5;
  if (entropy > 100) score += 5;

  // Penalties
  if (isCommon) score = Math.min(score, 8);
  if (kbPat) score -= 15;
  if (seqPat) score -= 10;
  if (repPat) score -= 8;
  if (len < 8) score = Math.min(score, 15);
  if (typeCount === 1) score -= 10;

  score = Math.max(0, Math.min(100, score));

  // Crack time
  const combinations = Math.pow(cs, len);
  const onlineSec = combinations / 100;
  const offlineSec = combinations / 10_000_000_000;

  // Labels
  let label: string;
  let color: string;
  let level: 0 | 1 | 2 | 3 | 4;
  if (score <= 20) { label = "Very Weak"; color = "red"; level = 0; }
  else if (score <= 40) { label = "Weak"; color = "orange"; level = 1; }
  else if (score <= 60) { label = "Fair"; color = "yellow"; level = 2; }
  else if (score <= 80) { label = "Good"; color = "green"; level = 3; }
  else { label = "Very Strong"; color = "emerald"; level = 4; }

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (len >= 16) strengths.push("Excellent length (16+ characters)");
  else if (len >= 12) strengths.push("Good length (12+ characters)");
  if (hasUpper && hasLower) strengths.push("Mixed case letters");
  if (hasNum) strengths.push("Contains numbers");
  if (hasSym) strengths.push("Contains special characters");
  if (!kbPat && !seqPat && !repPat && !isCommon && len >= 10) strengths.push("No obvious patterns detected");

  if (isCommon) weaknesses.push("This is an extremely common password — change it immediately");
  if (len < 8) weaknesses.push("Too short — use at least 12 characters");
  else if (len < 12) weaknesses.push("Short — increase to 16+ for better security");
  if (!hasUpper) weaknesses.push("Missing uppercase letters");
  if (!hasNum) weaknesses.push("Missing numbers");
  if (!hasSym) weaknesses.push("Missing special characters");
  if (kbPat) weaknesses.push("Contains keyboard pattern (e.g. qwerty, asdf)");
  if (seqPat) weaknesses.push("Contains sequential characters (e.g. abc, 123)");
  if (repPat) weaknesses.push("Contains repeated characters (e.g. aaa, 111)");

  return {
    score, label, entropy,
    crackOnline: formatCrackTime(onlineSec),
    crackOffline: formatCrackTime(offlineSec),
    strengths, weaknesses, color, level,
  };
}

// ─── Reusable copy button ─────────────────────────────────────────────────────

function CopyBtn({ text, testId }: { text: string; testId?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button type="button" onClick={copy} data-testid={testId ?? "button-copy"}
      className={cn("flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors",
        copied ? "text-green-500 bg-green-50 dark:bg-green-900/20" : "text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
      )}>
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ─── Strength bar ─────────────────────────────────────────────────────────────

const LEVEL_COLORS = ["bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-green-500", "bg-emerald-500"];
const LEVEL_TEXT = ["text-red-600 dark:text-red-400", "text-orange-500 dark:text-orange-400", "text-yellow-600 dark:text-yellow-400", "text-green-600 dark:text-green-400", "text-emerald-600 dark:text-emerald-400"];

function StrengthBar({ result }: { result: StrengthResult }) {
  if (!result.label || result.label === "—") return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Strength</span>
        <span className={cn("text-sm font-black", LEVEL_TEXT[result.level])}>{result.label}</span>
      </div>
      <div className="flex gap-1 h-2">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className={cn("flex-1 rounded-full transition-all duration-300",
            i <= result.level ? LEVEL_COLORS[result.level] : "bg-slate-100 dark:bg-slate-700"
          )} />
        ))}
      </div>
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type GenType = "random" | "passphrase" | "pronounceable" | "pin";

// ─── Main component ───────────────────────────────────────────────────────────

export function PasswordGenerator() {
  const [tab, setTab] = useState<"generate" | "check">("generate");

  // Generator state
  const [genType, setGenType] = useState<GenType>("random");
  const [length, setLength] = useState(16);
  const [wordCount, setWordCount] = useState(4);
  const [pinLen, setPinLen] = useState<4 | 6 | 8>(6);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNums, setUseNums] = useState(true);
  const [useSyms, setUseSyms] = useState(true);
  const [noAmb, setNoAmb] = useState(false);
  const [withNumber, setWithNumber] = useState(true);
  const [quantity, setQuantity] = useState(5);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [separator, setSeparator] = useState("-");

  // Checker state
  const [checkInput, setCheckInput] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [checkResult, setCheckResult] = useState<StrengthResult | null>(null);

  const generate = useCallback(() => {
    const results: string[] = [];
    for (let i = 0; i < quantity; i++) {
      switch (genType) {
        case "random":
          results.push(generateRandom(length, useUpper, useLower, useNums, useSyms, noAmb));
          break;
        case "passphrase":
          results.push(generatePassphrase(wordCount, separator, withNumber));
          break;
        case "pronounceable":
          results.push(pronounceable(length, noAmb));
          break;
        case "pin":
          results.push(generatePin(pinLen));
          break;
      }
    }
    setPasswords(results);
  }, [genType, length, wordCount, pinLen, useUpper, useLower, useNums, useSyms, noAmb, withNumber, quantity, separator]);

  // Generate on mount
  useEffect(() => { generate(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (checkInput) setCheckResult(analyzeStrength(checkInput));
    else setCheckResult(null);
  }, [checkInput]);

  const atLeastOneCharset = useUpper || useLower || useNums || useSyms;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {(["generate", "check"] as const).map(t => (
          <button key={t} type="button" data-testid={`tab-${t}`}
            onClick={() => setTab(t)}
            className={cn("px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all",
              tab === t ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            )}>
            {t === "generate" ? "Generate" : "Check Strength"}
          </button>
        ))}
      </div>

      {/* ── GENERATOR TAB ── */}
      {tab === "generate" && (
        <>
          <div className="glass-panel rounded-2xl p-5 space-y-5">

            {/* Type */}
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-20 shrink-0">Style</span>
              <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {([
                  { id: "random" as GenType, label: "Random" },
                  { id: "passphrase" as GenType, label: "Passphrase" },
                  { id: "pronounceable" as GenType, label: "Pronounceable" },
                  { id: "pin" as GenType, label: "PIN" },
                ]).map(t => (
                  <button key={t.id} type="button" data-testid={`style-${t.id}`}
                    onClick={() => setGenType(t.id)}
                    className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                      genType === t.id ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    )}>{t.label}</button>
                ))}
              </div>
            </div>

            {/* Length / word count */}
            {genType === "random" || genType === "pronounceable" ? (
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-20 shrink-0">Length</span>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <input type="range" min={8} max={64} value={length}
                    onChange={e => setLength(parseInt(e.target.value))}
                    data-testid="slider-length"
                    className="flex-1 accent-purple-600" />
                  <span className="text-sm font-black text-purple-700 dark:text-purple-300 tabular-nums w-8 text-right">{length}</span>
                </div>
              </div>
            ) : genType === "passphrase" ? (
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-20 shrink-0">Words</span>
                <div className="flex items-center gap-3">
                  <input type="range" min={3} max={8} value={wordCount}
                    onChange={e => setWordCount(parseInt(e.target.value))}
                    data-testid="slider-words"
                    className="w-32 accent-purple-600" />
                  <span className="text-sm font-black text-purple-700 dark:text-purple-300 tabular-nums">{wordCount} words</span>
                  <span className="text-xs text-slate-400 mx-1">Separator:</span>
                  {["-", ".", "_", " "].map(s => (
                    <button key={s} type="button"
                      onClick={() => setSeparator(s)}
                      className={cn("w-8 h-7 rounded-lg border text-xs font-bold transition-all",
                        separator === s ? "bg-purple-600 border-purple-600 text-white" : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-purple-300"
                      )}>{s === " " ? "sp" : s}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-20 shrink-0">Digits</span>
                <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  {([4, 6, 8] as const).map(n => (
                    <button key={n} type="button" data-testid={`pin-len-${n}`}
                      onClick={() => setPinLen(n)}
                      className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                        pinLen === n ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      )}>{n}-digit</button>
                  ))}
                </div>
              </div>
            )}

            {/* Character options */}
            {(genType === "random" || genType === "pronounceable") && (
              <div className="flex flex-wrap gap-3 items-start">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-20 shrink-0 pt-0.5">Include</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "A–Z", key: "upper", val: useUpper, set: setUseUpper, disabled: genType === "pronounceable" },
                    { label: "a–z", key: "lower", val: useLower, set: setUseLower, disabled: genType === "pronounceable" },
                    { label: "0–9", key: "nums", val: useNums, set: setUseNums, disabled: false },
                    { label: "!@#", key: "syms", val: useSyms, set: setUseSyms, disabled: genType === "pronounceable" },
                  ].map(o => (
                    <button key={o.key} type="button" data-testid={`toggle-${o.key}`}
                      disabled={o.disabled}
                      onClick={() => !o.disabled && o.set(!o.val)}
                      className={cn("px-3 py-1.5 rounded-xl border text-xs font-bold transition-all",
                        o.val && !o.disabled ? "bg-purple-600 border-purple-600 text-white shadow-sm shadow-purple-500/20"
                          : o.disabled ? "border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-default"
                          : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-purple-300"
                      )}>{o.label}</button>
                  ))}
                  <label className="flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 hover:border-purple-300 transition-colors">
                    <input type="checkbox" checked={noAmb} onChange={e => setNoAmb(e.target.checked)}
                      data-testid="toggle-no-ambiguous"
                      className="w-3 h-3 accent-purple-600" />
                    No ambiguous (0,O,l,1)
                  </label>
                </div>
              </div>
            )}

            {/* Passphrase options */}
            {genType === "passphrase" && (
              <div className="flex flex-wrap gap-3 items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-20 shrink-0">Options</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={withNumber} onChange={e => setWithNumber(e.target.checked)}
                    data-testid="toggle-with-number"
                    className="w-3.5 h-3.5 accent-purple-600" />
                  <span className="text-xs font-semibold text-slate-500">Append random number</span>
                </label>
              </div>
            )}

            {/* Quantity */}
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-20 shrink-0">Quantity</span>
              <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {[1, 3, 5, 10].map(n => (
                  <button key={n} type="button" data-testid={`qty-${n}`}
                    onClick={() => setQuantity(n)}
                    className={cn("px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all",
                      quantity === n ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    )}>{n}</button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <div className="flex justify-end">
              <button type="button" onClick={generate}
                disabled={genType === "random" && !atLeastOneCharset}
                data-testid="button-generate"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-black shadow-sm shadow-purple-500/20 transition-colors disabled:opacity-50">
                <RefreshCw className="w-4 h-4" />
                Generate
              </button>
            </div>
          </div>

          {/* Results */}
          {passwords.length > 0 && (
            <div className="glass-panel rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Generated Passwords</p>
                <InlineShareButtons />
              </div>
              <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {passwords.map((pw, i) => {
                  const s = analyzeStrength(pw);
                  return (
                    <div key={i} data-testid={`password-row-${i}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-100 break-all">{pw}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={cn("text-[11px] font-bold", LEVEL_TEXT[s.level])}>{s.label}</span>
                          <span className="text-[11px] text-slate-300 dark:text-slate-600">•</span>
                          <span className="text-[11px] text-slate-400">{pw.length} chars</span>
                          {s.entropy > 0 && (
                            <>
                              <span className="text-[11px] text-slate-300 dark:text-slate-600">•</span>
                              <span className="text-[11px] text-slate-400">{s.entropy} bits</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="flex gap-0.5">
                          {[0,1,2,3,4].map(j => (
                            <div key={j} className={cn("w-1.5 h-4 rounded-sm transition-colors",
                              j <= s.level ? LEVEL_COLORS[s.level] : "bg-slate-100 dark:bg-slate-700"
                            )} />
                          ))}
                        </div>
                        <CopyBtn text={pw} testId={`copy-password-${i}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── CHECKER TAB ── */}
      {tab === "check" && (
        <div className="space-y-4">
          {/* Input */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={checkInput}
                onChange={e => setCheckInput(e.target.value)}
                placeholder="Paste or type your password here…"
                data-testid="input-check-password"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-12 text-sm font-mono text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-purple-400 placeholder:text-slate-400 placeholder:font-sans" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                data-testid="button-toggle-visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {checkResult && (
              <StrengthBar result={checkResult} />
            )}
          </div>

          {/* Stats */}
          {checkResult && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Score", value: `${checkResult.score}/100` },
                  { label: "Entropy", value: `${checkResult.entropy} bits` },
                  { label: "Online crack", value: checkResult.crackOnline },
                  { label: "Offline crack", value: checkResult.crackOffline },
                ].map(st => (
                  <div key={st.label} className="glass-panel rounded-xl p-3 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{st.label}</p>
                    <p className="text-sm font-black text-slate-700 dark:text-slate-200 mt-0.5 leading-tight">{st.value}</p>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              {(checkResult.strengths.length > 0 || checkResult.weaknesses.length > 0) && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {checkResult.strengths.length > 0 && (
                    <div className="glass-panel rounded-2xl p-4 space-y-2">
                      <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Strengths</p>
                      </div>
                      {checkResult.strengths.map(s => (
                        <div key={s} className="flex items-start gap-2">
                          <span className="text-green-500 text-xs mt-0.5">✓</span>
                          <p className="text-xs text-slate-600 dark:text-slate-300">{s}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {checkResult.weaknesses.length > 0 && (
                    <div className="glass-panel rounded-2xl p-4 space-y-2">
                      <div className="flex items-center gap-2 mb-3">
                        {checkResult.level <= 1 ? <ShieldX className="w-4 h-4 text-red-500" /> : <ShieldAlert className="w-4 h-4 text-orange-500" />}
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Weaknesses</p>
                      </div>
                      {checkResult.weaknesses.map(w => (
                        <div key={w} className="flex items-start gap-2">
                          <span className={cn("text-xs mt-0.5", checkResult.level <= 1 ? "text-red-500" : "text-orange-500")}>✗</span>
                          <p className="text-xs text-slate-600 dark:text-slate-300">{w}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PIN warning */}
              {checkResult.level <= 2 && checkResult.score > 0 && (
                <div className="glass-panel rounded-xl p-3 border border-orange-100 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-900/10">
                  <p className="text-xs font-semibold text-orange-700 dark:text-orange-400">
                    Tip: Aim for 16+ characters using all character types (A–Z, a–z, 0–9, !@#). Use a password manager to generate and store it securely.
                  </p>
                </div>
              )}
            </>
          )}

          {!checkInput && (
            <div className="glass-panel rounded-2xl p-8 text-center">
              <Shield className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Type or paste a password above to analyze its strength</p>
              <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Nothing is sent to any server — analysis runs entirely in your browser</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
