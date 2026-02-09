import { Activity, Server, Database, Cpu, HardDrive, Wifi, AlertTriangle, CheckCircle } from 'lucide-react';

const systemMetrics = {
  servers: [
    { name: 'Command Server-1', status: 'Online', cpu: 42, memory: 68, disk: 54, uptime: '45 days', location: 'Primary DC' },
    { name: 'Command Server-2', status: 'Online', cpu: 38, memory: 62, disk: 48, uptime: '45 days', location: 'Primary DC' },
    { name: 'Analytics Server', status: 'Online', cpu: 78, memory: 84, disk: 72, uptime: '30 days', location: 'Primary DC' },
    { name: 'Backup Server', status: 'Online', cpu: 12, memory: 28, disk: 35, uptime: '60 days', location: 'Secondary DC' },
    { name: 'Storage Server-1', status: 'Warning', cpu: 24, memory: 92, disk: 88, uptime: '22 days', location: 'Primary DC' },
    { name: 'Storage Server-2', status: 'Online', cpu: 18, memory: 45, disk: 62, uptime: '22 days', location: 'Primary DC' },
  ],
  databases: [
    { name: 'Primary DB', status: 'Online', connections: 142, queries: '2.4K/sec', size: '2.8 TB', replication: 'Active' },
    { name: 'Analytics DB', status: 'Online', connections: 68, queries: '1.2K/sec', size: '4.2 TB', replication: 'Active' },
    { name: 'Archive DB', status: 'Online', connections: 24, queries: '0.3K/sec', size: '12.5 TB', replication: 'Active' },
  ],
  network: [
    { name: 'Primary Uplink', status: 'Online', bandwidth: 'GB', usage: 67, latency: '2ms', packets: '99.99%' },
    { name: 'Secondary Uplink', status: 'Online', bandwidth: '1 GB', usage: 23, latency: '3ms', packets: '99.98%' },
    { name: 'Camera Network', status: 'Online', bandwidth: '10 GB', usage: 82, latency: '1ms', packets: '99.97%' },
    { name: 'Drone Uplink', status: 'Online', bandwidth: '1 GB', usage: 34, latency: '5ms', packets: '99.95%' },
  ],
  services: [
    { name: 'RakshakAI (CCTV)', status: 'Online', load: 72, requests: '342/sec', errors: '0.01%' },
    { name: 'AerialAI (Drone)', status: 'Online', load: 45, requests: '89/sec', errors: '0.02%' },
    { name: 'VigilaSim (SOP)', status: 'Online', load: 28, requests: '67/sec', errors: '0.00%' },
    { name: 'ANPR Engine', status: 'Online', load: 64, requests: '156/sec', errors: '0.03%' },
    { name: 'Video Streaming', status: 'Warning', load: 91, requests: '1.2K/sec', errors: '0.08%' },
  ]
};

export function SystemHealth() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online': return 'text-black bg-green-100 border border-green-200';
      case 'Warning': return 'text-black bg-yellow-100 border border-yellow-200';
      case 'Critical': return 'text-black bg-red-100 border border-red-200';
      case 'Offline': return 'text-black bg-gray-100 border border-gray-200';
      default: return 'text-black bg-gray-100 border border-gray-200';
    }
  };

  const getMetricColor = (value: number) => {
    if (value < 70) return 'text-green-700';
    if (value < 85) return 'text-amber-700';
    return 'text-red-700';
  };

  const getProgressBarColor = (value: number) => {
    if (value < 70) return 'bg-green-500';
    if (value < 85) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const onlineServers = systemMetrics.servers.filter(s => s.status === 'Online').length;
  const warningServers = systemMetrics.servers.filter(s => s.status === 'Warning').length;
  const onlineServices = systemMetrics.services.filter(s => s.status === 'Online').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-black text-xl font-semibold">System Health Monitor</h2>
          <p className="text-black/60 text-sm mt-1">Real-time system performance and health metrics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-700" />
          <span className="text-green-700 font-medium">All Systems Operational</span>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-black/60 text-xs uppercase tracking-wider mb-1">Servers Online</div>
          <div className="text-black text-2xl font-semibold">{onlineServers}/{systemMetrics.servers.length}</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-black/60 text-xs uppercase tracking-wider mb-1">Databases</div>
          <div className="text-black text-2xl font-semibold">{systemMetrics.databases.length}</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-black/60 text-xs uppercase tracking-wider mb-1">Network Links</div>
          <div className="text-black text-2xl font-semibold">{systemMetrics.network.length}</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-black/60 text-xs uppercase tracking-wider mb-1">AI Services</div>
          <div className="text-black text-2xl font-semibold">{onlineServices}</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-black/60 text-xs uppercase tracking-wider mb-1">Warnings</div>
          <div className="text-red-700 text-2xl font-semibold">{warningServers}</div>
        </div>
      </div>

      {/* Servers */}
      <div className="bg-card border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-5 h-5 text-black/70" />
          <h3 className="text-black font-semibold">Server Infrastructure</h3>
        </div>
        <div className="space-y-3">
          {systemMetrics.servers.map((server, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-black font-medium">{server.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(server.status)}`}>
                    {server.status}
                  </span>
                  <span className="text-black/60 text-xs">{server.location}</span>
                </div>
                <span className="text-black/60 text-xs">Uptime: {server.uptime}</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-black/60">CPU</span>
                    <span className={`font-medium ${getMetricColor(server.cpu)}`}>{server.cpu}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div className={`h-2 rounded-full ${getProgressBarColor(server.cpu)}`} style={{ width: `${server.cpu}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-black/60">Memory</span>
                    <span className={`font-medium ${getMetricColor(server.memory)}`}>{server.memory}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div className={`h-2 rounded-full ${getProgressBarColor(server.memory)}`} style={{ width: `${server.memory}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-black/60">Disk</span>
                    <span className={`font-medium ${getMetricColor(server.disk)}`}>{server.disk}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div className={`h-2 rounded-full ${getProgressBarColor(server.disk)}`} style={{ width: `${server.disk}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Databases & Network */}
      <div className="grid grid-cols-2 gap-4">
        {/* Databases */}
        <div className="bg-card border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-black/70" />
            <h3 className="text-black font-semibold">Databases</h3>
          </div>
          <div className="space-y-3">
            {systemMetrics.databases.map((db, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-black font-medium">{db.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(db.status)}`}>
                    {db.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-black/60">Connections: <span className="text-black font-medium">{db.connections}</span></div>
                  <div className="text-black/60">Queries: <span className="text-black font-medium">{db.queries}</span></div>
                  <div className="text-black/60">Size: <span className="text-black font-medium">{db.size}</span></div>
                  <div className="text-black/60">Replication: <span className="text-green-700 font-medium">{db.replication}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network */}
        <div className="bg-card border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Wifi className="w-5 h-5 text-black/70" />
            <h3 className="text-black font-semibold">Network Status</h3>
          </div>
          <div className="space-y-3">
            {systemMetrics.network.map((net, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-black font-medium">{net.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(net.status)}`}>
                    {net.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-black/60">Bandwidth: <span className="text-black font-medium">{net.bandwidth}</span></div>
                  <div className="text-black/60">Usage: <span className={`font-medium ${getMetricColor(net.usage)}`}>{net.usage}%</span></div>
                  <div className="text-black/60">Latency: <span className="text-green-700 font-medium">{net.latency}</span></div>
                  <div className="text-black/60">Packets: <span className="text-green-700 font-medium">{net.packets}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Services */}
      <div className="bg-card border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-5 h-5 text-black/70" />
          <h3 className="text-black font-semibold">AI Services</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {systemMetrics.services.map((service, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-black font-medium">{service.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(service.status)}`}>
                  {service.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-black/60">Load: <span className={`font-medium ${getMetricColor(service.load)}`}>{service.load}%</span></div>
                <div className="text-black/60">Requests: <span className="text-black font-medium">{service.requests}</span></div>
                <div className="text-black/60">Errors: <span className="text-green-700 font-medium">{service.errors}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
