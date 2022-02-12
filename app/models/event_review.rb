class EventReview < ApplicationRecord
  belongs_to :event

  validates :rating, presence: true, numericality: { in: 0..5 }
end
