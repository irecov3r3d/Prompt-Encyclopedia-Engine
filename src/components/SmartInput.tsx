import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Loader2, StopCircle, Sparkles } from 'lucide-react';
import { FormulaState } from '../types';

interface SmartInputProps {
  onTransform: (state: FormulaState) => void;
}

export function SmartInput({ onTransform }: SmartInputProps) {
  const [input, setInput] = useState('');
  const [isDictating, setIsDictating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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
    try {
      const response = await fetch('/api/transform-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: textToTransform }),
      });
      
      const data = await response.json();
      if (data && !data.error) {
        onTransform(data);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error transforming prompt:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleDictation = () => {
    if (isDictating) {
      recognitionRef.current?.stop();
    } else {
      setShowSuccess(false);
      setInput('');
      recognitionRef.current?.start();
      setIsDictating(true);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-12 space-y-4">
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
                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isDictating ? <StopCircle size={24} /> : <Mic size={24} />}
            </button>
            <button
              onClick={() => handleTransform(input)}
              disabled={!input.trim() || isProcessing}
              className="p-3 bg-brand-primary hover:bg-brand-secondary text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {(isDictating || showSuccess) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-center"
          >
            {isDictating ? (
              <div className="flex items-center gap-4 px-6 py-3 bg-brand-primary/5 border border-brand-primary/10 rounded-xl">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(i => (
                    <motion.div
                      key={i}
                      animate={{ height: [8, 20, 8] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                      className="w-1 bg-brand-primary rounded-full"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-brand-primary animate-pulse uppercase tracking-widest text-[10px]">Listening to loose speech...</span>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-6 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
              >
                <Sparkles size={14} />
                Formula Builder Updated Successfully
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
