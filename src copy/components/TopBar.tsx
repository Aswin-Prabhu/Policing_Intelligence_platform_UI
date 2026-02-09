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
      <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">

        {/* LEFT SECTION - Title */}
        <div className="flex items-center gap-4">
          <h2 className="text-white">{getTitle()}</h2>

          {/* Grid Controls */}
          {showGridControls && (
            <div className="flex items-center gap-2 ml-6">
              <span className="text-xs text-gray-500">Grid Size:</span>
              <button
                onClick={() => { onGridSizeChange?.('2x2'); onNavigate('surveillance-multigrid-2x2'); }}
                className={`p-2 rounded transition-colors ${gridSize === '2x2' || activeScreen === 'surveillance-multigrid-2x2' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <Grid2x2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => { onGridSizeChange?.('3x3'); onNavigate('surveillance-multigrid-3x3'); }}
                className={`p-2 rounded transition-colors ${gridSize === '3x3' || activeScreen === 'surveillance-multigrid-3x3' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => { onGridSizeChange?.('4x4'); onNavigate('surveillance-multigrid-4x4'); }}
                className={`p-2 rounded transition-colors ${gridSize === '4x4' || activeScreen === 'surveillance-multigrid-4x4' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">

          {/* Search Box */}
          <div className="flex items-center gap-2 px-4 py-2 bg-grey border border-border rounded-lg">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search cameras, incidents..."
              className="bg-transparent text-sm text-white placeholder-gray-900 outline-none w-64"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <div
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-grey border border-border rounded-lg cursor-pointer hover:bg-white/5"
            >
              <User className="w-5 h-5 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-sm text-gray-300">{getRoleLabel()}</span>
                <span className="text-xs text-gray-400">{username}</span>
              </div>
            </div>

            {isMenuOpen && (
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
        />
      )}
    </>
  );
}

