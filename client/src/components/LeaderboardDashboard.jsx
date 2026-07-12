import React, { useState, useEffect } from 'react';
import { Trophy, Flame, BookOpen, Clock, ArrowRight, Sparkles, Palette, Loader2 } from 'lucide-react';
import { api } from '../utils/api';

export default function LeaderboardDashboard({ onSelectProfile }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Available themes
  const themes = [
    { id: 'green-black', name: 'Green & Black', class: 'bg-[#030504] border-emerald-500/30 text-emerald-400' },
    { id: 'dark', name: 'Dark Mode', class: 'bg-[#070b13] border-indigo-500/30 text-indigo-400' },
    { id: 'light', name: 'Light Mode', class: 'bg-white border-blue-500/30 text-blue-600' },
    { id: 'beige', name: 'Beige Mode', class: 'bg-[#f5f2eb] border-amber-800/30 text-amber-900' },
    { id: 'red', name: 'Red Mode', class: 'bg-[#0b0303] border-red-500/30 text-red-500' },
    { id: 'green', name: 'Green Mode', class: 'bg-[#030704] border-green-500/30 text-green-500' }
  ];

  const [activeTheme, setActiveTheme] = useState(localStorage.getItem('selectedTheme') || 'green-black');

  useEffect(() => {
    fetchLeaderboardStats();
  }, []);

  const fetchLeaderboardStats = async () => {
    try {
      setLoading(true);
      const data = await api.getComparison();
      setStats(data);
    } catch (err) {
      console.error(err);
      setError('Could not fetch leaderboard stats. Make sure your database is connected!');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (themeId) => {
    setActiveTheme(themeId);
    localStorage.setItem('selectedTheme', themeId);
    if (themeId === 'green-black') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', themeId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg flex flex-col items-center justify-center gap-4 text-glow-emerald">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
        <p className="text-sm font-semibold tracking-wide text-emerald-400">Loading Leaderboard Standings...</p>
      </div>
    );
  }

  // Fallback defaults if database isn't populated or returns error
  const aroy = stats?.aroy || { name: 'aroy', total_hours: 0, current_streak: 0, completed_topics: 0 };
  const bubu = stats?.bubu || { name: 'bubu', total_hours: 0, current_streak: 0, completed_topics: 0 };
  const leader = stats?.leader || 'aroy';
  const tip = stats?.tip || 'No stats recorded yet. Start studying to take the lead!';

  return (
    <div className="min-h-screen px-4 py-8 md:py-16 relative overflow-hidden transition-colors duration-300">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header section with Theme Picker */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 pb-6 border-b border-emerald-500/10">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2 uppercase text-glow-emerald">
              GRIND <span className="text-emerald-500">STANDINGS</span>
            </h1>
            <p className="text-sm text-gray-400">Competitive DSA & Cybersecurity Tracker</p>
          </div>
          
          {/* Custom Theme Switcher */}
          <div className="flex items-center gap-3 bg-black/40 p-2 rounded-xl border border-white/5">
            <Palette size={16} className="text-gray-400 ml-1" />
            <div className="flex flex-wrap gap-1.5">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleThemeChange(t.id)}
                  title={t.name}
                  className={`w-6 h-6 rounded-full border transition-all duration-200 hover:scale-110 ${
                    activeTheme === t.id ? 'ring-2 ring-emerald-500 border-white scale-105' : 'border-transparent'
                  }`}
                  style={{
                    backgroundColor: 
                      t.id === 'green-black' ? '#030504' :
                      t.id === 'dark' ? '#070b13' :
                      t.id === 'light' ? '#cbd5e1' :
                      t.id === 'beige' ? '#d7ccc8' :
                      t.id === 'red' ? '#991b1b' : '#166534'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Lead Spotlight Card */}
        <div className="glass-panel rounded-2xl p-6 mb-10 text-center relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute inset-0 bg-emerald-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-full bg-emerald-500/15 text-emerald-500 animate-bounce">
              <Trophy size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2">
            <span className="text-emerald-500 uppercase tracking-wide">{leader}</span> is currently leading the board!
          </h2>
          <p className="text-sm text-gray-300 max-w-lg mx-auto italic flex items-center justify-center gap-1.5">
            <Sparkles size={16} className="text-emerald-400 shrink-0" />
            "{tip}"
          </p>
        </div>

        {/* Head to Head Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Aroy Profile Card */}
          <div className="glass-panel rounded-2xl p-8 flex flex-col justify-between border-t-4 border-t-emerald-500 hover:scale-[1.02] transition-transform duration-300">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-wider">AROY</h3>
                  <p className="text-xs text-emerald-400 font-semibold tracking-widest mt-1">COMPETITOR #1</p>
                </div>
                {leader === 'aroy' && (
                  <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                    <Trophy size={12} /> LEADING
                  </span>
                )}
              </div>

              {/* Stats stack */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-3.5 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3 text-gray-300 text-sm">
                    <Clock size={18} className="text-emerald-400" />
                    <span>Total Studied</span>
                  </div>
                  <span className="text-xl font-bold text-white">{aroy.total_hours.toFixed(1)} hrs</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3 text-gray-300 text-sm">
                    <Flame size={18} className="text-orange-400" />
                    <span>Active Streak</span>
                  </div>
                  <span className="text-xl font-bold text-white">{aroy.current_streak} days</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3 text-gray-300 text-sm">
                    <BookOpen size={18} className="text-indigo-400" />
                    <span>Topics Done</span>
                  </div>
                  <span className="text-xl font-bold text-white">{aroy.completed_topics}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectProfile('aroy')}
              className="w-full py-4 rounded-xl bg-emerald-500 text-black font-extrabold text-sm hover:bg-emerald-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-emerald-500/20"
            >
              Enter Workspace
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Bubu Profile Card */}
          <div className="glass-panel rounded-2xl p-8 flex flex-col justify-between border-t-4 border-t-indigo-500 hover:scale-[1.02] transition-transform duration-300">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-wider">BUBU</h3>
                  <p className="text-xs text-indigo-400 font-semibold tracking-widest mt-1">COMPETITOR #2</p>
                </div>
                {leader === 'bubu' && (
                  <span className="bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                    <Trophy size={12} /> LEADING
                  </span>
                )}
              </div>

              {/* Stats stack */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-3.5 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3 text-gray-300 text-sm">
                    <Clock size={18} className="text-indigo-400" />
                    <span>Total Studied</span>
                  </div>
                  <span className="text-xl font-bold text-white">{bubu.total_hours.toFixed(1)} hrs</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3 text-gray-300 text-sm">
                    <Flame size={18} className="text-orange-400" />
                    <span>Active Streak</span>
                  </div>
                  <span className="text-xl font-bold text-white">{bubu.current_streak} days</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3 text-gray-300 text-sm">
                    <BookOpen size={18} className="text-emerald-400" />
                    <span>Topics Done</span>
                  </div>
                  <span className="text-xl font-bold text-white">{bubu.completed_topics}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectProfile('bubu')}
              className="w-full py-4 rounded-xl bg-indigo-500 text-white font-extrabold text-sm hover:bg-indigo-400 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/20"
            >
              Enter Workspace
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

        {/* Comparative Visual Bar */}
        <div className="glass-panel rounded-2xl p-6 mb-12">
          <div className="flex justify-between items-center mb-3 text-sm text-gray-300 font-bold">
            <span>AROY ({aroy.total_hours.toFixed(1)}h)</span>
            <span>BUBU ({bubu.total_hours.toFixed(1)}h)</span>
          </div>
          
          <div className="w-full h-4 bg-black/50 rounded-full overflow-hidden flex border border-white/5 p-0.5">
            {aroy.total_hours === 0 && bubu.total_hours === 0 ? (
              <div className="w-1/2 h-full bg-gray-500/30 rounded-full" />
            ) : (
              <>
                <div 
                  className="h-full bg-emerald-500 rounded-l-full transition-all duration-500" 
                  style={{ width: `${(aroy.total_hours / (aroy.total_hours + bubu.total_hours || 1)) * 100}%` }}
                />
                <div 
                  className="h-full bg-indigo-500 rounded-r-full transition-all duration-500" 
                  style={{ width: `${(bubu.total_hours / (aroy.total_hours + bubu.total_hours || 1)) * 100}%` }}
                />
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
