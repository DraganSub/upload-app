import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userId = body.userId;

  if (!userId) throw new Error('User ID is required');

  const { data: user, error } = await supabase.from("users").select("*").eq("id", userId)

  if (error) {
    throw new Error(error.message)
  }

  return { success: true, user: user || [] };
})