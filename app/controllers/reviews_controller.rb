class ReviewsController < ApplicationController
  skip_before_action :authenticate_user!
  skip_after_action :verify_authorized

  # the app goes into this action when event-goers submit the form at the end of event
  def create
    # saved all the inputs to corresponding song_id/event_id
    # redirect to events#show, with all the forms hidden
  end

  def song_review_params
    params.require(:song_preview).permit(:song_id, :rating, :comment)
  end

  def event_review_params
    params.require(:event_preview).permit(:event_id, :rating, :comment)
  end
end
