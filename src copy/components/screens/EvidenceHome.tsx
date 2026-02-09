import { FolderOpen, Film, Lock, Download, Clock, CheckCircle } from 'lucide-react';

interface EvidenceHomeProps {
  onNavigate: (screen: string) => void;
  userRole: 'operator' | 'supervisor' | 'admin';
}

export function EvidenceHome({ onNavigate, userRole }: EvidenceHomeProps) {
  const stats = [
    { label: 'Raw Footage', value: '1,234', change: '+87', icon: Film },
    { label: 'Case Evidence', value: '234', change: '+12', icon: FolderOpen },
    { label: 'Locked Evidence', value: '156', change: '+8', icon: Lock },
    { label: 'Exported Today', value: '23', change: '+5', icon: Download },
  ];

  const modules = [
    { id: 'footage-library', title: 'Footage Library', description: 'Raw camera recordings', icon: Film, count: '1,234 clips', gradient: 'from-blue-500/20 to-blue-600/20', supervisorOnly: false },
    { id: 'evidence-library', title: 'Evidence Library', description: 'Approved case evidence', icon: FolderOpen, count: '234 items', gradient: 'from-purple-500/20 to-purple-600/20', supervisorOnly: false },
    {
      id: 'evidence-console',
      title: 'Evidence Console',
      description: 'Build multi-camera timelines',
      icon: Clock,
      count: userRole === 'operator' ? 'View only' : 'Create timeline',
      gradient: 'from-green-500/20 to-green-600/20',
      supervisorOnly: false,
    },
    {
      id: 'evidence-export',
      title: 'Export Manager',
      description: 'Generate evidence packages',
      icon: Download,
      count: '23 today',
      gradient: 'from-yellow-500/20 to-yellow-600/20',
      supervisorOnly: true,
    },
  ];

  const filteredModules = modules.filter((m) => !m.supervisorOnly || userRole !== 'operator');

  return (
    <div className="h-full bg-background overflow-auto">
      <div className="max-w-[1600px] mx-auto p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Evidence</h1>
          <p className="text-muted-foreground mt-1">Footage management and evidence timeline building</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-card rounded-xl p-6 card-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-semibold mt-2">{stat.value}</p>
                    <p className="text-sm text-green-500 mt-1">+{stat.change} today</p>
                  </div>
                  <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredModules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => onNavigate(module.id)}
                className="bg-card rounded-xl p-6 card-shadow hover-elevate smooth-transition text-left"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${module.gradient} flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">{module.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                <p className="text-xs text-muted-foreground mt-3">{module.count}</p>
              </button>
            );
          })}
        </div>

        <div className="bg-card rounded-xl p-6 card-shadow">
          <h2 className="font-semibold mb-4">Evidence Workflow</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { step: 1, title: 'Footage Library', desc: 'Browse raw recordings', color: 'blue' },
              { step: 2, title: 'Evidence Console', desc: 'Build multi-camera timeline', color: 'green' },
              { step: 3, title: 'Lock Evidence', desc: 'Finalize and lock timeline', color: 'purple' },
              { step: 4, title: 'Export Package', desc: 'Generate evidence file', color: 'yellow' },
            ].map((stage) => (
              <div key={stage.step} className="text-center">
                <div className={`w-12 h-12 rounded-full bg-${stage.color}-500/20 flex items-center justify-center mx-auto mb-3`}>
                  <span className={`text-lg font-semibold text-${stage.color}-500`}>{stage.step}</span>
                </div>
                <h4 className="font-medium text-sm">{stage.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl card-shadow overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-semibold">Recent Evidence Packages</h2>
          </div>

          <div className="divide-y divide-border">
            {[
              { id: 'EP-2401', incident: 'INC-2401', clips: 4, duration: '8m 42s', status: 'Locked', time: '2 hours ago' },
              { id: 'EP-2402', incident: 'INC-2402', clips: 6, duration: '12m 15s', status: 'Locked', time: '4 hours ago' },
              { id: 'EP-2403', incident: 'INC-2403', clips: 3, duration: '5m 30s', status: 'Draft', time: '6 hours ago' },
            ].map((evidence) => {
              const getStatusColor = (status: string) => (status === 'Locked' ? '#30D158' : '#FF9F0A');
              return (
                <div key={evidence.id} className="p-6 hover:bg-accent smooth-transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                        <FolderOpen className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{evidence.id}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {evidence.incident} • {evidence.clips} clips • {evidence.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${getStatusColor(evidence.status)}15`,
                          color: getStatusColor(evidence.status),
                        }}
                      >
                        {evidence.status === 'Locked' && <Lock className="h-3 w-3 inline mr-1" />}
                        {evidence.status}
                      </span>
                      <span className="text-sm text-muted-foreground w-24 text-right">{evidence.time}</span>
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

