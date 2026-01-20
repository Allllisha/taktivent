# frozen_string_literal: true

class AddReplyToReviews < ActiveRecord::Migration[7.1]
  def change
    add_column :event_reviews, :reply, :text
    add_column :event_reviews, :replied_at, :datetime
    add_column :song_reviews, :reply, :text
    add_column :song_reviews, :replied_at, :datetime
  end
end
