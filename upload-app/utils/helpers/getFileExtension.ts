export default function getFileExtension(mimetype: string): string {
  const mimetypeMapping: Record<string, string> = {
    "image/png": ".png",
    "image/jpeg": ".jpg"
  };
  return mimetypeMapping[mimetype];
}
