import { Plane, MapPin, Gauge, Wind, Radio, Camera, Thermometer, Eye } from 'lucide-react';
import { useRef, useEffect } from 'react';
import DroneMap from '../DroneMap';

// Import drone videos
import droneVideo1 from '../../assets/videos/29594-376565656.mp4';
import droneVideo2 from '../../assets/videos/103308-662114654_small.mp4';
import droneVideo3 from '../../assets/videos/103723-664328178.mp4';

interface DroneMissionsProps {
  onNavigate: (screen: string, data?: any) => void;
}

interface Mission {
  id: string;
  droneId: string;
  operator: string;
  mission: string;
  status: string;
  altitude: number;
  speed: number;
  heading: string;
  battery: number;
  gps: { lat: number; lng: number };
  cameraMode: string;
  detections: string[];
  duration: string;
}

interface MissionCardProps {
  mission: Mission;
  videoSource: string;
  getStatusColor: (status: string) => string;
  getBatteryColor: (battery: number) => string;
}

function MissionCard({ mission, videoSource, getStatusColor, getBatteryColor }: MissionCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.src = videoSource;
      video.play().catch(err => console.error('Video play error:', err));
    }
  }, [videoSource]);

  return (
    <div className="bg-card border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-400 transition-all">
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Video Feed */}
        <div className="col-span-1">
          <div className="bg-black aspect-video rounded-lg border border-gray-300 relative overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 text-xs bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1 z-10">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE
            </div>
            <div className="absolute top-2 right-2 text-xs bg-white/70 text-white px-2 py-1 rounded z-10">
              {mission.cameraMode}
            </div>
            <div className="absolute bottom-2 left-2 text-xs text-black bg-white/70 px-2 py-1 rounded z-10">
              {mission.droneId} • {mission.duration}
            </div>
          </div>

          {/* Camera Controls */}
          <div className="mt-2 flex gap-2">
            <button className="flex-1 px-3 py-2 bg-white border border-gray-300 text-black rounded text-xs hover:bg-gray-100 transition-colors">
              RGB
            </button>
            <button className="flex-1 px-3 py-2 bg-white border border-gray-300 text-black rounded text-xs hover:bg-gray-100 transition-colors">
              Zoom
            </button>
            <button className="flex-1 px-3 py-2 bg-white border border-gray-300 text-black rounded text-xs hover:bg-gray-100 transition-colors">
              Thermal
            </button>
          </div>
        </div>

        {/* Middle: Telemetry */}
        <div className="col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-black/60">Mission ID</span>
            <span className="text-sm text-black">{mission.id}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-black/60">Status</span>
            <span className={`text-xs px-2 py-1 rounded-full text-black ${getStatusColor(mission.status)}`}>
              {mission.status}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-black/60 flex items-center gap-2">
              <Plane className="w-4 h-4" />
              Drone ID
            </span>
            <span className="text-sm font-medium text-black">{mission.droneId}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-black/60 flex items-center gap-2">
              <Radio className="w-4 h-4" />
              Operator
            </span>
            <span className="text-xs text-black">{mission.operator}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-black/60 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Mission
            </span>
            <span className="text-xs text-black">{mission.mission}</span>
          </div>

          <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-black/60 flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Altitude
              </span>
              <span className="text-sm font-medium text-black">{mission.altitude}m</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-black/60 flex items-center gap-2">
                <Wind className="w-4 h-4" />
                Speed
              </span>
              <span className="text-sm text-black">{mission.speed} km/h</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-black/60">Heading</span>
              <span className="text-sm text-black">{mission.heading}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-black/60">Battery</span>
              <span className={getBatteryColor(mission.battery)}>{mission.battery}%</span>
            </div>
          </div>
        </div>

        {/* Right: Map & AI Detections */}
        <div className="col-span-1 space-y-3">
          {/* GPS Map */}
          <div className="bg-black aspect-square rounded-lg border border-gray-300 relative overflow-hidden">
            <DroneMap 
              lat={mission.gps.lat} 
              lng={mission.gps.lng} 
              radius={600}
              className="absolute inset-0"
            />
            <div className="absolute top-2 left-2 z-[1000] text-xs text-white bg-white/90 px-2 py-1 rounded font-medium">
              GPS: {mission.gps.lat.toFixed(4)}, {mission.gps.lng.toFixed(4)}
            </div>
          </div>

          {/* AI Detections */}
          <div className="bg-gray-50 border border-gray-200 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-4 h-4 text-black/70" />
              <span className="text-sm font-medium text-black">AI Detections</span>
            </div>
            <div className="space-y-1">
              {mission.detections.map((detection, idx) => (
                <div key={idx} className="text-xs text-black bg-white border border-gray-200 px-2 py-1 rounded">
                  {detection}
                </div>
              ))}
            </div>
          </div>

          {/* Mission Controls */}
          <div className="space-y-2">
            <button className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm">
              Return to Home
            </button>
            <button className="w-full px-3 py-2 bg-black text-white rounded hover:bg-gray-100 transition-colors text-sm">
              Capture Snapshot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const mockMissions = [
  {
    id: 'M-2024-001',
    droneId: 'D-001',
    operator: 'Pilot Ravi Kumar',
    mission: 'VIP Route Monitoring',
    status: 'Active',
    altitude: 120,
    speed: 28,
    heading: 'NE',
    battery: 87,
    gps: { lat: 16.9891, lng: 82.2475 }, // Kakinada city center
    cameraMode: 'RGB',
    detections: ['Vehicle Congestion', 'Crowd Density: Medium'],
    duration: '00:18:42'
  },
  {
    id: 'M-2024-002',
    droneId: 'D-003',
    operator: 'Pilot Anjali Devi',
    mission: 'Coastal Surveillance',
    status: 'Active',
    altitude: 150,
    speed: 22,
    heading: 'E',
    battery: 92,
    gps: { lat: 16.9850, lng: 82.2520 }, // Beach area near Kakinada
    cameraMode: 'Thermal',
    detections: ['Human Cluster Detected'],
    duration: '00:12:15'
  },
  {
    id: 'M-2024-003',
    droneId: 'D-006',
    operator: 'Pilot Suresh Babu',
    mission: 'Coastal Patrol',
    status: 'Active',
    altitude: 135,
    speed: 25,
    heading: 'SW',
    battery: 78,
    gps: { lat: 16.9800, lng: 82.2500 }, // Kakinada Port - centered
    cameraMode: 'Zoom',
    detections: ['Traffic Jam', 'Vehicle Count: 47'],
    duration: '00:25:30'
  }
];

export function DroneMissions({ onNavigate }: DroneMissionsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 border border-green-200';
      case 'RTH': return 'bg-yellow-100 border border-yellow-200';
      case 'Completed': return 'bg-blue-100 border border-blue-200';
      default: return 'bg-gray-100 border border-gray-200';
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return 'text-green-700';
    if (battery > 30) return 'text-amber-700';
    return 'text-red-700';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-black">Live Drone Missions</h2>
          <p className="text-sm text-black/60 mt-1">{mockMissions.length} active mission(s)</p>
        </div>
        <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-100 transition-colors text-sm">
          Launch New Mission
        </button>
      </div>

      {/* Mission Grid */}
      <div className="grid grid-cols-1 gap-4">
        {mockMissions.map((mission, index) => {
          // Assign videos to missions: first mission gets video1, second gets video2, third gets video3
          const videoSources = [droneVideo1, droneVideo2, droneVideo3];
          return (
            <MissionCard
              key={mission.id}
              mission={mission}
              videoSource={videoSources[index]}
              getStatusColor={getStatusColor}
              getBatteryColor={getBatteryColor}
            />
          );
        })}
      </div>
    </div>
  );
}
