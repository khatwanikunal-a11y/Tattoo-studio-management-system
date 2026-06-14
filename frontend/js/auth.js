function updateNavAuth() {
  const navAuth = document.getElementById('nav-auth');
  if (!navAuth) return;
  const user = getCurrentUser();
  if (user) {
    navAuth.innerHTML =
      '<span class="nav-user">\uD83D\uDC64 ' + esc(user.name) + '</span>' +
      '<button onclick="logout()" class="btn btn-outline btn-sm">Logout</button>';
  } else {
    navAuth.innerHTML =
      '<a href="/login.html" class="btn btn-outline btn-sm">Login</a>' +
      '<a href="/register.html" class="btn btn-primary btn-sm">Register</a>';
  }
  const adminEls = document.querySelectorAll('.admin-only');
  adminEls.forEach(function(el) { el.style.display = isAdmin() ? '' : 'none'; });
}

function logout() {
  localStorage.removeItem('inkfactory_token');
  localStorage.removeItem('inkfactory_user');
  showToast('Logged out successfully');
  setTimeout(function() { window.location.href = '/'; }, 1000);
}

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
    return false;
  }
  return true;
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const btn = document.getElementById('login-btn');
  const errEl = document.getElementById('auth-error');
  errEl.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Logging in\u2026';

  const result = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: email, password: password })
  });

  if (result.status === 200) {
    localStorage.setItem('inkfactory_token', result.data.token);
    localStorage.setItem('inkfactory_user', JSON.stringify(result.data.user));
    showToast('Login successful! Redirecting\u2026');
    const params = new URLSearchParams(window.location.search);
    setTimeout(function() {
      window.location.href = params.get('redirect') || '/';
    }, 1000);
  } else {
    errEl.textContent = result.data.error || 'Login failed';
    btn.disabled = false;
    btn.textContent = 'Login';
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm-password').value;
  const errEl = document.getElementById('auth-error');
  errEl.textContent = '';

  if (password !== confirm) {
    errEl.textContent = 'Passwords do not match';
    return;
  }

  const btn = document.getElementById('register-btn');
  btn.disabled = true;
  btn.textContent = 'Creating account\u2026';

  const result = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name: name, email: email, password: password })
  });

  if (result.status === 201) {
    localStorage.setItem('inkfactory_token', result.data.token);
    localStorage.setItem('inkfactory_user', JSON.stringify(result.data.user));
    showToast('Account created! Welcome.');
    setTimeout(function() { window.location.href = '/'; }, 1000);
  } else {
    errEl.textContent = result.data.error || 'Registration failed';
    btn.disabled = false;
    btn.textContent = 'Create Account';
  }
}
