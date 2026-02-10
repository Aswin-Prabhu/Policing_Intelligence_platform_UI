import { AlertTriangle, TrendingUp, Activity, BarChart3, MapPin, Target, Sparkles } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import { useState } from 'react';

interface AnalyticsHomeProps {
    userRole: 'operator' | 'supervisor' | 'admin';
    onViewCameraHealth: () => void;
    onViewViolations: () => void;
    onViewAlerts?: () => void;
}


// ============================================
// OPERATOR ANALYTICS DASHBOARD
// Policing-Centric, Risk-Aware Analytics
// ============================================
// Policing-Centric, Risk-Aware Analytics
// ============================================
function OperatorAnalytics() {
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

    const operatorMetrics = {
        activeRiskEvents: 12,
        highSeverityCount: 3,
        mediumSeverityCount: 5,
        lowSeverityCount: 4,
        unattendedHighSeverity: 2,
        oldestHighSeverityDuration: '14 min',
        anprViolationsPending: 18,
        oldestAnprViolation: '22 min',
        crimeReportsAssigned: 8,
        emergencyAlertsWaiting: 5,
        casesNeedingDispatch: 12,
        evidenceToReview: 15,
        escalatedCasesWaiting: 3,
        casesProcessedToday: 24,
        incidentMomentum: [
            { time: 'Mon', count: 18 },
            { time: 'Tue', count: 22 },
            { time: 'Wed', count: 15 },
            { time: 'Thu', count: 28 },
            { time: 'Fri', count: 24 },
            { time: 'Sat', count: 31 },
            { time: 'Sun', count: 19 },
        ],
        momentumChange: '+15%',
        crimeTypes: [
            { type: 'Assault/Fight', count: 145, color: '#cbd5e1' },
            { type: 'Weapon Detection', count: 89, color: '#94a3b8' },
            { type: 'Traffic Violation', count: 312, color: '#64748b' },
            { type: 'Suspicious Activity', count: 178, color: '#475569' },
            { type: 'Other Crimes', count: 124, color: '#334155' },
        ],
        persistentIncidents: [
            { location: 'Beach Road Junction', type: 'Assault', duration: '18 min', severity: 'High' },
            { location: 'NH-16 Bypass', type: 'Traffic Accident', duration: '15 min', severity: 'Medium' },
            { location: 'Market Square', type: 'Suspicious Activity', duration: '12 min', severity: 'Medium' },
        ],
        repeatCrimeLocationsAll: [
            { location: 'Beach Road Junction', count: 47, category: 'Traffic Violations', zone: 'East Zone', area: 'Beach Road' },
            { location: 'NH-16 Bypass', count: 38, category: 'Vehicle Theft', zone: 'West Zone', area: 'Auto Nagar' },
            { location: 'Market Square', count: 32, category: 'Public Disturbance', zone: 'Central Zone', area: 'Market Area' },
            { location: 'Railway Station', count: 28, category: 'Pickpocketing', zone: 'Central Zone', area: 'Railway Station' },
            { location: 'Bus Stand Area', count: 24, category: 'Theft', zone: 'Central Zone', area: 'Bus Stand' },
            { location: 'Sarpavaram Junction', count: 22, category: 'Traffic Violations', zone: 'South Zone', area: 'Sarpavaram Junction' },
            { location: 'Turangi Circle', count: 20, category: 'Accidents', zone: 'North Zone', area: 'Turangi' },
            { location: 'Port Area Gate', count: 18, category: 'Suspicious Activity', zone: 'East Zone', area: 'Port Area' },
            { location: 'Prakash Nagar', count: 16, category: 'Theft', zone: 'West Zone', area: 'Prakash Nagar' },
            { location: 'Ramanayyapeta', count: 14, category: 'Public Disturbance', zone: 'North Zone', area: 'Ramanayyapeta' },
        ],
        activeIncidentsByZone: [
            { zone: 'North Zone', count: 5, critical: 1 },
            { zone: 'South Zone', count: 4, critical: 0 },
            { zone: 'East Zone', count: 3, critical: 1 },
            { zone: 'West Zone', count: 2, critical: 0 },
            { zone: 'Central Zone', count: 3, critical: 1 },
        ],
        systemImpact: {
            hasImpact: false,
            message: 'Camera CAM-NZ-042 offline - affecting active incident at Beach Road',
            affectedIncident: 'INC-2024-0012',
        },
    };

    // Filter logic for repeat crime locations
    const getFilteredRepeatCrimeLocations = () => {
        let filtered = operatorMetrics.repeatCrimeLocationsAll;

        if (selectedZone !== 'All Zones') {
            filtered = filtered.filter(item => item.zone === selectedZone);
        }

        if (selectedArea !== 'All Areas') {
            filtered = filtered.filter(item => item.area === selectedArea);
        }

        return filtered;
    };

    const repeatCrimeLocations = getFilteredRepeatCrimeLocations();

    const gridColor = '#e2e8f0';
    const axisText = '#64748b';
    const tooltipBg = 'rgba(255, 255, 255, 0.95)';
    const tooltipBorder = '#e2e8f0';
    const tooltipText = '#1e293b';

    const incidentMomentumOption = {
        grid: { left: 40, right: 20, top: 20, bottom: 30 },
        xAxis: {
            type: 'category',
            data: operatorMetrics.incidentMomentum.map((d) => d.time),
            axisLine: { lineStyle: { color: gridColor } },
            axisLabel: { color: axisText, fontSize: 11 },
        },
        yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: gridColor } },
            splitLine: { lineStyle: { color: gridColor, type: 'dashed' } },
            axisLabel: { color: axisText, fontSize: 11 },
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            textStyle: { color: tooltipText },
            formatter: '{b}: {c} incidents',
        },
        series: [
            {
                type: 'line',
                data: operatorMetrics.incidentMomentum.map((d) => d.count),
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: { width: 3, color: '#94a3b8' },
                itemStyle: { color: '#94a3b8' },
                areaStyle: { color: 'rgba(148, 163, 184, 0.15)' },
            },
        ],
    };

    const crimeTypePieOption = {
        tooltip: {
            trigger: 'item',
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            textStyle: { color: tooltipText },
            formatter: '{b}: {c} ({d}%)',
        },
        legend: { bottom: 0, itemWidth: 8, itemHeight: 8, textStyle: { color: axisText } },
        series: [
            {
                type: 'pie',
                radius: ['50%', '70%'],
                center: ['50%', '45%'],
                avoidLabelOverlap: true,
                itemStyle: { borderColor: '#fff', borderWidth: 2 },
                label: { show: false },
                data: operatorMetrics.crimeTypes.map((item) => ({
                    name: item.type,
                    value: item.count,
                    itemStyle: { color: item.color },
                })),
            },
        ],
    };

    const repeatCrimeLocationsOption = {
        grid: { left: 120, right: 20, top: 20, bottom: 20 },
        xAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: gridColor } },
            splitLine: { lineStyle: { color: gridColor, type: 'dashed' } },
            axisLabel: { color: axisText, fontSize: 11 },
        },
        yAxis: {
            type: 'category',
            data: repeatCrimeLocations.map((d) => d.location),
            axisLine: { lineStyle: { color: gridColor } },
            axisLabel: { color: axisText, fontSize: 11, width: 110, overflow: 'truncate' },
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            textStyle: { color: tooltipText },
        },
        series: [
            {
                type: 'bar',
                data: repeatCrimeLocations.map((d) => d.count),
                itemStyle: { color: '#64748b', borderRadius: [0, 4, 4, 0] },
                barWidth: 16,
            },
        ],
    };

    const activeIncidentsByZoneOption = {
        grid: { left: 40, right: 20, top: 20, bottom: 30 },
        xAxis: {
            type: 'category',
            data: operatorMetrics.activeIncidentsByZone.map((d) => d.zone.replace(' Zone', '')),
            axisLine: { lineStyle: { color: gridColor } },
            axisLabel: { color: axisText, fontSize: 11 },
        },
        yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: gridColor } },
            splitLine: { lineStyle: { color: gridColor, type: 'dashed' } },
            axisLabel: { color: axisText, fontSize: 11 },
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            textStyle: { color: tooltipText },
        },
        series: [
            {
                type: 'bar',
                data: operatorMetrics.activeIncidentsByZone.map((d) => d.count),
                itemStyle: {
                    color: (params: any) => {
                        const zone = operatorMetrics.activeIncidentsByZone[params.dataIndex];
                        return zone.critical > 0 ? '#64748b' : '#94a3b8';
                    },
                    borderRadius: [4, 4, 0, 0]
                },
                barWidth: 24,
            },
        ],
    };

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Operator Analytics</h2>
                <p className="text-slate-500 mt-1">Policing intelligence and operational risk awareness</p>
            </div>

            <div className="bg-slate-100 border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-200 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                            <div className="font-bold text-slate-800 text-lg">Unattended High-Severity Events</div>
                            <div className="text-sm text-slate-600">Immediate attention required for active incidents</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold text-slate-700">{operatorMetrics.unattendedHighSeverity}</div>
                        <div className="text-sm text-slate-500 font-medium mt-1">Oldest: {operatorMetrics.oldestHighSeverityDuration}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
                {[
                    { label: 'Traffic Violations Pending', value: operatorMetrics.anprViolationsPending, sub: `Oldest: ${operatorMetrics.oldestAnprViolation}`, color: 'blue' },
                    { label: 'Crime Reports Assigned', value: operatorMetrics.crimeReportsAssigned, sub: 'To me', color: 'slate' },
                    { label: 'Emergency Alerts', value: operatorMetrics.emergencyAlertsWaiting, sub: 'In my queue', color: 'rose' },
                    { label: 'Dispatch Required', value: operatorMetrics.casesNeedingDispatch, sub: 'Patrol needed', color: 'amber' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{stat.label}</div>
                        <div className="text-3xl font-bold text-slate-700">{stat.value}</div>
                        <div className="text-xs text-slate-500 mt-2 font-medium">{stat.sub}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800">Incident Momentum</h3>
                        <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{operatorMetrics.momentumChange}</span>
                    </div>
                    <ReactECharts option={incidentMomentumOption} style={{ height: 280 }} />
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">Crime Type Distribution</h3>
                    <ReactECharts option={crimeTypePieOption} style={{ height: 280 }} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">Active Incidents by Zone</h3>
                    <ReactECharts option={activeIncidentsByZoneOption} style={{ height: 280 }} />
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4">Repeat Crime Locations</h3>

                    {/* Filter Section */}
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-600 mb-2">Zone</label>
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
                            <label className="block text-xs font-medium text-slate-600 mb-2">Area</label>
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

                    <ReactECharts option={repeatCrimeLocationsOption} style={{ height: 280 }} />
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Persistent Active Incidents</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {operatorMetrics.persistentIncidents.map((incident, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-lg">
                            <div className="p-2 rounded-full bg-slate-100">
                                <MapPin className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-700">{incident.location}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{incident.type} • {incident.duration}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Operational Intelligence */}
            <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-slate-500" />
                    <h3 className="font-bold text-slate-800">Operational Intelligence</h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-bold text-slate-700">⚠️ Priority Alerts</span>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                            <p>• 2 high-severity incidents unattended for &gt;15 minutes</p>
                            <p>• Beach Road Junction incident requires immediate dispatch</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-bold text-slate-700">📊 Pattern Detection</span>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                            <p>• Assault incidents increased 23% in North Zone this week</p>
                            <p>• Traffic violations peak at 6-8 PM (42% of daily total)</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-bold text-slate-700">💡 Recommendations</span>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                            <p>1. Prioritize Beach Road Junction incident (18 min active)</p>
                            <p>2. Request backup for North Zone patrol</p>
                            <p>3. Review ANPR queue - oldest violation at 22 minutes</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-bold text-slate-700">🎯 Your Impact Today</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                                <div className="text-2xl font-bold text-slate-700">24</div>
                                <div className="text-xs text-slate-500 mt-1">Cases Processed</div>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                                <div className="text-2xl font-bold text-slate-700">8.5m</div>
                                <div className="text-xs text-slate-500 mt-1">Avg Resolution</div>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                                <div className="text-2xl font-bold text-slate-700">3</div>
                                <div className="text-xs text-slate-500 mt-1">Critical Handled</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// SUPERVISOR ANALYTICS DASHBOARD
// Police-Focused Operational Metrics
// ============================================
function SupervisorAnalytics() {
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

    const supervisorMetrics = {
        casesPendingReview: 18,
        criticalCasesOpen: 3,
        patrolResponseTime: '4.2 min',
        casesAwaitingApproval: 12,
        crimeReportsToday: 47,
        falseAlarmRate: '12%',
        casesReinvestigation: 5,
        avgCaseReviewTime: '8.5 min',
        officerWorkload: [
            { name: 'Patrol Team-A', load: 82, cases: 14 },
            { name: 'Patrol Team-B', load: 75, cases: 12 },
            { name: 'Patrol Team-C', load: 68, cases: 10 },
            { name: 'Patrol Team-D', load: 55, cases: 8 },
        ],
        crimeHotspotsAll: [
            { location: 'Beach Road Junction', type: 'New', crimes: 24, category: 'Traffic Violations', zone: 'East Zone', area: 'Beach Road' },
            { location: 'NH-16 Bypass', type: 'Persistent', crimes: 18, category: 'Vehicle Theft', zone: 'West Zone', area: 'Auto Nagar' },
            { location: 'Market Square', type: 'New', crimes: 15, category: 'Public Disturbance', zone: 'Central Zone', area: 'Market Area' },
            { location: 'Railway Station', type: 'Persistent', crimes: 12, category: 'Pickpocketing', zone: 'Central Zone', area: 'Railway Station' },
            { location: 'Port Area Gate', type: 'New', crimes: 11, category: 'Suspicious Activity', zone: 'East Zone', area: 'Port Area' },
            { location: 'Turangi Circle', type: 'Persistent', crimes: 10, category: 'Accidents', zone: 'North Zone', area: 'Turangi' },
            { location: 'Prakash Nagar Junction', type: 'New', crimes: 9, category: 'Theft', zone: 'West Zone', area: 'Prakash Nagar' },
            { location: 'Sarpavaram Junction', type: 'Persistent', crimes: 8, category: 'Traffic Violations', zone: 'South Zone', area: 'Sarpavaram Junction' },
        ],
        responseTimeByShift: [
            { shift: 'Morning (6AM-2PM)', time: '3.8 min', cases: 18 },
            { shift: 'Afternoon (2PM-10PM)', time: '4.5 min', cases: 22 },
            { shift: 'Night (10PM-6AM)', time: '5.2 min', cases: 7 },
        ],
        zoneCrimeDistribution: [
            { zone: 'North Zone', crimes: 45, trend: '+5%' },
            { zone: 'South Zone', crimes: 38, trend: '-2%' },
            { zone: 'East Zone', crimes: 52, trend: '+12%' },
            { zone: 'West Zone', crimes: 41, trend: '+3%' },
            { zone: 'Central Zone', crimes: 35, trend: '-8%' },
        ],
        caseStatusBreakdown: [
            { status: 'Under Investigation', count: 28, color: '#3b82f6' },
            { status: 'Awaiting Approval', count: 18, color: '#f59e0b' },
            { status: 'Closed', count: 142, color: '#10b981' },
            { status: 'Re-escalated', count: 5, color: '#ef4444' },
        ],
        weekOverWeekDelta: '+8%',
    };

    // Filter logic for crime hotspots
    const getFilteredCrimeHotspots = () => {
        let filtered = supervisorMetrics.crimeHotspotsAll;

        if (selectedZone !== 'All Zones') {
            filtered = filtered.filter(item => item.zone === selectedZone);
        }

        if (selectedArea !== 'All Areas') {
            filtered = filtered.filter(item => item.area === selectedArea);
        }

        return filtered;
    };

    const crimeHotspots = getFilteredCrimeHotspots();

    const gridColor = '#e2e8f0';
    const axisText = '#64748b';
    const tooltipBg = 'rgba(255, 255, 255, 0.95)';
    const tooltipBorder = '#e2e8f0';

    const officerWorkloadOption = {
        grid: { left: 50, right: 16, top: 18, bottom: 28 },
        xAxis: {
            type: 'category',
            data: supervisorMetrics.officerWorkload.map((d) => d.name),
            axisLine: { lineStyle: { color: gridColor } },
            axisLabel: { color: axisText, fontSize: 11, rotate: 15 },
        },
        yAxis: {
            type: 'value',
            max: 100,
            name: 'Workload %',
            nameTextStyle: { color: axisText },
            axisLine: { lineStyle: { color: gridColor } },
            splitLine: { lineStyle: { color: gridColor, type: 'dashed', opacity: 0.8 } },
            axisLabel: { color: axisText },
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            textStyle: { color: '#1e293b' },
            formatter: (params: any) => {
                const param = params[0];
                const officer = supervisorMetrics.officerWorkload.find(op => op.name === param.name);
                return `${param.name}<br/>Workload: ${param.value}%<br/>Active Cases: ${officer?.cases || 0}`;
            },
        },
        series: [
            {
                name: 'Workload',
                type: 'bar',
                data: supervisorMetrics.officerWorkload.map((d) => d.load),
                itemStyle: { color: '#64748b', borderRadius: [4, 4, 0, 0] },
                barWidth: 40,
            },
        ],
    };

    const zoneCrimeOption = {
        grid: { left: 50, right: 30, top: 30, bottom: 40 },
        xAxis: {
            type: 'category',
            data: supervisorMetrics.zoneCrimeDistribution.map((d) => d.zone),
            axisLine: { lineStyle: { color: gridColor } },
            axisLabel: { color: axisText, fontSize: 11 },
        },
        yAxis: {
            type: 'value',
            name: 'Crimes',
            nameTextStyle: { color: axisText },
            axisLine: { lineStyle: { color: gridColor } },
            splitLine: { lineStyle: { color: gridColor, type: 'dashed', opacity: 0.5 } },
            axisLabel: { color: axisText },
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            textStyle: { color: '#1e293b' },
            formatter: (params: any) => {
                const param = params[0];
                const zone = supervisorMetrics.zoneCrimeDistribution.find(z => z.zone === param.name);
                return `${param.name}<br/>Crimes: ${param.value}<br/>Trend: ${zone?.trend || 'N/A'}`;
            },
        },
        series: [
            {
                name: 'Crimes',
                type: 'bar',
                data: supervisorMetrics.zoneCrimeDistribution.map((d) => d.crimes),
                itemStyle: {
                    color: () => '#64748b',
                    borderRadius: [4, 4, 0, 0]
                },
                barWidth: 40,
            },
        ],
    };

    const caseStatusPieOption = {
        tooltip: {
            trigger: 'item',
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            textStyle: { color: '#1e293b' },
            formatter: '{b}: {c} ({d}%)',
        },
        series: [
            {
                type: 'pie',
                radius: ['50%', '75%'],
                avoidLabelOverlap: true,
                itemStyle: { borderColor: '#ffffff', borderWidth: 2 },
                label: {
                    show: true,
                    color: '#1e293b',
                    formatter: '{b}\n{d}%',
                    fontSize: 11,
                },
                emphasis: { scale: true, scaleSize: 6 },
                data: supervisorMetrics.caseStatusBreakdown.map((item) => ({
                    name: item.status,
                    value: item.count,
                    itemStyle: { color: item.color },
                })),
            },
        ],
    };

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Supervisor Analytics</h2>
                <p className="text-slate-500 mt-1">Operational control and quality metrics</p>
            </div>

            <div className="grid grid-cols-4 gap-6">
                {[
                    { label: 'Cases Pending Review', value: supervisorMetrics.casesPendingReview, sub: 'Awaiting approval', color: 'amber' },
                    { label: 'Critical Cases Open', value: supervisorMetrics.criticalCasesOpen, sub: 'Require attention', color: 'rose' },
                    { label: 'Patrol Response Time', value: supervisorMetrics.patrolResponseTime, sub: 'Average', color: 'slate' },
                    { label: 'Awaiting Decision', value: supervisorMetrics.casesAwaitingApproval, sub: 'Your action needed', color: 'indigo' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{stat.label}</div>
                        <div className={`text-3xl font-bold text-slate-700`}>{stat.value}</div>
                        <div className="text-xs text-slate-500 mt-2 font-medium">{stat.sub}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-4 gap-6">
                {[
                    { label: 'Crime Reports', value: supervisorMetrics.crimeReportsToday, sub: 'Filed today', color: 'emerald' },
                    { label: 'False Alarm Rate', value: supervisorMetrics.falseAlarmRate, sub: 'Invalid reports', color: 'slate' },
                    { label: 'Re-investigation', value: supervisorMetrics.casesReinvestigation, sub: 'Flagged cases', color: 'amber' },
                    { label: 'Avg Review Time', value: supervisorMetrics.avgCaseReviewTime, sub: 'Per case', color: 'blue' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{stat.label}</div>
                        <div className={`text-3xl font-bold text-slate-700`}>{stat.value}</div>
                        <div className="text-xs text-slate-500 mt-2 font-medium">{stat.sub}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">Patrol Team Workload</h3>
                    <ReactECharts option={officerWorkloadOption} style={{ height: 280 }} />
                    <div className="mt-6 grid grid-cols-4 gap-4">
                        {supervisorMetrics.officerWorkload.map((team, idx) => (
                            <div key={idx} className="text-center p-2 bg-slate-50 rounded-lg">
                                <div className="text-xs font-medium text-slate-500 mb-1">{team.name}</div>
                                <div className="text-lg font-bold text-slate-700">{team.cases}</div>
                                <div className="text-[10px] text-slate-400">cases</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4">Crime Hotspots (7 Days)</h3>

                    {/* Filter Section */}
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-600 mb-2">Zone</label>
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
                            <label className="block text-xs font-medium text-slate-600 mb-2">Area</label>
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

                    {/* Scrollable list with fade effect */}
                    <div className="relative">
                        <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                            {crimeHotspots.map((hotspot, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg hover:border-gray-200 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-full border border-gray-200">
                                            <MapPin className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-700">{hotspot.location}</div>
                                            <div className="text-xs text-slate-500">{hotspot.crimes} crimes • {hotspot.category}</div>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${hotspot.type === 'New'
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {hotspot.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {/* Fade gradient at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">Zone-wise Crime Distribution</h3>
                    <ReactECharts option={zoneCrimeOption} style={{ height: 300 }} />
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">Case Status Breakdown</h3>
                    <ReactECharts option={caseStatusPieOption} style={{ height: 300 }} />
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6">Patrol Response Time by Shift</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {supervisorMetrics.responseTimeByShift.map((shift, idx) => (
                        <div key={idx} className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-sm font-medium text-slate-500 mb-2">{shift.shift}</div>
                            <div className="text-3xl font-bold text-slate-700 mb-1">{shift.time}</div>
                            <div className="text-xs text-slate-400">{shift.cases} cases handled</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Supervisory Intelligence */}
            <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-slate-500" />
                    <h3 className="font-bold text-slate-800">Supervisory Intelligence</h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-bold text-slate-700">📈 Team Performance</span>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                            <p>• Patrol Team-A at 82% capacity - consider load balancing</p>
                            <p>• Average case review time improved 15% this week</p>
                            <p>• Response time variance: Morning (3.8m) vs Night (5.2m)</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-bold text-slate-700">🗺️ Geographic Analysis</span>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                            <p>• East Zone shows +12% crime trend - deploy additional resources</p>
                            <p>• Beach Road Junction: New hotspot (24 crimes in 7 days)</p>
                            <p>• NH-16 Bypass: Persistent pattern (vehicle theft cluster)</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-bold text-slate-700">💡 Resource Optimization</span>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                            <p>1. Redistribute 2 cases from Team-A to Team-D</p>
                            <p>2. Increase evening shift coverage in East Zone</p>
                            <p>3. Review false alarm sources (12% rate - target &lt;8%)</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-bold text-slate-700">🎯 Quality Metrics</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                                <div className="text-2xl font-bold text-slate-700">94%</div>
                                <div className="text-xs text-slate-500 mt-1">Approval Rate</div>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                                <div className="text-2xl font-bold text-slate-700">2.6%</div>
                                <div className="text-xs text-slate-500 mt-1">Re-investigation</div>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                                <div className="text-2xl font-bold text-slate-700">High</div>
                                <div className="text-xs text-slate-500 mt-1">Team-A Load</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// ADMIN ANALYTICS - System-Wide Overview
// ============================================
function AdminAnalytics() {
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

    const gridColor = '#e2e8f0';
    const axisText = '#64748b';
    const tooltipBg = 'rgba(255, 255, 255, 0.95)';
    const tooltipBorder = '#e2e8f0';
    const tooltipText = '#1e293b';

    // Activity Timeline Data (7 days)
    const activityData = [
        { day: 'Mon', violations: 87, incidents: 12, alerts: 8, evidence: 18 },
        { day: 'Tue', violations: 92, incidents: 15, alerts: 10, evidence: 22 },
        { day: 'Wed', violations: 78, incidents: 10, alerts: 6, evidence: 15 },
        { day: 'Thu', violations: 95, incidents: 18, alerts: 12, evidence: 24 },
        { day: 'Fri', violations: 103, incidents: 14, alerts: 9, evidence: 20 },
        { day: 'Sat', violations: 68, incidents: 8, alerts: 5, evidence: 12 },
        { day: 'Sun', violations: 72, incidents: 9, alerts: 7, evidence: 14 },
    ];

    // Geographic Distribution Data
    const locationDataAll = [
        { location: 'NH-16 Junction', total: 142, zone: 'West Zone', area: 'Auto Nagar' },
        { location: 'Beach Road', total: 118, zone: 'East Zone', area: 'Beach Road' },
        { location: 'Market Square', total: 95, zone: 'Central Zone', area: 'Market Area' },
        { location: 'Railway Station', total: 87, zone: 'Central Zone', area: 'Railway Station' },
        { location: 'Port Area', total: 73, zone: 'East Zone', area: 'Port Area' },
        { location: 'Turangi Circle', total: 68, zone: 'North Zone', area: 'Turangi' },
        { location: 'Prakash Nagar', total: 62, zone: 'West Zone', area: 'Prakash Nagar' },
        { location: 'Sarpavaram Junction', total: 55, zone: 'South Zone', area: 'Sarpavaram Junction' },
        { location: 'Bus Stand', total: 48, zone: 'Central Zone', area: 'Bus Stand' },
    ];

    // Filter logic for geographic distribution
    const getFilteredLocationData = () => {
        let filtered = locationDataAll;

        if (selectedZone !== 'All Zones') {
            filtered = filtered.filter(item => item.zone === selectedZone);
        }

        if (selectedArea !== 'All Areas') {
            filtered = filtered.filter(item => item.area === selectedArea);
        }

        return filtered;
    };

    const locationData = getFilteredLocationData();

    const activityTimelineOption = {
        grid: { left: 50, right: 20, top: 40, bottom: 30 },
        legend: {
            top: 0,
            itemWidth: 12,
            itemHeight: 12,
            textStyle: { color: axisText, fontSize: 11 },
        },
        xAxis: {
            type: 'category',
            data: activityData.map((d) => d.day),
            axisLine: { lineStyle: { color: gridColor } },
            axisLabel: { color: axisText, fontSize: 11 },
        },
        yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: gridColor } },
            splitLine: { lineStyle: { color: gridColor, type: 'dashed' } },
            axisLabel: { color: axisText, fontSize: 11 },
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            textStyle: { color: tooltipText },
        },
        series: [
            {
                name: 'Violations',
                type: 'line',
                data: activityData.map((d) => d.violations),
                smooth: true,
                lineStyle: { width: 2, color: '#cbd5e1' },
                itemStyle: { color: '#cbd5e1' },
                areaStyle: { color: 'rgba(203, 213, 225, 0.15)' },
            },
            {
                name: 'Incidents',
                type: 'line',
                data: activityData.map((d) => d.incidents),
                smooth: true,
                lineStyle: { width: 2, color: '#94a3b8' },
                itemStyle: { color: '#94a3b8' },
                areaStyle: { color: 'rgba(148, 163, 184, 0.15)' },
            },
            {
                name: 'Alerts',
                type: 'line',
                data: activityData.map((d) => d.alerts),
                smooth: true,
                lineStyle: { width: 2, color: '#64748b' },
                itemStyle: { color: '#64748b' },
                areaStyle: { color: 'rgba(100, 116, 139, 0.15)' },
            },
            {
                name: 'Evidence',
                type: 'line',
                data: activityData.map((d) => d.evidence),
                smooth: true,
                lineStyle: { width: 2, color: '#475569' },
                itemStyle: { color: '#475569' },
                areaStyle: { color: 'rgba(71, 85, 105, 0.15)' },
            },
        ],
    };

    const geographicOption = {
        grid: { left: 130, right: 20, top: 20, bottom: 20 },
        xAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: gridColor } },
            splitLine: { lineStyle: { color: gridColor, type: 'dashed' } },
            axisLabel: { color: axisText, fontSize: 11 },
        },
        yAxis: {
            type: 'category',
            data: locationData.map((d) => d.location),
            axisLine: { lineStyle: { color: gridColor } },
            axisLabel: { color: axisText, fontSize: 11 },
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: tooltipBg,
            borderColor: tooltipBorder,
            textStyle: { color: tooltipText },
            formatter: '{b}: {c} activities',
        },
        series: [
            {
                type: 'bar',
                data: locationData.map((d) => d.total),
                itemStyle: { color: '#64748b', borderRadius: [0, 4, 4, 0] },
                barWidth: 20,
            },
        ],
    };

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">System Analytics</h2>
                <p className="text-slate-500 mt-1">Comprehensive system-wide intelligence and performance metrics</p>
            </div>

            {/* System Health KPIs */}
            <div className="grid grid-cols-4 gap-6">
                {[
                    { label: 'Camera Network', value: '152/156', sub: '97.4% online', icon: Activity },
                    { label: 'AI Performance', value: '91.8%', sub: 'Detection accuracy', icon: Target },
                    { label: 'System Uptime', value: '99.2%', sub: 'Last 7 days', icon: TrendingUp },
                    { label: 'Storage Used', value: '78%', sub: '2.4 TB available', icon: BarChart3 },
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}</div>
                            <stat.icon className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="text-3xl font-bold text-slate-700">{stat.value}</div>
                        <div className="text-xs text-slate-500 mt-2 font-medium">{stat.sub}</div>
                    </div>
                ))}
            </div>

            {/* Module Status Grid */}
            <div className="grid grid-cols-3 gap-6">
                {[
                    { title: 'Traffic Violations', today: 87, pending: 4, trend: '+12%', trendUp: true },
                    { title: 'Incidents', open: 8, investigating: 5, critical: 3 },
                    { title: 'Evidence', packages: 24, pending: 8, exported: 15 },
                    { title: 'Alerts', active: 12, highSeverity: 3, avgResponse: '4.2 min' },
                    { title: 'Cameras', online: 152, offline: 4, uptime: '99.2%' },
                    { title: 'Bodycam', units: 24, active: 18, footage: '142 hrs' },
                ].map((module, i) => (
                    <div key={i} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">{module.title}</h3>
                        <div className="space-y-2 text-sm">
                            {Object.entries(module).filter(([key]) => key !== 'title' && key !== 'trendUp').map(([key, value], idx) => (
                                <div key={idx} className="flex justify-between items-center">
                                    <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <span className="font-medium text-slate-700">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* System Charts */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4">Activity Timeline (7 Days)</h3>
                    <ReactECharts option={activityTimelineOption} style={{ height: '280px' }} />
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4">Geographic Distribution</h3>

                    {/* Filter Section */}
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-600 mb-2">Zone</label>
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
                            <label className="block text-xs font-medium text-slate-600 mb-2">Area</label>
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

                    <ReactECharts option={geographicOption} style={{ height: '280px' }} />
                </div>
            </div>

            {/* AI System Intelligence */}
            <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-slate-500" />
                    <h3 className="font-bold text-slate-800">System Intelligence</h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-bold text-slate-700">🔍 Performance Analysis</span>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                            <p>• System accuracy improved 3.2% this month</p>
                            <p>• Camera uptime: 99.2% (target: 99.5%)</p>
                            <p>• Evidence processing time reduced by 22%</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-bold text-slate-700">⚠️ System Alerts</span>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                            <p>• CAM-NZ-042 offline for 18 min (affecting active incident)</p>
                            <p>• Storage approaching 80% - recommend cleanup</p>
                            <p>• 4 cameras due for maintenance this week</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-bold text-slate-700">💡 Optimization Recommendations</span>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                            <p>1. Upgrade CAM-EZ-015 firmware (15% better detection)</p>
                            <p>2. Archive evidence packages &gt;90 days (free 12% storage)</p>
                            <p>3. Schedule maintenance for 4 cameras during low-activity hours</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-bold text-slate-700">📊 Trend Insights</span>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                            <p>• Traffic violations spike 42% during 6-8 PM</p>
                            <p>• Beach Road Junction: Persistent hotspot (3 weeks)</p>
                            <p>• Bodycam usage up 18% in evening shift</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-bold text-slate-700">🎯 System Goals</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                                <div className="text-2xl font-bold text-slate-700">99.5%</div>
                                <div className="text-xs text-slate-500 mt-1">Target Uptime</div>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                                <div className="text-2xl font-bold text-slate-700">&lt;8%</div>
                                <div className="text-xs text-slate-500 mt-1">False Alarm Rate</div>
                            </div>
                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                                <div className="text-2xl font-bold text-slate-700">93%</div>
                                <div className="text-xs text-slate-500 mt-1">AI Accuracy Goal</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

// ============================================
// MAIN COMPONENT
// ============================================
export function AnalyticsHome({ userRole }: AnalyticsHomeProps) {
    // Render persona-specific view
    if (userRole === 'operator') {
        return <OperatorAnalytics />;
    } else if (userRole === 'supervisor') {
        return <SupervisorAnalytics />;
    } else {
        return <AdminAnalytics />;
    }
}
