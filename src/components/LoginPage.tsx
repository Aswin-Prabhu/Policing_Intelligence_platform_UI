import { Shield, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface LoginPageProps {
  onLogin: (user: { role: string; username: string; name: string }) => void;
}

// Demo credentials
const demoCredentials: Record<string, { password: string; role: 'operator' | 'supervisor' | 'admin'; name: string }> = {
  'operator001': { password: 'demo123', role: 'operator', name: 'Ramesh Kumar' },
  'supervisor001': { password: 'demo123', role: 'supervisor', name: 'SI Priya Singh' },
  'admin001': { password: 'demo123', role: 'admin', name: 'System Admin' }
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const credentials = demoCredentials[username.toLowerCase()];
    if (!credentials || credentials.password !== password) {
      setError('Invalid username or password');
      return;
    }

    // Successful login: send full user info
    onLogin({
      role: credentials.role,
      username,
      name: credentials.name
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative">
      {/* Diluted Blue Background Shape Behind Glass Box */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[600px] bg-blue-100/40 rounded-[3rem] blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-blue-500/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-blue-200/30">
              <Shield className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-slate-800 text-3xl font-bold mb-2">Policing Intelligence Platform</h1>
          <p className="text-slate-600 mb-1">Andhra Pradesh Police • Smart City Operations</p>
        </div>

        {/* Apple Glass Style Login Box */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl shadow-blue-500/10">
          <div className="mb-6">
            <h2 className="text-slate-500 text-lg mb-2">Authorized Access Only</h2>
            <p className="text-slate-600 text-sm">Enter your credentials to access the system</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">User ID / Badge Number</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/50 backdrop-blur-sm border border-blue-200/50 rounded-lg pl-11 pr-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Enter your User ID"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/50 backdrop-blur-sm border border-blue-200/50 rounded-lg px-4 py-3 pr-11 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-medium transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200/50">
            <button
              onClick={() => setShowCredentials(!showCredentials)}
              className="text-blue-600 hover:text-blue-700 text-sm transition-colors font-medium"
            >
              {showCredentials ? '← Hide' : 'View'} Demo Credentials
            </button>

            {showCredentials && (
              <div className="mt-4 bg-blue-50/50 backdrop-blur-sm border border-blue-200/30 rounded-lg p-4">
                <p className="text-slate-600 text-xs mb-3 font-medium">Demo Mode - Use these credentials:</p>
                <div className="space-y-2 text-xs">
                  {Object.entries(demoCredentials).map(([userId, creds]) => (
                    <div key={userId} className="flex justify-between text-slate-700">
                      <span className="font-mono font-medium">{userId}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-mono font-medium">{creds.password}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-blue-600 font-medium">{creds.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
