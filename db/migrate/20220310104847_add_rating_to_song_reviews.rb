class AddRatingToSongReviews < ActiveRecord::Migration[6.1]
  def change
    add_column :song_reviews, :rating, :integer
  end
end
