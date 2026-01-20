// User types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

// Venue types
export interface Venue {
  id: number;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

// Performer types
export interface Performer {
  id: number;
  name: string;
  description: string | null;
  bio: string | null;
  images: string[];
  created_at: string;
  updated_at: string;
}

// Song types
export interface Song {
  id: number;
  name: string;
  composer_name: string;
  description: string | null;
  start_at: string;
  length_in_minute: number;
  enable_textbox: boolean;
  questions_and_choices: QuestionAndChoice[];
  images: string[];
  performers: Performer[];
  average_rating: number | null;
  reviews_count: number;
  created_at: string;
  updated_at: string;
}

// Event types
export interface Event {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  start_at: string;
  end_at: string;
  enable_textbox: boolean;
  questions_and_choices: QuestionAndChoice[];
  images: string[];
  venue: Venue;
  songs?: Song[];
  songs_count: number;
  reviews_count: number;
  average_rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface EventWithAnalytics extends Event {
  rating_distribution: Record<string, number>;
  sentiment_distribution: Record<string, number>;
  recent_reviews: EventReview[];
}

// Review types
export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface EventReview {
  id: number;
  rating: number | null;
  sentiment: Sentiment | null;
  comment: string | null;
  responses: Record<string, string>;
  reply: string | null;
  replied_at: string | null;
  created_at: string;
}

export interface SongReview {
  id: number;
  rating: number | null;
  sentiment: Sentiment | null;
  comment: string | null;
  responses: Record<string, string>;
  reply: string | null;
  replied_at: string | null;
  created_at: string;
}

// Question types
export type QuestionType = 'radio' | 'dropdown' | 'stars';

export interface QuestionAndChoice {
  question: string;
  question_type: QuestionType;
  choices: string[];
}

// API response types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    per_page: number;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

// Form types
export interface EventFormData {
  name: string;
  description: string;
  start_at: string;
  end_at: string;
  enable_textbox: boolean;
  questions_and_choices: QuestionAndChoice[];
  venue_attributes: {
    name: string;
    address: string;
  };
  image_urls?: string[];
}

export interface SongFormData {
  name: string;
  composer_name: string;
  description: string;
  start_at: string;
  length_in_minute: number;
  enable_textbox: boolean;
  questions_and_choices: QuestionAndChoice[];
  performer_ids: number[];
  image_urls?: string[];
}

export interface ReviewFormData {
  rating: number;
  sentiment: Sentiment;
  comment: string;
  responses: Record<string, string>;
}

export interface PerformerFormData {
  name: string;
  description: string;
  bio: string;
  image_urls?: string[];
}
