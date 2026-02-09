import { ArrowLeft, Shield, CheckCircle, XCircle, Merge, FileText, Lock, Eye, Camera, AlertTriangle, Clock, User, Send, Search } from 'lucide-react';
import { useState } from 'react';

interface IncidentSupervisorProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export function IncidentSupervisor({ onBack, onNavigate }: IncidentSupervisorProps) {
  const [selectedIncident, setSelectedIncident] = useState<string | null>('INC-2024-1156');
  const [classification, setClassification] = useState<string>('');
  const [severity, setSeverity] = useState<string>('');
  const [decisionAction, setDecisionAction] = useState<string>('');
  const [supervisorAssessment, setSupervisorAssessment] = useState<string>('');
  const [fieldInstructions, setFieldInstructions] = useState<string>('');

  const escalatedIncidents = [
    {
      id: 'INC-2024-1156',
      title: 'Suspicious Activity - NH-16 Junction',
      createdBy: 'Operator Kumar',
      createdAt: '2024-12-02 09:15:23',
      priority: 'high',
      status: 'pending_classification',
      cameras: ['CAM-NZ-042', 'CAM-NZ-045'],
      operatorNotes:
        'Two individuals seen loitering near restricted zone for 15+ minutes. One appeared to be taking photographs of security infrastructure.',
      suggestedClassification: null,
      evidenceCount: 0,
      linkedAlerts: 2,
    },
    {
      id: 'INC-2024-1153',
      title: 'Vehicle Theft Attempt - Parking Area',
      createdBy: 'Operator Priya',
      createdAt: '2024-12-02 08:42:11',
      priority: 'high',
      status: 'pending_approval',
      cameras: ['CAM-SZ-018', 'CAM-SZ-020'],
      operatorNotes:
        'Individual attempting to break into vehicle AP05C1234. Vehicle alarm triggered. Suspect fled on motorcycle.',
      suggestedClassification: 'theft_attempt',
      evidenceCount: 3,
      linkedAlerts: 1,
    },
    {
      id: 'INC-2024-1148',
      title: 'Perimeter Breach - Industrial Area',
      createdBy: 'Operator Ravi',
      createdAt: '2024-12-01 16:23:45',
      priority: 'medium',
      status: 'under_review',
      cameras: ['CAM-WZ-055'],
      operatorNotes:
        'Fence section B-7 breach detected. Person entered restricted zone. Identity unclear from footage.',
      suggestedClassification: 'trespassing',
      evidenceCount: 2,
      linkedAlerts: 3,
    },
  ];

  const needsClassification = escalatedIncidents.filter((i) => i.status === 'pending_classification').length;
  const awaitingApproval = escalatedIncidents.filter((i) => i.status === 'pending_approval').length;
  const activeReviews = escalatedIncidents.filter((i) => i.status === 'under_review').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_classification':
        return { text: 'Needs Classification', color: 'bg-red-100 border-red-300 text-red-800' };
      case 'pending_approval':
        return { text: 'Awaiting Approval', color: 'bg-amber-100 border-amber-300 text-amber-800' };
      case 'under_review':
        return { text: 'Under Review', color: 'bg-blue-100 border-blue-300 text-blue-800' };
      default:
        return { text: 'Unknown', color: 'bg-gray-100 border-gray-300 text-gray-800' };
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return { text: 'Critical', color: 'bg-red-600 text-white border-red-700' };
      case 'high':
        return { text: 'High', color: 'bg-red-500 text-white border-red-600' };
      case 'medium':
        return { text: 'Medium', color: 'bg-amber-500 text-white border-amber-600' };
      case 'low':
        return { text: 'Low', color: 'bg-green-500 text-white border-green-600' };
      default:
        return { text: 'Unknown', color: 'bg-gray-500 text-white border-gray-600' };
    }
  };

  const selectedIncidentData = escalatedIncidents.find((i) => i.id === selectedIncident);

  const incidentCategories = [
    'Theft / Robbery',
    'Trespassing / Unauthorized Entry',
    'Vandalism / Property Damage',
    'Suspicious Activity / Loitering',
    'Traffic Violation / Accident',
    'Public Disturbance / Fight',
    'Weapon Detection',
    'Emergency / Medical',
    'False Alarm / Non-Incident',
    'Other',
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Incident Review & Decision Desk</h1>
            <p className="text-gray-600">Review, classify, and make operational decisions on escalated incidents</p>
          </div>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border-2 border-red-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Needs Classification</p>
              <p className="text-3xl font-bold text-gray-900">{needsClassification}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-amber-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Awaiting Approval</p>
              <p className="text-3xl font-bold text-gray-900">{awaitingApproval}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Reviews</p>
              <p className="text-3xl font-bold text-gray-900">{activeReviews}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Incident List */}
        <div className="col-span-1 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Incident Queue</h2>
          {escalatedIncidents.map((incident) => {
            const statusBadge = getStatusBadge(incident.status);
            const priorityBadge = getPriorityBadge(incident.priority);
            const isSelected = selectedIncident === incident.id;

            return (
              <div
                key={incident.id}
                onClick={() => setSelectedIncident(incident.id)}
                className={`bg-white border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${statusBadge.color}`}>
                        {statusBadge.text}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${priorityBadge.color}`}>
                        {priorityBadge.text} Priority
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{incident.title}</h3>
                    <p className="text-xs text-gray-500">ID: {incident.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  <span>{incident.createdAt}</span>
                  <span>•</span>
                  <span>{incident.createdBy}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Incident Detail View */}
        <div className="col-span-2">
          {selectedIncidentData ? (
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg">
              {/* 1. INCIDENT HEADER */}
              <div
                className={`p-5 border-b-2 ${
                  selectedIncidentData.priority === 'critical' || selectedIncidentData.priority === 'high'
                    ? 'bg-red-50 border-red-300'
                    : selectedIncidentData.priority === 'medium'
                    ? 'bg-amber-50 border-amber-300'
                    : 'bg-blue-50 border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 ${getStatusBadge(selectedIncidentData.status).color}`}
                      >
                        {getStatusBadge(selectedIncidentData.status).text}
                      </span>
                      <span
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 ${getPriorityBadge(selectedIncidentData.priority).color}`}
                      >
                        {getPriorityBadge(selectedIncidentData.priority).text} Priority
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedIncidentData.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>
                        <strong>ID:</strong> {selectedIncidentData.id}
                      </span>
                      <span>•</span>
                      <span>
                        <strong>Time:</strong> {selectedIncidentData.createdAt}
                      </span>
                      <span>•</span>
                      <span>
                        <strong>Operator:</strong> {selectedIncidentData.createdBy}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-6">
                {/* 2. INITIAL OBSERVATION (Reported) */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                    Initial Observation (Reported by Operator)
                  </h3>
                  <div className="bg-gray-50 border-l-4 border-gray-400 rounded p-4 italic text-gray-700">
                    &quot;{selectedIncidentData.operatorNotes}&quot;
                  </div>
                  <p className="text-xs text-gray-500 mt-2">⚠️ Unverified operator input - requires supervisor assessment</p>
                </div>

                {/* 3. CONTEXT & EVIDENCE */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Context & Evidence</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-xs font-medium text-gray-600 mb-2">Camera Sources</p>
                      <div className="space-y-2">
                        {selectedIncidentData.cameras.map((cam) => (
                          <button
                            key={cam}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Navigate to camera view
                            }}
                          >
                            <Camera className="w-4 h-4" />
                            {cam}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-xs font-medium text-gray-600 mb-2">Related Alerts</p>
                      <p className="text-2xl font-bold text-gray-900 mb-2">{selectedIncidentData.linkedAlerts}</p>
                      <button
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          // View alerts
                        }}
                      >
                        View Alerts →
                      </button>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-xs font-medium text-gray-600 mb-2">Available Evidence</p>
                      <p className="text-2xl font-bold text-gray-900 mb-2">{selectedIncidentData.evidenceCount} clips</p>
                      <button
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('evidence-console');
                        }}
                      >
                        Open Console →
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. SUPERVISOR DECISION PANEL */}
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-5">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                    Supervisor Decision Panel
                  </h3>

                  {selectedIncidentData.status === 'pending_classification' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Step 1: Classify Incident Type *
                        </label>
                        <select
                          value={classification}
                          onChange={(e) => setClassification(e.target.value)}
                          className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                        >
                          <option value="">Select classification...</option>
                          {incidentCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Step 2: Set Severity Level *</label>
                        <select
                          value={severity}
                          onChange={(e) => setSeverity(e.target.value)}
                          className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                        >
                          <option value="">Select severity...</option>
                          <option value="critical">Critical - Immediate response required</option>
                          <option value="high">High - Urgent attention needed</option>
                          <option value="medium">Medium - Standard priority</option>
                          <option value="low">Low - Routine handling</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Step 3: Decision Action</label>
                        <select
                          value={decisionAction}
                          onChange={(e) => setDecisionAction(e.target.value)}
                          className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                        >
                          <option value="">Select action...</option>
                          <option value="approve_escalate">Approve & Escalate to Field Units</option>
                          <option value="request_evidence">Request More Evidence</option>
                          <option value="non_incident">Mark as Non-Incident / False Alarm</option>
                        </select>
                      </div>

                      <button
                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2 transition-colors"
                        disabled={!classification || !severity}
                      >
                        <CheckCircle className="w-5 h-5" />
                        Confirm Classification
                      </button>
                    </div>
                  )}

                  {selectedIncidentData.status === 'pending_approval' && (
                    <div className="space-y-4">
                      <div className="bg-white border border-gray-300 rounded-lg p-4">
                        <p className="text-xs text-gray-600 mb-1">Suggested Classification</p>
                        <p className="text-lg font-semibold text-gray-900 capitalize">
                          {selectedIncidentData.suggestedClassification?.replace('_', ' ')}
                        </p>
                      </div>
                      <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2 transition-colors">
                        <CheckCircle className="w-5 h-5" />
                        Approve & Proceed
                      </button>
                    </div>
                  )}
                </div>

                {/* 5. SUPERVISOR ASSESSMENT */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                    Supervisor Assessment
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">Add your assessment, decision rationale, or instructions for audit trail</p>
                  <textarea
                    value={supervisorAssessment}
                    onChange={(e) => setSupervisorAssessment(e.target.value)}
                    placeholder="Enter your assessment and decision rationale..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-sm text-gray-900 focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>

                {/* 6. FIELD UNIT INSTRUCTIONS */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                    Field Unit Instructions
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">Clear, operational instructions for patrol units (Optional but recommended)</p>
                  <textarea
                    value={fieldInstructions}
                    onChange={(e) => setFieldInstructions(e.target.value)}
                    placeholder="Enter clear instructions for field units..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-sm text-gray-900 focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>

                {/* BOTTOM ACTION BAR */}
                <div className="border-t-2 border-gray-300 pt-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Evidence Actions</p>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('evidence-console');
                          }}
                          className="py-2.5 px-3 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-200 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Timeline
                        </button>
                        <button
                          className="py-2.5 px-3 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-200 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                          <Camera className="w-4 h-4" />
                          Request Footage
                        </button>
                        <button
                          className="py-2.5 px-3 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-200 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                          <Lock className="w-4 h-4" />
                          Lock Evidence
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Incident Actions</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          className="py-2.5 px-3 bg-gray-100 text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-200 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                          <Merge className="w-4 h-4" />
                          Merge Duplicate
                        </button>
                        <button
                          className="py-2.5 px-3 bg-red-600 text-white border border-red-700 rounded-lg hover:bg-red-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Close & Archive
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-gray-300 rounded-lg p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select an incident from the queue to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
