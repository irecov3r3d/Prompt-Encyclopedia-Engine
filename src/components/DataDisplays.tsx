import React from 'react';
import { motion } from 'motion/react';
import { TECHNIQUES, OUTPUT_CONTROLS, ANTI_PATTERNS } from '../data';
import { Zap, Target, AlertTriangle } from 'lucide-react';

export function TechniquesGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap className="text-yellow-400" size={20} />
          Core Techniques
        </h2>
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800">
                <th className="p-4 font-semibold text-slate-400 uppercase tracking-wider text-xs">Technique</th>
                <th className="p-4 font-semibold text-slate-400 uppercase tracking-wider text-xs">Keywords</th>
                <th className="p-4 font-semibold text-slate-400 uppercase tracking-wider text-xs">Ideal For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {TECHNIQUES.map((tech, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="p-4 align-top">
                    <div className="font-bold text-slate-100">{tech.name}</div>
                    <div className="text-[10px] text-brand-secondary font-mono mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                      {tech.example}
                    </div>
                  </td>
                  <td className="p-4 italic text-slate-400 text-xs">{tech.keywords}</td>
                  <td className="p-4 text-slate-300">{tech.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Target className="text-brand-primary" size={20} />
          Output Control Highs
        </h2>
        <div className="space-y-4">
          {OUTPUT_CONTROLS.map((ctrl, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-brand-primary/50 transition-all cursor-default group"
            >
              <div className="text-xs font-mono text-brand-secondary mb-1 uppercase tracking-tighter">{ctrl.type}</div>
              <div className="text-slate-200 font-medium mb-1">{ctrl.effect}</div>
              <div className="text-xs text-slate-500 italic">"{ctrl.keywords}"</div>
            </motion.div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-white flex items-center gap-2 pt-4">
          <AlertTriangle className="text-red-400" size={20} />
          Anti-Patterns
        </h2>
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 space-y-4">
          {ANTI_PATTERNS.map((ap, idx) => (
            <div key={idx}>
              <div className="text-xs font-bold text-red-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                {ap.name}
              </div>
              <div className="text-xs text-slate-400 mt-0.5 pl-3 border-l border-red-500/20 ml-0.5">
                Fix: {ap.fix}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
