# Admin login setup — Ticora Store

The **Manage Products** page is protected. Only you can access it by signing in with the admin account.

## Login

- **Username:** `echenry6`
- **Password:** Stored in `admin-credentials.txt` in the project root (this file is gitignored—do not commit it). If the file is missing, see "If you lose the password" below.

Supabase Auth uses email. Your username is converted to the email: **echenry6@ticora.store**.

## One-time: Create the admin user in Supabase

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Go to **Authentication** → **Users**.
3. Click **Add user** → **Create new user**.
4. Set:
   - **Email:** `echenry6@ticora.store`
   - **Password:** (use the 12-character password from `admin-credentials.txt`)
5. Click **Create user**.

Optional: under **Authentication** → **Providers** → **Email**, turn off **Enable email signups** so no one else can register.

**Restrict product edits to admins:** Run the migration `supabase/migrations/20240202000000_products_admin_only.sql` in the Supabase SQL Editor (or use `npm run db:migrate`). This limits product add/edit/delete to logged-in users so the storefront cannot be changed by others.

## How it works

- Visiting **admin.html** (or clicking “Manage Products”) without being logged in sends you to **login.html**.
- Enter username `echenry6` and the password from `admin-credentials.txt`.
- After login you can add, edit, and delete products. Use **Edit** on a product to change it, then **Save Product**.
- The **Manage Products** link in the header is only visible when you are logged in.
- Use **Log out** on the admin page to sign out.

## If you lose the password

- In Supabase: **Authentication** → **Users** → open the user → **Send password recovery** (or set a new password manually).
- Update the password in `admin-credentials.txt` for your records.
