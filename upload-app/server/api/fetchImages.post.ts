import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

interface Image {
  file_name: string;
  file_url: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userId = body.userId;

  if (!userId) throw new Error('User ID is required');

  const { data: images, error } = await supabase.from("uploads").select("*").eq("user_id", userId)
  if (error) {
    throw new Error(error.message)
  }

  return { success: true, images: images || [] };
})