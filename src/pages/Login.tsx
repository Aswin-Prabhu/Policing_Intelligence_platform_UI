import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const roleDescriptions = {
  cco: '→ Ground-level monitoring & first-level verification',
  supervisor: '→ Advanced verification, evidence review & approval authority',
  admin: '→ Full system access, user management & configuration control'
};

export default function Login() {
  const [role, setRole] = useState<UserRole>('cco');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(username, password, role);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Use admin/password');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#3b82f6] to-[#1e40af] rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Kakinada 360
          </h1>
          <p className="text-[#3b82f6] text-lg font-medium mb-1">
            Command & Control System
          </p>
          <p className="text-slate-400 text-sm">
            Smart City Surveillance & Monitoring
          </p>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden shadow-2xl">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Secure Login
              </h2>
              <p className="text-slate-400 text-sm">
                Enter your credentials to access the system
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <option value="cco">Control Room Operator (CCO)</option>
                  <option value="supervisor">Supervisor (SI / Inspector)</option>
                  <option value="admin">System Administrator (DSP Office)</option>
                </select>
                <p className="mt-2 text-xs text-[#3b82f6]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {roleDescriptions[role]}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-lg pl-11 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 bg-[#0f172a] border-[#334155] rounded text-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-0"
                  />
                  <span className="ml-2 text-sm text-slate-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Remember me
                  </span>
                </label>
                <a href="#" className="text-sm text-[#3b82f6] hover:text-[#60a5fa] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Sign In
              </button>
            </form>
          </div>

          <div className="px-8 py-4 bg-[#0f172a] border-t border-[#334155] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-3 h-3 text-[#22c55e]" />
              <span className="text-xs text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                Secure Connection
              </span>
            </div>
            <span className="text-xs text-slate-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              v2.1.3
            </span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e293b] border border-[#334155] rounded-lg">
            <Shield className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-slate-300" style={{ fontFamily: 'Inter, sans-serif' }}>
              Authorized Personnel Only • All sessions are logged
            </span>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500" style={{ fontFamily: 'Inter, sans-serif' }}>
          © 2025 Kakinada Smart City Initiative
          <br />
          Ministry of Home Affairs • Government of India
        </div>
      </div>
    </div>
  );
}
