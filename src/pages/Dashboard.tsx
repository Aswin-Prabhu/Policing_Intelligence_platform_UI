import { Activity, Video, Plane, AlertTriangle, Car } from 'lucide-react';
import { mockStats, mockDrones, mockAlerts, mockANPRHits } from '../data/mockData';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  color: string;
}) => (
  <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 hover:border-[#3b82f6] transition-colors">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
    <p className="text-sm font-medium text-slate-300 mb-1">{title}</p>
    <p className="text-xs text-slate-400">{subtitle}</p>
  </div>
);

const AlertItem = ({ alert }: { alert: any }) => {
  const severityColors = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    normal: '#22c55e'
  };

  return (
    <div
      className="bg-[#1e293b] border border-[#334155] rounded-lg p-4 hover:border-[#3b82f6] transition-colors"
      style={{ borderLeftWidth: '4px', borderLeftColor: severityColors[alert.severity] }}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold text-white">{alert.type}</h4>
        <span className={`text-xs px-2 py-1 rounded uppercase font-medium`}
          style={{
            backgroundColor: `${severityColors[alert.severity]}20`,
            color: severityColors[alert.severity]
          }}>
          {alert.severity}
        </span>
      </div>
      <p className="text-xs text-slate-400 mb-1">{alert.location}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#3b82f6]">{alert.source}</span>
        <span className="text-xs text-slate-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

const DroneCard = ({ drone }: { drone: any }) => {
  const batteryColor = drone.battery > 50 ? '#22c55e' : drone.battery > 25 ? '#eab308' : '#ef4444';

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-white">{drone.id}</h4>
        <span className={`text-xs px-2 py-1 rounded ${drone.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
          {drone.status}
        </span>
      </div>
      <p className="text-xs text-slate-400 mb-3">{drone.name}</p>
      <div className="space-y-2">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400">Battery</span>
            <span className="text-xs font-medium" style={{ color: batteryColor }}>{drone.battery}%</span>
          </div>
          <div className="h-2 bg-[#0f172a] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${drone.battery}%`,
                backgroundColor: batteryColor
              }}
            ></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Pilot:</span>
          <span className="text-xs text-white">{drone.pilot}</span>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Cameras"
          value={`${mockStats.activeCameras}/${mockStats.totalCameras}`}
          subtitle="96% operational"
          icon={Video}
          color="from-[#3b82f6] to-[#1e40af]"
        />
        <StatCard
          title="Active Drone Missions"
          value={mockStats.activeDrones.toString()}
          subtitle="Real-time aerial surveillance"
          icon={Plane}
          color="from-[#22c55e] to-[#16a34a]"
        />
        <StatCard
          title="Pending Incidents"
          value={mockStats.pendingIncidents.toString()}
          subtitle="Requires attention"
          icon={AlertTriangle}
          color="from-[#f97316] to-[#ea580c]"
        />
        <StatCard
          title="Today's Violations"
          value={mockStats.todayViolations.toString()}
          subtitle="ANPR detections"
          icon={Car}
          color="from-[#eab308] to-[#ca8a04]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Live City Map</h2>
            <div className="relative h-96 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-8 grid-rows-6 gap-4 w-full h-full p-8">
                  {[...Array(48)].map((_, i) => (
                    <div
                      key={i}
                      className="relative"
                      style={{
                        animation: `pulse ${2 + Math.random() * 2}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${Math.random() > 0.1 ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`}
                        style={{
                          boxShadow: `0 0 10px ${Math.random() > 0.1 ? '#22c55e' : '#ef4444'}`
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-[#0f172a]/80 backdrop-blur-sm border border-[#334155] rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#22c55e]" />
                  <span className="text-xs text-slate-300">Live Surveillance Grid</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Active Drone Fleet</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockDrones.map((drone) => (
                <DroneCard key={drone.id} drone={drone} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Live Anomaly Alerts</h2>
              <span className="text-xs text-slate-400">{mockAlerts.length} active</span>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {mockAlerts.slice(0, 5).map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </div>
          </div>

          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Recent ANPR Hits</h2>
              <Car className="w-5 h-5 text-[#3b82f6]" />
            </div>
            <div className="space-y-3">
              {mockANPRHits.map((hit) => (
                <div key={hit.id} className="bg-[#0f172a] border border-[#334155] rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">{hit.plate}</span>
                    <span className="text-xs px-2 py-1 rounded bg-[#22c55e]/20 text-[#22c55e]">
                      {hit.confidence}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-1">{hit.vehicle}</p>
                  <span className="text-xs text-slate-500">{hit.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.8);
          }
        }
      `}</style>
    </div>
  );
}
