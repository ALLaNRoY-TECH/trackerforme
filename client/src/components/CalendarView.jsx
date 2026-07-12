import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Clock, Flame, Calendar as CalIcon } from 'lucide-react';
import { api } from '../utils/api';

export default function CalendarView({ user, analytics }) {
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Local YYYY-MM-DD helper
  const getLocalDateString = (d) => {
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - (offset * 60 * 1000));
    return local.toISOString().split('T')[0];
  };

  const [selectedDateStr, setSelectedDateStr] = useState(getLocalDateString(new Date()));

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const data = await api.getCalendar();
      setCalendarData(data.calendar || {});
    } catch (err) {
      console.error('Failed to fetch calendar:', err);
    } finally {
      setLoading(false);
    }
  };

  // Switch months
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create calendar cells array
  const cells = [];
  
  // Fill empty leading cells
  for (let i = 0; i < startDayOfWeek; i++) {
    cells.push(null);
  }

  // Fill actual month days
  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day);
    const dateStr = getLocalDateString(cellDate);
    cells.push({
      day,
      dateStr,
      data: calendarData[dateStr] || { studied: false, minutes_studied: 0, completed_days: [] }
    });
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const selectedData = calendarData[selectedDateStr] || {
    studied: false,
    minutes_studied: 0,
    completed_days: []
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Assembling calendar matrix...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      
      {/* Calendar Header with Streaks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-5 border border-white/5 flex items-center gap-4">
          <div className="p-3.5 bg-amber-500/10 rounded-xl text-amber-400">
            <Flame size={20} className="fill-amber-400/25" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Current Streak</p>
            <p className="text-xl font-extrabold text-white">
              {analytics ? analytics.current_streak : 0} Days
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/5 flex items-center gap-4">
          <div className="p-3.5 bg-emerald-500/10 rounded-xl text-emerald-400">
            <Flame size={20} className="fill-emerald-400/25" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Longest Streak</p>
            <p className="text-xl font-extrabold text-white">
              {analytics ? analytics.longest_streak : 0} Days
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/5 flex items-center gap-4">
          <div className="p-3.5 bg-indigo-500/10 rounded-xl text-indigo-400">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Consistency</p>
            <p className="text-xl font-extrabold text-white">
              {analytics ? analytics.consistency_percentage : 0}% Study Days
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Calendar & Sidebar Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Calendar Grid */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CalIcon size={18} className="text-emerald-400" />
              {monthNames[month]} {year}
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={handlePrevMonth}
                className="p-2 rounded-lg border border-white/5 hover:border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-2 rounded-lg border border-white/5 hover:border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {cells.map((cell, idx) => {
              if (cell === null) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }

              const { day, dateStr, data } = cell;
              const isSelected = selectedDateStr === dateStr;
              
              let cellClass = "day-missed";
              if (data.studied) {
                cellClass = "day-studied";
              }

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`aspect-square rounded-xl text-sm font-semibold flex flex-col items-center justify-center relative transition-all border ${cellClass} ${
                    isSelected ? 'ring-2 ring-indigo-500 border-indigo-400 scale-[1.03] z-10' : ''
                  }`}
                >
                  <span className={data.studied ? 'text-emerald-400 font-bold' : 'text-gray-400'}>
                    {day}
                  </span>
                  
                  {/* Visual bullet representing completed program day milestones */}
                  {data.completed_days && data.completed_days.length > 0 && (
                    <span className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-md shadow-indigo-400/50" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar details */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Selected Date</span>
              <h4 className="text-xl font-bold text-white">
                {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString(undefined, {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </h4>
            </div>

            <div className="h-px bg-white/5" />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Clock size={16} />
                </span>
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Duration Studied</span>
                  <p className="text-sm font-semibold text-white">
                    {selectedData.studied 
                      ? `${Math.round(selectedData.minutes_studied)} minutes` 
                      : '0 minutes (No study logs found)'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <BookOpen size={16} />
                </span>
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Program Track Status</span>
                  <p className="text-sm font-semibold text-white">
                    {selectedData.day_number_covered !== undefined
                      ? `Active Day: Day ${selectedData.day_number_covered}`
                      : 'No active curriculum coverage'}
                  </p>
                </div>
              </div>
            </div>

            {selectedData.completed_days && selectedData.completed_days.length > 0 && (
              <>
                <div className="h-px bg-white/5" />
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Milestones Completed</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedData.completed_days.map((dayNum) => (
                      <span key={dayNum} className="px-2.5 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
                        Day {dayNum} Done
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="text-center text-xs text-gray-500 pt-6">
            Click any cell on the grid to review its study records.
          </div>
        </div>

      </div>

    </div>
  );
}
