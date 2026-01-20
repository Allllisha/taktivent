# frozen_string_literal: true

class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  has_many :performers, dependent: :destroy
  has_many :events, dependent: :destroy
  has_many :event_templates, dependent: :destroy
  has_many :event_collaborators, dependent: :destroy
  has_many :collaborated_events, through: :event_collaborators, source: :event
  has_many :event_reviews, dependent: :nullify
  has_many :song_reviews, dependent: :nullify

  # Events the user has attended (reviewed)
  has_many :attended_events, -> { distinct }, through: :event_reviews, source: :event

  validates :first_name, :last_name, presence: true
end
