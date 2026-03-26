import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import HookGeneratorPage from "@/pages/HookGeneratorPage";
import CTAGeneratorPage from "@/pages/CTAGeneratorPage";
import CoverLetterGeneratorPage from "@/pages/CoverLetterGeneratorPage";
import StartupNameGeneratorPage from "@/pages/StartupNameGeneratorPage";
import BusinessIdeaGeneratorPage from "@/pages/BusinessIdeaGeneratorPage";
import KeywordGeneratorPage from "@/pages/KeywordGeneratorPage";
import HashtagGeneratorPage from "@/pages/HashtagGeneratorPage";
import TikTokCaptionGeneratorPage from "@/pages/TikTokCaptionGeneratorPage";
import LinkedInPostGeneratorPage from "@/pages/LinkedInPostGeneratorPage";
import ToneConverterPage from "@/pages/ToneConverterPage";
import InterviewAnswerGeneratorPage from "@/pages/InterviewAnswerGeneratorPage";
import ResumeBulletGeneratorPage from "@/pages/ResumeBulletGeneratorPage";
import BlogOutlineGeneratorPage from "@/pages/BlogOutlineGeneratorPage";
import DocumentAnalyzerPage from "@/pages/DocumentAnalyzerPage";
import MessageAnalyzerPage from "@/pages/MessageAnalyzerPage";
import ExplainThisPage from "@/pages/ExplainThisPage";
import EssayWriterPage from "@/pages/EssayWriterPage";
import DatingProfilePage from "@/pages/DatingProfilePage";
import MealPlannerPage from "@/pages/MealPlannerPage";
import TravelPlannerPage from "@/pages/TravelPlannerPage";
import ContentGapPage from "@/pages/ContentGapPage";
import SchemaMarkupPage from "@/pages/SchemaMarkupPage";
import SerpIntentPage from "@/pages/SerpIntentPage";
import MetaDescriptionPage from "@/pages/MetaDescriptionPage";
import SeoTitlePage from "@/pages/SeoTitlePage";
import InternalLinkPage from "@/pages/InternalLinkPage";
import ContentBriefPage from "@/pages/ContentBriefPage";
import LinkedInSummaryPage from "@/pages/LinkedInSummaryPage";
import RoastPage from "@/pages/RoastPage";
import PromptGeneratorPage from "@/pages/PromptGeneratorPage";
import ProsConsPage from "@/pages/ProsConsPage";
import ComplimentPage from "@/pages/ComplimentPage";
import ExcusePage from "@/pages/ExcusePage";
import DecisionPage from "@/pages/DecisionPage";
import StoryStarterPage from "@/pages/StoryStarterPage";
import CaptionPage from "@/pages/CaptionPage";
import TweetPage from "@/pages/TweetPage";
import YTTitlePage from "@/pages/YTTitlePage";
import YTDescPage from "@/pages/YTDescPage";
import IGBioPage from "@/pages/IGBioPage";
import DebatePage from "@/pages/DebatePage";
import ATSMatcherPage from "@/pages/ATSMatcherPage";
import TodoListPage from "@/pages/TodoListPage";
import GoalPlannerPage from "@/pages/GoalPlannerPage";
import WeeklyPlannerPage from "@/pages/WeeklyPlannerPage";
import SalesEmailPage from "@/pages/SalesEmailPage";
import AdCopyPage from "@/pages/AdCopyPage";
import ElevatorPitchPage from "@/pages/ElevatorPitchPage";
import ColdOutreachPage from "@/pages/ColdOutreachPage";
import LandingPageCopyPage from "@/pages/LandingPageCopyPage";
import TargetAudiencePage from "@/pages/TargetAudiencePage";
import ValuePropPage from "@/pages/ValuePropPage";
import BusinessNamePage from "@/pages/BusinessNamePage";
import MeetingSummaryPage from "@/pages/MeetingSummaryPage";
import ParagraphRewriterPage from "@/pages/ParagraphRewriterPage";
import BulletPointsPage from "@/pages/BulletPointsPage";
import FAQGeneratorPage from "@/pages/FAQGeneratorPage";
import SimplifierPage from "@/pages/SimplifierPage";
import ExpanderPage from "@/pages/ExpanderPage";
import HeadlineImproverPage from "@/pages/HeadlineImproverPage";
import ShortenerPage from "@/pages/ShortenerPage";
import CodePlaygroundPage from "@/pages/CodePlaygroundPage";
import PDFSummarizerPage from "@/pages/PDFSummarizerPage";
import AIHumanizerPage from "@/pages/AIHumanizerPage";
import AIBlogGeneratorPage from "@/pages/AIBlogGeneratorPage";
import YouTubeScriptPage from "@/pages/YouTubeScriptPage";
import AIChatPage from "@/pages/AIChatPage";
import HomeworkSolverPage from "@/pages/HomeworkSolverPage";
import AITextDetectorPage from "@/pages/AITextDetectorPage";
import AIPDFChatPage from "@/pages/AIPDFChatPage";
import TextSummarizerPage from "@/pages/TextSummarizerPage";
import EmailResponseGeneratorPage from "@/pages/EmailResponseGeneratorPage";
import GrammarCheckerPage from "@/pages/GrammarCheckerPage";
import TranslatorPage from "@/pages/TranslatorPage";
import ParaphrasingToolPage from "@/pages/ParaphrasingToolPage";
import ImagePromptGeneratorPage from "@/pages/ImagePromptGeneratorPage";
import CodeExplainerPage from "@/pages/CodeExplainerPage";
import FlashcardGeneratorPage from "@/pages/FlashcardGeneratorPage";
import PersonalStatementGeneratorPage from "@/pages/PersonalStatementGeneratorPage";
import LocalKnowledgeChatPage from "@/pages/LocalKnowledgeChatPage";
import CitationGeneratorPage from "@/pages/CitationGeneratorPage";
import ReadabilityAnalyzerPage from "@/pages/ReadabilityAnalyzerPage";
import EssayGraderPage from "@/pages/EssayGraderPage";
import YouTubeSummarizerPage from "@/pages/YouTubeSummarizerPage";
import ContractSimplifierPage from "@/pages/ContractSimplifierPage";
import ContentRepurposerPage from "@/pages/ContentRepurposerPage";
import PiiRedactorPage from "@/pages/PiiRedactorPage";
import WritingFeedbackCoachPage from "@/pages/WritingFeedbackCoachPage";
import WordCounterPage from "@/pages/WordCounterPage";
import PlagiarismCheckerPage from "@/pages/PlagiarismCheckerPage";
import CaseConverterPage from "@/pages/CaseConverterPage";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/ai-hook-generator" component={HookGeneratorPage} />
      <Route path="/ai-cta-generator" component={CTAGeneratorPage} />
      <Route path="/ai-cover-letter-generator" component={CoverLetterGeneratorPage} />
      <Route path="/ai-startup-name-generator" component={StartupNameGeneratorPage} />
      <Route path="/ai-business-idea-generator" component={BusinessIdeaGeneratorPage} />
      <Route path="/ai-keyword-generator" component={KeywordGeneratorPage} />
      <Route path="/ai-hashtag-generator" component={HashtagGeneratorPage} />
      <Route path="/ai-tiktok-caption-generator" component={TikTokCaptionGeneratorPage} />
      <Route path="/ai-linkedin-post-generator" component={LinkedInPostGeneratorPage} />
      <Route path="/ai-tone-converter" component={ToneConverterPage} />
      <Route path="/ai-interview-answer-generator" component={InterviewAnswerGeneratorPage} />
      <Route path="/ai-resume-bullet-generator" component={ResumeBulletGeneratorPage} />
      <Route path="/ai-blog-outline-generator" component={BlogOutlineGeneratorPage} />
      <Route path="/ai-document-analyzer" component={DocumentAnalyzerPage} />
      <Route path="/ai-message-analyzer" component={MessageAnalyzerPage} />
      <Route path="/explain-this-ai" component={ExplainThisPage} />
      <Route path="/ai-essay-writer" component={EssayWriterPage} />
      <Route path="/ai-dating-profile-generator" component={DatingProfilePage} />
      <Route path="/ai-meal-planner" component={MealPlannerPage} />
      <Route path="/ai-travel-itinerary-planner" component={TravelPlannerPage} />
      <Route path="/ai-content-gap-analyzer" component={ContentGapPage} />
      <Route path="/ai-schema-markup-generator" component={SchemaMarkupPage} />
      <Route path="/ai-serp-intent-analyzer" component={SerpIntentPage} />
      <Route path="/ai-meta-description-generator" component={MetaDescriptionPage} />
      <Route path="/ai-seo-title-generator" component={SeoTitlePage} />
      <Route path="/ai-internal-link-suggestion-tool" component={InternalLinkPage} />
      <Route path="/ai-content-brief-generator" component={ContentBriefPage} />
      <Route path="/ai-linkedin-summary-generator" component={LinkedInSummaryPage} />
      <Route path="/ai-roast-generator" component={RoastPage} />
      <Route path="/ai-prompt-generator" component={PromptGeneratorPage} />
      <Route path="/ai-pros-and-cons-generator" component={ProsConsPage} />
      <Route path="/ai-compliment-generator" component={ComplimentPage} />
      <Route path="/ai-excuse-generator" component={ExcusePage} />
      <Route path="/ai-decision-maker" component={DecisionPage} />
      <Route path="/ai-story-starter" component={StoryStarterPage} />
      <Route path="/ai-instagram-caption-generator" component={CaptionPage} />
      <Route path="/ai-tweet-generator" component={TweetPage} />
      <Route path="/ai-youtube-title-generator" component={YTTitlePage} />
      <Route path="/ai-youtube-description-generator" component={YTDescPage} />
      <Route path="/ai-instagram-bio-generator" component={IGBioPage} />
      <Route path="/ai-debate-generator" component={DebatePage} />
      <Route path="/ai-ats-resume-matcher" component={ATSMatcherPage} />
      <Route path="/ai-todo-list-generator" component={TodoListPage} />
      <Route path="/ai-goal-planner" component={GoalPlannerPage} />
      <Route path="/ai-weekly-planner-generator" component={WeeklyPlannerPage} />
      <Route path="/ai-sales-email-generator" component={SalesEmailPage} />
      <Route path="/ai-ad-copy-generator" component={AdCopyPage} />
      <Route path="/ai-elevator-pitch-generator" component={ElevatorPitchPage} />
      <Route path="/ai-cold-outreach-generator" component={ColdOutreachPage} />
      <Route path="/ai-landing-page-copy-generator" component={LandingPageCopyPage} />
      <Route path="/ai-target-audience-generator" component={TargetAudiencePage} />
      <Route path="/ai-value-proposition-generator" component={ValuePropPage} />
      <Route path="/ai-business-name-generator" component={BusinessNamePage} />
      <Route path="/ai-meeting-summary-generator" component={MeetingSummaryPage} />
      <Route path="/ai-paragraph-rewriter" component={ParagraphRewriterPage} />
      <Route path="/ai-bullet-points-generator" component={BulletPointsPage} />
      <Route path="/ai-faq-generator" component={FAQGeneratorPage} />
      <Route path="/ai-sentence-simplifier" component={SimplifierPage} />
      <Route path="/ai-sentence-expander" component={ExpanderPage} />
      <Route path="/ai-headline-improver" component={HeadlineImproverPage} />
      <Route path="/ai-sentence-shortener" component={ShortenerPage} />
      <Route path="/ai-code-playground" component={CodePlaygroundPage} />
      <Route path="/ai-pdf-summarizer" component={PDFSummarizerPage} />
      <Route path="/ai-humanizer" component={AIHumanizerPage} />
      <Route path="/ai-blog-post-generator" component={AIBlogGeneratorPage} />
      <Route path="/ai-youtube-script-generator" component={YouTubeScriptPage} />
      <Route path="/ai-chatbot" component={AIChatPage} />
      <Route path="/ai-homework-solver" component={HomeworkSolverPage} />
      <Route path="/ai-text-detector" component={AITextDetectorPage} />
      <Route path="/ai-pdf-chat" component={AIPDFChatPage} />
      <Route path="/ai-text-summarizer" component={TextSummarizerPage} />
      <Route path="/ai-email-response-generator" component={EmailResponseGeneratorPage} />
      <Route path="/ai-grammar-checker" component={GrammarCheckerPage} />
      <Route path="/ai-translator" component={TranslatorPage} />
      <Route path="/ai-paraphrasing-tool" component={ParaphrasingToolPage} />
      <Route path="/ai-image-prompt-generator" component={ImagePromptGeneratorPage} />
      <Route path="/ai-code-explainer" component={CodeExplainerPage} />
      <Route path="/ai-flashcard-generator" component={FlashcardGeneratorPage} />
      <Route path="/ai-personal-statement-generator" component={PersonalStatementGeneratorPage} />
      <Route path="/ai-local-knowledge-chat" component={LocalKnowledgeChatPage} />
      <Route path="/ai-citation-generator" component={CitationGeneratorPage} />
      <Route path="/ai-readability-analyzer" component={ReadabilityAnalyzerPage} />
      <Route path="/ai-essay-grader" component={EssayGraderPage} />
      <Route path="/ai-youtube-summarizer" component={YouTubeSummarizerPage} />
      <Route path="/ai-contract-simplifier" component={ContractSimplifierPage} />
      <Route path="/ai-content-repurposer" component={ContentRepurposerPage} />
      <Route path="/ai-pii-redactor" component={PiiRedactorPage} />
      <Route path="/ai-writing-feedback-coach" component={WritingFeedbackCoachPage} />
      <Route path="/word-counter" component={WordCounterPage} />
      <Route path="/ai-plagiarism-checker" component={PlagiarismCheckerPage} />
      <Route path="/case-converter" component={CaseConverterPage} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Layout>
          <Router />
        </Layout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
