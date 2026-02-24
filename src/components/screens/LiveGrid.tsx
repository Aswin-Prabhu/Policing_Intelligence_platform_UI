



import React from 'react';
import { Cpu, Filter, Play, CameraOff, AlertCircle } from 'lucide-react';



interface LiveGridProps {
  onViewCamera: (camera: Camera) => void;
}

export type CameraStatus = 'Live' | 'offline';

export interface Camera {
  id: string;
  name: string;
  zone: string;
  status: CameraStatus;
  aiEnabled: boolean;
  videoUrl: string;
}



export function LiveGrid({ onViewCamera }: LiveGridProps) {
  // Static camera configuration - fixed zones, statuses, and AI flags for consistency
  const staticConfig = [
    { zone: 'North Zone', status: 'Live' as CameraStatus, aiEnabled: true },
    { zone: 'South Zone', status: 'Live' as CameraStatus, aiEnabled: true },
    { zone: 'North Zone', status: 'Live' as CameraStatus, aiEnabled: false },
    { zone: 'West Zone', status: 'Live' as CameraStatus, aiEnabled: false },
    { zone: 'North Zone', status: 'Live' as CameraStatus, aiEnabled: true },
    { zone: 'Central Zone', status: 'Live' as CameraStatus, aiEnabled: true },
    { zone: 'West Zone', status: 'Live' as CameraStatus, aiEnabled: false },
    { zone: 'Central Zone', status: 'Live' as CameraStatus, aiEnabled: true },
    { zone: 'South Zone', status: 'Live' as CameraStatus, aiEnabled: true },
    { zone: 'South Zone', status: 'Live' as CameraStatus, aiEnabled: false },
    { zone: 'South Zone', status: 'Live' as CameraStatus, aiEnabled: true },
    { zone: 'South Zone', status: 'offline' as CameraStatus, aiEnabled: false },
    { zone: 'East Zone', status: 'offline' as CameraStatus, aiEnabled: false },
    { zone: 'East Zone', status: 'Live' as CameraStatus, aiEnabled: true },
    { zone: 'East Zone', status: 'Live' as CameraStatus, aiEnabled: false },
    { zone: 'East Zone', status: 'Live' as CameraStatus, aiEnabled: true },
  ];

  // 16 cameras with static configuration
  const cameras = React.useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: `CAM-${String.fromCharCode(65 + Math.floor(i / 4))}Z-${String(
          i + 1
        ).padStart(3, '0')}`,
        name: `Camera ${i + 1}`,
        zone: staticConfig[i].zone,
        status: staticConfig[i].status,
        aiEnabled: staticConfig[i].aiEnabled,
        videoUrl: '',
      })),
    []
  );

  const [selectedZone, setSelectedZone] = React.useState<string>('All Zones');
  const [aiOverlayEnabled, setAiOverlayEnabled] = React.useState(true);

  React.useEffect(() => {
    const startPipelines = async () => {
      const liveCams = [
        { id: "cam_live_01", path: "rtsp://79.137.11.169:8554/live/anpr" },
        { id: "cam_live_02", path: "rtsp://79.137.11.169:8554/live/anpr1" },
        { id: "cam_live_03", path: "rtsp://79.137.11.169:8554/live/anpr2" },
        { id: "cam_live_04", path: "rtsp://79.137.11.169:8554/live/anpr3" },
        { id: "cam_live_05", path: "rtsp://79.137.11.169:8554/live/anpr4" },
      ];

      for (const cam of liveCams) {
        try {
          fetch("http://79.137.11.169:8000/pipeline/start", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              camera_id: cam.id,
              video_path: cam.path,
              location: "Live",
              zone: "Zone-1",
              batch_id: "batch_live_001"
            })
          }).catch(err => console.error(`Failed to start pipeline for ${cam.id}`, err));
        } catch (error) {
          console.error(`Failed to start pipeline for ${cam.id}`, error);
        }
      }
    };

    startPipelines();
  }, []);
  const zones = React.useMemo(() => {
    const unique = Array.from(new Set(cameras.map((c) => c.zone))).sort();
    return ['All Zones', ...unique];
  }, [cameras]);

  const filteredCameras = React.useMemo(() => {
    if (selectedZone === 'All Zones') return cameras;
    return cameras.filter((c) => c.zone === selectedZone);
  }, [cameras, selectedZone]);

  const getStatusBg = (status: CameraStatus) => {
    switch (status) {
      case 'Live':
        return 'bg-green-500/20 text-green-400';
      case 'offline':
        return 'bg-gray-600/20 text-gray-400';
      default:
        return 'bg-green-500/20 text-green-400';
    }
  };

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-lg">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="bg-white text-sm text-black outline-none rounded px-2 py-1"
          >
            {zones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setAiOverlayEnabled((v) => !v)}
          className="ml-auto px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20 flex items-center gap-2"
        >
          <Cpu className="w-4 h-4" />
          AI Overlay: {aiOverlayEnabled ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* 4x4 Camera Grid */}
      <div className="grid grid-cols-4 gap-4">
        {filteredCameras.map((camera) => {
          const originalIdx = cameras.findIndex(c => c.id === camera.id);
          const isLiveCam = true; // Changed to treat all components as live
          const liveIdx = Math.max(0, originalIdx) % 5;

          const rtsps = [
            "https://cdn.gov-cloud.ai/_ENC(nIw4FQRwLOQd0b8T2HcImBUJ5a9zjZEImv/UhJi8/+yUl7Ez+m0qAiCCaOJbNgi5)/CMS/7283e455-9b50-404c-a91b-7780e63b659f_$$_V1_hiv00453_standardized.mp4",
            "https://cdn.gov-cloud.ai/_ENC(nIw4FQRwLOQd0b8T2HcImBUJ5a9zjZEImv/UhJi8/+yUl7Ez+m0qAiCCaOJbNgi5)/CMS/d81cbb4f-8def-4322-9653-bb5fb6d50c99_$$_V1_hiv00463.mp4",
            "https://cdn.gov-cloud.ai/_ENC(nIw4FQRwLOQd0b8T2HcImBUJ5a9zjZEImv/UhJi8/+yUl7Ez+m0qAiCCaOJbNgi5)/CMS/c68fef80-275c-4fbc-910b-0ce6d031fe45_$$_V1_hiv00456_standardized.mp4",
            "https://cdn.gov-cloud.ai/_ENC(nIw4FQRwLOQd0b8T2HcImBUJ5a9zjZEImv/UhJi8/+yUl7Ez+m0qAiCCaOJbNgi5)/CMS/66b63694-13a1-4155-a215-66efa12b53fd_$$_V1_hiv00465_standardized.mp4",
            "https://cdn.gov-cloud.ai/_ENC(nIw4FQRwLOQd0b8T2HcImBUJ5a9zjZEImv/UhJi8/+yUl7Ez+m0qAiCCaOJbNgi5)/CMS/40f8a7b6-df74-410b-a990-d7cd227da588_$$_V1_hiv00439_standardized.mp4"
          ];
          const camLiveId = `cam_live_0${liveIdx + 1}`;
          const aiStream = `http://79.137.11.169:8000/stream/${camLiveId}`;

          const videoSrc = aiOverlayEnabled ? aiStream : rtsps[liveIdx];

          return (
            <div
              key={camera.id}
              onClick={() => {
                // Prevent opening detail view for offline cameras
                if (camera.status !== 'offline') {
                  onViewCamera(camera);
                }
              }}
              className={`bg-[#0d1117] border border-[#1f2937] rounded-lg overflow-hidden ${camera.status === 'offline' ? 'cursor-not-allowed' : 'cursor-pointer hover:border-[#2a3441]'} transition-all group`}
            >
              {/* Video or Offline Placeholder */}
              <div className="relative aspect-video bg-black">
                {camera.status === 'offline' ? (
                  // Offline placeholder - compact and clear
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#050816] relative">
                    {/* Subtle diagonal lines pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.05) 8px, rgba(255,255,255,0.05) 16px)'
                      }}></div>
                    </div>

                    {/* Compact offline icon and message */}
                    <div className="relative z-10 flex flex-col items-center gap-2 px-4">
                      <div className="relative">
                        <CameraOff className="w-10 h-10 text-gray-600" />
                        <AlertCircle className="w-4 h-4 text-red-400 absolute -top-0.5 -right-0.5" fill="currentColor" />
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400 text-xs font-medium">Offline</p>
                        <p className="text-gray-600 text-[10px] mt-0.5">No video feed</p>
                      </div>
                    </div>

                    {/* Status Badge (always visible for offline) */}
                    <div
                      className={`absolute top-2 left-2 px-2 py-1 rounded text-[10px] ${getStatusBg(
                        camera.status
                      )}`}
                    >
                      {camera.status.toUpperCase()}
                    </div>
                  </div>
                ) : (
                  // Live - show video
                  <>
                    {isLiveCam && aiOverlayEnabled ? (
                      <img
                        src={videoSrc}
                        className="w-full h-full object-cover"
                        alt={`Live stream ${camera.id}`}
                      />
                    ) : isLiveCam ? (
                      <video
                        src={videoSrc}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <video
                        src={videoSrc}
                        autoPlay
                        muted
                        loop
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* AI Badge */}
                    {aiOverlayEnabled && camera.aiEnabled && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-purple-500/80 text-white rounded text-[10px] flex items-center gap-1">
                        <Cpu className="w-3 h-3" />
                        AI
                      </div>
                    )}

                    {/* Status Badge */}
                    <div
                      className={`absolute top-2 left-2 px-2 py-1 rounded text-[10px] ${getStatusBg(
                        camera.status
                      )}`}
                    >
                      {camera.status.toUpperCase()}
                    </div>

                    {/* View Live Hover Button */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-full py-1.5 bg-cyan-500 text-white rounded text-xs hover:bg-cyan-600 flex items-center justify-center gap-1">
                        <Play className="w-3 h-3" />
                        View Live
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Camera Info */}

              {/* Camera Info */}
              <div className="p-3 border-t border-[#1f2937]">
                <p className="text-sm text-white mb-1">{camera.id}</p>
                <p className="text-xs text-gray-500">{camera.zone}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}








// import React from 'react';
// import { Cpu, Filter, Play } from 'lucide-react';

// // Load all videos dynamically
// const videoModules = import.meta.glob('/src/assets/videos/*.mp4', { eager: true });
// const videoList = Object.values(videoModules).map((v: any) => v.default);

// interface LiveGridProps {
//   onViewCamera: () => void;
// }

// type CameraStatus = 'Live' | 'degraded' | 'offline';

// export function LiveGrid({ onViewCamera }: LiveGridProps) {
//   // Assign videos in order (loop if fewer videos than cameras)
//   const cameras = React.useMemo(
//     () =>
//       Array.from({ length: 16 }, (_, i) => ({
//         id: `CAM-${String.fromCharCode(65 + Math.floor(i / 4))}Z-${String(
//           i + 1
//         ).padStart(3, '0')}`,
//         name: `Camera ${i + 1}`,
//         zone: [
//           'North Zone',
//           'South Zone',
//           'East Zone',
//           'West Zone',
//           'Central Zone',
//         ][Math.floor(Math.random() * 5)],
//         status: (['Live', 'Live', 'Live', 'degraded', 'offline'][
//           Math.floor(Math.random() * 5)
//         ] ?? 'Live') as CameraStatus,
//         aiEnabled: Math.random() > 0.3,
//         videoUrl: videoList[i % videoList.length], // Assign videos properly
//       })),
//     []
//   );

//   const getStatusColor = (status: CameraStatus) => {
//     switch (status) {
//       case 'Live':
//         return 'border-green-500';
//       case 'degraded':
//         return 'border-yellow-500';
//       case 'offline':
//         return 'border-gray-600';
//       default:
//         return 'border-red-500';
//     }
//   };

//   const getStatusBg = (status: CameraStatus) => {
//     switch (status) {
//       case 'Live':
//         return 'bg-red-500 text-white-400';
//       case 'degraded':
//         return 'bg-yellow-500/20 text-yellow-400';
//       case 'offline':
//         return 'bg-gray-600/20 text-gray-400';
//       default:
//         return 'bg-red-500/20 text-red-400';
//     }
//   };

//   return (
//     <div className="p-6">
//       {/* Filters */}
//       <div className="flex items-center gap-4 mb-6">
//         <div className="flex items-center gap-3 px-4 py-2 bg-[#0d1117] border border-[#1f2937] rounded-lg">
//           <Filter className="w-4 h-4 text-gray-500" />
//           <select className="bg-black text-sm text-white outline-none">
//             <option>All Zones</option>
//             <option>North Zone</option>
//             <option>South Zone</option>
//             <option>East Zone</option>
//             <option>West Zone</option>
//             <option>Central Zone</option>
//           </select>
//         </div>

//         <button className="ml-auto px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20 flex items-center gap-2">
//           <Cpu className="w-4 h-4" />
//           AI Overlay: ON
//         </button>
//       </div>

//       {/* 4x4 Camera Grid */}
//       <div className="grid grid-cols-4 gap-4">
//         {cameras.map((camera) => (
//           <div
//             key={camera.id}
//             onClick={onViewCamera}
//             className={`bg-[#0d1117] border-2 ${getStatusColor(
//               camera.status
//             )} rounded-lg overflow-hidden cursor-pointer hover:border-cyan-500 transition-all group`}
//           >
//             {/* Video */}
//             <div className="relative aspect-video bg-black">
//               <video
//                 src={camera.videoUrl}
//                 autoPlay
//                 muted
//                 loop
//                 className="w-full h-full object-cover"
//               />

//               {/* AI Badge */}
//               {camera.aiEnabled && (
//                 <div className="absolute top-2 right-2 px-2 py-1 bg-purple-500/80 text-white rounded text-[10px] flex items-center gap-1">
//                   <Cpu className="w-3 h-3" />
//                   AI
//                 </div>
//               )}

//               {/* Status Badge */}
//               <div
//                 className={`absolute top-2 left-2 px-2 py-1 rounded text-[10px] ${getStatusBg(
//                   camera.status
//                 )}`}
//               >
//                 {camera.status.toUpperCase()}
//               </div>

//               {/* View Live Hover Button */}
//               <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <button className="w-full py-1.5 bg-cyan-500 text-white rounded text-xs hover:bg-cyan-600 flex items-center justify-center gap-1">
//                   <Play className="w-3 h-3" />
//                   View Live
//                 </button>
//               </div>
//             </div>

//             {/* Camera Info */}
//             <div className="p-3 border-t border-[#1f2937]">
//               <p className="text-sm text-white mb-1">{camera.id}</p>
//               <p className="text-xs text-gray-500">{camera.zone}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }








// import React from 'react';
// import { Cpu, Filter, Play } from 'lucide-react';

// // Load all videos dynamically
// const videoModules = import.meta.glob('/src/assets/videos/*.mp4', { eager: true });
// const videoList = Object.values(videoModules).map((v: any) => v.default);

// interface LiveGridProps {
//   onViewCamera: () => void;
// }

// type CameraStatus = 'Live' | 'degraded' | 'offline';

// export function LiveGrid({ onViewCamera }: LiveGridProps) {
//   // Assign videos in order (loop if fewer videos than cameras)
//   const cameras = React.useMemo(
//     () =>
//       Array.from({ length: 16 }, (_, i) => ({
//         id: `CAM-${String.fromCharCode(65 + Math.floor(i / 4))}Z-${String(
//           i + 1
//         ).padStart(3, '0')}`,
//         name: `Camera ${i + 1}`,
//         zone: [
//           'North Zone',
//           'South Zone',
//           'East Zone',
//           'West Zone',
//           'Central Zone',
//         ][Math.floor(Math.random() * 5)],
//         status: (['Live', 'Live', 'Live', 'degraded', 'offline'][
//           Math.floor(Math.random() * 5)
//         ] ?? 'Live') as CameraStatus,
//         aiEnabled: Math.random() > 0.3,
//         videoUrl: videoList[i % videoList.length], // Assign videos properly
//       })),
//     []
//   );

//   const getStatusColor = (status: CameraStatus) => {
//     switch (status) {
//       case 'Live':
//         return 'border-green-500';
//       case 'degraded':
//         return 'border-yellow-500';
//       case 'offline':
//         return 'border-gray-600';
//       default:
//         return 'border-red-500';
//     }
//   };

//   const getStatusBg = (status: CameraStatus) => {
//     switch (status) {
//       case 'Live':
//         return 'bg-red-500 text-white-400';
//       case 'degraded':
//         return 'bg-yellow-500/20 text-yellow-400';
//       case 'offline':
//         return 'bg-gray-600/20 text-gray-400';
//       default:
//         return 'bg-red-500/20 text-red-400';
//     }
//   };

//   return (
//     <div className="p-6">
//       {/* Filters */}
//       <div className="flex items-center gap-4 mb-6">
//         <div className="flex items-center gap-3 px-4 py-2 bg-[#0d1117] border border-[#1f2937] rounded-lg">
//           <Filter className="w-4 h-4 text-gray-500" />
//           <select className="bg-black text-sm text-white outline-none">
//             <option>All Zones</option>
//             <option>North Zone</option>
//             <option>South Zone</option>
//             <option>East Zone</option>
//             <option>West Zone</option>
//             <option>Central Zone</option>
//           </select>
//         </div>

//         <button className="ml-auto px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20 flex items-center gap-2">
//           <Cpu className="w-4 h-4" />
//           AI Overlay: ON
//         </button>
//       </div>

//       {/* 4x4 Camera Grid */}
//       <div className="grid grid-cols-4 gap-4">
//         {cameras.map((camera) => (
//           <div
//             key={camera.id}
//             onClick={onViewCamera}
//             className={`bg-[#0d1117] border-2 ${getStatusColor(
//               camera.status
//             )} rounded-lg overflow-hidden cursor-pointer hover:border-cyan-500 transition-all group`}
//           >
//             {/* Video */}
//             <div className="relative aspect-video bg-black">
//               <video
//                 src={camera.videoUrl}
//                 autoPlay
//                 muted
//                 loop
//                 className="w-full h-full object-cover"
//               />

//               {/* AI Badge */}
//               {camera.aiEnabled && (
//                 <div className="absolute top-2 right-2 px-2 py-1 bg-purple-500/80 text-white rounded text-[10px] flex items-center gap-1">
//                   <Cpu className="w-3 h-3" />
//                   AI
//                 </div>
//               )}

//               {/* Status Badge */}
//               <div
//                 className={`absolute top-2 left-2 px-2 py-1 rounded text-[10px] ${getStatusBg(
//                   camera.status
//                 )}`}
//               >
//                 {camera.status.toUpperCase()}
//               </div>

//               {/* View Live Hover Button */}
//               <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <button className="w-full py-1.5 bg-cyan-500 text-white rounded text-xs hover:bg-cyan-600 flex items-center justify-center gap-1">
//                   <Play className="w-3 h-3" />
//                   View Live
//                 </button>
//               </div>
//             </div>

//             {/* Camera Info */}
//             <div className="p-3 border-t border-[#1f2937]">
//               <p className="text-sm text-white mb-1">{camera.id}</p>
//               <p className="text-xs text-gray-500">{camera.zone}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
