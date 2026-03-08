import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function MealPlannerArticle() {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="prose prose-slate max-w-none">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-6" data-testid="text-meal-planner-article-heading">
          Best AI Meal Planner 2026 - How to Save Time & Money on Groceries
        </h2>

        <ArticleSection title="Why Meal Planning Saves Time and Money">
          <p>Meal planning is one of the most effective habits you can build for both your wallet and your schedule. Studies consistently show that households that plan meals ahead spend 20-30% less on groceries and waste significantly less food each week.</p>
          <h4 className="font-bold text-slate-800 mt-4">Eliminating Impulse Purchases</h4>
          <p>Walking into a grocery store without a plan is the fastest way to overspend. When you know exactly what you need for the week, you stick to your list and avoid tossing random items into the cart. A structured meal plan turns grocery shopping from a guessing game into a focused, efficient trip.</p>
          <h4 className="font-bold text-slate-800 mt-4">Reducing Food Waste</h4>
          <p>The average household throws away roughly 30% of the food it buys. Meal planning ensures every ingredient has a purpose. When you plan to use that bunch of cilantro across three different meals, nothing wilts forgotten in the back of the fridge. Our AI builds plans that reuse ingredients intelligently across the week.</p>
        </ArticleSection>

        <ArticleSection title="How AI Makes Meal Planning Effortless">
          <p>Traditional meal planning requires browsing recipes, cross-referencing ingredients, calculating portions, and building a shopping list -- a process that can take over an hour each week. AI compresses all of that into seconds.</p>
          <h4 className="font-bold text-slate-800 mt-4">Instant Personalization</h4>
          <p>Instead of searching through hundreds of recipes to find ones that match your dietary needs, budget, and family size, the AI generates a fully customized plan in one step. Tell it you need keto meals for a family of four under $100 a week, and it delivers exactly that -- no scrolling, no filtering, no compromise.</p>
          <h4 className="font-bold text-slate-800 mt-4">Smart Ingredient Reuse</h4>
          <p>One of the hardest parts of manual meal planning is making ingredients work across multiple meals. The AI naturally builds plans where a rotisserie chicken from Monday dinner becomes Tuesday's chicken salad, and Wednesday's chicken soup. This cross-utilization minimizes waste and keeps your grocery list shorter.</p>
        </ArticleSection>

        <ArticleSection title="Customizing Plans for Any Diet">
          <p>Whether you follow a strict dietary protocol or simply want to eat healthier, a good meal plan respects your nutritional boundaries while keeping meals interesting and satisfying.</p>
          <h4 className="font-bold text-slate-800 mt-4">Managing Restrictions Without Monotony</h4>
          <p>One of the biggest challenges with restrictive diets -- whether keto, vegan, gluten-free, or halal -- is falling into repetitive eating patterns. The AI draws from a vast knowledge of cuisines and cooking techniques to keep variety high even within strict dietary constraints. A vegan plan might include Thai curry one night, Mediterranean stuffed peppers the next, and Mexican black bean tacos after that.</p>
          <h4 className="font-bold text-slate-800 mt-4">Combining Multiple Restrictions</h4>
          <p>Real families often have overlapping dietary needs. One person might be dairy-free while another avoids gluten. The AI can handle multiple simultaneous restrictions, finding meals that satisfy everyone at the table without requiring separate dishes for each family member.</p>
        </ArticleSection>

        <ArticleSection title="Budget-Friendly Meal Planning Strategies">
          <p>Eating well on a budget is entirely possible with the right planning strategy. The key is knowing which ingredients give you the most nutritional value per dollar and how to build meals around them.</p>
          <h4 className="font-bold text-slate-800 mt-4">Protein on a Budget</h4>
          <p>Protein is typically the most expensive component of any meal. Budget-friendly protein sources include eggs, canned beans, lentils, chicken thighs, canned tuna, and tofu. The AI prioritizes these affordable staples when you select a lower budget tier, ensuring you hit your protein needs without breaking the bank.</p>
          <h4 className="font-bold text-slate-800 mt-4">Seasonal and Staple Shopping</h4>
          <p>Building meals around seasonal produce and pantry staples -- rice, pasta, canned tomatoes, frozen vegetables -- keeps costs predictable and low. The AI generates plans that lean on these affordable foundations while still delivering flavorful, varied meals throughout the week.</p>
        </ArticleSection>

        <ArticleSection title="Meal Prep Tips for Busy Weekdays">
          <p>Having a meal plan is only half the equation. The other half is actually preparing the food in a way that fits your real-life schedule. Smart meal prep turns a weekly plan into daily convenience.</p>
          <h4 className="font-bold text-slate-800 mt-4">Batch Cooking Basics</h4>
          <p>Spending two to three hours on a Sunday preparing key components -- grains, roasted vegetables, marinated proteins -- sets you up for quick assembly during the week. The AI can generate plans optimized for batch prep, grouping meals that share base ingredients so your Sunday session covers multiple dinners.</p>
          <h4 className="font-bold text-slate-800 mt-4">The 30-Minute Weeknight Rule</h4>
          <p>When you set a meal prep time limit, the AI generates recipes that respect your schedule. A 30-minute limit means every weeknight dinner can go from fridge to table in half an hour or less -- using techniques like sheet pan meals, one-pot dishes, and stir-fries that minimize both cooking time and cleanup.</p>
        </ArticleSection>

        <ArticleSection title="Understanding Nutrition and Macros">
          <p>A good meal plan is not just about convenience -- it is about fueling your body properly. Understanding the basics of macronutrients helps you make informed choices about what you eat each day.</p>
          <h4 className="font-bold text-slate-800 mt-4">Balancing Macros</h4>
          <p>The three macronutrients -- protein, carbohydrates, and fat -- each play essential roles in your body. Protein builds and repairs tissue, carbohydrates provide energy, and fats support hormone production and nutrient absorption. The AI generates plans with balanced macro ratios tailored to your calorie goals and dietary preferences.</p>
          <h4 className="font-bold text-slate-800 mt-4">Calorie Goals Made Simple</h4>
          <p>Whether you are maintaining weight, cutting, or bulking, having a clear calorie target makes meal planning straightforward. Set your per-person daily calorie goal, and the AI distributes calories across breakfast, lunch, and dinner in sensible proportions -- typically 25% for breakfast, 35% for lunch, and 40% for dinner.</p>
        </ArticleSection>

        <ArticleSection title="Smart Grocery Shopping by Aisle">
          <p>An organized grocery list is the bridge between a great meal plan and actually executing it. Shopping by aisle saves time, reduces stress, and ensures you do not forget key ingredients.</p>
          <h4 className="font-bold text-slate-800 mt-4">Aisle-Organized Lists</h4>
          <p>The AI generates your grocery list organized by store section -- produce, proteins, dairy, grains, pantry staples, and frozen items. This means you can move through the store systematically instead of zigzagging back and forth. Most people cut their shopping time by 15-20 minutes simply by having an organized list.</p>
          <h4 className="font-bold text-slate-800 mt-4">Accounting for What You Have</h4>
          <p>One of the smartest features of AI meal planning is the ability to tell it what ingredients you already have on hand. The AI factors these into the plan and removes them from the grocery list, so you never buy duplicates. That half bag of rice and can of coconut milk in your pantry become the foundation of a Thai curry instead of sitting unused.</p>
        </ArticleSection>

        <ArticleSection title="Building a Sustainable Meal Planning Habit">
          <p>The best meal plan is one you actually follow. Building a sustainable habit means starting simple, staying flexible, and adjusting as you learn what works for your household.</p>
          <h4 className="font-bold text-slate-800 mt-4">Start With Three Days</h4>
          <p>If planning seven days feels overwhelming, start with three. Plan Monday through Wednesday, and let the rest of the week be more flexible. As you get comfortable with the process, gradually extend your planning horizon. The AI lets you select exactly which days to plan for, making it easy to start small.</p>
          <h4 className="font-bold text-slate-800 mt-4">Embrace Leftovers and Flexibility</h4>
          <p>A rigid meal plan that allows no deviation will fail. Build in one or two "leftover nights" per week where you eat whatever needs to be used up. Keep a few quick backup meals in your repertoire for days when plans change. The AI generates plans with enough structure to keep you on track while leaving room for real life to happen. Since everything runs privately in your browser, you can regenerate plans as often as you like without any data being stored or shared.</p>
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
