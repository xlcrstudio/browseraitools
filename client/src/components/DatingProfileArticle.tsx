import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function DatingProfileArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6" data-testid="text-dating-profile-article-heading">
          Free AI Dating Profile Generator -- Get More Matches with a Better Bio
        </h2>

        <ArticleSection title="What Makes a Great Dating Profile">
          <p>A great dating profile does three things: it grabs attention in the first few words, communicates who you are authentically, and gives people a reason to start a conversation. Most profiles fail because they are either too generic or try too hard to impress.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Hook</h4>
          <p>Your opening line is everything. In a world of endless swiping, you have roughly two seconds to make someone pause. A strong hook is specific, unexpected, or funny -- never a cliché like "I love to laugh" or "looking for my partner in crime." The AI crafts openers that feel natural while standing out from the crowd.</p>
          <h4 className="font-bold text-slate-800 mt-4">Authenticity Over Perfection</h4>
          <p>People connect with real personalities, not polished résumés. The best profiles reveal genuine quirks, passions, and humor. Our AI generates content that reflects your actual vibe -- whether that is playful, thoughtful, adventurous, or laid-back -- rather than producing generic lines that could belong to anyone.</p>
        </ArticleSection>

        <ArticleSection title="App-Specific Strategies">
          <p>Each dating app has its own culture, format, and audience expectations. A profile that works on Tinder might fall flat on Hinge, and vice versa. Understanding these differences is key to maximizing your matches.</p>
          <h4 className="font-bold text-slate-800 mt-4">Tinder</h4>
          <p>Tinder is fast-paced and visual. Bios should be short, punchy, and either funny or intriguing. You have limited space, so every word counts. The AI generates concise bios that pack personality into a few lines, making the most of Tinder's quick-swipe format.</p>
          <h4 className="font-bold text-slate-800 mt-4">Bumble</h4>
          <p>Bumble encourages more intentional connections. Profiles benefit from showing depth and conversation starters, since women make the first move. The AI writes bios that invite engagement and give your match something specific to open with.</p>
          <h4 className="font-bold text-slate-800 mt-4">Hinge</h4>
          <p>Hinge revolves around prompt answers -- short responses to pre-set questions like "A life goal of mine" or "I'm looking for." These answers are your chance to show personality in bite-sized pieces. The AI crafts prompt responses that are witty, genuine, and conversation-worthy.</p>
        </ArticleSection>

        <ArticleSection title="Writing an Authentic Bio">
          <p>Your bio is your elevator pitch for who you are as a person. It should feel like a conversation, not a job application. The goal is to give someone a snapshot of your personality that makes them want to know more.</p>
          <h4 className="font-bold text-slate-800 mt-4">Show, Don't Tell</h4>
          <p>Instead of saying "I'm funny," write something that actually makes people laugh. Instead of "I love adventure," describe the time you got lost hiking and ended up at the best taco stand you have ever found. Specific details are more memorable and more believable than broad claims.</p>
          <h4 className="font-bold text-slate-800 mt-4">Keep It Conversational</h4>
          <p>Write the way you talk. Overly formal or polished bios feel inauthentic and can make people hesitant to message you. The AI generates content in a natural, approachable tone that matches how real people communicate -- making it easy for matches to feel comfortable reaching out.</p>
        </ArticleSection>

        <ArticleSection title="Choosing the Right Photos">
          <p>Photos are the most important element of any dating profile. Your bio gets people interested, but your photos get you the swipe. Understanding what makes a good dating photo can dramatically increase your match rate.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Lead Photo</h4>
          <p>Your first photo should clearly show your face with good lighting. Smile naturally -- studies consistently show that genuine smiles increase attractiveness ratings. Avoid sunglasses, group shots, or heavily filtered images as your lead photo.</p>
          <h4 className="font-bold text-slate-800 mt-4">Telling a Story</h4>
          <p>Your photo lineup should paint a picture of your life. Include a mix of activities, settings, and moods. A travel photo, a candid with friends, a shot doing something you love -- each image should add a new dimension to who you are. The AI can generate captions for your photos that add context and personality.</p>
        </ArticleSection>

        <ArticleSection title="Crafting Opening Messages">
          <p>Getting a match is only half the battle. The first message sets the tone for the entire conversation and determines whether you will get a response or be left on read.</p>
          <h4 className="font-bold text-slate-800 mt-4">Beyond "Hey"</h4>
          <p>Generic openers like "Hey" or "What's up?" signal low effort. The best opening messages reference something specific from the other person's profile, ask an interesting question, or make a playful observation. Our AI generates opening lines tailored to different conversation styles -- from witty one-liners to thoughtful questions.</p>
          <h4 className="font-bold text-slate-800 mt-4">Matching Energy</h4>
          <p>Your opening message should match the vibe of your profile. If your bio is humorous, your opener should have that same energy. If you present yourself as thoughtful and genuine, lead with curiosity and depth. Consistency between your profile and your messages builds trust and feels more natural.</p>
        </ArticleSection>

        <ArticleSection title="Common Profile Mistakes">
          <p>Even small missteps in your profile can significantly reduce your match rate. Knowing what to avoid is just as important as knowing what to include.</p>
          <h4 className="font-bold text-slate-800 mt-4">Negativity and Demands</h4>
          <p>Listing what you do not want -- "no drama," "don't bother if you can't hold a conversation," "swipe left if..." -- creates a negative first impression. Focus on what you are looking for rather than what you are trying to avoid. Positive framing attracts more matches and better conversations.</p>
          <h4 className="font-bold text-slate-800 mt-4">Being Too Vague</h4>
          <p>Profiles that say "I like music, food, and traveling" describe virtually everyone. Specificity is what makes a profile memorable. Instead of "I like music," try "I have strong opinions about whether 'OK Computer' or 'Kid A' is the better Radiohead album." The AI helps you transform generic statements into specific, engaging ones.</p>
        </ArticleSection>

        <ArticleSection title="The Psychology of Attraction Online">
          <p>Understanding how people evaluate profiles can help you present yourself more effectively. Online attraction follows predictable patterns that you can leverage.</p>
          <h4 className="font-bold text-slate-800 mt-4">The Halo Effect</h4>
          <p>First impressions color everything that follows. A strong lead photo and opening line create a positive halo that makes people more receptive to the rest of your profile. This is why investing time in your first photo and bio opener pays outsized dividends compared to optimizing other elements.</p>
          <h4 className="font-bold text-slate-800 mt-4">Scarcity and Uniqueness</h4>
          <p>Profiles that feel unique and specific are more attractive than those that could belong to anyone. When you share a niche interest or an unusual perspective, you signal that you are a distinct individual worth getting to know -- not just another face in the feed. The AI generates content that highlights what makes you different.</p>
        </ArticleSection>

        <ArticleSection title="Building Confidence Through Your Profile">
          <p>A well-crafted profile is not just about getting matches -- it is about feeling good about how you present yourself. The process of articulating who you are and what you want can be genuinely empowering.</p>
          <h4 className="font-bold text-slate-800 mt-4">Knowing Your Worth</h4>
          <p>Many people undersell themselves on dating apps because they feel awkward writing about their own positive qualities. The AI helps you frame your strengths in a way that feels natural rather than boastful -- turning "I'm a good cook" into something like "My pasta carbonara has ended friendships (they fight over who gets invited next time)."</p>
          <h4 className="font-bold text-slate-800 mt-4">Iteration and Experimentation</h4>
          <p>Your dating profile is not a permanent document. The best approach is to try different bios, see what resonates, and refine over time. Generate multiple versions with different vibes, test them for a week each, and keep what works. Since everything runs privately in your browser, you can experiment as much as you want without any data being stored or shared.</p>
        </ArticleSection>
      </div>
    </section>
  );
}

function ArticleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left group"
        data-testid={`button-article-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
      >
        <h3 className="text-lg md:text-xl font-display font-bold text-slate-800 group-hover:text-purple-700 transition-colors">{title}</h3>
        <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform shrink-0 ml-4", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
            <div className="pt-4 text-slate-600 leading-relaxed space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
