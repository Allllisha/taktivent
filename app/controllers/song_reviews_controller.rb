class SongReviewsController < ApplicationController
  # skip authentication and authorization becuase event-goers are anonymous
  skip_before_action :authenticate_user!
  skip_after_action :verify_authorized

  def create
    @song_review = SongReview.new(song_review_params)
    @song = song.find(params[:song_id])
    @song_review.song = @song
    if @song_reviews.save
      redirect_to event_path(params[:event_id])
    else
      render plain: "error!", status: 404
    end
  end

  private

  def song_review_params
    params.require(:song_review).permit(:song_id, :rating, :comment)
  end
end
