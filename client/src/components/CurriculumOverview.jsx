import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Eye, X, BookOpen, ExternalLink, Code, Shield } from 'lucide-react';
import { api } from '../utils/api';

export default function CurriculumOverview({ user }) {
  const [curriculum, setCurriculum] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDayDetail, setSelectedDayDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'completed' | 'in-progress' | 'locked'

  useEffect(() => {
    fetchCurriculum();
  }, [user.current_day]);

  const fetchCurriculum = async () => {
    setLoading(true);
    try {
      const data = await api.getCurriculum();
      setCurriculum(data.curriculum || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewDay = async (dayNum) => {
    if (dayNum > user.current_day) return; // Locked

    setLoadingDetail(true);
    try {
      const detail = await api.getCurriculumDay(dayNum);
      setSelectedDayDetail(detail);
    } catch (err) {
      alert('Failed to load day details: ' + err.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Filter logic
  const filteredCurriculum = curriculum.filter(day => {
    if (filter === 'completed') return day.day_number < user.current_day;
    if (filter === 'in-progress') return day.day_number === user.current_day;
    if (filter === 'locked') return day.day_number > user.current_day;
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Indexing curriculum logs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 relative">
      
      {/* Filters and Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen size={20} className="text-emerald-400" />
            Full Curriculum Index
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Explore completed days or review your pending active tracks.</p>
        </div>

        {/* Filter Tab controls */}
        <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 text-xs font-semibold">
          {[
            { id: 'all', label: 'All Days' },
            { id: 'completed', label: 'Completed' },
            { id: 'in-progress', label: 'In Progress' },
            { id: 'locked', label: 'Locked' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-2 rounded-lg transition-colors ${
                filter === tab.id ? 'bg-emerald-500 text-black font-extrabold' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Curriculum Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCurriculum.map((day) => {
          const isCompleted = day.day_number < user.current_day;
          const isActive = day.day_number === user.current_day;
          const isLocked = day.day_number > user.current_day;

          let statusClass = "border-white/5 bg-black/20 text-gray-500 cursor-not-allowed";
          let statusLabel = "Locked";
          let icon = <Lock size={14} />;

          if (isCompleted) {
            statusClass = "border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 cursor-pointer hover:border-emerald-500/30";
            statusLabel = "Completed";
            icon = <Unlock size={14} />;
          } else if (isActive) {
            statusClass = "border-indigo-500/30 bg-indigo-500/5 text-indigo-400 hover:bg-indigo-500/10 cursor-pointer hover:border-indigo-500/50 ring-1 ring-indigo-500/20";
            statusLabel = "Active (In Progress)";
            icon = <Unlock size={14} className="animate-pulse" />;
          }

          return (
            <div
              key={day.day_number}
              onClick={() => !isLocked && handleReviewDay(day.day_number)}
              className={`border p-4 rounded-xl flex flex-col justify-between h-36 transition-all ${statusClass}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Day {day.day_number}</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase">
                    {icon}
                    {statusLabel}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white line-clamp-1 mb-1">
                  DSA: {day.dsa_topic}
                </h4>
                <p className="text-[11px] text-gray-400 line-clamp-1">
                  Cyber: {day.cyber_topic}
                </p>
              </div>

              {!isLocked && (
                <div className="flex justify-end pt-3">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-indigo-300">
                    <Eye size={12} />
                    Review Tasks
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Review Modal Side Panel */}
      {selectedDayDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl h-full max-h-[90vh] lg:max-h-screen overflow-y-auto glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl flex flex-col justify-between relative animate-in slide-in-from-right duration-250">
            
            {/* Modal Header */}
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Day {selectedDayDetail.day_number} Study Log</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Read-only curriculum view</p>
                </div>
                <button
                  onClick={() => setSelectedDayDetail(null)}
                  className="p-2 rounded-lg hover:bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tasks details */}
              <div className="space-y-6">
                {/* DSA */}
                <div className="space-y-3 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Code size={16} className="text-indigo-400" />
                    DSA Topic: {selectedDayDetail.dsa_topic}
                  </h4>
                  <p className="text-xs text-gray-400">
                    <span className="font-bold text-gray-500">Resource:</span> {selectedDayDetail.dsa_resource}
                  </p>
                  <ul className="space-y-1.5 pt-2">
                    {selectedDayDetail.dsa_tasks.map((task, i) => {
                      const isCompleted = selectedDayDetail.dsa_tasks_completed.includes(task);
                      return (
                        <li key={i} className="flex items-center gap-2 text-xs">
                          <span className={isCompleted ? 'text-emerald-400' : 'text-gray-600'}>
                            ●
                          </span>
                          <span className={isCompleted ? 'line-through text-gray-500' : 'text-gray-300'}>
                            {task}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Cyber */}
                <div className="space-y-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Shield size={16} className="text-emerald-400" />
                    Cyber Topic: {selectedDayDetail.cyber_topic}
                  </h4>
                  <p className="text-xs text-gray-400">
                    <span className="font-bold text-gray-500">Resource:</span> {selectedDayDetail.cyber_resource}
                  </p>
                  <ul className="space-y-1.5 pt-2">
                    {selectedDayDetail.cyber_tasks.map((task, i) => {
                      const isCompleted = selectedDayDetail.cyber_tasks_completed.includes(task);
                      return (
                        <li key={i} className="flex items-center gap-2 text-xs">
                          <span className={isCompleted ? 'text-emerald-400' : 'text-gray-600'}>
                            ●
                          </span>
                          <span className={isCompleted ? 'line-through text-gray-500' : 'text-gray-300'}>
                            {task}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/5 pt-4 flex justify-end">
              <button
                onClick={() => setSelectedDayDetail(null)}
                className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-semibold border border-white/5 transition-colors"
              >
                Close Review
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
