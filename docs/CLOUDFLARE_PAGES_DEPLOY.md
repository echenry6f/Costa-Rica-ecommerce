# Deploy to Cloudflare Pages

Deploy your Costa Rica e-commerce site to Cloudflare Pages and connect **ticora.store**.

---

## Step 1: Connect your GitLab repo

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages**
2. Click **Create application** → **Pages** → **Connect to Git**
3. Choose **GitLab** and authorize Cloudflare
4. Select your project: **echenry6-group/costa-rica-ecommerce**
5. Click **Install & Authorize** → **Begin setup**

> You need **Maintainer** role or higher on the GitLab repo.

---

## Step 2: Configure build settings

| Setting | Value |
|--------|--------|
| **Project name** | `ticora-store` (or keep default) |
| **Production branch** | `main` |
| **Build command** | *(leave blank for static HTML)* |
| **Build output directory** | `/` |

For a static site (HTML/CSS/JS with no framework), leave **Build command** empty and set **Build output directory** to `/`.

If you later add a framework (e.g. Next.js, Astro), Cloudflare will suggest a preset—use that instead.

---

## Step 3: Deploy

1. Click **Save and Deploy**
2. Cloudflare will build and deploy your site
3. When it’s done, you’ll get a URL like `https://costa-rica-ecommerce.pages.dev`

---

## Step 4: Add custom domain (ticora.store)

1. In your Pages project → **Custom domains** → **Set up a custom domain**
2. Enter `ticora.store`
3. Add `www.ticora.store` if you want `www` support
4. Cloudflare will add the DNS records automatically if the domain is on Cloudflare

---

## What to push first

Make sure your repo has at least one commit on `main` before connecting. For example:

```bash
git add .
git commit -m "Initial site for Cloudflare Pages"
git push origin main
```

---

## Preview deployments

Each branch (except `main`) gets its own preview URL. Merge requests will show build status and a preview link.
