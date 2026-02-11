import { useState } from 'react';
import {
    Calendar,
    Clock,
    Search,
    Filter,
    Download,
    Archive,
    FileText,
    CheckCircle,
    X,
    ChevronDown,
    ChevronUp,
    AlertTriangle,
    Car,
    MapPin
} from 'lucide-react';

interface EvidenceRecord {
    id: string;
    timestamp: Date;
    location: string;
    violationType: string;
    vehicleReg: string;
    ownerName: string;
    status: 'Challan Sent' | 'Pending Review' | 'Contested';
    hasSnapshot: boolean; // True if within 7 days
    imageUrl?: string;
}

export function TrafficEvidence() {
    const [activeTab, setActiveTab] = useState<'active' | 'archive'>('active');
    const [selectedReport, setSelectedReport] = useState<EvidenceRecord | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    // Mock Data Generation
    const generateMockData = (): EvidenceRecord[] => {
        const records: EvidenceRecord[] = [];
        const now = new Date();

        // Generate 20 records spanning last 14 days
        for (let i = 0; i < 20; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            // Add random minutes
            date.setMinutes(date.getMinutes() - (i * 30));

            const isExpired = i > 7;

            records.push({
                id: `TRF-2024-${1000 + i}`,
                timestamp: date,
                location: ['MG Road', 'Indra Junction', 'Main Street', 'Highway 16'][i % 4],
                violationType: ['No Helmet', 'Triple Riding', 'Signal Jump', 'Wrong Way'][i % 4],
                vehicleReg: `AP ${(30 + i) % 99} KL ${1000 + i * 5}`,
                ownerName: ['Rajesh Kumar', 'Suresh Reddy', 'Priya Singh', 'Amit Shah'][i % 4],
                status: i % 3 === 0 ? 'Challan Sent' : 'Pending Review',
                hasSnapshot: !isExpired,
                imageUrl: !isExpired ? 'https://images.unsplash.com/photo-1596561266396-7bb7c234b34d?auto=format&fit=crop&q=80&w=600' : undefined
            });
        }
        return records;
    };

    const [allRecords] = useState<EvidenceRecord[]>(generateMockData());

    const activeRecords = allRecords.filter(r => r.hasSnapshot);
    // Recent violations are just the first 4 active ones
    const recentRecords = activeRecords.slice(0, 4);

    // Filter logic
    const filteredRecords = allRecords.filter(record => {
        if (!hasSearched && activeTab === 'active') return false; // Show nothing in active tab until search
        // In archive tab, maybe show all by default or also require search? Let's match behavior for consistency
        // But usually archives are list-first. Let's make Archive list-first, Active search-first as requested.
        if (activeTab === 'archive') return true;

        if (searchQuery) {
            return record.vehicleReg.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.id.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    });

    const getDaysRemaining = (date: Date) => {
        const diff = 7 - Math.floor((new Date().getTime() - date.getTime()) / (1000 * 3600 * 24));
        return diff > 0 ? diff : 0;
    };

    const handleSearch = () => {
        setHasSearched(true);
    };

    const toggleRow = (id: string) => {
        if (expandedRow === id) {
            setExpandedRow(null);
        } else {
            setExpandedRow(id);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                            <Archive className="w-6 h-6 text-indigo-600" />
                            Traffic Evidence Console
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Manage violation snapshots and long-term incident reports</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-100 rounded-lg p-1 flex border border-slate-200">
                            <button
                                onClick={() => { setActiveTab('active'); setHasSearched(false); }}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'active' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Active Snapshots
                            </button>
                            <button
                                onClick={() => { setActiveTab('archive'); }}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'archive' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Evidence Archive
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

                {/* RECENT VIOLATIONS WIDGET (Initial State Only) */}
                {!hasSearched && activeTab === 'active' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-8 bg-rose-500 rounded-full"></div>
                            <h2 className="text-lg font-bold text-slate-800">Recent Violations (Live Feed)</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {recentRecords.map(record => (
                                <div key={record.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-2 opacity-50 text-slate-300">
                                        <Car className="w-12 h-12" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${record.violationType === 'No Helmet' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                                    'bg-orange-50 text-orange-700 border-orange-200'
                                                }`}>
                                                {record.violationType}
                                            </span>
                                            <span className="text-xs text-slate-400">{record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="font-mono font-bold text-lg text-slate-800 mb-1">{record.vehicleReg}</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {record.location}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* MAIN QUERY SECTION */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Filter className="w-4 h-4 text-indigo-500" />
                        Filter Evidence Records
                    </h2>
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by Registration Number, Violation ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-sm"
                            />
                        </div>
                        <div className="w-48">
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <select className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 appearance-none text-slate-600">
                                    <option>Last 24 Hours</option>
                                    <option>Last 3 Days</option>
                                    <option>Last 7 Days</option>
                                    <option>Custom Range</option>
                                </select>
                            </div>
                        </div>
                        <div className="w-48">
                            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 appearance-none text-slate-600">
                                <option>All Violations</option>
                                <option>No Helmet</option>
                                <option>Triple Riding</option>
                                <option>Wrong Way</option>
                            </select>
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2"
                        >
                            <Search className="w-4 h-4" />
                            Search Records
                        </button>
                    </div>
                </div>

                {/* RESULTS LIST VIEW */}
                {((hasSearched && activeTab === 'active') || activeTab === 'archive') && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-700">Search Results <span className="text-slate-400 font-normal">({filteredRecords.length} records found)</span></h3>
                            {hasSearched && (
                                <button onClick={() => setHasSearched(false)} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                    Clear Results
                                </button>
                            )}
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm divide-y divide-slate-100">
                            {filteredRecords.length > 0 ? (
                                filteredRecords.map(record => (
                                    <div key={record.id} className="group">
                                        {/* Row Header */}
                                        <div
                                            onClick={() => toggleRow(record.id)}
                                            className={`px-6 py-4 flex items-center gap-4 cursor-pointer transition-colors ${expandedRow === record.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
                                        >
                                            <div className={`p-2 rounded-full transition-transform duration-200 ${expandedRow === record.id ? 'rotate-180 bg-indigo-100 text-indigo-600' : 'text-slate-400 bg-slate-100'}`}>
                                                <ChevronDown className="w-4 h-4" />
                                            </div>

                                            <div className="w-32">
                                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">ID</div>
                                                <div className="font-mono text-sm font-semibold text-slate-700">{record.id}</div>
                                            </div>

                                            <div className="w-40">
                                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Date</div>
                                                <div className="text-sm font-medium text-slate-900">{record.timestamp.toLocaleDateString()} <span className="text-slate-400">{record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                                            </div>

                                            <div className="w-48">
                                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Violation</div>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border mt-0.5 ${record.violationType === 'No Helmet' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                                        'bg-blue-50 text-blue-700 border-blue-200'
                                                    }`}>
                                                    {record.violationType}
                                                </span>
                                            </div>

                                            <div className="w-48">
                                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Registration</div>
                                                <div className="font-mono text-sm font-bold text-slate-800">{record.vehicleReg}</div>
                                            </div>

                                            <div className="flex-1 text-right">
                                                {record.hasSnapshot ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                                                        <CheckCircle className="w-3 h-3" /> Snapshot Available
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200">
                                                        <Archive className="w-3 h-3" /> Archived
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Expanded Content */}
                                        {expandedRow === record.id && (
                                            <div className="px-6 pb-6 pt-2 bg-indigo-50/30 border-t border-indigo-100 flex gap-6 animate-in slide-in-from-top-2 duration-200">
                                                {/* Image Section */}
                                                <div className="w-64 h-40 bg-slate-200 rounded-lg overflow-hidden border border-slate-300 relative shrink-0">
                                                    {record.hasSnapshot ? (
                                                        <>
                                                            <img src={record.imageUrl} className="w-full h-full object-cover" alt="Snapshot" />
                                                            <div className="absolute inset-0 bg-black/10"></div>
                                                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded font-mono">
                                                                CAM-042
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                                            <Archive className="w-8 h-8 mb-2" />
                                                            <span className="text-xs font-bold">Image Archived</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Details Section */}
                                                <div className="flex-1 grid grid-cols-2 gap-4">
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Owner Details</h4>
                                                        <div className="p-3 bg-white border border-slate-200 rounded-lg">
                                                            <div className="text-sm font-bold text-slate-800">{record.ownerName}</div>
                                                            <div className="text-xs text-slate-500 mt-1">Reg: {record.vehicleReg}</div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location Details</h4>
                                                        <div className="p-3 bg-white border border-slate-200 rounded-lg">
                                                            <div className="text-sm font-bold text-slate-800">{record.location}</div>
                                                            <div className="text-xs text-slate-500 mt-1">Zone: North Control Sector</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-2 flex justify-end gap-3 mt-auto">
                                                        <div className="mr-auto flex items-center gap-2 text-xs text-orange-600 font-medium bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                                                            <Clock className="w-3 h-3" />
                                                            {record.hasSnapshot ? `Snapshot expires in ${getDaysRemaining(record.timestamp)} days` : 'Snapshot expired'}
                                                        </div>

                                                        <button className="px-4 py-2 bg-white border border-slate-300 rounded text-sm font-medium hover:bg-slate-50 text-slate-700 shadow-sm">
                                                            Download Challan
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setSelectedReport(record); }}
                                                            className="px-4 py-2 bg-indigo-600 rounded text-sm font-bold text-white hover:bg-indigo-700 shadow flex items-center gap-2"
                                                        >
                                                            <FileText className="w-3 h-3" /> View Full Report
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-700">No records found</h3>
                                    <p className="text-slate-500 mt-1">Try adjusting your search criteria</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Empty State for Active Tab before search */}
                {!hasSearched && activeTab === 'active' && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-slate-700">Ready to Search</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-1">
                            Enter a registration number or select a date range above to view specific violation records and snapshots.
                        </p>
                    </div>
                )}
            </div>

            {/* REPORT MODAL */}
            {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full text-slate-900 overflow-hidden border border-slate-200 ring-4 ring-slate-900/5">
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                    Official Violation Report
                                </h2>
                                <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Ref: {selectedReport.id}</div>
                            </div>
                            <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8">
                            {/* Header Info */}
                            <div className="flex gap-6 mb-8">
                                <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 shrink-0 overflow-hidden relative">
                                    {selectedReport.hasSnapshot ? (
                                        <img src={selectedReport.imageUrl} className="w-full h-full object-cover" alt="Evidence" />
                                    ) : (
                                        <div className="text-center p-2 flex flex-col items-center justify-center h-full w-full">
                                            <Archive className="w-8 h-8 text-slate-300 mb-1" />
                                            <span className="text-[10px] text-slate-400 font-bold uppercase block leading-tight">Image Archived</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{selectedReport.violationType}</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {selectedReport.timestamp.toLocaleString()}</span>
                                        <span className="flex items-center gap-1.5 font-medium"><CheckCircle className="w-4 h-4 text-emerald-600" /> Status: {selectedReport.status}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600 w-full shadow-[0_0_10px_rgba(79,70,229,0.3)]"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Vehicle Registration</div>
                                    <div className="text-base font-mono font-bold text-slate-800 bg-white border border-slate-200 px-3 py-1 rounded inline-block shadow-sm">
                                        {selectedReport.vehicleReg}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Registered Owner</div>
                                    <div className="text-base font-bold text-slate-800">{selectedReport.ownerName}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Location of Incident</div>
                                    <div className="text-base font-medium text-slate-800">{selectedReport.location}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Enforcement Unit</div>
                                    <div className="text-base font-medium text-slate-800">Traffic Unit - Zone North</div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="bg-slate-50 -mx-8 -mb-8 px-8 py-4 flex justify-end gap-3 border-t border-slate-200">
                                <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold hover:bg-slate-50 text-slate-700 flex items-center gap-2 shadow-sm transition-all hover:shadow">
                                    <Download className="w-4 h-4" /> Download PDF
                                </button>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-bold text-white hover:bg-indigo-700 shadow-md hover:shadow-lg flex items-center gap-2 transition-all"
                                >
                                    Close Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
