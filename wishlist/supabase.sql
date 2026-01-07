-- Create tables
create table if not exists items (
  id serial primary key,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists claims (
  id serial primary key,
  item_id int references items(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table items enable row level security;
alter table claims enable row level security;

-- Policies: allow public SELECT on items and claims
create policy "Public select items" on items for select using (true);
create policy "Public select claims" on claims for select using (true);

-- Allow INSERT to claims (anonymous writes) — check true allows any insert
create policy "Allow public insert claims" on claims for insert with check (true);

-- Do NOT create update/delete policies (prevents modifications/deletions by anonymous users)

-- Seed items (8 total)
insert into items (name) values
('Lamborghini'),
('Horse'),
('House in Venezuela'),
('Private island'),
('World trip'),
('Art collection'),
('Custom studio'),
('MacBook Pro')
on conflict do nothing;