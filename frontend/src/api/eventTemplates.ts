import apiClient from './client';
import type { ApiResponse } from '@/types';

export interface EventTemplate {
  id: number;
  name: string;
  description: string | null;
  template_data: {
    duration_minutes?: number;
    enable_textbox?: boolean;
    questions_and_choices?: Array<{
      question: string;
      question_type: string;
      choices: string[];
    }>;
    venue_name?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface EventTemplateFormData {
  name: string;
  description?: string;
  template_data: EventTemplate['template_data'];
}

export const eventTemplatesApi = {
  getAll: async (): Promise<EventTemplate[]> => {
    const response = await apiClient.get<ApiResponse<EventTemplate[]>>('/event_templates');
    return response.data.data;
  },

  getById: async (id: number): Promise<EventTemplate> => {
    const response = await apiClient.get<ApiResponse<EventTemplate>>(`/event_templates/${id}`);
    return response.data.data;
  },

  create: async (data: EventTemplateFormData): Promise<EventTemplate> => {
    const response = await apiClient.post<ApiResponse<EventTemplate>>('/event_templates', { event_template: data });
    return response.data.data;
  },

  update: async (id: number, data: Partial<EventTemplateFormData>): Promise<EventTemplate> => {
    const response = await apiClient.put<ApiResponse<EventTemplate>>(`/event_templates/${id}`, { event_template: data });
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/event_templates/${id}`);
  },
};

export default eventTemplatesApi;
