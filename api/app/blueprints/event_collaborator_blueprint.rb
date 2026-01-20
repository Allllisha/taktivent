# frozen_string_literal: true

class EventCollaboratorBlueprint < Blueprinter::Base
  identifier :id

  fields :role, :created_at

  association :user, blueprint: UserBlueprint
end
