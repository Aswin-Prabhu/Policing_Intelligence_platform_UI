import { ArrowLeft, Plus, Camera, FileText, Tag, ArrowUpCircle, Shield, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface IncidentOperatorProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  startMode?: 'list' | 'create';
}

export function IncidentOperator({ onBack, onNavigate, startMode = 'list' }: IncidentOperatorProps) {
  const [showCreateForm, setShowCreateForm] = useState(startMode === 'create');
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);

  const myIncidents = [
    {
      id: 'INC-2024-1156',
      title: 'Suspicious Activity - NH-16 Junction',
      status: 'escalated',
      createdBy: 'Me',
      createdAt: '2024-12-02 09:15:23',
      priority: 'high',
      cameras: ['CAM-NZ-042', 'CAM-NZ-045'],
      notes: 2,
      escalatedTo: 'Supervisor Ravi Kumar',
    },
    {
      id: 'INC-2024-1148',
      title: 'Perimeter Breach - Industrial Area',
      status: 'under_review',
      createdBy: 'Me',
      createdAt: '2024-12-01 16:42:11',
      priority: 'medium',
      cameras: ['CAM-WZ-055'],
      notes: 1,
      escalatedTo: 'Supervisor Priya Sharma',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'escalated':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'under_review':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
      case 'draft':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-orange-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-3">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <Shield className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h1 className="text-white text-2xl">Incident Management – Operator</h1>
              <p className="text-gray-400 text-sm">Create new incidents, add footage, and escalate to supervisor</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowCreateForm(true)}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create New Incident
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-2 border-orange-500/50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white text-xl">Create New Incident</h2>
            <button onClick={() => setShowCreateForm(false)} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-2">Incident Title *</label>
                <input type="text" placeholder="Brief description of the incident..." className="w-full px-4 py-2 bg-[#0a0e1a] border border-[#1f2937] rounded-lg text-white" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-2">Priority Level *</label>
                <select className="w-full px-4 py-2 bg-[#0a0e1a] border border-[#1f2937] rounded-lg text-white">
                  <option value="">Select priority...</option>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-2">Location</label>
              <input type="text" placeholder="Incident location..." className="w-full px-4 py-2 bg-[#0a0e1a] border border-[#1f2937] rounded-lg text-white" />
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-2">Operator Notes *</label>
              <textarea
                placeholder="Describe what you observed. Be specific about time, people, vehicles, actions..."
                rows={4}
                className="w-full px-4 py-2 bg-[#0a0e1a] border border-[#1f2937] rounded-lg text-white resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-2">Tag Related Camera Feeds</label>
              <div className="grid grid-cols-4 gap-2">
                <button className="px-3 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-500/30 text-sm">
                  <Camera className="w-4 h-4 inline-block mr-1" />
                  CAM-NZ-042
                </button>
                <button className="px-3 py-2 bg-[#0a0e1a] border border-[#1f2937] text-gray-400 rounded-lg hover:border-cyan-500/50 text-sm">
                  <Plus className="w-4 h-4 inline-block mr-1" />
                  Add Camera
                </button>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-xs text-blue-400 mb-2">📌 Operator Guidelines</p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Provide factual observations only - no assumptions</li>
                <li>• Tag all relevant camera feeds for supervisor review</li>
                <li>• You cannot classify, close, or export evidence</li>
                <li>• Supervisor will review and take further action</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#1f2937]">
              <button className="flex-1 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2">
                <ArrowUpCircle className="w-5 h-5" />
                Create & Escalate to Supervisor
              </button>
              <button className="px-6 py-3 bg-[#0a0e1a] border border-[#1f2937] text-gray-400 rounded-lg hover:border-gray-500">Save as Draft</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-400" />
          My Created Incidents
        </h3>

        {myIncidents.map((incident) => (
          <div 
            key={incident.id} 
            className={`bg-[#0d1117] border-2 rounded-xl overflow-hidden transition-all cursor-pointer ${
              selectedIncident === incident.id ? 'border-orange-500' : 'border-[#1f2937] hover:border-orange-500/50'
            }`}
            onClick={() => setSelectedIncident(selectedIncident === incident.id ? null : incident.id)}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`px-3 py-1 border rounded-lg ${getStatusColor(incident.status)}`}>
                      <p className="text-xs uppercase font-bold">{incident.status.replace('_', ' ')}</p>
                    </div>
                    <div className={`flex items-center gap-1 ${getPriorityColor(incident.priority)}`}>
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs uppercase font-bold">{incident.priority}</span>
                    </div>
                  </div>
                  <h3 className="text-white text-lg font-medium mb-1">{incident.title}</h3>
                  <p className="text-xs text-gray-500">Incident ID: {incident.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-white font-mono text-sm">{incident.createdAt}</p>
                </div>
              </div>

              {selectedIncident === incident.id && (
                <>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Created By</p>
                      <p className="text-white text-sm">{incident.createdBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tagged Cameras</p>
                      <div className="flex gap-1">
                        {incident.cameras.map((cam) => (
                          <span key={cam} className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                            {cam}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Notes Added</p>
                      <p className="text-white text-sm">{incident.notes} note(s)</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Escalated To</p>
                      <p className="text-orange-400 text-sm">{incident.escalatedTo}</p>
                    </div>
                  </div>

                  {incident.status === 'escalated' && (
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                      <p className="text-xs text-orange-400">⏳ Escalated to supervisor – awaiting classification and action</p>
                    </div>
                  )}
                  {incident.status === 'under_review' && (
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                      <p className="text-xs text-cyan-400">👁️ Under supervisor review – you'll be notified of updates</p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="px-5 py-3 bg-[#0a0e1a] border-t border-[#1f2937] flex items-center justify-between">
              <button 
                className="text-sm text-gray-400 hover:text-white flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle view notes
                }}
              >
                <FileText className="w-4 h-4" />
                View My Notes
              </button>
              <span className="text-xs text-gray-500">Operators cannot edit escalated incidents</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-5">
        <h4 className="text-white mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          Operator Role – Incident Management Capabilities
        </h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-green-400 mb-2">✅ You CAN:</p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Create new incidents</li>
              <li>• Add raw footage from cameras</li>
              <li>• Write observation notes</li>
              <li>• Tag related camera feeds</li>
              <li>• Escalate to supervisor</li>
            </ul>
          </div>
          <div>
            <p className="text-sm text-red-400 mb-2">❌ You CANNOT:</p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Classify incident severity</li>
              <li>• Close incidents</li>
              <li>• Export evidence</li>
              <li>• Merge incidents</li>
              <li>• Lock evidence</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

