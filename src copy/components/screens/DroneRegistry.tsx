import { Plane, Plus, Edit, Trash2, Calendar, Wrench, Battery, MapPin } from 'lucide-react';

const mockDroneRegistry = [
  {
    id: 'D-001',
    model: 'DJI Matrice 300 RTK',
    serialNumber: 'DJI-M300-2023-001',
    purchaseDate: '2023-01-15',
    status: 'Active',
    lastMaintenance: '2024-10-15',
    nextMaintenance: '2025-01-15',
    flightHours: 342,
    maxFlightTime: 55,
    payload: 'RGB + Zoom Camera',
    assignedOperator: 'Pilot Ravi Kumar',
    baseStation: 'Main Command Center'
  },
  {
    id: 'D-002',
    model: 'DJI Matrice 300 RTK',
    serialNumber: 'DJI-M300-2023-002',
    purchaseDate: '2023-01-15',
    status: 'Active',
    lastMaintenance: '2024-11-01',
    nextMaintenance: '2025-02-01',
    flightHours: 298,
    maxFlightTime: 55,
    payload: 'Thermal Camera',
    assignedOperator: 'Unassigned',
    baseStation: 'Main Command Center'
  },
  {
    id: 'D-003',
    model: 'DJI Matrice 300 RTK',
    serialNumber: 'DJI-M300-2023-003',
    purchaseDate: '2023-02-20',
    status: 'Active',
    lastMaintenance: '2024-10-20',
    nextMaintenance: '2025-01-20',
    flightHours: 415,
    maxFlightTime: 55,
    payload: 'RGB + Zoom Camera',
    assignedOperator: 'Pilot Anjali Devi',
    baseStation: 'Main Command Center'
  },
  {
    id: 'D-004',
    model: 'DJI Matrice 30T',
    serialNumber: 'DJI-M30T-2023-001',
    purchaseDate: '2023-03-10',
    status: 'Active',
    lastMaintenance: '2024-11-10',
    nextMaintenance: '2025-02-10',
    flightHours: 186,
    maxFlightTime: 41,
    payload: 'Thermal + Wide Angle',
    assignedOperator: 'Unassigned',
    baseStation: 'Sub-Station Alpha'
  },
  {
    id: 'D-005',
    model: 'DJI Matrice 300 RTK',
    serialNumber: 'DJI-M300-2023-004',
    purchaseDate: '2023-01-15',
    status: 'Maintenance',
    lastMaintenance: '2024-11-20',
    nextMaintenance: '2024-12-01',
    flightHours: 521,
    maxFlightTime: 55,
    payload: 'RGB + Zoom Camera',
    assignedOperator: 'Unassigned',
    baseStation: 'Workshop'
  },
  {
    id: 'D-006',
    model: 'DJI Matrice 30T',
    serialNumber: 'DJI-M30T-2023-002',
    purchaseDate: '2023-03-10',
    status: 'Active',
    lastMaintenance: '2024-10-25',
    nextMaintenance: '2025-01-25',
    flightHours: 203,
    maxFlightTime: 41,
    payload: 'Thermal + Wide Angle',
    assignedOperator: 'Pilot Suresh Babu',
    baseStation: 'Sub-Station Beta'
  }
];

export function DroneRegistry() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 border border-green-200';
      case 'Maintenance': return 'bg-yellow-100 border border-yellow-200';
      case 'Retired': return 'bg-red-100 border border-red-200';
      default: return 'bg-gray-100 border border-gray-200';
    }
  };

  const isMaintenanceDue = (nextMaintenance: string) => {
    const next = new Date(nextMaintenance);
    const now = new Date();
    const diffDays = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-black">Drone Registry</h2>
          <p className="text-sm text-black/60 mt-1">{mockDroneRegistry.length} drones registered</p>
        </div>
        <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Register New Drone
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Total Drones</div>
          <div className="text-2xl font-semibold text-black">{mockDroneRegistry.length}</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Active</div>
          <div className="text-2xl font-semibold text-black">
            {mockDroneRegistry.filter(d => d.status === 'Active').length}
          </div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Maintenance</div>
          <div className="text-2xl font-semibold text-black">
            {mockDroneRegistry.filter(d => d.status === 'Maintenance').length}
          </div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Service Due</div>
          <div className="text-2xl font-semibold text-black">
            {mockDroneRegistry.filter(d => isMaintenanceDue(d.nextMaintenance)).length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs text-black/60 uppercase tracking-wider">Drone ID</th>
              <th className="px-4 py-3 text-left text-xs text-black/60 uppercase tracking-wider">Model</th>
              <th className="px-4 py-3 text-left text-xs text-black/60 uppercase tracking-wider">Serial Number</th>
              <th className="px-4 py-3 text-left text-xs text-black/60 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs text-black/60 uppercase tracking-wider">Flight Hours</th>
              <th className="px-4 py-3 text-left text-xs text-black/60 uppercase tracking-wider">Next Maintenance</th>
              <th className="px-4 py-3 text-left text-xs text-black/60 uppercase tracking-wider">Operator</th>
              <th className="px-4 py-3 text-left text-xs text-black/60 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockDroneRegistry.map((drone) => (
              <tr key={drone.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-black/70" />
                    <span className="text-sm font-medium text-black">{drone.id}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-black">{drone.model}</td>
                <td className="px-4 py-3 text-sm text-black/70">{drone.serialNumber}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full text-black ${getStatusColor(drone.status)}`}>
                    {drone.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Battery className="w-4 h-4 text-black/60" />
                    <span className="text-sm text-black">{drone.flightHours}h</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Wrench className={`w-4 h-4 ${isMaintenanceDue(drone.nextMaintenance) ? 'text-amber-700' : 'text-black/60'}`} />
                    <span className={`text-sm ${isMaintenanceDue(drone.nextMaintenance) ? 'text-amber-700' : 'text-black/70'}`}>
                      {drone.nextMaintenance}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-black">
                  {drone.assignedOperator}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Edit">
                      <Edit className="w-4 h-4 text-black/70" />
                    </button>
                    <button className="p-1 hover:bg-red-50 rounded transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
