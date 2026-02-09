import { Car, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface ANPRHomeProps {
  onNavigate: (screen: string) => void;
  userRole: 'operator' | 'supervisor' | 'admin';
}

export function ANPRHome({ onNavigate, userRole }: ANPRHomeProps) {
  const stats = [
    {
      id: "detections_today",
      label: "ANPR Detections",
      subLabel: "Today",
      value: 2341,
      change: "+182",
      changeType: "increase",
      icon: Car,
      color: "blue"
    },
    {
      id: "violations_detected",
      label: "Violations Generated",
      subLabel: "Today",
      value: 87,
      change: "+12",
      changeType: "increase",
      icon: AlertTriangle,
      color: "orange"
    },
    {
      id: "pending_review",
      label: "Pending Review",
      subLabel: "Action Required",
      value: 23,
      change: "+5",
      changeType: "increase",
      icon: Clock,
      color: "amber",
      priority: true
    },
    {
      id: "critical_alerts",
      label: "Critical Alerts",
      subLabel: "Stolen / Blacklist",
      value: 8,
      change: "+2",
      changeType: "increase",
      icon: AlertTriangle,
      color: "red",
      priority: true
    },
    {
      id: "verified_cases",
      label: "Verified",
      subLabel: "Approved by Officers",
      value: 180,
      change: "+75",
      changeType: "increase",
      icon: CheckCircle,
      color: "green"
    },
    {
      id: "rejected_cases",
      label: "Rejected",
      subLabel: "False Positives",
      value: 14,
      change: "-3",
      changeType: "decrease",
      icon: AlertTriangle,
      color: "gray"
    },
    {
      id: "challans_issued",
      label: "Challans Issued",
      subLabel: "Completed",
      value: 156,
      change: "+48",
      changeType: "increase",
      icon: CheckCircle,
      color: "green"
    }
  ];

  const quickActions =
    userRole === 'operator'
      ? [
          {
            id: 'anpr-operator',
            title: 'Validation Queue',
            description: 'Review low/medium severity violations',
            icon: Clock,
            count: '23 pending',
            gradient: 'from-cyan-500/20 to-cyan-600/20',
          },
        ]
      : [
          {
            id: 'anpr-supervisor-queue',
            title: 'Approval Queue',
            description: 'High/critical violations requiring approval',
            icon: AlertTriangle,
            count: '8 pending',
            gradient: 'from-green-500/20 to-green-600/20',
          },
        ];

  return (
    <div className="h-full bg-background overflow-auto">
      <div className="max-w-[1600px] mx-auto p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Traffic Violation Management</h1>
          <p className="text-muted-foreground mt-1">
            Automatic Number Plate Recognition and violation management
          </p>
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
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">{stat.change}</span>
                      <span className="text-xs text-muted-foreground ml-1">today</span>
                    </div>
                  </div>
                  <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onNavigate(action.id)}
                className="bg-card rounded-xl p-6 card-shadow hover-elevate smooth-transition text-left"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">{action.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                <p className="text-xs text-muted-foreground mt-3">{action.count}</p>
              </button>
            );
          })}

          <button
            onClick={() => onNavigate('anpr-list')}
            className="bg-card rounded-xl p-6 card-shadow hover-elevate smooth-transition text-left"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4">
              <Car className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="font-semibold">All Detections</h3>
            <p className="text-sm text-muted-foreground mt-1">View complete ANPR feed</p>
            <p className="text-xs text-muted-foreground mt-3">2,341 today</p>
          </button>

          <button className="bg-card rounded-xl p-6 card-shadow hover-elevate smooth-transition text-left">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="font-semibold">Violation Trends</h3>
            <p className="text-sm text-muted-foreground mt-1">Analytics and patterns</p>
            <p className="text-xs text-muted-foreground mt-3">87 today</p>
          </button>
        </div>

        <div className="bg-card rounded-xl card-shadow overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-semibold">Recent Detections</h2>
          </div>
          <div className="divide-y divide-border">
            {[
              { plate: 'AP39Z9876', type: 'Stolen Vehicle', severity: 'critical', time: '2 min ago' },
              { plate: 'TS12AB3456', type: 'Red Light Violation', severity: 'high', time: '5 min ago' },
              { plate: 'KA05CD7890', type: 'Overspeeding', severity: 'medium', time: '8 min ago' },
              { plate: 'TN09EF1234', type: 'Wrong Way', severity: 'high', time: '12 min ago' },
              { plate: 'AP01GH5678', type: 'Parking Violation', severity: 'low', time: '15 min ago' },
            ].map((detection, idx) => {
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
                  onClick={() => onNavigate('anpr-detail')}
                  className="w-full p-6 hover:bg-accent smooth-transition text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-secondary rounded-lg flex items-center justify-center">
                        <span className="text-xs font-mono font-bold">{detection.plate}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{detection.plate}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{detection.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${getSeverityColor(detection.severity)}15`,
                          color: getSeverityColor(detection.severity),
                        }}
                      >
                        {detection.severity}
                      </span>
                      <span className="text-sm text-muted-foreground">{detection.time}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

