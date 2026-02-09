import { Alert, Drone, Stats, ANPRHit } from '../types';

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'Crowd Surge Detected',
    severity: 'critical',
    timestamp: '2025-11-26T14:32:15',
    source: 'RakshakAI',
    location: 'Market Junction - CAM-045'
  },
  {
    id: '2',
    type: 'Perimeter Breach',
    severity: 'high',
    timestamp: '2025-11-26T14:28:42',
    source: 'RakshakAI',
    location: 'Industrial Zone - CAM-112'
  },
  {
    id: '3',
    type: 'Wrong Way Detection',
    severity: 'medium',
    timestamp: '2025-11-26T14:25:18',
    source: 'RakshakAI',
    location: 'NH-16 Bypass - CAM-089'
  },
  {
    id: '4',
    type: 'Abandoned Object',
    severity: 'high',
    timestamp: '2025-11-26T14:20:55',
    source: 'RakshakAI',
    location: 'Railway Station - CAM-023'
  },
  {
    id: '5',
    type: 'Loitering Detected',
    severity: 'medium',
    timestamp: '2025-11-26T14:15:33',
    source: 'RakshakAI',
    location: 'Beach Road - CAM-067'
  },
  {
    id: '6',
    type: 'Vehicle Overspeed',
    severity: 'medium',
    timestamp: '2025-11-26T14:12:08',
    source: 'AerialAI',
    location: 'Airport Road - DRONE-02'
  },
  {
    id: '7',
    type: 'Fire Detection',
    severity: 'critical',
    timestamp: '2025-11-26T14:08:45',
    source: 'AerialAI',
    location: 'Godown Area - DRONE-01'
  },
  {
    id: '8',
    type: 'Traffic Congestion',
    severity: 'normal',
    timestamp: '2025-11-26T14:05:20',
    source: 'RakshakAI',
    location: 'Gandhi Circle - CAM-034'
  }
];

export const mockDrones: Drone[] = [
  {
    id: 'M-300-1',
    name: 'Aerial Guardian 01',
    battery: 87,
    pilot: 'Constable Ravi Kumar',
    status: 'active'
  },
  {
    id: 'M-300-2',
    name: 'Aerial Guardian 02',
    battery: 65,
    pilot: 'SI Priya Sharma',
    status: 'active'
  },
  {
    id: 'M-300-3',
    name: 'Aerial Guardian 03',
    battery: 23,
    pilot: 'Constable Ajay Reddy',
    status: 'charging'
  }
];

export const mockStats: Stats = {
  totalCameras: 342,
  activeCameras: 328,
  activeDrones: 2,
  pendingIncidents: 12,
  todayViolations: 47
};

export const mockANPRHits: ANPRHit[] = [
  {
    id: '1',
    plate: 'AP-39-TK-2845',
    vehicle: 'Maruti Swift',
    confidence: 96.8,
    timestamp: '14:30:15'
  },
  {
    id: '2',
    plate: 'AP-09-CZ-7621',
    vehicle: 'Honda City',
    confidence: 94.2,
    timestamp: '14:28:42'
  },
  {
    id: '3',
    plate: 'AP-39-BH-4532',
    vehicle: 'Hyundai Creta',
    confidence: 98.5,
    timestamp: '14:25:18'
  },
  {
    id: '4',
    plate: 'TN-01-AB-9876',
    vehicle: 'Toyota Innova',
    confidence: 91.3,
    timestamp: '14:20:55'
  }
];
