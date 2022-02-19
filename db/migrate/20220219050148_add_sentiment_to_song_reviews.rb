class AddSentimentToSongReviews < ActiveRecord::Migration[6.1]
  def change
    add_column :song_reviews, :sentiment, :integer
  end
end
