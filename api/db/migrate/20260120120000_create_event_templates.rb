# frozen_string_literal: true

class CreateEventTemplates < ActiveRecord::Migration[7.1]
  def change
    create_table :event_templates do |t|
      t.string :name, null: false
      t.text :description
      t.references :user, null: false, foreign_key: true
      t.jsonb :template_data, default: {}, null: false

      t.timestamps
    end
  end
end
