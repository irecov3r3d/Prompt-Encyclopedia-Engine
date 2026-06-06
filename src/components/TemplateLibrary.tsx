import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TEMPLATES } from '../data';
import { Copy, Check, Search, Filter } from 'lucide-react';

export function TemplateLibrary() {
  const [filter, setFilter] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const categories = ['All', 'Reasoner', 'Critique', 'Multi-Perspective', 'Agent', 'Code'];

  const filteredTemplates = filter === 'All' 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === filter);

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Template Library</h2>
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800 overflow-x-auto max-w-full">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                filter === cat 
                ? 'bg-brand-primary text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((template) => (
            <motion.div
              layout
              key={template.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col group relative"
            >
              <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-600 tracking-widest uppercase">
                {template.category}
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">{template.title}</h3>
              <p className="text-sm text-slate-400 mb-6 flex-grow">{template.description}</p>
              
              <div className="bg-slate-950 rounded-xl p-4 mb-4 relative">
                <pre className="text-[11px] text-brand-secondary font-mono whitespace-pre-wrap leading-relaxed max-h-[120px] overflow-hidden">
                  {template.content}
                </pre>
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
              </div>

              <button
                onClick={() => handleCopy(template.id, template.content)}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  copiedId === template.id
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-transparent'
                }`}
              >
                {copiedId === template.id ? (
                  <>
                    <Check size={16} />
                    Copied to Clipboard
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy Template
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
