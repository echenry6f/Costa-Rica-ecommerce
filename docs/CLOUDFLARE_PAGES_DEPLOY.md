# Deploy to Cloudflare Pages

Deploy your Costa Rica e-commerce site to Cloudflare Pages and connect **ticora.store**.

---

## Option A: GitHub Actions (Direct Upload)

Automatically deploys on every push to `main`.

### 1. Add Cloudflare secrets in GitHub

1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add:
   - **CLOUDFLARE_ACCOUNT_ID** — from [Cloudflare Dashboard](https://dash.cloudflare.com) → Overview (right sidebar)
   - **CLOUDFLARE_API_TOKEN** — Create at [API Tokens](https://dash.cloudflare.com/?to=/:account/api-tokens): Custom Token → **Cloudflare Pages** + **Edit**

### 2. Create Pages project (one-time)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → **Pages**
2. Choose **Direct Upload**
3. Project name: `ticora-store`
4. Deploy will happen via GitHub Actions on next push

---

## Option B: Connect GitHub (Cloudflare builds)

### Step 1: Connect your GitHub repo

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages**
2. Click **Create application** → **Pages** → **Connect to Git**
3. Choose **GitHub** and authorize Cloudflare
4. Select your project: **echenry6f/Costa-Rica-ecommerce**
5. Click **Install & Authorize** → **Begin setup**

### Step 2: Configure build settings

| Setting | Value |
|--------|--------|
| **Project name** | `ticora-store` (or keep default) |
| **Production branch** | `main` |
| **Build command** | *(leave blank for static HTML)* |
| **Build output directory** | `/` |

For a static site (HTML/CSS/JS with no framework), leave **Build command** empty and set **Build output directory** to `/`.

If you later add a framework (e.g. Next.js, Astro), Cloudflare will suggest a preset—use that instead.

### Step 3: Deploy

1. Click **Save and Deploy**
2. Cloudflare will build and deploy your site
3. When it’s done, you’ll get a URL like `https://costa-rica-ecommerce.pages.dev`

### Step 4: Add custom domain (ticora.store)

1. In your Pages project → **Custom domains** → **Set up a custom domain**
2. Enter `ticora.store`
3. Add `www.ticora.store` if you want `www` support
4. Cloudflare will add the DNS records automatically if the domain is on Cloudflare

---

## Push to GitHub

```bash
git add .
git commit -m "Initial site for Cloudflare Pages"
git push origin main
```

---

## Preview deployments

Each branch (except `main`) gets its own preview URL. Pull requests will show build status and a preview link.
