class Event < ApplicationRecord
  belongs_to :user
  belongs_to :venue

  validate :name, :start_at, :user, :venue, presence: true
end
