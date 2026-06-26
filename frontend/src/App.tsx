import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { OverviewCards } from './components/OverviewCards';
import { LiveMonitoringTable } from './components/LiveMonitoringTable';
import { CarbonAnalyticsCharts } from './components/CarbonAnalyticsCharts';
import { GovernanceEventsLog } from './components/GovernanceEventsLog';
import { SettingsPanel } from './components/SettingsPanel';
import { Login } from './components/Login';
import { WelcomePortal } from './components/WelcomePortal';
import { api } from './api';
import type { Container, EventLog, AnalyticsData } from './api';

import { Download, RefreshCw, Leaf } from 'lucide-react';

export const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<'susty-admin' | 'susty-viewer' | null>(() => {
    return (localStorage.getItem('userRole') as 'susty-admin' | 'susty-viewer') || null;
  });
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [containers, setContainers] = useState<Container[]>([]);
  const [events, setEvents] = useState<EventLog[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleLogin = (role: 'susty-admin' | 'susty-viewer') => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('userRole');
  };

  const fetchData = async (silent = false) => {
    if (!userRole) return;
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    
    try {
      const [containerData, eventData, analyticsData] = await Promise.all([
        api.getContainers(),
        api.getEvents(),
        api.getAnalytics(),
      ]);
      setContainers(containerData);
      setEvents(eventData);
      setAnalytics(analyticsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard datasets', err);
      setError('Could not connect to the VerdeKube backend. Please make sure the backend is running.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (userRole) {
      fetchData();

      // Auto-refresh metrics every 5 seconds
      const interval = setInterval(() => {
        fetchData(true);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [userRole]);

  const handleDownloadReport = () => {
    window.open(api.getReportUrl(), '_blank');
  };

  if (showLanding) {
    return <WelcomePortal onEnter={() => setShowLanding(false)} />;
  }

  if (!userRole) {
    return <Login onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-darkBg text-slate-100 flex-col gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <span className="text-sm font-semibold tracking-wide text-slate-400">Loading VerdeKube Governance Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-darkBg text-slate-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={userRole} onLogout={handleLogout} />

      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* --- Top Bar --- */}
        <header className="h-16 border-b border-darkBorder/60 bg-darkCard px-8 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-lg text-white">
              {activeTab === 'dashboard' && 'Sustainability Dashboard'}
              {activeTab === 'governance' && 'Governance Controls'}
              {activeTab === 'analytics' && 'Carbon Analytics'}
              {activeTab === 'events' && 'Audit Log'}
              {activeTab === 'settings' && 'Governance & ML Settings'}
              {activeTab === 'report' && 'Compliance & Reports'}
            </h2>
            {isRefreshing && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/30 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                <RefreshCw size={12} className="animate-spin" />
                Syncing metrics
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchData(true)}
              className="text-slate-400 hover:text-slate-100 transition p-2 rounded-lg hover:bg-slate-800"
              title="Manual refresh"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={handleDownloadReport}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-md shadow-emerald-900/10"
            >
              <Download size={14} />
              Sustainability PDF
            </button>
          </div>
        </header>

        {/* --- Dashboard Content --- */}
        <div className="flex-1 p-8 space-y-8 max-w-[1440px] mx-auto w-full">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-sm font-semibold flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => fetchData()}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-3 py-1 rounded-lg text-xs"
              >
                Reconnect
              </button>
            </div>
          )}

          {/* --- Tab Views --- */}
          {activeTab === 'dashboard' && (
            <>
              {analytics && <OverviewCards kpis={analytics.kpis} />}
              <LiveMonitoringTable containers={containers} onRefresh={() => fetchData(true)} role={userRole} />
              {analytics && <CarbonAnalyticsCharts trendData={analytics.carbon_trend} />}
            </>
          )}

          {activeTab === 'governance' && (
            <LiveMonitoringTable containers={containers} onRefresh={() => fetchData(true)} role={userRole} />
          )}

          {activeTab === 'analytics' && analytics && (
            <CarbonAnalyticsCharts trendData={analytics.carbon_trend} />
          )}

          {activeTab === 'events' && (
            <GovernanceEventsLog events={events} />
          )}

          {activeTab === 'settings' && (
            <SettingsPanel role={userRole} />
          )}

          {activeTab === 'report' && (
            <div className="bg-darkCard border border-darkBorder/60 rounded-2xl p-8 max-w-2xl mx-auto text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 bg-emerald-600/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-inner">
                <Leaf size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Sustainability Compliance & Reporting</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
                  Download a comprehensive PDF audit report documenting active carbon leaks, idle workloads, and saved CO₂ footprints.
                </p>
              </div>

              <div className="bg-darkBg/60 border border-darkBorder p-6 rounded-xl text-left space-y-4 max-w-md mx-auto">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Report Contents</h4>
                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                  <li>Executive sustainability overview and carbon savings totals.</li>
                  <li>Live stats breakdown of all running container workloads.</li>
                  <li>Historical audit log detailing machine learning isolation classifications.</li>
                  <li>Automated downscaling and standby governance action summaries.</li>
                  <li>Configured ML anomaly hyperparameters.</li>
                </ul>
              </div>

              <button
                onClick={handleDownloadReport}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3 rounded-xl inline-flex items-center gap-3 transition shadow-lg shadow-emerald-950/20 hover:-translate-y-0.5 duration-200"
              >
                <Download size={18} />
                Generate & Download PDF
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;










