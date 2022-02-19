class SongReview < ApplicationRecord
  belongs_to :song

  validates :sentiment, :rating, presence: true
  validates :rating, numericality: { in: 0..5 }

  enum sentiment: [ :positive, :neutral, :negative ]
end
