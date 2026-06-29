import React, { useEffect, useRef, useState } from 'react';

export default function VoiceListener({ onVoiceTrigger, onListeningChange }) {
  const [isListening, setIsListening] = useState(false);
  const [lastHeard, setLastHeard] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.log('Speech Recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      const transcript = lastResult[0].transcript.toLowerCase();
      setLastHeard(transcript);

      // Check for trigger words
      if (transcript.includes('help') && transcript.includes('help')) {
        onVoiceTrigger();
        setLastHeard('🚨 "Help! Help!" detected!');
      } else if (transcript.includes('emergency') || transcript.includes('sos')) {
        onVoiceTrigger();
        setLastHeard('🚨 Emergency keyword detected!');
      }
    };

    recognition.onerror = (event) => {
      console.log('Speech error:', event.error);
      if (event.error !== 'no-speech') {
        // Restart on error
        setTimeout(() => {
          try { recognition.start(); } catch(e) {}
        }, 1000);
      }
    };

    recognition.onend = () => {
      // Auto-restart
      if (isListening) {
        try { recognition.start(); } catch(e) {}
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      onListeningChange(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        onListeningChange(true);
      } catch (e) {
        console.log('Already started');
      }
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-40">
      <button
        onClick={toggleListening}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isListening 
            ? 'bg-green-500 animate-pulse shadow-green-500/30' 
            : 'bg-slate-700 hover:bg-slate-600'
        }`}
        title={isListening ? 'Stop listening' : 'Start voice trigger'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" x2="12" y1="19" y2="22"/>
        </svg>
      </button>
      
      {isListening && lastHeard && (
        <div className="absolute bottom-14 right-0 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 whitespace-nowrap shadow-xl">
          🎙 {lastHeard}
        </div>
      )}
    </div>
  );
}