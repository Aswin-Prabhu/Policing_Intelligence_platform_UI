import { ArrowLeft, Camera, MapPin, User, Clock, FileText, Image, CheckCircle, ArrowUpCircle, XCircle, Eye, Shield } from 'lucide-react';

interface IncidentDetailProps {
  onBack: () => void;
  userRole?: 'operator' | 'supervisor' | 'admin';
  incidentId?: string;
  isClosed?: boolean;
}

export function IncidentDetail({ onBack, userRole = 'operator', incidentId, isClosed = false }: IncidentDetailProps) {
  // Sample data - in real app, this would be fetched based on incidentId
  const incidentData = {
    id: incidentId || 'INC-2024-1101',
    title: 'Traffic Accident - Main Road',
    status: isClosed ? 'closed' : 'active',
    priority: 'high',
    classification: 'Traffic Accident',
    location: 'NH-16 Junction',
    createdBy: 'Operator Anil',
    createdAt: '2024-11-28 11:30:15',
    closedAt: isClosed ? '2024-11-28 15:20:00' : null,
    closedBy: isClosed ? 'Supervisor Kumar' : null,
    operatorNotes: 'Two-vehicle collision. Medical assistance provided.',
    supervisorAssessment: isClosed ? 'Incident resolved. Both vehicles towed. Medical assistance provided on site. No serious injuries reported.' : null,
    fieldInstructions: isClosed ? 'Patrol units dispatched. Traffic cleared. Scene secured.' : null,
    cameras: ['CAM-NZ-038', 'CAM-NZ-039'],
    linkedAlerts: 2,
    evidenceCount: 8,
  };

  const timelineEvents = [
    { time: '11:30', event: 'Incident Reported', type: 'create', user: incidentData.createdBy },
    { time: '11:32', event: 'Team Alpha Assigned', type: 'assign', user: 'Control Room' },
    { time: '11:35', event: 'First Responder En Route', type: 'dispatch', user: 'Team Alpha' },
    { time: '11:40', event: 'Evidence Added (8 clips)', type: 'evidence', user: 'Officer Kumar' },
    { time: '11:45', event: 'Camera Feeds Tagged', type: 'camera', user: 'Operator' },
    { time: '12:00', event: 'Status Update: Under Control', type: 'update', user: 'Team Alpha' },
    ...(isClosed ? [
      { time: '15:20', event: 'Incident Closed', type: 'close', user: incidentData.closedBy || 'Supervisor' },
    ] : []),
  ];

  const relatedCameras = [
    { id: 'CAM-NZ-038', name: 'NH-16 Junction North', status: 'online' },
    { id: 'CAM-NZ-039', name: 'NH-16 Junction South', status: 'online' },
  ];

  const evidenceItems = [
    { id: 1, type: 'image', name: 'Scene Overview' },
    { id: 2, type: 'image', name: 'Vehicle Damage' },
    { id: 3, type: 'video', name: 'Camera Feed 11:30-12:00' },
    { id: 4, type: 'image', name: 'License Plates' },
    { id: 5, type: 'image', name: 'Witness Statement' },
    { id: 6, type: 'video', name: 'Medical Response' },
    { id: 7, type: 'image', name: 'Traffic Clearance' },
    { id: 8, type: 'video', name: 'Final Scene' },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'closed') return 'bg-green-500/20 text-green-400 border-green-500/50';
    return 'bg-red-500/20 text-red-400 border-red-500/50';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-amber-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b-2 border-gray-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to All Incidents
            </button>
            <div className="flex items-center gap-3">
              {isClosed && (
                <div className="px-4 py-2 bg-green-100 border border-green-300 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">CLOSED INCIDENT</span>
                  </div>
                </div>
              )}
              {!isClosed && userRole === 'supervisor' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Review & Classify
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Incident Header */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-4 py-2 rounded-lg text-sm font-bold border ${getStatusColor(incidentData.status)}`}>
                  {incidentData.status.toUpperCase()}
                </span>
                <span className={`px-4 py-2 rounded-lg text-sm font-bold ${getPriorityColor(incidentData.priority)}`}>
                  {incidentData.priority.toUpperCase()} PRIORITY
                </span>
                {incidentData.classification && (
                  <span className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 border border-gray-300">
                    {incidentData.classification}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{incidentData.title}</h1>
              <p className="text-lg text-gray-600 mb-4">Incident ID: {incidentData.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-1">Location</p>
              <p className="text-base font-semibold text-gray-900">{incidentData.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Reported By</p>
              <p className="text-base font-semibold text-gray-900">{incidentData.createdBy}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Created</p>
              <p className="text-base font-semibold text-gray-900">{incidentData.createdAt}</p>
            </div>
            {isClosed && incidentData.closedAt && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Closed</p>
                <p className="text-base font-semibold text-gray-900">{incidentData.closedAt}</p>
                {incidentData.closedBy && (
                  <p className="text-xs text-gray-500 mt-1">by {incidentData.closedBy}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Initial Observation */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Initial Observation (Reported by Operator)</h3>
              <div className="bg-gray-50 border-l-4 border-gray-400 rounded p-4 italic text-gray-700">
                &quot;{incidentData.operatorNotes}&quot;
              </div>
            </div>

            {/* Supervisor Assessment (if closed) */}
            {isClosed && incidentData.supervisorAssessment && (
              <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Supervisor Assessment</h3>
                <div className="bg-blue-50 border-l-4 border-blue-400 rounded p-4 text-gray-700">
                  {incidentData.supervisorAssessment}
                </div>
              </div>
            )}

            {/* Field Instructions (if closed) */}
            {isClosed && incidentData.fieldInstructions && (
              <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Field Unit Instructions</h3>
                <div className="bg-amber-50 border-l-4 border-amber-400 rounded p-4 text-gray-700">
                  {incidentData.fieldInstructions}
                </div>
              </div>
            )}

            {/* Incident Timeline */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Timeline</h3>
              <div className="space-y-4">
                {timelineEvents.map((event, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          event.type === 'close' ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                      ></div>
                      {idx < timelineEvents.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-300"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-gray-900 font-medium">{event.event}</p>
                        <span className="text-sm text-gray-500">{event.time}</span>
                      </div>
                      <p className="text-sm text-gray-600">By {event.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Evidence ({evidenceItems.length} items)</h3>
                {!isClosed && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                    + Add Evidence
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-4">
                {evidenceItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <div className="aspect-square bg-gray-200 rounded mb-2 flex items-center justify-center">
                      {item.type === 'image' ? (
                        <Image className="w-8 h-8 text-gray-600" />
                      ) : (
                        <Camera className="w-8 h-8 text-gray-600" />
                      )}
                    </div>
                    <p className="text-xs text-gray-700 text-center font-medium">{item.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Context & Evidence Summary */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Context & Evidence</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Camera Sources</p>
                  <div className="space-y-2">
                    {relatedCameras.map((camera) => (
                      <button
                        key={camera.id}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-900"
                      >
                        <Camera className="w-4 h-4" />
                        {camera.id}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">Related Alerts</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{incidentData.linkedAlerts}</p>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View Alerts →
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-2">Evidence Clips</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{incidentData.evidenceCount}</p>
                  <button
                    onClick={() => onBack()}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Open Console →
                  </button>
                </div>
              </div>
            </div>

            {/* Related Camera Feeds */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Camera Feeds</h3>
              <div className="space-y-4">
                {relatedCameras.map((camera) => (
                  <div
                    key={camera.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 cursor-pointer transition-colors"
                  >
                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                      <Camera className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-gray-900 mb-1">{camera.id}</p>
                      <p className="text-xs text-gray-600">{camera.name}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">ONLINE</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
