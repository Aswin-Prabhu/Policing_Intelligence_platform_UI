import { AlertTriangle, Clock, CheckCircle, XCircle, TrendingUp, FileText, AlertCircle, Plus } from 'lucide-react';

interface AlertsHomeProps {
  onNavigate: (screen: string) => void;
  userRole: 'operator' | 'supervisor' | 'admin';
}

export function AlertsHome({ onNavigate, userRole }: AlertsHomeProps) {
  const alertStats = [
    { label: 'Active Alerts', value: '12', change: '-5', icon: AlertTriangle },
    { label: 'Pending Review', value: '8', change: '+2', icon: Clock },
    { label: 'Resolved Today', value: '47', change: '+12', icon: CheckCircle },
    { label: 'False Positives', value: '15', change: '-3', icon: XCircle },
  ];

  const incidentStats = [
    { label: 'Total Open', value: '8', change: '+2', icon: FileText },
    { label: 'Awaiting Classification', value: '3', change: '+1', icon: Clock },
    { label: 'Under Investigation', value: '5', change: '+1', icon: AlertCircle },
    { label: 'Closed Today', value: '12', change: '+4', icon: CheckCircle },
  ];

  const getQuickActions = () => {
    if (userRole === 'operator') {
      return [
        {
          id: 'alerts-operator',
          title: 'Validation Queue',
          description: 'Quick validation and escalation',
          icon: Clock,
          count: '8 pending',
          gradient: 'from-cyan-500/20 to-cyan-600/20',
        },
        {
          id: 'incident-operator',
          title: 'Create Incident',
          description: 'Document and escalate new incidents',
          icon: Plus,
          count: 'New incident',
          gradient: 'from-orange-500/20 to-orange-600/20',
        },
      ];
    } else if (userRole === 'supervisor') {
      return [
        {
          id: 'alerts-supervisor',
          title: 'Supervisor Review',
          description: 'Approve or override AI decisions',
          icon: AlertTriangle,
          count: '5 escalated',
          gradient: 'from-green-500/20 to-green-600/20',
        },
        {
          id: 'incident-supervisor',
          title: 'Review Queue',
          description: 'Classify and manage incidents',
          icon: Clock,
          count: '3 pending',
          gradient: 'from-orange-500/20 to-orange-600/20',
        },
      ];
    }
    return [
      {
        id: 'incident-supervisor',
        title: 'Review Queue',
        description: 'Classify and manage incidents',
        icon: Clock,
        count: '3 pending',
        gradient: 'from-orange-500/20 to-orange-600/20',
      },
    ];
  };

  const quickActions = getQuickActions();

  return (
    <div className="h-full bg-background overflow-auto">
      <div className="max-w-[1600px] mx-auto p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Incident Management</h1>
          <p className="text-muted-foreground mt-1">AI anomaly detection and alert management</p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Alert Statistics</h3>
            <div className="grid grid-cols-4 gap-4">
              {alertStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-card rounded-xl p-6 card-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-semibold mt-2">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-500">{stat.change}</span>
                        </div>
                      </div>
                      <Icon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Incident Statistics</h3>
            <div className="grid grid-cols-4 gap-4">
              {incidentStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-card rounded-xl p-6 card-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-semibold mt-2">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-500">{stat.change}</span>
                        </div>
                      </div>
                      <Icon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onNavigate(action.id === 'incident-operator' ? 'incident-operator-create' : action.id)}
                className="bg-card rounded-xl p-6 card-shadow hover-elevate smooth-transition text-left"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">{action.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                <p className="text-xs text-muted-foreground mt-3">{action.count}</p>
              </button>
            );
          })}

         
          <button onClick={() => onNavigate('all-incidents')} className="bg-card rounded-xl p-6 card-shadow hover-elevate smooth-transition text-left">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="font-semibold">All Incidents</h3>
            <p className="text-sm text-muted-foreground mt-1">Complete incident history</p>
            <p className="text-xs text-muted-foreground mt-3">View all</p>
          </button>

          <button onClick={() => onNavigate('evidence-home')} className="bg-card rounded-xl p-6 card-shadow hover-elevate smooth-transition text-left">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="font-semibold">Evidence Console</h3>
            <p className="text-sm text-muted-foreground mt-1">Build evidence timelines</p>
            <p className="text-xs text-muted-foreground mt-3">View console</p>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-card rounded-xl card-shadow overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-semibold">Recent Alerts</h2>
            </div>
            <div className="divide-y divide-border">
              {[
                { type: 'Intrusion', location: 'Zone B-7', severity: 'critical', confidence: 94, time: '2 min ago' },
                { type: 'Crowd Gathering', location: 'City Center', severity: 'high', confidence: 88, time: '5 min ago' },
                { type: 'Abandoned Object', location: 'Railway Station', severity: 'medium', confidence: 76, time: '8 min ago' },
                { type: 'Loitering', location: 'Market Area', severity: 'low', confidence: 82, time: '12 min ago' },
              ].map((alert, idx) => {
                const getSeverityColor = (severity: string) => {
                  switch (severity) {
                    case 'critical':
                      return '#FF453A';
                    case 'high':
                      return '#FF9F0A';
                    case 'medium':
                      return '#FFD60A';
                    case 'low':
                      return '#30D158';
                    default:
                      return '#98989D';
                  }
                };
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (userRole === 'operator') onNavigate('alerts-operator');
                      else if (userRole === 'supervisor') onNavigate('alerts-supervisor');
                      else onNavigate('alerts-admin');
                    }}
                    className="w-full p-6 hover:bg-accent smooth-transition text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${getSeverityColor(alert.severity)}15` }}
                        >
                          <AlertTriangle className="h-6 w-6" style={{ color: getSeverityColor(alert.severity) }} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{alert.type}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{alert.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">AI Confidence</p>
                          <p className="font-semibold mt-1">{alert.confidence}%</p>
                        </div>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${getSeverityColor(alert.severity)}15`,
                            color: getSeverityColor(alert.severity),
                          }}
                        >
                          {alert.severity}
                        </span>
                        <span className="text-sm text-muted-foreground w-20 text-right">{alert.time}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-card rounded-xl card-shadow overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-semibold">Recent Incidents</h2>
            </div>
            <div className="divide-y divide-border">
              {[
                { id: 'INC-2401', type: 'Trespassing', severity: 'high', status: 'Under Investigation', time: '2 hours ago' },
                { id: 'INC-2402', type: 'Theft', severity: 'critical', status: 'Awaiting Classification', time: '4 hours ago' },
                { id: 'INC-2403', type: 'Vandalism', severity: 'medium', status: 'Under Investigation', time: '6 hours ago' },
                { id: 'INC-2404', type: 'Suspicious Activity', severity: 'low', status: 'Closed', time: '8 hours ago' },
              ].map((incident) => {
                const getSeverityColor = (severity: string) => {
                  switch (severity) {
                    case 'critical':
                      return '#FF453A';
                    case 'high':
                      return '#FF9F0A';
                    case 'medium':
                      return '#FFD60A';
                    case 'low':
                      return '#30D158';
                    default:
                      return '#98989D';
                  }
                };

                const getStatusColor = (status: string) => {
                  if (status === 'Closed') return '#30D158';
                  if (status === 'Under Investigation') return '#FF9F0A';
                  return '#98989D';
                };

                return (
                  <button
                    key={incident.id}
                    onClick={() => {
                      if (userRole === 'operator') onNavigate('incident-operator');
                      else onNavigate('incident-supervisor');
                    }}
                    className="w-full p-6 hover:bg-accent smooth-transition text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${getSeverityColor(incident.severity)}15` }}>
                          <FileText className="h-6 w-6" style={{ color: getSeverityColor(incident.severity) }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{incident.id}</h3>
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${getSeverityColor(incident.severity)}15`,
                                color: getSeverityColor(incident.severity),
                              }}
                            >
                              {incident.severity}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{incident.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${getStatusColor(incident.status)}15`,
                            color: getStatusColor(incident.status),
                          }}
                        >
                          {incident.status}
                        </span>
                        <span className="text-sm text-muted-foreground w-24 text-right">{incident.time}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

