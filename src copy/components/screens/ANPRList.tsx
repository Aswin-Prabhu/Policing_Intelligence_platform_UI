import { useState, useMemo } from 'react';
import { Car, MapPin, Clock, CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react';

interface ANPRListProps {
  onViewDetail: (violation: any) => void;
  onViewApproval: () => void;
  userRole?: 'operator' | 'supervisor' | 'admin';
}

export function ANPRList({ onViewDetail, onViewApproval, userRole = 'operator' }: ANPRListProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'validated'>('all');

  const violations = [
    { id: 'VL-001', plate: 'AP05DY3395', confidence: 96, time: '10:23:45', location: 'NH-16 Junction', status: 'Pending', violation: 'Stolen Vehicle', severity: 'critical' },
    { id: 'VL-002', plate: 'MH02EK4399', confidence: 89, time: '10:18:32', location: 'Gandhi Road', status: 'Validated', violation: 'Speed Limit', severity: 'medium' },
    { id: 'VL-003', plate: 'RJ27TC0530', confidence: 94, time: '10:12:19', location: 'Beach Road', status: 'Pending', violation: 'Red Light', severity: 'medium' },
    { id: 'VL-004', plate: 'MH04DW9020', confidence: 92, time: '10:05:47', location: 'Port Area', status: 'Approved', violation: 'No Entry', severity: 'high' },
    { id: 'VL-005', plate: 'GJ05JH2501', confidence: 87, time: '09:58:23', location: 'Main Bazaar', status: 'Pending', violation: 'Wrong Way', severity: 'medium' },
    { id: 'VL-006', plate: 'WB06F9209', confidence: 91, time: '09:52:11', location: 'Station Road', status: 'Validated', violation: 'Overspeeding', severity: 'low' },
    { id: 'VL-007', plate: 'MH02EP4454', confidence: 85, time: '09:45:56', location: 'Canal Road', status: 'Pending', violation: 'Parking Violation', severity: 'low' },
    { id: 'VL-008', plate: 'MH01DT1917', confidence: 93, time: '09:38:42', location: 'Highway Entry', status: 'Escalated', violation: 'Stolen Vehicle', severity: 'critical' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Validated':
        return CheckCircle;
      case 'Corrected':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Validated':
        return 'bg-emerald-100 border border-emerald-200';
      case 'Corrected':
        return 'bg-amber-100 border border-amber-200';
      default:
        return 'bg-orange-100 border border-orange-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 border border-red-200';
      case 'medium':
        return 'bg-orange-100 border border-orange-200';
      default:
        return 'bg-yellow-100 border border-yellow-200';
    }
  };

  // Filter violations based on selected filter
  const filteredViolations = useMemo(() => {
    if (selectedFilter === 'all') {
      return violations;
    } else if (selectedFilter === 'pending') {
      // Filter for pending status (Pending, Approved statuses that need review)
      return violations.filter(v =>
        v.status === 'Pending' || v.status === 'Approved' || v.status === 'Escalated'
      );
    } else if (selectedFilter === 'validated') {
      // Filter for validated status
      return violations.filter(v => v.status === 'Validated');
    }
    return violations;
  }, [selectedFilter, violations]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              selectedFilter === 'all'
                ? 'bg-white border-gray-300 text-black shadow-sm'
                : 'bg-transparent border-transparent text-black/60 hover:bg-white hover:shadow-sm'
              }`}
          >
            All Violations
          </button>
          <button
            onClick={() => setSelectedFilter('pending')}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              selectedFilter === 'pending'
                ? 'bg-white border-gray-300 text-black shadow-sm'
                : 'bg-transparent border-transparent text-black/60 hover:bg-white hover:shadow-sm'
              }`}
          >
            Pending Review
          </button>
          <button
            onClick={() => setSelectedFilter('validated')}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              selectedFilter === 'validated'
                ? 'bg-white border-gray-300 text-black shadow-sm'
                : 'bg-transparent border-transparent text-black/60 hover:bg-white hover:shadow-sm'
              }`}
          >
            Validated
          </button>
        </div>

        {(userRole === 'supervisor' || userRole === 'admin') && (
          <button
            onClick={onViewApproval}
            className={`px-4 py-2 rounded-lg border text-sm font-medium ${
              userRole === 'admin'
                ? 'bg-gray-100 border-gray-200 text-black/40 cursor-default'
                : 'bg-white border-gray-300 text-black hover:bg-gray-50 shadow-sm'
              }`}
            disabled={userRole === 'admin'}
          >
            Supervisor Queue (12) {userRole === 'admin' && '(View Only)'}
          </button>
        )}
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden card-shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1f2937]">
              <th className="text-left p-4 text-xs font-semibold text-black/70 uppercase tracking-wide">
                Violation ID
              </th>
              <th className="text-left p-4 text-xs font-semibold text-black/70 uppercase tracking-wide">
                Plate Number
              </th>
              <th className="text-left p-4 text-xs font-semibold text-black/70 uppercase tracking-wide">
                Snapshot
              </th>
              <th className="text-center p-4 text-xs font-semibold text-black/70 uppercase tracking-wide">
                Confidence
              </th>
              <th className="text-left p-4 text-xs font-semibold text-black/70 uppercase tracking-wide">
                Time
              </th>
              <th className="text-left p-4 text-xs font-semibold text-black/70 uppercase tracking-wide">
                Location
              </th>
              <th className="text-left p-4 text-xs font-semibold text-black/70 uppercase tracking-wide">
                Violation
              </th>
              <th className="text-center p-4 text-xs font-semibold text-black/70 uppercase tracking-wide">
                Status
              </th>
              <th className="text-center p-4 text-xs font-semibold text-black/70 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredViolations.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-400">
                  No violations found
                </td>
              </tr>
            ) : (
              filteredViolations.map((violation) => {
                const StatusIcon = getStatusIcon(violation.status);
                return (
                  <tr
                    key={violation.id}
                    className="border-b border-[#1f2937]/40 hover:bg-white/40 cursor-pointer transition-colors"
                    onClick={() => onViewDetail(violation)}
                  >
                    <td className="p-4">
                      <span className="text-sm">{violation.id}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm">{violation.plate}</span>
                    </td>
                    <td className="p-4">
                      <div className="w-20 h-12 bg-[#e5e7eb] rounded flex items-center justify-center">
                        <Eye className="w-5 h-5 text-black/60" />
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          violation.confidence >= 90
                            ? 'bg-emerald-100 border border-emerald-200'
                            : violation.confidence >= 85
                              ? 'bg-amber-100 border border-amber-200'
                              : 'bg-orange-100 border border-orange-200'
                          }`}
                      >
                        {violation.confidence}%
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{violation.time}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-black/60" />
                        <span className="text-sm">{violation.location}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium text-black ${getSeverityColor(violation.severity)}`}>
                        {violation.violation}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center justify-center gap-2 px-3 py-1 rounded text-xs font-medium text-black ${getStatusColor(violation.status)}`}>
                        <StatusIcon className="w-4 h-4 text-black/70" />
                        <span>{violation.status}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 rounded border border-gray-300 hover:bg-gray-100 transition-colors">
                          <CheckCircle className="w-4 h-4 text-black/70" />
                        </button>
                        <button className="p-2 rounded border border-gray-300 hover:bg-gray-100 transition-colors">
                          <XCircle className="w-4 h-4 text-black/70" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
