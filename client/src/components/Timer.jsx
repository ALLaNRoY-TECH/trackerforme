import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Timer as TimerIcon, Shield, Code, Layers } from 'lucide-react';
import { api } from '../utils/api';

export default function Timer({ onSessionEnd }) {
  const [checkedIn, setCheckedIn] = useState(false);
  const [track, setTrack] = useState('both');
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState(null);

  const intervalRef = useRef(null);

  // Load timer status from server on mount
  useEffect(() => {
    fetchTimerStatus();
    return () => clearInterval(intervalRef.current);
  }, []);

  const fetchTimerStatus = async () => {
    try {
      const status = await api.getTimerStatus();
      if (status.checked_in) {
        setCheckedIn(true);
        setTrack(status.track || 'both');
        setStartTime(new Date(status.check_in_time));
        
        // Calculate initial elapsed seconds
        const elapsed = Math.floor((Date.now() - new Date(status.check_in_time).getTime()) / 1000);
        setSeconds(Math.max(0, elapsed));
        
        // Start running local timer
        startLocalTimer(new Date(status.check_in_time));
      } else {
        setCheckedIn(false);
        setSeconds(0);
      }
    } catch (err) {
      console.error('Failed to get timer status:', err);
    }
  };

  const startLocalTimer = (start) => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start.getTime()) / 1000);
      setSeconds(Math.max(0, elapsed));
    }, 1000);
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const res = await api.checkIn(track);
      setCheckedIn(true);
      const start = new Date(res.check_in_time);
      setStartTime(start);
      setSeconds(0);
      startLocalTimer(start);
    } catch (err) {
      alert(err.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const res = await api.checkOut();
      clearInterval(intervalRef.current);
      setCheckedIn(false);
      setSeconds(0);
      setStartTime(null);
      if (onSessionEnd) {
        onSessionEnd(res.session);
      }
    } catch (err) {
      alert(err.message || 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  // Helper to format seconds to HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden border border-white/10">
      {/* Background visual cue for studied state */}
      {checkedIn && (
        <div className="absolute inset-0 bg-white/5 animate-pulse pointer-events-none" />
      )}

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Title and stats */}
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-xl ${checkedIn ? 'bg-white/10 text-white animate-pulse' : 'bg-white/5 text-zinc-400'}`}>
            <TimerIcon size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Study Session Timer</h2>
            <p className="text-xs text-zinc-400">
              {checkedIn 
                ? `Currently studying: ${track.toUpperCase()}` 
                : 'Check in to log study hours'}
            </p>
          </div>
        </div>

        {/* Live Timer Counter */}
        <div className="text-3xl md:text-4xl font-mono font-bold tracking-widest text-white text-glow-emerald">
          {formatTime(seconds)}
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {!checkedIn ? (
            <>
              {/* Track selector before check in */}
              <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 text-xs">
                <button
                  onClick={() => setTrack('dsa')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-medium transition-colors ${
                    track === 'dsa' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                  disabled={loading}
                >
                  <Code size={12} />
                  DSA
                </button>
                <button
                  onClick={() => setTrack('cyber')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-medium transition-colors ${
                    track === 'cyber' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                  disabled={loading}
                >
                  <Shield size={12} />
                  Cyber
                </button>
                <button
                  onClick={() => setTrack('both')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-medium transition-colors ${
                    track === 'both' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                  disabled={loading}
                >
                  <Layers size={12} />
                  Both
                </button>
              </div>

              <button
                onClick={handleCheckIn}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all focus:outline-none cursor-pointer"
              >
                <Play size={16} fill="black" />
                Check In
              </button>
            </>
          ) : (
            <button
              onClick={handleCheckOut}
              disabled={loading}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-white text-white font-semibold text-sm hover:bg-white hover:text-black transition-all focus:outline-none shadow-lg shadow-white/5"
            >
              <Square size={14} fill="currentColor" />
              Check Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
