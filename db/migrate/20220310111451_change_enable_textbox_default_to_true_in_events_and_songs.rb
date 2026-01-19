class ChangeEnableTextboxDefaultToTrueInEventsAndSongs < ActiveRecord::Migration[6.1]
  def change
    change_column_default :events, :enable_textbox, from: false, to: true
    change_column_default :songs, :enable_textbox, from: false, to: true
  end
end
