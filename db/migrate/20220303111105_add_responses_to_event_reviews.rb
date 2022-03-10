class AddResponsesToEventReviews < ActiveRecord::Migration[6.1]
  def change
    add_column :event_reviews, :responses, :jsonb, null: false, default: '{}'
  end
end
