import { useState, useRef, useEffect } from 'react';
import {
    Upload, FileVideo, AlertTriangle, CheckCircle, FileText,
    Activity, Shield, Play, Pause, Maximize2, Download,
    ChevronRight, ArrowRight, Siren, Clock, MapPin, BadgeAlert, BrainCircuit, X
} from 'lucide-react';

interface AnalysisResult {
    timestamp: string;
    incidentType: 'Major Accident' | 'Minor Collision' | 'Near Miss';
    confidence: number;
    violationsCount: number;
    involvedVehicles: { id: string; type: string; speed: string }[];
    summary: string;
}

export function IncidentAnalysis() {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed'>('idle');
    const [processingIndex, setProcessingIndex] = useState<number | null>(null);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState<AnalysisResult[]>([]);
    const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);

    const [activeTab, setActiveTab] = useState<'fir' | 'ai' | 'violations'>('ai');
    const [isPlaying, setIsPlaying] = useState(false);
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
        const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('video/') || f.type.startsWith('image/'));
        if (droppedFiles.length > 0) {
            setFiles(prev => [...prev, ...droppedFiles]);
            // Reset if we were in a completed state to allow new analysis
            if (status === 'completed') {
                setStatus('idle');
                setResults([]);
                setProcessingIndex(null);
            }
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).filter(f => f.type.startsWith('video/') || f.type.startsWith('image/'));
            setFiles(prev => [...prev, ...newFiles]);
            if (status === 'completed') {
                setStatus('idle');
                setResults([]);
                setProcessingIndex(null);
            }
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        if (status === 'completed') {
            setResults(prev => prev.filter((_, i) => i !== index));
            if (selectedFileIndex >= index && selectedFileIndex > 0) {
                setSelectedFileIndex(prev => prev - 1);
            }
        }
    };

    const startAnalysis = async () => {
        if (files.length === 0) return;

        setStatus('uploading');
        setProgress(0);

        // Simulate upload phase
        for (let i = 0; i <= 100; i += 10) {
            setProgress(i);
            await new Promise(r => setTimeout(r, 100));
        }

        setStatus('processing');
        setResults([]);

        for (let i = 0; i < files.length; i++) {
            setProcessingIndex(i);
            await processFile(files[i]);
        }

        setProcessingIndex(null);
        setStatus('completed');
        setSelectedFileIndex(0);
    };

    const processFile = async (file: File) => {
        const steps = [
            "Initializing YOLOv8-Track model...",
            "Detecting vehicles & pedestrians...",
            "Analyzing trajectory & speed (Kalman Filter)...",
            "Scanning for helmet violations (Motorcycle CI)...",
            "Detecting collision patterns (Temporal Voting)...",
            "Generating Forensic Evidence Snapshots...",
            "Drafting FIR with GenAI (Ollama)...",
            "Finalizing Cosmos Reasoning Analysis..."
        ];

        for (const step of steps) {
            setProcessingStep(step);
            await new Promise(r => setTimeout(r, 600)); // Simulate processing time per step
        }

        // Generate mock result for this file
        const mockResult: AnalysisResult = {
            timestamp: new Date().toISOString(),
            incidentType: Math.random() > 0.5 ? 'Major Accident' : 'Minor Collision',
            confidence: Math.floor(Math.random() * 10 + 90),
            violationsCount: Math.floor(Math.random() * 5),
            involvedVehicles: [
                { id: '02', type: 'Car', speed: `${Math.floor(Math.random() * 40 + 40)} km/h` },
                { id: '05', type: 'Motorcycle', speed: `${Math.floor(Math.random() * 60 + 40)} km/h` }
            ],
            summary: `Analysis of ${file.name} indicates a high-probability incident.`
        };

        setResults(prev => [...prev, mockResult]);
    };

    const currentResult = results[selectedFileIndex];
    const currentFile = files[selectedFileIndex];

    const accidentVideoRef = useRef<HTMLVideoElement>(null);
    const ACCIDENT_VIDEO_URL = "https://cdn.gov-cloud.ai/_ENC(nIw4FQRwLOQd0b8T2HcImBUJ5a9zjZEImv/UhJi8/+yUl7Ez+m0qAiCCaOJbNgi5)/CMS/78b40b73-96ae-4c03-9ea5-2310ec61f084_$$_V1_Accident%20jntu%20maingate%2018-11-2019.mkv";
    const LOOP_START = 4;
    const LOOP_END = 14;

    // Static forensic snapshots from the accident video
    const FORENSIC_SNAPSHOTS = [
        { src: '/evidence/1.png', time: '16:16:20' },
        { src: '/evidence/2.png', time: '16:16:21' },
        { src: '/evidence/3.png', time: '16:16:22' },
    ];

    // Loop the accident video between 4s and 14s
    useEffect(() => {
        const vid = accidentVideoRef.current;
        if (!vid) return;

        const handleLoaded = () => {
            vid.currentTime = LOOP_START;
            vid.play().catch(() => { });
        };

        const handleTimeUpdate = () => {
            if (vid.currentTime >= LOOP_END) {
                vid.currentTime = LOOP_START;
            }
        };

        vid.addEventListener('loadeddata', handleLoaded);
        vid.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            vid.removeEventListener('loadeddata', handleLoaded);
            vid.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [status, selectedFileIndex]);

    const MockVideoPlayer = () => (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden group border border-slate-800 shadow-2xl">
            <video
                ref={accidentVideoRef}
                src={ACCIDENT_VIDEO_URL}
                className="w-full h-full object-contain"
                autoPlay
                muted
                playsInline
            />

            {/* Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                        <button onClick={() => {
                            const v = accidentVideoRef.current;
                            if (v) { v.paused ? v.play() : v.pause(); setIsPlaying(!v.paused); }
                        }}>
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                        <div className="h-1 w-64 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500 transition-all" style={{ width: '100%' }} />
                        </div>
                        <span className="text-xs font-mono text-cyan-200">04:00 / 14:00</span>
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

            {/* Upload Area for New Files (Always visible if needed, or when idle) */}
            {(status === 'idle' || (status === 'completed' && files.length > 0)) && (
                <div className={`mb-8 ${status === 'completed' ? 'hidden' : ''}`}> {/* Hide when completed to focus on results, or keep visible? Let's hide main drag drop when done */}
                    {/* We can have a smaller upload button or just use the drag drop when idle */}
                </div>
            )}

            {status === 'idle' ? (
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
                        accept="video/*,image/*"
                        multiple
                        onChange={handleFileInput}
                    />

                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={() => document.getElementById('file-upload')?.click()}
                            className="px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-colors"
                        >
                            Browse Files
                        </button>

                        {/* File List for Idle State */}
                        {files.length > 0 && (
                            <div className="w-full max-w-lg mt-6 space-y-2">
                                {files.map((f, i) => (
                                    <div key={i} className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <FileVideo className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                            <span className="text-sm font-medium text-slate-700 truncate">{f.name}</span>
                                        </div>
                                        <button
                                            onClick={() => removeFile(i)}
                                            className="ml-2 text-slate-400 hover:text-rose-500 p-1"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={startAnalysis}
                                    className="w-full mt-4 text-sm bg-indigo-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                                >
                                    Analyze {files.length} File{files.length > 1 ? 's' : ''}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}

            {/* Processing State */}
            {(status === 'uploading' || status === 'processing') && (
                <div className="max-w-2xl mx-auto pt-20 text-center">
                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                        <Activity className="absolute inset-0 m-auto w-8 h-8 text-indigo-600 animate-pulse" />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {status === 'uploading' ? 'Uploading Footage...' : `Analyzing File ${processingIndex !== null ? processingIndex + 1 : 1} / ${files.length}`}
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
            {status === 'completed' && results.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Top Stats based on CURRENTLY SELECTED RESULT */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                                <Clock className="w-3 h-3" /> Incident Time
                            </div>
                            <div className="text-xl font-bold text-slate-900">16:16:20 <span className="text-sm font-normal text-slate-400">18-11-2019 Mon</span></div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                                <AlertTriangle className="w-3 h-3 text-red-500" /> Type
                            </div>
                            <div className="text-xl font-bold text-red-600">{currentResult?.incidentType}</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                                <Siren className="w-3 h-3 text-indigo-500" /> Confidence
                            </div>
                            <div className="text-xl font-bold text-indigo-900">{currentResult?.confidence}% <span className="text-sm font-normal text-slate-400">Verified</span></div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                                <BadgeAlert className="w-3 h-3 text-orange-500" /> Violations
                            </div>
                            <div className="text-xl font-bold text-slate-900">{currentResult?.violationsCount} <span className="text-sm font-normal text-slate-400">Detected</span></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6 h-[600px]">

                        {/* Left Column: List + Visuals */}
                        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">

                            {/* File Selector */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-48">
                                <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                                    Analyzed Files ({files.length})
                                </div>
                                <div className="overflow-y-auto p-2 space-y-2">
                                    {files.map((f, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedFileIndex(i)}
                                            className={`w-full text-left flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${selectedFileIndex === i
                                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <div className={`w-2 h-2 rounded-full ${results[i]?.confidence > 90 ? 'bg-red-500' : 'bg-orange-400'}`} />
                                                <span className="truncate max-w-[200px]">{f.name}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 ${selectedFileIndex === i ? 'text-indigo-500' : 'text-slate-300'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <MockVideoPlayer />

                            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-4 overflow-hidden">
                                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                                    <span>Forensic Snapshots</span>
                                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">3 Evidence Files</span>
                                </h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {FORENSIC_SNAPSHOTS.map((snap, i) => (
                                        <div key={i} className="aspect-square bg-slate-100 rounded-lg border border-slate-200 relative overflow-hidden group cursor-pointer hover:border-cyan-400 transition-colors">
                                            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors"></div>
                                            <img
                                                src={snap.src}
                                                alt={`Evidence ${i + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] px-2 py-1">
                                                t={snap.time}
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
                                                {currentResult?.summary || "Analyzing..."}
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
                                                            Motorcycle (ID:5) with <strong>two riders</strong> recorded at <strong>95.2 km/h</strong> in a 40 km/h zone immediately preceding impact with a pedestrian.
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
                                                            Both riders on Motorcycle ID:5 detected <strong>without safety helmets</strong> (Confidence: 0.98).
                                                            This significantly increased the severity risk of injuries sustained by the riders.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Sequence of Events - {currentFile?.name}</h4>
                                            <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 py-2">
                                                {[
                                                    { t: '4.00s', text: 'Motorcycle ID:5 with two riders enters frame at high velocity (95 km/h).' },
                                                    { t: '4.50s', text: 'Pedestrian detected crossing road near JNTU Main Gate.' },
                                                    { t: '5.00s', text: 'IMPACT DETECTED. Motorcycle strikes pedestrian. G-Force spike observed.' },
                                                    { t: '5.50s', text: 'Motorcycle and riders come to rest. Pedestrian down. Traffic halted.' }
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
                                                    <span className="font-bold">Subject:</span> Incident Report generated via Automated CCTV Analysis System (Ref: AI-RUN-2024-892-{selectedFileIndex})
                                                </p>
                                                <p className="mb-4">
                                                    On meticulous examination of the CCTV footage captured at JNTU Main Gate on <span className="bg-yellow-100 px-1">18-11-2019 at 16:16:20</span>,
                                                    a road traffic accident involving a two-wheeler and a pedestrian was definitively observed between the temporal markers of approximately
                                                    <span className="bg-yellow-100 px-1">4.00 seconds</span> and <span className="bg-yellow-100 px-1">5.50 seconds</span> in the footage.
                                                </p>
                                                <p className="mb-4">
                                                    The automated analysis identified a two-wheeler (Track ID: 5) carrying <strong>two riders</strong> that struck a pedestrian crossing the road.
                                                    Preliminary telemetry data indicates the two-wheeler was travelling at a velocity of
                                                    <span className="font-bold text-red-600">95.2 km/h</span>, significantly exceeding the mandated limit of 40 km/h.
                                                </p>
                                                <p>
                                                    Furthermore, visual algorithmic verification confirms with high probability that both riders of the
                                                    aforementioned two-wheeler were not wearing protective safety helmets at the time of the incident,
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
                                                    { t: '4.00s', id: '05', type: 'Motorcycle', v: 'Overspeed', d: '95.2 km/h (Limit: 40)', c: '99%', color: 'rose' },
                                                    { t: '4.00s', id: '05', type: 'Motorcycle', v: 'No Helmet', d: '2 Riders - No Helmets', c: '98%', color: 'orange' },
                                                    { t: '5.00s', id: '05', type: 'Motorcycle', v: 'Accident', d: 'Struck Pedestrian', c: '96%', color: 'red' },
                                                    { t: '5.00s', id: 'P1', type: 'Pedestrian', v: 'Accident', d: 'Hit by Motorcycle', c: '96%', color: 'red' },
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
