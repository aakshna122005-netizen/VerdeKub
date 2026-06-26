import React from 'react';
import { LayoutDashboard, ShieldAlert, Cpu, Leaf, FileSpreadsheet, LogOut, ShieldCheck, User, Sliders } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: 'susty-admin' | 'susty-viewer';
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, role, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'governance', name: 'Governance Actions', icon: Cpu },
    { id: 'analytics', name: 'Carbon Analytics', icon: Leaf },
    { id: 'events', name: 'System Logs', icon: ShieldAlert },
    { id: 'settings', name: 'System Settings', icon: Sliders },
    { id: 'report', name: 'Sustainability Report', icon: FileSpreadsheet },
  ];

  return (
    <div className="w-64 bg-darkCard border-r border-darkBorder flex flex-col h-screen select-none">
      <div className="p-6 border-b border-darkBorder flex items-center gap-3">
        <div className="bg-emerald-600 p-2 rounded-lg text-white shadow-lg shadow-emerald-900/40">
          <Leaf size={22} className="animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white leading-tight">EcoKube AI</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full scale-90 origin-left">
              LIVE DATA MODE
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-100'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* User Info & Actions Section */}
      <div className="p-4 border-t border-darkBorder space-y-3">
        <div className="bg-darkBg/60 p-3.5 rounded-xl border border-darkBorder/50 flex items-center gap-3">
          <div className={`p-2 rounded-lg ${role === 'susty-admin' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
            {role === 'susty-admin' ? <ShieldCheck size={18} /> : <User size={18} />}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs text-slate-500 font-medium">Logged in as</p>
            <p className="text-xs font-bold text-slate-200 truncate">{role}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 bg-slate-950/40 hover:bg-rose-950/10 transition-all text-xs font-semibold"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );
};
