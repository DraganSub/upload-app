CREATE TABLE public.users (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    email text NOT NULL,
    full_name text NULL,
    created_at timestamp without time zone NULL DEFAULT now(),
    phone_number text NULL,
    address text NULL,
    country text NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
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