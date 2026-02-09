import { useState } from 'react';
import { AlertTriangle, Cpu, Sliders, Activity } from 'lucide-react';

type Severity = 'low' | 'medium' | 'high' | 'critical';

interface ModelConfig {
  id: string;
  name: string;
  aiEngine: string;
  description: string;
  minConfidence: number;
  alertLevel: Severity;
  allowedDeviation: number;
  lastUpdated: string;
}

interface Violation {
  id: string;
  violationType: string;
  severity: Severity;
  timestamp: string;
  aiEngine: string;
  detection: string;
  camera: string;
  autoAction: string;
  expectedConfidence?: number;
  actualConfidence?: number;
  expectedTime?: string;
  actualTime?: string;
  expectedBehavior?: string;
  actualBehavior?: string;
  aiDecision?: string;
  supervisorOverride?: string;
  overrideCount?: string;
}

const getSeverityColor = (severity: Severity) => {
  // Pastel badges with black text
  switch (severity) {
    case 'critical':
      return 'bg-red-100 border border-red-200';
    case 'high':
      return 'bg-orange-100 border border-orange-200';
    case 'medium':
      return 'bg-yellow-100 border border-yellow-200';
    case 'low':
    default:
      return 'bg-green-100 border border-green-200';
  }
};

export function SOPCompliance() {
  const [activeTab, setActiveTab] = useState<'config' | 'violations'>('config');

  const models: ModelConfig[] = [
    {
      id: 'AI-SOP-001',
      name: 'RakshakAI ANPR Engine',
      aiEngine: 'RKSH-ANPR-v2.3',
      description:
        'Detects and reads vehicle plates in real time across city cameras. Flags unregistered, suspicious, or blacklist matches and feeds into ANPR workflows.',
      minConfidence: 85,
      alertLevel: 'high',
      allowedDeviation: 5,
      lastUpdated: '2024-12-10 14:30 IST',
    },
    {
      id: 'AI-SOP-002',
      name: 'Intrusion Detection Model',
      aiEngine: 'RKSH-INTRUSION-v1.8',
      description:
        'Monitors perimeters and restricted zones for human or vehicle intrusions, tailgating, and fence climbing behaviours.',
      minConfidence: 90,
      alertLevel: 'medium',
      allowedDeviation: 3,
      lastUpdated: '2024-12-09 11:20 IST',
    },
  ];

  const violations: Violation[] = [
    {
      id: 'AI-VIOL-013',
      violationType: 'Low Confidence Detection Escalated by Supervisor',
      severity: 'high',
      timestamp: '2025-12-15 09:42:18 IST',
      aiEngine: 'Crowd Aggression Detector v4.0',
      detection: 'Group violence / mob aggression',
      camera: 'CAM-AZ-005 • RTC Bus Stand',
      autoAction: 'Alert pushed to operator with medium priority',
      expectedConfidence: 82,
      actualConfidence: 57,
      expectedBehavior: 'Auto-flag only when confidence ≥ 80% with 3+ aggression cues',
      actualBehavior: 'Alert triggered with low confidence and only 1 aggression cue',
      aiDecision: 'Marked as potential mob conflict',
      supervisorOverride: 'Reclassified as false positive and suppressed',
      overrideCount: '7 similar overrides in last 24 hours for this model + camera pair',
    },
    {
      id: 'AI-VIOL-017',
      violationType: 'Late Processing Beyond SOP Time Window',
      severity: 'critical',
      timestamp: '2025-12-15 08:21:03 IST',
      aiEngine: 'Weapon Detection Engine v2.8',
      detection: 'Suspected weapon brandish',
      camera: 'CAM-BZ-012 • Cinema Road Junction',
      autoAction: 'High priority alert + snapshot sent to control room',
      expectedTime: '< 500ms',
      actualTime: '1.9s',
      expectedBehavior: 'Sub-second detection and alert for weapon-like objects',
      actualBehavior: 'Detection delayed, alert reached operator after incident escalation',
      aiDecision: 'Probable weapon detected in right hand of subject',
      supervisorOverride: 'Marked as SOP breach and escalated to AI review board',
      overrideCount: '3 critical latency breaches in last 6 hours',
    },
  ];

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button className="text-xs text-black/60 hover:text-black">
            {'< Back to Admin'}
          </button>
          <div>
            <p className="text-lg font-semibold text-black">AI SOP Compliance</p>
            <p className="text-xs text-black/60">
              Configure AI model behavior standards and monitor violations and overrides.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1 rounded-full bg-green-100 border border-green-200 text-xs text-black flex items-center gap-1">
            <Activity className="w-3 h-3 text-black/70" />
            <span>3 Models Compliant</span>
          </div>
          <div className="px-3 py-1 rounded-full bg-yellow-100 border border-yellow-200 text-xs text-black flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-black/70" />
            <span>4 Active Violations</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          className={`px-4 py-2 text-sm rounded-t-lg border-b-2 ${
            activeTab === 'config'
              ? 'border-gray-800 text-black bg-white shadow-sm'
              : 'border-transparent text-black/50 hover:text-black hover:bg-white'
          }`}
          onClick={() => setActiveTab('config')}
        >
          Model SOP Configuration
        </button>
        <button
          className={`px-4 py-2 text-sm rounded-t-lg border-b-2 ${
            activeTab === 'violations'
              ? 'border-gray-800 text-black bg-white shadow-sm'
              : 'border-transparent text-black/50 hover:text-black hover:bg-white'
          }`}
          onClick={() => setActiveTab('violations')}
        >
          Violations & Overrides
        </button>
      </div>

      {/* Model configuration tab */}
      {activeTab === 'config' && (
        <div className="space-y-4">
          {models.map((model) => (
            <div
              key={model.id}
              className="bg-card border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-white border border-gray-200 shadow-sm">
                    <Sliders className="w-5 h-5 text-black/70" />
                  </div>
                  <div>
                    <p className="font-medium text-black">{model.name}</p>
                    <p className="text-xs text-black/50">
                      {model.id} • {model.aiEngine}
                    </p>
                    <p className="text-xs text-black/60 mt-1 max-w-2xl">{model.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="px-3 py-1 rounded-full bg-green-100 border border-green-200 text-black text-xs">
                    COMPLIANT
                  </div>
                  <button className="px-3 py-1 rounded-full bg-white text-black border border-gray-300 hover:bg-gray-100 flex items-center gap-1 text-xs">
                    <Cpu className="w-3 h-3 text-black/70" />
                    <span>Configure</span>
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-5">
                <div className="grid grid-cols-4 gap-6">
                  {/* Minimum confidence */}
                  <div>
                    <label className="text-xs text-black/50 block mb-2">Minimum Confidence</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm flex items-center justify-between">
                        <span className="font-mono text-sm">≥ {model.minConfidence}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-black/50 mt-1">
                      Detections below this are flagged.
                    </p>
                  </div>

                  {/* Alert level (read-only for now) */}
                  <div>
                    <label className="text-xs text-black/50 block mb-2">
                      Alert Escalation Threshold
                    </label>
                    <select
                      value={model.alertLevel}
                      disabled
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black cursor-not-allowed opacity-80"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                    <p className="text-xs text-black/50 mt-1">
                      Alerts at this level escalate to supervisor.
                    </p>
                  </div>

                  {/* Allowed deviation */}
                  <div>
                    <label className="text-xs text-black/50 block mb-2">
                      Allowed Deviation Range
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-black/50">±</span>
                      <input
                        type="number"
                        value={model.allowedDeviation}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black"
                      />
                      <span className="text-black/50">%</span>
                    </div>
                    <p className="text-xs text-black/50 mt-1">
                      Acceptable confidence variance from expected baseline.
                    </p>
                  </div>

                  {/* Last updated */}
                  <div>
                    <label className="text-xs text-black/50 block mb-2">Last SOP Update</label>
                    <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg">
                      <p className="text-sm font-mono text-black">{model.lastUpdated}</p>
                    </div>
                    <p className="text-xs text-black/50 mt-1">
                      Last time this model&apos;s SOP configuration was modified.
                    </p>
                  </div>
                </div>

                {/* Advanced metrics */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-black/70 flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <span>Expected Processing Time:</span>
                      <span className="font-mono text-black">{'< 500ms'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Max False Positive Rate:</span>
                      <span className="font-mono text-black">{'< 5%'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Retraining Trigger:</span>
                      <span className="text-black">10 supervisor overrides / day</span>
                    </div>
                    <button className="text-sm text-black hover:underline">
                      View Model History →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Violations tab */}
      {activeTab === 'violations' && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-black/70 mt-0.5" />
              <div>
                <p className="font-medium text-black mb-1">AI SOP Violations Log</p>
                <p className="text-sm text-black/70">
                  AI models that failed to meet defined standards. Includes low confidence
                  detections, late processing, over-sensitivity, and supervisor override patterns
                  indicating model drift.
                </p>
              </div>
            </div>
          </div>

          {violations.map((violation) => (
            <div
              key={violation.id}
              className="bg-card border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="w-6 h-6 text-black/70" />
                    <div>
                      <p className="font-medium text-black">{violation.violationType}</p>
                      <p className="text-xs text-black/50">Violation ID: {violation.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase text-black ${getSeverityColor(
                        violation.severity
                      )}`}
                    >
                      <p>{violation.severity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-black/50">Timestamp</p>
                      <p className="font-mono text-sm text-black">{violation.timestamp}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-xs text-black/50 mb-1">AI Engine</p>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded">
                      <p className="text-sm font-medium text-black">{violation.aiEngine}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 mb-1">Detection Type</p>
                    <p className="text-sm text-black">{violation.detection}</p>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 mb-1">Camera/Device</p>
                    <p className="text-sm text-black">{violation.camera}</p>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 mb-1">Auto Action Taken</p>
                    <p className="text-sm text-black">{violation.autoAction}</p>
                  </div>
                  <div>
                    <p className="text-xs text-black/50 mb-1">System Response</p>
                    <button className="text-sm text-black hover:underline">
                      View Logs →
                    </button>
                  </div>
                </div>

                {/* Violation details */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm">
                  <p className="text-xs text-black/50 mb-2 uppercase tracking-wider">
                    Violation Details
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {violation.expectedConfidence !== undefined &&
                      violation.actualConfidence !== undefined && (
                        <>
                          <div>
                            <p className="text-xs text-black/50">Expected Confidence</p>
                            <p className="font-mono text-black">
                              ≥ {violation.expectedConfidence}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-black/50">Actual Confidence</p>
                            <p className="text-red-600 font-mono font-bold">
                              {violation.actualConfidence}%
                            </p>
                          </div>
                        </>
                      )}

                    {violation.expectedTime && violation.actualTime && (
                      <>
                        <div>
                          <p className="text-xs text-black/50">Expected Processing Time</p>
                          <p className="font-mono text-black">{violation.expectedTime}</p>
                        </div>
                        <div>
                          <p className="text-xs text-black/50">Actual Processing Time</p>
                          <p className="text-red-600 font-mono font-bold">
                            {violation.actualTime}
                          </p>
                        </div>
                      </>
                    )}

                    {violation.expectedBehavior && violation.actualBehavior && (
                      <>
                        <div>
                          <p className="text-xs text-black/50">Expected Behavior</p>
                          <p className="text-sm text-black">{violation.expectedBehavior}</p>
                        </div>
                        <div>
                          <p className="text-xs text-black/50">Actual Behavior</p>
                          <p className="text-red-600 text-sm font-bold">
                            {violation.actualBehavior}
                          </p>
                        </div>
                      </>
                    )}

                    {violation.aiDecision && violation.supervisorOverride && (
                      <>
                        <div>
                          <p className="text-xs text-black/50">AI Decision</p>
                          <p className="text-sm text-black">{violation.aiDecision}</p>
                        </div>
                        <div>
                          <p className="text-xs text-black/50">Supervisor Override</p>
                          <p className="text-amber-700 text-sm font-bold">
                            {violation.supervisorOverride}
                          </p>
                        </div>
                      </>
                    )}

                    {violation.overrideCount && (
                      <div className="col-span-2">
                        <p className="text-xs text-black/50">Override Pattern</p>
                        <p className="text-red-700 text-sm font-bold">
                          {violation.overrideCount}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-white border-t border-gray-200 flex items-center justify-between">
                <span className="text-xs text-black/60">
                  Recommended Action:{' '}
                  <span className="font-semibold text-black">Schedule model retraining</span>
                </span>
                <button className="px-4 py-1 bg-white text-black border border-gray-300 rounded text-xs hover:bg-gray-100">
                  Add to Retraining Queue
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
