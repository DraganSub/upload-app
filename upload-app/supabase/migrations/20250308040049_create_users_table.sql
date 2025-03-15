CREATE TABLE public.users (
  id uuid not null,
  email text not null,
  created_at timestamp without time zone null default now(),
  phone_number text null,
  address text null,
  country text null,
  first_name text null,
  last_name text null,
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email),
  constraint users_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE,
  constraint users_first_name_check check ((length(first_name) <= 50)),
  constraint users_last_name_check check ((length(last_name) <= 50))
);

-- Enable (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for Users Table
CREATE POLICY "Users can view their own records" ON public.users
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can insert their own records" ON public.users
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update their own records" ON public.users
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (true);

CREATE POLICY "Users can delete their own records" ON public.users
FOR DELETE
TO authenticated
USING (id = auth.uid());