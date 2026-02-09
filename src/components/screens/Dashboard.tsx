import { MetricCard } from '../MetricCard';
import { Camera, CameraOff, AlertTriangle, Car, FileX, AlertCircle, MapPin } from 'lucide-react';
import { useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { fetchActivityHeatmapPoints, type ActivityPoint } from '../../api/cohorts';
import LeafletHeatmap from '../LeafletHeatmap';
import { useNavigate } from 'react-router-dom';




interface DashboardProps {
  userRole: 'operator' | 'supervisor' | 'admin';
}

export function Dashboard({ userRole }: DashboardProps) {
  const navigate = useNavigate();
  const alerts = [
    { id: 1, type: 'Intrusion', camera: 'CAM-NZ-042', confidence: 94, time: '2 min ago', severity: 'high' },
    { id: 2, type: 'Crowd Detected', camera: 'CAM-SZ-018', confidence: 87, time: '5 min ago', severity: 'medium' },
    { id: 3, type: 'Vehicle Loitering', camera: 'CAM-EZ-031', confidence: 91, time: '8 min ago', severity: 'medium' },
    { id: 4, type: 'Abandoned Object', camera: 'CAM-CZ-007', confidence: 88, time: '12 min ago', severity: 'high' },
    { id: 5, type: 'Perimeter Breach', camera: 'CAM-WZ-055', confidence: 96, time: '15 min ago', severity: 'high' },
  ];

  const events = [
    { id: 1, type: 'Incident Created', desc: 'Traffic accident - NH-16', time: '10:23 AM', icon: AlertCircle },
    { id: 2, type: 'Evidence Added', desc: 'CAM-042 snapshot tagged', time: '10:18 AM', icon: Camera },
    { id: 3, type: 'ANPR Match', desc: 'Stolen vehicle detected', time: '10:12 AM', icon: Car },
    { id: 4, type: 'SOP Deviation', desc: 'Officer patrol delay', time: '10:05 AM', icon: FileX },
  ];

  // const cameraStatus = [
  //   { zone: 'North Zone', total: 48, online: 45, offline: 2, degraded: 1 },
  //   { zone: 'South Zone', total: 52, online: 50, offline: 1, degraded: 1 },
  //   { zone: 'East Zone', total: 38, online: 36, offline: 2, degraded: 0 },
  //   { zone: 'West Zone', total: 44, online: 42, offline: 1, degraded: 1 },
  //   { zone: 'Central Zone', total: 36, online: 35, offline: 0, degraded: 1 },
  // ];

  const [offlineCameras, setOfflineCameras] = useState(0);
  const token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI3Ny1NUVdFRTNHZE5adGlsWU5IYmpsa2dVSkpaWUJWVmN1UmFZdHl5ejFjIn0.eyJleHAiOjE3MjYxODIzMzEsImlhdCI6MTcyNjE0NjMzMSwianRpIjoiOGVlZTU1MDctNGVlOC00NjE1LTg3OWUtNTVkMjViMjQ2MGFmIiwiaXNzIjoiaHR0cDovL2tleWNsb2FrLmtleWNsb2FrLnN2Yy5jbHVzdGVyLmxvY2FsOjgwODAvcmVhbG1zL21hc3RlciIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJmNzFmMzU5My1hNjdhLTQwYmMtYTExYS05YTQ0NjY4YjQxMGQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJIT0xBQ1JBQ1kiLCJzZXNzaW9uX3N0YXRlIjoiYmI1ZjJkMzktYTQ3ZC00MjI0LWFjZGMtZTdmNzQwNDc2OTgwIiwibmFtZSI6ImtzYW14cCBrc2FteHAiLCJnaXZlbl9uYW1lIjoia3NhbXhwIiwiZmFtaWx5X25hbWUiOiJrc2FteHAiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJwYXNzd29yZF90ZW5hbnRfa3NhbXhwQG1vYml1c2R0YWFzLmFpIiwiZW1haWwiOiJwYXNzd29yZF90ZW5hbnRfa3NhbXhwQG1vYml1c2R0YWFzLmFpIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiLyoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtbWFzdGVyIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7IkhPTEFDUkFDWSI6eyJyb2xlcyI6WyJIT0xBQ1JBQ1lfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwic2lkIjoiYmI1ZjJkMzktYTQ3ZC00MjI0LWFjZGMtZTdmNzQwNDc2OTgwIiwidGVuYW50SWQiOiJmNzFmMzU5My1hNjdhLTQwYmMtYTExYS05YTQ0NjY4YjQxMGQiLCJyZXF1ZXN0ZXJUeXBlIjoiVEVOQU5UIn0=.FXeDyHBhlG9L4_NCeSyHEaNEBVmhFpfSBqlcbhHaPaoydhKcA0BfuyHgxg_32kQk6z5S9IQ7nVKS2ybtOvwo0WyLWwLQchSq7Noa7LooHIMzmeWMQb_bLKtbaOti59zwIdS8CkfGaXut7RUQKISQVWmbUGsVJQa2JkG6Ng_QN0y5hFVksMWPZiXVsofQkJXHXV1CQ3gabhhHKo3BqlJwzpsCKLDfg1-4PmSl1Wqbw03Ef2yolroj5i8FoeHukOQPkwCUHrrNw-ilIp917nqZa89YbCMtDjWyaj8pEH7GJR5vMZPE2WcJPn5dSA1IHVunfatEB1cDAitaFjVNWNnddQ";

  // --- GIS Heatmap (from cohorts adhoc query) ---
  const [heatPoints, setHeatPoints] = useState<ActivityPoint[]>([]);
  const [heatLoading, setHeatLoading] = useState(false);
  const [heatError, setHeatError] = useState<string | null>(null);
  const [heatLastUpdated, setHeatLastUpdated] = useState<Date | null>(null);
  const [zoneFilter, setZoneFilter] = useState<string>('ALL');
  const [hoveredPoint, setHoveredPoint] = useState<ActivityPoint | null>(null);

  // Load heatmap automatically on mount (page load/login) to ensure it displays correctly
  useEffect(() => {
    async function loadHeatmap() {
      setHeatLoading(true);
      setHeatError(null);
      try {
        const res = await fetchActivityHeatmapPoints();
        setHeatPoints(Array.isArray(res.data) ? res.data : []);
        setHeatLastUpdated(new Date());
      } catch (e) {
        setHeatError(e instanceof Error ? e.message : 'Failed to load heatmap data');
      } finally {
        setHeatLoading(false);
      }
    }
    loadHeatmap();
  }, []);

  const loadHeatmap = async () => {
    setHeatLoading(true);
    setHeatError(null);
    try {
      const res = await fetchActivityHeatmapPoints();
      setHeatPoints(Array.isArray(res.data) ? res.data : []);
      setHeatLastUpdated(new Date());
    } catch (e) {
      setHeatError(e instanceof Error ? e.message : 'Failed to load heatmap data');
    } finally {
      setHeatLoading(false);
    }
  };

  const zones = useMemo(() => {
    const unique = Array.from(new Set(heatPoints.map(p => p.zone).filter(Boolean))).sort();
    return ['ALL', ...unique];
  }, [heatPoints]);

  const filteredHeatPoints = useMemo(() => {
    return zoneFilter === 'ALL' ? heatPoints : heatPoints.filter(p => p.zone === zoneFilter);
  }, [heatPoints, zoneFilter]);
  useEffect(() => {
    async function fetchOfflineCameras() {
      try {
        const payload = {
          type: "TIDB",
          definition: "SELECT COUNT(*) AS offline_cameras FROM t_69293dd7fd9c66658f22d6a7_t WHERE status = 'OFFLINE';"
        };

        const response = await fetch(
          "https://ig.gov-cloud.ai/pi-cohorts-service-dbaas/v1.0/cohorts/adhoc",
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
              "x-tenant-id": "f71f3593-a67a-40bc-a11a-9a44668b410d",
              "x-user-id": "f71f3593-a67a-40bc-a11a-9a44668b410d",
              "x-requester-type": "TENANT"
            },
            body: JSON.stringify(payload)
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const count = data?.data?.[0]?.offline_cameras || 0;
        setOfflineCameras(count);


      } catch (err) {
        console.error(err);
      }
    }

    fetchOfflineCameras();
  }, []);


  const [activeCameras, setActiveCameras] = useState(0);
  useEffect(() => {
    async function fetchActiveCameras() {
      try {
        const response = await fetch(
          "https://ig.gov-cloud.ai/pi-cohorts-service-dbaas/v1.0/cohorts/adhoc?size=2000",
          {
            method: "POST",  // <-- POST because you are sending a payload
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "TIDB",
              definition: "SELECT COUNT(*) AS active_cameras FROM t_69293dd7fd9c66658f22d6a7_t WHERE status = 'ONLINE';"
            })
          }
        );

        const data = await response.json();
        const count = data?.data?.[0]?.active_cameras || 0;
        setActiveCameras(count);

      } catch (err) {
        console.error("API Error:", err);
      }
    }

    fetchActiveCameras();
  }, []);




  const [recentEvents, setRecentEvents] = useState([]);
  useEffect(() => {
    async function fetchRecentEvents() {
      try {
        const response = await fetch(
          "https://ig.gov-cloud.ai/pi-cohorts-service-dbaas/v1.0/cohorts/adhoc?size=2000",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "TIDB",
              definition:
                "SELECT incident_id AS event_id, camera_id, violation_type AS event_type, timestamp FROM t_6928433fb9bad705b353b2db_t UNION ALL SELECT incident_id AS event_id, camera_id, violation_type AS event_type, timestamp FROM t_69284385b9bad705b353b2de_t ORDER BY timestamp DESC LIMIT 50;",
            }),
          }
        );

        const data = await response.json();
        const list = data?.data || [];

        const formatted = list.map((item) => ({
          id: item.event_id,
          type: item.event_type,
          desc: `Camera ID: ${item.camera_id}`,
          time: new Date(item.timestamp).toLocaleString(),
          icon: Bell, // CHANGE THIS IF YOU WANT DIFFERENT ICONS
        }));

        setRecentEvents(formatted);

      } catch (err) {
        console.error("API Error (Recent Events):", err);
      }
    }

    fetchRecentEvents();
  }, []);



  const [cameraStatus, setCameraStatus] = useState([]);

  useEffect(() => {
    async function fetchCameraStatus() {
      try {
        const response = await fetch(
          "https://ig.gov-cloud.ai/pi-cohorts-service-dbaas/v1.0/cohorts/adhoc",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "TIDB",
              definition:
                "SELECT zone, SUM(status = 'ONLINE') AS online_count, SUM(status = 'OFFLINE') AS offline_count, SUM(status = 'DEGRADED') AS degraded_count FROM t_69293dd7fd9c66658f22d6a7_t GROUP BY zone;",
            }),
          }
        );

        const data = await response.json();
        console.log("📌 FULL Camera Status Response:", data);

        setCameraStatus(data.data || []);
      } catch (err) {
        console.error("Camera Status API Error:", err);
      }
    }

    fetchCameraStatus();
  }, [token]);




  const [Alerts, setAlerts] = useState([]);
  useEffect(() => {
    async function fetchAnomalyAlerts() {
      try {
        const response = await fetch(
          "https://ig.gov-cloud.ai/pi-cohorts-service-dbaas/v1.0/cohorts/adhoc?size=2000",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "TIDB",
              definition:
                "(SELECT t.incident_id AS event_id,t.camera_id,t.violation_type AS anomaly_type,t.timestamp,cs.zone,t.anpr_confidence AS confidence FROM t_6928433fb9bad705b353b2db_t t LEFT JOIN t_69293dd7fd9c66658f22d6a7_t cs ON t.camera_id=cs.camera_id WHERE t.overspeed=TRUE OR t.wrong_way=TRUE OR t.helmet_violation=TRUE) UNION ALL (SELECT w.incident_id AS event_id,w.camera_id,w.violation_type AS anomaly_type,w.timestamp,cs.zone,JSON_EXTRACT(w.meta,'$.confidence') AS confidence FROM t_69284385b9bad705b353b2de_t w LEFT JOIN t_69293dd7fd9c66658f22d6a7_t cs ON w.camera_id=cs.camera_id WHERE w.weapon_detected=TRUE OR w.fight_detected=TRUE) UNION ALL (SELECT c.incident_id AS event_id,c.camera_id,'Crowd Detected' AS anomaly_type,c.timestamp,cs.zone,c.confidence FROM t_69294a59fd9c66658f22d6af_t c LEFT JOIN t_69293dd7fd9c66658f22d6a7_t cs ON c.camera_id=cs.camera_id) UNION ALL (SELECT CONCAT('CAM_EVT_',cs.camera_id) AS event_id,cs.camera_id,CASE WHEN cs.status='OFFLINE' THEN 'Camera Offline' WHEN cs.status='DEGRADED' THEN 'Camera Degraded' END AS anomaly_type,cs.last_heartbeat AS timestamp,cs.zone,NULL AS confidence FROM t_69293dd7fd9c66658f22d6a7_t cs WHERE cs.status IN ('OFFLINE','DEGRADED')) ORDER BY timestamp DESC LIMIT 20;"
            }),
          }
        );

        const data = await response.json();
        const raw = data?.data || [];

        const formatted = raw.map((item) => ({
          id: item.event_id,
          type: item.anomaly_type,
          severity:
            item.anomaly_type === "Camera Offline" ||
              item.anomaly_type === "Weapon Detected" ||
              item.anomaly_type === "Fight Detected"
              ? "high"
              : "medium",
          camera: `Camera ${item.camera_id} • ${item.zone || "Unknown Zone"}`,
          time: new Date(item.timestamp).toLocaleString(),
          confidence: item.confidence ? Number(item.confidence) : 0,
        }));

        setAlerts(formatted);

      } catch (err) {
        console.error("API Error (Anomaly Alerts):", err);
      }
    }

    fetchAnomalyAlerts();
  }, []);





  return (
    <div className="p-6 space-y-6 w-full">
      {/* Role Banner */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white mb-1">
              {userRole === 'operator' && 'Control Room Operator Dashboard'}
              {userRole === 'supervisor' && 'Supervisor Dashboard'}
              {userRole === 'admin' && 'System Administrator Dashboard'}
            </h2>
            <p className="text-sm text-gray-400">
              {userRole === 'operator' && 'Monitor feeds, validate alerts, and flag incidents for supervisor review'}
              {userRole === 'supervisor' && 'Review escalated cases, approve evidence, and make operational decisions'}
              {userRole === 'admin' && 'System health, device management, and configuration oversight'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {userRole === 'operator' && (
              <>
                <button
                  onClick={() => navigate('/surveillance/live-grid')}
                  className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 text-sm"
                >
                  View Camera Grid
                </button>
                <button className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded hover:bg-orange-500/30 text-sm">
                  Active Alerts ({alerts.length})
                </button>
              </>
            )}
            {userRole === 'supervisor' && (
              <>
                <button
                  onClick={() => navigate('/anpr/supervisor-queue')}
                  className="px-4 py-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 text-sm"
                >
                  Approval Queue
                </button>
                <button
                  onClick={() => navigate('/evidence')}
                  className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30 text-sm"
                >
                  Evidence Console
                </button>
              </>
            )}
            {userRole === 'admin' && (
              <>
                <button
                  onClick={() => navigate('/admin/system-health')}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 text-sm"
                >
                  System Health
                </button>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30 text-sm"
                >
                  Manage Users
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-5 gap-3">
        {/* <MetricCard
          label="Active Cameras"
          value="208"
          icon={Camera}
          status="success"
          trend={{ value: '98.2%', positive: true }}
        /> */}

        <MetricCard
          label="Active Cameras"
          value={activeCameras.toString()}
          icon={Camera}
          status="success"
          trend={{ value: '98.2%', positive: true }}
        />


        {/* <MetricCard
          label="Offline Cameras"
          value="6"
          icon={CameraOff}
          status="warning"
        /> */}

        <MetricCard
          label="Offline Cameras"
          value={offlineCameras.toString()}
          icon={CameraOff}
          status="warning"
        />

        {/* <MetricCard
          label="Active Alerts"
          value="24"
          icon={AlertTriangle}
          status="danger"
        /> */}
         <MetricCard
          label="Traffic Violations"
          value="87"
          icon={Car}
          status="warning"
        />

        <MetricCard
          label="Total Incidents"
          value="8"
          icon={FileX}
          status="warning"
        />

        <MetricCard
          label="Active Incidents"
          value="3"
          icon={AlertCircle}
          status="danger"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* GIS Heatmap */}
        <div className="col-span-2 bg-card border border-border rounded-lg overflow-hidden card-shadow">
          <div className="p-4 border-b border-[#1f2937] flex items-center justify-between">
            <h3 className="text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              GIS Heatmap - Live Activity
            </h3>
            <div className="flex items-center gap-2">
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="px-2 py-1 bg-[#0a0e1a] border border-[#1f2937] rounded text-xs text-gray-300 outline-none"
              >
                {zones.map((z) => (
                  <option key={z} value={z}>
                    {z === 'ALL' ? 'All Zones' : z}
                  </option>
                ))}
              </select>
              <button
                onClick={loadHeatmap}
                disabled={heatLoading}
                className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded text-xs hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {heatLoading ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>
          </div>
          <div className="relative bg-[#0a0e1a] h-[500px]">
            <LeafletHeatmap
              points={filteredHeatPoints}
              onPointHover={(p) => setHoveredPoint(p)}
              className="absolute inset-0"
            />

            {/* Loading / error overlay (map stays visible) */}
            {(heatError || (heatLoading && filteredHeatPoints.length === 0)) && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0a0e1a]/60 backdrop-blur-[2px]">
                <div className="text-center px-6">
                  {heatError ? (
                    <>
                      <MapPin className="w-14 h-14 text-red-400 mx-auto mb-3 opacity-60" />
                      <p className="text-red-300 text-sm">Heatmap load failed</p>
                      <p className="text-xs text-gray-500 mt-1 max-w-md">{heatError}</p>
                      <p className="text-[11px] text-gray-600 mt-3 max-w-md">
                        Tip: set <span className="text-gray-400">VITE_COHORTS_TOKEN</span> (and optionally tenant/user headers) in your Vite env.
                      </p>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-50" />
                      <p className="text-gray-500">Loading heatmap…</p>
                      <p className="text-xs text-gray-600 mt-1">Fetching live activity points</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Hover tooltip */}
            {hoveredPoint && !heatError && (
              <div className="absolute top-4 right-4 z-20 w-72 bg-[#0d1117] border border-[#1f2937] rounded-lg p-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white">{hoveredPoint.camera_id}</div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded ${hoveredPoint.activity_level === 'HIGH'
                      ? 'bg-red-500/20 text-red-300'
                      : hoveredPoint.activity_level === 'MEDIUM'
                        ? 'bg-orange-500/20 text-orange-300'
                        : 'bg-yellow-500/20 text-yellow-200'
                      }`}
                  >
                    {hoveredPoint.activity_level}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  <div>Zone: <span className="text-gray-300">{hoveredPoint.zone}</span></div>
                  <div className="mt-1">
                    Lat/Lon:{' '}
                    <span className="text-gray-300">
                      {hoveredPoint.latitude.toFixed(6)}, {hoveredPoint.longitude.toFixed(6)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-3 bg-[#0a0e1a] border-t border-[#1f2937] flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-400">High Activity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-gray-400">Medium Activity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-400">Low Activity</span>
              </div>
            </div>
            <span className="text-gray-500">
              Last updated:{' '}
              {heatLastUpdated ? heatLastUpdated.toLocaleTimeString() : '—'}
            </span>
          </div>
        </div>

        {/* Anomaly Alerts */}
        <div className="bg-[#0d1117] border border-[#1f2937] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#1f2937]">
            <h3 className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Traffic Violations
            </h3>
          </div>
          <div className="overflow-y-auto max-h-[500px]">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 border-b border-[#1f2937] hover:bg-white/5 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-sm ${alert.severity === 'high' ? 'text-red-400' : 'text-orange-400'
                    }`}>
                    {alert.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${alert.severity === 'high'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-orange-500/20 text-orange-400'
                    }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{alert.camera}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{alert.time}</span>
                  <span className="text-cyan-400">{alert.confidence}% conf.</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Events Overview */}
        <div className="bg-[#0d1117] border border-[#1f2937] rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#1f2937] flex-shrink-0">
            <h3 className="text-white">Incident Report</h3>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto max-h-[400px] flex-1">
            {recentEvents.map((event) => {
              const Icon = event.icon;
              return (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 bg-[#0a0e1a] rounded-lg"
                >
                  <div className="p-2 bg-cyan-500/10 rounded">
                    <Icon className="w-4 h-4 text-cyan-400" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-white">{event.type}</p>
                    <p className="text-xs text-gray-500">{event.desc}</p>
                  </div>

                  <span className="text-xs text-gray-500">{event.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Camera Status Summary */}
        <div className="bg-[#0d1117] border border-[#1f2937] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#1f2937]">
            <h3 className="text-white">Camera Status by Zone</h3>
          </div>

          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-[#1f2937]">
                  <th className="text-left pb-3">Zone</th>
                  <th className="text-center pb-3">Total</th>
                  <th className="text-center pb-3">Online</th>
                  <th className="text-center pb-3">Offline</th>
                  <th className="text-center pb-3">Degraded</th>
                </tr>
              </thead>

              <tbody>
                {cameraStatus.map((zone) => (
                  <tr key={zone.zone} className="border-b border-[#1f2937]/50">
                    <td className="py-3 text-gray-300">{zone.zone}</td>

                    <td className="text-center text-gray-400">
                      {(zone.online_count || 0) +
                        (zone.offline_count || 0) +
                        (zone.degraded_count || 0)}
                    </td>

                    <td className="text-center text-green-400">{zone.online_count}</td>
                    <td className="text-center text-red-400">{zone.offline_count}</td>
                    <td className="text-center text-yellow-400">{zone.degraded_count}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </div>
  );
}