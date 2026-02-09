import {
    MapPin, Target, Camera, Clock, AlertTriangle, Zap, ChevronRight,
    Filter, Play, Square, CheckCircle, User, Activity, LayoutGrid
} from 'lucide-react';
import { useState } from 'react';

export function CrossCameraTracking() {
    // Workflow states: 'selection' | 'camera-feed' | 'tracking' | 'completed'
    const [workflowStep, setWorkflowStep] = useState<'selection' | 'camera-feed' | 'tracking' | 'completed'>('selection');
    const [selectedZone, setSelectedZone] = useState('');
    const [selectedCameraId, setSelectedCameraId] = useState('');
    const [selectedTarget, setSelectedTarget] = useState<any>(null);
    const [detectionRunning, setDetectionRunning] = useState(false);
    const [trackingSession, setTrackingSession] = useState<any>(null);

    // Mock data preserved from original file
    const zones = ['North Zone', 'Central Zone', 'East Zone', 'South Zone', 'West Zone'];

    const camerasByZone: Record<string, any[]> = {
        'North Zone': [
            { id: 'CAM-NZ-042', name: 'Gandhi Chowk Junction', status: 'online', lastSeen: '2s ago' },
            { id: 'CAM-NZ-047', name: 'Railway Station Exit', status: 'online', lastSeen: '1s ago' },
            { id: 'CAM-NZ-051', name: 'Market Street', status: 'online', lastSeen: '3s ago' },
        ],
        'Central Zone': [
            { id: 'CAM-CZ-012', name: 'Central Bus Stand', status: 'online', lastSeen: '1s ago' },
            { id: 'CAM-CZ-019', name: 'Junction Point', status: 'online', lastSeen: '2s ago' },
            { id: 'CAM-CZ-024', name: 'Commercial Street', status: 'online', lastSeen: '4s ago' },
        ],
        'East Zone': [
            { id: 'CAM-EZ-003', name: 'Beach Road Entry', status: 'online', lastSeen: '1s ago' },
            { id: 'CAM-EZ-008', name: 'Port Area Gate', status: 'online', lastSeen: '2s ago' },
        ],
        'South Zone': [
            { id: 'CAM-SZ-015', name: 'Highway Toll Plaza', status: 'online', lastSeen: '1s ago' },
            { id: 'CAM-SZ-022', name: 'IT Park Entrance', status: 'online', lastSeen: '3s ago' },
        ],
        'West Zone': [
            { id: 'CAM-WZ-007', name: 'Industrial Area', status: 'online', lastSeen: '2s ago' },
            { id: 'CAM-WZ-013', name: 'Residential Junction', status: 'online', lastSeen: '1s ago' },
        ],
    };

    const detectedObjects = [
        { id: 'target-1', type: 'Vehicle', identifier: 'AP 39 AB 1234', confidence: 95, x: 40, y: 30 },
        { id: 'target-2', type: 'Vehicle', identifier: 'AP 39 CD 5678', confidence: 92, x: 60, y: 50 },
        { id: 'target-3', type: 'Person', identifier: 'Person #12', confidence: 88, x: 25, y: 45 },
    ];

    const targetInfo = {
        type: 'Vehicle',
        plateNumber: 'AP 39 AB 1234',
        initialCamera: selectedCameraId || 'CAM-NZ-042',
        startTime: '14:23:15',
        confidence: 'High',
        status: 'Active Tracking'
    };

    const cameraHops = [
        { id: 1, camera: 'CAM-NZ-042', zone: 'North Zone', time: '14:23:15', confidence: 95, status: 'confirmed' },
        { id: 2, camera: 'CAM-NZ-047', zone: 'North Zone', time: '14:24:42', confidence: 92, status: 'confirmed' },
        { id: 3, camera: 'CAM-CZ-012', zone: 'Central Zone', time: '14:26:18', confidence: 89, status: 'confirmed' },
        { id: 4, camera: 'CAM-CZ-019', zone: 'Central Zone', time: '14:27:51', confidence: 88, status: 'current' },
    ];

    const predictedCameras = [
        { camera: 'CAM-CZ-024', zone: 'Central Zone', likelihood: 87, eta: '~30 sec', distance: '0.4 km' },
        { camera: 'CAM-EZ-003', zone: 'East Zone', likelihood: 62, eta: '~2 min', distance: '1.2 km' },
        { camera: 'CAM-CZ-031', zone: 'Central Zone', likelihood: 45, eta: '~3 min', distance: '1.8 km' },
    ];

    // Handlers
    const handleApplyFilters = () => {
        if (!selectedZone) {
            alert('Please select a zone');
            return;
        }
        setWorkflowStep('camera-feed');
        setDetectionRunning(false);
    };

    const handleStartDetection = () => {
        setDetectionRunning(true);
    };

    const handleSelectTarget = (target: any) => {
        setSelectedTarget(target);
        setWorkflowStep('tracking');
        setTrackingSession({
            startTime: new Date().toLocaleTimeString(),
            operator: 'OP-Rajesh Kumar',
            operatorId: 'OP-2024-042',
            zone: selectedZone,
            camera: selectedCameraId,
        });
    };

    const handleStopTracking = () => {
        setWorkflowStep('completed');
    };

    const handleAddToEvidence = () => {
        alert('Added to Evidence Console');
    };

    const handleEscalate = () => {
        alert('Escalated to Supervisor');
    };

    const handleBackToStart = () => {
        setWorkflowStep('selection');
        setSelectedZone('');
        setSelectedCameraId('');
        setSelectedTarget(null);
        setDetectionRunning(false);
        setTrackingSession(null);
    };

    // Helper for Stepper
    const getStepStatus = (step: string) => {
        const steps = ['selection', 'camera-feed', 'tracking', 'completed'];
        const currentIndex = steps.indexOf(workflowStep);
        const stepIndex = steps.indexOf(step);

        if (currentIndex === stepIndex) return 'current';
        if (currentIndex > stepIndex) return 'completed';
        return 'upcoming';
    };

    return (
        <div className="bg-slate-50 min-h-screen p-8 space-y-8">
            {/* Header & Stepper */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Multi-Camera Tracking</h1>
                        <p className="text-sm text-slate-500 mt-1">Real-time cross-camera subject pursuit and analysis</p>
                    </div>
                    {trackingSession && workflowStep === 'tracking' && (
                        <div className="px-4 py-2 bg-rose-50 border border-rose-100 rounded-full flex items-center gap-2 animate-pulse">
                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                            <span className="text-sm font-bold text-rose-700">LIVE TRACKING ACTIVE</span>
                        </div>
                    )}
                </div>

                {/* Visual Workflow Stepper */}
                <div className="relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
                    <div className="relative z-10 flex justify-between">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center gap-2 bg-white px-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${getStepStatus('selection') === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' :
                                getStepStatus('selection') === 'current' ? 'bg-white border-indigo-600 text-indigo-600 shadow-[0_0_0_4px_rgba(79,70,229,0.1)]' :
                                    'bg-white border-slate-300 text-slate-300'
                                }`}>
                                {getStepStatus('selection') === 'completed' ? <CheckCircle className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
                            </div>
                            <span className={`text-xs font-semibold ${getStepStatus('selection') === 'current' ? 'text-indigo-700' : 'text-slate-500'
                                }`}>Zone Selection</span>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center gap-2 bg-white px-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${getStepStatus('camera-feed') === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' :
                                getStepStatus('camera-feed') === 'current' ? 'bg-white border-indigo-600 text-indigo-600 shadow-[0_0_0_4px_rgba(79,70,229,0.1)]' :
                                    'bg-white border-slate-300 text-slate-300'
                                }`}>
                                {getStepStatus('camera-feed') === 'completed' ? <CheckCircle className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                            </div>
                            <span className={`text-xs font-semibold ${getStepStatus('camera-feed') === 'current' ? 'text-indigo-700' : 'text-slate-500'
                                }`}>Target Identification</span>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center gap-2 bg-white px-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${getStepStatus('tracking') === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' :
                                getStepStatus('tracking') === 'current' ? 'bg-white border-indigo-600 text-indigo-600 shadow-[0_0_0_4px_rgba(79,70,229,0.1)]' :
                                    'bg-white border-slate-300 text-slate-300'
                                }`}>
                                {getStepStatus('tracking') === 'completed' ? <CheckCircle className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                            </div>
                            <span className={`text-xs font-semibold ${getStepStatus('tracking') === 'current' ? 'text-indigo-700' : 'text-slate-500'
                                }`}>Active Pursuit</span>
                        </div>

                        {/* Step 4 */}
                        <div className="flex flex-col items-center gap-2 bg-white px-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${getStepStatus('completed') === 'current' ? 'bg-emerald-500 border-emerald-500 text-white' :
                                'bg-white border-slate-300 text-slate-300'
                                }`}>
                                {getStepStatus('completed') === 'current' ? <CheckCircle className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                            </div>
                            <span className={`text-xs font-semibold ${getStepStatus('completed') === 'current' ? 'text-emerald-700' : 'text-slate-500'
                                }`}>Session Summary</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Screen 1: Camera Selection */}
            {workflowStep === 'selection' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Filter className="w-5 h-5 text-slate-500" />
                            Surveillance Parameters
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-2 block">Surveillance Zone <span className="text-rose-500">*</span></label>
                                <select
                                    value={selectedZone}
                                    onChange={(e) => setSelectedZone(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                >
                                    <option value="">Select Zone</option>
                                    {zones.map(zone => (
                                        <option key={zone} value={zone}>{zone}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-slate-700 mb-2 block">Camera ID (Optional)</label>
                                <input
                                    type="text"
                                    value={selectedCameraId}
                                    onChange={(e) => setSelectedCameraId(e.target.value)}
                                    placeholder="e.g., CAM-NZ-042"
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                                <p className="text-xs text-slate-500 mt-2">Leave empty to view all cameras in the selected zone.</p>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleApplyFilters}
                                    disabled={!selectedZone}
                                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                >
                                    Proceed to Live Feed
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                            <MapPin className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h3 className="text-slate-800 font-bold mb-2">Smart Zone Selection</h3>
                        <p className="text-slate-500 text-sm max-w-xs">
                            Select a zone to load available camera feeds. You can filter specific cameras to narrow down the search area for the target.
                        </p>
                    </div>
                </div>
            )}

            {/* Screen 2: Camera Feed & Detection */}
            {workflowStep === 'camera-feed' && (
                <div className="space-y-6">
                    {/* Controls */}
                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <button
                            onClick={handleBackToStart}
                            className="text-slate-500 hover:text-slate-800 text-sm flex items-center gap-2 transition-colors font-medium"
                        >
                            <ChevronRight className="w-4 h-4 rotate-180" />
                            Back to Selection
                        </button>
                        <div className="text-center">
                            <h2 className="text-lg font-bold text-slate-800">
                                {selectedCameraId ? `Live Feed: ${selectedCameraId}` : `${selectedZone} - Camera Grid`}
                            </h2>
                            <p className="text-xs text-slate-500">
                                {selectedCameraId ? 'Single Camera View' : `Monitoring all active cameras in ${selectedZone}`}
                            </p>
                        </div>
                        <div>
                            {selectedCameraId && !detectionRunning && (
                                <button
                                    onClick={handleStartDetection}
                                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium flex items-center gap-2 shadow-sm transition-all"
                                >
                                    <Play className="w-4 h-4 fill-current" />
                                    Start AI Detection
                                </button>
                            )}
                            {selectedCameraId && detectionRunning && (
                                <div className="px-4 py-2 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg flex items-center gap-2 text-sm font-medium">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                    Detection Active
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Grid View */}
                    {(!selectedCameraId) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(camerasByZone[selectedZone] || []).map(camera => (
                                <div key={camera.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all group">
                                    <div className="relative bg-slate-900 aspect-video">
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                                            <Camera className="w-12 h-12 opacity-50" />
                                        </div>
                                        <div className="absolute top-3 right-3">
                                            <span className="px-2 py-1 bg-emerald-500/90 text-white text-[10px] font-bold rounded shadow-sm backdrop-blur-sm">
                                                {camera.status.toUpperCase()}
                                            </span>
                                        </div>

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => setSelectedCameraId(camera.id)}
                                                className="px-4 py-2 bg-white text-slate-900 rounded-lg font-semibold transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                                            >
                                                Select Feed
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-slate-800 font-bold">{camera.id}</h3>
                                        <p className="text-sm text-slate-500">{camera.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Single Feed View */}
                    {selectedCameraId && (
                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2 bg-black border border-slate-800 rounded-xl overflow-hidden relative shadow-lg">
                                {/* Video Area */}
                                <div className="aspect-video bg-black relative">
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-700">
                                        <Camera className="w-16 h-16 opacity-50" />
                                    </div>

                                    {/* Bounding Boxes */}
                                    {detectionRunning && detectedObjects.map(obj => (
                                        <div
                                            key={obj.id}
                                            onClick={() => handleSelectTarget(obj)}
                                            className="absolute border-2 border-cyan-400 cursor-pointer hover:border-amber-400 hover:bg-amber-400/10 transition-colors z-10"
                                            style={{
                                                left: `${obj.x}%`,
                                                top: `${obj.y}%`,
                                                width: '15%',
                                                height: '20%',
                                            }}
                                        >
                                            <div className="absolute -top-7 left-0 bg-cyan-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                                {obj.type} {obj.confidence}%
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar Stats */}
                            <div className="space-y-4">
                                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Detected Objects</h3>
                                    {!detectionRunning ? (
                                        <div className="text-center py-8">
                                            <LayoutGrid className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                            <p className="text-sm text-slate-400">Start detection to identify targets</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {detectedObjects.map(obj => (
                                                <div
                                                    key={obj.id}
                                                    onClick={() => handleSelectTarget(obj)}
                                                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-all"
                                                >
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-700">{obj.identifier}</p>
                                                        <p className="text-xs text-slate-500">{obj.type}</p>
                                                    </div>
                                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                                        {obj.confidence}%
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Screen 3: Active Tracking */}
            {workflowStep === 'tracking' && (
                <div className="space-y-6">
                    {/* Top Info Bar */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-start justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                                <Target className="w-8 h-8 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                                    {selectedTarget?.identifier}
                                    <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100 uppercase">
                                        {selectedTarget?.type}
                                    </span>
                                </h2>
                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Started: {trackingSession?.startTime}</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Initial: {targetInfo.initialCamera}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleStopTracking}
                                className="px-5 py-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg hover:bg-rose-100 font-semibold text-sm flex items-center gap-2 transition-all"
                            >
                                <Square className="w-4 h-4 fill-current" />
                                End Pursuit
                            </button>
                            <div className="flex gap-2">
                                <button onClick={handleAddToEvidence} className="px-3 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg hover:bg-white text-xs font-semibold">
                                    Evidence
                                </button>
                                <button onClick={handleEscalate} className="px-3 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg hover:bg-white text-xs font-semibold">
                                    Escalate
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Live Tracking Feed */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-black border border-slate-800 rounded-xl overflow-hidden shadow-lg relative aspect-video">
                                <div className="absolute top-4 left-4 z-10 bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-sm animate-pulse flex items-center gap-2">
                                    <span className="w-2 h-2 bg-white rounded-full"></span>
                                    LIVE TRACKING
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center text-slate-700">
                                    <Camera className="w-20 h-20 opacity-30" />
                                </div>

                                {/* Mock Target Box */}
                                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-40 h-24 border-4 border-rose-500 rounded-lg shadow-[0_0_20px_rgba(244,63,94,0.4)]">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        TARGET LOCKED
                                    </div>
                                </div>
                            </div>

                            {/* Predictions */}
                            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                    Predicted Path (AI)
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {predictedCameras.map((pred, idx) => (
                                        <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg p-3 hover:border-indigo-200 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold text-slate-700">{pred.camera}</span>
                                                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">{pred.likelihood}% Prob</span>
                                            </div>
                                            <div className="text-xs text-slate-500 space-y-1">
                                                <p>ETA: {pred.eta}</p>
                                                <p>{pred.zone}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tracking History */}
                        <div className="space-y-6">
                            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Movement Thread</h3>
                                <div className="relative border-l-2 border-slate-100 ml-3 space-y-6 pl-6 py-2">
                                    {cameraHops.map((hop, idx) => (
                                        <div key={idx} className="relative">
                                            {/* Dot */}
                                            <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 ${hop.status === 'current' ? 'bg-indigo-600 border-indigo-100 ring-4 ring-indigo-50' : 'bg-white border-slate-300'
                                                }`}></div>

                                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-sm font-bold text-slate-700">{hop.camera}</p>
                                                    <span className="text-xs font-mono text-slate-400">{hop.time}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mb-2">{hop.zone}</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
                                                        <div style={{ width: `${hop.confidence}%` }} className={`h-full rounded-full ${hop.confidence > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-600">{hop.confidence}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-bold text-amber-700">Zone Transition</h4>
                                    <p className="text-xs text-amber-600 mt-1">Target moved from North Zone to Central Zone. Jurisdiction handover protocol initiated automatically.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Screen 4: Completed */}
            {workflowStep === 'completed' && (
                <div className="max-w-3xl mx-auto space-y-8 mt-8">
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm mb-4">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800">Session Logged</h1>
                        <p className="text-slate-500">Tracking session has been successfully recorded and archived.</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="font-bold text-slate-700">Session Summary: {trackingSession?.operatorId}</h2>
                            <span className="text-xs font-mono text-slate-500">{new Date().toLocaleString()}</span>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Profile</h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-slate-800">{selectedTarget?.identifier}</p>
                                        <p className="text-sm text-slate-500">{selectedTarget?.type}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-xs text-slate-400 mb-1">Duration</p>
                                        <p className="font-bold text-slate-700">4m 36s</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-xs text-slate-400 mb-1">Avg Confidence</p>
                                        <p className="font-bold text-emerald-600">91%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Session Metrics</h3>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    <li className="flex justify-between border-b border-slate-50 pb-2">
                                        <span>Zone Coverage</span>
                                        <span className="font-semibold">North → Central</span>
                                    </li>
                                    <li className="flex justify-between border-b border-slate-50 pb-2">
                                        <span>Cameras Hopped</span>
                                        <span className="font-semibold">4 Units</span>
                                    </li>
                                    <li className="flex justify-between border-b border-slate-50 pb-2">
                                        <span>Distance Tracked</span>
                                        <span className="font-semibold">2.8 km</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Actions Logged</span>
                                        <span className="font-semibold">4 Events</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 flex justify-end gap-3 border-t border-slate-100">
                            <button
                                onClick={handleBackToStart}
                                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-semibold shadow-sm"
                            >
                                Return to Dashboard
                            </button>
                            <button
                                onClick={handleBackToStart}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-semibold shadow-sm flex items-center gap-2"
                            >
                                <Play className="w-4 h-4" />
                                Start New Session
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
