# frozen_string_literal: true

class SongReview < ApplicationRecord
  belongs_to :song
  belongs_to :user, optional: true

  enum sentiment: { positive: 0, neutral: 1, negative: 2 }

  validates :rating, numericality: { in: 0..5, allow_nil: true }
end
