const BASE_URL = '/api';

function getToken() {
  return localStorage.getItem('inkfactory_token');
}

function getAuthHeaders() {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  return headers;
}

async function apiFetch(path, options) {
  options = options || {};
  const res = await fetch(BASE_URL + path, {
    ...options,
    headers: Object.assign({}, getAuthHeaders(), options.headers || {})
  });
  const data = await res.json();
  return { status: res.status, data: data };
}

function esc(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(String(str == null ? '' : str)));
  return d.innerHTML;
}

function showToast(message, type) {
  type = type || 'success';
  const existing = document.getElementById('toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = 'toast toast-' + type;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(function() { toast.classList.add('show'); }, 10);
  setTimeout(function() {
    toast.classList.remove('show');
    setTimeout(function() { if (toast.parentNode) toast.remove(); }, 300);
  }, 3500);
}

function isLoggedIn() { return !!getToken(); }

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('inkfactory_user')); }
  catch (e) { return null; }
}

function isAdmin() {
  const u = getCurrentUser();
  return u && u.role === 'admin';
}
