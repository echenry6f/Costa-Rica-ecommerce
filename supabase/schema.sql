-- Ticora Store — Supabase schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Products (managed via admin)
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price integer not null check (price >= 0),
  emoji text default '📦',
  description text,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Orders (created at checkout)
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  buyer_email text not null,
  status text not null default 'pending_requirements' check (
    status in ('pending_requirements', 'pending_payment', 'paid', 'shipped')
  ),
  total_price_crc integer not null check (total_price_crc >= 0),
  payment_provider text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order items (line items)
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity integer not null check (quantity > 0),
  price_crc integer not null,
  created_at timestamptz default now()
);

-- Delivery info (Correos CR + Waze pin)
create table if not exists order_delivery (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references orders(id) on delete cascade,
  full_name text not null,
  cedula text not null,
  phone text not null,
  province text not null,
  canton text not null,
  exact_address text not null,
  waze_pin_url text not null,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_orders_created_at on orders(created_at desc);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_order_items_order_id on order_items(order_id);

-- RLS (Row Level Security)
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_delivery enable row level security;

-- Products: public read, public insert/update/delete (add auth later for admin)
create policy "Products are viewable by everyone" on products for select using (true);
create policy "Products are insertable by everyone" on products for insert with check (true);
create policy "Products are updatable by everyone" on products for update using (true);
create policy "Products are deletable by everyone" on products for delete using (true);

-- Orders: public insert (checkout), public select (for now — add auth for admin later)
create policy "Orders are viewable by everyone" on orders for select using (true);
create policy "Orders are insertable by everyone" on orders for insert with check (true);
create policy "Orders are updatable by everyone" on orders for update using (true);

-- Order items: public insert, public select
create policy "Order items are viewable by everyone" on order_items for select using (true);
create policy "Order items are insertable by everyone" on order_items for insert with check (true);

-- Order delivery: public insert, public select
create policy "Order delivery is viewable by everyone" on order_delivery for select using (true);
create policy "Order delivery is insertable by everyone" on order_delivery for insert with check (true);
