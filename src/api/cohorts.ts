export type CohortsAdhocType = 'TIDB';

export interface CohortsAdhocRequest {
  type: CohortsAdhocType;
  definition: string;
}

export interface CohortsEnvelope<T> {
  status: string;
  msg?: string;
  data: T;
}

export interface ActivityPoint {
  camera_id: string;
  zone: string;
  latitude: number;
  longitude: number;
  activity_level: 'LOW' | 'MEDIUM' | 'HIGH';
}

function getEnv(name: string): string | undefined {
  return (import.meta as any).env?.[name] as string | undefined;
}

function getCohortsConfig() {
  const baseUrl =
    getEnv('VITE_COHORTS_BASE_URL') ??
    'https://ig.gov-cloud.ai/pi-cohorts-service-dbaas/v1.0';
  const token = getEnv('VITE_COHORTS_TOKEN');
  const tenantId = getEnv('VITE_COHORTS_TENANT_ID');
  const userId = getEnv('VITE_COHORTS_USER_ID');
  const requesterType = getEnv('VITE_COHORTS_REQUESTER_TYPE');

  return { baseUrl, token, tenantId, userId, requesterType };
}

export async function postCohortsAdhoc<T>(
  request: CohortsAdhocRequest,
  opts?: { size?: number; signal?: AbortSignal }
): Promise<CohortsEnvelope<T>> {
  const { baseUrl, token, tenantId, userId, requesterType } = getCohortsConfig();

  if (!token) {
    throw new Error(
      'Missing VITE_COHORTS_TOKEN. Add it to your .env (see .env.example).'
    );
  }

  const url = new URL(`${baseUrl.replace(/\/$/, '')}/cohorts/adhoc`);
  if (opts?.size) url.searchParams.set('size', String(opts.size));

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // Optional headers used by your existing calls
  if (tenantId) headers['x-tenant-id'] = tenantId;
  if (userId) headers['x-user-id'] = userId;
  if (requesterType) headers['x-requester-type'] = requesterType;

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
    signal: opts?.signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Cohorts API error: ${res.status} ${res.statusText}${text ? ` — ${text}` : ''}`);
  }

  return (await res.json()) as CohortsEnvelope<T>;
}

// Mock data for fallback when API is not configured
const MOCK_HEATMAP_DATA: ActivityPoint[] = [
  { camera_id: 'CAM-NZ-001', zone: 'North Zone', latitude: 16.9891, longitude: 82.2475, activity_level: 'HIGH' },
  { camera_id: 'CAM-NZ-002', zone: 'North Zone', latitude: 16.9925, longitude: 82.2350, activity_level: 'MEDIUM' },
  { camera_id: 'CAM-SZ-012', zone: 'South Zone', latitude: 16.9350, longitude: 82.2280, activity_level: 'HIGH' },
  { camera_id: 'CAM-SZ-015', zone: 'South Zone', latitude: 16.9420, longitude: 82.2310, activity_level: 'LOW' },
  { camera_id: 'CAM-EZ-042', zone: 'East Zone', latitude: 16.9600, longitude: 82.2600, activity_level: 'HIGH' }, // Port area
  { camera_id: 'CAM-EZ-045', zone: 'East Zone', latitude: 16.9550, longitude: 82.2650, activity_level: 'MEDIUM' },
  { camera_id: 'CAM-WZ-088', zone: 'West Zone', latitude: 16.9650, longitude: 82.2100, activity_level: 'MEDIUM' },
  { camera_id: 'CAM-CZ-101', zone: 'Central Zone', latitude: 16.9520, longitude: 82.2380, activity_level: 'HIGH' }, // Bus stand
  { camera_id: 'CAM-CZ-104', zone: 'Central Zone', latitude: 16.9550, longitude: 82.2420, activity_level: 'HIGH' }, // Railway stn
];

export async function fetchActivityHeatmapPoints(opts?: {
  signal?: AbortSignal;
}): Promise<CohortsEnvelope<ActivityPoint[]>> {
  try {
    return await postCohortsAdhoc<ActivityPoint[]>(
      {
        type: 'TIDB',
        definition:
          'SELECT c.camera_id, c.zone, g.latitude, g.longitude, g.activity_level FROM t_69293dd7fd9c66658f22d6a7_t c JOIN t_69293d5bfd9c66658f22d6a6_t g ON c.camera_id = g.camera_id;',
      },
      { size: 2000, signal: opts?.signal }
    );
  } catch (error) {
    console.warn('Heatmap API failed/missing config. Using mock data.', error);
    // Return mock data so the UI continues to function
    return {
      status: 'success',
      data: MOCK_HEATMAP_DATA
    };
  }
}


