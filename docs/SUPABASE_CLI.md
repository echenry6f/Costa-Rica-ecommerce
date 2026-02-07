# Supabase CLI Setup

Manage your Supabase database with the CLI — no GitHub integration.

---

## Prerequisites

- **Node.js 20+**
- **Docker** (optional, for local Supabase)

---

## 1. Install

```bash
cd "/Users/Eric/Desktop/Costa Rica ecommerce"
npm install
```

---

## 2. Log in

```bash
npx supabase login
```

Opens a browser to authenticate with Supabase.

---

## 3. Link to your project

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

Get your project ref from **Supabase Dashboard** → **Project Settings** → **General** (e.g. `abcdefghijklmnop`).

---

## 4. Push migrations

```bash
npx supabase db push
```

Applies all files in `supabase/migrations/` to your remote database.

---

## 5. Common commands

| Command | Description |
|---------|-------------|
| `npx supabase db push` | Apply migrations to remote |
| `npx supabase db reset` | Reset local DB (requires `supabase start`) |
| `npx supabase start` | Start local Supabase (Docker) |
| `npx supabase stop` | Stop local Supabase |
| `npx supabase status` | Show local service URLs |

---

## Folder structure

```
supabase/
  config.toml
  schema.sql               # Manual run in SQL Editor (alternative to migrations)
  migrations/
    20240201000000_initial_schema.sql
```

---

## First-time setup

For a new Supabase project:

1. Create the project at [supabase.com](https://supabase.com)
2. Run `npx supabase link --project-ref YOUR_REF`
3. Run `npx supabase db push`

Your schema will be applied to the remote database.
