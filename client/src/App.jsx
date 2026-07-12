import React, { useState, useEffect } from 'react';
import LeaderboardDashboard from './components/LeaderboardDashboard';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CurriculumOverview from './components/CurriculumOverview';
import CalendarView from './components/CalendarView';
import Analytics from './components/Analytics';
import { api } from './utils/api';

export default function App() {
  const [selectedProfile, setSelectedProfile] = useState(localStorage.getItem('selectedProfile') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profileError, setProfileError] = useState(null);
  
  // Triggers analytics and calendar stats refresh when study events finish
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [analytics, setAnalytics] = useState(null);

  // Apply theme on initial load
  useEffect(() => {
    const theme = localStorage.getItem('selectedTheme') || 'green-black';
    if (theme === 'green-black') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, []);

  // Validate session/profile on load or profile switch
  useEffect(() => {
    checkProfile();
  }, [selectedProfile]);

  // Sync analytics whenever user's active day updates or sessions finish
  useEffect(() => {
    if (user) {
      fetchUserAnalytics();
    }
  }, [user, refreshTrigger]);

  const checkProfile = async () => {
    if (!selectedProfile) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setProfileError(null);
      const data = await api.getMe();
      setUser(data.user);
    } catch (err) {
      console.error("Failed to load user profile:", err);
      setProfileError("Could not connect to the profile workspace. Please make sure your backend server is running and database is connected!");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAnalytics = async () => {
    try {
      const stats = await api.getAnalytics();
      setAnalytics(stats);
    } catch (err) {
      console.error('Failed to update stats:', err);
    }
  };

  const handleSelectProfile = (profileName) => {
    setProfileError(null);
    localStorage.setItem('selectedProfile', profileName);
    setSelectedProfile(profileName);
  };

  const handleSwitchProfile = () => {
    localStorage.removeItem('selectedProfile');
    setSelectedProfile(null);
    setUser(null);
    setProfileError(null);
    setActiveTab('dashboard');
  };

  const handleDayAdvanced = (newDayNumber) => {
    setUser(prev => ({
      ...prev,
      current_day: newDayNumber
    }));
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSessionEnd = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-darkBg flex flex-col items-center justify-center gap-4 text-glow-emerald">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        <p className="text-sm font-semibold tracking-wide">Synchronizing profile dataset...</p>
      </div>
    );
  }

  // No profile selected -> Show competitive landing board
  if (!selectedProfile || !user) {
    return (
      <LeaderboardDashboard 
        onSelectProfile={handleSelectProfile} 
        profileError={profileError}
        clearProfileError={() => setProfileError(null)}
      />
    );
  }

  // Profile selected -> App Dashboard
  return (
    <div className="min-h-screen bg-darkBg pb-12 flex flex-col transition-colors duration-300">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onSwitchProfile={handleSwitchProfile}
        analytics={analytics}
      />

      <main className="flex-grow">
        {activeTab === 'dashboard' && (
          <Dashboard 
            user={user} 
            onDayAdvanced={handleDayAdvanced}
            onSessionEnd={handleSessionEnd}
          />
        )}
        {activeTab === 'curriculum' && (
          <CurriculumOverview 
            user={user} 
          />
        )}
        {activeTab === 'calendar' && (
          <CalendarView 
            user={user}
            analytics={analytics} 
          />
        )}
        {activeTab === 'analytics' && (
          <Analytics 
            refreshTrigger={refreshTrigger} 
          />
        )}
      </main>
    </div>
  );
}
