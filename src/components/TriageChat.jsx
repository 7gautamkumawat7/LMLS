import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User, AlertTriangle, Loader2 } from 'lucide-react';
import { getTriageResponse } from '../utils/api';

const QUICK_PROMPTS = [
  "I cut my hand deeply",
  "Someone is choking",
  "Chest pain emergency",
  "Bad burn on my arm",
  "Head injury from fall",
  "Allergic reaction"
];

export default function TriageChat({ onBack }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 I'm your AI First-Aid Assistant. Describe your emergency and I'll provide immediate guidance.\n\n⚠️ **Always call 911 for life-threatening emergencies.**",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await getTriageResponse(text);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.response,
        timestamp: new Date()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "❌ Sorry, I couldn't process that. Please call 911 directly.",
        timestamp: new Date()
      }]);
    }

    setIsLoading(false);
  };

  const formatMessage = (text) => {
    return text.split('\n').map((line, i) => {
      // Bold text
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={i} className={`${i > 0 ? 'mt-2' : ''} leading-relaxed`} dangerouslySetInnerHTML={{ __html: line }} />;
    });
  };

  return (
    <div className="min-h-screen pb-24 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-800/95 backdrop-blur-lg border-b border-slate-700 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Bot size={16} className="text-blue-400" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">AI Triage Assistant</h2>
              <p className="text-[10px] text-green-400">● Online</p>
            </div>
          </div>
        </div>
      </header>

      {/* Warning Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
          <p className="text-[11px] text-amber-300">Not a substitute for professional medical advice. Always call 911.</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-lg mx-auto space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 chat-bubble ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'assistant' ? 'bg-blue-500/20' : 'bg-slate-600'
              }`}>
                {msg.role === 'assistant' ? <Bot size={14} className="text-blue-400" /> : <User size={14} className="text-slate-300" />}
              </div>
              
              {/* Message */}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'assistant' 
                  ? 'bg-slate-800 border border-slate-700 rounded-tl-sm' 
                  : 'bg-blue-600 rounded-tr-sm'
              }`}>
                <div className="text-sm">
                  {formatMessage(msg.content)}
                </div>
                <p className={`text-[10px] mt-2 ${msg.role === 'assistant' ? 'text-slate-500' : 'text-blue-200'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 chat-bubble">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Bot size={14} className="text-blue-400" />
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3">
                <Loader2 size={16} className="text-blue-400 animate-spin" />
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3">
          <div className="max-w-lg mx-auto">
            <p className="text-xs text-slate-500 mb-2">Quick prompts:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(prompt)}
                  className="text-xs bg-slate-800 border border-slate-700 rounded-full px-3 py-1.5 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="sticky bottom-20 bg-slate-800/95 backdrop-blur-lg border-t border-slate-700 px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Describe your emergency..."
            className="flex-1 bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl px-4 py-3 transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}