class ReviewsController < ApplicationController
  skip_before_action :authenticate_user!
  skip_after_action :verify_authorized

  # the app goes into this action when event-goers submit the form at the end of event
  def create
    # saved all the inputs to corresponding song_id/event_id
    # redirect to events#show, with all the forms hidden
    
    # @song_reviews = SongReview.new(song_review_params)
    # @song = Song.find(params[:song_id])
    # @song_reviews.song = @song
    # @event_reviews = EventReview.new(event_review_params)
    # @event = Event.find(params[:event_id])
    # @event_reviews.event = @event
    # authorize @event_reviews
    # authorize @song_reviews
    # if @song_reviews.save && @event_reviews.save
    #   redirect_to event_path(@event)
    # else
    #   render plain: "error!", status: 404
    # end
  end

  def song_review_params
    params.require(:song_review).permit(:song_id, :rating, :comment)
  end

  def event_review_params
    params.require(:event_review).permit(:event_id, :rating, :comment)
  end
end
