class EventsController < ApplicationController
  def show
    @event = Event.find(params[:id])
    @songs = @event.songs
    authorize @event
  end

  def new
    @event = Event.new
    authorize @event
  end

  def create
    @event = Event.new(event_params)
    @venue = Venue.find(params[:venue_id])
    @event.venue = @venue
    if @event.save
    redirect_to event_path(@event)
    else
    render "new"
    end
  end


  def edit
    @event = Event.find(params[:id])
  end


  def update
    @event = Event.find(params[:id])
    @event.update(event_params)
    redirect_to event_path
  end

  def preview
   @event = Event.find(params[:id])
   @songs = @event.songs
  end

  def analytics
    @event = Event.find(params[:id])
    @songs = @event.songs
  end

  def destroy
    @event = Event.find(params[:id])
    @event.destroy
    redirect_to event_path(@events)
  end

  def

  def event_params
    params.require(:event).permit(:user, :name, :start_at, :venue, :images)
  end
end
