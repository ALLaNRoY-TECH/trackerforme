import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Flame, BookOpen, Clock, ArrowRight, Sparkles, Loader2, RefreshCw, CheckCircle2, User, Award, Shield, AlertTriangle } from 'lucide-react';
import { api } from '../utils/api';

export default function LeaderboardDashboard({ onSelectProfile, profileError, clearProfileError }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [publicCurriculum, setPublicCurriculum] = useState([]);
  const [loadingCurriculum, setLoadingCurriculum] = useState(false);
  const [timelineSearch, setTimelineSearch] = useState('');
  
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [tipIndex, setTipIndex] = useState(0);
  const [tipGlow, setTipGlow] = useState(false);

  const banterTips = [
    "Bubu, are you sleeping? Aroy is taking a 2-hour lead! Check in to catch up!",
    "Aroy is currently leading the pack, but Bubu's streak is burning hot!",
    "Keep pushing! The 180-day grind is a marathon, not a sprint.",
    "Did you know? Completing a topic daily gives you +10 points to consistency!",
    "Aroy and Bubu are battling it out in DSA & Cybersecurity. Who will win?",
    "Study tip: Use the pomodoro timer in your workspace for maximum efficiency!",
    "Cybersecurity tip: Always use strong passwords and enable multi-factor authentication!",
    "DSA tip: Practice writing clean code and explaining your logic step-by-step.",
    "Banter: Bubu is preparing a surprise cyber attack (study session) to dethrone Aroy!",
    "Banter: Aroy has logged in for an early morning session to secure the crown!"
  ];

  const confettiRequestRef = useRef();

  useEffect(() => {
    fetchLeaderboardStats();
    fetchPublicCurriculum();
    return () => {
      if (confettiRequestRef.current) {
        cancelAnimationFrame(confettiRequestRef.current);
      }
    };
  }, []);

  const fetchLeaderboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      if (clearProfileError) clearProfileError();
      const data = await api.getComparison();
      setStats(data);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend server. Please verify the server is running on http://localhost:5000 and the database is connected.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPublicCurriculum = async () => {
    try {
      setLoadingCurriculum(true);
      const data = await api.getPublicCurriculum();
      setPublicCurriculum(data.curriculum || []);
    } catch (err) {
      console.error("Failed to fetch public curriculum:", err);
      // Fallback mock curriculum so the user always has a timeline
      const mock = [];
      for (let i = 1; i <= 180; i++) {
        mock.push({
          day_number: i,
          dsa_topic: `DSA Practice on Algorithms (Day ${i})`,
          cyber_topic: `Cybersecurity Defensive Architecture (Day ${i})`
        });
      }
      setPublicCurriculum(mock);
    } finally {
      setLoadingCurriculum(false);
    }
  };

  // Zero-dependency pure Canvas Confetti animation (Monochrome Silver/White/Gray)
  const triggerConfetti = () => {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const particles = [];
    const colors = ['#ffffff', '#f4f4f5', '#e4e4e7', '#d4d4d8', '#a1a1aa', '#71717a', '#ffffff'];
    
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height - 50,
        vx: (Math.random() - 0.5) * 20,
        vy: -Math.random() * 15 - 8,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
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

  const cycleTip = () => {
    setTipGlow(true);
    setTipIndex((prev) => (prev + 1) % banterTips.length);
    triggerConfetti();
    setTimeout(() => setTipGlow(false), 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg flex flex-col items-center justify-center gap-4 text-glow-emerald">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
        <p className="text-sm font-semibold tracking-wide text-white">Loading Leaderboard Standings...</p>
      </div>
    );
  }

  // Fallback defaults if database isn't populated or returns error
  const aroy = stats?.aroy || { name: 'aroy', total_hours: 0, current_streak: 0, completed_topics: 0, current_day: 0 };
  const bubu = stats?.bubu || { name: 'bubu', total_hours: 0, current_streak: 0, completed_topics: 0, current_day: 0 };
  const leader = stats?.leader || 'aroy';

  const getLevel = (hours) => Math.floor(hours / 10) + 1;
  const getProgressPercentage = (topics) => ((topics / 360) * 100).toFixed(1);

  const getBadges = (userStats) => {
    const badges = [];
    const lvl = getLevel(userStats.total_hours);
    if (lvl > 1) badges.push({ name: `Lvl ${lvl} Grinder`, icon: Award, color: 'text-zinc-200 bg-white/5' });
    if (userStats.current_streak >= 3) badges.push({ name: 'On Fire', icon: Flame, color: 'text-zinc-200 bg-white/5' });
    if (userStats.completed_topics >= 10) badges.push({ name: 'DSA Beast', icon: Shield, color: 'text-zinc-200 bg-white/5' });
    if (userStats.total_hours > 5) badges.push({ name: 'Night Owl', icon: Sparkles, color: 'text-zinc-200 bg-white/5' });
    if (badges.length === 0) badges.push({ name: 'Initiate', icon: User, color: 'text-zinc-400 bg-white/5' });
    return badges;
  };

  const filteredTimeline = publicCurriculum.filter(day => 
    day.day_number.toString().includes(timelineSearch) ||
    day.dsa_topic.toLowerCase().includes(timelineSearch.toLowerCase()) ||
    day.cyber_topic.toLowerCase().includes(timelineSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen px-4 py-8 md:py-16 relative overflow-hidden transition-colors duration-300">
      {/* Canvas for zero-dependency confetti */}
      <canvas id="confetti-canvas" className="fixed inset-0 pointer-events-none z-50 w-full h-full" />

      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/2 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/2 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header section with Monochrome logo */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2 uppercase text-glow-emerald flex items-center gap-2">
              GRIND <span className="text-zinc-400">STANDINGS</span>
            </h1>
            <p className="text-sm text-zinc-500">Competitive DSA & Cybersecurity Tracker</p>
          </div>
          
          {/* Refresh Button */}
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchLeaderboardStats}
              className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-zinc-400 hover:text-white hover:border-white/30 transition-all flex items-center justify-center"
              title="Refresh Stats"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* CONNECTION OR PROFILE REDIRECTION ERRORS */}
        {(error || profileError) && (
          <div className="mb-8 p-5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle size={18} className="text-white shrink-0 animate-pulse" />
              <span>Connection Refused</span>
            </div>
            <p className="max-w-xl text-zinc-400 text-xs leading-relaxed">
              {error || profileError}
            </p>
            <div className="flex gap-3 mt-1">
              <button 
                onClick={fetchLeaderboardStats}
                className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/25 hover:bg-white hover:text-black transition-all text-xs font-semibold flex items-center gap-1.5"
              >
                <RefreshCw size={12} /> Retry Server Check
              </button>
            </div>
          </div>
        )}

        {/* Lead Spotlight Card */}
        <div 
          onClick={cycleTip}
          className={`glass-panel rounded-2xl p-6 mb-10 text-center relative overflow-hidden group hover:border-white/25 transition-all duration-300 cursor-pointer ${
            tipGlow ? 'shadow-[0_0_25px_rgba(255,255,255,0.08)] scale-[1.01]' : ''
          }`}
        >
          <div className="absolute inset-0 bg-white/1 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-full bg-white/5 text-white group-hover:scale-110 transition-transform duration-300">
              <Trophy size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2">
            <span className="text-zinc-300 uppercase tracking-wide">{leader}</span> is currently leading the board!
          </h2>
          <p className="text-sm text-zinc-300 max-w-lg mx-auto italic flex items-center justify-center gap-1.5 select-none">
            <Sparkles size={16} className="text-white shrink-0 animate-pulse" />
            "{banterTips[tipIndex]}"
          </p>
          <span className="inline-block mt-3 text-[10px] text-zinc-600 tracking-wider uppercase font-semibold group-hover:text-white transition-colors">
            Click to trigger banter & confetti
          </span>
        </div>

        {/* Head to Head Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          
          {/* Aroy Profile Card */}
          <div className={`glass-panel rounded-2xl p-8 flex flex-col justify-between border-t-4 border-t-white transition-all duration-300 ${
            selectedCompetitor === 'aroy' ? 'shadow-[0_0_30px_rgba(255,255,255,0.08)] border-white/30 scale-[1.01]' : 'hover:scale-[1.01]'
          }`}>
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-wider">AROY</h3>
                  <p className="text-xs text-zinc-400 font-semibold tracking-widest mt-1">COMPETITOR #1</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  {leader === 'aroy' && (
                    <span className="bg-white/5 text-white border border-white/20 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                      <Trophy size={12} /> LEADING
                    </span>
                  )}
                  <button 
                    onClick={() => setSelectedCompetitor(selectedCompetitor === 'aroy' ? null : 'aroy')}
                    className="text-[10px] text-zinc-400 hover:text-white font-bold tracking-wider uppercase border border-white/10 px-2 py-0.5 rounded-md hover:bg-white/5 transition-all"
                  >
                    {selectedCompetitor === 'aroy' ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>

              {/* Stats stack */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-3.5 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3 text-zinc-300 text-sm">
                    <Clock size={18} className="text-white" />
                    <span>Total Studied</span>
                  </div>
                  <span className="text-xl font-bold text-white">{aroy.total_hours.toFixed(1)} hrs</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3 text-zinc-300 text-sm">
                    <Flame size={18} className="text-white" />
                    <span>Active Streak</span>
                  </div>
                  <span className="text-xl font-bold text-white">{aroy.current_streak} days</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3 text-zinc-300 text-sm">
                    <BookOpen size={18} className="text-white" />
                    <span>Topics Done</span>
                  </div>
                  <span className="text-xl font-bold text-white">{aroy.completed_topics}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                triggerConfetti();
                onSelectProfile('aroy');
              }}
              className="w-full py-4 rounded-xl bg-white text-black font-extrabold text-sm hover:bg-zinc-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-white/10"
            >
              Enter Workspace
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Bubu Profile Card */}
          <div className={`glass-panel rounded-2xl p-8 flex flex-col justify-between border-t-4 border-t-zinc-600 transition-all duration-300 ${
            selectedCompetitor === 'bubu' ? 'shadow-[0_0_30px_rgba(255,255,255,0.08)] border-white/30 scale-[1.01]' : 'hover:scale-[1.01]'
          }`}>
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-wider">BUBU</h3>
                  <p className="text-xs text-zinc-400 font-semibold tracking-widest mt-1">COMPETITOR #2</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  {leader === 'bubu' && (
                    <span className="bg-white/5 text-white border border-white/20 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                      <Trophy size={12} /> LEADING
                    </span>
                  )}
                  <button 
                    onClick={() => setSelectedCompetitor(selectedCompetitor === 'bubu' ? null : 'bubu')}
                    className="text-[10px] text-zinc-400 hover:text-white font-bold tracking-wider uppercase border border-white/10 px-2 py-0.5 rounded-md hover:bg-white/5 transition-all"
                  >
                    {selectedCompetitor === 'bubu' ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>

              {/* Stats stack */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-3.5 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3 text-zinc-300 text-sm">
                    <Clock size={18} className="text-white" />
                    <span>Total Studied</span>
                  </div>
                  <span className="text-xl font-bold text-white">{bubu.total_hours.toFixed(1)} hrs</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3 text-zinc-300 text-sm">
                    <Flame size={18} className="text-white" />
                    <span>Active Streak</span>
                  </div>
                  <span className="text-xl font-bold text-white">{bubu.current_streak} days</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3 text-zinc-300 text-sm">
                    <BookOpen size={18} className="text-white" />
                    <span>Topics Done</span>
                  </div>
                  <span className="text-xl font-bold text-white">{bubu.completed_topics}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                triggerConfetti();
                onSelectProfile('bubu');
              }}
              className="w-full py-4 rounded-xl bg-zinc-800 text-white font-extrabold text-sm hover:bg-zinc-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-lg border border-white/10"
            >
              Enter Workspace
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

        {/* EXPANDABLE COMPETITOR DETAILS PANEL */}
        {selectedCompetitor && (
          <div className="glass-panel rounded-2xl p-6 mb-10 border-t-2 border-t-white/40 animate-fadeIn">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <h3 className="font-extrabold text-white text-lg tracking-wider uppercase flex items-center gap-2">
                <Sparkles size={18} className="text-white" />
                {selectedCompetitor} Detailed Statistics
              </h3>
              <button 
                onClick={() => setSelectedCompetitor(null)}
                className="p-1 rounded bg-black/25 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                <span className="text-xs text-zinc-500 font-semibold uppercase">Profile Progression</span>
                <span className="text-3xl font-black text-white my-3">Level {selectedCompetitor === 'aroy' ? getLevel(aroy.total_hours) : getLevel(bubu.total_hours)}</span>
                <span className="text-xs text-zinc-400 font-medium">10 study hours per Level</span>
              </div>
              
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                <span className="text-xs text-zinc-500 font-semibold uppercase">Completion Rate</span>
                <span className="text-3xl font-black text-white my-3">
                  {selectedCompetitor === 'aroy' ? getProgressPercentage(aroy.completed_topics) : getProgressPercentage(bubu.completed_topics)}%
                </span>
                <span className="text-xs text-zinc-400 font-medium">Out of 360 curriculum items</span>
              </div>

              <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                <span className="text-xs text-zinc-500 font-semibold uppercase">Curriculum Target</span>
                <span className="text-3xl font-black text-white my-3">
                  Day {selectedCompetitor === 'aroy' ? aroy.current_day : bubu.current_day}
                </span>
                <span className="text-xs text-zinc-400 font-medium">Next active study target</span>
              </div>
            </div>

            {/* Badges and Milestones */}
            <div className="mt-6 border-t border-white/5 pt-5">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider block mb-3">Earned Achievements</span>
              <div className="flex flex-wrap gap-2">
                {getBadges(selectedCompetitor === 'aroy' ? aroy : bubu).map((badge, idx) => {
                  const Icon = badge.icon;
                  return (
                    <div key={idx} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/5 text-xs font-semibold ${badge.color}`}>
                      <Icon size={14} />
                      {badge.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Comparative Visual Bar */}
        <div className="glass-panel rounded-2xl p-6 mb-10">
          <div className="flex justify-between items-center mb-3 text-sm text-zinc-400 font-bold">
            <span>AROY ({aroy.total_hours.toFixed(1)}h)</span>
            <span>BUBU ({bubu.total_hours.toFixed(1)}h)</span>
          </div>
          
          <div className="w-full h-4 bg-zinc-950 rounded-full overflow-hidden flex border border-white/10 p-0.5">
            {aroy.total_hours === 0 && bubu.total_hours === 0 ? (
              <div className="w-1/2 h-full bg-zinc-800 rounded-full" />
            ) : (
              <>
                <div 
                  className="h-full bg-white rounded-l-full transition-all duration-500" 
                  style={{ width: `${(aroy.total_hours / (aroy.total_hours + bubu.total_hours || 1)) * 100}%` }}
                />
                <div 
                  className="h-full bg-zinc-700 rounded-r-full transition-all duration-500" 
                  style={{ width: `${(bubu.total_hours / (aroy.total_hours + bubu.total_hours || 1)) * 100}%` }}
                />
              </>
            )}
          </div>
        </div>

        {/* SCROLLABLE 180-DAY GRIND TIMELINE */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/5 pb-4">
            <div>
              <h3 className="font-extrabold text-white text-lg tracking-wider flex items-center gap-2">
                <BookOpen size={18} className="text-white" />
                180-Day Grind Timeline Comparison
              </h3>
              <p className="text-xs text-zinc-500">Track study content and current positions side by side.</p>
            </div>
            
            <input 
              type="text" 
              placeholder="Search days or topics..." 
              value={timelineSearch}
              onChange={(e) => setTimelineSearch(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-white/50 transition-all max-w-[200px]"
            />
          </div>

          <div className="overflow-y-auto max-h-[380px] pr-2 space-y-3 custom-scrollbar">
            {loadingCurriculum ? (
              <div className="flex justify-center items-center py-10 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span className="text-xs text-zinc-500">Indexing timeline structure...</span>
              </div>
            ) : filteredTimeline.length === 0 ? (
              <div className="text-center py-10 text-xs text-zinc-500">
                No matching days found.
              </div>
            ) : (
              filteredTimeline.map((day) => {
                const aroyCompleted = day.day_number < aroy.current_day;
                const aroyActive = day.day_number === aroy.current_day;
                
                const bubuCompleted = day.day_number < bubu.current_day;
                const bubuActive = day.day_number === bubu.current_day;

                return (
                  <div 
                    key={day.day_number}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 bg-black/20 ${
                      aroyActive || bubuActive ? 'border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.03)]' : 'border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-black text-xs shrink-0 ${
                        aroyActive || bubuActive ? 'bg-white text-black' : 'bg-white/5 text-zinc-400 border border-white/5'
                      }`}>
                        <span>DAY</span>
                        <span>{day.day_number}</span>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-200 truncate">
                          <span className="font-semibold text-white">DSA:</span>
                          <span className="truncate">{day.dsa_topic}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-200 truncate mt-1">
                          <span className="font-semibold text-zinc-400">Cyber:</span>
                          <span className="truncate">{day.cyber_topic}</span>
                        </div>
                      </div>
                    </div>

                    {/* Competitor status indicators */}
                    <div className="flex items-center gap-3 shrink-0 ml-4 border-l border-white/5 pl-4">
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Aroy</span>
                        {aroyCompleted ? (
                          <CheckCircle2 size={16} className="text-white" />
                        ) : aroyActive ? (
                          <span className="text-[10px] bg-white/10 border border-white/30 text-white px-1.5 py-0.5 rounded font-black uppercase">Active</span>
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-white/5 border border-white/10" />
                        )}
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Bubu</span>
                        {bubuCompleted ? (
                          <CheckCircle2 size={16} className="text-zinc-400" />
                        ) : bubuActive ? (
                          <span className="text-[10px] bg-white/10 border border-white/30 text-white px-1.5 py-0.5 rounded font-black uppercase">Active</span>
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-white/5 border border-white/10" />
                        )}
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
