import { Cpu, Play, Pause, RefreshCw, Settings, TrendingUp, Activity, AlertTriangle } from 'lucide-react';

const mockAIModels = [
  {
    name: 'RakshakAI',
    version: 'v2.4.1',
    type: 'CCTV Anomaly Detection',
    status: 'Active',
    accuracy: 94.2,
    latency: '45ms',
    throughput: '342 frames/sec',
    uptime: '45 days',
    lastUpdated: '2024-10-15',
    detections: {
      total: 15234,
      validated: 14456,
      rejected: 778
    },
    performance: {
      cpu: 72,
      memory: 68,
      gpu: 84
    }
  },
  {
    name: 'AerialAI',
    version: 'v1.8.3',
    type: 'Drone Analysis',
    status: 'Active',
    accuracy: 91.8,
    latency: '62ms',
    throughput: '89 frames/sec',
    uptime: '30 days',
    lastUpdated: '2024-11-01',
    detections: {
      total: 4562,
      validated: 4289,
      rejected: 273
    },
    performance: {
      cpu: 45,
      memory: 52,
      gpu: 67
    }
  },
  {
    name: 'VigilaSim',
    version: 'v3.1.0',
    type: 'SOP Compliance',
    status: 'Active',
    accuracy: 88.5,
    latency: '120ms',
    throughput: '67 events/sec',
    uptime: '60 days',
    lastUpdated: '2024-09-20',
    detections: {
      total: 8923,
      validated: 7891,
      rejected: 1032
    },
    performance: {
      cpu: 28,
      memory: 34,
      gpu: 42
    }
  },
  {
    name: 'ANPR Core',
    version: 'v4.2.5',
    type: 'Vehicle Plate Recognition',
    status: 'Active',
    accuracy: 96.7,
    latency: '28ms',
    throughput: '156 plates/sec',
    uptime: '90 days',
    lastUpdated: '2024-08-10',
    detections: {
      total: 45623,
      validated: 44128,
      rejected: 1495
    },
    performance: {
      cpu: 64,
      memory: 58,
      gpu: 76
    }
  },
  {
    name: 'TrackNet',
    version: 'v1.2.0',
    type: 'Cross-Camera Tracking',
    status: 'Training',
    accuracy: 87.3,
    latency: '95ms',
    throughput: '124 tracks/sec',
    uptime: '5 days',
    lastUpdated: '2024-11-20',
    detections: {
      total: 2341,
      validated: 2045,
      rejected: 296
    },
    performance: {
      cpu: 82,
      memory: 91,
      gpu: 94
    }
  }
];

export function AIModelManager() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-400 bg-green-400/10';
      case 'Training': return 'text-yellow-400 bg-yellow-400/10';
      case 'Paused': return 'text-gray-400 bg-gray-400/10';
      case 'Error': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getMetricColor = (value: number) => {
    if (value < 70) return 'text-green-400';
    if (value < 85) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-400';
    if (accuracy >= 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  const activeModels = mockAIModels.filter(m => m.status === 'Active').length;
  const avgAccuracy = (mockAIModels.reduce((sum, m) => sum + m.accuracy, 0) / mockAIModels.length).toFixed(1);
  const totalDetections = mockAIModels.reduce((sum, m) => sum + m.detections.total, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl">AI Model Manager</h2>
          <p className="text-gray-400 text-sm mt-1">Manage and monitor AI/ML models</p>
        </div>
        <button className="px-4 py-2 bg-cyan-500 text-black rounded hover:bg-cyan-400 transition-colors flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Retrain All Models
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1a1f2e] border border-[#2a3441] p-4 rounded">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Models</div>
          <div className="text-white text-2xl">{mockAIModels.length}</div>
        </div>
        <div className="bg-[#1a1f2e] border border-green-400/30 p-4 rounded">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Active Models</div>
          <div className="text-green-400 text-2xl">{activeModels}</div>
        </div>
        <div className="bg-[#1a1f2e] border border-cyan-400/30 p-4 rounded">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Avg. Accuracy</div>
          <div className="text-cyan-400 text-2xl">{avgAccuracy}%</div>
        </div>
        <div className="bg-[#1a1f2e] border border-blue-400/30 p-4 rounded">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Detections</div>
          <div className="text-blue-400 text-2xl">{totalDetections.toLocaleString()}</div>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 gap-4">
        {mockAIModels.map((model, idx) => (
          <div key={idx} className="bg-[#1a1f2e] border border-[#2a3441] rounded p-4 hover:border-cyan-400/50 transition-all">
            <div className="grid grid-cols-4 gap-6">
              {/* Model Info */}
              <div className="col-span-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-cyan-400/10 rounded flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-white">{model.name}</div>
                    <div className="text-gray-400 text-xs">{model.version}</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-400">{model.type}</div>
                  <div className={`text-xs px-2 py-1 rounded inline-block ${getStatusColor(model.status)}`}>
                    {model.status}
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="col-span-1 space-y-3">
                <div>
                  <div className="text-gray-400 text-xs mb-1">Accuracy</div>
                  <div className={`text-xl ${getAccuracyColor(model.accuracy)}`}>{model.accuracy}%</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Latency</div>
                  <div className="text-white">{model.latency}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Throughput</div>
                  <div className="text-white text-sm">{model.throughput}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-xs mb-1">Uptime</div>
                  <div className="text-green-400 text-sm">{model.uptime}</div>
                </div>
              </div>

              {/* Detections Stats */}
              <div className="col-span-1 space-y-3">
                <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Detections</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Total</span>
                    <span className="text-white">{model.detections.total.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Validated</span>
                    <span className="text-green-400">{model.detections.validated.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Rejected</span>
                    <span className="text-red-400">{model.detections.rejected.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[#2a3441]">
                    <div className="text-xs text-gray-400">
                      Validation Rate: <span className="text-cyan-400">{((model.detections.validated / model.detections.total) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resource Usage */}
              <div className="col-span-1 space-y-3">
                <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Resource Usage</div>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400">CPU</span>
                      <span className={getMetricColor(model.performance.cpu)}>{model.performance.cpu}%</span>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded">
                      <div 
                        className={`h-1.5 rounded ${getMetricColor(model.performance.cpu) === 'text-green-400' ? 'bg-green-400' : getMetricColor(model.performance.cpu) === 'text-yellow-400' ? 'bg-yellow-400' : 'bg-red-400'}`}
                        style={{ width: `${model.performance.cpu}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400">Memory</span>
                      <span className={getMetricColor(model.performance.memory)}>{model.performance.memory}%</span>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded">
                      <div 
                        className={`h-1.5 rounded ${getMetricColor(model.performance.memory) === 'text-green-400' ? 'bg-green-400' : getMetricColor(model.performance.memory) === 'text-yellow-400' ? 'bg-yellow-400' : 'bg-red-400'}`}
                        style={{ width: `${model.performance.memory}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400">GPU</span>
                      <span className={getMetricColor(model.performance.gpu)}>{model.performance.gpu}%</span>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded">
                      <div 
                        className={`h-1.5 rounded ${getMetricColor(model.performance.gpu) === 'text-green-400' ? 'bg-green-400' : getMetricColor(model.performance.gpu) === 'text-yellow-400' ? 'bg-yellow-400' : 'bg-red-400'}`}
                        style={{ width: `${model.performance.gpu}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  {model.status === 'Active' ? (
                    <button className="flex-1 px-2 py-1 bg-yellow-500/20 border border-yellow-400 text-yellow-400 rounded hover:bg-yellow-500/30 transition-colors text-xs flex items-center justify-center gap-1">
                      <Pause className="w-3 h-3" />
                      Pause
                    </button>
                  ) : (
                    <button className="flex-1 px-2 py-1 bg-green-500/20 border border-green-400 text-green-400 rounded hover:bg-green-500/30 transition-colors text-xs flex items-center justify-center gap-1">
                      <Play className="w-3 h-3" />
                      Start
                    </button>
                  )}
                  <button className="flex-1 px-2 py-1 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded hover:bg-cyan-500/30 transition-colors text-xs flex items-center justify-center gap-1">
                    <Settings className="w-3 h-3" />
                    Config
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
