class EventReview < ApplicationRecord
  belongs_to :event

  enum sentiment: [ :Positive, :Neutral, :Negative ]
end
