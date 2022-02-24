class Venue < ApplicationRecord
  has_many :events

  validates :name, presence: true
  validates :name, uniqueness: { scope: :address }
end
