# frozen_string_literal: true

class EventBlueprint < Blueprinter::Base
  identifier :id

  fields :name, :description, :start_at, :end_at, :enable_textbox,
         :questions_and_choices, :user_id, :created_at, :updated_at

  field :songs_count do |event|
    event.songs.count
  end

  field :reviews_count do |event|
    event.event_reviews.count
  end

  field :average_rating do |event|
    event.average_rating
  end

  field :images do |event|
    event.image_urls || []
  end

  association :venue, blueprint: VenueBlueprint

  view :with_songs do
    association :songs, blueprint: SongBlueprint
  end

  view :with_analytics do
    field :rating_distribution do |event|
      event.rating_distribution
    end

    field :sentiment_distribution do |event|
      event.sentiment_distribution
    end

    association :event_reviews, blueprint: EventReviewBlueprint, name: :recent_reviews
  end
end
