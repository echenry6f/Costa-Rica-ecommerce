// Ticora Store — Admin auth (Supabase Auth)
// Login uses username "echenry6" → email echenry6@ticora.store

const ADMIN_EMAIL_SUFFIX = '@ticora.store';

function getSession() {
  const sb = getSupabase();
  if (!sb) return Promise.resolve(null);
  return sb.auth.getSession().then(({ data }) => data?.session ?? null);
}

function getRedirectUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('next') || params.get('redirect') || 'admin.html';
}

function redirectToLogin(next) {
  const url = next ? `login.html?next=${encodeURIComponent(next)}` : 'login.html';
  window.location.replace(url);
}

async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    redirectToLogin(getRedirectUrl());
    return null;
  }
  return session;
}

function signOut() {
  const sb = getSupabase();
  if (sb) sb.auth.signOut();
  window.location.replace('login.html');
}

async function updateAdminLinkVisibility() {
  const link = document.getElementById('nav-admin-link');
  if (!link) return;
  const session = await getSession();
  if (session) {
    link.classList.remove('hidden');
    link.style.display = '';
  } else {
    link.classList.add('hidden');
    link.style.display = 'none';
  }
}

function setupLogoutLink() {
  const el = document.getElementById('nav-logout');
  if (!el) return;
  getSession().then(function (session) {
    if (session) {
      el.classList.remove('hidden');
      el.style.display = '';
      el.addEventListener('click', function (e) {
        e.preventDefault();
        signOut();
      });
    } else {
      el.classList.add('hidden');
      el.style.display = 'none';
    }
  });
}

function loginEmailFromUsername(username) {
  const trimmed = (username || '').trim().toLowerCase();
  if (!trimmed) return null;
  return trimmed + ADMIN_EMAIL_SUFFIX;
}
