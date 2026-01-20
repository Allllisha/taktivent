# frozen_string_literal: true

class PerformerBlueprint < Blueprinter::Base
  identifier :id

  fields :name, :description, :bio, :created_at, :updated_at

  field :images do |performer|
    performer.image_urls || []
  end
end
