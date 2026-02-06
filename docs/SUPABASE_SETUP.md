# Supabase Setup — Ticora Store

Move your store to Supabase for persistent products and orders.

---

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New project**
3. Name it (e.g. `ticora-store`), set a database password, choose a region
4. Click **Create project**

---

## 2. Run the schema

1. In your Supabase project, go to **SQL Editor**
2. Create a new query
3. Copy the contents of `supabase/schema.sql` from this repo
4. Paste and run it

This creates:
- `products` — name, category, price, emoji, description
- `orders` — buyer email, status, total, payment provider
- `order_items` — line items per order
- `order_delivery` — Correos CR info + Waze pin URL
- RLS policies for public read/write (add auth later for admin)

---

## 3. Get your API keys

1. Go to **Project Settings** → **API** (or **Settings** → **API**)
2. Copy **Project URL**
3. Copy **anon public** key (safe for client-side)

---

## 4. Configure the site

1. Open `js/supabase-config.js` (or copy from `js/supabase-config.example.js` if needed)
2. Replace the placeholders:

```js
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

3. Save the file

---

## 5. Verify

1. Run the site locally: `python3 -m http.server 8080`
2. Go to **Manage Products** and add a product
3. Check Supabase **Table Editor** → `products` — your product should appear
4. Complete a checkout — check `orders`, `order_items`, `order_delivery`

---

## Fallback behavior

If Supabase isn’t configured (placeholders still in use):

- Products use **localStorage** (same as before Supabase)
- Orders are not stored when you checkout (cart clears, but no DB record)

Once configured, products and orders are stored in Supabase.

---

## Security (for production)

1. **Admin auth** — Add Supabase Auth and restrict product insert/update/delete to authenticated users
2. **RLS** — Tighten RLS policies so only admins can write products, only admins can read orders
3. **API key** — Keep the anon key in client code; RLS controls what it can access
