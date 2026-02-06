# ticora.store Domain Setup Guide

This guide walks you through connecting **ticora.store** to Cloudflare and Supabase.

---

## Part 1: Cloudflare

Cloudflare will handle DNS, SSL, and (optionally) proxy your site.

### Step 1: Add domain to Cloudflare

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and log in
2. Click **Add site** or **Onboard a domain**
3. Enter: `ticora.store`
4. Choose a plan (Free works for most use cases)
5. Cloudflare will scan existing DNS records—review and continue

### Step 2: Update nameservers at your registrar

1. Where did you buy ticora.store? (Namecheap, GoDaddy, Google Domains, etc.)
2. Cloudflare will show two nameservers, e.g.:
   - `something.ns.cloudflare.com`
   - `something.ns.cloudflare.com`
3. Go to your registrar’s DNS/nameserver settings
4. Replace the default nameservers with Cloudflare’s two nameservers
5. Save changes (propagation can take up to 48 hours, often much faster)

### Step 3: Disable DNSSEC at your registrar (if enabled)

- If DNSSEC is on, turn it off before switching to Cloudflare nameservers
- You can re-enable it later in Cloudflare if needed

---

## Part 2: Supabase

Supabase custom domains use a **subdomain**, e.g. `api.ticora.store`, not the apex `ticora.store`.

**Note:** Custom domains are a [paid add-on](https://supabase.com/dashboard/project/_/settings/addons?panel=customDomain) for Supabase projects on a paid plan.

### Option A: Dashboard setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project → **Project Settings** → **General**
3. Find **Custom Domains**
4. Enter: `api.ticora.store` (or another subdomain you prefer)
5. Supabase will show required DNS records; add them in Cloudflare

### Option B: Supabase CLI

```bash
# Install Supabase CLI (if needed)
npm install -g supabase

# Log in
supabase login

# Create custom domain and get verification records
supabase domains create --project-ref YOUR_PROJECT_REF --custom-hostname api.ticora.store

# After adding CNAME + TXT records in Cloudflare, verify
supabase domains reverify --project-ref YOUR_PROJECT_REF

# Activate once verified
supabase domains activate --project-ref YOUR_PROJECT_REF
```

### DNS records in Cloudflare (for Supabase)

Add these in Cloudflare DNS for your project:

| Type | Name   | Content                               | TTL |
|------|--------|----------------------------------------|-----|
| CNAME| api    | `YOUR_PROJECT_REF.supabase.co`        | Auto |
| TXT  | _acme-challenge.api | *(from Supabase dashboard/CLI)* | 300 |

*(Use your actual project ref and TXT value from Supabase.)*

---

## Recommended DNS layout

| Subdomain | Purpose              | Points to          |
|-----------|----------------------|--------------------|
| ticora.store (apex) | Main storefront      | Hosting (Vercel/Pages/etc.) |
| www       | www redirect         | ticora.store       |
| api       | Supabase API/Auth    | Supabase project   |

---

## After setup

1. **Cloudflare:** Confirm domain status is “Active” in the Cloudflare dashboard
2. **Supabase:** Confirm custom domain status is “Active” in Project Settings
3. **App config:** Use `https://api.ticora.store` as your Supabase URL (instead of `*.supabase.co`)
