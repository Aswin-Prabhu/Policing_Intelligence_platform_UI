import React, { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { ArrowLeft, Filter, Download, Calendar } from 'lucide-react';

interface TrafficViolationAnalyticsProps {
    onBack: () => void;
}

export function TrafficViolationAnalytics({ onBack }: TrafficViolationAnalyticsProps) {
    // Kakinada Zone-Area Mapping
    const kakinadaZones: { [key: string]: string[] } = {
        'North Zone': ['All Areas', 'Sarpavaram', 'Turangi', 'Ramanayyapeta', 'Jagannaickpur'],
        'South Zone': ['All Areas', 'Suryaraopeta', 'Bhanugudi', 'Vakalapudi', 'Sarpavaram Junction'],
        'East Zone': ['All Areas', 'Beach Road', 'Bhavanapadu', 'Coastal Area', 'Port Area'],
        'West Zone': ['All Areas', 'Ramaraopeta', 'Danavaipeta', 'Prakash Nagar', 'Auto Nagar'],
        'Central Zone': ['All Areas', 'Main Road', 'Market Area', 'Railway Station', 'Bus Stand']
    };

    // Filter State
    const [selectedZone, setSelectedZone] = useState<string>('All Zones');
    const [selectedArea, setSelectedArea] = useState<string>('All Areas');

    // Mock Data - Matching ANPR Home "87 Analysis" context
    const violationsByType = [
        { name: 'No Helmet', value: 45 },
        { name: 'Triple Riding', value: 25 },
        { name: 'Red Light', value: 10 },
        { name: 'Wrong Way', value: 5 },
        { name: 'Stolen', value: 2 },
    ];

    const violationsTrend = [
        { time: '06:00', value: 5 },
        { time: '08:00', value: 12 },
        { time: '10:00', value: 25 },
        { time: '12:00', value: 18 },
        { time: '14:00', value: 15 },
        { time: '16:00', value: 22 },
        { time: '18:00', value: 30 },
    ];

    const vehicleTypeData = [
        { name: 'Two Wheeler', value: 65, color: '#6366f1' }, // Indigo-500
        { name: 'Four Wheeler', value: 25, color: '#8b5cf6' }, // Violet-500
        { name: 'Heavy Vehicle', value: 10, color: '#ec4899' }, // Pink-500
    ];

    const stats = [
        { label: 'Total Violations', value: '87', change: '+12%', color: 'text-slate-700', bg: 'bg-slate-50' },
        { label: 'Challans Generated', value: '74', change: '+8%', color: 'text-slate-700', bg: 'bg-slate-50' },
        { label: 'Pending Review', value: '13', change: '-2%', color: 'text-slate-700', bg: 'bg-slate-50' },
        { label: 'Accuracy Rate', value: '98.2%', change: '+0.5%', color: 'text-slate-700', bg: 'bg-slate-50' },
    ];

    // High Violation Zones with zone and area data
    const highViolationZonesAll = [
        { zone: 'Main Road Junction', count: 42, severity: 'High', zoneArea: 'Central Zone', area: 'Main Road' },
        { zone: 'Market Square', count: 28, severity: 'Medium', zoneArea: 'Central Zone', area: 'Market Area' },
        { zone: 'Beach Road Junction', count: 24, severity: 'High', zoneArea: 'East Zone', area: 'Beach Road' },
        { zone: 'NH-16 Bypass', count: 18, severity: 'Medium', zoneArea: 'West Zone', area: 'Auto Nagar' },
        { zone: 'Railway Station', count: 15, severity: 'Medium', zoneArea: 'Central Zone', area: 'Railway Station' },
        { zone: 'Turangi Circle', count: 12, severity: 'Low', zoneArea: 'North Zone', area: 'Turangi' },
        { zone: 'Port Area Gate', count: 10, severity: 'Low', zoneArea: 'East Zone', area: 'Port Area' },
        { zone: 'Prakash Nagar', count: 8, severity: 'Low', zoneArea: 'West Zone', area: 'Prakash Nagar' },
    ];

    // Filter logic for high violation zones
    const getFilteredViolationZones = () => {
        let filtered = highViolationZonesAll;

        if (selectedZone !== 'All Zones') {
            filtered = filtered.filter(item => item.zoneArea === selectedZone);
        }

        if (selectedArea !== 'All Areas') {
            filtered = filtered.filter(item => item.area === selectedArea);
        }

        return filtered;
    };

    const highViolationZones = getFilteredViolationZones();

    // Analytics Dashboard Palette (Slate Scale)
    const analyticsPalette = ['#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1'];

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Traffic Violation Analytics</h1>
                        <p className="text-slate-500">Comprehensive analysis of traffic alerts and enforcement</p>
                    </div>
                </div>
            </div>

            {/* KPI Cards - Professional & Clean */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                        <div className="mt-2 flex items-baseline gap-3">
                            <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stat.change.startsWith('+') ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Hourly Trend - Professional Line Chart */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Violation Trend (Hourly)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={violationsTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#475569' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#475569"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#475569', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, fill: '#334155' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Violation Distribution - Professional Bar Chart */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Violations by Type</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={violationsByType} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} width={100} />
                                <Tooltip
                                    cursor={{ fill: '#F1F5F9' }}
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />
                                <Bar dataKey="value" fill="#64748b" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Vehicle Composition - Doughnut */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Vehicle Composition</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={vehicleTypeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {vehicleTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={analyticsPalette[index % analyticsPalette.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        {vehicleTypeData.map((type, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: analyticsPalette[idx % analyticsPalette.length] }} />
                                <span className="text-xs text-slate-500 font-medium">{type.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hotspots List (Professional) */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">High Violation Zones (Hotspots)</h3>

                    {/* Filter Section */}
                    <div className="flex gap-3 mb-6">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">Zone</label>
                            <select
                                value={selectedZone}
                                onChange={(e) => {
                                    setSelectedZone(e.target.value);
                                    setSelectedArea('All Areas');
                                }}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300"
                            >
                                <option value="All Zones">All Zones</option>
                                {Object.keys(kakinadaZones).map(zone => (
                                    <option key={zone} value={zone}>{zone}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">Area</label>
                            <select
                                value={selectedArea}
                                onChange={(e) => setSelectedArea(e.target.value)}
                                disabled={selectedZone === 'All Zones'}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:bg-slate-50 disabled:text-slate-400"
                            >
                                {selectedZone === 'All Zones' ? (
                                    <option value="All Areas">All Areas</option>
                                ) : (
                                    kakinadaZones[selectedZone]?.map(area => (
                                        <option key={area} value={area}>{area}</option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {highViolationZones.map((zoneItem, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">
                                        {idx + 1}
                                    </div>
                                    <span className="font-medium text-slate-700">{zoneItem.zone}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-slate-500">{zoneItem.count} Violations</span>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${zoneItem.severity === 'High' ? 'bg-rose-100 text-rose-600' :
                                        zoneItem.severity === 'Medium' ? 'bg-amber-100 text-amber-600' :
                                            'bg-emerald-100 text-emerald-600'
                                        }`}>
                                        {zoneItem.severity}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
