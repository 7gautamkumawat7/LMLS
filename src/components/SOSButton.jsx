import React from 'react';
import { Phone } from 'lucide-react';

export default function SOSButton({ onClick, status }) {
  const getStatusStyles = () => {
    switch (status) {
      case 'sending':
        return 'bg-yellow-500 animate-pulse';
      case 'active':
        return 'bg-green-500';
      case 'error':
        return 'bg-orange-500 animate-shake';
      default:
        return 'bg-red-600 sos-glow animate-pulse-sos';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'sending': return 'SENDING...';
      case 'active': return 'HELP ON THE WAY';
      case 'error': return 'RETRYING...';
      default: return 'SOS';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={status === 'sending'}
      className={`relative w-44 h-44 rounded-full ${getStatusStyles()} 
        flex flex-col items-center justify-center 
        transition-all duration-300 active:scale-95
        disabled:opacity-70 group`}
    >
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-4 border-white/20 group-hover:border-white/40 transition-all" />
      
      {/* Inner ring */}
      <div className="absolute inset-3 rounded-full border-2 border-white/10" />
      
      {/* Icon */}
      <Phone size={36} className="text-white mb-1" strokeWidth={2.5} />
      
      {/* Text */}
      <span className="text-white font-black text-lg tracking-wider">
        {getStatusText()}
      </span>
      
      {/* Ripple effect for active state */}
      {status === 'ready' && (
        <>
          <div className="absolute inset-0 rounded-full border-2 border-red-400/50 animate-ping" />
          <div className="absolute -inset-4 rounded-full border border-red-400/20 animate-ping" style={{ animationDelay: '0.5s' }} />
        </>
      )}
    </button>
  );
}