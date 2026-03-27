import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, Loader2, AlertTriangle, CheckCircle2, ChevronDown,
  Copy, Heart, RotateCcw, RefreshCw, Target, Clock, Star,
  MessageSquare, Lightbulb, Award
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useWebLLM } from "@/hooks/use-web-llm";
import { InlineShareButtons } from "@/components/InlineShareButtons";
import {
  useInterviewAnswerStorage,
  type InterviewAnswer,
  type StarBreakdown,
  type FollowUpQuestion,
  type DeliveryTip,
  type InterviewAnswerRecord,
} from "@/hooks/use-interview-answer-storage";

const INDUSTRIES = [
  "Technology/Software", "Marketing/Advertising", "Sales", "Finance/Accounting",
  "Healthcare/Medical", "Education/Teaching", "Engineering", "Customer Service",
  "Human Resources", "Operations/Logistics", "Legal", "Real Estate",
  "Consulting", "Media/Entertainment", "Retail/E-Commerce", "Manufacturing",
  "Non-Profit", "Government", "Hospitality/Tourism", "Other",
];

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry-Level", desc: "0-2 years" },
  { value: "mid", label: "Mid-Level", desc: "3-5 years" },
  { value: "senior", label: "Senior", desc: "6-10 years" },
  { value: "executive", label: "Executive", desc: "10+ years" },
  { value: "career-changer", label: "Career Changer", desc: "Switching fields" },
];

const ANSWER_LENGTHS = [
  { value: "short", label: "Short", desc: "30-45 seconds", words: "~75-120 words" },
  { value: "medium", label: "Medium", desc: "1-2 minutes", words: "~150-300 words" },
  { value: "long", label: "Long", desc: "2-3 minutes", words: "~300-450 words" },
];

const ANSWER_STYLES = [
  { value: "balanced", label: "Balanced (Standard STAR)" },
  { value: "achievement", label: "Achievement-Focused" },
  { value: "skill", label: "Skill-Focused" },
  { value: "leadership", label: "Leadership-Focused" },
  { value: "problem-solving", label: "Problem-Solving" },
];

const SYSTEM_PROMPT = `You are an expert career coach specializing in interview preparation and performance coaching for professionals at all levels.

Your expertise includes:
- STAR method (Situation, Task, Action, Result) storytelling
- Behavioral interview techniques
- Answer structuring for impact
- Handling difficult questions
- Showcasing soft skills through examples
- Executive presence and communication

You create interview answers that:
- Follow the STAR method structure
- Are concise yet comprehensive
- Demonstrate specific skills and achievements
- Include quantifiable results
- Show self-awareness and growth
- Avoid common red flags
- Are authentic and believable
- Position candidate as strong fit

You understand:
- What interviewers really want to know
- How to turn weaknesses into strengths
- The psychology of hiring decisions
- Cultural fit indicators
- Red flags that eliminate candidates
- Different question types (behavioral, situational, technical)`;

export function InterviewAnswerGenerator() {
  const { state, progress, error, generateRaw } = useWebLLM();
  const { saveAnswer, toggleFavorite } = useInterviewAnswerStorage();

  const [question, setQuestion] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [experienceLevel, setExperienceLevel] = useState("mid");
  const [relevantExperience, setRelevantExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [companyInfo, setCompanyInfo] = useState("");
  const [answerLength, setAnswerLength] = useState("medium");
  const [answerStyle, setAnswerStyle] = useState("balanced");

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [includeDeliveryTips, setIncludeDeliveryTips] = useState(true);
  const [includeFollowUp, setIncludeFollowUp] = useState(true);
  const [includeAlternative, setIncludeAlternative] = useState(true);

  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [currentRecord, setCurrentRecord] = useState<InterviewAnswerRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleReset = () => {
    setQuestion("");
    setJobTitle("");
    setIndustry(INDUSTRIES[0]);
    setExperienceLevel("mid");
    setRelevantExperience("");
    setSkills("");
    setCompanyInfo("");
    setAnswerLength("medium");
    setAnswerStyle("balanced");
    setShowAdvanced(false);
    setIncludeDeliveryTips(true);
    setIncludeFollowUp(true);
    setIncludeAlternative(true);
    setStreamingText("");
    setCurrentRecord(null);
    setCopiedId(null);
  };

  const copyToClipboard = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (id) {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch {}
  };

  const handleGenerate = async () => {
    if (!question.trim() || !jobTitle.trim()) return;
    setIsGenerating(true);
    setStreamingText("");
    setCurrentRecord(null);

    const expLabel = EXPERIENCE_LEVELS.find((e) => e.value === experienceLevel)?.label || "Mid-Level";
    const lengthLabel = ANSWER_LENGTHS.find((l) => l.value === answerLength)?.desc || "1-2 minutes";
    const styleLabel = ANSWER_STYLES.find((s) => s.value === answerStyle)?.label || "Balanced";

    const questionLower = question.trim().toLowerCase();
    const isWeaknessQ = /weakness|weak point|area.*(improve|development)|shortcoming|flaw/i.test(questionLower);
    const isTellMeAboutYourself = /tell me about yourself|walk me through your background|introduce yourself/i.test(questionLower);
    const isWhyHire = /why should we hire|why are you the best|what makes you stand out|what do you bring/i.test(questionLower);
    const isWhyCompany = /why (this|our) company|why do you want (to work|this)/i.test(questionLower);
    const isStrengthQ = /strength|strong point|best qualit/i.test(questionLower);

    let exampleAnswer: string;
    let exampleBreakdown: string;
    let exampleStrengths: string;
    let questionTypeInstruction: string;

    if (isWeaknessQ) {
      questionTypeInstruction = `This is a WEAKNESS question. The answer must:
- Name a REAL, specific weakness (not a disguised strength like "perfectionism")
- Give a concrete example of when this weakness caused a problem
- Explain specific steps being taken to improve
- Show self-awareness and growth mindset
- Keep a positive, forward-looking tone`;

      exampleAnswer = `SAMPLE ANSWER

Honestly, one of my biggest weaknesses has been delegating effectively. Earlier in my career as a team lead, I had a habit of taking on too much myself because I felt I could do things faster than explaining them to someone else.

This really caught up with me during a major product migration last year. I was handling the technical architecture, code reviews, and client communication all at once. I ended up missing a client deadline by two days because I simply had too much on my plate, and some tasks slipped through the cracks.

That was a wake-up call. Since then, I have been deliberately working on this. I started using a delegation framework where I assess each task by urgency and whether it truly requires my specific expertise. I now hold weekly one-on-ones with my team to assign ownership clearly. I also started asking my manager for feedback on whether I am distributing work well enough.

It is still something I work on every day, but the improvement has been noticeable. Our team velocity increased by about 20 percent once I stopped being the bottleneck, and I have not missed a deadline since.`;

      exampleBreakdown = `STAR BREAKDOWN:
SITUATION: As a team lead, struggled with delegating and took on too many tasks personally.
TASK: Needed to improve delegation to prevent missed deadlines and personal burnout.
ACTION: Adopted a delegation framework, started weekly one-on-ones for clear ownership, sought manager feedback on work distribution.
RESULT: Team velocity increased 20%, no missed deadlines since implementing changes.
SKILLS: self-awareness, delegation, time management, leadership growth
METRICS: 20% velocity increase, zero missed deadlines`;

      exampleStrengths = `STRENGTHS SHOWN:
- Self-Awareness: Honestly identified a real weakness without deflecting
- Growth Mindset: Took concrete steps to improve after recognizing the problem
- Accountability: Owned the mistake and its consequences`;
    } else if (isTellMeAboutYourself) {
      questionTypeInstruction = `This is a "Tell me about yourself" question. The answer must:
- Follow Present-Past-Future structure (not STAR)
- Start with current role and key achievements
- Briefly mention relevant past experience
- End with why this role excites you
- Stay under 2 minutes, focused on professional life`;

      exampleAnswer = `SAMPLE ANSWER

I am currently a Senior Software Engineer at a fintech startup where I lead a team of four developers building our payment processing platform. Over the past two years, I have helped scale our system from handling 10,000 to over 500,000 daily transactions.

Before that, I spent three years at a larger company working on backend infrastructure, which is where I developed my expertise in distributed systems and database optimization. I led the migration of our core services to microservices, which reduced our deployment time from hours to minutes.

What drew me to this role is your focus on building developer tools. I have always been passionate about making complex systems more accessible, and the chance to work on APIs that other engineers rely on is exactly the kind of impact I want to have in my next role.`;

      exampleBreakdown = `STAR BREAKDOWN:
SITUATION: Currently a Senior Software Engineer at a fintech startup leading a development team.
TASK: Seeking a new role that aligns with passion for developer tools and broader impact.
ACTION: Built payment platform scaling to 500K daily transactions, led microservices migration at previous company.
RESULT: 50x transaction growth, deployment time reduced from hours to minutes.
SKILLS: technical leadership, distributed systems, team management, system scaling
METRICS: 500K daily transactions, 50x growth, deployment reduced to minutes`;

      exampleStrengths = `STRENGTHS SHOWN:
- Technical Depth: Demonstrated concrete expertise with real metrics
- Career Progression: Clear upward trajectory with increasing responsibility
- Intentionality: Articulated clear reasons for pursuing this specific role`;
    } else {
      questionTypeInstruction = `This is a behavioral/situational question. The answer must:
- Follow the STAR method (Situation, Task, Action, Result)
- Use a specific real example from past experience
- Show concrete actions and quantifiable results
- Directly address what the question is asking about`;

      exampleAnswer = `SAMPLE ANSWER

In my previous role as a Marketing Manager at a mid-size tech company, we faced a major challenge when our biggest product launch of the year was running three weeks behind schedule.

I was responsible for getting the project back on track without compromising quality or burning out the team.

I took several targeted actions. First, I met individually with each team lead to identify the root causes of delays. I discovered that unclear requirements and context-switching were the main blockers. I then reorganized our sprint planning, cut non-essential features for post-launch, and implemented focused daily standups limited to 10 minutes. I also created a visual progress dashboard so everyone could see our momentum building.

The results were significant. We delivered the product one week ahead of the revised deadline, received a 92 percent positive review rate from beta testers, and the streamlined process I built became our standard for all future launches.`;

      exampleBreakdown = `STAR BREAKDOWN:
SITUATION: Product launch falling 3 weeks behind schedule at a tech company.
TASK: Get the project back on track while maintaining quality and team morale.
ACTION: Met with team leads, identified blockers, reorganized sprints, cut non-essential features, implemented daily standups, created progress dashboard.
RESULT: Delivered 1 week early, 92% positive reviews, process became company standard.
SKILLS: leadership, problem-solving, project management, communication
METRICS: 3-week improvement, 92% positive reviews, adopted as standard process`;

      exampleStrengths = `STRENGTHS SHOWN:
- Leadership: Led team through crisis with clear direction
- Problem-Solving: Identified root causes and developed systematic solutions
- Communication: Aligned stakeholders and created transparency`;
    }

    const userPrompt = `Generate an interview answer for the following question.

${questionTypeInstruction}

INTERVIEW QUESTION: "${question.trim()}"

Candidate Profile:
- Target Role: ${jobTitle.trim()}
- Industry: ${industry}
- Experience Level: ${expLabel}
${relevantExperience ? `- Relevant Experience: ${relevantExperience.trim()}` : ""}
${skills ? `- Key Skills to Highlight: ${skills.trim()}` : ""}
${companyInfo ? `- Company Context: ${companyInfo.trim()}` : ""}

Answer Length: ${answerLength} (${lengthLabel})
Answer Style: ${styleLabel}

IMPORTANT RULES:
1. The SAMPLE ANSWER section must ONLY contain the spoken answer text. Nothing else.
2. Do NOT add any commentary, analysis, or explanation inside the SAMPLE ANSWER section.
3. Do NOT say things like "This answer shows..." or "The candidate demonstrates..." inside the answer.
4. Put all analysis in the STAR BREAKDOWN and STRENGTHS SHOWN sections instead.
5. The answer must directly address the specific question being asked.
6. Write as if the candidate is speaking naturally to the interviewer.

Here is an example of the exact output format:

${exampleAnswer}

SPEAKING TIME: approximately 1 minute 30 seconds
WORD COUNT: 153

${exampleBreakdown}

${includeAlternative ? `ALTERNATIVE ANGLE:
If asked for another example: "I also demonstrated this when I handled a similar situation during a cross-team collaboration where I had to coordinate between three departments within a tight 30-day window."
` : ""}
${includeFollowUp ? `FOLLOW-UP PREP:
Q: "What would you do differently?" -> "I would start with better upfront planning to catch issues earlier in the process."
Q: "What did you learn?" -> "I learned that proactive communication prevents most bottlenecks, which I now apply to every project."
Q: "How does this apply here?" -> "This experience directly applies to your need for someone who can handle complex challenges effectively."
` : ""}
${includeDeliveryTips ? `DELIVERY TIPS:
BODY LANGUAGE: Maintain eye contact, use natural hand gestures when describing actions, sit forward with confident posture.
TONE AND PACING: Speak at a moderate pace, pause briefly between sections, show enthusiasm when discussing results.
ENGAGEMENT: Watch for interviewer reactions, be ready to elaborate on any section.
` : ""}
${exampleStrengths}

---

Now write a REAL answer for the question: "${question.trim()}"
Role: ${jobTitle.trim()} in ${industry} (${expLabel})

Write ONLY the spoken answer in SAMPLE ANSWER. Use the EXACT same format sections as above. Do NOT add commentary inside the answer.`;

    try {
      const result = await generateRaw({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        maxTokens: 3000,
        onChunk: (text) => setStreamingText(text),
      });

      if (result) {
        const parsed = parseInterviewOutput(result);
        const record: InterviewAnswerRecord = {
          id: generateId(),
          question: question.trim(),
          jobTitle: jobTitle.trim(),
          industry,
          experienceLevel,
          answer: parsed.answer,
          starBreakdown: parsed.starBreakdown,
          alternativeAngle: parsed.alternativeAngle,
          followUpQuestions: parsed.followUpQuestions,
          deliveryTips: parsed.deliveryTips,
          strengthsShown: parsed.strengthsShown,
          favorites: [],
          createdAt: new Date().toISOString(),
        };
        setCurrentRecord(record);
        saveAnswer(record);
      }
    } catch (err) {
      console.error("Generation error:", err);
    }

    setIsGenerating(false);
  };

  const canGenerate = state === "ready" && question.trim().length > 0 && jobTitle.trim().length > 0 && !isGenerating;

  return (
    <div className="max-w-4xl mx-auto" data-testid="container-interview-generator">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8">
        {state !== "ready" && state !== "generating" && (
          <EngineStatus state={state} progress={progress} error={error} />
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="question" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Interview Question *
            </label>
            <textarea
              id="question"
              data-testid="input-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value.slice(0, 500))}
              placeholder={"Paste the interview question here. Examples:\n- Tell me about a time when you faced a difficult challenge\n- Describe a situation where you had to work with a difficult team member\n- What is your greatest weakness?\n- Tell me about yourself\n- Why should we hire you?"}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-none"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-400">Enter the exact question you want to prepare for</span>
              <span data-testid="text-char-count" className="text-xs text-slate-400">{question.length}/500</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="job-title" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Target Job Title *
              </label>
              <input
                id="job-title"
                data-testid="input-job-title"
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value.slice(0, 100))}
                placeholder="e.g., Software Engineer, Marketing Manager"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              />
            </div>
            <div>
              <label htmlFor="industry" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Industry/Field *
              </label>
              <select
                id="industry"
                data-testid="select-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Experience Level *
            </label>
            <div className="flex flex-wrap gap-2" data-testid="container-experience-level">
              {EXPERIENCE_LEVELS.map((exp) => (
                <button
                  key={exp.value}
                  data-testid={`toggle-exp-${exp.value}`}
                  onClick={() => setExperienceLevel(exp.value)}
                  className={cn(
                    "px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-center",
                    experienceLevel === exp.value
                      ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                  )}
                >
                  <div className="font-semibold">{exp.label}</div>
                  <div className="text-xs opacity-60">{exp.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="relevant-experience" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Relevant Experience <span className="text-xs font-normal text-slate-400">(highly recommended)</span>
            </label>
            <textarea
              id="relevant-experience"
              data-testid="input-relevant-experience"
              value={relevantExperience}
              onChange={(e) => setRelevantExperience(e.target.value.slice(0, 500))}
              placeholder={"Share a specific situation from your past that relates to this question. Include:\n- What was the situation/challenge?\n- What was your role?\n- What did you do?\n- What was the result?"}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-none"
            />
            <span className="text-xs text-slate-400 mt-1 block">The more specific you are, the better your answer</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="skills" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Skills to Highlight
              </label>
              <input
                id="skills"
                data-testid="input-skills"
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value.slice(0, 200))}
                placeholder="e.g., leadership, problem-solving, data analysis"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              />
            </div>
            <div>
              <label htmlFor="answer-style" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Answer Style
              </label>
              <select
                id="answer-style"
                data-testid="select-answer-style"
                value={answerStyle}
                onChange={(e) => setAnswerStyle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all"
              >
                {ANSWER_STYLES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="company-info" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Company Information
            </label>
            <textarea
              id="company-info"
              data-testid="input-company-info"
              value={companyInfo}
              onChange={(e) => setCompanyInfo(e.target.value.slice(0, 300))}
              placeholder="What do you know about this company? (culture, values, mission, recent news) This helps tailor your answer to show fit."
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Answer Length
            </label>
            <div className="flex gap-2" data-testid="container-answer-length">
              {ANSWER_LENGTHS.map((l) => (
                <button
                  key={l.value}
                  data-testid={`toggle-length-${l.value}`}
                  onClick={() => setAnswerLength(l.value)}
                  className={cn(
                    "flex-1 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-center",
                    answerLength === l.value
                      ? "bg-purple-100 text-purple-700 border-purple-300 ring-1 ring-purple-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-purple-200"
                  )}
                >
                  <div className="font-semibold">{l.label}</div>
                  <div className="text-xs opacity-60">{l.desc}</div>
                  <div className="text-xs opacity-40">{l.words}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <button
              data-testid="button-toggle-advanced"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              <ChevronDown className={cn("w-4 h-4 transition-transform", showAdvanced && "rotate-180")} />
              Advanced Options
            </button>
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-3">
                    <ToggleOption testId="toggle-delivery-tips" label="Include delivery tips" value={includeDeliveryTips} onChange={() => setIncludeDeliveryTips(!includeDeliveryTips)} />
                    <ToggleOption testId="toggle-follow-up" label="Include follow-up question prep" value={includeFollowUp} onChange={() => setIncludeFollowUp(!includeFollowUp)} />
                    <ToggleOption testId="toggle-alternative" label="Include alternative example" value={includeAlternative} onChange={() => setIncludeAlternative(!includeAlternative)} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-3">
            <button
              data-testid="button-generate"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={cn(
                "flex-1 py-4 rounded-xl font-bold text-white text-lg transition-all flex items-center justify-center gap-3",
                canGenerate
                  ? "bg-gradient-primary shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0"
                  : "bg-slate-300 cursor-not-allowed"
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Crafting your STAR answer...
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  Generate Interview Answer
                </>
              )}
            </button>
            <button
              data-testid="button-reset"
              onClick={handleReset}
              disabled={isGenerating}
              className="px-4 py-4 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {isGenerating && streamingText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8"
          data-testid="container-streaming"
        >
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
            <span className="text-sm font-medium text-purple-600">Analyzing question... Structuring STAR framework... Adding delivery tips...</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-600 font-mono leading-relaxed">
            {streamingText}
          </pre>
        </motion.div>
      )}

      {currentRecord && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-6"
          data-testid="container-results"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-8" data-testid="card-main-answer">
            <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Your Interview Answer</span>
                <p className="text-sm text-slate-500 mt-1 italic" data-testid="text-question-echo">"{currentRecord.question}"</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1" data-testid="stat-speaking-time">
                  <Clock className="w-3.5 h-3.5" />
                  {currentRecord.answer.speakingTime}
                </span>
                <span data-testid="stat-word-count">{currentRecord.answer.wordCount} words</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 my-4">
              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line" data-testid="text-answer-content">
                {currentRecord.answer.content}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                data-testid="button-copy-answer"
                onClick={() => copyToClipboard(currentRecord.answer.content, "main")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  copiedId === "main"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                )}
              >
                {copiedId === "main" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedId === "main" ? "Copied!" : "Copy Answer"}
              </button>
              <InlineShareButtons />
              <button
                data-testid="button-fav-answer"
                onClick={() => {
                  toggleFavorite(currentRecord.id, currentRecord.answer.id);
                  setCurrentRecord((prev) => {
                    if (!prev) return prev;
                    const isFav = prev.favorites.includes(prev.answer.id);
                    return {
                      ...prev,
                      favorites: isFav
                        ? prev.favorites.filter((id) => id !== prev.answer.id)
                        : [...prev.favorites, prev.answer.id],
                    };
                  });
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all"
              >
                <Heart className={cn("w-4 h-4", currentRecord.favorites.includes(currentRecord.answer.id) ? "text-red-500 fill-red-500" : "")} />
                {currentRecord.favorites.includes(currentRecord.answer.id) ? "Saved" : "Save"}
              </button>
            </div>
          </div>

          {currentRecord.starBreakdown && (
            <StarBreakdownSection breakdown={currentRecord.starBreakdown} />
          )}

          {currentRecord.alternativeAngle && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-alternative">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-bold text-slate-800">Alternative Angle</h3>
              </div>
              <p className="text-sm text-slate-500 mb-2">If the interviewer asks for another example:</p>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line" data-testid="text-alternative">
                  {currentRecord.alternativeAngle}
                </p>
              </div>
            </div>
          )}

          {currentRecord.followUpQuestions.length > 0 && (
            <FollowUpSection followUps={currentRecord.followUpQuestions} />
          )}

          {currentRecord.deliveryTips.length > 0 && (
            <DeliveryTipsSection tips={currentRecord.deliveryTips} />
          )}

          {currentRecord.strengthsShown.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-strengths">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-purple-500" />
                <h3 className="text-base font-bold text-slate-800">Key Strengths Demonstrated</h3>
              </div>
              <div className="space-y-2">
                {currentRecord.strengthsShown.map((strength, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm" data-testid={`strength-item-${i}`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              data-testid="button-regenerate"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-purple-200 text-purple-700 font-medium hover:bg-purple-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ToggleOption({ testId, label, value, onChange }: { testId: string; label: string; value: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <button
        data-testid={testId}
        onClick={onChange}
        className={cn(
          "w-10 h-6 rounded-full transition-colors relative shrink-0 ml-3",
          value ? "bg-purple-500" : "bg-slate-300"
        )}
      >
        <div className={cn("w-4 h-4 rounded-full bg-white absolute top-1 transition-all", value ? "left-5" : "left-1")} />
      </button>
    </label>
  );
}

function EngineStatus({ state, progress, error }: { state: string; progress: { text: string; percent: number }; error: string | null }) {
  if (state === "error") {
    return (
      <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3" data-testid="status-error">
        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-700">AI Engine Error</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="mb-6 p-4 rounded-xl bg-purple-50 border border-purple-200" data-testid="status-loading">
      <div className="flex items-center gap-3 mb-2">
        <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
        <span className="text-sm font-medium text-purple-700">
          {state === "checking-gpu" ? "Checking WebGPU support..." : "Loading AI model..."}
        </span>
      </div>
      {state === "downloading" && (
        <div className="w-full bg-purple-100 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-gradient-primary rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }} />
        </div>
      )}
    </div>
  );
}

function StarBreakdownSection({ breakdown }: { breakdown: StarBreakdown }) {
  const [open, setOpen] = useState(false);

  const sections = [
    { key: "S", label: "Situation", icon: Target, color: "text-blue-600", content: breakdown.situation },
    { key: "T", label: "Task", icon: Lightbulb, color: "text-amber-600", content: breakdown.task },
    { key: "A", label: "Action", icon: Star, color: "text-purple-600", content: breakdown.action },
    { key: "R", label: "Result", icon: Award, color: "text-emerald-600", content: breakdown.result },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-star-breakdown">
      <button
        data-testid="button-toggle-star"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500" />
          <h3 className="text-base font-bold text-slate-800">STAR Breakdown</h3>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              {sections.map((s) => (
                s.content && (
                  <div key={s.key} className="flex items-start gap-3" data-testid={`star-${s.key.toLowerCase()}`}>
                    <div className={cn("flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 shrink-0 font-bold text-sm", s.color)}>
                      {s.key}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{s.label}</div>
                      <p className="text-sm text-slate-700 leading-relaxed">{s.content}</p>
                    </div>
                  </div>
                )
              ))}
              {breakdown.skillsDemonstrated.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Skills Demonstrated</div>
                  <div className="flex flex-wrap gap-2">
                    {breakdown.skillsDemonstrated.map((skill, i) => (
                      <span key={i} className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {breakdown.metrics.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Metrics Highlighted</div>
                  <div className="flex flex-wrap gap-2">
                    {breakdown.metrics.map((metric, i) => (
                      <span key={i} className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FollowUpSection({ followUps }: { followUps: FollowUpQuestion[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-follow-up">
      <button
        data-testid="button-toggle-followup"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-500" />
          <h3 className="text-base font-bold text-slate-800">Follow-Up Question Prep</h3>
          <span className="text-xs text-slate-400">({followUps.length})</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              {followUps.map((fu, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50" data-testid={`followup-item-${i}`}>
                  <p className="text-sm font-semibold text-slate-800 mb-1">Q: "{fu.question}"</p>
                  <p className="text-sm text-slate-600">{fu.approach}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DeliveryTipsSection({ tips }: { tips: DeliveryTip[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6" data-testid="container-delivery-tips">
      <button
        data-testid="button-toggle-delivery"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-purple-500" />
          <h3 className="text-base font-bold text-slate-800">Delivery Tips</h3>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              {tips.map((tip, i) => (
                <div key={i} data-testid={`delivery-tip-${i}`}>
                  <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">{tip.category}</div>
                  <ul className="space-y-1.5">
                    {tip.tips.map((t, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function parseInterviewOutput(raw: string): {
  answer: InterviewAnswer;
  starBreakdown: StarBreakdown | null;
  alternativeAngle: string;
  followUpQuestions: FollowUpQuestion[];
  deliveryTips: DeliveryTip[];
  strengthsShown: string[];
} {
  let answerContent = "";
  let speakingTime = "";
  let wordCount = 0;
  let starBreakdown: StarBreakdown | null = null;
  let alternativeAngle = "";
  const followUpQuestions: FollowUpQuestion[] = [];
  const deliveryTips: DeliveryTip[] = [];
  const strengthsShown: string[] = [];

  const answerMatch = raw.match(/SAMPLE ANSWER[:\s]*\n([\s\S]*?)(?=\n(?:SPEAKING TIME|WORD COUNT|STAR BREAKDOWN|ALTERNATIVE|FOLLOW-UP|DELIVERY|STRENGTHS|$))/i);
  if (answerMatch) {
    answerContent = answerMatch[1].trim();
  }

  if (!answerContent) {
    const lines = raw.split("\n");
    const contentLines: string[] = [];
    let started = false;
    for (const line of lines) {
      if (/^(SPEAKING TIME|WORD COUNT|STAR BREAKDOWN|ALTERNATIVE|FOLLOW-UP|DELIVERY|STRENGTHS)/i.test(line.trim())) break;
      if (/^(SAMPLE ANSWER|INTERVIEW ANSWER|YOUR ANSWER)/i.test(line.trim())) {
        started = true;
        continue;
      }
      if (started || (!line.trim().startsWith("━") && !line.trim().startsWith("═") && line.trim().length > 0 && !contentLines.length)) {
        started = true;
        contentLines.push(line);
      }
    }
    answerContent = contentLines.join("\n").trim();
  }

  const metaPatterns = [
    /^(This|The|Overall,?\s*this|Squeezed|In this|Here,?\s*the|Note:|The STAR|The answer|This answer|This response|The candidate|It shows|It demonstrates)[^.]*?(demonstrates?|showcases?|shows|highlights?|ensures?|covers?|positions?|effectively|attributes?|method|valuable|comprehensive|concise|element)[^.]*\.?\s*$/gim,
    /^(This is a|The above|As you can see|Notice how|The key takeaway)[^.]*\.?\s*$/gim,
  ];
  for (const pattern of metaPatterns) {
    answerContent = answerContent.replace(pattern, "").trim();
  }
  answerContent = answerContent.replace(/\n{3,}/g, "\n\n").trim();

  const timeMatch = raw.match(/SPEAKING TIME:?\s*(.+)/i);
  if (timeMatch) speakingTime = timeMatch[1].trim();

  const wcMatch = raw.match(/WORD COUNT:?\s*(\d+)/i);
  wordCount = wcMatch ? parseInt(wcMatch[1]) : answerContent.split(/\s+/).length;

  if (!speakingTime) {
    const minutes = Math.floor(wordCount / 130);
    const seconds = Math.round((wordCount % 130) / 130 * 60);
    speakingTime = minutes > 0 ? `~${minutes} min ${seconds > 0 ? `${seconds} sec` : ""}` : `~${seconds} seconds`;
  }

  const starMatch = raw.match(/STAR BREAKDOWN:?\s*\n([\s\S]*?)(?=\n(?:ALTERNATIVE|FOLLOW-UP|DELIVERY|STRENGTHS|$))/i);
  if (starMatch) {
    const starText = starMatch[1];

    const extractMultiline = (text: string, key: string, nextKeys: string[]): string => {
      const nextPattern = nextKeys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
      const regex = new RegExp(`${key}:?\\s*([\\s\\S]*?)(?=\\n(?:${nextPattern})|$)`, "i");
      const m = text.match(regex);
      if (!m) return "";
      return m[1].split("\n").map((l) => l.trim().replace(/^[-*\u2022]\s*/, "")).filter(Boolean).join(" ").trim();
    };

    const situation = extractMultiline(starText, "SITUATION", ["TASK", "ACTION", "RESULT", "SKILLS", "METRICS"]);
    const task = extractMultiline(starText, "TASK", ["ACTION", "RESULT", "SKILLS", "METRICS"]);
    const action = extractMultiline(starText, "ACTION", ["RESULT", "SKILLS", "METRICS"]);
    const result = extractMultiline(starText, "RESULT", ["SKILLS", "METRICS"]);
    const skillsLine = extractMultiline(starText, "SKILLS", ["METRICS"]);
    const metricsLine = extractMultiline(starText, "METRICS", []);

    starBreakdown = {
      situation,
      task,
      action,
      result,
      skillsDemonstrated: skillsLine ? skillsLine.split(/,/).map((s) => s.trim()).filter(Boolean) : [],
      metrics: metricsLine ? metricsLine.split(/,/).map((s) => s.trim()).filter(Boolean) : [],
    };
  }

  const altMatch = raw.match(/ALTERNATIVE (?:ANGLE|EXAMPLE)[:\s]*\n([\s\S]*?)(?=\n(?:FOLLOW-UP|DELIVERY|STRENGTHS|$))/i);
  if (altMatch) {
    alternativeAngle = altMatch[1].trim().replace(/^If asked for another example:?\s*/i, "").replace(/^["']|["']$/g, "").trim();
  }

  const followUpMatch = raw.match(/FOLLOW-UP (?:PREP|QUESTIONS?)[:\s]*\n([\s\S]*?)(?=\n(?:DELIVERY|STRENGTHS|$))/i);
  if (followUpMatch) {
    const fuLines = followUpMatch[1].split("\n");
    let currentQ = "";
    for (const line of fuLines) {
      const qMatch = line.match(/Q:?\s*"?([^"]+)"?\s*(?:->|→|:)\s*(.*)/i);
      if (qMatch) {
        followUpQuestions.push({
          question: qMatch[1].trim(),
          approach: qMatch[2].trim(),
        });
      }
    }
  }

  const deliveryMatch = raw.match(/DELIVERY TIPS?[:\s]*\n([\s\S]*?)(?=\n(?:STRENGTHS|$))/i);
  if (deliveryMatch) {
    const dtText = deliveryMatch[1];
    const lines = dtText.split("\n");
    let currentCategory = "";
    let currentTips: string[] = [];

    const flushCategory = () => {
      if (currentCategory && currentTips.length > 0) {
        deliveryTips.push({ category: currentCategory, tips: [...currentTips] });
      }
      currentTips = [];
    };

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const headerMatch = trimmed.match(/^([A-Z][A-Z &/]+):?\s*(.*)/);
      if (headerMatch && headerMatch[1].length < 30) {
        flushCategory();
        currentCategory = headerMatch[1].trim();
        const rest = (headerMatch[2] || "").trim();
        if (rest.length > 5) {
          rest.split(/[.,;]/).map((t) => t.trim()).filter((t) => t.length > 5).forEach((t) => currentTips.push(t));
        }
      } else {
        const cleaned = trimmed.replace(/^[-*\u2022\u2713\u2717]\s*/, "").trim();
        if (cleaned.length > 5) currentTips.push(cleaned);
      }
    }
    flushCategory();
  }

  const strengthsMatch = raw.match(/STRENGTHS (?:SHOWN|DEMONSTRATED)[:\s]*\n([\s\S]*?)(?:$|---)/i);
  if (strengthsMatch) {
    const lines = strengthsMatch[1].split("\n");
    for (const line of lines) {
      const cleaned = line.trim().replace(/^[-*\u2022]\s*/, "");
      if (cleaned.length > 5) strengthsShown.push(cleaned);
    }
  }

  if (!answerContent || answerContent.length < 20) {
    answerContent = raw.replace(/^(INTERVIEW ANSWER|SAMPLE ANSWER|STAR BREAKDOWN|ALTERNATIVE|FOLLOW-UP|DELIVERY|STRENGTHS|SPEAKING TIME|WORD COUNT)[:\s].*/gim, "").trim();
  }

  return {
    answer: {
      id: generateId(),
      content: answerContent,
      speakingTime,
      wordCount,
    },
    starBreakdown,
    alternativeAngle,
    followUpQuestions,
    deliveryTips,
    strengthsShown,
  };
}
