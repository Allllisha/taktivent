class EventReview < ApplicationRecord
  belongs_to :event

  validates :sentiment, :rating, presence: true
  validates :rating, numericality: { in: 0..5 }

  enum sentiment: [ :Positive, :Neutral, :Negative ]
end
