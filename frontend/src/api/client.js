// Production uses same-origin Vercel rewrites so session and CSRF cookies are
// first-party in the browser. Keep API_BASE_URL only for local/dev overrides.
export const API_BASE_URL = (import.meta.env.DEV ? (import.meta.env.API_BASE_URL || '') : '').replace(/\/$/, '');
const API_BASE = API_BASE_URL;
let csrfToken = '';

async function readPayload(response) {
  const contentType = response.headers.get('content-type') || '';
  return contentType.includes('application/json') ? response.json() : response.text();
}

async function ensureCsrf() {
  if (csrfToken) return csrfToken;
  const response = await fetch(`${API_BASE}/api/session`, { credentials: 'include', cache: 'no-store' });
  const payload = await readPayload(response);
  if (response.ok && payload && typeof payload === 'object') csrfToken = payload.csrf_token || '';
  return csrfToken;
}

export async function apiRequest(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const headers = { ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...(options.headers || {}) };
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const token = await ensureCsrf();
    if (token) headers['X-CSRF-Token'] = token;
  }
  let response = await fetch(`${API_BASE}${path}`, { credentials: 'include', cache: 'no-store', ...options, method, headers });
  let payload = await readPayload(response);
  // A session may be rotated by login, OAuth, or another tab. Refresh the
  // session-bound token once and retry only when the server explicitly rejects
  // the CSRF token; never disable CSRF validation.
  if (!response.ok && method !== 'GET' && response.status === 400 &&
      typeof payload === 'object' && /security token/i.test(payload?.error || '')) {
    csrfToken = '';
    const freshToken = await ensureCsrf();
    if (freshToken) {
      headers['X-CSRF-Token'] = freshToken;
      response = await fetch(`${API_BASE}${path}`, { credentials: 'include', cache: 'no-store', ...options, method, headers });
      payload = await readPayload(response);
    }
  }
  if (!response.ok) {
    const message = typeof payload === 'object' && payload?.error ? payload.error : `Request failed (${response.status})`;
    if (response.status === 400 && /security token/i.test(message)) csrfToken = '';
    if (response.status === 401 && typeof window !== 'undefined' && !path.startsWith('/api/auth/')) {
      window.dispatchEvent(new CustomEvent('learnmeets:unauthorized'));
    }
    throw new Error(message);
  }
  return payload;
}

const json = (method, body) => ({ method, body: JSON.stringify(body) });
export const api = {
  session: async () => { const result = await apiRequest('/api/session'); csrfToken = result.csrf_token || csrfToken; return result; },
  login: (data) => apiRequest('/api/auth/login', json('POST', data)),
  register: (data) => apiRequest('/api/auth/register', json('POST', data)),
  logout: () => apiRequest('/api/auth/logout', json('POST', {})),
  updateAccount: (data) => apiRequest('/api/account/profile', json('POST', data)),
  changePassword: (data) => apiRequest('/api/account/password', json('POST', data)),
  resendVerification: (email) => apiRequest('/api/auth/resend-verification', json('POST', { email })),
  forgotPassword: (email) => apiRequest('/api/auth/forgot-password', json('POST', { email })),
  resetPassword: (token, password) => apiRequest('/api/auth/reset-password', json('POST', { token, password })),
  requestEmailChange: (data) => apiRequest('/api/account/email-change', json('POST', data)),
  deleteAccount: (data) => apiRequest('/api/account/delete', json('POST', data)),
  dashboard: () => apiRequest('/api/dashboard'),
  materials: () => apiRequest('/api/materials'),
  uploadMaterial: (formData) => apiRequest('/api/materials', { method: 'POST', body: formData }),
  deleteMaterial: (id) => apiRequest(`/api/materials/${id}/delete`, json('POST', {})),
  chatHistory: () => apiRequest('/api/chat'),
  sendChat: (data) => apiRequest('/api/chat', json('POST', data)),
  activeQuiz: () => apiRequest('/api/quiz/active'),
  generateQuiz: (data) => apiRequest('/api/quiz/generate', json('POST', data)),
  submitQuiz: (answers) => apiRequest('/api/quiz/submit', json('POST', { answers })),
  quizHistory: () => apiRequest('/api/quiz-history'),
  quizAttempt: (id) => apiRequest(`/api/quiz-history/${id}`),
  studyToolDocs: () => apiRequest('/api/study-tools'),
  generateStudyTool: (data) => apiRequest('/api/study-tools', json('POST', data)),
  feedback: () => apiRequest('/api/feedback'),
  submitFeedback: (data) => apiRequest('/api/feedback', json('POST', data)),
  adminFeedback: () => apiRequest('/api/admin/feedback'),
  updateAdminFeedback: (id, data) => apiRequest(`/api/admin/feedback/${id}`, json('POST', data)),
  health: () => apiRequest('/health'),
};
