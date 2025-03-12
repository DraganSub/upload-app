import { serverSupabaseClient } from "#supabase/server";
import { Database, Tables } from "~/database.types";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userId = body.userId;
  const supabase = await serverSupabaseClient(event)
  if (!userId) throw new Error('User ID is required');

  const { data: images, error
  } = await supabase.from("uploads").select("*").eq("user_id", userId)

  if (error) {
    throw new Error(error.message)
  }

  const updateImagesWithSignedUrls = async () => {
    const { data, error } = await supabase.storage.from('images').createSignedUrls(images.map((e: Tables<"uploads">) => e.file_url), 3600)

    // check if there is data or error and return empty array if there is no data
    if (!data || error) {
      return [];
    }

    const imgs = images.map((img: Tables<"uploads">, i) => {
      return {
        ...img,
        file_url: data[i].signedUrl
      }
    })

    return imgs;
  }

  const imagesWithSignedUrls = await updateImagesWithSignedUrls();

  return {
    success: true, images: imagesWithSignedUrls || [], error: error || null
  };
})