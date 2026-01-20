# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::V1::Auth::Registrations', type: :request do
  describe 'POST /api/v1/auth/sign_up' do
    let(:valid_params) do
      {
        user: {
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          password: 'password123',
          password_confirmation: 'password123'
        }
      }
    end

    context 'with valid parameters' do
      it 'creates a new user' do
        expect {
          post '/api/v1/auth/sign_up', params: valid_params
        }.to change(User, :count).by(1)
      end

      it 'returns created status' do
        post '/api/v1/auth/sign_up', params: valid_params
        expect(response).to have_http_status(:created)
      end

      it 'returns the user data' do
        post '/api/v1/auth/sign_up', params: valid_params
        expect(json_response['email']).to eq('test@example.com')
      end

      it 'returns JWT token in header' do
        post '/api/v1/auth/sign_up', params: valid_params
        expect(response.headers['Authorization']).to be_present
      end
    end

    context 'with invalid parameters' do
      it 'does not create user with missing email' do
        expect {
          post '/api/v1/auth/sign_up', params: { user: valid_params[:user].except(:email) }
        }.not_to change(User, :count)
      end

      it 'returns unprocessable entity status' do
        post '/api/v1/auth/sign_up', params: { user: valid_params[:user].except(:email) }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
