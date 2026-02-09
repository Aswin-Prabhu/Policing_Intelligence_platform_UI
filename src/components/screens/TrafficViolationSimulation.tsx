import { useState } from 'react';
import {
    Car, ShieldAlert, Upload,
    Activity, Video, Brain, X, CheckCircle, FileText, User, MapPin
} from 'lucide-react';
import { Camera } from 'lucide-react';

interface ViolationResult {
    hasViolation: boolean;
    type?: 'No Helmet' | 'Triple Riding' | 'Speeding';
    confidence?: number;
    vehicleNo?: string;
    ownerName?: string;
    vehicleModel?: string;
    challanStatus?: 'Generated' | 'Pending';
}

export function TrafficViolationSimulation() {
    const [file, setFile] = useState<File | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<ViolationResult | null>(null);
    const [cameraId, setCameraId] = useState('traffic_cam_1');

    const [stats, setStats] = useState({
        total: 124,
        tripleRiding: 45,
        noHelmet: 79
    });

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.type.startsWith('image/') || droppedFile.type.startsWith('video/'))) {
            setFile(droppedFile);
            setResult(null);
        }
    };

    const handleAnalyze = () => {
        if (!file) return;

        setAnalyzing(true);
        // Simulate AI inference + DB Lookup delay
        setTimeout(() => {
            const isTriple = Math.random() > 0.5;
            const detectedType = isTriple ? 'Triple Riding' : 'No Helmet';

            setResult({
                hasViolation: true,
                type: detectedType,
                confidence: Math.floor(Math.random() * 5 + 95),
                vehicleNo: `AP 39 ${String.fromCharCode(65 + Math.random() * 26)}${String.fromCharCode(65 + Math.random() * 26)} ${Math.floor(Math.random() * 8999 + 1000)}`,
                ownerName: isTriple ? 'Rajesh Kumar' : 'Suresh Babu',
                vehicleModel: isTriple ? 'Honda Activa 6G' : 'Hero Splendor+',
                challanStatus: 'Generated'
            });

            setStats(prev => ({
                total: prev.total + 1,
                tripleRiding: detectedType === 'Triple Riding' ? prev.tripleRiding + 1 : prev.tripleRiding,
                noHelmet: detectedType === 'No Helmet' ? prev.noHelmet + 1 : prev.noHelmet
            }));
            setAnalyzing(false);
        }, 2500);
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen space-y-6">
            {/* Header */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <Activity className="w-6 h-6 text-indigo-600" />
                    Traffic Violation Detection Portal
                </h1>
                <p className="text-slate-500 mt-1">Upload images or video clips to detect helmet and triple riding violations for challan generation</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column (4/12): Upload & Stats */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Upload Section */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <Upload className="w-4 h-4 text-orange-600" />
                            Upload Evidence
                        </h2>

                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-colors h-64 ${file ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                                }`}
                        >
                            {file ? (
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-white shadow-sm">
                                        {file.type.startsWith('video') ? <Video className="w-6 h-6 text-indigo-600" /> : <Camera className="w-6 h-6 text-indigo-600" />}
                                    </div>
                                    <p className="font-bold text-slate-900 text-sm truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-slate-500 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    <button
                                        onClick={() => { setFile(null); setResult(null); }}
                                        className="px-3 py-1.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-medium flex items-center gap-1 mx-auto transition-colors"
                                    >
                                        <X className="w-3 h-3" /> Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Camera className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <p className="font-semibold text-slate-900 text-sm">Click or Drag & Drop</p>
                                    <p className="text-xs text-slate-500 mt-1">JPG, PNG, MP4</p>
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="file-upload"
                                        accept="image/*,video/*"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                setFile(e.target.files[0]);
                                                setResult(null);
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium cursor-pointer inline-block shadow-lg shadow-indigo-200 transition-all hover:scale-105"
                                    >
                                        Browse Files
                                    </label>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 space-y-3">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">Camera ID</label>
                                <input
                                    type="text"
                                    value={cameraId}
                                    onChange={(e) => setCameraId(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-sm text-slate-700"
                                />
                            </div>
                            <button
                                disabled={!file || analyzing}
                                onClick={handleAnalyze}
                                className={`w-full py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${!file || analyzing
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:shadow-lg'
                                    }`}
                            >
                                {analyzing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Brain className="w-4 h-4" />
                                        Analyze
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Stats Section (Compact) */}
                    <div className="space-y-3">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Daily Insights</h2>

                        {/* Total Violations */}
                        <div className="bg-white border border-indigo-100 rounded-xl p-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-50/50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                            <div className="relative z-10 flex justify-between items-center">
                                <div>
                                    <div className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">Total Violations</div>
                                    <div className="text-3xl font-bold text-slate-800">{stats.total}</div>
                                </div>
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <Activity className="w-6 h-6 text-indigo-600" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Triplet */}
                            <div className="bg-white border border-orange-100 rounded-xl p-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute right-0 top-0 w-24 h-24 bg-orange-50/50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                                <div className="relative z-10">
                                    <div className="text-[10px] text-orange-600 font-bold uppercase tracking-wider mb-1">Triple Riding</div>
                                    <div className="text-2xl font-bold text-slate-800">{stats.tripleRiding}</div>
                                </div>
                            </div>

                            {/* No Helmet */}
                            <div className="bg-white border border-rose-100 rounded-xl p-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                <div className="absolute right-0 top-0 w-24 h-24 bg-rose-50/50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                                <div className="relative z-10">
                                    <div className="text-[10px] text-rose-600 font-bold uppercase tracking-wider mb-1">No Helmet</div>
                                    <div className="text-2xl font-bold text-slate-800">{stats.noHelmet}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column (8/12): Results */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col min-h-[600px]">
                    <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-600" />
                        Detection Results & Analysis
                    </h2>

                    <div className="flex-1 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200 relative overflow-hidden">
                        {analyzing ? (
                            <div className="text-center p-8">
                                <div className="relative w-24 h-24 mx-auto mb-6">
                                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                    <Brain className="absolute inset-0 m-auto w-10 h-10 text-indigo-600 animate-pulse" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Analyzing Footage</h3>
                                <p className="text-slate-500 mb-8">Running AI models and querying VAHAN database...</p>
                                <div className="space-y-3 max-w-xs mx-auto text-left pl-8">
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" /> Helmet Detection Model
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" /> Triple Riding Model
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /> Vehicle Owner Lookup
                                    </div>
                                </div>
                            </div>
                        ) : result ? (
                            <div className="w-full h-full p-6 flex flex-col bg-slate-50/50">
                                <div className="flex gap-6 h-full">
                                    {/* Left: Image Preview */}
                                    <div className="w-1/2 flex flex-col">
                                        <div className="flex-1 bg-black rounded-xl relative overflow-hidden group shadow-lg">
                                            {file?.type.startsWith('image/') ? (
                                                <img src={URL.createObjectURL(file)} alt="analyzed" className="w-full h-full object-cover opacity-90" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                                    <Video className="w-16 h-16 text-slate-600" />
                                                </div>
                                            )}

                                            {/* Bounding Box Mockup */}
                                            <div className="absolute top-1/4 left-1/4 w-40 h-40 border-2 border-rose-500 rounded bg-rose-500/10 backdrop-blur-[2px] flex items-center justify-center">
                                                <span className="bg-rose-600 text-white text-[10px] uppercase font-bold px-2 py-1 absolute -top-3 left-0 rounded shadow-sm">
                                                    {result.type} ({result.confidence}%)
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-4 bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-500 flex justify-between">
                                            <span>Frame ID: 89334-A</span>
                                            <span>Timestamp: {new Date().toLocaleTimeString()}</span>
                                        </div>
                                    </div>

                                    {/* Right: Details Panel */}
                                    <div className="w-1/2 flex flex-col space-y-4">
                                        {/* Violation Card */}
                                        <div className="bg-white p-5 rounded-xl border border-rose-100 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -mr-4 -mt-4" />
                                            <div className="relative">
                                                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">Detected Violation</div>
                                                <div className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-1">
                                                    <ShieldAlert className={`w-6 h-6 ${result.type === 'No Helmet' ? 'text-rose-600' : 'text-amber-500'}`} />
                                                    {result.type}
                                                </div>
                                                <div className="text-sm text-slate-500">Confidence Score: <span className="font-bold text-emerald-600">{result.confidence}%</span></div>
                                            </div>
                                        </div>

                                        {/* Vehicle/Owner Details */}
                                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-1">
                                            <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                                                Vehicle Registry (VAHAN)
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400"><FileText className="w-5 h-5" /></div>
                                                    <div>
                                                        <div className="text-xs text-slate-400 font-medium uppercase">Registration No.</div>
                                                        <div className="font-mono font-bold text-slate-800 text-lg">{result.vehicleNo}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400"><User className="w-5 h-5" /></div>
                                                    <div>
                                                        <div className="text-xs text-slate-400 font-medium uppercase">Owner Name</div>
                                                        <div className="font-bold text-slate-800 text-lg">{result.ownerName}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400"><Car className="w-5 h-5" /></div>
                                                    <div>
                                                        <div className="text-xs text-slate-400 font-medium uppercase">Vehicle Model</div>
                                                        <div className="font-bold text-slate-800 text-lg">{result.vehicleModel}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-green-50 border border-green-200 p-3 rounded-lg flex items-center justify-center gap-2 text-green-700 font-bold text-sm">
                                                <CheckCircle className="w-4 h-4" /> Challan Generated
                                            </div>
                                            <button className="flex-1 bg-slate-800 text-white p-3 rounded-lg font-medium text-sm hover:bg-slate-900 shadow">
                                                Print / Export
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center opacity-40 p-8">
                                <Car className="w-24 h-24 text-slate-300 mx-auto mb-4" />
                                <p className="text-xl font-medium text-slate-500">Detailed detection results and vehicle particulars will appear here</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
