import React from 'react';
import { Clock, MapPin, CheckCircle2 } from 'lucide-react';

export default function AlertHistory({ alerts }) {
  const formatAlertTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return isNaN(date.getTime()) ? 'Just now' : date.toLocaleString();
  };

  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-6 text-center">
        <Clock size={24} className="text-slate-600 mx-auto mb-2" />
        <p className="text-sm text-slate-500">No alerts yet</p>
        <p className="text-xs text-slate-600 mt-1">Your emergency history will appear here</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
        <Clock size={14} />
        Recent Alerts
      </h3>
      <div className="space-y-2">
        {alerts.slice(0, 5).map((alert, idx) => (
          <div key={alert.id || idx} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={14} className="text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200">SOS Alert</p>
              <p className="text-xs text-slate-500">
                {formatAlertTime(alert.timestamp)}
              </p>
            </div>
            {alert.lat && (
              <a 
                href={`https://www.google.com/maps?q=${alert.lat},${alert.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                <MapPin size={14} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}