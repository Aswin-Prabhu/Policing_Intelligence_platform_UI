import { Plane, Battery, MapPin, Radio, Wrench, Clock } from 'lucide-react';

interface DroneFleetProps {
  onNavigate: (screen: string, data?: any) => void;
}

const mockDrones = [
  { id: 'D-001', status: 'Active', battery: 87, operator: 'Pilot Ravi Kumar', gpsLock: true, altitude: 120, location: 'Sector-3', lastMission: '15 min ago', maintenance: 'OK' },
  { id: 'D-002', status: 'Charging', battery: 45, operator: 'Unassigned', gpsLock: true, altitude: 0, location: 'Base Station', lastMission: '2 hrs ago', maintenance: 'OK' },
  { id: 'D-003', status: 'Active', battery: 92, operator: 'Pilot Anjali Devi', gpsLock: true, altitude: 150, location: 'Coastal Zone', lastMission: '5 min ago', maintenance: 'OK' },
  { id: 'D-004', status: 'Standby', battery: 100, operator: 'Unassigned', gpsLock: true, altitude: 0, location: 'Base Station', lastMission: '30 min ago', maintenance: 'OK' },
  { id: 'D-005', status: 'Maintenance', battery: 0, operator: 'Unassigned', gpsLock: false, altitude: 0, location: 'Workshop', lastMission: '3 days ago', maintenance: 'Scheduled' },
  { id: 'D-006', status: 'Active', battery: 78, operator: 'Pilot Suresh Babu', gpsLock: true, altitude: 135, location: 'VIP Route', lastMission: '10 min ago', maintenance: 'OK' },
];

export function DroneFleet({ onNavigate }: DroneFleetProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 border border-green-200';
      case 'Charging': return 'bg-yellow-100 border border-yellow-200';
      case 'Standby': return 'bg-blue-100 border border-blue-200';
      case 'Maintenance': return 'bg-red-100 border border-red-200';
      default: return 'bg-gray-100 border border-gray-200';
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return 'text-green-700';
    if (battery > 30) return 'text-amber-700';
    return 'text-red-700';
  };

  const activeDrones = mockDrones.filter(d => d.status === 'Active').length;
  const standbyDrones = mockDrones.filter(d => d.status === 'Standby').length;
  const maintenanceDrones = mockDrones.filter(d => d.status === 'Maintenance').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Total Fleet</div>
          <div className="text-2xl font-semibold text-black">{mockDrones.length}</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Active Missions</div>
          <div className="text-2xl font-semibold text-black">{activeDrones}</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Standby</div>
          <div className="text-2xl font-semibold text-black">{standbyDrones}</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Maintenance</div>
          <div className="text-2xl font-semibold text-black">{maintenanceDrones}</div>
        </div>
      </div>

      {/* Drone Fleet Grid */}
      <div className="grid grid-cols-3 gap-4">
        {mockDrones.map((drone) => (
          <div
            key={drone.id}
            className="bg-card border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-400 transition-all cursor-pointer"
            onClick={() => onNavigate('drone-missions', { droneId: drone.id })}
          >
            {/* Drone Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-black/70" />
                <span className="text-sm font-medium text-black">{drone.id}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full text-black ${getStatusColor(drone.status)}`}>
                {drone.status}
              </span>
            </div>

            {/* Drone Details Grid */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-black/60">
                  <Battery className="w-4 h-4" />
                  <span>Battery</span>
                </div>
                <span className={getBatteryColor(drone.battery)}>{drone.battery}%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-black/60">
                  <MapPin className="w-4 h-4" />
                  <span>GPS Lock</span>
                </div>
                <span className={drone.gpsLock ? 'text-green-700' : 'text-red-700'}>
                  {drone.gpsLock ? 'Active' : 'Lost'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-black/60">
                  <Radio className="w-4 h-4" />
                  <span>Operator</span>
                </div>
                <span className="text-xs truncate max-w-[140px] text-black">
                  {drone.operator}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-black/60">
                  <MapPin className="w-4 h-4" />
                  <span>Location</span>
                </div>
                <span className="text-xs text-black">{drone.location}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-black/60">
                  <Clock className="w-4 h-4" />
                  <span>Last Mission</span>
                </div>
                <span className="text-xs text-black/60">{drone.lastMission}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-black/60">
                  <Wrench className="w-4 h-4" />
                  <span>Maintenance</span>
                </div>
                <span className={drone.maintenance === 'OK' ? 'text-green-700' : 'text-amber-700'}>
                  {drone.maintenance}
                </span>
              </div>
            </div>

            {/* Altitude Badge (for active drones) */}
            {drone.status === 'Active' && (
              <div className="mt-3 pt-3 border-t border-gray-200 text-center">
                <span className="text-xs text-black/60">Altitude: </span>
                <span className="text-xs font-semibold text-black">{drone.altitude}m</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
