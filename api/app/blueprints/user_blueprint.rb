# frozen_string_literal: true

class UserBlueprint < Blueprinter::Base
  identifier :id

  fields :email, :first_name, :last_name, :created_at

  view :with_events do
    association :events, blueprint: EventBlueprint
  end
end
