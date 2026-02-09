import { AlertTriangle, Eye, CheckCircle, XCircle, Merge, Radio, Camera, Clock, MapPin, User, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface AlertsSupervisorProps {
  onBack: () => void;
  onViewCamera: (cameraId: string) => void;
  onNavigate: (screen: string) => void;
}

export function AlertsSupervisor({ onBack, onViewCamera, onNavigate }: AlertsSupervisorProps) {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  const escalatedAlerts = [
    {
      id: 'ALT-2401',
      type: 'Intrusion Detection',
      camera: 'CAM-NZ-042',
      location: 'NH-16 Junction - Restricted Zone',
      time: '2024-12-02 10:45:23',
      severity: 'critical',
      confidence: 94,
      aiEngine: 'RakshakAI v2.3',
      status: 'escalated',
      description: 'Person detected entering restricted boundary area',
      zone: 'North Zone',
      operatorName: 'Operator Kumar',
      operatorTag: 'Urgent - Escalate Immediately',
      operatorNotes:
        'Person carrying equipment, appears to be photographing infrastructure. Requires immediate supervisor review.',
      escalatedAt: '2024-12-02 10:46:30',
      linkedIncidents: 1,
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
      status: 'under_review',
      description: 'Breach detected at perimeter fence section B-7',
      zone: 'West Zone',
      operatorName: 'Operator Priya',
      operatorTag: 'Needs Supervisor Review',
      operatorNotes: 'Fence damage visible. Person entered restricted zone. Identity unclear from footage.',
      escalatedAt: '2024-12-02 10:40:12',
      linkedIncidents: 0,
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
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-3">
            <AlertTriangle className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h1 className="text-white text-2xl">Anomaly Alerts – Supervisor Review</h1>
              <p className="text-gray-400 text-sm">Approve/override AI classifications and issue field instructions</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-xs text-gray-400">Escalated</p>
            <p className="text-red-400 text-xl font-bold">{escalatedAlerts.filter((a) => a.status === 'escalated').length}</p>
          </div>
          <div className="px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-lg">
            <p className="text-xs text-gray-400">Under Review</p>
            <p className="text-orange-400 text-xl font-bold">{escalatedAlerts.filter((a) => a.status === 'under_review').length}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {escalatedAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-[#0d1117] border-2 rounded-xl overflow-hidden transition-all ${
              selectedAlert === alert.id
                ? 'border-green-500'
                : alert.severity === 'critical'
                ? 'border-red-500/50 hover:border-red-500'
                : 'border-orange-500/50 hover:border-orange-500'
            }`}
          >
            <div className={`p-5 border-b border-[#1f2937] ${alert.severity === 'critical' ? 'bg-red-500/5' : 'bg-orange-500/5'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <AlertTriangle className={`w-6 h-6 ${alert.severity === 'critical' ? 'text-red-400' : 'text-orange-400'}`} />
                  <div>
                    <p className="text-white text-lg font-medium">{alert.type}</p>
                    <p className="text-xs text-gray-500">Alert ID: {alert.id}</p>
                  </div>
                  <div className={`px-4 py-2 border rounded-lg ${getSeverityColor(alert.severity)}`}>
                    <p className="text-xs uppercase font-bold">{alert.severity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Escalated</p>
                  <p className="text-orange-400 font-mono text-sm">{alert.escalatedAt}</p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-3 gap-6 mb-5">
                <div className="col-span-2 space-y-4">
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4 text-cyan-400" />
                      <p className="text-sm text-cyan-400 font-medium">Operator Validation</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Validated By</p>
                        <p className="text-white text-sm">{alert.operatorName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Operator Tag</p>
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">{alert.operatorTag}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Operator Notes</p>
                      <p className="text-white text-sm italic">"{alert.operatorNotes}"</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Description</p>
                      <p className="text-white text-sm">{alert.description}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
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
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Detection Time</p>
                        <p className="text-white text-sm font-mono flex items-center gap-2">
                          <Clock className="w-3 h-3 text-gray-500" />
                          {new Date(alert.time).toLocaleTimeString()}
                        </p>
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
                        <p className="text-xs text-gray-500 mb-1">AI Confidence</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500" style={{ width: `${alert.confidence}%` }} />
                          </div>
                          <span className="text-cyan-400 text-sm font-bold">{alert.confidence}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Linked Incidents</p>
                        <button className="text-cyan-400 hover:text-cyan-300 text-sm">
                          {alert.linkedIncidents > 0 ? `${alert.linkedIncidents} incident(s)` : 'None'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
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

                <div className="space-y-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Supervisor Decision</p>

                  <div className="bg-gradient-to-br from-green-500/5 to-blue-500/5 border border-green-500/30 rounded-lg p-4 space-y-3">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 mb-3">
                      <p className="text-xs text-gray-500 mb-1">AI Classification</p>
                      <p className="text-white font-medium">{alert.type}</p>
                      <p className="text-xs text-gray-400 mt-1">Confidence: {alert.confidence}%</p>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 block mb-2">Override Classification (Optional)</label>
                      <select className="w-full px-3 py-2 bg-[#0a0e1a] border border-[#1f2937] rounded-lg text-white text-sm">
                        <option value="">Accept AI Decision</option>
                        <option value="false_alarm">False Alarm</option>
                        <option value="downgrade">Downgrade Severity</option>
                        <option value="upgrade">Upgrade Severity</option>
                        <option value="different_type">Different Type</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 block mb-2">Supervisor Assessment *</label>
                      <textarea
                        placeholder="Your review and decision rationale..."
                        rows={4}
                        className="w-full px-3 py-2 bg-[#0a0e1a] border border-[#1f2937] rounded-lg text-white text-sm resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 block mb-2">Field Unit Instructions (Optional)</label>
                      <textarea
                        placeholder="Instructions for patrol/field teams..."
                        rows={3}
                        className="w-full px-3 py-2 bg-[#0a0e1a] border border-[#1f2937] rounded-lg text-white text-sm resize-none"
                      />
                    </div>

                    <div className="pt-3 border-t border-green-500/30 space-y-2">
                      <button className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Approve AI Decision
                      </button>
                      <button className="w-full py-2 bg-orange-500/20 text-orange-400 border border-orange-500/50 rounded-lg hover:bg-orange-500/30 flex items-center justify-center gap-2 text-sm">
                        <XCircle className="w-4 h-4" />
                        Override & Reclassify
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#1f2937] pt-4">
                <p className="text-xs text-gray-500 mb-3">Additional Actions</p>
                <div className="grid grid-cols-4 gap-3">
                  <button
                    onClick={() => onNavigate('incidents-list')}
                    className="py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 flex items-center justify-center gap-2 text-sm"
                  >
                    <Merge className="w-4 h-4" />
                    Merge with Incident
                  </button>
                  <button className="py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 flex items-center justify-center gap-2 text-sm">
                    <Radio className="w-4 h-4" />
                    Dispatch Field Unit
                  </button>
                  <button className="py-2 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 flex items-center justify-center gap-2 text-sm">
                    <MessageSquare className="w-4 h-4" />
                    Request More Info
                  </button>
                  <button className="py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 flex items-center justify-center gap-2 text-sm">
                    <XCircle className="w-4 h-4" />
                    Dismiss Alert
                  </button>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-[#0a0e1a] border-t border-[#1f2937] flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span className="text-gray-500">
                  AI Engine: <span className="text-gray-400">{alert.aiEngine}</span>
                </span>
                <span className="text-gray-500">
                  Operator: <span className="text-cyan-400">{alert.operatorName}</span>
                </span>
              </div>
              <span className="text-gray-500">
                Status: <span className="text-orange-400">{alert.status.toUpperCase()}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-lg p-5">
        <h4 className="text-white mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-green-400" />
          Supervisor Role – Alert Review Authority
        </h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-green-400 mb-2">✅ Supervisor Capabilities:</p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• View operator validation and notes</li>
              <li>• Approve or override AI classification</li>
              <li>• Reclassify alert type and severity</li>
              <li>• Merge alerts with existing incidents</li>
              <li>• Issue field unit instructions</li>
              <li>• Request additional information</li>
              <li>• Final authority to dismiss alerts</li>
            </ul>
          </div>
          <div>
            <p className="text-sm text-cyan-400 mb-2">📋 Review Guidelines:</p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Review operator notes and validation tag</li>
              <li>• Check AI confidence and camera footage</li>
              <li>• Override only with clear justification</li>
              <li>• Add detailed assessment for audit trail</li>
              <li>• Dispatch field units for critical alerts</li>
              <li>• Merge with incidents when applicable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

