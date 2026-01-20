# frozen_string_literal: true

module Api
  module V1
    class SongReviewsController < BaseController
      skip_before_action :authenticate_user!, only: [:create]
      before_action :set_song
      before_action :set_review, only: [:reply]
      before_action :authorize_reply, only: [:reply]

      def create
        review = @song.song_reviews.build(review_params)
        # Track user attendance if logged in (optional, reviews stay anonymous)
        review.user = current_user if user_signed_in?
        review.save!

        render json: {
          data: { message: "Thank you for your feedback!" }
        }, status: :created
      end

      def reply
        @review.update!(
          reply: params[:reply],
          replied_at: Time.current
        )

        render_success(SongReviewBlueprint.render_as_hash(@review))
      end

      private

      def set_song
        @event = Event.find(params[:event_id])
        @song = @event.songs.find(params[:song_id])
      end

      def set_review
        @review = @song.song_reviews.find(params[:id])
      end

      def authorize_reply
        unless @event.user_id == current_user.id
          render_error(code: "forbidden", message: "You are not authorized to reply to this review", status: :forbidden)
        end
      end

      def review_params
        params.require(:review).permit(:rating, :sentiment, :comment, responses: {})
      end
    end
  end
end
