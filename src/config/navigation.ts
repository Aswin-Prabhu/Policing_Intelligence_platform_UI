import { UserRole } from '../types';
import {
  Video,
  Camera,
  Car,
  CheckCircle,
  AlertTriangle,
  Plane,
  FileText,
  Activity,
  Shield,
  BarChart3,
  Settings
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  roles: UserRole[];
  children?: NavItem[];
}

export const navigationConfig: NavItem[] = [
  {
    id: 'surveillance',
    label: 'Surveillance',
    icon: Video,
    path: '/surveillance',
    roles: ['cco', 'supervisor', 'admin'],
    children: [
      { id: 'live-grid', label: 'Live Grid', icon: Video, path: '/surveillance/live-grid', roles: ['cco', 'supervisor', 'admin'] },
      { id: 'cross-camera', label: 'Cross-Camera', icon: Video, path: '/surveillance/cross-camera', roles: ['cco', 'supervisor', 'admin'] },
      { id: 'multi-grid', label: 'Multi-Grid', icon: Video, path: '/surveillance/multi-grid', roles: ['cco', 'supervisor', 'admin'] }
    ]
  },
  {
    id: 'bodycam',
    label: 'Bodycam',
    icon: Camera,
    path: '/bodycam',
    roles: ['cco', 'supervisor', 'admin']
  },
  {
    id: 'anpr',
    label: 'ANPR',
    icon: Car,
    path: '/anpr',
    roles: ['cco', 'supervisor', 'admin'],
    children: [
      { id: 'violations', label: 'Violations List', icon: Car, path: '/anpr/violations', roles: ['cco', 'supervisor', 'admin'] },
      { id: 'approval', label: 'Approval Queue', icon: CheckCircle, path: '/anpr/approval', roles: ['supervisor', 'admin'] }
    ]
  },
  {
    id: 'alerts',
    label: 'Alerts & SOP',
    icon: AlertTriangle,
    path: '/alerts',
    roles: ['cco', 'supervisor', 'admin'],
    children: [
      { id: 'anomaly', label: 'Anomaly Alerts', icon: AlertTriangle, path: '/alerts/anomaly', roles: ['cco', 'supervisor', 'admin'] },
      { id: 'sop', label: 'SOP Compliance', icon: FileText, path: '/alerts/sop', roles: ['cco', 'supervisor', 'admin'] }
    ]
  },
  {
    id: 'drone',
    label: 'Drone Ops',
    icon: Plane,
    path: '/drone',
    roles: ['cco', 'supervisor', 'admin'],
    children: [
      { id: 'fleet', label: 'Fleet Status', icon: Plane, path: '/drone/fleet', roles: ['cco', 'supervisor', 'admin'] },
      { id: 'missions', label: 'Live Missions', icon: Plane, path: '/drone/missions', roles: ['cco', 'supervisor', 'admin'] },
      { id: 'drone-alerts', label: 'Drone Alerts', icon: AlertTriangle, path: '/drone/alerts', roles: ['cco', 'supervisor', 'admin'] }
    ]
  },
  {
    id: 'incidents',
    label: 'Incident Mgmt',
    icon: FileText,
    path: '/incidents',
    roles: ['cco', 'supervisor', 'admin']
  },
  {
    id: 'detection',
    label: 'Detection Engine',
    icon: Activity,
    path: '/detection',
    roles: ['supervisor', 'admin'],
    children: [
      { id: 'log', label: 'Detection Log', icon: Activity, path: '/detection/log', roles: ['supervisor', 'admin'] },
      { id: 'verify', label: 'Verify', icon: CheckCircle, path: '/detection/verify', roles: ['supervisor', 'admin'] }
    ]
  },
  {
    id: 'evidence',
    label: 'Evidence Console',
    icon: Shield,
    path: '/evidence',
    roles: ['supervisor', 'admin'],
    children: [
      { id: 'timeline', label: 'Timeline', icon: Activity, path: '/evidence/timeline', roles: ['supervisor', 'admin'] },
      { id: 'multi-source', label: 'Multi-Source Sync', icon: Video, path: '/evidence/multi-source', roles: ['supervisor', 'admin'] }
    ]
  },
  {
    id: 'explainability',
    label: 'Explainability',
    icon: Activity,
    path: '/explainability',
    roles: ['supervisor', 'admin'],
    children: [
      { id: 'dag-trace', label: 'DAG Trace', icon: Activity, path: '/explainability/dag', roles: ['supervisor', 'admin'] },
      { id: 'ai-logs', label: 'AI Logs', icon: FileText, path: '/explainability/logs', roles: ['supervisor', 'admin'] }
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
    roles: ['cco', 'supervisor', 'admin'],
    children: [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard', roles: ['cco', 'supervisor', 'admin'] },
      { id: 'camera-health', label: 'Camera Health', icon: Video, path: '/analytics/camera-health', roles: ['supervisor', 'admin'] },
      { id: 'trends', label: 'Trends', icon: Activity, path: '/analytics/trends', roles: ['supervisor', 'admin'] }
    ]
  },
  {
    id: 'admin',
    label: 'Administration',
    icon: Settings,
    path: '/admin',
    roles: ['admin'],
    children: [
      { id: 'registry', label: 'Registry', icon: FileText, path: '/admin/registry', roles: ['admin'] },
      { id: 'users', label: 'User Mgmt', icon: Settings, path: '/admin/users', roles: ['admin'] },
      { id: 'system-health', label: 'System Health', icon: Activity, path: '/admin/health', roles: ['admin'] }
    ]
  }
];

export function getNavigationForRole(role: UserRole): NavItem[] {
  return navigationConfig
    .filter(item => item.roles.includes(role))
    .map(item => ({
      ...item,
      children: item.children?.filter(child => child.roles.includes(role))
    }));
}
