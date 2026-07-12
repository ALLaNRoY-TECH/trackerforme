// API utility functions for Grind Tracker
const BASE_URL = '';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  // Attach x-username header for passwordless switching
  const selectedProfile = localStorage.getItem('selectedProfile') || 'aroy';
  options.headers = {
    ...options.headers,
    'x-username': selectedProfile
  };
  
  if (options.body && typeof options.body === 'object') {
    options.headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, options);
  
  let data;
  try {
    data = await response.json();
  } catch (err) {
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    throw new Error('Invalid response from server.');
  }

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export const api = {
  // Auth
  register: (name, email, password) => request('/api/auth/register', { method: 'POST', body: { name, email, password } }),
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password } }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  getMe: () => request('/api/auth/me', { method: 'GET' }),

  // Curriculum overview
  getCurriculum: () => request('/api/curriculum', { method: 'GET' }),
  getCurriculumDay: (dayNum) => request(`/api/curriculum/day/${dayNum}`, { method: 'GET' }),

  // Dashboard today tasks
  getToday: () => request('/api/dashboard/today', { method: 'GET' }),
  toggleTask: (track, taskText, completed) => request('/api/dashboard/task/toggle', { method: 'POST', body: { track, taskText, completed } }),
  advanceDay: () => request('/api/dashboard/day/next', { method: 'POST' }),

  // Timer
  getTimerStatus: () => request('/api/dashboard/timer-status', { method: 'GET' }),
  checkIn: (track) => request('/api/dashboard/check-in', { method: 'POST', body: { track } }),
  checkOut: () => request('/api/dashboard/check-out', { method: 'POST' }),

  // Analytics & Stats
  getCalendar: () => request('/api/stats/calendar', { method: 'GET' }),
  getAnalytics: () => request('/api/stats/analytics', { method: 'GET' }),
  getComparison: () => request('/api/stats/comparison', { method: 'GET' })
};
