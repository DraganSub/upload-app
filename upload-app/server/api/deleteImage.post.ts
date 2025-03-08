import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  let responseData = { success: false }
  const { fileName, imageId, userId } = body;

  const supabase = await serverSupabaseClient(event)


  const { data: dbData, error: dbError } = await supabase
    .from("uploads")
    .delete()
    .eq("id", imageId);

  if (dbError) {
    throw new Error("Error while deleting image from storage")
  }

  const { data, error } = await supabase.storage
    .from("images")
    .remove([`uploads/${userId}/${fileName}`]);

  if (error) {
    throw new Error("Error while deleting image from storage");
  } else {
    responseData = { success: true }
  }

  return responseData;
})