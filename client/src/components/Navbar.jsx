import React from 'react';
import { BookOpen, Calendar, BarChart2, CheckSquare, LogOut, Flame, Award } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, user, onLogout, analytics }) {
  const navItems = [
    { id: 'dashboard', label: 'Today', icon: CheckSquare },
    { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 }
  ];

  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-white/5 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Progress info */}
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              GRIND <span className="text-emerald-400">TRACKER</span>
            </h1>
            <p className="text-xs text-gray-500 hidden md:block">DSA + Cybersecurity Journey</p>
          </div>
          
          <div className="h-8 w-px bg-white/10 hidden md:block" />

          {/* User metadata tags */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1.5">
              <Award size={14} />
              Day {user.current_day} / 180
            </span>

            {analytics && analytics.current_streak > 0 && (
              <span className="px-3 py-1 text-xs rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold flex items-center gap-1">
                <Flame size={14} className="fill-amber-400/20" />
                {analytics.current_streak} Day Streak
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-black/30 p-1 rounded-xl border border-white/5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-black shadow-lg font-semibold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User profile & Actions */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          
          <button
            onClick={onLogout}
            className="p-2.5 rounded-lg border border-white/5 hover:border-red-500/30 text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all focus:outline-none"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
