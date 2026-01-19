class VenuesController < ApplicationController

  def venue_params
    params.require(:venue).permit(:name, :address)
  end
end