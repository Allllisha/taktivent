# frozen_string_literal: true

class AddImageUrlsToPerformers < ActiveRecord::Migration[7.1]
  def change
    add_column :performers, :image_urls, :jsonb, default: [], null: false
  end
end
