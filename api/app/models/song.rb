# frozen_string_literal: true

class Song < ApplicationRecord
  belongs_to :event
  has_many :song_performers, dependent: :destroy
  has_many :song_reviews, dependent: :destroy
  has_many :performers, -> { distinct }, through: :song_performers

  validates :name, :composer_name, :start_at, :length_in_minute, presence: true
  validates :length_in_minute, numericality: { greater_than_or_equal_to: 1 }

  def average_rating
    return nil if song_reviews.empty?

    song_reviews.average(:rating)&.round(1)
  end
end
