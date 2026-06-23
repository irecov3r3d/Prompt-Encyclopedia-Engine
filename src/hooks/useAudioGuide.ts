import { useState, useCallback, useEffect } from 'react';

export function useAudioGuide() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string) => {
    if (!isEnabled) return;

    // Stop any existing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isEnabled]);

  const toggle = () => {
    const next = !isEnabled;
    setIsEnabled(next);
    if (!next) {
      window.speechSynthesis.cancel();
    }
  };

  return { isEnabled, isSpeaking, speak, toggle };
}
