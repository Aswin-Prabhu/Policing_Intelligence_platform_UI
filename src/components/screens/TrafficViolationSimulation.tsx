import { useState } from 'react';
import {
    Car, ShieldAlert, Upload,
    Activity, Video, Brain, X, CheckCircle, User, Camera
} from 'lucide-react';
import { ZoomPanContainer } from '../ZoomPanContainer';

interface ViolationResult {
    hasViolation: boolean;
    violation_type?: 'No Helmet' | 'Triple Riding' | 'Speeding';
    helmet_confidence?: number;
    vehicle_plate?: string;
    is_stolen?: boolean;
    is_blacklisted?: boolean;
    bbox?: number[]; // [xmin, ymin, xmax, ymax]
    detections?: any[];
    violation_details?: string;
    gov_data?: {
        owner_name: string;
        manufacturer: string;
        model: string;
        registration_date: string;
        pending_challans: number;
        insurance_valid_upto?: string;
        pollution_certification_upto?: string;
    };
}

export function TrafficViolationSimulation() {
    const [files, setFiles] = useState<File[]>([]);
    const [analyzingIndex, setAnalyzingIndex] = useState<number | null>(null);
    const [results, setResults] = useState<ViolationResult[]>([]);
    const [selectedResultIndex, setSelectedResultIndex] = useState<number | null>(null);
    const [cameraId, setCameraId] = useState('traffic_cam_1');

    const selectedResult = selectedResultIndex !== null ? results[selectedResultIndex] : null;
    const selectedFile = selectedResultIndex !== null ? files[selectedResultIndex] : null;

    const [stats, setStats] = useState({
        total: 0,
        tripleRiding: 0,
        noHelmet: 0
    });

    // Track the displayed image's natural dimensions for accurate bbox mapping
    const [imgDimensions, setImgDimensions] = useState<{ w: number; h: number }>({ w: 1, h: 1 });

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
        if (droppedFiles.length > 0) {
            setFiles(prev => [...prev, ...droppedFiles]);
            setResults([]);
            setSelectedResultIndex(null);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
            setFiles(prev => [...prev, ...newFiles]);
            setResults([]);
            setSelectedResultIndex(null);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setResults([]);
        setSelectedResultIndex(null);
    };

    const handleAnalyze = async () => {
        if (files.length === 0) return;

        setResults([]);
        setSelectedResultIndex(null);

        for (let i = 0; i < files.length; i++) {
            setAnalyzingIndex(i);
            const file = files[i];

            try {
                // --- Step 1: Submit file to async endpoint ---
                const formData = new FormData();
                let url = '';

                if (file.type.startsWith('image/')) {
                    url = `/api/helmet/detect-image-async?camera_id=${cameraId}&save_snapshot=true`;
                    formData.append('image', file);
                } else {
                    url = `/api/helmet/detect-video-async?camera_id=${cameraId}&max_frames=100&sample_rate=5&structured_output=true`;
                    formData.append('video', file);
                }

                const submitResponse = await fetch(url, {
                    method: 'POST',
                    headers: { 'accept': 'application/json' },
                    body: formData
                });

                if (!submitResponse.ok) throw new Error(`Submit failed: ${submitResponse.statusText}`);

                const submitData = await submitResponse.json();
                const jobId = submitData.job_id;
                console.log(`Submitted ${file.name}, got job_id: ${jobId}`);

                if (!jobId) throw new Error('No job_id returned from async endpoint');

                // --- Step 2: Poll for results ---
                let pollResult: any = null;
                const maxPolls = 60; // 60 * 2s = 2 min max wait
                for (let p = 0; p < maxPolls; p++) {
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s

                    const pollResponse = await fetch(`/api/helmet/simulation-job/${jobId}?include_result=true`);
                    if (!pollResponse.ok) {
                        console.warn(`Poll attempt ${p + 1} failed: ${pollResponse.status}`);
                        continue;
                    }

                    const pollData = await pollResponse.json();
                    console.log(`Poll ${p + 1} for ${file.name}:`, pollData.status);

                    if (pollData.status === 'completed') {
                        pollResult = pollData.result;
                        break;
                    } else if (pollData.status === 'failed') {
                        throw new Error(pollData.error || 'Job failed on server');
                    }
                    // else status is 'queued' or 'running', keep polling
                }

                if (!pollResult) throw new Error('Polling timed out after 2 minutes');

                // --- Step 3: Map result (same mapping as before) ---
                const data = pollResult;
                const firstViolation = data.violations?.[0];
                const firstVehicle = data.detected_vehicles?.find((v: any) => v.plate) || data.detected_vehicles?.[0];

                let box = firstViolation?.riders?.[0]?.box || firstVehicle?.bbox;

                const result: ViolationResult = {
                    hasViolation: data.detected || (data.violation_count > 0),
                    violation_type: (() => {
                        const types = firstViolation?.violation_type?.split(',') || [];
                        const mapped = types.map((t: string) => {
                            const trimmed = t.trim();
                            if (trimmed === 'triplets') return 'Triple Riding';
                            if (trimmed === 'no_helmet') return 'No Helmet';
                            return trimmed;
                        });
                        return mapped.length > 0 ? mapped.join(' + ') : undefined;
                    })() as any,
                    helmet_confidence: (() => {
                        if (!firstViolation) return undefined;
                        const rideConf = firstViolation.riders?.[0] ? Math.round(firstViolation.riders[0].confidence * 100) : 0;
                        const helmetConf = firstViolation.riders?.[0] ? Math.round(firstViolation.riders[0].helmet_confidence * 100) : 0;
                        if (helmetConf === 0 && rideConf > 0) return rideConf;
                        return helmetConf > 0 ? helmetConf : (rideConf > 0 ? rideConf : undefined);
                    })(),
                    violation_details: (() => {
                        if (!firstViolation) return undefined;
                        const details = [];
                        if (firstViolation.violation_type?.includes('triplets')) {
                            details.push(`${firstViolation.people_count} People`);
                        }
                        if (firstViolation.violation_type?.includes('no_helmet')) {
                            details.push('No Helmet');
                        }
                        return details.length > 0 ? details.join(' | ') : undefined;
                    })(),
                    vehicle_plate: firstViolation?.vehicle_plate || firstVehicle?.plate || '-',
                    is_stolen: data.detected_vehicles?.some((v: any) => v.is_stolen) || false,
                    is_blacklisted: data.detected_vehicles?.some((v: any) => v.is_blacklisted) || false,
                    bbox: box,
                    detections: data.violations || data.detected_vehicles,
                    gov_data: firstVehicle?.gov_data || {
                        owner_name: firstVehicle?.gov_data?.owner_name || '-',
                        manufacturer: firstVehicle?.color ? firstVehicle.color.charAt(0).toUpperCase() + firstVehicle.color.slice(1) : '-',
                        model: firstVehicle?.vehicle_type || '-',
                        registration_date: '-',
                        pending_challans: 0,
                        insurance_valid_upto: '-',
                        pollution_certification_upto: '-'
                    }
                };

                setResults(prev => [...prev, result]);

                setStats(prev => ({
                    total: prev.total + 1,
                    tripleRiding: result.violation_type === 'Triple Riding' ? prev.tripleRiding + 1 : prev.tripleRiding,
                    noHelmet: result.violation_type === 'No Helmet' ? prev.noHelmet + 1 : prev.noHelmet
                }));

            } catch (error) {
                console.error(`Analysis failed for ${file.name}:`, error);

                const errorResult: ViolationResult = {
                    hasViolation: false,
                    violation_type: undefined,
                    vehicle_plate: 'Error',
                    gov_data: {
                        owner_name: '-',
                        manufacturer: '-',
                        model: '-',
                        registration_date: '-',
                        pending_challans: 0
                    }
                };
                setResults(prev => [...prev, errorResult]);
            }
        }
        setAnalyzingIndex(null);
        if (files.length > 0) setSelectedResultIndex(0);
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
                            className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-colors h-64 ${files.length > 0 ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                                }`}
                        >
                            {files.length > 0 ? (
                                <div className="w-full h-full overflow-y-auto custom-scrollbar px-2">
                                    <div className="flex flex-col gap-2">
                                        {files.map((f, i) => (
                                            <div key={i} className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded-lg shadow-sm">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="w-8 h-8 bg-slate-100 rounded-md flex items-center justify-center flex-shrink-0">
                                                        {f.type.startsWith('video') ? <Video className="w-4 h-4 text-slate-500" /> : <Camera className="w-4 h-4 text-slate-500" />}
                                                    </div>
                                                    <div className="flex flex-col truncate">
                                                        <span className="text-xs font-medium text-slate-700 truncate">{f.name}</span>
                                                        <span className="text-[10px] text-slate-400">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeFile(i)}
                                                    className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 text-center">
                                        <button
                                            onClick={() => { setFiles([]); setResults([]); }}
                                            className="text-xs text-rose-500 hover:underline"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Camera className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <p className="font-semibold text-slate-900 text-sm">Click or Drag & Drop</p>
                                    <p className="text-xs text-slate-500 mt-1">JPG, PNG, MP4 (Multiple Allowed)</p>
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="file-upload"
                                        accept="image/*,video/*"
                                        multiple
                                        onChange={handleFileInput}
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-slate-50 rounded-lg text-sm font-medium cursor-pointer inline-block shadow-lg shadow-indigo-200 transition-all hover:scale-105"
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
                                disabled={files.length === 0 || analyzingIndex !== null}
                                onClick={handleAnalyze}
                                className={`w-full py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${files.length === 0 || analyzingIndex !== null
                                    ? 'bg-slate-200 !text-slate-400 cursor-not-allowed'
                                    : 'bg-indigo-600 text-slate-50 hover:bg-indigo-700 hover:shadow-lg'
                                    }`}
                            >
                                {analyzingIndex !== null ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing {analyzingIndex + 1}/{files.length}...
                                    </>
                                ) : (
                                    <>
                                        <Brain className="w-4 h-4" />
                                        Analyze {files.length > 0 ? `(${files.length})` : ''}
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

                    {/* Pending/Processing Status */}
                    {analyzingIndex !== null && (
                        <div className="mb-6 bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex items-center justify-between animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                <div>
                                    <h4 className="text-sm font-bold text-indigo-900">Processing Queue</h4>
                                    <p className="text-xs text-indigo-700">Analyzing file {analyzingIndex + 1} of {files.length} ({files[analyzingIndex]?.name})...</p>
                                </div>
                            </div>
                            <span className="text-xs font-mono font-bold text-indigo-600 bg-white px-2 py-1 rounded">
                                {Math.round(((analyzingIndex) / files.length) * 100)}%
                            </span>
                        </div>
                    )}

                    {/* Result Tabs/Filmstrip */}
                    {results.length > 0 && (
                        <div className="mb-4 flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                            {results.map((r, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedResultIndex(i)}
                                    className={`flex-shrink-0 w-40 p-2 rounded-lg border text-left transition-all ${selectedResultIndex === i
                                        ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500 shadow-sm'
                                        : 'border-slate-200 hover:border-indigo-300 bg-slate-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">File {i + 1}</span>
                                        {r.is_stolen ? (
                                            <ShieldAlert className="w-3 h-3 text-red-500" />
                                        ) : r.hasViolation ? (
                                            <ShieldAlert className="w-3 h-3 text-amber-500" />
                                        ) : (
                                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                                        )}
                                    </div>
                                    <div className="text-xs font-bold text-slate-800 truncate mb-0.5">{files[i]?.name}</div>
                                    <div className={`text-[10px] font-medium truncate ${r.hasViolation ? 'text-rose-600' : 'text-emerald-600'}`}>
                                        {r.violation_type || 'Clean'}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex-1 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200 relative overflow-hidden">
                        {analyzingIndex !== null && results.length === 0 ? (
                            <div className="text-center p-8">
                                <div className="relative w-24 h-24 mx-auto mb-6">
                                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                    <Brain className="absolute inset-0 m-auto w-10 h-10 text-indigo-600 animate-pulse" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Initializing Analysis</h3>
                                <p className="text-slate-500 mb-8">Queuing {files.length} files for sequential processing...</p>
                            </div>
                        ) : selectedResult ? (
                            <div className="w-full h-full p-6 flex flex-col bg-slate-50/50">
                                <div className="flex gap-6 h-full">
                                    {/* Left: Image Preview */}
                                    <div className="w-1/2 flex flex-col">
                                        <ZoomPanContainer className="flex-1 bg-black rounded-xl shadow-lg border border-slate-800">
                                            <div className="relative w-full h-full flex items-center justify-center">
                                                {selectedFile?.type.startsWith('image/') ? (
                                                    <img
                                                        src={URL.createObjectURL(selectedFile)}
                                                        alt="analyzed"
                                                        className="max-w-full max-h-[480px] object-contain block pointer-events-none"
                                                        onLoad={(e) => {
                                                            const img = e.currentTarget;
                                                            setImgDimensions({ w: img.naturalWidth, h: img.naturalHeight });
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-900 min-h-[300px] min-w-[400px]">
                                                        <Video className="w-16 h-16 text-slate-800" />
                                                    </div>
                                                )}

                                                {/* Dynamic Bounding Box from API */}
                                                {selectedResult.bbox && selectedResult.bbox.length === 4 && (
                                                    <div
                                                        className="absolute border-2 border-rose-500 rounded bg-rose-500/10 shadow-[0_0_10px_rgba(244,63,94,0.5)] transition-all duration-300 pointer-events-none"
                                                        style={{
                                                            left: `${((selectedResult.bbox[0] / imgDimensions.w) * 100).toFixed(2)}%`,
                                                            top: `${((selectedResult.bbox[1] / imgDimensions.h) * 100).toFixed(2)}%`,
                                                            width: `${(((selectedResult.bbox[2] - selectedResult.bbox[0]) / imgDimensions.w) * 100).toFixed(2)}%`,
                                                            height: `${(((selectedResult.bbox[3] - selectedResult.bbox[1]) / imgDimensions.h) * 100).toFixed(2)}%`,
                                                        }}
                                                    >
                                                        <div className="absolute -top-5 left-0 flex items-center gap-1">
                                                            <span className="bg-rose-600 text-white text-[8px] uppercase font-black px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap border border-rose-400">
                                                                {selectedResult.violation_type || 'OBJECT'} {selectedResult.helmet_confidence ? `(${selectedResult.helmet_confidence}%)` : ''}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {!selectedResult.bbox && selectedResult.hasViolation && (
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-600/20 px-4 py-2 rounded-lg border border-rose-500 backdrop-blur-md pointer-events-none">
                                                        <p className="text-white font-bold text-sm uppercase tracking-widest">{selectedResult.violation_type}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </ZoomPanContainer>
                                        <div className="mt-4 bg-white p-3 rounded-lg border border-slate-200 text-[10px] text-slate-500 flex justify-between font-mono">
                                            <span>FILE: {selectedFile?.name}</span>
                                            <span>RESULT_ID: #{((selectedResultIndex || 0) + 1)}_{selectedFile?.name.split('.')[0]}</span>
                                        </div>
                                    </div>

                                    {/* Right: Details Panel */}
                                    <div className="w-1/2 flex flex-col space-y-4 overflow-y-auto custom-scrollbar pr-1">

                                        {/* Status Header */}
                                        <div className={`p-4 rounded-xl border flex items-center justify-between shadow-sm ${selectedResult.hasViolation ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${selectedResult.hasViolation ? 'bg-rose-100' : 'bg-emerald-100'}`}>
                                                    {selectedResult.hasViolation ? <ShieldAlert className="w-5 h-5 text-rose-600" /> : <CheckCircle className="w-5 h-5 text-emerald-600" />}
                                                </div>
                                                <div>
                                                    <div className={`text-[10px] font-black uppercase tracking-widest ${selectedResult.hasViolation ? 'text-rose-600' : 'text-emerald-600'}`}>Status Update</div>
                                                    <div className="text-lg font-bold text-slate-900">{selectedResult.hasViolation ? selectedResult.violation_type : 'No Violations Detected'}</div>
                                                </div>
                                            </div>
                                            {!selectedResult.hasViolation && (
                                                <div className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase">CLEAN</div>
                                            )}
                                        </div>

                                        {/* Critical Alerts */}
                                        {selectedResult.is_stolen && (
                                            <div className="bg-red-600 rounded-lg p-3 flex items-center gap-3 border border-red-700 shadow-lg animate-pulse">
                                                <div className="bg-white/20 p-1.5 rounded-md">
                                                    <ShieldAlert className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-white font-black uppercase text-[10px] tracking-widest">CRITICAL SYSTEM ALERT</div>
                                                    <div className="text-white text-xs font-bold font-mono">VEHICLE REPORTED STOLEN</div>
                                                </div>
                                            </div>
                                        )}

                                        {!selectedResult.is_stolen && selectedResult.is_blacklisted && (
                                            <div className="bg-amber-100 border border-amber-200 rounded-lg p-3 flex items-center gap-3">
                                                <ShieldAlert className="w-6 h-6 text-amber-600" />
                                                <div>
                                                    <div className="text-amber-800 font-bold uppercase text-sm">WARNING: BLACKLISTED VEHICLE</div>
                                                    <div className="text-amber-600 text-xs">Vehicle flagged for pending inquiries.</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Violation Card */}
                                        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                                            <div className="relative">
                                                <div className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                                                    AI Detection Analysis
                                                </div>
                                                <div className="text-2xl font-black text-slate-900 flex items-center gap-2 mb-1">
                                                    {selectedResult.hasViolation ? selectedResult.violation_type : 'System Clear'}
                                                </div>
                                                {selectedResult.violation_details && (
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 bg-slate-100 w-fit px-2 py-0.5 rounded">
                                                        {selectedResult.violation_details}
                                                    </div>
                                                )}
                                                <div className="text-xs text-slate-500 font-medium">Confidence Score: <span className={`font-bold ${selectedResult.helmet_confidence && selectedResult.helmet_confidence > 70 ? 'text-emerald-600' : 'text-orange-500'}`}>{selectedResult.helmet_confidence !== undefined ? `${selectedResult.helmet_confidence}%` : '-'}</span></div>
                                            </div>
                                        </div>

                                        {/* Vehicle/Owner Details */}
                                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
                                            <div className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                                                Vehicle Registry (VAHAN)
                                            </div>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                        <div className="text-[10px] text-slate-500 font-black uppercase mb-1">Plate Number</div>
                                                        <div className="font-mono font-black text-slate-800 text-sm tracking-tighter">{selectedResult.vehicle_plate}</div>
                                                    </div>
                                                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                        <div className="text-[10px] text-slate-500 font-black uppercase mb-1">Registered Owner</div>
                                                        <div className="font-bold text-slate-800 text-sm flex items-center gap-1">
                                                            <User className="w-3 h-3 text-slate-400" />
                                                            {selectedResult.gov_data?.owner_name}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Make / Model</div>
                                                        <div className="font-bold text-slate-700 text-xs">{selectedResult.gov_data?.manufacturer} {selectedResult.gov_data?.model}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Reg. Date</div>
                                                        <div className="font-bold text-slate-700 text-xs">{selectedResult.gov_data?.registration_date}</div>
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${selectedResult.gov_data?.pending_challans ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Traffic History</span>
                                                    </div>
                                                    <div className={`text-xs font-black ${selectedResult.gov_data?.pending_challans ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                        {selectedResult.gov_data?.pending_challans || 0} Pending Challans
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <div className="flex items-center gap-3 pt-2">
                                            <div className={`flex-1 p-2.5 rounded-lg flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest border transition-all ${selectedResult.hasViolation ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                                                {selectedResult.hasViolation ? <ShieldAlert className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                {selectedResult.hasViolation ? 'Violation Flagged' : 'Passed Analysis'}
                                            </div>
                                            <button className="flex-1 bg-slate-900 text-white p-2.5 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-black shadow-lg transition-all active:scale-95">
                                                Generate Challan
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

            </div >
        </div >
    );
}
