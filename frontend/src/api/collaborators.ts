import apiClient from './client';
import type { ApiResponse, User } from '@/types';

export interface Collaborator {
  id: number;
  role: 'editor' | 'viewer';
  user: User;
  created_at: string;
}

export const collaboratorsApi = {
  getAll: async (eventId: number): Promise<Collaborator[]> => {
    const response = await apiClient.get<ApiResponse<Collaborator[]>>(`/events/${eventId}/collaborators`);
    return response.data.data;
  },

  add: async (eventId: number, email: string, role: 'editor' | 'viewer' = 'editor'): Promise<Collaborator> => {
    const response = await apiClient.post<ApiResponse<Collaborator>>(`/events/${eventId}/collaborators`, {
      email,
      role,
    });
    return response.data.data;
  },

  updateRole: async (eventId: number, collaboratorId: number, role: 'editor' | 'viewer'): Promise<Collaborator> => {
    const response = await apiClient.put<ApiResponse<Collaborator>>(
      `/events/${eventId}/collaborators/${collaboratorId}`,
      { role }
    );
    return response.data.data;
  },

  remove: async (eventId: number, collaboratorId: number): Promise<void> => {
    await apiClient.delete(`/events/${eventId}/collaborators/${collaboratorId}`);
  },
};

export default collaboratorsApi;
