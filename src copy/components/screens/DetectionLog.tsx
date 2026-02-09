import { Cpu, Image, CheckCircle, XCircle, Edit3 } from 'lucide-react';

interface DetectionLogProps {
  onViewBoundingBox: () => void;
  onViewCorrection: () => void;
}

export function DetectionLog({ onViewBoundingBox, onViewCorrection }: DetectionLogProps) {
  const detections = Array.from({ length: 16 }, (_, i) => ({
    id: `DET-${String(i + 1).padStart(4, '0')}`,
    type: ['Person', 'Vehicle', 'Motorcycle', 'License Plate', 'Face'][i % 5],
    confidence: Math.floor(85 + Math.random() * 15),
    camera: `CAM-${String.fromCharCode(65 + (i % 4))}Z-${String(i + 10).padStart(3, '0')}`,
    time: `10:${String(30 - i).padStart(2, '0')}`,
    status: ['Pending', 'Pending', 'Corrected', 'Validated'][i % 4],
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Validated': return 'bg-green-500/20 text-green-400';
      case 'Corrected': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-orange-500/20 text-orange-400';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20">
          All Detections
        </button>
        <button className="px-4 py-2 text-gray-400 hover:bg-white/5 rounded-lg">
          Pending Review
        </button>
        <button className="px-4 py-2 text-gray-400 hover:bg-white/5 rounded-lg">
          License Plates
        </button>
        <button className="px-4 py-2 text-gray-400 hover:bg-white/5 rounded-lg" onClick={onViewCorrection}>
          Corrections
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {detections.map((detection) => (
          <div
            key={detection.id}
            onClick={detection.type === 'License Plate' ? onViewCorrection : onViewBoundingBox}
            className="bg-[#0d1117] border-2 border-[#1f2937] rounded-lg overflow-hidden hover:border-cyan-500 cursor-pointer transition-all"
          >
            <div className="aspect-square bg-[#0a0e1a] flex items-center justify-center relative">
              <Image className="w-16 h-16 text-gray-700" />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(detection.status)}`}>
                  {detection.status}
                </span>
              </div>
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-white">
                <Cpu className="w-3 h-3 inline mr-1" />
                {detection.confidence}%
              </div>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white">{detection.type}</span>
                <span className="text-xs text-gray-500">{detection.time}</span>
              </div>
              <p className="text-xs text-gray-500">{detection.camera}</p>
              <div className="flex gap-1 pt-2">
                <button className="flex-1 p-1.5 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30">
                  <CheckCircle className="w-3 h-3 mx-auto" />
                </button>
                <button className="flex-1 p-1.5 bg-yellow-500/20 text-yellow-400 rounded hover:bg-yellow-500/30">
                  <Edit3 className="w-3 h-3 mx-auto" />
                </button>
                <button className="flex-1 p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">
                  <XCircle className="w-3 h-3 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
