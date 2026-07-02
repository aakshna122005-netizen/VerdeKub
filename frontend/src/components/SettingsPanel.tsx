import React, { useState, useEffect } from 'react';
import { api, API_BASE_URL } from '../api';
import type { SettingsData } from '../api';
import { Sliders, ShieldAlert, Cpu, Activity, CheckCircle, ExternalLink, Lock, Download } from 'lucide-react';

interface SettingsPanelProps {
  role: 'susty-admin' | 'susty-viewer';
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ role }) => {
  const [settings, setSettings] = useState<SettingsData>({
    contamination_rate: 0.15,
    leakage_cpu_threshold: 15.0,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const isAdmin = role === 'susty-admin';

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const handleSave = async () => {
    if (!isAdmin) return;
    setLoading(true);
    setSuccess(false);
    try {
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setLoading(false);
    }
  };

 const prometheusUrl = `${API_BASE_URL}/prometheus`;
  const downloadUrl = `${API_BASE_URL}/agents/download`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Governance & ML Configurations</h2>
          <p className="text-slate-400 text-xs mt-1">
            Fine-tune anomaly sensitivity and automated standby resource throttling parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ML Configuration Controls */}
        <div className="lg:col-span-2 bg-darkCard border border-darkBorder rounded-2xl p-6 relative overflow-hidden">
          {!isAdmin && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-10 flex flex-col justify-center items-center p-6 text-center">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center max-w-sm shadow-2xl">
                <Lock className="w-8 h-8 text-amber-500 mb-3" />
                <h4 className="text-white font-bold text-sm">Viewer Access Restricted</h4>
                <p className="text-xs text-slate-400 mt-1">
                  You are logged in as <span className="text-blue-400 font-semibold">susty-viewer</span>. To adjust ML contamination limits and governance policies, sign out and authenticate as <span className="text-emerald-400 font-semibold">susty-admin</span>.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 border-b border-darkBorder/60 pb-4 mb-6">
            <Sliders className="text-emerald-500 w-5 h-5" />
            <h3 className="font-bold text-white text-base">Model Hyper-parameters</h3>
          </div>

          <div className="space-y-6">
            {/* ... */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-500" />
                  Isolation Forest Contamination Rate
                </label>
                <span className="text-sm font-bold text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">
                  {(settings.contamination_rate * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.50"
                step="0.01"
                value={settings.contamination_rate}
                onChange={(e) => setSettings({ ...settings, contamination_rate: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <p className="text-[11px] text-slate-500 mt-1.5">
                Specifies the proportion of expected anomalies (carbon leakage) in the dataset. Higher values increase detection sensitivity.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-500" />
                  Base Underutilization CPU Threshold
                </label>
                <span className="text-sm font-bold text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">
                  {settings.leakage_cpu_threshold}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={settings.leakage_cpu_threshold}
                onChange={(e) => setSettings({ ...settings, leakage_cpu_threshold: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <p className="text-[11px] text-slate-500 mt-1.5">
                Containers running below this CPU utilization rate are flagged as underutilized carbon leaks, automatically forcing a STANDBY scale-down state.
              </p>
            </div>

            {isAdmin && (
              <div className="pt-4 border-t border-darkBorder/60 flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold text-xs rounded-xl px-6 py-2.5 transition-all"
                >
                  {loading ? 'Applying Changes...' : 'Save & Retrain Model'}
                </button>
                {success && (
                  <span className="text-emerald-400 text-xs flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> ML settings updated & Isolation Forest retrained.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Recruiter / Observability Details Card */}
          <div className="bg-darkCard border border-darkBorder rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 border-b border-darkBorder/60 pb-4 mb-4">
                <Activity className="text-emerald-500 w-5 h-5" />
                <h3 className="font-bold text-white text-base">Observability Metrics</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                VerdeKube AI generates live metrics for standard cloud native monitoring scrapers. You can directly plug this endpoint into a Prometheus instance to scrape live container health.
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                  <span>Observability Endpoint</span>
                  <span className="text-emerald-500">Active</span>
                </div>
                <a
                  href={prometheusUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between text-xs text-slate-300 hover:text-emerald-400 bg-slate-900 border border-slate-800/80 hover:border-emerald-500/30 rounded-lg p-2 transition-all font-mono"
                >
                  <span>/prometheus</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-darkBorder/60">
              <h4 className="text-xs font-bold text-slate-300 mb-1">Architecture Reference:</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                When the contamination rate or threshold is updated, the FastAPI backend instantiates a new Isolation Forest model, fits it to baseline clean training grids, and updates predictions dynamically across all monitoring threads.
              </p>
            </div>
          </div>

          {/* Download Agent Card */}
          <div className="bg-darkCard border border-darkBorder rounded-2xl p-6">
            <div className="flex items-center gap-3 border-b border-darkBorder/60 pb-4 mb-4">
              <Download className="text-emerald-500 w-5 h-5" />
              <h3 className="font-bold text-white text-base">Local Agent Deployment</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/25 px-2 py-0.5 rounded-md">
                  Recommended (Zero Terminal)
                </span>
                <p className="text-xs text-slate-300 mt-2 font-semibold">
                  Windows App (.exe)
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                  Double-click to start monitoring and reducing carbon emissions instantly. No installation or setup required.
                </p>
                <a
                  href={`${downloadUrl}?format=exe`}
                  className="w-full mt-2.5 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold text-xs rounded-xl py-2.5 transition-all text-center"
                >
                  <Download size={14} />
                  Download VerdeKubeAgent.exe
                </a>
              </div>

              <div className="pt-4 border-t border-darkBorder/40">
                <p className="text-xs text-slate-300 font-semibold">
                  Developer Script (.py)
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                  For Python developers, macOS, or custom configurations.
                </p>
                <a
                  href={`${downloadUrl}?format=py`}
                  className="w-full mt-2.5 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold text-xs rounded-xl py-2 transition-all text-center border border-darkBorder/60"
                >
                  <Download size={14} />
                  Download agent.py
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
