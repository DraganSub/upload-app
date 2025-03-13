import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {

  const folderPath = path.resolve('public/images');

  try {
    if (fs.existsSync(folderPath)) {
      // Read all files in the folder
      const files = fs.readdirSync(folderPath);

      // Delete each file
      files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        fs.unlinkSync(filePath);
      });

      console.log(`Cleared folder: ${folderPath}`);
    } else {
      console.warn("Folder does not exist:", folderPath);
    }

    return { success: true, message: "Folder cleared successfully" };
  } catch (error) {
    console.error("Error clearing folder:", error);
    return { success: false, message: "Error clearing folder" };
  }
});
