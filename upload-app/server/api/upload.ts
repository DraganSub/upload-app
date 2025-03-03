import { defineEventHandler, readMultipartFormData } from 'h3';
import { serverSupabaseClient } from "#supabase/server";
import { Database } from '~/database.types';

type Upload = {
  file_name: string;
  user_id: string;
  file_url: string;
};

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient<Database>(event);
    // Read uploaded file from form-data
    const formData = await readMultipartFormData(event);
    if (!formData) throw new Error('No file uploaded');

    const userIdField = formData.find((field) => field.name === 'userId');
    const userId = userIdField?.data.toString();

    if (!userId) throw new Error('User ID is required');

    // Find file field
    const fileField = formData.find((field) => field.name === 'file');
    if (!fileField || !fileField.filename || !fileField.data) {
      throw new Error('Invalid file upload');
    }

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`uploads/${userId}/${fileField.filename}`, fileField.data, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw new Error(error.message);

    // Generate public URL
    const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/images/uploads/${userId}/${fileField.filename}`;

    // Store file metadata in DB
    const { error: dbError } = await supabase
      .from('uploads')
      .insert<Upload>([{ file_name: fileField.filename, user_id: userId, file_url: fileUrl }]);

    if (dbError) throw new Error(`Database Insert Error: ${dbError.message}`);

    return { success: true, fileUrl };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
});