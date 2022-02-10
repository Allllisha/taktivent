class EventReview < ApplicationRecord
  belongs_to :event

  validate :rating, presence: true, numericality: { in: 0..5 }
end
