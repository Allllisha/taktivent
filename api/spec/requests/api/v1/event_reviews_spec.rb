# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Api::V1::EventReviews', type: :request do
  let(:event) { create(:event) }

  describe 'POST /api/v1/events/:event_id/reviews' do
    let(:valid_params) do
      {
        event_review: {
          rating: 5,
          sentiment: 'positive',
          comment: 'Great event!'
        }
      }
    end

    it 'creates a new review (anonymous access)' do
      expect {
        post "/api/v1/events/#{event.id}/reviews", params: valid_params
      }.to change(EventReview, :count).by(1)
    end

    it 'returns created status' do
      post "/api/v1/events/#{event.id}/reviews", params: valid_params
      expect(response).to have_http_status(:created)
    end

    it 'returns the review data' do
      post "/api/v1/events/#{event.id}/reviews", params: valid_params
      expect(json_response['rating']).to eq(5)
      expect(json_response['sentiment']).to eq('positive')
    end
  end
end
