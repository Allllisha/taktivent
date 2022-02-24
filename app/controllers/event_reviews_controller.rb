class EventReviewsController < ApplicationController
  # skip authentication and authorization becuase event-goers are anonymous
  skip_before_action :authenticate_user!
  skip_after_action :verify_authorized
   def new
     @event_reviews = EventReview.new
   end
  
   def create
      @event_reviews = EventReview.new(event_review_params)
      @event = Event.find(params[:event_id])
      @event_reviews.event = @event
      if @event_reviews.save
        redirect_to event_path(@event)
      else
        render plain: "error!", status: 404
      end
    end
  
    private
    def event_review_params
      params.require(:event_review).permit(:rating, :comment, :event_id)
    end
  end