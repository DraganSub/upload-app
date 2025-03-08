CREATE TABLE public.uploads (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    file_name text NOT NULL,
    file_url text NOT NULL,
    uploaded_at timestamp without time zone NULL DEFAULT now(),
    CONSTRAINT uploads_pkey PRIMARY KEY (id),
    CONSTRAINT uploads_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
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