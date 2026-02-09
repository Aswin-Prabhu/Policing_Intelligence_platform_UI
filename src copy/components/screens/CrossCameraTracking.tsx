import { MapPin, Target, Camera, Clock, AlertTriangle, Zap, ChevronRight, Filter, Play, Square, CheckCircle, User } from 'lucide-react';

import { useState } from 'react';



export function CrossCameraTracking() {

  // Workflow states: 'selection' | 'camera-feed' | 'tracking' | 'completed'

  const [workflowStep, setWorkflowStep] = useState<'selection' | 'camera-feed' | 'tracking' | 'completed'>('selection');

  const [selectedZone, setSelectedZone] = useState('');

  const [selectedCameraId, setSelectedCameraId] = useState('');

  const [selectedTarget, setSelectedTarget] = useState<any>(null);

  const [detectionRunning, setDetectionRunning] = useState(false);

  const [trackingSession, setTrackingSession] = useState<any>(null);



  // Mock data

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



  // Mock detected objects in the feed

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



  // STEP 1: Camera Selection Screen

  if (workflowStep === 'selection') {

    return (

      <div className="p-6 space-y-6">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-white text-2xl mb-2">Multi-Camera Tracking</h1>

            <p className="text-gray-400 text-sm">Select zone and camera to start detection and tracking</p>

          </div>

        </div>



        {/* Filter Panel */}

        <div className="bg-[#0d1117] border border-[#1f2937] rounded-lg p-6">

          <div className="flex items-center gap-2 mb-4">

            <Filter className="w-5 h-5 text-cyan-400" />

            <h2 className="text-white">Camera Selection Filters</h2>

          </div>



          <div className="grid grid-cols-2 gap-4 mb-6">

            <div>

              <label className="text-sm text-gray-400 mb-2 block">Zone *</label>

              <select 

                value={selectedZone}

                onChange={(e) => setSelectedZone(e.target.value)}

                className="w-full bg-[#0a0e1a] border border-[#1f2937] text-white rounded px-3 py-2"

              >

                <option value="">Select Zone</option>

                {zones.map(zone => (

                  <option key={zone} value={zone}>{zone}</option>

                ))}

              </select>

            </div>



            <div>

              <label className="text-sm text-gray-400 mb-2 block">Camera ID (Optional)</label>

              <input

                type="text"

                value={selectedCameraId}

                onChange={(e) => setSelectedCameraId(e.target.value)}

                placeholder="e.g., CAM-NZ-042"

                className="w-full bg-[#0a0e1a] border border-[#1f2937] text-white rounded px-3 py-2"

              />

              <p className="text-xs text-gray-500 mt-1">Leave empty to see all cameras in the zone</p>

            </div>

          </div>



          <button

            onClick={handleApplyFilters}

            className="px-6 py-2 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 flex items-center gap-2"

          >

            Apply Filters

            <ChevronRight className="w-4 h-4" />

          </button>

        </div>



        {/* Info Panel */}

        <div className="bg-[#0d1117] border border-blue-500/30 rounded-lg p-4">

          <h3 className="text-white text-sm mb-2">Workflow Steps</h3>

          <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">

            <li>Select zone and optionally a specific camera ID</li>

            <li>View available cameras or direct live feed</li>

            <li>Start detection and extraction on selected camera</li>

            <li>Click on detected target to initiate multi-camera tracking</li>

            <li>Take actions during active tracking (add to evidence, escalate)</li>

            <li>Stop tracking to log session and return to start</li>

          </ol>

        </div>

      </div>

    );

  }



  // STEP 2: Camera Feed / List Screen

  if (workflowStep === 'camera-feed') {

    const cameras = selectedCameraId 

      ? camerasByZone[selectedZone]?.filter(cam => cam.id === selectedCameraId) || []

      : camerasByZone[selectedZone] || [];



    const isSingleCamera = selectedCameraId && cameras.length === 1;



    return (

      <div className="p-6 space-y-6">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>

            <button 

              onClick={handleBackToStart}

              className="text-gray-400 hover:text-white text-sm mb-2 flex items-center gap-1"

            >

              ← Back to Selection

            </button>

            <h1 className="text-white text-2xl mb-1">

              {isSingleCamera ? 'Camera Live Feed' : 'Available Cameras'}

            </h1>

            <p className="text-gray-400 text-sm">

              {selectedZone} {selectedCameraId && `• ${selectedCameraId}`}

            </p>

          </div>

          {isSingleCamera && !detectionRunning && (

            <button

              onClick={handleStartDetection}

              className="px-6 py-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 flex items-center gap-2"

            >

              <Play className="w-4 h-4" />

              Start Detection

            </button>

          )}

          {isSingleCamera && detectionRunning && (

            <div className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded flex items-center gap-2">

              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />

              Detection Running

            </div>

          )}

        </div>



        {/* Camera List (if no camera ID specified) */}

        {!isSingleCamera && (

          <div className="grid grid-cols-3 gap-4">

            {cameras.map(camera => (

              <div key={camera.id} className="bg-[#0d1117] border border-[#1f2937] rounded-lg overflow-hidden hover:border-cyan-500/50 transition-colors cursor-pointer">

                <div className="relative bg-black aspect-video">

                  <div className="absolute inset-0 flex items-center justify-center text-gray-600">

                    <Camera className="w-12 h-12 opacity-50" />

                  </div>

                  <div className="absolute top-2 right-2">

                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">

                      {camera.status}

                    </span>

                  </div>

                </div>

                <div className="p-4">

                  <h3 className="text-white mb-1">{camera.id}</h3>

                  <p className="text-sm text-gray-400 mb-3">{camera.name}</p>

                  <button

                    onClick={() => {

                      setSelectedCameraId(camera.id);

                    }}

                    className="w-full px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 text-sm flex items-center justify-center gap-2"

                  >

                    <Play className="w-3 h-3" />

                    Select Camera

                  </button>

                </div>

              </div>

            ))}

          </div>

        )}



        {/* Single Camera Feed with Detection */}

        {isSingleCamera && (

          <div className="bg-[#0d1117] border border-[#1f2937] rounded-lg overflow-hidden">

            <div className="p-4 border-b border-[#1f2937] flex items-center justify-between">

              <div className="flex items-center gap-2">

                <Camera className="w-5 h-5 text-cyan-400" />

                <h3 className="text-white">{cameras[0].id} - {cameras[0].name}</h3>

                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">LIVE</span>

              </div>

              <div className="text-sm text-gray-400">{selectedZone}</div>

            </div>

            

            <div className="relative bg-black aspect-video">

              <div className="absolute inset-0 flex items-center justify-center text-gray-600">

                <div className="text-center">

                  <Camera className="w-16 h-16 mx-auto mb-2 opacity-50" />

                  <p>Live Feed: {cameras[0].id}</p>

                </div>

              </div>



              {/* Detected Objects (only shown when detection is running) */}

              {detectionRunning && detectedObjects.map(obj => (

                <div 

                  key={obj.id}

                  onClick={() => handleSelectTarget(obj)}

                  className="absolute border-2 border-cyan-400 rounded cursor-pointer hover:border-orange-400 transition-colors"

                  style={{

                    left: `${obj.x}%`,

                    top: `${obj.y}%`,

                    width: '15%',

                    height: '20%',

                  }}

                >

                  <div className="absolute -top-7 left-0 bg-cyan-500 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">

                    {obj.identifier} • {obj.confidence}%

                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">

                    <Target className="w-4 h-4 text-cyan-400 animate-pulse" />

                  </div>

                </div>

              ))}



              {detectionRunning && (

                <div className="absolute bottom-4 left-4 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 px-3 py-2 rounded text-xs">

                  <div className="flex items-center gap-2">

                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />

                    <span>AI Detection Active • {detectedObjects.length} targets detected</span>

                  </div>

                </div>

              )}



              {!detectionRunning && (

                <div className="absolute bottom-4 left-4 bg-gray-500/20 border border-gray-500/50 text-gray-400 px-3 py-2 rounded text-xs">

                  Click "Start Detection" to begin target detection

                </div>

              )}

            </div>



            {detectionRunning && (

              <div className="p-4 bg-[#0a0e1a] border-t border-[#1f2937]">

                <p className="text-sm text-gray-400 mb-2">Detected Targets (Click to start tracking)</p>

                <div className="grid grid-cols-3 gap-2">

                  {detectedObjects.map(obj => (

                    <button

                      key={obj.id}

                      onClick={() => handleSelectTarget(obj)}

                      className="px-3 py-2 bg-[#0d1117] border border-[#1f2937] rounded hover:border-cyan-500/50 text-left transition-colors"

                    >

                      <p className="text-white text-sm">{obj.identifier}</p>

                      <p className="text-xs text-gray-500">{obj.type} • {obj.confidence}% confidence</p>

                    </button>

                  ))}

                </div>

              </div>

            )}

          </div>

        )}

      </div>

    );

  }



  // STEP 3: Active Tracking Screen (existing implementation)

  if (workflowStep === 'tracking') {

    return (

      <div className="p-6 space-y-6">

        {/* Header with Target Info */}

        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/50 rounded-lg p-4">

          <div className="flex items-start justify-between">

            <div className="flex items-center gap-4">

              <div className="p-3 bg-orange-500/20 rounded-lg">

                <Target className="w-6 h-6 text-orange-400 animate-pulse" />

              </div>

              <div>

                <div className="flex items-center gap-3 mb-2">

                  <h2 className="text-white text-xl">Active Target Tracking</h2>

                  <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs">LIVE</span>

                </div>

                <div className="grid grid-cols-6 gap-4 text-sm">

                  <div>

                    <p className="text-gray-500 text-xs">Target Type</p>

                    <p className="text-white">{selectedTarget?.type}</p>

                  </div>

                  <div>

                    <p className="text-gray-500 text-xs">Identifier</p>

                    <p className="text-cyan-400">{selectedTarget?.identifier}</p>

                  </div>

                  <div>

                    <p className="text-gray-500 text-xs">Initial Camera</p>

                    <p className="text-white">{targetInfo.initialCamera}</p>

                  </div>

                  <div>

                    <p className="text-gray-500 text-xs">Started At</p>

                    <p className="text-white">{trackingSession?.startTime}</p>

                  </div>

                  <div>

                    <p className="text-gray-500 text-xs">Confidence</p>

                    <p className="text-green-400">{selectedTarget?.confidence}%</p>

                  </div>

                  <div>

                    <p className="text-gray-500 text-xs">Status</p>

                    <p className="text-orange-400">{targetInfo.status}</p>

                  </div>

                </div>

              </div>

            </div>

            <div className="flex items-center gap-2">

              <button 

                onClick={handleStopTracking}

                className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 text-sm flex items-center gap-2"

              >

                <Square className="w-3 h-3" />

                Stop Tracking

              </button>

              <button 

                onClick={handleAddToEvidence}

                className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 text-sm"

              >

                Add to Evidence

              </button>

              <button 

                onClick={handleEscalate}

                className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded hover:bg-orange-500/30 text-sm"

              >

                Escalate to SI

              </button>

            </div>

          </div>

        </div>



        {/* Main Content Grid */}

        <div className="grid grid-cols-3 gap-6">

          {/* Left: Live Video Wall */}

          <div className="col-span-2 space-y-6">

            {/* Current Camera View */}

            <div className="bg-[#0d1117] border border-[#1f2937] rounded-lg overflow-hidden">

              <div className="p-4 border-b border-[#1f2937] flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <Camera className="w-5 h-5 text-cyan-400" />

                  <h3 className="text-white">Current View: CAM-CZ-019</h3>

                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">LIVE</span>

                </div>

                <div className="text-sm text-gray-400">Central Zone • Junction Point</div>

              </div>

              <div className="relative bg-black aspect-video">

                <div className="absolute inset-0 flex items-center justify-center text-gray-600">

                  <div className="text-center">

                    <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />

                    <p>Live Feed: CAM-CZ-019</p>

                  </div>

                </div>

                {/* Target Highlight Box */}

                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-32 h-20 border-4 border-orange-500 rounded">

                  <div className="absolute -top-6 left-0 bg-orange-500 text-white text-xs px-2 py-0.5 rounded">

                    {selectedTarget?.identifier} • {selectedTarget?.confidence}%

                  </div>

                </div>

                <div className="absolute bottom-4 left-4 text-xs text-white bg-black/80 px-3 py-1.5 rounded">

                  <Clock className="w-3 h-3 inline mr-1" />

                  {trackingSession?.startTime} • Tracking Duration: 4m 36s

                </div>

              </div>

            </div>



            {/* Predicted Next Cameras */}

            <div className="bg-[#0d1117] border border-[#1f2937] rounded-lg overflow-hidden">

              <div className="p-4 border-b border-[#1f2937] flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <Zap className="w-5 h-5 text-yellow-400" />

                  <h3 className="text-white">Likely Next Cameras</h3>

                </div>

              </div>

              <div className="grid grid-cols-3 gap-4 p-4">

                {predictedCameras.map((pred, idx) => (

                  <div key={idx} className="bg-[#0a0e1a] border border-[#1f2937] rounded-lg overflow-hidden">

                    <div className="relative bg-black aspect-video">

                      <div className="absolute inset-0 flex items-center justify-center text-gray-700">

                        <Camera className="w-8 h-8" />

                      </div>

                      <div className="absolute top-2 left-2 bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded">

                        {pred.likelihood}% likely

                      </div>

                    </div>

                    <div className="p-3 space-y-1">

                      <p className="text-white text-sm">{pred.camera}</p>

                      <p className="text-xs text-gray-500">{pred.zone}</p>

                      <div className="flex items-center justify-between text-xs text-gray-400 pt-1">

                        <span>ETA: {pred.eta}</span>

                        <span>{pred.distance}</span>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>



          {/* Right: Movement History & Timeline */}

          <div className="space-y-6">

            {/* Movement Chain Timeline */}

            <div className="bg-[#0d1117] border border-[#1f2937] rounded-lg overflow-hidden">

              <div className="p-4 border-b border-[#1f2937]">

                <h3 className="text-white flex items-center gap-2">

                  <MapPin className="w-5 h-5 text-cyan-400" />

                  Movement Chain

                </h3>

              </div>

              <div className="p-4 space-y-3">

                {cameraHops.map((hop, idx) => (

                  <div key={hop.id} className="relative">

                    {idx < cameraHops.length - 1 && (

                      <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-cyan-500/30" />

                    )}

                    <div className="flex items-start gap-3">

                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${

                        hop.status === 'current' 

                          ? 'bg-orange-500/20 border-2 border-orange-500 animate-pulse'

                          : 'bg-cyan-500/20 border-2 border-cyan-500'

                      }`}>

                        {hop.status === 'current' ? (

                          <Target className="w-4 h-4 text-orange-400" />

                        ) : (

                          <Camera className="w-4 h-4 text-cyan-400" />

                        )}

                      </div>

                      <div className="flex-1 bg-[#0a0e1a] border border-[#1f2937] rounded-lg p-3">

                        <div className="flex items-center justify-between mb-1">

                          <p className="text-white text-sm">{hop.camera}</p>

                          {hop.status === 'current' && (

                            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded">

                              CURRENT

                            </span>

                          )}

                        </div>

                        <p className="text-xs text-gray-500 mb-2">{hop.zone}</p>

                        <div className="flex items-center justify-between text-xs">

                          <span className="text-gray-400">{hop.time}</span>

                          <span className="text-green-400">{hop.confidence}%</span>

                        </div>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>



            {/* Zone Transition Alert */}

            <div className="bg-[#0d1117] border border-yellow-500/50 rounded-lg p-4">

              <div className="flex items-start gap-3">

                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />

                <div>

                  <h4 className="text-white text-sm mb-1">Zone Transition Detected</h4>

                  <p className="text-xs text-gray-400 mb-2">

                    Target moved from North Zone to Central Zone at 14:26:18

                  </p>

                  <p className="text-xs text-yellow-400">

                    Auto-notification sent to CI (Central Zone)

                  </p>

                </div>

              </div>

            </div>



            {/* Tracking Statistics */}

            <div className="bg-[#0d1117] border border-[#1f2937] rounded-lg p-4">

              <h4 className="text-white text-sm mb-3">Tracking Statistics</h4>

              <div className="space-y-2 text-xs">

                <div className="flex items-center justify-between">

                  <span className="text-gray-400">Cameras Tracked</span>

                  <span className="text-white">4</span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-gray-400">Average Confidence</span>

                  <span className="text-green-400">91%</span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-gray-400">Distance Covered</span>

                  <span className="text-white">2.8 km</span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-gray-400">Tracking Duration</span>

                  <span className="text-white">4m 36s</span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-gray-400">Track Continuity</span>

                  <span className="text-green-400">Stable</span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    );

  }



  // STEP 4: Tracking Completed / Log Screen

  if (workflowStep === 'completed') {

    return (

      <div className="p-6 space-y-6">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="p-3 bg-green-500/20 rounded-lg">

              <CheckCircle className="w-6 h-6 text-green-400" />

            </div>

            <div>

              <h1 className="text-white text-2xl">Tracking Session Completed</h1>

              <p className="text-gray-400 text-sm">Session logged successfully</p>

            </div>

          </div>

          <button

            onClick={handleBackToStart}

            className="px-6 py-2 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 flex items-center gap-2"

          >

            <ChevronRight className="w-4 h-4" />

            Start New Tracking

          </button>

        </div>



        {/* Session Summary */}

        <div className="grid grid-cols-2 gap-6">

          {/* Session Details */}

          <div className="bg-[#0d1117] border border-[#1f2937] rounded-lg p-6">

            <h2 className="text-white mb-4 flex items-center gap-2">

              <Target className="w-5 h-5 text-cyan-400" />

              Session Details

            </h2>

            <div className="space-y-3 text-sm">

              <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">

                <span className="text-gray-400">Target Type</span>

                <span className="text-white">{selectedTarget?.type}</span>

              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">

                <span className="text-gray-400">Target Identifier</span>

                <span className="text-cyan-400">{selectedTarget?.identifier}</span>

              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">

                <span className="text-gray-400">Initial Camera</span>

                <span className="text-white">{trackingSession?.camera || targetInfo.initialCamera}</span>

              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">

                <span className="text-gray-400">Zone</span>

                <span className="text-white">{trackingSession?.zone}</span>

              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">

                <span className="text-gray-400">Start Time</span>

                <span className="text-white">{trackingSession?.startTime}</span>

              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">

                <span className="text-gray-400">End Time</span>

                <span className="text-white">{new Date().toLocaleTimeString()}</span>

              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">

                <span className="text-gray-400">Duration</span>

                <span className="text-white">4m 36s</span>

              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">

                <span className="text-gray-400">Cameras Tracked</span>

                <span className="text-white">4</span>

              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">

                <span className="text-gray-400">Distance Covered</span>

                <span className="text-white">2.8 km</span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-gray-400">Average Confidence</span>

                <span className="text-green-400">91%</span>

              </div>

            </div>

          </div>



          {/* Operator Details */}

          <div className="bg-[#0d1117] border border-[#1f2937] rounded-lg p-6">

            <h2 className="text-white mb-4 flex items-center gap-2">

              <User className="w-5 h-5 text-cyan-400" />

              Operator Details

            </h2>

            <div className="space-y-3 text-sm">

              <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">

                <span className="text-gray-400">Operator Name</span>

                <span className="text-white">{trackingSession?.operator}</span>

              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">

                <span className="text-gray-400">Operator ID</span>

                <span className="text-cyan-400">{trackingSession?.operatorId}</span>

              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">

                <span className="text-gray-400">Role</span>

                <span className="text-white">Control Room Operator</span>

              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">

                <span className="text-gray-400">Session ID</span>

                <span className="text-white">TRK-{Date.now().toString().slice(-8)}</span>

              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">

                <span className="text-gray-400">Logged At</span>

                <span className="text-white">{new Date().toLocaleString()}</span>

              </div>

            </div>



            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">

              <p className="text-green-400 text-sm mb-2">Actions Taken During Session:</p>

              <ul className="text-xs text-gray-400 space-y-1">

                <li>• Target identified and locked at 14:23:15</li>

                <li>• Cross-zone transition detected at 14:26:18</li>

                <li>• Notification sent to Central Zone CI</li>

                <li>• Tracking stopped by operator at {new Date().toLocaleTimeString()}</li>

              </ul>

            </div>

          </div>

        </div>



        {/* Movement Timeline */}

        <div className="bg-[#0d1117] border border-[#1f2937] rounded-lg p-6">

          <h2 className="text-white mb-4 flex items-center gap-2">

            <MapPin className="w-5 h-5 text-cyan-400" />

            Movement Timeline

          </h2>

          <div className="space-y-3">

            {cameraHops.map((hop, idx) => (

              <div key={hop.id} className="flex items-center gap-4 p-3 bg-[#0a0e1a] rounded-lg">

                <div className="text-gray-500 text-sm w-20">{hop.time}</div>

                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border-2 border-cyan-500 flex items-center justify-center flex-shrink-0">

                  <Camera className="w-4 h-4 text-cyan-400" />

                </div>

                <div className="flex-1">

                  <p className="text-white text-sm">{hop.camera}</p>

                  <p className="text-xs text-gray-500">{hop.zone}</p>

                </div>

                <div className="text-green-400 text-sm">{hop.confidence}%</div>

              </div>

            ))}

          </div>

        </div>



        {/* Export Options */}

        <div className="flex items-center justify-end gap-3">

          <button className="px-4 py-2 bg-[#0d1117] border border-[#1f2937] text-white rounded hover:bg-[#161b22] text-sm">

            Export as PDF

          </button>

          <button className="px-4 py-2 bg-[#0d1117] border border-[#1f2937] text-white rounded hover:bg-[#161b22] text-sm">

            View in Evidence Console

          </button>

        </div>

      </div>

    );

  }



  return null;

}
