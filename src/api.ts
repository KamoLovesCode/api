import { Project, Task, Deployment, SystemStatus } from './types';

const API_BASE = '/api';

export const api = {
  getProjects: async (): Promise<Project[]> => {
    const res = await fetch(`${API_BASE}/projects`);
    return res.json();
  },
  getProject: async (id: string): Promise<Project> => {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    if (!res.ok) throw new Error('Not found');
    return res.json();
  },
  updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Update failed');
    return res.json();
  },
  createProject: async (data: Partial<Project>): Promise<Project> => {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Create failed');
    return res.json();
  },
  deleteProject: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
  },
  getSystemStatus: async (): Promise<SystemStatus> => {
    const res = await fetch(`${API_BASE}/system/status`);
    return res.json();
  },
  getTasks: async (projectId?: string): Promise<Task[]> => {
    const url = projectId ? `${API_BASE}/tasks?projectId=${projectId}` : `${API_BASE}/tasks`;
    const res = await fetch(url);
    return res.json();
  },
  getDeployments: async (projectId?: string): Promise<Deployment[]> => {
    const url = projectId ? `${API_BASE}/deployments?projectId=${projectId}` : `${API_BASE}/deployments`;
    const res = await fetch(url);
    return res.json();
  }
};
