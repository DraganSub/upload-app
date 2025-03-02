import axios from "axios";

interface UploadResponse {
  fileUrl: string;
}

export async function upload(file: File, userId: string, onUploadProgress?: (progress: number) => void): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);

  try {
    const response = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent: any) => {
        if (progressEvent.lengthComputable && onUploadProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(progress);
        }
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Upload failed');
    }

    return { fileUrl: response.data.fileUrl };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}