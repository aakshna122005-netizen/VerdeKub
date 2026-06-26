import React from 'react';
import { Layers, Activity, PowerOff, Sparkles, Flame } from 'lucide-react';
import type { KPIOverview } from '../api';


interface OverviewCardsProps {
  kpis: KPIOverview;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ kpis }) => {
  const cards = [
    {
      title: 'Total Containers',
      value: kpis.total_containers,
      unit: '',
      icon: Layers,
      color: 'from-blue-600 to-indigo-600',
      shadow: 'shadow-blue-500/10',
      desc: 'Monitored microservices',
    },
    {
      title: 'Active Workloads',
      value: kpis.active_containers,
      unit: '',
      icon: Activity,
      color: 'from-cyan-500 to-teal-500',
      shadow: 'shadow-cyan-500/10',
      desc: 'Containers in ACTIVE state',
    },
    {
      title: 'Idle / Standby',
      value: kpis.idle_containers,
      unit: '',
      icon: PowerOff,
      color: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/10',
      desc: 'Containers optimized to STANDBY',
    },
    {
      title: 'Carbon Saved',
      value: kpis.carbon_saved.toFixed(1),
      unit: ' g CO₂',
      icon: Sparkles,
      color: 'from-emerald-500 to-green-600',
      shadow: 'shadow-emerald-500/20',
      desc: 'Reduced digital emissions',
    },
    {
      title: 'Current Footprint',
      value: kpis.current_emissions.toFixed(1),
      unit: ' g/hr',
      icon: Flame,
      color: 'from-rose-500 to-red-600',
      shadow: 'shadow-rose-500/10',
      desc: 'Active emissions output rate',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`bg-darkCard border border-darkBorder/60 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all duration-300 shadow-lg ${card.shadow}`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.color} text-white`}>
                <Icon size={18} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {card.value}
                </span>
                {card.unit && (
                  <span className="text-sm font-semibold text-slate-400">{card.unit}</span>
                )}
              </div>
              <span className="text-[11px] text-slate-500 mt-2 block">{card.desc}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
