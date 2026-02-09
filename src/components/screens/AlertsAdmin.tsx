import { AlertTriangle, Cpu, TrendingUp, TrendingDown, Activity, BarChart3, PieChart } from 'lucide-react';
import { useState } from 'react';

interface AlertsAdminProps {
  onBack: () => void;
}

export function AlertsAdmin({ onBack }: AlertsAdminProps) {
  const [dateRange, setDateRange] = useState('7days');

  const aiMetrics = {
    totalAlerts: 1847,
    truePositives: 1623,
    falsePositives: 187,
    falseNegatives: 37,
    accuracy: 87.9,
    precision: 89.7,
    recall: 97.8,
    avgConfidence: 88.4,
  };

  const alertPatterns = [
    {
      pattern: 'High False Positive Rate',
      engine: 'RakshakAI',
      affectedType: 'Crowd Detection',
      occurrences: 45,
      trend: 'increasing',
      impact: 'high',
      recommendation: 'Retrain model with recent crowd footage',
    },
    {
      pattern: 'Low Confidence Detections',
      engine: 'AerialAI',
      affectedType: 'Vehicle Tracking',
      occurrences: 28,
      trend: 'stable',
      impact: 'medium',
      recommendation: 'Check drone camera calibration',
    },
    {
      pattern: 'Supervisor Override Pattern',
      engine: 'ANPR Engine',
      affectedType: 'Parking Violations',
      occurrences: 18,
      trend: 'decreasing',
      impact: 'low',
      recommendation: 'AI learning from overrides - pattern improving',
    },
  ];

  const engineHealth = [
    {
      name: 'RakshakAI',
      version: 'v2.3.1',
      status: 'operational',
      uptime: 99.7,
      avgProcessingTime: 245,
      alertsToday: 847,
      falsePositiveRate: 9.2,
      lastRetrained: '2024-11-28',
    },
    {
      name: 'ANPR Engine',
      version: 'v3.1.0',
      status: 'operational',
      uptime: 99.9,
      avgProcessingTime: 142,
      alertsToday: 624,
      falsePositiveRate: 7.8,
      lastRetrained: '2024-11-25',
    },
    {
      name: 'AerialAI',
      version: 'v1.8.2',
      status: 'warning',
      uptime: 98.2,
      avgProcessingTime: 189,
      alertsToday: 312,
      falsePositiveRate: 12.4,
      lastRetrained: '2024-11-20',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-emerald-100 border border-emerald-200';
      case 'warning':
        return 'bg-amber-100 border border-amber-200';
      case 'critical':
        return 'bg-red-100 border border-red-200';
      default:
        return 'bg-gray-100 border border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => (trend === 'increasing' ? TrendingUp : TrendingDown);

  const getTrendColor = (trend: string, impact: string) => {
    if (trend === 'increasing' && impact === 'high') return 'text-red-600';
    if (trend === 'decreasing') return 'text-green-700';
    return 'text-gray-600';
  };

  const rangeLabel = () => {
    if (dateRange === '24h') return '24 Hours';
    if (dateRange === '7days') return '7 Days';
    return '30 Days';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-black/60 hover:text-black transition-colors mb-3"
          >
            <AlertTriangle className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 border border-purple-200 rounded-lg">
              <Activity className="w-6 h-6 text-black/70" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-black">Alert Analytics – AI Performance Dashboard</h1>
              <p className="text-sm text-black/60">
                AI reasoning patterns, engine health, and performance metrics • Admin & AI Team Only
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-white border border-border/60 rounded-lg text-sm text-black focus:border-blue-400 focus:outline-none"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 mb-4">
        <h3 className="mb-4 flex items-center gap-2 text-black">
          <BarChart3 className="w-5 h-5 text-black" />
          Overall AI Alert Performance (Last {rangeLabel()})
        </h3>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-black/60 mb-1">Accuracy</p>
            <p className="text-2xl text-black font-bold mb-1">{aiMetrics.accuracy}%</p>
            <div className="flex items-center gap-1 text-sm text-green-700">
              <TrendingUp className="w-4 h-4" />
              <span>+2.1% vs previous period</span>
            </div>
          </div>

          <div>
            <p className="text-xs text-black/60 mb-1">Precision</p>
            <p className="text-2xl text-black font-bold mb-1">{aiMetrics.precision}%</p>
            <div className="flex items-center gap-1 text-sm text-green-700">
              <TrendingUp className="w-4 h-4" />
              <span>+1.4% vs previous period</span>
            </div>
          </div>

          <div>
            <p className="text-xs text-black/60 mb-1">Recall</p>
            <p className="text-2xl text-black font-bold mb-1">{aiMetrics.recall}%</p>
            <div className="flex items-center gap-1 text-sm text-red-600">
              <TrendingDown className="w-4 h-4" />
              <span>-0.3% vs previous period</span>
            </div>
          </div>

          <div>
            <p className="text-xs text-black/60 mb-1">Avg Confidence</p>
            <p className="text-2xl text-black font-bold mb-1">{aiMetrics.avgConfidence}%</p>
            <p className="text-xs text-black/50">Across all engines</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-purple-500/30">
          <div className="text-center">
            <p className="text-xs text-black/60 mb-1">Total Alerts</p>
            <p className="text-xl text-black font-bold">{aiMetrics.totalAlerts}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-black/60 mb-1">True Positives</p>
            <p className="text-xl text-emerald-600 font-bold">{aiMetrics.truePositives}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-black/60 mb-1">False Positives</p>
            <p className="text-xl text-red-600 font-bold">{aiMetrics.falsePositives}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-black/60 mb-1">False Negatives</p>
            <p className="text-xl text-amber-600 font-bold">{aiMetrics.falseNegatives}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="mb-4 flex items-center gap-2 text-black">
          <PieChart className="w-5 h-5 text-black" />
          Detected Anomaly Patterns
        </h3>

        <div className="space-y-3">
          {alertPatterns.map((pattern, idx) => {
            const TrendIcon = getTrendIcon(pattern.trend);
            return (
              <div
                key={idx}
                className="bg-card border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm text-black">{pattern.pattern}</h4>
                      <div className={`flex items-center gap-1 ${getTrendColor(pattern.trend, pattern.impact)}`}>
                        <TrendIcon className="w-4 h-4" />
                        <span className="text-xs uppercase">{pattern.trend}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3 mb-2 text-xs">
                      <div>
                        <p className="text-xs text-black/50">AI Engine</p>
                        <p className="text-sm text-black">{pattern.engine}</p>
                      </div>
                      <div>
                        <p className="text-xs text-black/50">Affected Type</p>
                        <p className="text-sm text-black">{pattern.affectedType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-black/50">Occurrences</p>
                        <p className="text-sm font-bold text-black">{pattern.occurrences} times</p>
                      </div>
                      <div>
                        <p className="text-xs text-black/50">Impact</p>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold text-black ${
                            pattern.impact === 'high'
                              ? 'bg-red-100 border border-red-200'
                              : pattern.impact === 'medium'
                              ? 'bg-amber-100 border border-amber-200'
                              : 'bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {pattern.impact.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded p-3">
                      <p className="text-xs text-black/60 mb-1">Recommendation:</p>
                      <p className="text-sm text-black">{pattern.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-4 flex items-center gap-2 text-black">
          <Cpu className="w-5 h-5 text-black" />
          AI Engine Health Metrics
        </h3>

        <div className="space-y-3">
          {engineHealth.map((engine) => (
            <div
              key={engine.name}
              className="bg-card border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
            >
              <div className="p-5 border-b border-border/60 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <Cpu className="w-6 h-6 text-black/70" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-black">{engine.name}</h4>
                      <p className="text-xs text-black/50">Version {engine.version}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase text-black ${getStatusColor(engine.status)}`}>
                    <p>{engine.status}</p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-6 gap-6">
                  <div>
                    <p className="text-xs text-black/50 mb-1">Uptime</p>
                    <p className="text-xl font-bold text-black">{engine.uptime}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 mb-1">Processing Time</p>
                    <p className="text-xl font-bold text-black">
                      {engine.avgProcessingTime}
                      <span className="text-sm text-black/50">ms</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 mb-1">Alerts Today</p>
                    <p className="text-xl font-bold text-black">{engine.alertsToday}</p>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 mb-1">False Positive Rate</p>
                    <p
                      className={`text-xl font-bold ${
                        engine.falsePositiveRate > 10 ? 'text-red-600' : engine.falsePositiveRate > 8 ? 'text-amber-600' : 'text-emerald-600'
                      }`}
                    >
                      {engine.falsePositiveRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 mb-1">Last Retrained</p>
                    <p className="text-sm text-black">{engine.lastRetrained}</p>
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-100 text-sm">
                      View Logs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-5">
        <h4 className="mb-3 text-black font-semibold">Admin/AI Team Analytics Dashboard</h4>
        <div className="grid grid-cols-2 gap-6 text-sm text-black/70">
          <div>
            <p className="mb-2 font-medium text-black">📊 Available Analytics</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>AI engine performance trends over time</li>
              <li>Pattern detection and anomaly identification</li>
              <li>False positive/negative analysis</li>
              <li>Processing time and uptime monitoring</li>
              <li>Model drift detection</li>
              <li>Retraining recommendations</li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-medium text-black">🔍 Use Cases</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>Identify underperforming AI models</li>
              <li>Track improvement after retraining</li>
              <li>Optimize detection thresholds</li>
              <li>Monitor supervisor override patterns</li>
              <li>Generate compliance reports</li>
              <li>Schedule preventive maintenance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

