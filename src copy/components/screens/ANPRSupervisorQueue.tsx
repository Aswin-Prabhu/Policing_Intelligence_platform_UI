import { useState } from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, Clock, Shield, ImageOff, AlertCircle } from 'lucide-react';

// Import ANPR images
import anpr1 from '../../assets/anpr_images/anpr_1.jpg';
import anpr2 from '../../assets/anpr_images/anpr_2.jpg';
import anpr3 from '../../assets/anpr_images/anpr_3.jpg';
import anpr4 from '../../assets/anpr_images/anpr_4.jpg';

interface ANPRSupervisorQueueProps {
  onBack: () => void;
  supervisorName?: string; // Name of the logged-in supervisor
}

interface ViolationDecision {
  decision: string;
  remarks: string;
  action: 'approved' | 'rejected';
  processedBy: string;
  processedAt: string;
}

export function ANPRSupervisorQueue({ onBack, supervisorName = 'Administrator' }: ANPRSupervisorQueueProps) {
  const [decisions, setDecisions] = useState<Record<string, ViolationDecision>>({});
  const [formData, setFormData] = useState<Record<string, { decision: string; remarks: string }>>({});
  const escalatedViolations = [
    {
      id: 'VL-001',
      plate: 'AP39Z9876',
      image: anpr1,
      confidence: 96,
      time: '10:23:45',
      location: 'NH-16 Junction',
      violation: 'Stolen Vehicle Match',
      severity: 'critical',
      escalatedBy: 'Operator Kumar',
      escalatedTime: '10:25:12',
      reason: 'Vehicle in national stolen database',
      operatorNotes: 'Plate matches stolen vehicle report #ST-2024-1156. Immediate action recommended.',
    },
    {
      id: 'VL-008',
      plate: 'KL14RS1357',
      image: anpr2,
      confidence: 93,
      time: '09:38:42',
      location: 'Highway Entry',
      violation: 'Wanted Vehicle',
      severity: 'critical',
      escalatedBy: 'Operator Priya',
      escalatedTime: '09:40:15',
      reason: 'Associated with pending court case',
      operatorNotes: 'Vehicle registered in pending investigation case.',
    },
    {
      id: 'VL-012',
      plate: 'AP16ZZ8910',
      image: anpr3,
      confidence: 88,
      time: '09:15:22',
      location: 'Port Area Gate',
      violation: 'Unauthorized Entry - Restricted Zone',
      severity: 'high',
      escalatedBy: 'Operator Ravi',
      escalatedTime: '09:17:45',
      reason: 'No valid port access permit',
      operatorNotes: 'Vehicle entered restricted port area without proper authorization.',
    },
    {
      id: 'VL-015',
      plate: 'TN09AB4567',
      image: anpr4,
      confidence: 91,
      time: '08:52:18',
      location: 'Beach Road',
      violation: 'Repeated Red Light Violation',
      severity: 'high',
      escalatedBy: 'Operator Kumar',
      escalatedTime: '08:55:30',
      reason: '3rd violation in 2 hours',
      operatorNotes: 'Same vehicle detected violating traffic signals at 3 different junctions within 2 hours.',
    },
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 border border-red-200';
      case 'high':
        return 'bg-orange-100 border border-orange-200';
      default:
        return 'bg-yellow-100 border border-yellow-200';
    }
  };

  const handleDecisionChange = (violationId: string, decision: string) => {
    setFormData(prev => ({
      ...prev,
      [violationId]: {
        ...prev[violationId],
        decision,
        remarks: prev[violationId]?.remarks || ''
      }
    }));
  };

  const handleRemarksChange = (violationId: string, remarks: string) => {
    setFormData(prev => ({
      ...prev,
      [violationId]: {
        ...prev[violationId],
        decision: prev[violationId]?.decision || '',
        remarks
      }
    }));
  };

  const handleApprove = (violationId: string) => {
    const form = formData[violationId];
    if (!form || !form.decision || form.decision === 'Select Action' || !form.remarks.trim()) {
      alert('Please select a decision and enter mandatory remarks before approving.');
      return;
    }

    const decision: ViolationDecision = {
      decision: form.decision,
      remarks: form.remarks,
      action: 'approved',
      processedBy: supervisorName,
      processedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setDecisions(prev => ({ ...prev, [violationId]: decision }));
  };

  const handleReject = (violationId: string) => {
    const form = formData[violationId];
    if (!form || !form.decision || form.decision === 'Select Action' || !form.remarks.trim()) {
      alert('Please select a decision and enter mandatory remarks before rejecting.');
      return;
    }

    const decision: ViolationDecision = {
      decision: form.decision,
      remarks: form.remarks,
      action: 'rejected',
      processedBy: supervisorName,
      processedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setDecisions(prev => ({ ...prev, [violationId]: decision }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-black/60 hover:text-black transition-colors mb-3"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to ANPR List
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 border border-red-200 rounded-lg">
              <Shield className="w-6 h-6 text-black/70" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-black">Supervisor Escalation Queue</h1>
              <p className="text-sm text-black/60">
                Critical & high-severity violations requiring immediate supervisor decision
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-red-100 border border-red-200 rounded-lg text-right">
            <p className="text-xs text-black/60">Critical Pending</p>
            <p className="text-xl font-semibold text-black">2</p>
          </div>
          <div className="px-4 py-2 bg-orange-100 border border-orange-200 rounded-lg text-right">
            <p className="text-xs text-black/60">High Priority</p>
            <p className="text-xl font-semibold text-black">2</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {escalatedViolations.map((violation) => (
          <div
            key={violation.id}
            className="bg-card border border-border rounded-xl overflow-hidden transition-all hover:shadow-md"
          >
            <div
              className={`p-4 border-b border-border/60 ${
                violation.severity === 'critical'
                  ? 'bg-gradient-to-r from-red-50 to-white'
                  : 'bg-gradient-to-r from-orange-50 to-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <AlertTriangle
                    className="w-6 h-6 text-black/70"
                  />
                  <div>
                    <p className="text-lg font-semibold text-black">{violation.violation}</p>
                    <p className="text-xs text-black/50">Violation ID: {violation.id}</p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-lg text-xs font-medium uppercase tracking-wider text-black ${getSeverityBadge(violation.severity)}`}>
                  <p className="text-xs uppercase tracking-wider">{violation.severity}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4">
              <div className="space-y-3">
                <p className="text-xs text-black/50 uppercase tracking-wider">Vehicle Snapshot</p>
                <div className="h-48 bg-[#111827] border border-border/60 rounded-lg overflow-hidden relative">
                  {(violation as any).image ? (
                    // Show ANPR image
                    <img 
                      src={(violation as any).image} 
                      alt={`Vehicle ${violation.plate}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    // Fallback placeholder if no image
                    <div className="w-full h-full flex items-center justify-center relative">
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.05) 8px, rgba(255,255,255,0.05) 16px)'
                        }}></div>
                      </div>
                      <div className="relative z-10 text-center px-4">
                        <div className="relative inline-block mb-3">
                          <ImageOff className="w-10 h-10 text-gray-600 mx-auto" />
                          <AlertCircle className="w-4 h-4 text-orange-400 absolute -top-0.5 -right-0.5" fill="currentColor" />
                        </div>
                        <p className="text-black/70 text-xs font-medium mb-1">Snapshot Unavailable</p>
                        <p className="text-black/50 text-[10px] mb-3">Image not available at this time</p>
                        <p className="text-white font-mono text-lg tracking-wider">{violation.plate}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black/60">AI Confidence</span>
                    <span className="font-semibold text-black">{violation.confidence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/60">Detection Time</span>
                    <span className="font-mono text-black">{violation.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/60">Location</span>
                    <span className="text-black">{violation.location}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-black/50 uppercase tracking-wider">Escalation Information</p>
                <div className="bg-white border border-border/60 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-xs text-black/50">Escalated By</p>
                    <p className="text-sm text-black">{violation.escalatedBy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-black/50">Escalation Time</p>
                    <p className="text-sm font-mono text-black">{violation.escalatedTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-black/50">Escalation Reason</p>
                    <p className="text-sm text-black">{violation.reason}</p>
                  </div>
                  <div className="pt-3 border-t border-border/60">
                    <p className="text-xs text-black/50 mb-2">Operator Notes</p>
                    <p className="text-sm text-black/70 italic">"{violation.operatorNotes}"</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-black/50 uppercase tracking-wider">Supervisor Decision</p>
                {decisions[violation.id] ? (
                  // Show decision result
                  <div className={`border border-border/60 rounded-lg p-4 space-y-3 ${
                    decisions[violation.id].action === 'approved' 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-3">
                      {decisions[violation.id].action === 'approved' ? (
                        <CheckCircle className="w-5 h-5 text-black/70" />
                      ) : (
                        <XCircle className="w-5 h-5 text-black/70" />
                      )}
                      <p className={`text-sm font-semibold ${
                        decisions[violation.id].action === 'approved' ? 'text-black' : 'text-black'
                      }`}>
                        {decisions[violation.id].action === 'approved' ? 'APPROVED' : 'REJECTED'}
                      </p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-xs text-black/50">Processed By</p>
                        <p className="text-sm text-black">{decisions[violation.id].processedBy}</p>
                      </div>
                      <div>
                        <p className="text-xs text-black/50">Decision</p>
                        <p className="text-sm text-black">{decisions[violation.id].decision}</p>
                      </div>
                      <div>
                        <p className="text-xs text-black/50">Remarks</p>
                        <p className="text-sm text-black/70">{decisions[violation.id].remarks}</p>
                      </div>
                      <div>
                        <p className="text-xs text-black/50">Processed At</p>
                        <p className="text-sm font-mono text-black">{decisions[violation.id].processedAt}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Show decision form
                  <div className="bg-white border border-border/60 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="text-xs text-black/50 block mb-2">Decision</label>
                      <select 
                        value={formData[violation.id]?.decision || 'Select Action'}
                        onChange={(e) => handleDecisionChange(violation.id, e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-border/60 rounded-lg text-sm text-black focus:border-blue-400 focus:outline-none"
                      >
                        <option>Select Action</option>
                        <option>Approve Violation</option>
                        <option>Reject - False Positive</option>
                        <option>Escalate to ACP</option>
                        <option>Request Field Verification</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-black/50 block mb-2">Supervisor Remarks (Mandatory)</label>
                      <textarea
                        value={formData[violation.id]?.remarks || ''}
                        onChange={(e) => handleRemarksChange(violation.id, e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-border/60 rounded-lg text-sm text-black resize-none focus:border-blue-400 focus:outline-none"
                        rows={4}
                        placeholder="Add your decision rationale and any additional observations..."
                      />
                    </div>
                    <div className="pt-3 border-t border-border/60 space-y-2">
                      <button 
                        onClick={() => handleApprove(violation.id)}
                        className="w-full py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 flex items-center justify-center gap-2 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve & Process
                      </button>
                      <button 
                        onClick={() => handleReject(violation.id)}
                        className="w-full py-2 bg-white text-black border border-red-300 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject Violation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-3 bg-white border-t border-border/60 flex items-center justify-between text-xs text-black/60">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Pending for: {Math.floor((Date.now() - new Date().setHours(9, 40, 0)) / 60000)} minutes</span>
                </div>
              </div>
              <button className="font-medium text-black hover:underline">View Full Vehicle History →</button>
            </div>
          </div>
        ))}
      </div>

      {escalatedViolations.length === 0 && (
        <div className="text-center py-16">
          <CheckCircle className="w-16 h-16 text-black/60 mx-auto mb-4" />
          <p className="text-lg font-semibold text-black">No Escalated Violations</p>
          <p className="text-sm text-black/60 mt-2">All critical violations have been processed</p>
        </div>
      )}
    </div>
  );
}

