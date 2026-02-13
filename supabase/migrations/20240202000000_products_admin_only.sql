-- Restrict product write access to authenticated users (admin)
-- Run in Supabase SQL Editor if not using db push

drop policy if exists "Products are insertable by everyone" on products;
drop policy if exists "Products are updatable by everyone" on products;
drop policy if exists "Products are deletable by everyone" on products;

create policy "Products are insertable by authenticated" on products for insert to authenticated with check (true);
create policy "Products are updatable by authenticated" on products for update to authenticated using (true);
create policy "Products are deletable by authenticated" on products for delete to authenticated using (true);
