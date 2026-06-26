import React, { useState } from 'react';
import { Shield, User, Key, Leaf } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'susty-admin' | 'susty-viewer') => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'susty-admin' | 'susty-viewer'>('susty-admin');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username or email address.');
      return;
    }
    // Log in with whatever email they entered, using the selected role
    onLogin(selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl p-8 z-10">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 mb-4 animate-pulse">
            <Leaf className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">EcoKube AI 🌿</h1>
          <p className="text-slate-400 text-sm mt-2 text-center">
            Intelligent Carbon-Aware Container Governance Platform
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Email / Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Enter your email or username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-3 w-5 h-5 text-slate-500" />
              <input
                type="password"
                placeholder="Enter any password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl py-2.5 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Role Selection Segmented Control */}
          <div>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Select Access Role
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedRole('susty-admin')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  selectedRole === 'susty-admin'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Administrator
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('susty-viewer')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  selectedRole === 'susty-viewer'
                    ? 'bg-blue-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Viewer (Read-Only)
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-semibold text-sm rounded-xl py-3 mt-6 transition-all shadow-lg shadow-emerald-500/20 flex justify-center items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Authenticate Securely
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/60 text-center">
          <p className="text-xs text-slate-500">Quick Fill Demo Roles:</p>
          <div className="flex gap-2 justify-center mt-3">
            <button
              onClick={() => { setUsername('susty-admin'); setPassword('admin123'); }}
              className="text-xs px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-800 rounded-lg transition-all"
            >
              Admin Role
            </button>
            <button
              onClick={() => { setUsername('susty-viewer'); setPassword('viewer123'); }}
              className="text-xs px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-blue-400 border border-slate-800 rounded-lg transition-all"
            >
              Viewer Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
