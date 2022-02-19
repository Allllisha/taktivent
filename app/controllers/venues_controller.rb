class VenuesController < ApplicationController

  def new
    @venue = Venue.new
    authorize @Venue
  end

  def create
    @venue = Venue.new(venue_params)
    authorize @venue
    @event.venue = @venue
    if  @venue.save
      redirect_to event_path(@event)
    else
      render :new
    end
  end


  def venue_params
    params.require(:venue).permit(:name, :address)
  end
end
