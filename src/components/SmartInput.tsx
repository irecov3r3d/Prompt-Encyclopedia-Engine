import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Loader2, StopCircle, Sparkles, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { FormulaState } from '../types';

interface SmartInputProps {
  onTransform: (state: FormulaState) => void;
}

export function SmartInput({ onTransform }: SmartInputProps) {
  const [input, setInput] = useState('');
  const [isDictating, setIsDictating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastParsed, setLastParsed] = useState<FormulaState | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsDictating(false);
        handleTransform(transcript);
      };

      recognitionRef.current.onerror = () => setIsDictating(false);
      recognitionRef.current.onend = () => setIsDictating(false);
    }
  }, []);

  const handleTransform = async (textToTransform: string) => {
    if (!textToTransform.trim()) return;
    
    setIsProcessing(true);
    setShowSuccess(false);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/transform-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: textToTransform }),
      });
      
      if (!response.ok) {
        throw new Error(`Transformation request failed: Server status ${response.status}`);
      }
      
      const data = await response.json();
      if (data && !data.error) {
        onTransform(data);
        setLastParsed(data);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
      } else {
        throw new Error(data.error || 'Server did not return a valid prompt formula structure');
      }
    } catch (error: any) {
      console.error('Error transforming prompt:', error);
      setErrorMessage(error?.message || 'Could not connect to prompt processing engine.');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleDictation = () => {
    if (isDictating) {
      recognitionRef.current?.stop();
    } else {
      setShowSuccess(false);
      setErrorMessage(null);
      setInput('');
      recognitionRef.current?.start();
      setIsDictating(true);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-12 space-y-4">
      {/* Search Input Area */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 rounded-2xl blur group-focus-within:opacity-100 opacity-0 transition duration-500"></div>
        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-2 flex items-center gap-2 shadow-2xl">
          <div className="flex-grow relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTransform(input)}
              placeholder="Speak loosely or type your goal..."
              className="w-full bg-transparent border-none py-3 px-4 text-slate-100 placeholder:text-slate-500 focus:ring-0 outline-none text-lg"
            />
            {isProcessing && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-secondary">
                <Loader2 size={24} className="animate-spin" />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 px-2">
            <button
              onClick={toggleDictation}
              className={`p-3 rounded-xl transition-all ${
                isDictating 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer'
              }`}
              title={isDictating ? "Stop Dictation" : "Start Dictation via Mic"}
            >
              {isDictating ? <StopCircle size={24} /> : <Mic size={24} />}
            </button>
            <button
              onClick={() => handleTransform(input)}
              disabled={!input.trim() || isProcessing}
              className="p-3 bg-brand-primary hover:bg-brand-secondary text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              title="Transform Input into structured prompt"
            >
              <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {/* Error Notification Block */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 px-6 py-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
          >
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {/* Listening States */}
        {(isDictating || showSuccess) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-center"
          >
            {isDictating ? (
              <div className="flex items-center gap-4 px-6 py-3 bg-brand-primary/5 border border-brand-primary/10 rounded-xl">
                <div className="flex gap-1 animate-pulse">
                  {[1, 2, 3, 4].map(i => (
                    <motion.div
                      key={i}
                      animate={{ height: [8, 20, 8] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                      className="w-1 bg-brand-primary rounded-full"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-brand-primary uppercase tracking-widest text-[10px]">Listening to loose speech...</span>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-6 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
              >
                <CheckCircle2 size={14} />
                Formula Builder Updated Successfully
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Real-Time Processing visualization mapping loose input into segments */}
        {lastParsed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-brand-secondary animate-pulse" />
                <h4 className="text-sm font-bold text-slate-200">2026 Engine Parser Breakdown</h4>
              </div>
              <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full font-mono uppercase font-bold">100% Intaked</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
              <div className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl hover:border-slate-700 transition-colors">
                <div className="text-[10px] font-mono uppercase text-brand-secondary mb-1">🎭 Role Assigned</div>
                <div className="text-xs text-slate-300 font-medium line-clamp-2 md:line-clamp-3" title={lastParsed.role}>{lastParsed.role}</div>
              </div>

              <div className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl hover:border-slate-700 transition-colors">
                <div className="text-[10px] font-mono uppercase text-brand-secondary mb-1">⚖️ Core Rule</div>
                <div className="text-xs text-slate-300 font-medium line-clamp-2 md:line-clamp-3" title={lastParsed.constraints}>{lastParsed.constraints}</div>
              </div>

              <div className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl hover:border-slate-700 transition-colors">
                <div className="text-[10px] font-mono uppercase text-brand-secondary mb-1">🧠 Technique</div>
                <div className="text-xs text-slate-300 font-medium line-clamp-2 md:line-clamp-3" title={lastParsed.technique}>{lastParsed.technique}</div>
              </div>

              <div className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl hover:border-slate-700 transition-colors">
                <div className="text-[10px] font-mono uppercase text-brand-secondary mb-1">🎯 Raw Task</div>
                <div className="text-xs text-slate-300 font-medium line-clamp-2 md:line-clamp-3" title={lastParsed.task}>{lastParsed.task}</div>
              </div>

              <div className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl hover:border-slate-700 transition-colors">
                <div className="text-[10px] font-mono uppercase text-brand-secondary mb-1">📦 Style Format</div>
                <div className="text-xs text-slate-300 font-medium line-clamp-2 md:line-clamp-3" title={lastParsed.format}>{lastParsed.format}</div>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-mono text-right italic flex items-center justify-end gap-1 select-none">
              Scroll down to review or modify each section in the Real-Time Builder
              <ChevronRight size={10} className="text-brand-secondary" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
