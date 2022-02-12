class CreateSongReviews < ActiveRecord::Migration[6.1]
  def change
    create_table :song_reviews do |t|
      t.float :rating, null: false
      t.text :comment
      t.references :song, null: false, foreign_key: true


      t.timestamps
    end
  end
end
