import { AlertTriangle, Users, Car, Flame, MapPin, Clock, Eye } from 'lucide-react';
import { useState, useMemo } from 'react';

interface DroneAlertsProps {
  onNavigate: (screen: string, data?: any) => void;
}



const mockAlerts = [
  {
    id: 'DA-2024-0012',
    droneId: 'D-001',
    type: 'Crowd Surge',
    severity: 'High',
    location: 'Beach Road Junction',
    timestamp: '2 min ago',
    confidence: 94,
    description: 'Sudden crowd gathering detected - 150+ people',
    status: 'Active',
    aiModel: 'AerialAI'
  },
  {
    id: 'DA-2024-0011',
    droneId: 'D-003',
    type: 'Vehicle Congestion',
    severity: 'Medium',
    location: 'NH-16 Bypass',
    timestamp: '5 min ago',
    confidence: 87,
    description: 'Heavy traffic buildup - 45+ vehicles stationary',
    status: 'Active',
    aiModel: 'AerialAI'
  },
  {
    id: 'DA-2024-0010',
    droneId: 'D-006',
    type: 'Fire/Smoke',
    severity: 'Critical',
    location: 'Industrial Area Sector-2',
    timestamp: '8 min ago',
    confidence: 91,
    description: 'Thermal anomaly detected - possible fire',
    status: 'Escalated',
    aiModel: 'AerialAI'
  },
  {
    id: 'DA-2024-0009',
    droneId: 'D-001',
    type: 'Human Clustering',
    severity: 'Low',
    location: 'Market Square',
    timestamp: '12 min ago',
    confidence: 78,
    description: 'Irregular human clustering pattern',
    status: 'Reviewed',
    aiModel: 'AerialAI'
  },
  {
    id: 'DA-2024-0008',
    droneId: 'D-003',
    type: 'Perimeter Intrusion',
    severity: 'High',
    location: 'Restricted Zone-7',
    timestamp: '18 min ago',
    confidence: 96,
    description: 'Unauthorized entry detected in restricted area',
    status: 'Active',
    aiModel: 'AerialAI'
  },
  {
    id: 'DA-2024-0007',
    droneId: 'D-006',
    type: 'Crowd Surge',
    severity: 'Medium',
    location: 'Railway Station Approach',
    timestamp: '25 min ago',
    confidence: 82,
    description: 'Moderate crowd density increase',
    status: 'Acknowledged',
    aiModel: 'AerialAI'
  }
];

export function DroneAlerts({ onNavigate }: DroneAlertsProps) {
  const [severityFilter, setSeverityFilter] = useState<string>('All Severities');
  const [typeFilter, setTypeFilter] = useState<string>('All Types');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');

  // Filter alerts based on selected filters
  const filteredAlerts = useMemo(() => {
    return mockAlerts.filter(alert => {
      const matchesSeverity = severityFilter === 'All Severities' || alert.severity === severityFilter;
      const matchesType = typeFilter === 'All Types' || alert.type === typeFilter;
      const matchesStatus = statusFilter === 'All Status' || alert.status === statusFilter;
      
      return matchesSeverity && matchesType && matchesStatus;
    });
  }, [severityFilter, typeFilter, statusFilter]);

  // Calculate stats based on filtered alerts
  const criticalCount = useMemo(() => filteredAlerts.filter(a => a.severity === 'Critical').length, [filteredAlerts]);
  const highCount = useMemo(() => filteredAlerts.filter(a => a.severity === 'High').length, [filteredAlerts]);
  const activeCount = useMemo(() => filteredAlerts.filter(a => a.status === 'Active').length, [filteredAlerts]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-400 bg-red-400/10 border-red-400';
      case 'High': return 'text-orange-400 bg-orange-400/10 border-orange-400';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400';
      case 'Low': return 'text-blue-400 bg-blue-400/10 border-blue-400';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-red-400 bg-red-400/10';
      case 'Escalated': return 'text-orange-400 bg-orange-400/10';
      case 'Acknowledged': return 'text-yellow-400 bg-yellow-400/10';
      case 'Reviewed': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Crowd Surge': return Users;
      case 'Vehicle Congestion': return Car;
      case 'Fire/Smoke': return Flame;
      case 'Human Clustering': return Users;
      case 'Perimeter Intrusion': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Total Alerts</div>
          <div className="text-2xl font-semibold text-black">{filteredAlerts.length}</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Critical</div>
          <div className="text-2xl font-semibold text-black">{criticalCount}</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">High Priority</div>
          <div className="text-2xl font-semibold text-black">{highCount}</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Active</div>
          <div className="text-2xl font-semibold text-black">{activeCount}</div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex gap-4">
        <select 
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 text-sm text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option>All Severities</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select 
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 text-sm text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option>All Types</option>
          <option>Crowd Surge</option>
          <option>Vehicle Congestion</option>
          <option>Fire/Smoke</option>
          <option>Human Clustering</option>
          <option>Perimeter Intrusion</option>
        </select>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 text-sm text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Escalated</option>
          <option>Acknowledged</option>
          <option>Reviewed</option>
        </select>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-card border border-gray-200 rounded-xl p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-black/30 mx-auto mb-3" />
            <p className="text-black/60">No alerts match the selected filters</p>
            <button
              onClick={() => {
                setSeverityFilter('All Severities');
                setTypeFilter('All Types');
                setStatusFilter('All Status');
              }}
              className="mt-4 px-4 py-2 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
          const TypeIcon = getTypeIcon(alert.type);
          return (
            <div
              key={alert.id}
              className="bg-card border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-400 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                {/* Left: Alert Info */}
                <div className="flex gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100">
                    <TypeIcon className="w-6 h-6 text-black/70" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-black">{alert.type}</span>
                      <span className={`text-xs px-2 py-1 rounded-full text-black ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full text-black ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>

                    <p className="text-sm text-black/70 mb-3">{alert.description}</p>

                    <div className="grid grid-cols-4 gap-4 text-xs">
                      <div className="flex items-center gap-2 text-xs text-black/60">
                        <span className="font-medium text-black">Alert ID:</span>
                        <span className="text-black">{alert.id}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-black/60">
                        <MapPin className="w-3 h-3" />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-black/60">
                        <Clock className="w-3 h-3" />
                        <span>{alert.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-black/60">
                        <span>Drone:</span>
                        <span className="text-black font-medium">{alert.droneId}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Confidence & Actions */}
                <div className="text-right space-y-3">
                  <div>
                    <div className="text-xs text-black/60 mb-1">Confidence</div>
                    <div className="text-xl font-semibold text-black">{alert.confidence}%</div>
                    <div className="text-xs text-black/50">{alert.aiModel}</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('drone-missions', { alertId: alert.id });
                      }}
                      className="px-3 py-1 bg-white text-black border border-gray-300 rounded hover:bg-gray-100 transition-colors text-xs flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View Feed
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
        )}
      </div>
    </div>
  );
}
