import { Download, FileText, Lock, Calendar } from 'lucide-react';

interface EvidenceExportProps {
  onNavigate: (screen: string) => void;
}

export function EvidenceExport({ onNavigate }: EvidenceExportProps) {
  const exports = [
    { id: 'EXP-001', evidence: 'EP-2401', incident: 'INC-2401', status: 'Completed', date: '2024-12-03 14:30', size: '2.4 GB' },
    { id: 'EXP-002', evidence: 'EP-2402', incident: 'INC-2402', status: 'Processing', date: '2024-12-03 13:15', size: '3.1 GB' },
    { id: 'EXP-003', evidence: 'EP-2403', incident: 'INC-2403', status: 'Completed', date: '2024-12-03 11:45', size: '1.8 GB' },
  ];

  return (
    <div className="h-full bg-background overflow-auto">
      <div className="max-w-[1600px] mx-auto p-8 space-y-6">
        <div>
          <button onClick={() => onNavigate('evidence-home')} className="text-muted-foreground hover:text-foreground mb-2 text-sm">
            ← Back to Evidence
          </button>
          <h1 className="text-2xl font-semibold">Export Manager</h1>
          <p className="text-muted-foreground mt-1">Generate and download evidence packages</p>
        </div>

        <div className="bg-card rounded-xl card-shadow overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-semibold">Export History</h2>
          </div>

          <div className="divide-y divide-border">
            {exports.map((exp) => {
              const getStatusColor = (status: string) => {
                if (status === 'Completed') return '#30D158';
                if (status === 'Processing') return '#FF9F0A';
                return '#98989D';
              };

              return (
                <div key={exp.id} className="p-6 hover:bg-accent smooth-transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{exp.id}</h3>
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${getStatusColor(exp.status)}15`,
                              color: getStatusColor(exp.status),
                            }}
                          >
                            {exp.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {exp.evidence} • {exp.incident} • {exp.size}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {exp.date}
                        </p>
                      </div>
                    </div>

                    {exp.status === 'Completed' && (
                      <button className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-500/90 text-white smooth-transition text-sm font-medium flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

