import { Bell, User, Search, Grid2x2, Grid3x3, LayoutGrid } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import UserMenuDropdown from './UserMenuDropdown';
import SessionHistoryModal from './SessionHistoryModal';

interface TopBarProps {
  activeScreen: string;
  gridSize?: '2x2' | '3x3' | '4x4';
  onGridSizeChange?: (size: '2x2' | '3x3' | '4x4') => void;
  onNavigate: (screen: string) => void;
  userRole: 'operator' | 'supervisor' | 'admin';
  username: string;
  name: string;          // Full officer name
  userId: string;
  onLogout: () => void;
}

export function TopBar({
  activeScreen,
  gridSize,
  onGridSizeChange,
  onNavigate,
  userRole,
  username,
  name,
  userId,
  onLogout,
}: TopBarProps) {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTitle = () => {
    const titles: Record<string, string> = {
      dashboard: 'Command Dashboard',
      'surveillance-grid': 'Live Surveillance',
      'cross-camera-tracking': 'Cross-Camera Tracking',
      'surveillance-multigrid-2x2': 'Multi-Grid View (2×2)',
      'surveillance-multigrid-3x3': 'Multi-Grid View (3×3)',
      'surveillance-multigrid-4x4': 'Multi-Grid View (4×4)',
      'camera-detail': 'Camera Detail',
      'bodycam-grid': 'Bodycam Monitoring',
      'bodycam-detail': 'Officer Bodycam',
      'alerts-home': 'Incident Overview',
      alerts: 'Alerts',
      'alerts-operator': 'Alerts – Operator',
      'alerts-supervisor': 'Alerts – Supervisor',
      'alerts-admin': 'Alerts – Admin Analytics',
      'anpr-home': 'ANPR Overview',
      'anpr-list': 'Traffic Violations',
      'anpr-detail': 'Violation Detail',
      'anpr-approval': 'ANPR Approval',
      'anpr-operator': 'ANPR Operator Queue',
      'anpr-supervisor-queue': 'Supervisor Escalation Queue',
      sop: 'SOP Compliance',
      'incidents-home': 'Incidents',
      'incidents-list': 'Incident Management',
      'incident-detail': 'Incident Detail',
      'incident-operator': 'Incident – Operator',
      'incident-operator-create': 'Incident – Operator',
      'incident-supervisor': 'Incident – Supervisor',
      'detection-log': 'Detection Log',
      'detection-boundingbox': 'Bounding Box Review',
      'plate-correction': 'Plate Text Correction',
      'evidence-timeline': 'Evidence Console',
      'evidence-home': 'Evidence',
      'evidence-console': 'Evidence Console',
      'evidence-export': 'Evidence Export',
      'evidence-sync': 'Multi-Camera Sync',
      'footage-library': 'Footage Library',
      'evidence-library': 'Evidence Library',
      'explainability-home': 'Explainability',
      'explainability-simplified': 'Explainability',
      'explainability-dag': 'AI Decision Trace',
      'explainability-logs': 'AI Decision Logs',
      'analytics-home': 'Analytics Dashboard',
      'analytics-camera-health': 'Camera Health Analytics',
      'analytics-violations': 'Violation Trends',
      'admin-cameras': 'Camera Registry',
      'admin-users': 'User Management',
      'admin-system': 'System Health',
      'admin-models': 'AI Model Manager',
    };
    return titles[activeScreen] || 'Dashboard';
  };

  const showGridControls = activeScreen.startsWith('surveillance');

  const getRoleLabel = () => {
    switch (userRole) {
      case 'operator': return 'CCO';
      case 'supervisor': return 'Supervisor';
      case 'admin': return 'Administrator';
    }
  };

  return (
    <>
      <div className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm/50 transition-all">

        {/* LEFT SECTION - Title */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            {/* <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Current View</div> */}
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">{getTitle()}</h2>
          </div>

          {/* Grid Controls */}
          {showGridControls && (
            <div className="flex items-center gap-1 ml-4 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => { onGridSizeChange?.('2x2'); onNavigate('surveillance-multigrid-2x2'); }}
                className={`p-2 rounded-md transition-all ${gridSize === '2x2' || activeScreen === 'surveillance-multigrid-2x2' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="2x2 Grid"
              >
                <Grid2x2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => { onGridSizeChange?.('3x3'); onNavigate('surveillance-multigrid-3x3'); }}
                className={`p-2 rounded-md transition-all ${gridSize === '3x3' || activeScreen === 'surveillance-multigrid-3x3' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="3x3 Grid"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => { onGridSizeChange?.('4x4'); onNavigate('surveillance-multigrid-4x4'); }}
                className={`p-2 rounded-md transition-all ${gridSize === '4x4' || activeScreen === 'surveillance-multigrid-4x4' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="4x4 Grid"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-5">

          {/* Search Box */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search cameras, vehicles, alerts..."
              className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all w-72 shadow-sm"
            />
          </div>

          <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-full hover:bg-slate-50 transition-colors text-slate-500 hover:text-indigo-600 border border-transparent hover:border-slate-100">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>
          </button>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 pl-1 pr-3 py-1 bg-white border border-slate-200 rounded-full cursor-pointer hover:bg-slate-50 hover:shadow-md transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 flex items-center justify-center border-2 border-white shadow-sm group-hover:from-indigo-100 group-hover:to-indigo-200">
                <User className="w-4 h-4 text-slate-600 group-hover:text-indigo-700" />
              </div>
              <div className="flex flex-col items-start mr-1">
                <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">{username}</span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide group-hover:text-indigo-500">{getRoleLabel()}</span>
              </div>
              {/* <ChevronDown className="w-3 h-3 text-slate-400" /> */}
            </button>

            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 transform origin-top-right transition-all z-50">
                <UserMenuDropdown
                  role={getRoleLabel()!}
                  userId={userId}
                  username={username}
                  name={name}
                  onLogout={onLogout}
                  onOpenHistory={() => {
                    setIsHistoryOpen(true);
                    setIsMenuOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SESSION HISTORY MODAL */}
      {isHistoryOpen && (
        <SessionHistoryModal
          role={getRoleLabel()!}
          userId={userId}
          username={username}
          onClose={() => setIsHistoryOpen(false)}
          onViewFullHistory={() => {
            setIsHistoryOpen(false);
            onNavigate('session-history-full');
          }}
        />
      )}
    </>
  );
}

