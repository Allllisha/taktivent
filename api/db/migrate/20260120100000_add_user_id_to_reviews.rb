# frozen_string_literal: true

class AddUserIdToReviews < ActiveRecord::Migration[7.1]
  def change
    # Add optional user_id to event_reviews for tracking attendance history
    add_reference :event_reviews, :user, null: true, foreign_key: true

    # Add optional user_id to song_reviews for tracking attendance history
    add_reference :song_reviews, :user, null: true, foreign_key: true
  end
end
