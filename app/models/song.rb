class Song < ApplicationRecord
  belongs_to :event
  has_many :song_reviews, dependent: :destroy
  has_many_attached :images

  validate :name, :composer_name, :start_at, :length_in_munute, presence: true
  validate :length_in_munute, numericality: { in: 1.. }
end
