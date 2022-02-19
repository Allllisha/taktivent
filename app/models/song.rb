class Song < ApplicationRecord
  belongs_to :event
  has_many :song_reviews, dependent: :destroy
  has_many :performers, -> { distinct }, through: :song_performers

  has_many_attached :images

  validates :name, :composer_name, :start_at, :length_in_minute, presence: true
  validates :length_in_minute, numericality: { in: 1.. }
end
