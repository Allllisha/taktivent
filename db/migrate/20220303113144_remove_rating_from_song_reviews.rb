class RemoveRatingFromSongReviews < ActiveRecord::Migration[6.1]
  def change
    remove_column :song_reviews, :rating, :integer
  end
end
