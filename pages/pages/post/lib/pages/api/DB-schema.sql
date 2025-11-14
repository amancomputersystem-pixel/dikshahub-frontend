-- enable pgcrypto for gen_random_uuid
create extension if not exists "pgcrypto";

-- profiles table links to Supabase auth users
create table if not exists profiles (
  id uuid primary key references auth.users (id),
  username text unique,
  display_name text,
  bio text,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  caption text,
  media_url text,
  media_type text,
  created_at timestamptz default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id),
  sender_id uuid references profiles(id),
  body text,
  media_url text,
  created_at timestamptz default now()
);
