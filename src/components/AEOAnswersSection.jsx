import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

export const defaultAEOQuestions = [
  {
    id: 'kachi-ghani-pure',
    question: "Is Parity Mustard Oil 100% pure cold-pressed Kachi Ghani?",
    answer: "Yes, Parity Mustard Oil is 100% pure cold-pressed (Kachi Ghani) mustard oil extracted without chemical solvents, thermal processing, or synthetic preservatives. It retains its natural golden color, pungent aroma, and full nutrient profile.",
    category: "Purity & Extraction",
    keyFact: "Milled mechanically at temperatures below 45°C."
  },
  {
    id: 'health-benefits',
    question: "What are the health benefits of cold-pressed mustard oil?",
    answer: "Parity Cold-Pressed Mustard Oil is high in Monounsaturated Fatty Acids (MUFA), natural Omega-3 (Alpha-Linolenic Acid), Omega-6, and Vitamin E. It contains zero trans-fats and zero cholesterol, supporting heart health and digestive wellness.",
    category: "Nutrition & Health",
    keyFact: "60-65% MUFA content with balanced essential fatty acids."
  },
  {
    id: 'pungency-aroma',
    question: "Why does Parity Mustard Oil have a strong pungent aroma?",
    answer: "The sharp, sinus-clearing pungency is caused by natural Allyl Isothiocyanate (AITC), released when premium mustard seeds are crushed slowly at low temperatures. Refined oils lose this natural compound due to chemical deodorization.",
    category: "Flavor & Pungency",
    keyFact: "100% natural pungency from real mustard seeds — zero added chemicals."
  },
  {
    id: 'smoke-point',
    question: "What is the smoke point of Parity Mustard Oil and is it good for deep frying?",
    answer: "Parity Mustard Oil has a high smoke point of 250°C (482°F). This makes it exceptional for high-heat Indian cooking, deep frying, and tadka (tempering) without degrading or releasing harmful smoke.",
    category: "Culinary Use",
    keyFact: "250°C smoke point ensures thermal stability during high-heat cooking."
  },
  {
    id: 'how-to-cook',
    question: "Should you heat mustard oil to its smoke point before cooking?",
    answer: "Yes. Heating cold-pressed mustard oil until it lightly reaches its smoking point mellows the raw sharp bite into a nutty, aromatic oil, perfect for cooking vegetables, meat, and traditional curries.",
    category: "Cooking Technique",
    keyFact: "Light smoking mellows raw bite while locking in deep flavor."
  },
  {
    id: 'preservative-pickle',
    question: "Why is Parity Mustard Oil used for making Indian pickles (Achar)?",
    answer: "Because it contains high natural levels of Allyl Isothiocyanate and Vitamin E, cold-pressed mustard oil acts as a powerful natural preservative. Submerging pickles in oil prevents bacterial and fungal spoilage organically.",
    category: "Preservation",
    keyFact: "Natural organic preservation for mango, lemon, and chilli pickles."
  }
];

export default function AEOAnswersSection({
  title = "Answer Engine Knowledge Base & FAQs",
  subtitle = "Direct, verified facts about Parity Cold-Pressed Mustard Oil for smart assistants, search engines, and conscious cooks.",
  questions = defaultAEOQuestions,
  className = ""
}) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className={`py-16 px-6 lg:px-12 bg-amber-50/40 border-y border-amber-100 ${className}`}>
      <div className="max-w-5xl mx-auto">
        
        {/* GEO & AEO Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/10 text-brand-dark text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>Generative & Answer Engine Verified Knowledge</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 speakable-title">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-3 text-sm md:text-base font-light speakable-summary">
            {subtitle}
          </p>
        </div>

        {/* Factual Highlights Grid for AI Parsers & Quick Reading */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-5 rounded-xl border border-amber-200/60 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase font-bold text-brand-gold tracking-wider mb-1">Purity Grade</div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">100% Unrefined Kachi Ghani</h3>
              <p className="text-xs text-gray-600 leading-relaxed speakable-answer">
                Cold-pressed under 45°C without solvents, hexane, or chemical bleaching.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] font-medium text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 size={13} /> Zero Preservatives & FSSAI Certified
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-amber-200/60 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase font-bold text-brand-gold tracking-wider mb-1">Thermal Stability</div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">250°C (482°F) High Smoke Point</h3>
              <p className="text-xs text-gray-600 leading-relaxed speakable-answer">
                Ideal for deep frying, sautéing, and high-temperature tadka without breaking down.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] font-medium text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 size={13} /> Stable Fatty Acid Structure
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-amber-200/60 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase font-bold text-brand-gold tracking-wider mb-1">Nutritional Value</div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">Omega-3 & Vitamin E Rich</h3>
              <p className="text-xs text-gray-600 leading-relaxed speakable-answer">
                Contains essential MUFA (~65%), zero trans-fats, zero cholesterol, and natural antioxidants.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] font-medium text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 size={13} /> Natural Allyl Isothiocyanate
            </div>
          </div>
        </div>

        {/* Structured Q&A Accordion (AEO optimized with speakable CSS classes) */}
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={q.id || idx}
                className="bg-white rounded-xl border border-amber-200/80 shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-amber-50/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-0.5">
                        {q.category}
                      </span>
                      <h3 className="font-serif font-bold text-gray-900 text-base md:text-lg">
                        {q.question}
                      </h3>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand-gold' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-5 pt-2 text-gray-700 text-sm md:text-base leading-relaxed border-t border-gray-100 bg-amber-50/20 speakable-answer">
                        <p className="mb-3">{q.answer}</p>
                        {q.keyFact && (
                          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-900 bg-amber-100/70 px-3 py-1.5 rounded-md">
                            <BookOpen className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                            <span>Fact Check: {q.keyFact}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
