class AddQuestionsAndChoicesToSongs < ActiveRecord::Migration[6.1]
  def change
    add_column :songs, :questions_and_choices, :jsonb, null: false, default: '{}'
  end
end
