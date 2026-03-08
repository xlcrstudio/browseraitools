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
