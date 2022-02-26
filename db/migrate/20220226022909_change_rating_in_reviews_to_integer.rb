class ChangeRatingInReviewsToInteger < ActiveRecord::Migration[6.1]
  def change
    change_column :event_reviews, :rating, :integer
    change_column :song_reviews, :rating, :integer
  end
end
