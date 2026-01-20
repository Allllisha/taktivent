import apiClient from './client';
import type { ApiResponse } from '@/types';

interface UploadResponse {
  url: string;
  public_id: string;
}

export const uploadsApi = {
  // Upload file through backend (recommended)
  upload: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<UploadResponse>>(
      '/uploads',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data.url;
  },
};

export default uploadsApi;
