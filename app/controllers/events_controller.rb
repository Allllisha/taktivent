class EventsController < ApplicationController
  def show
    @event = Event.find(params[:id])
    @songs = @event.songs
    @event_reviews = @event.event_reviews
  end

  def new
    @event = Event.new
  end

  def create
    @event = Event.new(event_params)
    @event.save
    redirect_to event_path(@event)
  end

  def edit
    @event = Event.find(params[:id])
  end

  def update
    @event = Event.find(params[:id])
    @event.update(event_params)
    redirect_to event_path
  end

  def destroy
    @event = Event.find(params[:id])
    @event.destroy
    redirect_to event_path(@events)
  end

  def event_params
    params.require(:event).permit(:user, :name, :start_at, :venue, :images)
  end
end
