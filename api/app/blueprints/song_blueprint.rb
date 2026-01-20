# frozen_string_literal: true

class SongBlueprint < Blueprinter::Base
  identifier :id

  fields :name, :composer_name, :description, :start_at, :length_in_minute,
         :enable_textbox, :questions_and_choices, :created_at, :updated_at

  field :average_rating do |song|
    song.average_rating
  end

  field :reviews_count do |song|
    song.song_reviews.count
  end

  field :images do |song|
    song.image_urls || []
  end

  association :performers, blueprint: PerformerBlueprint

  view :with_reviews do
    association :song_reviews, blueprint: SongReviewBlueprint
  end

  view :search do
    field :event_name do |song|
      song.event&.name
    end
  end
end
