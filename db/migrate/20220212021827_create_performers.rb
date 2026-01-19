class CreatePerformers < ActiveRecord::Migration[6.1]
  def change
    create_table :performers do |t|
      t.string :name, null: false
      t.text :description

      t.timestamps
    end
  end
end
