import { ArrowLeft, FileText, Search, Filter, Calendar, User, Camera, AlertTriangle, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';
import { useState } from 'react';

interface AllIncidentsProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  userRole: 'operator' | 'supervisor' | 'admin';
}

export function AllIncidents({ onBack, onNavigate, userRole }: AllIncidentsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Sample data - in real app, this would come from API
  const allIncidents = [
    {
      id: 'INC-2024-1156',
      title: 'Suspicious Activity - NH-16 Junction',
      createdBy: 'Operator Kumar',
      createdAt: '2024-12-02 09:15:23',
      closedAt: null,
      priority: 'high',
      status: 'pending_classification',
      classification: null,
      cameras: ['CAM-NZ-042', 'CAM-NZ-045'],
      linkedAlerts: 2,
      evidenceCount: 0,
      operatorNotes: 'Two individuals seen loitering near restricted zone for 15+ minutes.',
    },
    {
      id: 'INC-2024-1153',
      title: 'Vehicle Theft Attempt - Parking Area',
      createdBy: 'Operator Priya',
      createdAt: '2024-12-02 08:42:11',
      closedAt: null,
      priority: 'high',
      status: 'pending_approval',
      classification: 'Theft Attempt',
      cameras: ['CAM-SZ-018', 'CAM-SZ-020'],
      linkedAlerts: 1,
      evidenceCount: 3,
      operatorNotes: 'Individual attempting to break into vehicle AP05C1234.',
    },
    {
      id: 'INC-2024-1148',
      title: 'Perimeter Breach - Industrial Area',
      createdBy: 'Operator Ravi',
      createdAt: '2024-12-01 16:23:45',
      closedAt: null,
      priority: 'medium',
      status: 'under_review',
      classification: 'Trespassing',
      cameras: ['CAM-WZ-055'],
      linkedAlerts: 3,
      evidenceCount: 2,
      operatorNotes: 'Fence section B-7 breach detected. Person entered restricted zone.',
    },
    {
      id: 'INC-2024-1125',
      title: 'Vandalism - Public Park',
      createdBy: 'Operator Meera',
      createdAt: '2024-11-30 14:20:10',
      closedAt: '2024-11-30 18:45:00',
      priority: 'medium',
      status: 'closed',
      classification: 'Vandalism',
      cameras: ['CAM-CZ-012'],
      linkedAlerts: 1,
      evidenceCount: 5,
      operatorNotes: 'Graffiti found on public property. Suspect identified and apprehended.',
      closedBy: 'Supervisor Sharma',
    },
    {
      id: 'INC-2024-1101',
      title: 'Traffic Accident - Main Road',
      createdBy: 'Operator Anil',
      createdAt: '2024-11-28 11:30:15',
      closedAt: '2024-11-28 15:20:00',
      priority: 'high',
      status: 'closed',
      classification: 'Traffic Accident',
      cameras: ['CAM-NZ-038', 'CAM-NZ-039'],
      linkedAlerts: 2,
      evidenceCount: 8,
      operatorNotes: 'Two-vehicle collision. Medical assistance provided.',
      closedBy: 'Supervisor Kumar',
    },
    {
      id: 'INC-2024-1089',
      title: 'False Alarm - Security System',
      createdBy: 'Operator Deepak',
      createdAt: '2024-11-25 09:15:30',
      closedAt: '2024-11-25 09:45:00',
      priority: 'low',
      status: 'closed',
      classification: 'False Alarm',
      cameras: ['CAM-EZ-022'],
      linkedAlerts: 0,
      evidenceCount: 1,
      operatorNotes: 'Security system triggered false alarm. No actual threat detected.',
      closedBy: 'Supervisor Patel',
    },
    {
      id: 'INC-2024-1075',
      title: 'Public Disturbance - Market Area',
      createdBy: 'Operator Sunita',
      createdAt: '2024-11-22 16:45:20',
      closedAt: '2024-11-22 20:30:00',
      priority: 'medium',
      status: 'closed',
      classification: 'Public Disturbance',
      cameras: ['CAM-SZ-015', 'CAM-SZ-016'],
      linkedAlerts: 3,
      evidenceCount: 6,
      operatorNotes: 'Altercation between vendors. Situation resolved peacefully.',
      closedBy: 'Supervisor Reddy',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_classification':
        return { text: 'Needs Classification', color: 'bg-red-100 border-red-300 text-red-800' };
      case 'pending_approval':
        return { text: 'Awaiting Approval', color: 'bg-amber-100 border-amber-300 text-amber-800' };
      case 'under_review':
        return { text: 'Under Review', color: 'bg-blue-100 border-blue-300 text-blue-800' };
      case 'closed':
        return { text: 'Closed', color: 'bg-green-100 border-green-300 text-green-800' };
      default:
        return { text: 'Unknown', color: 'bg-gray-100 border-gray-300 text-gray-800' };
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return { text: 'Critical', color: 'bg-red-600 text-white' };
      case 'high':
        return { text: 'High', color: 'bg-red-500 text-white' };
      case 'medium':
        return { text: 'Medium', color: 'bg-amber-500 text-white' };
      case 'low':
        return { text: 'Low', color: 'bg-green-500 text-white' };
      default:
        return { text: 'Unknown', color: 'bg-gray-500 text-white' };
    }
  };

  // Filter incidents
  const filteredIncidents = allIncidents.filter((incident) => {
    const matchesSearch =
      searchQuery === '' ||
      incident.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.createdBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || incident.priority === priorityFilter;

    let matchesDate = true;
    if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      matchesDate = incident.createdAt.startsWith(today);
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(incident.createdAt) >= weekAgo;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = new Date(incident.createdAt) >= monthAgo;
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesDate;
  });

  const activeCount = allIncidents.filter((i) => i.status !== 'closed').length;
  const closedCount = allIncidents.filter((i) => i.status === 'closed').length;
  const totalCount = allIncidents.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Alerts
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Incidents</h1>
            <p className="text-gray-600">Complete incident history - Active and archived incidents for inspection and workflow</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Incidents</p>
              <p className="text-3xl font-bold text-gray-900">{totalCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-amber-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Incidents</p>
              <p className="text-3xl font-bold text-gray-900">{activeCount}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-green-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Closed & Archived</p>
              <p className="text-3xl font-bold text-gray-900">{closedCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, title, or operator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending_classification">Needs Classification</option>
            <option value="pending_approval">Awaiting Approval</option>
            <option value="under_review">Under Review</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Incidents List */}
      <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b-2 border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Incident Records ({filteredIncidents.length})
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Sorted by: Most Recent</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredIncidents.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No incidents found</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or search query</p>
            </div>
          ) : (
            filteredIncidents.map((incident) => {
              const statusBadge = getStatusBadge(incident.status);
              const priorityBadge = getPriorityBadge(incident.priority);

              return (
                <div
                  key={incident.id}
                  className="p-5 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    // If incident is closed, go to detail view; otherwise go to review queue
                    if (incident.status === 'closed') {
                      onNavigate('incident-detail');
                    } else {
                      if (userRole === 'operator') {
                        onNavigate('incident-operator');
                      } else {
                        onNavigate('incident-supervisor');
                      }
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${statusBadge.color}`}>
                          {statusBadge.text}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${priorityBadge.color}`}>
                          {priorityBadge.text} Priority
                        </span>
                        {incident.classification && (
                          <span className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
                            {incident.classification}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{incident.title}</h3>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="w-4 h-4" />
                          <span>
                            <strong>ID:</strong> {incident.id}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>
                            <strong>Operator:</strong> {incident.createdBy}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            <strong>Created:</strong> {incident.createdAt}
                          </span>
                        </div>
                        {incident.closedAt && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>
                              <strong>Closed:</strong> {incident.closedAt}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4" />
                          <span>
                            <strong>{incident.cameras.length}</strong> camera{incident.cameras.length !== 1 ? 's' : ''}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-xs">{incident.cameras.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>
                            <strong>{incident.linkedAlerts}</strong> alert{incident.linkedAlerts !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span>
                            <strong>{incident.evidenceCount}</strong> evidence clip{incident.evidenceCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 bg-gray-50 border-l-4 border-gray-300 pl-3 py-2 rounded">
                        {incident.operatorNotes}
                      </p>

                      {incident.closedBy && (
                        <p className="text-xs text-gray-500 mt-2">
                          Closed by: <span className="font-medium">{incident.closedBy}</span>
                        </p>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // If incident is closed, go to detail view; otherwise go to review queue
                        if (incident.status === 'closed') {
                          onNavigate('incident-detail');
                        } else {
                          if (userRole === 'operator') {
                            onNavigate('incident-operator');
                          } else {
                            onNavigate('incident-supervisor');
                          }
                        }
                      }}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center gap-2 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
