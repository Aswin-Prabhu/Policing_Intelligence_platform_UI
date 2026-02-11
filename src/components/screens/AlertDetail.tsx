import { ArrowLeft, AlertTriangle, ShieldAlert } from 'lucide-react';

interface AlertDetailProps {
    onBack: () => void;
}

export function AlertDetail({ onBack }: AlertDetailProps) {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Alerts
            </button>

            <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        <ShieldAlert className="w-6 h-6 text-orange-500" />
                        Alert Details
                    </h2>
                </div>

                <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-slate-600" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No Alert Selected</h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                        Please select an alert from the main dashboard or alerts list to view full details here.
                    </p>
                </div>
            </div>
        </div>
    );
}
