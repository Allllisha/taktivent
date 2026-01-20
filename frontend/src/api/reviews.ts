import apiClient from './client';
import type { ReviewFormData, ApiResponse, EventReview, SongReview } from '@/types';

export const reviewsApi = {
  createEventReview: async (eventId: number, data: ReviewFormData): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(`/events/${eventId}/reviews`, {
      review: data,
    });
    return response.data.data;
  },

  createSongReview: async (eventId: number, songId: number, data: ReviewFormData): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      `/events/${eventId}/songs/${songId}/reviews`,
      { review: data }
    );
    return response.data.data;
  },

  replyToEventReview: async (eventId: number, reviewId: number, reply: string): Promise<EventReview> => {
    const response = await apiClient.post<ApiResponse<EventReview>>(
      `/events/${eventId}/reviews/${reviewId}/reply`,
      { reply }
    );
    return response.data.data;
  },

  replyToSongReview: async (eventId: number, songId: number, reviewId: number, reply: string): Promise<SongReview> => {
    const response = await apiClient.post<ApiResponse<SongReview>>(
      `/events/${eventId}/songs/${songId}/reviews/${reviewId}/reply`,
      { reply }
    );
    return response.data.data;
  },
};

export default reviewsApi;
