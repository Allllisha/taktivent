# frozen_string_literal: true

module Api
  module V1
    class VenuesController < BaseController
      skip_before_action :authenticate_user!, only: [:index, :show]

      def index
        venues = Venue.all.order(:name)
        render_success(VenueBlueprint.render_as_hash(venues))
      end

      def show
        venue = Venue.find(params[:id])
        render_success(VenueBlueprint.render_as_hash(venue))
      end

      def create
        venue = Venue.find_or_create_by!(venue_params)
        render_success(VenueBlueprint.render_as_hash(venue), status: :created)
      end

      private

      def venue_params
        params.require(:venue).permit(:name, :address, :latitude, :longitude)
      end
    end
  end
end
