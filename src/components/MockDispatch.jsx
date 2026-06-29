import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, CheckCircle2, AlertCircle, Radio, Truck, Siren } from 'lucide-react';

const MOCK_DISPATCHES = [
  {
    id: 1,
    type: 'Medical Emergency',
    severity: 'high',
    location: '123 Main St, Downtown',
    time: '2 min ago',
    status: 'dispatched',
    units: ['Ambulance #4', 'Engine #7'],
    eta: '4 min'
  },
  {
    id: 2,
    type: 'Cardiac Arrest',
    severity: 'critical',
    location: '456 Oak Ave, Midtown',
    time: '8 min ago',
    status: 'on-scene',
    units: ['Ambulance #2', 'Medic #1'],
    eta: 'On scene'
  },
  {
    id: 3,
    type: 'Fall Injury',
    severity: 'medium',
    location: '789 Pine Rd, Uptown',
    time: '15 min ago',
    status: 'resolved',
    units: ['Ambulance #6'],
    eta: 'Completed'
  }
];

export default function MockDispatch({ onBack }) {
  const [dispatches, setDispatches] = useState(MOCK_DISPATCHES);
  const [activeTab, setActiveTab] = useState('live');

  const getStatusColor = (status) => {
    switch (status) {
      case 'dispatched': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'on-scene': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'resolved': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-800/95 backdrop-blur-lg border-b border-slate-700 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <Radio size={16} className="text-green-400" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">Emergency Dispatch</h2>
              <p className="text-[10px] text-green-400">● Live Feed (Mocked)</p>
            </div>
          </div>
        </div>
      </header>

      {/* Mock Banner */}
      <div className="bg-purple-500/10 border-b border-purple-500/20 px-4 py-2">
        <p className="text-center text-[11px] text-purple-300">
          ⚡ This is a simulated dispatch dashboard for demonstration purposes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 px-4 py-4">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-400">2</p>
          <p className="text-[10px] text-slate-400">Active</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-yellow-400">4</p>
          <p className="text-[10px] text-slate-400">Units Out</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-400">12</p>
          <p className="text-[10px] text-slate-400">Resolved Today</p>
        </div>
      </div>

      {/* Dispatch List */}
      <div className="px-4 space-y-3">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <Siren size={14} className="text-red-400" />
          Active Calls
        </h3>
        
        {dispatches.map((dispatch) => (
          <div key={dispatch.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getSeverityColor(dispatch.severity)}`} />
                <h4 className="font-semibold text-sm">{dispatch.type}</h4>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusColor(dispatch.status)}`}>
                {dispatch.status.toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin size={12} />
                <span>{dispatch.location}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock size={12} />
                <span>{dispatch.time}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Truck size={12} />
                <span>{dispatch.units.join(', ')}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between">
              <span className="text-xs text-slate-500">ETA</span>
              <span className={`text-xs font-semibold ${
                dispatch.status === 'resolved' ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {dispatch.eta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Map Placeholder */}
      <div className="mx-4 mt-6 bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <MapPin size={32} className="text-slate-500 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Live Map View</p>
            <p className="text-[10px] text-slate-600">Google Maps integration</p>
          </div>
        </div>
      </div>
    </div>
  );
}