import { Film, Search, Filter, Calendar, Camera, Play, Pause } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

// Import the same videos used in MultiGrid
import cam1 from '../../assets/videos/cam1.mp4';
import cam3 from '../../assets/videos/cam3.mp4';
import cam4 from '../../assets/videos/cam4.mp4';
import cam6 from '../../assets/videos/cam6.mp4';
import cam7 from '../../assets/videos/cam7.mp4';
import cam8 from '../../assets/videos/cam8.mp4';
import cam12 from '../../assets/videos/cam12.mp4';
import cam13 from '../../assets/videos/cam13.mp4';
import camera1 from '../../assets/videos/camera1.mp4';

interface FootageLibraryProps {
  onNavigate: (screen: string) => void;
}

interface FootageItem {
  id: string;
  camera: string;
  date: string;
  time: string;
  duration: string;
  size: string;
  videoSrc: string;
}

interface FootageCardProps {
  clip: FootageItem;
  onNavigate: (screen: string) => void;
}

function FootageCard({ clip, onNavigate }: FootageCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.src = clip.videoSrc;
      video.load();
      
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      
      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      };
    }
  }, [clip.videoSrc]);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  };

  return (
    <button
      onClick={() => onNavigate('evidence-console')}
      className="bg-card rounded-xl overflow-hidden card-shadow hover-elevate smooth-transition text-left group"
    >
      <div className="aspect-video bg-secondary relative overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          onMouseEnter={(e) => {
            e.currentTarget.play().catch(() => {});
          }}
          onMouseLeave={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
        />
        <div 
          className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center cursor-pointer"
          onClick={handlePlayClick}
        >
          {isPlaying ? (
            <Pause className="h-12 w-12 text-white group-hover:scale-110 transition-transform" />
          ) : (
            <Play className="h-12 w-12 text-white/80 group-hover:text-white group-hover:scale-110 transition-transform" />
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{clip.camera}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {clip.date} {clip.time}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground">{clip.duration}</span>
          <span className="text-xs text-muted-foreground">{clip.size}</span>
        </div>
      </div>
    </button>
  );
}

export function FootageLibrary({ onNavigate }: FootageLibraryProps) {
  const footage: FootageItem[] = [
    { id: 'REC-001', camera: 'CAM-NZ-042', date: '2024-12-03', time: '10:45:00', duration: '15m 30s', size: '1.2 GB', videoSrc: cam1 },
    { id: 'REC-002', camera: 'CAM-WZ-055', date: '2024-12-03', time: '10:46:30', duration: '12m 45s', size: '1.0 GB', videoSrc: cam3 },
    { id: 'REC-003', camera: 'CAM-SZ-018', date: '2024-12-03', time: '10:48:00', duration: '8m 20s', size: '750 MB', videoSrc: cam4 },
    { id: 'REC-004', camera: 'CAM-EZ-089', date: '2024-12-03', time: '10:50:15', duration: '20m 10s', size: '1.8 GB', videoSrc: cam6 },
    { id: 'REC-005', camera: 'CAM-CZ-012', date: '2024-12-03', time: '11:15:00', duration: '18m 45s', size: '1.5 GB', videoSrc: cam7 },
    { id: 'REC-006', camera: 'CAM-NZ-047', date: '2024-12-03', time: '11:30:00', duration: '14m 20s', size: '1.1 GB', videoSrc: cam8 },
    { id: 'REC-007', camera: 'CAM-SZ-020', date: '2024-12-03', time: '11:45:00', duration: '16m 10s', size: '1.3 GB', videoSrc: cam12 },
    { id: 'REC-008', camera: 'CAM-WZ-031', date: '2024-12-03', time: '12:00:00', duration: '22m 30s', size: '2.0 GB', videoSrc: cam13 },
    { id: 'REC-009', camera: 'CAM-EZ-005', date: '2024-12-03', time: '12:15:00', duration: '19m 45s', size: '1.7 GB', videoSrc: camera1 },
  ];

  return (
    <div className="h-full bg-background overflow-auto">
      <div className="max-w-[1600px] mx-auto p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <button onClick={() => onNavigate('evidence-home')} className="text-muted-foreground hover:text-foreground mb-2 text-sm">
              ← Back to Evidence
            </button>
            <h1 className="text-2xl font-semibold">Footage Library</h1>
            <p className="text-muted-foreground mt-1">Browse and search raw camera recordings</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by camera ID, date, or time..."
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="px-4 py-2 rounded-lg bg-card border border-border hover:bg-accent smooth-transition flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </button>
          <button className="px-4 py-2 rounded-lg bg-card border border-border hover:bg-accent smooth-transition flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Camera
          </button>
          <button className="px-4 py-2 rounded-lg bg-card border border-border hover:bg-accent smooth-transition flex items-center gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {footage.map((clip) => (
            <FootageCard key={clip.id} clip={clip} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
}

