import { ArrowLeft, Video, Battery, Signal, MapPin, Heart, Thermometer, Activity } from 'lucide-react';

interface BodycamDetailProps {
  onBack: () => void;
}

export function BodycamDetail({ onBack }: BodycamDetailProps) {
  return (
    <div className="h-full bg-[#0a0e1a] flex flex-col">
      <div className="p-4 border-b border-[#1f2937]">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Grid
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Live Feed */}
        <div className="flex-1 relative bg-gradient-to-br from-[#0a0e1a] to-[#0d1117] flex items-center justify-center">
          <Video className="w-32 h-32 text-gray-700" />
          
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg">
            <p className="text-white">Officer Sharma</p>
            <p className="text-xs text-gray-400">Badge: BD-1001 • OFF-002</p>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 px-3 py-2 rounded-lg">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm text-white">LIVE RECORDING</span>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-96 bg-[#0d1117] border-l border-[#1f2937] overflow-y-auto">
          {/* Officer Card */}
          <div className="p-4 border-b border-[#1f2937]">
            <h3 className="text-white mb-4">Officer Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[#0a0e1a] rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white">
                  RS
                </div>
                <div>
                  <p className="text-white">Officer Sharma</p>
                  <p className="text-xs text-gray-500">Badge: BD-1001</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Officer ID</span>
                  <span className="text-white">OFF-002</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shift</span>
                  <span className="text-white">Day Patrol</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duty Start</span>
                  <span className="text-white">08:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="text-green-400">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="p-4 border-b border-[#1f2937]">
            <h3 className="text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              Current Location
            </h3>
            <div className="bg-[#0a0e1a] rounded-lg p-4 space-y-3">
              <div className="aspect-video bg-[#1a1f2e] rounded flex items-center justify-center">
                <MapPin className="w-12 h-12 text-gray-700" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Area</span>
                  <span className="text-white">Patrolling NH-16</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Coordinates</span>
                  <span className="text-cyan-400">16.9891°N, 82.2475°E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Update</span>
                  <span className="text-white">2 min ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Health Indicators */}
          <div className="p-4">
            <h3 className="text-white mb-4">Health Indicators</h3>
            <div className="space-y-3">
              <div className="p-3 bg-[#0a0e1a] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Battery className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-white">Battery</span>
                  </div>
                  <span className="text-green-400">87%</span>
                </div>
                <div className="h-2 bg-[#1a1f2e] rounded-full overflow-hidden">
                  <div className="h-full w-[87%] bg-green-500 rounded-full"></div>
                </div>
              </div>

              <div className="p-3 bg-[#0a0e1a] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Signal className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-white">Signal Strength</span>
                  </div>
                  <span className="text-cyan-400">Excellent</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((bar) => (
                    <div key={bar} className={`flex-1 h-2 rounded ${bar <= 4 ? 'bg-cyan-500' : 'bg-[#1a1f2e]'}`}></div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#0a0e1a] rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-white">Heart Rate</span>
                  </div>
                  <span className="text-white">78 bpm</span>
                </div>
              </div>

              <div className="p-3 bg-[#0a0e1a] rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-orange-400" />
                    <span className="text-sm text-white">Device Temp</span>
                  </div>
                  <span className="text-white">42°C</span>
                </div>
              </div>

              <div className="p-3 bg-[#0a0e1a] rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-white">Recording Time</span>
                  </div>
                  <span className="text-white">2h 14m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
