class SongReview < ApplicationRecord
  belongs_to :song

  enum sentiment: [ :Positive, :Neutral, :Negative ]
end
