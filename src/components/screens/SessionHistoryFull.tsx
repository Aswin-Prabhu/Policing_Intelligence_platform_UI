import { useEffect, useState } from "react";
import { ArrowLeft, History, Search } from "lucide-react";
import { getSessionHistory, SessionLog } from "../../services/sessionService";
import { IPDisplay } from "../IPDisplay";

interface Props {
    onBack: () => void;
    userId: string;
}

export function SessionHistoryFull({ onBack, userId }: Props) {
    const [history, setHistory] = useState<SessionLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const data = await getSessionHistory(userId);
                setHistory(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [userId]);

    const filteredHistory = history.filter(h =>
        h.ip_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.device_info.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.login_time.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 h-full flex flex-col space-y-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <History className="w-6 h-6 text-indigo-500" />
                            Full Session History
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Audit logs for user: <span className="text-indigo-400 font-mono">{userId}</span>
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 w-64 placehoder-slate-500"
                    />
                </div>
            </div>

            {/* Table Content */}
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
                {/* Table Header */}
                <div className="bg-slate-950/50 border-b border-slate-800 p-4 grid grid-cols-12 gap-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <div className="col-span-1">Status</div>
                    <div className="col-span-3">Login Time</div>
                    <div className="col-span-3">Logout Time</div>
                    <div className="col-span-2">IP Address</div>
                    <div className="col-span-3">Device</div>
                </div>

                <div className="overflow-y-auto flex-1 custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center h-48 text-slate-500">
                            Loading records...
                        </div>
                    ) : filteredHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                            <History className="w-8 h-8 mb-2 opacity-20" />
                            <p>No session records found.</p>
                        </div>
                    ) : (
                        <div>
                            {filteredHistory.map((entry, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 grid grid-cols-12 gap-4 border-b border-slate-800/50 hover:bg-white/5 transition-colors items-center text-sm"
                                >
                                    <div className="col-span-1">
                                        {entry.status === 'active' ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                ACTIVE
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                                                CLOSED
                                            </span>
                                        )}
                                    </div>
                                    <div className="col-span-3 text-slate-300 font-mono text-xs">{entry.login_time}</div>
                                    <div className="col-span-3 text-slate-400 font-mono text-xs">
                                        {entry.status === 'active' ? (
                                            <span className="text-emerald-500/70 italic">Current Session</span>
                                        ) : (
                                            entry.logout_time
                                        )}
                                    </div>
                                    <div className="col-span-2 flex items-center gap-2">
                                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs font-mono border border-slate-700">
                                            <IPDisplay ip={entry.ip_address} />
                                        </span>
                                    </div>
                                    <div className="col-span-3 text-slate-400 truncate" title={entry.device_info}>
                                        {entry.device_info}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-slate-950 border-t border-slate-800 p-3 text-xs text-slate-600 text-right">
                    Showing {filteredHistory.length} records • Synced with Database
                </div>
            </div>
        </div>
    );
}
