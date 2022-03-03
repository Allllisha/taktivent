class AddResponsesToSongReviews < ActiveRecord::Migration[6.1]
  def change
    add_column :song_reviews, :responses, :jsonb, null: false, default: '{}'
  end
end
