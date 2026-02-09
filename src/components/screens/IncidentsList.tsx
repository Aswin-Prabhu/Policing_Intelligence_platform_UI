import { useEffect } from 'react';

interface IncidentsListProps {
  onViewDetail: () => void;
  userRole: 'operator' | 'supervisor' | 'admin';
  onNavigate?: (screen: string) => void;
}

export function IncidentsList({ onViewDetail, userRole, onNavigate }: IncidentsListProps) {
  useEffect(() => {
    if (onNavigate) {
      if (userRole === 'operator') {
        onNavigate('incident-operator');
      } else if (userRole === 'supervisor') {
        onNavigate('incident-supervisor');
      } else if (userRole === 'admin') {
        onNavigate('incident-supervisor');
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
        <p className="text-white">Loading incident management...</p>
      </div>
    </div>
  );
}
