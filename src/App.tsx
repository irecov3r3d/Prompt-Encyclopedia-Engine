/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Sparkles, BookText, Code, Layers, MousePointer2, Volume2, VolumeX } from 'lucide-react';
import { TechniquesGrid } from './components/DataDisplays';
import { TemplateLibrary } from './components/TemplateLibrary';
import { FormulaBuilder } from './components/FormulaBuilder';
import { SmartInput } from './components/SmartInput';
import { FormulaState } from './types';
import { useAudioGuide } from './hooks/useAudioGuide';

const INITIAL_FORMULA: FormulaState = {
  role: "world-class senior product designer with 15 years experience",
  constraints: "Base answer only on facts. Never hallucinate.",
  technique: "Chain-of-thought strategy",
  examples: "",
  task: "create a design system roadmap for a fintech mobile app",
  format: "a structured markdown report with timeline"
};

const MODULE_DESCRIPTIONS = {
  HERO: "Welcome to the 2026 Prompt Engineering Encyclopedia. This is your master dashboard for human-to-machine logic coordination.",
  SMART_INPUT: "The Smart Input allows you to speak loosely or type general ideas. Our engine then transforms them into professional formulas. Use this when you have a goal but need the perfect wording.",
  TECHNIQUES: "The Techniques Grid displays core reasoning patternss like Chain of Thought or ReAct. Use these to decide exactly how the model should think through your problem.",
  BOOSTERS: "Advanced Boosters are short, powerful modifiers that force better reasoning or prevent hallucinations. Use these to fine-tune high-stakes prompts.",
  LIBRARY: "The Template Library offers vetted, expert-level starting points for coding, critiques, and multi-perspective analysis. Great for saving time on common workflows.",
  BUILDER: "The Final Formula Builder is your real-time workspace. It synchronizes all elements and lets you export your finalized prompt as clean Markdown."
};

export default function App() {
  const [formula, setFormula] = useState<FormulaState>(INITIAL_FORMULA);
  const { isEnabled: audioEnabled, toggle: toggleAudio, speak } = useAudioGuide();

  return (
    <div className="min-h-screen selection:bg-brand-primary/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-secondary/5 blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-20 lg:py-24">
        {/* Floating Audio Toggle */}
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all shadow-xl group ${
              audioEnabled 
              ? 'bg-brand-primary border-brand-primary text-white' 
              : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span className="text-xs font-bold uppercase tracking-widest">
              {audioEnabled ? 'Audio Guide ON' : 'Audio Guide OFF'}
            </span>
          </button>
        </div>

        {/* Hero Section */}
        <header 
          className="mb-12 text-center md:text-left cursor-help"
          onClick={() => speak(MODULE_DESCRIPTIONS.HERO)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold tracking-widest uppercase mb-6"
          >
            <Sparkles size={14} />
            2026 Prompt Engineering Edition
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6"
          >
            The Prompt <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
              Encyclopedia
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl leading-relaxed"
          >
            Master the art of machine-human coordination with state-of-the-art 
            reasoning techniques, persona modifiers, and structural formulas for 2026-era logic.
          </motion.p>
        </header>

        {/* Global Smart Input */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.3 }}
           className="cursor-help"
           onClick={() => speak(MODULE_DESCRIPTIONS.SMART_INPUT)}
        >
          <SmartInput onTransform={setFormula} />
        </motion.div>

        {/* Core Content sections */}
        <div className="space-y-32">
          
          {/* Techniques Grid */}
          <section id="techniques" className="cursor-help" onClick={() => speak(MODULE_DESCRIPTIONS.TECHNIQUES)}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <TechniquesGrid />
            </motion.div>
          </section>

          {/* Quick Boosters */}
          <section 
            id="boosters" 
            className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden cursor-help"
            onClick={() => speak(MODULE_DESCRIPTIONS.BOOSTERS)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Layers className="text-brand-secondary" />
                  Advanced Boosters
                </h2>
                <div className="space-y-4">
                  {[
                    { 
                      title: "Reasoning Effort", 
                      desc: "Force deep compute usage for logic-heavy tasks.", 
                      snippet: "\"Use high reasoning effort\"" 
                    },
                    { 
                      title: "Constraint Sandwich", 
                      desc: "Repeat rules at start and end to prevent context drift.", 
                      snippet: "Place rules first & last." 
                    },
                    { 
                      title: "Meta-Prompting", 
                      desc: "Ask the AI to write its own optimized system prompt.", 
                      snippet: "\"Write an optimized prompt for...\"" 
                    }
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:translate-x-1 transition-transform">
                      <div className="font-bold text-slate-100">{item.title}</div>
                      <div className="text-sm text-slate-500 mb-2">{item.desc}</div>
                      <code className="text-xs text-brand-secondary font-mono bg-brand-secondary/5 px-2 py-1 rounded">
                        {item.snippet}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <BookText className="text-purple-400" />
                  Avoid List
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Politeness Fatigue", text: "\"Please/Kindy\" — Over-politeness weakens directives." },
                    { label: "Permission Drift", text: "\"Maybe/You can\" — Granting permission instead of commands." },
                    { label: "Context Rot", text: "Very long preambles without logical structure." },
                    { label: "Safety Larps", text: "\"As an AI model\" — Triggering unnecessary safety guards." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 border border-white/5 rounded-xl">
                      <span className="text-red-400 font-mono text-xs mt-1">🚫</span>
                      <div>
                        <div className="text-sm font-bold text-slate-200">{item.label}</div>
                        <div className="text-sm text-slate-500">{item.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Background watermark */}
            <div className="absolute bottom-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none">
              <BookOpen size={400} />
            </div>
          </section>

          {/* Template Library */}
          <section id="library" className="cursor-help" onClick={() => speak(MODULE_DESCRIPTIONS.LIBRARY)}>
            <TemplateLibrary />
          </section>

          {/* Formula Builder */}
          <section id="builder" className="cursor-help" onClick={() => speak(MODULE_DESCRIPTIONS.BUILDER)}>
            <FormulaBuilder state={formula} onStateChange={setFormula} />
          </section>

          <footer className="pt-20 border-t border-slate-800 text-center">
            <div className="flex justify-center gap-6 mb-8 text-slate-500">
              <div className="flex items-center gap-2">
                <Code size={16} />
                <span className="text-xs font-mono uppercase tracking-widest">Antigravity Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <MousePointer2 size={16} />
                <span className="text-xs font-mono uppercase tracking-widest">Optimized for V2 Models</span>
              </div>
            </div>
            <p className="text-slate-600 text-xs">
              Prompt Engineering Encyclopedia &copy; 2026. All techniques vetted for High-Reasoning LLMs.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

