class AddEnableTextboxToEvents < ActiveRecord::Migration[6.1]
  def change
    add_column :events, :enable_textbox, :boolean, default: false
  end
end
