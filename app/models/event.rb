class Event < ApplicationRecord
  belongs_to :user
  belongs_to :venue
  has_many :event_reviews, dependent: :destroy
  has_many :songs, dependent: :destroy
  has_many_attached :images

  validate :name, :start_at, :user, :venue, presence: true
end
