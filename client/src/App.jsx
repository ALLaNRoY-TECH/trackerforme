import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CurriculumOverview from './components/CurriculumOverview';
import CalendarView from './components/CalendarView';
import Analytics from './components/Analytics';
import { api } from './utils/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  
  // Triggers analytics and calendar stats refresh when study events finish
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [analytics, setAnalytics] = useState(null);

  // Validate authentication on load
  useEffect(() => {
    checkAuth();
  }, []);

  // Sync analytics whenever user's active day updates or sessions finish
  useEffect(() => {
    if (user) {
      fetchUserAnalytics();
    }
  }, [user, refreshTrigger]);

  const checkAuth = async () => {
    try {
      const data = await api.getMe();
      setUser(data.user);
    } catch (err) {
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

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      setUser(null);
      setActiveTab('dashboard');
    } catch (err) {
      console.error(err);
    }
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
      <div className="min-h-screen bg-[#070b13] flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        <p className="text-sm text-gray-400 font-semibold tracking-wide">Validating session security credentials...</p>
      </div>
    );
  }

  // Not logged in -> Auth views
  if (!user) {
    return authView === 'login' ? (
      <Login 
        onLoginSuccess={handleLoginSuccess} 
        onSwitchToRegister={() => setAuthView('register')} 
      />
    ) : (
      <Register 
        onRegisterSuccess={handleRegisterSuccess} 
        onSwitchToLogin={() => setAuthView('login')} 
      />
    );
  }

  // Logged in -> App Dashboard
  return (
    <div className="min-h-screen bg-[#070b13] pb-12 flex flex-col">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout}
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
