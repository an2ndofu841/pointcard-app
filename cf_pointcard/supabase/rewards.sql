-- 景品テーブル
create table public.rewards (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  image_url text,
  points_required integer not null,
  stock integer, -- 在庫管理用（nullなら無制限）
  created_at timestamptz default now()
);

-- RLS設定
alter table public.rewards enable row level security;

-- 全員参照可能
create policy "Rewards are viewable by everyone."
  on rewards for select
  using ( true );

-- 管理者のみ編集可能（簡易的に認証済みユーザー許可、本来はroleチェック）
create policy "Authenticated users can manage rewards."
  on rewards for all
  using ( auth.role() = 'authenticated' );

