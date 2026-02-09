import { Video, Plus, Edit, Trash2, Battery, Signal, MapPin, User } from 'lucide-react';

const mockBodycamRegistry = [
  {
    id: 'BC-001',
    model: 'Axon Body 3',
    serialNumber: 'AX-BC3-2023-001',
    purchaseDate: '2023-02-10',
    status: 'Active',
    battery: 87,
    gpsSignal: 'Strong',
    assignedOfficer: 'SI Ramesh Kumar',
    badgeNumber: 'KKD-1234',
    lastSync: '5 min ago',
    storageUsed: 64,
    storageTotal: 128
  },
  {
    id: 'BC-002',
    model: 'Axon Body 3',
    serialNumber: 'AX-BC3-2023-002',
    purchaseDate: '2023-02-10',
    status: 'Active',
    battery: 92,
    gpsSignal: 'Strong',
    assignedOfficer: 'Constable Lakshmi Devi',
    badgeNumber: 'KKD-1245',
    lastSync: '2 min ago',
    storageUsed: 42,
    storageTotal: 128
  },
  {
    id: 'BC-003',
    model: 'Axon Body 3',
    serialNumber: 'AX-BC3-2023-003',
    purchaseDate: '2023-02-10',
    status: 'Charging',
    battery: 34,
    gpsSignal: 'N/A',
    assignedOfficer: 'Unassigned',
    badgeNumber: '-',
    lastSync: '45 min ago',
    storageUsed: 18,
    storageTotal: 128
  },
  {
    id: 'BC-004',
    model: 'Axon Body 3',
    serialNumber: 'AX-BC3-2023-004',
    purchaseDate: '2023-02-10',
    status: 'Active',
    battery: 78,
    gpsSignal: 'Weak',
    assignedOfficer: 'Constable Vijay Sharma',
    badgeNumber: 'KKD-1256',
    lastSync: '8 min ago',
    storageUsed: 95,
    storageTotal: 128
  },
  {
    id: 'BC-005',
    model: 'Axon Body 3',
    serialNumber: 'AX-BC3-2023-005',
    purchaseDate: '2023-02-10',
    status: 'Active',
    battery: 45,
    gpsSignal: 'Strong',
    assignedOfficer: 'SI Priya Reddy',
    badgeNumber: 'KKD-1267',
    lastSync: '3 min ago',
    storageUsed: 78,
    storageTotal: 128
  },
  {
    id: 'BC-006',
    model: 'Axon Body 3',
    serialNumber: 'AX-BC3-2023-006',
    purchaseDate: '2023-02-10',
    status: 'Maintenance',
    battery: 0,
    gpsSignal: 'N/A',
    assignedOfficer: 'Unassigned',
    badgeNumber: '-',
    lastSync: '2 days ago',
    storageUsed: 0,
    storageTotal: 128
  }
];

export function BodycamRegistry() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 border border-green-200';
      case 'Charging': return 'bg-yellow-100 border border-yellow-200';
      case 'Maintenance': return 'bg-red-100 border border-red-200';
      case 'Offline': return 'bg-gray-100 border border-gray-200';
      default: return 'bg-gray-100 border border-gray-200';
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return 'text-green-700';
    if (battery > 30) return 'text-amber-700';
    return 'text-red-700';
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'Strong': return 'text-green-700';
      case 'Weak': return 'text-amber-700';
      case 'N/A': return 'text-black/60';
      default: return 'text-black/60';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-black">Bodycam Registry</h2>
          <p className="text-sm text-black/60 mt-1">{mockBodycamRegistry.length} bodycams registered</p>
        </div>
        <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Register New Bodycam
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Total Bodycams</div>
          <div className="text-2xl font-semibold text-black">{mockBodycamRegistry.length}</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Active</div>
          <div className="text-2xl font-semibold text-black">
            {mockBodycamRegistry.filter(b => b.status === 'Active').length}
          </div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Charging</div>
          <div className="text-2xl font-semibold text-black">
            {mockBodycamRegistry.filter(b => b.status === 'Charging').length}
          </div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Low Battery</div>
          <div className="text-2xl font-semibold text-black">
            {mockBodycamRegistry.filter(b => b.battery < 30 && b.status === 'Active').length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs text-black/60 uppercase tracking-wider">Bodycam ID</th>
              <th className="px-4 py-3 text-left text-xs text-black/60 uppercase tracking-wider">Model</th>
              <th className="px-4 py-3 text-left text-xs text-black/60 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs text-black/60 uppercase tracking-wider">Battery</th>
              <th className="px-4 py-3 text-left text-xs text-black/60 uppercase tracking-wider">GPS Signal</th>
              <th className="px-4 py-3 text-left text-xs text-black/60 uppercase tracking-wider">Assigned Officer</th>
              <th className="px-4 py-3 text-left text-xs text-black/60 uppercase tracking-wider">Storage</th>
              <th className="px-4 py-3 text-left text-xs text-black/60 uppercase tracking-wider">Last Sync</th>
              <th className="px-4 py-3 text-left text-xs text-black/60 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockBodycamRegistry.map((bodycam) => (
              <tr key={bodycam.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-black/70" />
                    <span className="text-sm font-medium text-black">{bodycam.id}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-black">{bodycam.model}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full text-black ${getStatusColor(bodycam.status)}`}>
                    {bodycam.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Battery className={`w-4 h-4 ${getBatteryColor(bodycam.battery)}`} />
                    <span className={`text-sm ${getBatteryColor(bodycam.battery)}`}>
                      {bodycam.battery}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Signal className={`w-4 h-4 ${getSignalColor(bodycam.gpsSignal)}`} />
                    <span className={`text-sm ${getSignalColor(bodycam.gpsSignal)}`}>
                      {bodycam.gpsSignal}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {bodycam.assignedOfficer !== 'Unassigned' && (
                      <User className="w-4 h-4 text-black/60" />
                    )}
                    <div>
                      <div className="text-sm text-black">{bodycam.assignedOfficer}</div>
                      {bodycam.badgeNumber !== '-' && (
                        <div className="text-xs text-black/60">{bodycam.badgeNumber}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <span className="text-black font-medium">{bodycam.storageUsed} GB</span>
                    <span className="text-black/50"> / {bodycam.storageTotal} GB</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1 rounded mt-1">
                    <div
                      className="bg-black h-1 rounded"
                      style={{ width: `${(bodycam.storageUsed / bodycam.storageTotal) * 100}%` }}
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-black/60">{bodycam.lastSync}</td>
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
