import { useEffect } from 'react';

interface AlertsProps {
  userRole: 'operator' | 'supervisor' | 'admin';
  onNavigate?: (screen: string) => void;
}

export function Alerts({ userRole, onNavigate }: AlertsProps) {
  useEffect(() => {
    if (onNavigate) {
      if (userRole === 'operator') {
        onNavigate('alerts-operator');
      } else if (userRole === 'supervisor') {
        onNavigate('alerts-supervisor');
      } else if (userRole === 'admin') {
        onNavigate('alerts-admin');
      }
    }
  }, [userRole, onNavigate]);

  return (
    <div className="p-6 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-pulse mb-4">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full mx-auto flex items-center justify-center">
            <div className="w-8 h-8 bg-orange-500/40 rounded-full"></div>
          </div>
        </div>
        <p className="text-white">Loading role-specific alert view...</p>
      </div>
    </div>
  );
}
