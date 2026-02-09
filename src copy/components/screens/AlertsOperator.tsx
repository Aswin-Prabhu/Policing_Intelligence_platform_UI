import { AlertTriangle, Eye, Tag, ArrowUpCircle, CheckCircle, XCircle, Camera, Clock, MapPin } from 'lucide-react';
import { useState } from 'react';

interface AlertsOperatorProps {
  onBack: () => void;
  onViewCamera: (cameraId: string) => void;
  onCreateIncident: () => void;
}

export function AlertsOperator({ onBack, onViewCamera, onCreateIncident }: AlertsOperatorProps) {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  const alerts = [
    {
      id: 'ALT-2401',
      type: 'Intrusion Detection',
      camera: 'CAM-NZ-042',
      location: 'NH-16 Junction - Restricted Zone',
      time: '2024-12-02 10:45:23',
      severity: 'critical',
      confidence: 94,
      aiEngine: 'RakshakAI v2.3',
      status: 'pending',
      description: 'Person detected entering restricted boundary area',
      zone: 'North Zone',
    },
    {
      id: 'ALT-2398',
      type: 'Perimeter Breach',
      camera: 'CAM-WZ-055',
      location: 'Industrial Area - Fence Line',
      time: '2024-12-02 10:38:15',
      severity: 'high',
      confidence: 89,
      aiEngine: 'RakshakAI v2.3',
      status: 'pending',
      description: 'Breach detected at perimeter fence section B-7',
      zone: 'West Zone',
    },
    {
      id: 'ALT-2395',
      type: 'Crowd Detection',
      camera: 'CAM-CZ-007',
      location: 'Railway Station - Platform 2',
      time: '2024-12-02 10:31:47',
      severity: 'medium',
      confidence: 91,
      aiEngine: 'RakshakAI v2.3',
      status: 'pending',
      description: 'Unusual crowd density detected (>150 people)',
      zone: 'Central Zone',
    },
    {
      id: 'ALT-2392',
      type: 'Abandoned Object',
      camera: 'CAM-SZ-018',
      location: 'Beach Road - Bus Stop',
      time: '2024-12-02 10:25:11',
      severity: 'medium',
      confidence: 87,
      aiEngine: 'RakshakAI v2.3',
      status: 'pending',
      description: 'Unattended bag detected for >5 minutes',
      zone: 'South Zone',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-green-500/20 text-green-400 border-green-500/50';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-white text-2xl">Anomaly Alerts – Operator View</h1>
              <p className="text-gray-400 text-sm">Quick validation and escalation for AI-detected anomalies</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-xs text-gray-400">Critical Alerts</p>
            <p className="text-red-400 text-xl font-bold">{alerts.filter((a) => a.severity === 'critical').length}</p>
          </div>
          <div className="px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-lg">
            <p className="text-xs text-gray-400">Pending Review</p>
            <p className="text-orange-400 text-xl font-bold">{alerts.filter((a) => a.status === 'pending').length}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-[#0d1117] border-2 rounded-xl overflow-hidden transition-all ${
              selectedAlert === alert.id
                ? 'border-cyan-500'
                : alert.severity === 'critical'
                ? 'border-red-500/50 hover:border-red-500'
                : 'border-[#1f2937] hover:border-cyan-500/50'
            }`}
          >
            <div
              className={`p-4 border-b border-[#1f2937] ${
                alert.severity === 'critical' ? 'bg-red-500/5' : alert.severity === 'high' ? 'bg-orange-500/5' : 'bg-yellow-500/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <AlertTriangle
                    className={`w-6 h-6 ${
                      alert.severity === 'critical' ? 'text-red-400' : alert.severity === 'high' ? 'text-orange-400' : 'text-yellow-400'
                    }`}
                  />
                  <div>
                    <p className="text-white text-lg font-medium">{alert.type}</p>
                    <p className="text-xs text-gray-500">Alert ID: {alert.id}</p>
                  </div>
                </div>
                <div className={`px-4 py-2 border rounded-lg ${getSeverityColor(alert.severity)}`}>
                  <p className="text-xs uppercase font-bold">{alert.severity}</p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-2 gap-6 mb-5">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Description</p>
                    <p className="text-white text-sm">{alert.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Camera</p>
                      <button
                        onClick={() => onViewCamera(alert.camera)}
                        className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
                      >
                        <Camera className="w-3 h-3" />
                        {alert.camera}
                      </button>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Zone</p>
                      <p className="text-white text-sm">{alert.zone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-white text-sm flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      {alert.location}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Detection Time</p>
                      <p className="text-white text-sm font-mono flex items-center gap-2">
                        <Clock className="w-3 h-3 text-gray-500" />
                        {new Date(alert.time).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">AI Confidence</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500" style={{ width: `${alert.confidence}%` }} />
                        </div>
                        <span className="text-cyan-400 text-sm font-bold">{alert.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-gray-500">Alert Snapshot</p>
                  <div className="aspect-video bg-[#0a0e1a] border border-[#1f2937] rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-12 h-12 text-gray-700 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Camera Feed Preview</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onViewCamera(alert.camera)}
                    className="w-full py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 flex items-center justify-center gap-2 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Jump to Live Feed
                  </button>
                </div>
              </div>

              <div className="border-t border-[#1f2937] pt-4">
                <p className="text-xs text-gray-500 mb-3">Operator Quick Actions</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-2">Quick Tag</label>
                    <select className="w-full px-3 py-2 bg-[#0a0e1a] border border-[#1f2937] rounded-lg text-white text-sm">
                      <option value="">Select classification...</option>
                      <option value="suspicious">🔴 Suspicious - Needs Attention</option>
                      <option value="normal">🟢 Likely Normal - False Alert</option>
                      <option value="review">🟡 Needs Supervisor Review</option>
                      <option value="urgent">🔴 Urgent - Escalate Immediately</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-2">Operator Notes (Optional)</label>
                    <input
                      type="text"
                      placeholder="Add quick observation..."
                      className="w-full px-3 py-2 bg-[#0a0e1a] border border-[#1f2937] rounded-lg text-white text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <button className="py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Validate Alert
                  </button>
                  <button className="py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 flex items-center justify-center gap-2 text-sm">
                    <XCircle className="w-4 h-4" />
                    Dismiss (False)
                  </button>
                  <button
                    onClick={onCreateIncident}
                    className="py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2 text-sm"
                  >
                    <Tag className="w-4 h-4" />
                    Create Incident
                  </button>
                  <button className="py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 flex items-center justify-center gap-2 text-sm">
                    <ArrowUpCircle className="w-4 h-4" />
                    Escalate to Supervisor
                  </button>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-[#0a0e1a] border-t border-[#1f2937] flex items-center justify-between text-xs">
              <span className="text-gray-500">
                AI Engine: <span className="text-gray-400">{alert.aiEngine}</span>
              </span>
              <span className="text-gray-500">
                Status: <span className="text-yellow-400">{alert.status.toUpperCase()}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

