# frozen_string_literal: true

class AddBioToPerformers < ActiveRecord::Migration[7.0]
  def change
    add_column :performers, :bio, :text
  end
end
