import { ArrowLeft, Play, Scissors, Tag, Lock, CheckCircle, Camera, Plane, Video, Clock, Plus, Trash2, Download } from 'lucide-react';
import { useState } from 'react';

interface EvidenceConsoleProps {
  onBack: () => void;
  userRole: 'operator' | 'supervisor' | 'admin';
}

export function EvidenceConsole({ onBack, userRole }: EvidenceConsoleProps) {
  const [selectedIncident, setSelectedIncident] = useState('INC-2024-1156');

  const timelineClips = [
    { id: 'CLIP-001', source: 'CAM-NZ-042', type: 'CCTV', startTime: '09:15:23', endTime: '09:18:45', duration: '3:22', status: 'added' },
    { id: 'CLIP-002', source: 'CAM-NZ-045', type: 'CCTV', startTime: '09:16:10', endTime: '09:19:30', duration: '3:20', status: 'added' },
    { id: 'CLIP-003', source: 'DRONE-02', type: 'Aerial', startTime: '09:17:00', endTime: '09:20:15', duration: '3:15', status: 'pending' },
  ];

  const annotations = [
    { id: 'ANN-001', timestamp: '09:16:45', type: 'Person of Interest', description: 'Individual A photographing infrastructure', addedBy: 'Supervisor Ravi' },
    { id: 'ANN-002', timestamp: '09:17:20', type: 'Vehicle', description: 'White sedan AP05C1234 parked nearby', addedBy: 'Supervisor Ravi' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-black/60 hover:text-black transition-colors mb-3">
            <ArrowLeft className="w-5 h-5" />
            Back to Incidents
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 border border-gray-200 rounded-lg">
              <Video className="w-6 h-6 text-black/70" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-black">Evidence Console – Timeline Builder</h1>
              <p className="text-sm text-black/60">Multi-camera evidence alignment and annotation • Supervisor Only</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {userRole === 'supervisor' && (
            <>
              <button className="px-4 py-2 bg-gray-50 text-black border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center gap-2 text-sm">
                <Lock className="w-4 h-4" />
                Lock Evidence
              </button>
              <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4" />
                Approve & Archive
              </button>
            </>
          )}
        </div>
      </div>

      {userRole !== 'supervisor' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-black">⚠️ Evidence Console is supervisor-only. Operators can view but not create or modify evidence.</p>
        </div>
      )}

      <div className="bg-card border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-black/50 block mb-2">Select Incident</label>
            <select
              value={selectedIncident}
              onChange={(e) => setSelectedIncident(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black"
              disabled={userRole !== 'supervisor'}
            >
              <option value="INC-2024-1156">INC-2024-1156 - Suspicious Activity</option>
              <option value="INC-2024-1153">INC-2024-1153 - Vehicle Theft Attempt</option>
              <option value="INC-2024-1148">INC-2024-1148 - Perimeter Breach</option>
            </select>
          </div>
          <div>
            <p className="text-xs text-black/50 mb-1">Incident Date</p>
            <p className="text-sm text-black">2024-12-02</p>
          </div>
          <div>
            <p className="text-xs text-black/50 mb-1">Time Window</p>
            <p className="font-mono text-sm text-black">09:15:23 - 09:20:15</p>
          </div>
          <div>
            <p className="text-xs text-black/50 mb-1">Clips in Timeline</p>
            <p className="text-xl font-semibold text-black">{timelineClips.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-card border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="flex items-center gap-2 text-black">
                <Play className="w-5 h-5 text-black" />
                Multi-Camera Timeline
              </h3>
            </div>
            <div className="p-5">
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <div className="relative h-40">
                  <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-black/50 font-mono mb-2">
                    <span>09:15:00</span>
                    <span>09:16:00</span>
                    <span>09:17:00</span>
                    <span>09:18:00</span>
                    <span>09:19:00</span>
                    <span>09:20:00</span>
                  </div>
                  <div className="absolute top-6 left-0 right-0 bottom-0 space-y-2">
                    {timelineClips.map((clip) => (
                      <div key={clip.id} className="relative h-10">
                        <div className="absolute top-0 h-full flex items-center">
                          <div className="flex items-center gap-2 mr-3">
                            {clip.type === 'CCTV' && <Camera className="w-4 h-4 text-black/60" />}
                            {clip.type === 'Aerial' && <Plane className="w-4 h-4 text-black/60" />}
                            <span className="text-xs text-black/70 w-24">{clip.source}</span>
                          </div>
                          <div
                            className={`h-8 rounded px-3 flex items-center justify-between ${
                              clip.status === 'added' ? 'bg-gray-200 text-white' : 'bg-gray-100 text-black border border-gray-300'
                            }`}
                            style={{ width: '200px' }}
                          >
                            <span className="text-xs font-mono">{clip.duration}</span>
                            {userRole === 'supervisor' && (
                              <button className="text-white hover:text-red-400">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {userRole === 'supervisor' && (
                <button className="w-full py-2 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2 text-sm">
                  <Plus className="w-4 h-4" />
                  Add Clip from Raw Footage
                </button>
              )}
            </div>
          </div>

          <div className="bg-card border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-black">
                  <Tag className="w-5 h-5 text-black" />
                  Annotations & Markers
                </h3>
                {userRole === 'supervisor' && (
                  <button className="px-3 py-1 bg-white text-black border border-gray-300 rounded text-sm hover:bg-gray-100">
                    Add Annotation
                  </button>
                )}
              </div>
            </div>
            <div className="p-4 space-y-3">
              {annotations.map((ann) => (
                <div key={ann.id} className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-black/60" />
                      <span className="font-mono text-sm text-black">{ann.timestamp}</span>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-black">{ann.type}</span>
                  </div>
                  <p className="text-sm text-black mb-2">{ann.description}</p>
                  <p className="text-xs text-black/60">Added by: {ann.addedBy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="flex items-center gap-2 text-sm text-black">
                <Scissors className="w-4 h-4 text-black" />
                Available Sources
              </h3>
            </div>
            <div className="p-3 space-y-2">
              {['CAM-NZ-042', 'CAM-NZ-045', 'DRONE-02', 'BODYCAM-OFF-12'].map((source) => (
                <div key={source} className="bg-white border border-gray-200 rounded-lg p-2 hover:border-gray-400 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {source.startsWith('CAM') && <Camera className="w-3 h-3 text-black/60" />}
                      {source.startsWith('DRONE') && <Plane className="w-3 h-3 text-black/60" />}
                      {source.startsWith('BODYCAM') && <Video className="w-3 h-3 text-black/60" />}
                      <span className="text-xs text-black">{source}</span>
                    </div>
                    {userRole === 'supervisor' && <button className="text-xs text-black hover:underline">Add →</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm text-black">
              <CheckCircle className="w-4 h-4 text-black/70" />
              Evidence Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black/60">Total Clips:</span>
                <span className="font-bold text-black">{timelineClips.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Total Duration:</span>
                <span className="font-bold text-black">9:57</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Annotations:</span>
                <span className="font-bold text-black">{annotations.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/60">Status:</span>
                <span className="font-bold text-black">DRAFT</span>
              </div>
            </div>

            {userRole === 'supervisor' && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <button className="w-full py-2 bg-white text-black border border-gray-300 rounded hover:bg-gray-100 flex items-center justify-center gap-2 text-sm">
                  <Download className="w-4 h-4" />
                  Export Preview
                </button>
                <button className="w-full py-2 bg-black text-white rounded hover:bg-gray-900 flex items-center justify-center gap-2 text-sm">
                  <Lock className="w-4 h-4" />
                  Lock & Approve
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {userRole === 'supervisor' && (
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-5">
          <h4 className="mb-3 text-black font-semibold">Evidence Console Workflow</h4>
          <div className="grid grid-cols-2 gap-6 text-sm text-black/70">
            <div>
              <p className="mb-2 font-medium text-black">📋 Steps</p>
              <ol className="text-xs space-y-1 list-decimal list-inside">
                <li>Select incident from dropdown</li>
                <li>Add relevant clips from available sources</li>
                <li>Align clips on timeline</li>
                <li>Add annotations and markers</li>
                <li>Review and export preview</li>
                <li>Lock evidence (cannot be modified after locking)</li>
                <li>Approve and move to evidence archive</li>
              </ol>
            </div>
            <div>
              <p className="mb-2 font-medium text-black">⚠️ Important</p>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>Once locked, evidence cannot be edited</li>
                <li>All clips must be from the incident time window</li>
                <li>Chain of custody is automatically logged</li>
                <li>Exported evidence includes metadata and annotations</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

