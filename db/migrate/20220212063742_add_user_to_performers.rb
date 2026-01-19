class AddUserToPerformers < ActiveRecord::Migration[6.1]
  def change
    add_reference :performers, :user, null: false, foreign_key: true
  end
end
