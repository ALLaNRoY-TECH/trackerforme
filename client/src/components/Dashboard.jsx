import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ExternalLink, ArrowRight, Code, Shield, CheckSquare } from 'lucide-react';
import { api } from '../utils/api';
import Timer from './Timer';

export default function Dashboard({ user, onDayAdvanced, onSessionEnd }) {
  const [dayData, setDayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [advancing, setAdvancing] = useState(false);

  useEffect(() => {
    fetchTodayData();
  }, [user.current_day]);

  const fetchTodayData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getToday();
      setDayData(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load today tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (track, taskText, isCurrentlyCompleted) => {
    try {
      const updated = await api.toggleTask(track, taskText, !isCurrentlyCompleted);
      
      setDayData(prev => {
        const completedListKey = track === 'dsa' ? 'dsa_tasks_completed' : 'cyber_tasks_completed';
        const completedFlagKey = track === 'dsa' ? 'dsa_completed' : 'cyber_completed';
        
        let newCompleted = [...prev[completedListKey]];
        if (!isCurrentlyCompleted) {
          if (!newCompleted.includes(taskText)) newCompleted.push(taskText);
        } else {
          newCompleted = newCompleted.filter(t => t !== taskText);
        }

        return {
          ...prev,
          [completedListKey]: newCompleted,
          [completedFlagKey]: updated.completed
        };
      });
    } catch (err) {
      alert('Failed to update task: ' + err.message);
    }
  };

  const handleMarkTrackComplete = async (track) => {
    if (!dayData) return;
    const taskList = track === 'dsa' ? dayData.dsa_tasks : dayData.cyber_tasks;
    const completedList = track === 'dsa' ? dayData.dsa_tasks_completed : dayData.cyber_tasks_completed;

    try {
      // Toggle all remaining tasks for this track
      for (const task of taskList) {
        if (!completedList.includes(task)) {
          await api.toggleTask(track, task, true);
        }
      }
      
      // Update local state by forcing a refresh
      const refreshed = await api.getToday();
      setDayData(refreshed);
    } catch (err) {
      alert('Failed to mark complete: ' + err.message);
    }
  };

  const handleAdvanceDay = async () => {
    if (advancing) return;
    setAdvancing(true);
    try {
      const res = await api.advanceDay();
      onDayAdvanced(res.current_day);
    } catch (err) {
      alert(err.message || 'Failed to advance day');
    } finally {
      setAdvancing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Loading your mission control...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="p-6 rounded-2xl bg-red-500/15 border border-red-500/20 text-red-400">
          <h3 className="font-bold text-lg mb-2">Error Loading Dashboard</h3>
          <p className="text-sm mb-4">{error}</p>
          <button onClick={fetchTodayData} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const allDone = dayData && dayData.dsa_completed && dayData.cyber_completed;
  const overallProgressPercent = Math.min(100, Math.round((dayData.day_number / 180) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      
      {/* Session Timer Widget */}
      <Timer onSessionEnd={onSessionEnd} />

      {/* Progress status header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/2 p-6 rounded-2xl border border-white/5">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Mission Dashboard — <span className="text-emerald-400">Day {dayData.day_number}</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Ensure you complete both the DSA and Cybersecurity tasks to unlock the next day.
          </p>
        </div>
        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-gray-400">
            <span>Overall Progress</span>
            <span>{overallProgressPercent}% ({dayData.day_number}/180 Days)</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500" 
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Dual Tracks Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* DSA TRACK */}
        <div className={`glass-panel rounded-2xl p-6 border-t-2 relative overflow-hidden transition-all duration-300 ${
          dayData.dsa_completed 
            ? 'border-t-emerald-500 shadow-lg shadow-emerald-500/5' 
            : 'border-t-indigo-500'
        }`}>
          <div className="flex items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Code size={18} />
              </span>
              DSA Track
            </h3>
            {dayData.dsa_completed && (
              <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold">
                COMPLETED
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Topic</span>
              <p className="text-lg font-bold text-white leading-snug">{dayData.dsa_topic}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Resource</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 text-sm font-semibold text-indigo-300 border border-white/5">
                {dayData.dsa_resource}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">Tasks Checklist</span>
              <ul className="space-y-3">
                {dayData.dsa_tasks.map((task, idx) => {
                  const isDone = dayData.dsa_tasks_completed.includes(task);
                  return (
                    <li 
                      key={idx}
                      onClick={() => handleToggleTask('dsa', task, isDone)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                        isDone 
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-gray-400' 
                          : 'bg-black/30 border-white/5 text-gray-200 hover:bg-white/5 hover:border-white/10'
                      }`}
                    >
                      <span className={`mt-0.5 ${isDone ? 'text-emerald-400' : 'text-gray-600'}`}>
                        {isDone ? <CheckSquare size={16} fill="rgba(16,185,129,0.1)" /> : <Circle size={16} />}
                      </span>
                      <span className={`text-sm leading-relaxed ${isDone ? 'line-through decoration-emerald-500/30' : ''}`}>
                        {task}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {!dayData.dsa_completed && (
              <button
                onClick={() => handleMarkTrackComplete('dsa')}
                className="w-full mt-6 py-2.5 rounded-lg border border-indigo-500/20 hover:border-indigo-500/40 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-300 text-xs font-bold tracking-wider uppercase transition-all"
              >
                Mark DSA Track As Complete
              </button>
            )}
          </div>
        </div>

        {/* CYBERSECURITY TRACK */}
        <div className={`glass-panel rounded-2xl p-6 border-t-2 relative overflow-hidden transition-all duration-300 ${
          dayData.cyber_completed 
            ? 'border-t-emerald-500 shadow-lg shadow-emerald-500/5' 
            : 'border-t-emerald-600'
        }`}>
          <div className="flex items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Shield size={18} />
              </span>
              Cybersecurity Track
            </h3>
            {dayData.cyber_completed && (
              <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold">
                COMPLETED
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Topic</span>
              <p className="text-lg font-bold text-white leading-snug">{dayData.cyber_topic}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Resource</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 text-sm font-semibold text-emerald-300 border border-white/5">
                {dayData.cyber_resource}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-3">Tasks Checklist</span>
              <ul className="space-y-3">
                {dayData.cyber_tasks.map((task, idx) => {
                  const isDone = dayData.cyber_tasks_completed.includes(task);
                  return (
                    <li 
                      key={idx}
                      onClick={() => handleToggleTask('cyber', task, isDone)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                        isDone 
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-gray-400' 
                          : 'bg-black/30 border-white/5 text-gray-200 hover:bg-white/5 hover:border-white/10'
                      }`}
                    >
                      <span className={`mt-0.5 ${isDone ? 'text-emerald-400' : 'text-gray-600'}`}>
                        {isDone ? <CheckSquare size={16} fill="rgba(16,185,129,0.1)" /> : <Circle size={16} />}
                      </span>
                      <span className={`text-sm leading-relaxed ${isDone ? 'line-through decoration-emerald-500/30' : ''}`}>
                        {task}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {!dayData.cyber_completed && (
              <button
                onClick={() => handleMarkTrackComplete('cyber')}
                className="w-full mt-6 py-2.5 rounded-lg border border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-300 text-xs font-bold tracking-wider uppercase transition-all"
              >
                Mark Cyber Track As Complete
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Advanced Program Navigation */}
      <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-2xl border border-white/5 text-center gap-4">
        {allDone ? (
          <>
            <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Daily Program Complete!</h4>
              <p className="text-sm text-gray-400 mt-1">
                You've completed all tasks for Day {dayData.day_number}. Ready to push ahead?
              </p>
            </div>
            <button
              onClick={handleAdvanceDay}
              disabled={advancing}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-black font-extrabold text-sm rounded-lg hover:bg-emerald-400 transition-all focus:outline-none shadow-lg shadow-emerald-500/25 cursor-pointer glow-emerald"
            >
              Finish Day Early → Move to Day {dayData.day_number + 1}
              <ArrowRight size={16} />
            </button>
          </>
        ) : (
          <>
            <div className="p-3 rounded-full bg-white/5 text-gray-600">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-400">Locked: Advance to Next Day</h4>
              <p className="text-xs text-gray-500 mt-1">
                Finish all tasks above in both tracks to unlock early advancement.
              </p>
            </div>
            <button
              disabled
              className="flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/5 text-gray-500 text-sm font-semibold rounded-lg cursor-not-allowed"
            >
              Complete Today's Work First
            </button>
          </>
        )}
      </div>

    </div>
  );
}
