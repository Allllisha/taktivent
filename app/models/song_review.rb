class SongReview < ApplicationRecord
  belongs_to :song

  validate :rating, presence: true, numericality: { in: 0..5 }
end
