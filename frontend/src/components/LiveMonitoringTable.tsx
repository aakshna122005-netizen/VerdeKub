import React, { useState } from 'react';
import { api } from '../api';
import type { Container } from '../api';
import { Zap, X, Plus, Lock } from 'lucide-react';

interface LiveMonitoringTableProps {
  containers: Container[];
  onRefresh: () => void;
  role: 'susty-admin' | 'susty-viewer';
}

export const LiveMonitoringTable: React.FC<LiveMonitoringTableProps> = ({ containers, onRefresh, role }) => {
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [cpuVal, setCpuVal] = useState<number>(45);
  const [memVal, setMemVal] = useState<number>(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newContainerName, setNewContainerName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const isAdmin = role === 'susty-admin';

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContainer || !isAdmin) return;

    setIsSubmitting(true);
    try {
      await api.simulateLoad(selectedContainer.name, cpuVal, memVal);
      setSelectedContainer(null);
      onRefresh();
    } catch (err) {
      console.error("Failed to inject simulation", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualAction = async (id: number, action: 'ACTIVE' | 'STANDBY' | 'THROTTLED') => {
    if (!isAdmin) return;
    try {
      await api.triggerGovernance(id, action);
      onRefresh();
    } catch (err) {
      console.error("Failed to execute governance action", err);
    }
  };

  const handleCreateContainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContainerName.trim() || !isAdmin) return;

    try {
      await api.createContainer(newContainerName.trim());
      setNewContainerName('');
      setShowAddModal(false);
      onRefresh();
    } catch (err) {
      console.error("Failed to create container", err);
    }
  };

  return (
    <div className="bg-darkCard border border-darkBorder/60 rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Live Monitoring & Override Panel</h2>
          <p className="text-sm text-slate-400">Manage state overrides and inject simulated loads to trigger Isolation Forest policies.</p>
        </div>
        <button
          onClick={() => {
            if (isAdmin) setShowAddModal(true);
          }}
          disabled={!isAdmin}
          className={`flex items-center gap-2 font-semibold text-xs px-4 py-2.5 rounded-xl transition duration-300 shadow-lg ${
            isAdmin
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/20'
              : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
          }`}
        >
          {isAdmin ? <Plus size={16} /> : <Lock size={14} />}
          Spin Container
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-darkBorder/70 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <th className="py-4 px-3">Service Name</th>
              <th className="py-4 px-3">Status</th>
              <th className="py-4 px-3">CPU Usage</th>
              <th className="py-4 px-3">Memory Allocation</th>
              <th className="py-4 px-3">CO₂ Footprint</th>
              <th className="py-4 px-3 text-right">Operations & Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-darkBorder/40">
            {containers.map((c) => {
              const isIdle = c.cpu_usage < 15;
              return (
                <tr key={c.id} className="hover:bg-slate-800/20 transition duration-250">
                  <td className="py-4 px-3 font-semibold text-white text-sm">
                    {c.name}
                  </td>
                  <td className="py-4 px-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        c.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                          : c.status === 'STANDBY'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                          : 'bg-red-500/10 text-red-400 border border-red-500/25'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          c.status === 'ACTIVE'
                             ? 'bg-emerald-400'
                             : c.status === 'STANDBY'
                             ? 'bg-amber-400'
                             : 'bg-red-400'
                         }`}
                       />
                       {c.status}
                     </span>
                   </td>
                   <td className="py-4 px-3">
                     <div className="flex items-center gap-2">
                       <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                         <div
                           className={`h-full ${isIdle ? 'bg-amber-400' : 'bg-blue-500'}`}
                           style={{ width: `${c.cpu_usage}%` }}
                         />
                       </div>
                       <span className={`text-xs font-semibold ${isIdle ? 'text-amber-400' : 'text-slate-200'}`}>
                         {c.cpu_usage.toFixed(1)}%
                       </span>
                     </div>
                   </td>
                   <td className="py-4 px-3">
                     <div className="flex items-center gap-2">
                       <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                         <div className="bg-purple-500 h-full" style={{ width: `${c.memory_usage}%` }} />
                       </div>
                       <span className="text-xs font-semibold text-slate-200">
                         {c.memory_usage.toFixed(1)}%
                       </span>
                     </div>
                   </td>
                   <td className="py-4 px-3 text-sm font-semibold text-slate-200">
                     <span className="flex items-center gap-1 text-emerald-400">
                       <Zap size={14} className="text-emerald-500" />
                       {c.carbon_output.toFixed(2)} g/hr
                     </span>
                   </td>
                   <td className="py-4 px-3 text-right">
                     <div className="inline-flex gap-2">
                       <button
                         onClick={() => {
                           if (isAdmin) {
                             setSelectedContainer(c);
                             setCpuVal(c.cpu_usage);
                             setMemVal(c.memory_usage);
                           }
                         }}
                         disabled={!isAdmin}
                         className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                           isAdmin
                             ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                             : 'bg-slate-900/40 text-slate-600 border border-slate-850 cursor-not-allowed'
                         }`}
                         title={isAdmin ? "Simulate load tweak" : "Admin override required"}
                       >
                         Tweak
                       </button>
                       <button
                         onClick={() => {
                           if (isAdmin) handleManualAction(c.id, 'ACTIVE');
                         }}
                         disabled={!isAdmin || c.status === 'ACTIVE'}
                         className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                           c.status === 'ACTIVE'
                             ? 'bg-emerald-950/20 text-emerald-500 cursor-default'
                             : isAdmin
                             ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400'
                             : 'bg-slate-900/40 text-slate-600 cursor-not-allowed'
                         }`}
                       >
                         Wake
                       </button>
                       <button
                         onClick={() => {
                           if (isAdmin) handleManualAction(c.id, 'STANDBY');
                         }}
                         disabled={!isAdmin || c.status === 'STANDBY'}
                         className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                           c.status === 'STANDBY'
                             ? 'bg-amber-950/20 text-amber-500 cursor-default'
                             : isAdmin
                             ? 'bg-slate-800 hover:bg-slate-700 text-amber-400'
                             : 'bg-slate-900/40 text-slate-600 cursor-not-allowed'
                         }`}
                       >
                         Standby
                       </button>
                     </div>
                   </td>
                 </tr>
               );
             })}
           </tbody>
        </table>
      </div>

      {/* --- Load Simulation Tweak Modal --- */}
      {selectedContainer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-darkCard border border-darkBorder max-w-md w-full rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Simulate Load Spikes / Drops</h3>
              <button onClick={() => setSelectedContainer(null)} className="text-slate-400 hover:text-slate-100">
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Adjust resource footprint values for <span className="font-semibold text-emerald-400">{selectedContainer.name}</span>. 
              Setting CPU below 15% will test the platform's automated standby policy.
            </p>
            <form onSubmit={handleSimulate} className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">CPU Usage (%)</span>
                  <span className={cpuVal < 15 ? 'text-amber-400' : 'text-emerald-400'}>
                    {cpuVal}% {cpuVal < 15 ? '(Trigger Standby)' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={cpuVal}
                  onChange={(e) => setCpuVal(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Memory Usage (%)</span>
                  <span className="text-purple-400">{memVal}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={memVal}
                  onChange={(e) => setMemVal(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-darkBorder">
                <button
                  type="button"
                  onClick={() => setSelectedContainer(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-950/20"
                >
                  {isSubmitting ? 'Applying...' : 'Inject Footprint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Add Container Modal --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-darkCard border border-darkBorder max-w-md w-full rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Spin Up New Pod</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-100">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateContainer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Service Pod Name</label>
                <input
                  type="text"
                  placeholder="e.g. notifications-worker-service"
                  value={newContainerName}
                  onChange={(e) => setNewContainerName(e.target.value)}
                  className="w-full bg-darkBg border border-darkBorder px-4 py-3 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-darkBorder">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition"
                >
                  Initialize Pod
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
