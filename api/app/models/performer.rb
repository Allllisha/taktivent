# frozen_string_literal: true

class Performer < ApplicationRecord
  belongs_to :user
  has_many :song_performers, dependent: :destroy
  has_many :songs, -> { distinct }, through: :song_performers

  has_many_attached :images

  validates :name, presence: true
  validates :name, uniqueness: { scope: %i[description user_id] }
end
