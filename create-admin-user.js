#!/usr/bin/env node
/**
 * One-time script: create admin user in Supabase Auth
 * Username → email: echenry6@ticora.store
 * Run: node create-admin-user.js
 * Requires: SUPABASE_URL and SUPABASE_ANON_KEY in js/supabase-config.js (or env)
 */

const fs = require('fs');
const path = require('path');

function getConfig() {
  const envUrl = process.env.SUPABASE_URL;
  const envKey = process.env.SUPABASE_ANON_KEY;
  if (envUrl && envKey) return { url: envUrl, key: envKey };

  const configPath = path.join(__dirname, 'js', 'supabase-config.js');
  if (!fs.existsSync(configPath)) {
    console.error('Missing js/supabase-config.js. Run from project root or set SUPABASE_URL and SUPABASE_ANON_KEY.');
    process.exit(1);
  }
  const content = fs.readFileSync(configPath, 'utf8');
  const urlMatch = content.match(/SUPABASE_URL\s*=\s*['"]([^'"]+)['"]/);
  const keyMatch = content.match(/SUPABASE_ANON_KEY\s*=\s*['"]([^'"]+)['"]/);
  if (!urlMatch || !keyMatch) {
    console.error('Could not read SUPABASE_URL and SUPABASE_ANON_KEY from js/supabase-config.js');
    process.exit(1);
  }
  return { url: urlMatch[1], key: keyMatch[1] };
}

const email = 'echenry6@ticora.store';
const password = '7nQ#kL2$pM9x';

async function main() {
  const { url, key } = getConfig();
  const signUpUrl = `${url.replace(/\/$/, '')}/auth/v1/signup`;

  const res = await fetch(signUpUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': key,
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (res.ok) {
    console.log('Admin user created successfully.');
    console.log('Email:', email);
    console.log('You can log in at login.html with username echenry6 and the password.');
    if (data.user && !data.user.email_confirmed_at && data.user.identities?.length === 0) {
      console.log('\nNote: If your project requires email confirmation, turn it off in');
      console.log('Supabase Dashboard → Authentication → Providers → Email → Confirm email.');
      return;
    }
    return;
  }

  if (data.msg === 'User already registered' || (data.message && data.message.includes('already registered'))) {
    console.log('User already exists. You can log in with username echenry6 and the password.');
    return;
  }

  console.error('Signup failed:', res.status, data.message || data.msg || data.error_description || JSON.stringify(data));
  if (res.status === 422 || (data.message && data.message.includes('signup'))) {
    console.error('\nTip: Enable "Enable email signups" in Supabase Dashboard → Authentication → Providers → Email.');
  }
  process.exit(1);
}

main();
