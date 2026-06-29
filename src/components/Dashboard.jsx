import React, { useState, useEffect } from 'react';
import SOSButton from './SOSButton';
import VoiceListener from './VoiceListener';
import FallDetector from './FallDetector';
import CountdownModal from './CountdownModel';
import AlertHistory from './AlertHistory';
import { MapPin, Clock, Activity, Zap, Mic } from 'lucide-react';
import { createAlert, getAlerts } from '../utils/firebase';
import { sendSOS, getLocation } from '../utils/api';

export default function Dashboard({ onSOSTriggered, onOpenChat, onOpenDispatch }) {
  const [isListening, setIsListening] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [status, setStatus] = useState('ready');
  const [lastAlert, setLastAlert] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    const data = await getAlerts();
    setAlerts(data);
  };

  const triggerSOS = async () => {
    setStatus('sending');
    
    try {
      const { latitude, longitude } = await getLocation();
      
      // Save to database
      const alert = await createAlert({ lat: latitude, lng: longitude });
      
      // Trigger SMS
      const result = await sendSOS(latitude, longitude);
      
      setLastAlert({
        ...alert,
        locationUrl: `https://www.google.com/maps?q=${latitude},${longitude}`,
        smsSent: result.success || result.mocked
      });
      
      setStatus('active');
      onSOSTriggered();
      loadAlerts();
      
      // Reset status after 30 seconds
      setTimeout(() => setStatus('ready'), 30000);
    } catch (error) {
      console.error('SOS Error:', error);
      setStatus('error');
      setTimeout(() => setStatus('ready'), 3000);
    }
  };

  const handleFallDetected = () => {
    setCountdown(5);
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-4">
      {/* Header */}
      <header className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-4">
          <Activity size={14} className="text-red-400 animate-pulse" />
          <span className="text-xs font-medium text-red-300">MONITORING ACTIVE</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          LifeSaver
        </h1>
        <p className="text-slate-400 text-sm mt-1">Emergency Response System</p>
      </header>

      {/* Status Cards */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Mic size={14} className={`${isListening ? 'text-green-400' : 'text-slate-500'}`} />
            <span className="text-xs text-slate-400">Voice</span>
          </div>
          <p className={`text-sm font-semibold ${isListening ? 'text-green-400' : 'text-slate-500'}`}>
            {isListening ? 'Listening...' : 'Inactive'}
          </p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-yellow-400" />
            <span className="text-xs text-slate-400">Fall Detect</span>
          </div>
          <p className="text-sm font-semibold text-yellow-400">Armed</p>
        </div>
      </div>

      {/* SOS Button */}
      <div className="flex justify-center mb-8">
        <SOSButton 
          onClick={triggerSOS} 
          status={status}
        />
      </div>

      {/* Status Message */}
      {status === 'active' && lastAlert && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-6 text-center">
          <p className="text-green-400 font-semibold text-sm">✅ Emergency Alert Sent</p>
          <p className="text-green-300/70 text-xs mt-1">
            SMS dispatched • Location shared
          </p>
          <a 
            href={lastAlert.locationUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-xs text-green-300 underline"
          >
            <MapPin size={12} /> View on Maps
          </a>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button 
          onClick={onOpenChat}
          className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-left hover:bg-blue-500/20 transition-all"
        >
          <p className="text-blue-400 font-semibold text-sm">AI Triage</p>
          <p className="text-blue-300/60 text-xs mt-1">Get first-aid guidance</p>
        </button>
        <button 
          onClick={onOpenDispatch}
          className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 text-left hover:bg-purple-500/20 transition-all"
        >
          <p className="text-purple-400 font-semibold text-sm">Dispatch</p>
          <p className="text-purple-300/60 text-xs mt-1">View emergency feed</p>
        </button>
      </div>

      {/* Alert History */}
      <AlertHistory alerts={alerts} />

      {/* Hardware Triggers */}
      <VoiceListener 
        onVoiceTrigger={triggerSOS}
        onListeningChange={setIsListening}
      />
      <FallDetector onFallDetected={handleFallDetected} />

      {/* Countdown Modal */}
      {countdown !== null && (
        <CountdownModal 
          seconds={countdown}
          onCancel={() => setCountdown(null)}
          onExpire={() => {
            setCountdown(null);
            triggerSOS();
          }}
        />
      )}
    </div>
  );
}