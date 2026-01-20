# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::V1::Events', type: :request do
  let(:user) { create(:user) }
  let(:venue) { create(:venue) }
  let(:event) { create(:event, user: user, venue: venue) }

  describe 'GET /api/v1/events' do
    before { create_list(:event, 3, user: user) }

    context 'when authenticated' do
      it 'returns user events' do
        get '/api/v1/events', headers: auth_headers(user)
        expect(response).to have_http_status(:ok)
        expect(json_response.length).to eq(3)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized status' do
        get '/api/v1/events'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /api/v1/events/:id' do
    it 'returns the event (public access)' do
      get "/api/v1/events/#{event.id}"
      expect(response).to have_http_status(:ok)
      expect(json_response['name']).to eq(event.name)
    end
  end

  describe 'POST /api/v1/events' do
    let(:valid_params) do
      {
        event: {
          name: 'New Concert',
          description: 'A great concert',
          start_at: 1.day.from_now,
          end_at: 1.day.from_now + 2.hours,
          venue_id: venue.id
        }
      }
    end

    context 'when authenticated' do
      it 'creates a new event' do
        expect {
          post '/api/v1/events', params: valid_params, headers: auth_headers(user)
        }.to change(Event, :count).by(1)
      end

      it 'returns created status' do
        post '/api/v1/events', params: valid_params, headers: auth_headers(user)
        expect(response).to have_http_status(:created)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized status' do
        post '/api/v1/events', params: valid_params
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'PUT /api/v1/events/:id' do
    context 'when owner' do
      it 'updates the event' do
        put "/api/v1/events/#{event.id}",
            params: { event: { name: 'Updated Name' } },
            headers: auth_headers(user)
        expect(response).to have_http_status(:ok)
        expect(event.reload.name).to eq('Updated Name')
      end
    end

    context 'when not owner' do
      let(:other_user) { create(:user) }

      it 'returns forbidden status' do
        put "/api/v1/events/#{event.id}",
            params: { event: { name: 'Updated Name' } },
            headers: auth_headers(other_user)
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'DELETE /api/v1/events/:id' do
    context 'when owner' do
      it 'deletes the event' do
        event # create before expect block
        expect {
          delete "/api/v1/events/#{event.id}", headers: auth_headers(user)
        }.to change(Event, :count).by(-1)
      end
    end
  end

  describe 'GET /api/v1/events/:id/dashboard' do
    context 'when owner' do
      it 'returns dashboard data' do
        get "/api/v1/events/#{event.id}/dashboard", headers: auth_headers(user)
        expect(response).to have_http_status(:ok)
        expect(json_response).to have_key('event')
        expect(json_response).to have_key('songs')
      end
    end
  end

  describe 'GET /api/v1/events/:id/analytics' do
    before do
      create_list(:event_review, 5, event: event)
    end

    context 'when owner' do
      it 'returns analytics data' do
        get "/api/v1/events/#{event.id}/analytics", headers: auth_headers(user)
        expect(response).to have_http_status(:ok)
        expect(json_response).to have_key('average_rating')
        expect(json_response).to have_key('total_reviews')
        expect(json_response).to have_key('rating_distribution')
        expect(json_response).to have_key('sentiment_distribution')
      end
    end
  end
end
