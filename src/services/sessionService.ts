import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client if env vars are present
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export interface SessionLog {
    id?: string;
    user_id: string;
    login_time: string;
    logout_time: string;
    ip_address: string;
    device_info: string;
    status: 'active' | 'completed';
}

// Helper to get real IP and Device
export async function getClientInfo() {
    let ip = "192.168.1.1";
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        ip = data.ip;
    } catch (e) {
        console.error("Failed to fetch IP:", e);
        ip = "Unavailable";
    }

    const userAgent = navigator.userAgent;
    let device = "Unknown Device";
    if (userAgent.indexOf("Win") !== -1) device = "Windows PC";
    if (userAgent.indexOf("Mac") !== -1) device = "Macintosh";
    if (userAgent.indexOf("Linux") !== -1) device = "Linux PC";
    if (userAgent.indexOf("Android") !== -1) device = "Android Device";
    if (userAgent.indexOf("like Mac") !== -1) device = "iOS Device";

    let browser = "Unknown Browser";
    if (userAgent.indexOf("Chrome") !== -1) browser = "Chrome";
    else if (userAgent.indexOf("Firefox") !== -1) browser = "Firefox";
    else if (userAgent.indexOf("Safari") !== -1) browser = "Safari";
    else if (userAgent.indexOf("Edge") !== -1) browser = "Edge";

    return { ip, device: `${browser} on ${device}` };
}

// --- Session Logic ---

export async function logSessionStart(userId: string): Promise<SessionLog> {
    const { ip, device } = await getClientInfo();
    const now = new Date().toLocaleString();

    const newSession: SessionLog = {
        user_id: userId,
        login_time: now,
        logout_time: 'Active',
        ip_address: ip,
        device_info: device,
        status: 'active'
    };

    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('session_logs')
                .insert([newSession])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (e) {
            console.warn("Supabase insert failed, falling back to local:", e);
        }
    }

    // Fallback: LocalStorage
    const existing = JSON.parse(localStorage.getItem('kkn_session_logs') || '[]');
    // Mark any previous active sessions as completed (assume crash/close)
    const updated = existing.map((s: SessionLog) =>
        s.status === 'active' && s.user_id === userId
            ? { ...s, status: 'completed', logout_time: now }
            : s
    );

    updated.unshift(newSession);
    localStorage.setItem('kkn_session_logs', JSON.stringify(updated));
    return newSession;
}


export async function logSessionEnd(userId: string) {
    const now = new Date().toLocaleString();

    if (supabase) {
        try {
            // Find the most recent active session for this user
            const { data: activeSession, error } = await supabase
                .from('session_logs')
                .select('*')
                .eq('user_id', userId)
                .eq('status', 'active')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (activeSession) {
                await supabase
                    .from('session_logs')
                    .update({ logout_time: now, status: 'completed' })
                    .eq('id', activeSession.id);
            }
        } catch (e) {
            console.warn("Supabase update failed:", e);
        }
    }

    // Fallback: LocalStorage
    const existing = JSON.parse(localStorage.getItem('kkn_session_logs') || '[]');
    const updated = existing.map((s: SessionLog) =>
        s.status === 'active' && s.user_id === userId
            ? { ...s, status: 'completed', logout_time: now }
            : s
    );
    localStorage.setItem('kkn_session_logs', JSON.stringify(updated));
}


export async function getSessionHistory(userId: string): Promise<SessionLog[]> {
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('session_logs')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false }); // Assuming created_at exists or sort by login_time

            if (data) return data;
        } catch (e) {
            console.warn("Supabase fetch failed:", e);
        }
    }

    // Fallback
    const all = JSON.parse(localStorage.getItem('kkn_session_logs') || '[]');
    return all.filter((s: SessionLog) => s.user_id === userId);
}
