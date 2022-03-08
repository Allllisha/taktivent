class Event < ApplicationRecord
  belongs_to :user
  belongs_to :venue
  has_many :event_reviews, dependent: :destroy
  has_many :songs
  has_many_attached :images

  validates :name, :start_at, :end_at, :user, :venue, presence: true
end
