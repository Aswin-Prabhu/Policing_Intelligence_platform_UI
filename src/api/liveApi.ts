import { mockAlerts, mockStats } from '../data/mockData';

// We use the proxy configured in vite.config.ts (/api) -> http://192.153.62.146:8000
const BASE_URL = '/api';

/**
 * Generic fetch wrapper that handles errors and returns fallbacks.
 */
async function fetchWithFallback<T>(endpoint: string, options: RequestInit, fallback: T): Promise<T> {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            // Short timeout for fallbacks (e.g. 5 seconds) could be implemented with AbortController,
            // but standard fetch is okay for now.
        });

        if (!response.ok) {
            console.warn(`API Error [${response.status}] for ${endpoint}. Using fallback.`);
            return fallback;
        }

        return await response.json() as T;
    } catch (error) {
        console.warn(`Network or parsing error for ${endpoint}. Using fallback. Error:`, error);
        return fallback;
    }
}

// --- Specific API Calls ---

export const liveApi = {
    // System Health (Dashboard)
    getSystemHealth: async () => {
        // Expected to return health data, falling back to mockStats structure.
        // Replace the fallback structure with whatever the Dashboard needs.
        const fallback = mockStats;
        // The exact endpoint might be /v1/health or /system_health
        return fetchWithFallback<any>('/system_health', { method: 'GET' }, fallback);
    },

    // Traffic Violations (Evidence Screen)
    getViolations: async (limit = 50, hours_ago = 24) => {
        const fallback = { violations: mockAlerts }; // Assuming API returns { violations: [...] } or we map it later
        return fetchWithFallback<any>(`/helmet/violations?limit=${limit}&hours_ago=${hours_ago}`, { method: 'GET' }, fallback);
    },

    // Violation Statistics (Analytics Screen)
    getStatistics: async (hours = 24) => {
        const fallback = null; // Analytics has its own complex mock objects, handled in the component
        return fetchWithFallback<any>(`/helmet/statistics?hours=${hours}`, { method: 'GET' }, fallback);
    },

    // Pipeline Start/Stop
    startPipeline: async (cameraId: string, videoPath: string) => {
        // For POST requests that just trigger actions, no complex mock needed
        return fetchWithFallback<any>('/pipeline/start', {
            method: 'POST',
            body: JSON.stringify({ camera_id: cameraId, video_path: videoPath })
        }, { success: true, fallback: true });
    },

    // Async Simulation: Submit Image
    detectImageAsync: async (file: File, cameraId = 'api_upload') => {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${BASE_URL}/helmet/detect-image-async?camera_id=${cameraId}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status}`);
            }
            return await response.json(); // e.g. { job_id: "xyz" }
        } catch (error) {
            console.error('Failed to submit async image detection', error);
            throw error;
        }
    },

    // Async Simulation: Poll Job
    getSimulationJob: async (jobId: string) => {
        try {
            const response = await fetch(`${BASE_URL}/helmet/simulation-job/${jobId}?include_result=true`);
            if (!response.ok) {
                throw new Error(`Poll failed: ${response.status}`);
            }
            return await response.json(); // e.g. { status: "completed", result: { ... } }
        } catch (error) {
            console.error('Failed to poll simulation job', error);
            throw error;
        }
    }
};
