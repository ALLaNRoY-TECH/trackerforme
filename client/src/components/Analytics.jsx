import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Clock, Flame, Percent, CheckCircle, Code, Shield } from 'lucide-react';
import { api } from '../utils/api';

export default function Analytics({ refreshTrigger }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [refreshTrigger]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const stats = await api.getAnalytics();
      setData(stats);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Synthesizing telemetry data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-400">
        No study records found to compile analytics. Get to work!
      </div>
    );
  }

  // Formatting date labels for 30-day chart (e.g. "Jul 12")
  const formattedActivityData = data.activity_last_30_days.map(item => {
    const d = new Date(item.date + 'T00:00:00');
    return {
      name: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      hours: parseFloat(item.hours.toFixed(2))
    };
  });

  // Pie chart data
  const pieData = [
    { name: 'DSA Focus', value: parseFloat(data.dsa_hours.toFixed(2)), color: '#6366f1' }, // Indigo
    { name: 'Cyber Focus', value: parseFloat(data.cyber_hours.toFixed(2)), color: '#10b981' } // Emerald
  ].filter(item => item.value > 0);

  // If no hours, show a placeholder split
  const isPieDataEmpty = pieData.length === 0;
  const displayPieData = isPieDataEmpty 
    ? [{ name: 'No focus logged', value: 1, color: '#1f2937' }]
    : pieData;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Hours */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 flex items-center gap-4">
          <div className="p-3.5 bg-indigo-500/10 rounded-xl text-indigo-400">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Total Hours</span>
            <span className="text-2xl font-extrabold text-white">
              {parseFloat(data.total_hours.toFixed(1))}h
            </span>
            <span className="text-xs text-gray-500 block mt-0.5">
              {parseFloat(data.week_hours.toFixed(1))}h this week
            </span>
          </div>
        </div>

        {/* Consistency */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 flex items-center gap-4">
          <div className="p-3.5 bg-emerald-500/10 rounded-xl text-emerald-400">
            <Percent size={20} />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Consistency</span>
            <span className="text-2xl font-extrabold text-white">
              {data.consistency_percentage}%
            </span>
            <span className="text-xs text-gray-500 block mt-0.5">
              Days studied vs joining
            </span>
          </div>
        </div>

        {/* Current Streak */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 flex items-center gap-4">
          <div className="p-3.5 bg-amber-500/10 rounded-xl text-amber-400">
            <Flame size={20} className="fill-amber-400/25" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Current Streak</span>
            <span className="text-2xl font-extrabold text-white">
              {data.current_streak} Days
            </span>
            <span className="text-xs text-gray-500 block mt-0.5">
              Keep it up!
            </span>
          </div>
        </div>

        {/* Topics Count */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 flex items-center gap-4">
          <div className="p-3.5 bg-sky-500/10 rounded-xl text-sky-400">
            <CheckCircle size={20} />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Days Completed</span>
            <span className="text-2xl font-extrabold text-white">
              {data.dsa_topics_completed} / 180
            </span>
            <span className="text-xs text-gray-500 block mt-0.5">
              DSA {data.dsa_topics_completed} | Cyber {data.cyber_topics_completed}
            </span>
          </div>
        </div>

      </div>

      {/* Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 30-Day Activity Bar Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white">Daily Study Intensity</h3>
            <p className="text-xs text-gray-400 mt-0.5">Hours studied per day over the last 30 days</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="#4b5563" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#4b5563" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  unit="h"
                />
                <Tooltip
                  contentStyle={{ background: '#131c2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af', fontWeight: 'bold', fontSize: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Bar 
                  dataKey="hours" 
                  fill="#6366f1" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DSA vs Cyber Split Donut Chart */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white">Study Track Allocation</h3>
            <p className="text-xs text-gray-400 mt-0.5">Distribution of hours between curriculum subjects</p>
          </div>

          <div className="h-60 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {displayPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#131c2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                  formatter={(value) => isPieDataEmpty ? '0h' : `${value} hours`}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner text metric */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white">
                {isPieDataEmpty ? '0%' : `${Math.round((data.dsa_hours / (data.dsa_hours + data.cyber_hours || 1)) * 100)}%`}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">DSA Ratio</span>
            </div>
          </div>

          {/* Legends & Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                <Code size={14} className="text-indigo-400" />
                <span>DSA Focus</span>
              </div>
              <span className="font-bold text-white">
                {parseFloat(data.dsa_hours.toFixed(1))}h
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <Shield size={14} className="text-emerald-400" />
                <span>Cybersecurity Focus</span>
              </div>
              <span className="font-bold text-white">
                {parseFloat(data.cyber_hours.toFixed(1))}h
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
