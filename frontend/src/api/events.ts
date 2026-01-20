import apiClient from './client';
import type { Event, EventWithAnalytics, EventFormData, ApiResponse } from '@/types';

export interface DashboardStats {
  total_events: number;
  total_reviews: number;
  average_rating: number | null;
  rating_distribution: Record<string, number>;
  sentiment_distribution: Record<string, number>;
}

export const eventsApi = {
  getAll: async (): Promise<Event[]> => {
    const response = await apiClient.get<ApiResponse<Event[]>>('/events');
    return response.data.data;
  },

  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/events/stats');
    return response.data.data;
  },

  getById: async (id: number): Promise<Event> => {
    const response = await apiClient.get<ApiResponse<Event>>(`/events/${id}`);
    return response.data.data;
  },

  getDashboard: async (id: number): Promise<Event> => {
    const response = await apiClient.get<ApiResponse<Event>>(`/events/${id}/dashboard`);
    return response.data.data;
  },

  getAnalytics: async (id: number): Promise<EventWithAnalytics> => {
    const response = await apiClient.get<ApiResponse<EventWithAnalytics>>(`/events/${id}/analytics`);
    return response.data.data;
  },

  getQrCode: async (id: number): Promise<{ svg: string; url: string }> => {
    const response = await apiClient.get<ApiResponse<{ svg: string; url: string }>>(`/events/${id}/qr_code`);
    return response.data.data;
  },

  create: async (data: EventFormData): Promise<Event> => {
    const response = await apiClient.post<ApiResponse<Event>>('/events', { event: data });
    return response.data.data;
  },

  update: async (id: number, data: Partial<EventFormData>): Promise<Event> => {
    const response = await apiClient.put<ApiResponse<Event>>(`/events/${id}`, { event: data });
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/events/${id}`);
  },

  duplicate: async (id: number): Promise<Event> => {
    const response = await apiClient.post<ApiResponse<Event>>(`/events/${id}/duplicate`);
    return response.data.data;
  },
};

export default eventsApi;
