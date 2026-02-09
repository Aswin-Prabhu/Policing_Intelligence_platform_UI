import { AlertTriangle, Clock, CheckCircle, XCircle, TrendingUp, FileText, AlertCircle, Plus, Filter, ArrowUpRight } from 'lucide-react';
import { useMemo } from 'react';

interface AlertsHomeProps {
  onNavigate: (screen: string) => void;
  userRole: 'operator' | 'supervisor' | 'admin';
}

// Unified Static Data Source
const MOCK_INCIDENTS = [
  { id: 'INC-2401', type: 'Trespassing', severity: 'critical', status: 'Under Investigation', location: 'Zone B-7', time: '20 min ago' },
  { id: 'INC-2402', type: 'Theft Detected', severity: 'high', status: 'Awaiting Classification', location: 'City Center', time: '45 min ago' },
  { id: 'INC-2403', type: 'Vandalism', severity: 'medium', status: 'Under Investigation', location: 'Railway Station', time: '1 hour ago' },
  { id: 'INC-2404', type: 'Suspicious Activity', severity: 'low', status: 'Closed', location: 'Market Area', time: '2 hours ago' },
  { id: 'INC-2405', type: 'Crowd Gathering', severity: 'high', status: 'Open', location: 'Plaza North', time: '3 hours ago' },
  { id: 'INC-2406', type: 'Unauthorized Access', severity: 'critical', status: 'Open', location: 'Server Room', time: '4 hours ago' },
  { id: 'INC-2407', type: 'Loitering', severity: 'low', status: 'Closed', location: 'Parking Lot', time: '5 hours ago' },
  { id: 'INC-2408', type: 'Traffic Violation', severity: 'medium', status: 'Awaiting Classification', location: 'Main Gate', time: '6 hours ago' },
  { id: 'INC-2409', type: 'Fire Audit', severity: 'medium', status: 'Closed', location: 'Warehouse', time: 'Yesterday' },
  { id: 'INC-2410', type: 'Safety Protocol', severity: 'low', status: 'Closed', location: 'Lobby', time: 'Yesterday' },
  { id: 'INC-2411', type: 'Intrusion', severity: 'critical', status: 'Under Investigation', location: 'Zone A-1', time: 'Yesterday' },
  { id: 'INC-2412', type: 'Bag Left Behind', severity: 'high', status: 'Closed', location: 'Waiting Area', time: '2 days ago' },
];

export function AlertsHome({ onNavigate, userRole }: AlertsHomeProps) {

  // Dynamic Statistics Calculation
  const stats = useMemo(() => {
    return {
      total: MOCK_INCIDENTS.length,
      open: MOCK_INCIDENTS.filter(i => ['Open', 'Awaiting Classification'].includes(i.status)).length,
      investigating: MOCK_INCIDENTS.filter(i => i.status === 'Under Investigation').length,
      closed: MOCK_INCIDENTS.filter(i => i.status === 'Closed').length,
      critical: MOCK_INCIDENTS.filter(i => i.severity === 'critical').length,
      high: MOCK_INCIDENTS.filter(i => i.severity === 'high').length,
      medium: MOCK_INCIDENTS.filter(i => i.severity === 'medium').length,
      low: MOCK_INCIDENTS.filter(i => i.severity === 'low').length,
    };
  }, []);

  const statCards = [
    { label: 'Total Incidents', value: stats.total, icon: FileText, color: 'text-slate-600', bg: 'bg-slate-100' },
    { label: 'Open / Pending', value: stats.open, icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Under Investigation', value: stats.investigating, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Resolved (Closed)', value: stats.closed, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Critical Severity', value: stats.critical, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'High Severity', value: stats.high, icon: ArrowUpRight, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Medium Severity', value: stats.medium, icon: TrendingUp, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Low Severity', value: stats.low, icon: Filter, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const getQuickActions = () => {
    // ... same logic as before, just simplified for brevity if needed
    if (userRole === 'operator') {
      return [
        {
          id: 'alerts-operator',
          title: 'Validation Queue',
          description: 'Quick validation and escalation',
          icon: Clock,
          count: `${stats.open} pending`,
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
    } else {
      return [
        {
          id: 'incident-supervisor',
          title: 'Review Queue',
          description: 'Classify and manage incidents',
          icon: Clock,
          count: `${stats.open} pending`,
          gradient: 'from-orange-500/20 to-orange-600/20',
        },
      ];
    }
  };

  const quickActions = getQuickActions();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444'; // red-500
      case 'high': return '#f97316'; // orange-500
      case 'medium': return '#eab308'; // yellow-500
      case 'low': return '#22c55e'; // green-500
      default: return '#64748b'; // slate-500
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'Closed') return '#22c55e';
    if (status === 'Under Investigation') return '#f59e0b';
    if (status === 'Awaiting Classification') return '#6366f1';
    return '#64748b';
  };

  return (
    <div className="h-full bg-slate-50 overflow-auto">
      <div className="max-w-[1600px] mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Incident Management</h1>
          <p className="text-slate-500 mt-1">Centralized dashboard for AI anomalies, alerts, and reported incidents</p>
        </div>

        {/* 8 Stats Cards Grid */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Incident Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bg}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => onNavigate(action.id === 'incident-operator' ? 'incident-operator-create' : action.id)}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all text-left group"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-slate-700" />
                  </div>
                  <h3 className="font-semibold text-slate-800">{action.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{action.description}</p>
                  <p className="text-xs font-medium text-indigo-600 mt-3">{action.count}</p>
                </button>
              );
            })}
            <button onClick={() => onNavigate('all-incidents')} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-orange-300 transition-all text-left group">
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-slate-800">All Incidents</h3>
              <p className="text-sm text-slate-500 mt-1">Complete incident history</p>
              <p className="text-xs font-medium text-orange-600 mt-3">View all</p>
            </button>
          </div>
        </div>

        {/* Unified Incident List */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-800">Recent Incidents & Alerts</h2>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">{stats.total} Records</span>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_INCIDENTS.map((incident) => (
              <button
                key={incident.id}
                onClick={() => {
                  if (userRole === 'operator') onNavigate('incident-operator');
                  else onNavigate('incident-supervisor');
                }}
                className="w-full p-4 hover:bg-slate-50 transition-colors text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-100 group-hover:bg-white border border-slate-200 group-hover:border-indigo-200 transition-colors">
                      <FileText className="h-5 w-5 text-slate-500 group-hover:text-indigo-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800 text-sm">{incident.id}</h3>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            backgroundColor: `${getSeverityColor(incident.severity)}15`,
                            color: getSeverityColor(incident.severity),
                          }}
                        >
                          {incident.severity}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">{incident.type} • <span className="text-slate-400">{incident.location}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium border"
                      style={{
                        backgroundColor: `${getStatusColor(incident.status)}10`,
                        color: getStatusColor(incident.status),
                        borderColor: `${getStatusColor(incident.status)}30`
                      }}
                    >
                      {incident.status}
                    </span>
                    <span className="text-xs text-slate-400 w-24 text-right font-mono">{incident.time}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

