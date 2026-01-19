class CreateEventReviews < ActiveRecord::Migration[6.1]
  def change
    create_table :event_reviews do |t|
      t.float :rating, null: false
      t.text :comments
      t.references :event, null: false, foreign_key: true

      t.timestamps
    end
  end
end
