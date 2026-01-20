# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::V1::Songs', type: :request do
  let(:user) { create(:user) }
  let(:event) { create(:event, user: user) }
  let(:song) { create(:song, event: event) }

  describe 'GET /api/v1/events/:event_id/songs' do
    before { create_list(:song, 3, event: event) }

    it 'returns event songs' do
      get "/api/v1/events/#{event.id}/songs"
      expect(response).to have_http_status(:ok)
      expect(json_response.length).to eq(3)
    end
  end

  describe 'GET /api/v1/events/:event_id/songs/:id' do
    it 'returns the song' do
      get "/api/v1/events/#{event.id}/songs/#{song.id}"
      expect(response).to have_http_status(:ok)
      expect(json_response['name']).to eq(song.name)
    end
  end

  describe 'POST /api/v1/events/:event_id/songs' do
    let(:valid_params) do
      {
        song: {
          name: 'New Song',
          composer_name: 'Beethoven',
          description: 'A beautiful piece',
          start_at: event.start_at + 30.minutes,
          length_in_minute: 5
        }
      }
    end

    context 'when authenticated as event owner' do
      it 'creates a new song' do
        expect {
          post "/api/v1/events/#{event.id}/songs",
               params: valid_params,
               headers: auth_headers(user)
        }.to change(Song, :count).by(1)
      end

      it 'returns created status' do
        post "/api/v1/events/#{event.id}/songs",
             params: valid_params,
             headers: auth_headers(user)
        expect(response).to have_http_status(:created)
      end
    end

    context 'when not authenticated' do
      it 'returns unauthorized status' do
        post "/api/v1/events/#{event.id}/songs", params: valid_params
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'PUT /api/v1/events/:event_id/songs/:id' do
    context 'when event owner' do
      it 'updates the song' do
        put "/api/v1/events/#{event.id}/songs/#{song.id}",
            params: { song: { name: 'Updated Song' } },
            headers: auth_headers(user)
        expect(response).to have_http_status(:ok)
        expect(song.reload.name).to eq('Updated Song')
      end
    end
  end

  describe 'DELETE /api/v1/events/:event_id/songs/:id' do
    context 'when event owner' do
      it 'deletes the song' do
        song # create before expect block
        expect {
          delete "/api/v1/events/#{event.id}/songs/#{song.id}", headers: auth_headers(user)
        }.to change(Song, :count).by(-1)
      end
    end
  end
end
