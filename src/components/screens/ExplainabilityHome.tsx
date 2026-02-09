import { GitBranch, FileText, Search, TrendingUp } from 'lucide-react';

interface ExplainabilityHomeProps {
  onNavigate: (screen: string) => void;
}

export function ExplainabilityHome({ onNavigate }: ExplainabilityHomeProps) {
  const stats = [
    { label: 'Total Decisions', value: '2,341', icon: GitBranch },
    { label: 'Human Overrides', value: '87', icon: FileText },
    { label: 'Audit Trails', value: '2,341', icon: FileText },
    { label: 'Avg Confidence', value: '88.4%', icon: TrendingUp },
  ];

  return (
    <div className="h-full bg-background overflow-auto">
      <div className="max-w-[1600px] mx-auto p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Explainability & Audit</h1>
          <p className="text-muted-foreground mt-1">AI decision transparency and human audit trails</p>
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
                  </div>
                  <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => onNavigate('explainability-simplified')} className="bg-card rounded-xl p-6 card-shadow hover-elevate smooth-transition text-left">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4">
              <GitBranch className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="font-semibold">AI Decision Trail</h3>
            <p className="text-sm text-muted-foreground mt-1">How AI made each decision - simplified for police users</p>
            <p className="text-xs text-muted-foreground mt-3">View decisions</p>
          </button>

          <button onClick={() => onNavigate('explainability-simplified')} className="bg-card rounded-xl p-6 card-shadow hover-elevate smooth-transition text-left">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="font-semibold">Human Audit Trail</h3>
            <p className="text-sm text-muted-foreground mt-1">Complete activity log of who did what, when, and why</p>
            <p className="text-xs text-muted-foreground mt-3">View audit logs</p>
          </button>
        </div>

        <div className="bg-card rounded-xl p-6 card-shadow">
          <h2 className="font-semibold mb-4">How Explainability Works</h2>
          <div className="space-y-4">
            {[
              {
                step: 1,
                color: 'blue',
                title: 'AI Decision Trail',
                desc: 'See what inputs the AI used, signals it detected, and how it arrived at its confidence score and decision.',
              },
              {
                step: 2,
                color: 'purple',
                title: 'Human Review Steps',
                desc: 'Track every action taken by operators and supervisors including validations, escalations, overrides, and approvals.',
              },
              {
                step: 3,
                color: 'green',
                title: 'Override Justifications',
                desc: 'When humans override AI decisions, capture full rationale and compare AI vs human judgment.',
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full bg-${item.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-sm font-semibold text-${item.color}-500`}>{item.step}</span>
                </div>
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by alert ID, incident ID, or user..."
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
    </div>
  );
}

