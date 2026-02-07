# Fix 522 Errors on Static Assets (CSS, JS)

If ticora.store loads the HTML but CSS, JS, and favicon return **522 (Connection timed out)**, the most likely cause is **Cloudflare Access**.

## Fix: Disable Cloudflare Access for the Worker

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Zero Trust** (or **Access**)
2. Open **Access** → **Applications**
3. Find the application protecting **ticora-store** or **\*.workers.dev**
4. Either:
   - **Delete** the application, or
   - **Edit** the application and add a policy: **Include** → **Everyone** (to allow public access)
5. Save

## Verify

- Visit https://ticora.store — the full page with styles and scripts should load
- Visit https://ticora-store.echenry6.workers.dev — should also work without a login prompt

## Why This Happens

Cloudflare Access can block or interfere with requests to your Worker. When enabled, it may allow the initial HTML request but cause subsequent asset requests (CSS, JS) to fail with 522. Disabling Access or allowing public access resolves this for a public e-commerce site.
