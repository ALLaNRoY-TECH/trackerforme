import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Timer as TimerIcon, Shield, Code, Layers } from 'lucide-react';
import { api } from '../utils/api';

export default function Timer({ onSessionEnd }) {
  const [checkedIn, setCheckedIn] = useState(false);
  const [isPaused, setIsPaused] = useState(localStorage.getItem('timer_paused') === 'true');
  const [track, setTrack] = useState(localStorage.getItem('timer_track') || 'both');
  const [seconds, setSeconds] = useState(parseInt(localStorage.getItem('timer_seconds')) || 0);
  const [loading, setLoading] = useState(false);

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
        // Active session on server overrides local paused storage
        setCheckedIn(true);
        setIsPaused(false);
        setTrack(status.track || 'both');
        
        const elapsed = Math.floor((Date.now() - new Date(status.check_in_time).getTime()) / 1000);
        setSeconds(Math.max(0, elapsed));
        startLocalTimer(new Date(status.check_in_time));
        
        // Clear local storage overrides
        localStorage.removeItem('timer_paused');
        localStorage.removeItem('timer_seconds');
        localStorage.removeItem('timer_track');
      } else {
        // No active session on server. Check if we are locally paused
        const locallyPaused = localStorage.getItem('timer_paused') === 'true';
        if (locallyPaused) {
          setCheckedIn(true);
          setIsPaused(true);
          const savedSecs = parseInt(localStorage.getItem('timer_seconds')) || 0;
          setSeconds(savedSecs);
          const savedTrack = localStorage.getItem('timer_track') || 'both';
          setTrack(savedTrack);
        } else {
          setCheckedIn(false);
          setIsPaused(false);
          setSeconds(0);
        }
      }
    } catch (err) {
      console.error('Failed to get timer status:', err);
    }
  };

  const startLocalTimer = (start, initialSeconds = 0) => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start.getTime()) / 1000) + initialSeconds;
      setSeconds(Math.max(0, elapsed));
    }, 1000);
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const res = await api.checkIn(track);
      setCheckedIn(true);
      setIsPaused(false);
      const start = new Date(res.check_in_time);
      setSeconds(0);
      startLocalTimer(start);
      
      localStorage.removeItem('timer_paused');
      localStorage.removeItem('timer_seconds');
      localStorage.removeItem('timer_track');
    } catch (err) {
      alert(err.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    setLoading(true);
    try {
      // Check out of the server session to save progress
      await api.checkOut();
      clearInterval(intervalRef.current);
      setIsPaused(true);
      
      // Store state in local storage
      localStorage.setItem('timer_paused', 'true');
      localStorage.setItem('timer_seconds', seconds.toString());
      localStorage.setItem('timer_track', track);
    } catch (err) {
      alert(err.message || 'Failed to pause session');
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    setLoading(true);
    try {
      // Check in to a new server session
      const res = await api.checkIn(track);
      setIsPaused(false);
      const start = new Date(res.check_in_time);
      // Start local timer ticking from the current accumulated seconds
      startLocalTimer(start, seconds);
      
      localStorage.removeItem('timer_paused');
      localStorage.removeItem('timer_seconds');
      localStorage.removeItem('timer_track');
    } catch (err) {
      alert(err.message || 'Failed to resume session');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      let sessionDetails;
      if (!isPaused) {
        // If not paused, we need to check out on the server
        const res = await api.checkOut();
        sessionDetails = res.session;
      }
      
      clearInterval(intervalRef.current);
      setCheckedIn(false);
      setIsPaused(false);
      setSeconds(0);
      
      localStorage.removeItem('timer_paused');
      localStorage.removeItem('timer_seconds');
      localStorage.removeItem('timer_track');
      
      if (onSessionEnd) {
        onSessionEnd(sessionDetails);
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
      {checkedIn && !isPaused && (
        <div className="absolute inset-0 bg-white/5 animate-pulse pointer-events-none" />
      )}

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Title and stats */}
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-xl ${checkedIn && !isPaused ? 'bg-white/10 text-white animate-pulse' : 'bg-white/5 text-zinc-400'}`}>
            <TimerIcon size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Study Session Timer</h2>
            <p className="text-xs text-zinc-400">
              {checkedIn 
                ? (isPaused ? `Paused: ${track.toUpperCase()}` : `Currently studying: ${track.toUpperCase()}`)
                : 'Check in to log study hours'}
            </p>
          </div>
        </div>

        {/* Live Timer Counter */}
        <div className={`text-3xl md:text-4xl font-mono font-bold tracking-widest text-white text-glow-emerald ${isPaused ? 'opacity-60' : ''}`}>
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
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    track === 'dsa' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                  disabled={loading}
                >
                  <Code size={12} />
                  DSA
                </button>
                <button
                  onClick={() => setTrack('cyber')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    track === 'cyber' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
                  }`}
                  disabled={loading}
                >
                  <Shield size={12} />
                  Cyber
                </button>
                <button
                  onClick={() => setTrack('both')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
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
            <div className="flex items-center gap-3 w-full md:w-auto">
              {isPaused ? (
                <button
                  onClick={handleResume}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all focus:outline-none cursor-pointer"
                >
                  <Play size={14} fill="currentColor" />
                  Resume
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-white text-white font-semibold text-sm hover:bg-white hover:text-black transition-all focus:outline-none cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="5" y="4" width="4" height="16" />
                    <rect x="15" y="4" width="4" height="16" />
                  </svg>
                  Pause
                </button>
              )}

              <button
                onClick={handleCheckOut}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-white/20 text-zinc-400 font-semibold text-sm hover:border-white hover:text-white transition-all focus:outline-none cursor-pointer"
              >
                <Square size={12} fill="currentColor" />
                Finish & Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
