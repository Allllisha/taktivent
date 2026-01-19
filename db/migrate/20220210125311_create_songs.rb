class CreateSongs < ActiveRecord::Migration[6.1]
  def change
    create_table :songs do |t|
      t.string :name, null: false
      t.string :composer_name, null: false
      t.datetime :start_at, null: false
      t.integer :length_in_minute, null: false
      t.text :description
      t.references :event, null: false, foreign_key: true

      t.timestamps
    end
  end
end
