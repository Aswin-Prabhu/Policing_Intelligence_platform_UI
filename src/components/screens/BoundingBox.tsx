import { ArrowLeft, Square, Trash2, Plus, Save, ZoomIn, ZoomOut } from 'lucide-react';

interface BoundingBoxProps {
  onBack: () => void;
}

export function BoundingBox({ onBack }: BoundingBoxProps) {
  return (
    <div className="h-full bg-[#0a0e1a] flex flex-col">
      <div className="p-4 border-b border-[#1f2937] flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Detection Log
        </button>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Box
          </button>
          <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </button>
          <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Corrections
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Image Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative bg-gradient-to-br from-[#0a0e1a] to-[#0d1117] flex items-center justify-center p-8">
            <div className="relative max-w-4xl max-h-full">
              {/* Image placeholder */}
              <div className="bg-[#1a1f2e] rounded-lg p-12 flex items-center justify-center">
                <div className="w-[800px] h-[600px] bg-[#0a0e1a] rounded relative">
                  {/* Sample bounding boxes */}
                  <div className="absolute top-[100px] left-[150px] w-[200px] h-[350px] border-2 border-cyan-400 rounded">
                    <div className="absolute -top-6 left-0 px-2 py-1 bg-cyan-500 text-white rounded text-xs">
                      Person (94%)
                    </div>
                    {/* Resize handles */}
                    {['nw', 'ne', 'sw', 'se'].map((pos) => (
                      <div
                        key={pos}
                        className={`absolute w-3 h-3 bg-cyan-400 rounded-full cursor-move ${
                          pos === 'nw' ? '-top-1.5 -left-1.5' :
                          pos === 'ne' ? '-top-1.5 -right-1.5' :
                          pos === 'sw' ? '-bottom-1.5 -left-1.5' :
                          '-bottom-1.5 -right-1.5'
                        }`}
                      ></div>
                    ))}
                  </div>

                  <div className="absolute top-[200px] left-[450px] w-[180px] h-[280px] border-2 border-green-400 rounded">
                    <div className="absolute -top-6 left-0 px-2 py-1 bg-green-500 text-white rounded text-xs">
                      Vehicle (89%)
                    </div>
                    {['nw', 'ne', 'sw', 'se'].map((pos) => (
                      <div
                        key={pos}
                        className={`absolute w-3 h-3 bg-green-400 rounded-full cursor-move ${
                          pos === 'nw' ? '-top-1.5 -left-1.5' :
                          pos === 'ne' ? '-top-1.5 -right-1.5' :
                          pos === 'sw' ? '-bottom-1.5 -left-1.5' :
                          '-bottom-1.5 -right-1.5'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="absolute bottom-8 right-8 flex flex-col gap-2">
              <button className="p-3 bg-[#0d1117] border border-[#1f2937] rounded-lg hover:bg-[#1a1f2e] text-white">
                <ZoomIn className="w-5 h-5" />
              </button>
              <button className="p-3 bg-[#0d1117] border border-[#1f2937] rounded-lg hover:bg-[#1a1f2e] text-white">
                <ZoomOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tools Bar */}
          <div className="bg-[#0d1117] border-t border-[#1f2937] p-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Square className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-400">Drawing Mode</span>
            </div>
            <div className="h-6 w-px bg-[#1f2937]"></div>
            <button className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 text-sm">
              Select
            </button>
            <button className="px-3 py-1.5 text-gray-400 hover:bg-white/5 rounded text-sm">
              Draw
            </button>
            <button className="px-3 py-1.5 text-gray-400 hover:bg-white/5 rounded text-sm">
              Edit
            </button>
            <button className="px-3 py-1.5 text-gray-400 hover:bg-white/5 rounded text-sm">
              Delete
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80 bg-[#0d1117] border-l border-[#1f2937] overflow-y-auto">
          <div className="p-4 border-b border-[#1f2937]">
            <h3 className="text-white">Bounding Boxes</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="bg-[#0a0e1a] border-l-4 border-cyan-400 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm">Person</span>
                <button className="text-red-400 hover:text-red-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1 text-xs text-gray-500">
                <div>Confidence: <span className="text-cyan-400">94%</span></div>
                <div>Position: (150, 100)</div>
                <div>Size: 200 × 350</div>
              </div>
              <select className="w-full mt-2 px-2 py-1 bg-[#1a1f2e] border border-[#1f2937] rounded text-white text-xs">
                <option>Person</option>
                <option>Vehicle</option>
                <option>Motorcycle</option>
                <option>Other</option>
              </select>
            </div>

            <div className="bg-[#0a0e1a] border-l-4 border-green-400 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm">Vehicle</span>
                <button className="text-red-400 hover:text-red-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1 text-xs text-gray-500">
                <div>Confidence: <span className="text-green-400">89%</span></div>
                <div>Position: (450, 200)</div>
                <div>Size: 180 × 280</div>
              </div>
              <select className="w-full mt-2 px-2 py-1 bg-[#1a1f2e] border border-[#1f2937] rounded text-white text-xs">
                <option>Vehicle</option>
                <option>Person</option>
                <option>Motorcycle</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
