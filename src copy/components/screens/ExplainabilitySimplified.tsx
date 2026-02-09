import { ArrowLeft, Cpu, User, Activity, Clock, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface ExplainabilitySimplifiedProps {
  onBack: () => void;
}

export function ExplainabilitySimplified({ onBack }: ExplainabilitySimplifiedProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'human'>('ai');
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const aiAudit = [
    {
      id: 'AI-001',
      timestamp: '2024-12-02 10:45:23',
      detection: 'License Plate AP39Z9876',
      aiEngine: 'ANPR Engine v3.1.0',
      confidence: 96,
      inputs: ['Vehicle image', 'NH-16 camera feed', 'Lighting: Good'],
      keySignals: ['Plate region detected (98%)', 'OCR successful (96%)', 'Database match found'],
      confidenceBreakdown: [
        { factor: 'Image Quality', contribution: 35 },
        { factor: 'OCR Accuracy', contribution: 40 },
        { factor: 'Database Match', contribution: 25 },
      ],
      decision: 'Critical Alert - Stolen Vehicle',
      processingTime: 142,
      thresholds: { minConfidence: 85, escalationLevel: 'critical' },
    },
    {
      id: 'AI-002',
      timestamp: '2024-12-02 10:38:15',
      detection: 'Perimeter Intrusion',
      aiEngine: 'RakshakAI v2.3.1',
      confidence: 89,
      inputs: ['Video feed CAM-WZ-055', 'Zone: B-7 Restricted', 'Motion detected'],
      keySignals: ['Person detected (92%)', 'Zone validation (100%)', 'Duration: 12 seconds'],
      confidenceBreakdown: [
        { factor: 'Object Detection', contribution: 45 },
        { factor: 'Zone Classification', contribution: 35 },
        { factor: 'Behavior Pattern', contribution: 20 },
      ],
      decision: 'High Alert - Generate Notification',
      processingTime: 245,
      thresholds: { minConfidence: 80, escalationLevel: 'high' },
    },
    {
      id: 'AI-003',
      timestamp: '2024-12-02 10:32:48',
      detection: 'Red Light Violation - TS12AB3456',
      aiEngine: 'ANPR Engine v3.1.0',
      confidence: 94,
      inputs: ['Traffic signal camera CAM-TZ-012', 'Signal state: Red', 'Vehicle crossing detected'],
      keySignals: ['Signal phase: Red (100%)', 'Vehicle entered intersection (95%)', 'Speed: 45 km/h'],
      confidenceBreakdown: [
        { factor: 'Signal Detection', contribution: 40 },
        { factor: 'Vehicle Tracking', contribution: 35 },
        { factor: 'Timing Analysis', contribution: 25 },
      ],
      decision: 'High Alert - Traffic Violation',
      processingTime: 178,
      thresholds: { minConfidence: 90, escalationLevel: 'high' },
    },
    {
      id: 'AI-004',
      timestamp: '2024-12-02 10:28:12',
      detection: 'Overspeeding - KA05CD7890',
      aiEngine: 'ANPR Engine v3.1.0',
      confidence: 91,
      inputs: ['Speed camera CAM-SZ-018', 'Speed limit: 60 km/h', 'Vehicle speed: 85 km/h'],
      keySignals: ['Speed measured: 85 km/h (98%)', 'Limit exceeded by 25 km/h', 'Plate detected (91%)'],
      confidenceBreakdown: [
        { factor: 'Speed Measurement', contribution: 50 },
        { factor: 'Plate Recognition', contribution: 30 },
        { factor: 'Vehicle Classification', contribution: 20 },
      ],
      decision: 'Medium Alert - Speed Violation',
      processingTime: 156,
      thresholds: { minConfidence: 85, escalationLevel: 'medium' },
    },
    {
      id: 'AI-005',
      timestamp: '2024-12-02 10:22:35',
      detection: 'No Helmet Detection - Two Wheeler',
      aiEngine: 'RakshakAI v2.3.1',
      confidence: 87,
      inputs: ['Camera feed CAM-NZ-042', 'Vehicle type: Motorcycle', 'Rider detected'],
      keySignals: ['Helmet absent (89%)', 'Rider head visible (92%)', 'Vehicle type confirmed (100%)'],
      confidenceBreakdown: [
        { factor: 'Helmet Detection', contribution: 50 },
        { factor: 'Person Detection', contribution: 30 },
        { factor: 'Vehicle Classification', contribution: 20 },
      ],
      decision: 'Medium Alert - Safety Violation',
      processingTime: 198,
      thresholds: { minConfidence: 80, escalationLevel: 'medium' },
    },
    {
      id: 'AI-006',
      timestamp: '2024-12-02 10:18:50',
      detection: 'Wrong Way Vehicle - TN09EF1234',
      aiEngine: 'ANPR Engine v3.1.0',
      confidence: 93,
      inputs: ['One-way road camera CAM-EZ-031', 'Direction: Eastbound only', 'Vehicle: Westbound'],
      keySignals: ['Direction mismatch (95%)', 'Plate detected (93%)', 'Road marking validation (100%)'],
      confidenceBreakdown: [
        { factor: 'Direction Analysis', contribution: 45 },
        { factor: 'Plate Recognition', contribution: 35 },
        { factor: 'Road Context', contribution: 20 },
      ],
      decision: 'High Alert - Traffic Violation',
      processingTime: 167,
      thresholds: { minConfidence: 90, escalationLevel: 'high' },
    },
    {
      id: 'AI-007',
      timestamp: '2024-12-02 10:15:22',
      detection: 'Triples on Two-Wheeler',
      aiEngine: 'RakshakAI v2.3.1',
      confidence: 88,
      inputs: ['Camera feed CAM-CZ-007', 'Vehicle: Motorcycle', 'Person count analysis'],
      keySignals: ['Person count: 3 (86%)', 'Vehicle type: Two-wheeler (100%)', 'Overload detected (90%)'],
      confidenceBreakdown: [
        { factor: 'Person Counting', contribution: 50 },
        { factor: 'Vehicle Type', contribution: 30 },
        { factor: 'Spatial Analysis', contribution: 20 },
      ],
      decision: 'Medium Alert - Safety Violation',
      processingTime: 223,
      thresholds: { minConfidence: 85, escalationLevel: 'medium' },
    },
    {
      id: 'AI-008',
      timestamp: '2024-12-02 10:12:08',
      detection: 'Parking Violation - AP01GH5678',
      aiEngine: 'ANPR Engine v3.1.0',
      confidence: 82,
      inputs: ['Parking zone camera CAM-WZ-055', 'No-parking zone', 'Vehicle stationary > 5 min'],
      keySignals: ['Duration: 8 minutes (100%)', 'Zone validation (100%)', 'Plate detected (82%)'],
      confidenceBreakdown: [
        { factor: 'Duration Tracking', contribution: 40 },
        { factor: 'Zone Classification', contribution: 35 },
        { factor: 'Plate Recognition', contribution: 25 },
      ],
      decision: 'Low Alert - Parking Violation',
      processingTime: 134,
      thresholds: { minConfidence: 75, escalationLevel: 'low' },
    },
    {
      id: 'AI-009',
      timestamp: '2024-12-02 10:08:45',
      detection: 'Weapon Detection - Public Area',
      aiEngine: 'RakshakAI v2.3.1',
      confidence: 92,
      inputs: ['Camera feed CAM-SZ-020', 'Zone: Market Square', 'Object detection'],
      keySignals: ['Weapon-like object (90%)', 'Person carrying (94%)', 'Public area (100%)'],
      confidenceBreakdown: [
        { factor: 'Object Classification', contribution: 50 },
        { factor: 'Person Detection', contribution: 30 },
        { factor: 'Context Analysis', contribution: 20 },
      ],
      decision: 'Critical Alert - Security Threat',
      processingTime: 289,
      thresholds: { minConfidence: 90, escalationLevel: 'critical' },
    },
    {
      id: 'AI-010',
      timestamp: '2024-12-02 10:05:30',
      detection: 'Fake Plate Detection - PY05A1973',
      aiEngine: 'ANPR Engine v3.1.0',
      confidence: 85,
      inputs: ['Vehicle image', 'Plate text: PY05A1973', 'Database validation'],
      keySignals: ['Plate format valid (100%)', 'Database mismatch (85%)', 'Embedding similarity: 72%'],
      confidenceBreakdown: [
        { factor: 'Format Validation', contribution: 30 },
        { factor: 'Database Match', contribution: 40 },
        { factor: 'Visual Similarity', contribution: 30 },
      ],
      decision: 'High Alert - Suspicious Vehicle',
      processingTime: 201,
      thresholds: { minConfidence: 80, escalationLevel: 'high' },
    },
    {
      id: 'AI-011',
      timestamp: '2024-12-02 10:02:15',
      detection: 'Crowd Gathering - Railway Station',
      aiEngine: 'RakshakAI v2.3.1',
      confidence: 86,
      inputs: ['Camera feed CAM-CZ-012', 'Location: Railway Station', 'Crowd density analysis'],
      keySignals: ['Person count: 45+ (88%)', 'Density threshold exceeded (85%)', 'Duration: 15 minutes'],
      confidenceBreakdown: [
        { factor: 'Crowd Counting', contribution: 45 },
        { factor: 'Density Analysis', contribution: 35 },
        { factor: 'Duration Tracking', contribution: 20 },
      ],
      decision: 'Medium Alert - Crowd Management',
      processingTime: 267,
      thresholds: { minConfidence: 80, escalationLevel: 'medium' },
    },
    {
      id: 'AI-012',
      timestamp: '2024-12-02 09:58:42',
      detection: 'Abandoned Object - Restricted Zone',
      aiEngine: 'RakshakAI v2.3.1',
      confidence: 79,
      inputs: ['Camera feed CAM-NZ-045', 'Zone: High Security', 'Object stationary > 10 min'],
      keySignals: ['Object detected (82%)', 'Duration: 12 minutes (100%)', 'Zone: Restricted (100%)'],
      confidenceBreakdown: [
        { factor: 'Object Detection', contribution: 40 },
        { factor: 'Duration Analysis', contribution: 35 },
        { factor: 'Zone Context', contribution: 25 },
      ],
      decision: 'Medium Alert - Security Concern',
      processingTime: 189,
      thresholds: { minConfidence: 75, escalationLevel: 'medium' },
    },
  ];

  const humanAudit = [
    {
      id: 'HUM-001',
      timestamp: '2024-12-02 10:46:12',
      user: 'Operator Kumar',
      role: 'Operator',
      action: 'Viewed Alert',
      target: 'ALT-2401 - License Plate Detection',
      details: 'Opened alert from dashboard notification',
      ipAddress: '10.45.12.23',
    },
    {
      id: 'HUM-002',
      timestamp: '2024-12-02 10:47:05',
      user: 'Operator Kumar',
      role: 'Operator',
      action: 'Validated Detection',
      target: 'VL-001 - AP39Z9876',
      details: 'Confirmed plate match with stolen vehicle database',
      comments: 'Plate clearly visible in image. Database match confirmed.',
      ipAddress: '10.45.12.23',
    },
    {
      id: 'HUM-003',
      timestamp: '2024-12-02 10:48:20',
      user: 'Operator Kumar',
      role: 'Operator',
      action: 'Escalated to Supervisor',
      target: 'VL-001 - Critical Violation',
      details: 'Escalated stolen vehicle detection to Supervisor Ravi',
      escalationReason: 'Critical severity - requires supervisor approval',
      ipAddress: '10.45.12.23',
    },
    {
      id: 'HUM-004',
      timestamp: '2024-12-02 10:52:45',
      user: 'Supervisor Ravi Kumar',
      role: 'Supervisor',
      action: 'Approved Violation',
      target: 'VL-001 - AP39Z9876',
      details: 'Reviewed evidence and approved violation',
      comments: 'Verified with state database. Vehicle reported stolen on 2024-11-28. Field unit notified.',
      aiDecision: 'Critical Alert',
      humanOverride: false,
      ipAddress: '10.45.8.15',
    },
    {
      id: 'HUM-005',
      timestamp: '2024-12-02 10:15:55',
      user: 'Operator Priya',
      role: 'Operator',
      action: 'Rejected Detection',
      target: 'VL-008 - TN22AB5678',
      details: 'Marked as false positive',
      comments: 'AI detected text on billboard, not a vehicle plate. Static object.',
      aiDecision: 'Medium Alert',
      humanOverride: true,
      ipAddress: '10.45.12.24',
    },
    {
      id: 'HUM-006',
      timestamp: '2024-12-02 10:17:30',
      user: 'Supervisor Priya Sharma',
      role: 'Supervisor',
      action: 'Confirmed Override',
      target: 'VL-008 - False Positive',
      details: 'Confirmed operator rejection decision',
      comments: 'Override correct. Added to AI retraining queue.',
      aiDecision: 'Medium Alert',
      humanOverride: true,
      ipAddress: '10.45.8.16',
    },
    {
      id: 'HUM-007',
      timestamp: '2024-12-02 10:33:22',
      user: 'Operator Anil',
      role: 'Operator',
      action: 'Viewed Alert',
      target: 'AI-003 - Red Light Violation',
      details: 'Opened traffic violation alert from ANPR system',
      ipAddress: '10.45.12.25',
    },
    {
      id: 'HUM-008',
      timestamp: '2024-12-02 10:34:15',
      user: 'Operator Anil',
      role: 'Operator',
      action: 'Validated Detection',
      target: 'VL-002 - TS12AB3456',
      details: 'Confirmed red light violation from video evidence',
      comments: 'Clear violation. Vehicle crossed during red signal. Video timestamp matches.',
      ipAddress: '10.45.12.25',
    },
    {
      id: 'HUM-009',
      timestamp: '2024-12-02 10:29:45',
      user: 'Operator Meera',
      role: 'Operator',
      action: 'Corrected OCR',
      target: 'VL-003 - KA05CD7890',
      details: 'Corrected plate text from OCR error',
      comments: 'AI read KA05CD7890 but actual plate is KA05CD7898. Manual correction applied.',
      aiDecision: 'Medium Alert',
      humanOverride: true,
      ipAddress: '10.45.12.26',
    },
    {
      id: 'HUM-010',
      timestamp: '2024-12-02 10:23:18',
      user: 'Operator Deepak',
      role: 'Operator',
      action: 'Viewed Alert',
      target: 'AI-005 - No Helmet Detection',
      details: 'Opened safety violation alert',
      ipAddress: '10.45.12.27',
    },
    {
      id: 'HUM-011',
      timestamp: '2024-12-02 10:24:05',
      user: 'Operator Deepak',
      role: 'Operator',
      action: 'Validated Detection',
      target: 'VL-004 - Helmet Violation',
      details: 'Confirmed no helmet violation from camera feed',
      comments: 'Rider clearly visible without helmet. Motorcycle confirmed.',
      ipAddress: '10.45.12.27',
    },
    {
      id: 'HUM-012',
      timestamp: '2024-12-02 10:19:30',
      user: 'Supervisor Ravi Kumar',
      role: 'Supervisor',
      action: 'Approved Violation',
      target: 'VL-005 - Wrong Way Vehicle',
      details: 'Approved wrong way violation after review',
      comments: 'Vehicle clearly traveling opposite direction on one-way road. Violation confirmed.',
      aiDecision: 'High Alert',
      humanOverride: false,
      ipAddress: '10.45.8.15',
    },
    {
      id: 'HUM-013',
      timestamp: '2024-12-02 10:16:45',
      user: 'Operator Sunita',
      role: 'Operator',
      action: 'Viewed Alert',
      target: 'AI-007 - Triples on Two-Wheeler',
      details: 'Opened safety violation alert',
      ipAddress: '10.45.12.28',
    },
    {
      id: 'HUM-014',
      timestamp: '2024-12-02 10:17:20',
      user: 'Operator Sunita',
      role: 'Operator',
      action: 'Validated Detection',
      target: 'VL-006 - Overload Violation',
      details: 'Confirmed three persons on motorcycle',
      comments: 'Three persons clearly visible on two-wheeler. Safety violation confirmed.',
      ipAddress: '10.45.12.28',
    },
    {
      id: 'HUM-015',
      timestamp: '2024-12-02 10:13:55',
      user: 'Supervisor Priya Sharma',
      role: 'Supervisor',
      action: 'Approved Violation',
      target: 'VL-007 - Parking Violation',
      details: 'Approved parking violation after zone verification',
      comments: 'Vehicle parked in no-parking zone for 8+ minutes. Zone boundaries verified.',
      aiDecision: 'Low Alert',
      humanOverride: false,
      ipAddress: '10.45.8.16',
    },
    {
      id: 'HUM-016',
      timestamp: '2024-12-02 10:09:12',
      user: 'Operator Kumar',
      role: 'Operator',
      action: 'Escalated to Supervisor',
      target: 'AI-009 - Weapon Detection',
      details: 'Immediately escalated weapon detection to supervisor',
      escalationReason: 'Critical security threat - requires immediate supervisor review',
      ipAddress: '10.45.12.23',
    },
    {
      id: 'HUM-017',
      timestamp: '2024-12-02 10:10:30',
      user: 'Supervisor Ravi Kumar',
      role: 'Supervisor',
      action: 'Approved Alert',
      target: 'ALT-2402 - Weapon Detection',
      details: 'Confirmed weapon detection and notified field units',
      comments: 'Weapon-like object confirmed. Person carrying object in public area. Field units dispatched immediately.',
      aiDecision: 'Critical Alert',
      humanOverride: false,
      ipAddress: '10.45.8.15',
    },
    {
      id: 'HUM-018',
      timestamp: '2024-12-02 10:06:45',
      user: 'Operator Anil',
      role: 'Operator',
      action: 'Viewed Alert',
      target: 'AI-010 - Fake Plate Detection',
      details: 'Opened suspicious vehicle alert',
      ipAddress: '10.45.12.25',
    },
    {
      id: 'HUM-019',
      timestamp: '2024-12-02 10:07:20',
      user: 'Operator Anil',
      role: 'Operator',
      action: 'Validated Detection',
      target: 'VL-008 - Suspicious Plate',
      details: 'Confirmed plate database mismatch',
      comments: 'Plate format valid but not found in database. Vehicle appearance matches different registration. Escalating.',
      ipAddress: '10.45.12.25',
    },
    {
      id: 'HUM-020',
      timestamp: '2024-12-02 10:03:30',
      user: 'Operator Meera',
      role: 'Operator',
      action: 'Viewed Alert',
      target: 'AI-011 - Crowd Gathering',
      details: 'Opened crowd management alert',
      ipAddress: '10.45.12.26',
    },
    {
      id: 'HUM-021',
      timestamp: '2024-12-02 10:04:15',
      user: 'Operator Meera',
      role: 'Operator',
      action: 'Validated Detection',
      target: 'ALT-2403 - Crowd Alert',
      details: 'Confirmed large crowd gathering at railway station',
      comments: 'Large crowd detected. Normal for peak hours. Monitoring for any disturbances.',
      ipAddress: '10.45.12.26',
    },
    {
      id: 'HUM-022',
      timestamp: '2024-12-02 09:59:55',
      user: 'Supervisor Priya Sharma',
      role: 'Supervisor',
      action: 'Approved Alert',
      target: 'ALT-2404 - Abandoned Object',
      details: 'Approved security alert for abandoned object',
      comments: 'Object stationary in restricted zone for 12+ minutes. Security team notified for inspection.',
      aiDecision: 'Medium Alert',
      humanOverride: false,
      ipAddress: '10.45.8.16',
    },
    {
      id: 'HUM-023',
      timestamp: '2024-12-02 10:28:30',
      user: 'Operator Deepak',
      role: 'Operator',
      action: 'Added Evidence',
      target: 'VL-002 - Red Light Violation',
      details: 'Tagged additional camera footage as evidence',
      comments: 'Added side-angle camera footage showing clear violation.',
      ipAddress: '10.45.12.27',
    },
    {
      id: 'HUM-024',
      timestamp: '2024-12-02 10:35:10',
      user: 'Supervisor Ravi Kumar',
      role: 'Supervisor',
      action: 'Closed Incident',
      target: 'INC-2024-1156',
      details: 'Closed incident after field unit response',
      comments: 'Field unit responded. Vehicle towed. Incident resolved. Evidence locked.',
      ipAddress: '10.45.8.15',
    },
  ];

  return (
    <div className="h-full bg-background overflow-auto">
      <div className="max-w-[1600px] mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-3">
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Explainability & Audit Trail</h1>
                <p className="text-muted-foreground text-sm">Simplified AI reasoning and complete human action log</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-6 py-3 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'ai' 
                ? 'bg-blue-500 text-white shadow-sm' 
                : 'bg-card text-muted-foreground border border-border hover:border-blue-500/50 hover:bg-card/80'
            }`}
          >
            <Cpu className="w-4 h-4" />
            AI Decision Trail
          </button>
          <button
            onClick={() => setActiveTab('human')}
            className={`px-6 py-3 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'human' 
                ? 'bg-blue-500 text-white shadow-sm' 
                : 'bg-card text-muted-foreground border border-border hover:border-blue-500/50 hover:bg-card/80'
            }`}
          >
            <User className="w-4 h-4" />
            Human Audit Trail
          </button>
        </div>

      {activeTab === 'ai' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-900">
              🤖 AI Decision Trail shows how the AI arrived at each detection decision, including inputs, key signals, and confidence breakdown.
            </p>
          </div>

          {aiAudit.map((entry) => (
            <div key={entry.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-md transition-all card-shadow">
              <div className="p-5 cursor-pointer" onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{entry.detection}</p>
                      <p className="text-xs text-muted-foreground">{entry.aiEngine}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground text-right">Timestamp</p>
                      <p className="font-mono text-sm">{entry.timestamp}</p>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground">
                      {expandedEntry === entry.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">AI Confidence</p>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${entry.confidence}%` }} />
                        </div>
                        <span className="text-blue-600 font-bold">{entry.confidence}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Processing Time</p>
                      <p className="font-mono">{entry.processingTime}ms</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Final Decision</p>
                    <p className="text-green-600 font-medium">{entry.decision}</p>
                  </div>
                </div>
              </div>

              {expandedEntry === entry.id && (
                <div className="border-t border-border bg-muted/30 p-5 space-y-5">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">AI Inputs</p>
                    <div className="grid grid-cols-3 gap-2">
                      {entry.inputs.map((input, idx) => (
                        <div key={idx} className="px-3 py-2 bg-blue-50 border border-blue-200 rounded text-sm">
                          {input}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Key Signals Detected</p>
                    <div className="space-y-2">
                      {entry.keySignals.map((signal, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>{signal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Confidence Contribution</p>
                    <div className="space-y-3">
                      {entry.confidenceBreakdown.map((factor) => (
                        <div key={factor.factor}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">{factor.factor}</span>
                            <span className="text-sm text-blue-600 font-bold">{factor.contribution}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: `${factor.contribution}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Model Version</p>
                      <p className="text-sm">{entry.aiEngine}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Thresholds Used</p>
                      <p className="text-sm">
                        Min: {entry.thresholds.minConfidence}% • Level: {entry.thresholds.escalationLevel}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'human' && (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-purple-900">
              👤 Human Audit Trail shows who viewed, validated, or overrode AI decisions, with timestamps and rationale.
            </p>
          </div>

          {humanAudit.map((entry) => (
            <div
              key={entry.id}
              className={`bg-card border rounded-xl overflow-hidden transition-all card-shadow ${
                entry.humanOverride ? 'border-orange-300 hover:border-orange-400' : 'border-border hover:border-green-400'
              }`}
            >
              <div className={`p-5 ${entry.humanOverride ? 'bg-orange-50/50' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${entry.role === 'Supervisor' ? 'bg-green-100' : 'bg-blue-100'}`}>
                      <User className={`w-5 h-5 ${entry.role === 'Supervisor' ? 'text-green-600' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium">{entry.user}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs ${entry.role === 'Supervisor' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {entry.role}
                        </span>
                        <span className="text-xs text-muted-foreground">• {entry.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Clock className="w-3 h-3" />
                      <span>{entry.timestamp}</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-xs font-bold ${
                        entry.action.includes('Approved') || entry.action.includes('Validated')
                          ? 'bg-green-100 text-green-700'
                          : entry.action.includes('Rejected') || entry.action.includes('Override')
                          ? 'bg-red-100 text-red-700'
                          : entry.action.includes('Escalated')
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {entry.action.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Target</p>
                    <p className="text-sm font-medium">{entry.target}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Action Details</p>
                    <p className="text-sm">{entry.details}</p>
                  </div>
                  {entry.comments && (
                    <div className="bg-muted/50 border border-border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Remarks</p>
                      <p className="text-sm italic">&quot;{entry.comments}&quot;</p>
                    </div>
                  )}
                  {entry.escalationReason && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-xs text-orange-700 mb-1 font-medium">Escalation Reason</p>
                      <p className="text-sm">{entry.escalationReason}</p>
                    </div>
                  )}
                  {entry.humanOverride && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-2">
                      <Eye className="w-4 h-4 text-orange-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-orange-700 mb-1 font-medium">Human Override Detected</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">AI Decision: </span>
                            <span>{entry.aiDecision}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Human Action: </span>
                            <span className="text-orange-600 font-medium">{entry.action}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

