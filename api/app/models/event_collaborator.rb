# frozen_string_literal: true

class EventCollaborator < ApplicationRecord
  belongs_to :event
  belongs_to :user

  validates :user_id, uniqueness: { scope: :event_id }
  validates :role, presence: true, inclusion: { in: %w[editor viewer] }

  enum :role, { editor: 'editor', viewer: 'viewer' }
end
