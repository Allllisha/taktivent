class Venue < ApplicationRecord
  has_many :events

  validates :name, presence: true
  validates :name, uniqueness: { scope: :address }
  geocoded_by :address
  after_validation :geocode, if: :will_save_change_to_address?
end
