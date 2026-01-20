# frozen_string_literal: true

class EventTemplateBlueprint < Blueprinter::Base
  identifier :id

  fields :name, :description, :template_data, :created_at, :updated_at
end
