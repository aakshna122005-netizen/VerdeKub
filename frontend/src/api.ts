import axios from 'axios';

// Backend endpoint configuration (falls back to localhost in dev, or relative path in production containers)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
});

export interface Container {
  id: number;
  name: string;
  status: 'ACTIVE' | 'STANDBY' | 'THROTTLED';
  cpu_usage: number;
  memory_usage: number;
  carbon_output: number;
  created_at: string;
}

export interface Metric {
  id: number;
  container_id: number;
  cpu_usage: number;
  memory_usage: number;
  carbon_output: number;
  timestamp: string;
}

export interface EventLog {
  id: number;
  container_id: number;
  container_name: string;
  event_type: 'ANOMALY' | 'GOVERNANCE' | 'SIMULATION' | 'MANUAL_OVERRIDE';
  action: string;
  timestamp: string;
  details: string;
}

export interface KPIOverview {
  total_containers: number;
  active_containers: number;
  idle_containers: number;
  carbon_saved: number;
  current_emissions: number;
}

export interface TimeSeriesPoint {
  timestamp: string;
  cpu_avg: number;
  memory_avg: number;
  carbon_total: number;
  carbon_saved_total: number;
}

export interface AnalyticsData {
  kpis: KPIOverview;
  carbon_trend: TimeSeriesPoint[];
  utilization_trend: TimeSeriesPoint[];
  daily_emissions: TimeSeriesPoint[];
}

export interface SettingsData {
  contamination_rate: number;
  leakage_cpu_threshold: number;
}

export const api = {
  getContainers: async (): Promise<Container[]> => {
    const response = await client.get<Container[]>('/containers');
    return response.data;
  },

  createContainer: async (name: string): Promise<Container> => {
    const response = await client.post<Container>('/containers', { name });
    return response.data;
  },

  getMetrics: async (containerId?: number): Promise<Metric[]> => {
    const response = await client.get<Metric[]>('/metrics', {
      params: { container_id: containerId },
    });
    return response.data;
  },

  getEvents: async (): Promise<EventLog[]> => {
    const response = await client.get<EventLog[]>('/events');
    return response.data;
  },

  getAnalytics: async (): Promise<AnalyticsData> => {
    const response = await client.get<AnalyticsData>('/analytics');
    return response.data;
  },

  simulateLoad: async (containerName: string, cpuUsage: number, memoryUsage: number): Promise<Container> => {
    const response = await client.post<Container>('/simulate', {
      container_name: containerName,
      cpu_usage: cpuUsage,
      memory_usage: memoryUsage,
    });
    return response.data;
  },

  triggerGovernance: async (containerId: number, action: 'STANDBY' | 'THROTTLED' | 'ACTIVE'): Promise<EventLog> => {
    const response = await client.post<EventLog>('/governance', {
      container_id: containerId,
      action,
    });
    return response.data;
  },

  getSettings: async (): Promise<SettingsData> => {
    const response = await client.get<SettingsData>('/settings');
    return response.data;
  },

  updateSettings: async (settings: SettingsData): Promise<SettingsData> => {
    const response = await client.post<SettingsData>('/settings', settings);
    return response.data;
  },

  getReportUrl: (): string => {
    return `${API_BASE_URL}/report`;
  },
};
