import apiClient from './client';
import type { User, LoginCredentials, RegisterData, ApiResponse, AuthResponse } from '@/types';

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface PasswordUpdateData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface PasswordResetRequestData {
  email: string;
}

export interface PasswordResetData {
  reset_password_token: string;
  password: string;
  password_confirmation: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/sign_in', {
      user: credentials,
    });

    // Get token from response header
    const token = response.headers.authorization?.replace('Bearer ', '');
    if (token) {
      localStorage.setItem('token', token);
    }

    return response.data.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/sign_up', {
      user: data,
    });

    // Get token from response header
    const token = response.headers.authorization?.replace('Bearer ', '');
    if (token) {
      localStorage.setItem('token', token);
    }

    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.delete('/auth/sign_out');
    localStorage.removeItem('token');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  // Password reset
  requestPasswordReset: async (data: PasswordResetRequestData): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/auth/password', {
      user: data,
    });
    return response.data.data;
  },

  resetPassword: async (data: PasswordResetData): Promise<{ message: string }> => {
    const response = await apiClient.put<ApiResponse<{ message: string }>>('/auth/password', {
      user: data,
    });
    return response.data.data;
  },

  // Profile management
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/profile');
    return response.data.data;
  },

  updateProfile: async (data: ProfileUpdateData): Promise<AuthResponse> => {
    const response = await apiClient.put<ApiResponse<AuthResponse>>('/auth/profile', {
      user: data,
    });
    return response.data.data;
  },

  updatePassword: async (data: PasswordUpdateData): Promise<AuthResponse> => {
    const response = await apiClient.put<ApiResponse<AuthResponse>>('/auth/profile/password', {
      user: data,
    });

    // Get new token from response header
    const token = response.headers.authorization?.replace('Bearer ', '');
    if (token) {
      localStorage.setItem('token', token);
    }

    return response.data.data;
  },

  // Attended events
  getAttendedEvents: async () => {
    const response = await apiClient.get<ApiResponse<import('@/types').Event[]>>('/auth/profile/attended_events');
    return response.data.data;
  },
};

export default authApi;
