import { serverSupabaseClient } from "#supabase/server";
import path from "path";
import fs from "fs";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  let responseData = { success: false }
  const { fileName, imageId, userId, file_type } = body;

  const supabase = await serverSupabaseClient(event)

  // Delete the image from the storage
  const { data, error } = await supabase.storage
    .from("images")
    .remove([`uploads/${userId}/${fileName}`]);

  if (error) {
    throw new Error("Error while deleting image from storage");
  } else {
    responseData = { success: true }
  }

  // Delete the image from the database table
  const { data: dbData, error: dbError } = await supabase
    .from("uploads")
    .delete()
    .eq("id", imageId);

  if (dbError) {
    throw new Error("Error while deleting image from database")
  }

  // Delete the local file if it exists in the public/images folder
  try {
    const filePath = path.resolve(`public/images/${fileName}${file_type}`);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Delete the file
      console.log(`Deleted local file: ${filePath}`);
    } else {
      console.warn("File not found in local folder:", filePath);
    }
  } catch (error) {
    console.error("Error deleting local file:", error);
  }

  return responseData;
})