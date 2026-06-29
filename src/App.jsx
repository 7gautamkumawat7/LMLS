import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import TriageChat from './components/TriageChat';
import MockDispatch from './components/MockDispatch';
import { MessageCircle, Radio, Bell, Shield } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState('dashboard');
  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pointer-events-none" />
      
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Bell size={18} />
          <span className="font-medium text-sm">{notification}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10">
        {screen === 'dashboard' && (
          <Dashboard 
            onSOSTriggered={() => showNotification("🚨 Emergency contacts notified!")}
            onOpenChat={() => setScreen('chat')}
            onOpenDispatch={() => setScreen('dispatch')}
          />
        )}
        {screen === 'chat' && (
          <TriageChat onBack={() => setScreen('dashboard')} />
        )}
        {screen === 'dispatch' && (
          <MockDispatch onBack={() => setScreen('dashboard')} />
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-800/95 backdrop-blur-lg border-t border-slate-700">
        <div className="max-w-lg mx-auto flex justify-around py-3">
          <button 
            onClick={() => setScreen('dashboard')}
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-all ${screen === 'dashboard' ? 'text-red-400' : 'text-slate-400 hover:text-white'}`}
          >
            <Shield size={22} />
            <span className="text-[10px] font-medium">SOS</span>
          </button>
          <button 
            onClick={() => setScreen('chat')}
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-all ${screen === 'chat' ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
          >
            <MessageCircle size={22} />
            <span className="text-[10px] font-medium">AI Triage</span>
          </button>
          <button 
            onClick={() => setScreen('dispatch')}
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-all ${screen === 'dispatch' ? 'text-green-400' : 'text-slate-400 hover:text-white'}`}
          >
            <Radio size={22} />
            <span className="text-[10px] font-medium">Dispatch</span>
          </button>
        </div>
      </nav>
    </div>
  );
}