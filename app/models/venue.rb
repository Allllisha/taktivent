class Venue < ApplicationRecord
  has_many :events, optional: true

  validate :name, presence: true
  validates :name, uniqueness: { scope: :address }
end
