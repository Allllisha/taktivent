class Event < ApplicationRecord
  belongs_to :user
  belongs_to :venue

  has_many_attached :images

  validate :name, :start_at, :user, :venue, presence: true
end
