import { FolderOpen, Lock, Download, Search, Filter } from 'lucide-react';

interface EvidenceLibraryProps {
  onNavigate: (screen: string) => void;
}

export function EvidenceLibrary({ onNavigate }: EvidenceLibraryProps) {
  const evidence = [
    { id: 'EP-2401', incident: 'INC-2401', title: 'Trespassing Evidence', clips: 4, duration: '8m 42s', status: 'Locked', date: '2024-12-03' },
    { id: 'EP-2402', incident: 'INC-2402', title: 'Theft Investigation', clips: 6, duration: '12m 15s', status: 'Locked', date: '2024-12-03' },
    { id: 'EP-2403', incident: 'INC-2403', title: 'Vandalism Case', clips: 3, duration: '5m 30s', status: 'Draft', date: '2024-12-03' },
  ];

  return (
    <div className="h-full bg-background overflow-auto">
      <div className="max-w-[1600px] mx-auto p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <button onClick={() => onNavigate('evidence-home')} className="text-muted-foreground hover:text-foreground mb-2 text-sm">
              ← Back to Evidence
            </button>
            <h1 className="text-2xl font-semibold">Evidence Library</h1>
            <p className="text-muted-foreground mt-1">Approved case evidence and timelines</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by evidence ID, incident ID, or title..."
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="px-4 py-2 rounded-lg bg-card border border-border hover:bg-accent smooth-transition flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        <div className="bg-card rounded-xl card-shadow overflow-hidden">
          <div className="divide-y divide-border">
            {evidence.map((item) => {
              const getStatusColor = (status: string) => (status === 'Locked' ? '#30D158' : '#FF9F0A');
              return (
                <div key={item.id} className="p-6 hover:bg-accent smooth-transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center">
                        <FolderOpen className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{item.id}</h3>
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"
                            style={{
                              backgroundColor: `${getStatusColor(item.status)}15`,
                              color: getStatusColor(item.status),
                            }}
                          >
                            {item.status === 'Locked' && <Lock className="h-3 w-3" />}
                            {item.status}
                          </span>
                        </div>
                        <p className="font-medium mt-1">{item.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.incident} • {item.clips} clips • {item.duration} • {item.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/70 smooth-transition text-sm font-medium">View Timeline</button>
                      {item.status === 'Locked' && (
                        <button className="px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 smooth-transition text-sm font-medium flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Export
                        </button>
                      )}
                    </div>
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

