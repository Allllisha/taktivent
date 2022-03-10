class ChangeSentimentNullTrueInReviews < ActiveRecord::Migration[6.1]
  def change
    change_column_null :event_reviews, :sentiment, true
    change_column_null :song_reviews, :sentiment, true
  end
end
