class Performer < ApplicationRecord
  belongs_to :user
  has_many_attached :images
  has_many :songs, -> { distinct }, through: :song_performers

  validates :name, presence: true
  validates :name, uniqueness: { scope: %i[description user_id] }
end
