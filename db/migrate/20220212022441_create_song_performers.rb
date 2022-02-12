class CreateSongPerformers < ActiveRecord::Migration[6.1]
  def change
    create_table :song_performers do |t|
      t.references :song, null: false, foreign_key: true
      t.references :performer, null: false, foreign_key: true

      t.timestamps
    end
  end
end
