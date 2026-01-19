class AddEnableTextboxToSongs < ActiveRecord::Migration[6.1]
  def change
    add_column :songs, :enable_textbox, :boolean, default: false
  end
end
