class AddSentimentToEventReviews < ActiveRecord::Migration[6.1]
  def change
    add_column :event_reviews, :sentiment, :integer
  end
end
