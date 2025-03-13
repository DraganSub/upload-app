import { defineEventHandler, readMultipartFormData } from 'h3';
import { serverSupabaseClient } from "#supabase/server";
import { Database, type Tables } from '~/database.types';

type Upload = {
  file_name: string;
  user_id: string;
  file_url: string;
  file_id: string;
  file_type: string;
};

export default defineEventHandler(async (event) => {
  try {
    const supabase = await serverSupabaseClient<Database>(event);
    const formData = await readMultipartFormData(event);
    if (!formData) throw new Error('No file uploaded');

    const userIdField = formData.find((field) => field.name === 'userId');
    const userId = userIdField?.data.toString();

    if (!userId) throw new Error('User ID is required');

    const filedIdField = formData.find((field) => field.name === 'file_id');
    const uniqueFileId = filedIdField?.data.toString();

    const fileField = formData.find((field) => field.name === 'file');
    if (!fileField || !fileField.filename || !fileField.data || !fileField.type) {
      throw new Error('Invalid file upload');
    }

    if (!['image/jpeg', 'image/png'].includes(fileField.type)) {
      throw new Error('Only .jpg and .png files are allowed.');
    }

    if (fileField.data.length > 4 * 1024 * 1024) {
      throw new Error('File size exceeds 4 MB.');
    }

    const { data, error } = await supabase.storage
      .from('images')
      .upload(`uploads/${userId}/${uniqueFileId}`, fileField.data, {
        contentType: fileField.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw new Error(error.message);

    const fileUrl = `uploads/${userId}/${uniqueFileId}`;

    const { error: dbError } = await supabase
      .from('uploads')
      .insert<Upload>([{ file_name: fileField.filename.split(".")[0], user_id: userId, file_url: fileUrl, file_id: uniqueFileId!, file_type: fileField.type }]);

    if (dbError) throw new Error(`Database Insert Error: ${dbError.message}`);

    return { success: true, fileUrl };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
});