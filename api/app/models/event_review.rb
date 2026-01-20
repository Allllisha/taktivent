# frozen_string_literal: true

class EventReview < ApplicationRecord
  belongs_to :event
  belongs_to :user, optional: true

  enum sentiment: { positive: 0, neutral: 1, negative: 2 }

  validates :rating, numericality: { in: 0..5, allow_nil: true }
end
