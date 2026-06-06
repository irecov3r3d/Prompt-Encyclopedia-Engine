import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Terminal } from 'lucide-react';
import { FormulaState } from '../types';

const INITIAL_STATE: FormulaState = {
  role: "world-class senior product designer with 15 years experience",
  constraints: "Base answer only on facts. Never hallucinate.",
  technique: "Chain-of-thought strategy",
  examples: "",
  task: "create a design system roadmap for a fintech mobile app",
  format: "a structured markdown report with timeline"
};

export function FormulaBuilder() {
  const [state, setState] = useState<FormulaState>(INITIAL_STATE);
  const [copied, setCopied] = useState(false);

  const generatePrompt = () => {
    return `You are a ${state.role}. Always ${state.constraints}. 
Use ${state.technique}.
${state.examples ? `Examples: \n${state.examples}\n` : ''}
Task: ${state.task}

Output exactly in this format: ${state.format}
After answering, critique your response in <thought> tags and improve if needed.`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Terminal size={120} />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Terminal className="text-brand-secondary" />
          Prompt Combiner Formula
        </h3>
        <p className="text-slate-400 text-sm mb-6 max-w-2xl">
          The 2026 Stack: <strong>Role + Constraints + Technique + Examples + Task + Format</strong>. 
          Fill the fields to generate a master-level prompt.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-secondary mb-1">Role / Persona</label>
              <input 
                type="text" 
                value={state.role}
                onChange={(e) => setState({...state, role: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-secondary mb-1">Core Constraints</label>
              <input 
                type="text" 
                value={state.constraints}
                onChange={(e) => setState({...state, constraints: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-secondary mb-1">Reasoning Technique</label>
              <select 
                value={state.technique}
                onChange={(e) => setState({...state, technique: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all"
              >
                <option>Zero-shot instruction</option>
                <option>Chain-of-thought strategy</option>
                <option>Tree-of-thoughts exploration</option>
                <option>ReAct loop</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-secondary mb-1">Task / Objective</label>
              <textarea 
                value={state.task}
                onChange={(e) => setState({...state, task: e.target.value})}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-secondary mb-1">Output Format</label>
              <input 
                type="text" 
                value={state.format}
                onChange={(e) => setState({...state, format: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono text-slate-500 uppercase">Generated Prompt</span>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full text-xs font-medium transition-colors"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
              {generatePrompt()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
