import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

interface PlateCorrectionProps {
  onBack: () => void;
}

export function PlateCorrection({ onBack }: PlateCorrectionProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Detection Log
        </button>
        <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Correction
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Plate Image */}
        <div className="bg-[#0d1117] border border-[#1f2937] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#1f2937]">
            <h3 className="text-white">License Plate Detection</h3>
          </div>
          <div className="p-12 bg-[#0a0e1a] flex items-center justify-center">
            <div className="inline-block px-16 py-8 bg-yellow-400 text-black rounded-lg">
              <span className="text-4xl font-mono tracking-widest">AP39Z9876</span>
            </div>
          </div>
        </div>

        {/* OCR Results */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#0d1117] border border-[#1f2937] rounded-lg p-6">
            <h3 className="text-white mb-4">AI Detection</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Detected Text</span>
                <span className="text-white font-mono">AP39Z9876</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Confidence</span>
                <span className="text-cyan-400">87%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Region</span>
                <span className="text-white">Andhra Pradesh</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Format Valid</span>
                <span className="text-green-400">Yes</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0d1117] border border-[#1f2937] rounded-lg p-6">
            <h3 className="text-white mb-4">Detection Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Detection ID</span>
                <span className="text-white">DET-0042</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Camera</span>
                <span className="text-white">CAM-NH-018</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Timestamp</span>
                <span className="text-white">10:23:45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="text-orange-400">Pending Review</span>
              </div>
            </div>
          </div>
        </div>

        {/* Correction Form */}
        <div className="bg-[#0d1117] border border-[#1f2937] rounded-lg p-6">
          <h3 className="text-white mb-4">Correct OCR Text</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Corrected Plate Number</label>
              <input
                type="text"
                defaultValue="AP39Z9876"
                className="w-full px-4 py-3 bg-[#0a0e1a] border border-[#1f2937] rounded-lg text-white text-2xl font-mono tracking-wider outline-none focus:border-cyan-500"
              />
              <p className="text-xs text-gray-500 mt-2">Use uppercase letters and numbers only</p>
            </div>

            <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-400 mb-1">Low Confidence Detection</p>
                <p className="text-xs text-yellow-400/80">
                  This detection has a confidence below 90%. Please verify the plate number carefully before saving.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Correction Notes (Optional)</label>
              <textarea
                rows={3}
                placeholder="Add any notes about this correction..."
                className="w-full px-4 py-3 bg-[#0a0e1a] border border-[#1f2937] rounded-lg text-white outline-none focus:border-cyan-500 resize-none"
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
                Save & Validate
              </button>
              <button className="flex-1 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
                Save & Add to Evidence
              </button>
              <button onClick={onBack} className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
