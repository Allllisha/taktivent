class ChangeSentimentsNullInReviewsToFalse < ActiveRecord::Migration[6.1]
  def change
    change_column_null :event_reviews, :sentiment, false
    change_column_null :song_reviews, :sentiment, false
  end
end
