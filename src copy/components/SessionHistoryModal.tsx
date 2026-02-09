import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  role: string;
  userId: string;
  username: string;
  onClose: () => void;
}

interface SessionEntry {
  loginTime: string;
  logoutTime: string;
  ip: string;
  device: string;
}

export default function SessionHistoryModal({ role, userId, onClose }: Props) {
  const [history, setHistory] = useState<SessionEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);

      // 🔥 Replace this later with real API
      const mock = [
        {
          loginTime: "2025-12-02 09:21 AM",
          logoutTime: "2025-12-02 05:12 PM",
          ip: "192.168.1.42",
          device: "Chrome on Windows 10"
        },
        {
          loginTime: "2025-12-01 10:10 AM",
          logoutTime: "2025-12-01 06:40 PM",
          ip: "192.168.1.42",
          device: "Chrome on Windows 10"
        }
      ];

      setTimeout(() => {
        setHistory(mock);
        setLoading(false);
      }, 500);
    }

    loadHistory();
  }, [userId]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200]">
      <div className="w-[520px] max-w-full bg-[#111112] border border-[#1f2937] rounded-2xl shadow-2xl p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-[#1f2937] pb-2">
          <h2 className="text-white text-lg font-semibold">Session History</h2>
          <button onClick={onClose} className="hover:bg-[#1a1f2e] p-1 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-4">
          Recent login activity for <span className="text-cyan-400 font-medium">{userId}</span>
        </p>

        {/* Loading */}
        {loading ? (
          <p className="text-gray-500 text-center py-8">Loading session history...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No session history found.</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {history.map((entry, idx) => (
              <div
                key={idx}
                className="bg-[#1a1f2e] border border-[#232936] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-300 text-sm">
                      <span className="text-gray-500 font-medium">Login:</span> {entry.loginTime}
                    </p>
                    <p className="text-gray-300 text-sm mt-1">
                      <span className="text-gray-500 font-medium">Logout:</span> {entry.logoutTime}
                    </p>
                  </div>
                  <div className="text-right text-gray-400 text-xs">
                    <p>IP: {entry.ip}</p>
                    <p className="mt-0.5">Device: {entry.device}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer / Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
