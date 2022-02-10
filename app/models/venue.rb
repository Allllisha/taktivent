class Venue < ApplicationRecord
  has_many :events

  validate :name, presence: true
  validates :name, uniqueness: { scope: :address }
end
