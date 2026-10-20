-- Dữ liệu của từng người dùng: toàn bộ trạng thái ứng dụng (cấu hình + nhật ký theo tháng)
create table if not exists public.user_data (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  body       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Lịch sử thói quen theo ngày, gắn với user_id
create table if not exists public.growth_habits (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  habit_name   text not null,
  is_completed boolean not null default false,
  target_date  date not null,
  created_at   timestamptz not null default now(),
  unique (user_id, habit_name, target_date)
);

-- Row Level Security: mỗi người chỉ đọc và ghi được dữ liệu của chính mình
alter table public.user_data enable row level security;
alter table public.growth_habits enable row level security;

create policy "user_data: chỉ chủ tài khoản"
  on public.user_data for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "growth_habits: chỉ chủ tài khoản"
  on public.growth_habits for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
