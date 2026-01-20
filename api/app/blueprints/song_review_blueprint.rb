# frozen_string_literal: true

class SongReviewBlueprint < Blueprinter::Base
  identifier :id

  fields :rating, :sentiment, :comment, :responses, :reply, :replied_at, :created_at
end
