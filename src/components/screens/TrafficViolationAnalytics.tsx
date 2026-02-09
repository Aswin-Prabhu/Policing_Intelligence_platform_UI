import React from 'react';
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
                    <h3 className="text-lg font-bold text-slate-800 mb-6">High Violation Zones (Hotspots)</h3>
                    <div className="space-y-4">
                        {[
                            { zone: 'Main Road Junction', count: 42, severity: 'High' },
                            { zone: 'Market Square', count: 28, severity: 'Medium' },
                            { zone: 'School Zone B', count: 12, severity: 'Medium' },
                            { zone: 'Highway Exit 4', count: 5, severity: 'Low' },
                        ].map((zone, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">
                                        {idx + 1}
                                    </div>
                                    <span className="font-medium text-slate-700">{zone.zone}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-slate-500">{zone.count} Violations</span>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${zone.severity === 'High' ? 'bg-rose-100 text-rose-600' :
                                        zone.severity === 'Medium' ? 'bg-amber-100 text-amber-600' :
                                            'bg-emerald-100 text-emerald-600'
                                        }`}>
                                        {zone.severity}
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
