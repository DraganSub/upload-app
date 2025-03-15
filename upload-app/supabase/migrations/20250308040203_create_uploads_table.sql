CREATE TABLE public.uploads (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  file_name text not null,
  file_url text not null,
  uploaded_at timestamp without time zone null default now(),
  file_id text null,
  file_type text null,
  constraint uploads_pkey primary key (id),
  constraint uploads_file_id_key unique (file_id),
  constraint uploads_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
);

-- Enable (RLS)
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for Uploads Table
CREATE POLICY "Users can view their own uploads" ON public.uploads
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own uploads" ON public.uploads
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update their own uploads" ON public.uploads
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (true);

CREATE POLICY "Users can delete their own uploads" ON public.uploads
FOR DELETE
TO authenticated
USING (user_id = auth.uid());