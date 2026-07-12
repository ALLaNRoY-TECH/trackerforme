import React, { useState } from 'react';
import { User, Mail, Lock, Loader } from 'lucide-react';

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const { api } = await import('../utils/api');
      const data = await api.register(name, email, password);
      onRegisterSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#050811] relative overflow-hidden">
      {/* Visual background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />

      <div className="w-full max-w-md glass-panel rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            JOIN <span className="text-emerald-400">THE GRIND</span>
          </h1>
          <p className="text-sm text-gray-400">Create an independent study account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <User size={18} />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 rounded-lg text-white glass-input placeholder-gray-600 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Mail size={18} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg text-white glass-input placeholder-gray-600 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Lock size={18} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full pl-10 pr-4 py-3 rounded-lg text-white glass-input placeholder-gray-600 text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-emerald-500 text-black font-semibold text-sm hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Registering...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors focus:outline-none"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
