import apiClient from './client';
import type { Song, SongFormData, ApiResponse } from '@/types';

export interface SongSearchResult extends Song {
  event_name?: string;
}

export const songsApi = {
  getAll: async (eventId: number): Promise<Song[]> => {
    const response = await apiClient.get<ApiResponse<Song[]>>(`/events/${eventId}/songs`);
    return response.data.data;
  },

  search: async (query?: string): Promise<SongSearchResult[]> => {
    const params = query ? { q: query } : {};
    const response = await apiClient.get<ApiResponse<SongSearchResult[]>>('/songs/search', { params });
    return response.data.data;
  },

  searchComposers: async (query?: string): Promise<string[]> => {
    const params = query ? { q: query } : {};
    const response = await apiClient.get<ApiResponse<string[]>>('/songs/composers', { params });
    return response.data.data;
  },

  getById: async (eventId: number, songId: number): Promise<Song> => {
    const response = await apiClient.get<ApiResponse<Song>>(`/events/${eventId}/songs/${songId}`);
    return response.data.data;
  },

  create: async (eventId: number, data: SongFormData): Promise<Song> => {
    const response = await apiClient.post<ApiResponse<Song>>(`/events/${eventId}/songs`, { song: data });
    return response.data.data;
  },

  update: async (eventId: number, songId: number, data: Partial<SongFormData>): Promise<Song> => {
    const response = await apiClient.put<ApiResponse<Song>>(`/events/${eventId}/songs/${songId}`, { song: data });
    return response.data.data;
  },

  delete: async (eventId: number, songId: number): Promise<void> => {
    await apiClient.delete(`/events/${eventId}/songs/${songId}`);
  },
};

export default songsApi;
