import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function CountdownModal({ seconds, onCancel, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onExpire]);

  const progress = ((seconds - timeLeft) / seconds) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-yellow-500/30 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center animate-pulse">
            <AlertTriangle size={32} className="text-yellow-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-yellow-400 mb-2">Fall Detected!</h2>
        <p className="text-slate-400 text-sm mb-6">
          Possible impact detected. SOS will be triggered automatically.
        </p>

        {/* Countdown Circle */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50" cy="50" r="45"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-slate-700"
            />
            {/* Progress circle */}
            <circle
              cx="50" cy="50" r="45"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-yellow-400"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-black text-yellow-400">{timeLeft}</span>
          </div>
        </div>

        {/* Cancel Button */}
        <button
          onClick={onCancel}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-all active:scale-95 text-lg"
        >
          I'M OKAY — CANCEL
        </button>
        
        <p className="text-slate-500 text-xs mt-3">
          Emergency services will be notified in {timeLeft}s
        </p>
      </div>
    </div>
  );
}