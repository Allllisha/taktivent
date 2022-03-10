class AddRatingToEventReviews < ActiveRecord::Migration[6.1]
  def change
    add_column :event_reviews, :rating, :integer
  end
end
