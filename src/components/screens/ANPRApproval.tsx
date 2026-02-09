import { useEffect } from 'react';

interface ANPRApprovalProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  userRole: 'operator' | 'supervisor' | 'admin';
}

export function ANPRApproval({ onBack, onNavigate, userRole }: ANPRApprovalProps) {
  useEffect(() => {
    if (userRole === 'operator') {
      onNavigate('anpr-operator');
    } else if (userRole === 'supervisor' || userRole === 'admin') {
      onNavigate('anpr-supervisor-queue');
    }
  }, [userRole, onNavigate]);

  return (
    <div className="p-6 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-pulse mb-4">
          <div className="w-16 h-16 bg-cyan-500/20 rounded-full mx-auto flex items-center justify-center">
            <div className="w-8 h-8 bg-cyan-500/40 rounded-full" />
          </div>
        </div>
        <p className="text-white">Redirecting to your role-specific view...</p>
        <button onClick={onBack} className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm underline">
          Go back
        </button>
      </div>
    </div>
  );
}