import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import type { TimeSeriesPoint } from '../api';

const formatXAxis = (tickItem: any) => {
  try {
    if (typeof tickItem !== 'string') return String(tickItem);
    const d = new Date(tickItem.endsWith('Z') || tickItem.includes('+') ? tickItem : tickItem + 'Z');
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  } catch (e) {
    return String(tickItem);
  }
};

const formatTooltipLabel = (label: any) => {
  try {
    if (typeof label !== 'string') return String(label);
    const d = new Date(label.endsWith('Z') || label.includes('+') ? label : label + 'Z');
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch (e) {
    return String(label);
  }
};

interface CarbonAnalyticsChartsProps {
  trendData: TimeSeriesPoint[];
}

export const CarbonAnalyticsCharts: React.FC<CarbonAnalyticsChartsProps> = ({ trendData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* --- Chart 1: Carbon Emissions Trend --- */}
      <div className="bg-darkCard border border-darkBorder/60 p-6 rounded-2xl shadow-xl">
        <div className="mb-4">
          <h3 className="text-md font-bold text-white">Carbon Emissions Trend</h3>
          <p className="text-xs text-slate-400">Total cumulative emissions output rate (grams CO₂ / hour).</p>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="timestamp" tickFormatter={formatXAxis} stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#151D30', borderColor: '#1E293B', borderRadius: '12px' }}
                labelClassName="text-slate-400 text-xs font-semibold"
                labelFormatter={formatTooltipLabel}
              />
              <Area
                type="monotone"
                dataKey="carbon_total"
                stroke="#EF4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCarbon)"
                name="Emissions (g/hr)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Chart 2: Resource Utilization Trend --- */}
      <div className="bg-darkCard border border-darkBorder/60 p-6 rounded-2xl shadow-xl">
        <div className="mb-4">
          <h3 className="text-md font-bold text-white">Resource Utilization Over Time</h3>
          <p className="text-xs text-slate-400">Averages of CPU and Memory usage percentages across all containers.</p>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="timestamp" tickFormatter={formatXAxis} stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#151D30', borderColor: '#1E293B', borderRadius: '12px' }}
                labelClassName="text-slate-400 text-xs font-semibold"
                labelFormatter={formatTooltipLabel}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line
                type="monotone"
                dataKey="cpu_avg"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                name="Avg CPU (%)"
              />
              <Line
                type="monotone"
                dataKey="memory_avg"
                stroke="#A855F7"
                strokeWidth={2}
                dot={false}
                name="Avg Memory (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Chart 3: Carbon Savings Trend --- */}
      <div className="bg-darkCard border border-darkBorder/60 p-6 rounded-2xl shadow-xl lg:col-span-2">
        <div className="mb-4">
          <h3 className="text-md font-bold text-white">Cumulative Saved Carbon</h3>
          <p className="text-xs text-slate-400">Total estimated grams of CO₂ saved due to automated scaling and standby rules.</p>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="timestamp" tickFormatter={formatXAxis} stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#151D30', borderColor: '#1E293B', borderRadius: '12px' }}
                labelClassName="text-slate-400 text-xs font-semibold"
                labelFormatter={formatTooltipLabel}
              />
              <Area
                type="monotone"
                dataKey="carbon_saved_total"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSaved)"
                name="Carbon Saved (g)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
