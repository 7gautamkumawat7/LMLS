import React, { useEffect, useState } from 'react';

export default function FallDetector({ onFallDetected }) {
  const [lastAcc, setLastAcc] = useState(0);

  useEffect(() => {
    const handleMotion = (event) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;

      const totalAcc = Math.sqrt(
        (acc.x || 0) ** 2 + 
        (acc.y || 0) ** 2 + 
        (acc.z || 0) ** 2
      );

      setLastAcc(totalAcc.toFixed(1));

      // Detect sudden impact (threshold: 30 m/s²)
      if (totalAcc > 30) {
        onFallDetected();
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [onFallDetected]);

  // For demo: simulate fall detection with a button
  const simulateFall = () => {
    onFallDetected();
  };

  return (
    <div className="fixed bottom-24 left-4 z-40">
      <button
        onClick={simulateFall}
        className="w-12 h-12 rounded-full bg-slate-700 hover:bg-yellow-600 flex items-center justify-center shadow-lg transition-all group"
        title="Simulate fall detection (demo)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:animate-bounce">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      </button>
      <div className="absolute bottom-14 left-0 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-[10px] text-slate-400 whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
        Simulate Fall
      </div>
    </div>
  );
}