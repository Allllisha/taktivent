# frozen_string_literal: true

class VenueBlueprint < Blueprinter::Base
  identifier :id

  fields :name, :address, :latitude, :longitude, :created_at, :updated_at
end
