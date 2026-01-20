# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::V1::Auth::Sessions', type: :request do
  let(:user) { create(:user, email: 'test@example.com', password: 'password123') }

  describe 'POST /api/v1/auth/sign_in' do
    context 'with valid credentials' do
      it 'returns success status' do
        post '/api/v1/auth/sign_in', params: { user: { email: user.email, password: 'password123' } }
        expect(response).to have_http_status(:ok)
      end

      it 'returns the user data' do
        post '/api/v1/auth/sign_in', params: { user: { email: user.email, password: 'password123' } }
        expect(json_response['email']).to eq(user.email)
      end

      it 'returns JWT token in header' do
        post '/api/v1/auth/sign_in', params: { user: { email: user.email, password: 'password123' } }
        expect(response.headers['Authorization']).to be_present
      end
    end

    context 'with invalid credentials' do
      it 'returns unauthorized status' do
        post '/api/v1/auth/sign_in', params: { user: { email: user.email, password: 'wrongpassword' } }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'DELETE /api/v1/auth/sign_out' do
    context 'when authenticated' do
      it 'returns success status' do
        delete '/api/v1/auth/sign_out', headers: auth_headers(user)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized status' do
        delete '/api/v1/auth/sign_out'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /api/v1/auth/me' do
    context 'when authenticated' do
      it 'returns the current user' do
        get '/api/v1/auth/me', headers: auth_headers(user)
        expect(json_response['email']).to eq(user.email)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized status' do
        get '/api/v1/auth/me'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
