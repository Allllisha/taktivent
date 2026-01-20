# frozen_string_literal: true

class EventReviewBlueprint < Blueprinter::Base
  identifier :id

  fields :rating, :sentiment, :comment, :responses, :reply, :replied_at, :created_at
end
