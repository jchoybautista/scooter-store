-- Velocità — Supabase schema
-- Run this in the Supabase SQL editor (or via the CLI) to create the backend.
-- The storefront reads these tables; the admin (Phase 3) writes to them.

-- ── Tables ──────────────────────────────────────────────────────────────────

create table if not exists brands (
  id          text primary key,
  name        text not null,
  slug        text not null unique,
  country     text,
  accent      text,
  description text
);

create table if not exists categories (
  id   text primary key,
  name text not null,
  slug text not null unique,
  type text not null check (type in ('scooter','part','accessory','warranty'))
);

create table if not exists products (
  id          text primary key,
  name        text not null,
  slug        text not null unique,
  brand_id    text references brands(id) on delete set null,
  category_id text references categories(id) on delete set null,
  type        text not null check (type in ('scooter','part','accessory','warranty')),
  price       numeric not null,
  sale_price  numeric,
  description text,
  specs       jsonb default '{}'::jsonb,
  images      text[] default '{}',
  stock       integer not null default 0,
  featured    boolean not null default false,
  status      text not null default 'active' check (status in ('active','draft')),
  created_at  timestamptz not null default now()
);

create table if not exists warranty_plans (
  id              text primary key,
  name            text not null,
  duration_months integer not null,
  price           numeric not null,
  coverage        text
);

create table if not exists orders (
  id             uuid primary key default gen_random_uuid(),
  customer_name  text not null,
  customer_email text not null,
  status         text not null default 'pending'
                 check (status in ('pending','paid','shipped','delivered','cancelled')),
  subtotal       numeric not null,
  total          numeric not null,
  created_at     timestamptz not null default now()
);

create table if not exists order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid references orders(id) on delete cascade,
  product_id       text references products(id) on delete set null,
  name_snapshot    text not null,
  qty              integer not null,
  unit_price       numeric not null,
  warranty_plan_id text references warranty_plans(id) on delete set null
);

create index if not exists idx_products_type on products(type);
create index if not exists idx_products_brand on products(brand_id);
create index if not exists idx_order_items_order on order_items(order_id);

-- ── Row Level Security ──────────────────────────────────────────────────────
-- Public can READ the catalog and INSERT orders (checkout). Only authenticated
-- admins may write to the catalog tables.

alter table brands         enable row level security;
alter table categories     enable row level security;
alter table products       enable row level security;
alter table warranty_plans enable row level security;
alter table orders         enable row level security;
alter table order_items    enable row level security;

-- Public read
create policy "public read brands"     on brands         for select using (true);
create policy "public read categories" on categories     for select using (true);
create policy "public read products"   on products       for select using (true);
create policy "public read warranty"   on warranty_plans for select using (true);

-- Checkout: anyone may create an order + its items
create policy "anon insert orders"      on orders      for insert with check (true);
create policy "anon insert order_items" on order_items for insert with check (true);

-- Admins (authenticated) may read orders and fully manage the catalog
create policy "admin read orders"       on orders      for select using (auth.role() = 'authenticated');
create policy "admin read order_items"  on order_items for select using (auth.role() = 'authenticated');

create policy "admin write products"  on products       for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write brands"    on brands         for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write cats"      on categories     for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write warranty"  on warranty_plans for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin update orders"   on orders         for update using (auth.role() = 'authenticated');
