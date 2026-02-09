import {
  LayoutDashboard,
  Camera,
  Video,
  Car,
  AlertTriangle,
  FileText,
  FolderOpen,
  GitBranch,
  BarChart3,
  Target,
  Plane,
  Radio,

  Users,
  Activity,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

import apPoliceLogo from "../assets/ap-police-logo.png";



interface SidebarProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  userRole: 'operator' | 'supervisor' | 'admin';
}

interface NavSection {
  title: string;
  items: Array<{
    id: string;
    label: string;
    icon: any;
    roles: string[];
  }>;
}

export function Sidebar({ activeScreen, onNavigate, userRole }: SidebarProps) {
  const [theme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('kkn_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });
  const isLightTheme = theme === 'light';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('kkn_theme', theme);
  }, [theme]);

  const navSections: NavSection[] = [
    {
      title: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['operator', 'supervisor', 'admin'] },
        { id: 'analytics-home', label: 'Analytics Dashboard', icon: BarChart3, roles: ['operator', 'supervisor', 'admin'] },
      ]

    },
    {
      title: 'Surveillance Intelligence',
      items: [
        { id: 'surveillance-grid', label: 'Live Camera Grid', icon: Camera, roles: ['operator', 'supervisor', 'admin'] },
        { id: 'cross-camera-tracking', label: 'Multi-Camera Tracking', icon: Target, roles: ['operator', 'supervisor', 'admin'] },
        // { id: 'multi-grid-viewer', label: 'Multi-Grid Viewer', icon: Grid3x3, roles: ['operator', 'supervisor', 'admin'] },
      ]
    },
    {
      title: 'Bodycam Monitoring',
      items: [
        { id: 'bodycam-grid', label: 'Bodycam Grid', icon: Video, roles: ['operator', 'supervisor', 'admin'] },
      ]
    },
    {
      title: 'Traffic Violations',
      items: [
        { id: 'anpr-home', label: 'Traffic Violation ', icon: Car, roles: ['operator', 'supervisor', 'admin'] },
        { id: 'traffic-simulation', label: 'Detection Simulation', icon: Activity, roles: ['operator', 'supervisor', 'admin'] },
        { id: 'anpr-list', label: 'Validation List', icon: Car, roles: ['operator', 'supervisor', 'admin'] },
        // { id: 'anpr-approval', label: 'Approval / Escalations', icon: CheckCircle, roles: ['operator', 'supervisor', 'admin'] },
      ]
    },
    {
      title: 'Incidents Management',
      items: [
        { id: 'alerts-home', label: 'Incident Management', icon: AlertTriangle, roles: ['operator', 'supervisor', 'admin'] }
      ]
    },
    {
      title: 'Drone & Aerial Operations',
      items: [
        { id: 'drone-fleet', label: 'Drone Fleet Status', icon: Plane, roles: ['operator', 'supervisor', 'admin'] },
        { id: 'drone-missions', label: 'Live Drone Missions', icon: Radio, roles: ['operator', 'supervisor', 'admin'] },
        { id: 'drone-alerts', label: 'Drone Alerts', icon: AlertTriangle, roles: ['operator', 'supervisor', 'admin'] },
      ]
    },
    {
      title: 'Evidence Console',
      items: [
        { id: 'evidence-home', label: 'Evidence', icon: FolderOpen, roles: ['operator', 'supervisor', 'admin'] },
      ]
    },
    {
      title: 'Administration',
      items: [
        { id: 'admin-cameras', label: 'Camera Registry', icon: Camera, roles: ['admin'] },
        { id: 'admin-drones', label: 'Drone Registry', icon: Plane, roles: ['admin'] },
        { id: 'admin-bodycams', label: 'Bodycam Registry', icon: Video, roles: ['admin'] },
        { id: 'admin-users', label: 'User Management', icon: Users, roles: ['admin'] },
        { id: 'admin-system', label: 'System Health', icon: Activity, roles: ['admin'] },
        //{ id: 'admin-ai-models', label: 'AI Model Manager', icon: Cpu, roles: ['admin'] },
        { id: 'sop', label: 'AI SOP Compliance', icon: FileText, roles: ['operator', 'supervisor', 'admin'] },
      ]
    }
  ];

  // Filter sections based on user role
  const filteredSections = navSections
    .map(section => ({
      ...section,
      items: section.items.filter(item => item.roles.includes(userRole))
    }))
    .filter(section => section.items.length > 0);

  const getRoleTitle = () => {
    switch (userRole) {
      case 'operator': return 'Control Room Operator';
      case 'supervisor': return 'Supervisor';
      case 'admin': return 'System Administrator';
    }
  };
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);


  const sidebarClasses = 'w-72 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-sm transition-all duration-300';

  return (
    <div className={sidebarClasses}>
      {/* Header Area */}
      <div className="px-6 py-6 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/50">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center p-1">
            <img
              src={apPoliceLogo}
              alt="AP Police Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-wide leading-tight">KAKINADA<span className="text-indigo-600"> POLICE</span></h1>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
              Command Center
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-700 leading-none">
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).toUpperCase()}
              </div>
              <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mt-1">
                {currentTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Area */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {filteredSections.map((section) => (
          <div key={section.title}>
            {section.title && (
              <p className="text-[10px] font-bold text-slate-400 px-4 mb-3 uppercase tracking-widest leading-none">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.id === 'anpr-home'
                    ? activeScreen === 'anpr-home'
                    : item.id === 'anpr-list'
                      ? ['anpr-list', 'anpr-detail', 'anpr-approval', 'anpr-operator', 'anpr-supervisor-queue'].includes(activeScreen)
                      : item.id.startsWith('alerts')
                        ? activeScreen.startsWith('alerts') || activeScreen.startsWith('incident')
                        : item.id.startsWith('evidence')
                          ? activeScreen.startsWith('evidence')
                          : item.id.startsWith('explainability')
                            ? activeScreen.startsWith('explainability')
                            : activeScreen.startsWith(item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`group w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl relative overflow-hidden ${isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 translate-x-1'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:translate-x-1'
                      }`}
                  >
                    {/* Icon */}
                    <Icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />

                    {/* Label */}
                    <span className="flex-1 text-left tracking-tight">{item.label}</span>

                    {/* Active Indicator (Chevron) */}
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-indigo-200 animate-in fade-in slide-in-from-left-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / User Area */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
              {userRole.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-500 mb-0.5">Logged in as</p>
              <p className="text-sm font-bold text-slate-800 truncate">{getRoleTitle()}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse"></div>
          </div>
        </div>

        {/* System Status Mock */}
        {/* <div className="mt-3 text-center">
            <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100 font-medium">
               System Online v2.4.0
            </span>
        </div> */}
      </div>
    </div>
  );
}