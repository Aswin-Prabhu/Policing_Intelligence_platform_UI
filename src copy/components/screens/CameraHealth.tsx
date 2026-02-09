import { ArrowLeft, Camera, TrendingUp, TrendingDown } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

function isLightTheme() {
  return document?.documentElement?.dataset?.theme === 'light';
}

interface CameraHealthProps {
  onBack: () => void;
}

export function CameraHealth({ onBack }: CameraHealthProps) {
  const statusData = [
    { name: 'Online', value: 208, color: '#10b981' },
    { name: 'Degraded', value: 4, color: '#f59e0b' },
    { name: 'Offline', value: 6, color: '#ef4444' },
  ];

  const offlineDuration = [
    { camera: 'CAM-NZ-042', hours: 12.5 },
    { camera: 'CAM-SZ-018', hours: 8.2 },
    { camera: 'CAM-EZ-031', hours: 6.8 },
    { camera: 'CAM-CZ-007', hours: 4.1 },
    { camera: 'CAM-WZ-055', hours: 2.3 },
    { camera: 'CAM-NZ-023', hours: 1.8 },
  ];

  const uptimeTrend = [
    { week: 'Week 1', uptime: 98.5 },
    { week: 'Week 2', uptime: 99.1 },
    { week: 'Week 3', uptime: 98.8 },
    { week: 'Week 4', uptime: 99.2 },
  ];

  const cameraList = [
    { id: 'CAM-NZ-042', zone: 'North Zone', health: 85, uptime: 98.2, status: 'degraded' },
    { id: 'CAM-SZ-018', zone: 'South Zone', health: 95, uptime: 99.5, status: 'online' },
    { id: 'CAM-EZ-031', zone: 'East Zone', health: 92, uptime: 99.1, status: 'online' },
    { id: 'CAM-CZ-007', zone: 'Central Zone', health: 45, uptime: 87.3, status: 'offline' },
    { id: 'CAM-WZ-055', zone: 'West Zone', health: 98, uptime: 99.8, status: 'online' },
    { id: 'CAM-NZ-023', zone: 'North Zone', health: 88, uptime: 98.9, status: 'online' },
  ];

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-400';
    if (health >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500/20 text-green-400';
      case 'degraded': return 'bg-yellow-500/20 text-yellow-400';
      case 'offline': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const gridColor = isLightTheme() ? '#e5e7eb' : '#1f2937';
  const axisText = isLightTheme() ? '#6b7280' : '#9ca3af';
  const tooltipBg = isLightTheme() ? 'rgba(17,24,39,0.92)' : 'rgba(13,17,23,0.96)';

  const statusOption = {
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
        label: { show: false },
        labelLine: { show: false },
        itemStyle: { borderColor: isLightTheme() ? '#ffffff' : '#0d1117', borderWidth: 2 },
        data: statusData.map((s) => ({ name: s.name, value: s.value, itemStyle: { color: s.color } })),
      },
    ],
  };

  const uptimeOption = {
    grid: { left: 46, right: 16, top: 18, bottom: 30 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: tooltipBg,
      borderColor: gridColor,
      textStyle: { color: '#e5e7eb' },
    },
    xAxis: {
      type: 'category',
      data: uptimeTrend.map((d) => d.week),
      axisLine: { lineStyle: { color: gridColor } },
      axisLabel: { color: axisText },
    },
    yAxis: {
      type: 'value',
      min: 97,
      max: 100,
      axisLine: { lineStyle: { color: gridColor } },
      splitLine: { lineStyle: { color: gridColor, type: 'dashed', opacity: 0.8 } },
      axisLabel: { color: axisText },
    },
    series: [
      {
        type: 'line',
        data: uptimeTrend.map((d) => d.uptime),
        smooth: true,
        symbol: 'circle',
        symbolSize: 9,
        lineStyle: { width: 3, color: '#06b6d4' },
        itemStyle: { color: '#06b6d4' },
        areaStyle: { color: 'rgba(6,182,212,0.10)' },
      },
    ],
  };

  const offlineOption = {
    grid: { left: 58, right: 16, top: 18, bottom: 40 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: tooltipBg,
      borderColor: gridColor,
      textStyle: { color: '#e5e7eb' },
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params;
        const name = p?.axisValue ?? '';
        const val = p?.data ?? 0;
        return `${name}<br/>hours : <b>${val}</b>`;
      },
    },
    xAxis: {
      type: 'category',
      data: offlineDuration.map((d) => d.camera),
      axisLine: { lineStyle: { color: gridColor } },
      axisLabel: { color: axisText, interval: 0, rotate: 22 },
    },
    yAxis: {
      type: 'value',
      name: 'Hours',
      nameTextStyle: { color: axisText },
      axisLine: { lineStyle: { color: gridColor } },
      splitLine: { lineStyle: { color: gridColor, type: 'dashed', opacity: 0.8 } },
      axisLabel: { color: axisText },
    },
    series: [
      {
        type: 'bar',
        data: offlineDuration.map((d) => d.hours),
        itemStyle: { color: '#ef4444', borderRadius: [8, 8, 2, 2] },
        barWidth: 30,
      },
    ],
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Analytics
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Status Distribution */}
        <div className="bg-[#0d1117] border border-[#1f2937] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#1f2937]">
            <h3 className="text-white">Camera Status</h3>
          </div>
          <div className="p-6 flex items-center justify-center">
            <ReactECharts option={statusOption} style={{ width: '100%', height: 200 }} />
          </div>
          <div className="p-4 space-y-2 border-t border-[#1f2937]">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-400">{item.name}</span>
                </div>
                <span className="text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Uptime Trend */}
        <div className="col-span-2 bg-[#0d1117] border border-[#1f2937] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#1f2937]">
            <h3 className="text-white">Uptime Trend (4 Weeks)</h3>
          </div>
          <div className="p-6">
            <ReactECharts option={uptimeOption} style={{ width: '100%', height: 200 }} />
          </div>
        </div>
      </div>

      {/* Offline Duration */}
      <div className="bg-[#0d1117] border border-[#1f2937] rounded-lg overflow-hidden mb-6">
        <div className="p-4 border-b border-[#1f2937]">
          <h3 className="text-white">Offline Duration (Last 30 Days)</h3>
        </div>
        <div className="p-6">
          <ReactECharts option={offlineOption} style={{ width: '100%', height: 250 }} />
        </div>
      </div>

      {/* Camera Health List */}
      <div className="bg-[#0d1117] border border-[#1f2937] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#1f2937]">
          <h3 className="text-white">Camera Health Details</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1f2937]">
              <th className="text-left p-4 text-xs text-gray-500 uppercase">Camera ID</th>
              <th className="text-left p-4 text-xs text-gray-500 uppercase">Zone</th>
              <th className="text-center p-4 text-xs text-gray-500 uppercase">Health Score</th>
              <th className="text-center p-4 text-xs text-gray-500 uppercase">Uptime</th>
              <th className="text-center p-4 text-xs text-gray-500 uppercase">Status</th>
              <th className="text-center p-4 text-xs text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cameraList.map((camera) => (
              <tr key={camera.id} className="border-b border-[#1f2937] hover:bg-white/5">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-cyan-400" />
                    <span className="text-white text-sm">{camera.id}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-gray-400 text-sm">{camera.zone}</span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className={`text-lg ${getHealthColor(camera.health)}`}>{camera.health}</span>
                    {camera.health >= 90 ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : camera.health < 70 ? (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    ) : null}
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="text-white text-sm">{camera.uptime}%</span>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded text-xs uppercase ${getStatusColor(camera.status)}`}>
                    {camera.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 text-xs">
                    Diagnose
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
