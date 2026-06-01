export interface Project {
  id: string;
  name: string;
  status: 'active' | 'maintenance' | 'offline';
  health: 'healthy' | 'degraded' | 'offline';
  version: string;
  url?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignee: string;
}

export interface Deployment {
  id: string;
  projectId: string;
  status: 'success' | 'failed' | 'in-progress';
  timestamp: string;
  env: 'production' | 'staging' | 'development';
}

export interface SystemStatus {
  projects: number;
  tasks_pending: number;
  healthy_services: number;
  system_load: string;
  last_updated: string;
}
