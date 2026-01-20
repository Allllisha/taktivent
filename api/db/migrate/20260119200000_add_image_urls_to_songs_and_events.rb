# frozen_string_literal: true

class AddImageUrlsToSongsAndEvents < ActiveRecord::Migration[7.1]
  def change
    add_column :songs, :image_urls, :jsonb, default: [], null: false
    add_column :events, :image_urls, :jsonb, default: [], null: false
  end
end
