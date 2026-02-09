import { AlertTriangle, Clock, TrendingUp, Activity, BarChart3, MapPin, Target } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

function isLightTheme() {
  return document?.documentElement?.dataset?.theme === 'light';
}

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
function OperatorAnalytics() {
  // Police-focused synthetic data for operator view
  const operatorMetrics = {
    // Active Risk Summary (TOP STRIP - KEEP)
    activeRiskEvents: 12,
    highSeverityCount: 3,
    mediumSeverityCount: 5,
    lowSeverityCount: 4,
    
    // Unattended High-Severity Events (CRITICAL CARD)
    unattendedHighSeverity: 2, // High severity incidents not acknowledged
    oldestHighSeverityDuration: '14 min', // Oldest high-severity incident duration
    
    // Operator Work Queue - Police Focus
    anprViolationsPending: 18, // ANPR violations waiting for operator review
    oldestAnprViolation: '22 min', // Oldest ANPR violation waiting review
    crimeReportsAssigned: 8, // Crime reports assigned to this operator
    emergencyAlertsWaiting: 5, // Emergency alerts in operator's queue
    casesNeedingDispatch: 12, // Cases requiring patrol dispatch
    evidenceToReview: 15, // Evidence clips waiting for operator review
    escalatedCasesWaiting: 3, // Escalated cases waiting for operator response
    casesProcessedToday: 24, // Cases operator has processed today
    
    // Incident Momentum (last 1 week, daily intervals)
    incidentMomentum: [
      { time: 'Mon', count: 18 },
      { time: 'Tue', count: 22 },
      { time: 'Wed', count: 15 },
      { time: 'Thu', count: 28 },
      { time: 'Fri', count: 24 },
      { time: 'Sat', count: 31 },
      { time: 'Sun', count: 19 },
    ],
    momentumChange: '+15%', // Last 7 days vs previous 7 days
    
    // Crime Type Mix (Last 6 months - monthly totals)
    crimeTypes: [
      { type: 'Assault/Fight', count: 145, color: '#ef4444' },
      { type: 'Weapon Detection', count: 89, color: '#f59e0b' },
      { type: 'Traffic Violation', count: 312, color: '#3b82f6' },
      { type: 'Suspicious Activity', count: 178, color: '#8b5cf6' },
      { type: 'Other Crimes', count: 124, color: '#6b7280' },
    ],
    
    // Persistent Active Incidents (duration > 10 min, still active)
    persistentIncidents: [
      { location: 'Beach Road Junction', type: 'Assault', duration: '18 min', severity: 'High' },
      { location: 'NH-16 Bypass', type: 'Traffic Accident', duration: '15 min', severity: 'Medium' },
      { location: 'Market Square', type: 'Suspicious Activity', duration: '12 min', severity: 'Medium' },
    ],
    
    // Repeat Crime Locations (Last 4 weeks)
    repeatCrimeLocations: [
      { location: 'Beach Road Junction', count: 47, category: 'Traffic Violations' },
      { location: 'NH-16 Bypass', count: 38, category: 'Vehicle Theft' },
      { location: 'Market Square', count: 32, category: 'Public Disturbance' },
      { location: 'Railway Station', count: 28, category: 'Pickpocketing' },
      { location: 'Bus Stand Area', count: 24, category: 'Theft' },
    ],
    
    // Active Incidents by Zone (Current)
    activeIncidentsByZone: [
      { zone: 'North Zone', count: 5, critical: 1 },
      { zone: 'South Zone', count: 4, critical: 0 },
      { zone: 'East Zone', count: 3, critical: 1 },
      { zone: 'West Zone', count: 2, critical: 0 },
      { zone: 'Central Zone', count: 3, critical: 1 },
    ],
    
    // Conditional System Impact (only if affects policing)
    systemImpact: {
      hasImpact: false, // Set to true to show alert
      message: 'Camera CAM-NZ-042 offline - affecting active incident at Beach Road',
      affectedIncident: 'INC-2024-0012',
    },
  };

  const gridColor = isLightTheme() ? '#e5e7eb' : '#1f2937';
  const axisText = isLightTheme() ? '#6b7280' : '#9ca3af';
  const tooltipBg = isLightTheme() ? 'rgba(17,24,39,0.92)' : 'rgba(13,17,23,0.96)';

  // Incident Momentum Chart (Line/Bar - Last 1 week, daily intervals)
  const incidentMomentumOption = {
    grid: { left: 50, right: 30, top: 30, bottom: 40 },
    xAxis: {
      type: 'category',
      data: operatorMetrics.incidentMomentum.map((d) => d.time),
      axisLine: { lineStyle: { color: gridColor } },
      axisLabel: { color: axisText, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      name: 'Incidents',
      nameTextStyle: { color: axisText },
      axisLine: { lineStyle: { color: gridColor } },
      splitLine: { lineStyle: { color: gridColor, type: 'dashed', opacity: 0.5 } },
      axisLabel: { color: axisText },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: tooltipBg,
      borderColor: gridColor,
      textStyle: { color: '#e5e7eb' },
      formatter: '{b}<br/>{a}: {c} incidents',
    },
    series: [
      {
        name: 'Incidents',
        type: 'line',
        data: operatorMetrics.incidentMomentum.map((d) => d.count),
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 2, color: '#ef4444' },
        itemStyle: { color: '#ef4444' },
        areaStyle: { color: 'rgba(239, 68, 68, 0.1)' },
      },
    ],
  };

    // Crime Type Mix Pie Chart (Donut)
    const crimeTypePieOption = {
      tooltip: {
        trigger: 'item',
        backgroundColor: tooltipBg,
        borderColor: gridColor,
        textStyle: { color: '#e5e7eb' },
        formatter: '{b}: {c} ({d}%)',
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '75%'],
          avoidLabelOverlap: true,
          itemStyle: { borderColor: isLightTheme() ? '#ffffff' : '#0d1117', borderWidth: 2 },
          label: {
            show: true,
            color: isLightTheme() ? '#111827' : '#e5e7eb',
            formatter: '{b}\n{d}%',
            fontSize: 11,
          },
          emphasis: { scale: true, scaleSize: 6 },
          data: operatorMetrics.crimeTypes.map((item) => ({
            name: item.type,
            value: item.count,
            itemStyle: { color: item.color },
          })),
        },
      ],
    };

    // Repeat Crime Locations (Horizontal Bar Chart)
    const repeatCrimeLocationsOption = {
      grid: { left: 180, right: 30, top: 20, bottom: 20 },
      xAxis: {
        type: 'value',
        name: 'Crimes',
        nameTextStyle: { color: axisText },
        axisLine: { lineStyle: { color: gridColor } },
        splitLine: { lineStyle: { color: gridColor, type: 'dashed', opacity: 0.5 } },
        axisLabel: { color: axisText },
      },
      yAxis: {
        type: 'category',
        data: operatorMetrics.repeatCrimeLocations.map((d) => d.location),
        axisLine: { lineStyle: { color: gridColor } },
        axisLabel: { color: axisText, fontSize: 11 },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: tooltipBg,
        borderColor: gridColor,
        textStyle: { color: '#e5e7eb' },
        formatter: (params: any) => {
          const param = params[0];
          const location = operatorMetrics.repeatCrimeLocations.find(loc => loc.location === param.name);
          return `${param.name}<br/>Crimes: ${param.value}<br/>Category: ${location?.category || 'N/A'}`;
        },
      },
      series: [
        {
          name: 'Crimes',
          type: 'bar',
          data: operatorMetrics.repeatCrimeLocations.map((d) => d.count),
          itemStyle: { color: '#3b82f6', borderRadius: [0, 4, 4, 0] },
          barWidth: 20,
        },
      ],
    };

    // Active Incidents by Zone (Bar Chart)
    const activeIncidentsByZoneOption = {
      grid: { left: 50, right: 30, top: 30, bottom: 40 },
      xAxis: {
        type: 'category',
        data: operatorMetrics.activeIncidentsByZone.map((d) => d.zone),
        axisLine: { lineStyle: { color: gridColor } },
        axisLabel: { color: axisText, fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        name: 'Active Incidents',
        nameTextStyle: { color: axisText },
        axisLine: { lineStyle: { color: gridColor } },
        splitLine: { lineStyle: { color: gridColor, type: 'dashed', opacity: 0.5 } },
        axisLabel: { color: axisText },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: tooltipBg,
        borderColor: gridColor,
        textStyle: { color: '#e5e7eb' },
        formatter: (params: any) => {
          const param = params[0];
          const zone = operatorMetrics.activeIncidentsByZone.find(z => z.zone === param.name);
          return `${param.name}<br/>Total: ${param.value}<br/>Critical: ${zone?.critical || 0}`;
        },
      },
      series: [
        {
          name: 'Active Incidents',
          type: 'bar',
          data: operatorMetrics.activeIncidentsByZone.map((d) => d.count),
          itemStyle: { 
            color: (params: any) => {
              const zone = operatorMetrics.activeIncidentsByZone[params.dataIndex];
              return zone.critical > 0 ? '#ef4444' : '#3b82f6';
            },
            borderRadius: [4, 4, 0, 0] 
          },
          barWidth: 40,
        },
      ],
    };

  // Calculate momentum comparison (last 7 days vs previous 7 days)
  // For this week's data, compare last 3-4 days vs first 3-4 days
  const lastHalfWeek = operatorMetrics.incidentMomentum.slice(-4).reduce((sum, d) => sum + d.count, 0);
  const firstHalfWeek = operatorMetrics.incidentMomentum.slice(0, 3).reduce((sum, d) => sum + d.count, 0);
  const momentumTrend = lastHalfWeek > firstHalfWeek ? 'increasing' : lastHalfWeek < firstHalfWeek ? 'decreasing' : 'stable';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-black text-xl font-semibold">Operator Analytics</h2>
        <p className="text-black/60 text-sm mt-1">Policing intelligence and risk awareness</p>
      </div>

     

   

      {/* Unattended High-Severity Events (CRITICAL CARD) */}
      <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-700" />
            <div>
              <div className="text-sm font-semibold text-red-900 mb-1">Unattended High-Severity Events</div>
              <div className="text-xs text-red-700">High-severity incidents not yet acknowledged</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-red-700">{operatorMetrics.unattendedHighSeverity}</div>
            <div className="text-xs text-red-600 mt-1">Oldest: {operatorMetrics.oldestHighSeverityDuration}</div>
          </div>
        </div>
      </div>

      {/* Primary Operator Work Queue - Police Focus */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Traffic Violations Pending</div>
          <div className="text-2xl font-semibold text-blue-700">{operatorMetrics.anprViolationsPending}</div>
          <div className="text-xs text-black/60 mt-1">Oldest: {operatorMetrics.oldestAnprViolation}</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Crime Reports Assigned</div>
          <div className="text-2xl font-semibold text-black">{operatorMetrics.crimeReportsAssigned}</div>
          <div className="text-xs text-black/60 mt-1">To me</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Emergency Alerts Waiting</div>
          <div className="text-2xl font-semibold text-red-700">{operatorMetrics.emergencyAlertsWaiting}</div>
          <div className="text-xs text-black/60 mt-1">In my queue</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Cases Needing Dispatch</div>
          <div className="text-2xl font-semibold text-amber-700">{operatorMetrics.casesNeedingDispatch}</div>
          <div className="text-xs text-black/60 mt-1">Require patrol</div>
        </div>
      </div>

      {/* Secondary Operator Work Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Evidence to Review</div>
          <div className="text-2xl font-semibold text-black">{operatorMetrics.evidenceToReview}</div>
          <div className="text-xs text-black/60 mt-1">Video clips waiting</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Escalated Cases Waiting</div>
          <div className="text-2xl font-semibold text-red-700">{operatorMetrics.escalatedCasesWaiting}</div>
          <div className="text-xs text-black/60 mt-1">My response needed</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Cases Processed Today</div>
          <div className="text-2xl font-semibold text-green-700">{operatorMetrics.casesProcessedToday}</div>
          <div className="text-xs text-black/60 mt-1">This shift</div>
        </div>
      </div>

      {/* 3️⃣ Incident Momentum (LINE CHART) */}
      <div className="bg-card border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-black font-semibold">Incident Momentum (Last 1 Week)</h3>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${
              momentumTrend === 'increasing' ? 'text-red-700' : 
              momentumTrend === 'decreasing' ? 'text-green-700' : 
              'text-black/60'
            }`}>
              {operatorMetrics.momentumChange} vs previous 7 days
            </span>
            {momentumTrend === 'increasing' && <TrendingUp className="w-4 h-4 text-red-700" />}
          </div>
        </div>
        <ReactECharts option={incidentMomentumOption} style={{ height: 250, width: '100%' }} />
      </div>

      {/* Crime Type Mix & Repeat Crime Locations (SIDE BY SIDE) */}
      <div className="grid grid-cols-2 gap-6">
        {/* Crime Type Mix (PIE/DONUT CHART) */}
        <div className="bg-card border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-black font-semibold mb-4">Crime Type Distribution (Last 6 Months)</h3>
          <ReactECharts option={crimeTypePieOption} style={{ height: 300, width: '100%' }} />
        </div>

        {/* Repeat Crime Locations (HORIZONTAL BAR CHART) */}
        <div className="bg-card border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-black font-semibold mb-4">Repeat Crime Locations (Last 4 Weeks)</h3>
          <ReactECharts option={repeatCrimeLocationsOption} style={{ height: 300, width: '100%' }} />
        </div>
      </div>

      {/* Active Incidents by Zone */}
      <div className="bg-card border border-gray-200 rounded-xl p-4 shadow-sm">
        <h3 className="text-black font-semibold mb-4">Active Incidents by Zone (Current)</h3>
        <ReactECharts option={activeIncidentsByZoneOption} style={{ height: 250, width: '100%' }} />
      </div>

      {/* Persistent Active Incidents */}
      <div className="bg-card border border-gray-200 rounded-xl p-4 shadow-sm">
        <h3 className="text-black font-semibold mb-4">Persistent Active Incidents (Duration &gt; 10 min)</h3>
        <div className="space-y-3">
          {operatorMetrics.persistentIncidents.map((incident, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3 flex-1">
                <MapPin className="w-5 h-5 text-black/70" />
                <div className="flex-1">
                  <div className="text-black font-medium">{incident.location}</div>
                  <div className="text-xs text-black/60">{incident.type} • Active for {incident.duration}</div>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                incident.severity === 'High' 
                  ? 'bg-red-100 text-red-700 border border-red-200' 
                  : 'bg-amber-100 text-amber-700 border border-amber-200'
              }`}>
                {incident.severity}
              </span>
            </div>
          ))}
        </div>
      </div>

     

      {/* 6️⃣ Conditional System Impact Alert (BANNER - ONLY IF AFFECTS POLICING) */}
      {operatorMetrics.systemImpact.hasImpact && (
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-black font-semibold mb-1">System Impact on Active Incident</h4>
              <p className="text-sm text-black/70">{operatorMetrics.systemImpact.message}</p>
              <p className="text-xs text-black/60 mt-1">Affected: {operatorMetrics.systemImpact.affectedIncident}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// SUPERVISOR ANALYTICS DASHBOARD
// Police-Focused Operational Metrics
// ============================================
function SupervisorAnalytics() {
  // Police-focused synthetic data for supervisor view
  const supervisorMetrics = {
    // Operational Health - Police Focus
    casesPendingReview: 18, // Cases awaiting supervisor approval
    criticalCasesOpen: 3, // Critical cases requiring immediate attention
    patrolResponseTime: '4.2 min', // Average patrol response time
    casesAwaitingApproval: 12, // Cases waiting for supervisor decision
    
    // Case Processing Metrics
    crimeReportsToday: 47, // Total crime reports filed today
    falseAlarmRate: '12%', // Percentage of false alarms vs valid reports
    casesReinvestigation: 5, // Cases requiring re-investigation
    avgCaseReviewTime: '8.5 min', // Average time to review a case
    
    // Officer Workload (Police Officers/Patrol Teams)
    officerWorkload: [
      { name: 'Patrol Team-A', load: 82, cases: 14 },
      { name: 'Patrol Team-B', load: 75, cases: 12 },
      { name: 'Patrol Team-C', load: 68, cases: 10 },
      { name: 'Patrol Team-D', load: 55, cases: 8 },
    ],
    
    // Crime Hotspots (Police-relevant locations)
    crimeHotspots: [
      { location: 'Beach Road Junction', type: 'New', crimes: 24, category: 'Traffic Violations' },
      { location: 'NH-16 Bypass', type: 'Persistent', crimes: 18, category: 'Vehicle Theft' },
      { location: 'Market Square', type: 'New', crimes: 15, category: 'Public Disturbance' },
      { location: 'Railway Station', type: 'Persistent', crimes: 12, category: 'Pickpocketing' },
    ],
    
    // Response Time by Shift (Police shifts)
    responseTimeByShift: [
      { shift: 'Morning (6AM-2PM)', time: '3.8 min', cases: 18 },
      { shift: 'Afternoon (2PM-10PM)', time: '4.5 min', cases: 22 },
      { shift: 'Night (10PM-6AM)', time: '5.2 min', cases: 7 },
    ],
    
    // Zone-wise Crime Distribution (Last 7 days)
    zoneCrimeDistribution: [
      { zone: 'North Zone', crimes: 45, trend: '+5%' },
      { zone: 'South Zone', crimes: 38, trend: '-2%' },
      { zone: 'East Zone', crimes: 52, trend: '+12%' },
      { zone: 'West Zone', crimes: 41, trend: '+3%' },
      { zone: 'Central Zone', crimes: 35, trend: '-8%' },
    ],
    
    // Case Status Breakdown
    caseStatusBreakdown: [
      { status: 'Under Investigation', count: 28, color: '#3b82f6' },
      { status: 'Awaiting Approval', count: 18, color: '#f59e0b' },
      { status: 'Closed', count: 142, color: '#10b981' },
      { status: 'Re-escalated', count: 5, color: '#ef4444' },
    ],
    
    // Week-over-week comparison
    weekOverWeekDelta: '+8%',
  };

  const gridColor = isLightTheme() ? '#e5e7eb' : '#1f2937';
  const axisText = isLightTheme() ? '#6b7280' : '#9ca3af';
  const tooltipBg = isLightTheme() ? 'rgba(17,24,39,0.92)' : 'rgba(13,17,23,0.96)';

  // Officer Workload Distribution Chart
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
      borderColor: gridColor,
      textStyle: { color: '#e5e7eb' },
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
        itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] },
        barWidth: 40,
      },
    ],
  };

  // Zone-wise Crime Distribution Chart
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
      borderColor: gridColor,
      textStyle: { color: '#e5e7eb' },
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
          color: (params: any) => {
            const zone = supervisorMetrics.zoneCrimeDistribution[params.dataIndex];
            return zone.trend.startsWith('+') ? '#ef4444' : zone.trend.startsWith('-') ? '#10b981' : '#6b7280';
          },
          borderRadius: [4, 4, 0, 0] 
        },
        barWidth: 40,
      },
    ],
  };

  // Case Status Breakdown Pie Chart
  const caseStatusPieOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: tooltipBg,
      borderColor: gridColor,
      textStyle: { color: '#e5e7eb' },
      formatter: '{b}: {c} ({d}%)',
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '75%'],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: isLightTheme() ? '#ffffff' : '#0d1117', borderWidth: 2 },
        label: {
          show: true,
          color: isLightTheme() ? '#111827' : '#e5e7eb',
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-black text-xl font-semibold">Supervisor Analytics</h2>
        <p className="text-black/60 text-sm mt-1">Operational control and quality metrics</p>
      </div>

      {/* Operational Health Summary - Police Focus */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Cases Pending Review</div>
          <div className="text-2xl font-semibold text-amber-700">{supervisorMetrics.casesPendingReview}</div>
          <div className="text-xs text-black/60 mt-1">Awaiting approval</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Critical Cases Open</div>
          <div className="text-2xl font-semibold text-red-700">{supervisorMetrics.criticalCasesOpen}</div>
          <div className="text-xs text-black/60 mt-1">Require attention</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Patrol Response Time</div>
          <div className="text-2xl font-semibold text-black">{supervisorMetrics.patrolResponseTime}</div>
          <div className="text-xs text-black/60 mt-1">Average</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Cases Awaiting Approval</div>
          <div className="text-2xl font-semibold text-black">{supervisorMetrics.casesAwaitingApproval}</div>
          <div className="text-xs text-black/60 mt-1">Your decision</div>
        </div>
      </div>

      {/* Case Processing Metrics - Police Focus */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Crime Reports Today</div>
          <div className="text-2xl font-semibold text-black">{supervisorMetrics.crimeReportsToday}</div>
          <div className="text-xs text-black/60 mt-1">Total filed</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">False Alarm Rate</div>
          <div className="text-2xl font-semibold text-black">{supervisorMetrics.falseAlarmRate}</div>
          <div className="text-xs text-black/60 mt-1">Invalid reports</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Re-investigation Needed</div>
          <div className="text-2xl font-semibold text-amber-700">{supervisorMetrics.casesReinvestigation}</div>
          <div className="text-xs text-black/60 mt-1">Cases</div>
        </div>
        <div className="bg-card border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="text-xs uppercase tracking-wider mb-1 text-black/60">Avg Case Review Time</div>
          <div className="text-2xl font-semibold text-black">{supervisorMetrics.avgCaseReviewTime}</div>
          <div className="text-xs text-black/60 mt-1">Per case</div>
        </div>
      </div>

      {/* Officer Workload & Crime Hotspots (SIDE BY SIDE) */}
      <div className="grid grid-cols-2 gap-6">
        {/* Officer Workload Distribution */}
        <div className="bg-card border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-black font-semibold mb-4">Patrol Team Workload Distribution</h3>
          <ReactECharts option={officerWorkloadOption} style={{ height: 250, width: '100%' }} />
          <div className="mt-4 grid grid-cols-4 gap-4">
            {supervisorMetrics.officerWorkload.map((team, idx) => (
              <div key={idx} className="text-center">
                <div className="text-sm text-black/60 mb-1">{team.name}</div>
                <div className="text-lg font-semibold text-black">{team.cases} cases</div>
              </div>
            ))}
          </div>
        </div>

        {/* Crime Hotspots */}
        <div className="bg-card border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-black font-semibold mb-4">Crime Hotspots (Last 7 Days)</h3>
          <div className="space-y-3">
            {supervisorMetrics.crimeHotspots.map((hotspot, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3 flex-1">
                  <MapPin className="w-5 h-5 text-black/70" />
                  <div className="flex-1">
                    <div className="text-black font-medium">{hotspot.location}</div>
                    <div className="text-xs text-black/60">{hotspot.crimes} crimes • {hotspot.category}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  hotspot.type === 'New' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'bg-amber-100 text-amber-700 border border-amber-200'
                }`}>
                  {hotspot.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zone-wise Crime Distribution & Case Status Breakdown (SIDE BY SIDE) */}
      <div className="grid grid-cols-2 gap-6">
        {/* Zone-wise Crime Distribution */}
        <div className="bg-card border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-black font-semibold mb-4">Zone-wise Crime Distribution (Last 7 Days)</h3>
          <ReactECharts option={zoneCrimeOption} style={{ height: 300, width: '100%' }} />
        </div>

        {/* Case Status Breakdown */}
        <div className="bg-card border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-black font-semibold mb-4">Case Status Breakdown</h3>
          <ReactECharts option={caseStatusPieOption} style={{ height: 300, width: '100%' }} />
        </div>
      </div>

      {/* Response Time by Shift */}
      <div className="bg-card border border-gray-200 rounded-xl p-4 shadow-sm">
        <h3 className="text-black font-semibold mb-4">Patrol Response Time by Shift</h3>
        <div className="grid grid-cols-3 gap-4">
          {supervisorMetrics.responseTimeByShift.map((shift, idx) => (
            <div key={idx} className="text-center p-4 bg-white border border-gray-200 rounded-lg">
              <div className="text-sm text-black/60 mb-2">{shift.shift}</div>
              <div className="text-2xl font-semibold text-black mb-1">{shift.time}</div>
              <div className="text-xs text-black/60">{shift.cases} cases handled</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// ADMIN ANALYTICS DASHBOARD (System Health)
// ============================================
function AdminAnalytics({ onViewCameraHealth, onViewViolations, onViewAlerts }: { onViewCameraHealth: () => void; onViewViolations: () => void; onViewAlerts?: () => void }) {
  const uptimeData = [
    { day: 'Mon', uptime: 99.2 },
    { day: 'Tue', uptime: 98.8 },
    { day: 'Wed', uptime: 99.5 },
    { day: 'Thu', uptime: 99.1 },
    { day: 'Fri', uptime: 98.9 },
    { day: 'Sat', uptime: 99.3 },
    { day: 'Sun', uptime: 99.6 },
  ];

  const incidentData = [
    { month: 'Jan', incidents: 45 },
    { month: 'Feb', incidents: 52 },
    { month: 'Mar', incidents: 48 },
    { month: 'Apr', incidents: 61 },
    { month: 'May', incidents: 55 },
    { month: 'Jun', incidents: 67 },
  ];

  const violationData = [
    { type: 'Speeding', value: 145 },
    { type: 'Red Light', value: 89 },
    { type: 'Wrong Way', value: 34 },
    { type: 'Parking', value: 67 },
    { type: 'Other', value: 28 },
  ];

  const responseData = [
    { hour: '00:00', time: 4.2 },
    { hour: '04:00', time: 3.8 },
    { hour: '08:00', time: 5.1 },
    { hour: '12:00', time: 6.3 },
    { hour: '16:00', time: 5.7 },
    { hour: '20:00', time: 4.9 },
  ];

  const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

  const gridColor = isLightTheme() ? '#e5e7eb' : '#1f2937';
  const axisText = isLightTheme() ? '#6b7280' : '#9ca3af';
  const tooltipBg = isLightTheme() ? 'rgba(17,24,39,0.92)' : 'rgba(13,17,23,0.96)';

  const uptimeOption = {
    grid: { left: 40, right: 16, top: 18, bottom: 28 },
    xAxis: {
      type: 'category',
      data: uptimeData.map((d) => d.day),
      axisLine: { lineStyle: { color: gridColor } },
      axisLabel: { color: axisText },
    },
    yAxis: {
      type: 'value',
      min: 98,
      max: 100,
      axisLine: { lineStyle: { color: gridColor } },
      splitLine: { lineStyle: { color: gridColor, type: 'dashed', opacity: 0.8 } },
      axisLabel: { color: axisText },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: tooltipBg,
      borderColor: gridColor,
      textStyle: { color: '#e5e7eb' },
    },
    series: [
      {
        type: 'line',
        data: uptimeData.map((d) => d.uptime),
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 3, color: '#06b6d4' },
        itemStyle: { color: '#06b6d4' },
        areaStyle: { color: 'rgba(6,182,212,0.12)' },
      },
    ],
  };

  const incidentOption = {
    grid: { left: 40, right: 16, top: 18, bottom: 28 },
    xAxis: {
      type: 'category',
      data: incidentData.map((d) => d.month),
      axisLine: { lineStyle: { color: gridColor } },
      axisLabel: { color: axisText },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: gridColor } },
      splitLine: { lineStyle: { color: gridColor, type: 'dashed', opacity: 0.8 } },
      axisLabel: { color: axisText },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: tooltipBg,
      borderColor: gridColor,
      textStyle: { color: '#e5e7eb' },
    },
    series: [
      {
        type: 'bar',
        data: incidentData.map((d) => d.incidents),
        itemStyle: { color: '#8b5cf6', borderRadius: [8, 8, 2, 2] },
        barWidth: 34,
      },
    ],
  };

  const violationOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: tooltipBg,
      borderColor: gridColor,
      textStyle: { color: '#e5e7eb' },
    },
    series: [
      {
        type: 'pie',
        radius: ['58%', '82%'],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: isLightTheme() ? '#ffffff' : '#0d1117', borderWidth: 2 },
        label: { show: false },
        emphasis: { scale: true, scaleSize: 6 },
        data: violationData.map((v, idx) => ({
          name: v.type,
          value: v.value,
          itemStyle: { color: COLORS[idx % COLORS.length] },
        })),
      },
    ],
  };

  const responseOption = {
    grid: { left: 46, right: 16, top: 18, bottom: 28 },
    xAxis: {
      type: 'category',
      data: responseData.map((d) => d.hour),
      axisLine: { lineStyle: { color: gridColor } },
      axisLabel: { color: axisText },
    },
    yAxis: {
      type: 'value',
      name: 'Minutes',
      nameTextStyle: { color: axisText, padding: [0, 0, 0, 10] },
      axisLine: { lineStyle: { color: gridColor } },
      splitLine: { lineStyle: { color: gridColor, type: 'dashed', opacity: 0.8 } },
      axisLabel: { color: axisText },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: tooltipBg,
      borderColor: gridColor,
      textStyle: { color: '#e5e7eb' },
    },
    series: [
      {
        type: 'line',
        data: responseData.map((d) => d.time),
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { width: 3, color: '#10b981' },
        itemStyle: { color: '#10b981' },
        areaStyle: { color: 'rgba(16,185,129,0.10)' },
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-black text-xl font-semibold">System Analytics</h2>
        <p className="text-black/60 text-sm mt-1">System health, performance, and technical metrics</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-500" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm text-black/60 mb-1">Avg Camera Uptime</p>
          <p className="text-2xl font-semibold text-black">99.2%</p>
        </div>

        <div className="bg-card border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <TrendingUp className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-sm text-black/60 mb-1">Total Incidents</p>
          <p className="text-2xl font-semibold text-black">328</p>
        </div>

        <div className="bg-card border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-emerald-500" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm text-black/60 mb-1">Avg Response Time</p>
          <p className="text-2xl font-semibold text-black">5.2m</p>
        </div>

        <div className="bg-card border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-500" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm text-black/60 mb-1">AI Accuracy</p>
          <p className="text-2xl font-semibold text-black">91.8%</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={onViewCameraHealth}
          className="bg-card border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between group"
        >
          <div>
            <p className="text-xs uppercase tracking-wide text-emerald-500 mb-1">Camera Health</p>
            <h3 className="text-lg font-semibold text-black mb-1">View detailed camera uptime & status</h3>
            <p className="text-sm text-black/60">Zone-wise availability, offline trends, and health insights.</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20">
            <Activity className="w-6 h-6 text-emerald-500" />
          </div>
        </button>

        <button
          type="button"
          onClick={onViewViolations}
          className="bg-card border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between group"
        >
          <div>
            <p className="text-xs uppercase tracking-wide text-purple-500 mb-1">Violation Trends</p>
            <h3 className="text-lg font-semibold text-black mb-1">Explore ANPR & anomaly trend analytics</h3>
            <p className="text-sm text-black/60">Pattern analysis by time, type, and hotspot locations.</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20">
            <BarChart3 className="w-6 h-6 text-purple-500" />
          </div>
        </button>
      </div>

      {/* AI Analytics and Alert Trends Cards */}
      {onViewAlerts && (
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={onViewAlerts}
            className="bg-card border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between group"
          >
            <div>
              <p className="text-xs uppercase tracking-wide text-purple-500 mb-1">AI Analytics</p>
              <h3 className="text-lg font-semibold text-black mb-1">Performance metrics and patterns</h3>
              <p className="text-sm text-black/60">AI reasoning patterns, engine health, and performance metrics.</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
          </button>

          <button
            type="button"
            onClick={onViewAlerts}
            className="bg-card border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-left flex items-center justify-between group"
          >
            <div>
              <p className="text-xs uppercase tracking-wide text-purple-500 mb-1">Alert Trends</p>
              <h3 className="text-lg font-semibold text-black mb-1">Analytics and patterns</h3>
              <p className="text-sm text-black/60">View insights into alert trends and anomaly detection patterns.</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
          </button>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-black font-semibold">Camera Uptime (7 Days)</h3>
            <button onClick={onViewCameraHealth} className="text-xs text-cyan-500 hover:text-cyan-600">
              View Details →
            </button>
          </div>
          <div className="p-6">
            <ReactECharts option={uptimeOption} style={{ height: 250, width: '100%' }} />
          </div>
        </div>

        <div className="bg-card border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-black font-semibold">Incident Trends (6 Months)</h3>
          </div>
          <div className="p-6">
            <ReactECharts option={incidentOption} style={{ height: 250, width: '100%' }} />
          </div>
        </div>

        <div className="bg-card border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-black font-semibold">Violation Distribution</h3>
            <button onClick={onViewViolations} className="text-xs text-cyan-500 hover:text-cyan-600">
              View Details →
            </button>
          </div>
          <div className="p-6 flex items-center">
            <div className="w-1/2">
              <ReactECharts option={violationOption} style={{ height: 250, width: '100%' }} />
            </div>
            <div className="flex-1 space-y-2">
              {violationData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                    <span className="text-black/70">{item.type}</span>
                  </div>
                  <span className="text-black font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-black font-semibold">Response Times (24h)</h3>
          </div>
          <div className="p-6">
            <ReactECharts option={responseOption} style={{ height: 250, width: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export function AnalyticsHome({ userRole, onViewCameraHealth, onViewViolations, onViewAlerts }: AnalyticsHomeProps) {
  // Render persona-specific view
  if (userRole === 'operator') {
    return <OperatorAnalytics />;
  } else if (userRole === 'supervisor') {
    return <SupervisorAnalytics />;
  } else {
    return <AdminAnalytics onViewCameraHealth={onViewCameraHealth} onViewViolations={onViewViolations} onViewAlerts={onViewAlerts} />;
  }
}
