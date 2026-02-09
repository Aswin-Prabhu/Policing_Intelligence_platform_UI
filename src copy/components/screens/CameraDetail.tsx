import { useState, useRef } from 'react';
import { ArrowLeft, Camera as CameraIcon, Play, Pause, Volume2 } from 'lucide-react';
import { Camera } from './LiveGrid';

interface CameraDetailProps {
  camera: Camera | null;
  onBack: () => void;
}

export function CameraDetail({ camera, onBack }: CameraDetailProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const detections = [
    { id: 1, type: 'Person', confidence: 94, time: '10:23:45', bbox: [120, 80, 200, 300] },
    { id: 2, type: 'Vehicle', confidence: 89, time: '10:23:42', bbox: [350, 150, 500, 280] },
    { id: 3, type: 'Motorcycle', confidence: 91, time: '10:23:38', bbox: [450, 200, 550, 320] },
  ];

  // Static 24-hour timeline markers (0–24h, divided into 5 segments)
  const timelineEvents = [
    { time: '00:00', label: 'Start of Day', type: 'neutral' },
    { time: '05:00', label: '05 Hours', type: 'neutral' },
    { time: '10:00', label: '10 Hours', type: 'neutral' },
    { time: '15:00', label: '15 Hours', type: 'neutral' },
    { time: '20:00', label: '20 Hours', type: 'neutral' },
    { time: '24:00', label: 'End of Day', type: 'neutral' },
  ];

  return (
    <div className="h-full bg-[#0a0e1a] flex flex-col">
      {/* Back Button */}
      <div className="p-4 border-b border-[#1f2937]">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Grid
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Video Player */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative bg-gradient-to-br from-[#0a0e1a] to-[#0d1117] flex items-center justify-center overflow-hidden">
            {camera?.videoUrl ? (
              <video
                ref={videoRef}
                src={camera.videoUrl}
                autoPlay
                loop
                muted
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            ) : (
              <CameraIcon className="w-32 h-32 text-gray-700" />
            )}
            
            {/* Video Overlay Info */}
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-white">{camera?.id || 'CAM-NZ-042'}</p>
                <p className="text-xs text-gray-400">{camera?.zone || 'North Zone'} - Main Entrance</p>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-sm px-6 py-3 rounded-lg">
              <button 
                onClick={handlePlayPause}
                className="text-white hover:text-cyan-400 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
              <button className="text-white hover:text-cyan-400 transition-colors">
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Timeline Scrubber */}
          <div className="bg-[#0d1117] border-t border-[#1f2937] p-4">
            <div className="relative h-20">
              {/* Timeline bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#1a1f2e] rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-1/3 bg-cyan-500/30"></div>
                <div className="absolute left-1/3 top-0 w-1 h-full bg-cyan-500"></div>
              </div>

              {/* Event markers */}
              <div className="absolute top-6 left-0 right-0 flex justify-between">
                {timelineEvents.map((event, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      event.type === 'alert' ? 'bg-red-500' :
                      event.type === 'motion' ? 'bg-yellow-500' :
                      'bg-cyan-500'
                    }`}></div>
                    <span className="text-[10px] text-gray-500">{event.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-96 bg-[#0d1117] border-l border-[#1f2937] overflow-y-auto">
          {/* Camera Metadata */}
          <div className="p-4 border-b border-[#1f2937]">
            <h3 className="text-white mb-4">Camera Metadata</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Camera ID</span>
                <span className="text-white">{camera?.id || 'CAM-NZ-042'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Location</span>
                <span className="text-white">{camera?.zone || 'North Zone'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">IP Address</span>
                <span className="text-white">192.168.1.42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Resolution</span>
                <span className="text-white">1920x1080</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">FPS</span>
                <span className="text-white">30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`${
                  camera?.status === 'Live' ? 'text-green-400' :
                  camera?.status === 'degraded' ? 'text-yellow-400' :
                  'text-gray-400'
                }`}>
                  {camera?.status === 'Live' ? 'Online' : camera?.status || 'Online'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Uptime</span>
                <span className="text-white">99.8%</span>
              </div>
            </div>
          </div>

          {/* AI Detections */}
          <div className="p-4 border-b border-[#1f2937]">
            <h3 className="text-white mb-4">AI Detections</h3>
            <div className="space-y-3">
              {detections.map((detection) => (
                <div key={detection.id} className="p-3 bg-[#0a0e1a] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white">{detection.type}</span>
                    <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                      {detection.confidence}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Time: {detection.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Markers */}
          <div className="p-4">
            <h3 className="text-white mb-4">Timeline Markers</h3>
            <div className="space-y-3">
              {timelineEvents.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`w-2 h-2 mt-1 rounded-full ${
                    event.type === 'alert' ? 'bg-red-500' :
                    event.type === 'motion' ? 'bg-yellow-500' :
                    'bg-cyan-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{event.label}</p>
                    <p className="text-xs text-gray-500">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
