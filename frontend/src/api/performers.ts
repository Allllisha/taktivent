import apiClient from './client';
import type { Performer, ApiResponse } from '@/types';

export interface PerformerFormData {
  name: string;
  description?: string;
  bio?: string;
  image_urls?: string[];
}

export const performersApi = {
  getAll: async (): Promise<Performer[]> => {
    const response = await apiClient.get<ApiResponse<Performer[]>>('/performers');
    return response.data.data;
  },

  getById: async (id: number): Promise<Performer> => {
    const response = await apiClient.get<ApiResponse<Performer>>(`/performers/${id}`);
    return response.data.data;
  },

  create: async (data: PerformerFormData): Promise<Performer> => {
    const response = await apiClient.post<ApiResponse<Performer>>('/performers', { performer: data });
    return response.data.data;
  },

  update: async (id: number, data: Partial<PerformerFormData>): Promise<Performer> => {
    const response = await apiClient.put<ApiResponse<Performer>>(`/performers/${id}`, { performer: data });
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/performers/${id}`);
  },
};

export default performersApi;
