import fs from 'fs';
import path from 'path';
import { serverSupabaseClient } from '#supabase/server';
import getFileExtension from '~/utils/helpers/getFileExtension';

export default defineEventHandler(async (event) => {
  try {
    const { userId } = await readBody(event);

    if (!userId) throw new Error('User ID is required');
    const supabase = await serverSupabaseClient(event);
    const { data: files, error } = await supabase.storage.from(`images`).list(`uploads/${userId}`);
    console.log(files)
    if (error) throw error;

    const downloadFolder = path.resolve('public/images');

    // Ensure the folder exists
    if (!fs.existsSync(downloadFolder)) {
      fs.mkdirSync(downloadFolder, { recursive: true });
    }

    for (const file of files) {
      const filePath = path.join(downloadFolder, `${file.name}${getFileExtension(file.metadata.mimetype)}`);

      // Skip download if file already exists
      if (fs.existsSync(filePath)) {
        console.log(`Skipping existing file: ${file.name}`);
        continue;
      }


      const { data, error: downloadError } = await supabase.storage
        .from('images')
        .download(`uploads/${userId}/${file.name}`);

      if (downloadError) {
        console.error(`Error downloading ${file.name}:`, downloadError);
        continue;
      }

      const buffer = Buffer.from(await data.arrayBuffer());

      fs.writeFileSync(filePath, buffer);
      console.log(`Saved: ${file.name}`);
    }

    return { success: true, message: 'Images downloaded successfully' };
  } catch (err: any) {
    console.error('Error:', err);
    return { success: false, error: err.message };
  }
});
