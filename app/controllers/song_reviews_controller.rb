class SongReviewsController < ApplicationController
  # skip authentication and authorization becuase event-goers are anonymous
  skip_before_action :authenticate_user!
  skip_after_action :verify_authorized

  def create
    @song_reviews = SongReview.new(song_review_params)
    @song = Song.find(params[:song_id])
    @song_reviews.song = @song
    @event = Event.find(params[:event_id])
    if @song_reviews.save
      redirect_to event_path(@event)
    else
      render plain: "error!", status: 404
    end
  end
  

  private

  def song_review_params
    params.require(:song_review).permit(:song_id, :rating, :comment)
  end
end
