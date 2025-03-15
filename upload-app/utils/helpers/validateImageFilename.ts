export function validateImageFilename(filename: string): { isValid: boolean, modifiedFilename: string | null } {
  // Check if filename ends with .jpg or .png, and remember the extension
  const extensionRegex = /\.(jpg|png)$/i;
  let extension = "";

  if (extensionRegex.test(filename)) {
    extension = filename.match(extensionRegex)?.[0] || "";
    filename = filename.replace(extension, ""); // Remove extension for validation
  }

  // Replace spaces, underscores, and dots with a hyphen
  let modifiedFilename = filename.replace(/[\s_\.]/g, "-");

  // Regex to check if the filename contains only alphanumeric characters and hyphens
  const regex = /^[a-zA-Z0-9-]+$/;

  // Check if the modified filename passes the regex validation
  if (regex.test(modifiedFilename)) {
    // Append the original extension back to the filename
    modifiedFilename += extension;
    return { isValid: true, modifiedFilename: modifiedFilename };
  } else {
    // Return the original filename with extension (if valid)
    return { isValid: false, modifiedFilename: null };
  }
}