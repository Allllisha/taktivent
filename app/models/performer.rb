class Performer < ApplicationRecord
  has_many_attached :photos
  has_many :songs, -> { distinct }, through: :song_performers

  validate :name, presence: true
end
