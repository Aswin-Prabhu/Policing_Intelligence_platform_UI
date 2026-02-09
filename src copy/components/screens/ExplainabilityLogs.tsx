import { useEffect } from 'react';

interface ExplainabilityLogsProps {
  onNavigate?: (screen: string) => void;
}

export function ExplainabilityLogs({ onNavigate }: ExplainabilityLogsProps = {}) {
  useEffect(() => {
    if (onNavigate) {
      onNavigate('explainability-simplified');
    }
  }, [onNavigate]);

  return (
    <div className="p-6 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-pulse mb-4">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full mx-auto flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-500/40 rounded-full"></div>
          </div>
        </div>
        <p className="text-white">Loading Explainability & Audit Trail...</p>
      </div>
    </div>
  );
}
