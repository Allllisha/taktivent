class RemoveRatingFromEventReviews < ActiveRecord::Migration[6.1]
  def change
    remove_column :event_reviews, :rating, :integer
  end
end
