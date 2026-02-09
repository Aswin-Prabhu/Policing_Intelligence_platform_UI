import { ArrowLeft, Camera, Play, Pause, RotateCcw, Download, CheckCircle, Sliders } from 'lucide-react';

interface EvidenceSyncProps {
  onBack: () => void;
}

export function EvidenceSync({ onBack }: EvidenceSyncProps) {
  const cameras = [
    { id: 'CAM-NH-018', name: 'NH-16 Junction North', confidence: 94 },
    { id: 'CAM-NH-019', name: 'NH-16 Junction South', confidence: 89 },
    { id: 'CAM-NH-020', name: 'NH-16 East Approach', confidence: 91 },
  ];

  return (
    <div className="h-full bg-[#0a0e1a] flex flex-col">
      <div className="p-4 border-b border-[#1f2937] flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Timeline
        </button>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            Sync Settings
          </button>
          <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Multi-View
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Approve Sync
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6 gap-4">
        {/* Multi-Camera Grid */}
        <div className="flex-1 grid grid-cols-3 gap-4">
          {cameras.map((camera, idx) => (
            <div key={camera.id} className="bg-[#0d1117] border border-[#1f2937] rounded-lg overflow-hidden flex flex-col">
              <div className="p-3 border-b border-[#1f2937] flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">{camera.id}</p>
                  <p className="text-xs text-gray-500">{camera.name}</p>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 bg-cyan-500/20 rounded">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-cyan-400">SYNCED</span>
                </div>
              </div>

              <div className="flex-1 relative bg-gradient-to-br from-[#0a0e1a] to-[#0d1117] flex items-center justify-center">
                <Camera className="w-16 h-16 text-gray-700" />
                
                {/* AI Confidence Badge */}
                <div className="absolute top-3 right-3 px-3 py-1 bg-purple-500/80 backdrop-blur-sm rounded text-xs text-white">
                  AI: {camera.confidence}%
                </div>

                {/* Timestamp */}
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white font-mono">
                  10:20:{String(15 + idx * 2).padStart(2, '0')}
                </div>
              </div>

              {/* Manual Sync Adjustment */}
              <div className="p-3 border-t border-[#1f2937] bg-[#0a0e1a]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500">Sync Offset</span>
                  <span className="text-xs text-cyan-400">+{idx * 2}s</span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  defaultValue={idx * 2}
                  className="w-full h-1 bg-[#1f2937] rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: 'linear-gradient(to right, #1f2937 0%, #06b6d4 50%, #1f2937 100%)'
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Playback Controls */}
        <div className="bg-[#0d1117] border border-[#1f2937] rounded-lg p-4">
          <div className="flex items-center gap-4 mb-4">
            <button className="p-3 bg-cyan-500 rounded-lg hover:bg-cyan-600 text-white">
              <Play className="w-5 h-5" />
            </button>
            <button className="p-3 bg-[#1a1f2e] rounded-lg hover:bg-[#232936] text-white">
              <Pause className="w-5 h-5" />
            </button>
            <button className="p-3 bg-[#1a1f2e] rounded-lg hover:bg-[#232936] text-white">
              <RotateCcw className="w-5 h-5" />
            </button>

            <div className="h-8 w-px bg-[#1f2937]"></div>

            <div className="flex-1 flex items-center gap-3">
              <span className="text-white font-mono text-sm">10:20:15</span>
              <div className="flex-1 relative h-2 bg-[#1a1f2e] rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-1/3 bg-cyan-500"></div>
                <div className="absolute left-1/3 top-0 w-1 h-full bg-white"></div>
              </div>
              <span className="text-gray-500 font-mono text-sm">10:25:30</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Speed:</span>
              <select className="px-3 py-1 bg-[#1a1f2e] border border-[#1f2937] rounded text-white text-sm">
                <option>0.25x</option>
                <option>0.5x</option>
                <option selected>1.0x</option>
                <option>1.5x</option>
                <option>2.0x</option>
              </select>
            </div>
          </div>

          {/* Sync Accuracy Indicator */}
          <div className="flex items-center gap-3 text-xs">
            <span className="text-gray-500">Sync Accuracy:</span>
            <div className="flex-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((bar) => (
                <div key={bar} className={`flex-1 h-1.5 rounded ${bar <= 4 ? 'bg-green-500' : 'bg-[#1a1f2e]'}`}></div>
              ))}
            </div>
            <span className="text-green-400">96% Aligned</span>
          </div>
        </div>
      </div>
    </div>
  );
}
