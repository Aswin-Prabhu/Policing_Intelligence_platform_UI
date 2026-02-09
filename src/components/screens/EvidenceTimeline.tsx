import { useEffect } from 'react';

interface EvidenceTimelineProps {
  onViewSync: () => void;
  onNavigate?: (screen: string) => void;
}

// Router shim to redirect legacy timeline entry points to the new Evidence Console
export function EvidenceTimeline({ onViewSync, onNavigate }: EvidenceTimelineProps) {
  useEffect(() => {
    if (onNavigate) {
      onNavigate('evidence-console');
    } else {
      onViewSync();
    }
  }, [onNavigate, onViewSync]);

  return (
    <div className="p-6 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-pulse mb-4">
          <div className="w-16 h-16 bg-cyan-500/20 rounded-full mx-auto flex items-center justify-center">
            <div className="w-8 h-8 bg-cyan-500/40 rounded-full" />
          </div>
        </div>
        <p className="text-white">Loading Evidence Console...</p>
      </div>
    </div>
  );
}
