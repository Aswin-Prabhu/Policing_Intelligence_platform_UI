export type UserRole = 'cco' | 'supervisor' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export interface Alert {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'normal';
  timestamp: string;
  source: string;
  location: string;
}

export interface Drone {
  id: string;
  name: string;
  battery: number;
  pilot: string;
  status: 'active' | 'idle' | 'charging';
}

export interface Stats {
  totalCameras: number;
  activeCameras: number;
  activeDrones: number;
  pendingIncidents: number;
  todayViolations: number;
}

export interface ANPRHit {
  id: string;
  plate: string;
  vehicle: string;
  confidence: number;
  timestamp: string;
}
