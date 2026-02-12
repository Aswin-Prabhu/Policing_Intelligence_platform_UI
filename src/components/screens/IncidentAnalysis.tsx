import { useState, useRef, useEffect } from 'react';
import {
    Upload, FileVideo, AlertTriangle, CheckCircle, FileText,
    Activity, Shield, Play, Pause, Maximize2, Download,
    ChevronRight, ArrowRight, Siren, Clock, MapPin, BadgeAlert, BrainCircuit
} from 'lucide-react';

export function IncidentAnalysis() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed'>('idle');
    const [progress, setProgress] = useState(0);
    const [activeTab, setActiveTab] = useState<'fir' | 'ai' | 'violations'>('ai');
    const [isPlaying, setIsPlaying] = useState(false);

    // Simulation Steps
    const [processingStep, setProcessingStep] = useState('');

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.type.startsWith('video/') || droppedFile.type.startsWith('image/'))) {
            setFile(droppedFile);
        }
    };

    const startAnalysis = () => {
        setStatus('uploading');
        setProgress(0);

        // Simulate upload
        let p = 0;
        const interval = setInterval(() => {
            p += 5;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setStatus('processing');
                runProcessingSimulation();
            }
        }, 100);
    };

    const runProcessingSimulation = () => {
        const steps = [
            "Initializing YOLOv8-Track model...",
            "Detecting vehicles & pedestrians...",
            "Analyzing trajectory & speed (Kalman Filter)...",
            "Scanning for helmet violations (Motorcycle CI)...",
            "Detecting collision patterns (Temporal Voting)...",
            "ACCIDENT CONFIRMED - Confidence 0.92",
            "Generating Forensic Evidence Snapshots...",
            "Drafting FIR with GenAI (Ollama)...",
            "Finalizing Cosmos Reasoning Analysis..."
        ];

        let stepIndex = 0;
        setProcessingStep(steps[0]);

        const stepInterval = setInterval(() => {
            stepIndex++;
            if (stepIndex < steps.length) {
                setProcessingStep(steps[stepIndex]);
            } else {
                clearInterval(stepInterval);
                setStatus('completed');
            }
        }, 800);
    };

    const MockVideoPlayer = () => (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden group border border-slate-800 shadow-2xl">
            {/* Mock Video Content */}
            <div className="absolute inset-0 flex items-center justify-center">
                {status === 'completed' ? (
                    <div className="w-full h-full bg-slate-900 relative">
                        <div className="absolute top-4 left-4 text-green-400 font-mono text-xs bg-black/50 px-2 py-1 rounded border border-green-900/50">
                            CAM_01 | 2024-02-11 14:32:05 | FPS: 25
                        </div>

                        {/* Concept of annotated video */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="relative">
                                {/* Car */}
                                <div className="absolute -left-32 top-10 w-24 h-16 border-2 border-red-500 bg-red-500/10 rounded">
                                    <div className="absolute -top-6 left-0 bg-red-600 text-white text-[10px] px-1 py-0.5 font-bold">
                                        CAR ID:2 | 15km/h
                                    </div>
                                </div>

                                {/* Bike */}
                                <div className="absolute left-10 top-0 w-16 h-24 border-2 border-red-500 bg-red-500/10 rounded">
                                    <div className="absolute -top-6 left-0 bg-red-600 text-white text-[10px] px-1 py-0.5 font-bold animate-pulse">
                                        ACCIDENT 0.92
                                    </div>
                                    <div className="absolute -bottom-6 left-0 bg-orange-600 text-white text-[10px] px-1 py-0.5 font-bold">
                                        NO HELMET
                                    </div>
                                </div>

                                {/* Colission Marker */}
                                <div className="absolute left-0 top-8 w-12 h-12 bg-yellow-500/20 rounded-full animate-ping"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <FileVideo className="w-16 h-16 text-slate-700" />
                )}
            </div>

            {/* Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                        <div className="h-1 w-64 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full w-1/3 bg-cyan-500 relative">
                                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white shadow-[0_0_10px_cyan]"></div>
                            </div>
                        </div>
                        <span className="text-xs font-mono text-cyan-200">00:06 / 00:15</span>
                    </div>
                    <Maximize2 className="w-4 h-4 hover:text-cyan-400 cursor-pointer" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50/50">
            {/* Header */}
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <BrainCircuit className="w-8 h-8 text-indigo-600" />
                        AI Incident Analysis
                    </h1>
                    <p className="text-slate-500 mt-1 max-w-2xl">
                        Upload CCTV footage for automated accident reconstruction, forensic analysis, and FIR generation using Traffic AI.
                    </p>
                </div>

                {status === 'completed' && (
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors">
                            <Download className="w-4 h-4" /> Export Report
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-sm transition-colors">
                            <Shield className="w-4 h-4" /> File FIR
                        </button>
                    </div>
                )}
            </div>

            {/* Upload State */}
            {status === 'idle' && (
                <div
                    className={`
            border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300
            ${isDragging ? 'border-cyan-500 bg-cyan-50' : 'border-slate-300 hover:border-cyan-400 hover:bg-slate-50'}
          `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleLeave}
                    onDrop={handleDrop}
                >
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Upload className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                        Drag & Drop CCTV Footage
                    </h3>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">
                        Supported formats: MP4, AVI, MKV.
                        <br />System will auto-detect accidents and violations.
                    </p>

                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="video/*"
                        onChange={(e) => {
                            if (e.target.files?.[0]) setFile(e.target.files[0]);
                        }}
                    />

                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={() => document.getElementById('file-upload')?.click()}
                            className="px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors"
                        >
                            Browse Files
                        </button>

                        {file && (
                            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                <FileVideo className="w-5 h-5 text-indigo-500" />
                                <span className="text-sm font-medium text-slate-700">{file.name}</span>
                                <button
                                    onClick={startAnalysis}
                                    className="ml-4 text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md font-bold hover:bg-indigo-200 transition-colors"
                                >
                                    ANALYZE NOW
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Processing State */}
            {(status === 'uploading' || status === 'processing') && (
                <div className="max-w-2xl mx-auto pt-20 text-center">
                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                        <Activity className="absolute inset-0 m-auto w-8 h-8 text-indigo-600 animate-pulse" />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {status === 'uploading' ? 'Uploading Footage...' : 'Analyzing Incident'}
                    </h2>
                    <p className="text-cyan-600 font-mono text-sm mb-8 min-h-[20px]">
                        {status === 'processing' ? `> ${processingStep}` : `${progress}% Complete`}
                    </p>

                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-indigo-600 h-full transition-all duration-300 ease-out"
                            style={{ width: `${status === 'uploading' ? progress : 100}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Completed Dashboard */}
            {status === 'completed' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Top Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                                <Clock className="w-3 h-3" /> Incident Time
                            </div>
                            <div className="text-xl font-bold text-slate-900">06.50s <span className="text-sm font-normal text-slate-400">in footage</span></div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                                <AlertTriangle className="w-3 h-3 text-red-500" /> Type
                            </div>
                            <div className="text-xl font-bold text-red-600">Major Accident</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                                <Siren className="w-3 h-3 text-indigo-500" /> Confidence
                            </div>
                            <div className="text-xl font-bold text-indigo-900">92% <span className="text-sm font-normal text-slate-400">Verified</span></div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                                <BadgeAlert className="w-3 h-3 text-orange-500" /> Violations
                            </div>
                            <div className="text-xl font-bold text-slate-900">3 <span className="text-sm font-normal text-slate-400">Detected</span></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6 h-[600px]">

                        {/* Left Column: Visuals */}
                        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
                            <MockVideoPlayer />

                            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-4 overflow-hidden">
                                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                                    <span>Forensic Snapshots</span>
                                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">3 Evidence Files</span>
                                </h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="aspect-square bg-slate-100 rounded-lg border border-slate-200 relative overflow-hidden group cursor-pointer hover:border-cyan-400 transition-colors">
                                            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors"></div>
                                            <img
                                                src={`https://placehold.co/400x400/1e293b/FFFFFF/png?text=Evidence+${i}`}
                                                alt="Evidence"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] px-2 py-1">
                                                t={(5.5 + i * 0.5).toFixed(2)}s
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Data Analysis */}
                        <div className="col-span-12 lg:col-span-7 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            {/* Analysis Tabs */}
                            <div className="flex border-b border-slate-100">
                                {[
                                    { id: 'ai', label: 'AI Reasoning', icon: Activity },
                                    { id: 'fir', label: 'Report', icon: FileText },
                                    { id: 'violations', label: 'Violation Data', icon: AlertTriangle },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`
                       flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative
                       ${activeTab === tab.id ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}
                     `}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">

                                {/* COSMOS AI REASONING TAB */}
                                {activeTab === 'ai' && (
                                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                                            <h4 className="flex items-center gap-2 text-indigo-900 font-bold mb-3">
                                                <Activity className="w-4 h-4" />
                                                Causal Analysis (Cosmos AI)
                                            </h4>
                                            <p className="text-sm text-indigo-800 leading-relaxed">
                                                Analysis verifies a collision between Vehicle ID 2 (Car) and Vehicle ID 5 (Motorcycle).
                                                Primary causal factors identified with high confidence: <strong>Excessive Speed</strong> and <strong>Loss of Control</strong>.
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Verified Risk Factors</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                                    <div className="bg-red-100 p-2 rounded-md text-red-600 mt-0.5">
                                                        <BadgeAlert className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <h5 className="text-sm font-bold text-slate-900">Significant Overspeeding</h5>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            Motorcycle (ID:5) recorded at <strong>95.2 km/h</strong> in a 40 km/h zone immediately preceding impact.
                                                            This reduced reaction time by approximately 65%.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                                    <div className="bg-orange-100 p-2 rounded-md text-orange-600 mt-0.5">
                                                        <Shield className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <h5 className="text-sm font-bold text-slate-900">Safety Violation (No Helmet)</h5>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            Rider of Vehicle ID 5 detected <strong>without safety helmet</strong> (Confidence: 0.98).
                                                            This significantly increased the severity risk of the incident.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Sequence of Events</h4>
                                            <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 py-2">
                                                {[
                                                    { t: '5.50s', text: 'Motorcycle ID:5 enters frame at high velocity (95 km/h).' },
                                                    { t: '5.80s', text: 'Vehicle ID:2 (Car) attempts merge into Lane 1.' },
                                                    { t: '6.00s', text: 'IMPACT DETECTED. G-Force spike observed.' },
                                                    { t: '6.50s', text: 'Vehicles come to rest. Traffic halted.' }
                                                ].map((event, i) => (
                                                    <div key={i} className="pl-6 relative">
                                                        <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-slate-300"></div>
                                                        <span className="text-xs font-mono text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100 mr-2">
                                                            t={event.t}
                                                        </span>
                                                        <span className="text-sm text-slate-700">{event.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* REPORT TAB */}
                                {activeTab === 'fir' && (
                                    <div className="animate-in slide-in-from-right-4 duration-300">
                                        <div className="bg-white border border-slate-200 shadow-sm p-8 max-w-2xl mx-auto rounded-none min-h-[500px]">
                                            <div className="text-center border-b border-black/10 pb-6 mb-6">
                                                <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">INFORMATION REPORT</h3>
                                                <p className="text-xs text-slate-500 uppercase tracking-widest font-serif">Kakinada Traffic Police Station - II</p>
                                            </div>

                                            <div className="font-serif text-sm leading-8 text-slate-800 text-justify">
                                                <p className="mb-4">
                                                    <span className="font-bold">Subject:</span> Incident Report generated via Automated CCTV Analysis System (Ref: AI-RUN-2024-892)
                                                </p>
                                                <p className="mb-4">
                                                    On meticulous examination of the localized CCTV footage (Camera ID: CAM_01), an incident constituting a
                                                    road traffic accident was definitively observed between the temporal markers of approximately
                                                    <span className="bg-yellow-100 px-1">5.50 seconds</span> and <span className="bg-yellow-100 px-1">8.50 seconds</span>.
                                                </p>
                                                <p className="mb-4">
                                                    The automated analysis identified two primary vehicles involved: a four-wheeler (Track ID: 2) and a
                                                    two-wheeler (Track ID: 5). Preliminary telemetry data indicates the two-wheeler was travelling at a velocity of
                                                    <span className="font-bold text-red-600">95.2 km/h</span>, significantly exceeding the mandated limit of 40 km/h.
                                                </p>
                                                <p>
                                                    Furthermore, visual algorithmic verification confirms with high probability that the rider of the
                                                    aforementioned two-wheeler was not wearing a protective safety helmet at the time of the incident,
                                                    in violation of Section 129 of the Motor Vehicles Act.
                                                </p>
                                            </div>

                                            <div className="mt-12 pt-6 border-t border-dashed border-slate-300 flex justify-between items-end">
                                                <div className="text-center">
                                                    <div className="w-24 h-12 mb-2 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/f/fa/Signature_sample.svg')] bg-no-repeat bg-contain bg-center"></div>
                                                    <p className="text-xs font-bold text-slate-900 uppercase border-t border-slate-900 pt-1 px-4">Officer In-Charge</p>
                                                </div>
                                                <div className="text-xs text-slate-400 font-mono">
                                                    Generated: {new Date().toLocaleDateString()}
                                                    <br />Hash: 8f92a...b12
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* VIOLATIONS TAB */}
                                {activeTab === 'violations' && (
                                    <div className="animate-in slide-in-from-right-4 duration-300">
                                        <table className="w-full text-sm text-left">
                                            <thead>
                                                <tr className="border-b border-slate-200">
                                                    <th className="py-3 px-4 font-bold text-slate-700 bg-white sticky top-0">Timestamp</th>
                                                    <th className="py-3 px-4 font-bold text-slate-700 bg-white sticky top-0">Vehicle ID</th>
                                                    <th className="py-3 px-4 font-bold text-slate-700 bg-white sticky top-0">Type</th>
                                                    <th className="py-3 px-4 font-bold text-slate-700 bg-white sticky top-0">Violation</th>
                                                    <th className="py-3 px-4 font-bold text-slate-700 bg-white sticky top-0">Details</th>
                                                    <th className="py-3 px-4 font-bold text-slate-700 bg-white sticky top-0 text-right">Confidence</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 bg-white">
                                                {[
                                                    { t: '5.50s', id: '05', type: 'Motorcycle', v: 'Overspeed', d: '95.2 km/h (Limit: 40)', c: '99%', color: 'rose' },
                                                    { t: '5.50s', id: '05', type: 'Motorcycle', v: 'No Helmet', d: 'Visual Confirmation', c: '98%', color: 'orange' },
                                                    { t: '6.00s', id: '02', type: 'Car', v: 'Accident', d: 'Collision Detected', c: '92%', color: 'red' },
                                                    { t: '6.00s', id: '05', type: 'Motorcycle', v: 'Accident', d: 'Collision Detected', c: '92%', color: 'red' },
                                                ].map((row, i) => (
                                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                        <td className="py-3 px-4 font-mono text-slate-500">{row.t}</td>
                                                        <td className="py-3 px-4 font-bold text-slate-900">#{row.id}</td>
                                                        <td className="py-3 px-4 text-slate-600">{row.type}</td>
                                                        <td className="py-3 px-4">
                                                            <span className={`
                                 inline-flex items-center px-2 py-1 rounded text-xs font-bold
                                 ${row.color === 'rose' ? 'bg-rose-100 text-rose-700' : ''}
                                 ${row.color === 'orange' ? 'bg-orange-100 text-orange-700' : ''}
                                 ${row.color === 'red' ? 'bg-red-100 text-red-700' : ''}
                               `}>
                                                                {row.v}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 text-slate-600">{row.d}</td>
                                                        <td className="py-3 px-4 text-right font-mono text-slate-500">{row.c}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
