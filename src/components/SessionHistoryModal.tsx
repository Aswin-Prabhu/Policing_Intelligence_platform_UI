import { X, Smartphone, Globe, Clock, LogOut, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  role: string;
  userId: string;
  username: string;
  onClose: () => void;
}

interface SessionEntry {
  loginTime: string;
  logoutTime: string | 'Active';
  ip: string;
  device: string;
  status: 'active' | 'completed';
}

export default function SessionHistoryModal({ role, userId, onClose }: Props) {
  const [history, setHistory] = useState<SessionEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessionData() {
      setLoading(true);

      try {
        // 1. Get Real IP
        let ip = "192.168.1.1";
        try {
          const res = await fetch('https://api.ipify.org?format=json');
          const data = await res.json();
          ip = data.ip;
        } catch (e) {
          console.error("Failed to fetch IP:", e);
          ip = "Unavailable (Network Error)";
        }

        // 2. Get Real Device Info
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

        const fullDevice = `${browser} on ${device}`;

        // 3. Generate History
        const now = new Date();
        const past = new Date(now.getTime() - 86400000); // 1 day ago

        // Current Session (Active)
        const currentSession: SessionEntry = {
          loginTime: now.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric', year: 'numeric' }),
          logoutTime: 'Active',
          ip: ip,
          device: fullDevice,
          status: 'active'
        };

        // Past Session (Mocked but using real IP/Device for consistency)
        const pastSession: SessionEntry = {
          loginTime: past.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric', year: 'numeric' }),
          logoutTime: new Date(past.getTime() + 28800000).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric', year: 'numeric' }), // +8 hours
          ip: ip, // Assuming same IP for demo
          device: fullDevice, // Assuming same device
          status: 'completed'
        };

        setHistory([currentSession, pastSession]);

      } catch (error) {
        console.error("Error loading session history", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSessionData();
  }, [userId]);

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-200">
      <div className="w-[500px] max-w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-900">
          <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">Session History</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md transition-colors text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 bg-white dark:bg-neutral-900">

          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <span>Recent activity for</span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">{userId}</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <div className="w-6 h-6 border-2 border-neutral-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-neutral-500">Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <p className="text-neutral-500 text-center py-8">No session history found.</p>
          ) : (
            <div className="space-y-4">
              {history.map((entry, idx) => (
                <div
                  key={idx}
                  className={`relative rounded-lg border p-4 transition-all ${entry.status === 'active'
                      ? 'bg-neutral-50 border-neutral-200 dark:bg-neutral-800/50 dark:border-neutral-700'
                      : 'bg-white border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800'
                    }`}
                >
                  <div className="grid grid-cols-[80px_1fr] gap-y-3 gap-x-4 text-sm">

                    {/* Login Row */}
                    <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-500 font-medium">
                      <Clock className="w-3.5 h-3.5" /> Login
                    </div>
                    <div className="text-neutral-900 dark:text-neutral-200 font-medium font-mono tracking-tight">
                      {entry.loginTime}
                    </div>

                    {/* Logout Row */}
                    <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-500 font-medium">
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </div>
                    <div className={`${entry.status === 'active' ? 'text-emerald-600 dark:text-emerald-500 font-bold flex items-center gap-1.5' : 'text-neutral-700 dark:text-neutral-300 font-mono tracking-tight'}`}>
                      {entry.status === 'active' ? (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          Active Now
                        </>
                      ) : (
                        entry.logoutTime
                      )}
                    </div>

                    {/* IP Row */}
                    <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-500 font-medium">
                      <Globe className="w-3.5 h-3.5" /> IP Addr
                    </div>
                    <div className="text-neutral-700 dark:text-neutral-300 font-mono text-xs">
                      {entry.ip}
                    </div>

                    {/* Device Row */}
                    <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-500 font-medium">
                      <Smartphone className="w-3.5 h-3.5" /> Device
                    </div>
                    <div className="text-neutral-700 dark:text-neutral-300">
                      {entry.device}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg text-sm font-semibold transition-all shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
