# frozen_string_literal: true

class Event < ApplicationRecord
  belongs_to :user
  belongs_to :venue
  has_many :event_reviews, dependent: :destroy
  has_many :songs, dependent: :destroy
  has_many :event_collaborators, dependent: :destroy
  has_many :collaborators, through: :event_collaborators, source: :user

  validates :name, :start_at, :end_at, :user, :venue, presence: true

  def can_edit?(user)
    return false unless user

    user_id == user.id || event_collaborators.exists?(user: user, role: 'editor')
  end

  def can_view_dashboard?(user)
    return false unless user

    user_id == user.id || event_collaborators.exists?(user: user)
  end

  def average_rating
    return nil if event_reviews.empty?

    event_reviews.average(:rating)&.round(1)
  end

  def rating_distribution
    event_reviews.group(:rating).count
  end

  def sentiment_distribution
    event_reviews.group(:sentiment).count
  end
end
