import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { LoadingScreen } from './components/LoadingScreen';

// screens…
import { Dashboard } from './components/screens/Dashboard';
import { LiveGrid, Camera } from './components/screens/LiveGrid';
import { MultiGrid } from './components/screens/MultiGrid';
import { CameraDetail } from './components/screens/CameraDetail';
import { BodycamGrid } from './components/screens/BodycamGrid';
import { BodycamDetail } from './components/screens/BodycamDetail';
import { ANPRHome } from './components/screens/ANPRHome';
import { ANPRList } from './components/screens/ANPRList';
import { ANPRDetail } from './components/screens/ANPRDetail';
import { ANPRApproval } from './components/screens/ANPRApproval';
import { ANPROperator } from './components/screens/ANPROperator';
import { ANPRSupervisorQueue } from './components/screens/ANPRSupervisorQueue';
import { Alerts } from './components/screens/Alerts';
import { AlertsHome } from './components/screens/AlertsHome';
import { AlertsOperator } from './components/screens/AlertsOperator';
import { AlertsSupervisor } from './components/screens/AlertsSupervisor';
import { AlertsAdmin } from './components/screens/AlertsAdmin';
import { SOPCompliance } from './components/screens/SOPCompliance';
import { IncidentsList } from './components/screens/IncidentsList';
import { AllIncidents } from './components/screens/AllIncidents';
import { IncidentDetail } from './components/screens/IncidentDetail';
import { IncidentOperator } from './components/screens/IncidentOperator';
import { IncidentSupervisor } from './components/screens/IncidentSupervisor';
import { DetectionLog } from './components/screens/DetectionLog';
import { BoundingBox } from './components/screens/BoundingBox';
import { PlateCorrection } from './components/screens/PlateCorrection';
import { EvidenceTimeline } from './components/screens/EvidenceTimeline';
import { EvidenceConsole } from './components/screens/EvidenceConsole';
import { EvidenceHome } from './components/screens/EvidenceHome';
import { EvidenceExport } from './components/screens/EvidenceExport';
import { EvidenceSync } from './components/screens/EvidenceSync';
import { FootageLibrary } from './components/screens/FootageLibrary';
import { EvidenceLibrary } from './components/screens/EvidenceLibrary';
import { ExplainabilityDAG } from './components/screens/ExplainabilityDAG';
import { ExplainabilityLogs } from './components/screens/ExplainabilityLogs';
import { ExplainabilityHome } from './components/screens/ExplainabilityHome';
import { ExplainabilitySimplified } from './components/screens/ExplainabilitySimplified';
import { AnalyticsHome } from './components/screens/AnalyticsHome';
import { CameraHealth } from './components/screens/CameraHealth';
import { ViolationTrends } from './components/screens/ViolationTrends';
import { CameraRegistry } from './components/screens/CameraRegistry';
import { UserManagement } from './components/screens/UserManagement';
import { TrafficViolationAnalytics } from './components/screens/TrafficViolationAnalytics';
import { TrafficViolationSimulation } from './components/screens/TrafficViolationSimulation';
import { CrossCameraTracking } from './components/screens/CrossCameraTracking';
import { DroneFleet } from './components/screens/DroneFleet';
import { DroneMissions } from './components/screens/DroneMissions';
import { DroneAlerts } from './components/screens/DroneAlerts';
import { DroneRegistry } from './components/screens/DroneRegistry';
import { BodycamRegistry } from './components/screens/BodycamRegistry';
import { SystemHealth } from './components/screens/SystemHealth';
import { AIModelManager } from './components/screens/AIModelManager';

// Map URL paths to internal screen ids
const pathToScreen: Record<string, string> = {
  '/': 'dashboard',
  '/dashboard': 'dashboard',

  '/surveillance/live-grid': 'surveillance-grid',
  '/surveillance/cross-camera': 'cross-camera-tracking',
  '/surveillance/multi-grid': 'multi-grid-viewer',

  '/bodycam': 'bodycam-grid',
  '/bodycam/detail': 'bodycam-detail',

  '/anpr': 'anpr-home',
  '/anpr/analytics': 'traffic-analytics',
  '/anpr/simulation': 'traffic-simulation',
  '/anpr/violations': 'anpr-list',
  '/anpr/approval': 'anpr-approval',
  '/anpr/operator': 'anpr-operator',
  '/anpr/supervisor-queue': 'anpr-supervisor-queue',

  '/alerts': 'alerts-home',
  '/alerts/operator': 'alerts-operator',
  '/alerts/supervisor': 'alerts-supervisor',
  '/alerts/admin': 'alerts-admin',
  '/alerts/sop': 'sop',

  '/incidents/list': 'incidents-list',
  '/incidents/all': 'all-incidents',
  '/incidents/operator': 'incident-operator',
  '/incidents/operator/create': 'incident-operator-create',
  '/incidents/supervisor': 'incident-supervisor',
  '/incidents/detail': 'incident-detail',

  '/detection/log': 'detection-log',
  '/detection/bounding-box': 'detection-boundingbox',
  '/detection/plate-correction': 'plate-correction',

  '/evidence': 'evidence-home',
  '/evidence/console': 'evidence-console',
  '/evidence/export': 'evidence-export',
  '/evidence/footage': 'footage-library',
  '/evidence/library': 'evidence-library',
  '/evidence/timeline': 'evidence-timeline',
  '/evidence/sync': 'evidence-sync',

  '/explainability': 'explainability-home',
  '/explainability/simplified': 'explainability-simplified',
  '/explainability/dag': 'explainability-dag',
  '/explainability/logs': 'explainability-logs',

  '/analytics': 'analytics-home',
  '/analytics/camera-health': 'analytics-camera-health',
  '/analytics/violations': 'analytics-violations',

  '/admin/cameras': 'admin-cameras',
  '/admin/users': 'admin-users',
  '/admin/system-health': 'admin-system',
  '/admin/drones': 'admin-drones',
  '/admin/bodycams': 'admin-bodycams',
  '/admin/ai-models': 'admin-ai-models',

  '/drone/fleet': 'drone-fleet',
  '/drone/missions': 'drone-missions',
  '/drone/alerts': 'drone-alerts',

  '/multi-grid': 'multi-grid-viewer'
};

// Reverse mapping: screen id → path (used when navigating from inside the app)
const screenToPath: Record<string, string> = Object.entries(pathToScreen).reduce(
  (acc, [path, screen]) => {
    if (!acc[screen]) acc[screen] = path;
    return acc;
  },
  {} as Record<string, string>
);

// NEW — user type
interface UserSession {
  id: string;
  username: string;
  name: string;
  role: 'operator' | 'supervisor' | 'admin';
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('kkn_user_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeScreen, setActiveScreen] = useState<string>(
    pathToScreen[location.pathname] ?? 'dashboard'
  );
  const [gridSize, setGridSize] = useState<'2x2' | '3x3' | '4x4'>('4x4');
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [selectedViolation, setSelectedViolation] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start true for initial load

  // Initial load simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // slightly longer for initial app load
    return () => clearTimeout(timer);
  }, []);

  // Keep activeScreen in sync when the URL changes (e.g. direct navigation)
  useEffect(() => {
    const screenFromPath = pathToScreen[location.pathname];
    if (screenFromPath && screenFromPath !== activeScreen) {
      setActiveScreen(screenFromPath);
    }
  }, [location.pathname]); // avoid extra effect runs during activeScreen changes

  const navigateScreen = useCallback(
    (screen: string) => {
      // avoid redundant state updates (helps reduce jank)
      if (screen !== activeScreen) {
        setActiveScreen(screen);
      }

      const path = screenToPath[screen];
      if (path && path !== location.pathname) {
        navigate(path);
      }
    },
    [activeScreen, location.pathname, navigate]
  );

  // handle login from LoginPage
  const handleLogin = (userData: { role: string; username: string; name: string }) => {
    // Convert LoginPage user data to UserSession (generate an id)
    const newUser: UserSession = {
      id: userData.username, // Use username as id for now
      username: userData.username,
      name: userData.name,
      role: userData.role as 'operator' | 'supervisor' | 'admin',
    };

    // Show loading before setting user to enable transition
    setIsLoading(true);

    setTimeout(() => {
      setUser(newUser);
      localStorage.setItem('kkn_user_session', JSON.stringify(newUser));
      // Loading will be handled by the screen navigation logic or remain true briefly
      // But since we are mounting the authenticated layout for the first time, 
      // the initial useEffect in App might not run again for this state change.
      // So we keep it true and let the layout rendering take over, 
      // but actually we need to clear it after user is set.

      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    }, 500); // Fake network delay for login
  };

  // render screens
  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard userRole={user!.role} />;

      case 'surveillance-grid':
        return (
          <LiveGrid
            onViewCamera={(camera) => {
              setSelectedCamera(camera);
              navigateScreen('camera-detail');
            }}
          />
        );

      case 'surveillance-multigrid-2x2':
        return <MultiGrid size="2x2" />;

      case 'surveillance-multigrid-3x3':
        return <MultiGrid size="3x3" />;

      case 'surveillance-multigrid-4x4':
        return <MultiGrid size="4x4" />;

      case 'camera-detail':
        return (
          <CameraDetail
            camera={selectedCamera}
            onBack={() => navigateScreen('surveillance-grid')}
          />
        );

      case 'bodycam-grid':
        return <BodycamGrid onViewOfficer={() => navigateScreen('bodycam-detail')} />;

      case 'bodycam-detail':
        return <BodycamDetail onBack={() => navigateScreen('bodycam-grid')} />;

      case 'anpr-home':
        return <ANPRHome onNavigate={navigateScreen} userRole={user!.role} />;

      case 'traffic-analytics':
        return <TrafficViolationAnalytics onBack={() => navigateScreen('anpr-home')} />;

      case 'traffic-simulation':
        return <TrafficViolationSimulation />;

      case 'anpr-list':
        return (
          <ANPRList
            userRole={user!.role}
            onViewDetail={(violation) => {
              setSelectedViolation(violation);
              navigateScreen('anpr-detail');
            }}
            onViewApproval={() => navigateScreen('anpr-approval')}
          />
        );

      case 'anpr-detail':
        return (
          <ANPRDetail
            onBack={() => navigateScreen('anpr-list')}
            violation={selectedViolation}
          />
        );

      case 'anpr-approval':
        return (
          <ANPRApproval
            onBack={() => navigateScreen('anpr-list')}
            onNavigate={navigateScreen}
            userRole={user!.role}
          />
        );

      case 'anpr-operator':
        return <ANPROperator onBack={() => navigateScreen('anpr-home')} />;

      case 'anpr-supervisor-queue':
        return <ANPRSupervisorQueue onBack={() => navigateScreen('anpr-home')} supervisorName={user?.name || 'Administrator'} />;

      case 'alerts':
        return <Alerts userRole={user!.role} onNavigate={navigateScreen} />;

      case 'alerts-home':
        return <AlertsHome onNavigate={navigateScreen} userRole={user!.role} />;

      case 'alerts-operator':
        return (
          <AlertsOperator
            onBack={() => navigateScreen('alerts-home')}
            onViewCamera={() => navigateScreen('camera-detail')}
            onCreateIncident={() => navigateScreen('incident-operator-create')}
          />
        );

      case 'alerts-supervisor':
        return (
          <AlertsSupervisor
            onBack={() => navigateScreen('alerts-home')}
            onViewCamera={() => navigateScreen('camera-detail')}
            onNavigate={navigateScreen}
          />
        );

      case 'alerts-admin':
        return <AlertsAdmin onBack={() => navigateScreen('alerts-home')} />;

      case 'sop':
        return <SOPCompliance />;

      case 'incidents-list':
        return (
          <IncidentsList
            onViewDetail={() => navigateScreen('incident-detail')}
            userRole={user!.role}
            onNavigate={navigateScreen}
          />
        );

      case 'all-incidents':
        return (
          <AllIncidents
            onBack={() => navigateScreen('alerts-home')}
            onNavigate={navigateScreen}
            userRole={user!.role}
          />
        );

      case 'incident-operator':
        return (
          <IncidentOperator
            onBack={() => navigateScreen('alerts-home')}
            onNavigate={navigateScreen}
            startMode="list"
          />
        );

      case 'incident-operator-create':
        return (
          <IncidentOperator
            onBack={() => navigateScreen('alerts-home')}
            onNavigate={navigateScreen}
            startMode="create"
          />
        );

      case 'incident-supervisor':
        return (
          <IncidentSupervisor
            onBack={() => navigateScreen('alerts-home')}
            onNavigate={navigateScreen}
          />
        );

      case 'incident-detail':
        return (
          <IncidentDetail
            userRole={user!.role}
            onBack={() => navigateScreen('all-incidents')}
            isClosed={true}
          />
        );

      case 'detection-log':
        return (
          <DetectionLog
            onViewBoundingBox={() => navigateScreen('detection-boundingbox')}
            onViewCorrection={() => navigateScreen('plate-correction')}
          />
        );

      case 'detection-boundingbox':
        return <BoundingBox onBack={() => navigateScreen('detection-log')} />;

      case 'plate-correction':
        return <PlateCorrection onBack={() => navigateScreen('detection-log')} />;

      case 'evidence-home':
        return <EvidenceHome onNavigate={navigateScreen} userRole={user!.role} />;

      case 'evidence-console':
        return (
          <EvidenceConsole
            onBack={() => navigateScreen('evidence-home')}
            userRole={user!.role}
          />
        );

      case 'evidence-export':
        return <EvidenceExport onNavigate={navigateScreen} />;

      case 'footage-library':
        return <FootageLibrary onNavigate={navigateScreen} />;

      case 'evidence-library':
        return <EvidenceLibrary onNavigate={navigateScreen} />;

      case 'evidence-timeline':
        return (
          <EvidenceTimeline
            onViewSync={() => navigateScreen('evidence-console')}
            onNavigate={navigateScreen}
          />
        );

      case 'evidence-sync':
        return <EvidenceSync onBack={() => navigateScreen('evidence-timeline')} />;

      case 'explainability-home':
        return <ExplainabilityHome onNavigate={navigateScreen} />;

      case 'explainability-simplified':
        return <ExplainabilitySimplified onBack={() => navigateScreen('explainability-home')} />;

      case 'explainability-dag':
        return <ExplainabilityDAG onNavigate={navigateScreen} />;

      case 'explainability-logs':
        return <ExplainabilityLogs onNavigate={navigateScreen} />;

      case 'analytics-home':
        return (
          <AnalyticsHome
            userRole={user!.role}
            onViewCameraHealth={() => navigateScreen('analytics-camera-health')}
            onViewViolations={() => navigateScreen('analytics-violations')}
            onViewAlerts={() => navigateScreen('alerts-admin')}
          />
        );

      case 'analytics-camera-health':
        return <CameraHealth onBack={() => navigateScreen('analytics-home')} />;

      case 'analytics-violations':
        return <ViolationTrends onBack={() => navigateScreen('analytics-home')} />;

      case 'admin-cameras':
        return <CameraRegistry />;

      case 'admin-users':
        return <UserManagement />;

      case 'cross-camera-tracking':
        return <CrossCameraTracking />;

      case 'drone-fleet':
        return <DroneFleet onNavigate={navigateScreen} />;

      case 'drone-missions':
        return <DroneMissions onNavigate={navigateScreen} />;

      case 'drone-alerts':
        return <DroneAlerts onNavigate={navigateScreen} />;

      case 'admin-drones':
        return <DroneRegistry />;

      case 'admin-bodycams':
        return <BodycamRegistry />;

      case 'admin-system':
        return <SystemHealth />;

      case 'admin-ai-models':
        return <AIModelManager />;

      case 'multi-grid-viewer':
        return <MultiGrid size={gridSize} />;

      default:
        return <Dashboard userRole={user!.role} />;
    }
  };

  // show login screen if not logged in
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-background text-white overflow-hidden">
      {isLoading && <LoadingScreen />}
      <Sidebar
        activeScreen={activeScreen}
        onNavigate={navigateScreen}
        userRole={user.role}
      />

      <div className="flex-1 flex flex-col overflow-hidden ml-72 transition-all duration-300">
        <TopBar
          activeScreen={activeScreen}
          gridSize={gridSize}
          onGridSizeChange={setGridSize}
          onNavigate={navigateScreen}
          userRole={user.role}
          username={user.username}
          name={user.name}
          userId={user.id}
          onLogout={() => {
            setUser(null);
            localStorage.removeItem('kkn_user_session');
          }}
        />

        <main className="flex-1 overflow-auto relative">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}
