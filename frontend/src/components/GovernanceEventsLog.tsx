import React from 'react';
import type { EventLog } from '../api';

import { ShieldAlert, ZapOff, Sparkles, PlusCircle } from 'lucide-react';

interface GovernanceEventsLogProps {
  events: EventLog[];
}

export const GovernanceEventsLog: React.FC<GovernanceEventsLogProps> = ({ events }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'ANOMALY':
        return <ShieldAlert size={16} className="text-red-400" />;
      case 'GOVERNANCE':
        return <ZapOff size={16} className="text-amber-400" />;
      case 'MANUAL_OVERRIDE':
        return <Sparkles size={16} className="text-emerald-400" />;
      default:
        return <PlusCircle size={16} className="text-blue-400" />;
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'ANOMALY':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'GOVERNANCE':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'MANUAL_OVERRIDE':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    }
  };

  return (
    <div className="bg-darkCard border border-darkBorder/60 rounded-2xl p-6 shadow-xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Security & Governance Event Logs</h2>
        <p className="text-sm text-slate-400">Chronological history of ML classifications and container overrides.</p>
      </div>

      <div className="overflow-y-auto max-h-[500px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-darkBorder/70 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="py-4 px-3">Timestamp</th>
              <th className="py-4 px-3">Target Container</th>
              <th className="py-4 px-3">Event Type</th>
              <th className="py-4 px-3">Action</th>
              <th className="py-4 px-3">Details / Explanation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-darkBorder/40">
            {events.map((e) => (
              <tr key={e.id} className="hover:bg-slate-800/10 transition">
                <td className="py-4 px-3 text-xs text-slate-400 font-mono">
                  {new Date(e.timestamp.endsWith('Z') || e.timestamp.includes('+') ? e.timestamp : e.timestamp + 'Z').toLocaleTimeString()}
                </td>
                <td className="py-4 px-3 text-sm font-semibold text-slate-200">
                  {e.container_name}
                </td>
                <td className="py-4 px-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getBadgeStyle(e.event_type)}`}>
                    {getIcon(e.event_type)}
                    <span className="ml-1">{e.event_type.replace('_', ' ')}</span>
                  </span>
                </td>
                <td className="py-4 px-3 text-xs font-bold font-mono text-slate-300">
                  {e.action}
                </td>
                <td className="py-4 px-3 text-xs text-slate-400 max-w-sm truncate" title={e.details}>
                  {e.details}
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-500 text-sm">
                  No active events logged yet. Spin up workloads or inject simulated drops to trigger alerts.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
