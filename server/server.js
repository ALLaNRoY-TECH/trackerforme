require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'grind-tracker-secret-key-180-days-dsa-cyber';

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin.startsWith('http://localhost:') || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Initialize Database with promise tracking
let dbInitialized = false;
const dbInitPromise = db.initDb().then(() => {
  dbInitialized = true;
  console.log("Database successfully loaded.");
}).catch(err => {
  console.error("Critical database error:", err);
  throw err;
});

// Middleware to await database initialization
app.use((req, res, next) => {
  if (dbInitialized) {
    next();
  } else {
    dbInitPromise.then(() => next()).catch(err => {
      res.status(500).json({ error: "Database failed to initialize: " + err.message });
    });
  }
});

// Helper for local date string in YYYY-MM-DD
function getLocalDateString() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
}

// Authentication Middleware
async function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.get("SELECT id, name, email, current_day, created_at FROM users WHERE id = ?", [decoded.id]);
    if (!user) {
      return res.status(401).json({ error: "Invalid session. User not found." });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Session expired or invalid token." });
  }
}

// AUTH ENDPOINTS

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Please provide name, email, and password." });
  }

  try {
    const existing = await db.get("SELECT id FROM users WHERE email = ?", [email.toLowerCase().trim()]);
    if (existing) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const result = await db.run(
      "INSERT INTO users (name, email, password_hash, current_day) VALUES (?, ?, ?, 0)",
      [name.trim(), email.toLowerCase().trim(), hash]
    );

    const token = jwt.sign({ id: result.id, name, email }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      user: {
        id: result.id,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        current_day: 0
      }
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error during registration." });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password." });
  }

  try {
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        current_day: user.current_day
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login." });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: "Successfully logged out." });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// CURRICULUM OVERVIEW ENDPOINT
app.get('/api/curriculum', requireAuth, async (req, res) => {
  try {
    const curriculumDays = await db.all("SELECT day_number, dsa_topic, cyber_topic FROM curriculum_days ORDER BY day_number ASC");
    const progressList = await db.all("SELECT day_number, dsa_completed, cyber_completed FROM user_day_progress WHERE user_id = ?", [req.user.id]);

    const progressMap = {};
    progressList.forEach(p => {
      progressMap[p.day_number] = {
        dsa_completed: p.dsa_completed === 1,
        cyber_completed: p.cyber_completed === 1
      };
    });

    const result = curriculumDays.map(day => {
      const prog = progressMap[day.day_number];
      let status = "Not Started";
      if (day.day_number < req.user.current_day) {
        status = "Completed";
      } else if (day.day_number === req.user.current_day) {
        status = "In Progress";
      }

      return {
        day_number: day.day_number,
        dsa_topic: day.dsa_topic,
        cyber_topic: day.cyber_topic,
        status,
        dsa_completed: prog ? prog.dsa_completed : false,
        cyber_completed: prog ? prog.cyber_completed : false
      };
    });

    res.json({ curriculum: result });
  } catch (err) {
    console.error("Curriculum fetch error:", err);
    res.status(500).json({ error: "Failed to fetch curriculum overview." });
  }
});

// Review specific past day (read-only tasks viewer)
app.get('/api/curriculum/day/:dayNumber', requireAuth, async (req, res) => {
  const dayNum = parseInt(req.params.dayNumber);
  if (dayNum > req.user.current_day) {
    return res.status(403).json({ error: "Cannot access future days." });
  }

  try {
    const dayData = await db.get("SELECT * FROM curriculum_days WHERE day_number = ?", [dayNum]);
    if (!dayData) {
      return res.status(404).json({ error: "Day not found." });
    }

    const progress = await db.get(
      "SELECT * FROM user_day_progress WHERE user_id = ? AND day_number = ?",
      [req.user.id, dayNum]
    );

    res.json({
      day_number: dayData.day_number,
      dsa_topic: dayData.dsa_topic,
      dsa_tasks: JSON.parse(dayData.dsa_tasks),
      dsa_resource: dayData.dsa_resource,
      cyber_topic: dayData.cyber_topic,
      cyber_tasks: JSON.parse(dayData.cyber_tasks),
      cyber_resource: dayData.cyber_resource,
      dsa_tasks_completed: progress ? JSON.parse(progress.dsa_tasks_completed) : [],
      cyber_tasks_completed: progress ? JSON.parse(progress.cyber_tasks_completed) : [],
      dsa_completed: progress ? progress.dsa_completed === 1 : false,
      cyber_completed: progress ? progress.cyber_completed === 1 : false
    });
  } catch (err) {
    console.error("Review day error:", err);
    res.status(500).json({ error: "Failed to fetch review day." });
  }
});

// DASHBOARD ENDPOINTS

app.get('/api/dashboard/today', requireAuth, async (req, res) => {
  const currentDay = req.user.current_day;

  try {
    const dayData = await db.get("SELECT * FROM curriculum_days WHERE day_number = ?", [currentDay]);
    if (!dayData) {
      return res.status(404).json({ error: "Active day data not found." });
    }

    let progress = await db.get(
      "SELECT * FROM user_day_progress WHERE user_id = ? AND day_number = ?",
      [req.user.id, currentDay]
    );

    if (!progress) {
      await db.run(
        "INSERT INTO user_day_progress (user_id, day_number, dsa_tasks_completed, cyber_tasks_completed, dsa_completed, cyber_completed) VALUES (?, ?, '[]', '[]', 0, 0)",
        [req.user.id, currentDay]
      );
      progress = {
        user_id: req.user.id,
        day_number: currentDay,
        dsa_tasks_completed: '[]',
        cyber_tasks_completed: '[]',
        dsa_completed: 0,
        cyber_completed: 0
      };
    }

    res.json({
      day_number: dayData.day_number,
      dsa_topic: dayData.dsa_topic,
      dsa_tasks: JSON.parse(dayData.dsa_tasks),
      dsa_resource: dayData.dsa_resource,
      cyber_topic: dayData.cyber_topic,
      cyber_tasks: JSON.parse(dayData.cyber_tasks),
      cyber_resource: dayData.cyber_resource,
      dsa_tasks_completed: JSON.parse(progress.dsa_tasks_completed),
      cyber_tasks_completed: JSON.parse(progress.cyber_tasks_completed),
      dsa_completed: progress.dsa_completed === 1,
      cyber_completed: progress.cyber_completed === 1
    });
  } catch (err) {
    console.error("Fetch today dashboard error:", err);
    res.status(500).json({ error: "Failed to load active study day." });
  }
});

app.post('/api/dashboard/task/toggle', requireAuth, async (req, res) => {
  const { track, taskText, completed } = req.body;
  const currentDay = req.user.current_day;

  if (track !== 'dsa' && track !== 'cyber') {
    return res.status(400).json({ error: "Invalid track specified." });
  }

  try {
    const dayData = await db.get("SELECT * FROM curriculum_days WHERE day_number = ?", [currentDay]);
    if (!dayData) return res.status(404).json({ error: "Day not found." });

    const totalTasks = JSON.parse(dayData[track + '_tasks']);

    let progress = await db.get(
      "SELECT * FROM user_day_progress WHERE user_id = ? AND day_number = ?",
      [req.user.id, currentDay]
    );

    if (!progress) return res.status(400).json({ error: "Progress not initialized." });

    let completedTasks = JSON.parse(progress[track + '_tasks_completed']);
    if (completed) {
      if (!completedTasks.includes(taskText)) {
        completedTasks.push(taskText);
      }
    } else {
      completedTasks = completedTasks.filter(t => t !== taskText);
    }

    // Check completion of the track
    const isCompleted = completedTasks.length >= totalTasks.length ? 1 : 0;

    await db.run(
      `UPDATE user_day_progress SET ${track}_tasks_completed = ?, ${track}_completed = ? WHERE user_id = ? AND day_number = ?`,
      [JSON.stringify(completedTasks), isCompleted, req.user.id, currentDay]
    );

    res.json({
      track,
      tasks_completed: completedTasks,
      completed: isCompleted === 1
    });
  } catch (err) {
    console.error("Toggle task error:", err);
    res.status(500).json({ error: "Failed to update task progress." });
  }
});

app.post('/api/dashboard/day/next', requireAuth, async (req, res) => {
  const currentDay = req.user.current_day;

  try {
    const progress = await db.get(
      "SELECT dsa_completed, cyber_completed FROM user_day_progress WHERE user_id = ? AND day_number = ?",
      [req.user.id, currentDay]
    );

    if (!progress || progress.dsa_completed !== 1 || progress.cyber_completed !== 1) {
      return res.status(400).json({ error: "Cannot advance day. Complete all DSA and Cyber tasks first!" });
    }

    const nextDay = currentDay + 1;
    
    // Set completion timestamp for active day
    await db.run(
      "UPDATE user_day_progress SET day_completed_at = CURRENT_TIMESTAMP WHERE user_id = ? AND day_number = ?",
      [req.user.id, currentDay]
    );

    // Update user's current day
    await db.run("UPDATE users SET current_day = ? WHERE id = ?", [nextDay, req.user.id]);

    res.json({
      message: `Advanced to Day ${nextDay}`,
      current_day: nextDay
    });
  } catch (err) {
    console.error("Next day advance error:", err);
    res.status(500).json({ error: "Failed to advance to the next day." });
  }
});

// TIMER ENDPOINTS

app.get('/api/dashboard/timer-status', requireAuth, async (req, res) => {
  try {
    const activeSession = await db.get(
      "SELECT check_in_time, track FROM study_sessions WHERE user_id = ? AND check_out_time IS NULL",
      [req.user.id]
    );

    if (activeSession) {
      res.json({
        checked_in: true,
        check_in_time: activeSession.check_in_time,
        track: activeSession.track
      });
    } else {
      res.json({ checked_in: false });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to query timer status." });
  }
});

app.post('/api/dashboard/check-in', requireAuth, async (req, res) => {
  const { track } = req.body; // 'dsa' | 'cyber' | 'both'
  const selectedTrack = ['dsa', 'cyber', 'both'].includes(track) ? track : 'both';

  try {
    const active = await db.get(
      "SELECT id FROM study_sessions WHERE user_id = ? AND check_out_time IS NULL",
      [req.user.id]
    );

    if (active) {
      return res.status(400).json({ error: "Already checked in. Check out first." });
    }

    const checkInTime = new Date().toISOString();
    await db.run(
      "INSERT INTO study_sessions (user_id, check_in_time, associated_day_number, track) VALUES (?, ?, ?, ?)",
      [req.user.id, checkInTime, req.user.current_day, selectedTrack]
    );

    res.json({
      message: "Checked in successfully.",
      check_in_time: checkInTime,
      track: selectedTrack
    });
  } catch (err) {
    console.error("Check-in error:", err);
    res.status(500).json({ error: "Check-in failed." });
  }
});

app.post('/api/dashboard/check-out', requireAuth, async (req, res) => {
  try {
    const activeSession = await db.get(
      "SELECT * FROM study_sessions WHERE user_id = ? AND check_out_time IS NULL",
      [req.user.id]
    );

    if (!activeSession) {
      return res.status(400).json({ error: "Not checked in." });
    }

    const checkOutTime = new Date().toISOString();
    const start = new Date(activeSession.check_in_time);
    const end = new Date(checkOutTime);
    
    // Duration in minutes
    const durationMinutes = Math.max(0.1, (end - start) / (1000 * 60)); 

    await db.run(
      "UPDATE study_sessions SET check_out_time = ?, duration_minutes = ? WHERE id = ?",
      [checkOutTime, durationMinutes, activeSession.id]
    );

    // Sync into daily logs
    const todayStr = getLocalDateString();
    
    const existingLog = await db.get(
      "SELECT total_minutes_studied FROM daily_log WHERE user_id = ? AND date = ?",
      [req.user.id, todayStr]
    );

    let newTotal = durationMinutes;
    if (existingLog) {
      newTotal = existingLog.total_minutes_studied + durationMinutes;
      await db.run(
        "UPDATE daily_log SET total_minutes_studied = ?, day_number_covered = ? WHERE user_id = ? AND date = ?",
        [newTotal, req.user.current_day, req.user.id, todayStr]
      );
    } else {
      await db.run(
        "INSERT INTO daily_log (user_id, date, total_minutes_studied, day_number_covered) VALUES (?, ?, ?, ?)",
        [req.user.id, todayStr, durationMinutes, req.user.current_day]
      );
    }

    res.json({
      message: "Checked out successfully.",
      session: {
        id: activeSession.id,
        check_in_time: activeSession.check_in_time,
        check_out_time: checkOutTime,
        duration_minutes: durationMinutes,
        track: activeSession.track
      },
      daily_total_minutes: newTotal
    });
  } catch (err) {
    console.error("Check-out error:", err);
    res.status(500).json({ error: "Check-out failed." });
  }
});

// CALENDAR ENDPOINT

app.get('/api/stats/calendar', requireAuth, async (req, res) => {
  try {
    const dailyLogs = await db.all(
      "SELECT date, total_minutes_studied, day_number_covered FROM daily_log WHERE user_id = ? ORDER BY date ASC",
      [req.user.id]
    );

    const completedDays = await db.all(
      "SELECT day_number, day_completed_at FROM user_day_progress WHERE user_id = ? AND day_completed_at IS NOT NULL",
      [req.user.id]
    );

    // Group logs by local date
    const calendarData = {};
    dailyLogs.forEach(log => {
      calendarData[log.date] = {
        studied: log.total_minutes_studied > 0,
        minutes_studied: log.total_minutes_studied,
        day_number_covered: log.day_number_covered,
        completed_days: []
      };
    });

    completedDays.forEach(day => {
      if (day.day_completed_at) {
        // Parse date from ISO TIMESTAMP
        const datePart = day.day_completed_at.split('T')[0];
        if (!calendarData[datePart]) {
          calendarData[datePart] = {
            studied: false,
            minutes_studied: 0,
            day_number_covered: day.day_number,
            completed_days: []
          };
        }
        calendarData[datePart].completed_days.push(day.day_number);
      }
    });

    res.json({ calendar: calendarData });
  } catch (err) {
    console.error("Calendar fetch error:", err);
    res.status(500).json({ error: "Failed to generate study calendar." });
  }
});

// ANALYTICS ENDPOINT

app.get('/api/stats/analytics', requireAuth, async (req, res) => {
  try {
    // 1. Total hours
    const totalRow = await db.get(
      "SELECT SUM(duration_minutes) as total FROM study_sessions WHERE user_id = ? AND check_out_time IS NOT NULL",
      [req.user.id]
    );
    const totalHours = totalRow.total ? (totalRow.total / 60) : 0;

    // 2. Week hours (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weekRow = await db.get(
      "SELECT SUM(duration_minutes) as total FROM study_sessions WHERE user_id = ? AND check_out_time IS NOT NULL AND check_in_time >= ?",
      [req.user.id, sevenDaysAgo.toISOString()]
    );
    const weekHours = weekRow.total ? (weekRow.total / 60) : 0;

    // 3. Month hours (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthRow = await db.get(
      "SELECT SUM(duration_minutes) as total FROM study_sessions WHERE user_id = ? AND check_out_time IS NOT NULL AND check_in_time >= ?",
      [req.user.id, thirtyDaysAgo.toISOString()]
    );
    const monthHours = monthRow.total ? (monthRow.total / 60) : 0;

    // 4. Split hours: DSA vs Cyber
    // 'dsa' contributes 100% to dsa_hours. 'cyber' contributes 100% to cyber_hours. 'both' splits 50/50.
    const sessions = await db.all(
      "SELECT duration_minutes, track FROM study_sessions WHERE user_id = ? AND check_out_time IS NOT NULL",
      [req.user.id]
    );

    let dsaMinutes = 0;
    let cyberMinutes = 0;

    sessions.forEach(s => {
      const min = s.duration_minutes || 0;
      if (s.track === 'dsa') {
        dsaMinutes += min;
      } else if (s.track === 'cyber') {
        cyberMinutes += min;
      } else {
        dsaMinutes += min / 2;
        cyberMinutes += min / 2;
      }
    });

    const dsaHours = dsaMinutes / 60;
    const cyberHours = cyberMinutes / 60;

    // 5. Topics completed counts
    const dsaCompletedRow = await db.get(
      "SELECT COUNT(*) as cnt FROM user_day_progress WHERE user_id = ? AND dsa_completed = 1",
      [req.user.id]
    );
    const cyberCompletedRow = await db.get(
      "SELECT COUNT(*) as cnt FROM user_day_progress WHERE user_id = ? AND cyber_completed = 1",
      [req.user.id]
    );

    // 6. Streak Calculations
    const studiedDatesList = await db.all(
      "SELECT DISTINCT date FROM daily_log WHERE user_id = ? AND total_minutes_studied > 0 ORDER BY date ASC",
      [req.user.id]
    );

    const studiedDates = studiedDatesList.map(row => row.date); // Array of YYYY-MM-DD strings

    let currentStreak = 0;
    let longestStreak = 0;

    if (studiedDates.length > 0) {
      // Helper function to check if two YYYY-MM-DD strings are consecutive days
      const isConsecutive = (d1Str, d2Str) => {
        const d1 = new Date(d1Str);
        const d2 = new Date(d2Str);
        const diffTime = Math.abs(d2 - d1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 1;
      };

      let tempStreak = 1;
      longestStreak = 1;

      for (let i = 1; i < studiedDates.length; i++) {
        if (isConsecutive(studiedDates[i - 1], studiedDates[i])) {
          tempStreak++;
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
        } else {
          tempStreak = 1;
        }
      }

      // Check current streak: must end on today or yesterday
      const todayStr = getLocalDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const lastStudiedDate = studiedDates[studiedDates.length - 1];

      if (lastStudiedDate === todayStr || lastStudiedDate === yesterdayStr) {
        // Trace back consecutive days from the end of the sorted array
        currentStreak = 1;
        for (let i = studiedDates.length - 1; i > 0; i--) {
          if (isConsecutive(studiedDates[i - 1], studiedDates[i])) {
            currentStreak++;
          } else {
            break;
          }
        }
      } else {
        currentStreak = 0;
      }
    }

    // 7. Consistency % = (days studied / days since joining) * 100
    const joinDate = new Date(req.user.created_at);
    const today = new Date();
    const diffTime = Math.abs(today - joinDate);
    const daysSinceJoining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const uniqueDaysStudied = studiedDates.length;
    const consistency = Math.min(100, Math.round((uniqueDaysStudied / daysSinceJoining) * 100));

    // 8. 30-day activity bar chart data
    const last30DaysData = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const logVal = await db.get(
        "SELECT total_minutes_studied FROM daily_log WHERE user_id = ? AND date = ?",
        [req.user.id, dateStr]
      );
      
      last30DaysData.push({
        date: dateStr,
        hours: logVal ? (logVal.total_minutes_studied / 60) : 0
      });
    }

    res.json({
      total_hours: totalHours,
      week_hours: weekHours,
      month_hours: monthHours,
      dsa_hours: dsaHours,
      cyber_hours: cyberHours,
      dsa_topics_completed: dsaCompletedRow.cnt,
      cyber_topics_completed: cyberCompletedRow.cnt,
      current_streak: currentStreak,
      longest_streak: longestStreak,
      consistency_percentage: consistency,
      activity_last_30_days: last30DaysData
    });
  } catch (err) {
    console.error("Analytics fetch error:", err);
    res.status(500).json({ error: "Failed to generate analytics dashboard data." });
  }
});

// Start Express Listener if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Grind Tracker server running on port ${PORT}`);
  });
}

module.exports = app;
