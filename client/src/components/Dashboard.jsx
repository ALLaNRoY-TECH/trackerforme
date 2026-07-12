import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Circle, ExternalLink, ArrowRight, Code, Shield, CheckSquare } from 'lucide-react';
import { api } from '../utils/api';
import Timer from './Timer';

export default function Dashboard({ user, onDayAdvanced, onSessionEnd }) {
  const [dayData, setDayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [advancing, setAdvancing] = useState(false);

  const confettiRequestRef = useRef();

  useEffect(() => {
    fetchTodayData();
    return () => {
      if (confettiRequestRef.current) {
        cancelAnimationFrame(confettiRequestRef.current);
      }
    };
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
      for (const task of taskList) {
        if (!completedList.includes(task)) {
          await api.toggleTask(track, task, true);
        }
      }
      
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

  // Sleek Monochrome Confetti Trigger
  const triggerConfetti = () => {
    const canvas = document.getElementById('dashboard-confetti');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const particles = [];
    const colors = ['#ffffff', '#e4e4e7', '#a1a1aa', '#71717a', '#ffffff', '#27272a'];
    
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height - 50,
        vx: (Math.random() - 0.5) * 18,
        vy: -Math.random() * 12 - 7,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8
      });
    }

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.32; // gravity
        p.vx *= 0.98; // drag
        p.rotation += p.rotationSpeed;
        if (p.y < canvas.height + 20) {
          active = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });
      if (active) {
        confettiRequestRef.current = requestAnimationFrame(update);
      }
    };
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    update();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-white animate-spin" />
        <p className="text-sm text-zinc-400 font-medium">Loading your mission control...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-white">
          <h3 className="font-bold text-lg mb-2">Error Loading Dashboard</h3>
          <p className="text-sm mb-4">{error}</p>
          <button onClick={fetchTodayData} className="px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors">
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
      {/* Canvas for completion celebration confetti */}
      <canvas id="dashboard-confetti" className="fixed inset-0 pointer-events-none z-50 w-full h-full" />

      {/* Session Timer Widget */}
      <Timer onSessionEnd={(session) => {
        if (onSessionEnd) onSessionEnd(session);
        fetchTodayData();
      }} />

      {/* Progress status header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 p-6 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Mission Dashboard — <span className="text-white font-black underline decoration-white/20">Day {dayData.day_number}</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Ensure you complete both the DSA and Cybersecurity tasks to unlock the next day.
          </p>
        </div>
        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-zinc-400">
            <span>Overall Progress</span>
            <span>{overallProgressPercent}% ({dayData.day_number}/180 Days)</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-500" 
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
            ? 'border-t-white shadow-[0_0_20px_rgba(255,255,255,0.03)]' 
            : 'border-t-zinc-800'
        }`}>
          <div className="flex items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="p-2 rounded-lg bg-white/5 text-white">
                <Code size={18} />
              </span>
              DSA Track
            </h3>
            {dayData.dsa_completed && (
              <span className="text-xs bg-white/10 text-white border border-white/20 px-2 py-0.5 rounded font-semibold">
                COMPLETED
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Topic</span>
              <p className="text-lg font-bold text-white leading-snug">{dayData.dsa_topic}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Resource</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 text-sm font-semibold text-white border border-white/5">
                {dayData.dsa_resource}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-3">Tasks Checklist</span>
              <ul className="space-y-3">
                {dayData.dsa_tasks.map((task, idx) => {
                  const isDone = dayData.dsa_tasks_completed.includes(task);
                  return (
                    <li 
                      key={idx}
                      onClick={() => handleToggleTask('dsa', task, isDone)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                        isDone 
                          ? 'bg-white/5 border-white/20 text-zinc-400' 
                          : 'bg-black/30 border-white/5 text-zinc-200 hover:bg-white/5 hover:border-white/10'
                      }`}
                    >
                      <span className={`mt-0.5 ${isDone ? 'text-white' : 'text-zinc-600'}`}>
                        {isDone ? <CheckSquare size={16} fill="rgba(255,255,255,0.1)" /> : <Circle size={16} />}
                      </span>
                      <span className={`text-sm leading-relaxed ${isDone ? 'line-through decoration-white/25' : ''}`}>
                        {task}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {!dayData.dsa_completed && (
              <button
                onClick={() => {
                  handleMarkTrackComplete('dsa');
                  triggerConfetti();
                }}
                className="w-full mt-6 py-2.5 rounded-lg border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white text-xs font-bold tracking-wider uppercase transition-all"
              >
                Mark DSA Track As Complete
              </button>
            )}
          </div>
        </div>

        {/* CYBERSECURITY TRACK */}
        <div className={`glass-panel rounded-2xl p-6 border-t-2 relative overflow-hidden transition-all duration-300 ${
          dayData.cyber_completed 
            ? 'border-t-white shadow-[0_0_20px_rgba(255,255,255,0.03)]' 
            : 'border-t-zinc-800'
        }`}>
          <div className="flex items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="p-2 rounded-lg bg-white/5 text-white">
                <Shield size={18} />
              </span>
              Cybersecurity Track
            </h3>
            {dayData.cyber_completed && (
              <span className="text-xs bg-white/10 text-white border border-white/20 px-2 py-0.5 rounded font-semibold">
                COMPLETED
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">Topic</span>
              <p className="text-lg font-bold text-white leading-snug">{dayData.cyber_topic}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">Resource</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 text-sm font-semibold text-white border border-white/5">
                {dayData.cyber_resource}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-3">Tasks Checklist</span>
              <ul className="space-y-3">
                {dayData.cyber_tasks.map((task, idx) => {
                  const isDone = dayData.cyber_tasks_completed.includes(task);
                  return (
                    <li 
                      key={idx}
                      onClick={() => handleToggleTask('cyber', task, isDone)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                        isDone 
                          ? 'bg-white/5 border-white/20 text-zinc-400' 
                          : 'bg-black/30 border-white/5 text-zinc-200 hover:bg-white/5 hover:border-white/10'
                      }`}
                    >
                      <span className={`mt-0.5 ${isDone ? 'text-white' : 'text-zinc-600'}`}>
                        {isDone ? <CheckSquare size={16} fill="rgba(255,255,255,0.1)" /> : <Circle size={16} />}
                      </span>
                      <span className={`text-sm leading-relaxed ${isDone ? 'line-through decoration-white/25' : ''}`}>
                        {task}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {!dayData.cyber_completed && (
              <button
                onClick={() => {
                  handleMarkTrackComplete('cyber');
                  triggerConfetti();
                }}
                className="w-full mt-6 py-2.5 rounded-lg border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white text-xs font-bold tracking-wider uppercase transition-all"
              >
                Mark Cyber Track As Complete
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Advanced Program Navigation */}
      <div className="flex flex-col items-center justify-center p-8 bg-zinc-950 rounded-2xl border border-white/10 text-center gap-4">
        {allDone ? (
          <>
            <div className="p-3 rounded-full bg-white/10 text-white">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Daily Program Complete!</h4>
              <p className="text-sm text-zinc-400 mt-1">
                You've completed all tasks for Day {dayData.day_number}. Ready to push ahead?
              </p>
            </div>
            <button
              onClick={() => {
                triggerConfetti();
                handleAdvanceDay();
              }}
              disabled={advancing}
              className="flex items-center gap-2 px-8 py-3 bg-white text-black font-extrabold text-sm rounded-lg hover:bg-zinc-200 transition-all focus:outline-none shadow-lg shadow-white/10 cursor-pointer"
            >
              Finish Day Early → Move to Day {dayData.day_number + 1}
              <ArrowRight size={16} />
            </button>
          </>
        ) : (
          <>
            <div className="p-3 rounded-full bg-white/5 text-zinc-600">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h4 className="text-base font-bold text-zinc-400">Locked: Advance to Next Day</h4>
              <p className="text-xs text-zinc-500 mt-1">
                Finish all tasks above in both tracks to unlock early advancement.
              </p>
            </div>
            <button
              disabled
              className="flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/5 text-zinc-600 text-sm font-semibold rounded-lg cursor-not-allowed"
            >
              Complete Today's Work First
            </button>
          </>
        )}
      </div>

    </div>
  );
}
