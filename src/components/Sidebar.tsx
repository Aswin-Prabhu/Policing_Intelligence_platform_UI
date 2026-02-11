import {
  LayoutDashboard,
  BrainCircuit,
  Camera,
  Video,
  Car,
  AlertTriangle,
  FileText,
  FolderOpen,
  BarChart3,
  Target,
  Plane,
  Radio,
  Siren,

  Users,
  Activity,
  ChevronRight,
  ChevronDown
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

  // State for tracking expanded sections
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['Main']) // Default: Main section expanded
  );

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
        { id: 'alerts-home', label: 'Incident Management', icon: AlertTriangle, roles: ['operator', 'supervisor', 'admin'] },
        { id: 'incident-analysis', label: 'AI Incident Analysis', icon: BrainCircuit, roles: ['operator', 'supervisor', 'admin'] }
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
        { id: 'traffic-evidence', label: 'Traffic Snapshots', icon: Car, roles: ['operator', 'supervisor', 'admin'] },
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

  // Handler for section header click - Accordion behavior (only one section open at a time)
  const handleSectionClick = (sectionTitle: string, firstItemId: string) => {
    // Check if this section is already expanded
    const isCurrentlyExpanded = expandedSections.has(sectionTitle);

    if (isCurrentlyExpanded) {
      // If clicking on already expanded section, collapse it
      setExpandedSections(new Set());
    } else {
      // Collapse all others and expand only this one (accordion behavior)
      setExpandedSections(new Set([sectionTitle]));
      // Defer navigation slightly to allow sidebar animation to start smoothly
      // This prevents the "stuck" feeling if the target screen is heavy to render
      setTimeout(() => {
        onNavigate(firstItemId);
      }, 10);
    }
  };

  // Check if a section is expanded
  const isSectionExpanded = (sectionTitle: string) => {
    return expandedSections.has(sectionTitle);
  };

  // Helper for item navigation with smooth transition
  const handleItemClick = (itemId: string) => {
    // Small delay to show ripple/active state before heavy render
    setTimeout(() => {
      onNavigate(itemId);
    }, 10);
  };


  const sidebarClasses = 'w-72 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-sm transition-all duration-200';

  return (
    <div className={sidebarClasses}>
      {/* Header Area */}
      <div className="px-6 py-6 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/50">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 flex items-center justify-center relative">
            <img
              src={apPoliceLogo}
              alt="AP Police Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_3px_rgba(0,0,0,0.4)] drop-shadow-[0_1px_0_rgba(255,255,255,0.5)] contrast-125 hover:scale-105 transition-transform duration-300"
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
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {filteredSections.map((section) => {
          const isExpanded = isSectionExpanded(section.title);
          const firstItemId = section.items[0]?.id || '';

          return (
            <div key={section.title} className="mb-0.5">
              {section.title && (
                <button
                  onClick={() => handleSectionClick(section.title, firstItemId)}
                  className={`flex items-center justify-between w-full px-3 py-2 mb-0.5 rounded-lg transition-all duration-200 group relative overflow-hidden ${isExpanded
                    ? 'bg-indigo-600 shadow-md shadow-indigo-900/20'
                    : 'hover:bg-slate-100/50 border border-transparent hover:border-slate-200'
                    }`}
                >
                  {/* Subtle shine effect on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}></div>

                  <p className={`text-[11px] font-bold uppercase tracking-wider leading-none transition-all duration-200 relative z-10 ${isExpanded
                    ? 'text-white'
                    : 'text-slate-500 group-hover:text-indigo-700'
                    }`}>
                    {section.title}
                  </p>
                  <ChevronDown
                    className={`w-4 h-4 transition-all duration-200 relative z-10 ${isExpanded
                      ? 'rotate-0 text-white'
                      : '-rotate-90 text-slate-400 group-hover:text-indigo-600'
                      }`}
                  />
                </button>
              )}

              {/* Collapsible section items */}
              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100 my-1' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="space-y-0.5 pl-2 pr-1">
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
                        onClick={() => handleItemClick(item.id)}
                        className={`group w-full flex items-center gap-3 px-3 py-2 text-xs font-medium transition-all duration-200 rounded-lg relative overflow-hidden ${isActive
                          ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-l-4 border-transparent hover:border-slate-300'
                          }`}
                      >
                        {/* Icon */}
                        <Icon className={`w-4 h-4 transition-all duration-200 flex-shrink-0 ${isActive
                          ? 'text-indigo-600'
                          : 'text-slate-400 group-hover:text-slate-600'
                          }`} />

                        {/* Label */}
                        <span className="flex-1 text-left tracking-tight leading-none">{item.label}</span>

                        {/* Active Indicator (Chevron) */}
                        {isActive && (
                          <ChevronRight className="w-3 h-3 text-indigo-500 relative z-10 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
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