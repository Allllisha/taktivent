# frozen_string_literal: true

class CreateEventCollaborators < ActiveRecord::Migration[7.1]
  def change
    create_table :event_collaborators do |t|
      t.references :event, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :role, null: false, default: 'editor' # 'editor' or 'viewer'

      t.timestamps
    end

    add_index :event_collaborators, [:event_id, :user_id], unique: true
  end
end
