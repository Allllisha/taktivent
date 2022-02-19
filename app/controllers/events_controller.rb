class EventsController < ApplicationController
  def show
    @event = Event.find(params[:id])
    @songs = @event.songs
    authorize @event
  end

  def new
    @event = Event.new
    @venue = Venue.new
    authorize @event
    authorize @venue
  end

  def create
    @event = Event.new(event_params)
    @venue = Venue.new(venue_params)
    @event.user = current_user
    authorize @event
    authorize @venue
    @event.venue = @venue
    if @event.save && @venue.save
      redirect_to event_path(@event)
    else
      render :new
    end
  end

  def edit
    @event = Event.find(params[:id])
    @venue = Venue.find(params[:id])
    authorize @event
    authorize @venue
  end

  def update
    @event = Event.find(params[:id])
    @venue = Venue.find(params[:id])
    @event.update(event_params)
    @venue.update(venue_params)
    authorize @event
    authorize @venue
    redirect_to event_path
  end

  def preview
   @event = Event.find(params[:id])
   @songs = @event.songs
   authorize @event
  end

  def analytics
    @event = Event.find(params[:id])
    @songs = @event.songs
    authorize @event
  end

  def destroy
    @event = Event.find(params[:id])
    @event.destroy
    redirect_to event_path(@events)
  end

  private

  def event_params
    params.require(:event).permit(:user, :name, :description, :start_at, :end_at,  :images, :venue_id, :venue)
  end

  def venue_params
    params.require(:event).require(:venue).permit(:name, :address)
  end
end
