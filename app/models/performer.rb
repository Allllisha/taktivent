class Performer < ApplicationRecord
  belong_to :user
  has_many_attached :photos
  has_many :songs, -> { distinct }, through: :song_performers

  validate :name, presence: true
end
