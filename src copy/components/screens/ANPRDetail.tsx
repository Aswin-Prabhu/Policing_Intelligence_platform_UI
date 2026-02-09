import { ArrowLeft, MapPin, CheckCircle, Edit3, FolderPlus, Calendar, Clock, User, Car, Shield, AlertTriangle, FileText, Camera, TrendingUp } from 'lucide-react';
import anpr1 from '../../assets/anpr_images/AP39 (1).jpg';
import anpr2 from '../../assets/anpr_images/anpr_1.jpg';
import anpr3 from '../../assets/anpr_images/anpr_2.jpg';
import anpr4 from '../../assets/anpr_images/anpr_3.jpg';
import anpr5 from '../../assets/anpr_images/anpr_4.jpg';
import anpr6 from '../../assets/anpr_images/anpr_5.jpeg';
import anpr7 from '../../assets/anpr_images/anpr_6.jpg';
import anpr8 from '../../assets/anpr_images/anpr_7.jpg';

const imageMap: Record<string, string> = {
  'VL-001': anpr1,
  'VL-002': anpr2,
  'VL-003': anpr3,
  'VL-004': anpr4,
  'VL-005': anpr5,
  'VL-006': anpr6,
  'VL-007': anpr7,
  'VL-008': anpr8,
};

interface ANPRDetailProps {
  onBack: () => void;
  violation?: any;
}

export function ANPRDetail({ onBack, violation }: ANPRDetailProps) {
  // Enhanced data structure with ANPR engine + Gov DB data
  const data = violation || {
    id: 'VL-001',
    plate: 'AP05DY3395',
    confidence: 96,
    plate_confidence: 96,
    time: '10:23:45',
    date: '2025-11-21',
    location: 'Bhanugudi Jn',
    zone: 'Zone-A',
    status: 'Pending',
    violation: 'Stolen Vehicle',
    severity: 'critical',
    camera_id: 'anpr',
    track_id: 1,
    vehicle_id: 1,
    vehicle_model: 'car',
    color: 'white',
    make: null,
    latency_ms: 0.0,
    sequence: 1,
  };

  // Government DB data (VAHAN-like)
  const govDbData = {
    ownerName: 'Ravi Kumar',
    vehicleType: 'Private Car',
    makeModel: 'Maruti Suzuki Swift',
    color: 'White',
    registrationRTO: 'AP05 - Kakinada',
    insuranceStatus: 'Valid until Dec 2026',
    fitnessStatus: 'Expired',
    alerts: 'Stolen / Suspicious',
    fuzzyMatchScore: 87.5, // Embedding-based similarity match
  };

  const selectedImage = imageMap[data.id] || anpr1;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-amber-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Violations
          </button>
          <h1 className="text-xl font-bold text-gray-900">Violation Detail</h1>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* License Plate Detection - Compact */}
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-sm">
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">License Plate Detection</h3>
              </div>
              <div className="p-4">
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-block px-8 py-4 bg-white border-3 border-black text-black rounded-lg mb-3 shadow-md">
                      <span className="text-2xl font-bold font-mono tracking-wider">{data.plate}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${data.confidence > 90 ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-yellow-100 text-yellow-700 border border-yellow-300'}`}>
                        {data.confidence}% Confidence
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 border border-blue-300 rounded text-xs font-medium">{data.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Snapshot - Compact */}
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-sm overflow-hidden">
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Vehicle Snapshot</h3>
              </div>
              <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={selectedImage}
                  alt="Vehicle Snapshot"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Actions - Compact */}
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Validate
              </button>
              <button className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2 text-sm font-medium">
                <Edit3 className="w-4 h-4" />
                Correct OCR
              </button>
              <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm font-medium">
                <FolderPlus className="w-4 h-4" />
                Add Evidence
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Violation Details - Compact */}
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-sm">
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Violation Details</h3>
              </div>
              <div className="p-4 space-y-2.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Violation ID</span>
                  <span className="text-gray-900 font-medium">{data.id}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Plate Number</span>
                  <span className="text-gray-900 font-mono font-semibold">{data.plate}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Violation Type</span>
                  <span className="text-red-600 font-semibold">{data.violation}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Severity</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getSeverityColor(data.severity)}`}>
                    {data.severity}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 border border-orange-300 rounded text-xs font-medium">{data.status}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Confidence</span>
                  <span className="text-green-600 font-semibold">{data.confidence}%</span>
                </div>
                {govDbData.fuzzyMatchScore && (
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
                    <span className="text-gray-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Similarity Match
                    </span>
                    <span className="text-blue-600 font-semibold">{govDbData.fuzzyMatchScore}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Government DB Info - New Section */}
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-sm">
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Government Database
                </h3>
              </div>
              <div className="p-4 space-y-2.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Owner
                  </span>
                  <span className="text-gray-900 font-medium">{govDbData.ownerName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Car className="w-3 h-3" />
                    Vehicle Type
                  </span>
                  <span className="text-gray-900 font-medium">{govDbData.vehicleType}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Make / Model</span>
                  <span className="text-gray-900 font-medium">{govDbData.makeModel}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Color</span>
                  <span className="text-gray-900 font-medium">{govDbData.color}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">RTO</span>
                  <span className="text-gray-900 font-medium text-xs">{govDbData.registrationRTO}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Insurance</span>
                  <span className="text-green-600 font-medium text-xs">{govDbData.insuranceStatus}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Fitness</span>
                  <span className="text-red-600 font-medium text-xs">{govDbData.fitnessStatus}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-red-200 bg-red-50 rounded px-2 py-1.5">
                  <span className="text-red-700 flex items-center gap-1 font-semibold">
                    <AlertTriangle className="w-3 h-3" />
                    Alerts
                  </span>
                  <span className="text-red-700 font-bold text-xs">{govDbData.alerts}</span>
                </div>
              </div>
            </div>

            {/* Time & Location - Compact */}
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-sm">
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Time & Location</h3>
              </div>
              <div className="p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Date:</span>
                  <span className="text-gray-900 font-medium">{data.date || 'November 21, 2025'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Time:</span>
                  <span className="text-gray-900 font-medium">{data.time || '10:23:45'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Location:</span>
                  <span className="text-gray-900 font-medium">{data.location}</span>
                </div>
                <div className="mt-2 aspect-video bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            </div>

            {/* ANPR Engine Data - New Compact Section */}
            <div className="bg-white border-2 border-gray-300 rounded-lg shadow-sm">
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  ANPR Engine Data
                </h3>
              </div>
              <div className="p-4 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-600">Camera ID:</span>
                    <span className="text-gray-900 font-medium ml-1">{data.camera_id || 'anpr'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Zone:</span>
                    <span className="text-gray-900 font-medium ml-1">{data.zone || 'Zone-A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Track ID:</span>
                    <span className="text-gray-900 font-medium ml-1">{data.track_id || '1'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Vehicle ID:</span>
                    <span className="text-gray-900 font-medium ml-1">{data.vehicle_id || '1'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Model:</span>
                    <span className="text-gray-900 font-medium ml-1 capitalize">{data.vehicle_model || 'car'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Color:</span>
                    <span className="text-gray-900 font-medium ml-1 capitalize">{data.color || 'white'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Plate Conf:</span>
                    <span className="text-gray-900 font-medium ml-1">{data.plate_confidence || data.confidence}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Latency:</span>
                    <span className="text-gray-900 font-medium ml-1">{data.latency_ms || '0.0'}ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
