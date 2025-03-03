import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userId = body.userId;
  const supabase = await serverSupabaseClient(event)
  if (!userId) throw new Error('User ID is required');

  const { data: user, error } = await supabase.from("users").select("*").eq("id", userId)

  if (error) {
    throw new Error(error.message)
  }

  return { success: true, user: user || [] };
})